import localFont from 'next/font/local'
import type { Viewport } from 'next'
import PlausibleProvider from 'next-plausible'
import { getLocale } from 'next-intl/server'
import Progress from '@/providers/Progress'
import { getSiteUrl } from '@/app/_utilities/siteUrl'
import './_css/app.css'

const siteUrl = getSiteUrl()
const cmsOrigin = process.env.NEXT_PUBLIC_PAYLOAD_URL?.replace(/\/$/, '')

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
  colorScheme: 'light',
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
      <head>
        <link rel="preconnect" href={siteUrl} />
        {cmsOrigin ? <link rel="preconnect" href={cmsOrigin} crossOrigin="anonymous" /> : null}
        <link rel="dns-prefetch" href="https://plausible.e30gallery.com" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="relative">
        <Progress>
          <PlausibleProvider>{children}</PlausibleProvider>
        </Progress>
      </body>
    </html>
  )
}
