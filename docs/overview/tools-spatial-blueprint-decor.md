# Tools Spatial Blueprint Decor Overview

## 背景

当前 `LayeredSpatialIndex` 已经形成一套干净、确定、秩序感很强的蓝图结构：三层平面、规则网格、垂直 stem、项目 label 和左侧 layer rail 都比较清晰。

后续目标不是重做 label，也不是把界面做旧、做脏，而是在现有干净蓝图上叠加“制图过程痕迹”，让它从定稿图纸变成更接近参考图的“草稿型参考蓝图”。

本轮讨论明确：项目 label 形态暂不调整。后续所有增强都优先发生在结构线、节点、背景推演层和档案辅助层。

## 差异诊断

### 1. 当前版本偏“定稿”

当前画面的问题不是不好看，而是太完整、太确定。

- 平面边界清楚，矩形关系稳定。
- 网格密度和透明度较均匀。
- 垂直 stem 主要服务项目定位。
- 多数线条都有明确功能，没有太多推演残留。

因此它读起来像一个已经清理过的 CAD / interface diagram。

### 2. 参考图偏“推演现场”

参考图的气质来自大量非主结构线。

- 平面外有延伸线和投影线。
- 垂直线穿过层级后继续向上下延展。
- 节点上有小圆、空心圆、十字、短刻度、target mark。
- 局部边线有轻微重复，像被反复描绘过。
- 背景里有极淡的圆规弧线、机械/雕塑线稿和坐标标记。

它不是更“脏”，而是保留了更多 construction marks。

### 3. 当前空间主要发生在平面内部

当前视觉重心集中在三个矩形层面内。参考图的空间更大，结构线会延伸到画面边缘、侧栏附近和背景层，像是一个更大系统的局部截面。

后续应让线条从平面内“溢出”到平面外，但透明度必须很低，避免破坏 Personal Operating System 的冷静、克制和留白。

## 设计原则

### 保留

- 保留当前项目 label 形态。
- 保留 cool-white 背景、cool-blue accent、Geist Mono 技术气质。
- 保留三层空间索引的主结构。
- 保留当前干净、有序的 Personal Operating System 基调。

### 增加

- 增加制图辅助线，而不是装饰线。
- 增加推演痕迹，而不是随机噪声。
- 增加空间外延，而不是堆满细节。
- 增加极淡背景层，而不是强视觉插画。

### 避免

- 不做暖色旧纸、羊皮纸、复古污渍。
- 不做随机手绘抖动。
- 不用高饱和蓝铺满画面。
- 不让背景图案抢过项目索引。
- 不把 label 改成参考图里的盒子样式。

## 推进路线

### Phase 1: Construction Overlay

目标：最小风险地把干净蓝图推向“草稿蓝图”。

实现方向：

- 在现有 Three.js scene 里增加一组 `construction` / `draft` 线层。
- 为每个 layer plane 的边缘增加向外延伸的辅助线。
- 让少量 lattice columns 穿过顶部和底部后继续延展。
- 给部分平面边缘增加轻微错位的 ghost duplicate line。
- 增加少量从关键节点发散到远处的投影线。

建议参数：

- 主结构维持当前透明度。
- construction line opacity 控制在 `0.035` 到 `0.12`。
- 线条颜色优先使用 `colors.line` / `colors.muted` / `colors.blueSoft`，不要引入新色。
- 延伸线不需要每个节点都有，控制在 20% 到 35% 的 lattice points。

验收标准：

- 一眼仍然是干净蓝图。
- 细看能看到推演线、延伸线、重复边线。
- 不影响项目 label 可读性。
- 不让画面变成噪声网。

### Phase 2: Node Grammar

目标：让节点读起来更像制图符号系统，而不是单纯网格交点。

实现方向：

- 在部分网格交点加入小圆、空心圆、短 tick、十字或 target mark。
- 对 layer corners 加更明确的 reference nodes。
- 对项目 stem 底部增加更精密的 washer / anchor dot / tiny shadow。
- 让 archived / inactive 类型节点如果未来恢复，可以有更弱的空心符号。

建议控制：

- 节点符号要小，作为结构细节存在。
- 同屏不要超过 3 种节点语法。
- 项目底部实心圆点继续作为 entry point，不要被其它节点抢主次。

验收标准：

- 节点系统有“制图语言”，不是随机小装饰。
- hover 时项目节点仍然是最容易被识别的交互目标。
- 层级 rail、项目 stem、网格交点三者的主次清楚。

### Phase 3: Background Draft Layer

目标：把画面从一个组件推进成一个档案图纸场景。

实现方向：

- 用极淡 SVG overlay 或 canvas layer 添加圆规弧线、同心圆、轴线。
- 在左侧或中后景加入很低透明度的机械/雕塑线稿感背景。
- 增加少量坐标标记，例如 `+X`、`+Y`、`+Z`、archive axis。
- 增加画面边缘的 faint boundary lines，让结构延伸到页面外。

建议参数：

- 背景层 opacity 控制在 `0.025` 到 `0.08`。
- 背景图形不参与 hover，不承载交互。
- 背景图形应该被主结构压住，不能成为第一视觉焦点。

验收标准：

- 页面开始有“图纸档案”的环境感。
- 背景只在停留观察时被看见。
- 左侧信息区和主索引之间的空间关系更完整。

### Phase 4: Blueprint Meta Layer

目标：用少量文字和坐标信息补齐参考图里的系统感。

实现方向：

- 在主画面边缘加入极小的坐标、比例、layer note。
- 在底部图例中解释 `X / Y / Z / +` 的空间含义。
- 给 construction layer 增加不抢眼的说明性 meta text。
- 让这些文字保持 mono、uppercase、低透明度。

建议控制：

- meta text 只服务氛围和结构理解。
- 不写大段说明，不把页面变成教程。
- 移动端可以隐藏多数 meta layer。

验收标准：

- 档案系统感更强。
- 没有破坏主页面的留白。
- 不增加用户阅读负担。

## 优先级建议

1. 先做 Phase 1。
2. Phase 1 通过后再做 Phase 2。
3. Phase 3 需要谨慎，建议单独开一版视觉试验。
4. Phase 4 最后补，它依赖前三层的视觉密度。

不要一口气把所有草稿层都加上。最合适的节奏是每次只增加一种“推演痕迹”，用截图比较是否仍然克制。

## 实现切入点

当前主要文件：

- `jacory-space-frontend/src/components/tools/LayeredSpatialIndex.vue`

可能新增的内部函数：

- `buildConstructionOverlay(colors, statics)`
- `buildDraftExtensions(colors, statics)`
- `buildNodeGrammar(colors, statics)`

建议挂载方式：

- construction / draft lines 可以作为独立 `THREE.Group` 加入 scene。
- 需要跟随 layer fade 的线可以加到对应 layer group。
- 跨 layer 的长投影线可以加入 skeleton group。
- 背景 SVG meta layer 可以放在 overlay DOM 中，避免过度挤压 Three.js scene。

## 验收清单

- [ ] label 形态没有被改动。
- [ ] 主结构仍然清楚，construction marks 不抢焦点。
- [ ] 画面仍是 cool-white / cool-blue / mono technical mood。
- [ ] 没有暖色、复古纸张、脏污纹理。
- [ ] 没有高密度随机噪声。
- [ ] hover 和 click 交互不受影响。
- [ ] `npm run build` 通过。
- [ ] 桌面截图和参考图对比时，能明显看到“制图过程痕迹”增加。