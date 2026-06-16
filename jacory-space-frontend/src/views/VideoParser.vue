<template>
  <div class="min-h-screen bg-white py-10 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Clapperboard class="h-10 w-10 text-[#b75e22]" />
          <span>{{ t('videoParser.title') }}</span>
        </h1>
        <p class="text-gray-600">{{ t('videoParser.subtitle') }}</p>
        <p class="text-gray-500 text-sm mt-2 inline-flex items-center gap-1">
          <Lightbulb class="h-4 w-4" />
          <span>{{ t('videoParser.tip') }}</span>
        </p>
      </div>

      <div class="text-center mb-4 flex justify-center gap-2">
        <button
          @click="openCookiesModal"
          class="inline-flex items-center gap-2 px-4 py-2 bg-[#f7f8f3] hover:bg-[#eef2e2] text-[#445122] rounded-lg border border-[#d8dfc0] transition-colors text-sm font-medium"
        >
          <Key class="h-4 w-4" />
          <span>{{ t('videoParser.cookiesSettings') }}</span>
        </button>
        <button
          @click="openDownloadSettingsModal"
          class="inline-flex items-center gap-2 px-4 py-2 bg-[#f7f8f3] hover:bg-[#eef2e2] text-[#445122] rounded-lg border border-[#d8dfc0] transition-colors text-sm font-medium"
        >
          <FolderOpen class="h-4 w-4" />
          <span>{{ t('videoParser.downloadSettings') }}</span>
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 p-8">
        <div class="flex gap-3 mb-6">
          <input
            v-model="videoUrl"
            @keypress.enter="parseVideo"
            type="text"
            :placeholder="t('videoParser.inputPlaceholder')"
            class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6b7a2e] transition-colors"
          />
          <button
            @click="parseVideo"
            :disabled="loading || !videoUrl.trim()"
            class="px-6 py-3 bg-[#6b7a2e] text-white rounded-lg font-semibold hover:bg-[#556123] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? t('videoParser.parsing') : t('videoParser.parse') }}
          </button>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#b75e22] border-t-transparent"></div>
          <p class="mt-4 text-gray-600">{{ t('videoParser.loading') }}</p>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {{ success }}
        </div>

        <div v-if="videoInfo" class="mt-6">
          <div class="flex gap-6 mb-6 pb-6 border-b-2 border-gray-100">
            <img
              v-if="videoInfo.thumbnail_proxy || videoInfo.thumbnail"
              :src="videoInfo.thumbnail_proxy || videoInfo.thumbnail"
              :alt="t('videoParser.thumbnailAlt')"
              referrerpolicy="no-referrer"
              crossorigin="anonymous"
              class="w-64 h-auto rounded-lg shadow-md"
            />
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ videoInfo.title }}</h2>
              <p v-if="videoInfo.duration" class="text-gray-600">
                {{ t('videoParser.duration') }}: {{ formatDuration(videoInfo.duration) }}
              </p>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ t('videoParser.availableResolutions') }}</h3>
            <div class="space-y-3">
              <div
                v-for="format in videoInfo.formats"
                :key="format.format_id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center gap-6">
                  <span class="text-xl font-bold text-[#6b7a2e] min-w-[80px]">{{ format.resolution }}</span>
                  <span class="text-gray-600 text-sm">{{ format.format_note || format.ext }}</span>
                  <span class="text-gray-600 text-sm">{{ t('videoParser.size') }}: {{ format.filesize_mb }} MB</span>
                </div>
                <button
                  @click="downloadVideo(format)"
                  :disabled="downloading[format.resolution]"
                  class="px-5 py-2 bg-[#6b7a2e] text-white rounded-lg font-medium hover:bg-[#556123] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {{ downloading[format.resolution] ? t('videoParser.downloading') : t('videoParser.download') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showCookiesModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showCookiesModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800">{{ t('videoParser.cookiesManagement') }}</h3>
          <button @click="showCookiesModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="h-6 w-6" />
          </button>
        </div>

        <div class="p-4 rounded-lg border border-[#d8dfc0] bg-[#f7f8f3] mb-6">
          <p class="text-sm font-semibold text-gray-700 mb-3">{{ t('videoParser.cookieUsage') }}</p>
          <div class="grid md:grid-cols-3 gap-3">
            <select v-model="cookieMode" class="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6b7a2e] bg-white">
              <option value="manual">{{ t('videoParser.cookieModes.manual') }}</option>
              <option value="browser">{{ t('videoParser.cookieModes.browser') }}</option>
              <option value="none">{{ t('videoParser.cookieModes.none') }}</option>
            </select>
            <select
              v-model="browserCookieSource"
              :disabled="cookieMode !== 'browser'"
              class="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6b7a2e] bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="chrome">Chrome</option>
              <option value="safari">Safari</option>
              <option value="firefox">Firefox</option>
              <option value="edge">Edge</option>
            </select>
            <button
              @click="saveCookieSettings"
              :disabled="savingCookieSettings"
              class="px-4 py-2 bg-[#6b7a2e] text-white rounded-lg text-sm font-medium hover:bg-[#556123] disabled:bg-gray-300"
            >
              {{ savingCookieSettings ? t('videoParser.saving') : t('videoParser.saveUsage') }}
            </button>
          </div>
          <p class="text-xs text-gray-600 mt-3">
            <span v-if="cookieMode === 'browser'">{{ t('videoParser.cookieHelp.browser', { browser: browserCookieSource }) }}</span>
            <span v-else-if="cookieMode === 'manual'">{{ t('videoParser.cookieHelp.manual') }}</span>
            <span v-else>{{ t('videoParser.cookieHelp.none') }}</span>
          </p>
          <div
            v-if="cookieSettingsStatus"
            class="mt-3 p-3 rounded-lg text-sm"
            :class="cookieSettingsStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
          >
            {{ cookieSettingsStatus.message }}
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mb-6">
          <div class="border-2 rounded-lg p-4" :class="cookiesInfo.youtube?.has_cookies ? 'border-green-500 bg-green-50' : 'border-gray-200'">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <Youtube class="h-6 w-6 text-[#b75e22]" />
                <span class="font-bold text-gray-800">YouTube</span>
              </div>
              <span v-if="cookiesInfo.youtube?.has_cookies" class="inline-flex items-center gap-1 text-green-600 text-sm">
                <Check class="h-4 w-4" />
                <span>{{ t('videoParser.status.set') }}</span>
              </span>
              <span v-else class="text-gray-400 text-sm">{{ t('videoParser.status.unset') }}</span>
            </div>
            <div class="flex gap-2">
              <button @click="editPlatform('youtube')" class="flex-1 px-3 py-2 bg-[#b75e22] text-white rounded-lg text-sm hover:bg-[#964a19] transition-colors">
                {{ cookiesInfo.youtube?.has_cookies ? t('videoParser.actions.edit') : t('videoParser.actions.set') }}
              </button>
              <button v-if="cookiesInfo.youtube?.has_cookies" @click="deletePlatformCookies('youtube')" class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors">{{ t('videoParser.actions.delete') }}</button>
            </div>
          </div>

          <div class="border-2 rounded-lg p-4" :class="cookiesInfo.bilibili?.has_cookies ? 'border-green-500 bg-green-50' : 'border-gray-200'">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <MonitorPlay class="h-6 w-6 text-[#b75e22]" />
                <span class="font-bold text-gray-800">Bilibili</span>
              </div>
              <span v-if="cookiesInfo.bilibili?.has_cookies" class="inline-flex items-center gap-1 text-green-600 text-sm">
                <Check class="h-4 w-4" />
                <span>{{ t('videoParser.status.set') }}</span>
              </span>
              <span v-else class="text-gray-400 text-sm">{{ t('videoParser.status.unset') }}</span>
            </div>
            <div class="flex gap-2">
              <button @click="editPlatform('bilibili')" class="flex-1 px-3 py-2 bg-[#b75e22] text-white rounded-lg text-sm hover:bg-[#964a19] transition-colors">
                {{ cookiesInfo.bilibili?.has_cookies ? t('videoParser.actions.edit') : t('videoParser.actions.set') }}
              </button>
              <button v-if="cookiesInfo.bilibili?.has_cookies" @click="deletePlatformCookies('bilibili')" class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors">{{ t('videoParser.actions.delete') }}</button>
            </div>
          </div>

          <div v-for="platform in customPlatforms" :key="platform" class="border-2 rounded-lg p-4" :class="cookiesInfo[platform]?.has_cookies ? 'border-green-500 bg-green-50' : 'border-gray-200'">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <Globe class="h-6 w-6 text-[#b75e22]" />
                <span class="font-bold text-gray-800">{{ platform }}</span>
              </div>
              <span v-if="cookiesInfo[platform]?.has_cookies" class="inline-flex items-center gap-1 text-green-600 text-sm">
                <Check class="h-4 w-4" />
                <span>{{ t('videoParser.status.set') }}</span>
              </span>
              <span v-else class="text-gray-400 text-sm">{{ t('videoParser.status.unset') }}</span>
            </div>
            <div class="flex gap-2">
              <button @click="editPlatform(platform)" class="flex-1 px-3 py-2 bg-[#b75e22] text-white rounded-lg text-sm hover:bg-[#964a19] transition-colors">
                {{ cookiesInfo[platform]?.has_cookies ? t('videoParser.actions.edit') : t('videoParser.actions.set') }}
              </button>
              <button @click="deletePlatformCookies(platform)" class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors">{{ t('videoParser.actions.delete') }}</button>
            </div>
          </div>

          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
            <button @click="showAddPlatform = true" class="inline-flex flex-col items-center text-gray-500 hover:text-gray-700 transition-colors">
              <Plus class="h-8 w-8" />
              <p class="text-sm mt-1">{{ t('videoParser.addCustomPlatform') }}</p>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showDownloadSettingsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showDownloadSettingsModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800">{{ t('videoParser.downloadDirectorySettings') }}</h3>
          <button @click="showDownloadSettingsModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="h-6 w-6" />
          </button>
        </div>
        <div class="space-y-4">
          <div class="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <p class="text-sm font-semibold text-gray-700 mb-2">{{ t('videoParser.defaultDownloadDirectory') }}</p>
            <p class="text-sm text-gray-600 break-all mb-3">{{ defaultDownloadDir || t('videoParser.notSet') }}</p>
            <button @click="chooseFolderAndSaveDefault" :disabled="savingSettings" class="px-4 py-2 bg-[#b75e22] text-white rounded-lg text-sm font-medium hover:bg-[#964a19] disabled:bg-gray-300">
              {{ savingSettings ? t('videoParser.saving') : t('videoParser.chooseDefaultDirectory') }}
            </button>
          </div>
          <div class="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <p class="text-sm font-semibold text-gray-700 mb-2">{{ t('videoParser.oneTimeDownloadDirectory') }}</p>
            <p class="text-sm text-gray-600 break-all mb-3">{{ downloadDirOverride || t('videoParser.oneTimeDirectoryFallback') }}</p>
            <div class="flex gap-2">
              <button @click="chooseFolderForOnce" class="px-4 py-2 bg-[#6b7a2e] text-white rounded-lg text-sm font-medium hover:bg-[#556123]">{{ t('videoParser.chooseOneTimeDirectory') }}</button>
              <button @click="downloadDirOverride = ''" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">{{ t('videoParser.clearOneTimeDirectory') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddPlatform" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showAddPlatform = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">{{ t('videoParser.addPlatformTitle') }}</h3>
        <input v-model="newPlatformName" type="text" :placeholder="t('videoParser.platformPlaceholder')" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6b7a2e] mb-4" @keypress.enter="addCustomPlatform" />
        <div class="flex gap-3">
          <button @click="addCustomPlatform" :disabled="!newPlatformName.trim()" class="flex-1 px-6 py-3 bg-[#6b7a2e] text-white rounded-lg font-semibold hover:bg-[#556123] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">{{ t('videoParser.actions.add') }}</button>
          <button @click="showAddPlatform = false" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">{{ t('videoParser.actions.cancel') }}</button>
        </div>
      </div>
    </div>

    <div v-if="showEditCookies" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showEditCookies = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800">{{ t('videoParser.setCookiesTitle', { platform: editingPlatform }) }}</h3>
          <button @click="showEditCookies = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="h-6 w-6" />
          </button>
        </div>
        <div class="mb-3 p-3 bg-[#f6f2e8] rounded-lg text-sm text-gray-700">
          <p class="inline-flex items-center gap-1">
            <Lightbulb class="h-4 w-4" />
            <span>{{ t('videoParser.cookiesSavedTip') }}</span>
          </p>
        </div>
        <textarea v-model="cookiesText" :placeholder="t('videoParser.cookiesPlaceholder', { platform: editingPlatform })" class="w-full h-64 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6b7a2e] font-mono text-sm mb-4"></textarea>
        <div class="flex gap-3">
          <button @click="saveCookies" :disabled="!cookiesText.trim() || savingCookies" class="flex-1 px-6 py-3 bg-[#6b7a2e] text-white rounded-lg font-semibold hover:bg-[#556123] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">{{ savingCookies ? t('videoParser.saving') : t('videoParser.actions.save') }}</button>
          <button @click="showEditCookies = false" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">{{ t('videoParser.actions.cancel') }}</button>
        </div>
        <div v-if="cookiesStatus" class="mt-4 p-3 rounded-lg" :class="cookiesStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">{{ cookiesStatus.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { Check, Clapperboard, FolderOpen, Globe, Key, Lightbulb, MonitorPlay, Plus, X, Youtube } from 'lucide-vue-next'

const { t } = useI18n()

const getClientId = () => {
  const key = 'jacory_client_id'
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const generated = `u_${crypto.randomUUID().replace(/-/g, '')}`
  localStorage.setItem(key, generated)
  return generated
}

axios.defaults.headers.common['x-client-id'] = getClientId()

const videoUrl = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const videoInfo = ref(null)
const downloading = reactive({})
const defaultDownloadDir = ref('')
const downloadDirOverride = ref('')
const savingSettings = ref(false)
const cookieMode = ref('manual')
const browserCookieSource = ref('chrome')
const savingCookieSettings = ref(false)
const cookieSettingsStatus = ref(null)

const showCookiesModal = ref(false)
const showDownloadSettingsModal = ref(false)
const showEditCookies = ref(false)
const showAddPlatform = ref(false)
const cookiesText = ref('')
const savingCookies = ref(false)
const cookiesStatus = ref(null)
const editingPlatform = ref('')
const newPlatformName = ref('')
const customPlatforms = ref([])
const cookiesInfo = ref({ youtube: {}, bilibili: {} })

const parseVideo = async () => {
  const url = videoUrl.value.trim()
  if (!url) {
    error.value = t('videoParser.errors.emptyUrl')
    return
  }
  loading.value = true
  error.value = ''
  success.value = ''
  videoInfo.value = null
  try {
    const response = await axios.post('/api/parse', { url })
    videoInfo.value = response.data
    videoUrl.value = response.data?.source_url || url
  } catch (err) {
    error.value = err.response?.data?.error || t('videoParser.errors.parseFailed', { message: err.message })
  } finally {
    loading.value = false
  }
}

const downloadVideo = async (format) => {
  const resolution = format?.resolution || ''
  downloading[resolution] = true
  error.value = ''
  success.value = t('videoParser.messages.downloadingResolution', { resolution })
  try {
    const response = await axios.post('/api/download', {
      url: videoUrl.value,
      resolution,
      format_id: format?.format_id || '',
      output_dir: downloadDirOverride.value.trim() || undefined
    })
    success.value = t('videoParser.messages.downloadComplete', { path: response.data.path })
  } catch (err) {
    error.value = err.response?.data?.error || t('videoParser.errors.downloadFailed', { message: err.message })
    success.value = ''
  } finally {
    downloading[resolution] = false
  }
}

const loadSettings = async () => {
  try {
    const response = await axios.get('/api/settings')
    defaultDownloadDir.value = response.data.default_download_dir || ''
    cookieMode.value = response.data.cookie_mode || 'manual'
    browserCookieSource.value = response.data.browser_cookie_source || 'chrome'
  } catch (err) {
    console.error(t('videoParser.errors.loadSettingsFailed'), err)
  }
}

const saveDefaultDownloadDir = async () => {
  if (!defaultDownloadDir.value.trim()) return
  savingSettings.value = true
  error.value = ''
  try {
    const response = await axios.post('/api/settings', {
      default_download_dir: defaultDownloadDir.value.trim()
    })
    defaultDownloadDir.value = response.data.default_download_dir || defaultDownloadDir.value
    success.value = t('videoParser.messages.defaultDirSaved', { path: defaultDownloadDir.value })
  } catch (err) {
    error.value = err.response?.data?.error || t('videoParser.errors.saveDefaultDirFailed')
  } finally {
    savingSettings.value = false
  }
}

const saveCookieSettings = async () => {
  savingCookieSettings.value = true
  cookieSettingsStatus.value = null
  try {
    await axios.post('/api/settings', {
      cookie_mode: cookieMode.value,
      browser_cookie_source: browserCookieSource.value
    })
    cookieSettingsStatus.value = { type: 'success', message: t('videoParser.messages.cookieUsageSaved') }
  } catch (err) {
    cookieSettingsStatus.value = { type: 'error', message: err.response?.data?.error || t('videoParser.errors.saveCookieSettingsFailed') }
  } finally {
    savingCookieSettings.value = false
  }
}

const chooseFolderNative = async () => {
  const response = await axios.post('/api/folder-dialog')
  if (response.data?.cancelled) return ''
  return response.data?.path || ''
}

const chooseFolderAndSaveDefault = async () => {
  try {
    const selected = await chooseFolderNative()
    if (!selected) return
    defaultDownloadDir.value = selected
    await saveDefaultDownloadDir()
  } catch (err) {
    error.value = err.response?.data?.error || t('videoParser.errors.folderDialogFailed')
  }
}

const chooseFolderForOnce = async () => {
  try {
    const selected = await chooseFolderNative()
    if (!selected) return
    downloadDirOverride.value = selected
  } catch (err) {
    error.value = err.response?.data?.error || t('videoParser.errors.folderDialogFailed')
  }
}

const formatDuration = (seconds) => {
  const total = Math.max(0, Math.round(Number(seconds) || 0))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

const loadCookiesInfo = async () => {
  try {
    const response = await axios.get('/api/cookies')
    cookiesInfo.value = response.data.platforms || {}
    customPlatforms.value = response.data.custom_platforms || []
  } catch (err) {
    console.error(t('videoParser.errors.loadCookiesFailed'), err)
  }
}

const editPlatform = async (platform) => {
  editingPlatform.value = platform
  cookiesStatus.value = null
  showEditCookies.value = true
  if (cookiesInfo.value[platform]?.has_cookies) {
    try {
      const response = await axios.get(`/api/cookies/${platform}`)
      cookiesText.value = response.data.cookies || ''
    } catch (_err) {
      cookiesText.value = ''
    }
  } else {
    cookiesText.value = ''
  }
}

const saveCookies = async () => {
  savingCookies.value = true
  cookiesStatus.value = null
  try {
    const response = await axios.post('/api/cookies', {
      cookies: cookiesText.value,
      platform: editingPlatform.value
    })
    cookiesStatus.value = { type: 'success', message: response.data.message }
    await loadCookiesInfo()
    setTimeout(() => {
      showEditCookies.value = false
      cookiesText.value = ''
      cookiesStatus.value = null
    }, 1500)
  } catch (err) {
    cookiesStatus.value = { type: 'error', message: err.response?.data?.error || t('videoParser.errors.saveFailed') }
  } finally {
    savingCookies.value = false
  }
}

const deletePlatformCookies = async (platform) => {
  if (!confirm(t('videoParser.messages.confirmDeleteCookies', { platform }))) return
  try {
    await axios.delete(`/api/cookies/${platform}`)
    await loadCookiesInfo()
  } catch (_err) {
    alert(t('videoParser.errors.deleteFailed'))
  }
}

const addCustomPlatform = () => {
  const name = newPlatformName.value.trim().toLowerCase()
  if (!name) return
  if (customPlatforms.value.includes(name) || name === 'youtube' || name === 'bilibili') {
    alert(t('videoParser.errors.platformExists'))
    return
  }
  customPlatforms.value.push(name)
  newPlatformName.value = ''
  showAddPlatform.value = false
  editPlatform(name)
}

const openCookiesModal = async () => {
  showCookiesModal.value = true
  cookieSettingsStatus.value = null
  await Promise.all([loadCookiesInfo(), loadSettings()])
}

const openDownloadSettingsModal = async () => {
  showDownloadSettingsModal.value = true
  await loadSettings()
}

loadSettings()
</script>
