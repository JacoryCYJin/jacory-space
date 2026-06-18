<template>
  <div ref="switcherRef" class="relative inline-block text-left">
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-lg border border-[#d8dfc0] bg-[#f7f8f3] px-3 py-2 text-sm font-medium text-[#556123] hover:bg-[#eef2e2] transition-colors"
      :aria-label="t('language.label')"
      :aria-expanded="dropdownOpen"
      aria-haspopup="listbox"
      @click="dropdownOpen = !dropdownOpen"
    >
      <Languages class="h-4 w-4" />
      <span>{{ activeLanguageLabel }}</span>
      <ChevronDown class="h-4 w-4 transition-transform" :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <div
      v-if="dropdownOpen"
      class="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
      role="listbox"
    >
      <button
        v-for="option in languageOptions"
        :key="option.value"
        type="button"
        class="flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-[#f7f8f3]"
        :class="locale === option.value ? 'text-[#b75e22] font-semibold' : 'text-gray-700'"
        role="option"
        :aria-selected="locale === option.value"
        @click="switchLocale(option.value)"
      >
        <span>{{ option.label }}</span>
        <Check v-if="locale === option.value" class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check, ChevronDown, Languages } from 'lucide-vue-next'
import { persistLocale, supportedLocales } from '../i18n'

const { locale, t } = useI18n()
const dropdownOpen = ref(false)
const switcherRef = ref(null)

const languageOptions = computed(() => supportedLocales.map((value) => ({
  value,
  label: value === 'zh-CN' ? t('language.zh') : t('language.en')
})))

const activeLanguageLabel = computed(() => (
  languageOptions.value.find((option) => option.value === locale.value)?.label || locale.value
))

const switchLocale = (value) => {
  if (locale.value !== value) {
    locale.value = value
    persistLocale(value)
  }
  dropdownOpen.value = false
}

const closeOnOutsideClick = (event) => {
  if (!switcherRef.value?.contains(event.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnOutsideClick)
})
</script>
