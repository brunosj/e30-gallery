export function parseKeywords(keywords: string): string {
  return keywords
    .split(';')
    .map(keyword => keyword.trim())
    .join(', ')
}
