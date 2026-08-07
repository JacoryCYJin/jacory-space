# 复古信号文字页面技术说明

本文档记录 `/experiments/retro-futurism` 当前已经落地的 CRT 文字成像架构。它只描述源码中的正式实现，不把历史试验、已删除的诊断代码或尚未设计的 Chroma 方案写成现状。

## 当前状态

页面由一个播放状态父组件和四个独立视觉层组成：

```text
RetroFuturismSignalStudy.vue
├─ CrtChromaLayer.vue
├─ CrtPhosphorDiffusionLayer.vue
├─ CrtLumaLayer.vue
└─ CrtMediumLayer.vue
```

`RetroFuturismSignalStudy.vue` 统一保存文本、字符索引、逐字播放状态和屏幕级背景效果。四层不维护计时器，也不相互调用；它们只接收父组件已计算好的显示状态。

当前基线是“四层已拆分、Chroma 空输出”的版本：页面不包含共享扫描坐标接线、扫描 gate 或红青色层。后续重新设计色度时，必须从这个无色基线单独建立方案，不能把试验性输出写回 Luma、Phosphor 或 Medium。

当前 CSS 合成顺序固定为：

| 层 | Root class | z-index | 当前状态 |
| --- | --- | --- | --- |
| CRT Chroma | `.signal-chroma-glyphs` | `0` | 空视觉输出；仅保留未来模拟视频色度的正式挂载位置。 |
| CRT Phosphor Diffusion | `.signal-phosphor-diffusion-glyphs` | `1` | 已确认的无色 CRT 光学 / 磷光扩散。 |
| CRT Luma / Core | `.signal-luma-glyphs` | `2` | 灰白主体、占位块、光标与前景采样。 |
| CRT Medium | `.signal-medium-glyphs` | `3` | 中性颗粒、扫描变化与低频亮暗调制。 |

屏幕级 `.signal-noise`、`.signal-vignette`、`.signal-letterbox` 仍由父组件管理，层级和参数不属于四个文字成像层的职责。

## 文件职责

| 文件 | 作用 |
| --- | --- |
| [`jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue`](../../jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue) | 页面布局、文本内容、行结构、全局字符索引、`revealedCount`、`activeLineIndex`、逐字计时器、reduced-motion 和屏幕级背景。 |
| [`CrtChromaLayer.vue`](../../jacory-space-frontend/src/components/experiments/retro-futurism/CrtChromaLayer.vue) | 空的 Chroma root；当前不包含字形、SVG filter 或色彩输出。 |
| [`CrtPhosphorDiffusionLayer.vue`](../../jacory-space-frontend/src/components/experiments/retro-futurism/CrtPhosphorDiffusionLayer.vue) | 无色扩散字形副本、三档 Phosphor filter 和该层自己的布局 / 源 Alpha 样式。 |
| [`CrtLumaLayer.vue`](../../jacory-space-frontend/src/components/experiments/retro-futurism/CrtLumaLayer.vue) | 灰白 Luma 字形、占位块、光标、A/B/C 采样 filter、前景样式和光标闪烁。 |
| [`CrtMediumLayer.vue`](../../jacory-space-frontend/src/components/experiments/retro-futurism/CrtMediumLayer.vue) | Medium 字形副本、三档 Medium filter、`soft-light` 合成和该层源 Alpha 样式。 |
| [`SourceHanSansSC-VF.ttf.woff2`](../../jacory-space-frontend/src/assets/fonts/SourceHanSansSC-VF.ttf.woff2) | 中文字形使用的本地 Source Han Sans SC 可变字体。 |

四个组件当前故意保留重复的行、段落、cell 和源字形 CSS。它们是从原页面逐项迁出的独立实现；不要在未重新验证画面的前提下抽取通用 layer、glyph renderer、composable、共享 CSS 或 SVG wrapper。

## 播放状态与 Props

