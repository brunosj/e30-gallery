import type { ArtSocietyPage } from '@/app/payload-types'

import { languageTag } from '@/paraglide/runtime'
import * as m from '@/paraglide/messages.js'
import { Button } from '../Button'
import TestimonialCarousel from '@/components//TestimonialCarousel/TestimonialCarousel'

import classes from './index.module.css'

type Props = {
  data: ArtSocietyPage
}
export const Testimonials: React.FC<Props> = ({ data }: Props) => {
  const { title_sentence, testimonialsItems } = data
  return (
    <section className="container padding-y">
      <div className={[classes.info, 'centered'].filter(Boolean).join(' ')}>
        <h2 className="semibold">{title_sentence}</h2>
      </div>
      <div className="">
        <TestimonialCarousel slides={testimonialsItems} />
      </div>
    </section>
  )
}
