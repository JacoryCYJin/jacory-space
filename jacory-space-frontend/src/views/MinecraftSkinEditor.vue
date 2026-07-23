<template>
  <main class="relative min-h-dvh overflow-hidden bg-background text-foreground">
    <MinecraftSkinPreview
      v-if="skinCanvas"
      :texture-canvas="skinCanvas"
      :texture-version="textureVersion"
      :model="model"
      :active-layer="activeLayer"
      :active-tool="activeTool"
      :show-grid="showPixelGrid"
      class="absolute inset-0 min-h-dvh"
      @error="handlePreviewError"
      @paint-start="beginPaintStroke"
      @paint-pixel="paintPreviewPixel"
      @paint-end="finishPaintStroke"
    />

    <div class="pointer-events-none absolute inset-0 z-10">
      <RouterLink to="/" class="pointer-events-auto absolute left-5 top-5 flex items-center gap-3 text-foreground" aria-label="Jacory Space">
        <img :src="jacoryLogo" alt="Jacory Space" class="h-8 w-8 object-contain" />
        <span class="hidden font-mono text-xs tracking-[0.16em] text-muted-foreground sm:inline">JACORY SPACE</span>
      </RouterLink>

      <div class="pointer-events-auto absolute left-5 top-20 flex w-11 flex-col overflow-hidden rounded-md border border-line bg-card/95 backdrop-blur-sm">
        <button type="button" :aria-label="t('minecraftSkin.settings')" :class="toolButtonClass(isEditorPanelOpen)" @mouseenter="showToolTooltip(t('minecraftSkin.settings'), $event)" @mouseleave="hideToolTooltip" @click="toggleEditorPanel">
          <SlidersHorizontal class="h-4 w-4" />
        </button>
        <button type="button" :aria-label="t('minecraftSkin.color')" :class="toolButtonClass(isColorPanelOpen)" @mouseenter="showToolTooltip(t('minecraftSkin.color'), $event)" @mouseleave="hideToolTooltip" @click="toggleColorPanel">
          <span class="h-5 w-5 rounded-sm border border-line-strong" :style="{ backgroundColor: brushColor, opacity: brushOpacity }" />
        </button>
        <span class="mx-2 h-px bg-line" />
        <button v-for="tool in tools" :key="tool.id" type="button" :aria-label="tool.label" :class="toolButtonClass(activeTool === tool.id)" @mouseenter="showToolTooltip(tool.label, $event)" @mouseleave="hideToolTooltip" @click="activeTool = tool.id">
          <component :is="tool.icon" class="h-4 w-4" />
        </button>
        <span class="mx-2 h-px bg-line" />
        <button type="button" :aria-label="t('minecraftSkin.grid')" :class="toolButtonClass(showPixelGrid)" @mouseenter="showToolTooltip(t('minecraftSkin.grid'), $event)" @mouseleave="hideToolTooltip" @click="showPixelGrid = !showPixelGrid"><Grid3X3 class="h-4 w-4" /></button>
        <button type="button" :aria-label="t('minecraftSkin.mirror')" :class="toolButtonClass(mirrorEnabled)" @mouseenter="showToolTooltip(t('minecraftSkin.mirror'), $event)" @mouseleave="hideToolTooltip" @click="mirrorEnabled = !mirrorEnabled"><FlipHorizontal class="h-4 w-4" /></button>
        <span class="mx-2 h-px bg-line" />
        <button type="button" :aria-label="t('minecraftSkin.undo')" :class="toolButtonClass(false)" @mouseenter="showToolTooltip(t('minecraftSkin.undo'), $event)" @mouseleave="hideToolTooltip" @click="undo"><Undo2 class="h-4 w-4" /></button>
        <button type="button" :aria-label="t('minecraftSkin.redo')" :class="toolButtonClass(false)" @mouseenter="showToolTooltip(t('minecraftSkin.redo'), $event)" @mouseleave="hideToolTooltip" @click="redo"><Redo2 class="h-4 w-4" /></button>
      </div>

      <span v-if="hoveredTool" class="pointer-events-none absolute left-20 z-30 -translate-y-1/2 font-mono text-xs tracking-[0.1em] text-muted-foreground" :style="{ top: `calc(5rem + ${hoveredToolTop}px)` }">{{ hoveredTool }}</span>

      <ColorPickerPanel
        v-if="isColorPanelOpen"
        v-model="brushColor"
        v-model:opacity="brushOpacity"
        :recent-colors="recentColors"
        class="pointer-events-auto absolute left-20 top-20 z-20 w-[min(22rem,calc(100vw-6.5rem))]"
        @commit="rememberCurrentColor"
        @select-recent="selectRecentColor"
      />

      <section v-if="isEditorPanelOpen" class="pointer-events-auto absolute left-20 top-[7.75rem] w-64 border border-line bg-card/95 backdrop-blur-sm">
        <div class="border-b border-line p-4">
          <p class="tech">01 — {{ t('minecraftSkin.model') }}</p>
          <div class="mt-3 grid grid-cols-2 gap-2">
            <button v-for="option in models" :key="option.id" type="button" :class="['border px-3 py-2 text-left text-xs transition-colors', model === option.id ? 'border-blue text-blue' : 'border-line text-muted-foreground hover:border-line-strong hover:text-foreground']" @click="model = option.id">
              <span class="block font-mono text-xs">{{ option.code }}</span>
              <span class="mt-1 block">{{ option.label }}</span>
            </button>
          </div>
        </div>
        <div class="p-4">
          <p class="tech">02 — {{ t('minecraftSkin.layers') }}</p>
          <div class="mt-3 grid grid-cols-2 gap-2">
            <button v-for="layer in layers" :key="layer.id" type="button" :class="['border px-3 py-2 text-left text-xs transition-colors', activeLayer === layer.id ? 'border-blue text-blue' : 'border-line text-muted-foreground hover:border-line-strong hover:text-foreground']" @click="activeLayer = layer.id">
              <span class="block font-mono text-xs">{{ layer.code }}</span>
              <span class="mt-1 block">{{ layer.label }}</span>
            </button>
          </div>
        </div>
      </section>

      <div class="pointer-events-auto absolute bottom-5 right-5 flex items-center gap-2">
        <input ref="fileInput" type="file" accept="image/png" class="hidden" @change="handleImport" />
        <button type="button" class="border border-line bg-card px-3 py-2 text-xs text-foreground transition-colors hover:border-blue hover:text-blue" @click="isNewSkinDialogOpen = true"><FilePlus2 class="mr-2 inline-block h-4 w-4 align-[-3px]" />{{ t('minecraftSkin.newSkin') }}</button>
        <button type="button" class="border border-line bg-card px-3 py-2 text-xs text-foreground transition-colors hover:border-blue hover:text-blue" @click="triggerImport"><Upload class="mr-2 inline-block h-4 w-4 align-[-3px]" />{{ t('minecraftSkin.import') }}</button>
        <button type="button" class="border border-foreground bg-foreground px-3 py-2 text-xs text-background transition-colors hover:border-blue hover:bg-blue" @click="exportSkin"><Download class="mr-2 inline-block h-4 w-4 align-[-3px]" />{{ t('minecraftSkin.export') }}</button>
      </div>

      <div v-if="isNewSkinDialogOpen" class="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-background/70 px-5 backdrop-blur-sm">
        <section class="w-full max-w-sm border border-line bg-card p-5">
          <p class="tech">{{ t('minecraftSkin.newSkin') }}</p>
          <p class="mt-3 text-sm text-foreground">{{ t('minecraftSkin.newSkinConfirmTitle') }}</p>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">{{ t('minecraftSkin.newSkinConfirmDetail') }}</p>
          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="border border-line px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground" @click="isNewSkinDialogOpen = false">{{ t('minecraftSkin.cancel') }}</button>
            <button type="button" class="border border-foreground bg-foreground px-3 py-2 text-xs text-background transition-colors hover:border-blue hover:bg-blue" @click="startNewSkin">{{ t('minecraftSkin.startNewSkin') }}</button>
          </div>
        </section>
      </div>

      <div v-if="previewError" class="pointer-events-auto absolute inset-0 flex items-center justify-center bg-background/95 px-6 text-center">
        <div class="max-w-md border border-line bg-card p-6">
          <p class="tech text-destructive">WEBGL / ERROR</p>
          <p class="mt-3 text-sm text-muted-foreground">{{ t('minecraftSkin.webglError') }}</p>
          <p class="mt-2 font-mono text-xs text-haze">{{ previewError }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Download, FilePlus2, FlipHorizontal, Grid3X3, PaintBucket, Pencil, Pipette, Redo2, SlidersHorizontal, Undo2, Upload } from 'lucide-vue-next'
