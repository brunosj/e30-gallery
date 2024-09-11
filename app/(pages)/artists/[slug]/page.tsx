import type { Artist } from '@/app/payload-types'

import { languageTag } from '@/paraglide/runtime'
import { notFound } from 'next/navigation'
import ArtistPageClient from '@/components/ArtistPageClient'

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

export async function generateMetadata({ params }: { params: { slug: string } }) {
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
    title: artist.full_name,
    description: artist.additional_info,
    openGraph: {
      title: artist.full_name,
      description: artist.additional_info,
      images: [
        {
          url:
            typeof artist.relation.artworks !== 'string' ? artist.relation.artworks.image.url : '',
          alt: artist.full_name,
        },
      ],
    },
  }
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
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
