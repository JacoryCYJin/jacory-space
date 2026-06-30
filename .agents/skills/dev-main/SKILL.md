---
name: dev-main
description: Jacory Space default development workflow in the current checkout. Use when the user asks to 开干, 修, 改, 实现, continue on this branch, normal development, or any code-change task. Work on the current checkout, validate locally, and commit/push/PR only when requested or clearly part of the task.
---

# dev-main

## 适用

有代码或「代码 + 文档」混合产物要落地时，默认使用本模式。始终在当前 checkout 工作。

## 开工前

1. 运行 `git status && git branch --show-current`，看清当前分支与是否有未提交改动。
2. 不在 `main` 分支上直接 commit。在任务分支上工作；已在 `feature/`、`fix/`、`chore/`、`docs/` 分支则继续，否则创建合适任务分支或使用用户指定分支名。
3. 非平凡改动先对齐方案，再动代码。

## 执行

1. 在当前 checkout 的当前分支上编辑。
2. 当场做自包含验证：
   - 前端改动：`cd jacory-space-frontend && npm run build`
   - 后端改动：`cd jacory-space-backend/video-backend && node --check server.js`
   - 脚本改动：`bash -n scripts/dev.sh`，并至少运行 `bash scripts/dev.sh ls`
   - Skill / Markdown 改动：运行 skill frontmatter 校验或检查渲染格式；若只改说明文本，不强行跑前后端 build
3. 需要 live 验证时，也在当前 checkout 做：
   - 启动服务前先运行 `bash scripts/dev.sh status`，避免抢占用户手动启动的端口。
   - 前端默认端口 `3001`，后端默认端口 `5001`，前端 `/api` 代理到 `http://localhost:5001`。
   - 改后端/runtime 时按需重启服务；纯前端通常依赖 HMR。
   - 若用户已启动服务，不自行启停，先问或只读侦察。
4. 验证通过后再提交。用户说「提交 / 开 PR」或任务收尾明确要求时，执行 `git add`、commit、`git push -u origin HEAD`，再按项目 Git 规则创建 PR。
5. 汇报改了什么、测了什么、已知限制、待 live 项。

## docs-only 子情形

只动 Markdown 且已在开发节奏里时，可以在当前分支 commit 并走 docs-only PR。研讨阶段积累的 overview 改动如果仍在研讨模式，不主动提交；用户说「提交」后再走本模式。不要自动合并 PR。

## 禁止

- 禁止 `git stash drop`、`git reset --hard`、force push，除非用户明确说。
- 禁止切换到其他工作目录处理本任务，除非用户明确要求。
- 禁止验证未做就 commit。

## PR 合入后

用户说「可以合」时，按项目 Git 规则合并；合完切回 `main` 或用户指定长期分支，并拉最新。
