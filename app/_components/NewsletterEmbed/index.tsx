'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Logo from '@/public/E30_logo.png'
import { Button } from '@/components/Button'

import classes from './index.module.css'

type Props = {
  code?: string // Keep for backward compatibility but not used
}

const NewsletterEmbed = ({ code }: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    preferences: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const preferenceOptions = [
    { key: 'showMeArt', label: t('showMeArt') },
    { key: 'tellMeWhere', label: t('tellMeWhere') },
    { key: 'wantToJoin', label: t('wantToJoin') },
    { key: 'justLooking', label: t('justLooking') },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    console.log('Checkbox changed:', { value, checked }) // Debug log
    setFormData(prev => {
      const newPreferences = checked
        ? [...prev.preferences, value]
        : prev.preferences.filter(pref => pref !== value)
      console.log('New preferences:', newPreferences) // Debug log
      return {
        ...prev,
        preferences: newPreferences,
      }
    })
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = t('pleaseEnterValidEmail')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('pleaseEnterValidEmail')
    }

    if (!formData.firstName) {
      newErrors.firstName = t('pleaseEnterName')
    }

    if (!formData.lastName) {
      newErrors.lastName = t('pleaseEnterLastName')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      console.log('Submitting form data:', formData) // Debug log
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/newsletter-success')
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || t('subscriptionError') })
      }
    } catch (error) {
      setErrors({ submit: t('subscriptionError') })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={classes.newsletterForm}>
      <div className={classes.logoContainer}>
        <Image src={Logo} alt="E30 Gallery" width={120} height={60} />
      </div>

      <h2 className={classes.title}>{t('joinOurNewsletter')}</h2>
      <p className={classes.subtitle}>{t('signUpForNews')}</p>

      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.inputGroup}>
          <label htmlFor="email" className={classes.label}>
            {t('email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`${classes.input} ${errors.email ? classes.inputError : ''}`}
            required
          />
          {errors.email && <span className={classes.error}>{errors.email}</span>}
        </div>

        <div className={classes.inputGroup}>
          <label htmlFor="firstName" className={classes.label}>
            {t('name')}
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`${classes.input} ${errors.firstName ? classes.inputError : ''}`}
            required
          />
          {errors.firstName && <span className={classes.error}>{errors.firstName}</span>}
        </div>

        <div className={classes.inputGroup}>
          <label htmlFor="lastName" className={classes.label}>
            {t('lastName')}
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`${classes.input} ${errors.lastName ? classes.inputError : ''}`}
            required
          />
          {errors.lastName && <span className={classes.error}>{errors.lastName}</span>}
        </div>

        <div className={classes.checkboxGroup}>
          <p className={classes.checkboxTitle}>{t('weWouldLoveToHear')}</p>
          {preferenceOptions.map(option => (
            <div key={option.key} className={classes.checkboxLabel}>
              <input
                type="checkbox"
                id={`preference-${option.key}`}
                value={option.key}
                checked={formData.preferences.includes(option.key)}
                onChange={handleCheckboxChange}
                className={classes.checkbox}
              />
              <label htmlFor={`preference-${option.key}`} className={classes.checkboxText}>
                {option.label}
              </label>
            </div>
          ))}
        </div>

        <p className={classes.disclaimer}>{t('unsubscribeAnytime')}</p>

        {errors.submit && <div className={classes.submitError}>{errors.submit}</div>}

        <Button
          action="submit"
          disabled={isSubmitting}
          link={{
            label: isSubmitting ? t('subscribing') : t('subscribe'),
            appearance: 'primary',
          }}
        />
      </form>
    </div>
  )
}

export default NewsletterEmbed
