'use client'

import type { Artist } from '@/app/payload-types'

import { Link, useRouter } from '@/i18n/navigation'
import { CMSImage } from '@/app/_components/CMSImage'
import classes from './index.module.css'

export const ArtistListingCard: React.FC<{ item: Artist }> = ({ item }) => {
  const router = useRouter()

  const artwork =
    typeof item.relation.artworks === 'object' ? item.relation.artworks : null

  return (
    <Link
      className={classes.card}
      href={{
        pathname: '/artists/[slug]' as const,
        params: { slug: item.slug || '' },
      }}
    >
      <div className={classes.avatar}>
        {typeof item.image !== 'string' && item.image && (
          <CMSImage src={item.image} alt={item.image.title} fill />
        )}
      </div>
      <div className={classes.content}>
        <div className={classes.info}>
          <span>{item.full_name}</span>
          <p>{item.country}</p>
        </div>
      </div>
      <div className={classes.artwork}>
        {artwork?.image && typeof artwork.image !== 'string' && (
          <CMSImage src={artwork.image} alt={artwork.image.title} fill />
        )}
      </div>
    </Link>
  )
}
