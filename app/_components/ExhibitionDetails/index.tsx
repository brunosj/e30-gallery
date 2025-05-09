'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import type { Exhibition, Artist } from '@/app/payload-types'
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
import { LinkObject } from '@/app/types'
import { formatDate } from '@/app/_utilities/formatDate'
import { formatDateRange } from '@/app/_utilities/formatDate'

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

  const dateRange = formatDateRange(exhibition.dateBegin || '', exhibition.dateEnd || '', locale)

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
  const otherExhibitions = allExhibitions.filter(item => item.id !== exhibition.id)

  const hasNavigation = allExhibitions.length > 1

  return (
    <div className={classes.exhibitionDetails}>
      <div className={classes.navigation}>
        <div className={classes.heading}>
          <div className="semibold desktop">
            <p>{t('exhibitions')}</p>
          </div>
          <div className={classes.backToListContainer}>
            <Link href="/exhibitions" className="controls">
              {t('backToList')}
            </Link>
          </div>
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

            {/* Exhibition Artists */}
            {exhibition.relation?.artists && exhibition.relation.artists.length > 0 && (
              <div className={classes.exhibitionArtists}>
                <p className="artists-list">
                  {exhibition.relation.artists.map((artist, index) => {
                    // Check if artist is a string or an Artist object
                    const artistObj = typeof artist === 'string' ? null : (artist as Artist)
                    const artistSlug = artistObj?.slug || ''
                    const artistName = artistObj?.full_name || ''

                    return (
                      <React.Fragment key={artistObj?.id || index}>
                        {index > 0 && <span>, </span>}
                        {artistSlug ? (
                          <Link
                            href={`/artists/${artistSlug}` as any}
                            className={classes.artistLink}
                          >
                            {artistName}
                          </Link>
                        ) : (
                          artistName
                        )}
                      </React.Fragment>
                    )
                  })}
                </p>
              </div>
            )}

            <div className={classes.exhibitionDates}>
              <p>{dateRange.display}</p>
            </div>
            <RichText content={exhibition.text} />

            {/* Exhibition links */}
            <div className={classes.links}>
              {exhibition.addLink && exhibition.exhibitionLink && (
                <Button link={exhibition.exhibitionLink as LinkObject} />
              )}
              {exhibition.addOtherLink && exhibition.extraLink && (
                <Button link={exhibition.extraLink as LinkObject} />
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
                className="object-contain"
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
