import type { GenericPage, Artist, Artwork } from '@/app/payload-types'
import { notFound } from 'next/navigation'
import { languageTag } from '@/paraglide/runtime'
import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import { RichText } from '@/components/RichText'
import classes from './index.module.css'
import { parseKeywords } from '@/utilities/parseKeywords'
import { Metadata } from 'next'

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

export default async function GenericPage(props: { params: Params; searchParams: SearchParams }) {
  const params = await props.params
  const searchParams = await props.searchParams
  const locale = languageTag()
  const { pageData } = await getData(locale, params.slug)

  if (!pageData || !pageData.docs.length) {
    return notFound()
  }

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
