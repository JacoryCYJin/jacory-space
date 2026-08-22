<template>
  <div>
    <pre
      :id="contentId"
      data-lenis-prevent
      class="border border-line bg-card px-5 py-6 font-mono text-sm leading-7 text-foreground md:px-7 md:py-8"
      :class="expanded ? 'overflow-x-auto' : 'h-96 overflow-x-auto overflow-y-auto'"
    ><code>{{ content }}</code></pre>
    <button
      type="button"
      class="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-blue"
      :aria-controls="contentId"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
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
    default: 'library-skill-content',
  },
})

const { t } = useI18n()
const expanded = ref(false)
</script>
