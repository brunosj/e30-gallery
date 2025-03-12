import React, { useRef } from 'react'
import Image from 'next/image'
import { RichText } from '../RichText'
import type { MembersOnlyPage } from '@/app/payload-types'
import classes from './index.module.css'
import { getTextJustificationClass } from '@/utilities/geTextJustification'
import { motion, useInView } from 'framer-motion'
import cn from 'classnames'
import {
  fadeInVariants,
  slideInFromLeftVariants,
  cardVariants,
  clipPathVariants,
} from '@/utilities/animationVariants'
import { getImageUrl } from '@/app/_utilities/getImageUrl'

type Props = {
  data: MembersOnlyPage
  setActiveTab: (tab: string) => void
}

export const MembersHome: React.FC<Props> = ({ data, setActiveTab }: Props) => {
  const ref = useRef(null)
  const inView = useInView(ref, {
    once: true,
  })
  const { page_title_home, text_home, homeBlocks } = data
  return (
    <section className="container padding-y">
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={clipPathVariants}
        viewport={{ once: true, amount: 0 }}
      >
        <h3 className="membersAreaTitle">{page_title_home}</h3>
        <RichText content={text_home} />
      </motion.div>
      <div className={cn(classes.grid, 'padding-y')}>
        {homeBlocks.map((block, index) => {
          const { title, info, image, textJustification } = block

          const handleClick = () => {
            if (index === 0) {
              setActiveTab('virtualExhibition')
            } else if (index === 1 || index === 2) {
              setActiveTab('individualArtAdvice')
            }
          }

          return (
            <motion.div
              ref={ref}
              variants={cardVariants(index)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              key={index}
              className={classes.block}
            >
              <div
                className={`${classes.text} ${getTextJustificationClass(
                  textJustification || 'left',
                )}`}
              >
                <h4>
                  {title}
                  <span className={classes.tooltip}>
                    <span className={classes.infoIcon}>i</span>
                    <RichText content={info} className={classes.tooltipText} />
                  </span>
                </h4>
              </div>
              <div className={classes.image} onClick={handleClick}>
                <Image src={getImageUrl(image?.url || '')} alt={image.title} fill priority />
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
