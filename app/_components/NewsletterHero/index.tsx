'use client'

import type { NewsletterPage } from '@/app/payload-types'

import { CMSImage } from '@/app/_components/CMSImage'
import { NewsletterForm } from '@/components/NewsletterForm'
import { clipPathVariants, slideInFromLeftVariants } from '@/utilities/animationVariants'
import { motion } from 'motion/react'
import classes from './index.module.css'

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
        <CMSImage
          src={image}
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
