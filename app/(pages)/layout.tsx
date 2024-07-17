import '../_css/app.css'

import { LanguageProvider } from '@inlang/paraglide-next'
import { languageTag } from '@/paraglide/runtime.js'
import { Header } from '@/components/Header'
import { AuthProvider } from '@/providers/Auth'
import localFont from 'next/font/local'
import BannerNewsletter from '@/components/BannerNewsletter'
import Footer from '@/components/Footer'

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

  return (
    <LanguageProvider>
      <html lang={languageTag()} className={`${hanken.className}`}>
        <body>
          <AuthProvider api="rest">
            <Header />
            <main>{children}</main>
            <BannerNewsletter />
            <Footer />
          </AuthProvider>
        </body>
      </html>
    </LanguageProvider>
  )
}
