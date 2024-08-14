'use client'

import type { GalleryPage } from '@/app/payload-types'

import Image from 'next/image'
import * as m from '@/paraglide/messages.js'
import { RichText } from '../RichText'
import {
  fadeInVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
} from '@/utilities/animationVariants'
import { motion } from 'framer-motion'

import classes from './index.module.css'

type Props = {
  data: GalleryPage
}

export const GalleryHero: React.FC<Props> = ({ data }: Props) => {
  const { title, about_text, mission_statement, imageHero } = data

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
            <p className="">{m.aboutTheGallery()}</p>
            <RichText content={about_text} />
            <div className={classes.flex}>
              <div className={classes.line} />
              <RichText content={mission_statement} />
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideInFromRightVariants}
        className={classes.image}
      >
        <Image src={imageHero.url as string} alt={imageHero.title} fill priority />
      </motion.div>
    </section>
  )
}
