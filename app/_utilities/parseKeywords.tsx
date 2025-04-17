export function parseKeywords(keywords: string): string[] {
  if (!keywords) return []

  // Check if keywords contain semicolons
  if (keywords.includes(';')) {
    return keywords
      .split(';')
      .map(keyword => keyword.trim())
      .filter(Boolean)
  }

  // Otherwise assume comma-separated
  return keywords
    .split(',')
    .map(keyword => keyword.trim())
    .filter(Boolean)
}
