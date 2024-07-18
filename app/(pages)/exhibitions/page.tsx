import type { ExhibitionsPage, Exhibition } from '@/app/payload-types'

import { languageTag } from '@/paraglide/runtime'
import BannerReachOut from '@/components/BannerReachOut'
import { LatestExhibition } from '@/components/LatestExhibition'
import { ExhibitionCard } from '@/components/ExhibitionCard'
import classes from './index.module.css'

async function getData(locale: string) {
  const urls = [
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/exhibitions-page?locale=${locale}&depth=1`,
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

export default async function ExhibitionsPage() {
  const locale = languageTag()
  const { pageData, exhibitionData } = await getData(locale)
  const page: ExhibitionsPage = pageData.docs[0]
  const exhibitions: Exhibition[] = exhibitionData.docs
  const latestExhibition = exhibitions
    .map(exhibition => ({
      ...exhibition,
      dateEndParsed: new Date(exhibition.dateEnd ?? '').getTime(),
    }))
    .sort((a, b) => b.dateEndParsed - a.dateEndParsed)[0]
  const otherExhibitions = exhibitions.slice(1)

  return (
    <article>
      <LatestExhibition data={latestExhibition} />
      <div className="container padding-y">
        <div className={classes.exhibitions}>
          {otherExhibitions.map(exhibition => (
            <ExhibitionCard key={exhibition.id} data={exhibition} />
          ))}
        </div>
      </div>
      {page.Banners?.reachOutBoolean && <BannerReachOut />}
    </article>
  )
}
