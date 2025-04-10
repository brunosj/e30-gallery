'use client'

import type { GalleryPage } from '@/app/payload-types'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { RichText } from '../RichText'
import {
  clipPathVariants,
  fadeInVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
} from '@/utilities/animationVariants'
import { m, motion } from 'framer-motion'
import { getImageUrl } from '@/app/_utilities/getImageUrl'

import classes from './index.module.css'

type Props = {
  data: GalleryPage
}

export const GalleryHero: React.FC<Props> = ({ data }: Props) => {
  const { title, about_text, mission_statement, imageHero } = data
  const t = useTranslations()
  return (
    <section className={classes.grid}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideInFromLeftVariants}
        className={classes.contentColumn}
      >
        <div className="container flex padding-y">
          <div className={classes.content}>
            <p className="">{t('aboutTheGallery')}</p>
            <RichText content={about_text} />
            <div className={classes.flex}>
              <div className={classes.line} />
              <RichText content={mission_statement} />
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div className={classes.image}>
        <Image src={getImageUrl(imageHero?.url || '')} alt={imageHero.title} fill priority />
      </motion.div>
    </section>
  )
}
