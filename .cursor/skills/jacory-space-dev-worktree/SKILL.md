---
name: jacory-space-dev-worktree
description: >-
  Jacory Space 并行 worktree 开发：开 linked worktree 隔离写代码，支线自验后 push/PR，
  live 回归等用户把 main worktree checkout 到 PR 分支后再做。
  Use ONLY when the user explicitly asks for worktree、并行、另开一个、fork chat、
  开支线, or main worktree is occupied by another checkout and must not be touched.
disable-model-invocation: true
---

# jacory-space-dev-worktree

> **须用户主动触发**（`@jacory-space-dev-worktree` 或明确口令）。默认开发走 `@jacory-space-dev-main`，不要自动进本模式。

## 适用

- 多个 Agent / 任务并行，避免污染主目录 working tree
- 主目录已被 checkout 到别的 PR 分支做 live，本任务需隔离
- 用户要求 fork 新 chat + 开支线

## 开 worktree

```bash
# 代码（默认装依赖，便于支线自验）
bash scripts/wt.sh create fix/<issue-id>-<slug>

# 纯 .md（overview / 方案），不装依赖
bash scripts/wt.sh create docs/<topic> --no-install
```

- 落点：`~/worktrees/jacory-space/<分支>`
- 已存在：`bash scripts/wt.sh path <分支>` 取路径，**进入已有目录继续**，勿重复 create
- 之后所有编辑与 Shell 的 `working_directory` 指向该 worktree

## 支线内执行

1. 方案 md + 改代码 + **自包含验证**（build / 单测 / lint / typecheck / go test）
2. **禁止在 linked worktree 起 live stack**（dev / Electron / daemon / 探针 / 连 dev DB）——单例运行时只在 main worktree
3. 验证通过 → `git push -u origin HEAD` → `gh pr create --base main`（base 按用户指定）
4. **不要**自行把 main worktree checkout 到该分支

## live 回归（用户触发）

1. 用户发话「看完了 / 验证 / 切主目录验」→ 用户在 **main worktree** checkout PR 分支（会先 remove 同名 linked worktree——一个分支不能两处 checkout）
2. 在 main worktree 跑 live：探针 / dev / chat 驱动 / 查 dev DB
3. 汇报后 **main worktree 继续停在 PR 分支**——不自行 `git checkout main`，除非用户说「可以合了 / 切回 main」

## 合入与清理

- 用户说「可以合」→ squash merge → main worktree 切回 main + `bash scripts/wt.sh remove <分支>`
- 只清**本 chat 建的、已合并的** worktree；动手前 `git worktree list` 确认

## 分支命名

- 代码：`fix/<issue-id>-<slug>`（例 `fix/tabdoc-td-10-initial-vh-editor-type`）
- 文档：`docs/<topic>`

## docs vs code

| 改动 | create | PR |
| ------ | -------- | ----- |
| 只动 `.md` | `--no-install` | docs-only，CI 绿可自合（改铁律除外） |
| 含代码 | 默认 install | 等 review |

文档改动**不要**塞进代码 worktree 分支——独立 docs PR，PR diff 才干净。
