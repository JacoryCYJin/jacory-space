<template>
  <main ref="pageRoot" class="grain min-h-screen bg-background">
    <section v-if="entry" class="page-gutter pt-20 md:pt-24">
      <div class="page-frame pb-20 md:pb-28">
        <header class="border-b border-line pb-10 md:pb-14">
          <router-link to="/library" class="tech inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-blue">
            <ChevronLeft :size="14" stroke-width="1.5" aria-hidden="true" />
            {{ t('library.backToLibrary') }}
          </router-link>
          <div class="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end lg:gap-16">
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

        <div class="grid gap-12 pt-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16 lg:pt-12">
          <aside class="flex flex-col gap-8 border-b border-line pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
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
          </aside>

          <article class="min-w-0">
            <section data-detail-enter>
              <div class="mb-5 flex items-center justify-between gap-4">
                <p class="tech text-xs text-blue">04 — {{ entry.type === 'skill' ? 'SKILL.md' : t('library.contentLabel') }}</p>
                <button type="button" class="inline-flex items-center gap-2 border border-line-strong px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-foreground transition-colors hover:border-blue hover:text-blue" @click="copyContent">
                  <Check v-if="copied" :size="14" stroke-width="1.5" aria-hidden="true" />
                  <Copy v-else :size="14" stroke-width="1.5" aria-hidden="true" />
                  {{ copied ? t('library.copied') : t('library.copy') }}
                </button>
              </div>
              <pre id="library-prompt-content" class="overflow-x-auto overflow-y-hidden border border-line bg-card px-5 py-6 font-mono text-sm leading-7 text-foreground md:px-7 md:py-8" :class="entry.type === 'prompt' && !promptContentExpanded ? 'max-h-96' : ''"><code>{{ entry.content }}</code></pre>
              <button
                v-if="entry.type === 'prompt'"
                type="button"
                class="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-blue"
                :aria-controls="'library-prompt-content'"
                :aria-expanded="promptContentExpanded"
                @click="promptContentExpanded = !promptContentExpanded"
              >
                <ChevronUp v-if="promptContentExpanded" :size="14" stroke-width="1.5" aria-hidden="true" />
                <ChevronDown v-else :size="14" stroke-width="1.5" aria-hidden="true" />
                {{ promptContentExpanded ? t('library.collapseContent') : t('library.expandContent') }}
              </button>
            </section>
          </article>
        </div>
      </div>
    </section>
    <div v-else class="page-gutter pt-20"><div class="page-frame pb-20"><p class="font-mono text-sm uppercase tracking-[0.12em] text-muted-foreground">{{ t('library.notFound') }}</p></div></div>
    <StatusToast :visible="toast.visible" :message="toast.message" :type="toast.type" />
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check, ChevronDown, ChevronLeft, ChevronUp, Copy } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import StatusToast from '../components/StatusToast.vue'
import { getLibraryEntry } from '@library-index'

const { t } = useI18n()
const route = useRoute()
const pageRoot = ref(null)
const copied = ref(false)
const promptContentExpanded = ref(false)
const toast = reactive({ visible: false, message: '', type: 'success' })
let toastTimer
const entry = computed(() => getLibraryEntry(route.params.id))

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
})

onBeforeUnmount(() => clearTimeout(toastTimer))
</script>
