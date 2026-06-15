import type { ArtistsPage, Artist, Artwork } from '@/app/payload-types'
import { cache } from 'react'
import ArtistDetailsV2 from '@/components/ArtistDetails'
import { ArtistPageHero } from '@/app/_components/ArtistPageHero'
import { fetchList, fetchSingleton } from '@/app/_utilities/fetchPayload'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

type Params = Promise<{ locale: string }>

const getData = cache(async (locale: string) => {
  const [pageData, artistData] = await Promise.all([
    fetchSingleton<ArtistsPage>('artists-page', { locale, depth: 2 }),
    fetchList<Artist>('artist', { locale, depth: 2, limit: 0 }),
  ])

  if (!pageData?.docs?.length) {
    notFound()
  }

  return { pageData, artistData }
})

export default async function ArtistsPage({ params }: { params: Params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const { pageData, artistData } = await getData(locale)
  const page: ArtistsPage = pageData.docs[0]

  const artists: Artist[] = (artistData?.docs ?? []).sort((a: Artist, b: Artist) => {
    const getLastName = (name: string): string => {
      const parts = name.split(' ')
      return parts.length > 1 ? parts[parts.length - 1] : name
    }

    const lastNameA = getLastName(a.full_name)
    const lastNameB = getLastName(b.full_name)

    return lastNameA.localeCompare(lastNameB)
  })
  const featuredArtwork = page.featuredArtwork as Artwork
  return (
    <div className="container padding-y">
      <ArtistPageHero data={page} />
      <ArtistDetailsV2 artists={artists} featuredArtwork={featuredArtwork} />
    </div>
  )
}
