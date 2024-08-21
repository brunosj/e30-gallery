import { Metadata } from 'next'

const siteMetadata: Metadata = {
  metadataBase: new URL('https://e30gallery.com'),
  title: 'E30 Gallery',
  description: 'An art gallery located in Frankfurt am Main, Germany',

  // Basic metadata
  applicationName: 'E30 Gallery',
  authors: [{ name: 'Bruno SJ', url: 'https://landozone.net' }],
  keywords: ['art gallery', 'Frankfurt', 'art exhibitions'],
  referrer: 'origin-when-cross-origin',
  creator: 'landozone',
  publisher: 'E30 Gallery',

  // Open Graph metadata
  openGraph: {
    title: 'E30 Gallery',
    description: 'An art gallery located in Frankfurt am Main, Germany',
    url: 'https://e30gallery.com',
    siteName: 'E30 Gallery',
    images: [
      {
        url: 'https://e30gallery.com/e30-gallery.jpg',
        width: 1200,
        height: 630,
        alt: 'E30 Gallery Image',
      },
    ],
    locale: 'en_US, de_DE', // Adjust locale if needed
    type: 'website',
  },

  // Twitter metadata
  twitter: {
    card: 'summary_large_image',
    title: 'E30 Gallery',
    description: 'An art gallery located in Frankfurt am Main, Germany',
    images: ['https://e30gallery.com/e30-gallery.jpg'],
  },

  // Verification for search engines
  verification: {
    google: 'google-site-verification=your-google-verification-code',
    yandex: 'yandex-verification=your-yandex-verification-code',
    yahoo: 'yahoo-site-verification=your-yahoo-verification-code',
  },

  // Alternate languages
  alternates: {
    canonical: 'https://e30gallery.com',
    languages: {
      'en-US': 'https://e30gallery.com/',
      'de-DE': 'https://e30gallery.com/de',
    },
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.icon',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },

  // Manifest
  manifest: '/site.webmanifest',

  // App-specific metadata
  appleWebApp: {
    capable: false,
    title: 'E30 Gallery',
    statusBarStyle: 'black-translucent',
  },

  // Robots directives
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Format detection
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

const MetadataComponent = () => {
  return null
}

export default MetadataComponent
export { siteMetadata }
