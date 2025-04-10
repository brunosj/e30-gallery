'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'

import Logo from '@/public/E30_logo.png'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Button } from '@/components/Button'
import Settings from '@/components/SVG/Settings'
import { useAuth } from '@/providers/Auth'
import { useTranslations } from 'next-intl'
import MobileNavMembersArea from '@/components/HeaderMembersArea/MobileNav'
import { LogOutLink } from '@/app/_utilities/linkObjects'
import cn from 'classnames'

import classes from './index.module.css'

export function HeaderMembersArea() {
  const { user } = useAuth()
  const t = useTranslations()
  return (
    <header className={classes.header}>
      <div className={cn(classes.wrap, 'container')}>
        <div className={classes.left}>
          <Link href={'/' as any} className={classes.logo}>
            <Image alt="E30 Logo" src={Logo} />
          </Link>

          {user && (
            <div className={classes.welcome}>
              <h4 className={classes.subtitle}>{`${t('welcome')}, ${user?.firstName}!`}</h4>
            </div>
          )}
        </div>
        <nav className="desktop">
          <div className={classes.nav}>
            <Link href={'/account' as any}>
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
