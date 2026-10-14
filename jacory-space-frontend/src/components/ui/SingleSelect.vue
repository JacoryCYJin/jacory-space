<template>
  <div class="relative inline-flex min-w-0">
    <button
      :id="`${selectId}-trigger`"
      ref="trigger"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      :aria-label="label"
      :aria-expanded="isOpen"
      :aria-controls="`${selectId}-listbox`"
      :aria-activedescendant="isOpen && activeIndex >= 0 ? `${selectId}-option-${activeIndex}` : undefined"
      :disabled="disabled"
      class="inline-flex min-w-0 items-center gap-2 font-mono text-xs uppercase transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:cursor-not-allowed disabled:opacity-50"
      :class="variant === 'plain' ? 'w-full justify-between bg-transparent text-haze hover:text-muted-foreground md:w-auto' : 'h-8 border border-line bg-background px-3 tracking-[0.16em] text-muted-foreground hover:border-line-strong hover:text-foreground'"
      @click="isOpen ? close() : open()"
      @keydown="handleKeyDown"
    >
      <slot name="trigger" :selected="selectedOption" :open="isOpen">
        <span class="min-w-0 truncate">{{ selectedOption?.label || placeholder || label }}</span>
        <ChevronDown class="h-4 w-4 shrink-0" aria-hidden="true" />
      </slot>
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        :id="`${selectId}-listbox`"
        ref="popup"
        role="listbox"
        :aria-label="label"
        :style="popupStyle"
        data-lenis-prevent
        class="fixed z-[100] w-max overflow-y-auto overscroll-contain border border-line bg-background py-1 text-muted-foreground"
      >
        <div
          v-for="(option, index) in options"
          :id="`${selectId}-option-${index}`"
          :key="option.value"
          role="option"
          :aria-selected="modelValue === option.value"
          :aria-disabled="option.disabled || undefined"
          class="grid grid-cols-[0.375rem_1fr] items-center gap-3 px-3 py-2.5 text-left font-sans text-xs tracking-normal transition-colors duration-300"
          :class="[modelValue === option.value ? 'text-foreground' : 'text-muted-foreground', option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-card hover:text-foreground', activeIndex === index ? 'bg-card text-foreground' : '']"
          @pointerdown.prevent
          @pointermove="!option.disabled && (activeIndex = index)"
          @click="choose(index)"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="modelValue === option.value ? 'bg-blue' : 'bg-transparent'" aria-hidden="true" />
          <span>{{ option.label }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, required: true },
  label: { type: String, required: true },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  variant: { type: String, default: 'plain' },
  placement: { type: String, default: 'down' },
  align: { type: String, default: 'right' },
})
const emit = defineEmits(['update:modelValue'])
const selectId = `single-select-${useId()}`
const trigger = ref(null)
const popup = ref(null)
const isOpen = ref(false)
const activeIndex = ref(-1)
const popupStyle = ref({ visibility: 'hidden' })
const selectedOption = computed(() => props.options.find(option => option.value === props.modelValue))
const enabledIndexes = computed(() => props.options.flatMap((option, index) => option.disabled ? [] : [index]))
let positionFrame
let searchTimer
let searchText = ''
let popupObserver

function close(restoreFocus = false) {
  isOpen.value = false
  activeIndex.value = -1
  searchText = ''
  clearTimeout(searchTimer)
  popupObserver?.disconnect()
  if (restoreFocus) trigger.value?.focus()
}

function positionPopup() {
  if (!isOpen.value || !trigger.value || !popup.value) return
  const rect = trigger.value.getBoundingClientRect()
  if (!rect.width || !rect.height || rect.bottom <= 0 || rect.top >= window.innerHeight) {
    close()
    return
  }
  const margin = 8
  const below = Math.max(0, window.innerHeight - rect.bottom - margin * 2)
  const above = Math.max(0, rect.top - margin * 2)
  const preferredAbove = props.placement === 'up' || (props.placement === 'responsive' && window.innerWidth < 768)
  const naturalHeight = popup.value.scrollHeight
  const useAbove = preferredAbove ? above >= naturalHeight || above > below : below < naturalHeight && above > below
  const maxHeight = Math.min(320, useAbove ? above : below)
  const maxWidth = Math.max(0, window.innerWidth - margin * 2)
  const width = Math.min(maxWidth, popup.value.getBoundingClientRect().width)
  const left = Math.max(margin, Math.min(props.align === 'left' ? rect.left : rect.right - width, window.innerWidth - width - margin))
  popupStyle.value = {
    left: `${left}px`,
    top: `${useAbove ? rect.top - Math.min(naturalHeight, maxHeight) - margin : rect.bottom + margin}px`,
    width: `${width}px`,
    maxWidth: `${maxWidth}px`,
    maxHeight: `${maxHeight}px`,
    visibility: 'visible',
  }
}

