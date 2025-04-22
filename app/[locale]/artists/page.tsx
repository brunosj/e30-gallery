import type { ArtistsPage, Artist, Artwork } from '@/app/payload-types'
import ArtistDetailsV2 from '@/components/ArtistDetails'
import { parseKeywords } from '@/utilities/parseKeywords'
import { ArtistPageHero } from '@/app/_components/ArtistPageHero'

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
    description: metadata.description,
    keywords: parseKeywords(metadata.keywords),
    openGraph: {
      title: metadata.title,
      description: metadata.description,
    },
  }
}

export default async function ArtistsPage({ params }: { params: Params }) {
  const { locale } = await params
  const { pageData, artistData } = await getData(locale)
  const page: ArtistsPage = pageData.docs[0]

  const artists: Artist[] = artistData.docs.sort((a: Artist, b: Artist) => {
    const getLastName = (name: string): string => {
      const parts = name.split(' ')
      return parts.length > 1 ? parts[parts.length - 1] : name
    }

    const lastNameA = getLastName(a.full_name)
    const lastNameB = getLastName(b.full_name)

    return lastNameA.localeCompare(lastNameB)
  })
  const featuredArtwork = page.featuredArtwork as Artwork
  return (
    <div className="container padding-y">
      <ArtistPageHero data={page} />
      <ArtistDetailsV2 artists={artists} featuredArtwork={featuredArtwork} />
    </div>
  )
}
