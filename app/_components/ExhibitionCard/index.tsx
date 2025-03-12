import React, { useRef } from 'react'
import type { Exhibition } from '@/app/payload-types'
import Image from 'next/image'
import { RichText } from '@/components/RichText'
import classes from './index.module.css'
import { motion, useInView } from 'framer-motion'
import { cardVariants } from '@/app/_utilities/animationVariants'
import { languageTag } from '@/paraglide/runtime'
import { getImageUrl } from '@/app/_utilities/getImageUrl'

type Props = {
  data: Exhibition
  index: number
}

export const ExhibitionCard: React.FC<Props> = ({ data, index }) => {
  const locale = languageTag() || 'en'

  const ref = useRef(null)
  const inView = useInView(ref, {
    once: true,
  })

  const { title, image, homepageImage, dateBegin, dateEnd, text } = data

  const begin = new Date(dateBegin || '').toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
  })

  const end = new Date(dateEnd || '').toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
  })

  // Reverse the date only if the locale is 'en'
  const formattedBegin = locale === 'en' ? begin.split(' ').reverse().join(' ') : begin
  const formattedEnd = locale === 'en' ? end.split(' ').reverse().join(' ') : end

  const beginYear = new Date(dateBegin || '').getFullYear()
  const endYear = new Date(dateEnd || '').getFullYear()

  return (
    <motion.div
      ref={ref}
      variants={cardVariants(index)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={classes.card}
    >
      <div className={classes.imageWrapper}>
        <Image
          src={getImageUrl(image?.url || '')}
          alt={image.title}
          fill
          className={classes.image}
        />
      </div>
      <div className={classes.content}>
        <div className={classes.contentInner}>
          <p className={classes.title}>{title}</p>
          <p className={classes.date}>
            {formattedBegin} {beginYear !== endYear ? beginYear : ''} - {formattedEnd} {endYear}{' '}
          </p>
        </div>
        <div className={classes.description}>
          <RichText content={text} className={classes.richTextInner} />
        </div>
      </div>
    </motion.div>
  )
}
