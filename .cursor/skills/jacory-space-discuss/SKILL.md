---
name: jacory-space-discuss
description: >-
  Jacory Space 研讨/调研模式：梳理 overview、问题全景、主题研究、探针走查攒发现。
  在当前分支直接改文件，绝不主动 commit/push/PR，直到用户明确说「提交」。
  Use when the user says 研讨、梳理、调研、先看看、走查、登记发现、探针走查，
  or the task is read-only exploration with doc updates but no code to land yet.
---

# jacory-space-discuss

## 适用

- 梳理 `docs/overview/*-issues-overview.md`
- 主题研究、架构取舍、问题全景
- 只读探查、探针走查攒发现（尚无代码要落地）

**判别**：这次只是「读 + 整理 + 探查」，没有要合并的代码产物 → 本 skill。有代码要落地 → `@jacory-space-dev-main`（默认）。

## 在哪改

- **直接在当前分支的文件上改**——不开 PR、不 fork chat
- 产物：`docs/overview/`、调研/方案笔记、`docs/agent/` 草稿（执行级方案全文仍等开发模式再定稿提交）

## 提交节奏（硬）

- **绝不主动 commit**
- **绝不主动 push / 开 PR**
- 一直攒改动，**直到用户明确说「提交」**——怎么落（分支名、commit 粒度、是否 docs PR）按用户当次指示

## 探针 / live

- **栈默认由用户起**——Agent **不自行启停 live stack**，避免和用户手动起的单例运行时冲突
- 启动或检查服务前先运行 `bash scripts/dev.sh status` 或 `bash scripts/dev.sh ls`
- 当前项目的 live 目标是 Vue 前端 `3001`、Express 后端 `5001`、前端 `/api` 代理到 `http://localhost:5001`
- Agent 只做：端口侦察、读 DOM、检查 Express API 响应、查看本地配置或日志等只读/低风险探查
- 三层对齐：**UI 显示 == API/服务状态 == Agent 自述**

## 顺手登记

发现 bug / 技术债：登记到对应 `docs/overview/<主题>-issues-overview.md`（待办表 + 执行日志各一行）。登记 ≠ 修复。

## 切到开发

用户说「开干 / 修 XX / 可以提交了」→ 切 `@jacory-space-dev-main`（默认）。
