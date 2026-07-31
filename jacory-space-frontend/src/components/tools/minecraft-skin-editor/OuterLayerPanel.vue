<template>
  <section class="w-full overflow-hidden rounded-[10px] border border-line bg-card/95 backdrop-blur-sm">
    <div class="space-y-5 p-4">
      <div>
        <p class="tech text-haze">{{ t('minecraftSkin.outerDisplay') }}</p>
        <div class="mt-2 grid grid-cols-3 rounded-sm border border-line p-0.5" role="group" :aria-label="t('minecraftSkin.outerDisplay')">
        <button type="button" :aria-pressed="display === 'hidden'" :class="choiceClass(display === 'hidden')" @click="$emit('set-display', 'hidden')"><span :class="dotClass(display === 'hidden')" aria-hidden="true" />{{ t('minecraftSkin.outerDisplayOff') }}</button>
        <button type="button" :aria-pressed="display === 'shown'" :class="choiceClass(display === 'shown')" @click="$emit('set-display', 'shown')"><span :class="dotClass(display === 'shown')" aria-hidden="true" />{{ t('minecraftSkin.outerDisplayOn') }}</button>
        <button type="button" :aria-pressed="display === 'only'" :class="choiceClass(display === 'only')" @click="$emit('set-display', 'only')"><span :class="dotClass(display === 'only')" aria-hidden="true" />{{ t('minecraftSkin.outerDisplayOnly') }}</button>
        </div>
      </div>
      <div :class="['transition-opacity', outerVisible ? '' : 'opacity-45']" :aria-disabled="!outerVisible">
        <div class="flex items-center justify-between gap-3"><p class="tech text-haze">{{ t('minecraftSkin.outerVisibility') }}</p><span v-if="!outerVisible" class="rounded-full bg-blue/10 px-2 py-1 text-xs text-blue">{{ t('minecraftSkin.outerVisibilityDisabledHint') }}</span></div>
        <div class="mt-2 grid grid-cols-2 rounded-sm border border-line p-0.5" role="group" :aria-label="t('minecraftSkin.outerVisibility')">
        <button type="button" :aria-pressed="allSelected && !customExpanded" :disabled="!outerVisible" :class="choiceClass(allSelected && !customExpanded)" @click="$emit('select-all')">{{ t('minecraftSkin.allOuterParts') }}</button>
        <button type="button" :aria-pressed="customExpanded || !allSelected" :disabled="!outerVisible" :class="choiceClass(customExpanded || !allSelected)" @click="$emit('expand-custom')">{{ t('minecraftSkin.customOuterParts') }}</button>
        </div>
        <template v-if="outerVisible && customExpanded">
          <p class="mt-3 text-xs leading-5 text-muted-foreground">{{ t('minecraftSkin.outerVisibilityCustomHint') }}</p>
          <div class="mt-2 grid grid-cols-2 gap-2" role="group" :aria-label="t('minecraftSkin.outerVisibilityCustomHint')">
            <CenteredIconOption v-for="part in parts" :key="part.id" :label="part.label" :selected="visibleParts.includes(part.id)" :disabled="!outerVisible" @click="$emit('toggle-part', part.id)"><template #icon><BodyPartIcon :part="part.id" class="h-5 w-5 shrink-0" /></template></CenteredIconOption>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BodyPartIcon from './BodyPartIcon.vue'
import CenteredIconOption from './CenteredIconOption.vue'

const props = defineProps({ allSelected: Boolean, customExpanded: Boolean, display: { type: String, default: 'hidden' }, visibleParts: { type: Array, required: true } })
defineEmits(['expand-custom', 'select-all', 'set-display', 'toggle-part'])
const { t } = useI18n()
const outerVisible = computed(() => props.display !== 'hidden')
const parts = computed(() => [
  { id: 'head', label: t('minecraftSkin.aiPartHead') }, { id: 'body', label: t('minecraftSkin.aiPartBody') },
  { id: 'rightArm', label: t('minecraftSkin.aiPartRightArm') }, { id: 'leftArm', label: t('minecraftSkin.aiPartLeftArm') },
  { id: 'rightLeg', label: t('minecraftSkin.aiPartRightLeg') }, { id: 'leftLeg', label: t('minecraftSkin.aiPartLeftLeg') }
])
function choiceClass(active) { return ['flex h-8 items-center justify-center gap-2 rounded-[2px] text-xs transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-inset disabled:cursor-not-allowed', active ? 'border border-blue bg-blue/5 text-blue' : 'text-muted-foreground hover:text-foreground'] }
function dotClass(active) { return ['h-1.5 w-1.5 rounded-full border', active ? 'border-blue bg-blue' : 'border-line-strong'] }
</script>
