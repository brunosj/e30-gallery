import { Metadata } from 'next'

interface PageSEOProps {
  title: string
  description?: string
  canonicalUrl?: string
  ogType?: string
  ogImage?: string
  twitterCard?: string
  keywords?: string[]
}

export function customMetaDataGenerator({
  title,
  description = 'An art gallery located in Frankfurt am Main, Germany',
  canonicalUrl = 'https://e30gallery.com',
  ogType = 'website',
  keywords = ['art gallery', 'Frankfurt', 'art exhibitions'],
  ogImage = 'https://preview.e30gallery.com/e30-gallery.jpg',
  twitterCard = 'summary_large_image',
}: PageSEOProps): Metadata {
  // Create Site Title
  const siteTitle = 'E30 Gallery'
  const fullTitle = `${title} | ${siteTitle}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title: fullTitle,
      description,
      type: ogType,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}
