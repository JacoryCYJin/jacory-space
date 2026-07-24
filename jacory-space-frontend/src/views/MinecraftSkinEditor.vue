<template>
  <main class="relative min-h-dvh overflow-hidden bg-background text-foreground">
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
        <button v-if="isDevToolsEnabled" type="button" :aria-label="t('minecraftSkin.devTests')" :class="toolButtonClass(isDevPanelOpen)" @mouseenter="showToolTooltip(t('minecraftSkin.devTests'), $event)" @mouseleave="hideToolTooltip" @click="toggleDevPanel"><Code2 class="h-4 w-4" /></button>
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
            <button type="button" :aria-pressed="showOuterLayer" :class="['flex h-10 items-center justify-center gap-2 text-xs transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-inset', showOuterLayer ? 'text-blue' : 'text-muted-foreground hover:text-foreground']" @click="showOuterLayer = true">
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

      <section v-if="isAiPanelOpen || (isDevToolsEnabled && isDevPanelOpen)" class="pointer-events-auto absolute left-20 top-20 z-20 w-[min(23rem,calc(100vw-6.5rem))] border border-line bg-card/95 backdrop-blur-sm">
        <div class="flex h-12 items-center justify-between border-b border-line px-4">
          <p class="tech">{{ isDevPanelOpen ? 'DEV / JSON' : t('minecraftSkin.aiEdit') }}</p>
          <button v-if="isAiPanelOpen" type="button" class="text-xs text-muted-foreground transition-colors hover:text-foreground" @click="closeAiPanel">{{ t('minecraftSkin.close') }}</button>
        </div>
        <div v-if="isDevPanelOpen" class="px-4 pt-4">
          <p class="text-sm text-foreground">{{ t('minecraftSkin.devTestsTitle') }}</p>
          <p class="mt-2 text-xs leading-5 text-muted-foreground">{{ t('minecraftSkin.devTestsHint') }}</p>
        </div>
        <div v-if="isDevPanelOpen" class="mt-3 grid grid-cols-2 gap-2 px-4">
          <button v-for="test in devTests" :key="test.id" type="button" class="border border-line px-3 py-2 text-left font-mono text-xs text-muted-foreground transition-colors hover:border-blue hover:text-blue" @click="loadDevTest(test)">{{ test.label }}</button>
        </div>
        <div v-if="isAiPanelOpen" class="space-y-3 p-4">
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
              <span :class="['font-mono text-xs', aiConnectionConfigured ? 'text-blue' : 'text-haze']">{{ aiConnectionConfigured ? t('minecraftSkin.aiConnectionConfigured') : t('minecraftSkin.aiConnectionNotConfigured') }}</span>
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
              <input v-model="aiModel" type="text" class="mt-1 w-full border-b border-line bg-transparent pb-2 font-mono text-xs text-foreground outline-none transition-colors placeholder:text-haze focus:border-blue" :placeholder="t('minecraftSkin.aiModelPlaceholder')" />
            </label>
            <p class="mt-4 text-xs leading-5 text-muted-foreground">{{ aiUseVision ? t('minecraftSkin.aiVisionModelHint') : t('minecraftSkin.aiTextModelHint') }}</p>
          </div>
          <div class="flex gap-2">
            <button type="button" class="flex-1 border border-blue bg-blue px-3 py-2 text-xs text-white transition-colors hover:border-foreground hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-50" :disabled="isGeneratingAiPlan" @click="generateAiPlan">{{ isGeneratingAiPlan ? t('minecraftSkin.aiGenerating') : t('minecraftSkin.aiGenerate') }}</button>
            <button v-if="isGeneratingAiPlan" type="button" class="border border-line px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground" @click="cancelAiGeneration">{{ t('minecraftSkin.aiCancel') }}</button>
          </div>
          <p v-if="aiGenerationStatus" class="text-xs text-muted-foreground">{{ aiGenerationStatus }}</p>
          <div v-if="proposalCanvas" class="border-t border-line pt-3">
            <p class="text-xs leading-5 text-muted-foreground">{{ t('minecraftSkin.aiProposalReady', { targets: proposalResult?.targets.join(', '), layers: proposalResult?.layers.join(', ') }) }}</p>
            <div class="mt-3 grid grid-cols-3 gap-2">
              <button type="button" class="border border-line px-2 py-2 text-xs text-muted-foreground transition-colors hover:border-blue hover:text-blue" @click="showProposal = !showProposal">{{ showProposal ? t('minecraftSkin.aiShowOriginal') : t('minecraftSkin.aiShowProposal') }}</button>
              <button type="button" class="border border-line px-2 py-2 text-xs text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground" @click="discardAiProposal">{{ t('minecraftSkin.aiDiscard') }}</button>
              <button type="button" class="border border-foreground bg-foreground px-2 py-2 text-xs text-background transition-colors hover:border-blue hover:bg-blue disabled:cursor-not-allowed disabled:opacity-60" :disabled="aiProposalApplied" @click="applyAiProposal">{{ aiProposalApplied ? t('minecraftSkin.aiAppliedLabel') : t('minecraftSkin.aiApplyProposal') }}</button>
            </div>
          </div>
        </div>
        <template v-else>
          <div class="px-4 pb-4">
          <textarea v-model="aiPlanText" class="mt-3 h-64 w-full resize-y border border-line bg-background p-3 font-mono text-xs leading-5 text-foreground outline-none transition-colors focus:border-blue" spellcheck="false" :placeholder="t('minecraftSkin.aiEditPlaceholder')" />
          <div class="mt-3 flex flex-wrap justify-between gap-2">
            <button type="button" class="border border-line px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-blue hover:text-blue" @click="loadAiExample">{{ t('minecraftSkin.aiLoadExample') }}</button>
            <div class="flex gap-2">
              <button type="button" class="border border-line px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground" @click="aiPlanText = ''; aiPlanError = ''; aiPlanResult = null">{{ t('minecraftSkin.aiClear') }}</button>
              <button type="button" class="border border-foreground bg-foreground px-3 py-2 text-xs text-background transition-colors hover:border-blue hover:bg-blue" @click="runAiPlan">{{ t('minecraftSkin.aiValidateApply') }}</button>
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
        </template>
        <p v-if="aiPlanError" :class="['border-l-2 px-4 py-2 text-xs leading-5', isDevPanelOpen ? 'border-destructive text-destructive' : 'border-blue text-muted-foreground']">{{ aiPlanError }}</p>
        <p v-if="aiPlanResult && isDevPanelOpen" class="border-l-2 border-blue px-4 py-2 text-xs leading-5 text-blue">{{ t('minecraftSkin.aiApplied', { count: aiPlanResult.changedPixels, targets: aiPlanResult.targets.join(', '), layers: aiPlanResult.layers.join(', ') }) }}</p>
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
import { ChevronDown, Code2, Download, FilePlus2, FlipHorizontal, Grid3X3, Layers3, PaintBucket, Pencil, Pipette, Redo2, Sparkles, Undo2, Upload } from 'lucide-vue-next'
import jacoryLogo from '../assets/jacory-logo.png'
import MinecraftSkinPreview from '../components/tools/minecraft-skin-editor/MinecraftSkinPreview.vue'
import ColorPickerPanel from '../components/tools/minecraft-skin-editor/ColorPickerPanel.vue'
import { createSkinCanvas, DEFAULT_ALEX_SKIN_DATA_URL, DEFAULT_STEVE_SKIN_DATA_URL, downloadCanvas, floodFillSkinFace, importSkinFile, mirrorSkinPixel } from '../components/tools/minecraft-skin-editor/skin-core'
import { applyAiSkinEditPlan, createAiSkinProposalCanvas, validateAiSkinEditPlan } from '../components/tools/minecraft-skin-editor/skin-operations'

