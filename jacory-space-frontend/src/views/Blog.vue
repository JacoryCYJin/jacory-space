<template>
  <main ref="pageRoot" class="grain min-h-screen bg-background">
    <section class="px-5 pt-28 md:px-8 md:pt-36">
      <div class="mx-auto max-w-screen-xl">
        <div class="reveal blog-reveal flex items-center justify-between border-b border-line pb-4">
          <span class="font-mono text-xs tracking-[0.16em] text-blue">{{ t('blog.fieldNotes.journalLabel') }}</span>
          <span class="tech">{{ t('blog.fieldNotes.archiveOpen', { count: entryCount }) }}</span>
        </div>

        <div class="reveal blog-reveal" style="transition-delay: 80ms">
          <h1
            class="mt-10 max-w-4xl text-balance font-sans text-5xl font-medium leading-[0.98] tracking-tight text-foreground md:text-7xl"
          >
            {{ t('blog.fieldNotes.titleLead') }}<span class="italic text-blue">{{ t('blog.fieldNotes.titleAccent') }}</span>
          </h1>
          <p class="mt-6 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            {{ t('blog.fieldNotes.subtitle') }}
          </p>
        </div>
      </div>
    </section>

    <section class="px-5 py-20 md:px-8 md:py-28">
      <div class="mx-auto max-w-screen-xl">
        <div v-if="lead" class="reveal blog-reveal">
          <RouterLink
            :to="`/blog/${lead.slug}`"
            class="group grid gap-8 border-y border-line py-10 lg:grid-cols-12 lg:gap-10"
          >
            <div class="flex items-start justify-between lg:col-span-4 lg:flex-col lg:gap-6">
              <span class="font-mono text-xs text-blue">{{ lead.no }}</span>
              <div class="text-right lg:text-left">
                <span class="tech block">{{ lead.cat }}</span>
                <span class="tech block">{{ lead.date }} / {{ lead.read }}</span>
              </div>
            </div>

            <div class="lg:col-span-8">
              <h2
                class="text-balance font-sans text-3xl font-medium leading-tight tracking-tight text-foreground transition-transform duration-500 ease-out group-hover:translate-x-1 md:text-4xl"
              >
                {{ lead.title }}
              </h2>
              <p class="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
                {{ lead.excerpt }}
              </p>
              <span
                class="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-foreground transition-colors group-hover:text-blue"
              >
                {{ t('blog.fieldNotes.readEntry') }}
                <span class="transition-transform duration-500 ease-out group-hover:translate-x-1">↗</span>
              </span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="px-5 pb-28 md:px-8">
      <div class="mx-auto max-w-screen-xl">
        <div class="reveal blog-reveal mb-4 flex items-center justify-between">
          <span class="tech">{{ t('blog.fieldNotes.archiveAll') }}</span>
          <span class="tech">{{ t('blog.fieldNotes.scrollHint') }}</span>
        </div>

        <ul class="border-t border-line">
          <li
            v-for="(entry, index) in entries"
            :key="entry.slug"
            class="reveal blog-reveal"
            :style="{ transitionDelay: `${index * 60}ms` }"
          >
            <RouterLink
              :to="`/blog/${entry.slug}`"
              class="group grid grid-cols-12 items-center gap-2 border-b border-line py-6 transition-colors duration-300 hover:bg-card"
            >
              <span class="col-span-3 font-mono text-xs text-blue md:col-span-2">
                {{ entry.no }}
              </span>
              <span
                class="col-span-9 text-balance text-base font-medium tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-1 md:col-span-6 md:text-lg"
              >
                {{ entry.title }}
              </span>
              <span class="tech col-span-6 mt-1 md:col-span-2 md:mt-0">
                {{ entry.cat }}
              </span>
              <span
                class="col-span-5 mt-1 text-right font-mono text-[11px] tracking-[0.12em] text-muted-foreground md:col-span-1 md:mt-0"
              >
                {{ entry.date }}
              </span>
              <span
                class="col-span-1 text-right font-mono text-sm text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue"
              >
                ↗
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>

    <footer class="border-t border-line px-5 py-12 md:px-8">
      <div class="mx-auto max-w-screen-xl">
        <div class="reveal blog-reveal flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
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
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { listPosts } from '../lib/blog'

const pageRoot = ref(null)
const { t } = useI18n()
let revealObserver

function categoryLabel(category) {
  const key = category || 'NOTE'
  return t(`blog.entryCategories.${key}`, key)
}

const toEntry = (post) => ({
  slug: post.slug,
  no: `№ ${post.index}`,
  title: post.title,
  excerpt: post.description,
  cat: categoryLabel(post.category),
  date: post.date,
  read: post.readTime
})

const allPosts = computed(() => listPosts().map(toEntry))
const lead = computed(() => allPosts.value[0] ?? null)
const entries = computed(() => allPosts.value.slice(1))
const entryCount = computed(() => allPosts.value.length)
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
  { key: t('blog.fieldNotes.footer.status'), valueLines: footerValueLines(t('blog.fieldNotes.footer.statusValue')) }
])

onMounted(() => {
  const revealItems = pageRoot.value?.querySelectorAll('.blog-reveal') ?? []

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-in'))
    return
  }

  revealObserver = new IntersectionObserver(
    (items) => {
      items.forEach((item) => {
        if (item.isIntersecting) {
          item.target.classList.add('is-in')
          revealObserver.unobserve(item.target)
        }
      })
    },
    { threshold: 0.14 }
  )

  revealItems.forEach((item) => revealObserver.observe(item))
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
})
</script>
