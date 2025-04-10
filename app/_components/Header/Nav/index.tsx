'use client'

import type { Menu } from '@/app/payload-types'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { useLocale } from 'next-intl'
import classes from './index.module.css'
import { Button } from '@/components/Button'
import { usePathname } from 'next/navigation'
import { RiseLoader } from 'react-spinners'
import { motion } from 'framer-motion'
import { fadeInVariants, clipPathVariants } from '@/utilities/animationVariants'

export const HeaderNav: React.FC = () => {
  const pathname = usePathname()
  const { user } = useAuth()
  const [menu, setMenu] = useState<Menu | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const locale = useLocale()

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true)
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
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [locale])

  if (loading) {
    return
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!menu || !menu.nav) {
    return <div>No menu data available</div>
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
          const normalizedPathname = pathname.startsWith('/de/')
            ? pathname.replace('/de', '')
            : pathname

          const isActive =
            normalizedPathname === `/${(item.link?.reference?.value as { slug: string })?.slug}`
          return (
            <li key={index} className={isActive ? 'activeMenuItem' : ''}>
              <Button link={item.link} />
            </li>
          )
        })}
      </ul>
    </motion.div>
  )
}
