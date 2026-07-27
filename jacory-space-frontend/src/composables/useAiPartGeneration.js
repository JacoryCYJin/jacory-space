import { computed, reactive } from 'vue'
import { applyPixelPartDesign, createPixelPartProposalCanvas, readPixelPartDesign, validatePixelPartDesign } from '../components/tools/minecraft-skin-editor/skin-part-generation'

const AI_CONNECTION_STORAGE_KEY = 'jacory-space.minecraft-skin-studio.ai-connection.v1'
const AI_MODEL_CATALOG_STORAGE_KEY = 'jacory-space.minecraft-skin-studio.ai-model-catalog.v1'
const DEFAULT_AI_MODEL = import.meta.env.VITE_MC_AI_MODEL || 'Qwen/Qwen3-Omni-30B-A3B-Instruct'
const PREVIOUS_DEFAULT_AI_MODEL = 'Qwen/Qwen3-VL-8B-Instruct'
const MAX_CACHED_MODELS = 500
const PIXEL_PART_SYSTEM_PROMPT = `You are a Minecraft skin pixel artist. You own every pixel of one requested body part; the application will not add templates, borders, folds, shading, or patterns after your response.

Generate a complete, coherent texture for the player's right arm in the Classic 4-pixel-wide model. The design must describe one wearable object across all six faces and two layers. Base is the underlying garment; outer is the raised Minecraft overlay. Use outer transparency deliberately to make volume, hems, folds, openings, or accents. Do not modify any other body part.

Return JSON only. Its exact shape is:
{
  "version": 1,
  "part": "rightArm",
  "model": "classic",
  "palette": { "0": "#RRGGBBAA", "1": "#RRGGBB" },
  "layers": {
    "base": { "top": ["1111"], "bottom": ["1111"], "right": ["1111"], "front": ["1111"], "left": ["1111"], "back": ["1111"] },
    "outer": { "top": ["0000"], "bottom": ["0000"], "right": ["0000"], "front": ["0000"], "left": ["0000"], "back": ["0000"] }
  }
}

Palette keys are one uppercase letter or digit. Colors are #RRGGBB or #RRGGBBAA. top and bottom are exactly four strings of four palette keys. right, front, left, and back are exactly twelve strings of four palette keys. Every base-layer pixel is opaque. Every face must be supplied. Use at least three opaque colors and make lighting, seams, folds, and cuffs follow the garment's form across adjacent faces. Do not return operations, prose, Markdown, a rendered image, or an atlas.`

