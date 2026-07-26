<template>
  <main class="relative min-h-dvh overflow-hidden bg-background text-foreground">
    <StatusToast :visible="aiConnectionToastVisible" :message="aiConnectionToastMessage" type="success" />
    <MinecraftSkinPreview
      v-if="skinCanvas"
      ref="skinPreview"
      :texture-canvas="displayCanvas"
      :texture-version="textureVersion"
      :model="model"
      :active-layer="activeLayer"
      :show-outer-layer="showOuterLayer"
      :visible-outer-parts="visibleOuterParts"
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
        <button type="button" :aria-label="nextModelLabel" :title="nextModelLabel" :class="toolButtonClass(false)" @mouseenter="showToolTooltip(nextModelLabel, $event)" @mouseleave="hideToolTooltip" @click="toggleModel">
          <canvas ref="modelSwitchIcon" width="24" height="24" class="h-6 w-6 image-render-pixel" aria-hidden="true" />
        </button>
        <button type="button" :aria-label="t('minecraftSkin.outerDisplay')" :class="toolButtonClass(isLayerPanelOpen)" @mouseenter="showToolTooltip(t('minecraftSkin.outerDisplay'), $event)" @mouseleave="hideToolTooltip" @click="toggleLayerPanel">
          <Layers3 class="h-4 w-4" />
        </button>
        <span class="mx-2 h-px bg-line" />
        <button type="button" :aria-label="t('minecraftSkin.color')" :class="toolButtonClass(isColorPanelOpen)" @mouseenter="showToolTooltip(t('minecraftSkin.color'), $event)" @mouseleave="hideToolTooltip" @click="toggleColorPanel">
          <span class="h-5 w-5 rounded-sm border border-line-strong" :style="{ backgroundColor: brushColor, opacity: brushOpacity }" />
        </button>
        <button v-for="tool in tools" :key="tool.id" type="button" :aria-label="tool.label" :class="toolButtonClass(activeTool === tool.id)" @mouseenter="showToolTooltip(tool.label, $event)" @mouseleave="hideToolTooltip" @click="activeTool = tool.id">
          <component :is="tool.icon" class="h-4 w-4" />
        </button>
        <span class="mx-2 h-px bg-line" />
        <button type="button" :aria-label="t('minecraftSkin.grid')" :class="toolButtonClass(showPixelGrid)" @mouseenter="showToolTooltip(t('minecraftSkin.grid'), $event)" @mouseleave="hideToolTooltip" @click="showPixelGrid = !showPixelGrid"><Grid3X3 class="h-4 w-4" /></button>
        <button type="button" :aria-label="t('minecraftSkin.mirror')" :class="toolButtonClass(mirrorEnabled)" @mouseenter="showToolTooltip(t('minecraftSkin.mirror'), $event)" @mouseleave="hideToolTooltip" @click="mirrorEnabled = !mirrorEnabled"><FlipHorizontal class="h-4 w-4" /></button>
        <span class="mx-2 h-px bg-line" />
        <button type="button" :aria-label="t('minecraftSkin.undo')" :class="toolButtonClass(false)" @mouseenter="showToolTooltip(t('minecraftSkin.undo'), $event)" @mouseleave="hideToolTooltip" @click="undo"><Undo2 class="h-4 w-4" /></button>
        <button type="button" :aria-label="t('minecraftSkin.redo')" :class="toolButtonClass(false)" @mouseenter="showToolTooltip(t('minecraftSkin.redo'), $event)" @mouseleave="hideToolTooltip" @click="redo"><Redo2 class="h-4 w-4" /></button>
        <span class="mx-2 h-px bg-line" />
        <button type="button" :aria-label="t('minecraftSkin.aiEdit')" :class="toolButtonClass(isAiPanelOpen)" @mouseenter="showToolTooltip(t('minecraftSkin.aiEdit'), $event)" @mouseleave="hideToolTooltip" @click="toggleAiPanel"><Sparkles class="h-4 w-4" /></button>
      </div>

      <span v-if="hoveredTool" class="pointer-events-none absolute left-20 z-30 -translate-y-1/2 font-mono text-xs tracking-[0.1em] text-muted-foreground" :style="{ top: `calc(5rem + ${hoveredToolTop}px)` }">{{ hoveredTool }}</span>

      <section v-if="isLayerPanelOpen" class="pointer-events-auto absolute left-20 top-20 z-20 w-64 border border-line bg-card/95 backdrop-blur-sm">
        <div class="border-b border-line p-4">
          <p class="tech">01 — {{ t('minecraftSkin.outerDisplay') }}</p>
          <div class="mt-3 grid grid-cols-2 border border-line">
            <button type="button" :aria-pressed="!showOuterLayer" :class="['flex h-10 items-center justify-center gap-2 border-r border-line text-xs transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-inset', !showOuterLayer ? 'text-blue' : 'text-muted-foreground hover:text-foreground']" @click="showOuterLayer = false">
              <span :class="['h-1.5 w-1.5 rounded-full', !showOuterLayer ? 'bg-blue' : 'bg-line-strong']" aria-hidden="true" />
              {{ t('minecraftSkin.outerDisplayOff') }}
            </button>
            <button type="button" :aria-pressed="showOuterLayer" :class="['flex h-10 items-center justify-center gap-2 text-xs transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-inset', showOuterLayer ? 'text-blue' : 'text-muted-foreground hover:text-foreground']" @click="showAllOuterLayers">
              <span :class="['h-1.5 w-1.5 rounded-full', showOuterLayer ? 'bg-blue' : 'bg-line-strong']" aria-hidden="true" />
              {{ t('minecraftSkin.outerDisplayOn') }}
            </button>
          </div>
        </div>
        <div class="p-4">
          <p class="tech">02 — {{ t('minecraftSkin.outerVisibility') }}</p>
          <div class="mt-3 grid grid-cols-2 gap-2">
            <button type="button" :class="['col-span-2 border px-3 py-2 text-left text-xs transition-colors', allOuterPartsSelected ? 'border-blue text-blue' : 'border-line text-muted-foreground hover:border-line-strong hover:text-foreground']" @click="toggleAllOuterParts">
              <span class="block">{{ t('minecraftSkin.allOuterParts') }}</span>
            </button>
            <button v-for="part in skinParts" :key="part.id" type="button" :class="['border px-3 py-2 text-left text-xs transition-colors', visibleOuterParts.includes(part.id) ? 'border-blue text-blue' : 'border-line text-muted-foreground hover:border-line-strong hover:text-foreground']" @click="toggleOuterPart(part.id)">
              <span class="block">{{ part.label }}</span>
            </button>
          </div>
        </div>
      </section>

      <ColorPickerPanel
        v-if="isColorPanelOpen"
        v-model="brushColor"
        v-model:opacity="brushOpacity"
        :recent-colors="recentColors"
        class="pointer-events-auto absolute left-20 top-20 z-20 w-[min(22rem,calc(100vw-6.5rem))]"
        @commit="rememberCurrentColor"
        @select-recent="selectRecentColor"
      />

      <section v-if="isAiPanelOpen" class="pointer-events-auto absolute left-20 top-20 z-20 w-[min(23rem,calc(100vw-6.5rem))] border border-line bg-card/95 backdrop-blur-sm">
        <div class="flex h-12 items-center justify-between border-b border-line px-4">
          <p class="tech">AI / {{ t('minecraftSkin.aiPartRightArm') }}</p>
          <button type="button" class="text-xs text-muted-foreground transition-colors hover:text-foreground" @click="closeAiPanel">{{ t('minecraftSkin.close') }}</button>
        </div>
        <div class="space-y-3 p-4">
          <p class="text-xs leading-5 text-muted-foreground">{{ t('minecraftSkin.pixelGenerationHint') }}</p>
          <div class="border border-line bg-background transition-colors focus-within:border-blue">
            <textarea v-model="aiPrompt" class="h-32 w-full resize-y bg-transparent p-3 text-sm leading-6 text-foreground outline-none" :placeholder="t('minecraftSkin.aiPromptPlaceholder')" />
            <div class="flex h-10 items-center justify-between border-t border-line px-3">
              <label class="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground">
                <input v-model="aiUseVision" type="checkbox" class="accent-blue" />
                <span>{{ t('minecraftSkin.aiVision') }}</span>
              </label>
              <div class="flex items-center gap-2">
                <button v-if="aiUseVision" type="button" class="text-xs text-muted-foreground transition-colors hover:text-blue" @click="referenceInput?.click()">{{ aiReferenceImage ? t('minecraftSkin.aiReferenceReady') : t('minecraftSkin.aiReference') }}</button>
                <button v-if="aiReferenceImage" type="button" class="text-xs text-muted-foreground transition-colors hover:text-foreground" @click="aiReferenceImage = ''">{{ t('minecraftSkin.aiClear') }}</button>
              </div>
            </div>
          </div>
          <input ref="referenceInput" type="file" accept="image/png,image/jpeg,image/webp" class="hidden" @change="handleReferenceImage" />
          <button type="button" class="flex w-full items-center justify-between px-1 py-1 text-left transition-colors hover:text-foreground" @click="isAiConnectionOpen = !isAiConnectionOpen">
            <span class="text-xs text-muted-foreground">{{ t('minecraftSkin.aiConnection') }}</span>
            <span class="flex items-center gap-2">
              <span v-if="aiConnectionStatus.showDot" class="h-1.5 w-1.5 rounded-full bg-blue" aria-hidden="true" />
              <span :class="['font-mono text-xs', aiConnectionStatus.className]">{{ aiConnectionStatus.label }}</span>
              <ChevronDown :class="['h-3.5 w-3.5 text-haze transition-transform', isAiConnectionOpen ? 'rotate-180' : '']" />
            </span>
          </button>
          <div v-if="isAiConnectionOpen" class="border border-line bg-background p-3 transition-colors focus-within:border-blue">
            <label class="block">
              <span class="tech text-haze">{{ t('minecraftSkin.aiApiKeyLabel') }}</span>
              <input v-model="aiApiKey" type="password" autocomplete="off" class="mt-1 w-full border-b border-line bg-transparent pb-2 font-mono text-xs text-foreground outline-none transition-colors placeholder:text-haze focus:border-blue" :placeholder="t('minecraftSkin.aiApiKeyPlaceholder')" />
            </label>
            <label class="mt-4 block">
              <span class="tech text-haze">{{ t('minecraftSkin.aiBaseUrlLabel') }}</span>
              <input v-model="aiBaseUrl" type="url" class="mt-1 w-full border-b border-line bg-transparent pb-2 font-mono text-xs text-foreground outline-none transition-colors placeholder:text-haze focus:border-blue" :placeholder="t('minecraftSkin.aiBaseUrlPlaceholder')" />
            </label>
            <label class="mt-4 block">
              <span class="tech text-haze">{{ t('minecraftSkin.aiModelLabel') }}</span>
              <input v-model="aiModel" list="minecraft-skin-ai-models" type="text" class="mt-1 w-full border-b border-line bg-transparent pb-2 font-mono text-xs text-foreground outline-none transition-colors placeholder:text-haze focus:border-blue" :placeholder="t('minecraftSkin.aiModelPlaceholder')" />
              <datalist id="minecraft-skin-ai-models">
                <option v-for="modelId in aiModelCatalog" :key="modelId" :value="modelId" />
              </datalist>
            </label>
            <div class="mt-4 flex gap-2">
              <button type="button" class="border border-line px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-blue hover:text-blue disabled:cursor-not-allowed disabled:opacity-50" :disabled="isTestingAiConnection || isGeneratingAiPart" @click="testAiConnection">{{ isTestingAiConnection ? t('minecraftSkin.aiConnectionTesting') : t('minecraftSkin.aiConnectionTest') }}</button>
              <button type="button" class="border border-blue px-3 py-2 text-xs text-blue transition-colors hover:border-foreground hover:bg-foreground hover:text-background" :disabled="isTestingAiConnection || isGeneratingAiPart" @click="saveAiConnectionSettings">{{ t('minecraftSkin.aiConnectionSave') }}</button>
            </div>
            <p v-if="aiConnectionTest?.state === 'error'" class="mt-3 text-xs leading-5 text-destructive">{{ aiConnectionTest.message }}</p>
            <p class="mt-4 text-xs leading-5 text-muted-foreground">{{ t('minecraftSkin.pixelGenerationConnectionHint') }}</p>
          </div>
          <div class="flex gap-2">
            <button type="button" class="flex-1 border border-blue bg-blue px-3 py-2 text-xs text-white transition-colors hover:border-foreground hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-50" :disabled="isGeneratingAiPart" @click="generateAiPart">{{ isGeneratingAiPart ? t('minecraftSkin.aiGenerating') : t('minecraftSkin.pixelGeneratePart') }}</button>
            <button v-if="isGeneratingAiPart" type="button" class="border border-line px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground" @click="cancelAiGeneration">{{ t('minecraftSkin.aiCancel') }}</button>
          </div>
          <p v-if="aiGenerationStatus" class="text-xs text-muted-foreground">{{ aiGenerationStatus }}</p>
          <div v-if="proposalCanvas" class="border-t border-line pt-3">
            <p class="text-xs leading-5 text-muted-foreground">{{ t('minecraftSkin.pixelProposalReady', { count: proposalResult?.changedPixels || 0 }) }}</p>
            <div class="mt-3 grid grid-cols-3 gap-2">
              <button type="button" class="border border-line px-2 py-2 text-xs text-muted-foreground transition-colors hover:border-blue hover:text-blue" @click="showProposal = !showProposal">{{ showProposal ? t('minecraftSkin.aiShowOriginal') : t('minecraftSkin.aiShowProposal') }}</button>
              <button type="button" class="border border-line px-2 py-2 text-xs text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground" @click="discardAiProposal">{{ t('minecraftSkin.aiDiscard') }}</button>
              <button type="button" class="border border-foreground bg-foreground px-2 py-2 text-xs text-background transition-colors hover:border-blue hover:bg-blue disabled:cursor-not-allowed disabled:opacity-60" :disabled="aiProposalApplied" @click="applyAiProposal">{{ aiProposalApplied ? t('minecraftSkin.aiAppliedLabel') : t('minecraftSkin.aiApplyProposal') }}</button>
            </div>
          </div>
        </div>
        <div v-if="aiRequestDiagnostic" class="mx-4 mb-4 border-t border-line pt-3 font-mono text-xs text-muted-foreground">
          <p class="tech">{{ t('minecraftSkin.devRequestDiagnostic') }}</p>
          <dl class="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            <dt>{{ t('minecraftSkin.devStatus') }}</dt><dd>{{ aiRequestDiagnostic.status }}</dd>
            <dt>{{ t('minecraftSkin.devTrace') }}</dt><dd class="truncate">{{ aiRequestDiagnostic.traceId || '—' }}</dd>
            <dt>{{ t('minecraftSkin.devProvider') }}</dt><dd>{{ aiRequestDiagnostic.code || '—' }}</dd>
            <dt>{{ t('minecraftSkin.devDetail') }}</dt><dd>{{ aiRequestDiagnostic.detail || '—' }}</dd>
          </dl>
        </div>
        <p v-if="aiGenerationError" class="border-l-2 border-blue px-4 py-2 text-xs leading-5 text-muted-foreground">{{ aiGenerationError }}</p>
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
import { ChevronDown, Download, Eraser, FilePlus2, FlipHorizontal, Grid3X3, Layers3, PaintBucket, Pencil, Pipette, Redo2, Sparkles, Undo2, Upload } from 'lucide-vue-next'
import jacoryLogo from '../assets/jacory-logo.png'
import StatusToast from '../components/StatusToast.vue'
import MinecraftSkinPreview from '../components/tools/minecraft-skin-editor/MinecraftSkinPreview.vue'
import ColorPickerPanel from '../components/tools/minecraft-skin-editor/ColorPickerPanel.vue'
import { createSkinCanvas, DEFAULT_ALEX_SKIN_DATA_URL, DEFAULT_STEVE_SKIN_DATA_URL, downloadCanvas, floodFillSkinFace, importSkinFile, mirrorSkinPixel } from '../components/tools/minecraft-skin-editor/skin-core'
import { applyPixelPartDesign, createPixelPartProposalCanvas, readPixelPartDesign, validatePixelPartDesign } from '../components/tools/minecraft-skin-editor/skin-part-generation'

