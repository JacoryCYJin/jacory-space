<template>
  <section class="w-72 max-w-full overflow-hidden rounded border border-line bg-card/95 backdrop-blur-sm">
    <div class="space-y-3.5 p-3.5">
      <div class="grid grid-cols-2 border border-line font-mono text-xs">
        <button type="button" class="border-r border-line px-2 py-2 transition-colors" :class="ai.state.provider === 'monadical' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'" @click="ai.actions.setProvider('monadical')">MONADICAL</button>
        <button type="button" class="px-2 py-2 transition-colors" :class="ai.state.provider === 'block' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'" @click="ai.actions.setProvider('block')">BLOCK</button>
      </div>

      <template v-if="ai.state.provider === 'monadical'">
        <textarea v-model="ai.state.prompt" class="h-28 w-full resize-y border border-line bg-background p-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-haze focus:border-blue" placeholder="例如：棕色短发，酒红色宽松外套，黑色内搭和深色袖口" />
      </template>
      <template v-else>
        <input ref="previewInput" class="sr-only" type="file" accept="image/png,image/jpeg,image/webp" @change="handlePreviewSelection" />
        <button type="button" class="flex w-full items-center justify-center gap-2 border border-dashed px-3 py-3 text-xs transition-colors" :class="ai.state.previewFile ? 'border-blue text-blue hover:border-foreground hover:text-foreground' : 'border-line text-muted-foreground hover:border-blue hover:text-blue'" @click="openPreviewPicker">
          <FileCheck2 v-if="ai.state.previewFile" class="h-4 w-4" />
          <ImageUp v-else class="h-4 w-4" />
          {{ ai.state.previewFile ? '已选择角色双视角预览图' : '上传角色双视角预览图' }}
        </button>
        <div v-if="ai.state.previewFile" class="flex items-center gap-2 border-l-2 border-blue px-3 py-2 text-xs text-muted-foreground">
          <div class="min-w-0 flex-1">
            <p class="truncate text-foreground" :title="ai.state.previewFile.name">{{ ai.state.previewFile.name }}</p>
            <p class="mt-1 font-mono text-xs text-haze">READY · {{ formatFileSize(ai.state.previewFile.size) }} · 点击转换后上传</p>
          </div>
          <button type="button" class="shrink-0 text-haze transition-colors hover:text-foreground" aria-label="移除已选预览图" @click="ai.actions.clearPreviewFile">
            <X class="h-4 w-4" />
          </button>
        </div>
        <textarea v-model="ai.state.prompt" class="h-20 w-full resize-y border border-line bg-background p-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-haze focus:border-blue" placeholder="可选：补充角色特征或转换要求" />
      </template>
      <div class="flex gap-2">
        <button type="button" class="flex-1 border border-blue bg-blue px-3 py-2 text-xs text-white transition-colors hover:border-foreground hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-50" :disabled="ai.state.isGenerating" @click="ai.actions.generate">{{ ai.state.isGenerating ? '生成中…' : ai.state.provider === 'block' ? '转换完整皮肤（测试）' : '生成完整皮肤（测试）' }}</button>
        <button v-if="ai.state.isGenerating" type="button" class="border border-line px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground" @click="ai.actions.cancel">停止</button>
      </div>
      <p v-if="ai.state.generationStatus" class="text-xs text-muted-foreground">{{ ai.state.generationStatus }}</p>
      <div v-if="ai.state.proposalCanvas" class="border-t border-line pt-3.5">
        <p class="text-xs leading-5 text-muted-foreground">完整皮肤候选已载入 2D / 3D 预览；应用前不会改动当前皮肤。</p>
        <p v-if="ai.state.proposalResult?.validation?.warnings?.length" class="mt-2 text-xs leading-5 text-haze">{{ ai.state.proposalResult.validation.warnings.join(' ') }}</p>
        <div class="mt-3 grid grid-cols-3 gap-2">
          <button type="button" class="border border-line px-2 py-2 text-xs text-muted-foreground transition-colors hover:border-blue hover:text-blue" @click="ai.state.showProposal = !ai.state.showProposal">{{ ai.state.showProposal ? '查看原皮肤' : '查看候选' }}</button>
          <button type="button" class="border border-line px-2 py-2 text-xs text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground" :disabled="ai.state.proposalApplied" @click="ai.actions.discardProposal">丢弃</button>
          <button type="button" class="border border-foreground bg-foreground px-2 py-2 text-xs text-background transition-colors hover:border-blue hover:bg-blue disabled:cursor-not-allowed disabled:opacity-60" :disabled="ai.state.proposalApplied" @click="ai.actions.applyProposal">{{ ai.state.proposalApplied ? '已应用' : '应用候选' }}</button>
        </div>
      </div>
    </div>
    <div v-if="ai.state.requestDiagnostic" class="mx-3.5 mb-3.5 border-t border-line pt-3.5 font-mono text-xs text-muted-foreground">
      <p>REQUEST / {{ ai.state.requestDiagnostic.id }}</p>
      <p class="mt-1">{{ ai.state.requestDiagnostic.provider.toUpperCase() }} · {{ ai.state.requestDiagnostic.model.toUpperCase() }}<template v-if="ai.state.requestDiagnostic.seed !== null"> · SEED {{ ai.state.requestDiagnostic.seed }}</template></p>
    </div>
    <p v-if="ai.state.generationError" class="border-l-2 border-blue px-4 py-2 text-xs leading-5 text-muted-foreground">{{ ai.state.generationError }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { FileCheck2, ImageUp, X } from 'lucide-vue-next'

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
