export function formatReadTime(value, t) {
  const match = String(value || '').trim().match(/^(\d+)\s*(?:MIN|分钟|分)$/i)
  return match ? t('interface.blog.minutes', { count: match[1] }) : value
}
