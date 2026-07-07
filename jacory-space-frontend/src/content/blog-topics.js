export const blogTopics = [
  {
    slug: 'product',
    key: 'PRODUCT',
    labelKey: 'blog.entryTopics.PRODUCT',
    sortOrder: 10,
  },
]

const topicsBySlug = new Map(blogTopics.map((topic) => [topic.slug, topic]))
const topicsByKey = new Map(blogTopics.map((topic) => [topic.key, topic]))

export function getBlogTopic(value) {
  if (!value) return null
  const raw = String(value).trim()
  return topicsBySlug.get(raw.toLowerCase()) ?? topicsByKey.get(raw.toUpperCase()) ?? null
}

export function listBlogTopicSlugs() {
  return blogTopics.map((topic) => topic.slug)
}
