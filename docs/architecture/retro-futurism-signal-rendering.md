# 复古信号文字页面技术说明

本文档记录 `/experiments/retro-futurism` 的现行实现。数值、选择器与 SVG 节点均按当前工作区的 `RetroFuturismSignalStudy.vue` 核对；不以历史版本或对话中的中间试验参数补写。

## 核对基线

| 项目 | 核对结果 |
| --- | --- |
| 核对源文件 | [`jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue`](../../jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue) |
| Git 分支 | `feature/shared-chromatic-signal` |
| HEAD commit | `6eac95284275` |
| 核对时工作区 | 有未提交修改：页面实现与本说明文档。 |
| 本文档对应状态 | 对应包含当前未提交修改的工作区版本，而非仅 HEAD 提交版本。 |

## 1. 当前实现概述

页面模拟文字经老式显示设备输出的过程：真实文字、白色占位块和下划线光标逐格出现；灰白主体保持可读，边缘再出现克制的红青通道残差、柔焦、溢光、颗粒与横纹。

当前渲染由三个互不混淆的层组成：

1. **字符前景层**（`.signal-glyphs`，`z-index: 2`）：输出灰白真实文字、占位块、光标与逐字状态，并保留采样扰动、柔焦和白灰溢光。
2. **共享红青色散层**（`.signal-chromatic-residual-glyphs`，`z-index: 1`）：使用与前景同步的无色 Alpha 克隆，经 SVG 只输出偏移轮廓之外的红青边缘残差。它在前景后方，前景白芯会盖住彩色层的重叠内部。
3. **共享中性介质层**（`.signal-medium-glyphs`，`z-index: 3`）：使用另一份同步的无色 Alpha 克隆，生成跨字符、跨行连续的中性颗粒、横纹与低频亮暗场，再裁切回内容本身。

两份无色克隆都复用 `textLayout`、`isLineStarted(line)`、`revealedCount` 和文字 / 当前占位块 / 后续占位块的同一条件分支；因此文字、占位块和光标同时进入共享色散与共享介质。

## 2. 当前层级与职责

### 字符前景层

- `.signal-char`：真实灰白文字主体；通过多层背景、`background-clip: text`、A / B / C 采样滤镜、`blur()` 与 `drop-shadow()` 形成局部信号质感。
- `.signal-placeholder`：后续字符位的白色占位块；保留自身柔焦、白灰溢光与极弱的内部红青短横纹。
- `.signal-caret`：当前占位块下的白色实心下划线；拥有前景采样、柔焦和白灰 / 红青 `box-shadow`。
- `revealedCount` 与 `activeLineIndex`：决定一个字符格显示真实字、带光标的当前占位块，或普通占位块。
- A / B / C：仅产生稳定的低幅采样、柔焦和白灰溢光差异，不生成主导性的中性横纹、颗粒或共享色散。

### 共享红青色散层

- `.signal-chromatic-residual-glyphs` 只提供白色 `color` / `background` 所形成的 `SourceAlpha`；不包含前景滤镜、阴影、局部纹理或彩色伪元素。
- `#signal-shared-chromatic-residual-*` 分别对整块 Alpha 做左上青色与右下红色偏移，再使用 `offset(SourceAlpha) OUT SourceAlpha` 只留下偏移后露在原始轮廓外部的区域。
- 滤镜最终只 `feMerge` 青、红残差，**不**输出 `SourceGraphic`、完整 `SourceAlpha`、完整红字或完整青字。

### 共享中性介质层

- `#signal-shared-medium` 以整个无色克隆的坐标生成连续颗粒、横纹和低频亮暗调制。
- 最终以克隆的内容 Alpha 裁切，字符间距、行距和段落空白没有 Alpha，因此不会被纹理填亮。

### 有意保留的局部重叠

共享中性介质层是连续中性横纹、颗粒与整体亮暗变化的主要来源。字符层仍保留少量单格背景横纹、径向颗粒与 `--cell-core-light`，只用于避免每个格完全均质；这部分不应增强为主要显示介质。占位块 `::after` 的少量红青短横纹是局部色差，不属于中性共享纹理，因此保留。

## 3. 当前关键参数

### 前景、排版与动画

