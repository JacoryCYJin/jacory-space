import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 5001

const dataDir = path.join(__dirname, 'data')
const usersDir = path.join(dataDir, 'users')
const downloadsRootDir = path.join(__dirname, 'downloads')
const systemDownloadsDir = path.join(os.homedir(), 'Downloads')
const preferredYtDlpBins = [
  process.env.YTDLP_BIN,
  '/opt/homebrew/bin/yt-dlp',
  '/usr/local/bin/yt-dlp',
  'yt-dlp'
].filter(Boolean)
const ytDlpBin = preferredYtDlpBins.find((bin) => bin === 'yt-dlp' || fs.existsSync(bin))

fs.mkdirSync(usersDir, { recursive: true })
fs.mkdirSync(downloadsRootDir, { recursive: true })
fs.mkdirSync(systemDownloadsDir, { recursive: true })

app.use(cors())
app.use(express.json({ limit: '5mb' }))

const sanitizePlatform = (platform) => {
  if (!platform) return ''
  const normalized = String(platform).trim().toLowerCase()
  if (!/^[a-z0-9_-]+$/.test(normalized)) return ''
  return normalized
}

const sanitizeClientId = (clientId) => {
  if (!clientId) return ''
  const normalized = String(clientId).trim().toLowerCase()
  if (!/^[a-z0-9_-]{8,64}$/.test(normalized)) return ''
  return normalized
}

const detectPlatform = (url) => {
  try {
    const host = new URL(url).hostname.toLowerCase()
    if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube'
    if (host.includes('bilibili.com') || host.includes('b23.tv')) return 'bilibili'
    return host.replace(/^www\./, '').split('.')[0] || 'default'
  } catch {
    return 'default'
  }
}

const normalizeVideoInput = (input) => {
  const raw = String(input || '').trim()
  if (!raw) return ''

  const bvMatch = raw.match(/^(BV[0-9A-Za-z]{10})$/i)
  if (bvMatch) {
    return `https://www.bilibili.com/video/${bvMatch[1]}`
  }

  const avMatch = raw.match(/^(av\d+)$/i)
  if (avMatch) {
    return `https://www.bilibili.com/video/${avMatch[1].toLowerCase()}`
  }

  return raw
}

const userHomeDir = (clientId) => path.join(usersDir, clientId)
const userCookiesDir = (clientId) => path.join(userHomeDir(clientId), 'cookies')
const userSettingsPath = (clientId) => path.join(userHomeDir(clientId), 'settings.json')
const userDefaultDownloadsDir = (_clientId) => systemDownloadsDir
const cookiesPathFor = (clientId, platform) => path.join(userCookiesDir(clientId), `${platform}.txt`)
const cookieModes = new Set(['manual', 'browser', 'none'])
const browserCookieSources = new Set(['chrome', 'safari', 'firefox', 'edge'])

const ensureUserDirs = (clientId) => {
  fs.mkdirSync(userHomeDir(clientId), { recursive: true })
  fs.mkdirSync(userCookiesDir(clientId), { recursive: true })
}

const normalizeOutputDir = (dirInput, clientId) => {
  const raw = String(dirInput || '').trim()
  if (!raw) return userDefaultDownloadsDir(clientId)
  if (path.isAbsolute(raw)) return path.resolve(raw)
  return path.resolve(__dirname, raw)
}

const getFolderRoots = (clientId) => {
  const settings = getUserSettings(clientId)
  const roots = [
    settings.default_download_dir,
    userDefaultDownloadsDir(clientId),
    downloadsRootDir,
    path.resolve(process.cwd())
  ]
  return Array.from(new Set(roots.map((p) => path.resolve(p))))
}

const isPathUnder = (targetPath, rootPath) => {
  const rel = path.relative(rootPath, targetPath)
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))
}

const normalizeCookieMode = (mode) => {
  const normalized = String(mode || '').trim().toLowerCase()
  return cookieModes.has(normalized) ? normalized : 'manual'
}

const normalizeBrowserCookieSource = (source) => {
  const normalized = String(source || '').trim().toLowerCase()
  return browserCookieSources.has(normalized) ? normalized : 'chrome'
}

