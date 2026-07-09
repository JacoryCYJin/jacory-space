<template>
  <main ref="pageRoot" class="grain min-h-screen bg-background">
    <section v-if="isLoading || loadError" class="page-gutter pt-40">
      <div class="page-frame">
        <span class="font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze">
          {{ loadError || t('blog.post.fieldNote') }}
        </span>
      </div>
    </section>

    <template v-else-if="post">
      <section class="page-gutter pt-24 md:pt-28">
        <div class="page-frame">
          <div class="grid min-w-0 grid-cols-1 gap-x-0 lg:grid-cols-[minmax(220px,250px)_minmax(0,60rem)] lg:justify-center lg:gap-x-12 xl:grid-cols-[minmax(220px,260px)_minmax(0,60rem)] xl:gap-x-16">
            <aside
              data-post-enter
              class="hidden min-w-0 lg:order-1 lg:block"
            >
              <nav
                v-if="displayToc.length"
                class="lg:sticky lg:top-28"
                :aria-label="t('blog.post.onThisNote')"
              >
                <p class="font-sans text-base font-semibold leading-none text-foreground">
                  目录
                </p>
                <ol class="mt-7 space-y-5">
                  <li
                    v-for="item in displayToc"
                    :key="item.id"
                    :class="item.level === 3 ? 'pl-5' : ''"
                  >
                    <a
                      :href="`#${item.id}`"
                      class="group grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 text-left transition-colors"
                      :class="activeId === item.id ? 'text-blue' : 'text-foreground'"
                    >
                      <span
                        class="relative mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-medium leading-none transition-colors"
                        :class="activeId === item.id ? 'bg-blue text-card' : 'bg-muted text-haze group-hover:text-blue'"
                      >
                        {{ item.number }}
                      </span>
                      <span
                        class="min-w-0 break-words pt-0.5 text-sm font-medium leading-relaxed transition-colors"
                        :class="activeId === item.id ? 'text-blue' : 'text-muted-foreground group-hover:text-foreground'"
                      >
                        {{ item.text }}
                      </span>
                    </a>
                  </li>
                </ol>
              </nav>
            </aside>

            <article class="min-w-0 lg:order-2">
              <header class="max-w-[60rem] border-b border-line pb-10 md:pb-12">
                <div data-post-enter class="font-mono text-xs font-medium leading-[1.2] tracking-[0.16em] text-blue">
                  {{ breadcrumbLabel }}
                </div>
                <h1
                  data-post-enter
                  class="mt-10 max-w-[60rem] break-words text-balance font-sans text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl"
                >
                  {{ frontmatter.title }}
                </h1>
                <p
                  v-if="frontmatter.description"
                  data-post-enter
                  class="mt-7 max-w-[46rem] break-words text-pretty text-base leading-8 text-muted-foreground md:text-lg"
                >
                  {{ frontmatter.description }}
                </p>

                <div
                  v-if="articleMetaItems.length"
                  data-post-enter
                  class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-haze"
                >
                  <span
                    v-for="item in articleMetaItems"
                    :key="item.key"
                    class="inline-flex min-w-0 items-center gap-2 font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.12em]"
                  >
                    <span class="h-1 w-1 rounded-full bg-line-strong" aria-hidden="true"></span>
                    <span class="break-words">{{ item.label }}</span>
                  </span>
                </div>
              </header>

              <div data-post-enter class="mt-12 max-w-[54rem]">
                <MarkdownArticle :blocks="post.blocks" />
              </div>

              <nav
                data-post-enter
                class="mt-20 grid grid-cols-1 gap-8 border-t border-line py-8 md:grid-cols-2"
                :aria-label="t('blog.post.navAria')"
              >
                <RouterLink
                  v-if="post.prev"
                  :to="`/blog/${post.prev.slug}`"
                  class="group min-w-0 md:text-left"
                >
                  <span class="block break-words font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze">
                    {{ t('blog.post.previousEntry') }}
                  </span>
                  <span class="mt-1 block font-mono text-xs text-blue">№ {{ post.prev.index }}</span>
                  <span
                    class="mt-1 block break-words text-sm leading-snug text-muted-foreground transition-colors group-hover:text-foreground"
                  >
                    {{ post.prev.title }}
                  </span>
                </RouterLink>
                <span v-else class="hidden md:block" aria-hidden="true"></span>

                <RouterLink
                  v-if="post.next"
                  :to="`/blog/${post.next.slug}`"
                  class="group min-w-0 md:text-right"
                >
                  <span class="block break-words font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em] text-haze">
                    {{ t('blog.post.nextEntry') }}
                  </span>
                  <span class="mt-1 block font-mono text-xs text-blue">№ {{ post.next.index }}</span>
                  <span
                    class="mt-1 block break-words text-sm leading-snug text-muted-foreground transition-colors group-hover:text-foreground"
                  >
                    {{ post.next.title }}
                  </span>
                </RouterLink>
                <span v-else class="hidden md:block" aria-hidden="true"></span>
              </nav>
            </article>

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
import { gsap } from 'gsap'
import { getPost } from '../lib/blog/index.js'
import MarkdownArticle from '../components/blog/MarkdownArticle.vue'
import Footer from '../components/Footer.vue'