function schedulePosition() {
  if (!isOpen.value) return
  window.cancelAnimationFrame(positionFrame)
  positionFrame = window.requestAnimationFrame(positionPopup)
}

async function open(edge) {
  if (props.disabled || !enabledIndexes.value.length) return
  document.dispatchEvent(new CustomEvent('single-select-open', { detail: selectId }))
  activeIndex.value = edge === 'first' ? enabledIndexes.value[0] : edge === 'last' ? enabledIndexes.value.at(-1) : props.options.findIndex(option => option.value === props.modelValue && !option.disabled)
  if (activeIndex.value < 0) activeIndex.value = enabledIndexes.value[0]
  popupStyle.value = { visibility: 'hidden', maxWidth: `${window.innerWidth - 16}px` }
  isOpen.value = true
  await nextTick()
  if (!isOpen.value) return
  positionPopup()
  scrollActiveIntoView()
  if (typeof ResizeObserver !== 'undefined') {
    popupObserver ??= new ResizeObserver(schedulePosition)
    popupObserver.observe(trigger.value)
    popupObserver.observe(popup.value)
  }
}

function scrollActiveIntoView() {
  nextTick(() => popup.value?.querySelector(`#${CSS.escape(`${selectId}-option-${activeIndex.value}`)}`)?.scrollIntoView({ block: 'nearest' }))
}

function move(step) {
  const indexes = enabledIndexes.value
  const current = indexes.indexOf(activeIndex.value)
  activeIndex.value = indexes[Math.max(0, Math.min(indexes.length - 1, current + step))]
  scrollActiveIntoView()
}

function choose(index) {
  const option = props.options[index]
  if (!option || option.disabled) return
  if (option.value !== props.modelValue) emit('update:modelValue', option.value)
  close(true)
}

function handleKeyDown(event) {
  const { key } = event
  if (key === 'Tab') { close(); return }
  if (key === 'Escape') {
    if (isOpen.value) { event.preventDefault(); event.stopPropagation(); close(true) }
    return
  }
  if (['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
    event.preventDefault()
    if (!isOpen.value) { open(key === 'Home' ? 'first' : key === 'End' ? 'last' : undefined); return }
    if (key === 'Enter' || key === ' ') choose(activeIndex.value)
    else if (key === 'Home' || key === 'End') { activeIndex.value = key === 'Home' ? enabledIndexes.value[0] : enabledIndexes.value.at(-1); scrollActiveIntoView() }
    else move(key === 'ArrowDown' ? 1 : -1)
    return
  }
  if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault()
    if (!isOpen.value) open()
    searchText += key.toLocaleLowerCase()
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => { searchText = '' }, 600)
    const match = props.options.findIndex(option => !option.disabled && option.label.toLocaleLowerCase().startsWith(searchText))
    if (match >= 0) { activeIndex.value = match; scrollActiveIntoView() }
  }
}

function handleOutside(event) {
  if (!trigger.value?.contains(event.target) && !popup.value?.contains(event.target)) close()
}
function handleOtherOpen(event) { if (event.detail !== selectId) close() }
function handleFocus(event) { if (isOpen.value) handleOutside(event) }

watch(() => props.disabled, disabled => { if (disabled) close() })
watch(() => props.options, () => {
  if (!isOpen.value) return
  if (!enabledIndexes.value.length) { close(); return }
  activeIndex.value = props.options.findIndex(option => option.value === props.modelValue && !option.disabled)
  if (activeIndex.value < 0) activeIndex.value = enabledIndexes.value[0]
  nextTick(schedulePosition)
})

onMounted(() => {
  document.addEventListener('pointerdown', handleOutside)
  document.addEventListener('focusin', handleFocus)
  document.addEventListener('single-select-open', handleOtherOpen)
  window.addEventListener('resize', schedulePosition)
  window.addEventListener('scroll', schedulePosition, true)
})
onBeforeUnmount(() => {
  close()
  window.cancelAnimationFrame(positionFrame)
  document.removeEventListener('pointerdown', handleOutside)
  document.removeEventListener('focusin', handleFocus)
  document.removeEventListener('single-select-open', handleOtherOpen)
  window.removeEventListener('resize', schedulePosition)
  window.removeEventListener('scroll', schedulePosition, true)
})
</script>
