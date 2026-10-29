// Split display lines without rewriting source text or its rich-text styling.
export function meaningLines(parts) {
  const lines = [[]]
  for (const part of parts) {
    for (const chunk of part.text.split(/([；;])/u)) {
      if (!chunk) continue
      lines.at(-1).push({ ...part, text: chunk })
      if (chunk === '；' || chunk === ';') lines.push([])
    }
  }
  return lines.filter(line => line.length)
}
