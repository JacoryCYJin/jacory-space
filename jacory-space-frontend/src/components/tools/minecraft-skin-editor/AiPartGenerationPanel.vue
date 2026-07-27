<template>
  <section class="absolute left-[5.125rem] top-20 z-20 w-[min(20rem,calc(100vw-6.5rem))] overflow-hidden rounded-[10px] border border-line bg-card/95 backdrop-blur-sm">
    <div class="flex h-12 items-center justify-between border-b border-line px-4">
      <p class="tech">AI / {{ t('minecraftSkin.aiPartRightArm') }}</p>
      <button type="button" class="text-xs text-muted-foreground transition-colors hover:text-foreground" @click="$emit('close')">{{ t('minecraftSkin.close') }}</button>
    </div>
    <div class="space-y-3 p-4">
      <p class="text-xs leading-5 text-muted-foreground">{{ t('minecraftSkin.pixelGenerationHint') }}</p>
      <div class="border border-line bg-background transition-colors focus-within:border-blue">
        <textarea v-model="ai.state.prompt" class="h-32 w-full resize-y bg-transparent p-3 text-sm leading-6 text-foreground outline-none" :placeholder="t('minecraftSkin.aiPromptPlaceholder')" />
        <div class="flex h-10 items-center justify-between border-t border-line px-3">
          <label class="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground">
            <input v-model="ai.state.useVision" type="checkbox" class="accent-blue" />
            <span>{{ t('minecraftSkin.aiVision') }}</span>
          </label>
          <div class="flex items-center gap-2">
            <button v-if="ai.state.useVision" type="button" class="text-xs text-muted-foreground transition-colors hover:text-blue" @click="referenceInput?.click()">{{ ai.state.referenceImage ? t('minecraftSkin.aiReferenceReady') : t('minecraftSkin.aiReference') }}</button>
            <button v-if="ai.state.referenceImage" type="button" class="text-xs text-muted-foreground transition-colors hover:text-foreground" @click="ai.state.referenceImage = ''">{{ t('minecraftSkin.aiClear') }}</button>
          </div>
        </div>
      </div>
      <input ref="referenceInput" type="file" accept="image/png,image/jpeg,image/webp" class="hidden" @change="selectReference" />

      <button type="button" class="flex w-full items-center justify-between px-1 py-1 text-left transition-colors hover:text-foreground" @click="connectionOpen = !connectionOpen">
        <span class="text-xs text-muted-foreground">{{ t('minecraftSkin.aiConnection') }}</span>
        <span class="flex items-center gap-2">
          <span v-if="connectionStatus.showDot" class="h-1.5 w-1.5 rounded-full bg-blue" aria-hidden="true" />
          <span :class="['font-mono text-xs', connectionStatus.className]">{{ connectionStatus.label }}</span>
          <ChevronDown :class="['h-3.5 w-3.5 text-haze transition-transform', connectionOpen ? 'rotate-180' : '']" />
        </span>
      </button>
      <div v-if="connectionOpen" class="border border-line bg-background p-3 transition-colors focus-within:border-blue">
        <label class="block">
          <span class="tech text-haze">{{ t('minecraftSkin.aiApiKeyLabel') }}</span>
          <input v-model="ai.state.apiKey" type="password" autocomplete="off" class="mt-1 w-full border-b border-line bg-transparent pb-2 font-mono text-xs text-foreground outline-none transition-colors placeholder:text-haze focus:border-blue" :placeholder="t('minecraftSkin.aiApiKeyPlaceholder')" />
        </label>
        <label class="mt-4 block">
          <span class="tech text-haze">{{ t('minecraftSkin.aiBaseUrlLabel') }}</span>
          <input v-model="ai.state.baseUrl" type="url" class="mt-1 w-full border-b border-line bg-transparent pb-2 font-mono text-xs text-foreground outline-none transition-colors placeholder:text-haze focus:border-blue" :placeholder="t('minecraftSkin.aiBaseUrlPlaceholder')" @change="ai.actions.restoreModelCatalog" />
        </label>
        <label class="mt-4 block">
          <span class="tech text-haze">{{ t('minecraftSkin.aiModelLabel') }}</span>
          <input v-model="ai.state.model" list="minecraft-skin-ai-models" type="text" class="mt-1 w-full border-b border-line bg-transparent pb-2 font-mono text-xs text-foreground outline-none transition-colors placeholder:text-haze focus:border-blue" :placeholder="t('minecraftSkin.aiModelPlaceholder')" />
          <datalist id="minecraft-skin-ai-models"><option v-for="modelId in ai.state.modelCatalog" :key="modelId" :value="modelId" /></datalist>
        </label>
        <div class="mt-4 flex gap-2">
          <button type="button" class="border border-line px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-blue hover:text-blue disabled:cursor-not-allowed disabled:opacity-50" :disabled="ai.state.isTestingConnection || ai.state.isGenerating" @click="ai.actions.testConnection">{{ ai.state.isTestingConnection ? t('minecraftSkin.aiConnectionTesting') : t('minecraftSkin.aiConnectionTest') }}</button>
          <button type="button" class="border border-blue px-3 py-2 text-xs text-blue transition-colors hover:border-foreground hover:bg-foreground hover:text-background" :disabled="ai.state.isTestingConnection || ai.state.isGenerating" @click="ai.actions.saveConnectionSettings">{{ t('minecraftSkin.aiConnectionSave') }}</button>
        </div>
        <p v-if="ai.state.connectionTest?.state === 'error'" class="mt-3 text-xs leading-5 text-destructive">{{ ai.state.connectionTest.message }}</p>
        <p class="mt-4 text-xs leading-5 text-muted-foreground">{{ t('minecraftSkin.pixelGenerationConnectionHint') }}</p>
      </div>

      <div class="flex gap-2">
        <button type="button" class="flex-1 border border-blue bg-blue px-3 py-2 text-xs text-white transition-colors hover:border-foreground hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-50" :disabled="ai.state.isGenerating" @click="ai.actions.generate">{{ ai.state.isGenerating ? t('minecraftSkin.aiGenerating') : t('minecraftSkin.pixelGeneratePart') }}</button>
        <button v-if="ai.state.isGenerating" type="button" class="border border-line px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground" @click="ai.actions.cancel">{{ t('minecraftSkin.aiCancel') }}</button>
      </div>
      <p v-if="ai.state.generationStatus" class="text-xs text-muted-foreground">{{ ai.state.generationStatus }}</p>
      <div v-if="ai.state.proposalCanvas" class="border-t border-line pt-3">
        <p class="text-xs leading-5 text-muted-foreground">{{ t('minecraftSkin.pixelProposalReady', { count: ai.state.proposalResult?.changedPixels || 0 }) }}</p>
        <div class="mt-3 grid grid-cols-3 gap-2">
          <button type="button" class="border border-line px-2 py-2 text-xs text-muted-foreground transition-colors hover:border-blue hover:text-blue" @click="ai.state.showProposal = !ai.state.showProposal">{{ ai.state.showProposal ? t('minecraftSkin.aiShowOriginal') : t('minecraftSkin.aiShowProposal') }}</button>
          <button type="button" class="border border-line px-2 py-2 text-xs text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground" @click="ai.actions.discardProposal">{{ t('minecraftSkin.aiDiscard') }}</button>
          <button type="button" class="border border-foreground bg-foreground px-2 py-2 text-xs text-background transition-colors hover:border-blue hover:bg-blue disabled:cursor-not-allowed disabled:opacity-60" :disabled="ai.state.proposalApplied" @click="ai.actions.applyProposal">{{ ai.state.proposalApplied ? t('minecraftSkin.aiAppliedLabel') : t('minecraftSkin.aiApplyProposal') }}</button>
        </div>
      </div>
    </div>
    <div v-if="ai.state.requestDiagnostic" class="mx-4 mb-4 border-t border-line pt-3 font-mono text-xs text-muted-foreground">
      <p class="tech">{{ t('minecraftSkin.devRequestDiagnostic') }}</p>
      <dl class="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt>{{ t('minecraftSkin.devStatus') }}</dt><dd>{{ ai.state.requestDiagnostic.status }}</dd>
        <dt>{{ t('minecraftSkin.devTrace') }}</dt><dd class="truncate">{{ ai.state.requestDiagnostic.traceId || '—' }}</dd>
        <dt>{{ t('minecraftSkin.devProvider') }}</dt><dd>{{ ai.state.requestDiagnostic.code || '—' }}</dd>
        <dt>{{ t('minecraftSkin.devDetail') }}</dt><dd>{{ ai.state.requestDiagnostic.detail || '—' }}</dd>
      </dl>
    </div>
    <p v-if="ai.state.generationError" class="border-l-2 border-blue px-4 py-2 text-xs leading-5 text-muted-foreground">{{ ai.state.generationError }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({ ai: { type: Object, required: true }, connectionStatus: { type: Object, required: true } })
defineEmits(['close'])
const { t } = useI18n()
const connectionOpen = ref(false)
const referenceInput = ref(null)

function selectReference(event) {
  const file = event.target.files?.[0]
  if (file) props.ai.actions.selectReferenceImage(file)
  event.target.value = ''
}
</script>
