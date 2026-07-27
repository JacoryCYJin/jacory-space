<template>
  <section class="w-full overflow-hidden rounded-[10px] border border-line bg-card/95 backdrop-blur-sm">
    <div class="space-y-5 p-4">
      <div v-for="group in motionGroups" :key="group.id" class="space-y-2">
        <p class="tech text-haze">{{ group.label }}</p>
        <div class="grid grid-cols-2 gap-2">
          <CenteredIconOption v-for="motion in group.items" :key="motion.id" :label="motion.label" :selected="motionId === motion.id" @click="$emit('select', motion.id)"><template #icon><component :is="motionIcons[motion.id]" class="h-5 w-5 shrink-0" aria-hidden="true" /></template></CenteredIconOption>
        </div>
      </div>
      <div class="border-t border-line pt-5">
        <div class="flex items-center justify-between gap-3"><span class="tech text-haze">{{ t('minecraftSkin.playback') }}</span><button type="button" class="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-background/60 text-muted-foreground transition-colors hover:border-blue hover:bg-blue/5 hover:text-blue" :aria-label="paused ? t('minecraftSkin.play') : t('minecraftSkin.pause')" @click="$emit('update:paused', !paused)"><Play v-if="paused" class="h-4 w-4" /><Pause v-else class="h-4 w-4" /></button></div>
        <label class="mt-5 block"><span class="flex items-center justify-between"><span class="tech text-haze">{{ t('minecraftSkin.motionSpeed') }}</span><span class="font-mono text-xs text-muted-foreground">{{ speed.toFixed(1) }}×</span></span><input :value="speed" class="motion-speed-range mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full" :style="{ background: `linear-gradient(to right, var(--blue) 0%, var(--blue) ${speedProgress}%, var(--line) ${speedProgress}%, var(--line) 100%)` }" type="range" min="0.5" max="2" step="0.25" :aria-label="t('minecraftSkin.motionSpeed')" @input="$emit('update:speed', Number($event.target.value))" /></label>
        <button type="button" class="mt-5 flex h-10 w-full items-center justify-center rounded-md border border-line bg-background/60 text-xs text-muted-foreground transition-colors hover:border-blue hover:bg-blue/5 hover:text-blue" @click="$emit('reset')">{{ t('minecraftSkin.resetMotion') }}</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Activity, Bird, Box, EyeOff, Footprints, Hand, Pause, Play, Rabbit, Swords, Waves } from 'lucide-vue-next'
import CenteredIconOption from './CenteredIconOption.vue'

const props = defineProps({ motionId: { type: String, required: true }, paused: Boolean, speed: { type: Number, required: true } })
defineEmits(['reset', 'select', 'update:paused', 'update:speed'])
const { t } = useI18n()
const motionIcons = { static: Box, idle: Activity, walk: Footprints, run: Rabbit, crouch: EyeOff, swim: Waves, fly: Bird, hit: Swords, wave: Hand }
const motionGroups = computed(() => [
  { id: 'base', label: t('minecraftSkin.motionBase'), items: [{ id: 'static', label: t('minecraftSkin.motionStatic') }, { id: 'idle', label: t('minecraftSkin.motionIdle') }, { id: 'walk', label: t('minecraftSkin.motionWalk') }, { id: 'run', label: t('minecraftSkin.motionRun') }] },
  { id: 'state', label: t('minecraftSkin.motionState'), items: [{ id: 'crouch', label: t('minecraftSkin.motionCrouch') }, { id: 'swim', label: t('minecraftSkin.motionSwim') }, { id: 'fly', label: t('minecraftSkin.motionFly') }] },
  { id: 'gesture', label: t('minecraftSkin.motionGesture'), items: [{ id: 'hit', label: t('minecraftSkin.motionHit') }, { id: 'wave', label: t('minecraftSkin.motionWave') }] }
])
const speedProgress = computed(() => ((props.speed - 0.5) / 1.5) * 100)
</script>

<style scoped>
.motion-speed-range::-webkit-slider-thumb { width: 0.875rem; height: 0.875rem; appearance: none; border: 1px solid var(--blue); border-radius: 9999px; background: var(--card); }
.motion-speed-range::-moz-range-thumb { width: 0.875rem; height: 0.875rem; border: 1px solid var(--blue); border-radius: 9999px; background: var(--card); }
</style>
