'use client'

import type { GalleryPage } from '@/app/payload-types'

import Image from 'next/image'
import classes from './index.module.css'
import { RichText } from '../RichText'
import { fadeInVariants } from '@/utilities/animationVariants'
import { motion } from 'framer-motion'

type Props = {
  data: GalleryPage
}

export const GalleryVision: React.FC<Props> = ({ data }: Props) => {
  const { main_text, textImageBlock } = data

  return (
    <section className={[classes.grid, 'container padding-y'].filter(Boolean).join(' ')}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.9 }}
        variants={fadeInVariants}
        className={classes.leftColumn}
      >
        <div className={classes.image}>
          <Image src={textImageBlock.imageVision.url} alt={textImageBlock.imageVision.title} fill />
        </div>
        <div className={classes.line} />
        <RichText content={textImageBlock.text_under_image} />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.9 }}
        variants={fadeInVariants}
        className={classes.info}
      >
        <div className={classes.content}>
          <RichText content={main_text} />
        </div>
      </motion.div>
    </section>
  )
}
