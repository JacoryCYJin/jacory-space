<template>
  <section
    ref="stageRoot"
    data-home-web-development-page
    class="home-web-development-page relative isolate overflow-hidden"
    aria-label="Development"
  >
    <div ref="compositionRoot" data-development-composition class="absolute inset-0" :style="{ transform: `translate(${compositionOffset.x}px, ${compositionOffset.y}px)` }">
    <div class="pointer-events-none absolute inset-x-[3%] bottom-6 top-[calc(65%+3cqw+12px)] z-[5] font-display italic text-development-chapter sm:top-[calc(65%+3cqw+24px)]">
      <p class="sr-only">BUILD. BREAK. MAKE SOMETHING NEW.</p>
      <p class="sr-only">PART III</p>
      <svg data-development-footer aria-hidden="true" class="block h-full w-full overflow-visible" :viewBox="stageSize.width < 640 ? '0 0 1440 310' : '0 0 1440 230'" :preserveAspectRatio="stageSize.width < 640 ? 'xMidYMax meet' : 'none'" fill="currentColor">
        <text x="12" y="148" font-size="180" textLength="385" lengthAdjust="spacingAndGlyphs">BUILD.</text>
        <text x="636" y="148" font-size="180" textLength="455" lengthAdjust="spacingAndGlyphs">BREAK.</text>
        <text :x="stageSize.width < 640 ? 12 : 654" :y="stageSize.width < 640 ? 244 : 222" :font-size="stageSize.width < 640 ? 100 : 76" :textLength="stageSize.width < 640 ? 1390 : 758" lengthAdjust="spacingAndGlyphs">MAKE SOMETHING NEW.</text>
        <text x="12" :y="stageSize.width < 640 ? 304 : 222" :font-size="stageSize.width < 640 ? 56 : 32">PART III</text>
      </svg>
    </div>
    <h2 ref="titleRoot" class="pointer-events-none absolute inset-x-[3%] top-[calc(3cqw+12px)] sm:top-[calc(3cqw+24px)] z-0 m-0 h-[65%] font-display font-normal text-development-title">
      <span class="sr-only">DEVELOPMENT</span>
      <svg
        v-if="titleMetrics"
        aria-hidden="true"
        class="block h-full w-full"
        :viewBox="`0 0 ${titleMetrics.width} ${titleMetrics.height}`"
        preserveAspectRatio="none"
      >
        <text ref="measuredTitle" visibility="hidden" :x="titleMetrics.left" :y="titleMetrics.ascent" font-size="100" letter-spacing="-5">DEVELOPMENT</text>
        <text v-for="letter in backLetters" :key="letter.index" :x="letter.x" :y="titleMetrics.ascent" font-size="100" fill="currentColor">{{ letter.char }}</text>
      </svg>
    </h2>
    <img
      v-for="badge in badgeLayout"
      :key="badge.id"
      :src="badge.src"
      :alt="`${badge.label} — ${badge.id}`"
      class="pointer-events-none absolute z-10 block h-auto select-none"
      :style="{ width: `${badge.width}px`, left: `${badge.x}px`, top: `${badge.y}px`, transform: `rotate(${badge.angle}deg)` }"
      width="1024"
      height="1536"
      draggable="false"
    >
    <svg v-if="titleMetrics" aria-hidden="true" class="pointer-events-none absolute inset-x-[3%] top-[calc(3cqw+12px)] sm:top-[calc(3cqw+24px)] z-20 h-[65%] w-[94%] font-display font-normal text-development-title" :viewBox="`0 0 ${titleMetrics.width} ${titleMetrics.height}`" preserveAspectRatio="none">
      <text v-for="letter in frontLetters" :key="letter.index" :x="letter.x" :y="titleMetrics.ascent" font-size="100" fill="currentColor">{{ letter.char }}</text>
    </svg>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import redBadge from '../../../assets/home-development/red-001.png'
import catBadge from '../../../assets/home-development/cat-002.png'
import dogBadge from '../../../assets/home-development/dog-003.png'
import dinosaurBadge from '../../../assets/home-development/dinosaur-004.png'

const stageRoot = ref(null)
const compositionRoot = ref(null)
const compositionOffset = ref({ x: 0, y: 0 })
let compositionReady = false
let compositionFrame
const stageSize = ref({ width: 0, height: 0 })
const titleRoot = ref(null)
const titleMetrics = ref(null)
const measuredTitle = ref(null)
const letters = ref([])
// A fixed shuffled order keeps the composition stable across reloads and resizing.
const foregroundIndices = new Set([0, 2, 3, 5, 7, 10])
const backLetters = computed(() => letters.value.filter(letter => !foregroundIndices.has(letter.index)))
const frontLetters = computed(() => letters.value.filter(letter => foregroundIndices.has(letter.index)))
let disposed = false
let resizeObserver

const badges = [
  { id: '001', label: 'EXPERIMENTS', src: redBadge, cx: 0.16, cy: 0.26, angle: -16 },
  { id: '002', label: 'WEB', src: catBadge, cx: 0.38, cy: 0.69, angle: 13 },
  { id: '003', label: 'PLUGINS', src: dogBadge, cx: 0.61, cy: 0.53, angle: -3 },
  { id: '004', label: 'CREATIVE', src: dinosaurBadge, cx: 0.84, cy: 0.31, angle: 22 }
]

