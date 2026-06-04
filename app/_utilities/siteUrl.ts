export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    'https://e30gallery.com'
  const trimmed = raw.replace(/\/$/, '')
  if (process.env.NODE_ENV === 'production' && trimmed.startsWith('http://')) {
    return trimmed.replace(/^http:/, 'https:')
  }
  return trimmed
}
