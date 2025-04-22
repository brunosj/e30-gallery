import type { NewsletterPage } from '@/app/payload-types'

import NewsletterEmbed from '@/components/NewsletterEmbed'
import { RichText } from '@/components/RichText'
import { parseKeywords } from '@/utilities/parseKeywords'
import { Metadata } from 'next'
type Params = Promise<{ locale: string }>

async function getData(locale: string) {
  const urls = [
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/newsletter-page?locale=${locale}&depth=1`,
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

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const { pageData } = await getData(locale)
  const metadata = pageData.docs[0].meta
  return {
    title: pageData.docs[0].title,
    description: metadata.description,
    keywords: parseKeywords(metadata.keywords),
    openGraph: {
      title: metadata.title,
      description: metadata.description,
    },
  }
}

export default async function Newsletter({ params }: { params: Params }) {
  const { locale } = await params
  const { pageData } = await getData(locale)
  const page: NewsletterPage = pageData.docs[0]

  return (
    <article>
      <div className="container padding-y">
        <RichText content={page.text} />
        <div className="padding-y">
          <NewsletterEmbed code={page.newsletter || ''} />
        </div>
      </div>
    </article>
  )
}
