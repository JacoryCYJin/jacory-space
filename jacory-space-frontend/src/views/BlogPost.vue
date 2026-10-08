<template>
  <FooterReveal>
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
              class="hidden min-w-0 lg:-mt-3 lg:order-1 lg:block"
            >
              <nav
                v-if="displayToc.length"
                class="lg:sticky lg:top-[6.25rem] lg:flex lg:max-h-[calc(100dvh-8.5rem)] lg:flex-col"
                :aria-label="t('blog.post.onThisNote')"
              >
                <p class="shrink-0 font-sans text-sm font-semibold leading-none text-foreground">
                  目录
                </p>
                <ol
                  ref="tocList"
                  data-lenis-prevent
                  @wheel.passive="pauseTocFollowing"
                  @pointerdown="pauseTocFollowing"
                  @keydown="pauseTocFollowing"
                  class="mt-5 min-h-0 space-y-3 overflow-y-auto overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  <li
                    v-for="item in displayToc"
                    :key="item.id"
                    :class="item.level === 4 ? 'pl-10' : item.level === 3 ? 'pl-5' : ''"
                  >
                    <a
                      :href="`#${item.id}`"
                      @click="selectTocItem(item.id)"
                      :aria-current="activeId === item.id ? 'location' : undefined"
                      class="group grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 text-left transition-colors"
                      :class="activeId === item.id ? 'text-blue' : 'text-foreground'"
                    >
                      <span
                        class="relative mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full font-mono text-xs font-medium leading-none transition-colors"
                        :class="activeId === item.id ? 'bg-blue text-card' : 'bg-muted text-haze group-hover:text-blue'"
                      >
                        {{ item.number }}
                      </span>
                      <span
                        class="min-w-0 break-words pt-0.5 text-xs font-medium leading-normal transition-colors"
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
              <header class="max-w-[54rem] border-b border-line pb-10 md:pb-12">
                <div data-post-enter class="font-mono text-xs font-medium leading-[1.2] tracking-[0.16em] text-blue">
                  {{ breadcrumbLabel }}
                </div>
                <h1
                  data-post-enter
                  class="mt-10 break-words text-balance font-sans text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl"
                >
                  {{ frontmatter.title }}
                </h1>
                <p
                  v-if="frontmatter.description"
                  data-post-enter
                  class="mt-7 break-words text-pretty text-base leading-8 text-muted-foreground md:text-lg"
                >
                  {{ frontmatter.description }}
                </p>

                <div
                  v-if="articleMetaItems.length || post.meta.tags.length"
                  data-post-enter
                  class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-haze"
                >
                  <div v-if="articleMetaItems.length" class="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-3">
                    <span
                      v-for="item in articleMetaItems"
                      :key="item.key"
                      class="inline-flex min-w-0 items-center gap-2 font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.12em]"
                    >
                      <span class="h-1 w-1 rounded-full bg-line-strong" aria-hidden="true"></span>
                      <span class="break-words">{{ item.label }}</span>
                    </span>
                  </div>
                  <ul
                    v-if="post.meta.tags.length"
                    class="flex min-w-0 flex-wrap gap-x-5 gap-y-2 font-mono text-xs leading-6 text-muted-foreground"
                  >
                    <li v-for="tag in post.meta.tags" :key="tag" :style="post.meta.tagColors?.[tag] ? { color: post.meta.tagColors[tag] } : undefined" class="min-w-0 break-words">
                      # {{ tag }}
                    </li>
                  </ul>
                </div>
              </header>

              <div data-post-enter class="mt-12 max-w-[54rem]">
                <MarkdownArticle ref="article" compact :blocks="post.blocks" :collapsible-section="frontmatter.collapsibleSection || ''" @layout-change="refreshArticleLayout" />
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
  </FooterReveal>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onServerPrefetch, ref, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'
import { getPost } from '../lib/blog/index.js'
import MarkdownArticle from '../components/blog/MarkdownArticle.vue'
import FooterReveal from '../components/FooterReveal.vue'

