# AGENTS.md

Jacory Space 是个人网站项目。所有 Agent 在本仓库工作时优先遵循本文件，再结合 `.agents/skills/`、`.cursor/rules/` 和 `.cursor/skills/`。

## Context

- 项目包含 Vue 前端和 FastAPI 媒体解析后端。
- `jacory-space-frontend/`: Vite + Vue 3 + Tailwind CSS 前端，页面在 `src/views/`，路由在 `src/router/`。
- `jacory-space-backend/media-backend/`: FastAPI 后端，负责视频/播客等媒体解析、下载、Cookie 设置和下载目录设置，默认端口 `5001`。
- `scripts/dev.sh`: 本地开发服务脚本，可启动、停止、列出和查看前后端服务状态。
- `.agents/skills/`: Codex 项目 skill。默认开发用 `dev-main`；Git 操作前用 `git-rule`；前端视觉/UI 改动用 `frontend-rule` 和 `personal-operating-system-visual-style`。
- `.cursor/rules/`: Cursor 项目规则，例如 Git 规范和前端图标规范。
- `.cursor/skills/`: Cursor 项目工作流 skill，默认开发用 `jacory-space-dev-main`。
- 前端默认端口 `3001`，后端默认端口 `5001`。
- 前端 `/api` 请求代理到后端 `http://localhost:5001`。
- 后端视频解析依赖 `yt-dlp`，下载合并建议安装 `ffmpeg`。

## Rules

### Collaboration

- 需求描述存在多种合理解释时，尤其是对象关系、范围边界、目标方向、执行顺序、保留/删除对象不明确时，不要自行脑补执行；必须先用一句话复述具体理解并向用户确认，例如“我理解你要改的是 A 和 B 的关系，而不是 C 和 D，对吗？”，得到确认后再改。
- 用户说“不一样”“不对”“不是这个意思”时，以用户判断为准；不要用 DOM、截图、变量、测量结果反驳用户。下一步任务是找出为什么不一样，而不是证明当前实现没错。
- 用户指出“不是这个意思”后，必须立刻回到用户原话重新定位对象关系，不要继续沿用上一轮错误理解。
- 用户提出问题、修改意见或优化需求后，不要立刻修改代码；先用简短明确的方案说明准备改什么、保留什么、不会动什么，等用户确认修改方向后再执行。
- 当 Agent 给出方案后，用户回复 `1` 表示确认，可以按该方案执行。
- 不要把修复过程扩大成别的任务。用户要求处理一个具体问题时，不要顺手改无关结构、规则文件、配置、流程或其他非目标内容；如果确实需要扩展范围，必须先说明原因并征得用户确认。

### Frontend

- 前端图标规范见 `.agents/skills/frontend-rule/SKILL.md` 和 `.cursor/rules/frontend-rule.mdc`。
- UI 图标不要使用 emoji，使用 SVG 组件或 icon 库。
- 任何 UI、布局、页面、组件、样式、动画或 theme-token 工作，都必须遵循 Personal Operating System visual style；如果 skill 系统可用，在进行视觉改动前必须使用 `personal-operating-system-visual-style` skill。

### Python Runtime

- 本仓库所有 Python 相关命令、依赖安装、脚本运行和验证，都默认优先使用对应项目内的 `.venv`，不要使用 Anaconda `(base)` 或系统 Python。
- `media-backend` 使用 `jacory-space-backend/media-backend/.venv`；安装依赖时使用 `.venv/bin/python -m pip install -r requirements.txt`，运行验证时使用 `.venv/bin/python ...`。
- 如果新增或处理其他 Python 子项目，先确认或创建该子项目自己的 `.venv`，再安装依赖和运行脚本。
- `scripts/dev.sh` 启动 `media-backend` 时调用 `.venv/bin/python run_dev.py --daemon`；如果依赖导入异常，先检查并安装到对应 `.venv`。

### Git

- 分支、commit 和 PR 规范见 `.agents/skills/git-rule/SKILL.md` 和 `.cursor/rules/git-rule.mdc`。
- 如 skill 系统可用，任何 `git status`、建分支、commit、push、PR 或 merge 操作前必须使用 `git-rule` skill。
- 不在 `main` 上直接提交代码改动；先建任务分支。
- 分支前缀使用 `feature/`、`fix/`、`chore/` 或 `docs/`；不要用缩写 `feat/` 作为分支前缀。
- Commit message 必须使用一行中文 Conventional Commit：`<type>: 中文描述`，例如 `feat: 微调首页 Hero 与选中文本样式`。
- `pr` / `pr open` 表示提交、push、创建 PR 并返回链接，不合并；`pr合` / `pr merge` 表示提交、push、创建 PR、squash merge、切回 `main` 并 `git pull origin main`。
- 用户明确要求合并 PR 时，默认使用 GitHub squash merge，保持 `main` 线性历史，并保留 GitHub 自动生成的 squash commit 标题格式：`<type>: 中文描述 (#PR号)`；除非用户明确要求，不使用普通 merge commit。

## Do Not

### Scope

- 除非用户明确要求，不要把界面重新设计成偏离 Personal Operating System visual style 的风格。

### Files

- 不要提交本地运行时数据、下载文件、个人文档或环境文件。
- `jacory-space-backend/media-backend/data/users/`、`jacory-space-backend/media-backend/downloads/`、`.dev/` 属于本地运行数据，不应进入提交。

### Runtime And PRs

- 用户可能已经手动启动了服务；启动新服务前先检查 `bash scripts/dev.sh status`，避免抢端口。
- 不要自动合并 PR。只有用户明确要求合并时才执行 merge。

## Verification

### Checks

- 前端改动后运行 `npm run build`。
- 后端改动后运行 `python3 -m compileall app`。
- 脚本改动后运行 `bash -n scripts/dev.sh`，并至少验证 `bash scripts/dev.sh ls`。
- 修改后检查 IDE diagnostics / linter；不要提交已知报错。
- 提交前执行 `git status`，确认没有把本地运行时数据、下载文件、个人文档或环境文件加入提交。

### Commands

- 常用开发命令：

```bash
# 启动全部服务
bash scripts/dev.sh

# 启动单个服务
bash scripts/dev.sh media-backend
bash scripts/dev.sh jacory-space-frontend

# 查看和停止服务
bash scripts/dev.sh ls
bash scripts/dev.sh status
bash scripts/dev.sh stop media-backend
```

前端也可单独运行：

```bash
cd jacory-space-frontend
npm run dev
npm run build
```

后端也可单独运行：

```bash
cd jacory-space-backend/media-backend
npm run dev
```
