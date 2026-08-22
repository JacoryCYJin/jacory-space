<template>
  <footer class="page-gutter bg-ink py-12 text-card">
    <div class="page-frame">
      <div class="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="font-display text-3xl font-normal leading-[0.84] tracking-[-0.03em] text-card md:text-4xl">
            {{ footerBrandLead }}<span class="text-card">{{ footerBrandAccent }}</span>
          </p>
        </div>

        <dl class="grid grid-cols-2 gap-x-8 gap-y-7 font-mono text-xs md:grid-cols-4 md:gap-x-12">
          <div v-for="item in footerMeta" :key="item.key" class="flex flex-col gap-2">
            <dt class="tracking-[0.14em] text-card/65">{{ item.key }}</dt>
            <dd class="flex flex-col gap-1 leading-relaxed text-card">
              <component
                :is="line.to ? RouterLink : line.href ? 'a' : 'span'"
                v-for="line in item.valueLines"
                :key="line.label"
                :to="line.to"
                :href="line.href"
                :target="line.external ? '_blank' : undefined"
                :rel="line.external ? 'noopener noreferrer' : undefined"
                :class="line.to || line.href ? 'transition-colors duration-300 hover:text-card/70' : undefined"
              >
                {{ line.label }}
              </component>
            </dd>
          </div>
        </dl>
      </div>

      <div class="mt-12 flex items-center justify-between border-t border-card/30 pt-5">
        <span class="tech text-card">© MMXXVI</span>
        <span class="tech text-card">31.2°N — 121.5°E</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()

const footerBrandLead = computed(() => {
  const title = t('siteFooter.brand')
  const lastSpaceIndex = title.lastIndexOf(' ')
  return lastSpaceIndex === -1 ? title : `${title.slice(0, lastSpaceIndex)} `
})

const footerBrandAccent = computed(() => {
  const title = t('siteFooter.brand')
  const lastSpaceIndex = title.lastIndexOf(' ')
  return lastSpaceIndex === -1 ? '' : title.slice(lastSpaceIndex + 1)
})

const footerValueLines = (value, links = []) => value
  .split('/')
  .map((line, index) => ({ label: line.trim(), ...links[index] }))
  .filter((line) => line.label)

const footerMeta = computed(() => [
  { key: t('siteFooter.meta.system'), valueLines: footerValueLines(t('siteFooter.meta.systemValue')) },
  {
    key: t('siteFooter.meta.surface'),
    valueLines: [
      { label: t('nav.tools'), to: '/tools' },
      { label: t('nav.library'), to: '/library' },
      { label: t('nav.blog'), to: '/blog' },
      { label: t('nav.about'), to: '/about' },
    ],
  },
  {
    key: t('siteFooter.meta.accent'),
    valueLines: footerValueLines(t('siteFooter.meta.accentValue'), [
      { href: 'mailto:chengyue.jin@outlook.com' },
      { href: 'https://github.com/JacoryCYJin', external: true },
    ]),
  },
  { key: t('siteFooter.meta.status'), valueLines: footerValueLines(t('siteFooter.meta.statusValue')) },
])
</script>
