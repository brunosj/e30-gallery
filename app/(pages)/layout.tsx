import '../_css/app.css'

import type { Metadata } from 'next'

import type { Viewport } from 'next'
import { LanguageProvider } from '@inlang/paraglide-next'
import { languageTag } from '@/paraglide/runtime.js'
import { HeaderMobile } from '@/components/HeaderMobile'
import { AuthProvider } from '@/providers/Auth'
import localFont from 'next/font/local'
import Footer from '@/components/Footer'
import { siteMetadata } from '@/components/Metadata'
import HeaderV5 from '@/components/Header/V5'
import { parseKeywords } from '@/utilities/parseKeywords'

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
  ...siteMetadata,
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const locale = languageTag()

  return (
    <LanguageProvider>
      <html lang={locale} className={`${hanken.className}`}>
        <body className="relative">
          <AuthProvider api="rest">
            <HeaderV5 />
            <HeaderMobile />
            <main className={classes.main}>{children}</main>
            <Footer />
          </AuthProvider>
        </body>
      </html>
    </LanguageProvider>
  )
}
