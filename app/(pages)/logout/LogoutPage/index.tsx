'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { Link } from '@/lib/i18n'
import * as m from '@/paraglide/messages.js'
import { Button } from '@/components/Button'
import { useAuth } from '@/providers/Auth'
import classes from './index.module.css'
import { LogInLink, HomeLink } from '@/app/_utilities/linkObjects'

export const LogoutPage: React.FC = props => {
  const { logout } = useAuth()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess(`${m.loggedOutSuccessfully()}`)
      } catch (_) {
        setError(`${m.alreadyLoggedOut()}`)
      }
    }

    performLogout()
  }, [logout])

  return (
    <Fragment>
      {(error || success) && (
        <section className="container padding-y">
          <div className={classes.logout}>
            <h1>{error || success}</h1>
            <p>{m.doNext()}</p>
            <div className={classes.buttons}>
              <Button link={HomeLink(m.homepage(), 'secondary')} />
              <Button link={LogInLink()} />
            </div>
          </div>
        </section>
      )}
    </Fragment>
  )
}
