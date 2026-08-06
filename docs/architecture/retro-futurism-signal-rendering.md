# 复古信号文字页面技术说明

本文档记录 `/experiments/retro-futurism` 当前保留实现的渲染与交互机制。内容以 `RetroFuturismSignalStudy.vue` 的现行代码为唯一依据；数值、选择器和 SVG 节点均按该文件核对，不追溯历史版本。

## 核对基线

| 项目 | 核对结果 |
| --- | --- |
| 核对源文件 | [`site/jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue`](../../jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue)（本机绝对路径：`/Users/euygnehcnij/Code/jacory-space/site/jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue`） |
| Git 分支 | `main` |
| HEAD commit | `3a105aea8799d46025cf7a96f26c431ee691e4fa`（`fix: 平衡信号文字介质纹理 (#133)`） |
| 核对时工作区 | 存在未提交修改：仅本说明文档 `docs/architecture/retro-futurism-signal-rendering.md` 为未跟踪文件；实现源文件没有未提交修改。 |
| 本文档对应状态 | 对应上述 HEAD 提交中的页面实现，不包含未提交的页面代码或参数修改；未提交内容仅为本配套文档。 |

## 1. 当前实现概述

页面模拟的是一段文字被老式显示设备输出的过程：灰白文字、白色占位块和下划线光标逐格出现；文字并非完全清晰的网页字体，而带有克制的柔焦、白灰溢光、局部红青色边缘、颗粒和扫描纹。

它由两张彼此分开的渲染平面组成。

- **字符层**（`.signal-glyphs`）是实际前景：负责真实文字、白色占位块、光标和逐字符状态。它保留所有必须随单个字符格移动的视觉效果，例如局部红青边缘、A / B / C 采样变体、柔焦和白灰溢光。
- **共享介质层**（`.signal-medium-glyphs`）是与前景状态同步的无色克隆。它不再绘制彩色边缘或字符级溢光，而以整段文本的连续坐标生成中性颗粒、横纹和低频亮暗变化，再裁切回文字、占位块和光标的 Alpha 内部。
- **逐字符动画**由 Vue 的 `revealedCount` 与 `activeLineIndex` 控制：当前行先整体出现白色占位块，再逐格被真实字符替换；下一行会在独立停顿后才出现。
- **局部红青边缘**只附着在字形或占位块的局部边缘，不作为完整的红字、青字或规则描边存在。
- **SVG 滤镜与 CSS 纹理**分别承担采样扰动、字形边缘提取、共享介质裁切，以及文字和块内部的渐变、细横纹和颗粒残差。

页面外层还保留低透明度全屏噪声（`.signal-noise`）、暗角（`.signal-vignette`）和上下信箱条（`.signal-letterbox`）。这些是画面环境，不参与文字内容的 Alpha 裁切与逐字动画。

## 2. 当前层级结构

### 字符层负责

`.signal-glyphs` 位于前景，`z-index: 2`。每个 `.signal-cell` 都有一个全局字符格索引，并据此获得稳定的 CSS 变量和 A / B / C 变体。

- **真实文字**：`.signal-char` 的多层 `background` 通过 `background-clip: text` 形成灰白文字主体。
- **白色占位块**：`.signal-placeholder` 代表尚未揭示的字符格；当前格内部会放入 `.signal-caret`。
- **光标**：`.signal-caret` 是白色实心下划线，始终挂在当前占位块下方。
- **逐字替换状态**：`is-revealed`、`is-active`、`is-placeholder` 分别决定真实字、当前占位块和后续占位块。
- **柔焦与白灰溢光**：文字、占位块、光标均带 `blur()`、`drop-shadow()` 或 `box-shadow`；A / B / C 变体进一步带低幅 SVG 采样扰动。
- **局部红青边缘**：文字使用 `.signal-char::before/::after` 与两个 SVG 边缘滤镜；占位块使用 `.signal-placeholder::after` 的局部彩色纹理。
- **字符级残差**：文字和占位块仍保留非常轻的单格横纹、径向颗粒和 `--cell-core-light` 明暗残差。它们只补足局部光学差异，不承担跨字连续的屏幕纹理。

### 共享介质层负责

`.signal-medium-glyphs` 位于字符层之上，`z-index: 3`，但只是无色克隆：`.signal-medium-char`、`.signal-medium-placeholder` 和 `.signal-medium-caret` 都只提供白色 Alpha。

- **跨字符、跨行连续横纹**：`#signal-shared-medium` 中的 `scanField` 在整个克隆元素的滤镜坐标中生成，不在每一个字符格重新起算。
- **连续颗粒**：同一滤镜中的 `grainField` 也是以整个文本克隆为范围生成。
- **低频亮暗变化**：`illuminationField` 经 `illuminationLuma` 和 `modulatedTextAlpha` 只调制现有内容 Alpha，而不是额外叠一层灰白覆盖物。
- **裁切与合成**：`SourceAlpha` 与 `modulatedTextAlpha` 通过 `operator="in"` 得到 `contentAlpha`；`mediumField` 最后再次以 `contentAlpha` 裁切。因此纹理不会点亮字符间距、行间距或段落留白。

