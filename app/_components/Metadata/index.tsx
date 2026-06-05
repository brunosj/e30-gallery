import type { Metadata } from 'next'

import { getSiteUrl } from '@/app/_utilities/siteUrl'

const siteUrl = getSiteUrl()

export const siteDefaults: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'E30 Gallery',
    template: '%s | E30 Gallery',
  },
  description: 'An art gallery located in Frankfurt am Main, Germany',
  applicationName: 'E30 Gallery',
  authors: [{ name: 'E30 Gallery', url: siteUrl }],
  keywords: ['art gallery', 'Frankfurt', 'art exhibitions', 'contemporary art'],
  referrer: 'origin-when-cross-origin',
  creator: 'E30 Gallery',
  publisher: 'E30 Gallery',
  openGraph: {
    title: 'E30 Gallery',
    description: 'An art gallery located in Frankfurt am Main, Germany',
    url: siteUrl,
    siteName: 'E30 Gallery',
    images: [
      {
        url: `${siteUrl}/e30-gallery.jpg`,
        width: 1200,
        height: 630,
        alt: 'E30 Gallery',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E30 Gallery',
    description: 'An art gallery located in Frankfurt am Main, Germany',
    images: [`${siteUrl}/e30-gallery.jpg`],
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      // { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

const MetadataComponent = () => null

export default MetadataComponent
export { siteDefaults as siteMetadata }
