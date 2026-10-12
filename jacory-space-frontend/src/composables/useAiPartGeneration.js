import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const DEFAULT_MONADICAL_SERVICE_URL = import.meta.env.VITE_MC_STUDIO_SERVICE_URL || 'http://127.0.0.1:8011'
const DEFAULT_BLOCK_SERVICE_URL = import.meta.env.VITE_MC_BLOCK_SERVICE_URL || 'http://127.0.0.1:8012'
const MAX_PREVIEW_SIZE = 20 * 1024 * 1024

function normalizeServiceUrl(value, fallback) {
  return String(value || fallback).trim().replace(/\/+$/, '')
}

function isSupportedPreviewFile(file) {
  return ['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || /\.(png|jpe?g|webp)$/i.test(file.name)
}

function loadCandidateCanvas(url, signal) {
  return fetch(url, { signal })
    .then(async (response) => {
      if (!response.ok) throw Object.assign(new Error('interface.ai.errors.download'), { params: { status: response.status } })
      return response.blob()
    })
    .then((blob) => new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(blob)
      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 64
        canvas.height = 64
        const context = canvas.getContext('2d', { willReadFrequently: true })
        context.imageSmoothingEnabled = false
        context.drawImage(image, 0, 0, 64, 64)
        URL.revokeObjectURL(objectUrl)
        resolve(canvas)
      }
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('interface.ai.errors.png'))
      }
      image.src = objectUrl
    }))
}

export function useAiPartGeneration(project, { applyCandidate, canRevertCandidate, revertCandidate }) {
  const { t, te } = useI18n()
  const state = reactive({
    provider: 'monadical',
    prompt: '',
    previewFile: null,
    isGenerating: false,
    generationStatus: '',
    generationError: '',
    generationDetail: '',
    generationErrorParams: {},
    requestDiagnostic: null,
    proposalCanvas: null,
    proposalResult: null,
    proposalApplied: false,
    appliedHistoryEntry: null
  })
  const generationErrorText = computed(() => state.generationError ? t(state.generationError, state.generationErrorParams) : '')
  const generationStatusText = computed(() => state.generationStatus ? t(state.generationStatus) : '')
  let requestController = null
  const canRevertProposal = computed(() => state.proposalApplied && state.appliedHistoryEntry && canRevertCandidate(state.appliedHistoryEntry))

  function selectedModel() {
    return project.state.previewModel === 'slim' ? 'slim' : 'classic'
  }

  function setProvider(provider) {
    if (!['monadical', 'block'].includes(provider)) return
    state.provider = provider
    state.generationError = ''
    state.generationDetail = ''
    state.generationErrorParams = {}
    state.generationStatus = ''
    state.requestDiagnostic = null
  }

  function setPreviewFile(file) {
    state.generationError = ''
    if (!file) return
    if (!isSupportedPreviewFile(file)) {
      state.previewFile = null
      state.generationError = 'interface.ai.errors.fileType'
      return
    }
    if (file.size > MAX_PREVIEW_SIZE) {
      state.previewFile = null
      state.generationError = 'interface.ai.errors.fileSize'
      return
    }
    state.previewFile = file
  }

  function clearPreviewFile() {
    state.previewFile = null
  }

  function clearProposal() {
    state.proposalCanvas = null
    state.proposalResult = null
    state.proposalApplied = false
    state.appliedHistoryEntry = null
  }

  function previewCandidate(canvas, result) {
    state.proposalCanvas = canvas
    state.proposalResult = result
    state.proposalApplied = false
  }

  async function generate() {
    state.generationError = ''
    state.generationStatus = ''
    state.requestDiagnostic = null
    const isBlockProvider = state.provider === 'block'
    if (!isBlockProvider && !state.prompt.trim()) {
      state.generationError = 'interface.ai.errors.prompt'
      return
    }
    if (isBlockProvider && !state.previewFile) {
      state.generationError = 'interface.ai.errors.preview'
      return
    }
    if (state.proposalResult) clearProposal()

    state.isGenerating = true
    state.generationStatus = isBlockProvider ? 'interface.ai.status.upload' : 'interface.ai.status.connect'
    requestController = new AbortController()
    const serviceUrl = normalizeServiceUrl(
      isBlockProvider ? import.meta.env.VITE_MC_BLOCK_SERVICE_URL : import.meta.env.VITE_MC_STUDIO_SERVICE_URL,
      isBlockProvider ? DEFAULT_BLOCK_SERVICE_URL : DEFAULT_MONADICAL_SERVICE_URL
    )
    const model = selectedModel()
    try {
      const request = isBlockProvider
        ? {
            body: (() => {
              const formData = new FormData()
              formData.append('preview', state.previewFile)
              formData.append('model', model)
              if (state.prompt.trim()) formData.append('prompt', state.prompt.trim())
              return formData
            })()
          }
        : {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: state.prompt.trim(), model })
          }
      const response = await fetch(`${serviceUrl}/generate`, {
        method: 'POST',
        signal: requestController.signal,
        ...request
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        const detail = payload?.detail || `HTTP ${response.status}`
        throw Object.assign(new Error('interface.ai.errors.service'), { detail: typeof detail === 'string' ? detail : JSON.stringify(detail) })
      }
      if (payload?.model !== model || typeof payload?.skin_png_path !== 'string') {
        throw new Error('interface.ai.errors.candidate')
      }
      state.requestDiagnostic = { status: response.status, provider: state.provider, model, id: payload.id, seed: payload.seed ?? null }
      state.generationStatus = 'interface.ai.status.load'
      const candidateUrl = new URL(payload.skin_png_path, `${serviceUrl}/`).toString()
      const canvas = await loadCandidateCanvas(candidateUrl, requestController.signal)
      previewCandidate(canvas, { ...payload, candidateUrl })
      applyProposal()
    } catch (error) {
      if (error?.name === 'AbortError') state.generationError = 'interface.ai.errors.cancelled'
      else {
        state.generationError = error instanceof Error && te(error.message) ? error.message : 'interface.ai.errors.failed'
        state.generationErrorParams = error?.params || {}
        state.generationDetail = error?.detail || (error instanceof Error && !te(error.message) ? error.message : '')
      }
    } finally {
      state.isGenerating = false
      state.generationStatus = ''
      requestController = null
    }
  }

  function applyProposal() {
    if (!state.proposalCanvas || state.proposalApplied || !state.proposalResult) return
    state.appliedHistoryEntry = applyCandidate(state.proposalCanvas, state.proposalResult.model)
    state.proposalCanvas = null
    state.proposalApplied = Boolean(state.appliedHistoryEntry)
  }

  function discardProposal() {
    if (!state.proposalCanvas && !state.proposalResult) return
    clearProposal()
  }

  function revertProposal() {
    if (!canRevertProposal.value) return
    if (revertCandidate(state.appliedHistoryEntry)) {
      state.proposalApplied = false
      state.appliedHistoryEntry = null
    }
  }

  function cancel() { requestController?.abort() }
  function dispose() { cancel() }

  return {
    state,
    canRevertProposal,
    generationErrorText,
    generationStatusText,
    actions: {
      applyProposal,
      cancel,
      clearPreviewFile,
      discardProposal,
      dispose,
      generate,
      revertProposal,
      setPreviewFile,
      setProvider
    }
  }
}
