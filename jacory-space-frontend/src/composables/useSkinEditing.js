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
    if (!entry) return
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

  function beginPaintStroke() {
    if (proposalCanvas.value || projectState.activeTool === 'eyedropper') return
    rememberColor()
    state.strokeSnapshot = projectState.skinCanvas?.toDataURL() || null
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
    const isErasing = projectState.activeTool === 'eraser'
    if (projectState.activeTool === 'fill') {
      floodFillSkinFace(projectState.skinCanvas, { x, y }, projectState.activeLayer, color)
      if (projectState.mirrorEnabled) {
        const mirrorPixel = mirrorSkinPixel({ x, y }, projectState.activeLayer)
        if (mirrorPixel && (mirrorPixel.x !== x || mirrorPixel.y !== y)) floodFillSkinFace(projectState.skinCanvas, mirrorPixel, projectState.activeLayer, color)
      }
    } else {
      if (isErasing) context.clearRect(x, y, 1, 1)
      else {
        context.fillStyle = color
        context.fillRect(x, y, 1, 1)
      }
      if (projectState.mirrorEnabled) {
        const mirrorPixel = mirrorSkinPixel({ x, y }, projectState.activeLayer)
        if (mirrorPixel && (mirrorPixel.x !== x || mirrorPixel.y !== y)) {
          if (isErasing) context.clearRect(mirrorPixel.x, mirrorPixel.y, 1, 1)
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

  function restoreDataUrl(dataUrl) {
    const image = new Image()
    image.onload = () => {
      const context = projectState.skinCanvas.getContext('2d')
      context.clearRect(0, 0, 64, 64)
      context.drawImage(image, 0, 0)
      redraw()
    }
    image.src = dataUrl
  }

  function undo() {
    const previous = state.history.pop()
    if (!previous || !projectState.skinCanvas) return
    state.redoStack.push(projectState.skinCanvas.toDataURL())
    restoreDataUrl(previous)
  }

  function redo() {
    const next = state.redoStack.pop()
    if (!next || !projectState.skinCanvas) return
    state.history.push(projectState.skinCanvas.toDataURL())
    restoreDataUrl(next)
  }

  function clearHistory() {
    state.history = []
    state.redoStack = []
    state.strokeSnapshot = null
    state.strokeModified = false
  }

  return {
    state,
    actions: { beginPaintStroke, clearHistory, finishPaintStroke, paintPreviewPixel, redo, rememberColor, restoreRecentColors, selectRecentColor, undo }
  }
}
