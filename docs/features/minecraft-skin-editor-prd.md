# Minecraft Skin Studio PRD

状态：调研完成，待技术方案确认
版本：v0.1
目标仓库：`site/jacory-space-frontend`
文档类型：产品需求文档

## 1. 产品概述

Minecraft Skin Studio 是一个面向 Minecraft 玩家和皮肤创作者的浏览器端皮肤设计工具。

用户可以导入或新建 Minecraft 皮肤，在 2D 像素画布和 3D 人物预览之间实时编辑，保存可继续编辑的项目，并导出能够被 Minecraft Java Edition 或 Bedrock Edition 使用的文件。

产品内置 AI 设计助手。AI 不直接覆盖用户作品，而是读取当前皮肤状态，生成结构化修改方案，调用经过授权的皮肤编辑工具，等待用户确认后再应用修改。

## 2. 背景与问题

现有普通图片编辑器无法直接表达 Minecraft 皮肤的 UV 展开、基础层、外层、Classic/ Slim 模型差异。用户通常需要在图片编辑器、皮肤预览网站和 Minecraft Launcher 之间反复切换，难以确认最终文件是否能正常使用。

现有在线皮肤编辑器已经普遍提供 2D/3D 预览、图层、镜像、撤销重做和 PNG 导出，因此这些能力属于本产品的基础可用性，而不是后置增强功能。[NovaSkin 功能介绍](https://minecraft.novaskin.me/about?after=24)、[SkinEditor 功能说明](https://skineditor.org/minecraft-skin-editor)

本产品需要解决四个问题：

1. 用户能否准确编辑真实 Minecraft 皮肤，而不是只编辑一个视觉模拟图。
2. 导出的文件能否在目标 Minecraft 版本中使用。
3. 用户能否保存中间状态，而不是只能下载最终 PNG。
4. AI 能否参与设计，同时保持用户确认、可撤销和可追溯。

## 3. 产品目标

### 3.1 首期目标

- 支持新建和导入标准 Minecraft 皮肤。
- 支持 Java Edition 常用的 64×64 和旧版 64×32 皮肤。
- 支持 Bedrock Edition 的 64×64、128×128 纹理和基础 Skin Pack 导出。
- 提供 Classic/Steve 与 Slim/Alex 两种模型预览。
- 提供 2D 像素编辑、3D 预览、图层、镜像、撤销重做和本地保存。
- 提供项目文件导入导出，保证用户可以跨浏览器或设备继续编辑。
- 提供受控的 AI 修改计划和工具调用协议。

### 3.2 非目标

- 不在首期自动登录或操作 Mojang/Microsoft 账号。
- 不承诺网页直接把皮肤应用到 Java 账号；Java 官方流程仍要求用户在 Profile 或 Launcher 中上传。[Minecraft Java 官方说明](https://help.minecraft.net/hc/en-us/articles/4408894664461-Make-a-Custom-Skin-in-Minecraft-Java-Edition)
- 不支持自定义玩家几何模型、翅膀、尾巴、盔甲等非标准皮肤模型。
- 不在首期实现 Marketplace 发布、多人协作和云端账号同步。
- 不让 AI 在未经确认的情况下直接覆盖整张皮肤。
- 不把任意本地命令或外部服务直接暴露给 AI。

## 4. 目标用户

### 4.1 普通玩家

希望快速修改已有皮肤，并确保下载后可以在游戏中使用。

### 4.2 皮肤创作者

需要精确编辑像素、管理基础层和外层、保留多个版本，并在不同模型之间切换测试。

### 4.3 AI 协作用户

希望用自然语言描述风格，让 AI 提供配色、局部设计和修改建议，并调用自己的参考资料、图像处理或自动化工具。

## 5. Minecraft 文件与兼容性要求

### 5.1 Java Edition

Java 官方支持通过 Profile 或 Launcher 上传 PNG 皮肤，并区分 Classic/Wide 与 Slim 模型。64×64 是当前标准格式，64×32 是旧版格式。Slim 皮肤在 Java 1.8 及更高版本中才完整支持。[Minecraft Java 官方说明](https://help.minecraft.net/hc/en-us/articles/4408894664461-Make-a-Custom-Skin-in-Minecraft-Java-Edition)

产品要求：

- 默认新建 64×64 皮肤。
- 支持导入 64×32，并转换为 64×64。
- 支持 Classic 和 Slim 两套 UV 映射。
- 基础层默认输出不透明像素。
- 外层允许透明，用于帽子、衣服、袖子和裤腿等覆盖效果。
- 导出前显示目标模型和格式校验结果。

### 5.2 Bedrock Edition

Bedrock Skin Pack 至少涉及 `manifest.json`、`skins.json`、PNG 纹理和 `texts` 语言文件。官方示例使用 `geometry.humanoid.custom` 表示 Steve，使用 `geometry.humanoid.customSlim` 表示 Alex。[Microsoft Skin Pack 文档](https://learn.microsoft.com/en-us/minecraft/creator/documents/packagingaskinpack?view=minecraft-bedrock-stable)

官方校验规则要求皮肤纹理为 64×64 或 128×128 PNG，并检查 JSON、模型、纹理、语言键等内容。[Microsoft Skin Pack Validation Rules](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/mctoolsvalreference/cspj?view=minecraft-bedrock-stable)

产品要求：

- 支持 64×64 Bedrock 皮肤导出。
- 预留 128×128 编辑和导出能力。
- 支持生成基础 `.mcpack` 文件。
- 自动生成合法 UUID。
- 自动生成 `manifest.json`、`skins.json`、`languages.json` 和 `en_US.lang`。
- 导出前校验纹理尺寸、模型值、文件引用和语言键。
- 明确提示 Java 与 Bedrock 的透明度和导入流程可能不同。

### 5.3 导出类型

| 类型 | 文件 | 使用场景 |
| --- | --- | --- |
| Java Skin | `skin.png` | 上传到 Java Profile 或 Launcher |
| Bedrock Skin | `skin.png` | 在 Bedrock 中导入单个皮肤 |
| Bedrock Skin Pack | `skin-pack.mcpack` | 在 Bedrock 中作为皮肤包导入 |
| 编辑项目 | `project.mcskin.json` | 继续编辑、迁移和备份 |

## 6. 核心用户流程

### 6.1 新建皮肤

1. 用户选择 `64×64`、模型 `Classic` 或 `Slim`。
2. 系统创建空白皮肤和默认透明外层。
3. 页面展示 2D UV 画布和 3D 人物。
4. 用户开始绘制。
5. 系统自动保存项目状态。

### 6.2 导入已有皮肤

1. 用户选择 PNG 文件或拖拽文件。
2. 系统读取图片尺寸、透明度和像素数据。
3. 系统识别 64×32、64×64 或 128×128。
4. 如果是 64×32，提示转换为现代 64×64 格式。
5. 用户选择 Classic 或 Slim；无法可靠推断时必须让用户确认。
6. 系统加载 2D 和 3D 预览。
7. 系统显示潜在兼容性问题。

### 6.3 编辑与保存

1. 用户在 2D 画布修改像素，3D 预览实时更新。
2. 用户可以切换基础层、外层和身体部位。
3. 每次修改形成一个可撤销历史记录。
4. 页面标题栏显示 `已保存`、`保存中` 或 `本地未保存`。
5. 用户可以下载 PNG 或项目文件。

### 6.4 AI 协作

1. 用户输入自然语言需求，例如“把衣服改成深蓝色宇航服，保留脸部”。
2. AI 读取当前项目的模型、分辨率、选中区域和颜色统计。
3. AI 生成修改计划，而不是立即修改。
4. 用户查看预计修改区域和前后预览。
5. 用户确认后，AI 调用 `skin.apply_patch` 等受控工具。
6. 系统将修改写入历史记录，并允许一键撤销。

## 7. 编辑器功能需求

### 7.1 2D 像素画布

- 64×64 UV 模板。
- 128×128 高分辨率模式预留。
- 像素网格显示和隐藏。
- 1×、2×、4×、8×缩放。
- 铅笔、橡皮擦、吸管、油漆桶。
- RGBA 颜色选择器和最近使用颜色。
- 左右镜像绘制。
- 选区清空、复制、粘贴和水平翻转。
- 身体部位 hover 高亮。
- 当前像素坐标和颜色信息。

### 7.2 图层和身体部位

- 基础层：头、身体、手臂、腿。
- 外层：帽子、外套、袖子、裤腿。
- 单独显示或隐藏外层。
- 单独锁定基础层或外层。
- 身体部位选择后同步定位 UV 区域。
- Slim 模型的手臂宽度必须与 3D 几何体一致。

### 7.3 3D 预览

- Steve/Classic 模型。
- Alex/Slim 模型。
- 鼠标或触摸旋转。
- 缩放。
- 正面、背面、左右侧面预设。
- 站立、行走姿态预览可作为后续能力。
- 外层显示开关。
- 选中身体部位的高亮反馈。

3D 纹理使用编辑画布作为 `THREE.CanvasTexture`，像素修改后更新纹理。Three.js 官方文档明确支持直接从 Canvas 创建纹理。[Three.js CanvasTexture 文档](https://threejs.org/docs/pages/CanvasTexture.html)

### 7.4 历史记录

- 撤销和重做。
- 历史记录按操作合并，避免每个拖动事件都生成一条记录。
- AI 修改作为单独的事务记录。
- 项目文件保存最近一次状态。
- 页面刷新后恢复最近项目。

## 8. 数据模型

### 8.1 项目模型

```json
{
  "formatVersion": 1,
  "id": "uuid",
  "name": "Blue Explorer",
  "model": "classic",
  "resolution": 64,
  "texture": {
    "mime": "image/png",
    "width": 64,
    "height": 64,
    "pixels": "base64"
  },
  "history": [],
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

### 8.2 修改记录

```json
{
  "id": "uuid",
  "source": "user | ai | import",
  "operation": "paint | erase | fill | mirror | palette | import",
  "targets": ["head", "body"],
  "before": "patch",
  "after": "patch",
  "createdAt": "ISO-8601"
}
```

### 8.3 保存策略

首期使用浏览器本地存储：

- IndexedDB 保存完整项目和历史记录。
- `localStorage` 只保存最近打开项目的索引和偏好设置。
- 用户可下载 `.mcskin.json` 作为可迁移备份。
- 不上传用户皮肤到服务器，除非用户主动使用需要云端处理的 AI 功能。

当前网站架构是纯前端，因此云端账号同步、跨设备项目列表和服务端 AI 需要后续增加独立 API，不应伪装成首期已有能力。

## 9. AI 与工具调用需求

### 9.1 AI 的职责

- 解释用户的设计意图。
- 读取项目结构和当前选区。
- 生成配色方案和局部设计建议。
- 将自然语言转换成结构化皮肤操作。
- 调用格式校验工具。
- 解释导出失败原因。

### 9.2 首期工具

```txt
skin.read_state
skin.inspect_uv
skin.validate
skin.apply_patch
skin.apply_palette
skin.mirror_region
skin.clear_region
skin.export_preview
```

### 9.3 工具约束

每个工具必须声明：

- 名称。
- 输入 JSON Schema。
- 输出 JSON Schema。
- 只读或修改权限。
- 是否需要用户确认。
- 超时和错误返回结构。
- 是否允许访问外部资源。

示例：

```json
{
  "operation": "apply_palette",
  "targets": ["body", "left_arm", "right_arm"],
  "palette": ["#0e66c8", "#1d2127", "#dcdfe3"],
  "preserve": ["head.base", "face"]
}
```

AI 修改必须经过：

```txt
用户意图
  → 读取项目
  → 生成修改计划
  → 用户确认
  → 调用工具
  → 生成预览
  → 写入历史
  → 校验并保存
```

“我的工具”需要通过 Adapter 接入。当前仓库没有已发现的 AI 服务、工具注册中心或后端 API，因此后续需要明确工具是 MCP Server、HTTP API、本地命令还是其他 Agent 能力。

### 9.4 AI 暂不支持

- 未确认直接修改皮肤。
- 直接执行任意本地命令。
- 直接上传或覆盖用户账号中的皮肤。
- 直接把普通图片当作合法 Minecraft UV 皮肤。
- 绕过 PNG、尺寸、透明度和模型校验。

## 10. 导出校验

导出 Java 文件前检查：

- PNG MIME 类型。
- 尺寸为 64×64 或合法转换后的格式。
- 模型为 Classic 或 Slim。
- 基础层不包含非法透明像素。
- 外层透明度符合目标版本预期。

导出 Bedrock Skin Pack 前检查：

- 纹理为 64×64 或 128×128。
- `manifest.json` 合法。
- 两个 UUID 不重复。
- `skins.json` 的模型值合法。
- 纹理文件存在且被引用。
- 语言键完整。
- `.mcpack` 内部目录结构正确。

校验分为：

- 阻断错误：不允许导出。
- 警告：允许导出，但必须明确提示。

## 11. 页面信息架构

```txt
Minecraft Skin Studio
├── 顶部：项目名 / 保存状态 / 导入 / 导出
├── 左侧：编辑工具栏
├── 中央：3D 人物预览
├── 右侧：AI 助手与修改计划
└── 底部：2D UV 画布 / 图层 / 身体部位 / 校验状态
```

移动端首期不承诺完整编辑体验。移动端至少提供：

- 项目查看。
- 3D 预览。
- PNG 导入和导出。
- 简单颜色修改。

完整像素编辑优先保证桌面端 1280px 以上视口。

## 12. 技术拆分

```txt
Skin Core
├── PNG 读取与导出
├── 64×32 → 64×64 转换
├── UV 区域定义
├── Classic / Slim 模型映射
├── 像素操作
├── 历史记录
├── Java 校验
└── Bedrock Skin Pack 打包

Editor UI
├── Vue 页面
├── 2D Canvas 编辑器
├── Three.js 预览
├── 项目保存
├── 导入导出
└── 状态反馈

AI Orchestrator
├── 对话上下文
├── 修改计划
├── 工具权限
├── 用户确认
├── 工具调用日志
└── 失败恢复
```

Skin Core 必须独立于 Vue 页面，避免导出、AI 工具和自动化测试与 UI 强耦合。

## 13. 版本计划

### V0：技术验证

- 64×64 PNG 读写。
- Classic/Slim UV 映射。
- Canvas 与 Three.js 纹理同步。
- 基础层和外层预览。
- 浏览器本地保存。

### V1：可用编辑器

- 完整 2D 工具。
- 撤销重做。
- 导入 64×32、64×64、128×128。
- Java PNG 导出。
- 项目文件导入导出。
- Java 兼容性校验。

### V2：Bedrock 支持

- Bedrock 128×128。
- Skin Pack 打包。
- `.mcpack` 导出。
- Bedrock 校验和错误提示。

### V3：AI 协作

- AI 读取项目状态。
- AI 生成修改计划。
- 用户确认后调用皮肤工具。
- 工具调用日志。
- 接入用户提供的外部工具 Adapter。

## 14. 验收标准

### 文件与兼容性

- 导出的 Java PNG 可通过官方 Profile 或 Launcher 上传。
- Classic 和 Slim 的手臂宽度正确。
- 64×32 文件可以转换为合法的 64×64 项目。
- Bedrock Skin Pack 生成所需 JSON、PNG 和语言文件。
- 无效尺寸、模型或文件引用会阻止导出。

### 编辑体验

- 2D 与 3D 预览实时同步。
- 基础层和外层可独立编辑。
- 所有用户和 AI 修改均可撤销。
- 刷新页面后可恢复最近项目。
- 项目文件可以重新导入并保持纹理和元数据。

### AI 体验

- AI 能理解当前模型、分辨率、图层和选区。
- AI 先展示修改计划，用户确认后才执行。
- 工具调用有明确日志和错误提示。
- 未授权工具无法执行。
- AI 无法绕过导出校验。

### 工程验收

- Vue 前端 `npm run build` 通过。
- Skin Core 有针对 UV、尺寸、透明度和导出的单元测试。
- Three.js 组件卸载时释放纹理、材质、几何体和事件监听器。
- 桌面端和移动端不出现横向溢出。
- 不引入新的暖色、渐变背景、重阴影或第三字体。

## 15. 关键风险与决策

| 风险 | 影响 | 决策 |
| --- | --- | --- |
| Java 与 Bedrock 规则不同 | 导出的文件无法使用 | 按目标版本分别校验和导出 |
| AI 生成普通图片而非 UV 纹理 | 皮肤结构错位 | AI 首期输出结构化像素操作，不直接覆盖图片 |
| 当前没有后端 | 无法实现云同步和安全 AI 代理 | 首期本地保存，AI 接口先抽象 Adapter |
| 浏览器无法直接替用户登录游戏账号 | 无法承诺一键应用 | 产品承诺导出可用，不承诺自动上传账号 |
| 128×128 兼容边界复杂 | Java 用户可能无法使用 | 首期优先 64×64，Bedrock 单独支持 128×128 |
| 工具权限过宽 | 可能修改或泄露用户数据 | 工具白名单、Schema、确认和日志必须内置 |

## 16. 待确认事项

1. “我的工具”具体是 MCP、HTTP API、本地命令，还是现有 Agent。
2. 首期优先 Java、Bedrock，还是两者同时支持。
3. 是否接受首期只做浏览器本地保存，不做账号登录和云同步。
4. AI 是否需要图片生成，还是先做结构化编辑和设计建议。
5. 是否需要支持用户发布和分享皮肤。

## 17. 研究依据

- [Minecraft Java Edition：创建和上传自定义皮肤](https://help.minecraft.net/hc/en-us/articles/4408894664461-Make-a-Custom-Skin-in-Minecraft-Java-Edition)
- [Microsoft：Packaging a Skin Pack](https://learn.microsoft.com/en-us/minecraft/creator/documents/packagingaskinpack?view=minecraft-bedrock-stable)
- [Microsoft：Skin Pack Validation Rules](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/mctoolsvalreference/cspj?view=minecraft-bedrock-stable)
- [Minecraft：What is a Minecraft Skin?](https://www.minecraft.net/en-us/article/what-is-minecraft-skin)
- [NovaSkin：About and editor capabilities](https://minecraft.novaskin.me/about?after=24)
- [Three.js：CanvasTexture](https://threejs.org/docs/pages/CanvasTexture.html)
- [OpenAI：Responses API tools](https://platform.openai.com/docs/api-reference/responses)
- [BLOCK：Minecraft 角色到皮肤生成研究](https://arxiv.org/abs/2603.03964)
