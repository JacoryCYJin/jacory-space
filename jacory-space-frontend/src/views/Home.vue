<template>
  <main ref="heroRoot" class="grain bg-background pt-[var(--navbar-height)] [--navbar-height:4rem]">
    <HomeLoadingOverlay @complete="handleLoadingComplete" />

    <section
      id="top"
      class="relative flex min-h-[calc(100svh-var(--navbar-height))] flex-col justify-between px-5 pb-10 pt-8 md:px-8 md:pt-12"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-5 bottom-0 top-0 hidden md:block md:inset-x-8"
      >
        <div class="mx-auto grid h-full w-full max-w-[1440px] grid-cols-12">
          <div
            v-for="column in 12"
            :key="column"
            data-hero-grid-line
            class="border-l border-line/50 last:border-r"
          />
        </div>
      </div>

      <div class="relative mx-auto grid w-full max-w-[1440px] grid-cols-12 gap-y-8">
        <div data-hero-meta class="col-span-12 max-w-sm md:col-span-4 md:col-start-2">
          <p class="tech mb-3">Fig. 00 — Cover</p>
          <p class="text-pretty text-sm leading-relaxed text-muted-foreground">
            {{ heroDescription }}
          </p>
        </div>

        <div data-hero-side-meta class="col-span-12 hidden text-right sm:block md:col-span-2 md:col-start-11">
          <p class="tech">Edition</p>
          <p class="font-mono text-sm text-foreground">MMXXVI / 01</p>
        </div>
      </div>

      <div class="relative mx-auto grid w-full max-w-[1440px] grid-cols-12">
        <h1
          class="col-span-12 font-sans font-medium leading-[0.84] tracking-[-0.055em] text-foreground md:col-span-9 md:col-start-2"
        >
          <span data-hero-line-mask class="-mb-[0.12em] block overflow-hidden pb-[0.28em]">
            <span data-hero-title-line class="block text-[clamp(5.4rem,17vw,10.5rem)] md:text-[clamp(5.4rem,12vw,11.875rem)]">
              Personal
            </span>
          </span>
          <span data-hero-line-mask class="-mb-[0.12em] block overflow-hidden pb-[0.28em]">
            <span data-hero-title-line class="inline-block text-[clamp(5.4rem,17vw,10.5rem)] md:text-[clamp(5.4rem,12vw,11.875rem)]">
              operating
            </span>
            <span class="align-top font-mono text-[clamp(1.5rem,3.2vw,2.375rem)] tracking-normal text-blue md:text-[clamp(1.75rem,1.9vw,2.625rem)]">
              <span data-hero-os class="inline-block">/os</span>
            </span>
          </span>
          <span data-hero-line-mask class="-mb-[0.12em] block overflow-hidden pb-[0.28em]">
            <span data-hero-title-line class="block text-[clamp(5.4rem,17vw,10.5rem)] italic text-foreground md:text-[clamp(5.4rem,12vw,11.875rem)]">
              system
            </span>
          </span>
        </h1>
      </div>

      <div
        data-hero-bottom
        class="relative mx-auto flex w-full max-w-[1440px] origin-left items-end justify-between border-t border-line pt-5"
      >
        <RouterLink to="/tools" class="group flex items-center gap-3">
          <span data-hero-dot class="inline-block h-1.5 w-1.5 rounded-full bg-blue" />
          <span class="tech transition-colors group-hover:text-blue">Scroll — index follows</span>
        </RouterLink>

        <p class="hidden max-w-[16rem] text-right text-xs leading-relaxed text-muted-foreground md:block">
          {{ heroKeywords }}
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import HomeLoadingOverlay from '../components/HomeLoadingOverlay.vue'

gsap.registerPlugin(CustomEase)

const heroRoot = ref(null)
const { t } = useI18n()
const heroDescription = computed(() => t('home.hero.description'))
const heroKeywords = computed(() => t('home.hero.keywords'))
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
    const gridLines = gsap.utils.toArray('[data-hero-grid-line]')
    const titleMasks = gsap.utils.toArray('[data-hero-line-mask]')
    const titleLines = gsap.utils.toArray('[data-hero-title-line]')
    const meta = root.querySelector('[data-hero-meta]')
    const sideMeta = root.querySelector('[data-hero-side-meta]')
    const osMarker = root.querySelector('[data-hero-os]')
    const bottomLine = root.querySelector('[data-hero-bottom]')
    const dot = root.querySelector('[data-hero-dot]')

    if (reducedMotionQuery.matches) {
      gsap.set([...gridLines, ...titleMasks, ...titleLines, meta, sideMeta, osMarker, bottomLine, dot], {
        clearProps: 'all',
        autoAlpha: 1,
        y: 0,
        scaleX: 1,
        clipPath: 'inset(0% 0% -30% 0%)'
      })
      heroReady = true
      return
    }

    gsap.set(gridLines, { autoAlpha: 0 })
    gsap.set(meta, { autoAlpha: 0, y: 10 })
    gsap.set(sideMeta, { autoAlpha: 0, y: 8 })
    gsap.set(titleMasks, {
      clipPath: 'inset(0% 0% 100% 0%)'
    })
    gsap.set(titleLines, {
      autoAlpha: 0,
      y: 32
    })
    gsap.set(osMarker, { autoAlpha: 0, y: 6 })
    gsap.set(bottomLine, { scaleX: 0, transformOrigin: 'left top' })
    gsap.set(dot, { autoAlpha: 0, scale: 0.8 })

    heroTimeline = gsap.timeline({ paused: true, defaults: { ease: heroEase } })

    heroTimeline
      .to(gridLines, {
        autoAlpha: 1,
        duration: 0.9,
        stagger: { each: 0.035, from: 'start' }
      })
      .to(meta, { autoAlpha: 1, y: 0, duration: 0.75 }, 0.12)
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
      .to(osMarker, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.9)
      .to(sideMeta, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.95)
      .to(bottomLine, { scaleX: 1, duration: 0.9 }, 1.05)
      .to(dot, { autoAlpha: 1, scale: 1, duration: 0.45 }, 1.25)

    heroReady = true
    playHeroIntro()
  }, root)
})

onBeforeUnmount(() => {
  heroContext?.revert()
})
</script>
