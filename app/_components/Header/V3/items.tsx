'use client'

import * as React from 'react'
import { Link } from '@/lib/i18n'
import Logo from '../../../../public/E30_logo.png'
import Image from 'next/image'
import { HeaderNav } from '@/components/Header/Nav'
import { Socials } from '@/components/Header/Socials'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import classes from './index.module.css'
import { motion } from 'framer-motion'

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -50,
    opacity: 0,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
}

export const MenuItems = ({}) => {
  return (
    <motion.div
      variants={variants}
      // whileHover={{ scale: 1.1 }}
      // whileTap={{ scale: 0.95 }}
      className={`container ${classes.menuList}`}
    >
      <Link href="/" className={classes.logo}>
        <Image alt="E30 Logo" src={Logo} />
      </Link>
      <HeaderNav />
      <Socials />
      <LanguageSwitcher theme="light" />
    </motion.div>
  )
}
