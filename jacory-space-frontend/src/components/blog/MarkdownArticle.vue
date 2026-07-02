<script>
import { h } from 'vue'

const LINK_CLASS =
  'text-blue underline decoration-line decoration-1 underline-offset-4 transition-colors hover:decoration-blue'
const INLINE_CODE_CLASS =
  'rounded-sm border border-line bg-card px-1.5 py-0.5 font-mono text-[0.85em] text-foreground'
const COLOR_CLASSES = {
  default: 'text-[var(--blog-color-default)]',
  gray: 'text-[var(--blog-color-gray)]',
  blue: 'text-[var(--blog-color-blue)]',
  green: 'text-[var(--blog-color-green)]',
  yellow: 'text-[var(--blog-color-yellow)]',
  orange: 'text-[var(--blog-color-orange)]',
  red: 'text-[var(--blog-color-red)]',
  purple: 'text-[var(--blog-color-purple)]',
  pink: 'text-[var(--blog-color-pink)]',
}
const MARK_CLASSES = {
  default: 'bg-[var(--blog-mark-default)]',
  gray: 'bg-[var(--blog-mark-gray)]',
  blue: 'bg-[var(--blog-mark-blue)]',
  green: 'bg-[var(--blog-mark-green)]',
  yellow: 'bg-[var(--blog-mark-yellow)]',
  orange: 'bg-[var(--blog-mark-orange)]',
  red: 'bg-[var(--blog-mark-red)]',
  purple: 'bg-[var(--blog-mark-purple)]',
  pink: 'bg-[var(--blog-mark-pink)]',
}

function colorClass(token) {
  return COLOR_CLASSES[token] || ''
}

function markClass(token) {
  return MARK_CLASSES[token] || MARK_CLASSES.default
}

function renderInline(tokens) {
  return (tokens || []).map((token) => {
    switch (token.type) {
      case 'strong':
        return h('strong', { class: 'font-medium text-foreground' }, token.value)
      case 'em':
        return h('em', { class: 'italic' }, token.value)
      case 'strike':
        return h('del', { class: 'text-haze decoration-line' }, token.value)
      case 'mark':
        return h('mark', { class: `${markClass(token.token)} px-1 text-foreground` }, token.value)
      case 'color': {
        const cls = colorClass(token.token)
        return cls ? h('span', { class: `font-medium ${cls}` }, token.value) : token.value
      }
      case 'code':
        return h('code', { class: INLINE_CODE_CLASS }, token.value)
      case 'break':
        return h('br')
      case 'link': {
        const external = /^https?:\/\//.test(token.href)
        return h(
          'a',
          {
            href: token.href,
            class: LINK_CLASS,
            ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
          },
          token.value,
        )
      }
      case 'linkMention':
        return renderLinkMention(token)
      case 'postMention':
        return renderPostMention(token)
      default:
        return token.value
    }
  })
}

function renderLinkMention(token) {
  if (!token.url) return null
  const host = linkHost(token.url)
  const title = token.title || token.url
  const siteName = token.siteName && token.siteName !== title ? token.siteName : ''
  const favicon = token.favicon

  return h(
    'a',
    {
      href: token.url,
      target: '_blank',
      rel: 'noopener noreferrer',
      class:
        'inline-flex max-w-full items-center gap-2 align-middle text-foreground transition-colors hover:text-blue',
    },
    [
      h(
        'span',
        {
          class:
            'inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden bg-card font-mono text-xs leading-none text-blue',
          'aria-hidden': 'true',
        },
        favicon
          ? h('img', {
              src: favicon,
              alt: '',
              loading: 'lazy',
              class: 'h-full w-full object-contain',
            })
          : host.slice(0, 2).toUpperCase(),
      ),
      h('span', { class: 'min-w-0 truncate' }, [
        siteName ? h('span', { class: 'mr-1.5 text-muted-foreground' }, siteName) : null,
        h('span', { class: 'underline decoration-line decoration-1 underline-offset-4' }, title),
      ]),
    ],
  )
}

function renderPostMention(token) {
  const href = token.href || `/blog/${token.slug}`
  const title = token.title || token.slug
  const index = token.index || ''

  return h(
    'a',
    {
      href,
      class:
        'inline-flex max-w-full items-center gap-2 align-middle text-foreground transition-colors hover:text-blue',
    },
    [
      h(
        'span',
        {
          class:
            'inline-flex h-5 min-w-5 shrink-0 items-center justify-center border border-line bg-card px-1 font-mono text-xs leading-none text-blue',
          'aria-hidden': 'true',
        },
        index ? String(index).slice(-2) : 'P',
      ),
      h('span', { class: 'truncate underline decoration-line decoration-1 underline-offset-4' }, title),
    ],
  )
}

