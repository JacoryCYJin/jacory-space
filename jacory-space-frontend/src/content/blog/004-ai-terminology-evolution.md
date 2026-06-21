---
title: "AI 名词演化调研：从一句 prompt 到一个 agent 系统"
description: "梳理 AI 使用方式从「写一句 prompt」到「搭一个 agent 系统」的名词变化，重点看每个名词解决什么问题，以及它和相邻概念的区别。"
date: "2026.06.18"
category: "RESEARCH"
index: "004"
readTime: "6 MIN"
修改时间: 2026-06-18
---
## 调研目标
梳理 AI 使用方式从“写一句 prompt”到“搭一个 agent 系统”的名词变化。
重点看每个名词解决什么问题，以及它和相邻概念的区别。

## 核心名词
| 名词       | 调研文件             | 一句话定义                      | 解决的问题                          |
| -------- | ---------------- | -------------------------- | ------------------------------ |
| prompt   | [[Prompt 框架调研]]  | 给模型的本次任务输入                 | 用自然语言指定任务，不必训练模型               |
| rule     | [[Rule 框架调研]]    | 持续生效的行为约束                  | 不用每次重复说明模型该怎么做                 |
| context  |                  | 模型当前能看到的信息环境               | 让模型基于当前材料回答，而不是只靠参数记忆          |
| memory   |                  | 跨会话保留下来的信息                 | 让模型不必每次从零开始认识用户、项目和偏好          |
| tool     |                  | 模型能调用的外部能力                 | 让模型能搜索、读文件、跑代码、查数据库、操作浏览器      |
| workflow |                  | 固定或半固定的任务流程                | 把多步 AI 调用和工具调用串起来，减少每次临时发挥     |
| skill    | [[Skill 框架调研]]   | 可复用的专项能力包                  | 把某类任务的做法、资料、脚本封装起来，需要时再加载      |
| agent    |                  | 能规划、调用工具、执行任务的 AI          | 从人一步步指挥，变成模型自己拆任务、选工具、执行和反馈    |
| harness  | [[Harness 框架调研]] | 把模型、工具、上下文、权限、执行环境包起来的运行外壳 | 提供上下文选择、工具权限、沙箱、状态管理、执行记录和人工审批 |
| MCP      |                  | 工具和数据源接入标准                 | 把 GitHub、Slack、数据库、浏览器等接入方式标准化 |
| subagent |                  | 分工执行的子 Agent               | 避免一个 Agent 处理所有事，把任务按角色拆分      |

## 关键关系
### Prompt / Rule / Skill
Prompt、Rule、Skill 不是线性替代关系，不是 `Prompt -> Rule -> Skill`。
它们会同时存在，只是作用层不同：

| 概念 | 作用 | 什么时候生效 |
| --- | --- | --- |
| Prompt | 本次任务规格 | 用户每次提出任务时 |
| Rule | 长期行为约束 | 按位置、层级、路径或配置持续加载 |
| Skill | 某类任务的专项流程 | 任务匹配 skill 描述后按需加载 |
实际运行时通常是叠加关系：

```text
Rule 提供长期边界；
Skill 提供专项流程；
Prompt 给出当前目标。
```
例如用户说“帮我调研 AGENTS.md 怎么写”，这句话是 Prompt；根目录 `AGENTS.md` 里的长期写作和编辑要求是 Rule；`global-research` 这种调研流程是 Skill。
### 相邻概念
| 对比 | 区别 |
| --- | --- |
| prompt / rule | prompt 是本次任务；rule 是长期约束 |
| rule / context | rule 告诉模型怎么做；context 告诉模型基于什么信息做 |
| context / memory | context 是当前看到的内容；memory 是未来还能再次加载的内容 |
| memory / tool | memory 解决“知道什么”；tool 解决“能做什么” |
| tool / workflow | tool 是单个外部能力；workflow 是多个步骤和工具的执行顺序 |
| workflow / skill | workflow 更像流程；skill 更像可复用能力模块 |
| skill / agent | skill 是能力包；agent 是会选择和使用能力包的执行者 |
| agent / harness | agent 是执行者；harness 是让 agent 稳定运行的外部系统 |
| tool / MCP | tool 是能力本身；MCP 是连接工具和数据源的协议 |
| agent / subagent | agent 可以独立执行；subagent 是被主 Agent 或 orchestrator 调度的专门执行者 |
### 整体方向
这条线本质上是 AI 从“文本问答”走向“可运行系统”的过程：

```text
prompt 解决“本次要做什么”；
rule 解决“长期必须遵守什么”；
context / memory 解决“模型知道什么”；
tool / workflow / skill 解决“模型怎么做事”；
agent / subagent 解决“谁来规划和执行”；
harness / MCP 解决“如何把这些能力稳定接到真实系统里”。
```

## 来源
- OpenAI Codex：AGENTS.md：https://developers.openai.com/codex/guides/agents-md
- OpenAI Codex：Agent Skills：https://developers.openai.com/codex/skills
- OpenAI Codex：Rules：https://developers.openai.com/codex/rules
- Anthropic：Model Context Protocol：https://www.anthropic.com/news/model-context-protocol
- Claude Code：Extend Claude with skills：https://code.claude.com/docs/en/skills
- Claude Code：How Claude remembers your project：https://code.claude.com/docs/en/memory
- Cursor Rules：https://cursor.com/docs/rules.md