### 当前有意保留的重叠

两层都可能让人感知到细纹、颗粒和亮度差，但职责不同：共享层提供主要的、跨字连续的中性显示介质；字符层只留下低强度且稳定的局部残差，使真实文字与白色占位块不至于完全均质。字符层的模糊、白灰溢光、采样扰动和局部红青边缘不在共享层重复处理。

## 3. 当前完整参数表

### 3.1 页面、排版与定位

| 对象 | 选择器 / 变量 | CSS 属性 | 当前值 | 视觉作用 |
| --- | --- | --- | --- | --- |
| 页面底色 | `.signal-study` | `background` | `#030405` | 近黑显示面底色。 |
| 主体纸白 | `.signal-study` | `--signal-paper` | `#edf0e8` | 文字、光标和部分高光的基准色。 |
| 信号青 | `.signal-study` | `--signal-cyan` | `rgba(93, 224, 214, 0.72)` | 光标等局部青色信号边缘。 |
| 信号红 | `.signal-study` | `--signal-red` | `rgba(235, 93, 113, 0.66)` | 光标等局部红色信号边缘。 |
| 文字区域位置 | `.signal-glyphs, .signal-medium-glyphs` | `top / left / transform` | `50% / 50% / translate(-50%, -50%)` | 将整个文本块在页面水平、垂直居中；内部仍由 `text-left` 左对齐。 |
| 文本区域宽度 | 同上 | `width` | `fit-content` | 文字块只占内容所需宽度。 |
| 最大宽度 | 同上 | `max-width` | `min(52.5rem, calc(100% - 2.5rem))` | 当前首行可保持单行的宽度上限；窄屏仍可自然折行。 |
| 自然换行 | 同上 | `white-space` | `normal` | 在最大宽度不足时允许行内自然折行。 |
| 单行高度 | `.signal-line` | `min-height / line-height` | `1.3em / 1.3` | 每个显式行容器的稳定高度与文字垂直节奏。 |
| 行间距 | `.signal-paragraph` | `row-gap` | `0.38em` | 同段显式行之间的额外垂直距离。 |
| 段间距 | `.signal-paragraph + .signal-paragraph` | `margin-top` | `1.6em` | 两段之间大于普通行距的留白。 |
| 字符格尺寸 | `.signal-cell` | `width / height / line-height` | `1em / 1.3em / 1.3em` | 文字、占位块和光标共用的基本字符格。 |
| 普通格距 | `.signal-cell + .signal-cell` | `margin-left` | `0.22em` | 所有相邻字符格的实际横向间隔。 |
| 中文格距 | `.signal-cell.is-chinese-cell + .signal-cell` | `margin-left` | `0.3em` | 中文页面相邻字符的额外疏朗间隔；共享克隆有同值规则。 |
| 空白格宽度 | `.signal-cell.is-space` | `width` | `0.5em` | 空格不占完整字符格。 |
| 统一文字行高 | `.signal-glyphs, .signal-medium-glyphs` | `line-height` | `1.3` | 与单元格、显式行保持一致。 |
| 显式字距 | 同上 | `letter-spacing` | `0` | 不依赖外层字距；间隔来自字符格 `margin-left`。 |

### 3.2 字符主体、红青副层与字符级残差

