import type { ExhibitionsPage, Exhibition } from '@/app/payload-types'
import { cache } from 'react'
import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import NewsletterPopup from '@/components/NewsletterPopup'
import ExhibitionsPageData from '@/components/ExhibitionsPage'
import { buildPageMetadata } from '@/app/_utilities/generatePageMetadata'
import { fetchList, fetchSingleton } from '@/app/_utilities/fetchPayload'
import type { Metadata } from 'next'

type Params = Promise<{ locale: string }>

const getData = cache(async (locale: string) => {
  const [pageData, exhibitionData] = await Promise.all([
    fetchSingleton<ExhibitionsPage>('exhibitions-page', { locale, depth: 3 }),
    fetchList<Exhibition>('exhibition', { locale, depth: 3, limit: 0 }),
  ])

  if (!pageData?.docs?.length || !exhibitionData?.docs) {
    throw new Error('Failed to fetch exhibitions page data')
  }

  return { pageData, exhibitionData }
})

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
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

export default async function Exhibitions({ params }: { params: Params }) {
  const { locale } = await params
  const { pageData, exhibitionData } = await getData(locale)
  const page: ExhibitionsPage = pageData.docs[0]
  const featuredExhibitions: Exhibition[] = page.featuredExhibitions?.filter(
    item => typeof item !== 'string',
  )
  const exhibitions: Exhibition[] = exhibitionData.docs

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
