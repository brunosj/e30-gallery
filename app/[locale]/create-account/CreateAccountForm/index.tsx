'use client'

import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from '@/i18n/navigation'

import { useRouter } from '@/i18n/routing'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Message } from '@/components/Message'
import { useAuth } from '@/providers/Auth'
import { useTranslations } from 'next-intl'

import classes from './index.module.css'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const message = response.statusText || `${t('accountCreationFailed')}`
        setError(message)
        return
      }

      const redirect = searchParams.get('redirect')

      const timer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      try {
        await login(data)
        clearTimeout(timer)
        if (
          redirect &&
          ['/artists', '/exhibitions', '/gallery', '/art-society', '/members-area'].includes(
            redirect,
          )
        ) {
          router.push({ pathname: redirect as any })
        } else {
          router.push({
            pathname: '/members-area' as const,
            query: { success: 'Account created successfully' },
          })
        }
      } catch (_) {
        clearTimeout(timer)
        setError(`${t('errorWithCredentials')}`)
      }
    },
    [login, router, searchParams, t],
  )

  const createAccountLink = {
    className: classes.submit,
    label: loading ? `${t('processing')}` : `${t('createAccount')}`,
    appearance: 'primary',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      {/* <p>
        {`This is where new customers can signup and create a new account. To manage all users, `}
        <a
          href={`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/admin/collections/users`}
          target="_blank"
          rel="noopener noreferrer"
        >
          login to the admin dashboard
        </a>
        {'.'}
      </p> */}
      <Input
        name="email"
        label={t('email')}
        required
        register={register}
        error={errors.email}
        type="email"
      />
      <Input
        name="password"
        type="password"
        label={t('password')}
        required
        register={register}
        error={errors.password}
      />
      <Input
        name="passwordConfirm"
        type="password"
        label={t('confirmPassword')}
        required
        register={register}
        validate={value => value === password.current || `${t('passwordsDontMatch')}`}
        error={errors.passwordConfirm}
      />
      <Button link={createAccountLink} action="submit" />
      <Message error={error} className={classes.message} />

      <div>
        {t('alreadyHaveAnAccount')}
        <Link
          href={{
            pathname: '/art-society',
            query: searchParams.toString() ? Object.fromEntries(searchParams.entries()) : undefined,
          }}
        >
          {t('login')}
        </Link>
      </div>
    </form>
  )
}
