<template>
  <SingleSelect
    :model-value="locale"
    :options="languageOptions"
    :label="t('language.label')"
    :placement="placement"
    variant="boxed"
    @update:model-value="switchLocale"
  >
    <template #trigger="{ selected }">
      <Globe2 class="h-3.5 w-3.5" :stroke-width="1.5" aria-hidden="true" />
      <span>{{ selected?.shortLabel }}</span>
    </template>
  </SingleSelect>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Globe2 } from 'lucide-vue-next'
import { persistLocale, supportedLocales } from '../i18n'
import SingleSelect from './ui/SingleSelect.vue'

defineProps({ placement: { type: String, default: 'responsive' } })
const { locale, t } = useI18n()
const languageKey = value => value.split('-')[0]
const languageShortLabel = value => languageKey(value) === 'ja' ? 'JP' : languageKey(value).toUpperCase()
const languageOptions = computed(() => supportedLocales.map(value => ({
  value,
  shortLabel: languageShortLabel(value),
  label: t(`language.${languageKey(value)}`),
})))

function switchLocale(value) {
  if (locale.value !== value) {
    locale.value = value
    persistLocale(value)
  }
}
</script>
