import React from 'react'
import Image from 'next/image'
import { RichText } from '../RichText'
import type { MembersOnlyPage } from '@/app/payload-types'
import classes from './index.module.css'

type Props = {
  data: MembersOnlyPage
}

export const MembersSpecialEvents: React.FC<Props> = ({ data }: Props) => {
  const { page_title_special_events, text_special_events, specialEventsImage } = data
  return (
    <section className="container padding-y">
      <h3 className="membersAreaTitle">{page_title_special_events}</h3>

      <div className={[classes.grid, 'padding-y'].filter(Boolean).join(' ')}>
        <div className={classes.imageColumn}>
          <div className={classes.imageContainer}>
            <Image src={specialEventsImage.url} alt={specialEventsImage.title} fill />
          </div>
          <p className={classes.caption}>{specialEventsImage.title}</p>
        </div>
        <div className={classes.textContainer}>
          <RichText content={text_special_events} />
        </div>
      </div>
    </section>
  )
}
