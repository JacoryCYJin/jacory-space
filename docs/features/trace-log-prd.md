# TRACE.LOG PRD

## 目标

在 About 页面为“公开构建中”状态增加一个轻量入口，用于查看最近实际推进过、正在沉淀的事情。

TRACE.LOG 不是路线图、任务清单或自我介绍，而是 Personal OS 中的近期行动与产出日志。

## 范围

做：

- 在 About 页面状态文本右侧提供一个小型入口点
- 点击入口后展示 `// TRACE.LOG`
- 第一版展示最近 4 到 6 条日志
- 每条日志记录一件具体发生或正在推进的事情
- 每条日志尽量指向一个沉淀去向，例如 `/about`、`/tools`、`/blog`、`/notes`
- 保持 About 首屏现有 identity 表格和左右结构稳定

不做：

- 不做任务管理列表
- 不做百分比进度
- 不做 Git 分支、时间轴或看板样式
- 不接后端接口
- 不新增复杂筛选
- 不强制第一版实现完整 `/trace` 页面

## 行为

- 用户在 About 页面看到“公开构建中”状态
- 状态文本右侧显示一个很小的蓝色入口点
- 点击入口点后打开 `// TRACE.LOG`
- 浮层展示最近的行动与产出日志
- 每条日志展示编号、类型、标题、状态、描述、去向和更新时间
- 再次点击入口点、点击外部区域或按 `Escape` 可关闭
- 移动端使用不撑高 About 首屏内容的展示方式

## 数据

每条日志需要：

- `id`
- `type`: `site` / `content` / `tool` / `agent` / `work` / `note`
- `title`
- `status`: `building` / `iterating` / `updating` / `exploring` / `shipped` / `archiving`
- `description`
- `destination`
- `updatedAt`

示例：

```js
{
  id: 'about-trace-entry',
  type: 'site',
  title: '关于页状态入口调整',
  status: 'iterating',
  description: '重新整理 About 页面里的信息层级和状态入口。',
  destination: '/about',
  updatedAt: '2026.07'
}
```

## 验收

- About 页面状态文本右侧有入口点，且不破坏 identity 表格结构
- 点击入口点能打开并关闭 TRACE.LOG
- TRACE.LOG 内容为纵向日志列表
- 每条日志都是具体行动或产出，不是泛泛方向或待办事项
- 浮层不撑高 About 首屏左右双栏
- 移动端内容不溢出
- 视觉符合 Personal Operating System 规则：冷白背景、hairline、少量蓝色、无重阴影、无大圆角、无 SaaS 卡片感
- `npm run build` 通过
