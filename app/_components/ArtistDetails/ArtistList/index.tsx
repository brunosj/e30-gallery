import React from 'react'
import Image from 'next/image'
import { Artist, Artwork } from '@/app/payload-types'
import * as m from '@/paraglide/messages.js'
import classes from './index.module.css'

type Props = {
  artists: Artist[]
  filterType: 'represented' | 'featured'
  setFilterType: (filterType: 'represented' | 'featured') => void
  handleArtistClick: (index: number) => void
  hoveredArtwork: Artwork | null
  handleMouseEnter: (artwork: Artwork | null) => void
  handleMouseLeave: () => void
}

const ArtistList: React.FC<Props> = ({
  artists,
  filterType,
  setFilterType,
  handleArtistClick,
  hoveredArtwork,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  return (
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
          {artists.map((artist, index) => (
            <li key={artist.id}>
              <button
                onClick={() => handleArtistClick(index)}
                onMouseEnter={() => handleMouseEnter(artist.relation.artworks as Artwork)}
                onMouseLeave={handleMouseLeave}
              >
                {artist.full_name}
              </button>
            </li>
          ))}
        </ul>

        <div className="relative desktop">
          <div className={classes.image}>
            {hoveredArtwork ? (
              <Image
                src={hoveredArtwork.image.url}
                alt={hoveredArtwork.image.title}
                fill
                priority
              />
            ) : (
              <Image
                src={(artists[0]?.relation.artworks as Artwork)?.image.url}
                alt={(artists[0]?.relation.artworks as Artwork)?.image.title}
                fill
                priority
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtistList
