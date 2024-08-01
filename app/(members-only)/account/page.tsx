import React from 'react'
import { redirect } from '@/lib/i18n'

import { RenderParams } from '@/components/RenderParams'
import { getMeUser } from '@/utilities/getMeUser'
import { AccountForm } from './AccountForm'
import * as m from '@/paraglide/messages.js'

import classes from './index.module.css'
import { User } from '@/app/payload-types'

export default async function MembersArea() {
  const result = await getMeUser({
    nullUserRedirect: `/art-society?error=${encodeURIComponent(
      `${m.mustBeLoggedIn()}`,
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
