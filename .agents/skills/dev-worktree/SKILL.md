---
name: jacory-space-dev-worktree
description: Jacory Space parallel linked-worktree development workflow. Use only when the user explicitly asks for worktree, 并行, 另开一个, fork chat, 开支线, or when the main worktree is occupied by another checkout and must not be touched. Create or reuse an isolated worktree, self-validate there, push/PR, and leave live regression for the main worktree when the user asks.
---

# jacory-space-dev-worktree

## 适用

仅在用户主动触发时使用。默认开发走 `jacory-space-dev-main`，不要自动进入本模式。

适用场景：

- 多个 Agent 或任务并行，需要避免污染主目录 working tree。
- 主目录已 checkout 到别的 PR 分支做 live，本任务需要隔离。
- 用户要求 fork 新 chat、另开支线、使用 worktree。

## 开 worktree

```bash
bash scripts/wt.sh create fix/<issue-id>-<slug>
bash scripts/wt.sh create docs/<topic> --no-install
```

- 落点：`~/worktrees/jacory-space/<分支>`。
- 已存在时：用 `bash scripts/wt.sh path <分支>` 取路径，进入已有目录继续，不重复 create。
- 之后所有编辑与 Shell 工作目录指向该 worktree。

## 支线内执行

1. 方案、代码和自包含验证都在 linked worktree 内完成。
2. 禁止在 linked worktree 起 live stack、dev daemon、Electron、探针或连接 dev DB；单例运行时只在 main worktree。
3. 验证通过后执行 `git push -u origin HEAD`，再按项目规则创建 PR。
4. 不自行把 main worktree checkout 到该分支。

## live 回归

1. 用户发话「看完了 / 验证 / 切主目录验」后，再让 main worktree checkout PR 分支，必要时先移除同名 linked worktree。
2. 在 main worktree 跑 live：探针、dev 服务、UI 驱动、查落库等。
3. 汇报后 main worktree 继续停在 PR 分支，除非用户说「可以合了 / 切回 main」。

## 合入与清理

- 用户说「可以合」时，按项目 Git 规则合并。
- 只清理本 chat 创建且已合并的 worktree；动手前运行 `git worktree list` 确认。

## 分支命名

- 代码：`fix/<issue-id>-<slug>` 或符合项目规则的 `feature/`、`fix/`、`chore/`。
- 文档：`docs/<topic>`。

## docs vs code

只动 Markdown 可用 `--no-install`；含代码则默认安装依赖并验证。文档改动不要塞进代码 worktree 分支，保持 PR diff 干净。
