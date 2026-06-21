// Loads blog entries from Markdown files in src/content/blog and exposes a
// slug-indexed collection plus prev/next navigation derived from frontmatter.

import { parseDocument } from './markdown'

const modules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

function firstHeadingText(blocks) {
  const heading = blocks.find((block) => block.type === 'heading')
  return heading ? heading.text : ''
}

const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = slugFromPath(path)
    const { frontmatter, blocks, toc } = parseDocument(raw)
    return {
      slug,
      frontmatter,
      blocks,
      toc,
      index: frontmatter.index || '',
      meta: {
        slug,
        index: frontmatter.index || '',
        title: frontmatter.title || firstHeadingText(blocks) || slug,
        description: frontmatter.description || '',
        date: frontmatter.date || '',
        category: frontmatter.category || 'NOTE',
        readTime: frontmatter.readTime || '',
      },
    }
  })
  // Ascending by index so prev/next reads naturally (lower index = previous).
  .sort((a, b) => (a.index > b.index ? 1 : a.index < b.index ? -1 : 0))

const bySlug = new Map(posts.map((post) => [post.slug, post]))

export function getPost(slug) {
  const post = bySlug.get(slug)
  if (!post) return null
  const position = posts.findIndex((entry) => entry.slug === slug)
  return {
    ...post,
    prev: position > 0 ? posts[position - 1].meta : null,
    next: position < posts.length - 1 ? posts[position + 1].meta : null,
  }
}

// Newest first, for the archive list page.
export function listPosts() {
  return posts.map((post) => post.meta).slice().reverse()
}
