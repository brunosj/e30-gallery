import type { TwoColumnBlock, Media } from '@/app/payload-types'

import Image from 'next/image'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/Button'

import classes from './index.module.css'

export const TwoColumnBlockComponent: React.FC<TwoColumnBlock> = ({
  invertOrder,
  columnText,
  columnImage,
}) => {
  const image = columnImage.image as Media
  return (
    <div className={classes.grid}>
      <div
        className={[
          'container',
          classes.textColumn,
          classes[`${columnText.size}`],
          invertOrder ? classes.order2 : classes.order1,
          invertOrder ? 'text-right' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {columnText.title && <h1 className={classes.title}>{columnText.title}</h1>}
        <p className="semibold">{columnText.subtitle}</p>
        {columnText.content && (
          <div>
            <RichText content={columnText.content} />
          </div>
        )}
        {columnText.addLink && columnText.link && (
          <Button
            href={columnText.link.url}
            newTab={columnText.link.newTab}
            label={columnText.link.label}
            appearance={columnText.link.appearance}
          />
        )}
      </div>
      <div
        className={[
          classes.imageColumn,
          classes[`${columnImage.size}`],
          invertOrder ? classes.order1 : classes.order2,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Image src={columnImage.image.url} alt={columnImage.image.title} fill />
      </div>
    </div>
  )
}
