<template>
  <p ref="visualTitleRoot" class="home-visual-title-gradient pointer-events-none absolute left-4 top-4 z-0 inline-block bg-clip-text font-display text-capability-display font-normal leading-none tracking-tighter text-transparent sm:left-10 sm:top-6">
    <span aria-hidden="true" class="invisible block whitespace-nowrap">DESIGNI</span>
    <span class="sr-only">VISUAL &amp; MOTION</span>
    <svg
      v-if="visualMetrics"
      aria-hidden="true"
      class="absolute inset-0 block h-full w-full overflow-visible tracking-normal"
      :viewBox="`0 0 ${visualMetrics.width} 100`"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="home-visual-motion-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--card)" />
          <stop offset="38%" stop-color="var(--card)" />
          <stop offset="62%" stop-color="var(--card)" :style="{ stopOpacity: 'calc(1 - var(--visual-fade) * 0.28)' }" />
          <stop offset="82%" stop-color="var(--card)" :style="{ stopOpacity: 'calc(1 - var(--visual-fade) * 0.74)' }" />
          <stop offset="100%" stop-color="var(--card)" :style="{ stopOpacity: 'calc(1 - var(--visual-fade))' }" />
        </linearGradient>
        <mask id="home-visual-motion-glyphs" maskUnits="userSpaceOnUse" x="0" y="0" :width="visualMetrics.width" height="100">
          <svg
            v-for="(word, index) in visualMetrics.rows"
            :key="word.text"
            x="0"
            :y="visualMetrics.top + index * (visualMetrics.rowHeight + visualMetrics.gap)"
            :width="visualMetrics.leftWidth"
            :height="visualMetrics.rowHeight"
            :viewBox="`0 0 ${word.width} ${word.height}`"
            preserveAspectRatio="none"
            overflow="visible"
          >
            <text :x="word.left" :y="word.ascent" font-size="100" letter-spacing="-5" fill="white">{{ word.text }}</text>
          </svg>
        </mask>
      </defs>
      <rect :width="visualMetrics.width" height="100" fill="url(#home-visual-motion-gradient)" mask="url(#home-visual-motion-glyphs)" />
      <svg
        :x="visualMetrics.ampX"
        :y="visualMetrics.top"
        :width="visualMetrics.width - visualMetrics.ampX"
        :height="visualMetrics.height"
        :viewBox="`0 0 ${visualMetrics.amp.width} ${visualMetrics.amp.height}`"
        preserveAspectRatio="none"
        overflow="visible"
      >
        <text :x="visualMetrics.amp.left" :y="visualMetrics.amp.ascent" font-size="100" fill="var(--home-visual-design-lime)">&amp;</text>
      </svg>
    </svg>
  </p>
  <!-- The artwork sits between the matching solid and outline glyphs. -->
  <p
    v-for="layer in ['fill', 'outline']"
    :key="layer"
    :ref="element => setDesignTitleRef(element, layer)"
    :data-design-title-layer="layer"
    :aria-hidden="layer === 'fill' ? true : undefined"
    :class="layer === 'fill' ? 'z-[5]' : 'z-20'"
    class="pointer-events-none absolute bottom-0 right-4 inline-block font-display text-capability-display font-normal leading-none tracking-tighter text-[var(--home-visual-design-lime)] sm:right-10"
  >
    <span aria-hidden="true" class="invisible block whitespace-nowrap">DESIGNI</span>
    <span v-if="layer === 'outline'" class="sr-only">DESIGN — PART I</span>
    <svg
      v-if="letterMetrics"
      aria-hidden="true"
      class="absolute left-0 block w-full overflow-visible tracking-normal"
      :style="{ top: `${letterMetrics.top / 100}em`, height: `${letterMetrics.height / 100}em` }"
      :viewBox="`0 0 ${letterMetrics.width} ${letterMetrics.height}`"
      preserveAspectRatio="none"
    >
      <defs v-if="layer === 'outline'">
        <!-- Scale the stroke with the lettering, then clip it to the glyph interior. -->
        <clipPath id="home-design-desi-interior" clipPathUnits="userSpaceOnUse">
          <text :x="letterMetrics.desi.left" :y="letterMetrics.desi.ascent" font-size="100" letter-spacing="-5">DESI</text>
        </clipPath>
        <clipPath id="home-design-gn-interior" clipPathUnits="userSpaceOnUse">
          <text :x="letterMetrics.gn.left" :y="letterMetrics.gn.ascent" font-size="100" letter-spacing="-5">GN</text>
        </clipPath>
      </defs>
      <text
        :x="letterMetrics.desi.left"
        :y="letterMetrics.desi.ascent"
        font-size="100"
        letter-spacing="-5"
        :fill="layer === 'fill' ? 'var(--home-visual-design-lime)' : 'none'"
        :stroke="layer === 'outline' ? 'var(--home-visual-design-lime)' : 'none'"
        :clip-path="layer === 'outline' ? 'url(#home-design-desi-interior)' : undefined"
        stroke-width="2.4"
        stroke-opacity="var(--design-outline-opacity, 1)"
      >DESI</text>
      <svg
        v-if="layer === 'outline'"
        :x="letterMetrics.split"
        y="0"
        :width="letterMetrics.gn.width"
        :height="letterMetrics.height / 3"
        :viewBox="`0 0 ${letterMetrics.part.width} ${letterMetrics.part.height}`"
        preserveAspectRatio="none"
        overflow="visible"
      >
        <text :x="letterMetrics.part.left" :y="letterMetrics.part.ascent" font-size="100" fill="var(--home-visual-design-chapter)">PART</text>
      </svg>
      <svg
        :x="letterMetrics.split"
        :y="letterMetrics.height * (1 / 3 + 0.04)"
        :width="letterMetrics.gn.width"
        :height="letterMetrics.height * (2 / 3 - 0.04)"
        :viewBox="`0 0 ${letterMetrics.gn.width} ${letterMetrics.gn.height}`"
        preserveAspectRatio="none"
        overflow="visible"
      >
        <text
          :x="letterMetrics.gn.left"
          :y="letterMetrics.gn.ascent"
          font-size="100"
          letter-spacing="-5"
          :fill="layer === 'fill' ? 'var(--home-visual-design-lime)' : 'none'"
          :stroke="layer === 'outline' ? 'var(--home-visual-design-lime)' : 'none'"
          :clip-path="layer === 'outline' ? 'url(#home-design-gn-interior)' : undefined"
          stroke-width="2.4"
          stroke-opacity="var(--design-outline-opacity, 1)"
        >GN</text>
      </svg>
      <svg
        v-if="layer === 'outline'"
        :x="letterMetrics.width - letterMetrics.numeral.width"
        y="0"
        :width="letterMetrics.numeral.width"
        :height="letterMetrics.height"
        :viewBox="`0 0 ${letterMetrics.numeral.width} ${letterMetrics.numeral.height}`"
        preserveAspectRatio="none"
        overflow="visible"
      >
        <text :x="letterMetrics.numeral.left" :y="letterMetrics.numeral.ascent" font-size="100" fill="var(--home-visual-design-chapter)">I</text>
      </svg>
    </svg>
  </p>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { useHomeLoadingTask } from '../../../composables/useHomeReadiness'