const route = useRoute()
const { t } = useI18n()
const pageRoot = ref(null)
const post = ref(null)
const activeId = ref('')
const isLoading = ref(true)
const loadError = ref('')
let headingObserver
let postMotionMedia
let loadToken = 0

const frontmatter = computed(() => post.value?.frontmatter ?? {})

function cleanHeadingText(text) {
  return String(text || '').replace(/^\s*\d{1,2}\s*(?:[.．、|｜/])\s*/, '').trim()
}

function tocNumber(index) {
  return String(index + 1).padStart(2, '0')
}

function categoryLabel(meta) {
  return t(meta?.categoryLabelKey, meta?.categoryKey || meta?.category || 'NOTE')
}

function topicLabel(meta) {
  if (!meta?.topic) return ''
  return t(meta.topicLabelKey, meta.topicKey || meta.topic)
}

const breadcrumbLabel = computed(() => {
  const index = frontmatter.value.index || '—'
  return `${t('nav.blog')} / ${index}`
})

const articleMetaItems = computed(() => {
  const fm = frontmatter.value
  const meta = post.value?.meta
  const labels = [categoryLabel(meta), topicLabel(meta)].filter(Boolean).join(' · ')
  return [
    { key: 'date', label: fm.date },
    { key: 'readTime', label: fm.readTime },
    { key: 'category', label: labels },
  ].filter((item) => item.label)
})

const displayToc = computed(() =>
  (post.value?.toc || []).map((item, index) => ({
    ...item,
    number: tocNumber(index),
    text: cleanHeadingText(item.text),
  })),
)

function teardownObserver() {
  headingObserver?.disconnect()
  headingObserver = undefined
}

function teardownPostMotion() {
  postMotionMedia?.revert()
  postMotionMedia = undefined
}

function setupPostMotion() {
  teardownPostMotion()
  const root = pageRoot.value
  if (!root || typeof window === 'undefined') return

  postMotionMedia = gsap.matchMedia()
  postMotionMedia.add(
    {
      all: '(min-width: 0px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    ({ conditions }) => {
      const enterTargets = gsap.utils.toArray('[data-post-enter]', root)

      if (conditions.reduceMotion) {
        gsap.set(enterTargets, {
          autoAlpha: 1,
          y: 0,
          clearProps: 'transform,opacity,visibility',
        })
        return
      }

      gsap
        .timeline({ defaults: { duration: 0.78, ease: 'power3.out' } })
        .fromTo(
          enterTargets,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            clearProps: 'transform,opacity,visibility',
          },
        )
    },
  )
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
  teardownPostMotion()
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
    setupPostMotion()
  })
}

watch(
  () => route.params.slug,
  (slug) => loadPost(slug),
  { immediate: true },
)

onBeforeUnmount(() => {
  teardownObserver()
  teardownPostMotion()
})
</script>