const getUserSettings = (clientId) => {
  ensureUserDirs(clientId)
  const settingsFile = userSettingsPath(clientId)

  if (!fs.existsSync(settingsFile)) {
    return {
      default_download_dir: userDefaultDownloadsDir(clientId),
      cookie_mode: 'manual',
      browser_cookie_source: 'chrome'
    }
  }

  try {
    const raw = fs.readFileSync(settingsFile, 'utf8')
    const parsed = JSON.parse(raw)
    return {
      default_download_dir: normalizeOutputDir(parsed.default_download_dir, clientId),
      cookie_mode: normalizeCookieMode(parsed.cookie_mode),
      browser_cookie_source: normalizeBrowserCookieSource(parsed.browser_cookie_source)
    }
  } catch {
    return {
      default_download_dir: userDefaultDownloadsDir(clientId),
      cookie_mode: 'manual',
      browser_cookie_source: 'chrome'
    }
  }
}

const saveUserSettings = (clientId, settings) => {
  ensureUserDirs(clientId)
  fs.writeFileSync(userSettingsPath(clientId), JSON.stringify(settings, null, 2), 'utf8')
}

app.use((req, res, next) => {
  // Image tags cannot send custom headers like x-client-id.
  if (req.path === '/api/thumbnail') {
    return next()
  }

  const clientId = sanitizeClientId(req.header('x-client-id'))
  if (!clientId) {
    return res.status(400).json({ error: '缺少或无效的 x-client-id 请求头' })
  }

  req.clientId = clientId
  ensureUserDirs(clientId)
  next()
})

const getYtDlpArgs = (clientId, url, extraArgs = [], options = {}) => {
  const platform = detectPlatform(url)
  const cookiePath = cookiesPathFor(clientId, platform)
  const hasCookies = fs.existsSync(cookiePath)
  const settings = getUserSettings(clientId)
  const cookieMode = normalizeCookieMode(options.cookieMode || settings.cookie_mode)
  const useCookies = options.useCookies !== false
  const cookiesFromBrowser = options.cookiesFromBrowser
    ? normalizeBrowserCookieSource(options.cookiesFromBrowser)
    : (useCookies && cookieMode === 'browser' ? settings.browser_cookie_source : '')
  const shouldUseManualCookies = useCookies && cookieMode === 'manual' && hasCookies
  const args = [...extraArgs]

  // YouTube client selection must match cookie capability.
  if (platform === 'youtube') {
    const willUseAnyCookies = shouldUseManualCookies || !!cookiesFromBrowser
    if (!willUseAnyCookies) {
      args.push('--extractor-args', 'youtube:player_client=android,web')
    }
    args.push('--add-header', 'Referer:https://www.youtube.com/')
  }

  if (cookiesFromBrowser) {
    args.push('--cookies-from-browser', cookiesFromBrowser)
  } else if (shouldUseManualCookies) {
    args.push('--cookies', cookiePath)
  }

  args.push('--no-playlist', url)
  return args
}

const normalizeThumbnail = (info) => {
  if (info?.thumbnail && String(info.thumbnail).trim()) {
    const raw = String(info.thumbnail).trim()
    if (raw.startsWith('http://')) return raw.replace('http://', 'https://')
    if (raw.startsWith('//')) return `https:${raw}`
    return raw
  }
  if (Array.isArray(info?.thumbnails) && info.thumbnails.length > 0) {
    const last = info.thumbnails[info.thumbnails.length - 1]
    const raw = String(last?.url || '').trim()
    if (!raw) return ''
    if (raw.startsWith('http://')) return raw.replace('http://', 'https://')
    if (raw.startsWith('//')) return `https:${raw}`
    return raw
  }
  return ''
}

const buildThumbnailProxyUrl = (thumbnailUrl) => {
  const raw = String(thumbnailUrl || '').trim()
  if (!raw) return ''
  return `/api/thumbnail?url=${encodeURIComponent(raw)}`
}

const runYtDlp = (args) => {
  return new Promise((resolve, reject) => {
    const child = spawn(ytDlpBin, args)
    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (d) => {
      stdout += d.toString()
    })

    child.stderr.on('data', (d) => {
      stderr += d.toString()
    })

    child.on('error', (err) => {
      reject(err)
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr })
      } else {
        reject(new Error(stderr || stdout || `yt-dlp exited with code ${code}`))
      }
    })
  })
}

