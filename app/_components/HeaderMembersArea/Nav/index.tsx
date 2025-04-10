'use client'

import type { Menu } from '@/app/payload-types'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/_providers/Auth'
import { useLocale } from 'next-intl'
import classes from './index.module.css'
import { Button } from '@/components/Button'
import { usePathname } from 'next/navigation'

export const HeaderNav: React.FC = () => {
  const pathname = usePathname()
  const { user } = useAuth()
  const [menu, setMenu] = useState<Menu | null>(null)
  const [error, setError] = useState<string | null>(null)
  const locale = useLocale()

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
          {menu.nav.map((item, index) => {
            const normalizedPathname = pathname.startsWith('/de/')
              ? pathname.replace('/de', '')
              : pathname

            const isActive =
              normalizedPathname === `/${(item.link?.reference?.value as { slug: string })?.slug}`
            return (
              <li key={index} className={isActive ? classes.activeMenuItem : ''}>
                <Button link={item.link} />
              </li>
            )
          })}
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