| 对象 | 选择器 / 变量 | CSS 属性 | 当前值 | 视觉作用 |
| --- | --- | --- | --- | --- |
| 文字主体默认采样 | `.signal-char` | `filter` | `url(#signal-foreground-sampling-b) blur(0.032em) drop-shadow(0 0 0.22em rgba(237, 240, 232, 0.15))` | B 变体的低幅采样、主体柔焦和白灰溢光。 |
| 文字核心亮度 | `signalCellStyle()` → `--cell-core-light` | CSS 变量 | `(0.975 + stableUnit(index, 3) * 0.015).toFixed(3)`，即 `0.975`–`0.990` | 按全局字符格稳定分配的极轻微主体亮度残差。 |
| 主体渐变 | `.signal-char` | 第一层 `linear-gradient(104deg, ...)` | `rgba(214, 228, 221, var(--cell-core-light))` → `rgba(255, 255, 251, 0.98)`（38%）→ `rgba(202, 222, 217, 0.88)`（74%）→ `rgba(244, 246, 238, 0.95)` | 让白色字芯不是完全均匀平面。 |
| 文字中性横纹残差 | `.signal-char` | 第二层 `repeating-linear-gradient(0deg, ...)` | 白：`0`–`0.022em`、深色：`0.042em`–`0.065em`（`rgba(59, 78, 75, 0.035)`）、透明：`0.088em`–`0.14em`；`background-size: 100% 0.16em` | 低强度单格扫描纹残差；共享层才是连续纹理主来源。 |
| 文字局部颗粒 | `.signal-char` | 第三、四层 `radial-gradient` | 白色点：`circle at 24% 32%`，`rgba(255,255,255,0.06)` 至 `0.03em`；深色点：`circle at 74% 66%`，`rgba(64,93,88,0.04)` 至 `0.026em`；尺寸分别 `.44em .4em`、`.54em .5em` | 非均匀的极轻字符内颗粒。 |
| 文字纹理位置 | `signalCellStyle()` | `--cell-line-offset / --cell-grain-x / --cell-grain-y` | 行偏移 `0.000em`–`0.120em`；颗粒 X `0.000em`–`0.180em`、Y `0.000em`–`0.160em`；均以三位小数输出 | 同一格稳定、不同格轻微不同的纹理相位。 |
| 文字纹理混合 | `.signal-char` | `background-blend-mode` | `normal, multiply, soft-light, multiply` | 将主体、横纹和颗粒融合成灰白信号表面。 |
| 青色副层颜色 | `.signal-char::before` | `color / -webkit-text-fill-color` | `rgba(74, 232, 215, 0.49)` | 局部青色边缘源色。 |
| 青色副层滤镜 | `.signal-char::before` | `filter` | `url(#signal-chromatic-edge-cyan) blur(0.046em)` | 先取得局部边缘，再进行柔化。 |
| 青色副层透明度 | `signalCellStyle()` → `--cell-cyan-opacity` | `opacity` | `(0.7 + stableUnit(index, 1) * 0.13).toFixed(3)`，即 `0.700`–`0.830` | 每格稳定但不完全相同的青边可见度。 |
| 青色偏移 | `--cell-cyan-x / --cell-cyan-y` | `transform: translate(...)` | X：`-0.046em`–`-0.028em`；Y：`-0.004em`–`0.010em` | 贴近字芯的左侧/微垂直色散。 |
| 红色副层颜色 | `.signal-char::after` | `color / -webkit-text-fill-color` | `rgba(244, 87, 111, 0.41)` | 局部红色边缘源色。 |
| 红色副层滤镜 | `.signal-char::after` | `filter` | `url(#signal-chromatic-edge-red) blur(0.054em)` | 先取得局部边缘，再进行更软的红边扩散。 |
| 红色副层透明度 | `signalCellStyle()` → `--cell-red-opacity` | `opacity` | `(0.69 + stableUnit(index, 2) * 0.14).toFixed(3)`，即 `0.690`–`0.830` | 每格稳定但不完全相同的红边可见度。 |
| 红色偏移 | `--cell-red-x / --cell-red-y` | `transform: translate(...)` | X：`0.038em`–`0.056em`；Y：`-0.007em`–`0.007em` | 贴近字芯的右侧/微垂直色散。 |
| 红青合成 | `.signal-char::before, .signal-char::after` | `mix-blend-mode` | `screen` | 以屏幕混合让彩色边缘融入灰白主体，而非覆盖成实体副字。 |

### 3.3 白色占位块与光标

