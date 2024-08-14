'use client'

import type { ArtSocietyPage, Testimonial } from '@/app/payload-types'
import TestimonialCarousel from '@/components//TestimonialCarousel/TestimonialCarousel'
import { motion } from 'framer-motion'
import { clipPathVariants, fadeInVariants } from '@/app/_utilities/animationVariants'

import classes from './index.module.css'

type Props = {
  data: ArtSocietyPage
}
export const Testimonials: React.FC<Props> = ({ data }: Props) => {
  const { title_sentence, testimonialsItems } = data
  return (
    <section className="container padding-y">
      <div className={[classes.info, 'centered'].filter(Boolean).join(' ')}>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={clipPathVariants}
          className="semibold"
        >
          {title_sentence}
        </motion.h2>
      </div>
      <div className="">
        <TestimonialCarousel slides={testimonialsItems as Testimonial[]} />
      </div>
    </section>
  )
}
