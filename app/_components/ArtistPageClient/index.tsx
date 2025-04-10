'use client'

import { useEffect, useState } from 'react'
import ArtistInfo from '@/components/ArtistDetails/ArtistInfo'
import type { Artist } from '@/app/payload-types'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

type ArtistPageClientProps = {
  artist: Artist
  locale: string
  allArtists: Artist[]
  currentArtistIndex: number
}

export default function ArtistPageClient({
  artist,
  locale,
  allArtists,
  currentArtistIndex,
}: ArtistPageClientProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist>(artist)
  const [scriptUrl, setScriptUrl] = useState<string | null>(null)
  const router = useRouter()
  const clientLocale = useLocale()

  // Handle artist navigation
  const handleNavigation = (index: number) => {
    const targetArtist = allArtists[index]
    if (targetArtist) {
      const localePrefix = clientLocale === 'en' ? '' : `/${clientLocale}`
      router.replace(`${localePrefix}/artists/${targetArtist.slug}`)
      setSelectedArtist(targetArtist)
    }
  }

  const handleNextClick = () => {
    const nextIndex = (currentArtistIndex + 1) % allArtists.length
    handleNavigation(nextIndex)
  }

  const handlePreviousClick = () => {
    const prevIndex = (currentArtistIndex - 1 + allArtists.length) % allArtists.length
    handleNavigation(prevIndex)
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
      selectedArtistIndex={currentArtistIndex}
      filteredArtists={allArtists}
    />
  ) : (
    <p>Loading artist details...</p>
  )
}
