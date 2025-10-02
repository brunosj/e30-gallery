'use client'

import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Message } from '@/components/Message'

import classes from './index.module.css'

type FormData = {
  email: string
  firstName: string
  lastName: string
  preferences: string[]
}

export const NewsletterForm: React.FC = () => {
  const router = useRouter()
  const t = useTranslations()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preferences, setPreferences] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const preferenceOptions = [
    { key: 'showMeArt', label: t('showMeArt') },
    { key: 'tellMeWhere', label: t('tellMeWhere') },
    { key: 'wantToJoin', label: t('wantToJoin') },
    { key: 'justLooking', label: t('justLooking') },
  ]

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setPreferences(prev => (checked ? [...prev, value] : prev.filter(pref => pref !== value)))
  }

  const onSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            preferences,
          }),
        })

        if (response.ok) {
          router.push('/newsletter-success')
        } else {
          const errorData = await response.json()
          setError(errorData.error || t('subscriptionError'))
        }
      } catch (error) {
        setError(t('subscriptionError'))
      } finally {
        setLoading(false)
      }
    },
    [preferences, router, t],
  )

  const submitButton = {
    className: classes.submit,
    label: loading ? t('subscribing') : t('subscribe'),
    appearance: 'primary' as const,
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h2 className={classes.title}>{t('joinOurNewsletter')}</h2>
        <p className={classes.subtitle}>{t('signUpForNews')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <Input
          name="email"
          label={t('email')}
          required
          register={register}
          error={errors.email}
          type="email"
        />

        <Input
          name="firstName"
          label={t('name')}
          required
          register={register}
          error={errors.firstName}
          type="text"
        />

        <Input
          name="lastName"
          label={t('lastName')}
          required
          register={register}
          error={errors.lastName}
          type="text"
        />

        <div className={classes.checkboxGroup}>
          <p className={classes.checkboxTitle}>{t('weWouldLoveToHear')}</p>
          {preferenceOptions.map(option => (
            <div key={option.key} className={classes.checkboxItem}>
              <input
                type="checkbox"
                id={`newsletter-${option.key}`}
                value={option.key}
                checked={preferences.includes(option.key)}
                onChange={e => handleCheckboxChange(option.key, e.target.checked)}
                className={classes.checkbox}
              />
              <label htmlFor={`newsletter-${option.key}`} className={classes.checkboxLabel}>
                {option.label}
              </label>
            </div>
          ))}
        </div>

        <p className={classes.disclaimer}>{t('unsubscribeAnytime')}</p>

        <Button link={submitButton} action="submit" />

        <Message error={error} className={classes.message} />
      </form>
    </div>
  )
}
