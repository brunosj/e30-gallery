'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/lib/i18n'
import Logo from '../../../public/E30_logo.png'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Button } from '@/components/Button'
import Settings from '@/components/SVG/Settings'
import { useAuth } from '@/providers/Auth'
import * as m from '@/paraglide/messages.js'
import MobileNavMembersArea from '@/components/HeaderMembersArea/MobileNav'
import { LogOutLink } from '@/app/_utilities/linkObjects'
import cn from 'classnames'

import classes from './index.module.css'

export function HeaderMembersArea() {
  const { user } = useAuth()
  return (
    <header className={classes.header}>
      <div className={cn(classes.wrap, 'container')}>
        <div className={classes.left}>
          <Link href="/" className={classes.logo}>
            <Image alt="E30 Logo" src={Logo} />
          </Link>

          {user && (
            <div className={classes.welcome}>
              <h4 className={classes.subtitle}>{`${m.welcome()}, ${user?.firstName}!`}</h4>
            </div>
          )}
        </div>
        <nav className="desktop">
          <div className={classes.nav}>
            <Link href="/account">
              <Settings color="var(--color-white)" size={30} />
            </Link>
            <Button link={LogOutLink()} />
            <LanguageSwitcher theme="dark" />
          </div>
        </nav>
        <nav className="mobile">
          <MobileNavMembersArea />
        </nav>
      </div>
    </header>
  )
}

export default HeaderMembersArea
