import type { Homepage, Exhibition } from '@/app/payload-types'
import type { Layout } from '@/app/_components/Blocks/RenderBlocks'
import { cache } from 'react'

import RenderBlocks from '@/components/Blocks/RenderBlocks'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { HeroExhibition } from '@/components/HeroExhibition'
import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import ArtistsListings from '@/components/ArtistsListings'
import { buildPageMetadata } from '@/app/_utilities/generatePageMetadata'
import { fetchSingleton } from '@/app/_utilities/fetchPayload'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NewsletterPopup from '@/components/NewsletterPopup'

type Params = Promise<{ locale: string }>

const getData = cache(async (locale: string) => {
  const pageData = await fetchSingleton<Homepage>('homepage', { locale, depth: 2 })
  if (!pageData?.docs?.length) {
    notFound()
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
    href: '/',
    title: doc.title ?? '',
    description: metadata?.description,
    keywords: metadata?.keywords,
  })
}

export default async function Home({ params }: { params: Params }) {
  const { locale } = await params
  setRequestLocale(locale)

  const { pageData } = await getData(locale)
  const page: Homepage = pageData.docs[0]
  const featuredExhibitions: Exhibition[] = page.featuredExhibitions.filter(
    item => typeof item !== 'string',
  )

  return (
    <article>
      <HeroExhibition data={featuredExhibitions} />
      <RenderBlocks layout={page.layout as Layout[]} />
      {page.Banners?.reachOutBoolean && <BannerReachOut />}
      <ArtistsListings />
      {page.Banners?.newsletterBoolean && <BannerNewsletter />}
      {page.Banners?.newsletterPopupBoolean && (
        <NewsletterPopup triggerOnScroll={true} scrollPercentage={30} />
      )}
    </article>
  )
}
