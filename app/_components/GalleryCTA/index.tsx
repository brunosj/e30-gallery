import type { GalleryPage } from '@/app/payload-types'

import Image from 'next/image'
import * as m from '@/paraglide/messages.js'
import classes from './index.module.css'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/Button'

type Props = {
  data: GalleryPage
}

export const GalleryCTA: React.FC<Props> = ({ data }: Props) => {
  const { text, link, backgroundImage } = data

  return (
    <section className="padding-y">
      <div className={classes.cta}>
        <div className={classes.backgroundImageWrapper}>
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.title}
            fill
            className={classes.backgroundImage}
          />
        </div>
        <div className={classes.overlay}>
          <RichText content={text} className={classes.text} />
          <Button href={link.url} label={link.label} appearance={link.appearance} />
        </div>
      </div>
    </section>
  )
}
