import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const loadEnvFile = (envPath) => {
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    if (process.env[key]) continue
    process.env[key] = rawValue.trim().replace(/^['"]|['"]$/g, '')
  }
}

loadEnvFile(path.join(__dirname, '.env'))

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
const siliconFlowBaseUrl = String(process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1').replace(/\/+$/, '')
const siliconFlowModel = String(process.env.SILICONFLOW_MODEL || '').trim()
const siliconFlowApiKey = String(process.env.SILICONFLOW_API_KEY || '').trim()
const siliconFlowMockOutline = ['1', 'true', 'yes', 'on'].includes(String(process.env.SILICONFLOW_MOCK_OUTLINE || '').trim().toLowerCase())

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

const minTranscriptCompactLength = 100

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

const decodeHtmlEntities = (text = '') => {
  return String(text)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

const normalizeTranscriptText = (text = '') => {
  let inSkipBlock = false
  const lines = decodeHtmlEntities(text)
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => {
      const trimmed = line.replace(/<[^>]+>/g, '').trim()
      if (/^(STYLE|REGION|NOTE)(\s|$)/i.test(trimmed)) {
        inSkipBlock = true
        return ''
      }
      if (!trimmed) {
        inSkipBlock = false
        return ''
      }
      if (inSkipBlock) return ''
      return trimmed
    })
    .filter(Boolean)
    .filter((line) => !/^WEBVTT/i.test(line))
    .filter((line) => !/^Kind:/i.test(line))
    .filter((line) => !/^Language:/i.test(line))
    .filter((line) => !/^\d+$/.test(line))
    .filter((line) => !/^(align|position|line|size):/i.test(line))
    .filter((line) => !/^(?:\d{2}:)?\d{2}:\d{2}[.,]\d{3}\s+-->\s+(?:\d{2}:)?\d{2}:\d{2}[.,]\d{3}/.test(line))

  return lines
    .filter((line, index) => index === 0 || line !== lines[index - 1])
    .join('\n')
    .trim()
}

const transcriptPreview = (text = '') => {
  return String(text || '').replace(/\s+/g, ' ').trim().slice(0, 500)
}

const evaluateTranscript = (text = '') => {
  const normalized = String(text || '').trim()
  const compact = normalized.replace(/\s+/g, '')
  const readableChars = compact.match(/[\p{L}\p{N}\p{Script=Han}]/gu) || []
  const tokens = normalized.match(/[\p{L}\p{N}\p{Script=Han}]{2,}/gu) || []
  const uniqueTokens = new Set(tokens.map((token) => token.toLowerCase()))
  const readableRatio = compact.length ? readableChars.length / compact.length : 0
  const uniqueRatio = tokens.length ? uniqueTokens.size / tokens.length : 0

  if (!compact) {
    return {
      isValid: false,
      reason: 'EMPTY_TRANSCRIPT',
      charCount: 0,
      compactLength: 0,
      tokenCount: 0,
      uniqueTokenCount: 0
    }
  }

  if (compact.length < minTranscriptCompactLength) {
    return {
      isValid: false,
      reason: 'TRANSCRIPT_TOO_SHORT',
      charCount: normalized.length,
      compactLength: compact.length,
      tokenCount: tokens.length,
      uniqueTokenCount: uniqueTokens.size
    }
  }

  if (readableRatio < 0.55) {
    return {
      isValid: false,
      reason: 'TRANSCRIPT_LOW_READABLE_RATIO',
      charCount: normalized.length,
      compactLength: compact.length,
      tokenCount: tokens.length,
      uniqueTokenCount: uniqueTokens.size
    }
  }

  if (tokens.length >= 20 && uniqueRatio < 0.12) {
    return {
      isValid: false,
      reason: 'TRANSCRIPT_TOO_REPETITIVE',
      charCount: normalized.length,
      compactLength: compact.length,
      tokenCount: tokens.length,
      uniqueTokenCount: uniqueTokens.size
    }
  }

  return {
    isValid: true,
    reason: 'OK',
    charCount: normalized.length,
    compactLength: compact.length,
    tokenCount: tokens.length,
    uniqueTokenCount: uniqueTokens.size
  }
}

const parseJsonCaption = (raw = '') => {
  const parsed = JSON.parse(raw)
  const chunks = []
  for (const event of parsed.events || []) {
    for (const seg of event.segs || []) {
      const text = String(seg.utf8 || '').trim()
      if (text) chunks.push(text)
    }
  }
  return normalizeTranscriptText(chunks.join(' '))
}

const parseSubtitleText = (raw = '', ext = '') => {
  const normalizedExt = String(ext || '').toLowerCase()
  if (normalizedExt === 'json3') {
    return parseJsonCaption(raw)
  }
  return normalizeTranscriptText(raw)
}

const captionLanguageScore = (lang = '') => {
  const normalized = String(lang).toLowerCase()
  if (normalized.startsWith('zh')) return 0
  if (normalized.startsWith('en')) return 1
  return 2
}

const captionExtScore = (ext = '') => {
  const normalized = String(ext).toLowerCase()
  if (normalized === 'json3') return 0
  if (normalized === 'vtt') return 1
  if (normalized.startsWith('srv')) return 2
  if (normalized === 'ttml') return 3
  return 4
}

const getCaptionCandidates = (info = {}) => {
  const groups = [
    { type: 'manual', captions: info.subtitles || {} },
    { type: 'automatic', captions: info.automatic_captions || {} }
  ]
  const candidates = []

  for (const group of groups) {
    for (const [language, items] of Object.entries(group.captions)) {
      if (!Array.isArray(items)) continue
      for (const item of items) {
        if (!item?.url) continue
        candidates.push({
          type: group.type,
          language,
          ext: String(item.ext || '').toLowerCase(),
          name: item.name || item.format || '',
          url: item.url
        })
      }
    }
  }

  return candidates.sort((a, b) => {
    const typeScore = (a.type === 'manual' ? 0 : 1) - (b.type === 'manual' ? 0 : 1)
    if (typeScore !== 0) return typeScore
    const langScore = captionLanguageScore(a.language) - captionLanguageScore(b.language)
    if (langScore !== 0) return langScore
    return captionExtScore(a.ext) - captionExtScore(b.ext)
  })
}

const fetchTranscriptFromInfo = async (info = {}) => {
  const candidates = getCaptionCandidates(info)
  let bestInvalid = null

  console.log('[video-transcript] 字幕候选:', candidates.map((candidate) => ({
    type: candidate.type,
    language: candidate.language,
    ext: candidate.ext,
    name: candidate.name
  })))

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
          Accept: 'text/vtt,application/json,text/plain,*/*'
        }
      })
      if (!response.ok) continue
      const raw = await response.text()
      const transcript = parseSubtitleText(raw, candidate.ext)
      const quality = evaluateTranscript(transcript)
      const metadata = {
        type: candidate.type,
        language: candidate.language,
        ext: candidate.ext,
        raw_length: raw.length,
        transcript_length: quality.charCount,
        compact_length: quality.compactLength,
        reason: quality.reason,
        preview: transcriptPreview(transcript)
      }

      if (!quality.isValid) {
        console.warn('[video-transcript] 跳过无效字幕候选:', metadata)
        if (!bestInvalid || quality.compactLength > bestInvalid.quality.compactLength) {
          bestInvalid = { candidate, transcript, quality, metadata }
        }
        continue
      }

      console.log('[video-transcript] 使用字幕候选:', metadata)
      if (transcript) {
        return {
          transcript,
          transcript_language: candidate.language,
          transcript_source: candidate.type,
          transcript_format: candidate.ext,
          transcript_is_valid: true,
          transcript_status: 'available',
          transcript_char_count: quality.charCount,
          transcript_compact_length: quality.compactLength,
          transcript_preview: transcriptPreview(transcript)
        }
      }
    } catch (error) {
      console.warn('[video-transcript] 字幕候选读取失败:', {
        type: candidate.type,
        language: candidate.language,
        ext: candidate.ext,
        message: error?.message || String(error)
      })
      // Caption URLs can expire or be platform-specific; keep parsing resilient.
    }
  }

  if (bestInvalid) {
    return {
      transcript: '',
      transcript_language: bestInvalid.candidate.language,
      transcript_source: bestInvalid.candidate.type,
      transcript_format: bestInvalid.candidate.ext,
      transcript_is_valid: false,
      transcript_status: 'insufficient',
      transcript_invalid_reason: bestInvalid.quality.reason,
      transcript_char_count: bestInvalid.quality.charCount,
      transcript_compact_length: bestInvalid.quality.compactLength,
      transcript_preview: transcriptPreview(bestInvalid.transcript)
    }
  }

  return {
    transcript: '',
    transcript_language: '',
    transcript_source: '',
    transcript_format: '',
    transcript_is_valid: false,
    transcript_status: 'missing',
    transcript_invalid_reason: 'NO_TRANSCRIPT',
    transcript_char_count: 0,
    transcript_compact_length: 0,
    transcript_preview: ''
  }
}

