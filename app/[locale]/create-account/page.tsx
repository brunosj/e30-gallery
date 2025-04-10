import React from 'react'
import { redirect } from 'next/navigation'

import { RenderParams } from '../../_components/RenderParams'
import { getMeUser } from '../../_utilities/getMeUser'
import { CreateAccountForm } from './CreateAccountForm'

import classes from './index.module.css'

export default async function CreateAccount() {
  const result = await getMeUser({
    validUserRedirect: `/account?message=${encodeURIComponent(
      'Cannot create a new account while logged in, please log out and try again.',
    )}`,
  })

  if (result.redirectUrl) {
    redirect(result.redirectUrl)
  }

  return (
    <article className={classes.createAccount}>
      <h1>Create Account</h1>
      <RenderParams />
      <CreateAccountForm />
    </article>
  )
}
