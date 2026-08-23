<template>
  <footer class="footer-shell page-gutter bg-ink text-card">
    <div class="page-frame flex min-h-[38rem] flex-col py-8 md:py-10 lg:min-h-[28rem] lg:py-8">
      <div class="footer-stage grid flex-1 gap-10 lg:grid-cols-3 lg:gap-12 xl:gap-16">
        <section class="footer-brand-zone flex min-h-[18rem] items-center justify-center lg:min-h-0">
          <div class="flex w-fit max-w-full flex-col items-start text-left">
            <h2 class="footer-wordmark flex items-center gap-[0.18em] font-display font-normal leading-[0.84] tracking-[-0.03em]" :aria-label="t('siteFooter.brand')">
              <img :src="jacoryLogoWhite" alt="" class="h-[1.68em] w-auto shrink-0" />
              <span class="flex flex-col items-center">
                <span class="whitespace-nowrap">Jacory</span>
                <span class="whitespace-nowrap">Space</span>
              </span>
            </h2>
          </div>
        </section>

        <section class="footer-directory flex min-h-[14rem] items-center lg:min-h-0" :aria-label="t('siteFooter.meta.surface')">
          <div class="grid w-full grid-cols-2 gap-x-8 sm:gap-x-12">
            <div class="justify-self-center text-left">
              <h3 class="font-sans text-2xl font-medium tracking-[-0.04em] text-card">[ {{ t('siteFooter.meta.surface') }} ]</h3>
              <nav class="mt-5 flex flex-col gap-3" :aria-label="t('siteFooter.meta.surface')">
                <RouterLink
                  v-for="line in navigationLines"
                  :key="line.label"
                  :to="line.to"
                  class="footer-nav-link font-sans text-xl tracking-[-0.04em] transition-colors duration-300"
                >
                  {{ line.label }}
                </RouterLink>
              </nav>
            </div>

            <div class="justify-self-center text-left">
              <h3 class="font-sans text-2xl font-medium tracking-[-0.04em] text-card">[ {{ t('siteFooter.meta.accent') }} ]</h3>
              <div class="mt-5 flex flex-col gap-3 font-mono text-xl text-card">
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

        <aside class="footer-status flex min-h-[8rem] items-start justify-end lg:min-h-0">
          <p class="font-mono text-sm leading-relaxed text-card">
            {{ t('siteFooter.meta.statusValue') }}
          </p>
        </aside>
      </div>

      <div class="footer-rule mt-10 flex items-end justify-between gap-4 border-t pt-5 lg:mt-12">
        <span class="tech text-card opacity-60">© MMXXVI</span>
        <span class="tech text-card opacity-60">31.2°N — 121.5°E</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import jacoryLogoWhite from '../assets/jacory-logo-white.svg'

const { t } = useI18n()

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
  font-size: clamp(2.5rem, 4.25vw, 8.5rem);
  font-weight: 400;
  color: var(--card);
}

.footer-rule {
  border-color: color-mix(in srgb, var(--card) 24%, transparent);
}

.footer-nav-link:hover,
.footer-contact-link:hover {
  color: var(--blue-soft);
}

</style>