| 对象 | 入口 | 当前值 | 作用 |
| --- | --- | --- | --- |
| 页面与纸白 | `.signal-study` | `--signal-ink: #030405`；`--signal-paper: #edf0e8` | 近黑显示面与灰白主体基色。 |
| 文本定位 | 三个文字层 | `top: 50%`、`left: 50%`、`transform: translate(-50%, -50%)` | 整个文本区域横纵居中，内部仍 `text-left`。 |
| 文本宽度 | 三个文字层 | `max-width: min(52.5rem, calc(100% - 2.5rem))` | 指定行可保持较长，窄屏仍允许自然折行。 |
| 字符格与行高 | `.signal-cell`、`.signal-medium-cell` | `width: 1em`；`height / line-height: 1.3em` | 前景与无色克隆严格共享几何。 |
| 字距 | 相邻字符格 | 普通 `margin-left: 0.22em`；中文格后 `0.3em` | 真实字、占位块和光标的字符格共用实际间隔。 |
| 普通行距 | `.signal-paragraph` | `row-gap: 0.38em` | 指定行之间的间隔。 |
| 段间距 | `.signal-paragraph + .signal-paragraph` | `margin-top: 1.6em` | 大于普通行距的段落留白。 |
| 首次等待 / 逐字 / 行停顿 | `beginReveal()` | `900ms` / `88ms` / `720ms` | 首行静默、行内替换节奏、下一行出现前的独立停顿。 |
| 诊断固定帧 | `diagnosticFrame` | `revealedCount: 25`；`activeLineIndex: 1` | 五个诊断模式保持同一文字、占位块与光标状态。 |

### 前景柔焦、溢光与采样变体

| 对象 | A | B（默认） | C |
| --- | --- | --- | --- |
| 真实文字 `.signal-char` | `blur(0.03em)`；白灰 `drop-shadow(0 0 0.2em rgba(237,240,232,.14))`；`sampling-a` | `blur(0.032em)`；`0 0 0.22em rgba(237,240,232,.15)`；`sampling-b` | `blur(0.034em)`；`0 0 0.24em rgba(237,240,232,.16)`；`sampling-c` |
| 占位块 `.signal-placeholder` | `blur(0.028em)`；`drop-shadow(0 0 0.2em rgba(237,240,232,.12))` | `blur(0.028em)`；`0 0 0.22em rgba(237,240,232,.14)` | `blur(0.028em)`；`0 0 0.24em rgba(237,240,232,.16)` |
| 光标 `.signal-caret` | `blur(0.024em)`；`drop-shadow(0 0 0.14em rgba(237,240,232,.14))` | `blur(0.024em)`；`0 0 0.16em rgba(237,240,232,.16)` | `blur(0.024em)`；`0 0 0.18em rgba(237,240,232,.18)` |
| SVG 采样 | `baseFrequency="0.72 0.16"`、`seed="13"`、`scale="0.34"` | `0.66 0.19`、`29`、`0.38` | `0.78 0.13`、`47`、`0.31` |

三个 `#signal-foreground-sampling-a/b/c` 都使用 `feDisplacementMap` 的 `R / G` 通道，滤镜区域均为 `x="-16%" y="-16%" width="132%" height="132%"`。

占位块基础几何为 `width: 0.9em`、`height: 0.98em`、`margin-top: 0.16em`、`border-radius: 0.12em`；另有 `box-shadow: 0 0 0.44em rgba(237,240,232,.18)`。光标为 `0.9em × 0.14em`，默认 `box-shadow` 为 `-0.046em 0 rgba(93,224,214,.38)`、`0.052em 0 rgba(235,93,113,.31)`、`0 0 .36em rgba(237,240,232,.22)`，闪烁为 `0.9s steps(1, end)`。

### 共享红青边缘残差

| 断点与滤镜 | 字号 | 青色偏移 `dx / dy` | 红色偏移 `dx / dy` | 着色 |
| --- | --- | --- | --- | --- |
| 默认 `#signal-shared-chromatic-residual-small` | `text-lg`（18px） | `-0.63 / -0.108` | `0.72 / 0.108` | 青 `#4ae8d7`、`flood-opacity="0.441"`；红 `#f4576f`、`flood-opacity="0.3608"` |
| `sm`，`#signal-shared-chromatic-residual-medium` | `text-xl`（20px） | `-0.7 / -0.12` | `0.8 / 0.12` | 同上 |
| `md`，`#signal-shared-chromatic-residual-large` | `text-3xl`（30px） | `-1.05 / -0.18` | `1.2 / 0.18` | 同上 |

三个共享色散滤镜均为 `primitiveUnits="userSpaceOnUse"`，区域 `x="-4%" y="-8%" width="108%" height="116%"`。因此偏移用实际 SVG 用户坐标（像素量级）写入，而非无效的 `em`；三档保持青约 `-0.035em`、红约 `+0.040em` 的水平视觉量级，纵向仅保留极轻微方向关系。色散层本身没有 CSS `opacity`、`blur()` 或额外 `transform`。

### 共享中性介质

