<template>
  <main ref="pageRoot" class="grain min-h-screen bg-background">
    <section class="page-gutter pt-20 md:pt-24">
      <div class="page-frame">
        <div class="reveal blog-reveal flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-4">
          <span class="min-w-0 break-words font-mono text-xs tracking-[0.16em] text-blue">{{ t('blog.fieldNotes.journalLabel') }}</span>
          <span class="inline-flex min-w-0 items-center gap-3 break-words text-right font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-muted-foreground">
            <span class="h-2 w-2 shrink-0 rounded-full bg-blue" aria-hidden="true"></span>
            {{ t('blog.fieldNotes.archiveOpen', { count: entryCount }) }}
          </span>
        </div>

        <div class="reveal blog-reveal" style="transition-delay: 80ms">
          <h1
            class="mt-10 max-w-4xl break-words text-balance font-sans text-5xl font-medium leading-[0.98] tracking-tight text-foreground md:text-7xl"
          >
            {{ t('blog.fieldNotes.titleLead') }}<span class="italic text-blue">{{ t('blog.fieldNotes.titleAccent') }}</span>
          </h1>
          <div class="mt-6 max-w-2xl space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p class="font-mono text-xs uppercase tracking-[0.12em] text-blue">{{ t('blog.fieldNotes.subtitleLead') }}</p>
            <p class="text-pretty">{{ t('blog.fieldNotes.subtitleBody') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="page-gutter pb-20 pt-12 max-lg:pb-10 md:pb-28 md:pt-16">
      <div class="page-frame">
        <div v-if="isLoading || loadError" class="reveal blog-reveal border-y border-line py-10">
          <p class="font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze">
            {{ loadError || t('blog.fieldNotes.archiveOpen', { count: 0 }) }}
          </p>
        </div>

        <div v-else-if="lead" class="reveal blog-reveal">
          <RouterLink
            :to="`/blog/${lead.slug}`"
            class="group relative grid min-w-0 overflow-hidden border-y border-line py-12 transition-colors duration-300 hover:border-line-strong max-lg:py-10 lg:grid-cols-[minmax(9rem,12rem)_1px_minmax(0,1fr)] lg:gap-x-10 lg:py-16 xl:gap-x-12"
          >
            <div class="relative z-10 flex min-w-0 flex-col pb-10 max-lg:pb-5 lg:pb-0 lg:pr-8">
              <span class="inline-flex items-center gap-3 font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-blue">
                <span class="h-2 w-2 shrink-0 rounded-full bg-blue" aria-hidden="true"></span>
                {{ lead.no.replace('№ ', 'NO. ') }}
              </span>

              <div class="mt-10 grid min-w-0 grid-cols-1 gap-8 max-lg:mt-5 max-lg:grid-cols-3 max-lg:gap-x-3 max-lg:gap-y-0 lg:mt-14 lg:grid-cols-1">
                <div class="min-w-0">
                  <span class="block font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze">
                    分类
                  </span>
                  <span class="mt-2 block break-words font-mono text-sm leading-relaxed tracking-[0.12em] text-foreground max-lg:mt-1">
                    {{ lead.cat }}
                  </span>
                  <span
                    v-if="lead.topic"
                    class="mt-1 block break-words font-mono text-xs uppercase leading-[1.2] tracking-[0.14em] text-muted-foreground"
                  >
                    {{ lead.topic }}
                  </span>
                </div>

                <div class="min-w-0">
                  <span class="block font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze">
                    日期
                  </span>
                  <span class="mt-2 block break-words font-mono text-sm leading-relaxed tracking-[0.12em] text-foreground max-lg:mt-1 max-lg:whitespace-nowrap">
                    {{ lead.date }}
                  </span>
                </div>

                <div class="min-w-0">
                  <span class="block font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze">
                    阅读时间
                  </span>
                  <span class="mt-2 block break-words font-mono text-sm uppercase leading-relaxed tracking-[0.12em] text-foreground max-lg:mt-1 max-lg:whitespace-nowrap">
                    {{ lead.read }}
                  </span>
                </div>
              </div>
            </div>

            <span class="hidden bg-line lg:block" aria-hidden="true"></span>

            <div class="relative z-10 min-w-0 pt-10 max-lg:pt-5 lg:pt-0">
              <div class="font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.24em] text-haze">
                Latest / 最新记录
              </div>
              <h2
                class="mt-10 max-w-5xl break-words text-balance font-sans text-3xl font-medium leading-[1.08] tracking-tight text-foreground transition-all duration-500 ease-out group-hover:text-blue max-lg:mt-5 sm:group-hover:translate-x-1 md:text-4xl lg:text-5xl"
              >
                {{ lead.title }}
              </h2>
              <p class="mt-7 max-w-2xl text-pretty text-sm leading-7 text-muted-foreground md:text-base">
                {{ lead.excerpt }}
              </p>
              <span
                class="mt-10 inline-flex items-center gap-4 border-b border-blue pb-2 font-mono text-xs tracking-[0.14em] text-blue transition-colors"
              >
                {{ t('blog.fieldNotes.readEntry') }}
                <span class="transition-transform duration-500 ease-out group-hover:translate-x-1">↗</span>
              </span>
            </div>

            <div class="pointer-events-none absolute right-10 top-1/2 hidden -translate-y-1/2 select-none font-mono text-7xl font-medium leading-none tracking-tight text-foreground opacity-[0.035] md:block lg:text-8xl">
              {{ lead.no.replace('№ ', '') }}
            </div>
            <span class="pointer-events-none absolute right-10 top-1/2 hidden h-0.5 w-20 -translate-y-20 bg-blue md:block" aria-hidden="true"></span>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="page-gutter pb-14 md:pb-16">
      <div class="page-frame">
        <div class="reveal blog-reveal mb-4 flex flex-col gap-4 max-lg:mb-3 max-lg:gap-3 md:flex-row md:items-center md:justify-between">
          <span class="min-w-0 break-words font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-muted-foreground">
            {{ t('blog.fieldNotes.archiveAll') }}
          </span>
          <div class="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3" :aria-label="t('blog.fieldNotes.filterAria')">
            <span class="inline-flex min-w-0 items-center gap-2 break-words font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze">
              <ListFilter class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {{ t('blog.fieldNotes.filterLabel') }}
            </span>
            <span class="font-mono text-xs text-haze" aria-hidden="true">/</span>

            <label class="relative inline-flex min-w-0 items-center">
              <span class="sr-only">{{ t('blog.fieldNotes.filterCategory') }}</span>
              <select
                v-model="activeCategoryFilter"
                class="w-auto min-w-0 appearance-none bg-transparent py-0 pl-0 pr-6 font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze transition-colors duration-300 hover:text-muted-foreground focus:text-muted-foreground focus:outline-none"
              >
                <option value="all">{{ t('blog.fieldNotes.filterCategory') }}</option>
                <option v-for="category in categoryOptions" :key="category.id" :value="category.id">
                  {{ category.label }}
                </option>
              </select>
              <ChevronDown class="pointer-events-none absolute right-0 h-4 w-4 text-haze" aria-hidden="true" />
            </label>
            <span class="font-mono text-xs text-haze" aria-hidden="true">/</span>

            <label class="relative inline-flex min-w-0 items-center">
              <span class="sr-only">{{ t('blog.fieldNotes.filterTopic') }}</span>
              <select
                v-model="activeTopicFilter"
                class="w-auto min-w-0 appearance-none bg-transparent py-0 pl-0 pr-6 font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze transition-colors duration-300 hover:text-muted-foreground focus:text-muted-foreground focus:outline-none"
              >
                <option value="all">{{ t('blog.fieldNotes.filterTopic') }}</option>
                <option v-for="topic in topicOptions" :key="topic.id" :value="topic.id">
                  {{ topic.label }}
                </option>
              </select>
              <ChevronDown class="pointer-events-none absolute right-0 h-4 w-4 text-haze" aria-hidden="true" />
            </label>
            <span class="font-mono text-xs text-haze" aria-hidden="true">/</span>

            <label class="relative inline-flex min-w-0 items-center">
              <span class="sr-only">{{ t('blog.fieldNotes.filterYear') }}</span>
              <select
                v-model="activeYearFilter"
                class="w-auto min-w-0 appearance-none bg-transparent py-0 pl-0 pr-6 font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze transition-colors duration-300 hover:text-muted-foreground focus:text-muted-foreground focus:outline-none"
              >
                <option value="all">{{ t('blog.fieldNotes.filterYear') }}</option>
                <option v-for="year in yearOptions" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
              <ChevronDown class="pointer-events-none absolute right-0 h-4 w-4 text-haze" aria-hidden="true" />
            </label>
          </div>
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
              class="group grid min-w-0 grid-cols-[minmax(3.75rem,auto)_minmax(0,1fr)] gap-x-3 gap-y-3 py-6 transition-colors duration-300 hover:bg-card max-md:gap-y-4 max-md:py-5 md:grid-cols-12 md:items-center md:gap-2"
              :class="{ 'border-b border-line': index < entries.length - 1 }"
            >
              <span class="font-mono text-xs text-blue max-md:order-1 max-md:self-center md:col-span-2">
                {{ entry.no }}
              </span>
              <span
                class="min-w-0 break-words text-balance text-base font-medium tracking-tight text-foreground transition-all duration-300 group-hover:text-blue max-md:order-3 max-md:col-span-2 sm:group-hover:translate-x-1 md:col-span-6 md:text-lg"
              >
                {{ entry.title }}
              </span>
              <span class="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 max-md:order-4 max-md:col-span-1 max-md:gap-x-3 max-md:gap-y-0 md:col-span-2">
                <span class="min-w-0 break-words font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-muted-foreground">
                  {{ entry.cat }}
                </span>
                <span
                  v-if="entry.topic"
                  class="min-w-0 break-words font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze"
                >
                  {{ entry.topic }}
                </span>
              </span>
              <span
                class="min-w-0 text-left font-mono text-xs tracking-[0.12em] text-muted-foreground max-md:order-2 max-md:col-span-1 max-md:justify-self-end max-md:self-center max-md:whitespace-nowrap max-md:text-right md:col-span-1 md:text-right"
              >
                {{ entry.date }}
              </span>
              <span
                class="text-right font-mono text-sm text-muted-foreground transition-all duration-300 group-hover:text-blue max-md:order-5 max-md:col-span-1 max-md:justify-self-end max-md:self-center sm:group-hover:translate-x-1 md:col-span-1"
              >
                ↗
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>

    <Footer />
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { ChevronDown, ListFilter } from 'lucide-vue-next'
import Footer from '../components/Footer.vue'
import { blogCategories } from '../content/blog-categories.js'
import { blogTopics } from '../content/blog-topics.js'
import { listPosts } from '../lib/blog/index.js'

const pageRoot = ref(null)
const { t } = useI18n()
const posts = ref([])
const activeCategoryFilter = ref('all')
const activeTopicFilter = ref('all')
const activeYearFilter = ref('all')
const isLoading = ref(true)
const loadError = ref('')
let revealObserver

function categoryLabel(post) {
  return t(post.categoryLabelKey, post.categoryKey || post.category)
}

function topicLabel(post) {
  if (!post.topic) return ''
  return t(post.topicLabelKey, post.topicKey || post.topic)
}

const toEntry = (post) => ({
  slug: post.slug,
  no: `№ ${post.index}`,
  title: post.title,
  excerpt: post.description,
  cat: categoryLabel(post),
  topic: topicLabel(post),
  topicId: post.topic,
  category: post.category,
  date: post.date,
  read: post.readTime
})

function yearFromDate(date) {
  return String(date).match(/^\d{4}/)?.[0] ?? ''
}

const allPosts = computed(() => posts.value.map(toEntry))
const lead = computed(() => allPosts.value[0] ?? null)
const archiveEntries = computed(() => allPosts.value.slice(1))
const entries = computed(() => {
  return archiveEntries.value.filter((entry) => {
    const categoryMatches = activeCategoryFilter.value === 'all' || entry.category === activeCategoryFilter.value
    const topicMatches = activeTopicFilter.value === 'all' || entry.topicId === activeTopicFilter.value
    const yearMatches = activeYearFilter.value === 'all' || yearFromDate(entry.date) === activeYearFilter.value
    return categoryMatches && topicMatches && yearMatches
  })
})
const entryCount = computed(() => allPosts.value.length)
const categoryOptions = computed(() =>
  blogCategories.map((category) => ({
    id: category.slug,
    label: t(category.labelKey, category.key)
  }))
)
const topicOptions = computed(() =>
  blogTopics.map((topic) => ({
    id: topic.slug,
    label: t(topic.labelKey, topic.key)
  }))
)
const yearOptions = computed(() => {
  const years = archiveEntries.value.map((entry) => yearFromDate(entry.date)).filter(Boolean)
  return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a))
})

function setupRevealObserver() {
  revealObserver?.disconnect()
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
}

onMounted(async () => {
  try {
    posts.value = await listPosts()
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : String(error)
  } finally {
    isLoading.value = false
    await nextTick()
    setupRevealObserver()
  }
})

watch([activeCategoryFilter, activeYearFilter], async () => {
  await nextTick()
  setupRevealObserver()
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
})
</script>
