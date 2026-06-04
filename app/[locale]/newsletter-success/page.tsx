import type { NewsletterPage } from '@/app/payload-types'
import { cache } from 'react'
import { RichText } from '@/components/RichText'
import cn from 'classnames'
import classes from './index.module.css'
import { buildPageMetadata } from '@/app/_utilities/generatePageMetadata'
import { fetchSingleton } from '@/app/_utilities/fetchPayload'
import type { Metadata } from 'next'

type Params = Promise<{ locale: string }>

const getData = cache(async (locale: string) => {
  const pageData = await fetchSingleton<NewsletterPage>('newsletter-page', { locale, depth: 1 })
  if (!pageData?.docs?.length) {
    throw new Error('Failed to fetch newsletter page')
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
    href: '/newsletter-success',
    title: doc.title ?? '',
    description: metadata?.description,
    noIndex: true,
  })
}

export default async function NewsletterSuccess({ params }: { params: Params }) {
  const { locale } = await params
  const { pageData } = await getData(locale)
  const page: NewsletterPage = pageData.docs[0]

  return (
    <article>
      <div className={cn(classes.success, 'container padding-y')}>
        <RichText content={page.success_message} />
      </div>
    </article>
  )
}
