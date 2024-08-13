'use client'

import type { GalleryPage } from '@/app/payload-types'

import Image from 'next/image'
import { RichText } from '../RichText'
import { motion } from 'framer-motion'
import { slideInFromLeftVariants } from '@/utilities/animationVariants'
import classes from './index.module.css'

type Props = {
  data: GalleryPage
}

export const GalleryFounders: React.FC<Props> = ({ data }: Props) => {
  const { alexander_bio, felicitas_bio, imageAlexander, imageFelicitas } = data
  return (
    <section className="container">
      <div className="desktop">
        <div className={classes.grid}>
          <div className={classes.image}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={slideInFromLeftVariants}
              viewport={{ once: true, amount: 0.9 }}
              className={[classes.imageColumn, 'padding-y'].filter(Boolean).join(' ')}
            >
              <Image
                key={imageAlexander.title}
                src={imageAlexander.url}
                alt={imageAlexander.title}
                height={225}
                width={225}
              />
              <Image
                key={imageFelicitas.title}
                src={imageFelicitas.url}
                alt={imageFelicitas.title}
                className={classes.imageBottomRight}
                height={225}
                width={225}
              />
            </motion.div>
          </div>
          <div className={classes.info}>
            <div className="padding-y">
              <div className={classes.content}>
                <RichText content={alexander_bio} className={classes.richTextFounders} />{' '}
                <RichText content={felicitas_bio} className={classes.richTextFounders} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mobile">
        <div className={classes.info}>
          <div className={classes.image}>
            <div className={[classes.imageColumn, 'padding-y'].filter(Boolean).join(' ')}>
              <Image
                key={imageAlexander.title}
                src={imageAlexander.url}
                alt={imageAlexander.title}
                height={225}
                width={225}
              />
              <div className={classes.content}>
                <RichText content={alexander_bio} className={classes.richTextFounders} />
              </div>
              <Image
                key={imageFelicitas.title}
                src={imageFelicitas.url}
                alt={imageFelicitas.title}
                className={classes.imageBottomRight}
                height={225}
                width={225}
              />
              <div className={classes.content}>
                <RichText
                  content={felicitas_bio}
                  className={[classes.richTextFounders, 'text-right'].filter(Boolean).join(' ')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
