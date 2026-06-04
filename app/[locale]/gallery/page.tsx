import type { GalleryPage } from '@/app/payload-types'
import { cache } from 'react'
import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import { GalleryHero } from '@/app/_components/GalleryHero'
import { GalleryFounders } from '@/components/GalleryFounders'
import { GalleryVision } from '@/components/GalleryVision'
import { GalleryCTA } from '@/components/GalleryCTA'
import { buildPageMetadata } from '@/app/_utilities/generatePageMetadata'
import { fetchSingleton } from '@/app/_utilities/fetchPayload'
import type { Metadata } from 'next'
import NewsletterPopup from '@/components/NewsletterPopup'

type Params = Promise<{ locale: string }>

const getData = cache(async (locale: string) => {
  const pageData = await fetchSingleton<GalleryPage>('gallery-page', { locale, depth: 2 })
  if (!pageData?.docs?.length) {
    throw new Error('Failed to fetch gallery page')
  }
  return { pageData }
})

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const { pageData } = await getData(locale)
  const doc = pageData.docs[0]
  const metadata = doc.meta
  return buildPageMetadata({
    locale,
    href: '/gallery',
    title: doc.title ?? '',
    description: metadata?.description,
    keywords: metadata?.keywords,
  })
}

export default async function GalleryPage({ params }: { params: Params }) {
  const { locale } = await params
  const { pageData } = await getData(locale)
  const page: GalleryPage = pageData.docs[0]

  return (
    <article>
      <GalleryHero data={page} />
      <GalleryFounders data={page} />
      <GalleryVision data={page} />
      <GalleryCTA data={page} />
      {page.Banners?.reachOutBoolean && <BannerReachOut />}
      {page.Banners?.newsletterBoolean && <BannerNewsletter />}
      {page.Banners?.newsletterPopupBoolean && (
        <NewsletterPopup triggerOnScroll={true} scrollPercentage={30} />
      )}
    </article>
  )
}
