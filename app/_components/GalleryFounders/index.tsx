'use client'

import type { GalleryPage } from '@/app/payload-types'

import { CMSImage } from '@/app/_components/CMSImage'
import { RichText } from '../RichText'
import { motion } from 'motion/react'
import {
  fadeInVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
} from '@/utilities/animationVariants'
import classes from './index.module.css'
import cn from 'classnames'

type Props = {
  data: GalleryPage
}

export const GalleryFounders: React.FC<Props> = ({ data }: Props) => {
  const { alexander_bio, felicitas_bio, imageAlexander, imageFelicitas } = data
  return (
    <motion.section className="container">
      <div className="desktop">
        <div className={classes.grid}>
          <div className={classes.image}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={slideInFromLeftVariants}
              viewport={{ once: true, amount: 0.5 }}
              className={cn(classes.imageColumn, 'padding-y')}
            >
              <CMSImage
                key={imageAlexander.title}
                src={imageAlexander}
                alt={imageAlexander.title}
                height={225}
                width={225}
              />
              <CMSImage
                key={imageFelicitas.title}
                src={imageFelicitas}
                alt={imageFelicitas.title}
                className={classes.imageBottomRight}
                height={225}
                width={225}
              />
            </motion.div>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={slideInFromRightVariants}
            viewport={{ once: true, amount: 0.5 }}
            className={classes.info}
          >
            <div className="padding-y">
              <div className={classes.content}>
                <RichText content={alexander_bio} className={classes.richTextFounders} />{' '}
                <RichText content={felicitas_bio} className={classes.richTextFounders} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="mobile">
        <div className={classes.info}>
          <div className={classes.image}>
            <div className={cn(classes.imageColumn, 'padding-y')}>
              <CMSImage
                key={imageAlexander.title}
                src={imageAlexander}
                alt={imageAlexander.title}
                height={225}
                width={225}
              />
              <div className={classes.content}>
                <RichText content={alexander_bio} className={classes.richTextFounders} />
              </div>
              <CMSImage
                key={imageFelicitas.title}
                src={imageFelicitas}
                alt={imageFelicitas.title}
                className={classes.imageBottomRight}
                height={225}
                width={225}
              />
              <div className={classes.content}>
                <RichText
                  content={felicitas_bio}
                  className={cn(classes.richTextFounders, 'text-right')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
