<template>
  <main class="signal-study relative isolate min-h-screen overflow-hidden bg-[#030405] text-[#edf0e8]">
    <div class="signal-stage relative min-h-screen" aria-labelledby="signal-caption">
      <div class="signal-letterbox signal-letterbox-top" aria-hidden="true" />
      <div class="signal-letterbox signal-letterbox-bottom" aria-hidden="true" />
      <div class="signal-noise" aria-hidden="true" />
      <div class="signal-vignette" aria-hidden="true" />

      <div ref="signalCopyRef" class="signal-copy">
        <CrtPhosphorDiffusionLayer
          :text-layout="textLayout"
          :revealed-count="revealedCount"
          :is-line-started="isLineStarted"
          :is-chinese-character="isChineseCharacter"
        />
        <CrtLumaLayer
          ref="lumaLayerRef"
          :text-layout="textLayout"
          :characters="characters"
          :revealed-count="revealedCount"
          :is-line-started="isLineStarted"
          :is-chinese-character="isChineseCharacter"
          :signal-cell-style="signalCellStyle"
          :signal-cell-variant="signalCellVariant"
          :scan-gate-href="sharedScanGateHref"
          :scan-pitch="sharedScanGrid.scanPitch"
          :local-scan-phase-y="lumaScanPhaseY"
        />
        <CrtChromaLayer
          ref="chromaLayerRef"
          :text-layout="textLayout"
          :characters="characters"
          :revealed-count="revealedCount"
          :is-line-started="isLineStarted"
          :is-chinese-character="isChineseCharacter"
          :scan-gate-href="sharedScanGateHref"
          :scan-pitch="sharedScanGrid.scanPitch"
          :local-scan-phase-y="chromaScanPhaseY"
        />
        <CrtMediumLayer
          ref="mediumLayerRef"
          :text-layout="textLayout"
          :revealed-count="revealedCount"
          :is-line-started="isLineStarted"
          :is-chinese-character="isChineseCharacter"
          :scan-gate-href="sharedScanGateHref"
          :scan-pitch="sharedScanGrid.scanPitch"
          :local-scan-phase-y="mediumScanPhaseY"
        />

        <p class="sr-only" aria-live="polite">{{ testText }}</p>
      </div>
    </div>

    <p class="sr-only">{{ t('retroFuturism.signalLabel') }}</p>
  </main>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CrtChromaLayer from '../components/experiments/retro-futurism/CrtChromaLayer.vue'
import CrtLumaLayer from '../components/experiments/retro-futurism/CrtLumaLayer.vue'
import CrtMediumLayer from '../components/experiments/retro-futurism/CrtMediumLayer.vue'
import CrtPhosphorDiffusionLayer from '../components/experiments/retro-futurism/CrtPhosphorDiffusionLayer.vue'

const { t, locale } = useI18n()
const testParagraphs = [
  [
    '当电子信号穿过沉默的屏幕与褪色的光',
    '老旧接口仍在保存尚未抵达的回应',
    '未来只是被重新命名的现在',
  ],
  [
    '在短暂失焦的光里',
    '某种联系尚未中断・・・・',
  ],
]

let characterIndex = 0
let lineIndex = 0
const textLayout = testParagraphs.map((paragraph) => paragraph.map((line) => {
  const characters = Array.from(line).map((value) => ({ value, index: characterIndex++ }))

  return {
    characters,
    startIndex: characters[0].index,
    sequenceIndex: lineIndex++,
  }
}))
const lines = textLayout.flat()
const characters = lines.flatMap((line) => line.characters)
const lineIndexByStart = new Map(lines.map((line) => [line.startIndex, line.sequenceIndex]))
const testText = testParagraphs.map((paragraph) => paragraph.join('\n')).join('\n\n')
const revealedCount = ref(0)
const activeLineIndex = ref(0)
const revealTimer = ref(null)
const signalCopyRef = ref(null)
const chromaLayerRef = ref(null)
const lumaLayerRef = ref(null)
const mediumLayerRef = ref(null)
const chromaScanPhaseY = ref(0)
const lumaScanPhaseY = ref(0)
const mediumScanPhaseY = ref(0)

