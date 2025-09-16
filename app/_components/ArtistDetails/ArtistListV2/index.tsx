'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Artist, Artwork } from '@/app/payload-types'
import { useTranslations } from 'next-intl'
import { motion, Variants } from 'motion/react'
import { fadeInVariants, cascadeVariants } from '@/utilities/animationVariants'
import classes from './index.module.css'
import { getImageUrl } from '@/app/_utilities/getImageUrl'

type Props = {
  artists: Artist[]
  filterType: 'represented' | 'featured'
  setFilterType: (filterType: 'represented' | 'featured') => void
  handleArtistClick: (index: number) => void
  hoveredArtwork: Artwork | null
  handleMouseEnter: (artwork: Artwork | null) => void
  handleMouseLeave: () => void
}

const anim: Variants = {
  initial: { width: 0 },
  open: { width: 'auto', transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
  closed: { width: 0 },
}

const ArtistListV2: React.FC<Props> = ({
  artists,
  filterType,
  setFilterType,
  handleArtistClick,
  hoveredArtwork,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const t = useTranslations()
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInVariants}
    >
      <div className={classes.artists}>
        <div className={classes.heading}>
          <p className="semibold">{t('artists')}</p>
          <div className={classes.filterControls}>
            <button
              onClick={() => setFilterType('represented')}
              disabled={filterType === 'represented'}
              className={filterType === 'represented' ? classes.active : 'controls'}
            >
              {t('represented')}
            </button>
            <button
              onClick={() => setFilterType('featured')}
              disabled={filterType === 'featured'}
              className={filterType === 'featured' ? classes.active : 'controls'}
            >
              {t('featured')}
            </button>
          </div>
        </div>
      </div>
      <div>
        <ul className={classes.list}>
          {artists.map((artist, index) => {
            const firstName = artist.full_name.split(' ')[0]
            const lastNames = artist.full_name.split(' ').slice(1).join(' ')

            return (
              <motion.li
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cascadeVariants(index)}
                key={index}
              >
                <div
                  onClick={() => handleArtistClick(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={classes.project}
                >
                  <p>{firstName}</p>
                  <motion.div
                    variants={anim}
                    animate={activeIndex === index ? 'open' : 'closed'}
                    className={classes.imgContainer}
                  >
                    <Image
                      src={getImageUrl((artist.relation.artworks as Artwork)?.image?.url || '')}
                      alt={(artist.relation.artworks as Artwork)?.image.title}
                      width={100}
                      height={100}
                      priority
                    />
                  </motion.div>
                  <p>{lastNames}</p>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </motion.div>
  )
}

export default ArtistListV2
