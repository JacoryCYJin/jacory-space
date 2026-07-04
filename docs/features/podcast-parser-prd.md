# Podcast Parser PRD

## 目标

在 Media Backend 中新增播客解析能力，让用户可以输入小宇宙、Apple Podcasts、RSS 或直接音频链接，获取单集元信息、字幕或转写文本，并基于内容生成总结。

第一版目标不是做通用音频平台下载器，而是做一个面向播客内容理解的解析链路：

- 找到公开可访问的单集音频
- 优先读取播客源提供的 transcript
- 没有 transcript 时进入转写任务
- 基于 transcript 或转写结果生成摘要、章节和要点

## 背景

现有后端已经从 `video-backend` 重构为 `media-backend`，并保留视频解析能力。播客能力应复用当前媒体后端的路由、任务状态、字幕清洗和总结能力，而不是在前端或后端新增一套孤立实现。

调研结论：

- 播客生态的稳定入口是 RSS。
- Apple Podcasts 链接应通过 iTunes Search / Lookup API 回到 `feedUrl` 或 `episodeUrl`。
- 小宇宙单集页可从页面元信息获取音频地址，也常能通过 Apple / iTunes 目录找到 RSS。
- Apple Podcasts App 内 transcript 不适合作为通用网页后端抓取来源。
- 中文播客通常不能依赖 Apple 自动 transcript，应准备 STT 转写。

## 范围

做：

- 支持 RSS feed URL 解析
- 支持 Apple Podcasts 节目链接和单集链接解析
- 支持小宇宙单集链接解析
- 支持直接音频链接解析
- 从 RSS 中提取单集列表、标题、描述、发布时间、时长、封面、音频 URL
- 优先读取 RSS `podcast:transcript`
- 支持 VTT、SRT、HTML、JSON、纯文本 transcript 的规范化
- 没有 transcript 时创建转写任务
- 基于 transcript 生成总结、章节、关键观点和可复制摘要
- 在前端提供播客解析入口和结果视图

不做：

- 不支持会员、付费、登录后可见内容
- 不绕过平台访问控制
- 不逆向 Apple Podcasts App 本地 transcript 数据
- 不把小宇宙私有 API 作为主路径
- 不做批量订阅管理
- 不做播客客户端、播放列表或收藏系统
- 不替代现有视频下载器

## 用户行为

用户输入链接后：

- 系统识别链接类型：RSS、Apple Podcasts、小宇宙、直接音频或不支持
- 页面显示播客节目和单集基础信息
- 如果存在公开 transcript，直接显示 transcript 状态为可用
- 如果没有 transcript，提示可启动转写任务
- 转写完成后可生成总结
- 总结结果展示为结构化内容，而不是一整段长文本

结果页应展示：

- 单集标题
- 节目名称
- 平台或来源
- 发布时间
- 时长
- 封面
- 简介
- 音频来源状态
- transcript 状态
- 总结状态

总结结果应包含：

- 一句话概括
- 分段摘要
- 时间轴章节
- 关键观点
- 人名、书名、组织或地点等实体线索
- 可复制 Markdown

## 输入类型

### RSS URL

示例：

```txt
https://example.com/feed.xml
https://feed.xyzfm.space/xxxx
```

处理方式：

- 拉取 XML
- 解析 channel 和 item
- 从 item 中读取 `enclosure`
- 从 item 中读取 `podcast:transcript`

### Apple Podcasts URL

示例：

```txt
https://podcasts.apple.com/cn/podcast/example/id123456789
https://podcasts.apple.com/cn/podcast/example/id123456789?i=1000000000000
```

处理方式：

- 从 URL 提取 podcast id
- 调用 iTunes Lookup API
- 获取 `feedUrl`
- 如可获取近期 episode 的 `episodeUrl`，可直接作为音频候选
- 回到 RSS 做完整解析和 transcript 发现

### 小宇宙 URL

示例：

```txt
https://www.xiaoyuzhoufm.com/episode/xxxxxxxx
```

处理方式：

- 优先读取页面公开元信息
- 从 `og:title`、`og:description`、`og:audio` 获取单集信息和音频候选
- 如能通过 iTunes / RSS 补充 feed 信息，则合并使用
- 不依赖猜测式 `/podcast/{id}/rss` 路径作为主方案

### 直接音频 URL

示例：

```txt
https://example.com/audio.m4a
https://example.com/audio.mp3
```

处理方式：

- 标记为 direct audio
- 尝试 HEAD 获取 content type 和大小
- 无节目元信息时使用文件名作为标题
- 直接进入 transcript 检查失败后的转写流程

## 后端架构

目标结构：

```txt
jacory-space-backend/media-backend/app/
  routes/
    podcast.py
    video.py
    download.py
    outline.py

  services/
    media/
      resolver.py
      types.py

    podcast/
      parser.py
      rss.py
      apple.py
      xiaoyuzhou.py
      audio.py

    transcript/
      captions.py
      podcast.py
      stt.py
      tasks.py

    summary/
      podcast.py
```

职责边界：

- `routes/podcast.py`: 请求参数、状态码、响应包装
- `services/media/resolver.py`: 识别链接类型
- `services/podcast/rss.py`: RSS 拉取和解析
- `services/podcast/apple.py`: iTunes Search / Lookup
- `services/podcast/xiaoyuzhou.py`: 小宇宙公开页面元信息解析
- `services/podcast/audio.py`: 直接音频检测和元信息探测
- `services/transcript/podcast.py`: podcast transcript 发现与格式归一
- `services/transcript/stt.py`: STT provider 抽象
- `services/transcript/tasks.py`: 转写任务状态管理
- `services/summary/podcast.py`: 播客摘要提示词与结构化输出

