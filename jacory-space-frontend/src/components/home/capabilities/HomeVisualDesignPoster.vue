<template>
  <div
    ref="headerRoot"
    data-home-capabilities-header
    class="home-capabilities-header"
    aria-hidden="true"
  >
    <HomeVisualDesignArtwork ref="artworkRoot" />
    <HomeVisualDesignTitles ref="titlesRoot" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HomeVisualDesignArtwork from './HomeVisualDesignArtwork.vue'
import HomeVisualDesignTitles from './HomeVisualDesignTitles.vue'

const headerRoot = ref(null)
const artworkRoot = ref(null)
const titlesRoot = ref(null)

function getVisualDesignElements() {
  const illustration = artworkRoot.value?.getIllustrationElement?.()
  const titles = titlesRoot.value?.getTitleElements?.()

  if (!headerRoot.value || !illustration || !titles?.visualTitle || !titles.designTitle) return null

  return {
    header: headerRoot.value,
    illustration,
    visualTitle: titles.visualTitle,
    designTitle: titles.designTitle
  }
}

defineExpose({ getVisualDesignElements })
</script>

<style scoped>
.home-capabilities-header {
  background: #000;
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
