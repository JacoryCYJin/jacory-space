<template>
  <main class="grain min-h-screen bg-background text-foreground">
    <section class="px-5 pb-20 pt-28 md:px-8 md:pt-32">
      <div class="mx-auto max-w-screen-2xl">
        <header class="border-b border-line pb-9">
          <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="font-mono text-xs tracking-[0.18em] text-blue">№ 001 — UTILITY / LOCAL TOOL</p>
              <h1 class="mt-5 text-5xl font-medium leading-none tracking-tight text-foreground md:text-7xl">
                Video <span class="italic text-blue">Parser</span>
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {{ t('videoParser.pageDescription') }}
              </p>
            </div>

            <div class="flex items-center gap-5">
              <button
                type="button"
                class="inline-flex h-10 items-center gap-3 border border-line px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:border-line-strong hover:text-blue"
                :class="showSettingsRail || isCookiesRequiredError ? 'border-line-strong text-blue' : ''"
                @click="toggleSettingsRail"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-blue"></span>
                {{ t('videoParser.ui.settings') }}
              </button>
              <span class="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">
                {{ t('videoParser.ui.cookiesDirectory') }}
              </span>
            </div>
          </div>
        </header>

        <div class="mt-10 grid gap-10" :class="showSettingsRail ? 'xl:grid-cols-[minmax(0,1fr)_410px]' : ''">
          <div class="min-w-0">
            <section class="grid gap-5 border-b border-line pb-10 md:grid-cols-[96px_minmax(0,1fr)]">
              <div>
                <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">01</p>
                <p class="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-blue">{{ t('videoParser.sections.command') }}</p>
              </div>
              <div class="border border-line bg-card sm:flex sm:min-h-14 sm:items-center">
                <div class="flex min-w-0 flex-1 items-center">
                  <div class="flex h-14 w-14 shrink-0 items-center justify-center border-r border-line text-muted-foreground">
                    <LinkIcon class="h-4.5 w-4.5" />
                  </div>
                  <input
                    v-model="videoUrl"
                    type="text"
                    :placeholder="t('videoParser.inputPlaceholder')"
                    class="h-14 min-w-0 flex-1 bg-transparent px-5 font-mono text-sm text-foreground outline-none placeholder:text-haze"
                    @keypress.enter="parseVideo"
                  />
                </div>
                <button
                  type="button"
                  class="flex h-14 w-full shrink-0 items-center justify-center gap-3 border-t border-line px-6 font-mono text-xs uppercase tracking-[0.18em] text-blue transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:text-haze sm:w-auto sm:border-l sm:border-t-0"
                  :disabled="loading || !videoUrl.trim()"
                  @click="parseVideo"
                >
                  {{ loading ? t('videoParser.parsing') : t('videoParser.parse') }}
                  <ArrowRight class="h-3.5 w-3.5" />
                </button>
              </div>
            </section>

            <VideoParserStatus
              v-if="showStatusSection"
              :status-rail="statusRail"
              :parser-state="parserState"
              :active-status-index="activeStatusIndex"
              :is-cookies-required-error="isCookiesRequiredError"
              :loading="loading"
              :error="error"
              :success="success"
            />

            <div
              v-if="showResolvedModules || showOutlineModule || showOutputPathSection"
              class="grid border-b border-line"
              :class="showOutlineModule ? 'lg:grid-cols-[minmax(0,1.08fr)_minmax(430px,0.92fr)]' : ''"
            >
              <div class="min-w-0 lg:border-r lg:border-line lg:pr-8">
                <section v-if="showResolvedModules" class="grid gap-5 border-b border-line py-10 md:grid-cols-[96px_minmax(0,1fr)]">
                  <div>
                    <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">03</p>
                    <p class="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-blue">{{ t('videoParser.sections.videoInfo') }}</p>
                  </div>
                  <div>
                    <div v-if="videoInfo" class="video-info-resolved">
                      <img
                        v-if="videoInfo.thumbnail_proxy || videoInfo.thumbnail"
                        :src="videoInfo.thumbnail_proxy || videoInfo.thumbnail"
                        :alt="t('videoParser.thumbnailAlt')"
                        referrerpolicy="no-referrer"
                        crossorigin="anonymous"
                        class="video-info-thumb border border-line object-cover"
                      />
                      <div v-else class="video-info-thumb flex items-center justify-center border border-line bg-muted">
                        <Clapperboard class="h-6 w-6 text-haze" />
                      </div>

                      <div class="min-w-0">
                        <h2 class="video-info-title text-xl font-medium leading-snug tracking-tight text-foreground md:text-2xl">
                          {{ videoInfo.title || 'Untitled Video' }}
                        </h2>
                        <dl class="mt-6 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
                          <div>
                            <dt class="tech">{{ t('videoParser.info.source') }}</dt>
                            <dd class="mt-1 text-foreground">{{ sourcePlatform }}</dd>
                          </div>
                          <div>
                            <dt class="tech">{{ t('videoParser.info.duration') }}</dt>
                            <dd class="mt-1 text-foreground">{{ videoInfo.duration ? formatDuration(videoInfo.duration) : '--' }}</dd>
                          </div>
                          <div>
                            <dt class="tech">{{ t('videoParser.info.uploader') }}</dt>
                            <dd class="mt-1 text-foreground">{{ videoInfo.uploader || videoInfo.channel || '--' }}</dd>
                          </div>
                          <div>
                            <dt class="tech">{{ t('videoParser.info.pubDate') }}</dt>
                            <dd class="mt-1 text-foreground">{{ formatUploadDate(videoInfo.upload_date || videoInfo.release_date) }}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div v-else class="border border-line bg-card px-5 py-10">
                      <p class="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{{ t('videoParser.info.awaitingUrl') }}</p>
                      <p class="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
                        {{ t('videoParser.info.awaitingDescription') }}
                      </p>
                    </div>
                  </div>
                </section>

                <VideoParserRegistry
                  v-if="showResolvedModules"
                  :registry-rows="registryRows"
                  :downloading="downloading"
                  :format-key="formatKey"
                  :format-label="formatLabel"
                  :row-status="rowStatus"
                  :row-status-label="rowStatusLabel"
                  :row-progress="rowProgress"
                  :row-status-class="rowStatusClass"
                  :row-action-label="rowActionLabel"
                  @download="downloadVideo"
                />

                <section v-if="showOutputPathSection" class="grid gap-5 py-10 md:grid-cols-[96px_minmax(0,1fr)]">
                  <div>
                    <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">06</p>
                    <p class="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-blue">{{ t('videoParser.sections.outputPath') }}</p>
                  </div>
                  <div>
                    <p v-if="copyStatus" class="mb-3 border-l border-line-strong pl-3 text-sm leading-relaxed text-muted-foreground">
                      {{ copyStatus }}
                    </p>
                    <div class="flex flex-col border border-line bg-card sm:flex-row sm:items-center">
                    <div class="flex min-w-0 flex-1 items-center gap-3 px-5 py-4">
                      <Folder class="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span class="truncate font-mono text-xs text-foreground">{{ outputPath }}</span>
                    </div>
                    <div class="flex shrink-0 border-t border-line sm:border-l sm:border-t-0">
                      <button
                        type="button"
                        class="inline-flex h-12 items-center gap-2 px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-blue hover:bg-muted"
                        @click="copyOutputPath"
                      >
                        <Copy class="h-3.5 w-3.5" />
                        {{ t('videoParser.output.copyPath') }}
                      </button>
                      <button
                        type="button"
                        class="inline-flex h-12 items-center gap-2 border-l border-line px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-blue hover:bg-muted"
                        @click="revealOutputPath"
                      >
                        <FolderOpen class="h-3.5 w-3.5" />
                        {{ t('videoParser.output.revealInFinder') }}
                      </button>
                    </div>
                    </div>
                  </div>
                </section>
              </div>

              <VideoOutlinePanel
                v-if="showOutlineModule"
                :outline-state="outlineState"
                :outline-state-meta="outlineStateMeta"
                :outline-nodes="outlineNodes"
                :outline-title="outlineTitle"
                :outline-summary="outlineSummary"
                :outline-error="outlineError"
                @copy="copyOutline"
                @generate="generateOutline"
              />
            </div>
          </div>

          <VideoParserSettingsRail
            v-if="showSettingsRail"
            v-model:cookie-mode="cookieMode"
            v-model:browser-cookie-source="browserCookieSource"
            v-model:download-dir-override="downloadDirOverride"
            :cookie-modes="cookieModes"
            :browser-sources="browserSources"
            :saving-cookie-settings="savingCookieSettings"
            :cookie-settings-status="cookieSettingsStatus"
            :cookie-platform-rows="cookiePlatformRows"
            :cookies-info="cookiesInfo"
            :default-download-dir="defaultDownloadDir"
            :saving-settings="savingSettings"
            @close="showSettingsRail = false"
            @save-cookie-settings="saveCookieSettings"
            @add-platform="showAddPlatform = true"
            @edit-platform="editPlatform"
            @delete-platform="deletePlatformCookies"
            @choose-default-folder="chooseFolderAndSaveDefault"
            @choose-temporary-folder="chooseFolderForOnce"
          />
        </div>
      </div>
    </section>

    <StatusToast
      :visible="Boolean(outlineCopyStatus)"
      :message="outlineCopyStatus"
      type="success"
    />

    <VideoParserCookieDialogs
      v-model:show-add-platform="showAddPlatform"
      v-model:new-platform-name="newPlatformName"
      v-model:show-edit-cookies="showEditCookies"
      v-model:cookies-text="cookiesText"
      :editing-platform="editingPlatform"
      :saving-cookies="savingCookies"
      :cookies-status="cookiesStatus"
      @add-platform="addCustomPlatform"
      @save-cookies="saveCookies"
    />
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import StatusToast from '../components/StatusToast.vue'
import VideoOutlinePanel from '../components/video-parser/VideoOutlinePanel.vue'
import VideoParserCookieDialogs from '../components/video-parser/VideoParserCookieDialogs.vue'
import VideoParserRegistry from '../components/video-parser/VideoParserRegistry.vue'
import VideoParserSettingsRail from '../components/video-parser/VideoParserSettingsRail.vue'
import VideoParserStatus from '../components/video-parser/VideoParserStatus.vue'
import {
  ArrowRight,
  Clapperboard,
  Copy,
  Folder,
  FolderOpen,
  Link as LinkIcon
} from 'lucide-vue-next'

