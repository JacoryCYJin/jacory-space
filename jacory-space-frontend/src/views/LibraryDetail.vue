<template>
  <main
    ref="pageRoot"
    class="grain bg-background"
    :class="isViewportBound ? 'min-h-screen lg:h-[100dvh] lg:min-h-0 lg:overflow-hidden lg:pt-16' : 'min-h-screen'"
  >
    <section
      v-if="entry"
      class="page-gutter pt-20 md:pt-24"
      :class="isViewportBound ? 'lg:h-full lg:pt-6 2xl:pt-8' : ''"
    >
      <div class="page-frame pb-20 md:pb-28 lg:pb-0" :class="isViewportBound ? 'lg:flex lg:h-full lg:min-h-0 lg:flex-col' : ''">
        <header class="border-b border-line pb-10 md:pb-14 lg:pb-10 2xl:pb-14 lg:shrink-0">
          <router-link to="/library" class="tech inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-blue">
            <ChevronLeft :size="14" stroke-width="1.5" aria-hidden="true" />
            {{ t('library.backToLibrary') }}
          </router-link>
          <div class="mt-12 grid gap-10 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end lg:gap-16 2xl:mt-12">
            <div data-detail-enter class="min-w-0">
              <p class="tech mb-5 text-xs text-blue">{{ entry.no }} · {{ entry.type === 'skill' ? 'SKILL' : 'PROMPT' }}</p>
              <h1 class="max-w-4xl font-sans text-5xl font-medium leading-[0.95] tracking-tight text-foreground md:text-7xl">{{ t(entry.titleKey) }}</h1>
              <p class="mt-7 max-w-2xl text-base leading-8 text-foreground">{{ t(entry.descriptionKey) }}</p>
            </div>
            <dl data-detail-enter class="grid grid-cols-2 gap-5 border-t border-line pt-4 font-mono text-xs uppercase tracking-[0.12em] lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
              <div>
                <dt class="text-haze">{{ t('library.versionLabel') }}</dt>
                <dd class="mt-3 text-foreground">{{ entry.version }}</dd>
              </div>
              <div>
                <dt class="text-haze">{{ t('library.updatedLabel') }}</dt>
                <dd class="mt-3 text-foreground">{{ entry.updated }}</dd>
              </div>
            </dl>
          </div>
        </header>

        <div
          ref="detailGrid"
          class="grid gap-12 pt-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16 lg:pt-8 lg:pb-9 2xl:pt-12 2xl:pb-14"
          :class="isViewportBound ? 'lg:min-h-0 lg:flex-1' : ''"
        >
          <aside
            class="border-b border-line pb-8 lg:min-h-0 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8"
            :class="isAsideOverflowing ? 'lg:overflow-y-auto lg:overscroll-contain' : ''"
            :style="detailAsideStyle"
          >
            <div ref="detailAsideContent" class="flex flex-col gap-8">
              <section data-detail-enter class="border-b border-line pb-8">
                <p class="tech mb-6 text-xs text-blue">01 — {{ t('library.aboutLabel') }}</p>
                <p class="text-sm leading-7 text-foreground">{{ t('library.details.' + entry.detailKey + '.about') }}</p>
              </section>

              <section data-detail-enter class="border-b border-line pb-8">
                <p class="tech mb-6 text-xs text-blue">02 — {{ t('library.usageLabel') }}</p>
                <p class="text-sm leading-7 text-muted-foreground">{{ t('library.details.' + entry.detailKey + '.usage') }}</p>
              </section>

              <section data-detail-enter>
                <p class="tech mb-6 text-xs text-blue">03 — {{ t('library.notesLabel') }}</p>
                <p class="text-sm leading-7 text-muted-foreground">{{ t('library.details.' + entry.detailKey + '.notes') }}</p>
              </section>
            </div>
          </aside>

          <article class="min-w-0 lg:flex lg:min-h-0" :style="detailArticleStyle">
            <section data-detail-enter class="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
              <div class="mb-5 flex shrink-0 items-center justify-between gap-4" :class="entry.type === 'prompt' ? 'lg:hidden' : ''">
                <p class="tech text-xs text-blue">04 — {{ entry.type === 'skill' ? 'SKILL.md' : t('library.contentLabel') }}</p>
                <button type="button" class="inline-flex items-center gap-2 border border-line-strong px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-foreground transition-colors hover:border-blue hover:text-blue" @click="copyContent">
                  <Check v-if="copied" :size="14" stroke-width="1.5" aria-hidden="true" />
                  <Copy v-else :size="14" stroke-width="1.5" aria-hidden="true" />
                  {{ copied ? t('library.copied') : t('library.copy') }}
                </button>
              </div>
              <PromptContent
                v-if="entry.type === 'prompt'"
                class="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col"
                :content="entry.content"
                @expanded-change="promptContentExpanded = $event"
              >
                <template #header>
                  <p class="tech text-xs text-blue">04 — {{ t('library.contentLabel') }}</p>
                  <button type="button" class="inline-flex items-center gap-2 border border-line-strong px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-foreground transition-colors hover:border-blue hover:text-blue" @click="copyContent">
                    <Check v-if="copied" :size="14" stroke-width="1.5" aria-hidden="true" />
                    <Copy v-else :size="14" stroke-width="1.5" aria-hidden="true" />
                    {{ copied ? t('library.copied') : t('library.copy') }}
                  </button>
                </template>
              </PromptContent>
              <SkillContent v-else :content="entry.content" />
            </section>
          </article>
        </div>
      </div>
    </section>
    <div v-else class="page-gutter pt-20"><div class="page-frame pb-20"><p class="font-mono text-sm uppercase tracking-[0.12em] text-muted-foreground">{{ t('library.notFound') }}</p></div></div>
    <StatusToast :visible="toast.visible" :message="toast.message" :type="toast.type" />
  </main>
  <Footer />
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check, ChevronLeft, Copy } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import Footer from '../components/Footer.vue'
import StatusToast from '../components/StatusToast.vue'
import PromptContent from '../components/library/PromptContent.vue'
import SkillContent from '../components/library/SkillContent.vue'
import { getLibraryEntry } from '@library-index'

