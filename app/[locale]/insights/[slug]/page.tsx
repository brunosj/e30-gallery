import type { Blogpost, Media } from '@/app/payload-types'

import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'
import { parseKeywords } from '@/utilities/parseKeywords'
import classes from './index.module.css'
import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import { Metadata } from 'next'
type Params = Promise<{ locale: string; slug: string }>

async function getData(locale: string, slug: string) {
  const urls = [
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/blogpost?where[slug][equals]=${slug}&locale=${locale}&depth=2`,
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

  const blogPost: Blogpost = pageData.docs[0]
  return {
    title: blogPost.meta?.title || blogPost.title,
    description: blogPost.meta?.description || blogPost.summary,
    keywords: parseKeywords(blogPost.meta?.keywords || ''),
    openGraph: {
      title: blogPost.meta?.title || blogPost.title || '',
      description: blogPost.meta?.description || blogPost.summary || '',
      // images: [
      //   {
      //     url:
      //       typeof blogPost.featuredImage !== 'string' ? (blogPost.featuredImage as Media).url : '',
      //     alt: blogPost.title,
      //   },
      // ],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  const { pageData } = await getData(locale, slug)

  if (!pageData || !pageData.docs.length) {
    return notFound()
  }

  const blogPost: Blogpost = pageData.docs[0]

  return (
    <>
      <div className={classes.page}>
        <BlogPostClient blogPost={blogPost} locale={locale} />
      </div>
      {blogPost.Banners?.reachOutBoolean && <BannerReachOut />}
      {blogPost.Banners?.newsletterBoolean && <BannerNewsletter />}
    </>
  )
}