| 对象 | 选择器 / 变量 | CSS 属性 | 当前值 | 视觉作用 |
| --- | --- | --- | --- | --- |
| 占位块几何 | `.signal-placeholder` | `width / height / margin-top / border-radius` | `0.9em / 0.98em / 0.16em / 0.12em` | 接近日文字形尺寸、带圆角的白色占位块。 |
| 占位块默认采样 | `.signal-placeholder` | `filter` | `url(#signal-foreground-sampling-b) blur(0.028em) drop-shadow(0 0 0.22em rgba(237, 240, 232, 0.14))` | B 变体的采样、柔焦与白灰溢光。 |
| 占位块外溢光 | `.signal-placeholder` | `box-shadow` | `0 0 0.44em rgba(237, 240, 232, 0.18)` | 占位块本身的白灰扩散光。 |
| 占位块主体 | `.signal-placeholder` | 第一层 `linear-gradient(112deg, ...)` | `rgba(206, 223, 217, var(--cell-core-light))` → `rgba(255, 255, 253, 0.98)`（42%）→ `rgba(215, 227, 221, 0.84)` | 不均匀、略偏冷的白色块芯。 |
| 占位块中性横纹残差 | `.signal-placeholder` | 第二层 `repeating-linear-gradient(0deg, ...)` | 白：`0`–`0.025em`；深色：`0.045em`–`0.07em`（`rgba(66,88,84,0.03)`）；透明：`0.09em`–`0.15em`；`background-size: 100% 0.17em` | 块内低强度中性分层残差。 |
| 占位块局部亮点 | `.signal-placeholder` | 第三层 `radial-gradient` | `circle at 25% 30%`，`rgba(255,255,255,0.05)` 至 `0.028em`；尺寸 `.42em .39em` | 块内微小亮度起伏。 |
| 占位块混合 | `.signal-placeholder` | `background-blend-mode` | `normal, multiply, soft-light` | 让块内部纹理与白色主体融合。 |
| 占位块额外颗粒 | `.signal-placeholder::before` | `opacity / background / background-size` | `opacity: 0.06`；白色径向点 `rgba(237,240,232,0.72)`、深色径向点 `rgba(56,85,80,0.38)`；重复横纹尺寸 `100% 0.2em` | 仅作为块内低强度颗粒和亮度层。 |
| 占位块局部红青纹理 | `.signal-placeholder::after` | `opacity` | `var(--cell-block-edge-opacity)`，即 `0.280`–`0.293` | 局部色差的总强度。 |
| 占位块青色纹理 | `.signal-placeholder::after` | 三层 `background` 中前两层 | 边缘青：`rgba(74,232,215,0.42)`，宽 `0.085em`；短横纹青：`rgba(74,232,215,0.22)`，尺寸 `40% 0.15em` | 块边与少量横向局部青色差。 |
| 占位块红色纹理 | `.signal-placeholder::after` | 三层 `background` 中第一、三层 | 边缘红：`rgba(244,87,111,0.38)`，宽 `0.085em`；短横纹红：`rgba(244,87,111,0.2)`，尺寸 `40% 0.15em` | 块边与少量横向局部红色差。 |
| 占位块彩色纹理位置 | `signalCellStyle()` | `--cell-block-cyan-x / --cell-block-red-x / --cell-block-line-offset / --cell-block-line-offset-red` | 青 X、红 X：各 `0.000em`–`0.070em`；青 Y：`0.000em`–`0.100em`；红 Y：`0.000em`–`0.070em` | 让每格彩色短纹不使用同一相位。 |
| 占位块彩色裁切 | `.signal-placeholder::after` | `mask-image / mask-size / mix-blend-mode` | `repeating-linear-gradient(0deg, transparent 0 0.035em, rgba(0,0,0,0.9) 0.055em 0.13em, transparent 0.155em 0.2em)`；`mask-repeat: repeat`；`mix-blend-mode: multiply` | 将彩色层切成横向局部带，而非完整彩色矩形轮廓。 |
| 光标几何 | `.signal-caret` | `width / height / align-self / margin-bottom` | `0.9em / 0.14em / flex-end / 0.16em` | 白色实心下划线，与占位块同宽。 |
| 光标色散与溢光 | `.signal-caret` | `background / box-shadow` | 背景 `var(--signal-paper)`；`-0.046em 0 rgba(93,224,214,0.38)`、`0.052em 0 rgba(235,93,113,0.31)`、`0 0 0.36em rgba(237,240,232,0.22)` | 光标两侧的青红偏移与白灰溢光。 |
| 光标默认采样 | `.signal-caret` | `filter` | `url(#signal-foreground-sampling-b) blur(0.024em) drop-shadow(0 0 0.16em rgba(237,240,232,0.16))` | B 变体的柔焦、采样和轻溢光。 |
| 光标闪烁 | `.signal-caret` / `@keyframes signal-caret-blink` | `animation` | `0.9s steps(1, end) infinite`；`0%,45% { opacity:1 }`，`46%,100% { opacity:.22 }` | 克制的步进闪烁；仅光标闪烁。 |

### 3.4 A / B / C 采样、柔焦和白灰溢光

| 变体 | 选择器 / SVG | 作用对象 | `blur()` | `drop-shadow()` | SVG 湍流与位移 |
| --- | --- | --- | --- | --- | --- |
| A | `.signal-cell.signal-variant-a .signal-char` | 真实文字 | `0.03em` | `0 0 0.2em rgba(237,240,232,0.14)` | `#signal-foreground-sampling-a`：`baseFrequency="0.72 0.16"`、`numOctaves="1"`、`seed="13"`、`feDisplacementMap scale="0.34" xChannelSelector="R" yChannelSelector="G"`。 |
| B | `.signal-char` 默认规则 | 真实文字 | `0.032em` | `0 0 0.22em rgba(237,240,232,0.15)` | `#signal-foreground-sampling-b`：`baseFrequency="0.66 0.19"`、`numOctaves="1"`、`seed="29"`、`scale="0.38"`、通道 `R / G`。 |
| C | `.signal-cell.signal-variant-c .signal-char` | 真实文字 | `0.034em` | `0 0 0.24em rgba(237,240,232,0.16)` | `#signal-foreground-sampling-c`：`baseFrequency="0.78 0.13"`、`numOctaves="1"`、`seed="47"`、`scale="0.31"`、通道 `R / G`。 |
| A | `.signal-cell.signal-variant-a .signal-placeholder` | 占位块 | `0.028em` | `0 0 0.2em rgba(237,240,232,0.12)` | 同 A：`scale="0.34"`。 |
| B | `.signal-placeholder` 默认规则 | 占位块 | `0.028em` | `0 0 0.22em rgba(237,240,232,0.14)` | 同 B：`scale="0.38"`。 |
| C | `.signal-cell.signal-variant-c .signal-placeholder` | 占位块 | `0.028em` | `0 0 0.24em rgba(237,240,232,0.16)` | 同 C：`scale="0.31"`。 |
| A | `.signal-cell.signal-variant-a .signal-caret` | 光标 | `0.024em` | `0 0 0.14em rgba(237,240,232,0.14)` | 同 A：`scale="0.34"`。 |
| B | `.signal-caret` 默认规则 | 光标 | `0.024em` | `0 0 0.16em rgba(237,240,232,0.16)` | 同 B：`scale="0.38"`。 |
| C | `.signal-cell.signal-variant-c .signal-caret` | 光标 | `0.024em` | `0 0 0.18em rgba(237,240,232,0.18)` | 同 C：`scale="0.31"`。 |

