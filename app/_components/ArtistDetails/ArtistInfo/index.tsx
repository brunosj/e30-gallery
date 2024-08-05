import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Fade } from 'react-awesome-reveal'
import { Artist } from '@/app/payload-types'
import * as m from '@/paraglide/messages.js'
import { RichText } from '@/components/RichText'
import classes from './index.module.css'

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

  useEffect(() => {
    setImageLoaded(false)
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
            <button onClick={handlePreviousClick} className={'controls'}>
              {m.previous()}
            </button>
            <button onClick={handleNextClick} className={'controls'}>
              {m.next()}
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className={classes.grid}>
          <div>
            <h2>{artist.name}</h2>
            <div className={classes.additionalInfo}>
              <p>{artist.additional_info}</p>
              <p>{artist.country}</p>
            </div>
            <div className={[classes.imageArtist, 'mobile'].filter(Boolean).join(' ')}>
              <Image
                src={typeof artist.image === 'string' ? artist.image : artist.image.url}
                alt={
                  typeof artist.image === 'string'
                    ? 'Artist Image'
                    : artist.image.alt || artist.name
                }
                fill
                onLoadingComplete={handleImageLoad}
              />
            </div>
            <RichText content={artist.bio} className="padding-y-sm" />
          </div>
          <div className={[classes.image, 'desktop'].filter(Boolean).join(' ')}>
            <Image
              src={typeof artist.image === 'string' ? artist.image : artist.image.url}
              alt={
                typeof artist.image === 'string' ? 'Artist Image' : artist.image.alt || artist.name
              }
              fill
              onLoadingComplete={handleImageLoad}
            />
          </div>
        </div>
        {artist.artworkArchiveCode && (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}

export default ArtistInfo
