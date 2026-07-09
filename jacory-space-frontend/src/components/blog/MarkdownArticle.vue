<script>
import { h, nextTick } from 'vue'
import { MarkerHighlighter } from 'markerhighlight'

const LINK_CLASS =
  'article-link break-words text-blue no-underline transition-colors'
const INLINE_CODE_CLASS =
  'break-words rounded-sm border border-line bg-card px-1.5 py-0.5 font-mono text-sm text-foreground'
const META_LABEL_CLASS =
  'font-mono text-xs font-medium uppercase leading-[1.2] tracking-[0.18em]'
const HEADING_NUMBER_RE = /^\s*\d{1,2}\s*(?:[.．、|｜/])\s*/
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
const MARKER_COLOR_CLASSES = {
  default: 'article-marker-default',
  gray: 'article-marker-gray',
  blue: 'article-marker-blue',
  green: 'article-marker-green',
  yellow: 'article-marker-yellow',
  orange: 'article-marker-orange',
  red: 'article-marker-red',
  purple: 'article-marker-purple',
  pink: 'article-marker-pink',
  underline: 'article-marker-underline',
}

const MARKER_HIGHLIGHT_STYLES = {
  archive: {
    drawingMode: 'highlight',
    animate: false,
    animationTrigger: 'load',
    animationSpeed: 1200,
    height: 1,
    offset: 0.2,
    padding: 0.12,
    multiLineDelay: 0.16,
    skewX: 0.1,
    highlight: {
      amplitude: 0.55,
      wavelength: 5,
      roughEnds: 0.35,
    },
  },
  underline: {
    drawingMode: 'highlight',
    animate: false,
    animationTrigger: 'load',
    animationSpeed: 620,
    height: 0.1,
    offset: 0.82,
    padding: 0,
    multiLineDelay: 0.12,
    highlight: {
      amplitude: 0.02,
      wavelength: 10,
      roughEnds: 0,
    },
  },
}

let markerStylesDefined = false

function defineMarkerStyles() {
  if (markerStylesDefined) return
  Object.entries(MARKER_HIGHLIGHT_STYLES).forEach(([name, options]) => {
    MarkerHighlighter.defineStyle(name, options)
  })
  markerStylesDefined = true
}

function colorClass(token) {
  return COLOR_CLASSES[token] || ''
}

function markerToken(token) {
  return MARKER_COLOR_CLASSES[token] ? token : 'default'
}

function markerClass(token) {
  return MARKER_COLOR_CLASSES[markerToken(token)]
}

function markerStyle(token) {
  if (token === 'underline') return 'underline'
  return 'archive'
}

function cleanHeadingText(text) {
  return String(text || '').replace(HEADING_NUMBER_RE, '').trim()
}

function normalizeHeadingInlines(inlines) {
  let cleaned = false

  return (inlines || []).map((token) => {
    if (cleaned) return token

    if (typeof token === 'string') {
      const nextValue = cleanHeadingText(token)
      cleaned = nextValue !== token
      return nextValue
    }

    if (typeof token?.value === 'string') {
      const nextValue = cleanHeadingText(token.value)
      cleaned = nextValue !== token.value
      return { ...token, value: nextValue }
    }

    return token
  })
}

