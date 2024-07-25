'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/lib/i18n'
import Logo from '../../../public/E30_logo.png'
import MobileNav from '@/components/Header/MobileNav'

import classes from './index.module.css'

export function HeaderMobile() {
  return (
    <header className="container border-b-black mobile">
      <div className={classes.header}>
        <Link href="/" className={classes.logo}>
          <Image alt="E30 Logo" src={Logo} />
        </Link>
        <MobileNav />
      </div>
    </header>
  )
}

export default HeaderMobile