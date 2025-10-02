'use client'

import type { Exhibition } from '@/app/payload-types'

import Image from 'next/image'
import { Button } from '@/components/Button'
import { useTranslations } from 'next-intl'
import classes from './index.module.css'
import Chevron from '@/components/SVG/Chevron'
import { createExhibitionLink } from '@/app/_utilities/linkObjects'
import { motion } from 'motion/react'
import { slideInFromRightVariants } from '@/utilities/animationVariants'
import { getImageUrl } from '@/app/_utilities/getImageUrl'
import { formatDateRange } from '@/app/_utilities/formatDate'

type Props = {
  data: Exhibition[]
}

export const HeroExhibition: React.FC<Props> = ({ data }) => {
  const t = useTranslations()

  if (!data || data.length === 0) {
    return null
  }

  const { title, homepageImage, image, dateBegin, dateEnd, relation } = data[0]

  const formatArtistsNames = (artists: (string | { full_name: string })[]) => {
    if (!artists || artists.length === 0) return ''

    const artistNames = artists.map(artist =>
      typeof artist === 'string' ? artist : artist.full_name,
    )

    if (artistNames.length === 1) return artistNames[0]

    const lastArtist = artistNames.pop()
    return `${artistNames.join(', ')} & ${lastArtist}`
  }

  const dateRange = formatDateRange(dateBegin || '', dateEnd || '', 'en-US')

  const imageUrl = homepageImage?.url || image?.url || ''
  const imageAlt = homepageImage?.title || image?.title || ''

  const artistsNames = relation?.artists ? formatArtistsNames(relation.artists) : ''

  return (
    <section className={classes.hero}>
      {imageUrl && <Image src={getImageUrl(imageUrl)} alt={imageAlt} fill priority />}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideInFromRightVariants}
        className={classes.contentContainer}
      >
        <div className={classes.paddingR}>
          <div className={classes.content}>
            <Chevron color="var(--color-black)" size={20} className="iconTopLeft" />
            <div className={classes.info}>
              <p className="spacedTitle">{title}</p>
              {artistsNames && (
                <div className={classes.artworksBy}>
                  <span>
                    {t('withArtworksBy')} {artistsNames}
                  </span>
                </div>
              )}
              <p className="uppercase">{dateRange.display}</p>
              <div className="right">
                <Button link={createExhibitionLink(t('viewNow'), 'primary')} />
              </div>
            </div>
            <Chevron color="var(--color-black)" size={20} className="iconBottomRight" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
