import type { BlogPage, Blogpost } from '@/app/payload-types'
import { Metadata } from 'next'
import BlogPageClient from './client'
type Params = Promise<{ locale: string; slug: string }>

async function getData(locale: string) {
  const urls = [
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/blog-page?locale=${locale}&depth=2`,
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/blogpost?locale=${locale}&depth=2&limit=0`,
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
    const blogPosts = data[1]
    return { pageData, blogPosts }
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
    description: metadata?.description,
    // keywords: parseKeywords(metadata.keywords),
    openGraph: {
      title: metadata?.title,
      description: metadata?.description,
    },
  }
}

export default async function BlogPage({ params }: { params: Params }) {
  const { locale } = await params
  const { pageData, blogPosts } = await getData(locale)

  return <BlogPageClient pageData={pageData} blogPosts={blogPosts} />
}
