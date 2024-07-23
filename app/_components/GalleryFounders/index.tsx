import type { GalleryPage } from '@/app/payload-types'

import Image from 'next/image'
import { RichText } from '../RichText'

import classes from './index.module.css'

type Props = {
  data: GalleryPage
}

export const GalleryFounders: React.FC<Props> = ({ data }: Props) => {
  const { bio, images } = data
  return (
    <section className="container">
      <div className={classes.grid}>
        <div className={classes.image}>
          <div className={[classes.imageColumn, 'padding-y'].filter(Boolean).join(' ')}>
            {images.length > 0 && (
              <Image
                key={images[0].imageFounder.title}
                src={images[0].imageFounder.url}
                alt={images[0].imageFounder.title}
                height={225}
                width={225}
              />
            )}
            {images.length > 1 && (
              <Image
                key={images[1].imageFounder.title}
                src={images[1].imageFounder.url}
                alt={images[1].imageFounder.title}
                className={classes.imageBottomRight}
                height={225}
                width={225}
              />
            )}
          </div>
        </div>
        <div className={classes.info}>
          <div className="padding-y">
            <div className={classes.content}>
              <RichText content={bio} className={classes.richTextFounders} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
