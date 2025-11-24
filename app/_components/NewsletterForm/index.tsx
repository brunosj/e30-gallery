'use client'

import React, { useCallback, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Turnstile } from '@marsidev/react-turnstile'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Message } from '@/components/Message'

import classes from './index.module.css'

type FormData = {
  email: string
  firstName: string
  lastName: string
  preferences: string[]
  website?: string // Honeypot field
}

export const NewsletterForm: React.FC = () => {
  const router = useRouter()
  const t = useTranslations()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preferences, setPreferences] = useState<string[]>([])
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<any>(null)

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

      // Check honeypot field (should be empty)
      if (data.website) {
        setError(t('subscriptionError'))
        setLoading(false)
        return
      }

      // Check if Turnstile token is available
      if (!turnstileToken) {
        setError(t('pleaseCompleteCaptcha'))
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            preferences,
            turnstileToken,
          }),
        })

        if (response.ok) {
          router.push('/newsletter-success')
        } else {
          const errorData = await response.json()
          setError(errorData.error || t('subscriptionError'))
          // Reset Turnstile on error
          if (turnstileRef.current) {
            turnstileRef.current.reset()
            setTurnstileToken(null)
          }
        }
      } catch (error) {
        setError(t('subscriptionError'))
        // Reset Turnstile on error
        if (turnstileRef.current) {
          turnstileRef.current.reset()
          setTurnstileToken(null)
        }
      } finally {
        setLoading(false)
      }
    },
    [preferences, router, t, turnstileToken],
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

        {/* Honeypot field - hidden from users but bots often fill it */}
        <input
          type="text"
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
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

        <div className={classes.turnstileContainer}>
          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={token => setTurnstileToken(token)}
            onError={() => {
              setTurnstileToken(null)
              setError(t('captchaError'))
            }}
            onExpire={() => {
              setTurnstileToken(null)
              setError(t('captchaExpired'))
            }}
          />
        </div>

        <Button link={submitButton} action="submit" />

        <Message error={error} className={classes.message} />
      </form>
    </div>
  )
}
