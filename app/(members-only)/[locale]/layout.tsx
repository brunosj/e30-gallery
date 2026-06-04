import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound, redirect } from 'next/navigation'

import { HeaderMembersArea } from '@/components/HeaderMembersArea'
import { AuthProvider } from '@/providers/Auth'
import BannerNewsletter from '@/components/BannerNewsletter'
import Footer from '@/components/Footer'
import { getMeUser } from '@/utilities/getMeUser'
import { buildPageMetadata } from '@/app/_utilities/generatePageMetadata'
import { routing } from '@/i18n/routing'

import classes from './index.module.css'

type LayoutParams = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: LayoutParams }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    locale,
    href: '/members-area',
    title: 'Members Area',
    description: 'E30 Gallery members area',
    noIndex: true,
  })
}

export default async function MembersLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: LayoutParams
}) {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations()
  const result = await getMeUser({
    nullUserRedirect: `/art-society?error=${encodeURIComponent(
      `${t('mustBeLoggedIn')}`,
    )}&redirect=${encodeURIComponent('/members-area')}`,
  })

  if (result.redirectUrl) {
    redirect(result.redirectUrl)
  }

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AuthProvider api="rest">
        <HeaderMembersArea />
        <main className={classes.main}>{children}</main>
        <BannerNewsletter />
        <Footer />
      </AuthProvider>
    </NextIntlClientProvider>
  )
}