| 节点 | 当前值 | 作用 |
| --- | --- | --- |
| `.signal-medium-glyphs` | `opacity: .68`；`mix-blend-mode: normal` | 中性纹理总强度，不将前景重混成更亮白。 |
| `grainField` | `fractalNoise`；`baseFrequency="0.42 0.56"`；`numOctaves="1"`；`seed="101"` | 跨文本块连续颗粒。 |
| `neutralGrain` | 色矩阵 Alpha `0.48` | 偏中性亮色颗粒。 |
| `scanField` | `fractalNoise`；`baseFrequency="0.003 1.45"`；`numOctaves="1"`；`seed="127"` | 跨文本块连续横向扫描变化。 |
| `scanLines` | 色矩阵 Alpha `0.32` | 中性横纹强度。 |
| 颗粒 / 横纹合成 | `feBlend mode="screen"` | 生成 `mediumField`。 |
| 低频亮暗 | `illuminationField`：`0.018 0.026`、`1`、`139`；`feFuncA tableValues="0.88 1"` | 只调制现有内容 Alpha，不创建灰白覆层。 |
| Alpha 裁切 | `SourceAlpha IN modulatedTextAlpha`；`mediumField IN contentAlpha` | 把纹理限制在文字、块和光标内。 |

### 字符级残差与占位块内部色差

- `.signal-char` 的单格中性横纹：白 `rgba(255,255,255,.025)`、暗 `rgba(59,78,75,.035)`；`background-size: 100% .16em`。
- `.signal-placeholder` 的单格中性横纹：白 `rgba(255,255,255,.025)`、暗 `rgba(66,88,84,.03)`；`background-size: 100% .17em`。
- `--cell-core-light` 是全局字符格索引的稳定值 `0.975`–`0.990`；`--cell-line-offset` 为 `0`–`.12em`；径向残差用 `--cell-grain-x/y` 的稳定相位。
- `.signal-placeholder::after` 保留 `opacity: .18` 的局部短横纹：青 `rgba(74,232,215,.22)`、红 `rgba(244,87,111,.2)`；两层宽 `40%`、高 `.15em`，经重复横向遮罩裁切，`mix-blend-mode: multiply`。它不是完整彩色矩形边框。

## 4. A / B / C 稳定变体

`signalCellVariant(character)` 使用 `stableUnit(character.index, 14)` 将**全局字符格索引**稳定映射为 A、B 或 C，而非 DOM 顺序的 `A → B → C` 循环。`stableUnit()` 不使用当前字符内容、占位 / 真实文字状态或运行时随机数。

因此某个格从白色占位块变成真实文字时，索引、变体、`--cell-core-light`、纹理相位和采样滤镜都保持不变；不会因状态替换跳变。真实文字、占位块与当前光标都继承其所在 `.signal-cell` 的同一变体。

## 5. 共享红青色散层的实现

`.signal-chromatic-residual-glyphs` 是独立的无色克隆。它复用前景的布局和状态，但 `.signal-medium-char` 只输出白色文字 Alpha，`.signal-medium-placeholder` 与 `.signal-medium-caret` 只输出白色块 Alpha。

每一个 `#signal-shared-chromatic-residual-small/medium/large` 使用同一节点流程：

1. `SourceAlpha` 经 `feOffset` 生成 `cyanOffsetAlpha`（左上）和 `redOffsetAlpha`（右下）。
2. 对每个方向使用 `feComposite operator="out"`：`in` 是偏移后的 Alpha，`in2` 是原始 `SourceAlpha`。结果即 `offset(SourceAlpha) ∩ NOT(SourceAlpha)`，只保留偏移后暴露在原轮廓外面的边缘残差。
3. `feFlood` 分别生成青色与红色涂层；对应 `feComposite operator="in"` 将色层裁到各自残差 Alpha。
4. `feMerge` 只合并 `cyanResidual` 与 `redResidual`。

滤镜最终没有 `SourceGraphic`、原始 `SourceAlpha`、未裁切偏移 Alpha 或完整彩色字形，因此正常合成中只会在前景白芯之外露出方向一致的边缘残差。真实文字、占位块与光标来自同一无色克隆，所以共用同一方向、同一参数组。占位块内部弱红青短横纹仍由前景 `.signal-placeholder::after` 单独保留。

已移除的旧方案：两份完整青 / 红 DOM 克隆、各自的 CSS `transform` 偏移、CSS `blur()`、父层 `opacity`，以及 `signal-chroma=raw` 和 `signal-chroma-offset=06/08/10` 诊断参数。它们会以完整彩色字形重叠或重影，不能稳定得到仅边缘的色散。

## 6. 共享中性介质层的实现

`.signal-medium-glyphs` 也是无色克隆，但只挂 `url(#signal-shared-medium)`，不参与红青残差生成。滤镜以整块克隆作为坐标系，故 `grainField`、`scanField` 与 `illuminationField` 可跨字、跨行连续；它们不会从每个字符格重新起算。

共享层最后两次 `feComposite operator="in"` 使用内容 Alpha 裁切。内容 Alpha 只有真实字、占位块或光标处为非零，所以字间、行间和段落空白不会被颗粒或横纹填亮。共享层不包含 `blur`、`feDisplacementMap`、扩张型 glow 或红青颜色，因而不会重新处理前景边缘。

