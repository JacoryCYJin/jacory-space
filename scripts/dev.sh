#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME_DIR="$ROOT/.dev"
PID_DIR="$RUNTIME_DIR/pids"
LOG_DIR="$RUNTIME_DIR/logs"

# name|directory|start command|port
SERVICES=(
  "video-backend|video-backend|npm run dev|5001"
  "jacory-space-frontend|jacory-space-frontend|npm run dev|3001"
)

usage() {
  cat <<'EOF'
Jacory Space 开发服务脚本

用法:
  bash scripts/dev.sh                 启动全部服务
  bash scripts/dev.sh <service>       启动单个服务
  bash scripts/dev.sh restart [service] 重启全部或单个服务
  bash scripts/dev.sh stop [service]  停止全部或单个服务
  bash scripts/dev.sh status          查看运行状态
  bash scripts/dev.sh ls              列出可用服务
  bash scripts/dev.sh list            列出可用服务（同 ls）

可用服务:
  video-backend
  jacory-space-frontend
EOF
}

ensure_runtime_dirs() {
  mkdir -p "$PID_DIR" "$LOG_DIR"
}

get_service_field() {
  local service="$1"
  local index="$2"
  local item name dir cmd port

  for item in "${SERVICES[@]}"; do
    IFS='|' read -r name dir cmd port <<< "$item"
    if [[ "$name" == "$service" ]]; then
      case "$index" in
        1) printf '%s' "$name" ;;
        2) printf '%s' "$dir" ;;
        3) printf '%s' "$cmd" ;;
        4) printf '%s' "$port" ;;
      esac
      return 0
    fi
  done

  return 1
}

service_exists() {
  local service="$1"
  get_service_field "$service" 1 >/dev/null 2>&1
}

list_services() {
  local item name dir cmd port
  printf '%-24s %-8s %s\n' "SERVICE" "PORT" "COMMAND"
  for item in "${SERVICES[@]}"; do
    IFS='|' read -r name dir cmd port <<< "$item"
    printf '%-24s %-8s %s\n' "$name" "$port" "$cmd"
  done
}

is_pid_running() {
  local pid="$1"
  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

port_in_use() {
  local port="$1"
  lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
}

pid_file_for() {
  local service="$1"
  printf '%s/%s.pid' "$PID_DIR" "$service"
}

log_file_for() {
  local service="$1"
  printf '%s/%s.log' "$LOG_DIR" "$service"
}

read_pid() {
  local service="$1"
  local pid_file
  pid_file="$(pid_file_for "$service")"
  if [[ -f "$pid_file" ]]; then
    cat "$pid_file"
  fi
}

start_service() {
  local service="$1"
  local dir cmd port workdir pid pid_file log_file

  if ! service_exists "$service"; then
    echo "未知服务: $service" >&2
    echo "可用服务: video-backend jacory-space-frontend" >&2
    exit 1
  fi

  dir="$(get_service_field "$service" 2)"
  cmd="$(get_service_field "$service" 3)"
  port="$(get_service_field "$service" 4)"
  workdir="$ROOT/$dir"
  pid_file="$(pid_file_for "$service")"
  log_file="$(log_file_for "$service")"

  if [[ ! -d "$workdir" ]]; then
    echo "目录不存在: $workdir" >&2
    exit 1
  fi

  pid="$(read_pid "$service" || true)"
  if is_pid_running "$pid"; then
    echo "[$service] 已在运行 (pid=$pid, port=$port)"
    return 0
  fi

  if port_in_use "$port"; then
    echo "[$service] 端口 $port 已被占用，请先执行: bash scripts/dev.sh stop $service" >&2
    exit 1
  fi

  if [[ ! -d "$workdir/node_modules" ]]; then
    echo "[$service] 未检测到 node_modules，正在安装依赖..."
    (cd "$workdir" && npm install)
  fi

  (
    cd "$workdir"
    nohup bash -lc "$cmd" >"$log_file" 2>&1 &
    echo $! >"$pid_file"
  )

  sleep 1
  pid="$(read_pid "$service")"
  if is_pid_running "$pid"; then
    echo "[$service] 已启动 (pid=$pid, port=$port, log=$log_file)"
  else
    echo "[$service] 启动失败，查看日志: $log_file" >&2
    exit 1
  fi
}

stop_service() {
  local service="$1"
  local pid pid_file

  if ! service_exists "$service"; then
    echo "未知服务: $service" >&2
    exit 1
  fi

  pid_file="$(pid_file_for "$service")"
  pid="$(read_pid "$service" || true)"

  if is_pid_running "$pid"; then
    kill "$pid" 2>/dev/null || true
    sleep 1
    if is_pid_running "$pid"; then
      kill -9 "$pid" 2>/dev/null || true
    fi
    echo "[$service] 已停止 (pid=$pid)"
  else
    echo "[$service] 未在运行"
  fi

  rm -f "$pid_file"
}

restart_service() {
  local service="$1"

  stop_service "$service"
  start_service "$service"
}

print_status() {
  local item name dir cmd port pid
  printf '%-24s %-8s %-8s %s\n' "SERVICE" "PORT" "PID" "STATUS"

  for item in "${SERVICES[@]}"; do
    IFS='|' read -r name dir cmd port <<< "$item"
    pid="$(read_pid "$name" || true)"
    if is_pid_running "$pid"; then
      printf '%-24s %-8s %-8s %s\n' "$name" "$port" "$pid" "running"
    elif port_in_use "$port"; then
      printf '%-24s %-8s %-8s %s\n' "$name" "$port" "-" "port busy"
    else
      printf '%-24s %-8s %-8s %s\n' "$name" "$port" "-" "stopped"
    fi
  done
}

main() {
  local action="${1:-start}"
  local target="${2:-}"

  ensure_runtime_dirs

  case "$action" in
    -h|--help|help)
      usage
      ;;
    list|ls)
      list_services
      ;;
    status)
      print_status
      ;;
    stop)
      if [[ -n "$target" ]]; then
        stop_service "$target"
      else
        for item in "${SERVICES[@]}"; do
          IFS='|' read -r name _ _ _ <<< "$item"
          stop_service "$name"
        done
      fi
      ;;
    restart)
      if [[ -n "$target" ]]; then
        restart_service "$target"
      else
        for item in "${SERVICES[@]}"; do
          IFS='|' read -r name _ _ _ <<< "$item"
          restart_service "$name"
        done
      fi
      ;;
    start)
      if [[ -n "$target" ]]; then
        start_service "$target"
      else
        for item in "${SERVICES[@]}"; do
          IFS='|' read -r name _ _ _ <<< "$item"
          start_service "$name"
        done
      fi
      ;;
    video-backend|jacory-space-frontend)
      start_service "$action"
      ;;
    *)
      echo "未知命令: $action" >&2
      usage
      exit 1
      ;;
  esac
}

main "$@"
