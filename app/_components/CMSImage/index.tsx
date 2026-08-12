import Image, { type ImageProps } from 'next/image'

import { getImageUrl, getMediaBlurDataURL } from '@/app/_utilities/getImageUrl'
import type { Media } from '@/app/payload-types'

function isMediaObject(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

export type CMSImageProps = Omit<ImageProps, 'src'> & {
  src?: string | Media | null | undefined
  /** Alias for `src` when passing Payload media from client components. */
  media?: Media | null
}

/**
 * CMS image wrapper. Resolves Payload Media URLs and blur placeholders.
 * No `'use client'` — safe in server components; client parents may still import it.
 */
export function CMSImage({
  alt,
  blurDataURL: blurDataURLProp,
  className,
  fill,
  height: heightProp,
  media,
  placeholder: placeholderProp,
  quality,
  sizes: sizesProp,
  src: srcProp,
  width: widthProp,
  ...rest
}: CMSImageProps) {
  const src = srcProp ?? media

  let imageUrl = ''
  let mediaObject: Media | null = null

  if (isMediaObject(src)) {
    mediaObject = src
    imageUrl = getImageUrl(src.url || '')
  } else if (typeof src === 'string' && (src.startsWith('http') || src.includes('/'))) {
    // Absolute URL or path — not an unpopulated Payload ID
    imageUrl = getImageUrl(src)
  }

  if (!imageUrl) {
    return null
  }

  let width = widthProp
  let height = heightProp

  if (!width && !height && !fill && mediaObject) {
    if (mediaObject.width && mediaObject.height) {
      width = mediaObject.width
      height = mediaObject.height
    }
  }

  const mediaBlur = getMediaBlurDataURL(mediaObject)
  const blurDataURL = blurDataURLProp ?? mediaBlur
  const placeholder = placeholderProp ?? (blurDataURL ? 'blur' : undefined)
  const defaultSizes = fill && !sizesProp ? '100vw' : sizesProp

  return (
    <Image
      alt={alt || ''}
      blurDataURL={blurDataURL}
      className={className}
      fill={fill}
      height={!fill ? height : undefined}
      placeholder={placeholder}
      quality={quality || 75}
      sizes={defaultSizes}
      src={imageUrl}
      width={!fill ? width : undefined}
      {...rest}
    />
  )
}
