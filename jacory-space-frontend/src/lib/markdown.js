// Lightweight Markdown parser tailored for the Jacory Space blog.
//
// It intentionally supports only the subset the blog needs, so the renderer
// can apply the personal-operating-system visual style instead of relying on
// any default Markdown CSS. Output is a flat list of block tokens plus a
// table of contents derived from headings.

const FIGURE_MARKER_RE = /^figure:(right|wide|inline)\s+/
const IMAGE_LINE_RE = /^!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"([^"]*)")?\s*\)$/

function parseFrontmatter(raw) {
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

// Inline tokenizer: handles `code`, **strong**, *em*, [text](href).
function parseInline(text) {
  const tokens = []
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g
  let last = 0
  let match
  while ((match = re.exec(text))) {
    if (match.index > last) {
      tokens.push({ type: 'text', value: text.slice(last, match.index) })
    }
    const seg = match[0]
    if (seg.startsWith('`')) {
      tokens.push({ type: 'code', value: seg.slice(1, -1) })
    } else if (seg.startsWith('**')) {
      tokens.push({ type: 'strong', value: seg.slice(2, -2) })
    } else if (seg.startsWith('*')) {
      tokens.push({ type: 'em', value: seg.slice(1, -1) })
    } else {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(seg)
      tokens.push({ type: 'link', value: link[1], href: link[2] })
    }
    last = re.lastIndex
  }
  if (last < text.length) {
    tokens.push({ type: 'text', value: text.slice(last) })
  }
  return tokens
}

function parseImage(line) {
  const match = IMAGE_LINE_RE.exec(line.trim())
  if (!match) return null
  let alt = (match[1] || '').trim()
  const src = match[2]
  const title = (match[3] || '').trim()
  let variant = ''
  const marker = FIGURE_MARKER_RE.exec(alt)
  if (marker) {
    variant = marker[1]
    alt = alt.slice(marker[0].length).trim()
  }
  return { src, alt, title, variant }
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
}

function isBlockStart(line) {
  const trimmed = line.trim()
  if (!trimmed) return true
  if (/^#{1,6}\s+/.test(line)) return true
  if (/^```/.test(trimmed)) return true
  if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) return true
  if (/^>\s?/.test(line)) return true
  if (/^\s*([-*+]|\d+\.)\s+/.test(line)) return true
  if (IMAGE_LINE_RE.test(trimmed)) return true
  return false
}

function isTableSeparator(line) {
  return /\|/.test(line) && /^\s*\|?[\s:|-]+\|?\s*$/.test(line) && line.includes('-')
}

function parseBlocks(body) {
  const lines = body.replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let headingCount = 0
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) {
      i++
      continue
    }

    // Fenced code block
    if (/^```/.test(line.trim())) {
      const lang = line.trim().slice(3).trim()
      const buffer = []
      i++
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        buffer.push(lines[i])
        i++
      }
      i++ // skip closing fence
      blocks.push({ type: 'code', lang, code: buffer.join('\n') })
      continue
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    // Heading
    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      headingCount += 1
      const level = heading[1].length
      const text = heading[2].trim()
      blocks.push({
        type: 'heading',
        level,
        text,
        id: `heading-${headingCount}`,
        inlines: parseInline(text),
      })
      i++
      continue
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      const buffer = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buffer.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      const quoteLines = buffer.filter((l) => l.trim())
      let attribution = ''
      if (quoteLines.length && /^(—|--|\u2014)/.test(quoteLines[quoteLines.length - 1].trim())) {
        attribution = quoteLines.pop().replace(/^(—|--|\u2014)\s*/, '').trim()
      }
      blocks.push({
        type: 'blockquote',
        inlines: parseInline(quoteLines.join(' ')),
        attribution,
      })
      continue
    }

    // Table
    if (line.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = splitTableRow(line).map(parseInline)
      i += 2
      const rows = []
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        rows.push(splitTableRow(lines[i]).map(parseInline))
        i++
      }
      blocks.push({ type: 'table', header, rows })
      continue
    }

    // List (single level)
    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line)
      const items = []
      while (i < lines.length && /^\s*([-*+]|\d+\.)\s+/.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^\s*([-*+]|\d+\.)\s+/, '')))
        i++
      }
      blocks.push({ type: 'list', ordered, items })
      continue
    }

    // Standalone image -> figure
    const image = parseImage(line)
    if (image) {
      blocks.push({ type: 'figure', ...image })
      i++
      continue
    }

    // Paragraph
    const buffer = [line.trim()]
    i++
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
      buffer.push(lines[i].trim())
      i++
    }
    blocks.push({ type: 'paragraph', inlines: parseInline(buffer.join(' ')) })
  }

  return blocks
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

// Resolve figure variants + captions. The first figure defaults to the desktop
// right-rail layout unless an explicit marker says otherwise.
function finalizeFigures(blocks) {
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

function buildToc(blocks) {
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

export function parseDocument(raw) {
  const { frontmatter, body } = parseFrontmatter(raw)
  const blocks = parseBlocks(body)
  finalizeFigures(blocks)
  const toc = buildToc(blocks)
  return { frontmatter, blocks, toc }
}
