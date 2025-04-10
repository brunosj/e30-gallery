'use client'

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from '@/i18n/routing'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Message } from '@/components/Message'
import { useAuth } from '@/providers/Auth'
import { useTranslations } from 'next-intl'

import classes from './index.module.css'

type FormData = {
  email: string
  name: string
  firstName: string
  lastName: string
  password: string
  passwordConfirm: string
}

export const AccountForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, setUser } = useAuth()
  const [changePassword, setChangePassword] = useState(true)
  const router = useRouter()
  const t = useTranslations()

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (user) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/${user.id}`,
          {
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (response.ok) {
          const json = await response.json()
          setUser(json.doc)
          setSuccess(`${t('accountUpdateSuccessfully')}`)
          setError('')
          setChangePassword(false)
          reset({
            email: json.doc.email,
            name: json.doc.name,
            password: '',
            passwordConfirm: '',
            firstName: json.doc.firstName,
            lastName: json.doc.lastName,
          })
        } else {
          setError(`${t('accountUpdateFailed')}`)
        }
      }
    },
    [user, setUser, reset, t],
  )

  useEffect(() => {
    if (user === null) {
      router.push({
        pathname: '/art-society' as const,
        query: { unauthorized: 'account' },
      })
    }
  }, [user, router])

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        password: '',
        passwordConfirm: '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      })
    }
  }, [user, reset])

  const changePasswordLink = {
    className: classes.submit,
    label: isLoading
      ? `${t('processing')}`
      : changePassword
        ? `${t('changePassword')}`
        : `${t('updateAcount')}`,
    appearance: 'primary',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      {/* {!changePassword ? (
        <Fragment>
          <p>
            {m.toChangeYourPassword()}
            <button
              type="button"
              className={classes.changePassword}
              onClick={() => setChangePassword(!changePassword)}
            >
              {m.clickHere()}
            </button>
            .
          </p>

          <p>{m.toChangeYourAccountDetails()}</p>

          <Input
            name="firstName"
            label={m.firstName()}
            required
            register={register}
            error={errors.firstName}
            type="firstName"
          />

          <Input
            name="lastName"
            label={m.lastName()}
            required
            register={register}
            error={errors.lastName}
            type="lastName"
          />
          <Input
            name="email"
            label={m.email()}
            required
            register={register}
            error={errors.email}
            type="email"
          />
        </Fragment>
      ) : ( */}
      <Fragment>
        <h1>{t('account')}</h1>
        <p>{t('thisIsYourAccount')}</p>

        {/* <p>
          {m.changeYourPasswordBelowOr()}{' '}
          <button
            type="button"
            className={classes.changePassword}
            onClick={() => setChangePassword(!changePassword)}
          >
            {m.cancel()}
          </button>
          .
        </p> */}
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
      </Fragment>
      {/* )} */}
      <Button link={changePasswordLink} action="submit" />
      <Message error={error} success={success} className={classes.message} />
    </form>
  )
}
