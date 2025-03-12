export const getImageUrl = (url: string | null | undefined): string => {
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