import jacoryLogo from '../assets/jacory-logo.png'
import MinecraftSkinPreview from '../components/tools/minecraft-skin-editor/MinecraftSkinPreview.vue'
import ColorPickerPanel from '../components/tools/minecraft-skin-editor/ColorPickerPanel.vue'
import { createSkinCanvas, downloadCanvas, floodFillSkinFace, importSkinFile, mirrorSkinPixel } from '../components/tools/minecraft-skin-editor/skin-core'

const STORAGE_KEY = 'jacory-space.minecraft-skin-studio.project.v1'
const RECENT_COLORS_STORAGE_KEY = 'jacory-space.minecraft-skin-studio.recent-colors.v1'
const MAX_RECENT_COLORS = 8

const { t } = useI18n()
const fileInput = ref(null)
const skinCanvas = ref(null)
const previewError = ref('')
const textureVersion = ref(0)
const model = ref('classic')
const activeLayer = ref('base')
const activeTool = ref('brush')
const brushColor = ref('#0e66c8')
const brushOpacity = ref(1)
const isColorPanelOpen = ref(false)
const isEditorPanelOpen = ref(false)
const showPixelGrid = ref(false)
const mirrorEnabled = ref(false)
const hoveredTool = ref('')
const hoveredToolTop = ref(0)
const history = ref([])
const redoStack = ref([])
const strokeSnapshot = ref(null)
const strokeModified = ref(false)
const eyedropperSampling = ref(false)
const recentColors = ref([])
const isNewSkinDialogOpen = ref(false)
let saveTimer

