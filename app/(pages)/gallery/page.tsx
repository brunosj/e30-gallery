import type { GalleryPage } from '@/app/payload-types'
import { Suspense } from 'react'
import { languageTag } from '@/paraglide/runtime'
import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import { GalleryHero } from '@/app/_components/GalleryHero'
import { GalleryFounders } from '@/components/GalleryFounders'
import { GalleryVision } from '@/components/GalleryVision'
import { GalleryCTA } from '@/components/GalleryCTA'
import { parseKeywords } from '@/utilities/parseKeywords'

async function getData(locale: string) {
  const urls = [`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/gallery-page?locale=${locale}&depth=2`]

  const fetchPromises = urls.map(url =>
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
      },
    }),
  )

  try {
    const responses = await Promise.all(fetchPromises)
    const data = await Promise.all(responses.map(res => res.json()))
    const pageData = data[0]
    return { pageData }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export async function generateMetadata() {
  const locale = languageTag()
  const { pageData } = await getData(locale)
  const metadata = pageData.docs[0].meta
  return {
    title: pageData.docs[0].title,
    description: metadata.description,
    keywords: [parseKeywords(metadata.keywords)],
    openGraph: {
      title: metadata.title,
      description: metadata.description,
    },
  }
}

export default async function GalleryPage() {
  const locale = languageTag()
  const { pageData } = await getData(locale)
  const page: GalleryPage = pageData.docs[0]

  return (
    <article>
      <GalleryHero data={page} />
      <GalleryFounders data={page} />
      <GalleryVision data={page} />
      <GalleryCTA data={page} />
      {page.Banners?.reachOutBoolean && (
        <Suspense fallback={null}>
          <BannerReachOut />
        </Suspense>
      )}
      {page.Banners?.newsletterBoolean && (
        <Suspense fallback={null}>
          <BannerNewsletter />
        </Suspense>
      )}
    </article>
  )
}
