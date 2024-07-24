import type { NewsletterBanner } from '@/app/payload-types'
import { languageTag } from '@/paraglide/runtime'
import Chevron from '@/components/SVG/Chevron'
import { Link } from '@/lib/i18n'
import BannerNewsletterComponent from './BannerNewsletterComponent'

import classes from './index.module.css'

async function getData(locale: string) {
  let data
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/globals/newsletter-banner?locale=${locale}&depth=1`,
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
    data = dataRes
  } catch (error) {
    console.error('Error fetching data:', error)
  }
  return data
}

export default async function BannerNewsletter() {
  const locale = languageTag()
  const data: NewsletterBanner = await getData(locale)
  const banner = data

  return (
    <section className="container padding-y-sm border-t-black">
      <BannerNewsletterComponent banner={banner} />
    </section>
  )
}