const route = useRoute()
const { t } = useI18n()
const pageRoot = ref(null)
const tocList = ref(null)
const article = ref(null)
const post = ref(null)
const activeId = ref('')
const isLoading = ref(true)
const loadError = ref('')
let stopHeadingTracking
let refreshActiveHeading
let postMotionMedia
let loadToken = 0
let tocFollowFrame = 0
let anchorSettleTimer
let pendingAnchorId = ''
let tocFollowingPaused = false

const frontmatter = computed(() => post.value?.frontmatter ?? {})
const publishedDate = computed(() => {
  const value = String(frontmatter.value.date || '').replaceAll('.', '-')
  return /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : value
})

useHead(() => {
  const title = frontmatter.value.title
  const description = frontmatter.value.description
  const canonicalUrl = `https://jacoryspace.top/blog/${route.params.slug}`

  if (!title || !description) return {}

  return {
    title: `${title} — Jacory Space`,
    meta: [
      { key: 'description', name: 'description', content: description },
      { key: 'og:title', property: 'og:title', content: title },
      { key: 'og:description', property: 'og:description', content: description },
      { key: 'og:type', property: 'og:type', content: 'article' },
      { key: 'og:url', property: 'og:url', content: canonicalUrl },
      { key: 'article:published_time', property: 'article:published_time', content: publishedDate.value },
      { key: 'twitter:card', name: 'twitter:card', content: 'summary' },
    ],
    link: [{ key: 'canonical', rel: 'canonical', href: canonicalUrl }],
    script: [{
      key: 'article-structured-data',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        datePublished: publishedDate.value,
        mainEntityOfPage: canonicalUrl,
        author: { '@type': 'Person', name: 'Jacory' },
        publisher: { '@type': 'Organization', name: 'Jacory Space', url: 'https://jacoryspace.top' },
      }),
    }],
  }
})

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

const displayToc = computed(() => {
  const grouped = post.value?.blocks.some((block) => block.sourceLevel === 1)
  const counters = [0, 0, 0]
  return (post.value?.toc || []).map((item, index) => {
    const depth = item.level - 2
    counters[depth] += 1
    counters.fill(0, depth + 1)
    return {
      ...item,
      number: grouped ? tocNumber(counters[depth] - 1) : tocNumber(index),
      text: cleanHeadingText(item.text),
    }
  })
})

function pauseTocFollowing() {
  tocFollowingPaused = true
  window.cancelAnimationFrame(tocFollowFrame)
  // Stop an in-flight follow animation so manual browsing takes precedence.
  tocList.value?.scrollTo({ top: tocList.value.scrollTop, behavior: 'instant' })
}

function followActiveTocItem() {
  tocFollowFrame = 0
  const list = tocList.value
  if (tocFollowingPaused || !list || !window.matchMedia('(min-width: 1024px)').matches) return
  const link = [...list.querySelectorAll('a')].find((item) => item.hash === `#${activeId.value}`)
  if (!link || list.scrollHeight <= list.clientHeight) return
  const containerRect = list.getBoundingClientRect()
  const linkRect = link.getBoundingClientRect()
  const center = (linkRect.top + linkRect.bottom) / 2 - containerRect.top
  if (center >= list.clientHeight * 0.2 && center <= list.clientHeight * 0.45 &&
      linkRect.top >= containerRect.top && linkRect.bottom <= containerRect.bottom) return
  const top = Math.max(0, Math.min(
    list.scrollHeight - list.clientHeight,
    list.scrollTop + center - list.clientHeight * 0.3,
  ))
  if (Math.abs(top - list.scrollTop) < 1) return
  list.scrollTo({
    top,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })
}

function scheduleTocFollowing() {
  if (typeof window === 'undefined') return
  if (!tocFollowFrame) tocFollowFrame = window.requestAnimationFrame(followActiveTocItem)
}

function selectTocItem(id) {
  article.value?.expandHeading(id)
  tocFollowingPaused = false
  pendingAnchorId = id
  activeId.value = id
  scheduleTocFollowing()
  settleAnchorSelection()
}

