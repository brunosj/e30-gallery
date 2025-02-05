import React from 'react'
import type { Blogpost } from '@/app/payload-types'
import RenderBlocks from '@/components/Blocks/RenderBlocks'
import classes from './index.module.css'
import { languageTag } from '@/paraglide/runtime'
import { formatDate } from '@/app/_utilities/formatDate'

interface BlogPostClientProps {
  blogPost: Blogpost
  locale: string
}

const BlogPostClient: React.FC<BlogPostClientProps> = ({ blogPost, locale }) => {
  const { formattedDate, year } = formatDate(blogPost.createdAt, locale)
  return (
    <article className={classes.article}>
      <header className={classes.header}>
        <h1 className={classes.title}>{blogPost.title}</h1>
        <div className={classes.meta}>
          <time dateTime={blogPost.createdAt}>
            {formattedDate} {year}
          </time>
        </div>
      </header>

      <RenderBlocks layout={blogPost.layout} className={classes.content} />
    </article>
  )
}

export default BlogPostClient