const STORAGE_KEY = 'jacory-space.minecraft-skin-studio.project.v1'
const RECENT_COLORS_STORAGE_KEY = 'jacory-space.minecraft-skin-studio.recent-colors.v1'
const AI_CONNECTION_STORAGE_KEY = 'jacory-space.minecraft-skin-studio.ai-connection.v1'
const AI_MODEL_CATALOG_STORAGE_KEY = 'jacory-space.minecraft-skin-studio.ai-model-catalog.v1'
const MAX_RECENT_COLORS = 8
const MAX_CACHED_MODELS = 500
const modelIconImages = new Map()
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

const { t } = useI18n()
const fileInput = ref(null)
const referenceInput = ref(null)
const skinPreview = ref(null)
const modelSwitchIcon = ref(null)
const skinCanvas = ref(null)
const proposalCanvas = ref(null)
const proposalPlan = ref(null)
const proposalResult = ref(null)
const showProposal = ref(true)
const previewError = ref('')
const textureVersion = ref(0)
const model = ref('classic')
const activeLayer = ref('base')
const showOuterLayer = ref(false)
const activeTool = ref('brush')
const brushColor = ref('#0e66c8')
const brushOpacity = ref(1)
const isColorPanelOpen = ref(false)
const isLayerPanelOpen = ref(false)
const isAiPanelOpen = ref(false)
const isAiConnectionOpen = ref(false)
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
const aiGenerationError = ref('')
const aiProposalApplied = ref(false)
const visibleOuterParts = ref([])
const proposalPreviousOuterParts = ref(null)
const aiPrompt = ref('')
const aiUseVision = ref(true)
const aiReferenceImage = ref('')
const aiApiKey = ref('')
const aiBaseUrl = ref(import.meta.env.VITE_MC_AI_BASE_URL || '')
const aiModel = ref(import.meta.env.VITE_MC_AI_MODEL || '')
const aiModelCatalog = ref([])
const aiConnectionTest = ref(null)
const aiConnectionToastVisible = ref(false)
const aiConnectionToastMessage = ref('')
const savedAiConnection = ref(null)
const isTestingAiConnection = ref(false)
const isGeneratingAiPart = ref(false)
const aiGenerationStatus = ref('')
const aiRequestDiagnostic = ref(null)
let aiRequestController = null
let saveTimer
let aiConnectionToastTimer

