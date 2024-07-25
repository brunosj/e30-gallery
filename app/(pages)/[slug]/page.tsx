import type { GenericPage, Artist, Artwork } from '@/app/payload-types'
import { languageTag } from '@/paraglide/runtime'
import BannerReachOut from '@/components/BannerReachOut'
import ArtistDetails from '@/components/ArtistDetails'
import { RichText } from '@/components/RichText'
import classes from './index.module.css'

async function getData(locale: string, slug: string) {
  const urls = [
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/generic-pages?where[slug][equals]=${slug}&locale=${locale}&depth=1`,
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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const locale = languageTag()
  const { pageData } = await getData(locale, params.slug)
  const metadata = pageData.docs[0].meta
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
    },
  }
}

export default async function GenericPage({ params }: { params: { slug: string } }) {
  const locale = languageTag()
  const { pageData } = await getData(locale, params.slug)
  const page: GenericPage = pageData.docs[0]

  return (
    <article className={classes.page}>
      <div className="container padding-y">
        <div className={classes.text}>
          <h2 className="padding-b">{page.title}</h2>
          <RichText content={page.text} />
        </div>
      </div>
    </article>
  )
}
