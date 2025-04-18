'use client'

import type { LinkObject } from '@/app/types'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '../Button'
import { createArtistLink } from '@/app/_utilities/linkObjects'

export default function ArtistViewAllButton() {
  const t = useTranslations()
  const artistLink = createArtistLink(t('viewAll'), 'default')

  return <Button link={artistLink as LinkObject} />
}