const tools = computed(() => [
  { id: 'brush', label: t('minecraftSkin.brush'), icon: Pencil },
  { id: 'fill', label: t('minecraftSkin.fill'), icon: PaintBucket },
  { id: 'eyedropper', label: t('minecraftSkin.eyedropper'), icon: Pipette },
])
const models = computed(() => [
  { id: 'classic', code: 'STEVE', label: t('minecraftSkin.classic') },
  { id: 'slim', code: 'ALEX', label: t('minecraftSkin.slim') }
])
const layers = computed(() => [
  { id: 'base', code: 'L1', label: t('minecraftSkin.base') },
  { id: 'outer', code: 'L2', label: t('minecraftSkin.outer') }
])
function toolButtonClass(active) {
  return ['flex h-11 w-11 items-center justify-center transition-colors', active ? 'bg-blue text-white' : 'text-muted-foreground hover:bg-background hover:text-foreground']
}

function showToolTooltip(label, event) {
  hoveredTool.value = label
  hoveredToolTop.value = event.currentTarget.offsetTop + event.currentTarget.offsetHeight / 2
}

function hideToolTooltip() {
  hoveredTool.value = ''
}

function toggleColorPanel() {
  isColorPanelOpen.value = !isColorPanelOpen.value
  isEditorPanelOpen.value = false
}

function toggleEditorPanel() {
  isEditorPanelOpen.value = !isEditorPanelOpen.value
  isColorPanelOpen.value = false
}

function redraw() {
  textureVersion.value += 1
  scheduleProjectSave()
}

function handlePreviewError(error) {
  previewError.value = error instanceof Error ? error.message : String(error || 'Unknown WebGL render error')
}

function triggerImport() {
  fileInput.value?.click()
}

async function handleImport(event) {
  const file = event.target.files?.[0]
  if (!file) return
  await importSkinFile(file, skinCanvas.value)
  history.value = []
  redoStack.value = []
  redraw()
  event.target.value = ''
}

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
    recentColors.value = Array.isArray(saved) ? saved.map(normalizeColorEntry).filter(Boolean).slice(0, MAX_RECENT_COLORS) : []
  } catch {
    recentColors.value = []
  }
}

function saveRecentColors() {
  try {
    window.localStorage.setItem(RECENT_COLORS_STORAGE_KEY, JSON.stringify(recentColors.value))
  } catch {
    // Recent colors are optional when browser storage is unavailable.
  }
}

function rememberColor(color = brushColor.value, opacity = brushOpacity.value) {
  const entry = normalizeColorEntry({ color, opacity })
  if (!entry) return
  recentColors.value = [entry, ...recentColors.value.filter((item) => item.color !== entry.color || item.opacity !== entry.opacity)].slice(0, MAX_RECENT_COLORS)
  saveRecentColors()
}

function rememberCurrentColor() {
  rememberColor()
}

function selectRecentColor(entry) {
  const color = normalizeColorEntry(entry)
  if (!color) return
  brushColor.value = color.color
  brushOpacity.value = color.opacity
  rememberColor(color.color, color.opacity)
}