const STORAGE_KEY = 'jacory-space.minecraft-skin-studio.project.v1'
const RECENT_COLORS_STORAGE_KEY = 'jacory-space.minecraft-skin-studio.recent-colors.v1'
const MAX_RECENT_COLORS = 8
const modelIconImages = new Map()
const isDevToolsEnabled = import.meta.env.DEV

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
const isDevPanelOpen = ref(false)
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
const aiPlanError = ref('')
const aiPlanResult = ref(null)
const aiProposalApplied = ref(false)
const visibleOuterParts = ref([])
const proposalPreviousOuterParts = ref(null)
const aiPrompt = ref('把右臂改成红色护甲，保留头部和身体。')
const aiUseVision = ref(true)
const aiReferenceImage = ref('')
const aiApiKey = ref('')
const aiBaseUrl = ref(import.meta.env.DEV ? import.meta.env.VITE_MC_AI_BASE_URL || '' : '')
const aiModel = ref(import.meta.env.DEV ? import.meta.env.VITE_MC_AI_MODEL || '' : '')
const isGeneratingAiPlan = ref(false)
const aiGenerationStatus = ref('')
const aiRequestDiagnostic = ref(null)
let aiRequestController = null
const aiPlanText = ref(JSON.stringify({
  operations: [
    {
      type: 'style',
      pattern: 'armor',
      layer: 'outer',
      targets: ['rightArm'],
      palette: { base: '#7f2f37', shadow: '#4a1820', highlight: '#c85b5b', accent: '#e8b3a7' }
    }
  ],
  preserve: ['head', 'body', 'leftArm', 'rightLeg', 'leftLeg']
}, null, 2))
let saveTimer

