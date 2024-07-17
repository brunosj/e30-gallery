import type { GalleryPage } from '@/app/payload-types'

import Image from 'next/image'
import * as m from '@/paraglide/messages.js'
import classes from './index.module.css'
import { RichText } from '../RichText'

type Props = {
  data: GalleryPage
}

export const GalleryHero: React.FC<Props> = ({ data }: Props) => {
  const { title, about_text, mission_statement, imageHero } = data

  return (
    <section className={classes.grid}>
      <div className="container flex">
        <div className={classes.content}>
          <p className="">{m.aboutTheGallery()}</p>
          <RichText content={about_text} />
          <div className={classes.flex}>
            <div className={classes.line} />
            <RichText content={mission_statement} />
          </div>
        </div>
      </div>
      <div className={classes.image}>
        <Image src={imageHero.url} alt={imageHero.title} fill />
      </div>
    </section>
  )
}
