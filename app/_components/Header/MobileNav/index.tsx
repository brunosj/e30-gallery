'use client'

import type { LinkObject } from '@/app/types'
import { useState, useEffect, useRef } from 'react'
import { Socials } from '@/components/Header/Socials'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Squash as Hamburger } from 'hamburger-react'
import { usePathname } from '@/i18n/navigation'
import classes from './index.module.css'
import { Button } from '@/components/Button'
import cn from 'classnames'
import { useMenu } from '@/providers/Menu'
import { hrefMatchesPath, resolveLinkHref } from '@/app/_utilities/linkHref'

const MobileNav: React.FC = () => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setOpen] = useState(false)
  const pathname = usePathname()
  const menu = useMenu()

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

  return (
    <nav className={classes.root} aria-label="Main menu">
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
              {menu?.nav && (
                <ul className={classes.menu}>
                  {menu.nav.map((item, index) => {
                    const itemHref = resolveLinkHref(item.link as LinkObject)
                    const isActive = hrefMatchesPath(itemHref, pathname)

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
