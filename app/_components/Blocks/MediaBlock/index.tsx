'use client'

import type { MediaBlock, Media } from '@/app/payload-types'
import Image from 'next/image'
import cn from 'classnames'
import { motion } from 'framer-motion'
import { fadeInVariants } from '@/utilities/animationVariants'
import classes from './index.module.css'
import { getImageUrl } from '@/app/_utilities/getImageUrl'

export const MediaBlockComponent: React.FC<MediaBlock> = ({
  invertBackground = false,
  position = 'default',
  media,
}) => {
  const image = media as Media

  return (
    <section
      className={cn(classes.wrapper, {
        [classes.inverted]: invertBackground,
        [classes.fullscreen]: position === 'fullscreen',
      })}
    >
      <motion.div
        className={classes.mediaContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInVariants}
      >
        <Image
          src={getImageUrl(image?.url || '')}
          alt={image.title}
          fill
          className={classes.image}
        />
      </motion.div>
    </section>
  )
}
