'use client'

import type { Menu } from '@/app/payload-types'
import type { LinkObject } from '@/app/types'
import { useState, useEffect, useRef } from 'react'
import { Socials } from '@/components/Header/Socials'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Squash as Hamburger } from 'hamburger-react'
import { useAuth } from '@/providers/Auth'
import { useLocale } from 'next-intl'
import classes from './index.module.css'
import { Button } from '@/components/Button'
import { usePathname } from 'next/navigation'
import cn from 'classnames'

const MobileNav: React.FC = () => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setOpen] = useState(false)
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

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add(classes.noScroll)
    } else {
      document.body.classList.remove(classes.noScroll)
    }

    return () => {
      document.body.classList.remove(classes.noScroll)
    }
  }, [isOpen])

  const handleCloseMenu = () => {
    setOpen(false)
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <nav className="mobile">
      <div className={classes.relativeFlex}>
        <nav>
          <Hamburger toggled={isOpen} toggle={setOpen} size={22} color="var(--color-black)" />
        </nav>
        <div
          ref={menuRef}
          className={`${classes.bgFixed} ${isOpen ? classes.open : classes.closed}`}
        >
          <div className={cn(classes.flexColumn, 'container')}>
            <div className={classes.menuContainer}>
              {menu && menu.nav && (
                <ul className={classes.menu}>
                  {menu.nav.map((item, index) => {
                    const normalizedPathname = pathname.startsWith('/de/')
                      ? pathname.replace('/de', '')
                      : pathname

                    const isActive =
                      normalizedPathname ===
                      `/${(item.link?.reference?.value as { slug: string })?.slug}`
                    return (
                      <li key={index} className={isActive ? classes.activeMenuItem : ''}>
                        <Button link={item.link as LinkObject} onClick={handleCloseMenu} />
                      </li>
                    )
                  })}
                </ul>
              )}
              <Socials />
              <LanguageSwitcher theme="light" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default MobileNav
