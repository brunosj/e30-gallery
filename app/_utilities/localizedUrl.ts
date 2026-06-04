import { getPathname } from '@/i18n/navigation'

export type LocalizedHref = Parameters<typeof getPathname>[0]['href']

export type PageHref = LocalizedHref | `/${string}`

const PRIVATE_PATHS = new Set([
  '/account',
  '/create-account',
  '/recover-password',
  '/reset-password',
  '/logout',
  '/newsletter-success',
])

export function artistDetailHref(slug: string): LocalizedHref {
  return { pathname: '/artists/[slug]', params: { slug } }
}

export function exhibitionDetailHref(slug: string): LocalizedHref {
  return { pathname: '/exhibitions/[slug]', params: { slug } }
}

export function insightDetailHref(slug: string): LocalizedHref {
  return { pathname: '/insights/[slug]', params: { slug } }
}

export type LocaleSwitchHref = LocalizedHref | string

export function getLocaleSwitchHref(
  pathname: string,
  params: Record<string, string | string[] | undefined>,
): LocaleSwitchHref {
  if (!pathname.includes('[')) {
    return pathname
  }

  const routeParams: Record<string, string | string[]> = {}

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue
    if (pathname.includes(`[...${key}]`)) {
      routeParams[key] = Array.isArray(value) ? value : [value]
    } else if (pathname.includes(`[${key}]`)) {
      routeParams[key] = Array.isArray(value) ? value[0] : value
    }
  }

  if (Object.keys(routeParams).length === 0) {
    return pathname
  }

  return { pathname, params: routeParams } as LocalizedHref
}

export function genericPageHref(slug: string): `/${string}` {
  return `/${slug}`
}

export function localizedAbsoluteUrl(
  siteUrl: string,
  locale: string,
  href: PageHref,
): string {
  const origin = siteUrl.replace(/\/$/, '')

  if (typeof href === 'string') {
    if (PRIVATE_PATHS.has(href)) {
      return `${origin}${href}`
    }
    const pathname = getPathname({ href: href as LocalizedHref, locale })
    return `${origin}${pathname}`
  }

  const pathname = getPathname({ href, locale })
  return `${origin}${pathname}`
}
