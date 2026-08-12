'use client'

import type { ArtSocietyPage } from '@/app/payload-types'

import { CMSImage } from '@/app/_components/CMSImage'
import { LoginForm } from '@/app/[locale]/art-society/LoginForm'
import Chevron from '@/components/SVG/Chevron'
import { clipPathVariants, fadeInVariants } from '@/utilities/animationVariants'
import { motion } from 'motion/react'
import classes from './index.module.css'

type Props = {
  data: ArtSocietyPage
}

export const ArtSocietyHero: React.FC<Props> = ({ data }: Props) => {
  const { call_to_action_text, imageHero } = data

  return (
    <div className={classes.grid}>
      <div className={classes.imageColumn}>
        <CMSImage
          src={imageHero}
          alt={imageHero.title}
          className={classes.image}
          fill
          priority
        />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          className={classes.textOverlay}
        >
          <div>
            <Chevron color="var(--color-white)" size={20} className={'iconTopLeft'} />
            <h3 className={classes.title}>{call_to_action_text}</h3>
            <Chevron color="var(--color-white)" size={20} className={'iconBottomRight'} />
          </div>
        </motion.div>
      </div>
      <motion.div
        initial="hidden"
        animate="visible"
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
