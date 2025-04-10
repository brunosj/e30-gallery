'use client'

import type { Exhibition } from '@/app/payload-types'

import Image from 'next/image'
import { Button } from '@/components/Button'
import { useTranslations } from 'next-intl'
import classes from './index.module.css'
import Chevron from '@/components/SVG/Chevron'
import { createExhibitionLink } from '@/app/_utilities/linkObjects'
import { RichText } from '@/components/RichText'
import { motion } from 'framer-motion'
import {
  fadeInVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
} from '@/utilities/animationVariants'
import { getImageUrl } from '@/app/_utilities/getImageUrl'

type Props = {
  data: Exhibition[]
}

export const HeroExhibition: React.FC<Props> = ({ data }) => {
  const t = useTranslations()

  if (!data || data.length === 0) {
    return null
  }

  const { title, homepageImage, image, dateBegin, dateEnd, text, artworks_by } = data[0]

  const begin = dateBegin
    ? new Date(dateBegin)
        .toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
        })
        .split(' ')
        .reverse()
        .join(' ')
    : ''

  const end = dateEnd
    ? new Date(dateEnd)
        .toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
        })
        .split(' ')
        .reverse()
        .join(' ')
    : ''

  const beginYear = dateBegin ? new Date(dateBegin).getFullYear() : null
  const endYear = dateEnd ? new Date(dateEnd).getFullYear() : null

  const imageUrl = homepageImage?.url || image?.url || ''
  const imageAlt = homepageImage?.title || image?.title || ''

  return (
    <section className={classes.hero}>
      {imageUrl && <Image src={getImageUrl(imageUrl)} alt={imageAlt} fill priority />}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={slideInFromRightVariants}
        className={classes.contentContainer}
      >
        <div className={classes.paddingR}>
          <div className={classes.content}>
            <Chevron color="var(--color-black)" size={20} className="iconTopLeft" />
            <div className={classes.info}>
              <p className="spacedTitle">{title}</p>
              {artworks_by && (
                <div className={classes.artworksBy}>
                  <span>
                    {t('withArtworksBy')} {artworks_by}
                  </span>
                </div>
              )}
              <p className="uppercase">
                {begin} {beginYear && endYear && beginYear !== endYear ? beginYear : ''} - {end}{' '}
                {endYear}
              </p>
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
