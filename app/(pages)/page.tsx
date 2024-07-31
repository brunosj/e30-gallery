import type { Homepage, Exhibition } from '@/app/payload-types'
import type { Layout } from '@/components/RenderBlocks'

import RenderBlocks from '@/components/RenderBlocks'
import { languageTag } from '@/paraglide/runtime'
import { HeroExhibition } from '@/components/HeroExhibition'
import BannerReachOut from '@/components/BannerReachOut'
import ArtistsListings from '@/components/ArtistsListings'

async function getData(locale: string) {
  const urls = [
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/homepage?locale=${locale}&depth=1`,
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/exhibition?locale=${locale}&depth=1`,
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
    const exhibitionData = data[1]
    return { pageData, exhibitionData }
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

export default async function Home() {
  const locale = languageTag()
  const { pageData, exhibitionData } = await getData(locale)
  const page: Homepage = pageData.docs[0]
  const exhibitions: Exhibition[] = exhibitionData.docs
  const latestExhibition = exhibitions
    .map(exhibition => ({
      ...exhibition,
      dateEndParsed: new Date(exhibition.dateEnd ?? '').getTime(),
    }))
    .sort((a, b) => b.dateEndParsed - a.dateEndParsed)[0]
  return (
    <article>
      <HeroExhibition data={latestExhibition} />
      <RenderBlocks layout={page.layout as Layout[]} />
      {page.Banners?.reachOutBoolean && <BannerReachOut />}
      <ArtistsListings />
    </article>
  )
}
