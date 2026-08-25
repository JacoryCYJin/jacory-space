<template>
  <section
    data-home-capabilities-page
    class="home-capabilities-page relative bg-background"
    aria-label="Creative capabilities"
  >
    <div
      ref="headerRoot"
      data-home-capabilities-header
      class="home-capabilities-header"
      aria-hidden="true"
    >
      <slot name="header" />
    </div>

    <h2 class="sr-only">Creative capabilities</h2>
    <slot />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const emit = defineEmits(['header-ready'])
const headerRoot = ref(null)

onMounted(() => {
  emit('header-ready', headerRoot.value)
})
</script>

<style scoped>
.home-capabilities-page {
  margin-top: calc(-1 * var(--home-transition-stage-height));
}

.home-capabilities-header {
  height: var(--home-transition-stage-height);
}

@media (prefers-reduced-motion: reduce) {
  .home-capabilities-page {
    margin-top: 0;
  }
}
</style>
