---
title: "Harness 框架调研：组织 Agent 的工作区骨架"
description: "Harness 是把 Agent 的规则、配置、工具、上下文、运行记录组织起来的工作区，不一定是代码工程。通用 Agent Harness 和 Coding Agent Harness 应该分开设计。"
date: "2026.06.18"
category: "research"
index: "007"
readTime: "10 MIN"
修改时间: 2026-06-18
---
## 结论
Harness 是把 Agent 的规则、配置、工具、上下文、运行记录组织起来的工作区，不一定是代码工程。
通用 Agent Harness 和 Coding Agent Harness 应该分开：通用骨架解决 Agent 运行、工具、模型、上下文、记录、评估；Coding 骨架在通用骨架上增加代码工作区、终端、文件编辑、Git、补丁、测试运行和轨迹。
骨架不能只写顶层目录，必须写到子层和文件类型。

## 通用 Agent Harness 骨架
### 可照搬骨架
```text
agent-harness/
  README.md
  AGENTS.md
  .env.example
  config/
    README.md
    models.yaml
    tools.yaml
    permissions.yaml
    runtime.yaml
  rules/
    <agent-name>.md
  skills/
    <skill-name>/
      SKILL.md
      references/
      scripts/
      assets/
  workflows/
    <workflow-name>.md
  tools/
    README.md
    registry.yaml
    adapters/
  context/
    sources/
    memory/
    retrieval/
  docs/
  examples/
  evals/
    datasets/
    evaluators/
    reports/
  traces/
  outputs/
  scripts/
  tests/
```
### 骨架说明
| 位置 | 类型 | 放什么 |
| --- | --- | --- |
| `README.md` | Markdown 文件 | Harness 是什么、怎么使用、目录怎么维护 |
| `AGENTS.md` | Rule 文件 | 当前 Harness 的全局规则 |
| `.env.example` | 环境变量示例文件 | API key、模型名、日志开关、运行环境变量 |
| `config/models.yaml` | YAML 文件 | 模型列表、provider、路由策略 |
| `config/tools.yaml` | YAML 文件 | 工具清单、启用状态、参数 |
| `config/permissions.yaml` | YAML 文件 | 工具权限、文件权限、网络权限 |
| `config/runtime.yaml` | YAML 文件 | 默认运行参数、重试、超时、日志级别 |
| `rules/<agent-name>.md` | Rule 文件 | 单个 agent 或单类任务的专用规则 |
| `skills/<skill-name>/SKILL.md` | Skill 文件 | 可被 Agent 触发加载的技能说明 |
| `skills/<skill-name>/references/` | Skill 资源目录 | 长资料、规范、模板说明 |
| `skills/<skill-name>/scripts/` | Skill 脚本目录 | 可复用确定性脚本 |
| `skills/<skill-name>/assets/` | Skill 资产目录 | 模板、图片、示例产物 |
| `workflows/<workflow-name>.md` | Workflow 文件 | 固定任务流程、步骤、输入输出要求 |
| `tools/registry.yaml` | YAML 文件 | 工具索引、工具名称、入口、权限 |
| `tools/adapters/` | 代码或配置目录 | 外部工具适配；没有代码实现时可以不建 |
| `context/sources/` | 资料目录 | Agent 可读取的输入资料、知识文件、任务材料 |
| `context/memory/` | 数据目录 | 会话记忆、长期记忆、人工整理的记忆 |
| `context/retrieval/` | 配置或代码目录 | 检索配置、索引配置、RAG 入口 |
| `docs/` | 文档目录 | 架构说明、部署说明、工具说明 |
| `examples/` | 示例目录 | 最小 agent 示例、工具调用示例、多 agent 示例 |
| `evals/datasets/` | 数据目录 | 评估样例、输入任务、期望结果 |
| `evals/evaluators/` | 代码或表格目录 | 自动评分、人工评分辅助、回归判断 |
| `evals/reports/` | 数据目录 | 评估报告、对比结果 |
| `traces/` | 数据目录 | 每次运行的 trace、日志、调试记录 |
| `outputs/` | 数据目录 | Agent 输出结果、导出文件、最终产物 |
| `scripts/` | 脚本目录 | 本地开发、数据准备、批量评估脚本；没有脚本时可以不建 |
| `tests/` | 测试目录 | tools、evals、脚本的测试；没有代码实现时可以不建 |

