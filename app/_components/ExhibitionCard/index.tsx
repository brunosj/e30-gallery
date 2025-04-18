'use client'

import React, { useRef } from 'react'
import type { Exhibition } from '@/app/payload-types'
import Image from 'next/image'
import classes from './index.module.css'
import { motion, useInView } from 'framer-motion'
import { useLocale } from 'next-intl'
import { getImageUrl } from '@/app/_utilities/getImageUrl'
import { Link } from '@/i18n/navigation'
import { RichText } from '@/components/RichText'
import { LinkObject } from '@/app/types'

type Props = {
  data: Exhibition
  index: number
}

export const ExhibitionCard: React.FC<Props> = ({ data, index }) => {
  const locale = useLocale()

  const ref = useRef(null)
  const inView = useInView(ref, {
    once: true,
  })

  const { title, image, homepageImage, dateBegin, dateEnd, text, slug } = data

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

  const dateDisplay = `${formattedBegin} ${beginYear !== endYear ? beginYear : ''} - ${formattedEnd} ${endYear}`

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={cardVariants}
      whileHover={{ y: -4 }}
      style={{ height: '100%' }}
    >
      <Link href={`/exhibitions/${slug}` as any} className={classes.card}>
        <div className={classes.imageWrapper}>
          {image?.url && (
            <Image
              src={getImageUrl(image.url)}
              alt={image.title || title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={85}
              className={classes.image}
            />
          )}
        </div>
        <div className={classes.content}>
          <div className={classes.contentInner}>
            <h3 className={classes.title}>{title}</h3>
            <p className={classes.date}>{dateDisplay}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
