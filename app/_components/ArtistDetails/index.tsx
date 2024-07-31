'use client'

import React, { useState, useEffect } from 'react'
import type { Artist, Artwork } from '@/app/payload-types'
import classes from './index.module.css'
import { RichText } from '@/components/RichText'
import Image from 'next/image'
import * as m from '@/paraglide/messages.js'
import { Fade } from 'react-awesome-reveal'
import { useRouter, Link } from '@/lib/i18n'
import { useSearchParams } from 'next/navigation'

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

  useEffect(() => {
    if (idParam) {
      const artist = artists.find(artist => artist.id === idParam)
      if (artist) {
        setSelectedArtist(artist)
        const index = artists.findIndex(a => a.id === artist.id)
        setSelectedArtistIndex(index)
      } else {
        console.warn('Artist not found:', idParam)
        setSelectedArtist(null)
      }
    }
  }, [idParam, artists])

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
        ? `aa_embed_${scriptUrl.match(/\/collection\/([^\/]+)\/embed_js\.js/)?.[1]}`
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
    const artistId = filteredArtists[index]?.id
    if (artistId) {
      router.push(`/artists?id=${artistId}`, { scroll: false })
    }
  }

  const handleBackClick = () => {
    router.push('/artists', { scroll: false })
    setSelectedArtist(null)
    setSelectedArtistIndex(null)
  }

  const handleNextClick = () => {
    if (selectedArtistIndex !== null) {
      const nextIndex = selectedArtistIndex + 1
      if (nextIndex < filteredArtists.length) {
        handleArtistClick(nextIndex)
      }
    }
  }

  const handlePreviousClick = () => {
    if (selectedArtistIndex !== null) {
      const prevIndex = selectedArtistIndex - 1
      if (prevIndex >= 0) {
        handleArtistClick(prevIndex)
      }
    }
  }

  const handleMouseEnter = (artwork: Artwork | null) => {
    setHoveredArtwork(artwork)
  }

  const handleMouseLeave = () => {
    setHoveredArtwork(null)
  }

  const NextButton = ({ onClick, isDisabled }: { onClick: () => void; isDisabled: boolean }) => (
    <button
      onClick={onClick}
      className={isDisabled ? classes.disabled : 'controls'}
      disabled={isDisabled}
    >
      {m.next()}
    </button>
  )

  const PreviousButton = ({
    onClick,
    isDisabled,
  }: {
    onClick: () => void
    isDisabled: boolean
  }) => (
    <button
      onClick={onClick}
      className={isDisabled ? classes.disabled : 'controls'}
      disabled={isDisabled}
    >
      {m.previous()}
    </button>
  )

  const filteredArtists = artists.filter(artist => artist.type === filterType)

  return (
    <section className={classes.section}>
      {selectedArtist === null ? (
        <div>
          <div className={classes.artists}>
            <div className={classes.heading}>
              <p className="semibold">{m.artists()}</p>
              <div className={classes.filterControls}>
                <button
                  onClick={() => setFilterType('represented')}
                  disabled={filterType === 'represented'}
                  className={filterType === 'represented' ? classes.active : 'controls'}
                >
                  {m.represented()}
                </button>
                <button
                  onClick={() => setFilterType('featured')}
                  disabled={filterType === 'featured'}
                  className={filterType === 'featured' ? classes.active : 'controls'}
                >
                  {m.featured()}
                </button>
              </div>
            </div>
          </div>
          <div className={classes.grid}>
            <ul className={classes.list}>
              {filteredArtists.map((artist, index) => (
                <li key={artist.id}>
                  <button
                    onClick={() => handleArtistClick(index)}
                    onMouseEnter={() => handleMouseEnter(artist.relation.artworks as Artwork)}
                    // onMouseLeave={handleMouseLeave}
                    className="controls"
                  >
                    {artist.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="relative">
              <div className={classes.image}>
                {hoveredArtwork ? (
                  <Fade duration={750}>
                    <Image
                      src={hoveredArtwork.image.url}
                      alt={hoveredArtwork.image.title}
                      fill
                      priority
                    />
                  </Fade>
                ) : (
                  <Fade duration={750}>
                    <Image
                      src={(filteredArtists[0]?.relation.artworks as Artwork)?.image.url}
                      alt={(filteredArtists[0]?.relation.artworks as Artwork)?.image.title}
                      fill
                      priority
                    />
                  </Fade>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={classes.artistDetails}>
          <div className={classes.artists}>
            <div className={classes.heading}>
              <div className="semibold">
                <p>{m.artists()}</p>
              </div>
              <button onClick={handleBackClick} className="controls">
                {m.backToList()}
              </button>

              <div className={classes.navigationButtons}>
                <PreviousButton
                  onClick={handlePreviousClick}
                  isDisabled={selectedArtistIndex === 0}
                />
                <NextButton
                  onClick={handleNextClick}
                  isDisabled={selectedArtistIndex === filteredArtists.length - 1}
                />
              </div>
            </div>
          </div>
          <div>
            <div className={classes.grid}>
              <div>
                <h2>{selectedArtist.name}</h2>
                <div className={classes.additionalInfo}>
                  <p>{selectedArtist.additional_info}</p>
                  <p>{selectedArtist.country}</p>
                </div>
                <div className={[classes.imageArtist, 'mobile'].filter(Boolean).join(' ')}>
                  <Image
                    src={
                      typeof selectedArtist.image === 'string'
                        ? selectedArtist.image
                        : selectedArtist.image.url
                    }
                    alt={
                      typeof selectedArtist.image === 'string'
                        ? 'Artist Image'
                        : selectedArtist.image.alt || selectedArtist.name
                    }
                    fill
                  />
                </div>
                <RichText content={selectedArtist.bio} className="padding-y-sm" />
              </div>
              <Fade key={selectedArtist.id} duration={1000} cascade triggerOnce>
                <div className={[classes.image, 'desktop'].filter(Boolean).join(' ')}>
                  <Image
                    src={
                      typeof selectedArtist.image === 'string'
                        ? selectedArtist.image
                        : selectedArtist.image.url
                    }
                    alt={
                      typeof selectedArtist.image === 'string'
                        ? 'Artist Image'
                        : selectedArtist.image.alt || selectedArtist.name
                    }
                    fill
                  />
                </div>
              </Fade>
            </div>
            {selectedArtist.artworkArchiveCode && (
              <>
                <div className={classes.work}>
                  <div className={classes.heading}>
                    <p className="semibold">{m.work()}</p>
                  </div>
                </div>
                <div>
                  <div
                    id={`aa_embed_${selectedArtist.artworkArchiveCode.match(/\/collection\/([^\/]+)\/embed_js\.js/)?.[1]}`}
                    style={{ clear: 'both', minHeight: '500px' }}
                  ></div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
