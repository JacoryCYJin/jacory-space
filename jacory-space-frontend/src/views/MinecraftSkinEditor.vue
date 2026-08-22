<template>
  <main class="relative min-h-dvh overflow-hidden bg-background text-foreground">
    <StatusToast :visible="ai.state.toastVisible" :message="ai.state.toastMessage" type="success" />
    <MinecraftSkinPreview
      v-if="project.state.skinCanvas"
      ref="skinPreview"
      :texture-canvas="displayCanvas"
      :texture-version="project.state.textureVersion"
      :model="project.state.previewModel"
      :active-layer="project.state.activeLayer"
      :outer-layer-display="project.state.outerLayerDisplay"
      :visible-outer-parts="project.state.visibleOuterParts"
      :active-tool="project.state.activeTool"
      :show-grid="showPixelGrid"
      :is-motion-playback-locked="isMotionPlaybackActive"
      :motion="selectedMotion"
      :motion-speed="motionSpeed"
      :motion-paused="motionPaused"
      class="absolute inset-0 min-h-dvh"
      @error="project.actions.handlePreviewError"
      @paint-start="editing.actions.beginPaintStroke"
      @paint-pixel="editing.actions.paintPreviewPixel"
      @paint-end="editing.actions.finishPaintStroke"
    />

    <div class="pointer-events-none absolute inset-0 z-10">
      <RouterLink to="/" class="pointer-events-auto absolute left-5 top-5 flex items-center gap-3 text-foreground" aria-label="Jacory Space"><img :src="jacoryLogo" alt="Jacory Space" class="h-8 w-8 object-contain" /><span class="hidden font-mono text-xs tracking-[0.16em] text-muted-foreground sm:inline">JACORY SPACE</span></RouterLink>

      <div class="pointer-events-auto">
        <SkinEditorToolbar
          :model="project.state.previewModel" :active-tool="project.state.activeTool" :brush-color="project.state.brushColor" :brush-opacity="project.state.brushOpacity" :mirror-enabled="project.state.mirrorEnabled" :show-grid="showPixelGrid" :motion-locked="isMotionPlaybackActive" :color-panel-open="isColorPanelOpen" :layer-panel-open="isLayerPanelOpen" :motion-panel-open="isMotionPanelOpen" :ai-panel-open="isAiPanelOpen" :is-development="isDevelopment"
          @toggle-model="toggleModel" @update:active-tool="project.state.activeTool = $event" @toggle-grid="showPixelGrid = !showPixelGrid" @toggle-mirror="project.state.mirrorEnabled = !project.state.mirrorEnabled" @undo="editing.actions.undo" @redo="editing.actions.redo" @select-solid-color="project.state.brushOpacity = 1" @select-transparent="project.state.brushOpacity = 0" @toggle-color="togglePanel('color')" @toggle-layer="togglePanel('layer')" @toggle-motion="togglePanel('motion')" @toggle-ai="togglePanel('ai')"
        />
      </div>

      <div v-if="isLayerPanelOpen || isColorPanelOpen || (isDevelopment && isAiPanelOpen) || isMotionPanelOpen" data-lenis-prevent class="workspace-scroll pointer-events-auto absolute left-[5.125rem] top-20 z-20 flex max-h-[calc(100dvh-6.25rem)] w-[min(20rem,calc(100vw-6.5rem))] flex-col items-start gap-1.5 overflow-x-hidden overflow-y-auto overscroll-contain pb-1">
        <OuterLayerPanel v-if="isLayerPanelOpen" class="shrink-0" :display="project.state.outerLayerDisplay" :visible-parts="project.state.visibleOuterParts" :custom-expanded="project.state.isCustomOuterPartsExpanded" :all-selected="project.actions.allOuterPartsSelected()" @set-display="project.actions.setOuterLayerDisplay" @select-all="project.actions.selectAllOuterParts" @expand-custom="project.state.isCustomOuterPartsExpanded = true" @toggle-part="project.actions.toggleOuterPart" />
        <ColorPickerPanel v-if="isColorPanelOpen" v-model="project.state.brushColor" v-model:opacity="project.state.brushOpacity" :recent-colors="editing.state.recentColors" class="w-full shrink-0 overflow-hidden rounded-[10px]" @commit="editing.actions.rememberColor" @select-recent="editing.actions.selectRecentColor" />
        <Transition name="ai-panel">
          <AiPartGenerationPanel v-if="isDevelopment && isAiPanelOpen" class="shrink-0" :ai="ai" />
        </Transition>
        <MotionWorkspacePanel v-if="isMotionPanelOpen" class="shrink-0" :motion-id="selectedMotion" :paused="motionPaused" :speed="motionSpeed" @select="selectMotion" @update:paused="motionPaused = $event" @update:speed="motionSpeed = $event" @reset="resetMotion" />
      </div>

      <SkinFileActions class="pointer-events-auto" :motion-locked="isMotionPlaybackActive" @new="isNewSkinDialogOpen = true" @import="handleImport" @export="project.actions.exportSkin" />
      <NewSkinDialog v-if="isNewSkinDialogOpen" class="pointer-events-auto" @cancel="isNewSkinDialogOpen = false" @confirm="startNewSkin" />

      <div v-if="project.state.previewError" class="pointer-events-auto absolute inset-0 flex items-center justify-center bg-background/95 px-6 text-center"><div class="max-w-md border border-line bg-card p-6"><p class="tech text-destructive">WEBGL / ERROR</p><p class="mt-3 text-sm text-muted-foreground">{{ t('minecraftSkin.webglError') }}</p><p class="mt-2 font-mono text-xs text-haze">{{ project.state.previewError }}</p></div></div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import jacoryLogo from '../assets/jacory-logo.png'
