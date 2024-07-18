import React from 'react'
import Image from 'next/image'
import { RichText } from '../RichText'
import type { MembersOnlyPage } from '@/app/payload-types'
import classes from './index.module.css'
import { getTextJustificationClass } from '@/utilities/geTextJustification'
import { Button } from '@/components/Button'

type Props = {
  data: MembersOnlyPage
}

export const MembersArtAdvice: React.FC<Props> = ({ data }: Props) => {
  const { page_title_art_advice, text_home, individuallArtAdviceBlock } = data
  return (
    <section className="container padding-y">
      <h3 className="membersAreaTitle">{page_title_art_advice}</h3>

      <div className={[classes.grid, 'padding-y'].filter(Boolean).join(' ')}>
        {individuallArtAdviceBlock.slice(0, 2).map((block, index) => {
          const { title, info, image, textJustification, link } = block
          return (
            <div key={index} className={classes.block}>
              <div className={classes.image}>
                <Image src={image.url} alt={image.alt} fill />
              </div>
              <div
                className={`${classes.text} ${getTextJustificationClass(textJustification || 'left')}`}
              >
                <h4 className={classes.title}>
                  {title}
                  {/* <span className={classes.tooltip}>
                    <span className={classes.infoIcon}>i</span>
                    <RichText content={info} className={classes.tooltipText} />
                  </span> */}
                </h4>
                <RichText content={info} className={classes.richText} />
                <Button
                  label={link.label}
                  appearance={link.appearance}
                  el={link.type}
                  email={link.email}
                  subject={link.subject}
                  body={link.body}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div>
        {individuallArtAdviceBlock.slice(2).map((block, index) => {
          const { title, info, image, textJustification, link } = block
          return (
            <div key={index} className={[classes.grid, 'padding-y'].filter(Boolean).join(' ')}>
              <div className={classes.image}>
                <Image src={image.url} alt={image.alt} fill />
              </div>
              <div
                className={`${classes.textLast} ${getTextJustificationClass(textJustification || 'left')}`}
              >
                <h4 className={classes.title}>
                  {title}
                  {/* <span className={classes.tooltip}>
                    <span className={classes.infoIcon}>i</span>
                    <RichText content={info} className={classes.tooltipText} />
                    </span> */}
                </h4>
                <RichText content={info} className={classes.richText} />
                <Button
                  label={link.label}
                  appearance={link.appearance}
                  el={link.type}
                  email={link.email}
                  subject={link.subject}
                  body={link.body}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
