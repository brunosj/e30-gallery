import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Artist } from '@/app/payload-types'
import * as m from '@/paraglide/messages.js'
import { RichText } from '@/components/RichText'
import classes from './index.module.css'
import ArrowLeft from '@/components/SVG/ArrowLeft'
import ArrowRight from '@/components/SVG/ArrowRight'
import { motion } from 'framer-motion'
import {
  fadeInVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
} from '@/utilities/animationVariants'

type Props = {
  artist: Artist
  handleBackClick: () => void
  handleNextClick: () => void
  handlePreviousClick: () => void
  selectedArtistIndex: number | null
  filteredArtists: Artist[]
}

const ArtistInfo: React.FC<Props> = ({
  artist,
  handleBackClick,
  handleNextClick,
  handlePreviousClick,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentArtist, setCurrentArtist] = useState(artist)

  useEffect(() => {
    setImageLoaded(false)
    setCurrentArtist(artist)
  }, [artist])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <div className={classes.artistDetails}>
      <div className={classes.artists}>
        <div className={classes.heading}>
          <div className="semibold desktop">
            <p>{m.artists()}</p>
          </div>
          <button onClick={handleBackClick} className="controls">
            {m.backToList()}
          </button>

          <div className={classes.navigationButtons}>
            <button onClick={handlePreviousClick}>
              <ArrowLeft color="var(--color-black)" size={25} />
            </button>
            <button onClick={handleNextClick}>
              <ArrowRight color="var(--color-black)" size={25} />
            </button>
          </div>
        </div>
      </div>
      <div>
        {/* {!imageLoaded && (
          <div className={classes.loader}>
            <RiseLoader color="var(--color-black)" size={15} />
          </div>
        )} */}
        <div className={classes.grid}>
          <div>
            {imageLoaded && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideInFromLeftVariants}
              >
                <h2>{artist.full_name}</h2>
                <div className={classes.additionalInfo}>
                  <p>{artist.additional_info}</p>
                  <p>{artist.country}</p>
                </div>
              </motion.div>
            )}
            <div className={[classes.imageArtist, 'mobile'].filter(Boolean).join(' ')}>
              <Image
                src={typeof artist.image === 'string' ? artist.image : (artist.image.url as string)}
                alt={
                  typeof artist.image === 'string'
                    ? 'Artist Image'
                    : artist.image.title || artist.full_name
                }
                fill
                onLoad={handleImageLoad}
              />
            </div>
            {imageLoaded && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideInFromLeftVariants}
              >
                <RichText content={artist.bio} className="padding-y-sm" />
              </motion.div>
            )}
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInFromRightVariants}
            className={[classes.image, 'desktop'].filter(Boolean).join(' ')}
          >
            <Image
              key={currentArtist.image.url}
              src={typeof artist.image === 'string' ? artist.image : (artist.image.url as string)}
              alt={
                typeof artist.image === 'string'
                  ? 'Artist Image'
                  : artist.image.title || artist.full_name
              }
              fill
              onLoad={handleImageLoad}
              priority
            />
          </motion.div>
        </div>
        {artist.artworkArchiveCode && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInVariants}
          >
            <div className={classes.work}>
              <div className={classes.heading}>
                <p className="semibold">{m.work()}</p>
              </div>
            </div>
            <div>
              <div
                id={`aa_embed_${artist.artworkArchiveCode.match(/\/collection\/([^\/]+)\/embed_js\.js/)?.[1]}`}
                style={{ clear: 'both', minHeight: '500px' }}
              ></div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ArtistInfo
