<template>
  <pre :id="contentId" class="overflow-x-auto border border-line bg-card px-5 py-6 font-mono text-sm leading-7 text-foreground md:px-7 md:py-8"><code>{{ content }}</code></pre>
</template>

<script setup>
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
</script>
