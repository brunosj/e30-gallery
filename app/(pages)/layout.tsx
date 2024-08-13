import '../_css/app.css'

import type { Metadata } from 'next'

import type { Viewport } from 'next'
import { useRouter } from 'next/router'
import { LanguageProvider } from '@inlang/paraglide-next'
import { languageTag } from '@/paraglide/runtime.js'
import { Header } from '@/components/Header'
import { HeaderMobile } from '@/components/HeaderMobile'
import { AuthProvider } from '@/providers/Auth'
import localFont from 'next/font/local'
import BannerNewsletter from '@/components/BannerNewsletter'
import Footer from '@/components/Footer'

import classes from './index.module.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

const hanken = localFont({
  src: '../../assets/fonts/HankenGrotesk-VariableFont_wght.ttf',
  display: 'swap',
  variable: '--font-hanken',
  weight: '1 1000',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://preview.e30gallery.com'),
  title: 'E30 Gallery',
  description: 'An art gallery located in Frankfurt am Main, Germany',
  openGraph: {
    title: 'E30 Gallery',
    description: 'An art gallery located in Frankfurt am Main, Germany',
    url: 'https://e30gallery.com',
    siteName: 'E30 Gallery',
    images: [
      {
        url: '/e30-gallery.jpg',
        width: 1200,
        height: 630,
        alt: 'E30 Gallery Image',
      },
    ],
    twitter: {
      card: 'summary_large_image',
      title: 'E30 Gallery',
      description: 'An art gallery located in Frankfurt am Main, Germany',
      images: ['/e30-gallery.jpg'],
    },
    locale: 'en_US, de_DE',
    type: 'website',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <LanguageProvider>
      <html lang={languageTag()} className={`${hanken.className}`}>
        <body className="relative">
          <AuthProvider api="rest">
            <Header />
            <HeaderMobile />
            <main className={classes.main}>{children}</main>
            <Footer />
          </AuthProvider>
        </body>
      </html>
    </LanguageProvider>
  )
}