const displayCanvas = computed(() => showProposal.value && proposalCanvas.value ? proposalCanvas.value : skinCanvas.value)
const aiConnectionConfigured = computed(() => Boolean(aiApiKey.value.trim() && aiBaseUrl.value.trim() && aiModel.value.trim()))
const aiConnectionStatus = computed(() => {
  if (!aiConnectionConfigured.value) return { label: t('minecraftSkin.aiConnectionNotConfigured'), className: 'text-haze', showDot: false }
  if (aiConnectionTest.value?.state === 'success') return { label: t('minecraftSkin.aiConnectionConnected'), className: 'text-blue', showDot: true }
  if (aiConnectionTest.value?.state === 'error') return { label: t('minecraftSkin.aiConnectionFailed'), className: 'text-destructive', showDot: false }
  if (aiConnectionDirty.value) return { label: t('minecraftSkin.aiConnectionUnsaved'), className: 'text-muted-foreground', showDot: false }
  return aiConnectionConfigured.value
    ? { label: savedAiConnection.value ? t('minecraftSkin.aiConnectionSaved') : t('minecraftSkin.aiConnectionConfigured'), className: 'text-blue', showDot: false }
    : { label: t('minecraftSkin.aiConnectionNotConfigured'), className: 'text-haze', showDot: false }
})
const aiConnectionDirty = computed(() => JSON.stringify(currentAiConnection()) !== JSON.stringify(savedAiConnection.value))
const nextModelLabel = computed(() => model.value === 'classic' ? t('minecraftSkin.switchToSlim') : t('minecraftSkin.switchToClassic'))

