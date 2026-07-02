export const CALLOUT_START_RE = /^:::(note|warning|link)\s*$/i
export const CALLOUT_END_RE = /^:::\s*$/
export const FIGURE_MARKER_RE = /^figure:(right|wide|inline)\s+/

export function parseFrontmatter(raw) {
  const frontmatter = {}
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) {
    return { frontmatter, body: raw }
  }
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) continue
    const kv = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line)
    if (!kv) continue
    let value = kv[2].trim()
    value = value.replace(/^["'](.*)["']$/, '$1')
    frontmatter[kv[1]] = value
  }
  return { frontmatter, body: raw.slice(match[0].length) }
}

function parseKeyValueBlock(lines) {
  const data = {}
  for (const line of lines) {
    const match = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line.trim())
    if (!match) continue
    data[match[1]] = match[2].trim().replace(/^["'](.*)["']$/, '$1')
  }
  return data
}

export function parseLinkPreview(lines) {
  const data = parseKeyValueBlock(lines)
  const firstUrl = lines.map((line) => line.trim()).find((line) => /^https?:\/\//.test(line))
  return {
    type: 'linkPreview',
    url: data.url || firstUrl || '',
    title: data.title || '',
    description: data.description || '',
    siteName: data.siteName || '',
    favicon: data.favicon || data.logo || '',
    image: data.image || '',
  }
}

function hydrateLinkPreview(block, previews) {
  if (block.type !== 'linkPreview' || !block.url) return block
  const preview = linkPreviewForUrl(previews, block.url)
  return {
    ...block,
    title: block.title || preview.title || '',
    description: block.description || preview.description || '',
    siteName: block.siteName || preview.siteName || '',
    favicon: block.favicon || preview.favicon || '',
    image: block.image || preview.image || '',
    resolvedUrl: preview.resolvedUrl || block.url,
  }
}

function hydrateInlineToken(token, previews) {
  if (token.type !== 'linkMention' || !token.url) return token
  const preview = linkPreviewForUrl(previews, token.url)
  return {
    ...token,
    title: token.title || preview.title || '',
    siteName: token.siteName || preview.siteName || '',
    favicon: token.favicon || preview.favicon || '',
    resolvedUrl: preview.resolvedUrl || token.url,
  }
}

function hydrateInlines(inlines, previews) {
  return (inlines || []).map((token) => hydrateInlineToken(token, previews))
}

function hydrateListItems(items, previews) {
  return items.map((item) => ({
    ...item,
    inlines: hydrateInlines(item.inlines, previews),
    children: (item.children || []).map((child) => hydrateBlock(child, previews)),
  }))
}

function hydrateTable(block, previews) {
  return {
    ...block,
    header: block.header.map((cell) => hydrateInlines(cell, previews)),
    rows: block.rows.map((row) => row.map((cell) => hydrateInlines(cell, previews))),
  }
}

function linkPreviewForUrl(previews, url) {
  const normalizedPreviews = previews?.links || previews
  if (!normalizedPreviews) return {}
  const variants = urlVariants(url)
  for (const variant of variants) {
    if (normalizedPreviews[variant]) return normalizedPreviews[variant]
  }
  return (
    Object.values(normalizedPreviews).find((preview) => {
      const previewUrls = urlVariants(preview.url).concat(urlVariants(preview.resolvedUrl))
      return variants.some((variant) => previewUrls.includes(variant))
    }) || {}
  )
}

function urlVariants(url) {
  if (!url) return []
  const variants = new Set([url])
  try {
    const parsed = new URL(url)
    const normalized = parsed.toString()
    variants.add(normalized)
    if (normalized.endsWith('/')) {
      variants.add(normalized.slice(0, -1))
    } else {
      variants.add(`${normalized}/`)
    }
  } catch {
    if (url.endsWith('/')) {
      variants.add(url.slice(0, -1))
    } else {
      variants.add(`${url}/`)
    }
  }
  return [...variants]
}

function hydrateBlock(block, previews) {
  if (block.type === 'linkPreview') return hydrateLinkPreview(block, previews)
  if (block.type === 'callout') {
    return { ...block, blocks: hydrateBlocks(block.blocks, previews) }
  }
  if (block.type === 'list') {
    return { ...block, items: hydrateListItems(block.items, previews) }
  }
  if (block.type === 'table') {
    return hydrateTable(block, previews)
  }
  if (block.inlines) {
    return { ...block, inlines: hydrateInlines(block.inlines, previews) }
  }
  return block
}

export function hydrateBlocks(blocks, previews) {
  return blocks.map((block) => hydrateBlock(block, previews))
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

// Resolve figure variants + captions. The first figure defaults to the desktop
// right-rail layout unless an explicit marker says otherwise.
export function finalizeFigures(blocks) {
  let figIndex = 0
  for (const block of blocks) {
    if (block.type !== 'figure') continue
    figIndex += 1
    block.figIndex = figIndex
    if (!block.variant) {
      block.variant = figIndex === 1 ? 'right' : 'inline'
    }
    const captionText = block.title || block.alt
    block.figLabel = `FIG. ${pad2(figIndex)}`
    block.figText = captionText ? captionText.toUpperCase() : ''
  }
}

export function buildToc(blocks) {
  const toc = []
  for (const block of blocks) {
    if (block.type !== 'heading') continue
    if (block.level < 2 || block.level > 3) continue
    toc.push({
      id: block.id,
      level: block.level,
      text: block.text,
    })
  }
  return toc
}
