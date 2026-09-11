<template>
  <section
    ref="stageRoot"
    data-home-web-development-page
    class="home-web-development-page relative isolate overflow-hidden"
    aria-label="Development"
  >
    <p class="pointer-events-none absolute right-4 bottom-6 sm:right-[30px] z-30 m-0 font-display text-3xl sm:text-development-part leading-none text-development-chapter">PART III</p>
    <h2 ref="titleRoot" class="pointer-events-none absolute inset-x-0 top-[15%] z-0 m-0 h-[70%] font-display font-normal text-development-title">
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
    <svg v-if="titleMetrics" aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-[15%] z-20 h-[70%] w-full font-display font-normal text-development-title" :viewBox="`0 0 ${titleMetrics.width} ${titleMetrics.height}`" preserveAspectRatio="none">
      <text v-for="letter in frontLetters" :key="letter.index" :x="letter.x" :y="titleMetrics.ascent" font-size="100" fill="currentColor">{{ letter.char }}</text>
    </svg>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import redBadge from '../../../assets/home-development/red-001.png'
import catBadge from '../../../assets/home-development/cat-002.png'
import dogBadge from '../../../assets/home-development/dog-003.png'
import dinosaurBadge from '../../../assets/home-development/dinosaur-004.png'

const stageRoot = ref(null)
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
  { id: '002', label: 'WEB', src: catBadge, cx: 0.38, cy: 0.74, angle: 13 },
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
    const cy = mobile ? [0.19, 0.77, 0.53, 0.22][index] : badge.cy
    const x = sw * cx - width / 2
    const y = sh * cy - height / 2
    return { ...badge, width, x, y }
  })
})

onMounted(async () => {
  resizeObserver = new ResizeObserver(([entry]) => {
    stageSize.value = { width: entry.contentRect.width, height: entry.contentRect.height }
  })
  resizeObserver.observe(stageRoot.value)
  await document.fonts.ready
  if (disposed || !titleRoot.value) return

  // Fit visible glyph bounds to the full width and 70% height, independently.
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
})

onBeforeUnmount(() => {
  disposed = true
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