function paintPreviewPixel({ x, y }) {
  if (activeTool.value === 'eyedropper') {
    const [red, green, blue, alpha] = skinCanvas.value.getContext('2d').getImageData(x, y, 1, 1).data
    brushColor.value = `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
    brushOpacity.value = alpha / 255
    rememberCurrentColor()
    eyedropperSampling.value = true
    return
  }
  if (!strokeSnapshot.value) beginPaintStroke()
  const context = skinCanvas.value.getContext('2d')
  const color = colorWithOpacity(brushColor.value, brushOpacity.value)
  if (activeTool.value === 'fill') {
    floodFillSkinFace(skinCanvas.value, { x, y }, activeLayer.value, color)
    if (mirrorEnabled.value) {
      const mirrorPixel = mirrorSkinPixel({ x, y }, activeLayer.value)
      if (mirrorPixel && (mirrorPixel.x !== x || mirrorPixel.y !== y)) floodFillSkinFace(skinCanvas.value, mirrorPixel, activeLayer.value, color)
    }
  } else {
    context.fillStyle = color
    context.fillRect(x, y, 1, 1)
    if (mirrorEnabled.value) {
      const mirrorPixel = mirrorSkinPixel({ x, y }, activeLayer.value)
      if (mirrorPixel && (mirrorPixel.x !== x || mirrorPixel.y !== y)) context.fillRect(mirrorPixel.x, mirrorPixel.y, 1, 1)
    }
  }
  strokeModified.value = true
  redraw()
}

function colorWithOpacity(hex, opacity) {
  const normalized = hex.replace('#', '')
  const red = Number.parseInt(normalized.slice(0, 2), 16)
  const green = Number.parseInt(normalized.slice(2, 4), 16)
  const blue = Number.parseInt(normalized.slice(4, 6), 16)
  return `rgb(${red} ${green} ${blue} / ${opacity})`
}

function restoreProject() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
    if (!saved?.skin || typeof saved.skin !== 'string') return null
    return saved
  } catch {
    return null
  }
}

function saveProject() {
  if (!skinCanvas.value) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      skin: skinCanvas.value.toDataURL('image/png'),
      model: model.value,
      activeLayer: activeLayer.value,
      brushColor: brushColor.value,
      brushOpacity: brushOpacity.value,
      mirrorEnabled: mirrorEnabled.value
    }))
  } catch {
    // Local persistence is optional; drawing remains available when storage is full or unavailable.
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
      const context = skinCanvas.value.getContext('2d')
      context.clearRect(0, 0, 64, 64)
      context.drawImage(image, 0, 0)
      resolve()
    }
    image.onerror = reject
    image.src = dataUrl
  })
}

function beginPaintStroke() {
  if (activeTool.value === 'eyedropper') return
  rememberCurrentColor()
  strokeSnapshot.value = skinCanvas.value?.toDataURL() || null
  strokeModified.value = false
  redoStack.value = []
}

function finishPaintStroke() {
  if (eyedropperSampling.value) {
    eyedropperSampling.value = false
    activeTool.value = 'brush'
    return
  }
  if (strokeSnapshot.value && strokeModified.value) history.value.push(strokeSnapshot.value)
  strokeSnapshot.value = null
  strokeModified.value = false
}

function restoreDataUrl(dataUrl) {
  loadCanvasData(dataUrl).then(redraw).catch(() => {})
}

function undo() {
  const previous = history.value.pop()
  if (!previous) return
  redoStack.value.push(skinCanvas.value.toDataURL())
  restoreDataUrl(previous)
}

function redo() {
  const next = redoStack.value.pop()
  if (!next) return
  history.value.push(skinCanvas.value.toDataURL())
  restoreDataUrl(next)
}

function handleKeyboardShortcut(event) {
  if ((!event.metaKey && !event.ctrlKey) || event.key.toLowerCase() !== 'z') return
  const target = event.target
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable) return
  event.preventDefault()
  if (event.shiftKey) redo()
  else undo()
}

function exportSkin() {
  downloadCanvas(skinCanvas.value)
}

async function startNewSkin() {
  isNewSkinDialogOpen.value = false
  try {
    skinCanvas.value = await createSkinCanvas()
    model.value = 'classic'
    activeLayer.value = 'base'
    activeTool.value = 'brush'
    brushColor.value = '#0e66c8'
    brushOpacity.value = 1
    mirrorEnabled.value = false
    history.value = []
    redoStack.value = []
    strokeSnapshot.value = null
    strokeModified.value = false
    redraw()
    saveProject()
  } catch (error) {
    handlePreviewError(error)
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyboardShortcut)
  window.addEventListener('pagehide', saveProject)
  try {
    skinCanvas.value = await createSkinCanvas()
    restoreRecentColors()
    const saved = restoreProject()
    if (saved) {
      model.value = saved.model === 'slim' ? 'slim' : 'classic'
      activeLayer.value = saved.activeLayer === 'outer' ? 'outer' : 'base'
      brushColor.value = /^#[0-9a-f]{6}$/i.test(saved.brushColor) ? saved.brushColor : brushColor.value
      brushOpacity.value = Number.isFinite(saved.brushOpacity) ? Math.min(1, Math.max(0, saved.brushOpacity)) : brushOpacity.value
      mirrorEnabled.value = Boolean(saved.mirrorEnabled)
      await loadCanvasData(saved.skin)
    }
    await nextTick()
    redraw()
  } catch (error) {
    handlePreviewError(error)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyboardShortcut)
  window.removeEventListener('pagehide', saveProject)
  window.clearTimeout(saveTimer)
  saveProject()
})

watch([model, activeLayer, brushColor, brushOpacity, mirrorEnabled], scheduleProjectSave)
</script>
