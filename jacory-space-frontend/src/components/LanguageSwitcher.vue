<template>
  <div
    class="inline-flex items-center border border-line bg-background font-mono text-[11px] tracking-[0.16em] text-muted-foreground"
    :aria-label="t('language.label')"
    role="group"
  >
    <button
      v-for="option in languageOptions"
      :key="option.value"
      type="button"
      class="relative h-8 px-3 uppercase transition-colors duration-300 hover:text-foreground"
      :class="locale === option.value ? 'text-blue' : 'text-muted-foreground'"
      :aria-pressed="locale === option.value"
      @click="switchLocale(option.value)"
    >
      <span>{{ option.shortLabel }}</span>
      <span
        class="absolute inset-x-2 bottom-1 h-px bg-blue transition-transform duration-300 ease-out"
        :class="locale === option.value ? 'scale-x-100' : 'scale-x-0'"
      />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { persistLocale, supportedLocales } from '../i18n'

const { locale, t } = useI18n()

const languageOptions = computed(() => supportedLocales.map((value) => ({
  value,
  shortLabel: value === 'zh-CN' ? 'ZH' : 'EN'
})))

const switchLocale = (value) => {
  if (locale.value !== value) {
    locale.value = value
    persistLocale(value)
  }
}
</script>
