import type { NewsletterPopup } from '@/app/payload-types'
import { getLocale } from 'next-intl/server'

import NewsletterPopupComponent from './NewsletterPopupComponent'

import classes from './index.module.css'

type Props = {
  triggerOnScroll?: boolean
  scrollPercentage?: number
  delayInSeconds?: number
}

async function getData(locale: string) {
  let data
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/globals/newsletter-popup?locale=${locale}&depth=1`,
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

export default async function NewsletterPopup({
  triggerOnScroll = true,
  scrollPercentage = 30,
  delayInSeconds = 2,
}: Props) {
  const locale = await getLocale()
  const data: NewsletterPopup = await getData(locale)

  if (!data) return null
  return (
    <NewsletterPopupComponent
      code={data.newsletter || ''}
      triggerOnScroll={triggerOnScroll}
      scrollPercentage={scrollPercentage}
      delayInSeconds={delayInSeconds}
    />
  )
}
