<template>
  <footer class="page-gutter border-t border-line py-12">
    <div class="page-frame">
      <div class="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="font-sans text-3xl font-medium tracking-tight text-foreground md:text-4xl">
            {{ footerBrandLead }}<span class="text-blue">{{ footerBrandAccent }}</span>
          </p>
          <p class="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {{ t('blog.fieldNotes.footerNote') }}
          </p>
        </div>

        <dl class="grid grid-cols-2 gap-x-8 gap-y-7 font-mono text-xs md:grid-cols-4 md:gap-x-12">
          <div v-for="item in footerMeta" :key="item.key" class="flex flex-col gap-2">
            <dt class="tracking-[0.14em] text-muted-foreground">{{ item.key }}</dt>
            <dd class="flex flex-col gap-1 leading-relaxed text-foreground">
              <component
                :is="line.to ? RouterLink : line.href ? 'a' : 'span'"
                v-for="line in item.valueLines"
                :key="line.label"
                :to="line.to"
                :href="line.href"
                :target="line.external ? '_blank' : undefined"
                :rel="line.external ? 'noopener noreferrer' : undefined"
                :class="line.to || line.href ? 'transition-colors duration-300 hover:text-blue' : undefined"
              >
                {{ line.label }}
              </component>
            </dd>
          </div>
        </dl>
      </div>

      <div class="mt-12 flex items-center justify-between border-t border-line pt-5">
        <span class="tech">© MMXXVI</span>
        <span class="tech">31.2°N — 121.5°E</span>
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
  const title = t('blog.fieldNotes.endOfIndex')
  const lastSpaceIndex = title.lastIndexOf(' ')
  return lastSpaceIndex === -1 ? title : `${title.slice(0, lastSpaceIndex)} `
})

const footerBrandAccent = computed(() => {
  const title = t('blog.fieldNotes.endOfIndex')
  const lastSpaceIndex = title.lastIndexOf(' ')
  return lastSpaceIndex === -1 ? '' : title.slice(lastSpaceIndex + 1)
})

const footerValueLines = (value, links = []) => value
  .split('/')
  .map((line, index) => ({ label: line.trim(), ...links[index] }))
  .filter((line) => line.label)

const footerMeta = computed(() => [
  { key: t('blog.fieldNotes.footer.system'), valueLines: footerValueLines(t('blog.fieldNotes.footer.systemValue')) },
  {
    key: t('blog.fieldNotes.footer.surface'),
    valueLines: footerValueLines(t('blog.fieldNotes.footer.surfaceValue'), [
      { to: '/tools' },
      { to: '/blog' },
      { to: '/about' },
    ]),
  },
  {
    key: t('blog.fieldNotes.footer.accent'),
    valueLines: footerValueLines(t('blog.fieldNotes.footer.accentValue'), [
      { href: 'mailto:chengyue.jin@outlook.com' },
      { href: 'https://github.com/JacoryCYJin', external: true },
    ]),
  },
  { key: t('blog.fieldNotes.footer.status'), valueLines: footerValueLines(t('blog.fieldNotes.footer.statusValue')) },
])
</script>
