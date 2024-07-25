import type { Media } from '@/app/payload-types'

const useProcessedImage = (image: string | Media): Media | null => {
  const isMedia = (img: string | Media): img is Media => {
    return (img as Media).url !== undefined && (img as Media).url !== null
  }

  if (isMedia(image)) {
    return image
  }

  console.error('Invalid image data:', image)
  return null
}

export default useProcessedImage
