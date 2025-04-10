'use client'

import type { Artist } from '@/app/payload-types'

import { useRouter, Link } from '@/i18n/routing'
import Image from 'next/image'
import { getImageUrl } from '@/app/_utilities/getImageUrl'
import classes from './index.module.css'

export const ArtistListingCard: React.FC<{ item: Artist }> = ({ item }) => {
  const router = useRouter()

  return (
    <Link
      className={classes.card}
      href={{
        pathname: '/artists/[slug]' as const,
        params: { slug: item.slug || '' },
      }}
    >
      <div className={classes.avatar}>
        <Image src={getImageUrl(item.image?.url || '')} alt={item.image.title} fill />
      </div>
      <div className={classes.content}>
        <div className={classes.info}>
          <span>{item.full_name}</span>
          <p>{item.country}</p>
        </div>
      </div>
      <div className={classes.artwork}>
        <Image
          src={
            typeof item.relation.artworks === 'object'
              ? getImageUrl(item.relation.artworks.image?.url || '')
              : ''
          }
          alt={typeof item.relation.artworks === 'object' ? item.relation.artworks.image.title : ''}
          fill
        />
      </div>
    </Link>
  )
}
