import { Metadata } from 'next'

interface PageSEOProps {
  title: string
  description?: string
  canonicalUrl?: string
  ogType?: string
  ogImage?: string
  twitterCard?: 'summary_large_image' | 'summary' | 'player' | 'app' | undefined
  keywords?: string[]
}

export function customMetaDataGenerator({
  title,
  description = 'An art gallery located in Frankfurt am Main, Germany',
  canonicalUrl = 'https://e30gallery.com',
  keywords = ['art gallery', 'Frankfurt', 'art exhibitions'],
  ogImage = 'https://e30gallery.com/e30-gallery.jpg',
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
      type: 'website',
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
