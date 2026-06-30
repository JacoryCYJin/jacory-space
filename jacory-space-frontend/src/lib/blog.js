// Blog content layer.
//
// Markdown files stay in src/content/blog. Metadata is indexed on demand, while
// article blocks are parsed only when a detail route requests a specific slug.

import { parseDocument } from './markdown'

const postModules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
})

const REQUIRED_FIELDS = ['title', 'description', 'date', 'category', 'index']
const ALLOWED_CATEGORIES = new Set([
  'NOTE',
  'ESSAY',
  'WEEKLY',
  'LOG',
  'ARTICLE',
  'RESEARCH',
  'METHOD',
  'REVIEW',
])

let metaPromise
let metasBySlug
let metasAscending
const postCache = new Map()

function fileNameFromPath(path) {
  return path.split('/').pop()
}

function slugFromPath(path) {
  return fileNameFromPath(path).replace(/\.md$/, '')
}

function blogError(message) {
  throw new Error(`[blog] ${message}`)
}

function stripQuotes(value) {
  return String(value).trim().replace(/^["'](.*)["']$/, '$1')
}

function parseTags(value) {
  if (value === undefined || value === null || value === '') return []
  const text = Array.isArray(value) ? value : stripQuotes(String(value).trim())

  const rawTags = Array.isArray(text)
    ? text
    : text.startsWith('[') && text.endsWith(']')
      ? text.slice(1, -1).split(',')
      : text.split(',')

  return rawTags
    .map((tag) => stripQuotes(tag).trim())
    .filter(Boolean)
}

function parseFrontmatter(raw, fileName) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) return {}

  const frontmatter = {}
  const lines = match[1].split(/\r?\n/)

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (!line.trim()) continue

    const kv = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line.trim())
    if (!kv) continue

    const [, key, rawValue] = kv
    const value = rawValue.trim()

    if (key === 'tags' && !value) {
      const tags = []
      let cursor = i + 1
      while (cursor < lines.length) {
        const item = /^\s*-\s+(.*)$/.exec(lines[cursor])
        if (!item) break
        tags.push(item[1])
        cursor += 1
      }
      frontmatter.tags = tags
      i = cursor - 1
      continue
    }

    if (key === 'tags') {
      frontmatter.tags = value
      continue
    }

    frontmatter[key] = stripQuotes(value)
  }

  if (frontmatter.tags !== undefined) {
    const tags = parseTags(frontmatter.tags)
    if (!Array.isArray(tags)) {
      blogError(`${fileName} invalid tags frontmatter: expected an array`)
    }
    frontmatter.tags = tags
  } else {
    frontmatter.tags = []
  }

  return frontmatter
}

function isValidDate(value) {
  const fullDate = /^(\d{4})([-.])(\d{2})\2(\d{2})$/.exec(value)
  if (fullDate) {
    const year = Number(fullDate[1])
    const month = Number(fullDate[3])
    const day = Number(fullDate[4])
    const date = new Date(Date.UTC(year, month - 1, day))
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    )
  }

  // Legacy compatibility for existing month-level entries such as "2026.06".
  const monthDate = /^(\d{4})\.(\d{2})$/.exec(value)
  if (monthDate) {
    const month = Number(monthDate[2])
    return month >= 1 && month <= 12
  }

  return false
}

function validateFrontmatter(frontmatter, { fileName }) {
  for (const field of REQUIRED_FIELDS) {
    if (!frontmatter[field]) {
      blogError(`${fileName} missing required frontmatter field: ${field}`)
    }
  }

  if (!isValidDate(frontmatter.date)) {
    blogError(`${fileName} invalid date: ${frontmatter.date}`)
  }

  if (!ALLOWED_CATEGORIES.has(frontmatter.category)) {
    blogError(`${fileName} invalid category: ${frontmatter.category}`)
  }

  if (!Array.isArray(frontmatter.tags)) {
    blogError(`${fileName} invalid tags frontmatter: expected an array`)
  }
}

function compareByIndexAsc(a, b) {
  return a.index > b.index ? 1 : a.index < b.index ? -1 : 0
}

function toMeta(slug, frontmatter) {
  return {
    slug,
    index: frontmatter.index,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    category: frontmatter.category,
    readTime: frontmatter.readTime || '',
    tags: frontmatter.tags,
  }
}

async function buildMetaIndex() {
  const entries = await Promise.all(
    Object.entries(postModules).map(async ([path, loader]) => {
      const raw = await loader()
      const slug = slugFromPath(path)
      const fileName = fileNameFromPath(path)
      const frontmatter = parseFrontmatter(raw, fileName)

      validateFrontmatter(frontmatter, { fileName })

      return {
        path,
        slug,
        meta: toMeta(slug, frontmatter),
      }
    }),
  )

  const seenSlugs = new Set()
  const seenIndexes = new Set()

  for (const entry of entries) {
    if (seenSlugs.has(entry.slug)) {
      blogError(`duplicate blog slug: ${entry.slug}`)
    }
    seenSlugs.add(entry.slug)

    if (seenIndexes.has(entry.meta.index)) {
      blogError(`duplicate blog index: ${entry.meta.index}`)
    }
    seenIndexes.add(entry.meta.index)
  }

  metasAscending = entries.map((entry) => entry.meta).sort(compareByIndexAsc)
  metasBySlug = new Map(metasAscending.map((meta) => [meta.slug, meta]))

  return metasAscending.slice().reverse()
}

async function ensureMetaIndex() {
  if (!metaPromise) {
    metaPromise = buildMetaIndex()
  }
  return metaPromise
}

function findPathBySlug(slug) {
  return Object.keys(postModules).find((path) => slugFromPath(path) === slug)
}

export async function getAllPostMeta() {
  const metas = await ensureMetaIndex()
  return metas.map((meta) => ({ ...meta, tags: [...meta.tags] }))
}

export async function getPostBySlug(slug) {
  await ensureMetaIndex()

  const path = findPathBySlug(slug)
  if (!path) return null

  if (postCache.has(slug)) {
    return postCache.get(slug)
  }

  const raw = await postModules[path]()
  const fileName = fileNameFromPath(path)
  const frontmatter = parseFrontmatter(raw, fileName)
  validateFrontmatter(frontmatter, { fileName })

  const { blocks, toc } = parseDocument(raw)
  const position = metasAscending.findIndex((meta) => meta.slug === slug)
  const post = {
    slug,
    frontmatter,
    blocks,
    toc,
    index: frontmatter.index,
    meta: metasBySlug.get(slug),
    prev: position > 0 ? metasAscending[position - 1] : null,
    next: position < metasAscending.length - 1 ? metasAscending[position + 1] : null,
  }

  postCache.set(slug, post)
  return post
}

export async function getPostsByCategory(category) {
  const metas = await getAllPostMeta()
  return metas.filter((meta) => meta.category === category)
}

export async function getPostsByTag(tag) {
  const metas = await getAllPostMeta()
  return metas.filter((meta) => meta.tags.includes(tag))
}

// Compatibility API for existing callers.
export async function listPosts() {
  return getAllPostMeta()
}

// Compatibility API for existing callers.
export async function getPost(slug) {
  return getPostBySlug(slug)
}