const { t, locale } = useI18n()

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
const downloadRows = reactive({})
const downloadTimers = new Map()
let outlineCopyTimer = 0
const lastDownloadedPath = ref('')
const defaultDownloadDir = ref('')
const downloadDirOverride = ref('')
const savingSettings = ref(false)
const cookieMode = ref('manual')
const browserCookieSource = ref('chrome')
const savingCookieSettings = ref(false)
const cookieSettingsStatus = ref(null)
const copyStatus = ref('')
const outlineCopyStatus = ref('')
const outlineGenerationState = ref('idle')
const generatedOutline = ref(null)
const outlineError = ref('')

const showSettingsRail = ref(false)
const showEditCookies = ref(false)
const showAddPlatform = ref(false)
const cookiesText = ref('')
const savingCookies = ref(false)
const cookiesStatus = ref(null)
const editingPlatform = ref('')
const newPlatformName = ref('')
const customPlatforms = ref([])
const cookiesInfo = ref({ youtube: {}, bilibili: {} })

const statusKeys = ['READY', 'PARSING', 'RESOLVED', 'DOWNLOADING', 'COMPLETE', 'FAILED']

const cookieModes = ['manual', 'browser', 'none']
const browserSources = [
  { value: 'chrome', label: 'Chrome' },
  { value: 'safari', label: 'Safari' },
  { value: 'firefox', label: 'Firefox' },
  { value: 'edge', label: 'Edge' }
]