const sharedScanGrid = Object.freeze({
  scanPitch: 3.6,
  litBandHeight: 2.2,
  darkGapHeight: 1.4,
  bandSoftness: 0.22,
  scanPhase: 0,
})
const sharedScanGateSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="3.6" viewBox="0 0 1 3.6" preserveAspectRatio="none"><linearGradient id="g" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#000"/><stop offset="6.111111%" stop-color="#fff"/><stop offset="55%" stop-color="#fff"/><stop offset="61.111111%" stop-color="#000"/><stop offset="100%" stop-color="#000"/></linearGradient><rect width="1" height="3.6" fill="url(#g)"/></svg>'
const sharedScanGateHref = `data:image/svg+xml,${encodeURIComponent(sharedScanGateSvg)}`

let scanPhaseObserver = null
let scanPhaseFrame = null

const isLineStarted = (line) => activeLineIndex.value >= line.sequenceIndex
const isChineseCharacter = (value) => locale.value.startsWith('zh') && /[\u3400-\u9fff\uf900-\ufaff]/u.test(value)
const stableUnit = (index, salt) => {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}
const signalCellVariant = (character) => {
  const variantIndex = Math.min(2, Math.floor(stableUnit(character.index, 14) * 3))
  return ['signal-variant-a', 'signal-variant-b', 'signal-variant-c'][variantIndex]
}
const signalCellStyle = (character) => {
  const index = character.index
  const grainX = stableUnit(index, 5) * 0.18
  const grainY = stableUnit(index, 6) * 0.16

  return {
    '--cell-core-light': (0.975 + stableUnit(index, 3) * 0.015).toFixed(3),
    '--cell-grain-x': `${grainX.toFixed(3)}em`,
    '--cell-grain-y': `${grainY.toFixed(3)}em`,
    '--cell-grain-x-inverse': `${(-grainX).toFixed(3)}em`,
    '--cell-grain-y-inverse': `${(-grainY).toFixed(3)}em`,
  }
}

const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor
const getScanRoot = (layer) => layer?.scanRoot?.value ?? layer?.scanRoot ?? null
const syncScanPhases = () => {
  const signalCopy = signalCopyRef.value
  const chromaRoot = getScanRoot(chromaLayerRef.value)
  const lumaRoot = getScanRoot(lumaLayerRef.value)
  const mediumRoot = getScanRoot(mediumLayerRef.value)

  if (!signalCopy || !chromaRoot || !lumaRoot || !mediumRoot) return

  const originY = signalCopy.getBoundingClientRect().top + sharedScanGrid.scanPhase
  chromaScanPhaseY.value = modulo(originY - chromaRoot.getBoundingClientRect().top, sharedScanGrid.scanPitch)
  lumaScanPhaseY.value = modulo(originY - lumaRoot.getBoundingClientRect().top, sharedScanGrid.scanPitch)
  mediumScanPhaseY.value = modulo(originY - mediumRoot.getBoundingClientRect().top, sharedScanGrid.scanPitch)
}
const scheduleScanPhaseSync = () => {
  if (scanPhaseFrame !== null) return

  scanPhaseFrame = window.requestAnimationFrame(() => {
    scanPhaseFrame = null
    syncScanPhases()
  })
}
const startScanPhaseSync = () => {
  const signalCopy = signalCopyRef.value
  const chromaRoot = getScanRoot(chromaLayerRef.value)
  const lumaRoot = getScanRoot(lumaLayerRef.value)
  const mediumRoot = getScanRoot(mediumLayerRef.value)

  if (!signalCopy || !chromaRoot || !lumaRoot || !mediumRoot) return

  scanPhaseObserver = new ResizeObserver(scheduleScanPhaseSync)
  scanPhaseObserver.observe(signalCopy)
  scanPhaseObserver.observe(chromaRoot)
  scanPhaseObserver.observe(lumaRoot)
  scanPhaseObserver.observe(mediumRoot)
  document.fonts?.ready?.then(scheduleScanPhaseSync)
  scheduleScanPhaseSync()
}

