---
title: "结构化 Prompt 方法论：用模块框定 AI 的行为"
description: "用一套明确的模块（背景、目标、范围、约束、禁止、验收、输出格式）来框定 AI 编程助手的行为，让它理解需求更准确、改码更可靠。"
date: "2026.06.21"
category: "method"
index: "009"
readTime: "14 MIN"
修改时间: 2026-06-21
---
## 命名
目前在社区和工具文档中没有统一的名称，常见命名及侧重点如下：

| 名称 | 侧重 | 使用场景 |
|------|------|----------|
| **Structured Instructions** | 用固定模块/格式写的指令文件 | Cursor Rules、Claude Code CLAUDE.md、GitHub Copilot instructions |
| **Spec-Driven Development** | 先写规格说明再让 AI 按规格写代码 | OpenAI Codex CLI 的 `--spec` 模式、社区工程实践 |
| **Context Engineering** | 有意识地构造 AI 能准确理解的上下文 | 方法论层面，跨工具通用 |
| **Instruction-Driven Development (IDD)** | 以结构化指令文件驱动 AI 的输出行为 | 社区讨论和 YouTube 教程中的说法 |
| **Task Framing** | 用明确格式框定任务的边界和验收标准 | 聊天式单次 Prompt，非持久化指令 |

这篇笔记关注的核心是**结构化指令方法论**：怎么用一套明确的模块（背景、目标、范围、约束、禁止、验收、输出格式）来框定 AI 编程助手的行为，让它理解需求更准确、改码更可靠。

## 为什么结构化格式更有效
### 自然语言的天然问题
随口自然语言描述需求时，常见问题：
- **边界模糊**：说"改一下那个按钮"，没说是哪个文件、哪个组件、改到什么样子
- **默认假设冲突**：你的"不用管测试"可能被 AI 当成"测试也要改"
- **上下文污染**：大量无关背景混进去，AI 反而抓不住重点
- **验收标准缺失**：AI 改完了，你也不知道算不算改对了
### 结构化格式解决的核心问题
结构化指令不是让 AI 更聪明，而是**减少 AI 需要猜测的范围**。每一块结构都在回答 AI 可能猜错的问题：

| 结构模块 | 解决的问题 | 不写会怎样 |
|----------|------------|------------|
| **Context（背景/当前状态）** | 这是什么项目、现在是什么状态 | AI 无法区分通用写法还是项目特定写法 |
| **Goal（目标/期望效果）** | 改完应该是什么样的 | AI 倾向于做最小改动，而不是你期望的效果 |
| **Scope（修改范围）** | 哪些文件可以改、哪些不能碰 | AI 可能全局修改，比如顺手改了你不想动的配置 |
| **Constraints（约束条件）** | 技术栈、兼容性、性能要求 | AI 可能用你项目不存在的库，或引入不兼容的 API |
| **Do Not（禁止事项）** | 明确不能做什么 | AI 倾向于"多做"而非"少做"，可能顺手重构不相关的代码 |
| **Acceptance（验收标准）** | 怎么判断改对了 | 你无法知道改完是否真的符合预期，也影响 AI 自我修正 |
| **Output Format（输出要求）** | 只要代码还是也要解释、提交还是只改文件 | AI 可能输出一堆解释而不写代码，或反过来 |
### 原理总结
**AI 编程助手的上下文窗口有限**。自然语言描述时，AI 需要在模糊信号中拼凑意图，必然有概率猜错。结构化格式做的事是：**把"需要 AI 推断"的部分压缩到最小**，每一步的意图、权限、边界和验收都写清楚，AI 只需要在框定的范围内执行。

这和软件工程里"接口定义 > 口头传话"是同一个道理。

## 各工具中的结构化指令机制
### 对比表

