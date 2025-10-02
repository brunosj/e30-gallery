'use client'

import type { NewsletterPage, Media } from '@/app/payload-types'

import Image from 'next/image'
import { NewsletterForm } from '@/components/NewsletterForm'
import { clipPathVariants, slideInFromLeftVariants } from '@/utilities/animationVariants'
import { motion } from 'motion/react'
import classes from './index.module.css'
import { getImageUrl } from '@/app/_utilities/getImageUrl'

type Props = {
  data: NewsletterPage
}

export const NewsletterHero: React.FC<Props> = ({ data }: Props) => {
  const { text, image } = data

  return (
    <div className={classes.grid}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideInFromLeftVariants}
        className={classes.imageColumn}
      >
        <Image
          src={getImageUrl(image?.url || '')}
          alt={image?.title || 'Newsletter'}
          className={classes.image}
          fill
        />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={clipPathVariants}
        className={classes.formColumn}
      >
        <div className={classes.formContainer}>
          <NewsletterForm />
        </div>
      </motion.div>
    </div>
  )
}
