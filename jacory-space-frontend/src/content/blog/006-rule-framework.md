---
title: "Rule 框架调研：长期生效的行为约束"
description: "Rule 是长期生效的行为约束，用来告诉 Agent 持续遵守什么。成熟 Rule 架构的核心是分层：全局规则、项目规则、路径规则、本地私有规则、团队规则。"
date: "2026.06.18"
category: "RESEARCH"
index: "006"
readTime: "8 MIN"
修改时间: 2026-06-18
---
## 结论
Rule 是长期生效的行为约束，用来告诉 Agent 持续遵守什么规则。
它不是本轮任务，也不是安全边界。
成熟 Rule 架构的核心是分层：全局规则、项目规则、路径规则、本地私有规则、团队规则。
自然语言 Rule 只能影响模型行为倾向；真正的阻断、审批、隔离要放到 Harness 的权限系统里。

## 主流架构
### Rule 类型

| 类型           | 解决什么              | 代表                                                           |
| ------------ | ----------------- | ------------------------------------------------------------ |
| User Rule    | 用户级长期偏好           | Cursor User Rules、`~/.codex/AGENTS.md`、`~/.claude/CLAUDE.md` |
| Project Rule | 项目级约定，通常随项目版本管理   | `.cursor/rules/*.mdc`、`AGENTS.md`、`CLAUDE.md`                |
| Path Rule    | 某个目录、文件类型或模块的特殊约束 | nested `AGENTS.md`、`globs`、目录级 rules                         |
| Team Rule    | 团队或组织统一要求         | Cursor Team Rules、企业 managed settings                        |
| Manual Rule  | 只在用户点名时加载         | Cursor `@rule`、手动 mention                                    |
### 文件形态
Rule 是规则概念；`AGENTS.md`、`CLAUDE.md`、`.cursor/rules/*.mdc` 是承载 Rule 的不同文件形态。
文件形态决定 Rule 怎么被工具识别和加载；通用骨架决定 Rule 正文怎么写。

| 文件形态 | 含义 | 代表 | 和通用骨架的关系 |
| --- | --- | --- | --- |
| Structured Rule | 带 metadata，可按描述、路径、开关控制加载 | `.cursor/rules/*.mdc`、`.claude/rules/*.md` | 通用骨架完整可用，`Scope`、`Trigger` 可对应 metadata |
| Plain Instruction File | 无 metadata，按文件位置和目录层级加载 | `AGENTS.md`、`CLAUDE.md` | 可弱化 `Trigger`，重点写 `Context`、`Rules`、`Do Not`、`Verification` |
### 触发机制

| 机制 | 含义 | Cursor | Claude Code | Codex |
| --- | --- | --- | --- | --- |
| Always Apply | 始终进入上下文 | `alwaysApply: true` | `CLAUDE.md`、无 `paths` 的 `.claude/rules/*.md` | instruction chain 中的 `AGENTS.md` |
| Description Match | Agent 根据描述判断是否加载 | `description` | 不作为 `CLAUDE.md` / `.claude/rules/` 的主要机制，更接近 Skill 触发方式 | 不作为 `AGENTS.md` 的主要机制 |
| Path Match | 按目录、文件类型或路径加载 | `globs` | `.claude/rules/*.md` 的 `paths` | nested `AGENTS.md`、`AGENTS.override.md` |
| Manual Mention | 用户手动点名加载 | `@rule` | 手动要求读取某文件或使用某能力 | 本轮 prompt 明确要求遵守某文件 |
| Location Load | 按约定文件名、位置或目录层级加载 | `AGENTS.md` | `CLAUDE.md` | `AGENTS.md` |
### 执行策略
Codex `.rules`、hooks、sandbox、allow / deny policy 属于执行策略，用来控制审批、权限和隔离。
它们可以和 Rule 配合，但不属于自然语言 Rule 主体。
### 通用骨架
通用 Rule 骨架先说明适用范围和触发方式，再写稳定背景、行为规则、禁止事项和验证方式。它可以覆盖 Cursor、Claude Code、Codex 这类不同工具的规则文件。

```md
## Scope
- 这条 Rule 适用于什么范围
- 全局 / 项目 / 目录 / 文件类型 / 团队
## Trigger
- 始终加载 / 按描述匹配 / 按路径匹配 / 手动点名 / 按位置加载
- 如果有路径范围，写清楚目录、文件类型或 glob
## Context
- 稳定背景
- 项目结构
- 关键约定
- 常用命令
## Rules
- 必须遵守的行为规则
- 修改、查找、生成、验证时的要求
## Do Not
- 明确禁止事项
- 不能修改的内容
- 不能执行的操作
## Verification
- 完成后需要检查什么
- 无法验证时怎么说明
```
`Structured Rule` 和 `Plain Instruction File` 是外壳，`Scope / Trigger / Context / Rules / Do Not / Verification` 是正文结构。简单规则可以删减，路径规则可以加 metadata，团队规则可以加管理和优先级说明。
### Plain Instruction File 骨架
Plain Instruction File 没有 metadata，主要靠文件名、目录位置和层级顺序加载。正文可以弱化 `Scope` 和 `Trigger`，重点写稳定背景、长期规则、禁止事项和验证方式。

```md
## Context
- 项目或工作区是什么
- 重要目录或文件在哪里
- 稳定约定是什么
## Rules
- 必须长期遵守的规则
- 修改、查找、生成内容时的要求
## Do Not
- 明确禁止事项
- 不能随意修改或执行的内容
## Verification
- 修改后需要怎么检查
- 无法验证时怎么说明
```

## 关键判断
### 不该写进 Rule
- 一次性任务目标。
- 长篇背景资料。
- 复杂流程教程。
- 大量 lint / formatter 配置复述。
- 可由工具强制执行的安全策略。
### 常见失败模式

| 问题 | 表现 |
| --- | --- |
| Context Bloat | 把所有背景都塞进规则，导致上下文污染 |
| Conflicting Instructions | 多层规则互相冲突 |
| Skill Leakage | 把专项流程写进 Rule，而不是 Skill |
| Security Illusion | 用自然语言“禁止”代替权限控制 |
| Stale Rule | 命令、路径、流程过期 |

## 来源
- OpenAI Codex：Custom instructions with AGENTS.md：https://developers.openai.com/codex/guides/agents-md
- OpenAI Codex：Rules：https://developers.openai.com/codex/rules
- Claude Code：How Claude remembers your project：https://code.claude.com/docs/en/memory
- Cursor Rules：https://cursor.com/docs/rules.md
- Configuration Smells in AGENTS.md Files, 2026：https://arxiv.org/abs/2606.15828
