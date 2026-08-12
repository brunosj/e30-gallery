'use client'

import React from 'react'
import type { Artist, Exhibition } from '@/app/payload-types'
import type { LinkObject } from '@/app/types'

import { CMSImage } from '@/app/_components/CMSImage'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button'
import { RichText } from '@/components/RichText'
import cn from 'classnames'
import { slideInFromLeftVariants, slideInFromRightVariants } from '@/utilities/animationVariants'
import { motion } from 'motion/react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { artistDetailHref } from '@/app/_utilities/localizedUrl'
import { formatDateRange } from '@/app/_utilities/formatDate'

import classes from './index.module.css'

type Props = {
  data: Exhibition[]
}

export const LatestExhibition: React.FC<Props> = ({ data }) => {
  const locale = useLocale()
  const t = useTranslations()
  return (
    <section>
      {data.map((exhibition, index) => {
        const {
          title,
          image,
          dateBegin,
          dateEnd,
          text,
          exhibitionLink,
          extraLink,
          addLink,
          addOtherLink,
          relation,
        } = exhibition

        const dateRange = formatDateRange(dateBegin || '', dateEnd || '', locale)
        const artists = relation?.artists

        const invertOrder = index % 2 !== 0

        return (
          <div key={title} className="padding-b">
            <div className={classes.grid}>
              <div
                className={cn(
                  classes.contentContainer,
                  invertOrder ? classes.order2 : classes.order1,
                )}
              >
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={slideInFromLeftVariants}
                  className={classes.content}
                >
                  <h3 className="">{t('featuredExhibition')}</h3>
                  <p className="spacedTitle">{title}</p>
                  {artists && artists.length > 0 && (
                    <p className="artists-list">
                      {artists.map((artist, artistIndex) => {
                        const artistObj = typeof artist === 'string' ? null : (artist as Artist)
                        const artistSlug = artistObj?.slug || ''
                        const artistName = artistObj?.full_name || ''

                        return (
                          <React.Fragment key={artistObj?.id || artistIndex}>
                            {artistIndex > 0 && <span>, </span>}
                            {artistSlug ? (
                              <Link
                                href={artistDetailHref(artistSlug)}
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
                  )}
                  <p>
                    <span className="block">{dateRange.display}</span>
                  </p>

                  <RichText content={text} />
                  <div className={classes.links}>
                    {addLink && <Button link={exhibitionLink as LinkObject} />}
                    {addOtherLink && <Button link={extraLink as LinkObject} />}
                  </div>
                </motion.div>
              </div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={invertOrder ? slideInFromLeftVariants : slideInFromRightVariants}
                className={cn(invertOrder ? classes.order1 : classes.order2, 'relative')}
              >
                <div className={classes.image}>
                  {image && typeof image !== 'string' && (
                    <CMSImage src={image} alt={image.title || ''} fill priority />
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
