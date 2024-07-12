import React from 'react'

import { LogoutPage } from './LogoutPage'

import classes from './index.module.css'

export default async function Logout() {
  return (
    <article className={classes.logout}>
      <LogoutPage />
    </article>
  )
}
