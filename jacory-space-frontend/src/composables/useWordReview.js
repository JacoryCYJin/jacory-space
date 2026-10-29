import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  STORAGE_KEY, answerWord, createSession, isBatch, markedIds,
  previousWord, repeatSession, restoreSession, startSession,
} from '../lib/word-review/session.js'

const ERROR_CODES = new Set(['NOT_CONFIGURED', 'AUTH_REQUIRED', 'SOURCE_ACCESS', 'SOURCE_BUSY', 'SOURCE_FORMAT', 'SOURCE_UNAVAILABLE', 'FORBIDDEN'])

export function useWordReview() {
  const session = ref(null)
  const screen = ref('home')
  const revealed = ref(false)
  const choice = ref(null)
  const accessKey = ref('')
  const loading = ref(false)
  const error = ref('')
  const storageWarning = ref(false)
  const confirmReload = ref(false)
  let controller
  let mounted = false

  const batch = computed(() => session.value?.batch)
  const current = computed(() => {
    const state = session.value
    return state?.batch.words.find(word => word.id === state.queue[state.answers.length])
  })
  const marked = computed(() => session.value ? markedIds(session.value) : [])
  const hasProgress = computed(() => session.value?.stage === 'review' || session.value?.stage === 'complete')

  function persist() {
    if (!mounted) return
    try {
      if (session.value) localStorage.setItem(STORAGE_KEY, JSON.stringify(session.value))
      else localStorage.removeItem(STORAGE_KEY)
    } catch { storageWarning.value = true }
  }

  async function loadBatch(confirmed = false) {
    if (loading.value) return
    if (hasProgress.value && !confirmed) { confirmReload.value = true; return }
    loading.value = true
    error.value = ''
    confirmReload.value = false
    controller = new AbortController()
    const timeout = setTimeout(() => controller?.abort(), 60000)
    try {
      const response = await fetch('/api/word-review', {
        method: 'GET', cache: 'no-store',
        headers: accessKey.value ? { Authorization: `Bearer ${accessKey.value}` } : {},
        signal: controller.signal,
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(ERROR_CODES.has(data?.error) ? data.error : 'SOURCE_UNAVAILABLE')
      if (!isBatch(data)) throw new Error('SOURCE_FORMAT')
      if (!mounted) return
      session.value = createSession(data, {
        avoidFirstId: session.value?.queue[session.value.answers.length] || session.value?.queue[0],
      })
      revealed.value = false
      choice.value = null
      screen.value = 'home'
    } catch (cause) {
      if (mounted) error.value = ERROR_CODES.has(cause.message) ? cause.message : 'SOURCE_UNAVAILABLE'
    } finally {
      clearTimeout(timeout)
      if (mounted) loading.value = false
    }
  }

  function start() {
    if (!session.value || !batch.value.words.length) return
    if (session.value.stage === 'ready') session.value = startSession(session.value)
    revealed.value = false
    choice.value = null
    screen.value = session.value.stage === 'complete' ? 'complete' : 'review'
  }

  function choose(value) {
    if (session.value?.stage !== 'review' || revealed.value || !['clear', 'unclear'].includes(value)) return
    choice.value = value
    revealed.value = true
  }

  function answer(wrong = false) {
    if (!revealed.value || !session.value) return
    session.value = answerWord(session.value, wrong || choice.value === 'unclear')
    revealed.value = false
    choice.value = null
    screen.value = session.value.stage === 'complete' ? 'complete' : 'review'
  }

  function previous() {
    if (!session.value?.answers.length) return
    session.value = previousWord(session.value)
    revealed.value = false
    choice.value = null
    screen.value = 'review'
  }

  function repeat(onlyMarked = false) {
    session.value = repeatSession(session.value, onlyMarked)
    revealed.value = false
    choice.value = null
    screen.value = 'review'
  }

  function pause() { screen.value = 'home'; revealed.value = false; choice.value = null }
  function finish() {
    // Keep the loaded words available, but discard this session's marks/progress.
    session.value = createSession(batch.value, { avoidFirstId: session.value.queue[0] })
    screen.value = 'home'
    revealed.value = false
    choice.value = null
  }

  onMounted(() => {
    mounted = true
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        session.value = restoreSession(raw)
        if (!session.value) localStorage.removeItem(STORAGE_KEY)
      }
    } catch { storageWarning.value = true }
  })
  watch(session, persist, { flush: 'sync' })
  onBeforeUnmount(() => { mounted = false; controller?.abort(); accessKey.value = '' })

  return {
    session, screen, revealed, choice, accessKey, loading, error, storageWarning,
    confirmReload, batch, current, marked, hasProgress,
    loadBatch, start, choose, answer, previous, repeat, pause, finish,
  }
}