const estimateSizeBytes = (format, duration) => {
  const explicitSize = Number(format?.filesize || format?.filesize_approx || 0)
  if (explicitSize > 0) return { bytes: explicitSize, estimated: false }

  const bitrateKbps = Number(format?.tbr || 0)
  const durationSeconds = Number(duration || 0)
  if (bitrateKbps > 0 && durationSeconds > 0) {
    return { bytes: (bitrateKbps * 1000 * durationSeconds) / 8, estimated: true }
  }

  return { bytes: 0, estimated: false }
}

const formatSizeMb = ({ bytes, estimated }) => {
  if (!bytes || bytes <= 0) return '未知'
  const sizeMb = (bytes / 1024 / 1024).toFixed(2)
  return estimated ? `约 ${sizeMb}` : sizeMb
}

const hasCaptionEntries = (captions = {}) => {
  return Object.values(captions || {}).some((items) => Array.isArray(items) && items.length > 0)
}

const getCaptionLanguages = (captions = {}) => {
  return Object.entries(captions || {})
    .filter(([, items]) => Array.isArray(items) && items.length > 0)
    .map(([lang]) => lang)
}

const getSubtitleInfo = (info = {}) => {
  const subtitles = info.subtitles || {}
  const automaticCaptions = info.automatic_captions || {}
  const subtitleLanguages = getCaptionLanguages(subtitles)
  const automaticCaptionLanguages = getCaptionLanguages(automaticCaptions)

  return {
    has_subtitles: hasCaptionEntries(subtitles),
    has_automatic_captions: hasCaptionEntries(automaticCaptions),
    subtitle_languages: subtitleLanguages,
    automatic_caption_languages: automaticCaptionLanguages
  }
}

const findDownloadableFormat = (formats = [], formatId = '') => {
  const wanted = String(formatId || '').trim()
  if (!wanted) return null
  return formats.find((f) => String(f?.format_id || '') === wanted) || null
}

const assertAllowedDownloadFormat = async (clientId, url, formatId) => {
  if (!formatId) return null
  const result = await runYtDlp(getYtDlpArgs(clientId, url, ['-J']))
  const info = JSON.parse(result.stdout)
  const selected = findDownloadableFormat(info.formats, formatId)
  const ext = String(selected?.ext || '').toLowerCase()
  const hasVideo = selected?.vcodec && selected.vcodec !== 'none'
  const hasAudio = selected?.acodec && selected.acodec !== 'none'

  if (!selected || !['mp4', 'm4a'].includes(ext)) {
    const err = new Error('该格式不可用：仅支持 MP4 / M4A 下载')
    err.statusCode = 400
    throw err
  }

  if (ext === 'm4a' && (!hasAudio || hasVideo)) {
    const err = new Error('该音频格式不可用')
    err.statusCode = 400
    throw err
  }

  if (ext === 'mp4' && !hasVideo) {
    const err = new Error('该视频格式不可用')
    err.statusCode = 400
    throw err
  }

  return { ext, hasVideo, hasAudio }
}

const toUniqueFormats = (formats = [], duration = 0) => {
  const byResolution = new Map()
  let bestAudio = null

  for (const f of formats) {
    if (!f || !f.ext) continue
    const ext = String(f.ext || '').toLowerCase()
    const hasVideo = f.vcodec && f.vcodec !== 'none'
    const hasAudio = f.acodec && f.acodec !== 'none'
    const size = estimateSizeBytes(f, duration)

    if (ext === 'm4a' && hasAudio && !hasVideo) {
      const score = Number(f.abr || f.tbr || 0)
      if (!bestAudio || score > bestAudio.score) {
        bestAudio = {
          score,
          value: {
            format_id: f.format_id,
            resolution: 'Audio',
            format_note: f.format_note || 'audio only',
            ext: f.ext,
            filesize_mb: formatSizeMb(size),
            has_audio: true,
            has_video: false
          }
        }
      }
      continue
    }

    if (ext !== 'mp4') continue
    if (!f.height) continue
    if (Number(f.height) < 144) continue
    if (String(f.format_note || '').toLowerCase().includes('storyboard')) continue
    if (!hasVideo) continue

    const resolution = `${f.height}p`
    const existing = byResolution.get(resolution)
    const score = Number(f.tbr || 0)

    if (!existing || score > existing.score) {
      byResolution.set(resolution, {
        score,
        value: {
          format_id: f.format_id,
          resolution,
          format_note: f.format_note || '',
          ext: f.ext,
          filesize_mb: formatSizeMb(size),
          has_audio: f.acodec && f.acodec !== 'none',
          has_video: f.vcodec && f.vcodec !== 'none'
        }
      })
    }
  }

  return Array.from(byResolution.values())
    .map((x) => x.value)
    .sort((a, b) => parseInt(b.resolution, 10) - parseInt(a.resolution, 10))
    .concat(bestAudio ? [bestAudio.value] : [])
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'video-backend', client_id: req.clientId })
})

