# Minecraft 皮肤 AI 问题登记

## 待处理

| 问题 | 现象 | 初步原因 | 状态 |
| --- | --- | --- | --- |
| 开启“让 AI 查看当前皮肤”后生成失败 | 请求状态为 200，但最终提示“生成方案失败”；请求诊断显示 `stream_connected / Waiting for model output.`；关闭视觉后正常 | 当前默认模型为 `Qwen/Qwen3-VL-8B-Instruct`。视觉分支没有关闭 Qwen3 思考模式，模型可能只输出 reasoning 或在 `max_tokens` 内未产生最终 `content`；前端只累计 `delta.content`，流结束后空内容被判定失败 | 待修复 |

## 诊断记录

- 代码位置：`jacory-space-frontend/src/views/MinecraftSkinEditor.vue` 的 `generateAiPlan()`、`buildAiUserContent()`、`readAiStream()`。
- 已确认：视觉请求会发送 `text + image_url` 数组；SiliconFlow 官方视觉接口文档支持该格式及流式 `delta.content`。
- 已确认：文本分支只在非视觉 Qwen3 模型上发送 `enable_thinking: false`，视觉分支遗漏了同类控制参数。
- 方案方向：对 Qwen3-VL 视觉请求关闭 thinking，并增强空输出/仅 reasoning 的诊断；保留现有视觉消息格式和文本模式行为。