const clearRevealTimer = () => {
  if (revealTimer.value !== null) {
    window.clearTimeout(revealTimer.value)
    revealTimer.value = null
  }
}

const beginReveal = () => {
  clearRevealTimer()
  revealedCount.value = 0
  activeLineIndex.value = 0

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealedCount.value = characters.length
    activeLineIndex.value = lines.length - 1
    return
  }

  const characterDelay = 88
  const lineBoundaryPause = 720
  let nextIndex = 0
  const revealNext = (delay) => {
    if (nextIndex >= characters.length) return

    revealTimer.value = window.setTimeout(() => {
      revealedCount.value = nextIndex + 1
      nextIndex += 1

      if (nextIndex >= characters.length) return

      const nextLineIndex = lineIndexByStart.get(nextIndex)
      if (nextLineIndex !== undefined) {
        revealTimer.value = window.setTimeout(() => {
          activeLineIndex.value = nextLineIndex
          revealNext(characterDelay)
        }, lineBoundaryPause)
        return
      }

      revealNext(characterDelay)
    }, delay)
  }

  revealNext(900)
}

onMounted(async () => {
  beginReveal()
  await nextTick()
  startScanPhaseSync()
})
onBeforeUnmount(() => {
  clearRevealTimer()
  scanPhaseObserver?.disconnect()

  if (scanPhaseFrame !== null) {
    window.cancelAnimationFrame(scanPhaseFrame)
  }
})
</script>

<style scoped>
@font-face {
  font-family: "Source Han Sans SC";
  src: url("../assets/fonts/SourceHanSansSC-VF.ttf.woff2") format("woff2");
  font-style: normal;
  font-weight: 200 900;
  font-display: swap;
}

.signal-study {
  --signal-paper: #edf0e8;
  --signal-ink: #030405;
  font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Noto Sans CJK JP", sans-serif;
}

.signal-stage {
  background:
    linear-gradient(180deg, rgba(10, 12, 13, 0.26) 0 17%, transparent 17% 85%, rgba(10, 12, 13, 0.32) 85% 100%),
    var(--signal-ink);
}

.signal-copy {
  position: absolute;
  inset: 0;
  z-index: 10;
}

.signal-noise,
.signal-vignette,
.signal-letterbox {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.signal-noise {
  z-index: 20;
  opacity: 0.045;
  mix-blend-mode: screen;
  background-image:
    repeating-linear-gradient(0deg, transparent 0, transparent 0.25rem, rgba(237, 240, 232, 0.05) 0.3rem, transparent 0.38rem),
    radial-gradient(rgba(237, 240, 232, 0.32) 0.4px, transparent 0.62px),
    radial-gradient(rgba(237, 240, 232, 0.18) 0.4px, transparent 0.72px);
  background-size: auto, 7px 9px, 11px 13px;
  animation: signal-noise-drift 1.8s steps(2, end) infinite;
}

.signal-vignette {
  z-index: 21;
  background:
    radial-gradient(circle at 18% 38%, rgba(74, 84, 82, 0.024), transparent 19%),
    radial-gradient(circle at 78% 61%, rgba(108, 71, 78, 0.018), transparent 21%),
    radial-gradient(ellipse at center, transparent 48%, rgba(0, 0, 0, 0.36) 100%);
}

.signal-letterbox {
  z-index: 1;
  height: 11%;
  inset-inline: 0;
  background: rgba(0, 0, 0, 0.16);
}

.signal-letterbox-top {
  top: 0;
  bottom: auto;
}

.signal-letterbox-bottom {
  top: auto;
  bottom: 0;
}

@keyframes signal-noise-drift {
  0% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(-0.1%, 0.25%, 0); }
  100% { transform: translate3d(0.1%, -0.2%, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .signal-noise {
    animation: none;
  }
}
</style>
