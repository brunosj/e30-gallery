import type { Metadata } from 'next'

import { getImageUrl } from '@/app/_utilities/getImageUrl'
import {
  localizedAbsoluteUrl,
  type PageHref,
} from '@/app/_utilities/localizedUrl'
import { getSiteUrl } from '@/app/_utilities/siteUrl'
import { parseKeywords } from '@/app/_utilities/parseKeywords'

const SITE_NAME = 'E30 Gallery'
const FALLBACK_DESCRIPTION =
  'An art gallery located in Frankfurt am Main, Germany'
const DEFAULT_OG_IMAGE_PATH = '/e30-gallery.jpg'

export type OgImageInput = {
  url: string
  alt?: string
  width?: number
  height?: number
}

export type BuildPageMetadataInput = {
  locale: string
  href: PageHref
  title: string
  description?: string | null
  keywords?: string | string[] | null
  ogImage?: OgImageInput | null
  ogType?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  noIndex?: boolean
}

function resolveOgImage(
  siteUrl: string,
  ogImage?: OgImageInput | null,
): OgImageInput | null {
  if (ogImage?.url) {
    const url = ogImage.url.startsWith('http')
      ? ogImage.url
      : getImageUrl(ogImage.url)
    return {
      url,
      alt: ogImage.alt,
      width: ogImage.width ?? 1200,
      height: ogImage.height ?? 630,
    }
  }
  return {
    url: `${siteUrl}${DEFAULT_OG_IMAGE_PATH}`,
    alt: SITE_NAME,
    width: 1200,
    height: 630,
  }
}

export function buildPageMetadata({
  locale,
  href,
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  noIndex = false,
}: BuildPageMetadataInput): Metadata {
  const siteUrl = getSiteUrl()
  const pageUrl = localizedAbsoluteUrl(siteUrl, locale, href)
  const finalDescription = description || FALLBACK_DESCRIPTION
  const ogLocale = locale === 'de' ? 'de_DE' : 'en_US'
  const imageData = resolveOgImage(siteUrl, ogImage)
  const parsedKeywords = keywords
    ? parseKeywords(
        Array.isArray(keywords) ? keywords.join(',') : keywords,
      )
    : undefined

  const openGraph: Metadata['openGraph'] = {
    title,
    description: finalDescription,
    url: pageUrl,
    siteName: SITE_NAME,
    locale: ogLocale,
    type: ogType,
    images: imageData ? [imageData] : undefined,
    ...(ogType === 'article' && publishedTime
      ? {
          publishedTime,
          modifiedTime: modifiedTime || publishedTime,
        }
      : {}),
  }

  return {
    title,
    description: finalDescription,
    keywords: parsedKeywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title,
      description: finalDescription,
      images: imageData ? [imageData.url] : undefined,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

export function buildNotFoundMetadata(): Metadata {
  return {
    title: '404 - Not Found',
    description: 'Page not found',
    robots: { index: false, follow: false },
  }
}
