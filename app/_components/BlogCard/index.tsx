import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Blogpost } from '@/app/payload-types'
import styles from './index.module.css'

interface BlogCardProps {
  post: Blogpost
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const firstMediaBlock = post.layout.find(block => block.blockType === 'mediaBlock' && block.media)

  return (
    <Link href={`/blog/${post.slug}`} className={styles.card}>
      {firstMediaBlock?.blockType === 'mediaBlock' && firstMediaBlock.media && (
        <div className={styles.imageWrapper}>
          <Image
            src={firstMediaBlock.media.url || ''}
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
          <span className={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  )
}

export default BlogCard
