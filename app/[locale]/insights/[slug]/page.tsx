import type { Blogpost } from '@/app/payload-types'
import { cache } from 'react'
import { getBlogPostFeaturedImageUrl } from '@/app/_utilities/getBlogPostFeaturedImage'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'
import {
  buildNotFoundMetadata,
  buildPageMetadata,
} from '@/app/_utilities/generatePageMetadata'
import { getImageUrl } from '@/app/_utilities/getImageUrl'
import {
  insightDetailHref,
  localizedAbsoluteUrl,
} from '@/app/_utilities/localizedUrl'
import { getSiteUrl } from '@/app/_utilities/siteUrl'
import { StructuredData } from '@/app/_components/StructuredData'
import classes from './index.module.css'
import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import { fetchDocBySlug } from '@/app/_utilities/fetchPayload'
import { generateLocaleSlugParams } from '@/app/_utilities/staticParams'
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

export const dynamicParams = true

export async function generateStaticParams() {
  return generateLocaleSlugParams('blogpost')
}

type Params = Promise<{ locale: string; slug: string }>

const getData = cache(async (locale: string, slug: string) => {
  const pageData = await fetchDocBySlug<Blogpost>('blogpost', { locale, slug, depth: 2 })
  if (!pageData) {
    throw new Error('Failed to fetch blog post')
  }
  return { pageData }
})

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const { pageData } = await getData(locale, slug)
  if (!pageData?.docs.length) {
    return buildNotFoundMetadata()
  }

  const blogPost: Blogpost = pageData.docs[0]
  const mediaUrl = getBlogPostFeaturedImageUrl(blogPost)

  return buildPageMetadata({
    locale,
    href: insightDetailHref(slug),
    title: blogPost.meta?.title || blogPost.title || 'Insight',
    description: blogPost.meta?.description || blogPost.summary,
    keywords: blogPost.meta?.keywords,
    ogType: 'article',
    publishedTime: blogPost.createdAt,
    modifiedTime: blogPost.updatedAt,
    ogImage: mediaUrl
      ? { url: getImageUrl(mediaUrl), alt: blogPost.title || '' }
      : null,
  })
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const { pageData } = await getData(locale, slug)

  if (!pageData?.docs.length) {
    return notFound()
  }

  const blogPost: Blogpost = pageData.docs[0]
  const pageUrl = localizedAbsoluteUrl(getSiteUrl(), locale, insightDetailHref(slug))
  const mediaUrl = getBlogPostFeaturedImageUrl(blogPost)
  const featuredImageUrl = mediaUrl ? getImageUrl(mediaUrl) : ''

  return (
    <>
      <StructuredData
        locale={locale}
        includeBaseSchemas={false}
        type="article"
        pageTitle={blogPost.title || slug}
        pageDescription={blogPost.meta?.description || blogPost.summary || undefined}
        pageUrl={pageUrl}
        pageImage={featuredImageUrl || undefined}
        publishedTime={blogPost.createdAt}
        modifiedTime={blogPost.updatedAt}
      />
      <div className={classes.page}>
        <BlogPostClient blogPost={blogPost} locale={locale} />
      </div>
      {blogPost.Banners?.reachOutBoolean && <BannerReachOut />}
      {blogPost.Banners?.newsletterBoolean && <BannerNewsletter />}
    </>
  )
}
