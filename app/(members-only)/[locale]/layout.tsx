import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server'

import { HeaderMembersArea } from '@/components/HeaderMembersArea'
import { AuthProvider } from '@/providers/Auth'
import BannerNewsletter from '@/components/BannerNewsletter'
import Footer from '@/components/Footer'
import { getMeUser } from '@/utilities/getMeUser'
import { redirect } from 'next/navigation'

import classes from './index.module.css'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'E30 Gallery',
  description: 'an art gallery located in Frankfurt am Main, Germany',
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations('Layout')
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
      <body className="relative">
        <AuthProvider api="rest">
          <HeaderMembersArea />
          <main className={classes.main}>{children}</main>
          <BannerNewsletter />
          <Footer />
        </AuthProvider>
      </body>
    </NextIntlClientProvider>
  )
}
