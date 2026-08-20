<template>
  <main ref="heroRoot" class="grain w-full bg-background">
    <HomeLoadingIdentity
      :hero-ready="heroSceneReady"
      :dot-matrix-ready="dotMatrixReady"
      @complete="handleLoadingComplete"
    />

    <section
      id="top"
      data-home-hero-section
      class="relative mt-[var(--navbar-height)] flex h-[calc(100svh-var(--navbar-height))] w-full flex-col justify-center px-5 [--navbar-height:4rem] md:px-8"
    >
      <HomeHeroScene
        :active="loadingComplete"
        @ready="handleHeroSceneReady"
        @takeover-change="handleTakeoverChange"
      />

      <HomeFallingIllustrations :active="loadingComplete" />

      <h1
        class="home-hero-brand absolute inset-x-5 top-28 z-10 overflow-visible font-display font-normal leading-[0.84] tracking-[-0.03em] text-foreground md:inset-x-8 md:top-32"
      >
        <span data-hero-brand-line class="block text-center text-[clamp(5rem,13.6vw,14rem)]">
          WHO AM I ?
        </span>
      </h1>

      <p
        class="home-hero-statement absolute inset-x-5 bottom-28 z-10 overflow-visible text-center font-display font-normal leading-none tracking-[-0.03em] text-foreground md:inset-x-8 md:bottom-32"
      >
        <span data-hero-statement-line class="flex justify-center gap-[0.16em] text-[clamp(2rem,3.4vw,4.25rem)]">
          <span data-hero-statement-word class="inline-block">Makes</span>
          <span data-hero-statement-word class="inline-block">Ideas</span>
          <span data-hero-statement-word class="inline-block">Move</span>
        </span>
      </p>

    </section>

    <HomeCreativeCapabilities :identity-visible="transitionReady">
      <template #identity="{ scatterProgress }">
        <HomeDotMatrixField
          :scatter-progress="scatterProgress"
          @ready="handleDotMatrixReady"
        />
      </template>
    </HomeCreativeCapabilities>
  </main>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import HomeLoadingIdentity from './loading/HomeLoadingIdentity.vue'
import HomeCreativeCapabilities from './HomeCreativeCapabilities.vue'
import HomeDotMatrixField from './HomeDotMatrixField.vue'
import HomeFallingIllustrations from './HomeFallingIllustrations.vue'
import HomeHeroScene from './HomeHeroScene.vue'

gsap.registerPlugin(CustomEase)

const heroRoot = ref(null)
const transitionReady = ref(false)
const heroSceneReady = ref(false)
const dotMatrixReady = ref(false)
let heroContext
let heroTimeline
let reducedMotionQuery
let heroReady = false
const loadingComplete = ref(false)

const playHeroIntro = () => {
  if (!heroReady || !loadingComplete.value) return
  heroTimeline?.play(0)
}

const handleLoadingComplete = () => {
  loadingComplete.value = true
  playHeroIntro()
}

const handleTakeoverChange = (isComplete) => {
  transitionReady.value = isComplete
}

const handleHeroSceneReady = () => {
  heroSceneReady.value = true
  if (import.meta.env.DEV) performance.mark('home-loader:hero-ready')
}

const handleDotMatrixReady = () => {
  dotMatrixReady.value = true
  if (import.meta.env.DEV) performance.mark('home-loader:dot-matrix-ready')
}

onMounted(() => {
  const root = heroRoot.value
  if (!root) return

  const heroEase = CustomEase.create('personal-os-hero', '0.16,1,0.3,1')
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  transitionReady.value = reducedMotionQuery.matches

  heroContext = gsap.context(() => {
    const brandLine = root.querySelector('[data-hero-brand-line]')
    const statementLine = root.querySelector('[data-hero-statement-line]')
    const statementWords = Array.from(root.querySelectorAll('[data-hero-statement-word]'))
    const titleLines = [brandLine, statementLine, ...statementWords].filter(Boolean)
    if (reducedMotionQuery.matches) {
      gsap.set(titleLines, {
        clearProps: 'all',
        autoAlpha: 1,
        y: 0
      })
      heroReady = true
      return
    }

    gsap.set([brandLine, ...statementWords], {
      autoAlpha: 0
    })
    gsap.set(brandLine, {
      x: -52,
      transformOrigin: '50% 50%'
    })
    gsap.set(statementWords, {
      x: -18
    })
    heroTimeline = gsap.timeline({ paused: true, defaults: { ease: heroEase } })

    heroTimeline
      .to(brandLine, {
        autoAlpha: 1,
        x: 0,
        duration: 0.68
      }, 0.08)
      .to(statementWords, {
        autoAlpha: 1,
        x: 0,
        duration: 0.46,
        stagger: 0.12
      }, 0.72)

    heroReady = true
    playHeroIntro()
  }, root)
})

onBeforeUnmount(() => {
  heroContext?.revert()
})
</script>

<style scoped>
@media (max-height: 1100px) {
  .home-hero-brand {
    top: 4rem;
  }

  .home-hero-statement {
    bottom: 4rem;
  }
}

</style>
