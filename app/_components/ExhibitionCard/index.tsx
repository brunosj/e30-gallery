import type { Exhibition } from '@/app/payload-types'
import Image from 'next/image'
import classes from './index.module.css'

type Props = {
  data: Exhibition
}

export const ExhibitionCard: React.FC<Props> = ({ data }) => {
  const { title, image, dateBegin, dateEnd, description } = data
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
    <section className={classes.card}>
      <div className={classes.imageWrapper}>
        <Image src={image.url} alt={image.title} fill className={classes.image} />
      </div>
      <div className={classes.content}>
        <div className={classes.contentInner}>
          <p className={classes.title}>{title}</p>
          <p className={classes.date}>
            {begin} - {end} {endYear}
          </p>
        </div>
        <p className={classes.description}>{description}</p>
      </div>
    </section>
  )
}