function renderFigure(block, { floated } = {}) {
  const caption = block.figText ? `${block.figLabel} — ${block.figText}` : block.figLabel
  const isWide = block.variant === 'wide'

  const figureClass = floated
    ? 'mb-8 w-full lg:float-right lg:my-2 lg:ml-12 lg:w-[clamp(240px,30%,320px)]'
    : isWide
      ? 'my-12 w-full'
      : 'mx-auto my-10 w-full max-w-xl'

  return h('figure', { class: `clear-none ${figureClass}` }, [
    h('span', { class: 'block border border-line bg-card p-1.5' }, [
      h('img', {
        src: block.src,
        alt: block.alt,
        loading: 'lazy',
        class: 'block w-full',
      }),
    ]),
    h('figcaption', { class: 'tech mt-3 text-haze' }, caption),
  ])
}

function renderCode(block) {
  const lines = block.code.replace(/\n$/, '').split('\n')
  const numbers = lines.map((_, idx) =>
    h('span', { class: 'block text-right text-blue' }, String(idx + 1).padStart(2, '0')),
  )
  const codeLines = lines.map((line) =>
    h('code', { class: 'block whitespace-pre text-foreground' }, line === '' ? ' ' : line),
  )

  return h('figure', { class: 'relative my-8 overflow-hidden border border-line bg-card' }, [
    block.lang
      ? h('span', { class: 'tech absolute right-4 top-3 text-haze' }, block.lang.toUpperCase())
      : null,
    h('div', { class: 'flex gap-4 overflow-x-auto px-4 py-4 font-mono text-[0.8rem] leading-[1.7]' }, [
      h('div', { class: 'select-none border-r border-line pr-4', 'aria-hidden': 'true' }, numbers),
      h('div', { class: 'min-w-0' }, codeLines),
    ]),
  ])
}

function renderTable(block) {
  const alignClass = (align) =>
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'

  return h('div', { class: 'my-8 overflow-x-auto' }, [
    h('table', { class: 'w-full border-collapse text-sm' }, [
      h('thead', [
        h(
          'tr',
          { class: 'border-b border-line-strong' },
          block.header.map((cell, idx) =>
            h(
              'th',
              {
                class: `py-2.5 pr-6 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-haze ${alignClass(
                  block.align?.[idx],
                )}`,
              },
              renderInline(cell),
            ),
          ),
        ),
      ]),
      h(
        'tbody',
        block.rows.map((row) =>
          h(
            'tr',
            { class: 'border-b border-line' },
            row.map((cell, idx) =>
              h(
                'td',
                {
                  class: `py-3 pr-6 align-top text-[0.9rem] leading-relaxed ${alignClass(block.align?.[idx])} ${
                    idx === 0 ? 'text-foreground' : 'text-muted-foreground'
                  }`,
                },
                renderInline(cell),
              ),
            ),
          ),
        ),
      ),
    ]),
  ])
}

function renderList(block, { nested = false } = {}) {
  const tag = block.ordered ? 'ol' : 'ul'
  return h(
    tag,
    {
      class: `${nested ? 'mt-2 space-y-1 pl-5' : 'my-5 space-y-2 pl-5'} text-[0.95rem] leading-[1.8] text-muted-foreground ${
        block.ordered ? 'list-decimal' : block.items.some((item) => item.task !== null) ? 'list-none' : 'list-disc'
      } marker:text-blue-soft`,
    },
    block.items.map((item) =>
      h('li', { class: item.task !== null ? 'pl-0' : 'pl-1' }, [
        h('span', { class: item.task !== null ? 'flex items-start gap-3' : '' }, [
          item.task !== null
            ? h('input', {
                type: 'checkbox',
                checked: item.task,
                disabled: true,
                class: 'mt-2 h-3 w-3 shrink-0 accent-blue',
              })
            : null,
          h('span', renderInline(item.inlines)),
        ]),
        ...(item.children || []).map((child) => renderList(child, { nested: true })),
      ]),
    ),
  )
}

function renderCallout(block) {
  if (block.variant === 'highlight') {
    return renderHighlight(block)
  }

  const isWarning = block.variant === 'warning'
  const labelClass = isWarning ? 'text-red-700' : 'text-blue'
  const borderClass = isWarning ? 'border-red-200' : 'border-line'
  return h(
    'aside',
    { class: `my-8 border-y py-5 ${borderClass}` },
    [
      h('p', { class: `tech mb-3 ${labelClass}` }, isWarning ? 'WARNING' : 'NOTE'),
      h('div', { class: 'space-y-1' }, block.blocks.map(renderBlock)),
    ],
  )
}