const badgeLayout = computed(() => {
  const { width: sw, height: sh } = stageSize.value
  const mobile = sw < 640
  const width = Math.min(sw * (mobile ? 0.365 : 0.20), sh * (mobile ? 0.2635 : 0.4845))
  const height = width * 1.5
  return badges.map((badge, index) => {
    const cx = mobile ? (index % 2 ? 0.72 : 0.28) : badge.cx
    const cy = mobile ? [0.19, 0.72, 0.53, 0.22][index] : badge.cy
    const x = sw * cx - width / 2
    const y = sh * cy - height / 2
    return { ...badge, width, x, y }
  })
})


// Rasterize only to measure visible ink/alpha; the page still uses live SVG text and PNGs.
function centerComposition() {
  if (!compositionReady || disposed || !compositionRoot.value) return
  const { width, height } = stageSize.value
  if (!width || !height) return
  const padding = Math.ceil(Math.max(width, height) / 4)
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(width + padding * 2)
  canvas.height = Math.ceil(height + padding * 2)
  const context = canvas.getContext('2d', { willReadFrequently: true })
  const stage = stageRoot.value.getBoundingClientRect()
  const scaleX = width / stage.width
  const scaleY = height / stage.height

  compositionRoot.value.querySelectorAll('img').forEach((image, index) => {
    const badge = badgeLayout.value[index]
    if (!image.complete || !image.naturalWidth) return
    const imageHeight = badge.width * image.naturalHeight / image.naturalWidth
    context.save()
    context.translate(padding + badge.x + badge.width / 2, padding + badge.y + imageHeight / 2)
    context.rotate(badge.angle * Math.PI / 180)
    context.drawImage(image, -badge.width / 2, -imageHeight / 2, badge.width, imageHeight)
    context.restore()
  })

  compositionRoot.value.querySelectorAll('svg text:not([visibility="hidden"])').forEach(text => {
    const matrix = text.getScreenCTM()
    if (!matrix) return
    const style = getComputedStyle(text)
    context.save()
    context.setTransform(matrix.a * scaleX, matrix.b * scaleY, matrix.c * scaleX, matrix.d * scaleY,
      (matrix.e - stage.left) * scaleX - compositionOffset.value.x + padding,
      (matrix.f - stage.top) * scaleY - compositionOffset.value.y + padding)
    context.font = style.fontStyle + ' ' + style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily
    context.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing
    context.translate(text.x.baseVal.getItem(0).value, text.y.baseVal.getItem(0).value)
    const naturalWidth = context.measureText(text.textContent).width
    if (text.hasAttribute('textLength') && naturalWidth) context.scale(text.textLength.baseVal.value / naturalWidth, 1)
    context.fillText(text.textContent, 0, 0)
    context.restore()
  })

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
  let left = canvas.width, top = canvas.height, right = -1, bottom = -1
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      if (pixels[(y * canvas.width + x) * 4 + 3] < 16) continue
      left = Math.min(left, x); right = Math.max(right, x)
      top = Math.min(top, y); bottom = Math.max(bottom, y)
    }
  }
  if (right < left) return
  compositionOffset.value = {
    x: (width - (left + right + 1 - padding * 2)) / 2,
    y: (height - (top + bottom + 1 - padding * 2)) / 2
  }
}

function scheduleCompositionCenter() {
  cancelAnimationFrame(compositionFrame)
  compositionFrame = requestAnimationFrame(centerComposition)
}

onMounted(async () => {
  resizeObserver = new ResizeObserver(([entry]) => {
    stageSize.value = { width: entry.contentRect.width, height: entry.contentRect.height }
    nextTick(scheduleCompositionCenter)
  })
  resizeObserver.observe(stageRoot.value)
  await document.fonts.ready
  if (disposed || !titleRoot.value) return

  // Fit visible glyph bounds to the available width and 65% height, independently.
  const context = document.createElement('canvas').getContext('2d')
  context.font = `100px ${getComputedStyle(titleRoot.value).fontFamily}`
  context.letterSpacing = '-5px'
  const metrics = context.measureText('DEVELOPMENT')
  titleMetrics.value = {
    left: metrics.actualBoundingBoxLeft,
    ascent: metrics.actualBoundingBoxAscent,
    width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
    height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
  }
  await nextTick()
  if (disposed || !measuredTitle.value) return
  // Read the original word's glyph positions so splitting layers preserves spacing.
  letters.value = Array.from('DEVELOPMENT', (char, index) => ({
    char, index, x: measuredTitle.value.getStartPositionOfChar(index).x
  }))
  await nextTick()
  if (disposed || !compositionRoot.value) return
  await Promise.all([...compositionRoot.value.querySelectorAll('img')].map(image => image.decode().catch(() => {})))
  if (disposed) return
  compositionReady = true
  scheduleCompositionCenter()
})

onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(compositionFrame)
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.home-web-development-page {
  height: var(--home-transition-stage-height);
  background: var(--home-development-background);
  container-type: inline-size;
}

@media (prefers-reduced-motion: no-preference) {
  .home-web-development-page {
    position: sticky;
    top: var(--navbar-height);
    z-index: 0;
  }
}
</style>
