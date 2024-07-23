import React from 'react'
import Image from 'next/image'
import { RichText } from '../RichText'
import type { MembersOnlyPage } from '@/app/payload-types'
import classes from './index.module.css'
import { getTextJustificationClass } from '@/utilities/geTextJustification'

type Props = {
  data: MembersOnlyPage
}

export const MembersHome: React.FC<Props> = ({ data }: Props) => {
  const { page_title_home, text_home, homeBlocks } = data
  return (
    <section className="container padding-y">
      <h3 className="membersAreaTitle">{page_title_home}</h3>
      <RichText content={text_home} />
      <div className={[classes.grid, 'padding-y'].filter(Boolean).join(' ')}>
        {homeBlocks.map((block, index) => {
          const { title, info, image, textJustification } = block
          return (
            <div key={index} className={classes.block}>
              <div
                className={`${classes.text} ${getTextJustificationClass(textJustification || 'left')}`}
              >
                <h4>
                  {title}
                  <span className={classes.tooltip}>
                    <span className={classes.infoIcon}>i</span>
                    <RichText content={info} className={classes.tooltipText} />
                  </span>
                </h4>
              </div>
              <div className={classes.image}>
                <Image src={image.url} alt={image.alt} fill />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
