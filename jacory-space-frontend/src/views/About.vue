<template>
  <main ref="pageRoot" class="grain min-h-screen bg-background pt-16">
    <section class="page-gutter pb-8 md:pb-10">
      <div class="page-frame">
        <header class="about-sheet-header flex items-end justify-between">
          <div>
            <p class="font-mono text-xs tracking-[0.16em] text-blue">03 — IDENTITY.SHEET</p>
            <p class="tech mt-2">{{ t('about.sheet.subtitle') }}</p>
          </div>
        </header>

        <div class="relative mt-8 lg:mt-10">
          <div class="relative grid grid-cols-12 gap-y-12 lg:grid-cols-[repeat(13,minmax(0,1fr))] lg:min-h-[38rem] lg:overflow-visible">
            <figure
              class="about-identity-illustration relative col-span-12 flex min-h-[22rem] items-center justify-center overflow-hidden border-b border-line pb-8 lg:pointer-events-none lg:absolute lg:left-[clamp(-9rem,-7vw,-5rem)] lg:z-0 lg:overflow-visible lg:border-b-0 lg:pb-0 xl:left-[clamp(-7rem,-5vw,-3rem)] 2xl:left-[clamp(-3rem,-1.5vw,1rem)]"
            >
              <div class="about-identity-media flex w-full items-center justify-center">
                <img
                  :src="identityIllustration"
                  alt=""
                  class="about-identity-image relative z-0 h-auto max-h-[40rem] w-[125%] max-w-none object-contain opacity-80 mix-blend-multiply lg:max-h-[44rem] lg:w-full lg:translate-x-0"
                />
              </div>
              <figcaption class="sr-only">{{ t('about.sheet.identityIllustrationAlt') }}</figcaption>
            </figure>

            <section
              class="about-intro relative z-10 col-span-12 flex flex-col justify-center lg:col-span-5 lg:col-start-5 lg:pl-[clamp(2rem,4vw,4.75rem)]"
            >
              <h1
                class="text-balance font-sans font-medium text-foreground"
                :class="sloganTitleClass"
              >
                <span class="block overflow-hidden">
                  <span class="about-slogan-line block">{{ t('about.slogan.line1') }}</span>
                </span>
                <span class="block overflow-hidden">
                  <span class="about-slogan-line block">{{ t('about.slogan.line2Prefix') }}<em :class="sloganEmphasisClass">{{ t('about.slogan.line2Emphasis') }}</em>{{ t('about.slogan.line2Suffix') }}</span>
                </span>
              </h1>

              <p
                class="about-statement max-w-[31rem] whitespace-pre-line text-pretty text-sm leading-[1.75] text-muted-foreground md:text-[0.9375rem]"
                :class="statementClass"
              >
                {{ t('about.statement') }}
              </p>
            </section>

            <aside
              class="about-side-panel relative z-10 col-span-12 overflow-hidden border-t border-line pt-8 lg:-top-5 lg:col-span-4 lg:border-t-0 lg:pl-6 lg:pt-0 xl:pl-8"
            >
              <span aria-hidden="true" class="about-panel-line absolute bottom-0 left-0 top-0 hidden w-px origin-top bg-line lg:block" />
              <section aria-labelledby="identity-heading" class="relative">
                <div class="about-identity-heading flex items-center justify-between">
                  <h2 id="identity-heading" class="font-mono text-xs tracking-[0.14em] text-blue">
                    // IDENTITY
                  </h2>
                  <span aria-hidden="true" class="font-mono text-lg font-light text-muted-foreground">＋</span>
                </div>

                <dl class="mt-5">
                  <div
                    v-for="item in identityRows"
                    :key="item.label"
                    class="about-identity-row grid grid-cols-[5.5rem_1fr] gap-4 border-b border-line py-3.5 last:border-b-0"
                  >
                    <dt class="tech text-[0.625rem]">{{ item.label }}</dt>
                    <dd class="inline-flex items-center gap-2 font-mono text-xs leading-relaxed text-foreground">
                      <span>{{ item.value }}</span>
                      <span
                        v-if="item.hasProgressDot"
                        aria-hidden="true"
                        class="h-1.5 w-1.5 shrink-0 rounded-full bg-blue"
                      />
                    </dd>
                  </div>
                </dl>
              </section>

              <figure class="about-avatar-draft relative mt-9">
                <figcaption class="font-mono text-xs tracking-[0.14em] text-blue">
                  // AVATAR.DRAFT
                </figcaption>
                <div class="mt-4 flex min-h-[13.5rem] items-center justify-center pt-4">
                  <img
                    :src="avatarIllustration"
                    alt=""
                    class="h-auto max-h-[20rem] w-[108%] max-w-none object-contain opacity-90 mix-blend-multiply"
                  />
                </div>
              </figure>
            </aside>
          </div>
        </div>
      </div>
    </section>

    <section class="about-axioms page-gutter">
      <div class="page-frame grid py-5 lg:grid-cols-[17rem_1fr] lg:py-0">
        <div class="about-axioms-label flex items-center py-5 lg:pr-8">
          <h2 class="font-mono text-xs tracking-[0.14em] text-blue">// PERSONAL AXIOMS</h2>
        </div>

        <div class="relative">
          <span aria-hidden="true" class="about-axioms-line absolute inset-x-0 top-0 h-px origin-left bg-line" />
          <ol class="grid grid-cols-2 md:grid-cols-5">
            <li
              v-for="(principle, index) in principles"
              :key="principle.label"
              class="about-axiom relative px-4 py-5 before:absolute before:left-0 before:top-1/2 before:hidden before:h-16 before:-translate-y-1/2 before:border-l before:border-line before:content-[''] md:px-6 md:before:block md:first:before:hidden"
            >
              <span class="font-mono text-[0.625rem] tracking-[0.14em] text-blue">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <p class="mt-3 text-sm font-medium tracking-tight text-foreground">{{ principle.label }}</p>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <footer class="about-contact page-gutter py-7">
      <div class="page-frame flex flex-col gap-6 md:flex-row md:items-center">
        <p class="about-contact-item font-mono text-xs tracking-[0.14em] text-blue">/ CONTACT</p>

        <nav :aria-label="t('about.contact.ariaLabel')" class="about-contact-item flex flex-wrap items-center gap-x-8 gap-y-3">
          <component
            :is="link.href ? 'a' : 'span'"
            v-for="link in contactLinks"
            :key="link.label"
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            class="group flex items-baseline gap-3 font-mono text-xs"
          >
            <span class="text-foreground transition-colors duration-300 group-hover:text-blue">
              {{ link.label }}
            </span>
            <span class="text-muted-foreground">{{ link.value }}</span>
          </component>
        </nav>

        <div class="about-contact-item hidden h-px flex-1 bg-line md:block">
          <span class="ml-auto block h-1.5 w-1.5 -translate-y-[0.1875rem] rounded-full bg-blue" />
        </div>
        <p class="about-contact-item tech md:text-right">{{ t('about.contact.thanks') }}</p>
      </div>
    </footer>

  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import avatarIllustration from '../assets/about/Personal Operating System Avatar Illustration.png'
