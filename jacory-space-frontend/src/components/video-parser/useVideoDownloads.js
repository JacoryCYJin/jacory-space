import { computed, onBeforeUnmount, reactive, ref } from 'vue'

export function useVideoDownloads({ axios, t, videoInfo, videoUrl, downloadDirOverride, error, success }) {
  const downloading = reactive({})
  const downloadRows = reactive({})
  const downloadTimers = new Map()
  const lastDownloadedPath = ref('')

  const registryRows = computed(() =>
    (videoInfo.value?.formats || []).filter((format) => {
      const ext = String(format?.ext || '').toLowerCase()
      return ['mp4', 'm4a'].includes(ext)
    })
  )

  const hasActiveDownload = computed(() => Object.values(downloading).some(Boolean))
  const formatKey = (format) => format?.format_id || format?.resolution || 'unknown'
  const formatLabel = (format) => {
    const ext = String(format?.ext || 'file').toUpperCase()
    const formatNote = String(format?.format_note || '').trim()
    const resolution = String(format?.resolution || '').trim()
    const note = formatNote && formatNote !== resolution ? ` · ${formatNote}` : ''
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

  function clearDownloadProgress(key) {
    const timer = downloadTimers.get(key)
    if (timer) window.clearInterval(timer)
    downloadTimers.delete(key)
  }

  function startDownloadProgress(key) {
    clearDownloadProgress(key)
    downloadRows[key] = { status: 'DOWNLOADING', progress: 8 }
    const timer = window.setInterval(() => {
      const row = downloadRows[key]
      if (!row || row.status !== 'DOWNLOADING') return
      row.progress = Math.min(92, row.progress + Math.ceil((92 - row.progress) * 0.16))
    }, 700)
    downloadTimers.set(key, timer)
  }

  async function downloadVideo(format) {
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

  function resetDownloads() {
    lastDownloadedPath.value = ''
    Object.keys(downloadRows).forEach((key) => delete downloadRows[key])
  }

  onBeforeUnmount(() => {
    downloadTimers.forEach((timer) => window.clearInterval(timer))
    downloadTimers.clear()
  })

  return {
    downloading,
    downloadRows,
    lastDownloadedPath,
    registryRows,
    hasActiveDownload,
    formatKey,
    formatLabel,
    rowStatus,
    rowStatusLabel,
    rowProgress,
    rowStatusClass,
    rowActionLabel,
    downloadVideo,
    resetDownloads
  }
}
