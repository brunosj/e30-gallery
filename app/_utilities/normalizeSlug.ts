/** Normalize route slugs so CMS lookups match stored values. */
export function normalizeSlug(slug: string): string {
  let normalized = slug

  if (/%[0-9A-Fa-f]{2}/.test(normalized)) {
    try {
      normalized = decodeURIComponent(normalized)
    } catch {
      // Keep the original slug when decoding fails.
    }
  }

  return normalized.normalize('NFC')
}
