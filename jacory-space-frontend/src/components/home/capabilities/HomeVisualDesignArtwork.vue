<template>
  <div class="pointer-events-none absolute bottom-0 left-[47%] z-10 block h-[99%] w-max -translate-x-1/2 select-none">
    <img
      ref="illustrationRoot"
      :src="redHairedAnimeCharacter"
      alt=""
      loading="eager"
      decoding="async"
      class="block h-full w-auto max-w-none"
    >
  </div>
</template>

<script setup>
import { ref } from 'vue'
import redHairedAnimeCharacter from '../../../assets/home-visual-design/red-haired-original-style-transparent-4k.png'

const illustrationRoot = ref(null)

function getIllustrationElement() {
  return illustrationRoot.value
}

defineExpose({ getIllustrationElement })
</script>
