'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import type { BlogPage, Blogpost } from '@/app/payload-types'
import BlogCard from '@/components/BlogCard'
import { RichText } from '@/app/_components/RichText'
import classes from './index.module.css'
import { useTranslations } from 'next-intl'
import cn from 'classnames'

type Props = {
  pageData: {
    docs: BlogPage[]
  }
  blogPosts: {
    docs: Blogpost[]
  }
}

export default function BlogPageClient({ pageData, blogPosts }: Props) {
  const t = useTranslations()
  const [activeCategory, setActiveCategory] = useState('all')

  // Clean up any potential memory leaks
  useEffect(() => {
    return () => {
      // Cleanup function
    }
  }, [])

  // Move all hook calls before any conditional returns
  const page = useMemo(() => {
    if (!pageData?.docs?.length) return null
    return pageData.docs[0]
  }, [pageData])

  const posts = useMemo(() => {
    try {
      if (!blogPosts?.docs?.length) return []
      return [...blogPosts.docs].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    } catch (error) {
      console.error('Error sorting posts:', error)
      return blogPosts?.docs || []
    }
  }, [blogPosts])

  // Find the categories that are actually used in blog posts
  const usedCategories = useMemo(() => {
    try {
      const categorySet = new Set<string>()

      // First add "all" which should always be present
      categorySet.add('all')

      // Then find all categories actually used in posts
      posts.forEach(post => {
        if (post.categories && Array.isArray(post.categories)) {
          post.categories.forEach(category => {
            if (category) categorySet.add(category)
          })
        }
      })

      return categorySet
    } catch (error) {
      console.error('Error determining used categories:', error)
      return new Set(['all'])
    }
  }, [posts])

  const availableCategories = useMemo(() => {
    const allCategories = [
      { id: 'all', label: t('all') },
      { id: 'artists', label: t('artists_category') },
      { id: 'behind_the_scenes', label: t('behind_the_scenes') },
      { id: 'art_market', label: t('art_market') },
    ]

    // Filter to only include categories that are actually used in posts
    return allCategories.filter(category => usedCategories.has(category.id))
  }, [t, usedCategories])

  const handleCategoryChange = useCallback((categoryId: string) => {
    try {
      setActiveCategory(categoryId)
    } catch (error) {
      console.error('Error setting category:', error)
    }
  }, [])

  const filteredPosts = useMemo(() => {
    try {
      if (activeCategory === 'all') return posts
      return posts.filter(post => {
        if (!post.categories || !Array.isArray(post.categories)) return false
        return post.categories.includes(activeCategory as any)
      })
    } catch (error) {
      console.error('Error filtering posts:', error)
      return posts
    }
  }, [posts, activeCategory])

  // Basic validation to prevent render errors
  if (!pageData?.docs?.length || !blogPosts?.docs) {
    return <div className="container padding-y min-h-screen">Loading...</div>
  }

  if (!page) return null

  return (
    <section className="container padding-y min-h-screen">
      <h1 className={classes.title}>{page.title}</h1>
      {page.text && (
        <div className={classes.pageContent}>
          <RichText content={page.text} />
        </div>
      )}

      {availableCategories.length > 1 && (
        <div className={classes.filterContainer}>
          {availableCategories.map(category => (
            <button
              key={category.id}
              className={cn(classes.filterPill, {
                [classes.filterPillActive]: activeCategory === category.id,
              })}
              onClick={() => handleCategoryChange(category.id)}
              type="button" // Explicitly set type to prevent form submission
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      {filteredPosts.length > 0 ? (
        <div className={classes.postsGrid}>
          {filteredPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p>{t('all')}</p>
        </div>
      )}
    </section>
  )
}
