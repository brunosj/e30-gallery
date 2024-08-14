'use client'

import type { ArtSocietyPage, Media } from '@/app/payload-types'

import Image from 'next/image'
import { LoginForm } from '@/app/(pages)/art-society/LoginForm'
import Chevron from '@/components/SVG/Chevron'
import {
  fadeInVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
} from '@/utilities/animationVariants'
import { motion } from 'framer-motion'
import classes from './index.module.css'

type Props = {
  data: ArtSocietyPage
}

export const ArtSocietyHero: React.FC<Props> = ({ data }: Props) => {
  const { call_to_action_text, imageHero } = data

  return (
    <div className={classes.grid}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideInFromLeftVariants}
        className={[classes.imageColumn].filter(Boolean).join(' ')}
      >
        <Image src={imageHero.url || ''} alt={imageHero.title} className={classes.image} fill />
        <div className={classes.textOverlay}>
          <div>
            <Chevron color="var(--color-white)" size={20} className={'iconTopLeft'} />
            <h3 className={classes.title}>{call_to_action_text}</h3>
            <Chevron color="var(--color-white)" size={20} className={'iconBottomRight'} />
          </div>
        </div>
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideInFromRightVariants}
        className={classes.formColumn}
      >
        <div className={classes.formContainer}>
          <LoginForm data={data} />
        </div>
      </motion.div>
    </div>
  )
}
