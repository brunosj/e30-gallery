'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/lib/i18n'
import Logo from '../../../public/E30_logo.png'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { HeaderNav } from '@/components/Header/Nav'
import { Socials } from '@/components/Header/Socials'
import { Button } from '@/components/Button'
import { useAuth } from '@/providers/Auth'

import classes from './index.module.css'

export function HeaderMembersArea() {
  const { user } = useAuth()
  // console.log(user)
  return (
    <header className={classes.header}>
      <div className={[classes.wrap, 'container'].filter(Boolean).join(' ')}>
        <Link href="/" className={classes.logo}>
          <Image alt="E30 Logo" src={Logo} />
        </Link>
        {/* <HeaderNav /> */}
        {/* <Socials /> */}
        <div className={classes.nav}>
          <Button href="/logout" appearance="secondary" label="Log out" />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}

export default HeaderMembersArea
