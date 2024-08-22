'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Navigation } from './nav'
import { MenuToggle } from './toggle'
import classes from './index.module.css'
import { throttle } from 'lodash'

export default function HeaderV4() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY
      const scrollDifference = Math.abs(currentScrollY - lastScrollY)

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY && currentScrollY > 100 && scrollDifference > 30) {
        setIsVisible(true)
      } else if (currentScrollY <= 100) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }, 25)

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ y: -150, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -150, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={classes.navbar}
          >
            <Navigation />
          </motion.nav>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!isVisible && (
          <div className="relative">
            <MenuToggle toggle={() => setIsVisible(true)} />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
