'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Link } from '@/lib/i18n'
import Logo from '../../../public/E30_logo.png'
import { Squash as Hamburger } from 'hamburger-react'
import { HeaderNav } from '@/components/Header/Nav'
import { Socials } from '@/components/Header/Socials'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import classes from './index.module.css'
import { set, throttle } from 'lodash'
import { motion } from 'framer-motion'
import { fadeInVariants } from '@/app/_utilities/animationVariants'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }, 200)

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleToggle = () => {
    setIsScrolled(!isScrolled)
  }
  return (
    <motion.header
      className={`container sticky desktop ${isScrolled ? classes.scrolledDown : ''} ${classes.wrapper}`}
    >
      <div className={classes.header}>
        {!isScrolled && (
          <>
            <Link href="/" className={classes.logo}>
              <Image alt="E30 Logo" src={Logo} />
            </Link>
            <div className={classes.navContainer}>
              <HeaderNav />
              <Socials />
            </div>
            <div className={classes.languageSwitcher}>
              <LanguageSwitcher theme="light" />
            </div>
          </>
        )}
      </div>
      <div className={classes.hamburgerContainer}>
        <div className={`container`}>
          <div className={classes.hamburgerBg}>
            <Hamburger size={20} color="var(--color-black)" toggle={handleToggle} />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
