// A quoted tag may end with an optional hexadecimal text color.
export function parseTagDefinitions(value) {
  if (value === undefined || value === null || value === '') return []
  const unquote = (text) => String(text).trim().replace(/^["'](.*)["']$/, '$1')
  const text = Array.isArray(value) ? value : unquote(value)
  const values = Array.isArray(text)
    ? text
    : text.startsWith('[') && text.endsWith(']')
      ? text.slice(1, -1).split(',')
      : text.split(',')

  return values.map((value) => {
    const text = unquote(value).trim()
    const colored = /^(.*?)\s+(#(?:[\da-f]{6}|[\da-f]{3}))$/i.exec(text)
    return colored
      ? { name: colored[1].trim(), color: colored[2] }
      : { name: text, color: '' }
  }).filter((tag) => tag.name)
    .sort((a, b) => Number(Boolean(b.color)) - Number(Boolean(a.color)))
}
