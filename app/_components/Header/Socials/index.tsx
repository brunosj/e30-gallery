'use client'

import type { Social } from '@/app/payload-types'

import React, { useEffect, useState } from 'react'
import { Link } from '@/lib/i18n'
import Insta from '@/components/SVG/Insta'
import Maps from '@/components/SVG/Maps'

import classes from './index.module.css'

export const Socials: React.FC = () => {
  const [socials, setSocials] = useState<Social | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/globals/socials?locale=en&depth=1`,
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

        const data: Social = await res.json()
        setSocials(data)
      } catch (error) {
        console.error('Failed to fetch menu:', error)
        setError('Failed to fetch menu')
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
        <ul className={classes.socials}>
          {socials.socials.map((item, index) => (
            <li key={index}>
              <Link href={item.url as string} target="_blank">
                {renderSocialIcon(item.platform)}
              </Link>
            </li>
          ))}
          <li className="desktop">
            <p>Egenolff30 St. Frankfurt</p>
          </li>
        </ul>
      )}
    </>
  )
}