## 7. 动画与排版逻辑

`testParagraphs` 外层表示段落、内层表示强制换行。可见字符用 `Array.from()` 建为带全局 `index` 的格；换行与段落空行不建格，因此不会产生白色占位块。

1. 挂载后等待 `900ms`，首行整排占位块已经存在。
2. `revealedCount` 每 `88ms` 前进一格：当前占位块变为真实字的同一状态更新中，光标进入下一个占位块下方。
3. 该行完成后，等待 `720ms` 才令下一行开始；下一行整排占位块同时出现，再逐格替换。
4. 最后一个字符完成后，没有“当前格”，下划线光标立即消失，不移动到文本末尾。
5. `prefers-reduced-motion: reduce` 直接显示全部文字并禁用动画。

`?signal-diagnostic=chroma` 只显示共享红青边缘残差；`core-raw` 为残差加无前景滤镜 / 阴影的灰白主体；`core-blur` 在其上仅恢复前景 blur；`core-glow` 再恢复完整前景采样与阴影，但不显示中性介质；`full` 显示全部三层。所有诊断状态使用相同的固定帧，并暂停光标与全屏噪声动画。

## 8. 参数调整指南

| 目标 | 应调整的位置 | 注意事项 |
| --- | --- | --- |
| 更模糊 / 更清晰 | `.signal-char`、`.signal-placeholder`、`.signal-caret` 的 A/B/C `blur()` | 三档一起观察；避免只让某一种变体突兀。 |
| 调白灰溢光 | 各前景 `drop-shadow()`；占位块 `box-shadow`；光标第三个 `box-shadow` | 半径或 Alpha 过大将吞没边缘残差、黏连相邻字符。 |
| 增强 / 减弱共享红青色散 | 三个 `#signal-shared-chromatic-residual-*` 的 `feFlood flood-opacity` | 先调颜色强度，不添加完整彩色克隆。 |
| 改变色散几何量 | 三个滤镜的 `feOffset dx / dy` | 需按三个字号断点同步换算；增大过多会露出可辨认的彩色重影。 |
| 增强边缘采样破碎感 | `#signal-foreground-sampling-a/b/c` 的 `feDisplacementMap scale` | 当前 `0.34 / 0.38 / 0.31`；提高会增加可见形变。 |
| 增强共享横纹 | `scanLines` 的色矩阵 Alpha、`.signal-medium-glyphs { opacity }` | 先调横纹 Alpha，再调总 opacity；过强会发灰。 |
| 增强共享颗粒 | `neutralGrain` 的色矩阵 Alpha、`grainField baseFrequency` | 共享颗粒应保持跨字连续，不以字符级颗粒替代。 |
| 调整体亮暗不均 | `illuminationField` 与 `feFuncA tableValues="0.88 1"` | 只调制内容 Alpha，不能额外叠灰白覆层。 |
| 调占位块内部质感 | `.signal-placeholder`、`::before`、`::after` 与块的 A/B/C filter | 中性纹理要轻；局部短横纹可调色但避免彩色矩形描边。 |
| 调字符局部差异 | `stableUnit()` 与 `signalCellStyle()` 的固定 salt / 范围 | 必须继续以 `character.index` 为输入，不能随显示状态变化。 |
| 调逐字与行间节奏 | `characterDelay`、`lineBoundaryPause` | 目前为 `88ms` / `720ms`；行停顿应显著长于逐字间隔。 |

## 9. 当前设计边界

- 不使用全屏强 VHS 故障、明显拖影或剧烈闪烁。
- 不输出完整红字、青字、两份彩色重影或规则彩色描边。
- 共享红青层不以 CSS `transform`、`opacity` 或 `blur()` 制作完整克隆，而只输出 SVG 差值边缘残差。
- 共享中性介质层不整体模糊、位移或重新合成前景字符。
- 字符级中性纹理只保留极轻局部残差，不重新成为唯一主要质感来源。

## 10. 当前实现相关文件

| 文件 | 作用 |
| --- | --- |
| [`jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue`](../../jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue) | 页面模板、逐字状态、三层 DOM、SVG 滤镜、前景 / 介质 / 色散样式的唯一实现文件。 |
| [`jacory-space-frontend/src/assets/fonts/SourceHanSansSC-VF.ttf.woff2`](../../jacory-space-frontend/src/assets/fonts/SourceHanSansSC-VF.ttf.woff2) | `.is-chinese` 真实文字与无色克隆使用的本地 Source Han Sans SC 可变字体资源。 |

配套说明文档（不参与页面渲染）：[`docs/architecture/retro-futurism-signal-rendering.md`](retro-futurism-signal-rendering.md)。
