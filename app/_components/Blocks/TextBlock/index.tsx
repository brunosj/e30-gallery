'use client'

import type { TextBlock } from '@/app/payload-types'
import { RichText } from '@/components/RichText'
import { motion } from 'framer-motion'
import { fadeInVariants } from '@/utilities/animationVariants'
import classes from './index.module.css'

export const TextBlockComponent: React.FC<TextBlock> = ({ text_block }) => {
  return (
    <section className={classes.wrapper}>
      <motion.div
        className={classes.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={fadeInVariants}
      >
        <RichText content={text_block} />
      </motion.div>
    </section>
  )
}
