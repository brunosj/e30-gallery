'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from '@/lib/i18n'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Message } from '@/components/Message'
import { useAuth } from '@/providers/Auth'
import * as m from '@/paraglide/messages.js'

import classes from './index.module.css'

type FormData = {
  password: string
  confirmPassword: string
  token: string
}

export const ResetPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/reset-password`,
        {
          method: 'POST',
          body: JSON.stringify({ password: data.password, token: data.token }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        const json = await response.json()

        // Automatically log the user in after they successfully reset password
        await login({ email: json.user.email, password: data.password })

        // Redirect them to `/account` with success message in URL
        router.push(`'/account?success=${m.passwordResetSuccess}.'`)
      } else {
        setError(`${m.passwordResetFailed()}`)
      }
    },
    [router, login],
  )

  // when Next.js populates token within router,
  // reset form with new token value
  useEffect(() => {
    reset({ token: token || undefined })
  }, [reset, token])

  // Get the current value of the password field to validate confirmPassword
  const password = watch('password')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <p className="semibold">{m.passwordReset()}</p>

      <Input
        name="password"
        type="password"
        label={m.newPassword()}
        required
        register={register}
        error={errors.password}
      />

      <Input
        name="confirmPassword"
        type="password"
        label={m.confirmPassword()}
        required
        register={register}
        error={errors.confirmPassword}
        validate={value => value === password || `${m.passwordsDontMatch()}`}
      />

      <input type="hidden" {...register('token')} />
      <Button
        action="submit"
        className={classes.submit}
        label={m.resetPassword()}
        appearance="primary"
      />
      <Message error={error} className={classes.message} />
    </form>
  )
}
