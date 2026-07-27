<template>
  <div class="absolute inset-0 z-30 flex items-center justify-center bg-background/70 px-5 backdrop-blur-sm">
    <section class="w-full max-w-sm border border-line bg-card p-5">
      <p class="tech">{{ t('minecraftSkin.newSkin') }}</p>
      <p class="mt-3 text-sm text-foreground">{{ t('minecraftSkin.newSkinConfirmTitle') }}</p>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">{{ t('minecraftSkin.newSkinConfirmDetail') }}</p>
      <div class="mt-5 flex justify-end gap-2"><button type="button" class="border border-line px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground" @click="$emit('cancel')">{{ t('minecraftSkin.cancel') }}</button><button type="button" class="border border-foreground bg-foreground px-3 py-2 text-xs text-background transition-colors hover:border-blue hover:bg-blue" @click="$emit('confirm')">{{ t('minecraftSkin.startNewSkin') }}</button></div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

defineEmits(['cancel', 'confirm'])
const { t } = useI18n()
</script>
