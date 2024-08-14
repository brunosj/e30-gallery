import React, { useRef } from 'react'
import Image from 'next/image'
import { RichText } from '../RichText'
import type { MembersOnlyPage } from '@/app/payload-types'
import classes from './index.module.css'
import { getTextJustificationClass } from '@/utilities/geTextJustification'
import { Button } from '@/components/Button'
import { motion, useInView } from 'framer-motion'
import { fadeInVariants, cardVariants } from '@/utilities/animationVariants'

type Props = {
  data: MembersOnlyPage
}

export const MembersArtAdvice: React.FC<Props> = ({ data }: Props) => {
  const { page_title_art_advice, individuallArtAdviceBlock } = data

  // Create two separate refs for the two sets of blocks
  const refFirstSet = useRef(null)
  const refSecondSet = useRef(null)

  // Use InView hooks for each ref
  const inViewFirstSet = useInView(refFirstSet, {
    once: true,
  })
  const inViewSecondSet = useInView(refSecondSet, {
    once: true,
  })

  return (
    <section className="container padding-y">
      <h3 className="membersAreaTitle">{page_title_art_advice}</h3>

      <div className={[classes.grid, 'padding-y'].filter(Boolean).join(' ')} ref={refFirstSet}>
        {individuallArtAdviceBlock.slice(0, 2).map((block, index) => {
          const { title, info, image, textJustification, link } = block
          return (
            <motion.div
              key={index}
              variants={cardVariants(index)}
              initial="hidden"
              animate={inViewFirstSet ? 'visible' : 'hidden'}
              className={classes.block}
            >
              <div className={classes.image}>
                <Image src={image.url || ''} alt={image.title} fill />
              </div>
              <div
                className={`${classes.text} ${getTextJustificationClass(textJustification || 'left')}`}
              >
                <h4 className={classes.title}>{title}</h4>
                <RichText content={info} className={classes.richText} />
                <Button link={link} />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div ref={refSecondSet}>
        {individuallArtAdviceBlock.slice(2).map((block, index) => {
          const { title, info, image, textJustification, link } = block
          return (
            <motion.div
              key={index}
              variants={cardVariants(index)}
              initial="hidden"
              animate={inViewSecondSet ? 'visible' : 'hidden'}
              className={classes.gridLast}
            >
              <div className={classes.imageLast}>
                <Image src={image.url || ''} alt={image.title} fill />
              </div>
              <div
                className={`${classes.textLast} ${getTextJustificationClass(textJustification || 'left')}`}
              >
                <h4 className={classes.title}>{title}</h4>
                <RichText content={info} className={classes.richText} />
                <Button link={link} />
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