const tools = computed(() => [
  { id: 'brush', label: t('minecraftSkin.brush'), icon: Pencil },
  { id: 'eraser', label: t('minecraftSkin.eraser'), icon: Eraser },
  { id: 'fill', label: t('minecraftSkin.fill'), icon: PaintBucket },
  { id: 'eyedropper', label: t('minecraftSkin.eyedropper'), icon: Pipette },
])
const skinParts = computed(() => [
  { id: 'head', label: t('minecraftSkin.aiPartHead') },
  { id: 'body', label: t('minecraftSkin.aiPartBody') },
  { id: 'rightArm', label: t('minecraftSkin.aiPartRightArm') },
  { id: 'leftArm', label: t('minecraftSkin.aiPartLeftArm') },
  { id: 'rightLeg', label: t('minecraftSkin.aiPartRightLeg') },
  { id: 'leftLeg', label: t('minecraftSkin.aiPartLeftLeg') }
])
const allOuterPartsSelected = computed(() => skinParts.value.every((part) => visibleOuterParts.value.includes(part.id)))
function toolButtonClass(active) {
  return ['flex h-11 w-11 items-center justify-center transition-colors', active ? 'bg-blue text-white' : 'text-muted-foreground hover:bg-background hover:text-foreground']
}

function toggleOuterPart(partName) {
  visibleOuterParts.value = visibleOuterParts.value.includes(partName)
    ? visibleOuterParts.value.filter((part) => part !== partName)
    : [...visibleOuterParts.value, partName]
  textureVersion.value += 1
}

