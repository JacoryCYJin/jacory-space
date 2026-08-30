<template>
  <section
    data-home-capabilities-page
    class="home-capabilities-page relative z-30"
    aria-label="Creative capabilities"
  >
    <div
      ref="trackRoot"
      data-home-capabilities-track
      class="home-capabilities-track"
    >
      <div
        ref="headerRoot"
        data-home-capabilities-header
        class="home-capabilities-header"
        aria-hidden="true"
      >
        <div class="pointer-events-none absolute inset-0 z-10 block h-full w-full select-none sm:inset-auto sm:bottom-0 sm:left-1/2 sm:h-auto sm:w-4/5 sm:-translate-x-1/2">
          <img
            ref="illustrationRoot"
            :src="redHairedAnime"
            alt=""
            class="home-motion-design-illustration block h-full w-full sm:h-auto"
          >
        </div>
        <p ref="motionTitleRoot" class="home-motion-title-gradient pointer-events-none absolute left-4 top-4 z-0 inline-block bg-clip-text font-display text-motion-design-display font-normal leading-none tracking-tighter text-transparent sm:left-10 sm:top-6">
          MOTION
        </p>
        <p ref="designTitleRoot" class="home-design-title-gradient pointer-events-none absolute bottom-0 right-4 z-20 inline-block bg-clip-text font-display text-motion-design-display font-normal leading-none tracking-tighter text-transparent sm:right-10">
          DESIGN
        </p>
      </div>
    </div>

    <h2 class="sr-only">Motion Design</h2>
    <slot />
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import redHairedAnime from '../../../assets/home-sleep-desk/red-haired-anime-4k.png'

gsap.registerPlugin(ScrollTrigger)

const emit = defineEmits(['header-ready'])
const headerRoot = ref(null)
const trackRoot = ref(null)
const illustrationRoot = ref(null)
const motionTitleRoot = ref(null)
const designTitleRoot = ref(null)
let motionDesignMedia
let motionDesignResizeObserver
let motionDesignResizeFrame = 0
let motionDesignTimeline

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function resolveTypographyLockup() {
  if (!headerRoot.value || !motionTitleRoot.value || !designTitleRoot.value) return null

  const header = headerRoot.value
  const motionTitle = motionTitleRoot.value
  const designTitle = designTitleRoot.value
  const availableGap = Math.max(0, header.offsetHeight - motionTitle.offsetHeight - designTitle.offsetHeight)
  const lockupGap = clamp(
    Math.min(availableGap * 0.16, Math.min(motionTitle.offsetHeight, designTitle.offsetHeight) * 0.08),
    0,
    availableGap
  )
  const lockupHeight = motionTitle.offsetHeight + designTitle.offsetHeight + lockupGap
  const lockupTop = (header.offsetHeight - lockupHeight) / 2

  return {
    motion: {
      x: (header.offsetWidth - motionTitle.offsetWidth) / 2 - motionTitle.offsetLeft,
      y: lockupTop - motionTitle.offsetTop
    },
    design: {
      x: (header.offsetWidth - designTitle.offsetWidth) / 2 - designTitle.offsetLeft,
      y: lockupTop + motionTitle.offsetHeight + lockupGap - designTitle.offsetTop
    }
  }
}

onMounted(async () => {
  emit('header-ready', headerRoot.value)

  await nextTick()
  if (!trackRoot.value || !headerRoot.value || !illustrationRoot.value || !motionTitleRoot.value || !designTitleRoot.value) return

  await document.fonts?.ready

  motionDesignMedia = gsap.matchMedia()
  motionDesignMedia.add('(prefers-reduced-motion: no-preference)', () => {
    const motionTitle = motionTitleRoot.value
    const illustration = illustrationRoot.value
    const designTitle = designTitleRoot.value
    const rebuildTimeline = () => {
      const lockup = resolveTypographyLockup()
      if (!lockup) return

      motionDesignTimeline?.scrollTrigger?.kill()
      motionDesignTimeline?.kill()

      const lockupHold = { value: 0 }
      const posterHold = { value: 0 }

      gsap.set([motionTitle, designTitle], { autoAlpha: 0, clipPath: 'none' })
      gsap.set(motionTitle, lockup.motion)
      gsap.set(designTitle, lockup.design)
      gsap.set(illustration, { autoAlpha: 0, y: 14 })

      motionDesignTimeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'home-motion-design-entrance',
          trigger: trackRoot.value,
          start: 'top top+=64',
          end: () => `+=${Math.max(0, trackRoot.value.offsetHeight - headerRoot.value.offsetHeight)}`,
          scrub: true,
          invalidateOnRefresh: true
        }
      })
        .addLabel('lockup', 0.12)
        .to([motionTitle, designTitle], { autoAlpha: 1, duration: 0.12 }, 'lockup')
        .to(lockupHold, { value: 1, duration: 0.14 }, 'lockup+=0.12')
        .addLabel('recompose', 0.38)
        .to(motionTitle, { x: 0, y: 0, duration: 0.34 }, 'recompose')
        .to(designTitle, { x: 0, y: 0, duration: 0.34 }, 'recompose')
        .to(illustration, { autoAlpha: 1, y: 0, duration: 0.34 }, 'recompose')
        .addLabel('poster', 'recompose+=0.34')
        .to(posterHold, { value: 1, duration: 0.28 }, 'poster')

      window.requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    const scheduleTimelineRebuild = () => {
      window.cancelAnimationFrame(motionDesignResizeFrame)
      motionDesignResizeFrame = window.requestAnimationFrame(() => {
        motionDesignResizeFrame = 0
        rebuildTimeline()
      })
    }
    rebuildTimeline()
    motionDesignResizeObserver = new ResizeObserver(scheduleTimelineRebuild)
    motionDesignResizeObserver.observe(headerRoot.value)

    return () => {
      motionDesignResizeObserver?.disconnect()
      motionDesignResizeObserver = undefined
      window.cancelAnimationFrame(motionDesignResizeFrame)
      motionDesignResizeFrame = 0
      motionDesignTimeline?.scrollTrigger?.kill()
      motionDesignTimeline?.kill()
      motionDesignTimeline = undefined
      gsap.set([motionTitle, illustration, designTitle], { clearProps: 'all' })
    }
  })

  motionDesignMedia.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set(
      [motionTitleRoot.value, illustrationRoot.value, designTitleRoot.value],
      { clearProps: 'all' }
    )
  })
})

onBeforeUnmount(() => {
  motionDesignResizeObserver?.disconnect()
  window.cancelAnimationFrame(motionDesignResizeFrame)
  motionDesignMedia?.revert()
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

@media (max-width: 639px) {
  .home-motion-design-illustration {
    object-position: 66% center;
  }
}
</style>
