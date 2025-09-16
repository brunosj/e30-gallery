'use client'

import { useEffect, useState, useRef } from 'react'
import NewsletterEmbed from '../NewsletterEmbed'
import classes from './index.module.css'

type Props = {
  code: string
  triggerOnScroll?: boolean
  scrollPercentage?: number
  delayInSeconds?: number
}

const NewsletterPopupComponent = ({
  code,
  triggerOnScroll = true,
  scrollPercentage = 30,
  delayInSeconds = 2,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const popupWrapperRef = useRef<HTMLDivElement>(null)

  const hasSeenThisSession = () => {
    return sessionStorage.getItem('hasSeenNewsletterPopupSession') === 'true'
  }

  useEffect(() => {
    if (!triggerOnScroll && !hasSeenThisSession()) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, delayInSeconds * 1000)

      return () => clearTimeout(timer)
    }
  }, [triggerOnScroll, delayInSeconds])

  useEffect(() => {
    if (triggerOnScroll && !hasSeenThisSession()) {
      const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = document.documentElement.clientHeight
        const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100

        if (scrolled >= scrollPercentage) {
          setIsOpen(true)
          window.removeEventListener('scroll', handleScroll)
        }
      }

      handleScroll()
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [triggerOnScroll, scrollPercentage])

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePopup()
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (popupWrapperRef.current && !popupWrapperRef.current.contains(event.target as Node)) {
        closePopup()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const closePopup = () => {
    setIsOpen(false)
    // Mark popup as seen for this session
    sessionStorage.setItem('hasSeenNewsletterPopupSession', 'true')
  }

  if (!isOpen) return null
  return (
    <div className={classes.popupOverlay}>
      <div ref={popupWrapperRef} className={classes.popupWrapper}>
        <div className={classes.popupContainer}>
          <button onClick={closePopup} className={classes.closeButton} aria-label="Close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <NewsletterEmbed code={code} />
        </div>
      </div>
    </div>
  )
}

export default NewsletterPopupComponent
