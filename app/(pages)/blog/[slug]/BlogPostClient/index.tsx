import React from 'react'
import type { Blogpost } from '@/app/payload-types'
import RenderBlocks from '@/components/Blocks/RenderBlocks'
import classes from './index.module.css'

interface BlogPostClientProps {
  blogPost: Blogpost
  locale: string
}

const BlogPostClient: React.FC<BlogPostClientProps> = ({ blogPost, locale }) => {
  return (
    <article className={classes.article}>
      <header className={classes.header}>
        <h1 className={classes.title}>{blogPost.title}</h1>
        <div className={classes.meta}>
          <time dateTime={blogPost.createdAt}>
            {new Date(blogPost.createdAt).toLocaleDateString(locale)}
          </time>
        </div>
      </header>

      <RenderBlocks layout={blogPost.layout} className={classes.content} />
    </article>
  )
}

export default BlogPostClient
