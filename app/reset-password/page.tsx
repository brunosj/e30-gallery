import React, {Suspense} from 'react'

import { ResetPasswordForm } from './ResetPasswordForm'

import classes from './index.module.css'

export default async function ResetPassword() {
  return (
    <article className={classes.resetPassword}>
      <h1>Reset Password</h1>
      <p>Please enter a new password below.</p>
      <Suspense>
      <ResetPasswordForm />
      </Suspense>
    </article>
  )
}
