import { reactive } from 'vue'
import { createSkinCanvas, downloadCanvas, importSkinFile } from '../components/tools/minecraft-skin-editor/skin-core'

const STORAGE_KEY = 'jacory-space.minecraft-skin-studio.project.v1'
export const SKIN_PART_IDS = ['head', 'body', 'rightArm', 'leftArm', 'rightLeg', 'leftLeg']

export function useSkinEditorProject() {
  const state = reactive({
    skinCanvas: null,
    textureVersion: 0,
    model: 'classic',
    activeLayer: 'base',
    activeTool: 'brush',
    brushColor: '#0e66c8',
    brushOpacity: 1,
    mirrorEnabled: false,
    showOuterLayer: false,
    visibleOuterParts: [],
    isCustomOuterPartsExpanded: false,
    previewError: ''
  })
  let saveTimer

  const allOuterPartsSelected = () => SKIN_PART_IDS.every((part) => state.visibleOuterParts.includes(part))

  function redraw() {
    state.textureVersion += 1
    scheduleProjectSave()
  }

  function toggleOuterPart(partName) {
    state.visibleOuterParts = state.visibleOuterParts.includes(partName)
      ? state.visibleOuterParts.filter((part) => part !== partName)
      : [...state.visibleOuterParts, partName]
    state.isCustomOuterPartsExpanded = !allOuterPartsSelected()
    state.textureVersion += 1
  }

  function selectAllOuterParts() {
    state.visibleOuterParts = [...SKIN_PART_IDS]
    state.isCustomOuterPartsExpanded = false
    state.textureVersion += 1
  }

  function setOuterLayerDisplay(visible) {
    if (visible && state.visibleOuterParts.length === 0) selectAllOuterParts()
    state.showOuterLayer = visible
    state.textureVersion += 1
  }

  function resetOuterLayerForImportedSkin() {
    state.visibleOuterParts = [...SKIN_PART_IDS]
    state.isCustomOuterPartsExpanded = false
    state.showOuterLayer = true
    state.textureVersion += 1
  }

  function restoreProject() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
      return saved?.skin && typeof saved.skin === 'string' ? saved : null
    } catch {
      return null
    }
  }

  function saveProject() {
    if (!state.skinCanvas) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        skin: state.skinCanvas.toDataURL('image/png'),
        model: state.model,
        activeLayer: state.activeLayer,
        brushColor: state.brushColor,
        brushOpacity: state.brushOpacity,
        mirrorEnabled: state.mirrorEnabled,
        showOuterLayer: state.showOuterLayer,
        visibleOuterParts: state.visibleOuterParts
      }))
    } catch {
      // Persistence is optional when browser storage is unavailable or full.
    }
  }

  function scheduleProjectSave() {
    window.clearTimeout(saveTimer)
    saveTimer = window.setTimeout(saveProject, 350)
  }

  function loadCanvasData(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        const context = state.skinCanvas.getContext('2d')
        context.clearRect(0, 0, 64, 64)
        context.drawImage(image, 0, 0)
        resolve()
      }
      image.onerror = reject
      image.src = dataUrl
    })
  }

  async function initialize() {
    state.skinCanvas = await createSkinCanvas()
    const saved = restoreProject()
    if (!saved) return
    state.model = saved.model === 'slim' ? 'slim' : 'classic'
    state.activeLayer = saved.activeLayer === 'outer' ? 'outer' : 'base'
    state.brushColor = /^#[0-9a-f]{6}$/i.test(saved.brushColor) ? saved.brushColor : state.brushColor
    state.brushOpacity = Number.isFinite(saved.brushOpacity) ? Math.min(1, Math.max(0, saved.brushOpacity)) : state.brushOpacity
    state.mirrorEnabled = Boolean(saved.mirrorEnabled)
    if (typeof saved.showOuterLayer === 'boolean') state.showOuterLayer = saved.showOuterLayer
    if (Array.isArray(saved.visibleOuterParts)) {
      state.visibleOuterParts = [...new Set(saved.visibleOuterParts.filter((part) => SKIN_PART_IDS.includes(part)))]
      state.isCustomOuterPartsExpanded = !allOuterPartsSelected()
    }
    await loadCanvasData(saved.skin)
  }

  async function handleImport(file) {
    if (!file || !state.skinCanvas) return
    const importedSkin = await importSkinFile(file, state.skinCanvas)
    state.model = importedSkin.model === 'slim' ? 'slim' : 'classic'
    resetOuterLayerForImportedSkin()
    redraw()
  }

  async function startNewSkin() {
    state.skinCanvas = await createSkinCanvas()
    state.model = 'classic'
    state.activeLayer = 'base'
    state.activeTool = 'brush'
    state.brushColor = '#0e66c8'
    state.brushOpacity = 1
    state.mirrorEnabled = false
    redraw()
    saveProject()
  }

  function exportSkin() {
    if (state.skinCanvas) downloadCanvas(state.skinCanvas)
  }

  function handlePreviewError(error) {
    state.previewError = error instanceof Error ? error.message : String(error || 'Unknown WebGL render error')
  }

  function dispose() {
    window.clearTimeout(saveTimer)
    saveProject()
  }

  return {
    state,
    actions: {
      allOuterPartsSelected,
      dispose,
      exportSkin,
      handleImport,
      handlePreviewError,
      initialize,
      loadCanvasData,
      redraw,
      resetOuterLayerForImportedSkin,
      saveProject,
      scheduleProjectSave,
      selectAllOuterParts,
      setOuterLayerDisplay,
      startNewSkin,
      toggleOuterPart
    }
  }
}
