import type { Media } from '@/app/payload-types'
import React from 'react'
import NextImage, { ImageProps as NextImageProps } from 'next/image'

type CustomImageProps = Omit<NextImageProps, 'src' | 'alt'> & {
  src: string | Media
  alt?: string
}

const isMedia = (image: string | Media): image is Media => {
  return (image as Media).url !== undefined && (image as Media).url !== null
}

const CustomImage: React.FC<CustomImageProps> = ({ src, alt, ...props }) => {
  if (isMedia(src)) {
    if (!src.url) {
      console.error('Invalid image URL:', src)
      return null
    }
    return <NextImage src={src.url} alt={alt || src.title || 'Image'} {...props} />
  } else {
    return <NextImage src={src} alt={alt || 'Image'} {...props} />
  }
}

export default CustomImage
