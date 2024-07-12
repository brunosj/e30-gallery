import type { Exhibition } from '@/app/payload-types'

import Image from 'next/image'
import { Button } from '@/components/Button'
import * as m from '@/paraglide/messages.js'
import Chevron from '@/public/svg/Chevron.svg'
import classes from './index.module.css'

type Props = {
  data: Exhibition
}

export const HeroExhibition: React.FC<Props> = ({ data }) => {
  const { title, description, image } = data

  return (
    <section className={classes.hero}>
      <Image src={image.url} alt={image.title} fill />
      <div className={classes.contentContainer}>
        <div className="padding-right ">
          <div className={classes.content}>
            <div className={classes.iconTopLeft}>
              <Image src={Chevron} alt="Chevron" />
            </div>
            <p className={classes.title}>{title}</p>
            <p className={classes.semibold}>{description}</p>
            <Button
              href={'/exhibitions'}
              newTab={false}
              label={m.viewNow()}
              appearance={'primary'}
            />
            <div className={classes.iconBottomRight}>
              <Image src={Chevron} alt="Chevron" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
