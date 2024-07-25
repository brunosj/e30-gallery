'use client'

import type { Menu } from '@/app/payload-types'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { languageTag } from '@/paraglide/runtime'
import classes from './index.module.css'
import { Button } from '@/components/Button'
import { usePathname } from 'next/navigation'

export const HeaderNav: React.FC = () => {
  const pathname = usePathname()
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
            credentials: 'include',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
            },
          },
        )

        if (!res.ok) {
          console.error('Failed to fetch:', res.status, res.statusText)
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
    <nav className="desktop">
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
                <Button
                  link={item.link}
                  newTab={item.link.newTab}
                  label={item.link.label}
                  appearance={item.link.appearance}
                />
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}