三个前景采样滤镜的区域均为 `x="-16%" y="-16%" width="132%" height="132%"`，避免低幅位移或溢光在字符边界处被截断。

### 3.5 共享介质层参数

| 对象 | SVG filter / 节点 | 属性 | 当前值 | 视觉作用 |
| --- | --- | --- | --- | --- |
| 共享层透明度 | `.signal-medium-glyphs` | `opacity` | `0.68` | 共享中性纹理对前景的总体叠加强度。 |
| 共享层混合 | `.signal-medium-glyphs` | `mix-blend-mode` | `normal` | 不通过额外屏幕混合再次提亮前景。 |
| 共享滤镜区域 | `#signal-shared-medium` | `x / y / width / height` | `-2% / -3% / 104% / 106%` | 覆盖整块文本克隆并预留少量边缘。 |
| 共享颗粒场 | `#signal-shared-medium > feTurbulence[result="grainField"]` | `baseFrequency / numOctaves / seed` | `0.42 0.56 / 1 / 101` | 连续、中性细颗粒源。 |
| 共享颗粒颜色与 Alpha | `feColorMatrix[result="neutralGrain"]` | `values` | `0.18 0.18 0.18 0 0.64 / 0.2 0.2 0.2 0 0.67 / 0.19 0.19 0.19 0 0.65 / 0 0 0 0 0.48` | 将颗粒转为偏中性的亮色信号；Alpha 为 `0.48`。 |
| 共享横纹场 | `feTurbulence[result="scanField"]` | `baseFrequency / numOctaves / seed` | `0.003 1.45 / 1 / 127` | 以文本块坐标形成连续、细密的扫描方向变化。 |
| 共享横纹颜色与 Alpha | `feColorMatrix[result="scanLines"]` | `values` | `0.08 0.08 0.08 0 0.71 / 0.09 0.09 0.09 0 0.74 / 0.09 0.09 0.09 0 0.72 / 0 0 0 0 0.32` | 横纹中性亮度与 Alpha；Alpha 为 `0.32`。 |
| 共享颗粒与横纹混合 | `feBlend[result="mediumField"]` | `mode` | `screen` | 在共享层内部将两种中性纹理相加。 |
| 低频亮暗场 | `feTurbulence[result="illuminationField"]` | `baseFrequency / numOctaves / seed` | `0.018 0.026 / 1 / 139` | 整段文字尺度的缓慢亮暗起伏。 |
| 低频亮暗转 Alpha | `feColorMatrix[result="illuminationLuma"]` | `type` | `luminanceToAlpha` | 不产生新的颜色，仅取亮度作为 Alpha 来源。 |
| 低频亮暗调制 | `feComponentTransfer[result="modulatedTextAlpha"] > feFuncA` | `type / tableValues` | `table / 0.88 1` | 只将已有内容 Alpha 轻微调制到 `0.88`–`1`，避免灰白覆层。 |
| 内容 Alpha | `feComposite[result="contentAlpha"]` | `in / in2 / operator` | `SourceAlpha / modulatedTextAlpha / in` | 限制共享纹理只能存在于无色克隆本身的字、块和光标 Alpha 内。 |
| 最终裁切 | 最后一个 `feComposite` | `in / in2 / operator` | `mediumField / contentAlpha / in` | 清除所有字符格、行间和段落空白中的共享纹理。 |

### 3.6 其他当前画面环境参数

| 对象 | 选择器 | 属性 | 当前值 | 视觉作用 |
| --- | --- | --- | --- | --- |
| 全屏噪声 | `.signal-noise` | `opacity / mix-blend-mode` | `0.045 / screen` | 极弱的全屏环境噪声，不是字符层内容。 |
| 全屏噪声动画 | `.signal-noise` | `animation` | `signal-noise-drift 1.8s steps(2, end) infinite` | 低频、步进式噪声位置变化。 |
| 上下信箱条 | `.signal-letterbox` | `height / background` | `11% / rgba(0,0,0,0.16)` | 压低上下区域，形成影像画面边界。 |
| 暗角 | `.signal-vignette` | `background` | 两层 `radial-gradient`，中心冷色层最大 Alpha `0.024`，外层黑色最大 Alpha `0.36` | 让观看重心停留在中间文本区域。 |

### 3.7 动画时间参数

