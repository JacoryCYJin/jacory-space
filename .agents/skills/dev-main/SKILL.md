---
name: jacory-space-dev-main
description: Jacory Space default development workflow in the main worktree. Use when the user asks to 开干, 修, 改, 实现, continue on this branch, normal development, or any code-change task without explicitly asking for parallel worktree isolation. Work on the current checkout, validate locally, and commit/push/PR only when requested or clearly part of the task.
---

# jacory-space-dev-main

## 适用

有代码或「代码 + 文档」混合产物要落地，且未要求并行隔离时，默认使用本模式。不要自动开 linked worktree。

用户点名并行、fork chat、主目录已被别的 PR 占用时，改用 `jacory-space-dev-worktree`。

## 开工前

1. 运行 `git worktree list && git status && git branch --show-current`，看清当前分支与是否有未提交改动。
2. 不在 `main` 分支上直接 commit。在任务分支上工作；已在 feature/fix/chore/docs 分支则继续，否则创建合适任务分支或使用用户指定分支名。
3. 非平凡改动先对齐方案，再动代码。

## 执行

1. 在 main worktree 当前分支上编辑。
2. 当场做自包含验证：build、单测、lint、typecheck，或改动技术栈对应检查。
3. 需要 live 验证时，也在 main worktree 做：
   - 单例运行时默认只在主目录跑，避免另开支线抢端口。
   - 改后端/runtime 时按需重启服务；纯前端通常依赖 HMR。
   - 探针前侦察端口；若用户已在监督栈，不自行启停，先问或只读侦察。
4. 验证通过后再提交。用户说「提交 / 开 PR」或任务收尾明确要求时，执行 `git add`、commit、`git push -u origin HEAD`，再按项目 Git 规则创建 PR。
5. 汇报改了什么、测了什么、已知限制、待 live 项。

## docs-only 子情形

只动 Markdown 且已在开发节奏里时，可以在当前分支 commit 并走 docs-only PR。研讨阶段积累的 overview 改动如果仍在研讨模式，不主动提交；用户说「提交」后再走本模式。

## 禁止

- 禁止 `git stash drop`、`git reset --hard`、force push，除非用户明确说。
- 禁止未经用户点名自动开 linked worktree。
- 禁止验证未做就 commit。

## PR 合入后

用户说「可以合」时，按项目 Git 规则合并；合完切回 `main` 或用户指定长期分支，并拉最新。
