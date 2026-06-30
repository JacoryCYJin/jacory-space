---
name: jacory-space-dev-main
description: >-
  Jacory Space 默认开发模式：在当前 checkout 的分支上改代码、自验、
  live 验证（如需要），验证通过后再 commit/push/PR。
  Use when the user says 开干、修、改、实现、继续在这个分支、正常开发，
  or any code-change task.
---

# jacory-space-dev-main

## 适用

有代码或「代码 + 文档」混合产物要落地 → **默认本模式**。始终在当前 checkout 工作。

## 开工前

1. `git status && git branch --show-current`——看清当前分支与是否有未提交改动
2. 不在 `main` 分支上直接 commit——在任务分支上工作；已在 `feature/`、`fix/`、`chore/`、`docs/` 分支则继续，否则创建合适任务分支或使用用户指定名
3. 非平凡改动：先用简短方案对齐准备改什么、保留什么、不会动什么，再动代码

## 执行

1. **在当前 checkout** 当前分支上编辑
2. **自包含验证**（当场跑）：
   - 前端改动：`cd jacory-space-frontend && npm run build`
   - 后端改动：`cd jacory-space-backend/video-backend && node --check server.js`
   - 脚本改动：`bash -n scripts/dev.sh`，并至少运行 `bash scripts/dev.sh ls`
   - Skill / Markdown 改动：运行 skill frontmatter 校验或检查渲染格式；若只改说明文本，不强行跑前后端 build
3. **live 验证**（需要时，也在当前 checkout）：
   - 启动服务前先运行 `bash scripts/dev.sh status`，避免抢占用户手动启动的端口
   - 前端默认端口 `3001`，后端默认端口 `5001`，前端 `/api` 代理到 `http://localhost:5001`
   - 改后端/runtime 时按需重启服务；纯前端通常依赖 HMR
   - 若用户已启动服务，不自行启停，先问或只读侦察
4. **验证通过后再提交**——用户说「提交 / 开 PR」或任务收尾明确要求时：
   - `git add` → 一行中文 Conventional Commit：`<type>: 中文描述`
   - `git push -u origin HEAD` → `gh pr create --base main`（base 按用户指定，如 stacked PR）
5. 汇报：改了什么、测了什么、已知限制、待 live 项

## docs-only 子情形

只动 `.md`（overview 回写、正典、方案）且已在开发节奏里：在当前分支 commit → docs-only PR。不要自动合并 PR。

研讨阶段攒的 overview 改动：若还在研讨模式，仍遵循 `@jacory-space-discuss` 不主动提交；用户说「提交」后走本条。

## 禁止

- `git stash drop` / `git reset --hard` / force push（除非用户明确说）
- 切换到其他工作目录处理本任务，除非用户明确要求
- 验证未做就 commit（「验证再提交」）

## PR 合入后

- 用户明确说「现在合并 / 可以合」→ `gh pr merge --squash --delete-branch`
- 合完 `git checkout main`（或用户指定长期分支），拉最新
