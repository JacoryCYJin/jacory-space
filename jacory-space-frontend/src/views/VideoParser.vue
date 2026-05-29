<template>
  <div class="min-h-screen bg-white py-10 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">🎬 视频解析下载工具</h1>
        <p class="text-gray-600">支持 Bilibili、YouTube 等多平台视频解析</p>
        <p class="text-gray-500 text-sm mt-2">💡 提示：Bilibili 支持最佳，YouTube 可能受限</p>
      </div>

      <div class="text-center mb-4 flex justify-center gap-2">
        <button
          @click="openCookiesModal"
          class="px-4 py-2 bg-[#f7f8f3] hover:bg-[#eef2e2] text-[#445122] rounded-lg border border-[#d8dfc0] transition-colors text-sm font-medium"
        >
          🔑 Cookies 设置
        </button>
        <button
          @click="openDownloadSettingsModal"
          class="px-4 py-2 bg-[#f7f8f3] hover:bg-[#eef2e2] text-[#445122] rounded-lg border border-[#d8dfc0] transition-colors text-sm font-medium"
        >
          📁 下载目录设置
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 p-8">
        <div class="flex gap-3 mb-6">
          <input
            v-model="videoUrl"
            @keypress.enter="parseVideo"
            type="text"
            placeholder="请输入视频链接（支持 YouTube, Bilibili 等平台）"
            class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6b7a2e] transition-colors"
          />
          <button
            @click="parseVideo"
            :disabled="loading || !videoUrl.trim()"
            class="px-6 py-3 bg-[#6b7a2e] text-white rounded-lg font-semibold hover:bg-[#556123] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? '解析中...' : '解析视频' }}
          </button>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#b75e22] border-t-transparent"></div>
          <p class="mt-4 text-gray-600">正在解析视频...</p>
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
              v-if="videoInfo.thumbnail"
              :src="videoInfo.thumbnail"
              alt="视频缩略图"
              class="w-64 h-auto rounded-lg shadow-md"
            />
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ videoInfo.title }}</h2>
              <p v-if="videoInfo.duration" class="text-gray-600">
                时长: {{ formatDuration(videoInfo.duration) }}
              </p>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4">可用分辨率：</h3>
            <div class="space-y-3">
              <div
                v-for="format in videoInfo.formats"
                :key="format.format_id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center gap-6">
                  <span class="text-xl font-bold text-[#6b7a2e] min-w-[80px]">{{ format.resolution }}</span>
                  <span class="text-gray-600 text-sm">{{ format.format_note || format.ext }}</span>
                  <span class="text-gray-600 text-sm">大小: {{ format.filesize_mb }} MB</span>
                </div>
                <button
                  @click="downloadVideo(format.resolution)"
                  :disabled="downloading[format.resolution]"
                  class="px-5 py-2 bg-[#6b7a2e] text-white rounded-lg font-medium hover:bg-[#556123] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {{ downloading[format.resolution] ? '下载中...' : '下载' }}
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
          <h3 class="text-2xl font-bold text-gray-800">Cookies 管理</h3>
          <button @click="showCookiesModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mb-6">
          <div class="border-2 rounded-lg p-4" :class="cookiesInfo.youtube?.has_cookies ? 'border-green-500 bg-green-50' : 'border-gray-200'">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2"><span class="text-2xl">📺</span><span class="font-bold text-gray-800">YouTube</span></div>
              <span v-if="cookiesInfo.youtube?.has_cookies" class="text-green-600 text-sm">✓ 已设置</span>
              <span v-else class="text-gray-400 text-sm">未设置</span>
            </div>
            <div class="flex gap-2">
              <button @click="editPlatform('youtube')" class="flex-1 px-3 py-2 bg-[#b75e22] text-white rounded-lg text-sm hover:bg-[#964a19] transition-colors">
                {{ cookiesInfo.youtube?.has_cookies ? '编辑' : '设置' }}
              </button>
              <button v-if="cookiesInfo.youtube?.has_cookies" @click="deletePlatformCookies('youtube')" class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors">删除</button>
            </div>
          </div>

          <div class="border-2 rounded-lg p-4" :class="cookiesInfo.bilibili?.has_cookies ? 'border-green-500 bg-green-50' : 'border-gray-200'">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2"><span class="text-2xl">📱</span><span class="font-bold text-gray-800">Bilibili</span></div>
              <span v-if="cookiesInfo.bilibili?.has_cookies" class="text-green-600 text-sm">✓ 已设置</span>
              <span v-else class="text-gray-400 text-sm">未设置</span>
            </div>
            <div class="flex gap-2">
              <button @click="editPlatform('bilibili')" class="flex-1 px-3 py-2 bg-[#b75e22] text-white rounded-lg text-sm hover:bg-[#964a19] transition-colors">
                {{ cookiesInfo.bilibili?.has_cookies ? '编辑' : '设置' }}
              </button>
              <button v-if="cookiesInfo.bilibili?.has_cookies" @click="deletePlatformCookies('bilibili')" class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors">删除</button>
            </div>
          </div>

          <div v-for="platform in customPlatforms" :key="platform" class="border-2 rounded-lg p-4" :class="cookiesInfo[platform]?.has_cookies ? 'border-green-500 bg-green-50' : 'border-gray-200'">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2"><span class="text-2xl">🌐</span><span class="font-bold text-gray-800">{{ platform }}</span></div>
              <span v-if="cookiesInfo[platform]?.has_cookies" class="text-green-600 text-sm">✓ 已设置</span>
              <span v-else class="text-gray-400 text-sm">未设置</span>
            </div>
            <div class="flex gap-2">
              <button @click="editPlatform(platform)" class="flex-1 px-3 py-2 bg-[#b75e22] text-white rounded-lg text-sm hover:bg-[#964a19] transition-colors">
                {{ cookiesInfo[platform]?.has_cookies ? '编辑' : '设置' }}
              </button>
              <button @click="deletePlatformCookies(platform)" class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors">删除</button>
            </div>
          </div>

          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
            <button @click="showAddPlatform = true" class="text-gray-500 hover:text-gray-700 transition-colors">
              <span class="text-3xl">+</span>
              <p class="text-sm mt-1">添加自定义平台</p>
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
          <h3 class="text-2xl font-bold text-gray-800">下载目录设置</h3>
          <button @click="showDownloadSettingsModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        <div class="space-y-4">
          <div class="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <p class="text-sm font-semibold text-gray-700 mb-2">默认下载目录</p>
            <p class="text-sm text-gray-600 break-all mb-3">{{ defaultDownloadDir || '未设置' }}</p>
            <button @click="chooseFolderAndSaveDefault" :disabled="savingSettings" class="px-4 py-2 bg-[#b75e22] text-white rounded-lg text-sm font-medium hover:bg-[#964a19] disabled:bg-gray-300">
              {{ savingSettings ? '保存中...' : '选择默认目录' }}
            </button>
          </div>
          <div class="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <p class="text-sm font-semibold text-gray-700 mb-2">本次下载目录（可选）</p>
            <p class="text-sm text-gray-600 break-all mb-3">{{ downloadDirOverride || '未设置（将使用默认目录）' }}</p>
            <div class="flex gap-2">
              <button @click="chooseFolderForOnce" class="px-4 py-2 bg-[#6b7a2e] text-white rounded-lg text-sm font-medium hover:bg-[#556123]">选择本次目录</button>
              <button @click="downloadDirOverride = ''" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">清空本次目录</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddPlatform" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showAddPlatform = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">添加自定义平台</h3>
        <input v-model="newPlatformName" type="text" placeholder="输入平台名称（如：twitter、instagram）" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6b7a2e] mb-4" @keypress.enter="addCustomPlatform" />
        <div class="flex gap-3">
          <button @click="addCustomPlatform" :disabled="!newPlatformName.trim()" class="flex-1 px-6 py-3 bg-[#6b7a2e] text-white rounded-lg font-semibold hover:bg-[#556123] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">添加</button>
          <button @click="showAddPlatform = false" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">取消</button>
        </div>
      </div>
    </div>

    <div v-if="showEditCookies" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showEditCookies = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800">设置 {{ editingPlatform }} Cookies</h3>
          <button @click="showEditCookies = false" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        <div class="mb-3 p-3 bg-[#f6f2e8] rounded-lg text-sm text-gray-700"><p>💡 提示：Cookies 已保存在服务器，刷新页面不会丢失</p></div>
        <textarea v-model="cookiesText" :placeholder="`粘贴 ${editingPlatform} cookies.txt 内容到这里...`" class="w-full h-64 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6b7a2e] font-mono text-sm mb-4"></textarea>
        <div class="flex gap-3">
          <button @click="saveCookies" :disabled="!cookiesText.trim() || savingCookies" class="flex-1 px-6 py-3 bg-[#6b7a2e] text-white rounded-lg font-semibold hover:bg-[#556123] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">{{ savingCookies ? '保存中...' : '保存' }}</button>
          <button @click="showEditCookies = false" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">取消</button>
        </div>
        <div v-if="cookiesStatus" class="mt-4 p-3 rounded-lg" :class="cookiesStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">{{ cookiesStatus.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

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
    error.value = '请输入视频链接'
    return
  }
  loading.value = true
  error.value = ''
  success.value = ''
  videoInfo.value = null
  try {
    const response = await axios.post('/api/parse', { url })
    videoInfo.value = response.data
  } catch (err) {
    error.value = err.response?.data?.error || '解析失败: ' + err.message
  } finally {
    loading.value = false
  }
}

