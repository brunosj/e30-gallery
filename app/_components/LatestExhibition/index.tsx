'use client'

import type { Exhibition } from '@/app/payload-types'

import Image from 'next/image'
import * as m from '@/paraglide/messages.js'
import { Fade, Slide } from 'react-awesome-reveal'
import { Button } from '@/components/Button'
import { ExhibitionLink } from '@/app/_utilities/linkObjects'
import { RichText } from '../RichText'

import classes from './index.module.css'

type Props = {
  data: Exhibition[]
}

const exhibitionLinkWithProps = {
  ...ExhibitionLink,
  label: m.viewNow(),
  appearance: 'primary',
}

export const LatestExhibition: React.FC<Props> = ({ data }) => {
  return (
    <section>
      {data.map((exhibition, index) => {
        const { title, text, image, dateBegin, dateEnd } = exhibition
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

        const invertOrder = index % 2 !== 0

        return (
          <div key={title} className="padding-b">
            <div className={classes.grid}>
              <div
                className={[
                  classes.contentContainer,
                  invertOrder ? classes.order2 : classes.order1,
                  invertOrder ? 'text-right' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className={classes.content}>
                  <Slide triggerOnce duration={750} direction={index % 2 === 0 ? 'left' : 'right'}>
                    <h3 className="">{m.featuredExhibition()}</h3>
                    <p className="spacedTitle">{title}</p>
                    <p>
                      <span className="block">
                        {begin} {beginYear !== endYear ? beginYear : ''} - {end} {endYear}
                      </span>
                    </p>

                    <RichText content={text} />
                    <Button link={exhibitionLinkWithProps} />
                  </Slide>
                </div>
              </div>
              <div
                className={[invertOrder ? classes.order1 : classes.order2, 'relative']
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className={classes.image}>
                  <Image src={image.url} alt={image.title} fill priority />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
