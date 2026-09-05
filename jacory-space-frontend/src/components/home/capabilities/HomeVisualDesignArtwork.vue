<template>
  <div class="pointer-events-none absolute inset-0 z-10 block h-full w-full select-none sm:inset-auto sm:bottom-0 sm:left-1/2 sm:h-auto sm:w-4/5 sm:-translate-x-1/2">
    <img
      ref="illustrationRoot"
      :src="redHairedAnime"
      alt=""
      class="home-visual-design-illustration block h-full w-full sm:h-auto"
    >
  </div>
</template>

<script setup>
import { ref } from 'vue'
import redHairedAnime from '../../../assets/home-sleep-desk/red-haired-anime-4k.png'

const illustrationRoot = ref(null)

function getIllustrationElement() {
  return illustrationRoot.value
}

defineExpose({ getIllustrationElement })
</script>

<style scoped>
.home-visual-design-illustration {
  object-fit: cover;
  object-position: center 48%;
  filter: saturate(1.06) contrast(1.04);
}

@media (max-width: 639px) {
  .home-visual-design-illustration {
    object-position: 66% center;
  }
}
</style>
