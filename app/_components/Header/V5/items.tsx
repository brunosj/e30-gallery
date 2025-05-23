'use client'

import * as React from 'react'
import { Link } from '@/i18n/navigation'

import Image from 'next/image'
import { HeaderNav } from '@/components/Header/Nav'
import { Socials } from '@/components/Header/Socials'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import classes from './index.module.css'
import { motion } from 'framer-motion'

export const MenuItems = ({}) => {
  return (
    <li className={`container ${classes.menuList}`}>
      <Link href={'/' as any}>
        <Image alt="E30 Logo" src="/E30_logo.png?v=1" width={75} height={75} />
      </Link>
      <HeaderNav />
      <Socials />
      <LanguageSwitcher theme="light" />
    </li>
  )
}
