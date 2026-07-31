import { reactive } from 'vue'
import { floodFillSkinFace, mirrorSkinPixel } from '../components/tools/minecraft-skin-editor/skin-core'

const RECENT_COLORS_STORAGE_KEY = 'jacory-space.minecraft-skin-studio.recent-colors.v1'
const MAX_RECENT_COLORS = 8

export function useSkinEditing(projectState, proposalCanvas, redraw) {
  const state = reactive({
    recentColors: [],
    history: [],
    redoStack: [],
    strokeSnapshot: null,
    strokeModified: false,
    eyedropperSampling: false
  })

  function normalizeColorEntry(entry) {
    if (!entry || !/^#[0-9a-f]{6}$/i.test(entry.color)) return null
    const opacity = Number(entry.opacity)
    return {
      color: entry.color.toLowerCase(),
      opacity: Number.isFinite(opacity) ? Math.min(1, Math.max(0, opacity)) : 1
    }
  }

  function restoreRecentColors() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(RECENT_COLORS_STORAGE_KEY) || '[]')
      state.recentColors = Array.isArray(saved) ? saved.map(normalizeColorEntry).filter(Boolean).slice(0, MAX_RECENT_COLORS) : []
    } catch {
      state.recentColors = []
    }
  }

  function saveRecentColors() {
    try {
      window.localStorage.setItem(RECENT_COLORS_STORAGE_KEY, JSON.stringify(state.recentColors))
    } catch {
      // Recent colors are a convenience only.
    }
  }

  function rememberColor(color = projectState.brushColor, opacity = projectState.brushOpacity) {
    const entry = normalizeColorEntry({ color, opacity })
    if (!entry || entry.opacity === 0) return
    state.recentColors = [entry, ...state.recentColors.filter((item) => item.color !== entry.color || item.opacity !== entry.opacity)].slice(0, MAX_RECENT_COLORS)
    saveRecentColors()
  }

  function selectRecentColor(entry) {
    const color = normalizeColorEntry(entry)
    if (!color) return
    projectState.brushColor = color.color
    projectState.brushOpacity = color.opacity
    rememberColor(color.color, color.opacity)
  }

  function colorWithOpacity(hex, opacity) {
    const normalized = hex.replace('#', '')
    const red = Number.parseInt(normalized.slice(0, 2), 16)
    const green = Number.parseInt(normalized.slice(2, 4), 16)
    const blue = Number.parseInt(normalized.slice(4, 6), 16)
    return `rgb(${red} ${green} ${blue} / ${opacity})`
  }

  function createHistorySnapshot() {
    if (!projectState.skinCanvas) return null
    return {
      skin: projectState.skinCanvas.toDataURL(),
      skinModel: projectState.skinModel === 'slim' ? 'slim' : 'classic'
    }
  }

  function normalizeHistorySnapshot(snapshot) {
    if (typeof snapshot === 'string') return { skin: snapshot, skinModel: null }
    if (!snapshot || typeof snapshot.skin !== 'string') return null
    const skinModel = snapshot.skinModel ?? snapshot.model
    return { skin: snapshot.skin, skinModel: skinModel === 'slim' ? 'slim' : skinModel === 'classic' ? 'classic' : null }
  }

  function beginPaintStroke() {
    if (proposalCanvas.value || projectState.activeTool === 'eyedropper') return
    rememberColor()
    state.strokeSnapshot = createHistorySnapshot()
    state.strokeModified = false
    state.redoStack = []
  }

  function paintPreviewPixel({ x, y }) {
    if (proposalCanvas.value || !projectState.skinCanvas) return
    if (projectState.activeTool === 'eyedropper') {
      const [red, green, blue, alpha] = projectState.skinCanvas.getContext('2d').getImageData(x, y, 1, 1).data
      projectState.brushColor = `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
      projectState.brushOpacity = alpha / 255
      rememberColor()
      state.eyedropperSampling = true
      return
    }
    if (!state.strokeSnapshot) beginPaintStroke()
    const context = projectState.skinCanvas.getContext('2d')
    const color = colorWithOpacity(projectState.brushColor, projectState.brushOpacity)
    const isTransparent = projectState.brushOpacity === 0
    if (projectState.activeTool === 'fill') {
      floodFillSkinFace(projectState.skinCanvas, { x, y }, projectState.activeLayer, color, { clear: isTransparent })
      if (projectState.mirrorEnabled) {
        const mirrorPixel = mirrorSkinPixel({ x, y }, projectState.activeLayer)
        if (mirrorPixel && (mirrorPixel.x !== x || mirrorPixel.y !== y)) floodFillSkinFace(projectState.skinCanvas, mirrorPixel, projectState.activeLayer, color, { clear: isTransparent })
      }
    } else {
      if (isTransparent) context.clearRect(x, y, 1, 1)
      else {
        context.fillStyle = color
        context.fillRect(x, y, 1, 1)
      }
      if (projectState.mirrorEnabled) {
        const mirrorPixel = mirrorSkinPixel({ x, y }, projectState.activeLayer)
        if (mirrorPixel && (mirrorPixel.x !== x || mirrorPixel.y !== y)) {
          if (isTransparent) context.clearRect(mirrorPixel.x, mirrorPixel.y, 1, 1)
          else context.fillRect(mirrorPixel.x, mirrorPixel.y, 1, 1)
        }
      }
    }
    state.strokeModified = true
    redraw()
  }

  function finishPaintStroke() {
    if (state.eyedropperSampling) {
      state.eyedropperSampling = false
      projectState.activeTool = 'brush'
      return
    }
    if (state.strokeSnapshot && state.strokeModified) state.history.push(state.strokeSnapshot)
    state.strokeSnapshot = null
    state.strokeModified = false
  }

  function restoreSnapshot(snapshot) {
    const normalized = normalizeHistorySnapshot(snapshot)
    if (!normalized || !projectState.skinCanvas) return
    if (normalized.skinModel) projectState.skinModel = normalized.skinModel
    const image = new Image()
    image.onload = () => {
      const context = projectState.skinCanvas.getContext('2d')
      context.clearRect(0, 0, 64, 64)
      context.drawImage(image, 0, 0)
      redraw()
    }
    image.src = normalized.skin
  }

  function applyCanvasReplacement(sourceCanvas, { model } = {}) {
    if (!sourceCanvas || !projectState.skinCanvas) return null
    const historyEntry = createHistorySnapshot()
    if (!historyEntry) return null
    state.history.push(historyEntry)
    state.redoStack = []
    const context = projectState.skinCanvas.getContext('2d')
    context.clearRect(0, 0, 64, 64)
    context.imageSmoothingEnabled = false
    context.drawImage(sourceCanvas, 0, 0, 64, 64)
    if (model === 'classic' || model === 'slim') projectState.skinModel = model
    redraw()
    return historyEntry
  }

  function undo(expectedHistoryEntry = null) {
    if (expectedHistoryEntry && state.history.at(-1) !== expectedHistoryEntry) return false
    const previous = state.history.pop()
    if (!previous || !projectState.skinCanvas) return false
    const current = createHistorySnapshot()
    if (current) state.redoStack.push(current)
    restoreSnapshot(previous)
    return true
  }

  function redo() {
    const next = state.redoStack.pop()
    if (!next || !projectState.skinCanvas) return false
    const current = createHistorySnapshot()
    if (current) state.history.push(current)
    restoreSnapshot(next)
    return true
  }

  function clearHistory() {
    state.history = []
    state.redoStack = []
    state.strokeSnapshot = null
    state.strokeModified = false
  }

  return {
    state,
    actions: {
      applyCanvasReplacement,
      beginPaintStroke,
      canUndoHistoryEntry: (entry) => state.history.at(-1) === entry,
      clearHistory,
      finishPaintStroke,
      paintPreviewPixel,
      redo,
      rememberColor,
      restoreRecentColors,
      selectRecentColor,
      undo
    }
  }
}