function toggleAllOuterParts() {
  visibleOuterParts.value = allOuterPartsSelected.value ? [] : skinParts.value.map((part) => part.id)
  textureVersion.value += 1
}

function showAllOuterLayers() {
  showOuterLayer.value = true
  visibleOuterParts.value = skinParts.value.map((part) => part.id)
  textureVersion.value += 1
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
  isLayerPanelOpen.value = false
  isAiPanelOpen.value = false
}

function toggleLayerPanel() {
  isLayerPanelOpen.value = !isLayerPanelOpen.value
  isColorPanelOpen.value = false
  isAiPanelOpen.value = false
}

function toggleModel() {
  model.value = model.value === 'classic' ? 'slim' : 'classic'
}

function drawModelSwitchIcon() {
  const icon = modelSwitchIcon.value
  if (!icon) return
  const modelId = model.value
  const source = modelId === 'classic' ? DEFAULT_STEVE_SKIN_DATA_URL : DEFAULT_ALEX_SKIN_DATA_URL
  const cachedImage = modelIconImages.get(modelId)
  if (!cachedImage) {
    const image = new Image()
    image.onload = () => {
      modelIconImages.set(modelId, image)
      if (model.value === modelId) drawModelSwitchIcon()
    }
    image.src = source
    return
  }
  const context = icon.getContext('2d')
  context.clearRect(0, 0, icon.width, icon.height)
  context.imageSmoothingEnabled = false
  context.drawImage(cachedImage, 8, 8, 8, 8, 0, 0, icon.width, icon.height)
}

function toggleAiPanel() {
  const isOpening = !isAiPanelOpen.value
  isAiPanelOpen.value = isOpening
  isLayerPanelOpen.value = false
  isColorPanelOpen.value = false
  if (isOpening) isAiConnectionOpen.value = false
  aiGenerationError.value = ''
}

function closeAiPanel() {
  isAiPanelOpen.value = false
  isAiConnectionOpen.value = false
}

function handleReferenceImage(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    aiReferenceImage.value = typeof reader.result === 'string' ? reader.result : ''
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}

function discardAiProposal() {
  proposalCanvas.value = null
  proposalPlan.value = null
  proposalResult.value = null
  aiProposalApplied.value = false
  visibleOuterParts.value = proposalPreviousOuterParts.value || []
  proposalPreviousOuterParts.value = null
  showProposal.value = false
  textureVersion.value += 1
}

function applyAiProposal() {
  if (!proposalPlan.value || aiProposalApplied.value) return
  aiGenerationError.value = ''
  try {
    applyPixelPartDesign(skinCanvas.value, proposalPlan.value, { expectedPart: 'rightArm' })
    aiProposalApplied.value = true
    showProposal.value = true
    redraw()
  } catch (error) {
    aiGenerationError.value = error instanceof Error ? error.message : String(error)
  }
}

function buildPixelPartUserContent() {
  const sourceCanvas = proposalCanvas.value || skinCanvas.value
  const text = JSON.stringify({
    request: aiPrompt.value.trim(),
    target: {
      part: 'rightArm',
      model: 'classic',
      layers: ['base', 'outer'],
      goal: 'Design the entire right-arm garment as coherent pixel art. Return a replacement texture for this part only.'
    },
    currentRightArm: readPixelPartDesign(sourceCanvas, 'rightArm', 'classic'),
    revision: proposalCanvas.value ? 'This is a refinement request. Replace the current right arm according to the new request.' : 'This is the first generation request.'
  })
  if (!aiUseVision.value) return text
  const content = [{ type: 'text', text }]
  const preview = skinPreview.value?.capturePreview?.()
  if (preview) content.push({ type: 'image_url', image_url: { url: preview, detail: 'low' } })
  if (sourceCanvas) content.push({ type: 'image_url', image_url: { url: sourceCanvas.toDataURL('image/png'), detail: 'low' } })
  if (aiReferenceImage.value) content.push({ type: 'image_url', image_url: { url: aiReferenceImage.value, detail: 'low' } })
  return content
}

function normalizeAiBaseUrl(baseUrl) {
  return baseUrl.trim().replace(/\/+$/, '').replace(/\/chat\/completions$/, '').replace(/\/models$/, '')
}

function normalizeAiEndpoint(baseUrl) {
  return `${normalizeAiBaseUrl(baseUrl)}/chat/completions`
}

function normalizeAiModelsEndpoint(baseUrl) {
  return `${normalizeAiBaseUrl(baseUrl)}/models`
}

