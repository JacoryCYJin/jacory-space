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
          :src="redHairedAnime"
          alt=""
          class="home-motion-design-illustration pointer-events-none absolute inset-0 z-10 block h-full w-full select-none md:inset-auto md:bottom-0 md:left-1/2 md:h-auto md:w-4/5 md:-translate-x-1/2"
        >
        <p class="home-motion-title-gradient pointer-events-none absolute left-4 top-4 z-0 inline-block bg-clip-text font-display text-motion-design-display font-normal leading-none tracking-tighter text-transparent md:left-10 md:top-6">
          MOTION
        </p>
        <p class="home-design-title-gradient pointer-events-none absolute bottom-0 right-4 z-20 inline-block bg-clip-text font-display text-motion-design-display font-normal leading-none tracking-tighter text-transparent md:right-10">
          DESIGN
        </p>
      </div>
    </div>

    <h2 class="sr-only">Motion Design</h2>
    <slot />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import redHairedAnime from '../../../assets/home-sleep-desk/red-haired-anime-4k.png'

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
  isolation: isolate;
  position: sticky;
  top: var(--navbar-height);
  overflow: hidden;
}

.home-motion-design-illustration {
  object-fit: cover;
  object-position: center 48%;
  filter: saturate(1.06) contrast(1.04);
}

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
  .home-motion-design-illustration {
    object-position: 66% center;
  }
}
</style>
