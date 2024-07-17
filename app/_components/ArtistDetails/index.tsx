'use client'

import { useState } from 'react'
import type { Artist, Artwork } from '@/app/payload-types'
import classes from './index.module.css'
import { RichText } from '@/components//RichText'
import Image from 'next/image'
import * as m from '@/paraglide/messages.js'
import { Button } from '@/components/Button'

type Props = {
  artists: Artist[]
  featuredArtwork: Artwork
}

export default function ArtistDetails({ artists, featuredArtwork }: Props) {
  const [selectedArtistIndex, setSelectedArtistIndex] = useState<number | null>(null)
  const [filterType, setFilterType] = useState<'represented' | 'featured'>('represented')

  const handleArtistClick = (index: number) => {
    setSelectedArtistIndex(index)
  }

  const handleBackClick = () => {
    setSelectedArtistIndex(null)
  }

  const handleNextClick = () => {
    setSelectedArtistIndex(prevIndex => {
      const nextIndex = prevIndex! + 1
      return nextIndex < artists.length ? nextIndex : prevIndex
    })
  }

  const handlePreviousClick = () => {
    setSelectedArtistIndex(prevIndex => {
      const nextIndex = prevIndex! - 1
      return nextIndex >= 0 ? nextIndex : prevIndex
    })
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
                  <button onClick={() => handleArtistClick(index)} className={'controls'}>
                    {artist.name}
                  </button>
                </li>
              ))}
            </ul>
            <div className="controls">
              <Image src={featuredArtwork.image.url} alt={featuredArtwork.image.title} fill />
            </div>
          </div>
        </div>
      ) : (
        <div className={classes.artistDetails}>
          <div className={classes.artists}>
            <div className={classes.heading}>
              <div className="semibold">
                <p> {m.artists()}</p>
              </div>
              <button onClick={handleBackClick} className={'controls'}>
                {' '}
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
                <RichText
                  content={filteredArtists[selectedArtistIndex].bio}
                  className="padding-y-sm"
                />
              </div>
              <div className="relative">
                <Image
                  src={filteredArtists[selectedArtistIndex].image.url}
                  alt={filteredArtists[selectedArtistIndex].title}
                  fill
                />
              </div>
            </div>
            <div className={classes.artists}>
              <div className={classes.heading}>
                <p className="semibold">{m.work()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