app.get('/api/settings', (req, res) => {
  const settings = getUserSettings(req.clientId)
  res.json(settings)
})

app.post('/api/settings', (req, res) => {
  const currentSettings = getUserSettings(req.clientId)
  const defaultDir = normalizeOutputDir(req.body?.default_download_dir ?? currentSettings.default_download_dir, req.clientId)
  fs.mkdirSync(defaultDir, { recursive: true })

  const settings = {
    default_download_dir: defaultDir,
    cookie_mode: normalizeCookieMode(req.body?.cookie_mode ?? currentSettings.cookie_mode),
    browser_cookie_source: normalizeBrowserCookieSource(req.body?.browser_cookie_source ?? currentSettings.browser_cookie_source)
  }
  saveUserSettings(req.clientId, settings)
  res.json({ message: '默认下载目录保存成功', ...settings })
})

app.post('/api/folder-dialog', async (_req, res) => {
  try {
    const script = 'POSIX path of (choose folder with prompt "请选择下载文件夹")'
    const child = spawn('osascript', ['-e', script])
    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (d) => {
      stdout += d.toString()
    })

    child.stderr.on('data', (d) => {
      stderr += d.toString()
    })

    child.on('error', (error) => {
      res.status(500).json({ error: `无法打开系统选取窗口: ${error.message}` })
    })

    child.on('close', (code) => {
      if (code !== 0) {
        const err = stderr.trim()
        if (err.includes('User canceled')) {
          return res.json({ cancelled: true })
        }
        return res.status(500).json({ error: `选取目录失败: ${err || 'unknown error'}` })
      }

      const selected = stdout.trim()
      if (!selected) return res.json({ cancelled: true })
      const resolved = path.resolve(selected)
      return res.json({ cancelled: false, path: resolved })
    })
  } catch (error) {
    res.status(500).json({ error: `打开目录选择失败: ${error.message}` })
  }
})

app.post('/api/parse', async (req, res) => {
  try {
    const url = normalizeVideoInput(req.body?.url)
    if (!url) {
      return res.status(400).json({ error: '缺少 url 参数' })
    }

    const isYoutube = detectPlatform(url) === 'youtube'
    let stdout = ''
    try {
      const result = await runYtDlp(getYtDlpArgs(req.clientId, url, ['-J']))
      stdout = result.stdout
    } catch (firstError) {
      const msg = String(firstError?.message || '')
      const blocked = msg.includes('Sign in to confirm you’re not a bot') || msg.includes('HTTP Error 403')
      if (!(isYoutube && blocked)) throw firstError

      try {
        const retryNoCookies = await runYtDlp(
          getYtDlpArgs(req.clientId, url, ['-J'], { useCookies: false })
        )
        stdout = retryNoCookies.stdout
      } catch (_secondError) {
        try {
          const retrySafari = await runYtDlp(
            getYtDlpArgs(req.clientId, url, ['-J'], { useCookies: false, cookiesFromBrowser: 'safari' })
          )
          stdout = retrySafari.stdout
        } catch (_safariError) {
          const retryChrome = await runYtDlp(
            getYtDlpArgs(req.clientId, url, ['-J'], { useCookies: false, cookiesFromBrowser: 'chrome' })
          )
          stdout = retryChrome.stdout
        }
      }
    }

    const info = JSON.parse(stdout)
    const formats = toUniqueFormats(info.formats, info.duration)

    if (!formats.length) {
      return res.status(400).json({
        code: 'NO_VISIBLE_FORMATS',
        error: '未找到可下载的 MP4 / 音频格式。'
      })
    }

    const thumbnail = normalizeThumbnail(info)
    const subtitleInfo = getSubtitleInfo(info)
    res.json({
      title: info.title,
      thumbnail,
      thumbnail_proxy: buildThumbnailProxyUrl(thumbnail),
      duration: info.duration,
      uploader: info.uploader || info.channel || info.creator || '',
      upload_date: info.upload_date || info.release_date || info.timestamp || '',
      ...subtitleInfo,
      source_url: url,
      formats
    })
  } catch (error) {
    const msg = String(error?.message || '')
    if (msg.includes('Sign in to confirm you’re not a bot')) {
      return res.status(500).json({
        error: '解析失败: YouTube 触发了机器人校验，请在 Cookies 设置里更新 YouTube cookies 后重试。'
      })
    }
    res.status(500).json({ error: `解析失败: ${msg}` })
  }
})

