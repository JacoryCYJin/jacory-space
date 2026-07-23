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
        <span class="hidden border-l border-line pl-3 font-mono text-xs tracking-[0.16em] text-muted-foreground sm:inline">JACORY SPACE</span>
      </RouterLink>

      <div class="pointer-events-auto absolute left-5 top-20 flex w-11 flex-col overflow-hidden rounded-md border border-line bg-card/95 backdrop-blur-sm">
        <button type="button" :aria-label="t('minecraftSkin.color')" :class="toolButtonClass(isColorPanelOpen)" @click="isColorPanelOpen = !isColorPanelOpen">
          <span class="h-5 w-5 rounded-sm border border-line-strong" :style="{ backgroundColor: brushColor }" />
        </button>
        <span class="mx-2 h-px bg-line" />
        <button v-for="tool in tools" :key="tool.id" type="button" :aria-label="tool.label" :title="tool.label" :class="toolButtonClass(activeTool === tool.id)" @click="activeTool = tool.id">
          <component :is="tool.icon" class="h-4 w-4" />
        </button>
        <span class="mx-2 h-px bg-line" />
        <button type="button" :aria-label="t('minecraftSkin.grid')" :title="t('minecraftSkin.grid')" :class="toolButtonClass(showPixelGrid)" @click="showPixelGrid = !showPixelGrid"><Grid3X3 class="h-4 w-4" /></button>
        <span class="mx-2 h-px bg-line" />
        <button type="button" :aria-label="t('minecraftSkin.undo')" :title="t('minecraftSkin.undo')" :class="toolButtonClass(false)" @click="undo"><Undo2 class="h-4 w-4" /></button>
        <button type="button" :aria-label="t('minecraftSkin.redo')" :title="t('minecraftSkin.redo')" :class="toolButtonClass(false)" @click="redo"><Redo2 class="h-4 w-4" /></button>
        <span class="mx-2 h-px bg-line" />
        <button type="button" :aria-label="t('minecraftSkin.settings')" :title="t('minecraftSkin.settings')" :class="toolButtonClass(isSettingsOpen)" @click="isSettingsOpen = !isSettingsOpen"><Settings2 class="h-4 w-4" /></button>
      </div>

      <section v-if="isColorPanelOpen" class="pointer-events-auto absolute left-20 top-20 w-56 border border-line bg-card/95 p-4 backdrop-blur-sm">
        <p class="tech">01 — {{ t('minecraftSkin.color') }}</p>
        <div class="mt-4 flex items-center gap-3">
          <input v-model="brushColor" type="color" class="h-11 w-11 cursor-pointer border border-line bg-background p-1" :aria-label="t('minecraftSkin.color')" />
          <div>
            <p class="font-mono text-sm text-foreground">{{ brushColor.toUpperCase() }}</p>
            <p class="mt-1 text-xs text-muted-foreground">{{ activeTool === 'eraser' ? t('minecraftSkin.eraserActive') : t('minecraftSkin.brushActive') }}</p>
          </div>
        </div>
      </section>

      <aside v-if="isSettingsOpen" class="pointer-events-auto absolute bottom-5 right-5 top-5 w-72 overflow-y-auto border border-line bg-card/95 backdrop-blur-sm">
        <div class="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p class="tech">02 — {{ t('minecraftSkin.settings') }}</p>
            <p class="mt-1 text-sm text-foreground">{{ t('minecraftSkin.title') }}</p>
          </div>
          <button type="button" :aria-label="t('minecraftSkin.close')" class="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground" @click="isSettingsOpen = false"><X class="h-4 w-4" /></button>
        </div>
        <div class="border-b border-line p-5">
          <p class="tech">{{ t('minecraftSkin.model') }}</p>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <button v-for="option in models" :key="option.id" type="button" :class="['border px-3 py-3 text-left text-sm transition-colors', model === option.id ? 'border-blue text-blue' : 'border-line text-muted-foreground hover:border-line-strong hover:text-foreground']" @click="model = option.id">
              <span class="block font-mono text-xs">{{ option.code }}</span>
              <span class="mt-1 block">{{ option.label }}</span>
            </button>
          </div>
        </div>
        <div class="p-5">
          <p class="tech">{{ t('minecraftSkin.layers') }}</p>
          <div class="mt-4 space-y-2">
            <button v-for="layer in layers" :key="layer.id" type="button" :class="['flex w-full items-center justify-between border px-3 py-3 text-left text-sm transition-colors', activeLayer === layer.id ? 'border-blue text-blue' : 'border-line text-muted-foreground hover:border-line-strong hover:text-foreground']" @click="activeLayer = layer.id">
              <span>{{ layer.label }}</span><span class="font-mono text-xs">{{ layer.code }}</span>
            </button>
          </div>
        </div>
      </aside>

      <div class="absolute bottom-5 left-5 hidden border border-line bg-card/90 px-3 py-2 backdrop-blur-sm md:block">
        <p class="tech">{{ t('minecraftSkin.controls') }}</p>
        <p class="mt-1 font-mono text-xs text-muted-foreground">DRAG / ZOOM / PAN</p>
      </div>

      <div class="pointer-events-auto absolute bottom-5 right-5 flex items-center gap-2" :class="{ 'right-[19.5rem]': isSettingsOpen }">
        <input ref="fileInput" type="file" accept="image/png" class="hidden" @change="handleImport" />
        <button type="button" class="border border-line bg-card/95 px-3 py-2 text-xs text-foreground transition-colors hover:border-blue hover:text-blue" @click="triggerImport"><Upload class="mr-2 inline-block h-4 w-4 align-[-3px]" />{{ t('minecraftSkin.import') }}</button>
        <button type="button" class="border border-foreground bg-foreground px-3 py-2 text-xs text-background transition-colors hover:border-blue hover:bg-blue" @click="exportSkin"><Download class="mr-2 inline-block h-4 w-4 align-[-3px]" />{{ t('minecraftSkin.export') }}</button>
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
import { computed, nextTick, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Download, Eraser, Grid3X3, Pencil, Pipette, Redo2, Settings2, Undo2, Upload, X } from 'lucide-vue-next'
import jacoryLogo from '../assets/jacory-logo.png'
import MinecraftSkinPreview from '../components/tools/minecraft-skin-editor/MinecraftSkinPreview.vue'
import { createSkinCanvas, downloadCanvas, importSkinFile } from '../components/tools/minecraft-skin-editor/skin-core'

