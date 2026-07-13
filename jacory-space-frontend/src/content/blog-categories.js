export const blogCategories = [
  {
    slug: 'weekly',
    key: 'WEEKLY',
    labelKey: 'blog.entryCategories.WEEKLY',
    sortOrder: 10,
  },
  {
    slug: 'research',
    key: 'RESEARCH',
    labelKey: 'blog.entryCategories.RESEARCH',
    sortOrder: 20,
  },
  {
    slug: 'method',
    key: 'METHOD',
    labelKey: 'blog.entryCategories.METHOD',
    sortOrder: 30,
  },
  {
    slug: 'thinking',
    key: 'THINKING',
    labelKey: 'blog.entryCategories.THINKING',
    sortOrder: 40,
  },
]

const categoriesBySlug = new Map(blogCategories.map((category) => [category.slug, category]))
const categoriesByKey = new Map(blogCategories.map((category) => [category.key, category]))

export function getBlogCategory(value) {
  if (!value) return null
  const raw = String(value).trim()
  return categoriesBySlug.get(raw.toLowerCase()) ?? categoriesByKey.get(raw.toUpperCase()) ?? null
}

export function listBlogCategorySlugs() {
  return blogCategories.map((category) => category.slug)
}
