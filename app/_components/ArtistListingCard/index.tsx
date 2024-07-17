import type { Artist } from '@/app/payload-types'

import Image from 'next/image'
import classes from './index.module.css'

export const ArtistListingCard: React.FC<{ artist: Artist }> = ({ artist }) => {
  return (
    <div className={classes.card}>
      <div className={classes.content}>
        <div className={classes.avatar}>
          <Image src={artist.image.url} alt={artist.image.alt} fill />
        </div>
        <div className={classes.info}>
          <h3>{artist.name}</h3>
          <p>{artist.country}</p>
        </div>
      </div>
      <div className={classes.artwork}>
        <Image
          src={artist.relation.artworks.image.url}
          alt={artist.relation.artworks.image.title}
          fill
        />
      </div>
    </div>
  )
}