| 对象 | 脚本位置 | 当前值 | 视觉作用 |
| --- | --- | --- | --- |
| 初始等待 | `beginReveal()` → `revealNext(900)` | `900ms` | 首行开始前的静默。 |
| 逐字间隔 | `const characterDelay` | `88ms` | 当前行内占位块替换为真实字符的节奏。 |
| 行边界停顿 | `const lineBoundaryPause` | `720ms` | 当前行完成后、下一行整排占位块出现前的独立停顿。 |
| 光标闪烁 | `.signal-caret` | `0.9s` | 与逐字节奏独立的轻微闪烁。 |

## 4. A / B / C 稳定变体

### 分配方式

`signalCellVariant(character)` 不按 DOM 顺序直接轮换，而是使用 `stableUnit(character.index, 14)`：

```js
const variantIndex = Math.min(2, Math.floor(stableUnit(character.index, 14) * 3))
```

`stableUnit()` 以全局字符格索引和固定 salt 计算确定性伪随机值。结果映射为 `signal-variant-a`、`signal-variant-b` 或 `signal-variant-c`。因此它不是显眼的 `A → B → C → A` 循环，而是稳定的分布；刷新后同一索引仍会得到同一变体。

### 变体内容

- **A**：文字 `blur(0.03em)`、占位块 `blur(0.028em)`、光标 `blur(0.024em)`；三者分别带较弱的白灰 `drop-shadow`；采样位移 `scale="0.34"`。
- **B**：文字 `blur(0.032em)`、占位块 `blur(0.028em)`、光标 `blur(0.024em)`；对应默认白灰溢光；采样位移 `scale="0.38"`。
- **C**：文字 `blur(0.034em)`、占位块 `blur(0.028em)`、光标 `blur(0.024em)`；对应较强白灰溢光；采样位移 `scale="0.31"`。

同一索引的格子在动画中从占位块变成真实文字时，`character.index` 不变，父级 `.signal-cell` 的变体类也不变。因此滤镜选择、`--cell-*` 变量、纹理相位、亮度残差和红青参数不会因状态替换而重新随机或跳变。真实文字、占位块和当前光标都使用该格所在的 A / B / C 变体。

## 5. 红青局部边缘的实现

### 真实文字：SVG 字形边缘流程

文字在 `.signal-char::before` 和 `.signal-char::after` 中各复制一次 `data-char`。两个副层都继承字形、字距和定位，区别仅在颜色、滤镜、透明度与偏移。

两个滤镜 `#signal-chromatic-edge-cyan` 与 `#signal-chromatic-edge-red` 的结构相同，只是固定噪声参数不同：

1. `SourceAlpha` 取真实文字的字形 Alpha。
2. `feMorphology`（`operator="dilate" radius="0.42"`）得到略扩张的 `expandedAlpha`。
3. `feComposite` 使用 `expandedAlpha` 与 `SourceAlpha`、`operator="out"` 得到 `narrowEdge`：它只保留字形外缘的窄带，不保留完整字芯。
4. `feTurbulence` 生成固定噪声：青色为 `baseFrequency="0.54 0.33"`、`seed="71"`；红色为 `baseFrequency="0.61 0.29"`、`seed="83"`。两者均为 `type="fractalNoise"`、`numOctaves="1"`。
5. 噪声先经 `feColorMatrix type="luminanceToAlpha"` 转为 `edgeNoiseAlpha`，再经 `feComponentTransfer` 的 `feFuncA type="table"` 变为 `modulatedNoiseAlpha`。青色表为 `0.24 0.78`，红色表为 `0.22 0.76`。
6. `narrowEdge` 与 `modulatedNoiseAlpha` 以 `operator="in"` 合成为 `fragmentedEdgeAlpha`。它让窄边缘的强弱在同一字符轮廓不同位置稳定变化，而不是将完整彩色字形显示出来。
7. 最后的 `feComposite` 将 `SourceGraphic` 裁到 `fragmentedEdgeAlpha` 内。CSS 再施加各自的 `blur()`、`screen` 混合和轻微平移。

由于彩色副层被限制在窄边缘 Alpha 内，白色主体仍保留完整字芯；固定噪声调制让边缘亮度不均。现行参数不会把副层作为完整红字、青字渲染。它也不追求一条规则、连续、等强的彩色描边。

### 白色占位块：CSS 局部彩色纹理

占位块不是字形，当前没有套用上述 `SourceAlpha` 边缘滤镜。它使用 `.signal-placeholder::after`：

- 第一层渐变在左右两端留出青色和红色的窄边。
- 第二、三层是短宽度 `40%`、高度 `0.15em` 的青/红横向片段，位置由稳定的 `--cell-block-*` 变量决定。
- `mask-image` 的重复横向遮罩仅让部分横带显现，`mix-blend-mode: multiply` 使颜色融入块体纹理。

因此占位块也只会在局部边缘和少数横纹感知红青差异，而不是形成完整红青矩形框。

## 6. 共享介质层的实现

### 无色克隆如何与前景同步

