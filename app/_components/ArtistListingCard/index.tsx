'use client'

import type { Artist } from '@/app/payload-types'

import { useRouter, Link } from '@/lib/i18n'
import Image from 'next/image'
import classes from './index.module.css'

export const ArtistListingCard: React.FC<{ item: Artist }> = ({ item }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/artists?id=${item.id}`)
  }

  return (
    <button className={classes.card} onClick={handleClick}>
      <div className={classes.avatar}>
        <Image src={item.image.url || ''} alt={item.image.title} fill />
      </div>
      <div className={classes.content}>
        <div className={classes.info}>
          <span>{item.full_name}</span>
          <p>{item.country}</p>
        </div>
      </div>
      <div className={classes.artwork}>
        <Image
          src={item.relation.artworks.image.url || ''}
          alt={item.relation.artworks.image.title || ''}
          fill
        />
      </div>
    </button>
  )
}
