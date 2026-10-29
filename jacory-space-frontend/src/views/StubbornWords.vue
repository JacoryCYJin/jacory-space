<template>
  <main class="grain min-h-screen bg-background pb-12 pt-28 text-foreground">
    <div class="page-gutter mx-auto max-w-screen-2xl">
      <p v-if="storageWarning" role="status" class="mt-6 border-l border-blue pl-4 text-sm leading-relaxed text-muted-foreground">{{ t('words.storageWarning') }}</p>

      <section v-if="screen === 'home'" class="grid gap-12 py-12 md:py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-24">
        <div class="min-w-0">
          <p class="font-mono text-xs tracking-[0.18em] text-blue">{{ t('words.kicker') }}</p>
          <h1 class="mt-6 break-words text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl">{{ t('words.title') }}</h1>
          <p class="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">{{ t('words.description') }}</p>
          <div class="mt-12 flex items-baseline gap-4 border-b border-t border-line py-8">
            <span class="font-mono text-6xl tracking-tight">{{ batch ? pad(batch.words.length) : '—' }}</span>
            <div class="text-sm leading-relaxed text-muted-foreground">
              <p>{{ t('words.batchCount') }}</p>
              <p v-if="batch" class="mt-2 text-xs">{{ t('words.loadedAt', { time: formatTime(batch.loadedAt) }) }}</p>
            </div>
          </div>
          <p v-if="batch && !batch.words.length" role="status" class="mt-6 text-sm leading-relaxed text-muted-foreground">{{ t('words.empty') }}</p>
          <p v-if="hasProgress" class="mt-6 text-sm text-muted-foreground">{{ t('words.savedProgress', { done: session.answers.length, total: session.queue.length }) }}</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <button v-if="batch?.words.length" type="button" :disabled="loading" class="inline-flex min-h-12 items-center justify-center gap-4 bg-foreground px-6 text-sm text-background disabled:opacity-40" @click="start">{{ t(hasProgress ? 'words.resume' : 'words.start') }}<ArrowRight :size="16" aria-hidden="true" /></button>
            <button type="button" :disabled="loading" class="inline-flex min-h-12 items-center justify-center gap-3 border border-line px-5 text-sm hover:border-foreground disabled:opacity-40" @click="loadBatch()"><RefreshCw :size="15" :class="loading ? 'motion-safe:animate-spin' : ''" aria-hidden="true" />{{ t(loading ? 'words.loading' : batch ? 'words.reload' : 'words.load') }}</button>
          </div>
          <div v-if="confirmReload" role="group" :aria-label="t('words.replaceTitle')" class="mt-6 border-l border-blue pl-4">
            <p class="max-w-lg text-sm leading-relaxed">{{ t('words.replaceMessage') }}</p>
            <div class="mt-3 flex gap-5"><button type="button" class="min-h-11 text-sm text-blue" @click="loadBatch(true)">{{ t('words.replaceConfirm') }}</button><button type="button" class="min-h-11 text-sm text-muted-foreground" @click="confirmReload = false">{{ t('words.cancel') }}</button></div>
          </div>
          <p v-if="error" role="alert" class="mt-6 max-w-lg border-l border-blue pl-4 text-sm leading-relaxed">{{ t(`words.errors.${error}`) }}</p>
        </div>

        <aside class="self-start border-t border-line pt-6 lg:mt-1">
          <p class="font-mono text-xs tracking-[0.18em] text-muted-foreground">{{ t('words.sourceLabel') }}</p>
          <p class="mt-5 text-xl">Notion <span class="text-haze">/</span> {{ batch?.viewName || t('words.viewName') }}</p>
          <p class="mt-4 text-sm leading-relaxed text-muted-foreground">{{ t('words.sourceDescription') }}</p>
          <ol class="mt-9 space-y-5 border-t border-line pt-6 text-sm">
            <li class="flex gap-4"><span class="font-mono text-xs text-haze">01</span>{{ t('words.stepRecall') }}</li>
            <li class="flex gap-4"><span class="font-mono text-xs text-haze">02</span>{{ t('words.stepReveal') }}</li>
            <li class="flex gap-4"><span class="font-mono text-xs text-haze">03</span>{{ t('words.stepRepeat') }}</li>
          </ol>
          <form class="mt-10 border-t border-line pt-6" @submit.prevent="loadBatch()">
            <label for="word-review-key" class="text-sm">{{ t('words.accessKey') }}</label>
            <input id="word-review-key" v-model="accessKey" type="password" autocomplete="off" :placeholder="t('words.keyPlaceholder')" class="mt-3 min-h-12 w-full border-b border-line bg-transparent px-1 text-base outline-none focus:border-blue" />
            <p class="mt-3 text-xs leading-relaxed text-muted-foreground">{{ t('words.keyHint') }}</p>
            <button type="submit" :disabled="loading" class="mt-3 min-h-11 text-sm text-blue disabled:opacity-40">{{ t('words.connect') }}<ArrowUpRight :size="14" class="ml-1 inline" aria-hidden="true" /></button>
          </form>
        </aside>
      </section>

      <section v-else-if="screen === 'review' && current" class="mx-auto max-w-4xl pt-8 md:pt-12" :aria-label="t('words.reviewLabel')">
        <div class="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <span class="font-mono">{{ pad(session.answers.length + 1) }} / {{ pad(session.queue.length) }}</span>
          <span>{{ t('words.round', { count: session.round }) }}</span>
          <button type="button" class="inline-flex min-h-11 items-center gap-2 text-sm hover:text-blue" @click="pause"><Pause :size="14" aria-hidden="true" />{{ t('words.pause') }}</button>
        </div>
        <progress class="word-progress mt-2 block h-px w-full" :value="session.answers.length" :max="session.queue.length" :aria-label="t('words.progress')" />
        <article class="flex min-h-[45svh] flex-col justify-center py-12 md:min-h-[50svh] md:py-16">
          <p class="mb-5 font-mono text-xs tracking-[0.18em] text-muted-foreground">{{ t('words.recallLabel') }}</p>
          <h1 ref="wordHeading" tabindex="-1" lang="en" class="break-words text-5xl font-medium leading-tight tracking-tight outline-none sm:text-6xl md:text-7xl">{{ current.word }}</h1>
          <div v-if="revealed" class="mt-8 border-t border-line pt-7" aria-live="polite">
            <div v-if="current.meaning.some(part => part.text.trim())" lang="zh-CN" class="space-y-2 whitespace-pre-wrap break-words text-xl leading-relaxed md:text-2xl"><p v-for="(line, lineIndex) in definitionLines" :key="lineIndex"><template v-for="(part, index) in line" :key="index"><strong v-if="part.bold" class="font-semibold">{{ part.text }}</strong><span v-else>{{ part.text }}</span></template></p></div>
            <p v-else class="text-base text-muted-foreground">{{ t('words.missingMeaning') }}</p>
          </div>
          <p v-else class="mt-8 text-base text-muted-foreground">{{ t('words.recallHint') }}</p>
        </article>
        <div class="border-t border-line pt-6">
          <div v-if="!revealed" class="grid grid-cols-2 gap-3" role="group" :aria-label="t('words.recallChoice')">
            <button type="button" class="min-h-14 bg-foreground px-3 text-base text-background" @click="choose('clear')">{{ t('words.rememberClear') }}</button>
            <button type="button" class="min-h-14 border border-line px-3 text-base hover:border-foreground" @click="choose('unclear')">{{ t('words.rememberUnclear') }}</button>
          </div>
          <div v-else class="grid gap-3" :class="choice === 'clear' ? 'grid-cols-2' : 'grid-cols-1'">
            <button v-if="choice === 'clear'" type="button" class="flex min-h-14 items-center justify-center gap-2 border border-line px-3 text-base hover:border-foreground" @click="respond(true)"><RotateCcw :size="16" aria-hidden="true" />{{ t('words.wrong') }}</button>
            <button type="button" class="flex min-h-14 items-center justify-center gap-3 bg-foreground px-3 text-base text-background" @click="respond(false)">{{ t('words.next') }}<ArrowRight :size="16" aria-hidden="true" /></button>
          </div>
          <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <button type="button" :disabled="!session.answers.length" class="inline-flex min-h-11 items-center gap-2 text-sm hover:text-blue disabled:opacity-30" @click="goPrevious"><ArrowLeft :size="14" aria-hidden="true" />{{ t('words.previous') }}</button>
            <span>{{ t('words.markedCount', { count: marked.length }) }}</span>
          </div>
          <p class="mt-4 hidden text-center font-mono text-xs text-haze md:block">{{ t('words.shortcuts') }}</p>
        </div>
      </section>

      <section v-else-if="screen === 'complete'" class="mx-auto max-w-3xl py-16 md:py-24">
        <p class="font-mono text-xs tracking-[0.18em] text-blue">{{ t('words.completeKicker') }}</p>
        <h1 ref="completionHeading" tabindex="-1" class="mt-6 text-4xl font-medium tracking-tight outline-none md:text-6xl">{{ t('words.completeTitle') }}</h1>
        <p class="mt-6 text-base leading-relaxed text-muted-foreground">{{ t('words.completeMessage', { total: session.queue.length, marked: marked.length }) }}</p>
        <div v-if="marked.length" class="mt-10 border-b border-t border-line py-6">
          <p class="text-xs text-muted-foreground">{{ t('words.markedLabel') }}</p>
          <ul class="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-lg"><li v-for="id in marked" :key="id" lang="en">{{ batch.words.find(word => word.id === id)?.word }}</li></ul>
        </div>
        <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button v-if="marked.length" type="button" class="inline-flex min-h-12 items-center justify-center gap-3 bg-foreground px-6 text-sm text-background" @click="repeat(true)"><RotateCcw :size="16" aria-hidden="true" />{{ t('words.repeatMarked') }}</button>
          <button type="button" class="min-h-12 border border-line px-6 text-sm hover:border-foreground" @click="repeat(false)">{{ t('words.repeatAll') }}</button>
          <button type="button" class="min-h-12 px-5 text-sm text-muted-foreground hover:text-blue" @click="finish">{{ t('words.finish') }}</button>
        </div>
        <button type="button" class="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-blue" @click="goPrevious"><ArrowLeft :size="14" aria-hidden="true" />{{ t('words.previous') }}</button>
      </section>

    </div>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, RefreshCw, RotateCcw } from 'lucide-vue-next'
