'use client'

import type { CallToAction, Media } from '@/app/payload-types'

import Image from 'next/image'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/Button'
import { textVariants, clipPathVariants } from '@/utilities/animationVariants'
import { motion } from 'framer-motion'

import classes from './index.module.css'

const getTextColor = (backgroundColor: string) => {
  switch (backgroundColor) {
    case 'blue':
      return 'var(--color-white)'
    case 'white':
      return 'var(--color-black)'
    case 'black':
      return 'var(--color-white)'
    default:
      return 'var(--color-black)'
  }
}

const getButtonAppearance = (backgroundColor: string) => {
  switch (backgroundColor) {
    case 'white':
      return 'primary'
    case 'blue':
    case 'black':
      return 'secondary'
    default:
      return 'secondary'
  }
}

export const CallToActionBlockComponent: React.FC<CallToAction> = ({
  title,
  text,
  featuredImage,
  link,
  backgroundColor = 'white',
}) => {
  const image = featuredImage as Media
  const textColor = getTextColor(backgroundColor)
  const buttonAppearance = getButtonAppearance(backgroundColor)

  return (
    <section className={[classes.bg, classes[backgroundColor]].filter(Boolean).join(' ')}>
      <div className={[classes.cta, 'container padding-y'].filter(Boolean).join(' ')}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={clipPathVariants}
          className={classes.content}
        >
          <h1 className="uppercase" style={{ color: textColor }}>
            {title}
          </h1>
          <div className={classes.text} style={{ color: textColor }}>
            <RichText content={text} />
          </div>
          <Button link={{ ...link, appearance: buttonAppearance }} />
        </motion.div>
        <div className={classes.image}>
          <Image src={image.url} alt={image.title} fill />
        </div>
      </div>
    </section>
  )
}
