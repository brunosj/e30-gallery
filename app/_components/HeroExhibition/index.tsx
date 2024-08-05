'use client'

import type { Exhibition } from '@/app/payload-types'

import Image from 'next/image'
import { Button } from '@/components/Button'
import * as m from '@/paraglide/messages.js'
import classes from './index.module.css'
import Chevron from '@/components/SVG/Chevron'
import { Fade, Slide } from 'react-awesome-reveal'
import { ExhibitionLink } from '@/app/_utilities/linkObjects'
import { RichText } from '../RichText'

type Props = {
  data: Exhibition[]
}

export const HeroExhibition: React.FC<Props> = ({ data }) => {
  const { title, text, image, dateBegin, dateEnd } = data[0]
  const begin = new Date(dateBegin || '')
    .toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
    })
    .split(' ')
    .reverse()
    .join(' ')

  const end = new Date(dateEnd || '')
    .toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
    })
    .split(' ')
    .reverse()
    .join(' ')

  const beginYear = new Date(dateBegin || '').getFullYear()
  const endYear = new Date(dateEnd || '').getFullYear()

  return (
    <section className={classes.hero}>
      <Image src={image.url} alt={image.title} fill priority />
      <div className={classes.contentContainer}>
        <div className={classes.paddingR}>
          <Fade triggerOnce duration={750} delay={250}>
            <div className={classes.content}>
              <Chevron color="var(--color-black)" size={20} className="iconTopLeft" />
              <div className={classes.info}>
                <p className="spacedTitle">{title}</p>

                <div className={classes.description}>
                  <RichText content={text} />
                </div>
                <p className="uppercase">
                  {begin} {beginYear !== endYear ? beginYear : ''} - {end} {endYear}
                </p>

                <div className="right">
                  <Button link={ExhibitionLink(m.viewNow(), 'primary')} />
                </div>
              </div>
              <Chevron color="var(--color-black)" size={20} className="iconBottomRight" />
            </div>
          </Fade>
        </div>
      </div>
    </section>
  )
}
