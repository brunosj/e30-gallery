import { routing } from '@/i18n/routing'
import { fetchList } from '@/app/_utilities/fetchPayload'

type SlugDoc = { slug?: string | null }

const publishedWhere = { _status: { equals: 'published' as const } }

export async function getPublishedSlugs(collection: string, locale: string): Promise<string[]> {
  const result = await fetchList<SlugDoc>(collection, {
    locale,
    depth: 0,
    limit: 0,
    where: publishedWhere,
    revalidate: false,
  })

  return (result?.docs ?? [])
    .map(doc => doc.slug)
    .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0)
}

export function generateLocaleParams(): { locale: string }[] {
  return routing.locales.map(locale => ({ locale }))
}

export async function generateLocaleSlugParams(
  collection: string,
): Promise<{ locale: string; slug: string }[]> {
  const params: { locale: string; slug: string }[] = []

  for (const locale of routing.locales) {
    const slugs = await getPublishedSlugs(collection, locale)
    for (const slug of slugs) {
      params.push({ locale, slug })
    }
  }

  return params
}
