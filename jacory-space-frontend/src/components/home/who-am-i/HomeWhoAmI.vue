<template>
  <section
    id="top"
    ref="heroRoot"
    data-home-who-am-i
    class="relative mt-[var(--navbar-height)] flex h-[calc(100svh-var(--navbar-height))] w-full flex-col justify-center px-5 [--navbar-height:4rem] md:px-8"
  >
    <HomeHeroScene
      :active="active"
      @ready="emit('ready')"
      @takeover-change="emit('takeover-change', $event)"
    />

    <h1
      class="home-hero-brand absolute inset-x-5 top-28 z-10 overflow-visible font-display font-normal leading-[0.84] tracking-[-0.03em] text-foreground md:inset-x-8 md:top-32"
    >
      <span data-hero-brand-line class="block text-center text-[clamp(5rem,13.6vw,14rem)]">WHO AM I ?</span>
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
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import HomeHeroScene from './HomeHeroScene.vue'

gsap.registerPlugin(CustomEase)

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['ready', 'takeover-change'])
const heroRoot = ref(null)
let heroContext
let heroTimeline
let heroReady = false

function playHeroIntro() {
  if (props.active && heroReady) heroTimeline?.play(0)
}

onMounted(() => {
  const root = heroRoot.value
  if (!root) return

  const heroEase = CustomEase.create('personal-os-hero', '0.16,1,0.3,1')
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  heroContext = gsap.context(() => {
    const brandLine = root.querySelector('[data-hero-brand-line]')
    const statementWords = Array.from(root.querySelectorAll('[data-hero-statement-word]'))
    const titleLines = [brandLine, ...statementWords].filter(Boolean)

    if (reducedMotionQuery.matches) {
      gsap.set(titleLines, { clearProps: 'all', autoAlpha: 1, y: 0 })
      heroReady = true
      return
    }

    gsap.set([brandLine, ...statementWords], { autoAlpha: 0 })
    gsap.set(brandLine, { x: -52, transformOrigin: '50% 50%' })
    gsap.set(statementWords, { x: -18 })

    heroTimeline = gsap.timeline({ paused: true, defaults: { ease: heroEase } })
    heroTimeline
      .to(brandLine, { autoAlpha: 1, x: 0, duration: 0.68 }, 0.08)
      .to(statementWords, { autoAlpha: 1, x: 0, duration: 0.46, stagger: 0.12 }, 0.72)

    heroReady = true
    playHeroIntro()
  }, root)
})

watch(() => props.active, playHeroIntro)

onBeforeUnmount(() => {
  heroContext?.revert()
})
</script>

<style scoped>
@media (max-height: 1100px) {
  .home-hero-brand { top: 4rem; }
  .home-hero-statement { bottom: 4rem; }
}
</style>
