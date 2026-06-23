# AGENTS.md

Jacory Space 是个人网站项目，包含 Vue 前端和 Node/Express 视频解析后端。所有 Agent 在本仓库工作时优先遵循本文件，再结合 `.cursor/rules/` 和 `.cursor/skills/`。

## Project Structure

- `jacory-space-frontend/`: Vite + Vue 3 + Tailwind CSS 前端，页面在 `src/views/`，路由在 `src/router/`。
- `video-backend/`: Express 后端，负责视频解析、下载、Cookie 设置和下载目录设置，默认端口 `5001`。
- `scripts/dev.sh`: 本地开发服务脚本，可启动、停止、列出和查看前后端服务状态。
- `.cursor/rules/`: Cursor 项目规则，例如 Git 规范和前端图标规范。
- `.cursor/skills/`: 项目工作流 skill，默认开发用 `jacory-space-dev-main`。

## Common Agent Rules

- 需求描述存在多种合理解释时，尤其是“这个间距”“上面/下面一样”“像截图一样”这类视觉空间关系，不要自行脑补执行；必须先用一句话复述具体对象关系并向用户确认，或明确说出当前假设后再改。
- 用户指出“不是这个意思”后，必须立刻回到用户原话重新定位对象关系，不要继续沿用上一轮错误理解。
- 视觉/UI 改动完成后，不能只以 build 通过作为完成依据；需要结合用户描述检查实际结构原因，并用 DOM 尺寸测量、computed style 或用户指定的验证方式确认结果。不要把截图本身当作已验证；如果无法确认最终效果，必须明确说明验证缺口。

## Development Commands

```bash
# 启动全部服务
bash scripts/dev.sh

# 启动单个服务
bash scripts/dev.sh video-backend
bash scripts/dev.sh jacory-space-frontend

# 查看和停止服务
bash scripts/dev.sh ls
bash scripts/dev.sh status
bash scripts/dev.sh stop video-backend
```

前端也可单独运行：

```bash
cd jacory-space-frontend
npm run dev
npm run build
```

后端也可单独运行：

```bash
cd video-backend
npm run dev
```

## Validation

- 前端改动后运行 `npm run build`。
- 后端改动后运行 `node --check server.js`。
- 脚本改动后运行 `bash -n scripts/dev.sh`，并至少验证 `bash scripts/dev.sh ls`。
- 修改后检查 IDE diagnostics / linter；不要提交已知报错。

## Git Workflow

- 分支、commit 和 PR 规范见 `.cursor/rules/git-rule.mdc`。
- 如 skill 系统可用，任何 `git status`、建分支、commit、push、PR 或 merge 操作前必须使用 `git-rule` skill。
- 不在 `main` 上直接提交代码改动；先建任务分支。
- 分支前缀使用 `feature/`、`fix/`、`chore/` 或 `docs/`；不要用缩写 `feat/` 作为分支前缀。
- Commit message 必须使用一行中文 Conventional Commit：`<type>: 中文描述`，例如 `feat: 微调首页 Hero 与选中文本样式`。
- 提交前执行 `git status`，不要把本地运行时数据、下载文件、个人文档提交进去。
- `video-backend/data/users/`、`video-backend/downloads/`、`.dev/` 属于本地运行数据，不应进入提交。

## Frontend Rules

- 前端图标规范见 `.cursor/rules/frontend-rule.mdc`。
- UI 图标不要使用 emoji，使用 SVG 组件或 icon 库。
- 任何 UI、布局、页面、组件、样式、动画或 theme-token 工作，都必须遵循 Personal Operating System visual style。
- 如果 skill 系统可用，在进行视觉改动前必须使用 `personal-operating-system-visual-style` skill。
- 除非用户明确要求，不要把界面重新设计成偏离该视觉系统的风格。

## Local Runtime Notes

- 前端默认端口 `3001`，后端默认端口 `5001`。
- 前端 `/api` 请求代理到后端 `http://localhost:5001`。
- 后端视频解析依赖 `yt-dlp`，下载合并建议安装 `ffmpeg`。
- 用户可能已经手动启动了服务；启动新服务前先检查 `bash scripts/dev.sh status`，避免抢端口。
