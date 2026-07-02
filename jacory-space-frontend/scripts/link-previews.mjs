import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const rootDir = path.resolve(import.meta.dirname, '..')
const blogDir = path.join(rootDir, 'src/content/blog')
const previewDir = path.join(rootDir, 'src/content/link-previews')
const linkBlockRe = /^:::link\s*$([\s\S]*?)^:::\s*$/gim

function slugFromFile(filePath) {
  return path.basename(filePath, '.md')
}

function decodeHtml(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

function attrValue(tag, name) {
  const match = new RegExp(`${name}=["']([^"']+)["']`, 'i').exec(tag)
  return match ? decodeHtml(match[1]) : ''
}

function metaContent(html, selector) {
  const [attr, value] = selector
  const re = new RegExp(`<meta[^>]+${attr}=["']${value}["'][^>]*>`, 'i')
  const tag = re.exec(html)?.[0]
  return tag ? attrValue(tag, 'content') : ''
}

function titleContent(html) {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)
  return match ? decodeHtml(match[1].replace(/\s+/g, ' ')) : ''
}

function linkHref(html, relName) {
  const re = new RegExp(`<link[^>]+rel=["'][^"']*${relName}[^"']*["'][^>]*>`, 'i')
  const tag = re.exec(html)?.[0]
  return tag ? attrValue(tag, 'href') : ''
}

function absoluteUrl(value, baseUrl) {
  if (!value) return ''
  try {
    return new URL(value, baseUrl).toString()
  } catch {
    return ''
  }
}

function parseKeyValueBlock(text) {
  const data = {}
  for (const line of text.split(/\r?\n/)) {
    const match = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line.trim())
    if (!match) continue
    data[match[1]] = match[2].trim().replace(/^["'](.*)["']$/, '$1')
  }
  return data
}

function extractLinks(raw) {
  const urls = new Set()
  let match
  while ((match = linkBlockRe.exec(raw))) {
    const body = match[1].trim()
    const data = parseKeyValueBlock(body)
    const firstUrl = body.split(/\r?\n/).map((line) => line.trim()).find((line) => /^https?:\/\//.test(line))
    const url = data.url || firstUrl
    if (url) urls.add(url)
  }
  return [...urls]
}

async function readExisting(slug) {
  try {
    return JSON.parse(await readFile(path.join(previewDir, `${slug}.json`), 'utf8'))
  } catch {
    return { links: {} }
  }
}

async function fetchPreview(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 12000)
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'Jacory Space link preview bot (+https://github.com/JacoryCYJin/jacory-space)',
        accept: 'text/html,application/xhtml+xml',
      },
    })
    const html = await response.text()
    const resolvedUrl = response.url || url
    const pageUrl = new URL(resolvedUrl)
    const favicon =
      absoluteUrl(linkHref(html, 'icon'), resolvedUrl) ||
      absoluteUrl(linkHref(html, 'apple-touch-icon'), resolvedUrl) ||
      `${pageUrl.origin}/favicon.ico`

    return {
      url,
      resolvedUrl,
      title: metaContent(html, ['property', 'og:title']) || metaContent(html, ['name', 'twitter:title']) || titleContent(html),
      description:
        metaContent(html, ['property', 'og:description']) ||
        metaContent(html, ['name', 'description']) ||
        metaContent(html, ['name', 'twitter:description']),
      siteName: metaContent(html, ['property', 'og:site_name']) || pageUrl.hostname.replace(/^www\./, ''),
      favicon,
      image:
        absoluteUrl(metaContent(html, ['property', 'og:image']), resolvedUrl) ||
        absoluteUrl(metaContent(html, ['name', 'twitter:image']), resolvedUrl),
      fetchedAt: new Date().toISOString(),
    }
  } finally {
    clearTimeout(timer)
  }
}

async function blogFiles() {
  const entries = await readdir(blogDir)
  return entries.filter((entry) => entry.endsWith('.md')).map((entry) => path.join(blogDir, entry))
}

async function resolveTargets(args) {
  const files = await blogFiles()
  const explicit = args.filter((arg) => arg !== '--all' && arg !== '--file')
  if (!explicit.length || args.includes('--all')) return files

  return explicit.map((arg) => {
    const normalized = arg.endsWith('.md') ? arg : `${arg}.md`
    const absolute = path.isAbsolute(normalized) ? normalized : path.resolve(process.cwd(), normalized)
    const byPath = files.find((file) => file === absolute)
    if (byPath) return byPath
    const byName = files.find((file) => path.basename(file) === path.basename(normalized))
    if (byName) return byName
    return path.join(blogDir, path.basename(normalized))
  })
}

async function updateFile(filePath) {
  const raw = await readFile(filePath, 'utf8')
  const slug = slugFromFile(filePath)
  const urls = extractLinks(raw)
  const existing = await readExisting(slug)
  const next = {
    source: path.basename(filePath),
    updatedAt: new Date().toISOString(),
    links: {},
  }

  for (const url of urls) {
    try {
      next.links[url] = await fetchPreview(url)
      console.log(`fetched ${slug}: ${url}`)
    } catch (error) {
      const previous = existing.links?.[url]
      if (previous) {
        next.links[url] = previous
        console.warn(`kept cached ${slug}: ${url}`)
      } else {
        next.links[url] = {
          url,
          title: '',
          description: '',
          siteName: '',
          favicon: '',
          image: '',
          error: error instanceof Error ? error.message : String(error),
          fetchedAt: new Date().toISOString(),
        }
        console.warn(`failed ${slug}: ${url}`)
      }
    }
  }

  await mkdir(previewDir, { recursive: true })
  await writeFile(path.join(previewDir, `${slug}.json`), `${JSON.stringify(next, null, 2)}\n`)
}

const targets = await resolveTargets(process.argv.slice(2))
for (const target of targets) {
  await updateFile(target)
}
