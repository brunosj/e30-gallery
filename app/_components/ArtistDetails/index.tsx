'use client'

import React, { useState } from 'react'
import type { Artist, Artwork } from '@/app/payload-types'
import classes from './index.module.css'
import { RichText } from '@/components/RichText'
import Image from 'next/image'
import * as m from '@/paraglide/messages.js'
import { Fade, Slide } from 'react-awesome-reveal'
import useProcessedImage from '@/utilities/useProcessedImage'

type Props = {
  artists: Artist[]
}

export default function ArtistDetails({ artists }: Props) {
  const [selectedArtistIndex, setSelectedArtistIndex] = useState<number | null>(null)
  const [filterType, setFilterType] = useState<'represented' | 'featured'>('represented')
  const [hoveredArtwork, setHoveredArtwork] = useState<Artwork | null>(null)

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
                    <Image src={hoveredArtwork.image.url} alt={hoveredArtwork.image.title} fill />
                  </Fade>
                ) : (
                  <Fade duration={750}>
                    <Image
                      src={(filteredArtists[0]?.relation.artworks as Artwork)?.image.url || ''}
                      alt={(filteredArtists[0]?.relation.artworks as Artwork)?.image.title || ''}
                      fill
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
              <Fade key={filteredArtists[selectedArtistIndex].id} duration={1000} cascade>
                <div className={[classes.image, 'desktop'].filter(Boolean).join(' ')}>
                  <Image
                    src={filteredArtists[selectedArtistIndex].image.url}
                    alt={filteredArtists[selectedArtistIndex].image.title}
                    fill
                  />
                </div>
              </Fade>
            </div>
            <div className={classes.work}>
              <div className={classes.heading}>
                <p className="semibold">{m.work()}</p>
              </div>
              <div className={classes.image}>
                <Image
                  src={
                    (filteredArtists[selectedArtistIndex].relation.artworks as Artwork).image.url
                  }
                  alt={
                    (filteredArtists[selectedArtistIndex].relation.artworks as Artwork).image.title
                  }
                  fill
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
