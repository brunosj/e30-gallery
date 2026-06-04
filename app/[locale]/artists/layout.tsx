import { ReactNode } from 'react'
import type { ArtistsPage } from '@/app/payload-types'
import { cache } from 'react'
import { setRequestLocale } from 'next-intl/server'
import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import { buildPageMetadata } from '@/app/_utilities/generatePageMetadata'
import NewsletterPopup from '@/components/NewsletterPopup'
import { fetchSingleton } from '@/app/_utilities/fetchPayload'

import type { Metadata } from 'next'
type Params = Promise<{ locale: string }>

const getArtistsPageData = cache(async (locale: string) => {
  const pageData = await fetchSingleton<ArtistsPage>('artists-page', { locale, depth: 2 })
  if (!pageData?.docs?.length) {
    throw new Error('Failed to fetch artists page')
  }
  return pageData.docs[0]
})

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const doc = await getArtistsPageData(locale)
  const metadata = doc.meta
  return buildPageMetadata({
    locale,
    href: '/artists',
    title: doc.title ?? '',
    description: metadata?.description,
    keywords: metadata?.keywords,
  })
}

export default async function ArtistsLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Params
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const page = await getArtistsPageData(locale)

  return (
    <article>
      {children}
      {page.Banners?.reachOutBoolean && <BannerReachOut />}
      {page.Banners?.newsletterBoolean && <BannerNewsletter />}
      {page.Banners?.newsletterPopupBoolean && (
        <NewsletterPopup triggerOnScroll={true} scrollPercentage={30} />
      )}
    </article>
  )
}
