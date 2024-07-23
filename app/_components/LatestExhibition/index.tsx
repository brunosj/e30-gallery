import type { Exhibition } from '@/app/payload-types'

import Image from 'next/image'
import * as m from '@/paraglide/messages.js'
import classes from './index.module.css'

type Props = {
  data: Exhibition
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
    <section className="container padding-y">
      <div className={classes.grid}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <h3 className="">{m.latestExhibition()}</h3>
            <p className="spacedTitle">{title}</p>
            <p>
              <span className="block">
                {begin} {beginYear !== endYear ? beginYear : ''} - {end} {endYear}
              </span>
            </p>
            <p> {description}</p>

            {/* <div className="right">
                  <Button
                    href={'/exhibitions'}
                    newTab={false}
                    label={m.viewNow()}
                    appearance={'primary'}
                  />
                </div> */}
          </div>
        </div>
        <div className="relative">
          <div className={classes.image}>
            <Image src={image.url} alt={image.title} fill />
          </div>
        </div>
      </div>
    </section>
  )
}
