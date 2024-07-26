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

export default function ExhibitionsPageData({ data }: Props) {
  const exhibitions = data

  const [selectedYear, setSelectedYear] = useState<string | null>(null)

  const latestExhibition = exhibitions
    .map(exhibition => ({
      ...exhibition,
      dateEndParsed: new Date(exhibition.dateEnd ?? '').getTime(),
    }))
    .sort((a, b) => b.dateEndParsed - a.dateEndParsed)[0]

  const otherExhibitions = exhibitions.slice(1)

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

  const filteredExhibitions = selectedYear
    ? otherExhibitions.filter(
        exhibition => new Date(exhibition.dateEnd ?? '').getFullYear().toString() === selectedYear,
      )
    : otherExhibitions

  return (
    <div className="container padding-y">
      <LatestExhibition data={latestExhibition} />
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
