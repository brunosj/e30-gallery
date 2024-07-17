import React from 'react'
import { Link } from '@/lib/i18n'
import { redirect } from '@/lib/i18n'

import { Button } from '@/components/Button'
import { RenderParams } from '@/components/RenderParams'
import { getMeUser } from '@/utilities/getMeUser'
import { AccountForm } from './AccountForm'
import * as m from '@/paraglide/messages.js'

import classes from './index.module.css'

export default async function Account() {
  const result = await getMeUser({
    nullUserRedirect: `/art-society?error=${encodeURIComponent(
      `${m.mustBeLoggedIn()}`,
    )}&redirect=${encodeURIComponent('/account')}`,
  })

  if (result.redirectUrl) {
    redirect(result.redirectUrl)
  }

  return (
    <article className={classes.account}>
      <RenderParams className={classes.params} />
      <h1>Account</h1>
      <p>
        {`This is your account dashboard. Here you can update your account information and more. To manage all users, `}
        <Link href={`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/admin/collections/users`}>
          login to the admin dashboard
        </Link>
        {'.'}
      </p>
      <AccountForm />
      <Button href="/logout" appearance="secondary" label="Log out" />
    </article>
  )
}
