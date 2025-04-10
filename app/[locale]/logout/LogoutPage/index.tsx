'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button'
import { useAuth } from '@/providers/Auth'
import classes from './index.module.css'
import { LogInLink, HomeLink } from '@/app/_utilities/linkObjects'

export const LogoutPage: React.FC = props => {
  const { logout } = useAuth()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const t = useTranslations()
  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess(`${t('loggedOutSuccessfully')}`)
      } catch (_) {
        setError(`${t('alreadyLoggedOut')}`)
      }
    }

    performLogout()
  }, [logout, t])

  return (
    <Fragment>
      {(error || success) && (
        <section className="container padding-y">
          <div className={classes.logout}>
            <h1>{error || success}</h1>
            <p>{t('doNext')}</p>
            <div className={classes.buttons}>
              <Button link={HomeLink(t('homepage'), 'secondary')} />
              <Button link={LogInLink()} />
            </div>
          </div>
        </section>
      )}
    </Fragment>
  )
}
