'use client'

import type { Social } from '@/app/payload-types'

import React, { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'

import Insta from '@/components/SVG/Insta'
import Maps from '@/components/SVG/Maps'
import { motion, Variants } from 'motion/react'
import classes from './index.module.css'
import { delay } from 'lodash'

const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: 'easeOut',
      delay: 0.2,
    },
  },
}

export const Socials: React.FC = () => {
  const [socials, setSocials] = useState<Social | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/globals/socials?locale=en&depth=1`,
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

        const data: Social = await res.json()
        setSocials(data)
      } catch (error) {
        console.error('Failed to fetch socials:', error)
        setError('Failed to fetch socials')
      }
    }

    fetchSocials()
  }, [])

  if (error) {
    return <div>Error: {error}</div>
  }

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return <Insta color="var(--color-black)" size={20} />
      case 'Google Maps':
        return <Maps color="var(--color-black)" size={22} />
      default:
        return null
    }
  }

  return (
    <>
      {socials && socials.socials && (
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInVariants}
          className={classes.socials}
        >
          {socials.socials.map((item, index) => (
            <li key={index}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.platform}
              >
                {renderSocialIcon(item.platform)}
              </a>
            </li>
          ))}
          <li className="desktop">
            <p>Egenolffstr. 30 Frankfurt</p>
          </li>
        </motion.ul>
      )}
    </>
  )
}
