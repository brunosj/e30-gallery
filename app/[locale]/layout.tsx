import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { HeaderMobile } from '@/components/HeaderMobile'
import { AuthProvider } from '@/providers/Auth'
import Footer from '@/components/Footer'
import { siteMetadata } from '@/components/Metadata'
import HeaderV5 from '@/components/Header/V5'
import { routing } from '@/i18n/routing'
import { getMessages } from 'next-intl/server'

import classes from './index.module.css'

export const metadata: Metadata = {
  ...siteMetadata,
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Ensure the incoming locale is valid
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AuthProvider api="rest">
        <HeaderV5 />
        <HeaderMobile />
        <main className={classes.main}>{children}</main>
        <Footer />
      </AuthProvider>
    </NextIntlClientProvider>
  )
}
