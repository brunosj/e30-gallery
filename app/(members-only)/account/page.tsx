import React from 'react'
import { Link } from '@/lib/i18n'
import { redirect } from '@/lib/i18n'

import { Button } from '@/components/Button'
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
      <div className={classes.account}>
        <h1>{m.account()}</h1>
        <p>{m.thisIsYourAccount()}</p>

        {/* <div className={classes.details}>
          <div>
          <p className="semibold">{m.firstName()}</p>
          <p>{firstName}</p>
          </div>
          
          <div>
          <p className="semibold">{m.lastName()}</p>
          <p>{lastName}</p>
          </div>
          
          <div>
          <p className="semibold">{m.email()}</p>
          <p>{email}</p>
          </div>
          </div> */}
        <AccountForm />
        <RenderParams className={classes.params} />
      </div>
    </article>
  )
}
