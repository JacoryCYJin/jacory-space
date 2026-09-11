<template>
  <p ref="visualTitleRoot" class="home-visual-title-gradient pointer-events-none absolute left-4 top-4 z-0 inline-block bg-clip-text font-display text-capability-display font-normal leading-none tracking-tighter text-transparent sm:left-10 sm:top-6">
    VISUAL
  </p>
  <p ref="designTitleRoot" class="pointer-events-none absolute bottom-0 right-4 z-20 inline-block font-display text-capability-display font-normal leading-none tracking-tighter text-[var(--home-visual-design-lime)] sm:right-10">
    <span aria-hidden="true" class="invisible block whitespace-nowrap">DESIGNI</span>
    <span class="sr-only">DESIGN — PART I</span>
    <svg
      v-if="letterMetrics"
      aria-hidden="true"
      class="absolute left-0 block w-full overflow-visible tracking-normal"
      :style="{ top: `${letterMetrics.top / 100}em`, height: `${letterMetrics.height / 100}em` }"
      :viewBox="`0 0 ${letterMetrics.width} ${letterMetrics.height}`"
      preserveAspectRatio="none"
    >
      <text
        :x="letterMetrics.desi.left"
        :y="letterMetrics.desi.ascent"
        font-size="100"
        letter-spacing="-5"
        fill="var(--home-visual-design-lime)"
      >DESI</text>
      <svg
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
        <text :x="letterMetrics.gn.left" :y="letterMetrics.gn.ascent" font-size="100" letter-spacing="-5" fill="var(--home-visual-design-lime)">GN</text>
      </svg>
      <svg
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
import { onMounted, ref } from 'vue'

const visualTitleRoot = ref(null)
const designTitleRoot = ref(null)
const letterMetrics = ref(null)

onMounted(async () => {
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
  const whole = measure('DESIGNI', '-5px')
  const design = measure('DESIGN', '-5px')
  const desi = measure('DESI', '-5px')
  const gn = measure('GN', '-5px')
  const part = measure('PART')
  const numeral = measure('I')
  const baseline = (100 - whole.metrics.fontBoundingBoxAscent - whole.metrics.fontBoundingBoxDescent) / 2
    + whole.metrics.fontBoundingBoxAscent
  letterMetrics.value = {
    width: whole.width,
    height: whole.height,
    top: baseline - whole.ascent,
    split: design.width - gn.width,
    desi, gn, part, numeral
  }
})

function getTitleElements() {
  return {
    visualTitle: visualTitleRoot.value,
    designTitle: designTitleRoot.value
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
