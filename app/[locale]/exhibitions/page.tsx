import type { ExhibitionsPage, Exhibition } from '@/app/payload-types'

import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import ExhibitionsPageData from '@/components/ExhibitionsPage'
import { parseKeywords } from '@/utilities/parseKeywords'
import classes from './index.module.css'
import { Metadata } from 'next'
type Params = Promise<{ locale: string }>

async function getData(locale: string) {
  const urls = [
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/exhibitions-page?locale=${locale}&depth=3`,
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
    const pageData = data[0]
    const exhibitionData = data[1]
    return { pageData, exhibitionData }
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
    // // keywords: parseKeywords(metadata.keywords),
    openGraph: {
      title: metadata.title,
      description: metadata.description,
    },
  }
}

export default async function Exhibitions({ params }: { params: Params }) {
  const { locale } = await params

  const { pageData, exhibitionData } = await getData(locale)
  const page: ExhibitionsPage = pageData.docs[0]
  const featuredExhibitions: Exhibition[] = page.featuredExhibitions?.filter(
    item => typeof item !== 'string',
  )
  const exhibitions: Exhibition[] = exhibitionData.docs

  return (
    <article>
      <ExhibitionsPageData data={exhibitions} featuredExhibitions={featuredExhibitions} />
      {page.Banners?.reachOutBoolean && <BannerReachOut />}
      {page.Banners?.newsletterBoolean && <BannerNewsletter />}
    </article>
  )
}
