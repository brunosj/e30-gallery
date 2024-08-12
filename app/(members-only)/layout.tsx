import '../_css/app.css'

import type { Viewport } from 'next'
import { LanguageProvider } from '@inlang/paraglide-next'
import { languageTag } from '@/paraglide/runtime.js'
import { HeaderMembersArea } from '@/components/HeaderMembersArea'
import { AuthProvider } from '@/providers/Auth'
import localFont from 'next/font/local'
import BannerNewsletter from '@/components/BannerNewsletter'
import Footer from '@/components/Footer'
import { getMeUser } from '@/utilities/getMeUser'
import { redirect } from '@/lib/i18n'
import * as m from '@/paraglide/messages.js'

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

export const metadata = {
  title: 'E30 Gallery',
  description: 'an art gallery located in Frankfurt am Main, Germany',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const result = await getMeUser({
    nullUserRedirect: `/art-society?error=${encodeURIComponent(
      `${m.mustBeLoggedIn()}`,
    )}&redirect=${encodeURIComponent('/members-area')}`,
  })

  if (result.redirectUrl) {
    redirect(result.redirectUrl)
  }
  return (
    <LanguageProvider>
      <html lang={languageTag()} className={`${hanken.className}`}>
        <body>
          <AuthProvider api="rest">
            <HeaderMembersArea />
            <main>{children}</main>
            <BannerNewsletter />
            <Footer />
          </AuthProvider>
        </body>
      </html>
    </LanguageProvider>
  )
}
