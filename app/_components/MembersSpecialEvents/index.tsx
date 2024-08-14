import React from 'react'
import Image from 'next/image'
import { RichText } from '../RichText'
import type { MembersOnlyPage } from '@/app/payload-types'
import { motion } from 'framer-motion'
import {
  fadeInVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
} from '@/utilities/animationVariants'
import classes from './index.module.css'

type Props = {
  data: MembersOnlyPage
}

export const MembersSpecialEvents: React.FC<Props> = ({ data }: Props) => {
  const { page_title_special_events, text_special_events, specialEventsImage } = data
  return (
    <section className="container padding-y">
      <motion.h3
        initial="hidden"
        whileInView="visible"
        variants={slideInFromLeftVariants}
        viewport={{ once: true, amount: 0 }}
        className="membersAreaTitle"
      >
        {page_title_special_events}
      </motion.h3>

      <div className={[classes.grid, 'padding-y'].filter(Boolean).join(' ')}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={slideInFromLeftVariants}
          viewport={{ once: true, amount: 0 }}
          className={classes.imageColumn}
        >
          <div className={classes.imageContainer}>
            <Image src={specialEventsImage.url as string} alt={specialEventsImage.title} fill />
          </div>
          <p className={classes.caption}>{specialEventsImage.title}</p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={slideInFromRightVariants}
          viewport={{ once: true, amount: 0 }}
          className={classes.textContainer}
        >
          <RichText content={text_special_events} />
        </motion.div>
      </div>
    </section>
  )
}
