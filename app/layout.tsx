import localFont from 'next/font/local'
import type { Viewport } from 'next'
import PlausibleProvider from 'next-plausible'
import { getLocale } from 'next-intl/server'
import './_css/app.css'

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()

  return (
    <html lang={locale} className={`${hanken.className}`}>
      <body className="relative">
        <PlausibleProvider domain="e30gallery.com">{children}</PlausibleProvider>
      </body>
    </html>
  )
}
