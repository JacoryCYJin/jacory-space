<template>
  <div class="lg:border lg:border-line lg:bg-card">
    <div v-if="$slots.header" class="hidden shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-3 md:px-7 lg:flex">
      <slot name="header" />
    </div>
    <div
      :id="contentId"
      data-lenis-prevent
      class="border border-line bg-card lg:border-0"
      :class="expanded ? '' : 'h-96 overflow-x-hidden overflow-y-scroll lg:h-auto lg:min-h-0 lg:flex-1'"
    >
      <pre class="whitespace-pre-wrap break-words px-5 py-6 font-mono text-sm leading-7 text-foreground md:px-7 md:py-8"><code>{{ content }}</code></pre>
    </div>
    <button
      type="button"
      class="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-blue lg:mx-5 lg:mb-3 lg:mt-3 lg:shrink-0"
      :aria-controls="contentId"
      :aria-expanded="expanded"
      @click="toggleExpanded"
    >
      <ChevronUp v-if="expanded" :size="14" stroke-width="1.5" aria-hidden="true" />
      <ChevronDown v-else :size="14" stroke-width="1.5" aria-hidden="true" />
      {{ expanded ? t('library.collapseContent') : t('library.expandContent') }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'

defineProps({
  content: {
    type: String,
    required: true,
  },
  contentId: {
    type: String,
    default: 'library-prompt-content',
  },
})

const emit = defineEmits(['expanded-change'])
const { t } = useI18n()
const expanded = ref(false)

function toggleExpanded() {
  expanded.value = !expanded.value
  emit('expanded-change', expanded.value)
}
</script>
