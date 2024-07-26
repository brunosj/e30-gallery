'use client'

import React, { useState, useEffect } from 'react'
import type { Artist, Artwork } from '@/app/payload-types'
import classes from './index.module.css'
import { RichText } from '@/components/RichText'
import Image from 'next/image'
import * as m from '@/paraglide/messages.js'
import { Fade } from 'react-awesome-reveal'

type Props = {
  artists: Artist[]
}

export default function ArtistDetails({ artists }: Props) {
  const [selectedArtistIndex, setSelectedArtistIndex] = useState<number | null>(null)
  const [filterType, setFilterType] = useState<'represented' | 'featured'>('represented')
  const [hoveredArtwork, setHoveredArtwork] = useState<Artwork | null>(null)
  const [scriptUrl, setScriptUrl] = useState<string | null>(null)

  const handleArtistClick = (index: number) => {
    setSelectedArtistIndex(index)
  }

  const handleBackClick = () => {
    setSelectedArtistIndex(null)
  }

  const handleNextClick = () => {
    setSelectedArtistIndex(prevIndex => {
      const nextIndex = prevIndex! + 1
      return nextIndex < filteredArtists.length ? nextIndex : prevIndex
    })
  }

  const handlePreviousClick = () => {
    setSelectedArtistIndex(prevIndex => {
      const nextIndex = prevIndex! - 1
      return nextIndex >= 0 ? nextIndex : prevIndex
    })
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

  useEffect(() => {
    if (selectedArtistIndex !== null) {
      const embedScriptUrl = filteredArtists[selectedArtistIndex].artworkArchiveCode
      if (embedScriptUrl) {
        setScriptUrl(embedScriptUrl)
      } else {
        setScriptUrl(null) // Clear scriptUrl if no artworkArchiveCode
      }
    } else {
      setScriptUrl(null) // Clear scriptUrl if no artist is selected
    }
  }, [selectedArtistIndex, filteredArtists])

  useEffect(() => {
    if (scriptUrl) {
      // Create a script tag
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

      // Find the container to append the script
      const containerId = scriptUrl
        ? `aa_embed_${scriptUrl.match(/\/collection\/([^\/]+)\/embed_js\.js/)?.[1]}`
        : ''
      const container = document.getElementById(containerId)

      if (container) {
        container.innerHTML = '' // Clear any existing content
        container.appendChild(script)
      }

      // Cleanup function to remove the script when component unmounts or URL changes
      return () => {
        if (container) {
          container.innerHTML = '' // Clear existing content
        }
      }
    } else {
      // If no scriptUrl, clear out any existing script tags
      const containers = document.querySelectorAll('[id^="aa_embed_"]')
      containers.forEach(container => {
        container.innerHTML = '' // Clear content
      })
    }
  }, [scriptUrl])

  return (
    <section className={classes.section}>
      {selectedArtistIndex === null ? (
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
                <h2>{filteredArtists[selectedArtistIndex].name}</h2>
                <div className={classes.additionalInfo}>
                  <p>{filteredArtists[selectedArtistIndex].additional_info}</p>
                  <p>{filteredArtists[selectedArtistIndex].country}</p>
                </div>
                <div className={[classes.imageArtist, 'mobile'].filter(Boolean).join(' ')}>
                  <Image
                    src={filteredArtists[selectedArtistIndex].image.url}
                    alt={filteredArtists[selectedArtistIndex].title}
                    fill
                  />
                </div>
                <RichText
                  content={filteredArtists[selectedArtistIndex].bio}
                  className="padding-y-sm"
                />
              </div>
              <Fade
                key={filteredArtists[selectedArtistIndex].id}
                duration={1000}
                cascade
                triggerOnce
              >
                <div className={[classes.image, 'desktop'].filter(Boolean).join(' ')}>
                  <Image
                    src={filteredArtists[selectedArtistIndex].image.url}
                    alt={filteredArtists[selectedArtistIndex].image.title}
                    fill
                  />
                </div>
              </Fade>
            </div>
            {selectedArtistIndex !== null && (
              <>
                <div className={classes.work}>
                  <div className={classes.heading}>
                    <p className="semibold">{m.work()}</p>
                  </div>
                </div>
                <div>
                  <div
                    id={`aa_embed_${filteredArtists[selectedArtistIndex]?.artworkArchiveCode?.match(/\/collection\/([^\/]+)\/embed_js\.js/)?.[1]}`}
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
