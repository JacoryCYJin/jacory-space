import { reactive } from 'vue'

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
      if (!response.ok) throw new Error(`下载生成皮肤失败（HTTP ${response.status}）。`)
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
        reject(new Error('生成的皮肤 PNG 无法读取。'))
      }
      image.src = objectUrl
    }))
}

export function useAiPartGeneration(project, { applyCandidate }) {
  const state = reactive({
    provider: 'monadical',
    prompt: '',
    previewFile: null,
    isGenerating: false,
    generationStatus: '',
    generationError: '',
    requestDiagnostic: null,
    proposalCanvas: null,
    proposalResult: null,
    proposalApplied: false,
    showProposal: true,
    previousOuterState: null
  })
  let requestController = null

  function selectedModel() {
    return project.state.model === 'slim' ? 'slim' : 'classic'
  }

  function setProvider(provider) {
    if (!['monadical', 'block'].includes(provider)) return
    state.provider = provider
    state.generationError = ''
    state.generationStatus = ''
    state.requestDiagnostic = null
  }

  function setPreviewFile(file) {
    state.generationError = ''
    if (!file) return
    if (!isSupportedPreviewFile(file)) {
      state.previewFile = null
      state.generationError = '请上传 PNG、JPG 或 WebP 格式的角色双视角预览图。'
      return
    }
    if (file.size > MAX_PREVIEW_SIZE) {
      state.previewFile = null
      state.generationError = '角色双视角预览图不能超过 20MB。'
      return
    }
    state.previewFile = file
  }

  function clearPreviewFile() {
    state.previewFile = null
  }

  function clearProposal({ restoreOuterState = true } = {}) {
    if (restoreOuterState && state.previousOuterState) {
      project.state.showOuterLayer = state.previousOuterState.showOuterLayer
      project.state.visibleOuterParts = state.previousOuterState.visibleOuterParts
      project.state.isCustomOuterPartsExpanded = state.previousOuterState.isCustomOuterPartsExpanded
    }
    state.proposalCanvas = null
    state.proposalResult = null
    state.proposalApplied = false
    state.showProposal = true
    state.previousOuterState = null
    project.actions.redraw()
  }

  function previewCandidate(canvas, result) {
    state.previousOuterState = {
      showOuterLayer: project.state.showOuterLayer,
      visibleOuterParts: [...project.state.visibleOuterParts],
      isCustomOuterPartsExpanded: project.state.isCustomOuterPartsExpanded
    }
    project.actions.selectAllOuterParts()
    project.state.showOuterLayer = true
    state.proposalCanvas = canvas
    state.proposalResult = result
    state.proposalApplied = false
    state.showProposal = true
    project.actions.redraw()
  }

  async function generate() {
    state.generationError = ''
    state.generationStatus = ''
    state.requestDiagnostic = null
    const isBlockProvider = state.provider === 'block'
    if (!isBlockProvider && !state.prompt.trim()) {
      state.generationError = '请先填写角色描述。'
      return
    }
    if (isBlockProvider && !state.previewFile) {
      state.generationError = '请先上传角色双视角预览图。'
      return
    }
    if (state.proposalCanvas) clearProposal()

    state.isGenerating = true
    state.generationStatus = isBlockProvider ? '正在上传角色双视角预览图…' : '正在连接本地 Minecraft 服务…'
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
        throw new Error(typeof detail === 'string' ? detail : '本地生成服务请求失败。')
      }
      if (payload?.model !== model || typeof payload?.skin_png_path !== 'string') {
        throw new Error('本地生成服务返回了无效的皮肤候选。')
      }
      state.requestDiagnostic = { status: response.status, provider: state.provider, model, id: payload.id, seed: payload.seed ?? null }
      state.generationStatus = '正在加载完整皮肤预览…'
      const candidateUrl = new URL(payload.skin_png_path, `${serviceUrl}/`).toString()
      const canvas = await loadCandidateCanvas(candidateUrl, requestController.signal)
      previewCandidate(canvas, { ...payload, candidateUrl })
    } catch (error) {
      if (error?.name === 'AbortError') state.generationError = '已停止生成。'
      else state.generationError = error instanceof Error ? error.message : '本地皮肤生成失败。'
    } finally {
      state.isGenerating = false
      state.generationStatus = ''
      requestController = null
    }
  }

  function applyProposal() {
    if (!state.proposalCanvas || state.proposalApplied || !state.proposalResult) return
    applyCandidate(state.proposalCanvas, state.proposalResult.model)
    clearProposal({ restoreOuterState: false })
  }

  function discardProposal() {
    if (!state.proposalCanvas) return
    clearProposal({ restoreOuterState: !state.proposalApplied })
  }

  function cancel() { requestController?.abort() }
  function dispose() { cancel() }

  return {
    state,
    actions: {
      applyProposal,
      cancel,
      clearPreviewFile,
      discardProposal,
      dispose,
      generate,
      setPreviewFile,
      setProvider
    }
  }
}
