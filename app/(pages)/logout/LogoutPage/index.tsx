'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { Link } from '@/lib/i18n'
import * as m from '@/paraglide/messages.js'

import { useAuth } from '@/providers/Auth'

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
        <div>
          <h1>{error || success}</h1>
          <p>
            {'What would you like to do next? '}
            <Link href="/">Click here</Link>
            {` to go to the home page. To log back in, `}
            <Link href="/art-society">click here</Link>
            {'.'}
          </p>
        </div>
      )}
    </Fragment>
  )
}
