import type { BlogPage, Blogpost } from '@/app/payload-types'
import { cache } from 'react'
import type { Metadata } from 'next'
import BlogPageClient from './client'
import NewsletterPopup from '@/components/NewsletterPopup'
import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import { buildPageMetadata } from '@/app/_utilities/generatePageMetadata'
import { fetchList, fetchSingleton } from '@/app/_utilities/fetchPayload'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

type Params = Promise<{ locale: string }>

const getData = cache(async (locale: string) => {
  const [pageData, blogPosts] = await Promise.all([
    fetchSingleton<BlogPage>('blog-page', { locale, depth: 2 }),
    fetchList<Blogpost>('blogpost', { locale, depth: 2, limit: 0 }),
  ])

  if (!pageData?.docs?.length) {
    notFound()
  }

  return { pageData, blogPosts }
})

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const { pageData } = await getData(locale)
  const doc = pageData.docs[0]
  const metadata = doc.meta
  return buildPageMetadata({
    locale,
    href: '/insights',
    title: doc.title ?? '',
    description: metadata?.description,
    keywords: metadata?.keywords,
  })
}

export default async function BlogPage({ params }: { params: Params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const { pageData, blogPosts } = await getData(locale)
  const page = pageData.docs[0]

  return (
    <article>
      <BlogPageClient pageData={pageData} blogPosts={blogPosts} />
      {page.Banners?.reachOutBoolean && <BannerReachOut />}
      {page.Banners?.newsletterBoolean && <BannerNewsletter />}
      {page.Banners?.newsletterPopupBoolean && (
        <NewsletterPopup triggerOnScroll={true} scrollPercentage={30} />
      )}
    </article>
  )
}