const registryRows = computed(() => {
  return (videoInfo.value?.formats || []).filter((format) => {
    const ext = String(format?.ext || '').toLowerCase()
    return ['mp4', 'm4a'].includes(ext)
  })
})

const statusRail = computed(() =>
  statusKeys.map((key) => ({
    key,
    label: t(`videoParser.statusRail.${key}`)
  }))
)

const hasActiveDownload = computed(() => Object.values(downloading).some(Boolean))

const isCookiesRequiredError = computed(() => {
  const msg = error.value.toLowerCase()
  return msg.includes('cookie') || msg.includes('cookies') || msg.includes('登录') || msg.includes('sign in') || msg.includes('403')
})

const parserState = computed(() => {
  if (loading.value) return 'PARSING'
  if (hasActiveDownload.value) return 'DOWNLOADING'
  if (error.value) return 'FAILED'
  if (lastDownloadedPath.value) return 'COMPLETE'
  if (videoInfo.value) return 'RESOLVED'
  return 'READY'
})

const activeStatusIndex = computed(() => Math.max(0, statusKeys.indexOf(parserState.value)))

const showStatusSection = computed(() => parserState.value !== 'READY' || Boolean(error.value || success.value))
const showResolvedModules = computed(() => Boolean(videoInfo.value))
const showOutlineModule = computed(() => ['noSubtitles', 'insufficient', 'subtitlesAvailable', 'generating', 'success', 'failed'].includes(outlineState.value))
const showOutputPathSection = computed(() => Boolean(lastDownloadedPath.value))

