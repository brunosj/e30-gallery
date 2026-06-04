import React from 'react'
import { redirect } from 'next/navigation'

import { buildPageMetadata } from '@/app/_utilities/generatePageMetadata'
import { RenderParams } from '@/components/RenderParams'
import { getMeUser } from '@/utilities/getMeUser'
import { AccountForm } from './AccountForm'
import { getTranslations } from 'next-intl/server'

import classes from './index.module.css'
import { User } from '@/app/payload-types'
import type { Metadata } from 'next'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    locale,
    href: '/account',
    title: 'Account',
    description: 'Manage your E30 Gallery account',
    noIndex: true,
  })
}

export default async function MembersArea() {
  const t = await getTranslations()
  const result = await getMeUser({
    nullUserRedirect: `/art-society?error=${encodeURIComponent(
      `${t('mustBeLoggedIn')}`,
    )}&redirect=${encodeURIComponent('/account')}`,
  })

  if (result.redirectUrl) {
    redirect(result.redirectUrl)
  }

  if (!result.user) {
    return null
  }

  const user: User = result.user

  const { firstName, lastName, email } = user

  return (
    <article className="container padding-y">
      <AccountForm />
      <RenderParams className={classes.params} />
    </article>
  )
}
