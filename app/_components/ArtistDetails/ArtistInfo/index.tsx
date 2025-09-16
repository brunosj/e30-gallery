import React, { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'

import Image from 'next/image'
import { Artist, Artwork } from '@/app/payload-types'
import { useTranslations } from 'next-intl'
import { RichText } from '@/components/RichText'
import classes from './index.module.css'
import ArrowLeft from '@/components/SVG/ArrowLeft'
import ArrowRight from '@/components/SVG/ArrowRight'
import cn from 'classnames'
import { getImageUrl } from '@/app/_utilities/getImageUrl'
import { RiseLoader } from 'react-spinners'

type Props = {
  artist: Artist
  handleNextClick: () => void
  handlePreviousClick: () => void
  selectedArtistIndex: number
  filteredArtists: Artist[]
}

const artistLink = (link: string, label: string) => {
  return (
    <Link href={link as any} className={classes.artistLink} target="_blank">
      <span>{label}</span>
    </Link>
  )
}

const ArtistInfo: React.FC<Props> = ({
  artist,
  handleNextClick,
  handlePreviousClick,
  selectedArtistIndex,
  filteredArtists,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentArtist, setCurrentArtist] = useState(artist)
  const [artworkLoading, setArtworkLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    setImageLoaded(false)
    setCurrentArtist(artist)
    setArtworkLoading(true)
  }, [artist])

  useEffect(() => {
    if (artist.artworkArchiveCode) {
      // Set loading to false after artwork archive iframe loads
      const handleArtworkLoaded = () => {
        setArtworkLoading(false)
      }

      // Add event listener for when iframe loads
      const embedEl = document.getElementById(
        `aa_embed_${artist.artworkArchiveCode.match(/\/collection\/([^\/]+)\/embed_js\.js/)?.[1]}`,
      )
      if (embedEl) {
        const iframe = embedEl.querySelector('iframe')
        if (iframe) {
          iframe.addEventListener('load', handleArtworkLoaded)
        } else {
          // If no iframe found yet, set a timeout to check again
          const checkInterval = setInterval(() => {
            const newIframe = embedEl.querySelector('iframe')
            if (newIframe) {
              newIframe.addEventListener('load', handleArtworkLoaded)
              clearInterval(checkInterval)
            }
          }, 500)

          // Clear interval after 10 seconds to prevent memory leaks
          setTimeout(() => clearInterval(checkInterval), 10000)
        }
      }
    }
  }, [artist.artworkArchiveCode])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // Enable navigation buttons if there are multiple artists
  const hasArtists = Array.isArray(filteredArtists) && filteredArtists.length > 1
  const hasPrevious = hasArtists
  const hasNext = hasArtists

  return (
    <div className={classes.artistDetails}>
      <div className={classes.artists}>
        <div className={classes.heading}>
          <div className="semibold desktop">
            <p>{t('artists')}</p>
          </div>
          <Link href="/artists" className="controls">
            {t('backToList')}
          </Link>

          <div className={classes.navigationButtons}>
            <button
              onClick={handlePreviousClick}
              disabled={!hasPrevious}
              className={!hasPrevious ? classes.disabled : ''}
            >
              <ArrowLeft color="var(--color-black)" size={25} />
            </button>
            <button
              onClick={handleNextClick}
              disabled={!hasNext}
              className={!hasNext ? classes.disabled : ''}
            >
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
            <div>
              <h2>{artist.full_name}</h2>
              <div className={classes.additionalInfo}>
                <p>{artist.additional_info}</p>
                <p>{artist.country}</p>
              </div>
            </div>
            {/* </motion.div> */}
            <div className={cn(classes.imageArtist, 'mobile')}>
              <Image
                src={
                  typeof artist.image === 'string'
                    ? artist.image
                    : getImageUrl(artist.image?.url || '')
                }
                alt={
                  typeof artist.image === 'string'
                    ? 'Artist Image'
                    : artist.image.title || artist.full_name
                }
                fill
                onLoad={handleImageLoad}
              />
            </div>

            <div>
              <RichText content={artist.bio} className="padding-y-sm" />

              {/* Social links */}
              {(artist.website || artist.instagram) && (
                <div className={classes.socialLinks}>
                  {artist.website && artistLink(artist.website, t('website'))}
                  {artist.instagram && artistLink(artist.instagram, t('instagram'))}
                </div>
              )}
            </div>
          </div>

          <div className={cn(classes.image, 'desktop')}>
            <Image
              key={currentArtist.id}
              src={
                typeof artist.image === 'string'
                  ? artist.image
                  : getImageUrl(artist.image?.url || '')
              }
              alt={
                typeof artist.image === 'string'
                  ? 'Artist Image'
                  : artist.image.title || artist.full_name
              }
              fill
              onLoad={handleImageLoad}
              priority
            />
          </div>
        </div>
        {artist.artworkArchiveCode && (
          <div>
            <div className={classes.work}>
              <div className={classes.heading}>
                <p className="semibold">{t('work')}</p>
              </div>
            </div>
            <div>
              {artworkLoading && (
                <div className="loader">
                  <RiseLoader />
                </div>
              )}
              <div
                id={`aa_embed_${artist.artworkArchiveCode.match(/\/collection\/([^\/]+)\/embed_js\.js/)?.[1]}`}
                style={{ clear: 'both', minHeight: '500px' }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArtistInfo
