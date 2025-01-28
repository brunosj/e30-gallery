import type { Homepage, Exhibition } from '@/app/payload-types'
import type { Layout } from '@/app/_components/Blocks/RenderBlocks'

import RenderBlocks from '@/components/Blocks/RenderBlocks'
import { languageTag } from '@/paraglide/runtime'
import { HeroExhibition } from '@/components/HeroExhibition'
import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import ArtistsListings from '@/components/ArtistsListings'
import { parseKeywords } from '@/utilities/parseKeywords'
import { Suspense } from 'react'

async function getData(locale: string) {
  const urls = [`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/homepage?locale=${locale}&depth=2`]

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
    title: pageData.docs[0].title,
    description: metadata.description,
    keywords: [parseKeywords(metadata.keywords)],
    openGraph: {
      title: metadata.title,
      description: metadata.description,
    },
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const locale = languageTag()
  const resolvedSearchParams = await searchParams
  const { pageData } = await getData(locale)
  const page: Homepage = pageData.docs[0]
  const featuredExhibitions: Exhibition[] = page.featuredExhibitions.filter(
    item => typeof item !== 'string',
  )
  return (
    <article>
      <HeroExhibition data={featuredExhibitions} />
      <RenderBlocks layout={page.layout as Layout[]} />
      {page.Banners?.reachOutBoolean && (
        <Suspense fallback={null}>
          <BannerReachOut />
        </Suspense>
      )}
      <Suspense fallback={null}>
        <ArtistsListings />
      </Suspense>
      {page.Banners?.newsletterBoolean && (
        <Suspense fallback={null}>
          <BannerNewsletter />
        </Suspense>
      )}
    </article>
  )
}
