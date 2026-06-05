---
name: jacory-space-dev-main
description: >-
  Jacory Space 默认开发模式：在 main worktree 当前 checkout 的分支上改代码、自验、
  live 验证（如需要），验证通过后再 commit/push/PR。
  Use when the user says 开干、修、改、实现、继续在这个分支、正常开发，
  or any code-change task without asking for parallel worktree isolation.
---

# jacory-space-dev-main

## 适用

有代码或「代码 + 文档」混合产物要落地，且**未**要求并行隔离 → **默认本模式**。不要自动开 linked worktree。

用户点名并行 / fork chat / 主目录已被别的 PR 占用 → 改读 `@jacory-space-dev-worktree`（须主动触发）。

## 开工前

1. `git worktree list && git status && git branch --show-current`——看清当前分支与是否有未提交改动
2. 不在 `main` 分支上直接 commit——在任务分支上工作（已在 feature 分支则继续；否则 `git checkout -b fix/<issue-id>-<slug>` 或用户指定名）
3. 非平凡改动：先方案对齐（`docs/agent/` 或 PR 描述），再动代码

## 执行

1. **在 main worktree** 当前分支上编辑
2. **自包含验证**（当场跑）：build / 单测 / lint / typecheck / `go test`（改动的包）
3. **live 验证**（需要时，也在 main worktree）：
   - 单例运行时（7070/9222、`~/.jacory-space/*.sock`、dev DB）全局只一套——**默认就在主目录跑**，别另开支线抢端口
   - 改 SKILL / Django runtime → 重启后端；纯前端 → HMR 通常够用
   - 探针前侦察端口；若用户已在监督栈，**不自行启停**，先问或只读侦察
4. **验证通过后再提交**——用户说「提交 / 开 PR」或任务收尾明确要求时：
   - `git add` → commit（Linux 风格 subject，见 `@linux-commit-discipline`）
   - `git push -u origin HEAD` → `gh pr create --base main`（base 按用户指定，如 stacked PR）
5. 汇报：改了什么、测了什么、已知限制、待 live 项

## docs-only 子情形

只动 `.md`（overview 回写、正典、方案）且已在开发节奏里：在当前分支 commit → docs-only PR。Agent 自编的纯 docs PR **CI 绿可自合**（改 `AGENTS.md` 协作铁律 / 删大段正典除外，先问用户）。

研讨阶段攒的 overview 改动：若还在研讨模式，仍遵循 `@jacory-space-discuss` 不主动提交；用户说「提交」后走本条。

## 禁止

- `git stash drop` / `git reset --hard` / force push（除非用户明确说）
- 未经用户点名自动 `wt.sh create` 开 linked worktree
- 验证未做就 commit（「验证再提交」）

## PR 合入后

- 用户说「可以合」→ `gh pr merge --squash --delete-branch`
- 合完 `git checkout main`（或用户指定长期分支），拉最新
