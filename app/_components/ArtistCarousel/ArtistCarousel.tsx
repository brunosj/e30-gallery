'use client'

import type { Artist } from '@/app/payload-types'

import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import { DotButton, useDotButton } from './DotButtons'
import useEmblaCarousel from 'embla-carousel-react'
import { ArtistListingCard } from '../ArtistListingCard'

type PropType = {
  slides: Artist[]
  options?: EmblaOptionsType
}

const ArtistCarousel: React.FC<PropType> = props => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  // const {
  //   prevBtnDisabled,
  //   nextBtnDisabled,
  //   onPrevButtonClick,
  //   onNextButtonClick
  // } = usePrevNextButtons(emblaApi)

  return (
    <section className="artistCarousel">
      <div className="artistCarousel__viewport" ref={emblaRef}>
        <div className="artistCarousel__container">
          {slides.map((slide, index) => (
            <div className="artistCarousel__slide" key={index}>
              <ArtistListingCard item={slide} />
            </div>
          ))}
        </div>
      </div>

      <div className="artistCarousel__controls">
        <div className="artistCarousel__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'artistCarousel__dot'.concat(
                index === selectedIndex ? ' artistCarousel__dot--selected' : '',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ArtistCarousel
