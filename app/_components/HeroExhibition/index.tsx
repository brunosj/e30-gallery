'use client'

import type { Exhibition } from '@/app/payload-types'

import Image from 'next/image'
import { Button } from '@/components/Button'
import * as m from '@/paraglide/messages.js'
import classes from './index.module.css'
import Chevron from '@/components/SVG/Chevron'
import { Fade, Slide } from 'react-awesome-reveal'

type Props = {
  data: Exhibition
}

export const HeroExhibition: React.FC<Props> = ({ data }) => {
  const { title, description, image, dateBegin, dateEnd } = data
  const begin = new Date(dateBegin || '').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })
  const end = new Date(dateEnd || '').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })

  return (
    <section className={classes.hero}>
      <Image src={image.url} alt={image.title} fill />
      <div className={classes.contentContainer}>
        <div className={classes.paddingR}>
          <Fade triggerOnce duration={750} delay={250}>
            <div className={classes.content}>
              <Chevron color="var(--color-black)" size={20} className="iconTopLeft" />
              <div className={classes.info}>
                <p className="spacedTitle">{title}</p>
                <p>{description}</p>
                <p className="uppercase">
                  {begin} - {end}
                </p>

                <div className="right">
                  <Button
                    href={'/exhibitions'}
                    newTab={false}
                    label={m.viewNow()}
                    appearance={'primary'}
                  />
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
