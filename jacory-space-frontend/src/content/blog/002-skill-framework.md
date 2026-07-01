---
title: "Skill 框架调研：按需加载的专项能力包"
description: "Skill 是按需加载的专项能力包，用来封装某类任务的做法、资料、脚本和模板。它和 Rule 的区别是：Rule 是长期约束，Skill 是任务触发后才加载的执行说明，最关键的设计点是 description。"
date: "2026.06.17"
category: "research"
index: "002"
readTime: "6 MIN"
修改时间: 2026-06-17
---
## 结论
Skill 是按需加载的专项能力包，用来封装某类任务的做法、资料、脚本和模板。
它和 [[Rule 框架调研|Rule]] 的区别是：Rule 是长期约束，Skill 是某类任务触发后才加载的执行说明。
最关键的设计点是 `description`。AI 先读 `name` 和 `description`，再决定是否加载完整 `SKILL.md`。
`description` 写得太窄会不触发，写得太宽会误触发。

## 主流架构
### 标准目录
```text
skill-name/
  SKILL.md
  references/
  scripts/
  assets/
```
`SKILL.md` 是必需文件；`references/`、`scripts/`、`assets/` 是可选目录，只有确实需要时才建。
### SKILL.md 最小结构
```md
---
name: skill-name
description: 这个 skill 做什么，什么时候应该使用，什么时候不要使用。
---
## Workflow
写 AI 触发这个 skill 后应该怎么做。
## Rules
写必须遵守的规则、边界和禁止事项。
## Resources
如果有 `references/`、`scripts/`、`assets/`，说明什么时候读取、运行或使用。
没有这些目录就不要写这一节。
```
正文没有固定标题。`Workflow`、`Rules`、`Resources` 是常见组织方式；也可以按任务换成 `Inputs`、`Output`、`Validation` 等。
`Goal`、`Steps`、`Inputs`、`Output`、`References / Scripts` 只是常见写法，不是强制结构。
### 触发和加载机制
| 层 | 什么时候加载 | 放什么 |
| --- | --- | --- |
| Metadata | 始终可见 | `name`、`description`，用于判断是否触发 |
| `SKILL.md` | Skill 触发后加载 | 核心流程、输入、输出、规则 |
| Bundled resources | 需要时加载或执行 | `references/`、`scripts/`、`assets/` |
### 资源目录边界
| 目录 | 放什么 | 不放什么 |
| --- | --- | --- |
| `references/` | 长资料、规范、领域说明 | 核心流程 |
| `scripts/` | 可重复、确定性的脚本 | 普通说明文字 |
| `assets/` | 输出用模板、图片、字体、样例文件 | 需要 AI 阅读的规则 |

## 关键判断
### 设计要点
- 一个 Skill 只做一类任务。
- `description` 是触发入口，不是普通简介。
- `description` 要写触发词、适用场景和边界。
- 长资料放 `references/`，不要塞进 `SKILL.md`。
- 确定性、重复性、批处理任务放 `scripts/`。
- 输出模板、图片、字体、样例文件放 `assets/`。
- 不要往 skill 里塞 README、安装说明、CHANGELOG 这类和执行无关的文件。
- 低风险 Skill 可以隐式触发；高副作用 Skill 应手动触发或要求确认。
- Skill 不是安全边界，工具权限仍由 Harness 控制。
### 常见类型
| 类型 | 例子 |
| --- | --- |
| Research Skill | 调研、来源比较、报告生成 |
| Codebase Skill | 仓库理解、迁移、issue 修复、代码图谱 |
| Document Skill | PDF、Word、PPT、表格处理 |
| Review Skill | 代码审查、安全审查、PR 总结 |
| Data Skill | 数据清洗、分析、图表生成 |
| Tool Adapter Skill | 封装某个 API、CLI、MCP server 的使用流程 |


## 来源
- Codex 内置 skill-creator：`/Users/euygnehcnij/.codex/skills/.system/skill-creator/SKILL.md`
- OpenAI Codex：Agent Skills：https://developers.openai.com/codex/skills
- OpenAI Skills examples：https://github.com/openai/skills
- Agent Skills specification：https://agentskills.io/
- Claude Code：Extend Claude with skills：https://code.claude.com/docs/en/skills
- Claude Code：Memory / Rules：https://code.claude.com/docs/en/memory