## API

### `POST /api/podcast/parse`

请求：

```json
{
  "url": "https://www.xiaoyuzhoufm.com/episode/..."
}
```

响应：

```json
{
  "type": "podcast",
  "platform": "xiaoyuzhou",
  "source_url": "https://www.xiaoyuzhoufm.com/episode/...",
  "feed_url": "",
  "episode": {
    "id": "",
    "title": "",
    "show_title": "",
    "description": "",
    "thumbnail": "",
    "published_at": "",
    "duration": 0,
    "audio_url": ""
  },
  "transcript": {
    "status": "available",
    "source": "rss",
    "format": "vtt",
    "language": "zh",
    "char_count": 0,
    "preview": ""
  }
}
```

### `POST /api/podcast/transcribe`

请求：

```json
{
  "source_url": "",
  "audio_url": "",
  "language": "zh"
}
```

响应：

```json
{
  "task_id": "",
  "status": "QUEUED"
}
```

### `GET /api/podcast/transcribe/tasks/{task_id}`

响应：

```json
{
  "task_id": "",
  "status": "TRANSCRIBING",
  "progress": 42,
  "transcript": "",
  "error": ""
}
```

### `POST /api/podcast/summary`

请求：

```json
{
  "title": "",
  "show_title": "",
  "description": "",
  "transcript": "",
  "language": "zh"
}
```

响应：

```json
{
  "success": true,
  "summary": {
    "one_liner": "",
    "sections": [],
    "chapters": [],
    "key_points": [],
    "entities": [],
    "markdown": ""
  }
}
```

## 数据模型

播客单集：

- `id`
- `source_url`
- `platform`
- `feed_url`
- `title`
- `show_title`
- `description`
- `thumbnail`
- `published_at`
- `duration`
- `audio_url`
- `audio_content_type`
- `audio_size_bytes`

Transcript：

- `status`: `available` / `missing` / `insufficient` / `transcribing` / `failed`
- `source`: `rss` / `apple` / `stt` / `none`
- `format`: `vtt` / `srt` / `html` / `json` / `txt`
- `language`
- `text`
- `char_count`
- `preview`
- `segments`

转写任务：

- `task_id`
- `client_id`
- `source_url`
- `audio_url`
- `status`
- `progress`
- `transcript`
- `error`
- `created_at`
- `updated_at`

## 里程碑

### M1: 播客解析基础

- 完成 RSS 解析
- 完成 Apple Podcasts -> iTunes Lookup -> RSS
- 完成小宇宙公开页面元信息解析
- 完成直接音频链接识别
- `POST /api/podcast/parse` 返回单集元信息和音频 URL

验收：

- Apple Podcasts 真实链接可返回 RSS 和单集音频
- 小宇宙真实单集链接可返回标题和音频候选
- RSS 真实链接可返回最新单集
- 直接 M4A / MP3 链接可识别为音频

### M2: Transcript 发现

- 支持 RSS `podcast:transcript`
- 支持 transcript URL 拉取
- 支持 VTT / SRT / HTML / JSON / TXT 归一
- 复用现有 transcript 质量判断

验收：

- 有 transcript 的 RSS 能直接返回文本
- 无 transcript 时返回明确 `missing`
- 低质量 transcript 返回 `insufficient`

### M3: STT 转写任务

- 新增转写任务模型
- 支持队列、进度、失败状态
- 接入一个 STT provider
- 支持长音频基础错误恢复

验收：

- 无 transcript 的播客能启动转写
- 转写中可轮询进度
- 转写完成后返回可用于总结的文本

### M4: 播客总结

- 新增播客总结服务
- 输出一句话概括、章节、关键观点、实体线索和 Markdown
- 根据中文播客优化提示词

验收：

- 长播客不会只返回泛泛总结
- 章节能和 transcript 内容对应
- 输出可复制为 Markdown

### M5: 前端体验

- 新增或扩展媒体解析页面
- 支持输入播客链接
- 展示解析、转写、总结三个阶段状态
- 保留现有视频解析能力

验收：

- 视频解析不回归
- 播客解析入口清晰
- 移动端内容不溢出
- 视觉符合 Personal Operating System 风格

## 错误处理

常见错误：

- `UNSUPPORTED_URL`: 不支持的链接
- `RSS_FETCH_FAILED`: RSS 拉取失败
- `RSS_PARSE_FAILED`: RSS 解析失败
- `EPISODE_NOT_FOUND`: 未找到单集
- `AUDIO_NOT_FOUND`: 未找到公开音频
- `TRANSCRIPT_NOT_FOUND`: 未找到 transcript
- `TRANSCRIPT_FETCH_FAILED`: transcript 拉取失败
- `STT_PROVIDER_UNAVAILABLE`: 转写服务不可用
- `STT_TASK_FAILED`: 转写任务失败
- `SUMMARY_FAILED`: 总结失败

错误文案原则：

- 说明是哪一步失败
- 提供可操作建议
- 不暴露大段底层堆栈
- 不暗示可以绕过平台限制

## 验收

- `POST /api/podcast/parse` 支持 RSS、Apple Podcasts、小宇宙、直接音频链接
- 有公开 transcript 时优先使用 transcript
- 没有 transcript 时能进入转写任务
- 转写完成后能生成结构化总结
- 视频解析 `/api/parse` 和 `/api/video/parse` 不回归
- 下载、Cookie、设置接口不回归
- 后端 Python 编译通过
- 前端 build 通过
- 文档与 `media-backend` 目录结构保持一致