const displayCanvas = computed(() => showProposal.value && proposalCanvas.value ? proposalCanvas.value : skinCanvas.value)
const aiConnectionConfigured = computed(() => Boolean(aiApiKey.value.trim() && aiBaseUrl.value.trim() && aiModel.value.trim()))
const nextModelLabel = computed(() => model.value === 'classic' ? t('minecraftSkin.switchToSlim') : t('minecraftSkin.switchToClassic'))

const tools = computed(() => [
  { id: 'brush', label: t('minecraftSkin.brush'), icon: Pencil },
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
const devTests = computed(() => [
  {
    id: 'base-palette',
    label: t('minecraftSkin.devBasePalette'),
    plan: { operations: [{ type: 'palette', layer: 'base', targets: ['rightArm'], replacements: [{ from: '#b9795c', to: '#7f2f37' }, { from: '#16aab1', to: '#14243a' }] }], preserve: ['head'] }
  },
  {
    id: 'outer-patch',
    label: t('minecraftSkin.devOuterPatch'),
    plan: { operations: [{ type: 'patch', layer: 'outer', targets: ['rightArm'], pixels: [{ x: 44, y: 36, color: '#9ab8c7' }, { x: 45, y: 36, color: '#9ab8c7' }, { x: 46, y: 36, color: '#315c7a' }] }], preserve: ['head'] }
  },
  {
    id: 'mirror',
    label: t('minecraftSkin.devMirrorOuter'),
    plan: { operations: [{ type: 'mirror', layer: 'outer', targets: ['rightArm'] }], preserve: ['head'] }
  },
  {
    id: 'clear',
    label: t('minecraftSkin.devClearOuter'),
    plan: { operations: [{ type: 'clear', layer: 'outer', targets: ['rightArm'] }], preserve: ['head'] }
  },
  {
    id: 'style-armor',
    label: t('minecraftSkin.devStyleArmor'),
    plan: { operations: [{ type: 'style', pattern: 'armor', layer: 'outer', targets: ['rightArm'], palette: { base: '#7f2f37', shadow: '#4a1820', highlight: '#c85b5b', accent: '#e8b3a7' } }], preserve: ['head'] }
  },
  {
    id: 'preserve-error',
    label: t('minecraftSkin.devPreserveError'),
    plan: { operations: [{ type: 'clear', layer: 'base', targets: ['head'] }], preserve: ['head'] }
  },
  {
    id: 'missing-layer-error',
    label: t('minecraftSkin.devMissingLayer'),
    plan: { operations: [{ type: 'clear', targets: ['rightArm'] }], preserve: [] }
  }
])
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
  isDevPanelOpen.value = false
}

function toggleLayerPanel() {
  isLayerPanelOpen.value = !isLayerPanelOpen.value
  isColorPanelOpen.value = false
  isAiPanelOpen.value = false
  isDevPanelOpen.value = false
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
  isDevPanelOpen.value = false
  if (isOpening) isAiConnectionOpen.value = false
  aiPlanError.value = ''
  aiPlanResult.value = null
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

function toggleDevPanel() {
  if (!isDevToolsEnabled) return
  isDevPanelOpen.value = !isDevPanelOpen.value
  isLayerPanelOpen.value = false
  isColorPanelOpen.value = false
  isAiPanelOpen.value = false
  aiPlanError.value = ''
  aiPlanResult.value = null
}

function loadDevTest(test) {
  aiPlanText.value = JSON.stringify(test.plan, null, 2)
  aiPlanError.value = ''
  aiPlanResult.value = null
}

function loadAiExample() {
  aiPlanText.value = JSON.stringify({
    operations: [
      {
        type: 'style',
        pattern: 'armor',
        layer: 'outer',
        targets: ['rightArm'],
        palette: { base: '#7f2f37', shadow: '#4a1820', highlight: '#c85b5b', accent: '#e8b3a7' }
      }
    ],
    preserve: ['head', 'body', 'leftArm', 'rightLeg', 'leftLeg']
  }, null, 2)
  aiPlanError.value = ''
  aiPlanResult.value = null
}

function runAiPlan() {
  aiPlanError.value = ''
  aiPlanResult.value = null
  try {
    const plan = JSON.parse(aiPlanText.value)
    aiPlanResult.value = applyAiPlan(plan)
  } catch (error) {
    aiPlanError.value = error instanceof Error ? error.message : String(error)
  }
}

function previewAiPlan(plan) {
  if (!skinCanvas.value) throw new Error('Skin canvas is not ready.')
  const validation = validateAiSkinEditPlan(plan)
  if (!validation.valid) throw new Error(validation.errors.join('; '))
  const proposal = createAiSkinProposalCanvas(skinCanvas.value, plan)
  if (!proposalCanvas.value) proposalPreviousOuterParts.value = [...visibleOuterParts.value]
  const proposalOuterParts = plan.operations
    .filter((operation) => operation.layer === 'outer')
    .flatMap((operation) => operation.targets || (operation.target ? [operation.target] : []))
  visibleOuterParts.value = [...new Set([...visibleOuterParts.value, ...proposalOuterParts])]
  proposalCanvas.value = proposal.canvas
  proposalPlan.value = plan
  proposalResult.value = proposal
  aiProposalApplied.value = false
  showProposal.value = true
  textureVersion.value += 1
  return proposal
}

function previewAiPlanFromText() {
  aiPlanError.value = ''
  try {
    previewAiPlan(JSON.parse(aiPlanText.value))
  } catch (error) {
    aiPlanError.value = error instanceof Error ? error.message : String(error)
  }
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
  aiPlanError.value = ''
  try {
    aiPlanResult.value = applyAiPlan(proposalPlan.value)
    aiProposalApplied.value = true
    showProposal.value = true
    textureVersion.value += 1
  } catch (error) {
    aiPlanError.value = error instanceof Error ? error.message : String(error)
  }
}

function collectSkinAiContext() {
  const context = skinCanvas.value?.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Skin canvas is not ready.')
  const image = context.getImageData(0, 0, 64, 64)
  const colors = new Map()
  for (let offset = 0; offset < image.data.length; offset += 4) {
    const alpha = image.data[offset + 3]
    if (!alpha) continue
    const color = `#${[image.data[offset], image.data[offset + 1], image.data[offset + 2]].map((value) => value.toString(16).padStart(2, '0')).join('')}`
    colors.set(color, (colors.get(color) || 0) + 1)
  }
  return {
    model: model.value,
    resolution: 64,
    layers: ['base', 'outer'],
    activeLayer: activeLayer.value,
    bodyParts: ['head', 'body', 'rightArm', 'leftArm', 'rightLeg', 'leftLeg'],
    dominantColors: [...colors.entries()].sort((first, second) => second[1] - first[1]).slice(0, 12).map(([color]) => color),
    bodyPartNames: {
      head: '头部', body: '身体', rightArm: '右臂', leftArm: '左臂', rightLeg: '右腿', leftLeg: '左腿'
    }
  }
}

function buildAiUserContent() {
  const text = JSON.stringify({
    request: aiPrompt.value.trim(),
    skin: collectSkinAiContext(),
    responseRule: '从 request 中自行理解设计风格、目标部位和基础层或外层；operations 必须声明 targets、layer 和实际操作。'
  })
  if (!aiUseVision.value) return text
  const content = [{ type: 'text', text }]
  const preview = skinPreview.value?.capturePreview?.()
  if (preview) content.push({ type: 'image_url', image_url: { url: preview, detail: 'low' } })
  if (skinCanvas.value) content.push({ type: 'image_url', image_url: { url: skinCanvas.value.toDataURL('image/png'), detail: 'low' } })
  if (aiReferenceImage.value) content.push({ type: 'image_url', image_url: { url: aiReferenceImage.value, detail: 'low' } })
  return content
}

function normalizeAiEndpoint(baseUrl) {
  const normalized = baseUrl.trim().replace(/\/$/, '')
  return normalized.endsWith('/chat/completions') ? normalized : `${normalized}/chat/completions`
}

function isVisionModel(modelName) {
  return /(?:vl|vision|omni|glm-[\d.]+v|deepseek[-_]?vl|step3)/i.test(modelName)
}

function formatAiGenerationError(error) {
  const message = error instanceof Error ? error.message : String(error || '')
  if (/not a vlm|vision language model|text-only prompts/i.test(message)) return t('minecraftSkin.aiVisionUnsupported')
  if (/json|plan\.operations|invalid ai skin edit plan/i.test(message)) return t('minecraftSkin.aiPlanInvalid')
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

async function generateAiPlan() {
  aiPlanError.value = ''
  aiPlanResult.value = null
  aiGenerationStatus.value = ''
  aiRequestDiagnostic.value = null
  if (!aiPrompt.value.trim()) {
    aiPlanError.value = t('minecraftSkin.aiPromptRequired')
    return
  }
  if (!aiApiKey.value.trim()) {
    aiPlanError.value = t('minecraftSkin.aiApiKeyRequired')
    return
  }
  if (!aiBaseUrl.value.trim() || !aiModel.value.trim()) {
    aiPlanError.value = t('minecraftSkin.aiConfigRequired')
    return
  }
  if (aiUseVision.value && !isVisionModel(aiModel.value.trim())) {
    aiPlanError.value = t('minecraftSkin.aiVisionUnsupported')
    return
  }
  aiPlanText.value = ''
  isGeneratingAiPlan.value = true
  aiGenerationStatus.value = t('minecraftSkin.aiConnecting')
  aiRequestController = new AbortController()
  try {
    const modelName = aiModel.value.trim()
    const response = await fetch(normalizeAiEndpoint(aiBaseUrl.value), {
      method: 'POST',
      signal: aiRequestController.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aiApiKey.value.trim()}`
      },
      body: JSON.stringify({
        model: modelName,
        temperature: 0.2,
        max_tokens: 1600,
        stream: true,
        ...(!isVisionModel(modelName) ? { response_format: { type: 'json_object' } } : {}),
        ...(modelName.startsWith('Qwen/Qwen3') && !isVisionModel(modelName) ? { enable_thinking: false } : {}),
        messages: [
          {
            role: 'system',
            content: '你是 Minecraft 皮肤编辑器的结构化设计助手。只返回一个可解析的 JSON 对象，不要 Markdown，不要解释文字。必须包含 operations 数组和 preserve 数组。根据用户 request 自行理解设计风格、目标部位及基础层或外层；operations 中必须明确声明 targets 和 layer。只修改用户明确要求的部位；如果用户要求全身修改，才可以使用全部六个部位。preserve 必须包含所有未被修改的身体部位。允许的 type 只有 style、palette、patch、mirror、clear。设计任务优先使用 style：{"type":"style","pattern":"armor|tech|jacket|trim","layer":"outer","targets":["rightArm"],"palette":{"base":"#7f2f37","shadow":"#4a1820","highlight":"#c85b5b","accent":"#e8b3a7"}}。style 会由编辑器绘制稳定的像素纹样，不要用大量 patch 模拟护甲。palette 必须包含非空 replacements，格式为 [{"from":"#rrggbb","to":"#rrggbb"}]；patch 必须包含非空 pixels，最多 24 个像素；mirror 不要包含 replacements 或 pixels；clear 可以选填 color。不要输出空数组。'
          },
          {
            role: 'user',
            content: buildAiUserContent()
          }
        ]
      })
    })
    const traceId = response.headers.get('x-siliconcloud-trace-id') || ''
    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      const providerError = payload?.error || payload || {}
      const detail = providerError.message || payload?.message || `HTTP ${response.status}`
      recordAiDiagnostic({ status: response.status, traceId, code: providerError.code || providerError.type || 'request_failed', detail: sanitizeDiagnosticDetail(detail) })
      throw new Error(detail)
    }
    recordAiDiagnostic({ status: response.status, traceId, code: 'stream_connected', detail: 'Waiting for model output.' })
    aiGenerationStatus.value = t('minecraftSkin.aiWaitingStream')
    const content = await readAiStream(response, (partialContent) => {
      aiPlanText.value = partialContent
      aiGenerationStatus.value = t('minecraftSkin.aiReceiving')
    }, () => {
      aiGenerationStatus.value = t('minecraftSkin.aiThinking')
    })
    if (!content) throw new Error('AI response did not contain a plan.')
    const plan = typeof content === 'string' ? JSON.parse(content) : content
    const validation = validateAiSkinEditPlan(plan)
    if (!validation.valid) throw new Error(validation.errors.join('; '))
    aiPlanText.value = JSON.stringify(plan, null, 2)
    previewAiPlan(plan)
  } catch (error) {
    if (error?.name === 'AbortError') {
      aiPlanError.value = t('minecraftSkin.aiCancelled')
    } else if (error instanceof TypeError) {
      recordAiDiagnostic({ status: 'network', code: 'network_error', detail: sanitizeDiagnosticDetail(error.message) })
      aiPlanError.value = t('minecraftSkin.aiNetworkError')
    } else {
      if (!aiRequestDiagnostic.value) recordAiDiagnostic({ status: 'client', code: 'client_error', detail: sanitizeDiagnosticDetail(error?.message) })
      aiPlanError.value = formatAiGenerationError(error)
    }
  } finally {
    isGeneratingAiPlan.value = false
    aiGenerationStatus.value = ''
    aiRequestController = null
  }
}

function cancelAiGeneration() {
  aiRequestController?.abort()
}

async function readAiStream(response, onContent, onReasoning) {
  if (!response.body) throw new Error('AI response stream is unavailable.')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let content = ''
  const processLine = (line) => {
    if (!line.startsWith('data:')) return
    const data = line.slice(5).trim()
    if (!data || data === '[DONE]') return
    const chunk = JSON.parse(data)
    const message = chunk.choices?.[0]?.delta || chunk.choices?.[0]?.message || {}
    if (message.reasoning_content || message.reasoning) onReasoning?.()
    if (message.content) {
      content += message.content
      onContent(content)
    }
  }
  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''
    lines.forEach(processLine)
    if (done) break
  }
  if (buffer.trim()) processLine(buffer.trim())
  return content
}

function redraw() {
  textureVersion.value += 1
  scheduleProjectSave()
}

// Reserved for the AI panel: plans are validated and applied as one undoable transaction.
function applyAiPlan(plan) {
  if (!skinCanvas.value) throw new Error('Skin canvas is not ready.')
  const validation = validateAiSkinEditPlan(plan)
  if (!validation.valid) throw new Error(validation.errors.join('; '))
  const before = skinCanvas.value.toDataURL('image/png')
  const result = applyAiSkinEditPlan(skinCanvas.value, plan)
  history.value.push(before)
  redoStack.value = []
  redraw()
  return result
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
  discardAiProposal()
  redoStack.value.push(skinCanvas.value.toDataURL())
  restoreDataUrl(previous)
}

function redo() {
  const next = redoStack.value.pop()
  if (!next) return
  discardAiProposal()
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
  saveProject()
})

watch(model, drawModelSwitchIcon, { flush: 'post' })
watch([model, activeLayer, brushColor, brushOpacity, mirrorEnabled], scheduleProjectSave)
</script>

<style scoped>
.image-render-pixel {
  image-rendering: pixelated;
}
</style>
