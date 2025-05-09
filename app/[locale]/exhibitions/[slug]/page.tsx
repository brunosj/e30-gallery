import type { Exhibition } from '@/app/payload-types'

import { notFound } from 'next/navigation'
import { parseKeywords } from '@/utilities/parseKeywords'
import { Metadata } from 'next'
import ExhibitionDetails from '@/app/_components/ExhibitionDetails'
import { getImageUrl } from '@/app/_utilities/getImageUrl'
type Params = Promise<{ locale: string; slug: string }>

async function getData(locale: string, slug: string) {
  const urls = [
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/exhibition?where[slug][equals]=${slug}&locale=${locale}&depth=3`,
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/exhibition?locale=${locale}&depth=3&limit=0`,
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
    const exhibitionData = data[0]
    const allExhibitionsData = data[1]

    // Sort exhibitions by end date, newest first
    const allExhibitions = allExhibitionsData.docs.sort((a: Exhibition, b: Exhibition) => {
      const dateA = new Date(a.dateEnd || '').getTime()
      const dateB = new Date(b.dateEnd || '').getTime()
      return dateB - dateA
    })

    return { exhibitionData, allExhibitions }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  const { exhibitionData } = await getData(locale, slug)
  if (!exhibitionData || !exhibitionData.docs.length) {
    return {
      title: '404 - Not Found',
      description: 'Page not found',
      openGraph: {
        title: '404 - Not Found',
      },
    }
  }

  const exhibition: Exhibition = exhibitionData.docs[0]
  return {
    title: exhibition.meta?.title || exhibition.title,
    description: exhibition.meta?.description || '',
    keywords: parseKeywords(exhibition.meta?.keywords || ''),
    openGraph: {
      title: exhibition.meta?.title || exhibition.title,
      description: exhibition.meta?.description || '',
      images: [
        {
          url: getImageUrl(exhibition.image?.url || ''),
          alt: exhibition.title,
        },
      ],
    },
  }
}

export default async function ExhibitionPage(props: { params: Params }) {
  const params = await props.params
  const { locale } = params
  const { exhibitionData, allExhibitions } = await getData(locale, params.slug)

  if (!exhibitionData || !exhibitionData.docs.length) {
    return notFound()
  }

  // The API returns the slug property even though it's not in the TypeScript interface
  const exhibition = exhibitionData.docs[0] as Exhibition

  // Find current exhibition index among all exhibitions
  const currentExhibitionIndex = allExhibitions.findIndex(
    (e: any) => e.slug?.trim().toLowerCase() === exhibition.slug?.trim().toLowerCase(),
  )

  return (
    <div className="container padding-y">
      <ExhibitionDetails
        exhibition={exhibition}
        locale={locale}
        allExhibitions={allExhibitions as Exhibition[]}
        currentExhibitionIndex={currentExhibitionIndex}
      />
    </div>
  )
}
