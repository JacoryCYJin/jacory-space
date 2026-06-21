<script>
import { h } from 'vue'

const LINK_CLASS =
  'text-blue underline decoration-line decoration-1 underline-offset-4 transition-colors hover:decoration-blue'
const INLINE_CODE_CLASS =
  'rounded-sm border border-line bg-card px-1.5 py-0.5 font-mono text-[0.85em] text-foreground'

function renderInline(tokens) {
  return (tokens || []).map((token) => {
    switch (token.type) {
      case 'strong':
        return h('strong', { class: 'font-medium text-foreground' }, token.value)
      case 'em':
        return h('em', { class: 'italic' }, token.value)
      case 'code':
        return h('code', { class: INLINE_CODE_CLASS }, token.value)
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
      default:
        return token.value
    }
  })
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
  return h('div', { class: 'my-8 overflow-x-auto' }, [
    h('table', { class: 'w-full border-collapse text-left text-sm' }, [
      h('thead', [
        h(
          'tr',
          { class: 'border-b border-line-strong' },
          block.header.map((cell) =>
            h(
              'th',
              { class: 'py-2.5 pr-6 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-haze' },
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
                  class: `py-3 pr-6 align-top text-[0.9rem] leading-relaxed ${
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
      const tag = block.ordered ? 'ol' : 'ul'
      return h(
        tag,
        {
          class: `my-5 space-y-2 pl-5 text-[0.95rem] leading-[1.8] text-muted-foreground ${
            block.ordered ? 'list-decimal' : 'list-disc'
          } marker:text-blue-soft`,
        },
        block.items.map((item) => h('li', { class: 'pl-1' }, renderInline(item))),
      )
    }
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
