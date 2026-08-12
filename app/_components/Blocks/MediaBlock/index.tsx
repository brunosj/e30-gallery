'use client'

import type { MediaBlock, Media } from '@/app/payload-types'
import { CMSImage } from '@/app/_components/CMSImage'
import cn from 'classnames'
import classes from './index.module.css'

export const MediaBlockComponent: React.FC<MediaBlock> = ({
  caption,
  invertBackground = false,
  media,
  position = 'default',
}) => {
  const image = media as Media

  return (
    <section
      className={cn(classes.wrapper, {
        [classes.inverted]: invertBackground,
        [classes.fullscreen]: position === 'fullscreen',
      })}
    >
      <figure className={classes.figure}>
        <div className={classes.mediaContainer}>
          <CMSImage src={image} alt={image.title} fill className={classes.image} />
        </div>
        {caption && <figcaption className={classes.caption}>{caption}</figcaption>}
      </figure>
    </section>
  )
}
