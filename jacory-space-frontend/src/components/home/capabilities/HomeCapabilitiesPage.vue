<template>
  <section
    data-home-capabilities-page
    class="home-capabilities-page relative z-30"
    aria-label="Creative capabilities"
  >
    <div
      data-home-capabilities-track
      class="home-capabilities-track"
    >
      <div
        ref="headerRoot"
        data-home-capabilities-header
        class="home-capabilities-header"
        aria-hidden="true"
      >
        <img
          :src="sleepingWorkbench"
          alt=""
          class="home-sleep-desk-illustration pointer-events-none absolute bottom-0 left-1/2 block max-w-none -translate-x-1/2 select-none"
        >
      </div>
    </div>

    <h2 class="sr-only">Creative capabilities</h2>
    <slot />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import sleepingWorkbench from '../../../assets/home-sleep-desk/sleeping-workbench-white-line.png'

const emit = defineEmits(['header-ready'])
const headerRoot = ref(null)

onMounted(() => {
  emit('header-ready', headerRoot.value)
})
</script>

<style scoped>
.home-capabilities-page {
  margin-top: calc(-1 * var(--home-transition-stage-height));
  background: #000;
}

.home-capabilities-track {
  height: calc(var(--home-transition-stage-height) * 2.4);
}

.home-capabilities-header {
  height: var(--home-transition-stage-height);
  position: sticky;
  top: var(--navbar-height);
  overflow: hidden;
}

.home-sleep-desk-illustration {
  width: 60%;
  filter: brightness(0.62);
}

@media (prefers-reduced-motion: reduce) {
  .home-capabilities-page {
    margin-top: 0;
  }

  .home-capabilities-track {
    height: var(--home-transition-stage-height);
  }

  .home-capabilities-header {
    position: relative;
    top: auto;
  }
}

@media (max-width: 767px) {
  .home-sleep-desk-illustration {
    width: 100%;
  }
}
</style>