## Coding Agent Harness 骨架
### 可照搬骨架
```text
coding-harness/
  README.md
  AGENTS.md
  pyproject.toml / package.json
  .env.example
  .agents/
    skills/
      <skill-name>/
        SKILL.md
        references/
        scripts/
        assets/
  docs/
  examples/
  agent-server/
    AGENTS.md
    pyproject.toml / package.json
    <package>/
  sdk/
    AGENTS.md
    agent/
    context/
    conversation/
    event/
    llm/
    mcp/
    observability/
    settings/
    skill_loader/
    testing/
    tool/
    workspace/
  tools/
    AGENTS.md
    apply_patch/
    browser_use/
    file_editor/
    grep/
    search/
    terminal/
    task_tracker/
    workflow/
  workspace/
    repo/
    sandbox/
    artifacts/
  config/
    README.md
    default.yaml
    models.yaml
    tools.yaml
    sandbox.yaml
  trajectories/
  verification/
  tests/
```
### 骨架说明
| 位置 | 类型 | 放什么 |
| --- | --- | --- |
| `README.md` | Markdown 文件 | Coding Harness 是什么、怎么接入仓库、怎么运行任务 |
| `AGENTS.md` | Rule 文件 | 整个 Coding Harness 的长期行为规则 |
| `.agents/skills/<skill-name>/SKILL.md` | Skill 文件 | 可被 Agent 触发加载的技能说明 |
| `.agents/skills/<skill-name>/references/` | Skill 资源目录 | 长资料、规范、模板说明 |
| `.agents/skills/<skill-name>/scripts/` | Skill 脚本目录 | 可复用确定性脚本 |
| `.agents/skills/<skill-name>/assets/` | Skill 资产目录 | 模板、图片、示例产物 |
| `agent-server/` | 子项目目录 | 远程 API、WebSocket、任务队列；只做本地 CLI 时可以不建 |
| `agent-server/AGENTS.md` | Rule 文件 | server 子项目规则 |
| `agent-server/<package>/` | 代码包目录 | API、WebSocket、worker、任务状态接口 |
| `sdk/agent/` | 代码目录 | Coding Agent 定义、指令绑定、运行策略 |
| `sdk/context/` | 代码目录 | 规则、仓库信息、任务输入、诊断信息的加载 |
| `sdk/conversation/` | 代码目录 | message、turn、tool result、历史记录 |
| `sdk/event/` | 代码目录 | action、observation、状态变化事件 |
| `sdk/llm/` | 代码目录 | 模型 provider、模型路由、调用参数 |
| `sdk/mcp/` | 代码目录 | MCP server / tool 接入 |
| `sdk/observability/` | 代码目录 | trace、log、运行记录 |
| `sdk/settings/` | 代码目录 | 配置对象、默认值、环境变量读取 |
| `sdk/skill_loader/` | 代码目录 | Skill 扫描、metadata 读取、SKILL.md 加载 |
| `sdk/testing/` | 代码目录 | Harness 内部测试辅助能力 |
| `sdk/tool/` | 代码目录 | Tool 抽象、schema、调用协议 |
| `sdk/workspace/` | 代码目录 | workspace 接口、路径限制、文件系统适配 |
| `tools/apply_patch/` | 工具目录 | patch 应用工具 |
| `tools/browser_use/` | 工具目录 | 浏览器检查、截图、页面交互 |
| `tools/file_editor/` | 工具目录 | 文件读取、编辑、diff、patch |
| `tools/grep/` | 工具目录 | 文本搜索工具 |
| `tools/search/` | 工具目录 | 代码搜索、文件搜索、符号搜索 |
| `tools/terminal/` | 工具目录 | 命令执行、stdout / stderr、timeout |
| `tools/task_tracker/` | 工具目录 | 任务状态、todo、进度 |
| `tools/workflow/` | 工具目录 | 多步流程工具 |
| `workspace/repo/` | 数据目录 | 被 Agent 操作的代码仓库 |
| `workspace/sandbox/` | 运行目录 | 隔离执行环境、临时运行目录 |
| `workspace/artifacts/` | 数据目录 | 截图、报告、生成文件、构建产物 |
| `config/sandbox.yaml` | YAML 文件 | sandbox、权限、可执行命令配置 |
| `trajectories/` | 数据目录 | 每次运行的 action、observation、tool call、结果 |
| `verification/` | 代码目录 | tests、lint、typecheck、build、diff review |
| `tests/` | 测试目录 | sdk、tools、workspace、config、verification 的测试 |

## 关键判断
### 设计要点
- 通用 Agent Harness 先搭 `config / rules / skills / workflows / tools / context / traces / outputs`，不默认使用 `src/` 或代码工程结构。
- Coding Agent Harness 不是另一个完全不同体系，而是在通用 Harness 上增加 `workspace / terminal / file_editor / patch / verification / trajectories`。
- `.agents/skills/` 放真正的 Skill 内容；`sdk/skill_loader/` 放读取和加载 Skill 的代码。
- `AGENTS.md` 是 Rule 文件，不是 Harness 本体。
- `traces/` 偏通用运行记录；`trajectories/` 偏 Agent 每步动作和观察记录，Coding Agent 更常见。

## 来源
- OpenAI Agents SDK：https://github.com/openai/openai-agents-python
- OpenAI Agents SDK docs：https://openai.github.io/openai-agents-python/
- OpenAI Agents SDK source tree：https://github.com/openai/openai-agents-python/tree/main/src/agents
- LangGraph：https://github.com/langchain-ai/langgraph
- LangGraph overview：https://docs.langchain.com/oss/python/langgraph/overview
- LangGraph persistence：https://docs.langchain.com/oss/python/langgraph/persistence
- LangGraph memory：https://docs.langchain.com/oss/python/langgraph/memory
- LangGraph libs：https://github.com/langchain-ai/langgraph/tree/main/libs
- Claude Code settings：https://code.claude.com/docs/en/settings
- Cursor Rules：https://cursor.com/docs/rules.md
- AutoGen：https://github.com/microsoft/autogen
- AutoGen Python packages：https://github.com/microsoft/autogen/tree/main/python
- CrewAI：https://github.com/crewAIInc/crewAI
- CrewAI lib：https://github.com/crewAIInc/crewAI/tree/main/lib
- OpenHands Software Agent SDK：https://github.com/OpenHands/software-agent-sdk
- SWE-agent：https://github.com/SWE-agent/SWE-agent
