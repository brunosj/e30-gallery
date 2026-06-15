import type { Exhibition } from '@/app/payload-types'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import {
  buildNotFoundMetadata,
  buildPageMetadata,
} from '@/app/_utilities/generatePageMetadata'
import { getImageUrl } from '@/app/_utilities/getImageUrl'
import {
  exhibitionDetailHref,
  localizedAbsoluteUrl,
} from '@/app/_utilities/localizedUrl'
import { getSiteUrl } from '@/app/_utilities/siteUrl'
import { StructuredData } from '@/app/_components/StructuredData'
import ExhibitionDetails from '@/app/_components/ExhibitionDetails'
import { fetchDocBySlug, fetchList } from '@/app/_utilities/fetchPayload'
import { generateLocaleSlugParams } from '@/app/_utilities/staticParams'
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

export const dynamicParams = true

export async function generateStaticParams() {
  return generateLocaleSlugParams('exhibition')
}

type Params = Promise<{ locale: string; slug: string }>

const getData = cache(async (locale: string, slug: string) => {
  const [exhibitionData, allExhibitionsData] = await Promise.all([
    fetchDocBySlug<Exhibition>('exhibition', { locale, slug, depth: 3 }),
    fetchList<Exhibition>('exhibition', { locale, depth: 3, limit: 0 }),
  ])

  if (!exhibitionData?.docs?.length) {
    notFound()
  }

  const allExhibitions = (allExhibitionsData?.docs ?? []).sort((a: Exhibition, b: Exhibition) => {
    const dateA = new Date(a.dateEnd || '').getTime()
    const dateB = new Date(b.dateEnd || '').getTime()
    return dateB - dateA
  })

  return { exhibitionData, allExhibitions }
})

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const { exhibitionData } = await getData(locale, slug)
  if (!exhibitionData?.docs.length) {
    return buildNotFoundMetadata()
  }

  const exhibition: Exhibition = exhibitionData.docs[0]
  const imageUrl = getImageUrl(exhibition.image?.url || '')

  return buildPageMetadata({
    locale,
    href: exhibitionDetailHref(slug),
    title: exhibition.meta?.title || exhibition.title,
    description: exhibition.meta?.description,
    keywords: exhibition.meta?.keywords,
    ogImage: imageUrl ? { url: imageUrl, alt: exhibition.title } : null,
  })
}

export default async function ExhibitionPage(props: { params: Params }) {
  const params = await props.params
  const { locale } = params
  setRequestLocale(locale)
  const { exhibitionData, allExhibitions } = await getData(locale, params.slug)

  if (!exhibitionData?.docs.length) {
    return notFound()
  }

  const exhibition = exhibitionData.docs[0] as Exhibition

  const currentExhibitionIndex = allExhibitions.findIndex(
    e => e.slug?.trim().toLowerCase() === exhibition.slug?.trim().toLowerCase(),
  )

  const pageUrl = localizedAbsoluteUrl(getSiteUrl(), locale, exhibitionDetailHref(params.slug))
  const imageUrl = getImageUrl(exhibition.image?.url || '')

  return (
    <div className="container padding-y">
      <StructuredData
        locale={locale}
        includeBaseSchemas={false}
        type="event"
        pageTitle={exhibition.title}
        pageDescription={exhibition.meta?.description || undefined}
        pageUrl={pageUrl}
        pageImage={imageUrl || undefined}
        eventStartDate={exhibition.dateBegin || undefined}
        eventEndDate={exhibition.dateEnd || undefined}
      />
      <StructuredData
        locale={locale}
        includeBaseSchemas={false}
        type="breadcrumb"
        breadcrumbs={[
          {
            name: locale === 'de' ? 'Ausstellungen' : 'Exhibitions',
            url: localizedAbsoluteUrl(getSiteUrl(), locale, '/exhibitions'),
          },
          { name: exhibition.title, url: pageUrl },
        ]}
      />
      <ExhibitionDetails
        exhibition={exhibition}
        locale={locale}
        allExhibitions={allExhibitions}
        currentExhibitionIndex={currentExhibitionIndex}
      />
    </div>
  )
}
