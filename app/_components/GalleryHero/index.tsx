'use client'

import type { GalleryPage } from '@/app/payload-types'

import { CMSImage } from '@/app/_components/CMSImage'
import { useTranslations } from 'next-intl'
import { RichText } from '../RichText'
import { slideInFromLeftVariants } from '@/utilities/animationVariants'
import { motion } from 'motion/react'

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
        animate="visible"
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
      <div className={classes.image}>
        <CMSImage src={imageHero} alt={imageHero.title} fill priority />
      </div>
    </section>
  )
}