app.get('/api/thumbnail', async (req, res) => {
  try {
    const raw = String(req.query?.url || '').trim()
    if (!raw) return res.status(400).json({ error: '缺少封面 url 参数' })

    let target = raw
    if (target.startsWith('//')) target = `https:${target}`
    if (!/^https?:\/\//i.test(target)) {
      return res.status(400).json({ error: '无效的封面 url' })
    }

    const host = new URL(target).hostname.toLowerCase()
    let referer = 'https://www.youtube.com/'
    if (host.includes('bilibili.com') || host.includes('hdslb.com')) {
      referer = 'https://www.bilibili.com/'
    }

    const response = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        Referer: referer,
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
      }
    })

    if (!response.ok) {
      return res.status(502).json({ error: `封面获取失败: HTTP ${response.status}` })
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const arr = await response.arrayBuffer()
    const buf = Buffer.from(arr)

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.send(buf)
  } catch (error) {
    res.status(500).json({ error: `封面获取失败: ${error.message}` })
  }
})

app.post('/api/download', async (req, res) => {
  try {
    const url = normalizeVideoInput(req.body?.url)
    const resolution = req.body?.resolution?.trim()
    const formatId = String(req.body?.format_id || '').trim()

    if (!url || !resolution) {
      return res.status(400).json({ error: '缺少 url 或 resolution 参数' })
    }

    const isAudioOnly = /^audio$/i.test(resolution) || /^audio only$/i.test(resolution)
    const height = isAudioOnly ? 0 : parseInt(resolution.replace(/[^0-9]/g, ''), 10)
    if (!isAudioOnly && !height) {
      return res.status(400).json({ error: '无效的 resolution 参数' })
    }

    const userSettings = getUserSettings(req.clientId)
    const targetDir = normalizeOutputDir(req.body?.output_dir || userSettings.default_download_dir, req.clientId)
    fs.mkdirSync(targetDir, { recursive: true })

    const selectedFormat = await assertAllowedDownloadFormat(req.clientId, url, formatId)
    const selectedVideoSelector = formatId
      ? (selectedFormat?.hasAudio
          ? `${formatId}[ext=mp4]`
          : `${formatId}[ext=mp4]+bestaudio[ext=m4a]`)
      : `bestvideo[height<=${height}][ext=mp4]+bestaudio[ext=m4a]/best[height<=${height}][ext=mp4]`
    const formatSelector = isAudioOnly
      ? (formatId ? `${formatId}[ext=m4a][vcodec=none]/bestaudio[ext=m4a]` : 'bestaudio[ext=m4a]')
      : selectedVideoSelector
    if (selectedFormat?.ext === 'm4a' && !isAudioOnly) {
      return res.status(400).json({ error: '音频格式请使用 Audio 下载项' })
    }
    if (selectedFormat?.ext === 'mp4' && isAudioOnly) {
      return res.status(400).json({ error: '视频格式不能作为 Audio 下载' })
    }
    const outputTemplate = path.join(targetDir, '%(title).140B-%(id)s.%(ext)s')

    const baseArgs = [
      '-f',
      formatSelector,
      '--merge-output-format',
      'mp4',
      '-o',
      outputTemplate,
      '--print',
      'after_move:filepath'
    ]

    let stdout = ''
    const isYoutube = detectPlatform(url) === 'youtube'
    try {
      const result = await runYtDlp(getYtDlpArgs(req.clientId, url, baseArgs))
      stdout = result.stdout
    } catch (firstError) {
      const msg = String(firstError?.message || '')
      const is403 = msg.includes('HTTP Error 403') || msg.includes('Forbidden')
      const isBotGate = msg.includes('Sign in to confirm you’re not a bot')

      if (!(isYoutube && (is403 || isBotGate))) {
        throw firstError
      }

      try {
        const retryNoCookies = await runYtDlp(
          getYtDlpArgs(req.clientId, url, baseArgs, { useCookies: false })
        )
        stdout = retryNoCookies.stdout
      } catch (secondError) {
        const secondMsg = String(secondError?.message || '')
        const stillBlocked = secondMsg.includes('Sign in to confirm you’re not a bot') || secondMsg.includes('HTTP Error 403')
        if (!stillBlocked) throw secondError

        // On macOS, try browser cookie extraction as final fallback.
        try {
          const retrySafari = await runYtDlp(
            getYtDlpArgs(req.clientId, url, baseArgs, { useCookies: false, cookiesFromBrowser: 'safari' })
          )
          stdout = retrySafari.stdout
        } catch (_safariError) {
          const retryChrome = await runYtDlp(
            getYtDlpArgs(req.clientId, url, baseArgs, { useCookies: false, cookiesFromBrowser: 'chrome' })
          )
          stdout = retryChrome.stdout
        }
      }
    }

    const savedPath = stdout
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)
      .pop()

    res.json({
      message: '下载完成',
      path: savedPath || targetDir,
      output_dir: targetDir
    })
  } catch (error) {
    const msg = String(error?.message || '')
    if (error?.statusCode) {
      return res.status(error.statusCode).json({ error: msg })
    }
    if (msg.includes('Sign in to confirm you’re not a bot')) {
      return res.status(500).json({
        error: '下载失败: YouTube 触发了机器人校验，请先在 Cookies 设置里更新 YouTube cookies（建议重新导出）后重试。'
      })
    }
    res.status(500).json({ error: `下载失败: ${msg}` })
  }
})

