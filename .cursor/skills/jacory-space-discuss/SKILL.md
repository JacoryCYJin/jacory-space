---
name: jacory-space-discuss
description: >-
  Jacory Space 研讨/调研模式：梳理 overview、问题全景、主题研究、探针走查攒发现。
  在当前分支直接改文件，绝不主动 commit/push/PR，直到用户明确说「提交」。
  Use when the user says 研讨、梳理、调研、先看看、走查、登记发现、探针走查，
  or the task is read-only exploration with doc updates but no code to land yet.
---

# discuss

## 适用

用于梳理 overview、主题研究、架构取舍、问题全景、只读探查、探针走查攒发现等任务。

判别规则：这次只是读、整理、探查，没有要合并的代码产物时用本模式。有代码要落地时，切到 `dev-main`。

## 在哪改

- 直接在当前分支文件上改。
- 始终在当前 checkout 工作。
- 不主动开 PR。
- 产物通常是 `docs/overview/`、调研/方案笔记、`docs/agent/` 草稿。

## 提交节奏

- 绝不主动 commit。
- 绝不主动 push 或开 PR。
- 一直攒改动，直到用户明确说「提交」。
- 用户说提交后，再按当次指示决定分支名、commit 粒度和是否 docs PR。

## 探针 / live

- live stack 默认由用户起，Agent 不自行启停，避免和用户手动起的单例运行时冲突。
- 启动或检查服务前先运行 `bash scripts/dev.sh status` 或 `bash scripts/dev.sh ls`。
- 当前项目的 live 目标是 Vue 前端 `3001`、Express 后端 `5001`、前端 `/api` 代理到 `http://localhost:5001`。
- Agent 只做端口侦察、读 DOM、检查 Express API 响应、查看本地配置或日志等只读/低风险探查。
- 汇报时对齐 UI 显示、API/服务状态和 Agent 自述。

## 顺手登记

发现 bug 或技术债时，登记到对应 `docs/overview/<主题>-issues-overview.md` 的待办表和执行日志。登记不等于修复。

## 切到开发

用户说「开干 / 修 XX / 可以提交了」时，切到 `dev-main`。
