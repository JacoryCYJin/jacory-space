<template>
  <section class="border border-line bg-card/95 backdrop-blur-sm" @keydown.esc="cancelHex">
    <div class="space-y-4 p-4">
      <div>
        <p class="mb-2 text-sm font-medium text-foreground">{{ t('minecraftSkin.saturationLightness') }}</p>
        <div ref="saturationEl" class="color-square relative aspect-square w-full cursor-crosshair overflow-hidden" :style="{ backgroundColor: `hsl(${hue}, 100%, 50%)` }" @pointerdown="beginSquare" @pointermove="moveSquare" @pointerup="commitSquare" @pointercancel="commitSquare">
          <span class="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground bg-card/30" :style="{ left: `${saturation * 100}%`, top: `${(1 - brightness) * 100}%` }" />
        </div>
      </div>

      <ColorRange :label="t('minecraftSkin.hue')" :value="hue" :min="0" :max="360" :step="1" gradient="linear-gradient(90deg, hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%), hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%))" @update="updateHue" @commit="emit('commit')" />
      <ColorRange :label="t('minecraftSkin.opacity')" :value="opacityValue * 100" :min="0" :max="100" :step="1" checkerboard :gradient="`linear-gradient(90deg, transparent, ${modelValue})`" @update="updateOpacity" @commit="emit('commit')" />

      <label class="block">
        <span class="mb-2 block text-sm font-medium text-foreground">{{ t('minecraftSkin.hexCode') }}</span>
        <input v-model="hexDraft" class="w-full border border-line-strong bg-background px-3 py-2 font-mono text-sm uppercase text-foreground outline-none transition-colors focus:border-blue" spellcheck="false" @keydown.enter.prevent="commitHex" @blur="commitHex" />
        <span class="mt-2 block text-xs text-muted-foreground">{{ t('minecraftSkin.hexHint') }}</span>
      </label>

      <div v-if="recentColors.length">
        <p class="mb-2 text-sm font-medium text-foreground">{{ t('minecraftSkin.recentColors') }}</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="entry in recentColors"
            :key="`${entry.color}-${entry.opacity}`"
            type="button"
            class="h-7 w-7 border border-line-strong transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue"
            :style="{ backgroundColor: entry.color, opacity: entry.opacity }"
            :title="`${entry.color.toUpperCase()} · ${Math.round(entry.opacity * 100)}%`"
            :aria-label="`${t('minecraftSkin.recentColors')} ${entry.color.toUpperCase()}`"
            @click="emit('select-recent', entry)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineComponent, h, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const ColorRange = defineComponent({
  props: {
    label: { type: String, required: true }, value: { type: Number, required: true }, min: { type: Number, required: true }, max: { type: Number, required: true }, step: { type: Number, required: true }, gradient: { type: String, required: true }, checkerboard: { type: Boolean, default: false }
  },
  emits: ['update', 'commit'],
  setup(props, { emit }) {
    return () => h('label', { class: 'block' }, [
      h('span', { class: 'mb-2 block text-sm font-medium text-foreground' }, props.label),
      h('span', { class: ['color-range-track relative block h-3 overflow-hidden rounded-full', props.checkerboard ? 'color-range-checker' : ''] }, [
        h('span', { class: 'absolute inset-0', style: { background: props.gradient } }),
        h('input', { class: 'color-range absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent', type: 'range', min: props.min, max: props.max, step: props.step, value: props.value, onInput: (event) => emit('update', Number(event.target.value)), onChange: () => emit('commit') })
      ])
    ])
  }
})

const props = defineProps({
  modelValue: { type: String, required: true },
  opacity: { type: Number, default: 1 },
  recentColors: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue', 'update:opacity', 'commit', 'select-recent'])
const { t } = useI18n()
const saturationEl = ref(null)
const hue = ref(0)
const saturation = ref(0)
const brightness = ref(0)
const opacityValue = ref(props.opacity)
const hexDraft = ref(props.modelValue.toUpperCase())

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function rgbToHsv(red, green, blue) {
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let nextHue = 0
  if (delta) {
    if (max === r) nextHue = 60 * (((g - b) / delta) % 6)
    else if (max === g) nextHue = 60 * ((b - r) / delta + 2)
    else nextHue = 60 * ((r - g) / delta + 4)
  }
  return { hue: (nextHue + 360) % 360, saturation: max === 0 ? 0 : delta / max, brightness: max }
}

function hsvToHex(nextHue, nextSaturation, nextBrightness) {
  const chroma = nextBrightness * nextSaturation
  const segment = nextHue / 60
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1))
  const match = [[chroma, secondary, 0], [secondary, chroma, 0], [0, chroma, secondary], [0, secondary, chroma], [secondary, 0, chroma], [chroma, 0, secondary]][Math.floor(segment) % 6]
  const offset = nextBrightness - chroma
  return `#${match.map((channel) => Math.round((channel + offset) * 255).toString(16).padStart(2, '0')).join('')}`
}

function syncFromHex(value) {
  const normalized = value.replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return false
  const { hue: nextHue, saturation: nextSaturation, brightness: nextBrightness } = rgbToHsv(Number.parseInt(normalized.slice(0, 2), 16), Number.parseInt(normalized.slice(2, 4), 16), Number.parseInt(normalized.slice(4, 6), 16))
  hue.value = nextHue
  saturation.value = nextSaturation
  brightness.value = nextBrightness
  hexDraft.value = `#${normalized.toUpperCase()}`
  return true
}

function emitColor() {
  const color = hsvToHex(hue.value, saturation.value, brightness.value)
  hexDraft.value = color.toUpperCase()
  emit('update:modelValue', color)
}

function beginSquare(event) {
  event.currentTarget.setPointerCapture(event.pointerId)
  updateSquare(event)
}

function commitSquare(event) {
  if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  emit('commit')
}

function moveSquare(event) {
  if (event.buttons === 1) updateSquare(event)
}

function updateSquare(event) {
  const bounds = saturationEl.value?.getBoundingClientRect()
  if (!bounds) return
  saturation.value = clamp((event.clientX - bounds.left) / bounds.width)
  brightness.value = 1 - clamp((event.clientY - bounds.top) / bounds.height)
  emitColor()
}

function updateHue(value) { hue.value = value; emitColor() }
function updateOpacity(value) { opacityValue.value = value / 100; emit('update:opacity', opacityValue.value) }
function commitHex() { if (syncFromHex(hexDraft.value)) { emitColor(); emit('commit') } else hexDraft.value = props.modelValue.toUpperCase() }
function cancelHex() { hexDraft.value = props.modelValue.toUpperCase() }

watch(() => props.modelValue, (value) => { syncFromHex(value) }, { immediate: true })
watch(() => props.opacity, (value) => { opacityValue.value = value })
</script>

<style scoped>
.color-square {
  background-image: linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent);
}

.color-range-checker {
  background-color: var(--card);
  background-image: conic-gradient(var(--line) 25%, transparent 0 50%, var(--line) 0 75%, transparent 0);
  background-size: 0.75rem 0.75rem;
}

.color-range::-webkit-slider-runnable-track { background: transparent; }
.color-range::-webkit-slider-thumb { appearance: none; width: 1.15rem; height: 1.15rem; margin-top: -0.2rem; border: 2px solid var(--foreground); border-radius: 999px; background: var(--card); }
.color-range::-moz-range-track { background: transparent; }
.color-range::-moz-range-thumb { width: 0.9rem; height: 0.9rem; border: 2px solid var(--foreground); border-radius: 999px; background: var(--card); }
</style>
