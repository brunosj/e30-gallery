'use client'

import type { Artist } from '@/app/payload-types'
import type { EmblaOptionsType } from 'embla-carousel'

import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'motion/react'
import React from 'react'

import { fadeInVariants } from '@/utilities/animationVariants'
import { ArtistListingCard } from '../ArtistListingCard'
import { NextButton, PrevButton, usePrevNextButtons } from './ArrowButtons'

const defaultOptions: EmblaOptionsType = {
  align: 'start',
  containScroll: 'trimSnaps',
  slidesToScroll: 'auto',
}

type PropType = {
  options?: EmblaOptionsType
  slides: Artist[]
}

const ArtistCarousel: React.FC<PropType> = props => {
  const { options, slides } = props
  const [emblaRef, emblaApi] = useEmblaCarousel({ ...defaultOptions, ...options })
  const { nextBtnDisabled, onNextButtonClick, onPrevButtonClick, prevBtnDisabled } =
    usePrevNextButtons(emblaApi)

  return (
    <motion.section
      className="artistCarousel"
      initial="hidden"
      variants={fadeInVariants}
      viewport={{ amount: 0.2, once: true }}
      whileInView="visible"
    >
      <div className="artistCarousel__wrapper">
        <PrevButton
          aria-label="Previous artists"
          disabled={prevBtnDisabled}
          onClick={onPrevButtonClick}
        />
        <div className="artistCarousel__viewport" ref={emblaRef}>
          <div className="artistCarousel__container">
            {slides.map((slide, index) => (
              <div className="artistCarousel__slide" key={slide.id ?? index}>
                <ArtistListingCard item={slide} />
              </div>
            ))}
          </div>
        </div>
        <NextButton
          aria-label="Next artists"
          disabled={nextBtnDisabled}
          onClick={onNextButtonClick}
        />
      </div>
    </motion.section>
  )
}

export default ArtistCarousel
