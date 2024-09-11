'use client'

import type { Artist } from '@/app/payload-types'

import { useRouter, Link } from '@/lib/i18n'
import Image from 'next/image'
import classes from './index.module.css'

export const ArtistListingCard: React.FC<{ item: Artist }> = ({ item }) => {
  const router = useRouter()

  return (
    <Link className={classes.card} href={`/artists/${item.slug}`}>
      <div className={classes.avatar}>
        <Image src={item.image.url as string} alt={item.image.title} fill />
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
              ? (item.relation.artworks.image.url as string)
              : ''
          }
          alt={typeof item.relation.artworks === 'object' ? item.relation.artworks.image.title : ''}
          fill
        />
      </div>
    </Link>
  )
}
