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

const userHomeDir = (clientId) => path.join(usersDir, clientId)
const userCookiesDir = (clientId) => path.join(userHomeDir(clientId), 'cookies')
const userSettingsPath = (clientId) => path.join(userHomeDir(clientId), 'settings.json')
const userDefaultDownloadsDir = (_clientId) => systemDownloadsDir
const cookiesPathFor = (clientId, platform) => path.join(userCookiesDir(clientId), `${platform}.txt`)

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

const getUserSettings = (clientId) => {
  ensureUserDirs(clientId)
  const settingsFile = userSettingsPath(clientId)

  if (!fs.existsSync(settingsFile)) {
    return { default_download_dir: userDefaultDownloadsDir(clientId) }
  }

  try {
    const raw = fs.readFileSync(settingsFile, 'utf8')
    const parsed = JSON.parse(raw)
    return {
      default_download_dir: normalizeOutputDir(parsed.default_download_dir, clientId)
    }
  } catch {
    return { default_download_dir: userDefaultDownloadsDir(clientId) }
  }
}

const saveUserSettings = (clientId, settings) => {
  ensureUserDirs(clientId)
  fs.writeFileSync(userSettingsPath(clientId), JSON.stringify(settings, null, 2), 'utf8')
}

app.use((req, res, next) => {
  const clientId = sanitizeClientId(req.header('x-client-id'))
  if (!clientId) {
    return res.status(400).json({ error: '缺少或无效的 x-client-id 请求头' })
  }

  req.clientId = clientId
  ensureUserDirs(clientId)
  next()
})

const getYtDlpArgs = (clientId, url, extraArgs = []) => {
  const platform = detectPlatform(url)
  const cookiePath = cookiesPathFor(clientId, platform)
  const args = [...extraArgs]

  if (fs.existsSync(cookiePath)) {
    args.push('--cookies', cookiePath)
  }

  args.push('--no-playlist', url)
  return args
}

const runYtDlp = (args) => {
  return new Promise((resolve, reject) => {
    const child = spawn('yt-dlp', args)
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

const toUniqueFormats = (formats = []) => {
  const byResolution = new Map()

  for (const f of formats) {
    if (!f || !f.height) continue
    if (!f.ext) continue

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
          filesize_mb: f.filesize ? (f.filesize / 1024 / 1024).toFixed(2) : '未知'
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
  const defaultDir = normalizeOutputDir(req.body?.default_download_dir, req.clientId)
  fs.mkdirSync(defaultDir, { recursive: true })

  const settings = { default_download_dir: defaultDir }
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
    const url = req.body?.url?.trim()
    if (!url) {
      return res.status(400).json({ error: '缺少 url 参数' })
    }

    const { stdout } = await runYtDlp(getYtDlpArgs(req.clientId, url, ['-J']))
    const info = JSON.parse(stdout)
    const formats = toUniqueFormats(info.formats)

    if (!formats.length) {
      return res.status(400).json({ error: '未获取到可下载分辨率，请尝试设置对应平台 Cookies' })
    }

    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      formats
    })
  } catch (error) {
    res.status(500).json({ error: `解析失败: ${error.message}` })
  }
})

app.post('/api/download', async (req, res) => {
  try {
    const url = req.body?.url?.trim()
    const resolution = req.body?.resolution?.trim()

    if (!url || !resolution) {
      return res.status(400).json({ error: '缺少 url 或 resolution 参数' })
    }

    const height = parseInt(resolution.replace(/[^0-9]/g, ''), 10)
    if (!height) {
      return res.status(400).json({ error: '无效的 resolution 参数' })
    }

    const userSettings = getUserSettings(req.clientId)
    const targetDir = normalizeOutputDir(req.body?.output_dir || userSettings.default_download_dir, req.clientId)
    fs.mkdirSync(targetDir, { recursive: true })

    const formatSelector = `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`
    const outputTemplate = path.join(targetDir, '%(title).140B-%(id)s.%(ext)s')

    const { stdout } = await runYtDlp(
      getYtDlpArgs(req.clientId, url, [
        '-f',
        formatSelector,
        '--merge-output-format',
        'mp4',
        '-o',
        outputTemplate,
        '--print',
        'after_move:filepath'
      ])
    )

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
    res.status(500).json({ error: `下载失败: ${error.message}` })
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