`.signal-medium-glyphs` 在模板中复用与 `.signal-glyphs` 相同的 `textLayout`、`isLineStarted(line)`、`revealedCount` 和 `character.index` 条件：

- 已揭示格显示 `.signal-medium-char`；
- 当前格显示 `.signal-medium-placeholder` 与 `.signal-medium-caret`；
- 后续格显示 `.signal-medium-placeholder`；
- 未开始的行不渲染；
- 段落与显式行布局也完全相同。

它只用白色 `color` 或 `background` 形成 Alpha，不包含 `.signal-char::before/::after` 的红青层，也不附着前景的字符级 blur、drop-shadow 或 A / B / C 采样滤镜。

### 为什么纹理连续、空白不被填亮

共享滤镜挂在整个 `.signal-medium-glyphs` 克隆元素上，而不是每个字符单元。`feTurbulence` 的坐标因此覆盖整个文本块，横纹、颗粒和低频亮暗场在跨字符、跨行时不会从每个格子的左上角重新开始。

纹理最后通过两次 Alpha 合成裁切：先将 `SourceAlpha` 与低频调制 Alpha 相交，再用得到的 `contentAlpha` 裁切混合后的 `mediumField`。字符之间、行之间和段落间的 Alpha 均为零，因而没有可见的纹理填充。共享层以 `opacity: 0.68`、`mix-blend-mode: normal` 叠到前景上。

## 7. 动画与排版逻辑

### 逐行、逐字状态

`testParagraphs` 是二维数组：外层数组定义段落，内层数组定义明确的强制换行。每个可见字符通过 `Array.from()` 转为带全局 `index` 的字符格；换行和段落空行不是字符格，所以不会生成白色占位块。

动画的实际顺序如下：

1. 页面挂载后先等待 `900ms`，`activeLineIndex` 初始为 `0`，首行的全部占位块可见。
2. 当前行中，`revealedCount` 每隔 `88ms` 增加一次。已完成格渲染真实文字；当前索引格渲染占位块和下划线光标；其后的格继续显示占位块。
3. 当前行的最后一个字符揭示时，该格在同一状态更新中变为真实文字；若还有下一行，光标不会停在已完成文字后。
4. 随后等待 `720ms`；等待结束才把下一行的 `activeLineIndex` 设为可见，因此下一行整排占位块同时出现，再继续按 `88ms` 逐字替换。
5. 最后一个字符被揭示后，`revealedCount === characters.length`，没有任何格满足“当前格”条件，光标直接消失。

用户启用 `prefers-reduced-motion: reduce` 时，`beginReveal()` 会立即将 `revealedCount` 设为全部字符数，并将 `activeLineIndex` 设为最后一行。

### 强制换行、自然换行和段落间距

- `testParagraphs` 中每个字符串是一个**强制行**，因此当前文案按数组给定位置断行。
- `.signal-glyphs` 使用 `white-space: normal` 和最大宽度 `min(52.5rem, calc(100% - 2.5rem))`；在窄屏时，强制行内部仍可发生浏览器自然换行。
- 同段行容器的 `row-gap: 0.38em` 控制普通行距；相邻段落的 `margin-top: 1.6em` 单独控制更大的段间留白。
- 两个文字平面通过 `top: 50%`、`left: 50%` 与 `translate(-50%, -50%)` 使整体文本块居中；文本块内部通过模板类 `text-left` 保持左对齐。

## 8. 参数调整指南

以下均为当前代码中的具体入口；一次只调整同类参数，避免把共享层与字符层的同一效果重新叠加得过重。