function renderInline(tokens) {
  return (tokens || []).map((token) => {
    if (typeof token === 'string') return token

    switch (token.type) {
      case 'strong':
        return h('strong', { class: 'article-strong font-medium text-foreground' }, token.value)
      case 'em':
        return h('em', { class: 'article-em italic' }, token.value)
      case 'strike':
        return h('del', { class: 'text-haze decoration-line' }, token.value)
      case 'mark': {
        const style = markerStyle(token.token)
        const colorClass = markerClass(token.token)
        return h(
          'mark',
          {
            class: `article-mark ${colorClass}`,
            'data-marker-highlight': '',
            'data-highlight-style': style,
            'data-drawing-mode': 'highlight',
          },
          token.value,
        )
      }
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

  return h('figure', { class: `clear-none min-w-0 max-w-full ${figureClass}` }, [
    h('span', { class: 'block border border-line bg-card p-1.5' }, [
      h('img', {
        src: block.src,
        alt: block.alt,
        loading: 'lazy',
        class: 'block w-full',
      }),
    ]),
    h('figcaption', { class: `${META_LABEL_CLASS} mt-3 text-haze` }, caption),
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

  return h('figure', { class: 'relative my-8 w-full min-w-0 max-w-full overflow-hidden border border-line bg-card' }, [
    block.lang
      ? h('span', { class: `${META_LABEL_CLASS} absolute right-4 top-3 text-haze` }, block.lang.toUpperCase())
      : null,
    h('div', { class: 'flex w-full min-w-0 max-w-full gap-4 overflow-x-auto px-4 py-4 font-mono text-sm leading-relaxed' }, [
      h('div', { class: 'select-none border-r border-line pr-4', 'aria-hidden': 'true' }, numbers),
      h('div', { class: 'min-w-max' }, codeLines),
    ]),
  ])
}

function renderTable(block) {
  const alignClass = (align) =>
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'

  return h('div', { class: 'my-8 w-full min-w-0 max-w-full overflow-x-auto' }, [
    h('table', { class: 'w-full min-w-max border-collapse text-sm' }, [
      h('thead', [
        h(
          'tr',
          { class: 'border-b border-line-strong' },
          block.header.map((cell, idx) =>
            h(
              'th',
              {
                class: `py-2.5 pr-6 font-mono text-xs uppercase tracking-[0.12em] text-haze ${alignClass(
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
                  class: `py-3 pr-6 align-top text-sm leading-relaxed ${alignClass(block.align?.[idx])} ${
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
      class: `${nested ? 'mt-2 space-y-1 pl-5' : 'my-7 space-y-2.5 pl-5'} min-w-0 text-base leading-8 text-foreground md:text-lg ${
        block.ordered ? 'list-decimal' : block.items.some((item) => item.task !== null) ? 'list-none' : 'list-disc'
      } marker:text-blue-soft`,
    },
    block.items.map((item) =>
      h('li', { class: `${item.task !== null ? 'pl-0' : 'pl-1'} min-w-0 break-words` }, [
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
  const labelClass = isWarning ? 'text-foreground' : 'text-blue'
  const borderClass = isWarning ? 'border-line-strong' : 'border-line'
  return h(
    'aside',
    { class: `article-callout my-8 min-w-0 border-y py-5 ${borderClass}` },
    [
      h('p', { class: `${META_LABEL_CLASS} mb-3 ${labelClass}` }, isWarning ? 'WARNING' : 'NOTE'),
      h('div', { class: 'space-y-1' }, block.blocks.map(renderBlock)),
    ],
  )
}

function renderHighlight(block) {
  return h('aside', { class: 'article-callout article-callout-highlight my-8 min-w-0 border border-blue/30 bg-blue/5 px-5 py-5' }, [
    h('p', { class: `${META_LABEL_CLASS} mb-3 text-blue` }, 'HIGHLIGHT'),
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
        'group relative my-8 grid w-full min-w-0 max-w-full overflow-hidden rounded-md border border-line bg-card transition-colors hover:border-line-strong md:grid-cols-[minmax(0,1fr)_minmax(180px,34%)]',
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
                'block break-words text-base font-medium leading-snug text-foreground transition-colors group-hover:text-blue sm:truncate',
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

function renderBlock(block, context = {}) {
  switch (block.type) {
    case 'heading': {
      const tag = `h${block.level}`
      if (block.level === 2) {
        const sectionNumber = String(context.headingIndex || 1).padStart(2, '0')
        const normalizedInlines = normalizeHeadingInlines(block.inlines)

        return h(
          tag,
          {
            id: block.id,
            class:
              'mb-5 mt-20 scroll-mt-28 break-words font-sans text-2xl font-semibold leading-tight tracking-tight text-foreground first:mt-0 md:text-3xl',
          },
          [
            h('span', { class: 'mr-4 font-mono text-2xl font-semibold leading-none text-blue md:text-3xl' }, sectionNumber),
            h('span', { class: 'mr-4 font-mono text-2xl font-normal leading-none text-line-strong md:text-3xl' }, '|'),
            h('span', renderInline(normalizedInlines)),
          ],
        )
      }

      return h(
        tag,
        {
          id: block.id,
          class:
            'mb-4 mt-12 scroll-mt-28 break-words font-sans text-xl font-semibold leading-snug tracking-tight text-foreground',
        },
        renderInline(normalizeHeadingInlines(block.inlines)),
      )
    }
    case 'paragraph':
      return h(
        'p',
        { class: 'my-6 min-w-0 break-words text-base leading-8 text-foreground md:text-lg md:leading-9' },
        renderInline(block.inlines),
      )
    case 'blockquote':
      return h('blockquote', { class: 'article-quote my-10 min-w-0 border-l border-line-strong pl-5' }, [
        h(
          'p',
          { class: 'text-base italic leading-8 text-foreground md:text-lg' },
          renderInline(block.inlines),
        ),
        block.attribution
          ? h('cite', { class: `${META_LABEL_CLASS} mt-2 block not-italic text-haze` }, `— ${block.attribution}`)
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
      return h('hr', { class: 'my-14 border-0 border-t border-line' })
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
  data() {
    return {
      markerHighlighter: null,
      markerCorrectionTimers: [],
    }
  },
  mounted() {
    this.setupMarkerHighlights()
  },
  updated() {
    this.setupMarkerHighlights()
  },
  beforeUnmount() {
    this.teardownMarkerHighlights()
  },
  methods: {
    teardownMarkerHighlights() {
      const root = this.$el
      this.markerCorrectionTimers.forEach((timer) => window.clearTimeout(timer))
      this.markerCorrectionTimers = []
      this.markerHighlighter?.stopAllAnimations?.()
      this.markerHighlighter?.clearExistingHighlights?.()
      root?.removeAttribute?.('data-marker-initialized')
      root?.querySelectorAll?.('mark[data-original-bgcolor]').forEach((mark) => {
        mark.style.backgroundColor = mark.getAttribute('data-original-bgcolor') || ''
        mark.removeAttribute('data-original-bgcolor')
      })
      this.markerHighlighter = null
    },
    async setupMarkerHighlights() {
      await nextTick()
      const root = this.$el
      if (!root?.querySelectorAll) return

      this.teardownMarkerHighlights()

      const marks = root.querySelectorAll('mark[data-marker-highlight]')
      if (!marks.length) return

      if (typeof window === 'undefined') return

      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        return
      }

      defineMarkerStyles()
      try {
        this.markerHighlighter = new MarkerHighlighter(root, {
          drawingMode: 'highlight',
          animate: false,
          animationTrigger: 'load',
          animationSpeed: 1200,
          height: 0.72,
          offset: 0.22,
          padding: 0.12,
          multiLineDelay: 0.16,
          skewX: 0,
          highlight: {
            amplitude: 0.12,
            wavelength: 5,
            roughEnds: 0.35,
            jitter: 0.01,
          },
        })
        this.scheduleMarkerHighlightCorrection()
      } catch (error) {
        this.teardownMarkerHighlights()
        console.warn('[blog] MarkerHighlighter failed; using static mark fallback.', error)
      }
    },
    scheduleMarkerHighlightCorrection() {
      this.markerCorrectionTimers.forEach((timer) => window.clearTimeout(timer))
      this.markerCorrectionTimers = [40, 180, 420].map((delay) =>
        window.setTimeout(() => this.correctMarkerHighlightPositions(), delay),
      )
    },
    correctMarkerHighlightPositions() {
      const root = this.$el
      if (!root?.querySelectorAll) return

      root.querySelectorAll('.highlight[data-mark-id]').forEach((highlight) => {
        const markId = highlight.getAttribute('data-mark-id')
        if (!markId) return

        const mark = Array.from(root.querySelectorAll('mark[data-mark-ref]')).find(
          (item) => item.getAttribute('data-mark-ref') === markId,
        )
        if (!mark) return

        const segmentIndex = Number.parseInt(highlight.getAttribute('data-segment-index') || '0', 10)
        const markRects = Array.from(mark.getClientRects())
        const markRect = markRects[Number.isNaN(segmentIndex) ? 0 : segmentIndex] || mark.getBoundingClientRect()
        const highlightRect = highlight.getBoundingClientRect()
        if (!markRect.width || !highlightRect.width) return

        const desiredTop = markRect.top + (markRect.height - highlightRect.height) / 2
        const desiredLeft = markRect.left - (highlightRect.width - markRect.width) / 2
        const topDelta = desiredTop - highlightRect.top
        const leftDelta = desiredLeft - highlightRect.left

        if (Math.abs(topDelta) > 0.5) {
          highlight.style.top = `${(parseFloat(highlight.style.top) || 0) + topDelta}px`
        }
        if (Math.abs(leftDelta) > 0.5) {
          highlight.style.left = `${(parseFloat(highlight.style.left) || 0) + leftDelta}px`
        }
      })
    },
  },
  render() {
    const blocks = this.blocks || []
    const rightFigure = blocks.find((b) => b.type === 'figure' && b.variant === 'right')

    const children = []
    let headingIndex = 0
    if (rightFigure) {
      children.push(renderFigure(rightFigure, { floated: true }))
    }
    for (const block of blocks) {
      if (block === rightFigure) continue
      if (block.type === 'heading' && block.level === 2) {
        headingIndex += 1
      }
      children.push(renderBlock(block, { headingIndex }))
    }
    // Ensure following sections clear the floated figure cleanly.
    children.push(h('div', { class: 'clear-both' }))

    return h('div', { class: 'article-body w-full min-w-0 max-w-full overflow-hidden break-words' }, children)
  },
}
</script>

<style scoped>
.article-body {
  --article-marker-default: rgba(249, 213, 68, 0.82);
  --article-marker-gray: rgba(170, 176, 184, 0.55);
  --article-marker-blue: rgba(38, 147, 255, 0.62);
  --article-marker-green: rgba(45, 198, 128, 0.58);
  --article-marker-yellow: rgba(249, 213, 68, 0.82);
  --article-marker-orange: rgba(255, 159, 64, 0.62);
  --article-marker-red: rgba(255, 92, 92, 0.58);
  --article-marker-purple: rgba(162, 118, 255, 0.56);
  --article-marker-pink: rgba(255, 126, 182, 0.56);
  --article-marker-underline: rgba(14, 102, 200, 0.44);
}

.article-link {
  background-image: linear-gradient(
    to right,
    currentColor,
    currentColor
  );
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 100% 1px;
  text-decoration: none;
  transition:
    color 360ms var(--ease-premium),
    background-size 520ms var(--ease-premium);
}

.article-link:hover {
  color: var(--blue);
  background-size: 100% 2px;
}

.article-strong {
  background-image: linear-gradient(
    to right,
    color-mix(in srgb, var(--blue) 18%, transparent),
    color-mix(in srgb, var(--blue) 18%, transparent)
  );
  background-position: 0 88%;
  background-repeat: no-repeat;
  background-size: 100% 0.38em;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.article-em {
  color: color-mix(in srgb, var(--foreground) 82%, var(--blue));
}

.article-mark {
  position: relative;
  z-index: 0;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  color: var(--foreground);
}

.article-marker-default,
.article-marker-gray,
.article-marker-blue,
.article-marker-green,
.article-marker-yellow,
.article-marker-orange,
.article-marker-red,
.article-marker-purple,
.article-marker-pink {
  padding-inline: 0.22em;
}

.article-marker-default {
  background-color: var(--article-marker-default);
}

.article-marker-gray {
  background-color: var(--article-marker-gray);
}

.article-marker-blue {
  background-color: var(--article-marker-blue);
}

.article-marker-green {
  background-color: var(--article-marker-green);
}

.article-marker-yellow {
  background-color: var(--article-marker-yellow);
}

.article-marker-orange {
  background-color: var(--article-marker-orange);
}

.article-marker-red {
  background-color: var(--article-marker-red);
}

.article-marker-purple {
  background-color: var(--article-marker-purple);
}

.article-marker-pink {
  background-color: var(--article-marker-pink);
}

.article-marker-underline {
  padding-inline: 0.04em;
  background-color: var(--article-marker-underline);
}

.article-quote {
  position: relative;
}

.article-quote::before {
  position: absolute;
  top: 0;
  left: -1px;
  width: 1px;
  height: 100%;
  content: "";
  background: var(--blue);
  transform: scaleY(0.72);
  transform-origin: top;
}

.article-callout {
  position: relative;
  background:
    linear-gradient(
      to right,
      color-mix(in srgb, var(--blue) 7%, transparent),
      transparent 42%
    );
}

.article-callout-highlight {
  box-shadow: inset 1px 0 0 var(--blue);
}

.article-body :deep(.highlight) {
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .article-link,
  .article-strong {
    transition: none;
  }
}
</style>