| 维度 | Cursor Rules | Claude Code CLAUDE.md | GitHub Copilot Instructions | OpenAI Codex CLI |
|------|-------------|----------------------|---------------------------|-------------------|
| **文件格式** | `.mdc`（Markdown + YAML frontmatter） | Markdown 纯文本 | Markdown 纯文本 | Markdown 纯文本（`AGENTS.md`） |
| **存放位置** | `.cursor/rules/*.mdc` | `CLAUDE.md`、`.claude/CLAUDE.md`、`.claude/rules/*.md` | `.github/copilot-instructions.md` | 项目根目录 `AGENTS.md` |
| **加载机制** | `alwaysApply` / `globs`（按文件类型附���） / `description`（Agent 判断） | 按目录层级加载（从根到工作目录级联），`.claude/rules/` 支持 `paths` 的 glob 匹配 | 仓库级 + 路径级（`applyTo` glob），个人 > 仓库 > 组织 | 目录层级加载，子目录 `AGENTS.md` 对子目录生效 |
| **元数据** | `description`、`globs`、`alwaysApply` | 无原生 metadata，用标题和列表组织；`.claude/rules/` 中支持 `paths` frontmatter | `applyTo` / `excludeAgent` frontmatter | 无原生 metadata |
| **持久化** | 是（项目级或用户级） | 是（项目级、用户级、企业级） | 是（仓库级） | 是（项目级、用户级） |
| **单次任务** | `@` 手动提及或聊天中直接描述 | 在聊天中直接描述任务 | 在聊天中直接描述任务 | 在聊天中直接描述任务 |
| **路径作用域** | `globs` | `.claude/rules/` 中的 `paths` frontmatter | `applyTo` glob | 嵌套 `AGENTS.md` |
| **禁止事项** | 写入规则正文（自然语言约束，非强制执行） | 写入 `## Do Not` 段落（自然语言约束），配合 hooks 做硬约束 | 写入指令正文 | 写入 `AGENTS.md` 段落，配合 `.rules` 做权限控制 |
| **长度建议** | 推荐短小聚焦，单文件建议不超过一页 | 推荐 200 行以内，大项目拆分到 `.claude/rules/` | 不超过 2 页 | 无明确限制 |
| **导入机制** | 不支持 | `@path` 导入其他文件 | 不支持 | 不支持 |
### 共性提炼
尽管文件格式、存放位置不同，它们共享同一套底层逻辑：

1. **分层级**：全局级 → 团队/企业级 → 项目级 → 路径级 → 个人本地级，由宽到窄
2. **路径匹配**：通过 glob 将指令作用到特定文件或目录
3. **Markdown 格式**：普通 Markdown 章节结构，不依赖特殊语法
4. **持久加载 vs 单次任务**：分两条路径——持久化配置文件（每次都加载）和聊天 prompt（单次）
5. **自然语言约束，非硬强制**：这些文件影响模型行为倾向，不是安全边界；要硬阻断需走权限系统或者 hooks
6. **始终生效 vs 按需触发**：`alwaysApply` / 无 `paths` 的规则始终加载，`globs` / `paths` 的规则在操作匹配文件时加载

## 通用结构化 Prompt 模板
### 持久化指令模板（CLAUDE.md / 规则文件用）

```markdown
## Context
- 项目简介：一句话说清楚是什么
- 技术栈：语言、框架、运行时版本
- 关键目录：主要源码在哪、配置文件在哪
- 稳定约定：命名规范、目录结构、编码风格

## Rules
- 修改文件前必须确认当前状态
- 优先小范围编辑，避免不必要的大范围重构
- 查找内容优先用哪些工具
- 修改完成后检查相关段落是否可读

## Do Not
- 不要修改以下文件/目录：xxx
- 不要随意引入新依赖
- 不要执行破坏性操作（批量删除、覆盖、移动大量文件），除非明确要求
- 不要替用户做范围之外的决定

## Verification
- 修改后需要检查什么
- 无法验证时怎么说明
```
### 单次任务 Prompt 模板（聊天发送用）
适合直接在 Cursor / Claude Code / Codex 聊天中发送。

```markdown
## 背景
- 这是什么项目/模块
- 当前状态

## 目标
- 改完之后应该达到什么效果
- 具体可观测的验收标准

## 范围
- 只改这些文件：xxx
- 不要动这些文件：xxx

## 约束
- 技术栈/语言/框架
- 兼容性要求
- 性能要求（如果有）
- 设计/样式参考（如果是 UI 改动）

## 注意事项
- 不要做的事情
- 容易踩的坑

## 输出要求
- 只需要修改代码 / 附带解释
- 是否要 commit
```

## 分场景模板
### UI 修改

```markdown
## 背景
- 页面：xxx（路径或路由）
- 组件：xxx（组件名/文件路径）
- 当前状态：是什么样子，有什么问题

## 目标效果
- 视觉上应该变成什么样（位置、颜色、尺寸、间距）
- 交互上应该变成什么样（点击、悬停、动画、状态切换）
- 参考：截图/设计稿/现有类似组件（如有）

## 修改范围
- 可改的文件：xxx
- 需要确认要不要动：xxx

## 约束
- 框架：React / Vue / 纯 HTML+CSS
- 样式方案：CSS Modules / Tailwind / styled-components / 内联
- 响应式要求（如有）
- 不要改动 API 调用或后端逻辑
- 不要引入新的 UI 库或组件库

## 验收方式
- 对照目标效果逐项检查
- 不影响原有功能
```
### Bug 修复

```markdown
## 问题描述
- 发生了什么
- 期望行为 vs 实际行为

## 复现
- 操作步骤
- 触发条件
- 错误信息/堆栈（如果有）

## 排查范围
- 怀疑的文件：xxx
- 相关模块：xxx
- 已排除的方向：xxx

## 修改约束
- 用最小改动修 bug，不要顺手重构
- 不要改 API 接口签名
- 不要动不相关的功能

## 验收
- bug 不再复现
- 相关测试依然通过
```
### 功能开发

