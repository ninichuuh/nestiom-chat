export interface TextSegment {
  type: 'text' | 'url'
  value: string
}

const URL_REGEX = /https?:\/\/[^\s<>]+/g

export function linkify(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  let lastIndex = 0

  for (const match of text.matchAll(URL_REGEX)) {
    const start = match.index
    if (start > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, start) })
    }
    segments.push({ type: 'url', value: match[0] })
    lastIndex = start + match[0].length
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) })
  }

  return segments.length > 0 ? segments : [{ type: 'text', value: text }]
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}