const outlineNodes = computed(() => generatedOutline.value?.nodes || [])
const outlineTitle = computed(() => generatedOutline.value?.title || t('videoParser.outline.root'))
const outlineSummary = computed(() => generatedOutline.value?.summary || '')

const minTranscriptCompactLength = 100

const getTranscriptCompactLength = (transcript = '') => String(transcript || '').replace(/\s+/g, '').length

const isUsableTranscript = (info) => {
  if (!info) return false
  const transcript = String(info.transcript || '').trim()
  if (!transcript) return false
  const compactLength = Number(info.transcript_compact_length || getTranscriptCompactLength(transcript))
  return info.transcript_is_valid === true && compactLength >= minTranscriptCompactLength
}

const hasOutlineTranscript = computed(() => isUsableTranscript(videoInfo.value))

const hasCaptionMetadata = computed(() => {
  const info = videoInfo.value
  if (!info) return false
  return Boolean(
    info.has_subtitles ||
    info.has_automatic_captions ||
    info.subtitle_languages?.length ||
    info.automatic_caption_languages?.length
  )
})

const hasInsufficientTranscript = computed(() => {
  const info = videoInfo.value
  if (!info || hasOutlineTranscript.value) return false
  return info.transcript_status === 'insufficient' || hasCaptionMetadata.value
})

const outlineState = computed(() => {
  if (!videoInfo.value) return 'idle'
  if (outlineGenerationState.value === 'generating') return 'generating'
  if (outlineGenerationState.value === 'failed') return 'failed'
  if (outlineGenerationState.value === 'success') return 'success'
  if (hasOutlineTranscript.value) return 'subtitlesAvailable'
  if (hasInsufficientTranscript.value) return 'insufficient'
  return 'noSubtitles'
})

const outlineStateMeta = computed(() => {
  const key = outlineState.value
  return {
    title: t(`videoParser.outline.states.${key}.title`),
    description: t(`videoParser.outline.states.${key}.description`)
  }
})

const sourcePlatform = computed(() => {
  const raw = videoInfo.value?.source_url || videoUrl.value
  try {
    const host = new URL(raw).hostname.toLowerCase()
    if (host.includes('youtube') || host.includes('youtu.be')) return 'YouTube'
    if (host.includes('bilibili')) return 'Bilibili'
    return host.replace(/^www\./, '')
  } catch (_err) {
    return '--'
  }
})

const outputPath = computed(() => {
  return lastDownloadedPath.value || downloadDirOverride.value || defaultDownloadDir.value || t('videoParser.notSet')
})

const hasOutputPath = computed(() => Boolean(lastDownloadedPath.value || downloadDirOverride.value || defaultDownloadDir.value))

const cookiePlatformRows = computed(() => [
  { key: 'youtube', label: 'YouTube', custom: false },
  { key: 'bilibili', label: 'Bilibili', custom: false },
  ...customPlatforms.value.map((platform) => ({ key: platform, label: platform, custom: true }))
])

const formatKey = (format) => format?.format_id || format?.resolution || 'unknown'

const formatLabel = (format) => {
  const ext = String(format?.ext || 'file').toUpperCase()
  const note = format?.format_note ? ` · ${format.format_note}` : ''
  return `${ext}${note}`
}

const rowData = (format) => downloadRows[formatKey(format)] || null

const rowStatus = (format) => {
  const row = rowData(format)
  if (row?.status) return row.status
  if (!format?.format_id && !format?.resolution) return 'UNAVAILABLE'
  return 'READY'
}

const rowStatusLabel = (format) => t(`videoParser.registry.rowStatus.${rowStatus(format)}`)

const rowProgress = (format) => rowData(format)?.progress || 0

