'use client'

import type { ArtSocietyPage } from '@/app/payload-types'
import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from '@/lib/i18n'
import { useRouter } from '@/lib/i18n'
import { useSearchParams } from 'next/navigation'

import { RichText } from '@/components/RichText'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Message } from '@/components/Message'
import { useAuth } from '@/providers/Auth'
import * as m from '@/paraglide/messages.js'

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
        if (redirect?.current) router.push(redirect.current as string)
        else router.push('/account')
      } catch (_) {
        setError(`${m.errorWithCredentials()}`)
      }
    },
    [login, router],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <p className="semibold">{m.memberLogin()}</p>
      <Input
        name="email"
        label={m.email()}
        required
        register={register}
        error={errors.email}
        type="email"
      />
      <Input
        name="password"
        type="password"
        label={m.password()}
        required
        register={register}
        error={errors.password}
      />
      <Link href={`/recover-password${allParams}`} className="blueLink">
        {m.forgotPassword()}
      </Link>
      <Button
        type="submit"
        disabled={isLoading}
        className={classes.submit}
        label={isLoading ? `${m.processing()}` : `${m.login()}`}
        appearance="primary"
      />
      <RichText content={data?.help_text_} className={classes.richTextHelpText} />

      <Message error={error} className={classes.message} />

      {/* <Link href={`/create-account${allParams}`}>Create an account</Link> */}
    </form>
  )
}
