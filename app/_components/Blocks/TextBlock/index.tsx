'use client'

import type { TextBlock } from '@/app/payload-types'
import { RichText } from '@/components/RichText'
import { motion } from 'motion/react'
import { fadeInVariants } from '@/utilities/animationVariants'
import classes from './index.module.css'

export const TextBlockComponent: React.FC<TextBlock> = ({ text_block }) => {
  return (
    <section className={classes.wrapper}>
      <div className={classes.container}>
        <RichText content={text_block} />
      </div>
    </section>
  )
}
