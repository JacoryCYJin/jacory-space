<template>
  <main ref="pageRoot" class="grain min-h-screen bg-background">
    <section class="page-gutter pt-20 md:pt-24">
      <div class="page-frame">
        <div class="reveal blog-reveal flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-4">
          <span class="min-w-0 break-words font-mono text-xs tracking-[0.16em] text-blue">{{ t('blog.fieldNotes.journalLabel') }}</span>
          <span class="min-w-0 break-words text-right font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-muted-foreground">
            {{ t('blog.fieldNotes.archiveOpen', { count: entryCount }) }}
          </span>
        </div>

        <div class="reveal blog-reveal" style="transition-delay: 80ms">
          <h1
            class="mt-10 max-w-4xl break-words text-balance font-sans text-5xl font-medium leading-[0.98] tracking-tight text-foreground md:text-7xl"
          >
            {{ t('blog.fieldNotes.titleLead') }}<span class="italic text-blue">{{ t('blog.fieldNotes.titleAccent') }}</span>
          </h1>
          <p class="mt-6 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            {{ t('blog.fieldNotes.subtitle') }}
          </p>
        </div>
      </div>
    </section>

    <section class="page-gutter pb-20 pt-12 md:pb-28 md:pt-16">
      <div class="page-frame">
        <div v-if="isLoading || loadError" class="reveal blog-reveal border-y border-line py-10">
          <p class="font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze">
            {{ loadError || t('blog.fieldNotes.archiveOpen', { count: 0 }) }}
          </p>
        </div>

        <div v-else-if="lead" class="reveal blog-reveal">
          <RouterLink
            :to="`/blog/${lead.slug}`"
            class="group grid min-w-0 gap-8 border-y border-line py-10 lg:grid-cols-12 lg:gap-10"
          >
            <div class="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:col-span-4 lg:flex-col lg:gap-6">
              <span class="shrink-0 font-mono text-xs text-blue">{{ lead.no }}</span>
              <div class="min-w-0 space-y-1 sm:text-right lg:text-left">
                <span class="block break-words font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-muted-foreground">
                  {{ lead.cat }}
                </span>
                <span
                  v-if="lead.topic"
                  class="block break-words font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze"
                >
                  {{ lead.topic }}
                </span>
                <span class="block break-words font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-muted-foreground">
                  {{ lead.date }} / {{ lead.read }}
                </span>
              </div>
            </div>

            <div class="min-w-0 lg:col-span-8">
              <h2
                class="break-words text-balance font-sans text-3xl font-medium leading-tight tracking-tight text-foreground transition-all duration-500 ease-out group-hover:text-blue sm:group-hover:translate-x-1 md:text-4xl"
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

    <section class="page-gutter pb-28">
      <div class="page-frame">
        <div class="reveal blog-reveal mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span class="min-w-0 break-words font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-muted-foreground">
            {{ t('blog.fieldNotes.archiveAll') }}
          </span>
          <div class="grid min-w-0 grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center" :aria-label="t('blog.fieldNotes.filterAria')">
            <span class="min-w-0 break-words font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze sm:mr-1">
              {{ t('blog.fieldNotes.filterLabel') }}
            </span>

            <label class="relative flex min-w-0 items-center sm:inline-flex">
              <span class="sr-only">{{ t('blog.fieldNotes.filterCategory') }}</span>
              <select
                v-model="activeCategoryFilter"
                class="h-9 w-full min-w-0 appearance-none border border-line bg-background py-0 pl-4 pr-9 font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze transition-colors duration-300 hover:border-line-strong hover:text-muted-foreground focus:border-blue focus:text-muted-foreground focus:outline-none sm:w-24"
              >
                <option value="all">{{ t('blog.fieldNotes.filterCategory') }}</option>
                <option v-for="category in categoryOptions" :key="category.id" :value="category.id">
                  {{ category.label }}
                </option>
              </select>
              <ChevronDown class="pointer-events-none absolute right-3 h-4 w-4 text-haze" aria-hidden="true" />
            </label>

            <label class="relative flex min-w-0 items-center sm:inline-flex">
              <span class="sr-only">{{ t('blog.fieldNotes.filterTopic') }}</span>
              <select
                v-model="activeTopicFilter"
                class="h-9 w-full min-w-0 appearance-none border border-line bg-background py-0 pl-4 pr-9 font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze transition-colors duration-300 hover:border-line-strong hover:text-muted-foreground focus:border-blue focus:text-muted-foreground focus:outline-none sm:w-24"
              >
                <option value="all">{{ t('blog.fieldNotes.filterTopic') }}</option>
                <option v-for="topic in topicOptions" :key="topic.id" :value="topic.id">
                  {{ topic.label }}
                </option>
              </select>
              <ChevronDown class="pointer-events-none absolute right-3 h-4 w-4 text-haze" aria-hidden="true" />
            </label>

            <label class="relative flex min-w-0 items-center sm:inline-flex">
              <span class="sr-only">{{ t('blog.fieldNotes.filterYear') }}</span>
              <select
                v-model="activeYearFilter"
                class="h-9 w-full min-w-0 appearance-none border border-line bg-background py-0 pl-4 pr-9 font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze transition-colors duration-300 hover:border-line-strong hover:text-muted-foreground focus:border-blue focus:text-muted-foreground focus:outline-none sm:w-24"
              >
                <option value="all">{{ t('blog.fieldNotes.filterYear') }}</option>
                <option v-for="year in yearOptions" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
              <ChevronDown class="pointer-events-none absolute right-3 h-4 w-4 text-haze" aria-hidden="true" />
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
              class="group grid min-w-0 grid-cols-[minmax(3.75rem,auto)_minmax(0,1fr)] gap-x-3 gap-y-3 border-b border-line py-6 transition-colors duration-300 hover:bg-card md:grid-cols-12 md:items-center md:gap-2"
            >
              <span class="font-mono text-xs text-blue md:col-span-2">
                {{ entry.no }}
              </span>
              <span
                class="min-w-0 break-words text-balance text-base font-medium tracking-tight text-foreground transition-all duration-300 group-hover:text-blue sm:group-hover:translate-x-1 md:col-span-6 md:text-lg"
              >
                {{ entry.title }}
              </span>
              <span class="col-span-2 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 md:col-span-2">
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
                class="min-w-0 text-left font-mono text-xs tracking-[0.12em] text-muted-foreground md:col-span-1 md:text-right"
              >
                {{ entry.date }}
              </span>
              <span
                class="text-right font-mono text-sm text-muted-foreground transition-all duration-300 group-hover:text-blue sm:group-hover:translate-x-1 md:col-span-1"
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
import { ChevronDown } from 'lucide-vue-next'
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
