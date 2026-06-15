import type { NewsletterPage } from '@/app/payload-types'
import { cache } from 'react'
import { NewsletterHero } from '@/components/NewsletterHero'
import { buildPageMetadata } from '@/app/_utilities/generatePageMetadata'
import { fetchSingleton } from '@/app/_utilities/fetchPayload'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Params = Promise<{ locale: string }>

const getData = cache(async (locale: string) => {
  const pageData = await fetchSingleton<NewsletterPage>('newsletter-page', { locale, depth: 1 })
  if (!pageData?.docs?.length) {
    notFound()
  }
  return { pageData }
})

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const { pageData } = await getData(locale)
  const doc = pageData.docs[0]
  const metadata = doc.meta
  return buildPageMetadata({
    locale,
    href: '/newsletter',
    title: doc.title ?? '',
    description: metadata?.description,
    keywords: metadata?.keywords,
  })
}

export default async function Newsletter({ params }: { params: Params }) {
  const { locale } = await params
  const { pageData } = await getData(locale)
  const page: NewsletterPage = pageData.docs[0]

  return (
    <article>
      <NewsletterHero data={page} />
    </article>
  )
}