const rowStatusClass = (format) => {
  const status = rowStatus(format)
  if (status === 'DOWNLOADING' || status === 'COMPLETE' || status === 'READY') {
    return { dot: 'bg-blue', text: 'text-blue' }
  }
  if (status === 'FAILED') return { dot: 'bg-foreground', text: 'text-foreground' }
  return { dot: 'bg-haze', text: 'text-muted-foreground' }
}

const rowActionLabel = (format) => {
  const status = rowStatus(format)
  if (status === 'DOWNLOADING') return t('videoParser.registry.actions.pause')
  if (status === 'COMPLETE') return t('videoParser.registry.actions.reveal')
  if (status === 'FAILED') return t('videoParser.registry.actions.retry')
  if (status === 'UNAVAILABLE') return '--'
  return t('videoParser.registry.actions.download')
}

const startDownloadProgress = (key) => {
  clearDownloadProgress(key)
  downloadRows[key] = { status: 'DOWNLOADING', progress: 8 }
  const timer = window.setInterval(() => {
    const row = downloadRows[key]
    if (!row || row.status !== 'DOWNLOADING') return
    row.progress = Math.min(92, row.progress + Math.ceil((92 - row.progress) * 0.16))
  }, 700)
  downloadTimers.set(key, timer)
}

const clearDownloadProgress = (key) => {
  const timer = downloadTimers.get(key)
  if (timer) window.clearInterval(timer)
  downloadTimers.delete(key)
}

const parseVideo = async () => {
  const url = videoUrl.value.trim()
  if (!url) {
    error.value = t('videoParser.errors.emptyUrl')
    return
  }
  if (!isValidVideoUrl(url)) {
    error.value = t('videoParser.errors.invalidUrl')
    return
  }
  loading.value = true
  error.value = ''
  success.value = ''
  videoInfo.value = null
  lastDownloadedPath.value = ''
  outlineCopyStatus.value = ''
  outlineGenerationState.value = 'idle'
  generatedOutline.value = null
  outlineError.value = ''
  Object.keys(downloadRows).forEach((key) => delete downloadRows[key])
  try {
    const response = await axios.post('/api/parse', { url })
    videoInfo.value = response.data
    videoUrl.value = response.data?.source_url || url
    console.info('[VideoParser] Transcript parsed', {
      transcriptStatus: response.data?.transcript_status,
      transcriptValid: response.data?.transcript_is_valid,
      transcriptLanguage: response.data?.transcript_language,
      transcriptSource: response.data?.transcript_source,
      transcriptFormat: response.data?.transcript_format,
      transcriptLength: response.data?.transcript_char_count,
      transcriptCompactLength: response.data?.transcript_compact_length,
      transcriptPreview: response.data?.transcript_preview
    })
  } catch (err) {
    if (err.response?.data?.code === 'NO_VISIBLE_FORMATS') {
      error.value = t('videoParser.errors.noVisibleFormats')
    } else {
      error.value = err.response?.data?.error || t('videoParser.errors.parseFailed', { message: err.message })
    }
  } finally {
    loading.value = false
  }
}