const downloadVideo = async (resolution) => {
  downloading[resolution] = true
  error.value = ''
  success.value = `正在下载 ${resolution} 版本...`
  try {
    const response = await axios.post('/api/download', {
      url: videoUrl.value,
      resolution,
      output_dir: downloadDirOverride.value.trim() || undefined
    })
    success.value = `下载完成！文件保存在: ${response.data.path}`
  } catch (err) {
    error.value = err.response?.data?.error || '下载失败: ' + err.message
    success.value = ''
  } finally {
    downloading[resolution] = false
  }
}

const loadSettings = async () => {
  try {
    const response = await axios.get('/api/settings')
    defaultDownloadDir.value = response.data.default_download_dir || ''
  } catch (err) {
    console.error('加载设置失败', err)
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
    success.value = `默认下载目录已保存: ${defaultDownloadDir.value}`
  } catch (err) {
    error.value = err.response?.data?.error || '保存默认下载目录失败'
  } finally {
    savingSettings.value = false
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
    error.value = err.response?.data?.error || '打开系统文件夹选择失败'
  }
}

const chooseFolderForOnce = async () => {
  try {
    const selected = await chooseFolderNative()
    if (!selected) return
    downloadDirOverride.value = selected
  } catch (err) {
    error.value = err.response?.data?.error || '打开系统文件夹选择失败'
  }
}

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

