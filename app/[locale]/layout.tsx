import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { HeaderMobile } from '@/components/HeaderMobile'
import Footer from '@/components/Footer'
import { siteMetadata } from '@/components/Metadata'
import HeaderV5 from '@/components/Header/V5'
import { routing } from '@/i18n/routing'
import { getMessages, getLocale } from 'next-intl/server'
import Providers from '@/providers/Providers'

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
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <Providers locale={locale} messages={messages}>
      <HeaderV5 />
      <HeaderMobile />
      <main className={classes.main}>{children}</main>
      <Footer />
    </Providers>
  )
}
