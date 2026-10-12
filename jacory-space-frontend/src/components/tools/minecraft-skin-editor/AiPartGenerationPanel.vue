<template>
  <section class="w-72 max-w-full overflow-hidden rounded border border-line bg-card/95 backdrop-blur-sm">
    <div class="space-y-3.5 p-3.5">
      <div class="grid grid-cols-2 border border-line font-mono text-xs">
        <button type="button" class="border-r border-line px-2 py-2 transition-colors" :class="ai.state.provider === 'monadical' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'" @click="ai.actions.setProvider('monadical')">MONADICAL</button>
        <button type="button" class="px-2 py-2 transition-colors" :class="ai.state.provider === 'block' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'" @click="ai.actions.setProvider('block')">BLOCK</button>
      </div>

      <template v-if="ai.state.provider === 'monadical'">
        <textarea v-model="ai.state.prompt" class="h-28 w-full resize-y border border-line bg-background p-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-haze focus:border-blue" :placeholder="t('interface.ai.prompt')" />
      </template>
      <template v-else>
        <input ref="previewInput" class="sr-only" type="file" accept="image/png,image/jpeg,image/webp" @change="handlePreviewSelection" />
        <button type="button" class="flex w-full items-center justify-center gap-2 border border-dashed px-3 py-3 text-xs transition-colors" :class="ai.state.previewFile ? 'border-blue text-blue hover:border-foreground hover:text-foreground' : 'border-line text-muted-foreground hover:border-blue hover:text-blue'" @click="openPreviewPicker">
          <FileCheck2 v-if="ai.state.previewFile" class="h-4 w-4" />
          <ImageUp v-else class="h-4 w-4" />
          {{ ai.state.previewFile ? t('interface.ai.selected') : t('interface.ai.upload') }}
        </button>
        <div v-if="ai.state.previewFile" class="flex items-center gap-2 border-l-2 border-blue px-3 py-2 text-xs text-muted-foreground">
          <div class="min-w-0 flex-1">
            <p class="truncate text-foreground" :title="ai.state.previewFile.name">{{ ai.state.previewFile.name }}</p>
            <p class="mt-1 font-mono text-xs text-haze">{{ t('interface.ai.ready') }} · {{ formatFileSize(ai.state.previewFile.size) }} · {{ t('interface.ai.uploadHint') }}</p>
          </div>
          <button type="button" class="shrink-0 text-haze transition-colors hover:text-foreground" :aria-label="t('interface.ai.remove')" @click="ai.actions.clearPreviewFile">
            <X class="h-4 w-4" />
          </button>
        </div>
        <textarea v-model="ai.state.prompt" class="h-20 w-full resize-y border border-line bg-background p-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-haze focus:border-blue" :placeholder="t('interface.ai.optionalPrompt')" />
      </template>
      <div class="flex gap-2">
        <button type="button" class="flex-1 border border-blue bg-blue px-3 py-2 text-xs text-white transition-colors hover:border-foreground hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-50" :disabled="ai.state.isGenerating" @click="ai.actions.generate">{{ ai.state.isGenerating ? t('interface.ai.generating') : ai.state.provider === 'block' ? t('interface.ai.convert') : t('interface.ai.generate') }}</button>
        <button v-if="ai.state.isGenerating" type="button" class="border border-line px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground" @click="ai.actions.cancel">{{ t('interface.ai.stop') }}</button>
      </div>
      <p v-if="ai.state.generationStatus" class="text-xs text-muted-foreground">{{ ai.generationStatusText.value }}</p>
      <div v-if="ai.state.proposalResult" class="border-t border-line pt-3.5">
        <p class="text-xs leading-5 text-muted-foreground">{{ t('interface.ai.applied') }}</p>
        <p v-if="ai.state.proposalResult?.validation?.warnings?.length" class="mt-2 text-xs leading-5 text-haze">{{ ai.state.proposalResult.validation.warnings.join(' ') }}</p>
        <div class="mt-3">
          <button type="button" class="w-full border border-foreground bg-foreground px-2 py-2 text-xs text-background transition-colors hover:border-blue hover:bg-blue disabled:cursor-not-allowed disabled:opacity-60" :disabled="!ai.canRevertProposal" @click="ai.actions.revertProposal">{{ ai.state.proposalApplied ? t('interface.ai.undo') : t('interface.ai.undone') }}</button>
        </div>
      </div>
    </div>
    <div v-if="ai.state.requestDiagnostic" class="mx-3.5 mb-3.5 border-t border-line pt-3.5 font-mono text-xs text-muted-foreground">
      <p>{{ t('interface.ai.request') }} / {{ ai.state.requestDiagnostic.id }}</p>
      <p class="mt-1">{{ ai.state.requestDiagnostic.provider.toUpperCase() }} · {{ ai.state.requestDiagnostic.model.toUpperCase() }}<template v-if="ai.state.requestDiagnostic.seed !== null"> · {{ t('interface.ai.seed') }} {{ ai.state.requestDiagnostic.seed }}</template></p>
    </div>
    <p v-if="ai.state.generationError" class="border-l-2 border-blue px-4 py-2 text-xs leading-5 text-muted-foreground">{{ ai.generationErrorText.value }}</p>
    <p v-if="ai.state.generationError && ai.state.generationDetail" class="break-words px-4 pb-3 font-mono text-xs text-haze">{{ ai.state.generationDetail }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { FileCheck2, ImageUp, X } from 'lucide-vue-next'

const { t } = useI18n()

const props = defineProps({ ai: { type: Object, required: true } })

const previewInput = ref(null)

function openPreviewPicker() {
  previewInput.value?.click()
}

function handlePreviewSelection(event) {
  const [file] = event.target.files || []
  event.target.value = ''
  if (file) props.ai.actions.setPreviewFile(file)
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>
