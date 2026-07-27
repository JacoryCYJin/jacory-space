<template>
  <div class="absolute bottom-5 right-5 flex items-center gap-2">
    <input ref="fileInput" type="file" accept="image/png" class="hidden" @change="importFile" />
    <button type="button" class="border border-line bg-card px-3 py-2 text-xs text-foreground transition-colors hover:border-blue hover:text-blue disabled:cursor-not-allowed disabled:opacity-40" :disabled="motionLocked" @click="$emit('new')"><FilePlus2 class="mr-2 inline-block h-4 w-4 align-[-3px]" />{{ t('minecraftSkin.newSkin') }}</button>
    <button type="button" class="border border-line bg-card px-3 py-2 text-xs text-foreground transition-colors hover:border-blue hover:text-blue disabled:cursor-not-allowed disabled:opacity-40" :disabled="motionLocked" @click="fileInput?.click()"><Upload class="mr-2 inline-block h-4 w-4 align-[-3px]" />{{ t('minecraftSkin.import') }}</button>
    <button type="button" class="border border-foreground bg-foreground px-3 py-2 text-xs text-background transition-colors hover:border-blue hover:bg-blue" @click="$emit('export')"><Download class="mr-2 inline-block h-4 w-4 align-[-3px]" />{{ t('minecraftSkin.export') }}</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Download, FilePlus2, Upload } from 'lucide-vue-next'

defineProps({ motionLocked: Boolean })
const emit = defineEmits(['export', 'import', 'new'])
const { t } = useI18n()
const fileInput = ref(null)
function importFile(event) {
  const file = event.target.files?.[0]
  if (file) emit('import', file)
  event.target.value = ''
}
</script>
