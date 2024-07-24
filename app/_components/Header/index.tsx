'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/lib/i18n'
import Logo from '../../../public/E30_logo.png'
import { HeaderNav } from '@/components/Header/Nav'
import MobileNav from '@/components/Header/MobileNav'
import { Socials } from '@/components/Header/Socials'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Slide } from 'react-awesome-reveal'

import classes from './index.module.css'

export function Header() {
  return (
    <header className="container border-b-black">
      <Slide direction="down" triggerOnce duration={500}>
        <div className={classes.header}>
          <Link href="/" className={classes.logo}>
            <Image alt="E30 Logo" src={Logo} />
          </Link>
          <HeaderNav />
          <MobileNav />
          <div className="desktop">
            <Socials />
          </div>
          <div className="desktop">
            <LanguageSwitcher theme="light" />
          </div>
        </div>
      </Slide>
    </header>
  )
}

export default Header