const { t, locale } = useI18n()
const route = useRoute()
const pageRoot = ref(null)
const detailGrid = ref(null)
const detailAsideContent = ref(null)
const copied = ref(false)
const promptContentExpanded = ref(false)
const isDesktop = ref(false)
const detailAvailableHeight = ref(0)
const isAsideOverflowing = ref(false)
const toast = reactive({ visible: false, message: '', type: 'success' })
let toastTimer
let detailResizeObserver
let detailHeightFrame
const entry = computed(() => getLibraryEntry(route.params.id))
const isViewportBound = computed(() => entry.value?.type === 'prompt' && !promptContentExpanded.value)
const isDesktopViewportBound = computed(() => isViewportBound.value && isDesktop.value)
const detailArticleStyle = computed(() => (
  isDesktopViewportBound.value && detailAvailableHeight.value > 0
    ? { height: `${detailAvailableHeight.value}px` }
    : {}
))
const detailAsideStyle = computed(() => (
  isDesktopViewportBound.value && isAsideOverflowing.value && detailAvailableHeight.value > 0
    ? { height: `${detailAvailableHeight.value}px` }
    : {}
))

function syncDetailPanelHeight() {
  if (!isDesktopViewportBound.value || !detailGrid.value || !detailAsideContent.value) {
    detailAvailableHeight.value = 0
    isAsideOverflowing.value = false
    return
  }

  const gridStyle = window.getComputedStyle(detailGrid.value)
  const verticalPadding = Number.parseFloat(gridStyle.paddingTop) + Number.parseFloat(gridStyle.paddingBottom)
  const availableHeight = Math.max(0, detailGrid.value.clientHeight - verticalPadding)
  const naturalAsideHeight = detailAsideContent.value.scrollHeight

  detailAvailableHeight.value = availableHeight
  isAsideOverflowing.value = naturalAsideHeight > availableHeight
}

function scheduleDetailPanelHeight() {
  window.cancelAnimationFrame(detailHeightFrame)
  detailHeightFrame = window.requestAnimationFrame(syncDetailPanelHeight)
}

function handleDetailViewportResize() {
  isDesktop.value = window.matchMedia('(min-width: 1024px)').matches
  scheduleDetailPanelHeight()
}

function showToast(message, type = 'success') {
  toast.visible = true
  toast.message = message
  toast.type = type
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { toast.visible = false }, 2200)
}

async function copyContent() {
  if (!entry.value) return
  try {
    await navigator.clipboard.writeText(entry.value.content)
    copied.value = true
    showToast(t('library.copySuccess'))
    window.setTimeout(() => { copied.value = false }, 2200)
  } catch {
    showToast(t('library.copyError'), 'error')
  }
}

onMounted(() => {
  const items = pageRoot.value?.querySelectorAll('[data-detail-enter]') || []
  items.forEach((item, index) => {
    item.style.opacity = '0'
    item.style.transform = 'translateY(14px)'
    window.setTimeout(() => {
      item.style.transition = 'opacity 700ms var(--ease-premium), transform 700ms var(--ease-premium)'
      item.style.opacity = '1'
      item.style.transform = 'translateY(0)'
    }, 100 + index * 80)
  })

  nextTick(() => {
    handleDetailViewportResize()
    window.addEventListener('resize', handleDetailViewportResize)
    if (typeof ResizeObserver !== 'undefined') {
      detailResizeObserver = new ResizeObserver(scheduleDetailPanelHeight)
      if (detailGrid.value) detailResizeObserver.observe(detailGrid.value)
      if (detailAsideContent.value) detailResizeObserver.observe(detailAsideContent.value)
    }
  })
})

watch([() => route.params.id, locale, isDesktopViewportBound], () => {
  nextTick(scheduleDetailPanelHeight)
})

onBeforeUnmount(() => {
  clearTimeout(toastTimer)
  window.cancelAnimationFrame(detailHeightFrame)
  window.removeEventListener('resize', handleDetailViewportResize)
  detailResizeObserver?.disconnect()
})
</script>
