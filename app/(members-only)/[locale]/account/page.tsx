import React from 'react'
import { redirect } from 'next/navigation'

import { RenderParams } from '@/components/RenderParams'
import { getMeUser } from '@/utilities/getMeUser'
import { AccountForm } from './AccountForm'
import { getTranslations } from 'next-intl/server'

import classes from './index.module.css'
import { User } from '@/app/payload-types'

export default async function MembersArea() {
  const t = await getTranslations('Account')
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
