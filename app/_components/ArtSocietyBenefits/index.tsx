'use client'

import type { ArtSocietyPage, Media } from '@/app/payload-types'

import { CMSImage } from '@/app/_components/CMSImage'
import Chevron from '@/components/SVG/Chevron'
import classes from './index.module.css'
import { RichText } from '../RichText'
import {
  fadeInVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
} from '@/utilities/animationVariants'
import { motion } from 'motion/react'
import cn from 'classnames'

type Props = {
  data: ArtSocietyPage
}

export const ArtSocietyBenefits: React.FC<Props> = ({ data }: Props) => {
  const { benefits, benefitsVideo } = data
  const image = benefitsVideo as Media

  return (
    <div className={classes.grid}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInVariants}
        className={classes.columnLeft}
      >
        <div className={classes.benefitsContent}>
          <RichText content={benefits} className={classes.benefitsList} />
        </div>
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInVariants}
        className={classes.columnRight}
      >
        <div className={classes.imageContents}>
          <div className={cn(classes.imageContainer)}>
            <CMSImage
              src={image}
              alt={image.title}
              className={classes.image}
              fill
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
