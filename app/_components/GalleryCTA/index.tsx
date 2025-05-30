'use client'

import type { GalleryPage } from '@/app/payload-types'

import Image from 'next/image'
import { getImageUrl } from '@/app/_utilities/getImageUrl'
import { useTranslations } from 'next-intl'
import classes from './index.module.css'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/Button'
import { textVariants, clipPathVariants } from '@/utilities/animationVariants'
import { motion } from 'framer-motion'
import { LinkObject } from '@/app/types'
type Props = {
  data: GalleryPage
}

export const GalleryCTA: React.FC<Props> = ({ data }: Props) => {
  const t = useTranslations()
  const { text, link, backgroundImage } = data

  return (
    <section className="padding-y bg-white">
      <div className={classes.cta}>
        <div className={classes.backgroundImageWrapper}>
          <Image
            src={getImageUrl(backgroundImage?.url || '')}
            alt={backgroundImage.title}
            fill
            className={classes.backgroundImage}
          />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={clipPathVariants}
          className={classes.overlay}
        >
          <RichText content={text} className={classes.text} />
          <div className="desktop">
            <Button link={link as LinkObject} />
          </div>
          <div className="mobile">
            <Button link={link as LinkObject} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
