import type { Artist } from '@/app/payload-types'
import { getLocale, getTranslations } from 'next-intl/server'
import ArtistCarousel from '@/components/ArtistCarousel/ArtistCarousel'
import classes from './index.module.css'
import cn from 'classnames'
import ArtistViewAllButton from './ArtistViewAllButton'
import { fetchList } from '@/app/_utilities/fetchPayload'

function shuffleArray(array: Artist[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

export default async function ArtistsListings() {
  const locale = await getLocale()
  const t = await getTranslations()
  const result = await fetchList<Artist>('artist', { locale, depth: 2, limit: 0 })
  const data: Artist[] = result?.docs ?? []
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
