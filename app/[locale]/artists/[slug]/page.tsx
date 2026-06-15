import type { Artist, Media } from '@/app/payload-types'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import ArtistPageClient from '@/components/ArtistPageClient'
import {
  buildNotFoundMetadata,
  buildPageMetadata,
} from '@/app/_utilities/generatePageMetadata'
import { getImageUrl } from '@/app/_utilities/getImageUrl'
import {
  artistDetailHref,
  localizedAbsoluteUrl,
} from '@/app/_utilities/localizedUrl'
import { getSiteUrl } from '@/app/_utilities/siteUrl'
import { StructuredData } from '@/app/_components/StructuredData'
import { fetchDocBySlug, fetchList } from '@/app/_utilities/fetchPayload'
import { generateLocaleSlugParams } from '@/app/_utilities/staticParams'
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'

export const dynamicParams = true

export async function generateStaticParams() {
  return generateLocaleSlugParams('artist')
}

type Params = Promise<{ locale: string; slug: string }>

const getData = cache(async (locale: string, slug: string) => {
  const [artistData, allArtistsData] = await Promise.all([
    fetchDocBySlug<Artist>('artist', { locale, slug, depth: 2 }),
    fetchList<Artist>('artist', { locale, depth: 2, limit: 0 }),
  ])

  if (!artistData?.docs?.length) {
    notFound()
  }

  const allArtists = (allArtistsData?.docs ?? []).sort((a: Artist, b: Artist) => {
    const getLastName = (name: string): string => {
      const parts = name.split(' ')
      return parts.length > 1 ? parts[parts.length - 1] : name
    }
    return getLastName(a.full_name).localeCompare(getLastName(b.full_name))
  })

  return { artistData, allArtists }
})

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const { artistData } = await getData(locale, slug)
  if (!artistData?.docs.length) {
    return buildNotFoundMetadata()
  }

  const artist: Artist = artistData.docs[0]
  const imageUrl =
    typeof artist.image !== 'string' ? getImageUrl((artist.image as Media).url || '') : ''

  return buildPageMetadata({
    locale,
    href: artistDetailHref(slug),
    title: artist.meta?.title || artist.full_name,
    description: artist.meta?.description || artist.additional_info,
    keywords: artist.meta?.keywords,
    ogImage: imageUrl ? { url: imageUrl, alt: artist.full_name } : null,
  })
}

export default async function ArtistPage(props: { params: Params }) {
  const params = await props.params
  const { locale } = params
  setRequestLocale(locale)
  const { artistData, allArtists } = await getData(locale, params.slug)

  if (!artistData?.docs.length) {
    return notFound()
  }

  const artist: Artist = artistData.docs[0]

  const currentArtistIndex = allArtists.findIndex(
    (a: Artist) => a.slug?.trim().toLowerCase() === artist.slug?.trim().toLowerCase(),
  )

  const pageUrl = localizedAbsoluteUrl(getSiteUrl(), locale, artistDetailHref(params.slug))
  const imageUrl =
    typeof artist.image !== 'string' ? getImageUrl((artist.image as Media).url || '') : ''

  return (
    <div className="container padding-y">
      <StructuredData
        locale={locale}
        includeBaseSchemas={false}
        type="person"
        pageTitle={artist.full_name}
        pageDescription={artist.meta?.description || artist.additional_info || undefined}
        pageUrl={pageUrl}
        pageImage={imageUrl || undefined}
        personName={artist.full_name}
        personCountry={artist.country || undefined}
        personWebsite={artist.website || undefined}
      />
      <ArtistPageClient
        artist={artist}
        locale={locale}
        allArtists={allArtists}
        currentArtistIndex={currentArtistIndex}
      />
    </div>
  )
}
