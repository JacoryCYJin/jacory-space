---
title: "Prompt 框架调研：把任务规格交给模型"
description: "Prompt 是本次任务规格，用来把目标、输入、约束、输出和评估标准传给模型。主流做法已从「写一句提示词」变成「结构化 prompt + 上下文组织 + 输出约束 + eval 迭代」。"
date: "2026.06.18"
category: "research"
index: "005"
readTime: "7 MIN"
修改时间: 2026-06-18
---
## 结论
Prompt 是本次任务规格，用来把目标、输入、约束、输出和评估标准传给模型。
主流做法已经从“写一句提示词”变成“结构化 prompt + 上下文组织 + 输出约束 + eval 迭代”。
Prompt 不应该承担长期规则、专项流程、工具权限和运行时隔离。

## 主流架构
### Prompt 来源

| 层级                                      | 放什么               | 作用                 |
| --------------------------------------- | ----------------- | ------------------ |
| System / Developer / System Instruction | 应用级指令、角色、长期运行约束   | 定义模型在当前应用或任务中的行为边界 |
| User                                    | 本次任务、输入、问题、用户要求   | 定义当前要完成什么          |
| Assistant                               | 历史回复、工具调用结果、已生成内容 | 形成会话上下文            |
| Tool / Retrieved Context                | 工具结果、检索资料、外部数据    | 提供任务材料，不应混成指令      |
### 通用骨架

```md
## Identity
你在本任务中是什么。
## Task
本次要完成什么。
## Instructions
- 必须遵守什么
- 不确定时怎么处理
## Context
- 输入材料
- 背景信息
- 可用资料
## Output
- 输出结构
- 字段要求
- 格式要求
- 稳定结构化输出需要 schema、Structured Outputs 或外部校验
## Examples
- 必要时给正例或反例
```
### Eval 闭环
Prompt 修改应该用样例集验证，不要只靠单次手感判断。
基本闭环是：

```text
定义任务 -> 写 prompt -> 准备测试样例 -> 运行 eval -> 分析失败 -> 修改 prompt -> 回归
```

## 关键判断
### 设计要点
- Prompt 要结构化，Markdown / XML 标签都可以。
- 指令、上下文、例子、输入数据要分区。
- 长上下文要标明来源、边界和查询目标。
- 复杂任务可以拆步骤，但不要把固定专项流程塞进 prompt。
- few-shot 适合稳定格式、语气、分类和边界。
- 生产 prompt 应该版本化、测试化、可回归。
### 不该放进 Prompt

| 不该放什么 | 应该放哪里 |
| --- | --- |
| 长期项目约束 | Rule |
| 专项任务流程 | Skill |
| 工具权限、安全边界 | Harness |
| 固定自动化步骤 | Workflow |
| 资料存储、检索、裁剪策略 | RAG / Retrieval |
| 输出结构强校验 | Schema / Validator |
### 常见失败模式

| 失败模式 | 表现 |
| --- | --- |
| Instruction Mixing | 指令、资料、用户输入混在一起 |
| Untrusted Input Injection | 用户输入、网页内容、检索结果被当成指令执行 |
| Context Overload | 上下文太长，重点不清 |
| Format Fragility | 只靠自然语言要求格式，输出不稳定 |
| Example Drift | few-shot 例子和真实任务不一致 |
| Eval Gap | 没有样例集，无法判断修改是否变好 |

## 来源
- OpenAI：Prompt engineering：https://developers.openai.com/api/docs/guides/prompt-engineering
- OpenAI：Structured Outputs：https://developers.openai.com/api/docs/guides/structured-outputs
- OpenAI：Evals：https://developers.openai.com/api/docs/guides/evals
- Anthropic：Prompt engineering overview：https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview
- Anthropic：Prompting best practices：https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Google Cloud：Introduction to prompting：https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/prompts/introduction-prompt-design
- The Prompt Report, 2024：https://arxiv.org/abs/2406.06608
- Promptfoo：https://www.promptfoo.dev/docs/intro/
