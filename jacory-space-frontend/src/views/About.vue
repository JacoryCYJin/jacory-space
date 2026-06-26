<template>
  <main ref="pageRoot" class="grain min-h-screen bg-background pt-16">
    <section class="px-5 pb-8 pt-5 md:px-8 md:pb-10 md:pt-7">
      <div class="mx-auto max-w-[1440px]">
        <header class="about-reveal reveal flex items-end justify-between">
          <div>
            <p class="font-mono text-xs tracking-[0.16em] text-blue">03 — IDENTITY.SHEET</p>
            <p class="tech mt-2">{{ t('about.sheet.subtitle') }}</p>
          </div>
        </header>

        <div class="relative mt-8 lg:mt-10">
          <div class="relative grid grid-cols-12 gap-y-12 lg:min-h-[38rem] lg:overflow-visible">
            <figure
              class="about-identity-illustration about-reveal reveal relative col-span-12 flex min-h-[22rem] items-center justify-center overflow-hidden border-b border-line pb-8 lg:pointer-events-none lg:absolute lg:left-[-10rem] lg:z-0 lg:-translate-y-1/2 lg:overflow-visible lg:border-b-0 lg:pb-0"
            >
              <img
                :src="identityIllustration"
                alt=""
                class="relative z-0 h-auto max-h-[40rem] w-[125%] max-w-none object-contain opacity-80 mix-blend-multiply lg:max-h-[44rem] lg:w-full lg:translate-x-0"
              />
              <figcaption class="sr-only">{{ t('about.sheet.identityIllustrationAlt') }}</figcaption>
            </figure>

            <section
              class="about-reveal reveal relative z-10 col-span-12 flex flex-col justify-center lg:col-span-5 lg:col-start-4 lg:px-[clamp(2rem,4vw,4.75rem)]"
              style="transition-delay: 80ms"
            >
              <h1
                class="text-balance font-sans font-medium text-foreground"
                :class="sloganTitleClass"
              >
                <span class="block">{{ t('about.slogan.line1') }}</span>
                <span class="block">{{ t('about.slogan.line2Prefix') }}<em :class="sloganEmphasisClass">{{ t('about.slogan.line2Emphasis') }}</em>{{ t('about.slogan.line2Suffix') }}</span>
              </h1>

              <p
                class="max-w-[31rem] whitespace-pre-line text-pretty text-sm leading-[1.75] text-muted-foreground md:text-[0.9375rem]"
                :class="statementClass"
              >
                {{ t('about.statement') }}
              </p>
            </section>

            <aside
              class="about-side-panel about-reveal reveal relative z-10 col-span-12 overflow-hidden border-t border-line pt-8 lg:-top-5 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
              style="transition-delay: 160ms"
            >
              <section aria-labelledby="identity-heading" class="relative">
                <div class="flex items-center justify-between">
                  <h2 id="identity-heading" class="font-mono text-xs tracking-[0.14em] text-blue">
                    // IDENTITY
                  </h2>
                  <span aria-hidden="true" class="font-mono text-lg font-light text-muted-foreground">＋</span>
                </div>

                <dl class="mt-5">
                  <div
                    v-for="item in identityRows"
                    :key="item.label"
                    class="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-line py-3.5 last:border-b-0"
                  >
                    <dt class="tech text-[0.625rem]">{{ item.label }}</dt>
                    <dd class="font-mono text-xs leading-relaxed text-foreground">{{ item.value }}</dd>
                  </div>
                </dl>
              </section>

              <figure class="relative mt-9">
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

    <section class="about-reveal reveal px-5 md:px-8">
      <div class="mx-auto grid max-w-[1440px] py-5 lg:grid-cols-[17rem_1fr] lg:py-0">
        <div class="flex items-center py-5 lg:pr-8">
          <h2 class="font-mono text-xs tracking-[0.14em] text-blue">// PERSONAL AXIOMS</h2>
        </div>

        <ol class="relative grid grid-cols-2 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-line before:content-[''] md:grid-cols-5">
          <li
            v-for="(principle, index) in principles"
            :key="principle.label"
            class="relative px-4 py-5 before:absolute before:left-0 before:top-1/2 before:hidden before:h-16 before:-translate-y-1/2 before:border-l before:border-line before:content-[''] md:px-6 md:before:block md:first:before:hidden"
          >
            <span class="font-mono text-[0.625rem] tracking-[0.14em] text-blue">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <p class="mt-3 text-sm font-medium tracking-tight text-foreground">{{ principle.label }}</p>
          </li>
        </ol>
      </div>
    </section>

    <footer class="about-reveal reveal px-5 py-7 md:px-8">
      <div class="mx-auto flex max-w-[1440px] flex-col gap-6 md:flex-row md:items-center">
        <p class="font-mono text-xs tracking-[0.14em] text-blue">/ CONTACT</p>

        <nav :aria-label="t('about.contact.ariaLabel')" class="flex flex-wrap items-center gap-x-8 gap-y-3">
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

        <div class="hidden h-px flex-1 bg-line md:block">
          <span class="ml-auto block h-1.5 w-1.5 -translate-y-[0.1875rem] rounded-full bg-blue" />
        </div>
        <p class="tech md:text-right">{{ t('about.contact.thanks') }}</p>
      </div>
    </footer>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import avatarIllustration from '../assets/about/Personal Operating System Avatar Illustration.png'
import identityIllustration from '../assets/about/Personal Operating System Identity Illustration.png'

const pageRoot = ref(null)
const { t, locale } = useI18n()
let revealObserver

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
  { label: t('about.identity.statusLabel'), value: t('about.identity.status') },
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
  const revealItems = pageRoot.value?.querySelectorAll('.about-reveal') ?? []

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-in'))
    return
  }

  revealObserver = new IntersectionObserver(
    (items) => {
      items.forEach((item) => {
        if (!item.isIntersecting) return
        item.target.classList.add('is-in')
        revealObserver.unobserve(item.target)
      })
    },
    { threshold: 0.12 },
  )

  revealItems.forEach((item) => revealObserver.observe(item))
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
})
</script>
