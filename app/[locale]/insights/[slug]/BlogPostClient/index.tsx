import React from 'react'
import type { Blogpost } from '@/app/payload-types'
import Image from 'next/image'
import RenderBlocks from '@/components/Blocks/RenderBlocks'
import classes from './index.module.css'
import { formatDate } from '@/app/_utilities/formatDate'
import { getBlogPostTitleImageMedia } from '@/app/_utilities/getBlogPostFeaturedImage'
import { getImageUrl } from '@/app/_utilities/getImageUrl'

interface BlogPostClientProps {
  blogPost: Blogpost
  locale: string
}

const BlogPostClient: React.FC<BlogPostClientProps> = ({ blogPost, locale }) => {
  const { formattedDate, year } = formatDate(blogPost.createdAt, locale)
  const titleImage = getBlogPostTitleImageMedia(blogPost)

  return (
    <article className={classes.article}>
      <header className={classes.header}>
        <h1 className={classes.title}>{blogPost.title}</h1>
        {blogPost.summary ? (
          <p className={classes.lead}>{blogPost.summary}</p>
        ) : null}
        <div className={classes.meta}>
          <time dateTime={blogPost.createdAt}>
            {formattedDate} {year}
          </time>
        </div>
      </header>

      {titleImage ? (
        <div className={classes.titleImage}>
          <Image
            src={getImageUrl(titleImage.url || '')}
            alt={titleImage.title || blogPost.title || ''}
            fill
            className={classes.titleImageImg}
            priority
          />
        </div>
      ) : null}

      <RenderBlocks layout={blogPost.layout} className={classes.content} />
    </article>
  )
}

export default BlogPostClient
