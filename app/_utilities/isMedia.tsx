import type { Media } from '@/app/payload-types'

export function isMedia(image: string | Media): image is Media {
  return (image as Media).url !== undefined
}
