'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Message } from '@/components/Message'
import * as m from '@/paraglide/messages.js'

import classes from './index.module.css'

type FormData = {
  email: string
}

export const RecoverPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = useCallback(async (data: FormData) => {
    try {
      setIsLoading(true)

      // Step 1: First check if the email exists using our Next.js API route
      const emailCheckResponse = await fetch('/api/auth/check-email', {
        method: 'POST',
        body: JSON.stringify({ email: data.email }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Try to get the response text for debugging
      const responseText = await emailCheckResponse.text()

      // Parse the JSON if possible
      let emailCheckData
      try {
        emailCheckData = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse JSON response:', e)
        setError(`${m.emailSendingFailed()}`)
        setIsLoading(false)
        return
      }

      if (!emailCheckData.exists) {
        setError(`${m.emailNotFound()}`)
        setIsLoading(false)
        return
      }

      // Step 2: If email exists, proceed with the password recovery using our Next.js API route
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: data.email }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Try to get the response text for debugging
      const forgotPasswordText = await response.text()

      // Parse the JSON if possible
      let responseData
      try {
        responseData = JSON.parse(forgotPasswordText)
      } catch (e) {
        console.error('Failed to parse JSON response for password recovery:', e)
        setError(`${m.emailSendingFailed()}`)
        setIsLoading(false)
        return
      }

      if (response.ok) {
        setSuccess(true)
        setError('')
      } else {
        console.error('Password recovery failed:', responseData)
        // Handle error messages
        setError(responseData.errors?.[0]?.message || `${m.emailSendingFailed()}`)
      }
    } catch (error) {
      console.error('Password recovery error:', error)
      setError(`${m.emailSendingFailed()}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recoverPasswordLink = {
    className: classes.submit,
    label: isLoading ? 'Loading...' : `${m.recoverPassword()}`,
    appearance: 'primary',
  }

  return (
    <Fragment>
      {!success && (
        <React.Fragment>
          <div className={classes.formWrapper}>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
              <p className="semibold">{m.recoverPassword()}</p>
              <Input
                name="email"
                label={m.email()}
                required
                register={register}
                error={errors.email}
                type="email"
              />
              <Button link={recoverPasswordLink} action="submit" disabled={isLoading} />
              <Message error={error} className={classes.message} />
            </form>
          </div>
        </React.Fragment>
      )}
      {success && (
        <React.Fragment>
          <div className={classes.form}>
            <p className="semibold">{m.requestSubmitted()}</p>
            <p>{m.weSentLink()}</p>
          </div>
        </React.Fragment>
      )}
    </Fragment>
  )
}