const buildOutlinePrompt = ({ title, platform, duration, language, transcript }) => `
## Identity
你是一个视频内容结构化助手，擅长根据视频字幕提取内容层级，并生成适合思维导图展示的视频大纲。

## Task
根据输入的视频标题、平台、时长、输出语言和字幕文本，生成一个严格 JSON 格式的视频大纲。

## Instructions
- 只能根据字幕内容生成，不要编造字幕中没有的信息。
- 节点顺序必须按照字幕内容出现顺序。
- 节点标题要短，适合 UI 展示。
- 字幕内容充足时，一级节点控制在 4 到 6 个。
- 字幕内容充足时，每个一级节点包含 2 到 4 个二级节点。
- 字幕内容不足时，不要为了满足节点数量而编造；代码层会尽量提前拦截无效字幕。
- 不要输出空话、套话或泛泛总结。
- 如果字幕信息不足，请生成保守大纲，并在 summary 中说明信息有限。
- 如果某些信息无法从字幕中判断，不要猜测，使用中性表达。
- 输出语言必须跟随 language 参数。
- 必须只输出 JSON，不要输出 Markdown，不要输出代码块，不要输出解释文字。

## Context
视频标题：
${title}

视频平台：
${platform}

视频时长：
${duration}

输出语言：
${language}

字幕内容：
${transcript}

## Output
请严格输出一个 JSON object，结构如下：

{
  "title": "视频大纲标题",
  "summary": "一句话概括整个视频",
  "nodes": [
    {
      "id": "1",
      "title": "一级节点标题",
      "summary": "这一部分的简短概括",
      "children": [
        {
          "id": "1.1",
          "title": "二级节点标题",
          "summary": "子节点简短说明"
        }
      ]
    }
  ]
}

字段要求：
- title: string，不能为空。
- summary: string，不能为空。
- nodes: array，内容充足时包含 4 到 6 个一级节点；内容不足时不要强行凑数。
- nodes[].id: string，使用 "1"、"2"、"3" 递增。
- nodes[].title: string，短标题。
- nodes[].summary: string，简短说明。
- nodes[].children: array，内容充足时每个一级节点包含 2 到 4 个子节点。
- children[].id: string，使用 "1.1"、"1.2" 递增。
- children[].title: string，短标题。
- children[].summary: string，简短说明。

## Examples
错误输出示例：
下面是视频大纲：
{
  "title": "...",
  "summary": "...",
  "nodes": []
}

正确输出示例：
{
  "title": "视频大纲标题",
  "summary": "一句话概括整个视频",
  "nodes": [
    {
      "id": "1",
      "title": "一级节点标题",
      "summary": "这一部分的简短概括",
      "children": [
        {
          "id": "1.1",
          "title": "二级节点标题",
          "summary": "子节点简短说明"
        }
      ]
    }
  ]
}`