const typographyTask = useHomeLoadingTask('visual-design-typography')

const visualTitleRoot = ref(null)
const designTitleRoot = ref(null)
const designFillTitleRoot = ref(null)
const letterMetrics = ref(null)
const visualMetrics = ref(null)

onMounted(() => typographyTask.run(async () => {
  await document.fonts.ready
  if (!designTitleRoot.value) return
  // Measure ink bounds, not line boxes, so both rows meet the DESI cap edges.
  const context = document.createElement('canvas').getContext('2d')
  context.font = `100px ${getComputedStyle(designTitleRoot.value).fontFamily}`
  const measure = (text, spacing = '0px') => {
    context.letterSpacing = spacing
    const metrics = context.measureText(text)
    return {
      left: metrics.actualBoundingBoxLeft,
      ascent: metrics.actualBoundingBoxAscent,
      width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
      height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
      metrics
    }
  }
  // Both blocks use the DESIGNI line box and identical visible ink bounds.
  const whole = measure('DESIGNI', '-5px')
  const baseline = (100 - whole.metrics.fontBoundingBoxAscent - whole.metrics.fontBoundingBoxDescent) / 2
    + whole.metrics.fontBoundingBoxAscent
  const visual = measure('VISUAL', '-5px')
  const motion = measure('MOTION', '-5px')
  const amp = measure('&')
  const gap = whole.height * 0.035
  visualMetrics.value = {
    width: whole.width,
    height: whole.height,
    top: baseline - whole.ascent,
    leftWidth: whole.width * 0.74,
    ampX: whole.width * 0.76,
    rowHeight: (whole.height - gap) / 2,
    gap,
    rows: [{ ...visual, text: 'VISUAL' }, { ...motion, text: 'MOTION' }],
    amp
  }
  const design = measure('DESIGN', '-5px')
  const desi = measure('DESI', '-5px')
  const gn = measure('GN', '-5px')
  const part = measure('PART')
  const numeral = measure('I')
  letterMetrics.value = {
    width: whole.width,
    height: whole.height,
    top: baseline - whole.ascent,
    split: design.width - gn.width,
    desi, gn, part, numeral
  }
  await nextTick()
}))

function setDesignTitleRef(element, layer) {
  if (layer === 'fill') designFillTitleRoot.value = element
  else designTitleRoot.value = element
}

function getTitleElements() {
  return {
    visualTitle: visualTitleRoot.value,
    designTitle: designTitleRoot.value,
    designFillTitle: designFillTitleRoot.value
  }
}

defineExpose({ getTitleElements })
</script>

<style scoped>
.home-visual-title-gradient {
  --visual-fade: 0;
  background-image: linear-gradient(
    to bottom,
    var(--card) 0%,
    var(--card) 38%,
    color-mix(in srgb, var(--card) calc(100% - var(--visual-fade) * 28%), transparent) 62%,
    color-mix(in srgb, var(--card) calc(100% - var(--visual-fade) * 74%), transparent) 82%,
    color-mix(in srgb, var(--card) calc(100% - var(--visual-fade) * 100%), transparent) 100%
  );
}

@media (prefers-reduced-motion: reduce) {
  .home-visual-title-gradient {
    --visual-fade: 1;
  }
}

</style>
