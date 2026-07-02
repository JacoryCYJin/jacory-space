<template>
  <main ref="pageRoot" class="grain min-h-screen bg-background">
    <section class="page-gutter pt-28 md:pt-36">
      <div class="page-frame">
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

    <section class="page-gutter py-20 md:py-28">
      <div class="page-frame">
        <div v-if="isLoading || loadError" class="reveal blog-reveal border-y border-line py-10">
          <p class="tech text-haze">{{ loadError || t('blog.fieldNotes.archiveOpen', { count: 0 }) }}</p>
        </div>

        <div v-else-if="lead" class="reveal blog-reveal">
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

    <section class="page-gutter pb-28">
      <div class="page-frame">
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

    <Footer />
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import Footer from '../components/Footer.vue'
import { listPosts } from '../lib/blog/index.js'

const pageRoot = ref(null)
const { t } = useI18n()
const posts = ref([])
const isLoading = ref(true)
const loadError = ref('')
let revealObserver

function categoryLabel(post) {
  return t(post.categoryLabelKey, post.categoryKey || post.category)
}

const toEntry = (post) => ({
  slug: post.slug,
  no: `№ ${post.index}`,
  title: post.title,
  excerpt: post.description,
  cat: categoryLabel(post),
  date: post.date,
  read: post.readTime
})

const allPosts = computed(() => posts.value.map(toEntry))
const lead = computed(() => allPosts.value[0] ?? null)
const entries = computed(() => allPosts.value.slice(1))
const entryCount = computed(() => allPosts.value.length)

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

onBeforeUnmount(() => {
  revealObserver?.disconnect()
})
</script>
