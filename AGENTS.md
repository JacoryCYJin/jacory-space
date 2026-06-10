# AGENTS.md

Jacory Space —— 个人网站（Vue3 前端 + Node 视频解析后端），单人开发（JacoryCYJin）。

## 项目结构

| 目录 | 说明 |
| ------ | ------ |
| `jacory-space-frontend/` | Vite + Vue 3 + Tailwind CSS + GSAP/Lenis，页面在 `src/views/`，路由在 `src/router/` |
| `video-backend/` | Express 服务，封装 yt-dlp 做视频解析/下载，监听 5001 |
| `.cursor/skills/` | 工作流 skill：`jacory-space-discuss` / `jacory-space-dev-main`（默认）/ `jacory-space-dev-worktree` |
| `.cursor/rule/git-rule.md` | 分支与 commit 规范 |

## 常用命令

```bash
# 前端（http://localhost:3001，/api 代理到 5001）
cd jacory-space-frontend && npm run dev
npm run build   # 生产构建，可作为前端改动的自验手段

# 后端（http://localhost:5001，依赖 yt-dlp、ffmpeg）
cd video-backend && npm run dev
```

- 用户经常已在终端跑着 `npm run dev`，动手前先看 terminals，**不要重复起服务抢端口**；前端改动靠 HMR 即可。
- 本仓库无单测/lint 脚本，前端自验以 `npm run build` + 页面实际表现为准。

## 工作流

- 默认开发模式见 `@jacory-space-dev-main`：任务分支上改 → 自验 → 用户说「提交」再 commit/push/PR。
- 纯研讨/调研见 `@jacory-space-discuss`：绝不主动 commit/push。
- 并行隔离须用户点名 `@jacory-space-dev-worktree` 或 `/fix-on-new-worktree`。

## Git 规范（详见 .cursor/rule/git-rule.md）

- 分支：`feature/` `fix/` `chore/` + 短横线英文描述，如 `fix/bilibili-parse-timeout`
- commit：一行，`feat: 中文描述` 或 `fix: 中文描述`
- 不在 `main` 上直接 commit；禁止 `git stash drop`、`git reset --hard`、force push（除非用户明确要求）

## GitHub 账号

本机有两个 gh 账号：个人 `JacoryCYJin`（本仓库用，由 `.envrc` + direnv 自动注入 `GH_TOKEN`）和工作 `CYJinnn`。在本仓库执行 `gh` 前，如遇权限错误先 `gh api user -q .login` 确认是 `JacoryCYJin`。

## 注意

- 仓库根目录可能存在与项目无关的个人文件（如 `.docx`），不要把它们加入 git 提交。
- 下载内容相关功能仅限合规用途，不要扩大平台绕过能力。
