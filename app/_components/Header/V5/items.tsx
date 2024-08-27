'use client'

import * as React from 'react'
import { Link } from '@/lib/i18n'
import Logo from '@/public/E30_logo.png'
import Image from 'next/image'
import { HeaderNav } from '@/components/Header/Nav'
import { Socials } from '@/components/Header/Socials'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import classes from './index.module.css'
import { motion } from 'framer-motion'

export const MenuItems = ({}) => {
  return (
    <li className={`container ${classes.menuList}`}>
      <Link href="/" className={classes.logo}>
        <Image alt="E30 Logo" src={Logo} />
      </Link>
      <HeaderNav />
      <Socials />
      <LanguageSwitcher theme="light" />
    </li>
  )
}
