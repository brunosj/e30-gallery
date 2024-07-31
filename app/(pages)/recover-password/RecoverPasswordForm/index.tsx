'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from '@/lib/i18n'

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
            </form>
            <Message error={error} className={classes.message} />
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