import identityIllustration from '../assets/about/Personal Operating System Identity Illustration.png'

gsap.registerPlugin(ScrollTrigger)

const pageRoot = ref(null)
const { t, locale } = useI18n()
let motionMedia

const isChineseLocale = computed(() => locale.value.startsWith('zh'))
const isJapaneseLocale = computed(() => locale.value.startsWith('ja'))
const isCjkLocale = computed(() => isChineseLocale.value || isJapaneseLocale.value)

const sloganTitleClass = computed(() => (
  isChineseLocale.value
    ? 'w-full text-[clamp(3.35rem,6.25vw,5.8rem)] leading-[1.16] tracking-[-0.012em] md:leading-[1.12] lg:w-[calc(100%+1.75rem)]'
    : isJapaneseLocale.value
      ? 'text-[clamp(2.45rem,4.4vw,4rem)] leading-[0.98] tracking-[-0.012em]'
      : 'text-[clamp(2.45rem,4.4vw,4rem)] leading-[0.98] tracking-[-0.055em]'
))

const sloganEmphasisClass = computed(() => (
  isCjkLocale.value ? 'font-medium text-blue not-italic' : 'font-medium text-blue italic'
))

const statementClass = computed(() => (
  isChineseLocale.value ? 'mt-11 md:mt-12' : 'mt-8'
))

const identityRows = computed(() => [
  { label: t('about.identity.roleLabel'), value: t('about.identity.role') },
  { label: t('about.identity.baseLabel'), value: t('about.identity.base') },
  { label: t('about.identity.focusLabel'), value: t('about.identity.focus') },
  { label: t('about.identity.statusLabel'), value: t('about.identity.status'), hasProgressDot: true },
])

const principles = computed(() => [
  { label: t('about.principles.courage') },
  { label: t('about.principles.order') },
  { label: t('about.principles.curiosity') },
  { label: t('about.principles.expression') },
  { label: t('about.principles.refinement') },
])

const contactLinks = computed(() => [
  {
    label: 'Email',
    value: 'chengyue.jin@outlook.com',
    href: 'mailto:chengyue.jin@outlook.com',
  },
  {
    label: 'GitHub',
    value: '@JacoryCYJin',
    href: 'https://github.com/JacoryCYJin',
    external: true,
  },
])

