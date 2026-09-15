<template>
  <footer class="footer-shell page-gutter bg-ink text-card">
    <div class="page-frame flex min-h-[38rem] flex-col py-8 max-md:min-h-0 max-md:py-6 md:py-10 lg:min-h-[28rem] lg:py-8">
      <div class="footer-stage grid flex-1 gap-10 max-md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] max-md:gap-x-4 max-md:gap-y-6 lg:grid-cols-3 lg:gap-12 xl:gap-16">
        <section class="footer-brand-zone flex min-h-[18rem] items-center justify-center max-md:min-h-0 max-md:justify-start max-md:items-start max-md:min-w-0 lg:min-h-0">
          <div ref="brandContainerRef" :style="brandFitStyle" class="flex w-fit max-w-full flex-col items-start text-left max-md:w-full">
            <h2 ref="wordmarkRef" class="footer-wordmark max-md:w-max max-md:shrink-0 text-2xl/[0.84] min-[360px]:text-4xl/[0.84] flex items-center gap-[0.18em] font-display font-normal leading-[0.84] tracking-[-0.03em]" :aria-label="t('siteFooter.brand')">
              <img :src="jacoryLogoWhite" alt="" class="h-[1.68em] w-auto shrink-0" />
              <span class="flex flex-col items-center">
                <span class="whitespace-nowrap">Jacory</span>
                <span class="whitespace-nowrap">Space</span>
              </span>
            </h2>
            <h3 class="mt-4 font-sans text-base font-medium leading-snug tracking-[-0.06em] text-card md:hidden">
              {{ t('siteFooter.meta.statusValue') }}
            </h3>
          </div>
        </section>

        <section class="footer-directory flex min-h-[14rem] items-center max-md:min-h-0 max-md:items-start lg:min-h-0" :aria-label="t('siteFooter.meta.surface')">
          <div class="grid w-full grid-cols-2 gap-x-8 max-md:gap-x-2 max-md:[overflow-wrap:anywhere] md:gap-x-12">
            <div class="justify-self-center text-left max-md:justify-self-start max-md:min-w-0">
              <h3 class="font-sans text-2xl max-md:text-sm font-medium tracking-[-0.04em] text-card">[ {{ t('siteFooter.meta.surface') }} ]</h3>
              <nav class="mt-5 flex flex-col gap-3 max-md:mt-3 max-md:gap-2" :aria-label="t('siteFooter.meta.surface')">
                <RouterLink
                  v-for="line in navigationLines"
                  :key="line.label"
                  :to="line.to"
                  class="footer-nav-link font-sans text-xl max-md:text-sm tracking-[-0.04em] transition-colors duration-300"
                >
                  {{ line.label }}
                </RouterLink>
              </nav>
            </div>

            <div class="justify-self-center text-left max-md:justify-self-start max-md:min-w-0">
              <h3 class="font-sans text-2xl max-md:text-sm font-medium tracking-[-0.04em] text-card">[ {{ t('siteFooter.meta.accent') }} ]</h3>
              <div class="mt-5 flex flex-col gap-3 max-md:mt-3 max-md:gap-2 font-mono text-xl max-md:text-sm text-card">
                <a
                  v-for="line in contactLines"
                  :key="line.label"
                  :href="line.href"
                  :target="line.external ? '_blank' : undefined"
                  :rel="line.external ? 'noopener noreferrer' : undefined"
                  class="footer-contact-link transition-colors duration-300"
                >
                  {{ line.label }}
                </a>
              </div>
            </div>
          </div>
        </section>

        <aside class="footer-status flex min-h-[8rem] flex-col items-start justify-center max-md:min-h-0 max-md:col-span-2 lg:min-h-0 lg:items-stretch lg:justify-start lg:pl-8 xl:pl-12">
          <div class="w-full lg:flex lg:h-full lg:flex-col">
            <h3 class="font-sans text-3xl max-md:hidden font-medium leading-none tracking-[-0.06em] text-card sm:text-4xl xl:text-5xl">
              {{ t('siteFooter.meta.statusValue') }}
            </h3>
            <div class="footer-status-divider mt-8 border-t pt-5 max-md:mt-0 max-md:pt-4 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:pt-0">
              <div class="lg:my-auto lg:translate-y-6">
                <p class="font-sans text-lg leading-relaxed text-card">
                  {{ t('siteFooter.meta.statusLineSecondary') }}
                </p>
                <p class="mt-9 max-w-[34rem] font-sans text-base leading-8 max-md:mt-4 max-md:leading-6 text-card/70">
                  {{ t('siteFooter.meta.statusReflection') }}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div class="footer-rule mt-10 max-md:mt-6 flex items-end justify-between gap-4 border-t pt-5 lg:mt-12">
        <span class="tech text-card opacity-60">© MMXXVI</span>
        <span class="tech text-card opacity-60">31.2°N — 121.5°E</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import jacoryLogoWhite from '../assets/jacory-logo-white.svg'

