import type { BlogPage, Blogpost } from '@/app/payload-types'
import { languageTag } from '@/paraglide/runtime'
import BlogCard from '@/components/BlogCard'
import { parseKeywords } from '@/utilities/parseKeywords'
import { RichText } from '@/app/_components/RichText'
import classes from './index.module.css'

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

export async function generateMetadata() {
  const locale = languageTag()
  const { pageData } = await getData(locale)
  const metadata = pageData.docs[0].meta
  return {
    title: pageData.docs[0].title,
    description: metadata?.description,
    keywords: metadata?.keywords ? [parseKeywords(metadata.keywords)] : [],
    openGraph: {
      title: metadata?.title,
      description: metadata?.description,
    },
  }
}

export default async function BlogPage() {
  const locale = languageTag()
  const { pageData, blogPosts } = await getData(locale)
  const page: BlogPage = pageData.docs[0]
  const posts: Blogpost[] = blogPosts.docs.sort(
    (a: Blogpost, b: Blogpost) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <section className="container padding-y">
      <h1 className={classes.title}>{page.title}</h1>
      {page.text && (
        <div className={classes.pageContent}>
          <RichText content={page.text} />
        </div>
      )}
      <div className={classes.postsGrid}>
        {posts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