function currentAiConnection() {
  return {
    apiKey: aiApiKey.value.trim(),
    baseUrl: aiBaseUrl.value.trim(),
    model: aiModel.value.trim()
  }
}

function restoreAiConnectionCache() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(AI_CONNECTION_STORAGE_KEY) || 'null')
    if (!saved || typeof saved !== 'object') return
    if (typeof saved.apiKey !== 'string' || typeof saved.baseUrl !== 'string' || typeof saved.model !== 'string') return
    aiApiKey.value = saved.apiKey
    aiBaseUrl.value = saved.baseUrl
    aiModel.value = saved.model
    savedAiConnection.value = currentAiConnection()
  } catch {
    // Connection settings are optional when browser storage is unavailable.
  }
}

function saveAiConnectionSettings() {
  if (!aiConnectionConfigured.value) {
    aiConnectionTest.value = { state: 'error', message: t('minecraftSkin.aiConfigRequired') }
    return
  }
  try {
    const connection = currentAiConnection()
    window.localStorage.setItem(AI_CONNECTION_STORAGE_KEY, JSON.stringify(connection))
    savedAiConnection.value = connection
    showAiConnectionToast(t('minecraftSkin.aiConnectionSavedNotice'))
  } catch {
    aiConnectionTest.value = { state: 'error', message: t('minecraftSkin.aiConnectionSaveFailed') }
  }
}

function showAiConnectionToast(message) {
  window.clearTimeout(aiConnectionToastTimer)
  aiConnectionToastVisible.value = false
  aiConnectionToastMessage.value = message
  window.requestAnimationFrame(() => {
    aiConnectionToastVisible.value = true
    aiConnectionToastTimer = window.setTimeout(() => {
      aiConnectionToastVisible.value = false
    }, 2800)
  })
}

function restoreAiModelCatalog() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(AI_MODEL_CATALOG_STORAGE_KEY) || 'null')
    if (!saved || normalizeAiBaseUrl(saved.baseUrl || '') !== normalizeAiBaseUrl(aiBaseUrl.value)) return
    aiModelCatalog.value = Array.isArray(saved.models)
      ? saved.models.filter((modelId) => typeof modelId === 'string' && modelId.trim()).slice(0, MAX_CACHED_MODELS)
      : []
  } catch {
    aiModelCatalog.value = []
  }
}

function saveAiModelCatalog(models) {
  const normalizedModels = [...new Set(models.filter((modelId) => typeof modelId === 'string' && modelId.trim()))]
    .sort((left, right) => left.localeCompare(right))
    .slice(0, MAX_CACHED_MODELS)
  aiModelCatalog.value = normalizedModels
  try {
    window.localStorage.setItem(AI_MODEL_CATALOG_STORAGE_KEY, JSON.stringify({
      baseUrl: normalizeAiBaseUrl(aiBaseUrl.value),
      models: normalizedModels,
      testedAt: new Date().toISOString()
    }))
  } catch {
    // The model catalog is a convenience only.
  }
}

function isVisionModel(modelName) {
  return /(?:vl|vision|omni|glm-[\d.]+v|deepseek[-_]?vl|step3)/i.test(modelName)
}

function supportsJsonMode(modelName) {
  return !isVisionModel(modelName) || /^Qwen\/Qwen3-VL-/i.test(modelName)
}

function createPixelPartRequestPayload(modelName, messages) {
  return {
    model: modelName,
    temperature: 0.35,
    max_tokens: 8192,
    stream: false,
    ...(supportsJsonMode(modelName) ? { response_format: { type: 'json_object' } } : {}),
    messages
  }
}

function formatAiGenerationError(error) {
  const message = error instanceof Error ? error.message : String(error || '')
  if (/not a vlm|vision language model|text-only prompts/i.test(message)) return t('minecraftSkin.aiVisionUnsupported')
  if (/truncated|output limit/i.test(message)) return t('minecraftSkin.aiPlanTruncated')
  if (/reasoning but no final|did not contain a pixel design/i.test(message)) return t('minecraftSkin.pixelGenerationNoContent')
  if (/json|design|palette|layers|face|row|pixel/i.test(message)) return t('minecraftSkin.pixelGenerationInvalid')
  return t('minecraftSkin.aiGenerationFailed')
}

function sanitizeDiagnosticDetail(value) {
  return String(value || '')
    .replace(/Bearer\s+\S+/gi, 'Bearer [redacted]')
    .replace(/sk-[\w-]+/gi, '[redacted]')
    .replace(/\s+/g, ' ')
    .slice(0, 180)
}

function recordAiDiagnostic(partial) {
  aiRequestDiagnostic.value = {
    model: aiModel.value.trim(),
    ...aiRequestDiagnostic.value,
    ...partial
  }
}