const loadCookiesInfo = async () => {
  try {
    const response = await axios.get('/api/cookies')
    cookiesInfo.value = response.data.platforms || {}
    customPlatforms.value = response.data.custom_platforms || []
  } catch (err) {
    console.error('加载 cookies 状态失败', err)
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
    cookiesStatus.value = { type: 'error', message: err.response?.data?.error || '保存失败' }
  } finally {
    savingCookies.value = false
  }
}

const deletePlatformCookies = async (platform) => {
  if (!confirm(`确定要删除 ${platform} 的 Cookies 吗？`)) return
  try {
    await axios.delete(`/api/cookies/${platform}`)
    await loadCookiesInfo()
  } catch (_err) {
    alert('删除失败')
  }
}

const addCustomPlatform = () => {
  const name = newPlatformName.value.trim().toLowerCase()
  if (!name) return
  if (customPlatforms.value.includes(name) || name === 'youtube' || name === 'bilibili') {
    alert('平台已存在')
    return
  }
  customPlatforms.value.push(name)
  newPlatformName.value = ''
  showAddPlatform.value = false
  editPlatform(name)
}

const openCookiesModal = async () => {
  showCookiesModal.value = true
  await loadCookiesInfo()
}

const openDownloadSettingsModal = async () => {
  showDownloadSettingsModal.value = true
  await loadSettings()
}

loadSettings()
</script>
