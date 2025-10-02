'use client'

import { useEffect, useState, useRef } from 'react'
import NewsletterEmbed from '../NewsletterEmbed'
import classes from './index.module.css'

type Props = {
  triggerOnScroll?: boolean
  scrollPercentage?: number
  delayInSeconds?: number
}

const NewsletterPopupComponent = ({
  triggerOnScroll = true,
  scrollPercentage = 30,
  delayInSeconds = 2,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const popupWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if popup has been shown before (only for popup, not embed)
    const hasSeenPopup = sessionStorage.getItem('hasSeenNewsletterPopup')

    // Only show popup if it hasn't been shown before
    if (!hasSeenPopup) {
      if (!triggerOnScroll) {
        // Set a timeout to show popup after page loads
        const timer = setTimeout(() => {
          setIsOpen(true)
        }, delayInSeconds * 1000)

        return () => clearTimeout(timer)
      }
    }
  }, [triggerOnScroll, delayInSeconds])

  useEffect(() => {
    // Only add scroll listener if triggerOnScroll is true and popup hasn't been shown
    if (triggerOnScroll && !sessionStorage.getItem('hasSeenNewsletterPopup')) {
      const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = document.documentElement.clientHeight

        // Calculate percentage scrolled correctly
        const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100

        // Show popup when user scrolls past the specified percentage
        if (scrolled >= scrollPercentage) {
          setIsOpen(true)
          // Remove scroll listener once popup is triggered
          window.removeEventListener('scroll', handleScroll)
        }
      }

      // Check scroll position immediately in case page is already scrolled
      handleScroll()

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [triggerOnScroll, scrollPercentage])

  useEffect(() => {
    // Add event listener for escape key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePopup()
      }
    }

    // Handle clicks outside the popup
    const handleClickOutside = (event: MouseEvent) => {
      if (popupWrapperRef.current && !popupWrapperRef.current.contains(event.target as Node)) {
        closePopup()
      }
    }

    // Only add the event listeners if the popup is open
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      document.addEventListener('mousedown', handleClickOutside)
    }

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const closePopup = () => {
    setIsOpen(false)
    // Store in sessionStorage that user has seen the popup (only affects popup, not embed)
    sessionStorage.setItem('hasSeenNewsletterPopup', 'true')
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

          {/* Newsletter embed component */}
          <NewsletterEmbed />
        </div>
      </div>
    </div>
  )
}

export default NewsletterPopupComponent
