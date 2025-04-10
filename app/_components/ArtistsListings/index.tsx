import type { Artist } from '@/app/payload-types'

import { getLocale, getTranslations } from 'next-intl/server'
import { Button } from '../Button'
import ArtistCarousel from '@/components/ArtistCarousel/ArtistCarousel'
import classes from './index.module.css'
import { createArtistLink } from '@/app/_utilities/linkObjects'
import cn from 'classnames'
import ArtistViewAllButton from './ArtistViewAllButton'

async function getData(locale: string) {
  let data
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/artist?locale=${locale}&depth=2&limit=0`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
        },
      },
    )
    if (!res.ok) {
      console.error('Failed to fetch:', res.status, res.statusText)
      throw new Error(`HTTP error status: ${res.status}`)
    }
    const dataRes = await res.json()
    data = dataRes.docs
  } catch (error) {
    console.error('Error fetching data:', error)
  }
  return data
}

function shuffleArray(array: Artist[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

export default async function ArtistsListings() {
  const locale = await getLocale()
  const t = await getTranslations()
  const data: Artist[] = await getData(locale)
  shuffleArray(data)

  return (
    <section className="container padding-y">
      <div className={cn(classes.info, 'centered')}>
        <h2 className="uppercase">{t('artistsAtE30')}</h2>
        <ArtistViewAllButton />
      </div>
      <ArtistCarousel slides={data} />
    </section>
  )
}
