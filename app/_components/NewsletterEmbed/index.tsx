'use client'

import { useEffect, useRef } from 'react'

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
  const formRef = useRef<HTMLDivElement>(null)

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

  return (
    <div>
      {/* MailerLite Form Container */}
      <div ref={formRef} className="ml-embedded" data-form="ylMNsi"></div>
    </div>
  )
}

export default NewsletterEmbed