const { t } = useI18n()
const fileInput = ref(null)
const skinCanvas = ref(null)
const previewError = ref('')
const textureVersion = ref(0)
const model = ref('classic')
const activeLayer = ref('base')
const activeTool = ref('brush')
const brushColor = ref('#0e66c8')
const isColorPanelOpen = ref(false)
const isSettingsOpen = ref(false)
const showPixelGrid = ref(false)
const history = ref([])
const redoStack = ref([])
const strokeSnapshot = ref(null)
const strokeModified = ref(false)
const eyedropperSampling = ref(false)

const tools = computed(() => [
  { id: 'brush', label: t('minecraftSkin.brush'), icon: Pencil },
  { id: 'eyedropper', label: t('minecraftSkin.eyedropper'), icon: Pipette },
  { id: 'eraser', label: t('minecraftSkin.eraser'), icon: Eraser }
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

function redraw() {
  textureVersion.value += 1
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

function paintPreviewPixel({ x, y }) {
  if (activeTool.value === 'eyedropper') {
    const [red, green, blue] = skinCanvas.value.getContext('2d').getImageData(x, y, 1, 1).data
    brushColor.value = `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
    eyedropperSampling.value = true
    return
  }
  if (!strokeSnapshot.value) beginPaintStroke()
  const color = activeTool.value === 'eraser' ? 'rgba(0,0,0,0)' : brushColor.value
  const context = skinCanvas.value.getContext('2d')
  context.fillStyle = color
  context.fillRect(x, y, 1, 1)
  strokeModified.value = true
  redraw()
}

function beginPaintStroke() {
  if (activeTool.value === 'eyedropper') return
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
  const image = new Image()
  image.onload = () => {
    const context = skinCanvas.value.getContext('2d')
    context.clearRect(0, 0, 64, 64)
    context.drawImage(image, 0, 0)
    redraw()
  }
  image.src = dataUrl
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

function exportSkin() {
  downloadCanvas(skinCanvas.value)
}

onMounted(async () => {
  try {
    skinCanvas.value = await createSkinCanvas()
    await nextTick()
    redraw()
  } catch (error) {
    handlePreviewError(error)
  }
})
</script>
