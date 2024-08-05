import type { NewsletterPage } from '@/app/payload-types'

import { languageTag } from '@/paraglide/runtime'
import NewsletterEmbed from '@/components/NewsletterEmbed'

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

export default async function Newsletter() {
  const locale = languageTag()
  const { pageData } = await getData(locale)
  const page: NewsletterPage = pageData.docs[0]

  return (
    <article>
      <div className="container padding-y">
        <h1>{page.title}</h1>
        <NewsletterEmbed data={page} />
      </div>
    </article>
  )
}
