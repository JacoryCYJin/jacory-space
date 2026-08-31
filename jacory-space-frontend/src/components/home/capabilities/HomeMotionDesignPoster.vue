<template>
  <div
    ref="headerRoot"
    data-home-capabilities-header
    class="home-capabilities-header"
    aria-hidden="true"
  >
    <HomeMotionDesignArtwork ref="artworkRoot" />
    <HomeMotionDesignTitles ref="titlesRoot" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HomeMotionDesignArtwork from './HomeMotionDesignArtwork.vue'
import HomeMotionDesignTitles from './HomeMotionDesignTitles.vue'

const headerRoot = ref(null)
const artworkRoot = ref(null)
const titlesRoot = ref(null)

function getMotionDesignElements() {
  const illustration = artworkRoot.value?.getIllustrationElement?.()
  const titles = titlesRoot.value?.getTitleElements?.()

  if (!headerRoot.value || !illustration || !titles?.motionTitle || !titles.designTitle) return null

  return {
    header: headerRoot.value,
    illustration,
    motionTitle: titles.motionTitle,
    designTitle: titles.designTitle
  }
}

defineExpose({ getMotionDesignElements })
</script>

<style scoped>
.home-capabilities-header {
  height: var(--home-transition-stage-height);
  isolation: isolate;
  position: sticky;
  top: var(--navbar-height);
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .home-capabilities-header {
    position: relative;
    top: auto;
  }
}
</style>
