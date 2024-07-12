import { LanguageProvider } from '@inlang/paraglide-next'
import { languageTag } from '@/paraglide/runtime.js'
import { Header } from './_components/Header'
import { AuthProvider } from './_providers/Auth'
import localFont from 'next/font/local'

const regular = localFont({
  src: '../assets/fonts/HankenGrotesk-Regular.ttf',
  display: 'swap',
  variable: '--font-regular',
})

const semibold = localFont({
  src: '../assets/fonts/HankenGrotesk-SemiBold.ttf',
  display: 'swap',
  variable: '--font-semibold',
})

const bold = localFont({
  src: '../assets/fonts/HankenGrotesk-Bold.ttf',
  display: 'swap',
  variable: '--font-bold',
})

const hanken = localFont({
  src: '../assets/fonts/HankenGrotesk-VariableFont_wght.ttf',
  display: 'swap',
  variable: '--font-hanken',
  weight: '1 1000',
})

import './_css/app.css'

export const metadata = {
  title: 'Payload Auth + Next.js App Router Example',
  description: 'An example of how to authenticate with Payload from a Next.js app.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <LanguageProvider>
      <html
        lang={languageTag()}
        className={`${hanken.variable} ${regular.variable} ${semibold.variable} ${bold.variable}`}
      >
        <body>
          <AuthProvider api="rest">
            <Header />
            <main>{children}</main>
          </AuthProvider>
        </body>
      </html>
    </LanguageProvider>
  )
}