const downloadVideo = async (format) => {
  const resolution = format?.resolution || ''
  const key = formatKey(format)
  downloading[resolution] = true
  startDownloadProgress(key)
  error.value = ''
  success.value = t('videoParser.messages.downloadingResolution', { resolution })
  try {
    const response = await axios.post('/api/download', {
      url: videoUrl.value,
      resolution,
      format_id: format?.format_id || '',
      output_dir: downloadDirOverride.value.trim() || undefined
    })
    lastDownloadedPath.value = response.data.path || response.data.output_dir || ''
    downloadRows[key] = { status: 'COMPLETE', progress: 100, path: lastDownloadedPath.value }
    success.value = t('videoParser.messages.downloadComplete', { path: response.data.path })
  } catch (err) {
    downloadRows[key] = { status: 'FAILED', progress: 0 }
    error.value = err.response?.data?.error || t('videoParser.errors.downloadFailed', { message: err.message })
    success.value = ''
  } finally {
    clearDownloadProgress(key)
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

const formatUploadDate = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return '--'
  if (/^\d{8}$/.test(raw)) return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
  return raw
}

const isValidVideoUrl = (value) => {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch (_err) {
    return false
  }
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

const toggleSettingsRail = async () => {
  showSettingsRail.value = !showSettingsRail.value
  if (showSettingsRail.value) {
    cookieSettingsStatus.value = null
    await Promise.all([loadCookiesInfo(), loadSettings()])
  }
}

const copyToClipboard = async (text) => {
  if (!text || text === t('videoParser.notSet')) return
  try {
    await navigator.clipboard.writeText(text)
  } catch (_err) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

const markCopied = (message) => {
  copyStatus.value = message
  window.setTimeout(() => {
    if (copyStatus.value === message) copyStatus.value = ''
  }, 1800)
}

const copyOutputPath = async () => {
  await copyToClipboard(outputPath.value)
  if (hasOutputPath.value) markCopied(t('videoParser.output.copied'))
}

const revealOutputPath = () => {
  const path = outputPath.value
  if (!path || path === t('videoParser.notSet')) return
  const url = path.startsWith('/') ? `file://${encodeURI(path)}` : path
  window.open(url, '_blank')
}

const copyOutline = async () => {
  if (outlineState.value !== 'success') return
  const text = outlineNodes
    .value
    .map((node) => {
      const children = node.children
        .map((child) => `- ${child.title}${child.summary ? `: ${child.summary}` : ''}`)
        .join('\n')
      return `${node.title}${node.summary ? `\n${node.summary}` : ''}${children ? `\n${children}` : ''}`
    })
    .join('\n\n')
  await copyToClipboard(`${outlineTitle.value}\n${outlineSummary.value}\n\n${text}`.trim())
  const message = t('videoParser.outline.copied')
  if (outlineCopyTimer) window.clearTimeout(outlineCopyTimer)
  outlineCopyStatus.value = message
  outlineCopyTimer = window.setTimeout(() => {
    if (outlineCopyStatus.value === message) outlineCopyStatus.value = ''
    outlineCopyTimer = 0
  }, 1800)
}

const outlineLanguage = computed(() => (String(locale.value).toLowerCase().startsWith('zh') ? 'zh' : 'en'))

const generateOutline = async () => {
  const transcript = String(videoInfo.value?.transcript || '').trim()
  if (!isUsableTranscript(videoInfo.value)) {
    outlineError.value = t('videoParser.outline.states.insufficient.description')
    outlineGenerationState.value = 'idle'
    return
  }
  outlineGenerationState.value = 'generating'
  generatedOutline.value = null
  outlineError.value = ''
  try {
    const response = await axios.post('/api/video/outline', {
      title: videoInfo.value?.title || '',
      platform: sourcePlatform.value,
      duration: videoInfo.value?.duration ? formatDuration(videoInfo.value.duration) : '',
      language: outlineLanguage.value,
      transcript
    })
    if (!response.data?.success || !response.data?.outline) {
      throw new Error(response.data?.error || t('videoParser.errors.outlineFailed'))
    }
    generatedOutline.value = response.data.outline
    outlineGenerationState.value = 'success'
  } catch (err) {
    console.error('[VideoParser] Outline generation failed', {
      endpoint: '/api/video/outline',
      status: err.response?.status,
      response: err.response?.data,
      message: err.message,
      request: {
        title: videoInfo.value?.title || '',
        platform: sourcePlatform.value,
        duration: videoInfo.value?.duration ? formatDuration(videoInfo.value.duration) : '',
        language: outlineLanguage.value,
        transcriptLength: transcript.length
      }
    })
    outlineError.value = err.response?.data?.error || t('videoParser.errors.outlineFailed')
    outlineGenerationState.value = 'failed'
  }
}

loadSettings()

onBeforeUnmount(() => {
  downloadTimers.forEach((timer) => window.clearInterval(timer))
  downloadTimers.clear()
  if (outlineCopyTimer) window.clearTimeout(outlineCopyTimer)
})
</script>

<style scoped>
.video-info-resolved {
  display: grid;
  grid-template-columns: minmax(180px, 220px) minmax(0, 1fr);
  gap: 1.75rem;
  align-items: start;
}

.video-info-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
}

.video-info-title {
  display: -webkit-box;
  max-width: 100%;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

@media (min-width: 1280px) {
  .video-info-resolved {
    grid-template-columns: minmax(190px, 240px) minmax(0, 1fr);
  }
}

@media (max-width: 767px) {
  .video-info-resolved {
    grid-template-columns: 1fr;
  }
}

</style>
