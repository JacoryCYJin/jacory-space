<template>
  <section
    data-home-video-creation-page
    class="home-video-creation-page relative isolate grid place-items-center overflow-hidden"
    aria-label="Video creation"
  >
    <div class="home-video-composition relative aspect-[4/5] w-full sm:aspect-[9/5]">
      <div
        v-for="frame in frames"
        :key="frame.name"
        :data-video-frame="frame.name"
        :class="frame.layout"
        class="pointer-events-none absolute overflow-hidden border border-white"
        aria-hidden="true"
      >
        <img
          :src="collage"
          :style="frame.crop"
          class="absolute max-w-none select-none"
          alt=""
          width="1774"
          height="887"
          loading="lazy"
          decoding="async"
          draggable="false"
        >
      </div>
      <h2 class="pointer-events-none absolute inset-x-[5%] bottom-[10%] m-0 whitespace-nowrap text-center font-display text-video-title font-normal leading-none tracking-tight text-foreground sm:bottom-[4%]">
        <span class="inline-block scale-x-[1.45]">VIDEO CREATION</span>
      </h2>
    </div>
  </section>
</template>

<script setup>
import collage from '../../../assets/home-capabilities/video-soft-collage.png'

// Sample the original windows' interiors without their existing borders.
function crop(x, y, width, height) {
  return {
    width: `${1774 / width * 100}%`,
    height: `${887 / height * 100}%`,
    left: `${-x / width * 100}%`,
    top: `${-y / height * 100}%`
  }
}

const frames = [
  {
    name: 'landscape',
    layout: 'left-[14%] top-[27%] z-0 aspect-[4/3] w-[64%] sm:left-[21.5%] sm:top-[23%] sm:w-[38%]',
    crop: crop(160, 473, 552, 414)
  },
  {
    name: 'portrait',
    layout: 'left-[61%] top-[10%] z-10 aspect-[9/16] w-[28%] sm:left-[57.3%] sm:top-[5.5%] sm:w-[20.3%]',
    crop: crop(1030, 95, 318.375, 566)
  },
  {
    name: 'square',
    layout: 'left-[8%] top-[18%] z-20 aspect-square w-[22%] sm:left-[14.4%] sm:top-[8.2%] sm:w-[13.6%]',
    crop: crop(38, 222, 175, 175)
  }
]
</script>

<style scoped>
.home-video-creation-page {
  height: var(--home-transition-stage-height);
  background: var(--home-video-creation-background);
}

.home-video-composition {
  container-type: inline-size;
  max-width: calc(var(--home-transition-stage-height) * 0.8);
}

@media (min-width: 640px) {
  .home-video-composition {
    max-width: calc(var(--home-transition-stage-height) * 1.8);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .home-video-creation-page {
    position: sticky;
    top: var(--navbar-height);
    z-index: 0;
  }
}
</style>
