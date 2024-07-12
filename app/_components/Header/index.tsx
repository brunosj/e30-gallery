import React from 'react'
import Image from 'next/image'
import { Link } from "@/lib/i18n"
import Logo from '../../../public/E30_logo.png'

import { HeaderNav } from './Nav'

import classes from './index.module.css'

export function Header() {
  return (
    <header className={'container py-3'}>
      <div className={classes.wrap}>
        <Link href="/" className={classes.logo}>
          <Image alt="E30 Logo" src={Logo} />
        </Link>
        <HeaderNav />
      </div>
    </header>
  )
}

export default Header
