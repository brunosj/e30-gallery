'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/lib/i18n'
import Logo from '../../../public/E30_logo.png'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { HeaderNav } from '@/components/Header/Nav'
import { Socials } from '@/components/Header/Socials'

import classes from './index.module.css'

export function Header() {
  return (
    <header className="container border-b-black">
      <div className={classes.wrap}>
        <Link href="/" className={classes.logo}>
          <Image alt="E30 Logo" src={Logo} />
        </Link>
        <HeaderNav />
        <Socials />
        <LanguageSwitcher />
      </div>
    </header>
  )
}

export default Header
