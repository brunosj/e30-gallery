import type { ExhibitionsPage, Exhibition } from '@/app/payload-types'
import { cache } from 'react'
import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import NewsletterPopup from '@/components/NewsletterPopup'
import ExhibitionsPageData from '@/components/ExhibitionsPage'
import { buildPageMetadata } from '@/app/_utilities/generatePageMetadata'
import { fetchList, fetchSingleton } from '@/app/_utilities/fetchPayload'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Params = Promise<{ locale: string }>

const getData = cache(async (locale: string) => {
  const [pageData, exhibitionData] = await Promise.all([
    fetchSingleton<ExhibitionsPage>('exhibitions-page', { locale, depth: 3 }),
    fetchList<Exhibition>('exhibition', { locale, depth: 3, limit: 0 }),
  ])

  if (!pageData?.docs?.length) {
    notFound()
  }

  return { pageData, exhibitionData }
})

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const { pageData } = await getData(locale)
  const doc = pageData.docs[0]
  const metadata = doc.meta
  return buildPageMetadata({
    locale,
    href: '/exhibitions',
    title: doc.title ?? '',
    description: metadata?.description,
    keywords: metadata?.keywords,
  })
}

function featuredExhibitionId(item: string | Exhibition): string {
  return typeof item === 'string' ? item : item.id
}

export default async function Exhibitions({ params }: { params: Params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const { pageData, exhibitionData } = await getData(locale)
  const page: ExhibitionsPage = pageData.docs[0]
  const exhibitions: Exhibition[] = exhibitionData?.docs ?? []
  const exhibitionsById = new Map(exhibitions.map(exhibition => [exhibition.id, exhibition]))
  // Resolve featured from the exhibition list (cms:exhibition), not nested
  // exhibitions-page payloads which can stay stale after an exhibition publish.
  const featuredExhibitions: Exhibition[] = (page.featuredExhibitions ?? [])
    .map(featuredExhibitionId)
    .map(id => exhibitionsById.get(id))
    .filter((exhibition): exhibition is Exhibition => exhibition != null)

  return (
    <article>
      <ExhibitionsPageData data={exhibitions} featuredExhibitions={featuredExhibitions} />
      {page.Banners?.reachOutBoolean && <BannerReachOut />}
      {page.Banners?.newsletterBoolean && <BannerNewsletter />}
      {page.Banners?.newsletterPopupBoolean && (
        <NewsletterPopup triggerOnScroll={true} scrollPercentage={30} />
      )}
    </article>
  )
}
