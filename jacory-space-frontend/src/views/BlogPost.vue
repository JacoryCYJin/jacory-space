<template>
  <main class="grain min-h-screen bg-background">
    <section v-if="isLoading || loadError" class="page-gutter pt-40">
      <div class="page-frame">
        <span class="font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze">
          {{ loadError || t('blog.post.fieldNote') }}
        </span>
      </div>
    </section>

    <template v-else-if="post">
      <section class="page-gutter pt-28 md:pt-32">
        <div class="page-frame">
          <div class="grid grid-cols-12 gap-x-10">
            <article class="col-span-12 lg:order-2 lg:col-span-9">
              <div class="flex items-center justify-between border-b border-line pb-4">
                <span class="font-mono text-xs tracking-[0.16em] text-blue">{{ headerLabel }}</span>
                <span class="font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-muted-foreground">
                  {{ headerMeta }}
                </span>
              </div>

              <header class="pt-10">
                <h1
                  class="max-w-3xl text-balance font-sans text-4xl font-medium leading-[1.08] tracking-tight text-foreground md:text-5xl"
                >
                  {{ frontmatter.title }}
                </h1>
                <p
                  v-if="frontmatter.description"
                  class="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground"
                >
                  {{ frontmatter.description }}
                </p>
              </header>

              <hr class="my-10 border-0 border-t border-line" />

              <MarkdownArticle :blocks="post.blocks" />

              <nav
                class="mt-20 grid grid-cols-1 gap-8 border-t border-line py-8 md:grid-cols-2"
                :aria-label="t('blog.post.navAria')"
              >
                <RouterLink
                  v-if="post.prev"
                  :to="`/blog/${post.prev.slug}`"
                  class="group md:text-left"
                >
                  <span class="block font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze">
                    {{ t('blog.post.previousEntry') }}
                  </span>
                  <span class="mt-1 block font-mono text-xs text-blue">№ {{ post.prev.index }}</span>
                  <span
                    class="mt-1 block text-sm leading-snug text-muted-foreground transition-colors group-hover:text-foreground"
                  >
                    {{ post.prev.title }}
                  </span>
                </RouterLink>
                <span v-else class="hidden md:block" aria-hidden="true"></span>

                <RouterLink
                  v-if="post.next"
                  :to="`/blog/${post.next.slug}`"
                  class="group md:text-right"
                >
                  <span class="block font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze">
                    {{ t('blog.post.nextEntry') }}
                  </span>
                  <span class="mt-1 block font-mono text-xs text-blue">№ {{ post.next.index }}</span>
                  <span
                    class="mt-1 block text-sm leading-snug text-muted-foreground transition-colors group-hover:text-foreground"
                  >
                    {{ post.next.title }}
                  </span>
                </RouterLink>
                <span v-else class="hidden md:block" aria-hidden="true"></span>
              </nav>
            </article>

            <aside class="col-span-12 mt-12 lg:order-1 lg:mt-0 lg:col-span-3">
              <div v-if="post.toc.length" class="lg:sticky lg:top-28">
                <p
                  class="border-b border-line pb-3 font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-foreground"
                >
                  {{ t('blog.post.onThisNote') }}
                </p>
                <ul class="mt-4 space-y-3">
                  <li
                    v-for="item in post.toc"
                    :key="item.id"
                    :class="item.level === 3 ? 'pl-4' : ''"
                  >
                    <a
                      :href="`#${item.id}`"
                      class="group block font-mono text-xs leading-relaxed transition-colors"
                      :class="activeId === item.id ? 'text-blue' : 'text-muted-foreground hover:text-foreground'"
                    >
                      <span>{{ item.text }}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </template>

    <section v-else class="page-gutter pt-40">
      <div class="page-frame">
        <span class="font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze">
          {{ t('blog.post.notFoundBadge') }}
        </span>
        <h1 class="mt-6 font-sans text-4xl font-medium tracking-tight text-foreground">
          {{ t('blog.post.notFoundTitle') }}<span class="text-blue">.</span>
        </h1>
        <RouterLink
          to="/blog"
          class="mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-foreground transition-colors hover:text-blue"
        >
          <span>←</span> {{ t('blog.post.backToFieldNotes') }}
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { getPost } from '../lib/blog/index.js'
import MarkdownArticle from '../components/blog/MarkdownArticle.vue'
import Footer from '../components/Footer.vue'

const route = useRoute()
const { t } = useI18n()
const post = ref(null)
const activeId = ref('')
const isLoading = ref(true)
const loadError = ref('')
let headingObserver
let loadToken = 0

const frontmatter = computed(() => post.value?.frontmatter ?? {})

function categoryLabel(meta) {
  return t(meta?.categoryLabelKey, meta?.categoryKey || meta?.category || 'NOTE')
}

function topicLabel(meta) {
  if (!meta?.topic) return ''
  return t(meta.topicLabelKey, meta.topicKey || meta.topic)
}

const headerLabel = computed(() => {
  const fm = frontmatter.value
  const meta = post.value?.meta
  const labels = [categoryLabel(meta), topicLabel(meta)].filter(Boolean).join('  ')
  return t('blog.post.headerLabel', {
    index: fm.index || '—',
    category: labels,
  })
})

const headerMeta = computed(() => {
  const fm = frontmatter.value
  return [fm.date, fm.readTime].filter(Boolean).join(' / ')
})

function teardownObserver() {
  headingObserver?.disconnect()
  headingObserver = undefined
}

function setupObserver() {
  teardownObserver()
  if (!post.value?.toc.length || typeof IntersectionObserver === 'undefined') return

  const targets = post.value.toc
    .map((item) => document.getElementById(item.id))
    .filter(Boolean)
  if (!targets.length) return

  activeId.value = post.value.toc[0].id

  headingObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible.length) {
        activeId.value = visible[0].target.id
      }
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
  )

  targets.forEach((target) => headingObserver.observe(target))
}

async function loadPost(slug) {
  const token = (loadToken += 1)
  teardownObserver()
  post.value = null
  activeId.value = ''
  isLoading.value = true
  loadError.value = ''

  try {
    const loadedPost = await getPost(slug)
    if (token !== loadToken) return
    post.value = loadedPost
  } catch (error) {
    if (token !== loadToken) return
    loadError.value = error instanceof Error ? error.message : String(error)
  } finally {
    if (token !== loadToken) return
    isLoading.value = false
  }

  nextTick(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0 })
    }
    setupObserver()
  })
}

watch(
  () => route.params.slug,
  (slug) => loadPost(slug),
  { immediate: true },
)

onBeforeUnmount(teardownObserver)
</script>