onMounted(() => {
  if (!pageRoot.value) return

  motionMedia = gsap.matchMedia()
  motionMedia.add(
    {
      isDesktop: '(min-width: 1024px)',
      isMobile: '(max-width: 1023px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { reduceMotion } = context.conditions
      const select = gsap.utils.selector(pageRoot.value)
      const heroTargets = select([
        '.about-sheet-header',
        '.about-identity-media',
        '.about-slogan-line',
        '.about-statement',
        '.about-panel-line',
        '.about-identity-heading',
        '.about-identity-row',
        '.about-avatar-draft',
      ].join(', '))
      const scrollTargets = select([
        '.about-axioms-label',
        '.about-axioms-line',
        '.about-axiom',
        '.about-contact-item',
      ].join(', '))

      if (reduceMotion) {
        gsap.set([...heroTargets, ...scrollTargets], { clearProps: 'all' })
        return
      }

      gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } })
        .fromTo('.about-sheet-header', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.65 }, 0)
        .fromTo(
          '.about-identity-media',
          { autoAlpha: 0, y: 18, scale: 0.985 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: 'expo.out',
            clearProps: 'transform',
          },
          0.08,
        )
        .fromTo(
          '.about-slogan-line',
          { autoAlpha: 0, yPercent: 38 },
          { autoAlpha: 1, yPercent: 0, stagger: 0.09 },
          0.18,
        )
        .fromTo('.about-statement', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0 }, 0.4)
        .fromTo('.about-panel-line', { scaleY: 0 }, { scaleY: 1, duration: 0.9 }, 0.32)
        .fromTo(
          ['.about-identity-heading', '.about-identity-row', '.about-avatar-draft'],
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.055 },
          0.46,
        )

      const contactTargets = select('.about-contact-item')
      const contactSection = pageRoot.value.querySelector('.about-contact')
      let contactRevealed = false
      let contactFallbackFrame = 0
      let contactFallbackTimer = 0

      const isContactInViewport = () => {
        if (!contactSection) return false

        const rect = contactSection.getBoundingClientRect()
        return rect.top <= window.innerHeight && rect.bottom >= 0
      }

      const revealContactFallback = () => {
        if (contactRevealed || !contactTargets.length) return

        contactRevealed = true
        gsap.killTweensOf(contactTargets)
        gsap.to(contactTargets, {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: 'power3.out',
          stagger: 0.07,
          overwrite: true,
        })
      }

      const checkContactFallback = () => {
        window.cancelAnimationFrame(contactFallbackFrame)
        window.clearTimeout(contactFallbackTimer)
        contactFallbackFrame = window.requestAnimationFrame(() => {
          if (!isContactInViewport()) return

          const hasScrollablePage = document.documentElement.scrollHeight > window.innerHeight + 1
          if (hasScrollablePage && window.scrollY <= 0) return

          contactFallbackTimer = window.setTimeout(() => {
            if (isContactInViewport()) {
              revealContactFallback()
            }
          }, 420)
        })
      }

      gsap.timeline({
        defaults: { duration: 0.72, ease: 'power3.out' },
        scrollTrigger: {
          trigger: '.about-axioms',
          start: 'top 84%',
          once: true,
        },
      })
        .fromTo('.about-axioms-label', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0 }, 0)
        .fromTo('.about-axioms-line', { scaleX: 0 }, { scaleX: 1, duration: 0.85 }, 0.06)
        .fromTo(
          '.about-axiom',
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, stagger: 0.07 },
          0.18,
        )
        .fromTo(
          contactTargets,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.07,
            onStart: () => {
              contactRevealed = true
            },
          },
          0.36,
        )

      window.addEventListener('scroll', checkContactFallback, { passive: true })
      window.addEventListener('resize', checkContactFallback)

      const refreshAfterLayoutAsset = () => {
        window.requestAnimationFrame(() => {
          ScrollTrigger.refresh()
          checkContactFallback()
        })
      }

      const imageCleanups = Array.from(pageRoot.value.querySelectorAll('img'))
        .filter((image) => !image.complete)
        .flatMap((image) => {
          image.addEventListener('load', refreshAfterLayoutAsset, { once: true })
          image.addEventListener('error', refreshAfterLayoutAsset, { once: true })

          return [
            () => image.removeEventListener('load', refreshAfterLayoutAsset),
            () => image.removeEventListener('error', refreshAfterLayoutAsset),
          ]
        })

      refreshAfterLayoutAsset()

      return () => {
        window.cancelAnimationFrame(contactFallbackFrame)
        window.clearTimeout(contactFallbackTimer)
        window.removeEventListener('scroll', checkContactFallback)
        window.removeEventListener('resize', checkContactFallback)
        imageCleanups.forEach((cleanup) => cleanup())
      }
    },
    pageRoot.value,
  )
})

onBeforeUnmount(() => {
  motionMedia?.revert()
})
</script>