父组件建立 `textLayout`、`lines`、`characters` 与全局字符 `index`，并使用 `revealedCount` 和 `activeLineIndex` 决定每一格的显示状态：

- 已显示格：真实字符；
- 当前格：带下划线光标的占位块；
- 后续格：普通占位块；
- 未开始的行：不渲染。

`CrtLumaLayer` 接收 `textLayout`、`characters`、`revealedCount`、`isLineStarted`、`isChineseCharacter`、`signalCellStyle`、`signalCellVariant`。后两项只服务灰白前景的稳定 A/B/C 采样与局部变量。

`CrtPhosphorDiffusionLayer` 和 `CrtMediumLayer` 接收同一份 `textLayout`、`revealedCount`、`isLineStarted`、`isChineseCharacter`，以生成几何与播放状态一致的白色 Alpha 克隆。`CrtChromaLayer` 当前无 props，因为它没有视觉输出。

逐字逻辑只在父组件中存在：页面挂载后等待 `900ms`，行内按 `88ms` 替换字符，行边界停顿 `720ms`；`prefers-reduced-motion: reduce` 时直接显示完整文字。四个 layer 不维护自己的状态、随机数或计时器。

## CRT Luma / Core

Luma 只负责可读的灰白主体：

- `.signal-luma-char`：真实文字；
- `.signal-luma-placeholder`：未解码占位块；
- `.signal-luma-caret`：当前格下方的白色光标；
- `signal-foreground-sampling-a/b/c`：A/B/C 稳定前景采样。

三个采样 filter 都是 `feTurbulence → feDisplacementMap`，区域均为 `x="-16%" y="-16%" width="132%" height="132%"`：

| 变体 | baseFrequency | seed | scale |
| --- | --- | --- | --- |
| A | `.72 .16` | `13` | `.34` |
| B | `.66 .19` | `29` | `.38` |
| C | `.78 .13` | `47` | `.31` |

文字、占位块和光标的 blur、drop-shadow、box-shadow、灰白 gradient、局部横纹与稳定变量均属于 Luma；当前参数是已确认的基线。`signalCellVariant(character)` 与 `signalCellStyle(character)` 仅以全局 `character.index` 为输入，因此同一格从占位块变为真实字时不会跳变。

## CRT Phosphor Diffusion

Phosphor 是位于 Luma 下方的无色 CRT 光学 / 磷光扩散层，不是 Chroma。

- root：`.signal-phosphor-diffusion-glyphs`；`z-index: 1`、`mix-blend-mode: normal`、`overflow: visible`；
- filter：`signal-phosphor-diffusion-small`、`-medium`、`-large`；
- filter region：`x="-4%" y="-8%" width="108%" height="116%"`；
- 坐标：`primitiveUnits="userSpaceOnUse"`、`color-interpolation-filters="sRGB"`；
- 断点：默认 small、`sm` medium、`md` large。

每档均保留两路方向性 Alpha 几何：`SourceAlpha → offset → OUT / IN → morphology → 内带 blur → merge`。leading 路径当前 flood 为 `#d1d1d1`、`opacity=".58"`；trailing 路径为 `#8e8e8e`、`opacity=".50"`。它们是当前无色柔化基线的既有中性输出，不得在 Chroma 设计前改回红青。

| filter | leading offset / dilate / erode / blur | trailing offset / dilate / erode / blur |
| --- | --- | --- |
| small | `-.63/-.108`；`.58/.22`；`.36/.075`；`.1/.035` | `.72/.108`；`.62/.24`；`.4/.08`；`.1/.035` |
| medium | `-.7/-.12`；`.64/.24`；`.4/.085`；`.11/.04` | `.8/.12`；`.68/.26`；`.44/.095`；`.11/.04` |
| large | `-1.05/-.18`；`.9/.34`；`.6/.13`；`.16/.055` | `1.2/.18`；`.96/.36`；`.66/.14`；`.16/.055` |

