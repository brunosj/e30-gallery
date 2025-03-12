'use client'

import React from 'react'
import { Link } from '@/lib/i18n'
import Image from 'next/image'
import { Artist, Artwork } from '@/app/payload-types'
import * as m from '@/paraglide/messages.js'
import { motion } from 'framer-motion'
import { fadeInVariants, cascadeVariants } from '@/utilities/animationVariants'
import classes from './index.module.css'
import { getImageUrl } from '@/app/_utilities/getImageUrl'

type Props = {
  artists: Artist[]
  filterType: 'represented' | 'featured'
  setFilterType: (filterType: 'represented' | 'featured') => void
  hoveredArtwork: Artwork | null
  handleMouseEnter: (artwork: Artwork | null) => void
  handleMouseLeave: () => void
}

const ArtistListV1: React.FC<Props> = ({
  artists,
  filterType,
  setFilterType,
  hoveredArtwork,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInVariants}
    >
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
            <motion.li
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cascadeVariants(index)}
              key={index}
            >
              <Link
                href={`/artists/${artist.slug}`}
                onMouseEnter={() => handleMouseEnter(artist.relation.artworks as Artwork)}
                onMouseLeave={handleMouseLeave}
              >
                {artist.full_name}
              </Link>
            </motion.li>
          ))}
        </ul>

        <div className="relative desktop">
          <div className={classes.image}>
            {hoveredArtwork ? (
              <Image
                src={getImageUrl(hoveredArtwork.image?.url || '')}
                alt={hoveredArtwork.image?.title}
                fill
                priority
              />
            ) : (
              <Image
                src={getImageUrl((artists[0]?.relation.artworks as Artwork)?.image?.url || '')}
                alt={(artists[0]?.relation.artworks as Artwork)?.image?.title}
                fill
                priority
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ArtistListV1
