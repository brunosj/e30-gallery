import type { GenericPage, Artist, Artwork } from '@/app/payload-types'
import { notFound } from 'next/navigation'
import { parseKeywords } from '@/utilities/parseKeywords'
import { Metadata } from 'next'
import GenericPageClient from '@/app/_components/GenericPageClient'

type Params = Promise<{ locale: string; slug: string }>

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

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  const { pageData } = await getData(locale, slug)

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

export default async function GenericPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  const { pageData } = await getData(locale, slug)

  if (!pageData || !pageData.docs.length) {
    return notFound()
  }

  const page: GenericPage = pageData.docs[0]

  return <GenericPageClient page={page} />
}
