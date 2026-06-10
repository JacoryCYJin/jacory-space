# Jacory Space 并行 worktree 修复

**先读 skill `@jacory-space-dev-worktree`**——本命令仅作快捷入口；worktree 须用户主动触发，默认开发走 `@jacory-space-dev-main`。

## 任务

$ARGUMENTS

若上面为空，先向用户确认：要修什么、期望分支名；没有 issue ID 时，用简短 slug 即可，例如 `fix/navbar-link`、`feat/color-palette`、`docs/agent-skills`。

## 硬约束

见 `@jacory-space-dev-worktree`：支线写代码 + 自验；**禁止**在 linked worktree 起 live stack；**禁止** `git stash drop` / `git reset --hard` / force push；live 等用户切 main worktree 到 PR 分支后再做。

## 快速开工

```bash
bash scripts/wt.sh create fix/<slug>   # 修复
bash scripts/wt.sh create feat/<slug>  # 功能
bash scripts/wt.sh create docs/<topic> --no-install  # 纯 .md
```

之后所有编辑与 Shell 的 `working_directory` 指向 `bash scripts/wt.sh path <分支>` 输出的路径。
