# Docs Structure

本目录用于存放项目开发过程中的说明、调研、需求和运维文档。文档按用途分类，尽量保持轻量，避免把临时讨论和正式说明混在一起。

```txt
docs/
  product/        # 面向使用者的产品/功能介绍
  overview/       # 总览、调研、问题背景、方案草稿
  features/       # 功能 PRD、页面需求、验收标准
  architecture/   # 前端架构、后端架构、路由、数据流、模块关系
  api/            # 接口说明、请求响应、错误码
  operations/     # 本地启动、部署、环境变量、排障
```

## Directory Guide

### `product/`

放面向使用者和产品视角的功能介绍，例如功能定位、可见流程、页面模块、使用边界和能力说明。这里不写详细代码实现，也不作为开发验收标准。

### `overview/`

放还在讨论或调研阶段的内容，例如问题背景、方案草稿、视觉方向、阶段计划。适合记录“现在怎么看这个问题”和“后面可能怎么做”。

### `features/`

放已经准备实现或需要明确范围的功能文档，例如简单 PRD、页面需求、交互规则、验收标准。一个功能建议对应一个文件。

### `architecture/`

放相对稳定的系统结构说明，例如前端目录关系、后端模块关系、路由组织、前后端数据流、代理关系等。

### `api/`

放接口文档，例如请求路径、请求参数、响应结构、错误码、鉴权或 Cookie 相关说明。主要用于前后端对齐。

### `operations/`

放运行和维护相关文档，例如本地启动、环境变量、部署步骤、日志位置、常见故障排查。

## Naming

文件名使用小写 kebab-case，例如：

```txt
product/video-parser.md
features/video-downloader-prd.md
architecture/routing-and-api-proxy.md
operations/local-development.md
```
