'use client'

import type { ArtSocietyPage } from '@/app/payload-types'
import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from '@/i18n/navigation'

import { useRouter } from '@/i18n/routing'
import { useSearchParams } from 'next/navigation'

import { RichText } from '@/components/RichText'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Message } from '@/components/Message'
import { useAuth } from '@/providers/Auth'
import { useTranslations } from 'next-intl'
import classes from './index.module.css'

type FormData = {
  email: string
  password: string
}

type Props = {
  data?: ArtSocietyPage
}

export const LoginForm: React.FC<Props> = ({ data }: Props) => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const t = useTranslations()
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data)
        if (
          redirect?.current &&
          ['/artists', '/exhibitions', '/gallery', '/art-society', '/members-area'].includes(
            redirect.current,
          )
        ) {
          router.push({ pathname: redirect.current as any })
        } else {
          router.push('/members-area' as const)
        }
      } catch (_) {
        setError(`${t('errorWithCredentials')}`)
      }
    },
    [login, router, t],
  )

  const loginLink = {
    disabled: isLoading,
    className: classes.submit,
    label: isLoading ? `${t('processing')}` : `${t('login')}`,
    appearance: 'primary',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <p className="semibold">{t('memberLogin')}</p>
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
      <Link
        href={{
          pathname: '/recover-password' as any,
          query: searchParams.toString() ? Object.fromEntries(searchParams.entries()) : undefined,
        }}
        className="blueLink"
      >
        {t('forgotPassword')}
      </Link>
      <Button link={loginLink} action="submit" />
      <RichText content={data?.help_text_} className={classes.richTextHelpText} />

      <Message error={error} className={classes.message} />

      {/* <Link href={`/create-account${allParams}`}>Create an account</Link> */}
    </form>
  )
}
