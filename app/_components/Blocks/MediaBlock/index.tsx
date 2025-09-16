'use client'

import type { MediaBlock, Media } from '@/app/payload-types'
import Image from 'next/image'
import cn from 'classnames'
import { motion } from 'motion/react'
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
      <div className={classes.mediaContainer}>
        <Image
          src={getImageUrl(image?.url || '')}
          alt={image.title}
          fill
          className={classes.image}
        />
      </div>
    </section>
  )
}
