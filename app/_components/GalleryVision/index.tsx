import type { GalleryPage } from '@/app/payload-types'

import Image from 'next/image'
import * as m from '@/paraglide/messages.js'
import classes from './index.module.css'
import { RichText } from '../RichText'

type Props = {
  data: GalleryPage
}

export const GalleryVision: React.FC<Props> = ({ data }: Props) => {
  const { main_text, textImageBlock } = data

  return (
    <section>
      <div className={[classes.grid, 'container padding-y'].filter(Boolean).join(' ')}>
        <div className={classes.leftColumn}>
          <div className={classes.image}>
            <Image
              src={textImageBlock.imageVision.url}
              alt={textImageBlock.imageVision.title}
              fill
            />
          </div>
          <div className={classes.line} />
          <RichText content={textImageBlock.text_under_image} />
        </div>
        <div className={classes.info}>
          <div className={classes.content}>
            <RichText content={main_text} />
          </div>
        </div>
      </div>
    </section>
  )
}
