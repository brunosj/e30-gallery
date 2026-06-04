import type { Artist, Blogpost, Exhibition, GenericPage } from '@/app/payload-types'

import { fetchCollection } from '@/app/_utilities/fetchCollection'
import {
  artistDetailHref,
  exhibitionDetailHref,
  genericPageHref,
  insightDetailHref,
  localizedAbsoluteUrl,
  type PageHref,
} from '@/app/_utilities/localizedUrl'

import {
  buildSitemapIndex,
  buildUrlSet,
  getBaseUrl,
  type SitemapUrlItem,
} from '@/app/utils/sitemapXml'

type Locale = 'de' | 'en'

type StaticPathKey =
  | '/'
  | '/artists'
  | '/exhibitions'
  | '/gallery'
  | '/art-society'
  | '/insights'
  | '/newsletter'
  | '/contact'
  | '/legal'
  | '/data-privacy'

const STATIC_PAGE_ROUTES: {
  pathname: StaticPathKey
  changefreq: SitemapUrlItem['changefreq']
  priority: number
}[] = [
  { changefreq: 'weekly', pathname: '/', priority: 1 },
  { changefreq: 'weekly', pathname: '/artists', priority: 0.9 },
  { changefreq: 'weekly', pathname: '/exhibitions', priority: 0.9 },
  { changefreq: 'monthly', pathname: '/gallery', priority: 0.8 },
  { changefreq: 'monthly', pathname: '/art-society', priority: 0.7 },
  { changefreq: 'weekly', pathname: '/insights', priority: 0.8 },
  { changefreq: 'monthly', pathname: '/newsletter', priority: 0.6 },
  { changefreq: 'monthly', pathname: '/contact', priority: 0.7 },
  { changefreq: 'yearly', pathname: '/legal', priority: 0.3 },
  { changefreq: 'yearly', pathname: '/data-privacy', priority: 0.3 },
]

export const SITEMAP_CHILD_FILES = [
  'page-sitemap-en.xml',
  'page-sitemap-de.xml',
  'artist-sitemap-en.xml',
  'artist-sitemap-de.xml',
  'exhibition-sitemap-en.xml',
  'exhibition-sitemap-de.xml',
  'insight-sitemap-en.xml',
  'insight-sitemap-de.xml',
] as const

function locFromHref(locale: Locale, href: PageHref): string {
  return localizedAbsoluteUrl(getBaseUrl(), locale, href)
}

function isPublished(doc: { _status?: string | null }): boolean {
  return doc._status !== 'draft'
}

export async function buildPagePartitionXml(locale: Locale): Promise<string> {
  const stamp = new Date()
  const items: SitemapUrlItem[] = []

  for (const row of STATIC_PAGE_ROUTES) {
    items.push({
      changefreq: row.changefreq,
      lastmod: stamp,
      loc: locFromHref(locale, row.pathname),
      priority: row.priority,
    })
  }

  try {
    const data = await fetchCollection<GenericPage>('generic-pages', { locale })
    for (const page of data?.docs || []) {
      if (page.slug && isPublished(page)) {
        items.push({
          changefreq: 'monthly',
          lastmod: page.updatedAt ? new Date(page.updatedAt) : stamp,
          loc: locFromHref(locale, genericPageHref(page.slug)),
          priority: 0.6,
        })
      }
    }
  } catch (error) {
    console.error(`[sitemap] generic-pages partition (${locale}) error:`, error)
  }

  return buildUrlSet(items)
}

export async function buildArtistPartitionXml(locale: Locale): Promise<string> {
  const items: SitemapUrlItem[] = []
  try {
    const data = await fetchCollection<Artist>('artist', { locale, depth: 0 })
    for (const artist of data?.docs || []) {
      if (artist.slug && isPublished(artist)) {
        items.push({
          changefreq: 'monthly',
          lastmod: artist.updatedAt ? new Date(artist.updatedAt) : undefined,
          loc: locFromHref(locale, artistDetailHref(artist.slug)),
          priority: 0.7,
        })
      }
    }
  } catch (error) {
    console.error(`[sitemap] artist partition (${locale}) error:`, error)
  }
  return buildUrlSet(items)
}

export async function buildExhibitionPartitionXml(
  locale: Locale,
): Promise<string> {
  const items: SitemapUrlItem[] = []
  try {
    const data = await fetchCollection<Exhibition>('exhibition', {
      locale,
      depth: 0,
    })
    for (const exhibition of data?.docs || []) {
      if (exhibition.slug && isPublished(exhibition)) {
        items.push({
          changefreq: 'monthly',
          lastmod: exhibition.updatedAt
            ? new Date(exhibition.updatedAt)
            : undefined,
          loc: locFromHref(locale, exhibitionDetailHref(exhibition.slug)),
          priority: 0.8,
        })
      }
    }
  } catch (error) {
    console.error(`[sitemap] exhibition partition (${locale}) error:`, error)
  }
  return buildUrlSet(items)
}

export async function buildInsightPartitionXml(locale: Locale): Promise<string> {
  const items: SitemapUrlItem[] = []
  try {
    const data = await fetchCollection<Blogpost>('blogpost', { locale, depth: 0 })
    for (const post of data?.docs || []) {
      if (post.slug && isPublished(post)) {
        items.push({
          changefreq: 'monthly',
          lastmod: post.updatedAt ? new Date(post.updatedAt) : undefined,
          loc: locFromHref(locale, insightDetailHref(post.slug)),
          priority: 0.6,
        })
      }
    }
  } catch (error) {
    console.error(`[sitemap] blogpost partition (${locale}) error:`, error)
  }
  return buildUrlSet(items)
}

export function buildRootSitemapIndexXml(): string {
  const base = getBaseUrl()
  return buildSitemapIndex(
    SITEMAP_CHILD_FILES.map(file => ({
      lastmod: new Date(),
      loc: `${base}/${file}`,
    })),
  )
}
