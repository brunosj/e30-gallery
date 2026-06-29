/** True when a CMS-entered value should be treated as an external URL, not an internal path. */
export function isExternalUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return false
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return true
  if (trimmed.startsWith('/')) return false
  return /^[\w-]+(\.[\w-]+)+/.test(trimmed)
}

/** Ensure CMS-entered external URLs have a protocol for use in href attributes. */
export function normalizeExternalUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed
  return `https://${trimmed.replace(/^\/+/, '')}`
}

/** Resolve a CMS link value to an external URL or an internal site path. */
export function resolveExternalOrInternalHref(url: string): string {
  if (isExternalUrl(url)) {
    return normalizeExternalUrl(url)
  }
  const trimmed = url.trim()
  return trimmed.startsWith('/') ? trimmed : `/${trimmed.replace(/^\//, '')}`
}
