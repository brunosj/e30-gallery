import type { ArtistsPage, Artist, Artwork } from '@/app/payload-types'
import { languageTag } from '@/paraglide/runtime'
import BannerReachOut from '@/components/BannerReachOut'
import BannerNewsletter from '@/components/BannerNewsletter'
import ArtistDetails from '@/components/ArtistDetails'
import { RichText } from '@/components/RichText'
import classes from './index.module.css'
import { ArtistPageHero } from '@/components/ArtistPageHero'

async function getData(locale: string) {
  const urls = [
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/artists-page?locale=${locale}&depth=2`,
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/artist?locale=${locale}&depth=2&limit=0`,
  ]

  const fetchPromises = urls.map(url =>
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
      },
    }),
  )

  try {
    const responses = await Promise.all(fetchPromises)
    const data = await Promise.all(responses.map(res => res.json()))
    const pageData = data[0]
    const artistData = data[1]
    return { pageData, artistData }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export async function generateMetadata() {
  const locale = languageTag()
  const { pageData } = await getData(locale)
  const metadata = pageData.docs[0].meta
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
    },
  }
}

export default async function ArtistsPage() {
  const locale = languageTag()
  const { pageData, artistData } = await getData(locale)
  const page: ArtistsPage = pageData.docs[0]
  const artists: Artist[] = artistData.docs.sort((a: Artist, b: Artist) => {
    const getLastName = (name: string) => {
      const parts = name.split(' ')
      return parts.length > 1 ? parts[parts.length - 1] : name
    }

    const lastNameA = getLastName(a.full_name)
    const lastNameB = getLastName(b.full_name)

    return lastNameA.localeCompare(lastNameB)
  })
  const featuredArtwork = page.featuredArtwork as Artwork
  console.log(artists)

  return (
    <article>
      <div className="container padding-y">
        <ArtistPageHero data={page} />
        <ArtistDetails artists={artists} featuredArtwork={featuredArtwork} />
      </div>
      {page.Banners?.reachOutBoolean && <BannerReachOut />}
      {page.Banners?.newsletterBoolean && <BannerNewsletter />}
    </article>
  )
}
