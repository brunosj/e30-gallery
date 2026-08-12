import type { Media } from '@/app/payload-types'

export const getImageUrl = (url: string | undefined): string => {
  if (!url) return ''

  // If the URL is already absolute (starts with http:// or https://), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // Remove leading slash if present to avoid double slashes
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url

  // Combine the base URL with the image path
  return `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/${cleanUrl}`
}

/** Stored LQIP from Payload upload hook; undefined when missing or empty. */
export function getMediaBlurDataURL(media: Media | null | undefined): string | undefined {
  const value = media?.blurDataURL?.trim()
  return value ? value : undefined
}
