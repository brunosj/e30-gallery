'use client'

import React from 'react'
import { Link } from '@/i18n/navigation'
import { CMSImage } from '@/app/_components/CMSImage'
import type { Blogpost } from '@/app/payload-types'
import styles from './index.module.css'
import { useLocale } from 'next-intl'
import { formatDate } from '@/app/_utilities/formatDate'
import { getBlogPostFeaturedImage } from '@/app/_utilities/getBlogPostFeaturedImage'

interface BlogCardProps {
  post: Blogpost
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const locale = useLocale() || 'en'

  const { formattedDate, year } = formatDate(post.createdAt, locale)

  if (!post) return null

  const featuredImage = getBlogPostFeaturedImage(post)

  return (
    <Link
      href={{
        pathname: '/insights/[slug]' as const,
        params: { slug: post.slug || '' },
      }}
      className={styles.card}
    >
      {featuredImage && (
        <div className={styles.imageWrapper}>
          <CMSImage
            src={featuredImage}
            alt={featuredImage.title || post.title || ''}
            width={400}
            height={250}
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.content}>
        <h2 className={styles.title}>{post.title}</h2>
        <p className={styles.excerpt}>{post.summary}</p>
        <div className={styles.meta}>
          <span className={styles.date}>
            {formattedDate} {year}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default BlogCard
