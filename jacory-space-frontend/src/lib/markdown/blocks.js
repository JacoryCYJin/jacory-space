import { parseInline, appendText } from './inline.js'
import { CALLOUT_END_RE, CALLOUT_START_RE, FIGURE_MARKER_RE, parseLinkPreview } from './blog-extensions.js'

const IMAGE_LINE_RE = /^!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"([^"]*)")?\s*\)$/

function normalizeHeadingText(text) {
  const customId = /\s+\{#([A-Za-z0-9_-]+)\}\s*$/.exec(text)
  if (!customId) {
    return { text: text.trim(), customId: '' }
  }
  return {
    text: text.slice(0, customId.index).trim(),
    customId: customId[1],
  }
}

function listMatch(line) {
  const match = /^(\s*)([-*+]|\d+\.)\s+(?:\[([ xX])\]\s+)?(.*)$/.exec(line)
  if (!match) return null
  return {
    indent: match[1].length,
    ordered: /\d+\./.test(match[2]),
    task: match[3] === undefined ? null : match[3].toLowerCase() === 'x',
    text: match[4],
  }
}

function appendContinuation(item, line) {
  const value = line.trim()
  if (!value) return
  appendText(item.inlines, ` ${value}`)
}

function parseList(lines, start, baseIndent) {
  const first = listMatch(lines[start])
  const block = {
    type: 'list',
    ordered: first.ordered,
    items: [],
  }
  let i = start

  while (i < lines.length) {
    const match = listMatch(lines[i])
    if (!match || match.indent < baseIndent) break

    if (match.indent > baseIndent) {
      const previous = block.items[block.items.length - 1]
      if (!previous) break
      const nested = parseList(lines, i, match.indent)
      previous.children.push(nested.block)
      i = nested.next
      continue
    }

    if (match.indent !== baseIndent) break

    const item = {
      inlines: parseInline(match.text),
      task: match.task,
      children: [],
    }
    block.items.push(item)
    i += 1

    while (i < lines.length) {
      if (!lines[i].trim()) {
        i += 1
        break
      }

      const next = listMatch(lines[i])
      if (next?.indent === baseIndent) break
      if (next && next.indent < baseIndent) break
      if (next && next.indent > baseIndent) {
        const nested = parseList(lines, i, next.indent)
        item.children.push(nested.block)
        i = nested.next
        continue
      }

      if (!next && /^\s+/.test(lines[i])) {
        appendContinuation(item, lines[i])
        i += 1
        continue
      }

      break
    }
  }

  return { block, next: i }
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
  if (CALLOUT_START_RE.test(trimmed)) return true
  if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) return true
  if (/^>\s?/.test(line)) return true
  if (/^\s*([-*+]|\d+\.)\s+/.test(line)) return true
  if (IMAGE_LINE_RE.test(trimmed)) return true
  return false
}

function isTableSeparator(line) {
  return /\|/.test(line) && /^\s*\|?[\s:|-]+\|?\s*$/.test(line) && line.includes('-')
}

function tableAlignments(line) {
  return splitTableRow(line).map((cell) => {
    if (/^:-+:$/.test(cell)) return 'center'
    if (/^-+:$/.test(cell)) return 'right'
    if (/^:-+$/.test(cell)) return 'left'
    return ''
  })
}

export function parseBlocks(body) {
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

    if (/^```/.test(line.trim())) {
      const lang = line.trim().slice(3).trim()
      const buffer = []
      i++
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        buffer.push(lines[i])
        i++
      }
      i++
      blocks.push({ type: 'code', lang, code: buffer.join('\n') })
      continue
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    const callout = CALLOUT_START_RE.exec(line.trim())
    if (callout) {
      const variant = callout[1].toLowerCase()
      const buffer = []
      i++
      while (i < lines.length && !CALLOUT_END_RE.test(lines[i].trim())) {
        buffer.push(lines[i])
        i++
      }
      if (i < lines.length) i++
      if (variant === 'link') {
        blocks.push(parseLinkPreview(buffer))
        continue
      }
      blocks.push({ type: 'callout', variant, blocks: parseBlocks(buffer.join('\n')) })
      continue
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      headingCount += 1
      const level = heading[1].length
      const headingMeta = normalizeHeadingText(heading[2])
      blocks.push({
        type: 'heading',
        level,
        text: headingMeta.text,
        id: headingMeta.customId || `heading-${headingCount}`,
        inlines: parseInline(headingMeta.text),
      })
      i++
      continue
    }

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

    if (line.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = splitTableRow(line).map(parseInline)
      const align = tableAlignments(lines[i + 1])
      i += 2
      const rows = []
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        rows.push(splitTableRow(lines[i]).map(parseInline))
        i++
      }
      blocks.push({ type: 'table', header, align, rows })
      continue
    }

    const list = listMatch(line)
    if (list) {
      const parsed = parseList(lines, i, list.indent)
      blocks.push(parsed.block)
      i = parsed.next
      continue
    }

    const image = parseImage(line)
    if (image) {
      blocks.push({ type: 'figure', ...image })
      i++
      continue
    }

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