app.get('/api/cookies', (req, res) => {
  const cookieDir = userCookiesDir(req.clientId)
  const files = fs.readdirSync(cookieDir).filter((f) => f.endsWith('.txt'))
  const platforms = {}

  for (const file of files) {
    const name = file.replace(/\.txt$/, '')
    platforms[name] = { has_cookies: true }
  }

  if (!platforms.youtube) platforms.youtube = { has_cookies: false }
  if (!platforms.bilibili) platforms.bilibili = { has_cookies: false }

  const customPlatforms = Object.keys(platforms).filter((p) => p !== 'youtube' && p !== 'bilibili')

  res.json({
    platforms,
    custom_platforms: customPlatforms
  })
})

app.get('/api/cookies/:platform', (req, res) => {
  const platform = sanitizePlatform(req.params.platform)
  if (!platform) return res.status(400).json({ error: '无效的平台名' })

  const cookiePath = cookiesPathFor(req.clientId, platform)
  if (!fs.existsSync(cookiePath)) {
    return res.status(404).json({ error: '该平台未设置 cookies' })
  }

  const cookies = fs.readFileSync(cookiePath, 'utf8')
  res.json({ platform, cookies })
})

app.post('/api/cookies', (req, res) => {
  const platform = sanitizePlatform(req.body?.platform)
  const cookies = String(req.body?.cookies || '')

  if (!platform) return res.status(400).json({ error: '无效的平台名' })
  if (!cookies.trim()) return res.status(400).json({ error: 'cookies 内容不能为空' })

  fs.writeFileSync(cookiesPathFor(req.clientId, platform), cookies, 'utf8')
  res.json({ message: `${platform} cookies 保存成功` })
})

app.delete('/api/cookies/:platform', (req, res) => {
  const platform = sanitizePlatform(req.params.platform)
  if (!platform) return res.status(400).json({ error: '无效的平台名' })

  const cookiePath = cookiesPathFor(req.clientId, platform)
  if (fs.existsSync(cookiePath)) {
    fs.unlinkSync(cookiePath)
  }

  res.json({ message: `${platform} cookies 已删除` })
})

app.listen(PORT, () => {
  console.log(`Video backend running: http://localhost:${PORT}`)
})