function renderHighlight(block) {
  return h('aside', { class: 'my-8 border border-blue/30 bg-blue/5 px-5 py-5' }, [
    h('p', { class: 'tech mb-3 text-blue' }, 'HIGHLIGHT'),
    h('div', { class: 'space-y-1' }, block.blocks.map(renderBlock)),
  ])
}

function linkHost(url) {
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

function renderLinkPreview(block) {
  if (!block.url) return null
  const title = block.title || block.url
  const host = linkHost(block.url)
  const favicon = block.favicon
  const image = block.image
  const description = block.description
  const displayUrl = block.resolvedUrl || block.url

  return h(
    'a',
    {
      href: block.url,
      target: '_blank',
      rel: 'noopener noreferrer',
      class:
        'group relative my-8 grid overflow-hidden rounded-md border border-line bg-card transition-colors hover:border-line-strong md:grid-cols-[minmax(0,1fr)_minmax(180px,34%)]',
    },
    [
      h(
        'span',
        { class: 'min-w-0 p-5 md:p-6' },
        [
          h(
            'span',
            {
              class:
                'block truncate text-base font-medium leading-snug text-foreground transition-colors group-hover:text-blue',
            },
            title,
          ),
          description
            ? h(
                'span',
                { class: 'mt-3 line-clamp-2 block text-sm leading-relaxed text-muted-foreground' },
                description,
              )
            : null,
          h('span', { class: 'mt-4 flex min-w-0 items-center gap-2 text-sm text-foreground' }, [
            h(
              'span',
              {
                class:
                  'inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden bg-background font-mono text-xs leading-none text-blue',
                'aria-hidden': 'true',
              },
              favicon
                ? h('img', {
                    src: favicon,
                    alt: '',
                    loading: 'lazy',
                    class: 'h-full w-full object-contain',
                  })
                : host.slice(0, 2).toUpperCase(),
            ),
            h('span', { class: 'truncate' }, displayUrl),
          ]),
        ],
      ),
      image
        ? h('span', { class: 'relative hidden overflow-hidden border-l border-line md:block' }, [
            h('img', {
              src: image,
              alt: '',
              loading: 'lazy',
              class: 'absolute inset-0 h-full w-full object-cover',
            }),
          ])
        : h('span', {
            class: 'hidden border-l border-line bg-background md:block',
            'aria-hidden': 'true',
          }),
      h(
        'span',
        {
          class:
            'absolute right-4 top-4 font-mono text-sm text-haze transition-all group-hover:translate-x-1 group-hover:text-blue',
          'aria-hidden': 'true',
        },
        '↗',
      ),
    ],
  )
}

function renderBlock(block) {
  switch (block.type) {
    case 'heading': {
      const tag = `h${block.level}`
      const cls =
        block.level === 2
          ? 'mb-4 mt-14 scroll-mt-28 font-sans text-2xl font-medium tracking-tight text-foreground first:mt-0'
          : 'mb-3 mt-10 scroll-mt-28 font-sans text-lg font-medium tracking-tight text-foreground'
      return h(tag, { id: block.id, class: cls }, renderInline(block.inlines))
    }
    case 'paragraph':
      return h(
        'p',
        { class: 'my-5 text-[0.95rem] leading-[1.9] text-muted-foreground' },
        renderInline(block.inlines),
      )
    case 'blockquote':
      return h('blockquote', { class: 'my-8 border-l border-line-strong pl-5' }, [
        h(
          'p',
          { class: 'text-[0.95rem] italic leading-[1.8] text-foreground' },
          renderInline(block.inlines),
        ),
        block.attribution
          ? h('cite', { class: 'tech mt-2 block not-italic text-haze' }, `— ${block.attribution}`)
          : null,
      ])
    case 'list': {
      return renderList(block)
    }
    case 'callout':
      return renderCallout(block)
    case 'linkPreview':
      return renderLinkPreview(block)
    case 'code':
      return renderCode(block)
    case 'table':
      return renderTable(block)
    case 'hr':
      return h('hr', { class: 'my-12 border-0 border-t border-line' })
    case 'figure':
      return renderFigure(block)
    default:
      return null
  }
}

export default {
  name: 'MarkdownArticle',
  props: {
    blocks: {
      type: Array,
      required: true,
    },
  },
  render() {
    const blocks = this.blocks || []
    const rightFigure = blocks.find((b) => b.type === 'figure' && b.variant === 'right')

    const children = []
    if (rightFigure) {
      children.push(renderFigure(rightFigure, { floated: true }))
    }
    for (const block of blocks) {
      if (block === rightFigure) continue
      children.push(renderBlock(block))
    }
    // Ensure following sections clear the floated figure cleanly.
    children.push(h('div', { class: 'clear-both' }))

    return h('div', { class: 'article-body' }, children)
  },
}
</script>
