'use client'

import type { Menu } from '@/app/payload-types'
import { useState, useEffect, useRef } from 'react'
import { Socials } from '@/components/Header/Socials'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Squash as Hamburger } from 'hamburger-react'
import { useAuth } from '@/providers/Auth'
import { languageTag } from '@/paraglide/runtime'
import classes from './index.module.css'
import { Button } from '@/components/Button'
import { usePathname } from 'next/navigation'
import { Link } from '@/lib/i18n'
import Settings from '@/components/SVG/Settings'
import * as m from '@/paraglide/messages.js'

const MobileNavMembersArea: React.FC = () => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setOpen] = useState(false)
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
          <Hamburger toggled={isOpen} toggle={setOpen} size={22} color="var(--color-white)" />
        </nav>
        <div
          ref={menuRef}
          className={`${classes.bgFixed} ${isOpen ? classes.open : classes.closed}`}
        >
          <div className={[classes.flexColumn, 'container'].filter(Boolean).join(' ')}>
            <div className={classes.menuContainer}>
              <Button
                href="/exhibitions"
                label={m.exhibitions()}
                appearance={'default'}
                onClick={handleCloseMenu}
              />
              <Button
                href="/artists"
                label={m.artists()}
                appearance={'default'}
                onClick={handleCloseMenu}
              />
              <Link href="/account" onClick={handleCloseMenu}>
                <div className={classes.settings}>
                  <p>{m.account()}</p>
                  <Settings color="var(--color-black)" size={22} />
                </div>
              </Link>
              <Button href="/logout" appearance="primary" label="Log out" />
              <Socials />
              <LanguageSwitcher theme="light" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default MobileNavMembersArea