import { useWordReview } from '../composables/useWordReview.js'
import { meaningLines } from '../lib/word-review/meaning.js'

const { t, locale } = useI18n()
const {
  session, screen, revealed, choice, accessKey, loading, error, storageWarning,
  confirmReload, batch, current, marked, hasProgress,
  loadBatch, start, choose, answer, previous, repeat, pause, finish,
} = useWordReview()
const wordHeading = ref(null)
const completionHeading = ref(null)
const definitionLines = computed(() => meaningLines(current.value?.meaning || []))
const pad = value => String(value).padStart(2, '0')
const formatTime = value => new Intl.DateTimeFormat(locale.value, { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
function respond(again) { answer(again) }
function goPrevious() { previous() }

watch(() => [screen.value, current.value?.id], async () => {
  await nextTick()
  if (screen.value === 'review') wordHeading.value?.focus({ preventScroll: true })
  if (screen.value === 'complete') completionHeading.value?.focus({ preventScroll: true })
})

function keydown(event) {
  if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || screen.value !== 'review') return
  if (event.target instanceof Element && event.target.closest('input, textarea, select, button, a, [contenteditable="true"]')) return
  if (event.code === 'Digit1' && !revealed.value) { event.preventDefault(); choose('clear') }
  if (event.code === 'Digit2' && !revealed.value) { event.preventDefault(); choose('unclear') }
  if (event.code === 'ArrowRight' && revealed.value) { event.preventDefault(); answer(false) }
  if (event.code === 'KeyR' && revealed.value && choice.value === 'clear') { event.preventDefault(); answer(true) }
  if (event.code === 'ArrowLeft') { event.preventDefault(); previous() }
}
onMounted(() => window.addEventListener('keydown', keydown))
onBeforeUnmount(() => window.removeEventListener('keydown', keydown))
</script>

<style scoped>
.word-progress { appearance: none; border: 0; background: var(--line); color: var(--blue); }
.word-progress::-webkit-progress-bar { background: var(--line); }
.word-progress::-webkit-progress-value { background: var(--blue); }
.word-progress::-moz-progress-bar { background: var(--blue); }
</style>
