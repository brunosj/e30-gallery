import type { Artist, Media } from '@/app/payload-types'

import { notFound } from 'next/navigation'
import ArtistPageClient from '@/components/ArtistPageClient'
import { parseKeywords } from '@/utilities/parseKeywords'
import { Metadata } from 'next'
type Params = Promise<{ locale: string; slug: string }>

async function getData(locale: string, slug: string) {
  const urls = [
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/artist?where[slug][equals]=${slug}&locale=${locale}&depth=2`,
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
    const artistData = data[0]
    const allArtistsData = data[1]

    // Sort artists by last name for consistent navigation
    const allArtists = allArtistsData.docs.sort((a: Artist, b: Artist) => {
      const getLastName = (name: string): string => {
        const parts = name.split(' ')
        return parts.length > 1 ? parts[parts.length - 1] : name
      }

      const lastNameA = getLastName(a.full_name)
      const lastNameB = getLastName(b.full_name)

      return lastNameA.localeCompare(lastNameB)
    })

    return { artistData, allArtists }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  const { artistData } = await getData(locale, slug)
  if (!artistData || !artistData.docs.length) {
    return {
      title: '404 - Not Found',
      description: 'Page not found',
      openGraph: {
        title: '404 - Not Found',
      },
    }
  }

  const artist: Artist = artistData.docs[0]
  return {
    title: artist.meta?.title || artist.full_name,
    description: artist.meta?.description || artist.additional_info,
    keywords: parseKeywords(artist.meta?.keywords || ''),
    openGraph: {
      title: artist.meta?.title || artist.full_name,
      description: artist.meta?.description || artist.additional_info,
      images: [
        {
          url:
            typeof artist.relation.artworks !== 'string'
              ? (artist.relation.artworks as Media).url || ''
              : '',
          alt: artist.full_name,
        },
      ],
    },
  }
}

export default async function ArtistPage(props: { params: Params }) {
  const params = await props.params
  const { locale } = params
  const { artistData, allArtists } = await getData(locale, params.slug)

  if (!artistData || !artistData.docs.length) {
    return notFound()
  }

  const artist: Artist = artistData.docs[0]

  // Find current artist index among all artists
  const currentArtistIndex = allArtists.findIndex(
    (a: Artist) => a.slug?.trim().toLowerCase() === artist.slug?.trim().toLowerCase(),
  )

  return (
    <div className="container padding-y">
      <ArtistPageClient
        artist={artist}
        locale={locale}
        allArtists={allArtists}
        currentArtistIndex={currentArtistIndex}
      />
    </div>
  )
}