import StatusToast from '../components/StatusToast.vue'
import AiPartGenerationPanel from '../components/tools/minecraft-skin-editor/AiPartGenerationPanel.vue'
import ColorPickerPanel from '../components/tools/minecraft-skin-editor/ColorPickerPanel.vue'
import MinecraftSkinPreview from '../components/tools/minecraft-skin-editor/MinecraftSkinPreview.vue'
import MotionWorkspacePanel from '../components/tools/minecraft-skin-editor/MotionWorkspacePanel.vue'
import NewSkinDialog from '../components/tools/minecraft-skin-editor/NewSkinDialog.vue'
import OuterLayerPanel from '../components/tools/minecraft-skin-editor/OuterLayerPanel.vue'
import SkinEditorToolbar from '../components/tools/minecraft-skin-editor/SkinEditorToolbar.vue'
import SkinFileActions from '../components/tools/minecraft-skin-editor/SkinFileActions.vue'
import { isDevelopment } from '../config/runtime'
import { useAiPartGeneration } from '../composables/useAiPartGeneration'
import { useSkinEditing } from '../composables/useSkinEditing'
import { useSkinEditorProject } from '../composables/useSkinEditorProject'

const { t } = useI18n()
const skinPreview = ref(null)
const project = useSkinEditorProject()
const ai = useAiPartGeneration(project, {
  applyCandidate: (canvas, model) => {
    const historyEntry = editing.actions.applyCanvasReplacement(canvas, { model })
    project.state.previewModel = model === 'slim' ? 'slim' : 'classic'
    project.actions.resetOuterLayerForImportedSkin()
    return historyEntry
  },
  canRevertCandidate: (entry) => editing.actions.canUndoHistoryEntry(entry),
  revertCandidate: (entry) => editing.actions.undo(entry)
})
const editing = useSkinEditing(project.state, toRef(ai.state, 'proposalCanvas'), project.actions.redraw)
const isColorPanelOpen = ref(false)
const isLayerPanelOpen = ref(false)
const isAiPanelOpen = ref(false)
const isMotionPanelOpen = ref(false)
const isNewSkinDialogOpen = ref(false)
const showPixelGrid = ref(false)
const selectedMotion = ref('static')
const motionSpeed = ref(1)
const motionPaused = ref(false)
const displayCanvas = computed(() => project.state.skinCanvas)
const isMotionPlaybackActive = computed(() => selectedMotion.value !== 'static' && !motionPaused.value)

function togglePanel(panel) {
  if (panel === 'color') {
    isColorPanelOpen.value = !isColorPanelOpen.value
    isAiPanelOpen.value = false
    isMotionPanelOpen.value = false
    return
  }
  if (panel === 'layer') {
    isLayerPanelOpen.value = !isLayerPanelOpen.value
    isAiPanelOpen.value = false
    isMotionPanelOpen.value = false
    return
  }
  if (panel === 'motion') {
    isMotionPanelOpen.value = !isMotionPanelOpen.value
    isColorPanelOpen.value = false
    isLayerPanelOpen.value = false
    isAiPanelOpen.value = false
    return
  }
  isAiPanelOpen.value = !isAiPanelOpen.value
  isColorPanelOpen.value = false
  isLayerPanelOpen.value = false
  isMotionPanelOpen.value = false
  ai.state.generationError = ''
}
function toggleModel() {
  ai.actions.discardProposal()
  project.state.previewModel = project.state.previewModel === 'classic' ? 'slim' : 'classic'
}
function selectMotion(motion) { selectedMotion.value = motion; motionPaused.value = false }
function resetMotion() { selectedMotion.value = 'static'; motionSpeed.value = 1; motionPaused.value = false }
async function handleImport(file) { ai.actions.discardProposal(); await project.actions.handleImport(file); editing.actions.clearHistory() }
async function startNewSkin() {
  isNewSkinDialogOpen.value = false
  try { ai.actions.discardProposal(); await project.actions.startNewSkin(); editing.actions.clearHistory() } catch (error) { project.actions.handlePreviewError(error) }
}
function handleKeyboardShortcut(event) {
  if ((!event.metaKey && !event.ctrlKey) || event.key.toLowerCase() !== 'z') return
  const target = event.target
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable) return
  event.preventDefault()
  if (isMotionPlaybackActive.value) return
  if (event.shiftKey) editing.actions.redo()
  else editing.actions.undo()
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyboardShortcut)
  window.addEventListener('pagehide', project.actions.saveProject)
  try {
    await project.actions.initialize()
    editing.actions.restoreRecentColors()
    project.actions.redraw()
  } catch (error) { project.actions.handlePreviewError(error) }
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyboardShortcut)
  window.removeEventListener('pagehide', project.actions.saveProject)
  ai.actions.dispose()
  project.actions.dispose()
})
watch(() => [project.state.previewModel, project.state.skinModel, project.state.activeLayer, project.state.brushColor, project.state.brushOpacity, project.state.mirrorEnabled, project.state.outerLayerDisplay, project.state.visibleOuterParts], project.actions.scheduleProjectSave, { deep: true })
</script>

<style scoped>
.workspace-scroll { -ms-overflow-style: none; scrollbar-width: none; }
.workspace-scroll::-webkit-scrollbar { display: none; }
.ai-panel-enter-active, .ai-panel-leave-active { transition: opacity 620ms cubic-bezier(0.16, 1, 0.3, 1), transform 620ms cubic-bezier(0.16, 1, 0.3, 1); }
.ai-panel-enter-from, .ai-panel-leave-to { opacity: 0; transform: translateY(8px); }
@media (prefers-reduced-motion: reduce) {
  .ai-panel-enter-active, .ai-panel-leave-active { transition: none; }
}
</style>