function refreshArticleLayout() {
  refreshActiveHeading?.()
  scheduleTocFollowing()
}

watch(() => route.hash, (hash) => {
  article.value?.expandHeading(hash.slice(1))
})

function settleAnchorSelection() {
  window.clearTimeout(anchorSettleTimer)
  anchorSettleTimer = window.setTimeout(() => {
    pendingAnchorId = ''
    refreshActiveHeading?.()
  }, 180)
}

watch(activeId, scheduleTocFollowing, { flush: 'post' })

function teardownHeadingTracking() {
  stopHeadingTracking?.()
  stopHeadingTracking = undefined
  refreshActiveHeading = undefined
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

function setupHeadingTracking() {
  teardownHeadingTracking()
  if (!post.value?.toc.length || typeof window === 'undefined') return

  const targets = post.value.toc
    .map((item) => document.getElementById(item.id))
    .filter(Boolean)
  if (!targets.length) return

  let frame = 0
  let activationTop = 0
  let previousScrollY = window.scrollY

  const updateActiveHeading = () => {
    frame = 0
    if (pendingAnchorId) return
    let current = targets[0]
    // Match the anchor landing position, allowing for subpixel scroll rounding.
    for (const target of targets) {
      if (target.getBoundingClientRect().top > activationTop + 1) break
      current = target
    }
    activeId.value = current.id
    // Position the directory again even when scrolling within the same section.
    scheduleTocFollowing()
  }

  const scheduleUpdate = () => {
    if (pendingAnchorId) settleAnchorSelection()
    if (!frame) frame = window.requestAnimationFrame(updateActiveHeading)
  }

  const onDocumentScroll = () => {
    const scrollY = window.scrollY
    if (scrollY === previousScrollY) return
    previousScrollY = scrollY
    if (tocFollowingPaused) {
      tocFollowingPaused = false
      window.clearTimeout(anchorSettleTimer)
      pendingAnchorId = ''
    }
    scheduleUpdate()
  }

  const updateActivationTop = () => {
    activationTop = Number.parseFloat(window.getComputedStyle(targets[0]).scrollMarginTop) || 0
    scheduleUpdate()
    scheduleTocFollowing()
  }

  refreshActiveHeading = scheduleUpdate
  window.addEventListener('scroll', onDocumentScroll, { passive: true })
  window.addEventListener('resize', updateActivationTop)
  updateActivationTop()

  stopHeadingTracking = () => {
    window.removeEventListener('scroll', onDocumentScroll)
    window.removeEventListener('resize', updateActivationTop)
    window.cancelAnimationFrame(frame)
  }
}

async function loadPost(slug) {
  const token = (loadToken += 1)
  teardownHeadingTracking()
  teardownPostMotion()
  if (typeof window !== 'undefined') {
    window.clearTimeout(anchorSettleTimer)
    window.cancelAnimationFrame(tocFollowFrame)
  }
  tocFollowFrame = 0
  pendingAnchorId = ''
  tocFollowingPaused = false
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

  nextTick(async () => {
    if (token !== loadToken) return
    const anchorId = route.hash.slice(1)
    article.value?.expandHeading(anchorId)
    await nextTick()
    if (typeof window !== 'undefined') {
      const anchor = anchorId && document.getElementById(anchorId)
      if (anchor) anchor.scrollIntoView({ behavior: 'instant', block: 'start' })
      else window.scrollTo({ top: 0 })
    }
    setupHeadingTracking()
    setupPostMotion()
  })
}

if (import.meta.env.SSR) {
  onServerPrefetch(() => loadPost(route.params.slug))
} else {
  watch(
    () => route.params.slug,
    (slug) => loadPost(slug),
    { immediate: true },
  )
}

onBeforeUnmount(() => {
  teardownHeadingTracking()
  teardownPostMotion()
  window.clearTimeout(anchorSettleTimer)
  window.cancelAnimationFrame(tocFollowFrame)
})
</script>