async function testAiConnection() {
  aiConnectionTest.value = null
  if (!aiApiKey.value.trim()) {
    aiConnectionTest.value = { state: 'error', message: t('minecraftSkin.aiApiKeyRequired') }
    return
  }
  if (!aiBaseUrl.value.trim() || !aiModel.value.trim()) {
    aiConnectionTest.value = { state: 'error', message: t('minecraftSkin.aiConfigRequired') }
    return
  }
  isTestingAiConnection.value = true
  try {
    const response = await fetch(normalizeAiModelsEndpoint(aiBaseUrl.value), {
      headers: { Authorization: `Bearer ${aiApiKey.value.trim()}` }
    })
    const traceId = response.headers.get('x-siliconcloud-trace-id') || ''
    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      const providerError = payload?.error || payload || {}
      const detail = providerError.message || payload?.message || `HTTP ${response.status}`
      aiConnectionTest.value = { state: 'error', message: t('minecraftSkin.aiConnectionTestFailed', { detail: sanitizeDiagnosticDetail(detail) }) }
      recordAiDiagnostic({ status: response.status, traceId, code: providerError.code || providerError.type || 'connection_test_failed', detail: sanitizeDiagnosticDetail(detail) })
      return
    }
    const modelIds = Array.isArray(payload?.data) ? payload.data.map((entry) => entry?.id).filter(Boolean) : []
    saveAiModelCatalog(modelIds)
    const modelFound = modelIds.includes(aiModel.value.trim())
    aiConnectionTest.value = {
      state: modelFound ? 'success' : 'error',
      message: modelFound ? '' : t('minecraftSkin.aiConnectionTestModelMissing')
    }
    if (modelFound) showAiConnectionToast(t('minecraftSkin.aiConnectionTestSuccess'))
    recordAiDiagnostic({ status: response.status, traceId, code: modelFound ? 'connection_test_passed' : 'connection_test_model_missing', detail: `Loaded ${modelIds.length} models from /models.` })
  } catch (error) {
    const detail = sanitizeDiagnosticDetail(error instanceof Error ? error.message : String(error))
    aiConnectionTest.value = { state: 'error', message: t('minecraftSkin.aiConnectionTestFailed', { detail }) }
    recordAiDiagnostic({ status: 'network', code: 'connection_test_network_error', detail })
  } finally {
    isTestingAiConnection.value = false
  }
}

