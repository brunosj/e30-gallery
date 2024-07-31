'use client'

import type { Exhibition } from '@/app/payload-types'

import Image from 'next/image'
import * as m from '@/paraglide/messages.js'
import { Fade, Slide } from 'react-awesome-reveal'
import { Button } from '@/components/Button'
import { ExhibitionLink } from '@/app/_utilities/linkObjects'

import classes from './index.module.css'

type Props = {
  data: Exhibition
}

const exhibitionLinkWithProps = {
  ...ExhibitionLink,
  label: m.viewNow(),
  appearance: 'primary',
}

export const LatestExhibition: React.FC<Props> = ({ data }) => {
  const { title, description, image, dateBegin, dateEnd } = data
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
    <section className="padding-b">
      <div className={classes.grid}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Slide triggerOnce duration={750} direction="left">
              <h3 className="">{m.latestExhibition()}</h3>
              <p className="spacedTitle">{title}</p>
              <p>
                <span className="block">
                  {begin} {beginYear !== endYear ? beginYear : ''} - {end} {endYear}
                </span>
              </p>
              <p> {description}</p>

              <Button link={exhibitionLinkWithProps} />
            </Slide>
          </div>
        </div>
        <div className="relative">
          {/* <Slide triggerOnce duration={750} direction="right"> */}
          <div className={classes.image}>
            <Image src={image.url} alt={image.title} fill priority />
          </div>
          {/* </Slide> */}
        </div>
      </div>
    </section>
  )
}
