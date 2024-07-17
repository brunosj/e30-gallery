import type { ArtSocietyPage, Media } from '@/app/payload-types'

import Image from 'next/image'
import Chevron from '@/components/SVG/Chevron'
import classes from './index.module.css'
import { RichText } from '../RichText'

type Props = {
  data: ArtSocietyPage
}

export const ArtSocietyBenefits: React.FC<Props> = ({ data }: Props) => {
  const { benefits, benefitsVideo } = data
  const image = benefitsVideo as Media

  return (
    <div className={classes.grid}>
      <div className={classes.columnLeft}>
        <div className={classes.benefitsContent}>
          <RichText content={benefits} className={classes.benefitsList} />
        </div>
      </div>
      <div className={classes.columnRight}>
        <div className={classes.imageContents}>
          <div className={[classes.imageContainer].filter(Boolean).join(' ')}>
            <Image src={image.url} alt={image.title} className={classes.image} fill />
          </div>
        </div>
      </div>
    </div>
  )
}
