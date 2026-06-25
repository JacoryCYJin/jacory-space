import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'
import jaJP from './locales/ja-JP'

const STORAGE_KEY = 'jacory_locale'

export const supportedLocales = ['zh-CN', 'en-US', 'ja-JP']

const normalizeLocale = (value) => {
  if (supportedLocales.includes(value)) return value
  const shortLocale = value?.split('-')[0]
  if (shortLocale === 'zh') return 'zh-CN'
  if (shortLocale === 'en') return 'en-US'
  if (shortLocale === 'ja') return 'ja-JP'
  return 'zh-CN'
}

const getInitialLocale = () => {
  const savedLocale = localStorage.getItem(STORAGE_KEY)
  if (savedLocale) return normalizeLocale(savedLocale)
  return normalizeLocale(navigator.language)
}

export const setDocumentLocale = (locale) => {
  document.documentElement.setAttribute('lang', locale)
}

export const persistLocale = (locale) => {
  localStorage.setItem(STORAGE_KEY, locale)
  setDocumentLocale(locale)
}

const initialLocale = getInitialLocale()

setDocumentLocale(initialLocale)

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLocale,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ja-JP': jaJP
  }
})
