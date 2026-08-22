<template>
  <footer class="footer-shell page-gutter bg-ink text-card">
    <div class="page-frame flex min-h-[38rem] flex-col py-8 md:py-10 lg:min-h-[36rem] lg:py-12">
      <div class="footer-stage grid flex-1 gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)] lg:gap-16">
        <section class="footer-brand-zone flex min-h-[18rem] flex-col justify-center lg:min-h-0">
          <h2 class="footer-wordmark whitespace-nowrap font-display font-normal leading-[0.84] tracking-[-0.03em] text-footer-brand" :aria-label="t('siteFooter.brand')">
            {{ t('siteFooter.brand') }}
          </h2>
        </section>

        <aside class="footer-console flex flex-col pl-6 sm:pl-8 lg:pl-10">
          <div class="flex flex-1 flex-col">
            <p class="ml-auto font-mono text-sm leading-relaxed text-card">
              {{ t('siteFooter.meta.statusValue') }}
            </p>

            <dl class="mt-auto space-y-8 pt-8 lg:pt-10">
              <div class="grid gap-4 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-6">
                <dt class="tech text-card opacity-60">{{ t('siteFooter.meta.surface') }}</dt>
                <dd class="grid grid-cols-2 gap-x-4 gap-y-4">
                <RouterLink
                  v-for="(line, index) in navigationLines"
                  :key="line.label"
                  :to="line.to"
                  class="footer-nav-link font-sans text-card text-lg tracking-[-0.04em] transition-colors duration-300"
                >
                  <span class="tech mr-2 text-blue">0{{ index + 1 }}</span>{{ line.label }}
                </RouterLink>
                </dd>
              </div>

              <div class="grid gap-4 pt-8 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-6">
                <dt class="tech text-card opacity-60">{{ t('siteFooter.meta.accent') }}</dt>
                <dd class="flex flex-wrap gap-x-5 gap-y-3 font-mono text-sm text-card">
                  <a
                    v-for="line in contactLines"
                    :key="line.label"
                    :href="line.href"
                    :target="line.external ? '_blank' : undefined"
                    :rel="line.external ? 'noopener noreferrer' : undefined"
                    class="footer-contact-link transition-colors duration-300"
                  >
                    {{ line.label }} ↗
                  </a>
                </dd>
              </div>
            </dl>
          </div>
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

.footer-brand-zone {
  border-color: color-mix(in srgb, var(--card) 24%, transparent);
}

.footer-wordmark {
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
