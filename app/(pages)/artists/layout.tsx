import { ReactNode, Suspense } from 'react'
import type { ArtistsPage, Artist, Artwork } from '@/app/payload-types'
import { languageTag } from '@/paraglide/runtime'
import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import { ArtistPageHero } from '@/components/ArtistPageHero'
import { parseKeywords } from '@/utilities/parseKeywords'

async function getData(locale: string) {
  const urls = [
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/artists-page?locale=${locale}&depth=2`,
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/artist?locale=${locale}&depth=2&limit=0`,
  ]

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
    const artistData = data[1]
    return { pageData, artistData }
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
    keywords: [parseKeywords(metadata.keywords)],
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
    },
  }
}

export default async function ArtistsLayout({ children }: { children: ReactNode }) {
  const locale = languageTag()
  const { pageData, artistData } = await getData(locale)
  const page: ArtistsPage = pageData.docs[0]

  return (
    <article>
      <div className="container padding-y">
        <ArtistPageHero data={page} />
        {children}
      </div>
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