export function useAiPartGeneration(project, { capturePreview, t }) {
  const state = reactive({
    prompt: '',
    useVision: true,
    referenceImage: '',
    apiKey: '',
    baseUrl: import.meta.env.VITE_MC_AI_BASE_URL || '',
    model: DEFAULT_AI_MODEL,
    modelCatalog: [],
    connectionTest: null,
    savedConnection: null,
    isTestingConnection: false,
    isGenerating: false,
    generationStatus: '',
    generationError: '',
    requestDiagnostic: null,
    proposalCanvas: null,
    proposalPlan: null,
    proposalResult: null,
    proposalApplied: false,
    showProposal: true,
    previousOuterParts: null,
    toastVisible: false,
    toastMessage: ''
  })
  let requestController = null
  let toastTimer

  const connectionConfigured = computed(() => Boolean(state.apiKey.trim() && state.baseUrl.trim() && state.model.trim()))
  const connectionDirty = computed(() => JSON.stringify(currentConnection()) !== JSON.stringify(state.savedConnection))
  const connectionStatus = computed(() => {
    if (!connectionConfigured.value) return { label: t('minecraftSkin.aiConnectionNotConfigured'), className: 'text-haze', showDot: false }
    if (state.connectionTest?.state === 'success') return { label: t('minecraftSkin.aiConnectionConnected'), className: 'text-blue', showDot: true }
    if (state.connectionTest?.state === 'error') return { label: t('minecraftSkin.aiConnectionFailed'), className: 'text-destructive', showDot: false }
    if (connectionDirty.value) return { label: t('minecraftSkin.aiConnectionUnsaved'), className: 'text-muted-foreground', showDot: false }
    return { label: state.savedConnection ? t('minecraftSkin.aiConnectionSaved') : t('minecraftSkin.aiConnectionConfigured'), className: 'text-blue', showDot: Boolean(state.savedConnection) }
  })

  function normalizeBaseUrl(baseUrl) {
    return baseUrl.trim().replace(/\/+$/, '').replace(/\/chat\/completions$/, '').replace(/\/models$/, '')
  }

  function endpoint() { return `${normalizeBaseUrl(state.baseUrl)}/chat/completions` }
  function modelsEndpoint() { return `${normalizeBaseUrl(state.baseUrl)}/models` }
  function currentConnection() { return { apiKey: state.apiKey.trim(), baseUrl: state.baseUrl.trim(), model: state.model.trim() } }

  function restoreConnectionCache() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(AI_CONNECTION_STORAGE_KEY) || 'null')
      if (!saved || typeof saved.apiKey !== 'string' || typeof saved.baseUrl !== 'string' || typeof saved.model !== 'string') return
      const connection = { ...saved, model: saved.model === PREVIOUS_DEFAULT_AI_MODEL ? DEFAULT_AI_MODEL : saved.model }
      if (connection.model !== saved.model) window.localStorage.setItem(AI_CONNECTION_STORAGE_KEY, JSON.stringify(connection))
      state.apiKey = connection.apiKey
      state.baseUrl = connection.baseUrl
      state.model = connection.model
      state.savedConnection = connection
    } catch {
      // AI settings are optional when storage is unavailable.
    }
  }

  function restoreModelCatalog() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(AI_MODEL_CATALOG_STORAGE_KEY) || 'null')
      state.modelCatalog = saved && normalizeBaseUrl(saved.baseUrl || '') === normalizeBaseUrl(state.baseUrl) && Array.isArray(saved.models)
        ? saved.models.filter((modelId) => typeof modelId === 'string' && modelId.trim()).slice(0, MAX_CACHED_MODELS)
        : []
    } catch {
      state.modelCatalog = []
    }
  }

  function saveModelCatalog(models) {
    const normalizedModels = [...new Set(models.filter((modelId) => typeof modelId === 'string' && modelId.trim()))].sort((a, b) => a.localeCompare(b)).slice(0, MAX_CACHED_MODELS)
    state.modelCatalog = normalizedModels
    try {
      window.localStorage.setItem(AI_MODEL_CATALOG_STORAGE_KEY, JSON.stringify({ baseUrl: normalizeBaseUrl(state.baseUrl), models: normalizedModels, testedAt: new Date().toISOString() }))
    } catch {
      // The model catalog is a convenience only.
    }
  }

  function saveConnectionSettings() {
    if (!connectionConfigured.value) {
      state.connectionTest = { state: 'error', message: t('minecraftSkin.aiConfigRequired') }
      return
    }
    try {
      const connection = currentConnection()
      window.localStorage.setItem(AI_CONNECTION_STORAGE_KEY, JSON.stringify(connection))
      state.savedConnection = connection
      showToast(t('minecraftSkin.aiConnectionSavedNotice'))
    } catch {
      state.connectionTest = { state: 'error', message: t('minecraftSkin.aiConnectionSaveFailed') }
    }
  }

  function showToast(message) {
    window.clearTimeout(toastTimer)
    state.toastVisible = false
    state.toastMessage = message
    window.requestAnimationFrame(() => {
      state.toastVisible = true
      toastTimer = window.setTimeout(() => { state.toastVisible = false }, 2800)
    })
  }

  function isVisionModel(modelName) { return /(?:vl|vision|omni|glm-[\d.]+v|deepseek[-_]?vl|step3)/i.test(modelName) }
  function supportsJsonMode(modelName) { return !isVisionModel(modelName) || /^Qwen\/Qwen3-VL-/i.test(modelName) }
  function sanitizeDetail(value) { return String(value || '').replace(/Bearer\s+\S+/gi, 'Bearer [redacted]').replace(/sk-[\w-]+/gi, '[redacted]').replace(/\s+/g, ' ').slice(0, 180) }

  function recordDiagnostic(partial) {
    state.requestDiagnostic = { model: state.model.trim(), ...state.requestDiagnostic, ...partial }
  }

  async function testConnection() {
    state.connectionTest = null
    if (!state.apiKey.trim()) {
      state.connectionTest = { state: 'error', message: t('minecraftSkin.aiApiKeyRequired') }
      return
    }
    if (!state.baseUrl.trim() || !state.model.trim()) {
      state.connectionTest = { state: 'error', message: t('minecraftSkin.aiConfigRequired') }
      return
    }
    state.isTestingConnection = true
    try {
      const response = await fetch(modelsEndpoint(), { headers: { Authorization: `Bearer ${state.apiKey.trim()}` } })
      const traceId = response.headers.get('x-siliconcloud-trace-id') || ''
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        const providerError = payload?.error || payload || {}
        const detail = providerError.message || payload?.message || `HTTP ${response.status}`
        state.connectionTest = { state: 'error', message: t('minecraftSkin.aiConnectionTestFailed', { detail: sanitizeDetail(detail) }) }
        recordDiagnostic({ status: response.status, traceId, code: providerError.code || providerError.type || 'connection_test_failed', detail: sanitizeDetail(detail) })
        return
      }
      const modelIds = Array.isArray(payload?.data) ? payload.data.map((entry) => entry?.id).filter(Boolean) : []
      saveModelCatalog(modelIds)
      const modelFound = modelIds.includes(state.model.trim())
      state.connectionTest = { state: modelFound ? 'success' : 'error', message: modelFound ? '' : t('minecraftSkin.aiConnectionTestModelMissing') }
      if (modelFound) showToast(t('minecraftSkin.aiConnectionTestSuccess'))
      recordDiagnostic({ status: response.status, traceId, code: modelFound ? 'connection_test_passed' : 'connection_test_model_missing', detail: `Loaded ${modelIds.length} models from /models.` })
    } catch (error) {
      const detail = sanitizeDetail(error instanceof Error ? error.message : String(error))
      state.connectionTest = { state: 'error', message: t('minecraftSkin.aiConnectionTestFailed', { detail }) }
      recordDiagnostic({ status: 'network', code: 'connection_test_network_error', detail })
    } finally {
      state.isTestingConnection = false
    }
  }

  function buildUserContent() {
    const sourceCanvas = state.proposalCanvas || project.state.skinCanvas
    const text = JSON.stringify({
      request: state.prompt.trim(),
      target: { part: 'rightArm', model: 'classic', layers: ['base', 'outer'], goal: 'Design the entire right-arm garment as coherent pixel art. Return a replacement texture for this part only.' },
      currentRightArm: readPixelPartDesign(sourceCanvas, 'rightArm', 'classic'),
      revision: state.proposalCanvas ? 'This is a refinement request. Replace the current right arm according to the new request.' : 'This is the first generation request.'
    })
    if (!state.useVision) return text
    const content = [{ type: 'text', text }]
    const preview = capturePreview()
    if (preview) content.push({ type: 'image_url', image_url: { url: preview, detail: 'low' } })
    if (sourceCanvas) content.push({ type: 'image_url', image_url: { url: sourceCanvas.toDataURL('image/png'), detail: 'low' } })
    if (state.referenceImage) content.push({ type: 'image_url', image_url: { url: state.referenceImage, detail: 'low' } })
    return content
  }

  function createRequestPayload(modelName, messages) {
    return { model: modelName, temperature: 0.35, max_tokens: 8192, stream: false, ...(supportsJsonMode(modelName) ? { response_format: { type: 'json_object' } } : {}), messages }
  }

  async function requestContent(stage, modelName, messages) {
    const requestPayload = createRequestPayload(modelName, messages)
    const response = await fetch(endpoint(), {
      method: 'POST', signal: requestController.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.apiKey.trim()}` },
      body: JSON.stringify(requestPayload)
    })
    const traceId = response.headers.get('x-siliconcloud-trace-id') || ''
    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      const providerError = payload?.error || payload || {}
      const detail = providerError.message || payload?.message || `HTTP ${response.status}`
      recordDiagnostic({ status: response.status, traceId, code: providerError.code || providerError.type || 'request_failed', detail: sanitizeDetail(detail) })
      throw new Error(detail)
    }
    state.generationStatus = t('minecraftSkin.aiWaitingResponse')
    const payload = await response.json().catch(() => null)
    const choice = payload?.choices?.[0] || {}
    const message = choice.message || {}
    const content = typeof message.content === 'string' ? message.content.trim() : ''
    const reasoning = typeof message.reasoning_content === 'string' ? message.reasoning_content.trim() : ''
    if (choice.finish_reason === 'length') throw new Error('AI response was truncated because it reached the output limit.')
    if (!content) throw new Error(reasoning ? 'AI response contained reasoning but no final pixel design.' : 'AI response did not contain a pixel design.')
    recordDiagnostic({ status: response.status, traceId, code: 'response_complete', detail: `${stage} JSON response; final content ${content.length} characters.` })
    return content
  }

  function decodeDesign(content) {
    const design = JSON.parse(content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''))
    const validation = validatePixelPartDesign(design, { expectedPart: 'rightArm' })
    if (!validation.valid) throw new Error(validation.errors.join('; '))
    return design
  }

  function previewDesign(design) {
    const proposal = createPixelPartProposalCanvas(project.state.skinCanvas, design, { expectedPart: 'rightArm' })
    if (!state.proposalCanvas) state.previousOuterParts = [...project.state.visibleOuterParts]
    project.state.visibleOuterParts = [...new Set([...project.state.visibleOuterParts, 'rightArm'])]
    project.state.showOuterLayer = true
    state.proposalCanvas = proposal.canvas
    state.proposalPlan = design
    state.proposalResult = proposal
    state.proposalApplied = false
    state.showProposal = true
    project.actions.redraw()
  }

  function formatGenerationError(error) {
    const message = error instanceof Error ? error.message : String(error || '')
    if (/not a vlm|vision language model|text-only prompts/i.test(message)) return t('minecraftSkin.aiVisionUnsupported')
    if (/truncated|output limit/i.test(message)) return t('minecraftSkin.aiPlanTruncated')
    if (/reasoning but no final|did not contain a pixel design/i.test(message)) return t('minecraftSkin.pixelGenerationNoContent')
    if (/json|design|palette|layers|face|row|pixel/i.test(message)) return t('minecraftSkin.pixelGenerationInvalid')
    return t('minecraftSkin.aiGenerationFailed')
  }

  async function generate() {
    state.generationError = ''
    state.generationStatus = ''
    state.requestDiagnostic = null
    if (!state.prompt.trim()) { state.generationError = t('minecraftSkin.aiPromptRequired'); return }
    if (!state.apiKey.trim()) { state.generationError = t('minecraftSkin.aiApiKeyRequired'); return }
    if (!state.baseUrl.trim() || !state.model.trim()) { state.generationError = t('minecraftSkin.aiConfigRequired'); return }
    if (project.state.model !== 'classic') { state.generationError = t('minecraftSkin.pixelGenerationClassicOnly'); return }
    if (state.useVision && !isVisionModel(state.model.trim())) { state.generationError = t('minecraftSkin.aiVisionUnsupported'); return }
    state.isGenerating = true
    state.generationStatus = t('minecraftSkin.aiConnecting')
    requestController = new AbortController()
    try {
      const modelName = state.model.trim()
      const messages = [{ role: 'system', content: PIXEL_PART_SYSTEM_PROMPT }, { role: 'user', content: buildUserContent() }]
      const content = await requestContent('Initial', modelName, messages)
      let design
      try {
        design = decodeDesign(content)
      } catch (error) {
        state.generationStatus = t('minecraftSkin.pixelGenerationRepairing')
        const repaired = await requestContent('Repair', modelName, [
          { role: 'system', content: PIXEL_PART_SYSTEM_PROMPT },
          { role: 'user', content: JSON.stringify({ task: 'Repair the invalid JSON below. Keep the requested right-arm design, but return a complete valid pixel design matching the system schema exactly.', validationError: error instanceof Error ? error.message : String(error), invalidResponse: content }) }
        ])
        design = decodeDesign(repaired)
      }
      previewDesign(design)
    } catch (error) {
      if (error?.name === 'AbortError') state.generationError = t('minecraftSkin.aiCancelled')
      else if (error instanceof TypeError) {
        recordDiagnostic({ status: 'network', code: 'network_error', detail: sanitizeDetail(error.message) })
        state.generationError = t('minecraftSkin.aiNetworkError')
      } else {
        if (!state.requestDiagnostic) recordDiagnostic({ status: 'client', code: 'client_error', detail: sanitizeDetail(error?.message) })
        state.generationError = formatGenerationError(error)
      }
    } finally {
      state.isGenerating = false
      state.generationStatus = ''
      requestController = null
    }
  }

  function discardProposal() {
    state.proposalCanvas = null
    state.proposalPlan = null
    state.proposalResult = null
    state.proposalApplied = false
    project.state.visibleOuterParts = state.previousOuterParts || []
    state.previousOuterParts = null
    state.showProposal = false
    project.actions.redraw()
  }

  function applyProposal() {
    if (!state.proposalPlan || state.proposalApplied) return
    state.generationError = ''
    try {
      applyPixelPartDesign(project.state.skinCanvas, state.proposalPlan, { expectedPart: 'rightArm' })
      state.proposalApplied = true
      state.showProposal = true
      project.actions.redraw()
    } catch (error) {
      state.generationError = error instanceof Error ? error.message : String(error)
    }
  }

  function selectReferenceImage(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { state.referenceImage = typeof reader.result === 'string' ? reader.result : '' }
    reader.readAsDataURL(file)
  }

  function cancel() { requestController?.abort() }
  function dispose() { cancel(); window.clearTimeout(toastTimer) }

  return {
    state,
    connectionStatus,
    actions: { applyProposal, cancel, discardProposal, dispose, generate, restoreConnectionCache, restoreModelCatalog, saveConnectionSettings, selectReferenceImage, testConnection }
  }
}
