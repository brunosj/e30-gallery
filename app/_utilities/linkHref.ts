import type { LinkObject } from '@/app/types'
import type { LocalizedHref } from '@/app/_utilities/localizedUrl'
import {
  isExternalUrl,
  normalizeExternalUrl,
  resolveExternalOrInternalHref,
} from '@/app/_utilities/normalizeExternalUrl'

type ReferenceRelationTo = NonNullable<LinkObject['reference']>['relationTo']

const RELATION_TO_ROUTE: Record<
  ReferenceRelationTo,
  string | ((slug: string) => `/${string}`)
> = {
  homepage: '/',
  'artists-page': '/artists',
  'art-society-page': '/art-society',
  'exhibitions-page': '/exhibitions',
  'gallery-page': '/gallery',
  'members-only-page': '/members-area',
  'newsletter-page': '/newsletter',
  'blog-page': '/insights',
  'generic-pages': slug => `/${slug}`,
}

function getReferenceSlug(value: LinkObject['reference'] extends infer R ? R : never): string | null {
  if (!value || typeof value === 'string') return null
  const doc = value.value
  if (!doc || typeof doc === 'string') return null
  return typeof doc.slug === 'string' ? doc.slug : null
}

export function resolveReferenceHref(link: LinkObject): LocalizedHref | `/${string}` | null {
  const reference = link.reference
  if (!reference) return null

  const route = RELATION_TO_ROUTE[reference.relationTo]
  if (!route) return null

  if (typeof route === 'function') {
    const slug = getReferenceSlug(reference)
    return slug ? route(slug) : null
  }

  return route as LocalizedHref
}

export function hrefMatchesPath(
  href: string | LocalizedHref | null,
  pathname: string,
): boolean {
  if (!href) return false
  if (typeof href === 'string') {
    return href === pathname || (href !== '/' && pathname.startsWith(`${href}/`))
  }
  if (typeof href === 'object' && 'pathname' in href) {
    return href.pathname === pathname
  }
  return false
}

export function resolveLinkHref(link: LinkObject): string | LocalizedHref | null {
  switch (link.type) {
    case 'mailto':
      if (!link.email) return null
      let mailto = `mailto:${link.email}`
      const queryParams: string[] = []
      if (link.subject) queryParams.push(`subject=${encodeURIComponent(link.subject)}`)
      if (link.body) queryParams.push(`body=${encodeURIComponent(link.body)}`)
      if (queryParams.length > 0) mailto += `?${queryParams.join('&')}`
      return mailto
    case 'custom':
      if (!link.url) return null
      return resolveExternalOrInternalHref(link.url)
    case 'reference':
      return resolveReferenceHref(link)
    default:
      if (link.url) {
        return isExternalUrl(link.url) ? normalizeExternalUrl(link.url) : link.url
      }
      return null
  }
}
