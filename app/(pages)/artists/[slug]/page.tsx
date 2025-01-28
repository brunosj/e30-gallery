import type { Artist, Media } from '@/app/payload-types'

import { languageTag } from '@/paraglide/runtime'
import { notFound } from 'next/navigation'
import ArtistPageClient from '@/components/ArtistPageClient'
import { parseKeywords } from '@/utilities/parseKeywords'

async function getData(locale: string, slug: string) {
  const urls = [
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/artist?where[slug][equals]=${slug}&locale=${locale}&depth=2`,
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
    return { pageData }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata(props: { params: Params; searchParams: SearchParams }) {
  const params = await props.params
  const searchParams = await props.searchParams
  const locale = languageTag()
  const { pageData } = await getData(locale, params.slug)
  if (!pageData || !pageData.docs.length) {
    return {
      title: '404 - Not Found',
      description: 'Page not found',
      openGraph: {
        title: '404 - Not Found',
      },
    }
  }

  const artist: Artist = pageData.docs[0]
  return {
    title: artist.meta?.title || artist.full_name,
    description: artist.meta?.description || artist.additional_info,
    keywords: [parseKeywords(artist.meta?.keywords || '')],
    openGraph: {
      title: artist.meta?.title || artist.full_name,
      description: artist.meta?.description || artist.additional_info,
      images: [
        {
          url:
            typeof artist.relation.artworks !== 'string'
              ? (artist.relation.artworks as Media).url
              : '',
          alt: artist.full_name,
        },
      ],
    },
  }
}

export default async function ArtistPage(props: { params: Params; searchParams: SearchParams }) {
  const params = await props.params
  const searchParams = await props.searchParams
  const locale = languageTag()
  const { pageData } = await getData(locale, params.slug)

  if (!pageData || !pageData.docs.length) {
    return notFound()
  }

  const artist: Artist = pageData.docs[0]

  return (
    <div>
      <ArtistPageClient artist={artist} locale={locale} />
    </div>
  )
}
