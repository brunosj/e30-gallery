'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/lib/i18n'
import Logo from '../../../public/E30_logo.png'
import LanguageSwitcher from '../LanguageSwitcher'
import { HeaderNav } from './Nav'

import classes from './index.module.css'

export function Header() {
  return (
    <header className="container">
      <div className={classes.wrap}>
        <Link href="/" className={classes.logo}>
          <Image alt="E30 Logo" src={Logo} />
        </Link>
        <HeaderNav />
        <LanguageSwitcher />
      </div>
    </header>
  )
}

export default Header