const extractJsonObject = (text = '') => {
  const trimmed = String(text || '').trim()
  if (!trimmed) throw new Error('empty model response')
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced ? fenced[1].trim() : trimmed
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) throw new Error('model response is not JSON')
  return JSON.parse(candidate.slice(start, end + 1))
}

const normalizeOutline = (outline = {}) => {
  const nodes = Array.isArray(outline.nodes) ? outline.nodes : []
  return {
    title: String(outline.title || 'Video Outline').trim(),
    summary: String(outline.summary || '').trim(),
    nodes: nodes.map((node, index) => {
      const id = String(node?.id || index + 1)
      const children = Array.isArray(node?.children) ? node.children : []
      return {
        id,
        title: String(node?.title || `Part ${index + 1}`).trim(),
        summary: String(node?.summary || '').trim(),
        children: children.map((child, childIndex) => ({
          id: String(child?.id || `${id}.${childIndex + 1}`),
          title: String(child?.title || '').trim(),
          summary: String(child?.summary || '').trim()
        })).filter((child) => child.title || child.summary)
      }
    }).filter((node) => node.title || node.summary || node.children.length)
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const buildMockOutline = ({ title, language }) => {
  const isEnglish = String(language || '').toLowerCase().startsWith('en')
  if (isEnglish) {
    return {
      title: title ? `Mock Outline: ${title}` : 'Mock Video Outline',
      summary: 'This is a local mock outline for UI testing. No SiliconFlow API call was made.',
      nodes: [
        {
          id: '1',
          title: 'Opening Context',
          summary: 'Introduces the theme and the core premise of the video.',
          children: [
            { id: '1.1', title: 'Main topic', summary: 'Frames what the video is about.' },
            { id: '1.2', title: 'Initial hook', summary: 'Sets up why the topic matters.' }
          ]
        },
        {
          id: '2',
          title: 'Core Ideas',
          summary: 'Collects the central arguments into a readable structure.',
          children: [
            { id: '2.1', title: 'First insight', summary: 'Summarizes the first important point.' },
            { id: '2.2', title: 'Second insight', summary: 'Summarizes the next supporting idea.' }
          ]
        },
        {
          id: '3',
          title: 'Examples',
          summary: 'Represents the examples or stories used to support the message.',
          children: [
            { id: '3.1', title: 'Example one', summary: 'A concrete illustration from the content.' },
            { id: '3.2', title: 'Example two', summary: 'Another reference that supports the theme.' }
          ]
        },
        {
          id: '4',
          title: 'Takeaways',
          summary: 'Concludes with practical lessons and next steps.',
          children: [
            { id: '4.1', title: 'Key lesson', summary: 'The main idea to remember.' },
            { id: '4.2', title: 'Next action', summary: 'A possible follow-up or application.' }
          ]
        }
      ]
    }
  }

  return {
    title: title ? `测试大纲：${title}` : '测试视频大纲',
    summary: '这是用于本地界面测试的 Mock 大纲，没有调用硅基流动 API。',
    nodes: [
      {
        id: '1',
        title: '开场背景',
        summary: '概括视频开头提出的主题和问题。',
        children: [
          { id: '1.1', title: '核心主题', summary: '说明视频主要讨论的方向。' },
          { id: '1.2', title: '问题引入', summary: '解释为什么这个主题值得关注。' }
        ]
      },
      {
        id: '2',
        title: '主要观点',
        summary: '整理视频中的关键论点和内容层次。',
        children: [
          { id: '2.1', title: '观点一', summary: '总结第一个重要观点。' },
          { id: '2.2', title: '观点二', summary: '总结第二个支撑观点。' }
        ]
      },
      {
        id: '3',
        title: '案例说明',
        summary: '模拟视频中用于支撑主题的例子或故事。',
        children: [
          { id: '3.1', title: '案例一', summary: '呈现一个具体说明。' },
          { id: '3.2', title: '案例二', summary: '补充另一个辅助说明。' }
        ]
      },
      {
        id: '4',
        title: '结论启发',
        summary: '收束视频内容，提炼可以带走的结论。',
        children: [
          { id: '4.1', title: '关键收获', summary: '总结最值得记住的信息。' },
          { id: '4.2', title: '后续行动', summary: '给出下一步思考或实践方向。' }
        ]
      }
    ]
  }
}

const callSiliconFlowOutline = async (payload) => {
  if (!siliconFlowApiKey) {
    const err = new Error('缺少 SILICONFLOW_API_KEY，请在后端环境变量中配置。')
    err.statusCode = 500
    throw err
  }

  if (!siliconFlowModel) {
    const err = new Error('缺少 SILICONFLOW_MODEL，请在后端环境变量中配置模型名。')
    err.statusCode = 500
    throw err
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000)

  try {
    const response = await fetch(`${siliconFlowBaseUrl}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${siliconFlowApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: siliconFlowModel,
        messages: [
          {
            role: 'user',
            content: buildOutlinePrompt(payload)
          }
        ],
        temperature: 0.2,
        enable_thinking: false,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      })
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const err = new Error(data?.error?.message || `硅基流动请求失败: HTTP ${response.status}`)
      err.statusCode = 502
      throw err
    }

    const content = data?.choices?.[0]?.message?.content || ''
    let parsed
    try {
      parsed = extractJsonObject(content)
    } catch (error) {
      console.error('[video-outline] 模型返回内容不是合法 JSON:', content)
      const err = new Error('模型返回内容不是合法 JSON')
      err.statusCode = 502
      throw err
    }

    const outline = normalizeOutline(parsed)
    if (!outline.nodes.length) {
      const err = new Error('模型返回的大纲为空')
      err.statusCode = 502
      throw err
    }
    return outline
  } catch (error) {
    if (error?.name === 'AbortError') {
      const err = new Error('硅基流动请求超时')
      err.statusCode = 504
      throw err
    }
    throw error
  } finally {
    clearTimeout(timeout)
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

  if (!selected || ext !== 'mp4') {
    const err = new Error('该格式不可用：仅支持包含视频流的 MP4 下载')
    err.statusCode = 400
    throw err
  }

  if (!hasVideo) {
    const err = new Error('该视频格式不可用')
    err.statusCode = 400
    throw err
  }

  return { ext, hasVideo, hasAudio }
}

const toUniqueFormats = (formats = [], duration = 0) => {
  const byResolution = new Map()

  for (const f of formats) {
    if (!f || !f.ext) continue
    const ext = String(f.ext || '').toLowerCase()
    const hasVideo = f.vcodec && f.vcodec !== 'none'
    const size = estimateSizeBytes(f, duration)

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
    const transcriptInfo = await fetchTranscriptFromInfo(info)
    res.json({
      title: info.title,
      thumbnail,
      thumbnail_proxy: buildThumbnailProxyUrl(thumbnail),
      duration: info.duration,
      uploader: info.uploader || info.channel || info.creator || '',
      upload_date: info.upload_date || info.release_date || info.timestamp || '',
      ...subtitleInfo,
      ...transcriptInfo,
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

app.post('/api/video/outline', async (req, res) => {
  try {
    const title = String(req.body?.title || '').trim()
    const platform = String(req.body?.platform || '').trim()
    const duration = String(req.body?.duration || '').trim()
    const language = String(req.body?.language || '').trim()
    const transcript = String(req.body?.transcript || '').trim()
    const transcriptQuality = evaluateTranscript(transcript)

    console.log('[video-outline] 收到大纲请求:', {
      title,
      platform,
      duration,
      language,
      transcript_length: transcriptQuality.charCount,
      transcript_compact_length: transcriptQuality.compactLength,
      transcript_valid: transcriptQuality.isValid,
      transcript_reason: transcriptQuality.reason,
      transcript_preview: transcriptPreview(transcript)
    })

    if (!transcript) {
      return res.status(400).json({
        success: false,
        error: '缺少字幕文本'
      })
    }

    if (!transcriptQuality.isValid) {
      return res.status(400).json({
        success: false,
        code: 'INSUFFICIENT_TRANSCRIPT',
        error: '字幕内容不足，无法生成大纲',
        transcript_reason: transcriptQuality.reason,
        transcript_char_count: transcriptQuality.charCount,
        transcript_compact_length: transcriptQuality.compactLength
      })
    }

    if (siliconFlowMockOutline) {
      console.log('[video-outline] 使用 Mock 大纲，跳过硅基流动 API 调用。')
      await wait(5000)
      return res.json({
        success: true,
        mock: true,
        outline: buildMockOutline({
          title: title || 'Untitled Video',
          language: language || 'zh'
        })
      })
    }

    const outline = await callSiliconFlowOutline({
      title: title || 'Untitled Video',
      platform: platform || 'Unknown',
      duration: duration || 'Unknown',
      language: language || 'zh',
      transcript
    })

    res.json({
      success: true,
      outline
    })
  } catch (error) {
    const message = error?.message || '生成大纲失败'
    console.error('[video-outline] 生成大纲失败:', {
      message,
      statusCode: error?.statusCode || 500,
      hasApiKey: Boolean(siliconFlowApiKey),
      hasModel: Boolean(siliconFlowModel),
      baseUrl: siliconFlowBaseUrl
    })
    res.status(error?.statusCode || 500).json({
      success: false,
      error: message
    })
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
