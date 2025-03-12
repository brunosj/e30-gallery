'use client'

import type { Exhibition } from '@/app/payload-types'

import Image from 'next/image'
import * as m from '@/paraglide/messages.js'
import { Button } from '@/components/Button'
import { ExhibitionLink } from '@/app/_utilities/linkObjects'
import { RichText } from '@/components/RichText'
import cn from 'classnames'
import {
  fadeInVariants,
  clipPathVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
} from '@/utilities/animationVariants'
import { motion } from 'framer-motion'
import { languageTag } from '@/paraglide/runtime'
import { getImageUrl } from '@/app/_utilities/getImageUrl'

import classes from './index.module.css'

type Props = {
  data: Exhibition[]
}

export const LatestExhibition: React.FC<Props> = ({ data }) => {
  const locale = languageTag() || 'en'
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
        } = exhibition
        const begin = new Date(dateBegin || '')
          .toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
          })
          .split(' ')
          .reverse()
          .join(' ')

        const end = new Date(dateEnd || '')
          .toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
          })
          .split(' ')
          .reverse()
          .join(' ')

        const beginYear = new Date(dateBegin || '').getFullYear()
        const endYear = new Date(dateEnd || '').getFullYear()

        const invertOrder = index % 2 !== 0

        return (
          <div key={title} className="padding-b">
            <div className={classes.grid}>
              <div
                className={cn(
                  classes.contentContainer,
                  invertOrder ? classes.order2 : classes.order1,
                  invertOrder ? 'text-right' : '',
                  invertOrder ? classes.marginLeft : '',
                )}
              >
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={clipPathVariants}
                  className={classes.content}
                >
                  <h3 className="">{m.featuredExhibition()}</h3>
                  <p className="spacedTitle">{title}</p>
                  <p>
                    <span className="block">
                      {begin} {beginYear !== endYear ? beginYear : ''} - {end} {endYear}
                    </span>
                  </p>

                  <RichText content={text} />
                  <div className={classes.links}>
                    {addLink && <Button link={exhibitionLink} />}
                    {addOtherLink && <Button link={extraLink} />}
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
                  <Image src={getImageUrl(image?.url || '')} alt={image.title} fill priority />
                </div>
              </motion.div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
