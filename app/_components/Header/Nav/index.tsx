'use client'

import React from 'react'
import { usePathname } from '@/i18n/navigation'
import classes from './index.module.css'
import { Button } from '@/components/Button'
import { motion } from 'motion/react'
import { fadeInVariants } from '@/utilities/animationVariants'
import type { LinkObject } from '@/app/types'
import { useMenu } from '@/providers/Menu'
import { hrefMatchesPath, resolveLinkHref } from '@/app/_utilities/linkHref'

export const HeaderNav: React.FC = () => {
  const pathname = usePathname()
  const menu = useMenu()

  if (!menu?.nav?.length) {
    return (
      <nav className="desktop" aria-hidden>
        <ul className={classes.menu} />
      </nav>
    )
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInVariants}
      className="desktop"
    >
      <ul className={classes.menu}>
        {menu.nav.map((item, index) => {
          const itemHref = resolveLinkHref(item.link as LinkObject)
          const isActive = hrefMatchesPath(itemHref, pathname)

          return (
            <li key={index} className={isActive ? 'activeMenuItem' : ''}>
              <Button link={item.link as LinkObject} />
            </li>
          )
        })}
      </ul>
    </motion.div>
  )
}
