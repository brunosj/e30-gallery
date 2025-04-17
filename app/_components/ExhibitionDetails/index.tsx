'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import type { Exhibition } from '@/app/payload-types'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/Button'
import { ExhibitionCard } from '@/components/ExhibitionCard'
import ArrowLeft from '@/components/SVG/ArrowLeft'
import ArrowRight from '@/components/SVG/ArrowRight'
import { motion } from 'framer-motion'
import cn from 'classnames'
import { getImageUrl } from '@/app/_utilities/getImageUrl'
import {
  fadeInVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
} from '@/utilities/animationVariants'

import classes from './index.module.css'

type Props = {
  exhibition: Exhibition
  locale: string
  allExhibitions: Exhibition[]
  currentExhibitionIndex: number
}

const ExhibitionDetails: React.FC<Props> = ({
  exhibition,
  locale,
  allExhibitions,
  currentExhibitionIndex,
}) => {
  const t = useTranslations()
  const [currentExhibition, setCurrentExhibition] = useState(exhibition)

  // Format dates
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return ''
    return new Date(dateString)
      .toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      .split(' ')
      .reverse()
      .join(' ')
  }

  const begin = formatDate(exhibition.dateBegin)
  const end = formatDate(exhibition.dateEnd)

  // Handle navigation between exhibitions
  const handleNextClick = () => {
    const nextIndex = (currentExhibitionIndex + 1) % allExhibitions.length
    const nextExhibition = allExhibitions[nextIndex]
    if (nextExhibition.slug) {
      // Navigate to the next exhibition's page
      window.location.href = `/${locale}/exhibitions/${nextExhibition.slug}`
    }
  }

  const handlePreviousClick = () => {
    const prevIndex = (currentExhibitionIndex - 1 + allExhibitions.length) % allExhibitions.length
    const prevExhibition = allExhibitions[prevIndex]
    if (prevExhibition.slug) {
      // Navigate to the previous exhibition's page
      window.location.href = `/${locale}/exhibitions/${prevExhibition.slug}`
    }
  }

  // Filter out the current exhibition from the list
  const otherExhibitions = allExhibitions.filter(item => item.id !== exhibition.id).slice(0, 6) // Limit to 6 other exhibitions

  const hasNavigation = allExhibitions.length > 1

  return (
    <div className={classes.exhibitionDetails}>
      <div className={classes.navigation}>
        <div className={classes.heading}>
          <div className="semibold desktop">
            <p>{t('exhibitions')}</p>
          </div>
          <Link href="/exhibitions" className="controls">
            {t('backToList')}
          </Link>

          <div className={classes.navigationButtons}>
            <button
              onClick={handlePreviousClick}
              disabled={!hasNavigation}
              className={!hasNavigation ? classes.disabled : ''}
            >
              <ArrowLeft color="var(--color-black)" size={25} />
            </button>
            <button
              onClick={handleNextClick}
              disabled={!hasNavigation}
              className={!hasNavigation ? classes.disabled : ''}
            >
              <ArrowRight color="var(--color-black)" size={25} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Exhibition Details */}
      <div className={classes.mainContent}>
        <div className={classes.grid}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInFromLeftVariants}
            className={classes.content}
          >
            <h2>{exhibition.title}</h2>
            <div className={classes.exhibitionDates}>
              <p>
                {begin} - {end}
              </p>
            </div>
            <RichText content={exhibition.text} className="padding-y-sm" />

            {/* Exhibition links */}
            <div className={classes.links}>
              {exhibition.addLink && exhibition.exhibitionLink && (
                <Button link={exhibition.exhibitionLink} />
              )}
              {exhibition.addOtherLink && exhibition.extraLink && (
                <Button link={exhibition.extraLink} />
              )}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInFromRightVariants}
            className={cn(classes.image, 'relative')}
          >
            {exhibition.image?.url && (
              <Image
                src={getImageUrl(exhibition.image.url)}
                alt={exhibition.image.title || exhibition.title}
                fill
                priority
                className="object-cover"
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Other Exhibitions */}
      {otherExhibitions.length > 0 && (
        <div className={classes.otherExhibitions}>
          <div className={classes.heading}>
            <p className="semibold">{t('otherExhibitions')}</p>
          </div>
          <div className={classes.exhibitions}>
            {otherExhibitions.map((exhibition, index) => (
              <ExhibitionCard key={exhibition.id} data={exhibition} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExhibitionDetails
