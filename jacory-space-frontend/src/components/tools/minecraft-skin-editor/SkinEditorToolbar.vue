<template>
  <div class="absolute left-5 top-20 flex w-14 flex-col rounded-[10px] border border-line bg-card/95 p-1.5 backdrop-blur-sm">
    <div class="flex flex-col items-center gap-1">
      <button type="button" :aria-label="nextModelLabel" :title="nextModelLabel" :class="buttonClass(false)" :disabled="motionLocked" @mouseenter="showTooltip(nextModelLabel, $event)" @mouseleave="hideTooltip" @click="$emit('toggle-model')">
        <span class="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-background">
          <canvas ref="modelSwitchIcon" width="24" height="24" class="h-6 w-6 image-render-pixel" aria-hidden="true" />
        </span>
      </button>
      <button type="button" :aria-label="t('minecraftSkin.outerDisplay')" :class="buttonClass(layerPanelOpen)" :disabled="motionLocked" @mouseenter="showTooltip(t('minecraftSkin.outerDisplay'), $event)" @mouseleave="hideTooltip" @click="$emit('toggle-layer')"><Layers3 class="h-5 w-5" /></button>
    </div>
    <span class="mx-1.5 my-1 h-px bg-line" />
    <div class="flex flex-col items-center gap-1">
      <button type="button" :aria-label="t('minecraftSkin.color')" :class="buttonClass(colorPanelOpen)" :disabled="motionLocked" @mouseenter="showTooltip(t('minecraftSkin.color'), $event)" @mouseleave="hideTooltip" @click="$emit('select-solid-color'); $emit('toggle-color')"><span class="h-5 w-5 rounded-sm border border-line-strong" :style="{ backgroundColor: brushColor }" /></button>
      <button type="button" :aria-label="t('minecraftSkin.opacity')" :class="buttonClass(brushOpacity === 0, 'primary')" :disabled="motionLocked" @mouseenter="showTooltip(t('minecraftSkin.opacity'), $event)" @mouseleave="hideTooltip" @click="$emit('select-transparent')"><span class="transparent-swatch h-5 w-5 rounded-sm border border-line-strong" /></button>
    </div>
    <span class="mx-1.5 my-1 h-px bg-line" />
    <div class="flex flex-col items-center gap-1">
      <button v-for="tool in tools" :key="tool.id" type="button" :aria-label="tool.label" :class="buttonClass(activeTool === tool.id, 'primary')" :disabled="motionLocked" @mouseenter="showTooltip(tool.label, $event)" @mouseleave="hideTooltip" @click="$emit('update:active-tool', tool.id)">
        <span :class="buttonContentClass(activeTool === tool.id, 'primary')"><component :is="tool.icon" class="h-5 w-5" /></span>
      </button>
    </div>
    <span class="mx-1.5 my-1 h-px bg-line" />
    <div class="flex flex-col items-center gap-1">
      <button type="button" :aria-label="t('minecraftSkin.grid')" :class="buttonClass(showGrid)" :disabled="motionLocked" @mouseenter="showTooltip(t('minecraftSkin.grid'), $event)" @mouseleave="hideTooltip" @click="$emit('toggle-grid')"><Grid3X3 class="h-5 w-5" /></button>
      <button type="button" :aria-label="t('minecraftSkin.mirror')" :class="buttonClass(mirrorEnabled)" :disabled="motionLocked" @mouseenter="showTooltip(t('minecraftSkin.mirror'), $event)" @mouseleave="hideTooltip" @click="$emit('toggle-mirror')"><FlipHorizontal class="h-5 w-5" /></button>
    </div>
    <span class="mx-1.5 my-1 h-px bg-line" />
    <div class="flex flex-col items-center gap-1">
      <button type="button" :aria-label="t('minecraftSkin.undo')" :class="buttonClass(false)" :disabled="motionLocked" @mouseenter="showTooltip(t('minecraftSkin.undo'), $event)" @mouseleave="hideTooltip" @click="$emit('undo')"><Undo2 class="h-5 w-5" /></button>
      <button type="button" :aria-label="t('minecraftSkin.redo')" :class="buttonClass(false)" :disabled="motionLocked" @mouseenter="showTooltip(t('minecraftSkin.redo'), $event)" @mouseleave="hideTooltip" @click="$emit('redo')"><Redo2 class="h-5 w-5" /></button>
    </div>
    <span class="mx-1.5 my-1 h-px bg-line" />
    <button type="button" :aria-label="t('minecraftSkin.motionWorkspace')" :class="buttonClass(motionPanelOpen || motionLocked)" @mouseenter="showTooltip(t('minecraftSkin.motionWorkspace'), $event)" @mouseleave="hideTooltip" @click="$emit('toggle-motion')"><Clapperboard class="h-5 w-5" /></button>
    <template v-if="isDevelopment">
      <span class="mx-1.5 my-1 h-px bg-line" />
      <button type="button" :aria-label="t('minecraftSkin.aiEdit')" :class="buttonClass(aiPanelOpen)" :disabled="motionLocked" @mouseenter="showTooltip(t('minecraftSkin.aiEdit'), $event)" @mouseleave="hideTooltip" @click="$emit('toggle-ai')"><Sparkles class="h-5 w-5" /></button>
    </template>
  </div>
  <span v-if="hoveredTool" class="pointer-events-none absolute left-20 z-30 -translate-y-1/2 font-mono text-xs tracking-[0.1em] text-muted-foreground" :style="{ top: `calc(5rem + ${hoveredToolTop}px)` }">{{ hoveredTool }}</span>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Clapperboard, FlipHorizontal, Grid3X3, Layers3, PaintBucket, Pencil, Pipette, Redo2, Sparkles, Undo2 } from 'lucide-vue-next'
import { DEFAULT_ALEX_SKIN_DATA_URL, DEFAULT_STEVE_SKIN_DATA_URL } from './skin-core'

const props = defineProps({
  activeTool: { type: String, required: true }, aiPanelOpen: Boolean, brushColor: { type: String, required: true }, brushOpacity: { type: Number, required: true }, colorPanelOpen: Boolean,
  isDevelopment: Boolean, layerPanelOpen: Boolean, mirrorEnabled: Boolean, model: { type: String, required: true }, motionLocked: Boolean, motionPanelOpen: Boolean, showGrid: Boolean
})
defineEmits(['redo', 'select-solid-color', 'select-transparent', 'toggle-ai', 'toggle-color', 'toggle-grid', 'toggle-layer', 'toggle-mirror', 'toggle-model', 'toggle-motion', 'undo', 'update:active-tool'])

const { t } = useI18n()
const modelSwitchIcon = ref(null)
const hoveredTool = ref('')
const hoveredToolTop = ref(0)
const modelIconImages = new Map()
const tools = computed(() => [
  { id: 'brush', label: t('minecraftSkin.brush'), icon: Pencil }, { id: 'fill', label: t('minecraftSkin.fill'), icon: PaintBucket },
  { id: 'eyedropper', label: t('minecraftSkin.eyedropper'), icon: Pipette }
])
const nextModelLabel = computed(() => props.model === 'classic' ? t('minecraftSkin.switchToSlim') : t('minecraftSkin.switchToClassic'))

function buttonClass(active, emphasis = 'subtle') {
  const base = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-40'
  if (!active) return [base, 'text-muted-foreground hover:bg-background hover:text-foreground']
  return [base, emphasis === 'primary' ? 'text-muted-foreground' : 'border-blue/50 bg-blue/10 text-blue hover:bg-blue/15']
}
function buttonContentClass(active, emphasis = 'subtle') { return active && emphasis === 'primary' ? ['flex h-9 w-9 items-center justify-center rounded-[8px]', 'bg-blue text-white'] : 'flex h-9 w-9 items-center justify-center rounded-[8px]' }
function showTooltip(label, event) { hoveredTool.value = label; hoveredToolTop.value = event.currentTarget.offsetTop + event.currentTarget.offsetHeight / 2 }
function hideTooltip() { hoveredTool.value = '' }
function drawModelSwitchIcon() {
  const icon = modelSwitchIcon.value
  if (!icon) return
  const source = props.model === 'classic' ? DEFAULT_STEVE_SKIN_DATA_URL : DEFAULT_ALEX_SKIN_DATA_URL
  const cachedImage = modelIconImages.get(props.model)
  if (!cachedImage) {
    const image = new Image()
    image.onload = () => { modelIconImages.set(props.model, image); drawModelSwitchIcon() }
    image.src = source
    return
  }
  const context = icon.getContext('2d')
  context.clearRect(0, 0, icon.width, icon.height)
  context.imageSmoothingEnabled = false
  context.drawImage(cachedImage, 8, 8, 8, 8, 0, 0, icon.width, icon.height)
}
onMounted(drawModelSwitchIcon)
watch(() => props.model, drawModelSwitchIcon, { flush: 'post' })
</script>

<style scoped>
.image-render-pixel { image-rendering: pixelated; }
.transparent-swatch {
  background-color: var(--card);
  background-image: linear-gradient(45deg, var(--line) 25%, transparent 25%), linear-gradient(-45deg, var(--line) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--line) 75%), linear-gradient(-45deg, transparent 75%, var(--line) 75%);
  background-position: 0 0, 0 3px, 3px -3px, -3px 0;
  background-size: 6px 6px;
}
</style>
