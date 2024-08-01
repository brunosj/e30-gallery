'use client'

import React, { useState, useEffect } from 'react'
import Select, { StylesConfig, GroupBase } from 'react-select'
import * as m from '@/paraglide/messages.js'
import type { Exhibition } from '@/app/payload-types'
import { LatestExhibition } from '@/components/LatestExhibition'
import { ExhibitionCard } from '@/components/ExhibitionCard'

import classes from './index.module.css'

type Props = {
  data: Exhibition[]
  featuredExhibitions: Exhibition[]
}

type OptionType = {
  label: string
  value: string
}

export const customStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
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

  const [selectedYear, setSelectedYear] = useState<string | null>(null)

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
    { value: '', label: `${m.allYears()}` },
    ...uniqueYears.map(year => ({ value: year, label: year })),
  ]

  const filteredExhibitions = otherExhibitions
    .filter(
      exhibition =>
        !selectedYear ||
        new Date(exhibition.dateEnd ?? '').getFullYear().toString() === selectedYear,
    )
    .sort((a, b) => new Date(b.dateEnd ?? '').getTime() - new Date(a.dateEnd ?? '').getTime())

  return (
    <div className="container padding-y">
      <LatestExhibition data={featuredExhibitions} />
      <div className={classes.filterContainer}>
        <Select
          options={yearOptions}
          value={yearOptions.find(option => option.value === selectedYear)}
          onChange={selectedOption => setSelectedYear(selectedOption?.value || '')}
          className={classes.filterDropdown}
          placeholder={m.selectYear()}
          styles={customStyles}
        />
      </div>
      <div className={classes.exhibitions}>
        {filteredExhibitions.map(exhibition => (
          <ExhibitionCard key={exhibition.id} data={exhibition} />
        ))}
      </div>
    </div>
  )
}
