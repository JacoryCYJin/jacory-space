<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g v-if="part === 'head'">
      <path d="m4 7 8-4 8 4-8 4-8-4Z" />
      <path d="M4 7v10l8 4 8-4V7" />
      <path d="M12 11v10" />
    </g>
    <g v-else-if="part === 'body'">
      <path d="M8 4 5 7l2 3v10h10V10l2-3-3-3" />
      <path d="M8 4h8l1 6H7l1-6Z" />
      <path d="M10 10v10M14 10v10" />
    </g>
    <g v-else-if="part === 'rightArm' || part === 'leftArm'" :transform="part === 'leftArm' ? 'translate(24 0) scale(-1 1)' : undefined">
      <path d="m9 4 3 1 1 5 4 4-1 5-3 1-2-5-4-3 1-5 1-3Z" />
      <path d="m11 10 3 2M13 17l2-1" />
    </g>
    <g v-else>
      <path d="M7 3h10l1 17h-5l-1-8-1 8H6L7 3Z" />
      <path d="M12 3v9M7 8h10" />
    </g>
  </svg>
</template>

<script setup>
defineProps({
  part: {
    type: String,
    required: true
  }
})
</script>
