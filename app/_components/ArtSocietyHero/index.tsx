'use client'

import type { ArtSocietyPage } from '@/app/payload-types'

import { CMSImage } from '@/app/_components/CMSImage'
import { LoginForm } from '@/app/[locale]/art-society/LoginForm'
import Chevron from '@/components/SVG/Chevron'
import {
  clipPathVariants,
  fadeInVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
} from '@/utilities/animationVariants'
import { motion } from 'motion/react'
import classes from './index.module.css'
import cn from 'classnames'

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
        className={classes.imageColumn}
      >
        <CMSImage
          src={imageHero}
          alt={imageHero.title}
          className={classes.image}
          fill
        />
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
        variants={clipPathVariants}
        className={classes.formColumn}
      >
        <div className={classes.formContainer}>
          <LoginForm data={data} />
        </div>
      </motion.div>
    </div>
  )
}
