---
name: jacory-space-discuss
description: Jacory Space discussion, research, and read-only exploration workflow. Use when the user asks to 研讨, 梳理, 调研, 先看看, 走查, 登记发现, 探针走查, or when the task is exploration or documentation notes without code to land. Do not commit, push, or open PRs until the user explicitly says 提交.
---

# jacory-space-discuss

## 适用

用于梳理 overview、主题研究、架构取舍、问题全景、探针走查攒发现等任务。

判别规则：这次只是读、整理、探查，没有要合并的代码产物时用本模式。有代码要落地时，切到 `jacory-space-dev-main`；用户点名并行时切到 `jacory-space-dev-worktree`。

## 在哪改

- 直接在当前分支文件上改。
- 不开 linked worktree。
- 不主动开 PR。
- 产物通常是 `docs/overview/`、调研/方案笔记、`docs/agent/` 草稿。

## 提交节奏

- 绝不主动 commit。
- 绝不主动 push 或开 PR。
- 一直攒改动，直到用户明确说「提交」。
- 用户说提交后，再按当次指示决定分支名、commit 粒度和是否 docs PR。

## 探针 / live

- live stack 默认由用户起，Agent 不自行启停，避免和用户手动起的单例运行时冲突。
- Agent 只做端口侦察、CDP 驱动、读 DOM、查服务或数据库等只读/低风险探查。
- 汇报时对齐 UI 显示、落库状态和 Agent 自述。

## 顺手登记

发现 bug 或技术债时，登记到对应 `docs/overview/<主题>-issues-overview.md` 的待办表和执行日志。登记不等于修复。

## 切到开发

用户说「开干 / 修 XX / 可以提交了」时，切到 `jacory-space-dev-main`；用户明确要求并行或 worktree 时，切到 `jacory-space-dev-worktree`。
