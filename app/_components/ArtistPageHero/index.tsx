'use client'

import { RichText } from '@/components/RichText'
import type { ArtistsPage } from '@/app/payload-types'
import classes from './index.module.css'
import {
  fadeInVariants,
  slideInFromLeftVariants,
  clipPathVariants,
} from '@/utilities/animationVariants'
import { motion } from 'framer-motion'
import cn from 'classnames'

type Props = {
  data: ArtistsPage
}

export const ArtistPageHero = ({ data }: Props) => {
  return (
    <section className={classes.text}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={slideInFromLeftVariants}
        viewport={{ once: true }}
      >
        <RichText content={data.text} />
      </motion.div>
    </section>
  )
}