| 视觉目标 | 主要调整位置 | 修改方向与连带影响 |
| --- | --- | --- |
| 让真实文字更模糊或更清晰 | `.signal-char` 及 A / C 覆盖规则的 `blur()` | 同时检查 A/B/C 三档，避免仅一种变体突兀清晰或模糊。主体 blur 影响灰白字芯；不要用共享层 blur 代替。 |
| 让红青边缘更软或更锐 | `.signal-char::before` 的 `blur(0.046em)`、`.signal-char::after` 的 `blur(0.054em)` | 减小会使彩色边缘更像描边；增大会更易融进灰白柔光。 |
| 调整白灰溢光范围 | 文字、占位块、光标的 `drop-shadow()`；占位块的 `box-shadow`；光标的第三个 `box-shadow` | 主要改阴影的模糊半径与 Alpha。增大过多会让相邻字/行黏连；占位块还会比文字更抢眼。 |
| 增强或减弱红青色散 | `--cell-cyan-opacity`、`--cell-red-opacity` 的公式；`.signal-char::before/after` 源色 Alpha | 优先调透明度与颜色 Alpha，不要先扩大位移距离。过高会形成可识别副字。 |
| 改变红青偏移距离 | `--cell-cyan-x/y`、`--cell-red-x/y` 的公式 | 直接改变 `transform: translate(...)` 的范围；距离变大最容易成为三重文字，应保持小幅。 |
| 增强文字边缘采样破碎感 | `#signal-foreground-sampling-a/b/c` 的 `feDisplacementMap scale`，以及对应 `feTurbulence baseFrequency` | 当前 scale 为 `0.34 / 0.38 / 0.31`。提高会让字形边缘更不规则，也更容易产生可见扭曲。 |
| 调整文字局部边缘不均 | `#signal-chromatic-edge-cyan/red` 的 `feMorphology radius`、两个 `feTurbulence`、`feFuncA tableValues` | `radius` 控制边缘带宽；噪声频率和 Alpha 表控制边缘局部强弱。不要直接把 `SourceGraphic` 当完整副字输出。 |
| 增强共享横纹 | `#signal-shared-medium` 的 `scanField`、`scanLines` 色矩阵 Alpha（当前最后一行 `0.32`）、`.signal-medium-glyphs { opacity: .68 }` | 先调 `scanLines` 的 Alpha，再视需要调共享层总 opacity。过强会使文字发灰或变成规则扫描线。 |
| 增强共享颗粒 | 同滤镜的 `grainField`、`neutralGrain` 色矩阵 Alpha（当前 `0.48`） | 提高 Alpha 或调整 `baseFrequency="0.42 0.56"`。共享颗粒跨字连续；不要以恢复字符级大颗粒代替。 |
| 调整整体亮暗不均 | `illuminationField`、`feFuncA tableValues="0.88 1"` | 调整低频频率改变亮暗块尺度；扩大 Alpha 表区间会加重明暗差。它只能调制内容 Alpha，不应变成额外灰白覆盖层。 |
| 调整占位块质感 | `.signal-placeholder` 的背景层、`::before`、`::after`、`box-shadow`、以及 A/B/C 占位块滤镜 | 中性横纹和颗粒应保持很轻；局部红青重点调 `--cell-block-*` 与 `::after`，避免完整彩色矩形框。 |
| 调整字符之间的局部差异 | `stableUnit()` 的 salt、`signalCellStyle()` 中各 `--cell-*` 公式、`signalCellVariant()` 的 salt | 必须继续以全局 `character.index` 为输入。不要以字符内容、当前占位/文字状态或运行时随机数为输入，否则状态替换会跳变。 |
| 调整逐字速度 | `beginReveal()` 的 `characterDelay` | 当前 `88ms`。减小更快，增大更有终端节奏；不改变占位块整行出现规则。 |
| 调整行间停顿 | `beginReveal()` 的 `lineBoundaryPause` | 当前 `720ms`，应明显长于逐字间隔。它只影响行切换，不影响段落排版。 |
| 调整光标闪烁 | `.signal-caret` 的 `animation` 与 `@keyframes signal-caret-blink` | 改 `0.9s` 或 opacity 阈值；不要用强闪烁影响整个文字平面。 |
| 调整字距、行距、段间距或可换行宽度 | `.signal-cell + .signal-cell`、中文相邻格规则、`.signal-paragraph`、`.signal-paragraph + .signal-paragraph`、`.signal-glyphs` 最大宽度 | 字距通过单元格实际 `margin-left` 调整；不要只改外层 `letter-spacing`。普通行距与段间距应维持不同层级。 |

## 9. 当前设计边界

当前代码明确保持以下边界：

- 不使用全屏强 VHS 故障；全屏 `.signal-noise` 只有 `opacity: 0.045`，仅为环境噪声。
- 不实现文字拖影或持久化残像；没有历史帧、延迟副本或残影合成层。
- 不让文字本身剧烈闪烁；当前周期动画只作用于光标，背景噪声也保持低透明度。
- 不渲染完整红字、青字：文字副层先由 `SourceAlpha` 派生窄边缘，再做噪声 Alpha 调制。
- 不使用规则的完整彩色描边：文字边缘强度受固定噪声控制；占位块彩色层受局部短纹和遮罩限制。
- 不让共享介质层重新整体模糊前景：共享滤镜只生成中性纹理、低频 Alpha 调制与裁切，不含 `blur`、`feDisplacementMap` 或扩张型 `drop-shadow`。
- 不让字符级纹理重新成为唯一主要质感来源：字符层只保留局部残差，跨字、跨行的中性横纹、颗粒和亮暗场由共享介质层提供。

## 10. 当前相关文件

| 文件 | 作用 |
| --- | --- |
| [`jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue`](../../jacory-space-frontend/src/views/RetroFuturismSignalStudy.vue) | 当前页面的 Vue 模板、逐字状态逻辑、SVG 滤镜、样式、纹理和动画的唯一实现文件。 |
| [`jacory-space-frontend/src/assets/fonts/SourceHanSansSC-VF.ttf.woff2`](../../jacory-space-frontend/src/assets/fonts/SourceHanSansSC-VF.ttf.woff2) | 当前页面通过 `@font-face` 声明并用于中文 `.is-chinese` 文字与共享无色克隆的本地可变字体文件。 |

配套文档（不参与页面渲染）：[`docs/architecture/retro-futurism-signal-rendering.md`](retro-futurism-signal-rendering.md)。
