'use client'

import { motion, useCycle } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MenuToggle } from './toggle'
import { Navigation } from './nav'
import classes from './index.module.css'

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 10000}px at calc(98vw - 40px) 45px)`,
    backgroundColor: 'var(--color-white)',
    transition: {
      backgroundColor: {
        ease: 'easeInOut',
        duration: 0.5,
      },
      clipPath: {
        type: 'spring',
        stiffness: 20,
        restDelta: 2,
      },
    },
  }),
  closed: {
    clipPath: 'circle(30px at calc(98vw - 40px) 45px)',
    backgroundColor: 'var(--color-accent)',
    transition: {
      backgroundColor: {
        ease: 'easeInOut',
        duration: 0.5,
      },
      clipPath: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  },
}

export default function HeaderV4() {
  const [isOpen, toggleOpen] = useCycle(true, false)
  const [scrollY, setScrollY] = useState(0)
  const [showToggle, setShowToggle] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      if (currentScrollY === 0) {
        if (!isOpen) {
          toggleOpen()
        }
      } else if (isOpen && currentScrollY > 200) {
        toggleOpen()
      }
    }
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isOpen, toggleOpen])

  useEffect(() => {
    if (!isOpen) {
      setShowToggle(true)
    } else {
      setShowToggle(false)
    }
  }, [isOpen, scrollY])

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      custom="100%"
      className={`${isOpen ? 'navbar-open desktop' : 'navbar-closed desktop'}`} // Apply conditional class
    >
      <motion.div
        className={`${classes.navbar} ${isOpen ? classes['navbar-open'] : classes['navbar-closed']}`}
        variants={sidebar}
      >
        <Navigation />
      </motion.div>
      {showToggle && <MenuToggle toggle={() => toggleOpen()} />}
    </motion.nav>
  )
}