```markdown
## 背景
- 项目/模块是什么
- 已有功能：xxx

## 需求
- 要实现什么功能
- 用户故事/使用场景
- 输入 → 处理的逻辑 → 输出

## 技术约束
- 语言、框架
- 必须兼容的现有模块/API
- 风格要和现有代码一致

## 范围
- 新增文件：xxx
- 要改的现有文件：xxx
- 不要改：xxx

## 注意事项
- 需要处理边界条件（列出）
- 需要错误处理
- 不要引入新的第三方依赖（或列明允许引入的）

## 输出要求
- 先给实现思路，确认后再改代码
- 或者直接修改代码
```
### 代码重构

```markdown
## 背景
- 当前结构是什么样
- 问题在哪：难维护 / 重复代码 / 性能差 / 命名混乱

## 目标
- 重构后应该是什么样的结构
- 哪些行为必须保持不变

## 范围
- 重构范围：xxx 文件/模块
- 哪些一定不动：xxx

## 约束
- 不改变外部行为
- 不改变 API 签名（如果能确认的话）
- 保持原有测试全部通过

## 验收
- 现有测试通过
- 如果加了新测试，说明加了哪些
```

## 简洁中文模板（日常快速使用）
### 标准格式（推荐）

```
### 背景
[一行说清项目/模块是什么]
### 当前状态
[现在是什么情况]
### 目标
[改完要什么样]
### 范围
- 改：xxx
- 不动：xxx
### 约束
[语言、框架、风格、兼容性要求]
### 不要
[明确禁止做的事]
### 验收
[怎么算改好了]
```
### 极简格式（Bug / 小改动）

```
[目标一句话]
- 涉及文件：xxx
- 别碰：xxx
- 约束：xxx
- 结果：xxx
```
### 说明
- 这个模板适合中文用户日常在 Cursor / Claude Code / Codex / Copilot Chat 中直接发送
- 模块按需增减，不是每次都写全。小改动可以只用"目标 + 范围 + 约束"三块
- 关键原则：**把 AI 可能需要猜的东西写清楚，不需要猜的东西不用写**

## 与 Rule、Skill 的关系
这篇笔记讨论的结构化 Prompt 方法，和 [[Rule 框架调研]]、[[Skill 框架调研]] 是互补关系：

| 机制 | 性质 | 时效 | 适用场景 |
|------|------|------|----------|
| **结构化 Prompt**（本篇） | 单次任务的描述格式 | 仅当次聊天 | 任何一次具体的代码修改请求 |
| **Rule** | 长期生效的行为约束 | 跨会话持续生效 | 项目规范、编码风格、禁止事项 |
| **Skill** | 可复用的工作流 | 被触发时加载 | 复杂多步流程，用完即退 |

同一套结构化思路可以分别用到三个地方：
- **一次 Prompt** → 用单次任务模板描述任务
- **一个 Rule** → 用持久化模板描述长期约束（Context / Rules / Do Not / Verification）
- **一个 Skill** → 用 SKILL.md 的 frontmatter + markdown 描述触发条件和执行流程

## 关键原则
无论使用什么模板、什么工具，核心原则相同：

1. **上下文先于指令**：先说清楚现状和背景，再说要做什么。AI 不知道的事情比你知道的多得多
2. **范围 > 能力**：划清边界比指令写得漂亮更重要。"别碰哪些文件"比"应该改哪些文件"更能防止意外
3. **禁止 > 允许**：AI 天然倾向于多做。显式禁止的优先级高于允许
4. **验收标准是可操作的**：不要写"代码要干净"，写"函数名用驼峰、单文件不超过 200 行"
5. **模板按需裁剪**：不是每次都要写全所有模块。小改动三块就够了，大改动加上约束和验收

## 来源
- Claude Code：How Claude remembers your project：https://code.claude.com/docs/en/memory
- Claude Code：Best practices for Claude Code：https://code.claude.com/docs/en/best-practices
- Claude Code：Extend Claude with skills：https://code.claude.com/docs/en/skills
- Claude Code：Features overview (CLAUDE.md vs Skills vs Rules)：https://code.claude.com/docs/en/features-overview
- GitHub Copilot：Adding custom instructions：https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot
- Cursor Rules：awesome-cursorrules 社区最佳实践：https://github.com/PatrickJS/awesome-cursorrules
- Agent Skills 开放标准：https://agentskills.io
- Open AI Codex CLI 文档：https://openai.github.io/codex/
- 本 vault 已有笔记：[[Rule 框架调研]]、[[Skill 框架调研]]、[[Harness 框架调研]]
