<template>
  <main ref="heroRoot" class="grain w-full bg-background">
    <HomeLoadingIdentity @complete="handleLoadingComplete" />

    <section
      id="top"
      data-home-hero-section
      class="relative mt-[var(--navbar-height)] flex h-[calc(100svh-var(--navbar-height))] w-full flex-col justify-center px-5 [--navbar-height:4rem] md:px-8"
    >
      <HomeHeroScene />

      <h1
        data-hero-line-mask
        class="absolute inset-x-5 top-28 z-10 overflow-hidden font-sans font-medium leading-[0.84] tracking-[-0.065em] text-foreground md:inset-x-8 md:top-32"
      >
        <span data-hero-title-line class="block text-center text-[clamp(5rem,13.6vw,14rem)]">
          WHO? JACORY
        </span>
      </h1>

      <p
        data-hero-line-mask
        class="absolute inset-x-5 bottom-28 z-10 overflow-hidden text-center font-sans font-medium leading-none tracking-[-0.055em] text-foreground md:inset-x-8 md:bottom-32"
      >
        <span data-hero-title-line class="block text-[clamp(2rem,3.4vw,4.25rem)]">
          Makes Ideas Move
        </span>
      </p>

    </section>

    <section
      data-home-transition-target
      aria-hidden="true"
      class="min-h-screen bg-background"
    />
  </main>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import HomeLoadingIdentity from '../HomeLoadingIdentity.vue'
import HomeHeroScene from './HomeHeroScene.vue'

gsap.registerPlugin(CustomEase)

const heroRoot = ref(null)
let heroContext
let heroTimeline
let reducedMotionQuery
let heroReady = false
let loadingComplete = false

const playHeroIntro = () => {
  if (!heroReady || !loadingComplete) return
  heroTimeline?.play(0)
}

const handleLoadingComplete = () => {
  loadingComplete = true
  playHeroIntro()
}

onMounted(() => {
  const root = heroRoot.value
  if (!root) return

  const heroEase = CustomEase.create('personal-os-hero', '0.16,1,0.3,1')
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  heroContext = gsap.context(() => {
    const titleMasks = gsap.utils.toArray('[data-hero-line-mask]')
    const titleLines = gsap.utils.toArray('[data-hero-title-line]')
    if (reducedMotionQuery.matches) {
      gsap.set([...titleMasks, ...titleLines], {
        clearProps: 'all',
        autoAlpha: 1,
        y: 0,
        clipPath: 'inset(0% 0% -30% 0%)'
      })
      heroReady = true
      return
    }

    gsap.set(titleMasks, {
      clipPath: 'inset(0% 0% 100% 0%)'
    })
    gsap.set(titleLines, {
      autoAlpha: 0,
      y: 32
    })
    heroTimeline = gsap.timeline({ paused: true, defaults: { ease: heroEase } })

    heroTimeline
      .to(titleMasks, {
        clipPath: 'inset(0% 0% -30% 0%)',
        duration: 1.05,
        stagger: 0.14
      }, 0.28)
      .to(titleLines, {
        autoAlpha: 1,
        y: 0,
        duration: 1.05,
        stagger: 0.14
      }, 0.28)

    heroReady = true
    playHeroIntro()
  }, root)
})

onBeforeUnmount(() => {
  heroContext?.revert()
})
</script>
