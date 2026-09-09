<template>
  <section
    data-home-photo-video-page
    class="home-photo-video-page relative isolate grid grid-rows-[auto_1fr] overflow-hidden bg-photo-video-lower text-photo-video-copy"
    aria-label="Photo &amp; Video"
  >
    <div
      data-photo-video-background-upper
      class="home-photo-video-heading pointer-events-none relative z-0 w-full bg-photo-video-background px-[2%]"
    >
      <h2 class="m-0 flex justify-between whitespace-nowrap font-display text-photo-video-display font-normal leading-none tracking-[-0.025em] text-photo-video-title">
        <span class="home-photo-video-word">PHOTO</span>
        <span class="home-photo-video-word">&amp;</span>
        <span class="home-photo-video-word">VIDEO</span>
      </h2>
    </div>
    <aside
      data-photo-video-interests
      lang="en"
      aria-label="Interests and visual influences"
      class="absolute inset-x-[4%] bottom-6 z-0 grid grid-cols-2 gap-x-6 gap-y-6 lg:relative lg:inset-auto lg:ml-[2cqw] lg:mt-[2cqw] lg:block lg:w-[calc(48cqw-0.33*min(100cqw,var(--home-transition-stage-height)*1.6)-1.5rem)] lg:self-start lg:[container-type:inline-size]"
    >
      <div
        v-for="(group, groupIndex) in interestGroups"
        :key="group.id"
        :class="groupIndex === 1 ? 'lg:mt-[13cqw]' : ''"
      >
        <h3 :id="group.id" class="m-0 font-sans text-xs font-medium uppercase leading-relaxed tracking-[0.12em] text-photo-video-copy lg:text-photo-video-caption">
          {{ group.title }}
        </h3>
        <ul
          :aria-labelledby="group.id"
          class="m-0 mt-3 list-none space-y-1 p-0 font-sans text-base font-medium leading-snug tracking-tight lg:mt-[7cqw] lg:space-y-0 lg:font-display lg:text-photo-video-interest lg:font-normal lg:uppercase lg:tracking-[-0.015em] lg:text-photo-video-background"
        >
          <li v-for="item in group.items" :key="item">{{ item }}</li>
        </ul>
      </div>
    </aside>
    <div class="pointer-events-none absolute inset-0 z-10 grid place-items-center">
      <div class="home-photo-video-composition relative isolate aspect-[4/5] w-full sm:aspect-[8/5]">
        <div class="absolute inset-0 z-10">
          <div
            v-for="frame in frames"
            :key="frame.name"
            :data-photo-video-frame="frame.name"
            :class="frame.layout"
            class="pointer-events-none absolute overflow-hidden outline outline-1 outline-white"
            aria-hidden="true"
          >
            <img
              v-if="frame.src"
              :src="frame.src"
              :style="frame.crop"
              class="absolute max-w-none select-none"
              alt=""
              :width="frame.width || 1774"
              :height="frame.height || 887"
              loading="lazy"
              decoding="async"
              draggable="false"
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import collage from '../../../assets/home-photo-video/photo-video-soft-collage.png'
import dinosaur from '../../../assets/home-photo-video/photo-video-dinosaur.png'
import dog from '../../../assets/home-photo-video/photo-video-dog.png'
import cat from '../../../assets/home-photo-video/photo-video-cat.png'

const portraits = [dinosaur, dog, cat]
const interestGroups = [
  {
    id: 'photo-video-subjects',
    title: 'Subjects of interest',
    items: ['Humanities', 'Social sciences', 'Everyday life', 'Culture & memory', 'People & places']
  },
  {
    id: 'photo-video-influences',
    title: 'Visual influences',
    items: ['Documentary', 'Cinematic realism', 'Experimental imagery']
  }
]

// Sample the original windows' interiors without their existing borders.
function crop(x, y, width, height) {
  return {
    width: `${1774 / width * 100}%`,
    height: `${887 / height * 100}%`,
    left: `${-x / width * 100}%`,
    top: `${-y / height * 100}%`
  }
}

const frames = ref([
  {
    name: 'landscape',
    src: null,
    width: 1448,
    height: 1086,
    layout: 'left-[18%] top-[27%] z-0 aspect-[4/3] w-[64%] sm:left-[27%] sm:top-[25%] sm:w-[46%]',
    crop: { width: '100%', height: '100%', left: 0, top: 0, objectFit: 'contain' }
  },
  {
    name: 'portrait',
    src: collage,
    layout: 'left-[72%] top-[42%] z-10 aspect-[9/16] w-[23%] sm:left-[68%] sm:top-[35.2%] sm:w-[18.4%]',
    crop: crop(1030, 95, 318.375, 566)
  },
  {
    name: 'square',
    src: collage,
    layout: 'left-[5%] top-[51%] z-20 aspect-square w-[26%] sm:left-[17%] sm:top-[57%] sm:w-[18%]',
    crop: crop(38, 222, 175, 175)
  }
])

onMounted(() => {
  // Pick once per visit, after hydration, so static and client markup agree.
  frames.value[0].src = portraits[Math.floor(Math.random() * portraits.length)]
})
</script>

<style scoped>
.home-photo-video-page {
  height: var(--home-transition-stage-height);
  container-type: inline-size;
}

.home-photo-video-composition {
  container-type: inline-size;
  max-width: calc(var(--home-transition-stage-height) * 0.8);
}

.home-photo-video-heading {
  /* Keep the mobile title aligned with the collage, with equal total gaps. */
  padding-block: max(1rem, calc(var(--home-transition-stage-height) / 2 - 40cqw));
}

.home-photo-video-word {
  /* Remove font-internal leading so visible capitals have balanced spacing. */
  text-box: trim-both cap alphabetic;
}

@media (min-width: 640px) {
  .home-photo-video-composition {
    max-width: calc(var(--home-transition-stage-height) * 1.6);
  }

  .home-photo-video-heading {
    padding-block: 2.5cqw;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .home-photo-video-page {
    position: sticky;
    top: var(--navbar-height);
    z-index: 0;
  }
}
</style>
