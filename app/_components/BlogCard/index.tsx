import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Blogpost } from '@/app/payload-types'
import styles from './index.module.css'
import { languageTag } from '@/paraglide/runtime'
import { formatDate } from '@/app/_utilities/formatDate'
import { getImageUrl } from '@/app/_utilities/getImageUrl'

interface BlogCardProps {
  post: Blogpost
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const locale = languageTag() || 'en'

  const firstMediaBlock = post.layout.find(block => block.blockType === 'mediaBlock' && block.media)

  const { formattedDate, year } = formatDate(post.createdAt, locale)

  return (
    <Link href={`/blog/${post.slug}`} className={styles.card}>
      {firstMediaBlock?.blockType === 'mediaBlock' && firstMediaBlock.media && (
        <div className={styles.imageWrapper}>
          <Image
            src={getImageUrl(firstMediaBlock.media?.url || '')}
            alt={post.title || ''}
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
