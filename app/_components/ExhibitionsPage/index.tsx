'use client'

import React, { useState, useEffect } from 'react'
import Select, { StylesConfig, GroupBase } from 'react-select'
import { useTranslations } from 'next-intl'
import type { Exhibition } from '@/app/payload-types'
import { LatestExhibition } from '@/components/LatestExhibition'
import { ExhibitionCard } from '@/components/ExhibitionCard'
import ArrowScroll from '@/components/SVG/ArrowScroll'
import { motion, AnimatePresence } from 'motion/react'
import { fadeInVariants } from '@/utilities/animationVariants'

import classes from './index.module.css'

type Props = {
  data: Exhibition[]
  featuredExhibitions: Exhibition[]
}

type OptionType = {
  label: string
  value: string
}

const customStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
  container: (base: any) => ({
    ...base,
    width: 200,
  }),
  control: (base: any) => ({
    ...base,
    cursor: 'pointer',
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? 'var(--color-accent)' : state.isFocused ? '#F0F0F0' : null,
    color: state.isSelected ? 'var(--color-white)' : 'var(--color-black)',
    cursor: 'pointer',
  }),
}

export default function ExhibitionsPageData({ data, featuredExhibitions }: Props) {
  const exhibitions = data
  const t = useTranslations()
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [showScrollArrow, setShowScrollArrow] = useState(false)
  const [lastScrollTop, setLastScrollTop] = useState(0)

  const featuredExhibitionIds = new Set(featuredExhibitions.map(exhibition => exhibition.id))
  const otherExhibitions = exhibitions.filter(
    exhibition => !featuredExhibitionIds.has(exhibition.id),
  )

  const uniqueYears = Array.from(
    new Set(
      otherExhibitions.map(exhibition =>
        new Date(exhibition.dateEnd ?? '').getFullYear().toString(),
      ),
    ),
  )

  const yearOptions = [
    { value: '', label: `${t('allYears')}` },
    ...uniqueYears
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map(year => ({ value: year, label: year })),
  ]

  const filteredExhibitions = otherExhibitions
    .filter(
      exhibition =>
        !selectedYear ||
        new Date(exhibition.dateEnd ?? '').getFullYear().toString() === selectedYear,
    )
    .sort((a, b) => new Date(b.dateEnd ?? '').getTime() - new Date(a.dateEnd ?? '').getTime())

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY
      const exhibitionsElement = document.querySelector(`.${classes.exhibitions}`)
      const exhibitionsBottom = exhibitionsElement
        ? exhibitionsElement.getBoundingClientRect().bottom + window.scrollY
        : 0

      const scrolledDown = currentScrollTop > 300
      const scrollingUp = currentScrollTop < lastScrollTop
      const reachedExhibitionsBottom = window.innerHeight + currentScrollTop >= exhibitionsBottom

      setShowScrollArrow(scrolledDown && !scrollingUp && !reachedExhibitionsBottom)
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollTop])

  return (
    <div className="container padding-y">
      <LatestExhibition data={featuredExhibitions} />
      <div className={classes.filterContainer}>
        <Select
          options={yearOptions}
          value={yearOptions.find(option => option.value === selectedYear)}
          onChange={selectedOption => setSelectedYear(selectedOption?.value || '')}
          className={classes.filterDropdown}
          placeholder={t('selectYear')}
          styles={customStyles}
        />
      </div>
      <div className={classes.exhibitions}>
        {filteredExhibitions.map((exhibition, index) => (
          <ExhibitionCard key={exhibition.id} data={exhibition} index={index} />
        ))}
      </div>
      <AnimatePresence>
        {showScrollArrow && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInVariants}
            className={classes.scrollDown}
          >
            <motion.div
              animate={{
                opacity: [1, 0.5, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
              }}
            >
              <ArrowScroll color="var(--color-white)" size={15} className={classes.icon} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
