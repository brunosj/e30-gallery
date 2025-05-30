'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/routing'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Message } from '@/components/Message'
import { useAuth } from '@/app/_providers/Auth'
import { useTranslations } from 'next-intl'

import classes from './index.module.css'

type FormData = {
  password: string
  confirmPassword: string
  token?: string
}

export const ResetPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const t = useTranslations()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        // Use our Next.js API route instead of directly calling Payload
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ password: data.password, token: data.token }),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const json = await response.json()

          // Automatically log the user in after they successfully reset password
          await login({ email: json.user.email, password: data.password })

          // Extract the translated string
          const successMessage = t('passwordResetSuccess')

          // Redirect them to `/account` with success message in URL
          router.push({
            //@ts-ignore
            pathname: '/account' as const,
            query: { success: successMessage },
          })
        } else {
          const responseData = await response.json()
          setError(responseData.errors?.[0]?.message || t('passwordResetFailed'))
        }
      } catch (error) {
        console.error('Password reset error:', error)
        setError(t('passwordResetFailed'))
      }
    },
    [router, login, t],
  )

  // when Next.js populates token within router,
  // reset form with new token value
  useEffect(() => {
    reset({ token: token || undefined })
  }, [reset, token])

  // Get the current value of the password field to validate confirmPassword
  const password = watch('password')

  const resetPasswordLink = {
    className: classes.submit,
    label: `${t('resetPassword')}`,
    appearance: 'primary',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <p className="semibold">{t('passwordReset')}</p>

      <Input
        name="password"
        type="password"
        label={t('newPassword')}
        required
        register={register}
        error={errors.password}
      />

      <Input
        name="confirmPassword"
        type="password"
        label={t('confirmPassword')}
        required
        register={register}
        error={errors.confirmPassword}
        validate={value => value === password || `${t('passwordsDontMatch')}`}
      />

      <input type="hidden" {...register('token')} />
      <Button link={resetPasswordLink} action="submit" />
      <Message error={error} className={classes.message} />
    </form>
  )
}
