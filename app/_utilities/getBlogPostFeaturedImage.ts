import type { Blogpost, Media, MediaBlock } from '@/app/payload-types'

function resolveMediaUrl(media: string | Media | null | undefined): string {
  if (!media || typeof media === 'string') {
    return ''
  }

  return media.url || ''
}

function getFirstLayoutMedia(blogPost: Blogpost): Media | null {
  const firstMediaBlock = blogPost.layout?.find(
    (block): block is MediaBlock =>
      block.blockType === 'mediaBlock' && Boolean(block.media),
  )

  if (!firstMediaBlock?.media || typeof firstMediaBlock.media === 'string') {
    return null
  }

  return firstMediaBlock.media
}

export function getBlogPostFeaturedImage(blogPost: Blogpost): Media | null {
  const titleImage = getBlogPostTitleImageMedia(blogPost)
  if (titleImage) {
    return titleImage
  }

  return getFirstLayoutMedia(blogPost)
}

export function getBlogPostFeaturedImageUrl(blogPost: Blogpost): string {
  return resolveMediaUrl(getBlogPostFeaturedImage(blogPost))
}

export function getBlogPostTitleImageMedia(blogPost: Blogpost): Media | null {
  if (!blogPost.titleImage || typeof blogPost.titleImage === 'string') {
    return null
  }

  return blogPost.titleImage
}
