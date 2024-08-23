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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = useCallback(async (data: FormData) => {
    try {
      // Step 1: Check if the email exists by calling the custom CMS endpoint
      const emailCheckResponse = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/check-email`,
        {
          method: 'POST',
          body: JSON.stringify({ email: data.email }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const emailCheckData = await emailCheckResponse.json()

      if (!emailCheckData.exists) {
        setError(`${m.emailNotFound()}`)
        return
      }

      // Step 2: If email exists, proceed with the password recovery
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/forgot-password`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        setSuccess(true)
        setError('')
      } else {
        setError(`${m.emailSendingFailed()}`)
      }
    } catch (error) {
      setError(`${m.emailNotFound()}`)
    }
  }, [])

  const recoverPasswordLink = {
    className: classes.submit,
    label: `${m.recoverPassword()}`,
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
              <Button link={recoverPasswordLink} action="submit" />
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
