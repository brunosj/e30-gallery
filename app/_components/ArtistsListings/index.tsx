import type { Artist } from '@/app/payload-types'

import { languageTag } from '@/paraglide/runtime'
import * as m from '@/paraglide/messages.js'
import { Button } from '../Button'
import ArtistCarousel from '@/components/ArtistCarousel/ArtistCarousel'

import classes from './index.module.css'

async function getData(locale: string) {
  let data
  try {
    const res = await fetch(`${process.env.PAYLOAD_URL}/api/artist?locale=${locale}&depth=2`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
      },
    })
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
  const locale = languageTag()
  const data: Artist[] = await getData(locale)
  shuffleArray(data)

  return (
    <section className="container padding-y">
      <div className={[classes.info, 'centered'].filter(Boolean).join(' ')}>
        <h2 className="uppercase">{m.artistsAtE30()}</h2>
        <Button
          href="/artists"
          newTab={false}
          label={m.viewAll()}
          appearance="default"
          className="padding-t"
        />
      </div>
      <ArtistCarousel slides={data} />
    </section>
  )
}
