import { ReactNode } from 'react'
import type { ArtistsPage, Artist, Artwork } from '@/app/payload-types'
import { setRequestLocale } from 'next-intl/server'
import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import { ArtistPageHero } from '@/components/ArtistPageHero'
import { parseKeywords } from '@/utilities/parseKeywords'
import { Metadata } from 'next'
type Params = Promise<{ locale: string }>

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

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params

  const { pageData } = await getData(locale)
  const metadata = pageData.docs[0].meta
  return {
    title: pageData.docs[0].title,
    // // keywords: parseKeywords(metadata.keywords),
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
    },
  }
}

export default async function ArtistsLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Params
}) {
  const { locale } = await params

  // Set locale for static rendering
  setRequestLocale(locale)

  const { pageData, artistData } = await getData(locale)
  const page: ArtistsPage = pageData.docs[0]

  return (
    <article>
      {children}
      {page.Banners?.reachOutBoolean && <BannerReachOut />}
      {page.Banners?.newsletterBoolean && <BannerNewsletter />}
    </article>
  )
}
