'use client'

import React, { useState, useEffect } from 'react'
import type { Artist, Artwork } from '@/app/payload-types'
import classes from './index.module.css'
import { useRouter } from '@/lib/i18n'
import { useSearchParams } from 'next/navigation'
import ArtistList from '@/components/ArtistDetails/ArtistList'
import ArtistInfo from '@/components/ArtistDetails/ArtistInfo'

type Props = {
  artists: Artist[]
}

export default function ArtistDetails({ artists }: Props) {
  const searchParams = useSearchParams()
  const idParam = searchParams.get('id')
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [selectedArtistIndex, setSelectedArtistIndex] = useState<number | null>(null)
  const [filterType, setFilterType] = useState<'represented' | 'featured'>('represented')
  const [hoveredArtwork, setHoveredArtwork] = useState<Artwork | null>(null)
  const [scriptUrl, setScriptUrl] = useState<string | null>(null)
  const router = useRouter()

  const filteredArtists = artists.filter(artist => artist.type === filterType)

  useEffect(() => {
    const artistId = searchParams.get('id')
    if (artistId) {
      const artist = artists.find(a => a.id === artistId)
      if (artist) {
        setSelectedArtist(artist)
        const index = filteredArtists.findIndex(a => a.id === artistId)
        setSelectedArtistIndex(index >= 0 ? index : null)
      } else {
        console.warn('Artist not found:', artistId)
        setSelectedArtist(null)
      }
    } else {
      setSelectedArtist(null)
    }
  }, [searchParams, artists, filterType, filteredArtists])

  useEffect(() => {
    if (selectedArtist) {
      const embedScriptUrl = selectedArtist.artworkArchiveCode
      if (embedScriptUrl) {
        setScriptUrl(embedScriptUrl)
      } else {
        setScriptUrl(null)
      }
    } else {
      setScriptUrl(null)
    }
  }, [selectedArtist])

  useEffect(() => {
    if (scriptUrl) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = scriptUrl
      script.onload = () => {
        console.log('Script loaded successfully')
      }
      script.onerror = e => {
        console.error('Error loading script:', e)
      }

      const containerId = scriptUrl
        ? `aa_embed_${scriptUrl.match(/\/(collection|artist)\/([^\/]+)\/embed_js\.js/)?.[2]}`
        : ''
      const container = document.getElementById(containerId)

      if (container) {
        container.innerHTML = ''
        container.appendChild(script)
      }

      return () => {
        if (container) {
          container.innerHTML = ''
        }
      }
    } else {
      const containers = document.querySelectorAll('[id^="aa_embed_"]')
      containers.forEach(container => {
        container.innerHTML = ''
      })
    }
  }, [scriptUrl])

  const handleArtistClick = (index: number) => {
    if (index >= 0 && index < filteredArtists.length) {
      const artistId = filteredArtists[index]?.id
      if (artistId) {
        setSelectedArtistIndex(index)
        router.push(`/artists?id=${artistId}`, { scroll: false })
      }
    }
  }

  const handleBackClick = () => {
    setSelectedArtist(null)
    setSelectedArtistIndex(null)
    router.push('/artists', { scroll: false })
  }

  const handleNextClick = () => {
    if (selectedArtistIndex !== null) {
      const nextIndex = (selectedArtistIndex + 1) % filteredArtists.length
      handleArtistClick(nextIndex)
    }
  }

  const handlePreviousClick = () => {
    if (selectedArtistIndex !== null) {
      const prevIndex = (selectedArtistIndex - 1 + filteredArtists.length) % filteredArtists.length
      handleArtistClick(prevIndex)
    }
  }

  const handleMouseEnter = (artwork: Artwork | null) => {
    setHoveredArtwork(artwork)
  }

  const handleMouseLeave = () => {
    setHoveredArtwork(null)
  }

  return (
    <section className={classes.section}>
      {selectedArtist === null ? (
        <ArtistList
          artists={filteredArtists}
          filterType={filterType}
          setFilterType={setFilterType}
          handleArtistClick={handleArtistClick}
          hoveredArtwork={hoveredArtwork}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      ) : (
        <ArtistInfo
          artist={selectedArtist}
          handleBackClick={handleBackClick}
          handleNextClick={handleNextClick}
          handlePreviousClick={handlePreviousClick}
          selectedArtistIndex={selectedArtistIndex}
          filteredArtists={filteredArtists}
        />
      )}
    </section>
  )
}
