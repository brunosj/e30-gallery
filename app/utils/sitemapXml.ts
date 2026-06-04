import { getSiteUrl } from '@/app/_utilities/siteUrl'

export type SitemapChangefreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

export interface SitemapIndexEntry {
  lastmod?: Date
  loc: string
}

export interface SitemapUrlItem {
  changefreq?: SitemapChangefreq
  lastmod?: Date
  loc: string
  priority?: number
}

export function buildSitemapIndex(entries: SitemapIndexEntry[]): string {
  const body = entries
    .map(e => {
      const loc = escapeXml(e.loc)
      const lm = e.lastmod
        ? `<lastmod>${e.lastmod.toISOString()}</lastmod>`
        : ''
      return `<sitemap><loc>${loc}</loc>${lm}</sitemap>`
    })
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`
}

export function buildUrlSet(items: SitemapUrlItem[]): string {
  const body = items
    .map(item => {
      const inner = [`<loc>${escapeXml(item.loc)}</loc>`]
      if (item.lastmod) {
        inner.push(`<lastmod>${item.lastmod.toISOString()}</lastmod>`)
      }
      if (item.changefreq) {
        inner.push(`<changefreq>${item.changefreq}</changefreq>`)
      }
      if (typeof item.priority === 'number') {
        inner.push(`<priority>${item.priority}</priority>`)
      }
      return `<url>${inner.join('')}</url>`
    })
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`
}

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function getBaseUrl(): string {
  return getSiteUrl()
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
