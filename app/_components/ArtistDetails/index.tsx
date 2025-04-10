'use client'

import React, { useState, useEffect } from 'react'
import type { Artist, Artwork } from '@/app/payload-types'
import classes from './index.module.css'
import { useRouter } from 'next/navigation'
import ArtistList from '@/app/_components/ArtistDetails/ArtistList'

type Props = {
  artists: Artist[]
  featuredArtwork: Artwork
}

export default function ArtistDetailsV2({ artists, featuredArtwork }: Props) {
  const [filterType, setFilterType] = useState<'represented' | 'featured'>('represented')
  const [hoveredArtwork, setHoveredArtwork] = useState<Artwork | null>(null)
  const router = useRouter()

  const filteredArtists = artists.filter(artist => artist.type === filterType)

  useEffect(() => {
    setHoveredArtwork(featuredArtwork)
  }, [featuredArtwork])

  const handleMouseEnter = (artwork: Artwork | null) => {
    setHoveredArtwork(artwork)
  }

  const handleMouseLeave = () => {
    setHoveredArtwork(featuredArtwork)
  }

  return (
    <section className={classes.section}>
      <ArtistList
        artists={filteredArtists}
        filterType={filterType}
        setFilterType={setFilterType}
        hoveredArtwork={hoveredArtwork}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
    </section>
  )
}
