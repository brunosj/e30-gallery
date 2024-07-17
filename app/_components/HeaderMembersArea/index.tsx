'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/lib/i18n'
import Logo from '../../../public/E30_logo.png'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Button } from '@/components/Button'
import { useAuth } from '@/providers/Auth'
import Settings from '@/components/SVG/Settings'
import * as m from '@/paraglide/messages.js'

import classes from './index.module.css'

export function HeaderMembersArea() {
  const { user } = useAuth()
  console.log(user)
  return (
    <header className={classes.header}>
      <div className={[classes.wrap, 'container'].filter(Boolean).join(' ')}>
        <div className={classes.left}>
          <Link href="/" className={classes.logo}>
            <Image alt="E30 Logo" src={Logo} />
          </Link>

          {user && (
            <div className={classes.welcome}>
              <h3 className={classes.subtitle}>{`${m.welcome()}, ${user?.firstName}!`}</h3>
            </div>
          )}
        </div>
        {/* <HeaderNav /> */}
        {/* <Socials /> */}
        <div className={classes.nav}>
          <Link href="/account">
            <Settings color="var(--color-white)" size={30} />
          </Link>
          <Button href="/logout" appearance="secondary" label="Log out" />
          <LanguageSwitcher theme="dark" />
        </div>
      </div>
    </header>
  )
}

export default HeaderMembersArea
