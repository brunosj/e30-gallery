'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

type Props = {
  code: string
}

// Global MailerLite management
declare global {
  interface Window {
    MailerLiteObject?: any
    ml?: any
    mlQueue?: any[]
  }
}

const NewsletterEmbed = ({ code }: Props) => {
  const t = useTranslations()
  const formRef = useRef<HTMLDivElement>(null)
  const [isBlocked, setIsBlocked] = useState(false)

  // Detect if adblocker is blocking MailerLite
  useEffect(() => {
    const checkBlocked = setTimeout(() => {
      if (formRef.current && !formRef.current.innerHTML.trim()) {
        setIsBlocked(true)
      }
    }, 2000) // Check after 3 seconds

    return () => clearTimeout(checkBlocked)
  }, [])

  useEffect(() => {
    if (!code || !formRef.current) return

    const initializeForm = () => {
      // Always inject a fresh script - each component gets its own
      const script = document.createElement('script')
      script.innerHTML = code
      script.id = `mailerlite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      document.head.appendChild(script)

      // Prepare form for initialization
      if (formRef.current) {
        formRef.current.removeAttribute('data-initialized')
        formRef.current.removeAttribute('data-mailerlite-form')
        // Don't clear innerHTML - let MailerLite handle it
      }

      // Multiple initialization attempts with different strategies and timing
      const initStrategies = [
        // Strategy 1: Immediate execution + init
        () => {
          try {
            eval(code)
            if (window.MailerLiteObject && typeof window.MailerLiteObject.init === 'function') {
              window.MailerLiteObject.init()
            }
            if (window.ml && typeof window.ml === 'function') {
              window.ml('init')
            }
          } catch (error) {
            // Silent fail - other strategies will handle it
          }
        },

        // Strategy 2: Wait then init
        () => {
          setTimeout(() => {
            try {
              if (window.MailerLiteObject) {
                if (typeof window.MailerLiteObject.init === 'function') {
                  window.MailerLiteObject.init()
                }
                if (typeof window.MailerLiteObject.load === 'function') {
                  window.MailerLiteObject.load()
                }
              }
            } catch (error) {
              // Silent fail - other strategies will handle it
            }
          }, 200)
        },

        // Strategy 3: Re-execute + init
        () => {
          setTimeout(() => {
            try {
              eval(code)
              setTimeout(() => {
                if (window.MailerLiteObject && typeof window.MailerLiteObject.init === 'function') {
                  window.MailerLiteObject.init()
                }
                if (window.ml && typeof window.ml === 'function') {
                  window.ml('init')
                }
              }, 100)
            } catch (error) {
              // Silent fail - multiple strategies ensure reliability
            }
          }, 400)
        },
      ]

      // Execute all strategies
      initStrategies.forEach((strategy, index) => {
        setTimeout(() => strategy(), index * 100)
      })

      // Cleanup function for this specific script
      return () => {
        script.remove()
      }
    }

    // Start initialization after a brief delay
    const cleanup = setTimeout(() => {
      const scriptCleanup = initializeForm()
      return scriptCleanup
    }, 50)

    return () => {
      clearTimeout(cleanup)
    }
  }, [code])

  if (isBlocked) {
    return (
      <div
        style={{
          padding: '20px',
          // border: '1px solid #ddd',
          // borderRadius: '4px',
          textAlign: 'center',
        }}
      >
        <h3>{t('newsletterSignup')}</h3>
        <p>{t('adblockerMessage')}</p>
        <p>
          {t('adblockerInstructionsBefore')}{' '}
          <a href="/newsletter" style={{ color: '#0066cc' }}>
            {t('visitNewsletterPage')}
          </a>{' '}
          {t('adblockerInstructionsAfter')}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Newsletter Form Container - using generic classes to avoid adblocker detection */}
      <div
        ref={formRef}
        className="newsletter-form embedded-form ml-embedded"
        data-form="ylMNsi"
      ></div>
    </div>
  )
}

export default NewsletterEmbed