async function requestPixelPartContent(modelName, messages) {
  const requestPayload = createPixelPartRequestPayload(modelName, messages)
  const response = await fetch(normalizeAiEndpoint(aiBaseUrl.value), {
    method: 'POST',
    signal: aiRequestController.signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${aiApiKey.value.trim()}`
    },
    body: JSON.stringify(requestPayload)
  })
  const traceId = response.headers.get('x-siliconcloud-trace-id') || ''
  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const providerError = payload?.error || payload || {}
    const detail = providerError.message || payload?.message || `HTTP ${response.status}`
    recordAiDiagnostic({ status: response.status, traceId, code: providerError.code || providerError.type || 'request_failed', detail: sanitizeDiagnosticDetail(detail) })
    throw new Error(detail)
  }
  aiGenerationStatus.value = t('minecraftSkin.aiWaitingResponse')
  const payload = await response.json().catch(() => null)
  const choice = payload?.choices?.[0] || {}
  const message = choice.message || {}
  const content = typeof message.content === 'string' ? message.content.trim() : ''
  const reasoning = typeof message.reasoning_content === 'string' ? message.reasoning_content.trim() : ''
  const finishReason = choice.finish_reason || ''
  if (finishReason === 'length') {
    recordAiDiagnostic({ status: response.status, traceId, code: 'response_truncated', detail: `The model reached its output limit after ${content.length} final-content characters.` })
    throw new Error('AI response was truncated because it reached the output limit.')
  }
  if (!content) {
    recordAiDiagnostic({
      status: response.status,
      traceId,
      code: reasoning ? 'reasoning_without_content' : 'empty_model_content',
      detail: reasoning ? 'The model returned reasoning but no final content.' : 'The response did not contain choices[0].message.content.'
    })
    throw new Error(reasoning ? 'AI response contained reasoning but no final pixel design.' : 'AI response did not contain a pixel design.')
  }
  recordAiDiagnostic({ status: response.status, traceId, code: 'response_complete', detail: `Complete JSON response; final content ${content.length} characters.` })
  return content
}

function parsePixelPartDesign(content) {
  const normalized = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  return JSON.parse(normalized)
}

function inspectPixelPartResponse(stage, content) {
  console.groupCollapsed(`[Minecraft Skin AI] ${stage} response (${content.length} chars)`)
  console.log('Raw model content:', content)
  try {
    const design = parsePixelPartDesign(content)
    const validation = validatePixelPartDesign(design, { expectedPart: 'rightArm' })
    console.log('Parsed pixel design:', design)
    if (validation.valid) console.info('Pixel protocol validation: passed')
    else console.error('Pixel protocol validation errors:', validation.errors)
  } catch (error) {
    console.error('Pixel response JSON parse error:', error)
  }
  console.groupEnd()
}

function decodePixelPartDesign(content) {
  const design = parsePixelPartDesign(content)
  const validation = validatePixelPartDesign(design, { expectedPart: 'rightArm' })
  if (!validation.valid) throw new Error(validation.errors.join('; '))
  return design
}

function previewPixelPartDesign(design) {
  const proposal = createPixelPartProposalCanvas(skinCanvas.value, design, { expectedPart: 'rightArm' })
  if (!proposalCanvas.value) proposalPreviousOuterParts.value = [...visibleOuterParts.value]
  visibleOuterParts.value = [...new Set([...visibleOuterParts.value, 'rightArm'])]
  showOuterLayer.value = true
  proposalCanvas.value = proposal.canvas
  proposalPlan.value = design
  proposalResult.value = proposal
  aiProposalApplied.value = false
  showProposal.value = true
  textureVersion.value += 1
}

async function generateAiPart() {
  aiGenerationError.value = ''
  aiGenerationStatus.value = ''
  aiRequestDiagnostic.value = null
  if (!aiPrompt.value.trim()) {
    aiGenerationError.value = t('minecraftSkin.aiPromptRequired')
    return
  }
  if (!aiApiKey.value.trim()) {
    aiGenerationError.value = t('minecraftSkin.aiApiKeyRequired')
    return
  }
  if (!aiBaseUrl.value.trim() || !aiModel.value.trim()) {
    aiGenerationError.value = t('minecraftSkin.aiConfigRequired')
    return
  }
  if (model.value !== 'classic') {
    aiGenerationError.value = t('minecraftSkin.pixelGenerationClassicOnly')
    return
  }
  if (aiUseVision.value && !isVisionModel(aiModel.value.trim())) {
    aiGenerationError.value = t('minecraftSkin.aiVisionUnsupported')
    return
  }
  isGeneratingAiPart.value = true
  aiGenerationStatus.value = t('minecraftSkin.aiConnecting')
  aiRequestController = new AbortController()
  try {
    const modelName = aiModel.value.trim()
    const userContent = buildPixelPartUserContent()
    const messages = [
      { role: 'system', content: PIXEL_PART_SYSTEM_PROMPT },
      { role: 'user', content: userContent }
    ]
    const content = await requestPixelPartContent(modelName, messages)
    inspectPixelPartResponse('Initial', content)
    let design
    try {
      design = decodePixelPartDesign(content)
    } catch (error) {
      recordAiDiagnostic({ code: 'repairing_pixel_protocol', detail: sanitizeDiagnosticDetail(error.message) })
      aiGenerationStatus.value = t('minecraftSkin.pixelGenerationRepairing')
      const repaired = await requestPixelPartContent(modelName, [
        { role: 'system', content: PIXEL_PART_SYSTEM_PROMPT },
        {
          role: 'user',
          content: JSON.stringify({
            task: 'Repair the invalid JSON below. Keep the requested right-arm design, but return a complete valid pixel design matching the system schema exactly.',
            validationError: error instanceof Error ? error.message : String(error),
            invalidResponse: content
          })
        }
      ])
      inspectPixelPartResponse('Repair', repaired)
      design = decodePixelPartDesign(repaired)
    }
    previewPixelPartDesign(design)
  } catch (error) {
    if (error?.name === 'AbortError') {
      aiGenerationError.value = t('minecraftSkin.aiCancelled')
    } else if (error instanceof TypeError) {
      recordAiDiagnostic({ status: 'network', code: 'network_error', detail: sanitizeDiagnosticDetail(error.message) })
      aiGenerationError.value = t('minecraftSkin.aiNetworkError')
    } else {
      if (!aiRequestDiagnostic.value) recordAiDiagnostic({ status: 'client', code: 'client_error', detail: sanitizeDiagnosticDetail(error?.message) })
      aiGenerationError.value = formatAiGenerationError(error)
    }
  } finally {
    isGeneratingAiPart.value = false
    aiGenerationStatus.value = ''
    aiRequestController = null
  }
}

function cancelAiGeneration() {
  aiRequestController?.abort()
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
  discardAiProposal()
  showAllOuterLayers()
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
  if (proposalCanvas.value) return
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
  const isErasing = activeTool.value === 'eraser'
  if (activeTool.value === 'fill') {
    floodFillSkinFace(skinCanvas.value, { x, y }, activeLayer.value, color)
    if (mirrorEnabled.value) {
      const mirrorPixel = mirrorSkinPixel({ x, y }, activeLayer.value)
      if (mirrorPixel && (mirrorPixel.x !== x || mirrorPixel.y !== y)) floodFillSkinFace(skinCanvas.value, mirrorPixel, activeLayer.value, color)
    }
  } else {
    if (isErasing) context.clearRect(x, y, 1, 1)
    else {
      context.fillStyle = color
      context.fillRect(x, y, 1, 1)
    }
    if (mirrorEnabled.value) {
      const mirrorPixel = mirrorSkinPixel({ x, y }, activeLayer.value)
      if (mirrorPixel && (mirrorPixel.x !== x || mirrorPixel.y !== y)) {
        if (isErasing) context.clearRect(mirrorPixel.x, mirrorPixel.y, 1, 1)
        else context.fillRect(mirrorPixel.x, mirrorPixel.y, 1, 1)
      }
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
  if (proposalCanvas.value) return
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
    discardAiProposal()
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
    restoreAiConnectionCache()
    restoreAiModelCatalog()
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
    drawModelSwitchIcon()
    redraw()
  } catch (error) {
    handlePreviewError(error)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyboardShortcut)
  window.removeEventListener('pagehide', saveProject)
  window.clearTimeout(saveTimer)
  window.clearTimeout(aiConnectionToastTimer)
  saveProject()
})

watch(model, drawModelSwitchIcon, { flush: 'post' })
watch([model, activeLayer, brushColor, brushOpacity, mirrorEnabled], scheduleProjectSave)
watch(aiBaseUrl, () => {
  restoreAiModelCatalog()
})
watch([aiApiKey, aiBaseUrl, aiModel], () => {
  aiConnectionTest.value = null
})
</script>

<style scoped>
.image-render-pixel {
  image-rendering: pixelated;
}
</style>
