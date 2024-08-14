'use client'

import { RichText } from '@/components/RichText'
import type { ArtistsPage } from '@/app/payload-types'
import classes from './index.module.css'
import { fadeInVariants } from '@/utilities/animationVariants'
import { motion } from 'framer-motion'

type Props = {
  data: ArtistsPage
}

export const ArtistPageHero = ({ data }: Props) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={fadeInVariants}
      viewport={{ once: true, amount: 0.2 }}
      className={classes.text}
    >
      <RichText content={data.text} />
    </motion.div>
  )
}
