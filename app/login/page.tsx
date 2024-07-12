import React from 'react'
import { redirect } from "@/lib/i18n"

import { RenderParams } from '../_components/RenderParams'
import { getMeUser } from '../_utilities/getMeUser'
import { LoginForm } from './LoginForm'

import classes from './index.module.css'

export default async function Login() {
  const result = await getMeUser({
    validUserRedirect: `/account?message=${encodeURIComponent('You are already logged in.')}`,
  })

  if (result.redirectUrl) {
    redirect(result.redirectUrl)
  }

  return (
    <article className={classes.login}>
      <RenderParams className={classes.params} />
      <h1>Log in</h1>
      <LoginForm />
    </article>
  )
}
