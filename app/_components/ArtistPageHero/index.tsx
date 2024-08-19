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
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={clipPathVariants}
      viewport={{ once: true, amount: 0.2 }}
      className={cn(classes.text, 'padding-y')}
    >
      <RichText content={data.text} />
    </motion.div>
  )
}
