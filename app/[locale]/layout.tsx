import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { HeaderMobile } from '@/components/HeaderMobile'
import Footer from '@/components/Footer'
import { siteDefaults } from '@/components/Metadata'
import HeaderV5 from '@/components/Header/V5'
import { routing } from '@/i18n/routing'
import { getMessages } from 'next-intl/server'
import Providers from '@/providers/Providers'
import { StructuredData } from '@/app/_components/StructuredData'
import { fetchMenu } from '@/app/_utilities/fetchMenu'
import { fetchSocials } from '@/app/_utilities/fetchSocials'
import { generateLocaleParams } from '@/app/_utilities/staticParams'

import classes from './index.module.css'

export const metadata: Metadata = siteDefaults

export function generateStaticParams() {
  return generateLocaleParams()
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const [messages, menu, socials] = await Promise.all([
    getMessages(),
    fetchMenu(locale),
    fetchSocials(locale),
  ])

  return (
    <Providers locale={locale} messages={messages} menu={menu} socials={socials}>
      <StructuredData locale={locale} />
      <HeaderV5 />
      <HeaderMobile />
      <main className={classes.main}>{children}</main>
      <Footer />
    </Providers>
  )
}