const { t } = useI18n()
const brandContainerRef = ref(null)
const wordmarkRef = ref(null)
const brandFitStyle = ref({})
let brandResizeObserver
let brandMeasureFrame
let mobileQuery
let brandMounted = false

function measureBrandFit() {
  if (!mobileQuery?.matches || !brandContainerRef.value || !wordmarkRef.value) return

  // Computed dimensions exclude transforms, so repeated measurements stay stable.
  const availableWidth = parseFloat(getComputedStyle(brandContainerRef.value).width)
  const wordmarkStyle = getComputedStyle(wordmarkRef.value)
  const naturalWidth = parseFloat(wordmarkStyle.width)
  const naturalHeight = parseFloat(wordmarkStyle.height)
  if (!(availableWidth > 0 && naturalWidth > 0 && naturalHeight > 0)) return

  const scale = availableWidth / naturalWidth
  brandFitStyle.value = {
    '--footer-brand-scale': scale,
    '--footer-brand-extra-height': `${naturalHeight * (scale - 1)}px`,
  }
}

function scheduleBrandMeasure() {
  if (!brandMounted) return
  cancelAnimationFrame(brandMeasureFrame)
  brandMeasureFrame = requestAnimationFrame(measureBrandFit)
}

onMounted(() => {
  brandMounted = true
  mobileQuery = window.matchMedia('(max-width: 767.98px)')
  brandResizeObserver = new ResizeObserver(scheduleBrandMeasure)
  brandResizeObserver.observe(brandContainerRef.value)
  brandResizeObserver.observe(wordmarkRef.value)
  mobileQuery.addEventListener('change', scheduleBrandMeasure)
  document.fonts?.ready.then(scheduleBrandMeasure)
  scheduleBrandMeasure()
})

onBeforeUnmount(() => {
  brandMounted = false
  cancelAnimationFrame(brandMeasureFrame)
  brandResizeObserver?.disconnect()
  mobileQuery?.removeEventListener('change', scheduleBrandMeasure)
})

const footerValueLines = (value, links = []) => value
  .split('/')
  .map((line, index) => ({ label: line.trim(), ...links[index] }))
  .filter((line) => line.label)

const navigationLines = computed(() => [
  { label: t('nav.tools'), to: '/tools' },
  { label: t('nav.library'), to: '/library' },
  { label: t('nav.blog'), to: '/blog' },
  { label: t('nav.about'), to: '/about' },
])

const contactLines = computed(() => footerValueLines(t('siteFooter.meta.accentValue'), [
  { href: 'mailto:chengyue.jin@outlook.com' },
  { href: 'https://github.com/JacoryCYJin', external: true },
]))
</script>

<style scoped>
.footer-shell {
  border-color: color-mix(in srgb, var(--card) 24%, transparent);
}

.footer-wordmark {
  font-weight: 400;
  color: var(--card);
}

@media (max-width: 767.98px) {
  .footer-wordmark {
    transform: scale(var(--footer-brand-scale, 1));
    transform-origin: top left;
    margin-bottom: var(--footer-brand-extra-height, 0px);
  }
}

@media (min-width: 768px) {
  .footer-wordmark {
    font-size: clamp(2.5rem, 4.25vw, 8.5rem);
  }
}

.footer-rule {
  border-color: color-mix(in srgb, var(--card) 24%, transparent);
}

.footer-status-divider {
  border-color: color-mix(in srgb, var(--card) 24%, transparent);
}

.footer-nav-link:hover,
.footer-contact-link:hover {
  color: var(--blue-soft);
}

</style>
