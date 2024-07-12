import React from 'react'

import { RecoverPasswordForm } from './RecoverPasswordForm'

import classes from './index.module.css'

export default async function RecoverPassword() {
  return (
    <article className={classes.recoverPassword}>
      <RecoverPasswordForm />
    </article>
  )
}
