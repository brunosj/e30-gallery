import localFont from 'next/font/local'
import { setRequestLocale, getMessages } from 'next-intl/server'
import type { Viewport } from 'next'
import PlausibleProvider from 'next-plausible'
import './_css/app.css'

type Params = Promise<{ locale: string }>

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

const hanken = localFont({
  src: '../assets/fonts/HankenGrotesk-VariableFont_wght.ttf',
  display: 'swap',
  variable: '--font-hanken',
  weight: '1 1000',
})

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <html lang={locale} className={`${hanken.className}`}>
      <PlausibleProvider
        domain="e30gallery.com"
        customDomain="https://plausible.e30gallery.com"
        enabled={true}
      >
        <body className="relative">{children}</body>
      </PlausibleProvider>
    </html>
  )
}