内带使用 `phosphorScanField`：`fractalNoise`、`baseFrequency=".003 1.45"`、`numOctaves="1"`、`seed="167"`，Alpha 映射为 `tableValues=".66 1"`；外带不使用该蒙版。所有上述参数均冻结，不能作为未来 Chroma 的调节入口。

## CRT Chroma

`CrtChromaLayer` 当前只输出空的绝对定位 root，保留 `z-index: 0` 与相同的居中坐标。它不复用 Phosphor 的 SVG filter、字形副本或中性 flood。

后续 Chroma 才会独立承担模拟视频色度错位、左上青偏移、右下红偏移、色度延迟、串扰和 color bleed。本轮及当前正式页面没有任何新的红青视觉实现。

## CRT Medium

Medium 是 Luma 上方的共享中性显示介质：

- root：`.signal-medium-glyphs`；`z-index: 3`、`opacity: .68`、`mix-blend-mode: soft-light`；
- filter：`signal-shared-medium-small`、`-medium`、`-large`；
- filter region：`x="-2%" y="-3%" width="104%" height="106%"`；
- 断点：默认 small、`sm` medium、`md` large。

三个 filter 的结构保持不变：

```text
grainField + scanField
→ arithmetic 合成 rawMediumField
→ RGB 线性映射为 neutralMediumField

SourceAlpha
→ erode → GaussianBlur → IN SourceAlpha
→ IN illumination Alpha
→ contentAlpha

neutralMediumField IN contentAlpha
→ soft-light 合成
```

| 节点 | 当前值 |
| --- | --- |
| `grainField` | `fractalNoise`；`.42 .56`；`numOctaves=1`；`seed=101` |
| `scanField` | `fractalNoise`；`.003 1.45`；`numOctaves=1`；`seed=127` |
| `rawMediumField` | arithmetic：`k1=0 k2=.5 k3=.5 k4=0` |
| `neutralMediumField` | RGB `slope=.16`、`intercept=.42` |
| `illuminationField` | `fractalNoise`；`.018 .026`；`numOctaves=1`；`seed=139` |
| `modulatedTextAlpha` | `tableValues=".88 1"` |
| 内容 Alpha | small：erode `.52/.22`、blur `.34/.14`；medium：`.58/.24`、`.38/.16`；large：`.86/.36`、`.56/.24` |

因为 filter 作用于整块同步字形副本，Medium 的 grain、scanline 与低频 illumination 坐标跨字符和跨行连续；它不填充文本外的空白，也不输出完整白色字形。

## 坐标、filter 与组件边界

每个视觉组件以原 layer 的绝对定位 `<div>` 为唯一 root：`top/left: 50%`、`transform: translate(-50%, -50%)`、`width: fit-content`、`max-width: min(52.5rem, calc(100% - 2.5rem))`、`line-height: 1.3`、`letter-spacing: 0`。组件内的零尺寸 `.signal-filter-definitions` SVG 只提供本层 filter definitions，不参与文字排版。

这些 root 仍是 `.signal-copy` 的直接视觉后代；组件化没有新增可见包裹层或新的 stacking context。SVG filter ID 在当前页面中各只定义一次，CSS 中的 `url("#...")` 引用保持不变。

## 调整边界

- 调灰白主体、A/B/C 采样、blur 或 shadow：仅改 `CrtLumaLayer.vue`。
- 调当前无色扩散：仅改 `CrtPhosphorDiffusionLayer.vue`；该层当前冻结。
- 设计红青色度：只在 `CrtChromaLayer.vue` 新建独立输出；不得重染或复用 Phosphor。
- 调扫描纹、颗粒或低频亮暗：仅改 `CrtMediumLayer.vue`。
- 调文本、行结构、播放节奏、reduced-motion 或屏幕背景：仅改父组件。

当前不使用诊断查询参数。不要把 Chroma 的空状态、Phosphor 的中性色扩散或 Medium 的中性纹理误称为已完成红青色散。
