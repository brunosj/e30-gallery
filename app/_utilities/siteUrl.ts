const DEFAULT_SITE_URL = 'https://e30gallery.com'

function normalizePublicOrigin(raw: string): string {
  let origin = raw.replace(/\/$/, '')

  if (process.env.NODE_ENV === 'production') {
    if (origin.startsWith('http://')) {
      origin = origin.replace(/^http:/, 'https:')
    }
    try {
      const url = new URL(origin)
      if (url.port === '5173' || url.port === '5174') {
        url.port = ''
      }
      origin = url.origin
    } catch {
      return DEFAULT_SITE_URL
    }
  }

  return origin
}

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    DEFAULT_SITE_URL

  return normalizePublicOrigin(raw)
}
