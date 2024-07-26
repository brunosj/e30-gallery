import type { Exhibition } from '@/app/payload-types'

import Image from 'next/image'
import * as m from '@/paraglide/messages.js'
import classes from './index.module.css'

type Props = {
  data: Exhibition
}

export const ExhibitionCard: React.FC<Props> = ({ data }) => {
  const { title, image, dateBegin, dateEnd } = data
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

  const endYear = new Date(dateEnd || '').getFullYear()

  return (
    <section className="">
      <div className="relative">
        <div className={classes.artwork}>
          <Image src={image.url} alt={image.title} fill className={classes.artwork} />
        </div>
        <div className={classes.content}>
          <p>{title}</p>
          <p>
            {begin} - {end} {endYear}
          </p>
        </div>
      </div>
    </section>
  )
}
