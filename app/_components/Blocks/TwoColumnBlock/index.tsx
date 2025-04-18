'use client'

import type { TwoColumnBlock, Media } from '@/app/payload-types'
import { LinkObject } from '@/app/types'
import Image from 'next/image'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/Button'
import { motion } from 'framer-motion'
import {
  fadeInVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
} from '@/utilities/animationVariants'
import cn from 'classnames'
import classes from './index.module.css'
import { getImageUrl } from '@/app/_utilities/getImageUrl'

export const TwoColumnBlockComponent: React.FC<TwoColumnBlock> = ({
  invertOrder,
  columnText,
  columnImage,
}) => {
  const image = columnImage.image as Media
  return (
    <div className={classes.grid}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3, once: true }}
        variants={invertOrder ? slideInFromRightVariants : slideInFromLeftVariants}
        className={cn(
          'container padding-y',
          classes.textColumn,
          classes[`${columnText.size}`],
          invertOrder ? classes.order2 : classes.order1,
          invertOrder ? 'text-right' : '',
        )}
      >
        {columnText.title && <h1 className={classes.title}>{columnText.title}</h1>}
        <p className="semibold">{columnText.subtitle}</p>
        {columnText.content && (
          <div>
            <RichText content={columnText.content} />
          </div>
        )}
        {columnText.addLink && columnText.link && <Button link={columnText.link as LinkObject} />}
      </motion.div>
      <div
        className={cn(
          classes.imageColumn,
          classes[`${columnImage.size}`],
          invertOrder ? classes.order1 : classes.order2,
        )}
      >
        <Image src={getImageUrl(image?.url || '')} alt={image.title} fill />
      </div>
    </div>
  )
}
