'use client'

import React, { useEffect, useState } from 'react'
import { Link } from '@/lib/i18n'
import { useAuth } from '@/app/_providers/Auth'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { languageTag } from '@/paraglide/runtime'
import classes from './index.module.css'
import { Menu } from '@/app/payload-types'
import * as m from '@/paraglide/messages.js'
import { Button } from '@/components/Button'

export const HeaderNav: React.FC = () => {
  const { user } = useAuth()
  const [menu, setMenu] = useState<Menu | null>(null)
  const [error, setError] = useState<string | null>(null)
  const locale = languageTag() || 'en'

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/globals/menu?locale=${locale}&depth=1`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (!res.ok) {
          throw new Error(`API call failed with status: ${res.status}`)
        }

        const data: Menu = await res.json()
        setMenu(data)
      } catch (error) {
        console.error('Failed to fetch menu:', error)
        setError('Failed to fetch menu')
      }
    }

    fetchMenu()
  }, [locale])

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <nav>
      {menu && menu.nav && (
        <ul className={classes.menu}>
          {menu.nav.map((item, index) => (
            <li key={index}>
              <Button
                href={(item.link?.reference?.value as { slug: string })?.slug}
                newTab={item.link.newTab}
                label={item.link.label}
                appearance={item.link.appearance}
              />
            </li>
          ))}
        </ul>
      )}

      {/* {user ? (
        <React.Fragment>
          <Link href="/account">{m.account()}</Link>
          <Link href="/logout">{m.logout()}</Link>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Link href="/login">{m.login()}</Link>
        </React.Fragment>
      )} */}
    </nav>
  )
}
