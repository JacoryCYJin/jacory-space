<template>
  <p ref="motionTitleRoot" class="home-motion-title-gradient pointer-events-none absolute left-4 top-4 z-0 inline-block bg-clip-text font-display text-motion-design-display font-normal leading-none tracking-tighter text-transparent sm:left-10 sm:top-6">
    MOTION
  </p>
  <p ref="designTitleRoot" class="home-design-title-gradient pointer-events-none absolute bottom-0 right-4 z-20 inline-block bg-clip-text font-display text-motion-design-display font-normal leading-none tracking-tighter text-transparent sm:right-10">
    DESIGN
  </p>
</template>

<script setup>
import { ref } from 'vue'

const motionTitleRoot = ref(null)
const designTitleRoot = ref(null)

function getTitleElements() {
  return {
    motionTitle: motionTitleRoot.value,
    designTitle: designTitleRoot.value
  }
}

defineExpose({ getTitleElements })
</script>

<style scoped>
.home-motion-title-gradient {
  background-image: linear-gradient(
    to bottom,
    var(--card) 0%,
    var(--card) 38%,
    color-mix(in srgb, var(--card) 72%, transparent) 62%,
    color-mix(in srgb, var(--card) 26%, transparent) 82%,
    transparent 100%
  );
}

.home-design-title-gradient {
  background-image: linear-gradient(
    to bottom,
    var(--home-motion-design-red) 0%,
    var(--home-motion-design-red) 54%,
    color-mix(in srgb, var(--home-motion-design-red) 88%, var(--ink)) 78%,
    color-mix(in srgb, var(--home-motion-design-red) 72%, var(--ink)) 100%
  );
}
</style>
