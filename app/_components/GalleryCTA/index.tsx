'use client'

import type { GalleryPage } from '@/app/payload-types'

import Image from 'next/image'
import * as m from '@/paraglide/messages.js'
import classes from './index.module.css'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/Button'
import { textVariants, clipPathVariants } from '@/utilities/animationVariants'
import { motion } from 'framer-motion'

type Props = {
  data: GalleryPage
}

export const GalleryCTA: React.FC<Props> = ({ data }: Props) => {
  const { text, link, backgroundImage } = data

  return (
    <section className="padding-y bg-white">
      <div className={classes.cta}>
        <div className={classes.backgroundImageWrapper}>
          <Image
            src={backgroundImage.url as string}
            alt={backgroundImage.title}
            fill
            className={classes.backgroundImage}
          />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={clipPathVariants}
          className={classes.overlay}
        >
          <RichText content={text} className={classes.text} />
          <div className="desktop">
            <Button link={link} />
          </div>
          <div className="mobile">
            <Button link={link} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
