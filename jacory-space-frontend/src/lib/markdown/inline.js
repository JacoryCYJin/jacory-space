function appendText(tokens, value) {
  if (!value) return
  const last = tokens[tokens.length - 1]
  if (last?.type === 'text') {
    last.value += value
    return
  }
  tokens.push({ type: 'text', value })
}

function trimTrailingUrlPunctuation(value) {
  const match = /^(.*?)([.,;:!?)]*)$/.exec(value)
  return {
    href: match?.[1] || value,
    trailing: match?.[2] || '',
  }
}

// Handles escapes, `code`, **strong**, *em*, ~~del~~, ==mark==,
// @color[token][text], @mark[token][text], @accent[text], @link[href],
// @post[slug], [text](href), and bare http(s) URLs.
export function parseInline(text) {
  const tokens = []
  let cursor = 0

  while (cursor < text.length) {
    const rest = text.slice(cursor)

    if (rest[0] === '\\' && rest.length > 1) {
      appendText(tokens, rest[1])
      cursor += 2
      continue
    }

    const code = /^`([^`]+)`/.exec(rest)
    if (code) {
      tokens.push({ type: 'code', value: code[1] })
      cursor += code[0].length
      continue
    }

    const linkMention = /^@link\[([^\]\s]+)\]/.exec(rest)
    if (linkMention) {
      tokens.push({ type: 'linkMention', url: linkMention[1] })
      cursor += linkMention[0].length
      continue
    }

    const postMention = /^@post\[([^\]\s]+)\]/.exec(rest)
    if (postMention) {
      tokens.push({ type: 'postMention', slug: postMention[1] })
      cursor += postMention[0].length
      continue
    }

    const color = /^@color\[([a-z][a-z0-9-]*)\]\[([^\]]+)\]/i.exec(rest)
    if (color) {
      tokens.push({ type: 'color', token: color[1].toLowerCase(), value: color[2] })
      cursor += color[0].length
      continue
    }

    const coloredMark = /^@mark\[([a-z][a-z0-9-]*)\]\[([^\]]+)\]/i.exec(rest)
    if (coloredMark) {
      tokens.push({ type: 'mark', token: coloredMark[1].toLowerCase(), value: coloredMark[2] })
      cursor += coloredMark[0].length
      continue
    }

    const accent = /^@accent\[([^\]]+)\]/.exec(rest)
    if (accent) {
      tokens.push({ type: 'color', token: 'blue', value: accent[1] })
      cursor += accent[0].length
      continue
    }

    const link = /^\[([^\]]+)\]\(([^)\s]+)\)/.exec(rest)
    if (link) {
      tokens.push({ type: 'link', value: link[1], href: link[2] })
      cursor += link[0].length
      continue
    }

    const autolink = /^https?:\/\/[^\s<]+/.exec(rest)
    if (autolink) {
      const { href, trailing } = trimTrailingUrlPunctuation(autolink[0])
      tokens.push({ type: 'link', value: href, href })
      appendText(tokens, trailing)
      cursor += autolink[0].length
      continue
    }

    const strong = /^\*\*([^*]+)\*\*/.exec(rest)
    if (strong) {
      tokens.push({ type: 'strong', value: strong[1] })
      cursor += strong[0].length
      continue
    }

    const strike = /^~~([^~]+)~~/.exec(rest)
    if (strike) {
      tokens.push({ type: 'strike', value: strike[1] })
      cursor += strike[0].length
      continue
    }

    const mark = /^==([^=]+)==/.exec(rest)
    if (mark) {
      tokens.push({ type: 'mark', value: mark[1] })
      cursor += mark[0].length
      continue
    }

    const em = /^\*([^*]+)\*/.exec(rest)
    if (em) {
      tokens.push({ type: 'em', value: em[1] })
      cursor += em[0].length
      continue
    }

    appendText(tokens, rest[0])
    cursor += 1
  }

  return tokens
}

export { appendText }
