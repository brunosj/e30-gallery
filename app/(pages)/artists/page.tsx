import type { ArtistsPage, Artist, Artwork } from '@/app/payload-types'
import { languageTag } from '@/paraglide/runtime'
import ArtistDetailsV2 from '@/components/ArtistDetails'
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
    description: metadata.description,
    keywords: [parseKeywords(metadata.keywords)],
    openGraph: {
      title: metadata.title,
      description: metadata.description,
    },
  }
}

export default async function ArtistsPage() {
  const locale = languageTag()
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
    <section className="">
      <ArtistDetailsV2 artists={artists} featuredArtwork={featuredArtwork} />
    </section>
  )
}
