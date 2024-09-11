'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ArtistInfo from '@/components/ArtistDetails/ArtistInfo'
import type { Artist } from '@/app/payload-types'

type ArtistPageClientProps = {
  artist: Artist
  locale: string
}

export default function ArtistPageClient({ artist, locale }: ArtistPageClientProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(artist)
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([])
  const [selectedArtistIndex, setSelectedArtistIndex] = useState<number | null>(null)
  const [scriptUrl, setScriptUrl] = useState<string | null>(null)

  // Fetch all artists based on locale for navigation
  useEffect(() => {
    async function fetchArtists() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/artist?locale=${locale}&depth=2&limit=0`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
            },
          },
        )
        const { docs } = await response.json()
        setFilteredArtists(docs as Artist[])
        const index = docs.findIndex((a: Artist) => {
          return a.slug?.trim().toLowerCase() === artist.slug?.trim().toLowerCase()
        })

        setSelectedArtistIndex(index >= 0 ? index : null)
      } catch (error) {
        console.error('Error fetching artists:', error)
      }
    }

    if (artist.slug) {
      fetchArtists()
    }
  }, [locale, artist.slug])

  // Handle artist navigation
  const handleNavigation = (index: number) => {
    const targetArtist = filteredArtists[index]
    if (targetArtist) {
      setSelectedArtist(targetArtist)
      setSelectedArtistIndex(index)
    }
  }

  const handleNextClick = () => {
    if (selectedArtistIndex !== null) {
      const nextIndex = (selectedArtistIndex + 1) % filteredArtists.length
      handleNavigation(nextIndex)
    }
  }

  const handlePreviousClick = () => {
    if (selectedArtistIndex !== null) {
      const prevIndex = (selectedArtistIndex - 1 + filteredArtists.length) % filteredArtists.length
      handleNavigation(prevIndex)
    }
  }

  // Handle script loading
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
      } else {
        console.warn('Container not found:', containerId)
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

  return selectedArtist ? (
    <ArtistInfo
      artist={selectedArtist}
      handleNextClick={handleNextClick}
      handlePreviousClick={handlePreviousClick}
      selectedArtistIndex={selectedArtistIndex}
      filteredArtists={filteredArtists}
    />
  ) : (
    <p>Loading artist details...</p>
  )
}
