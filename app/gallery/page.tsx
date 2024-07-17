import type { GalleryPage } from '@/app/payload-types'

import { languageTag } from '@/paraglide/runtime'
import BannerReachOut from '@/components/BannerReachOut'
import { GalleryHero } from '@/app/_components/GalleryHero'
import { GalleryFounders } from '@/components/GalleryFounders'
import { GalleryVision } from '@/components/GalleryVision'
import { GalleryCTA } from '@/components/GalleryCTA'

async function getData(locale: string) {
  const urls = [`${process.env.PAYLOAD_URL}/api/gallery-page?locale=${locale}&depth=2`]

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
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
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
      {page.Banners?.reachOutBoolean && <BannerReachOut />}
    </article>
  )
}
