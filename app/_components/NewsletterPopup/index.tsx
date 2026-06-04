import type { NewsletterPopup } from '@/app/payload-types'
import { getLocale } from 'next-intl/server'
import NewsletterPopupComponent from './NewsletterPopupComponent'
import { fetchGlobal } from '@/app/_utilities/fetchPayload'

type Props = {
  triggerOnScroll?: boolean
  scrollPercentage?: number
  delayInSeconds?: number
}

export default async function NewsletterPopup({
  triggerOnScroll = true,
  scrollPercentage = 30,
  delayInSeconds = 2,
}: Props) {
  const locale = await getLocale()
  const data = await fetchGlobal<NewsletterPopup>('newsletter-popup', { locale, depth: 1 })

  if (!data) return null
  return (
    <NewsletterPopupComponent
      triggerOnScroll={triggerOnScroll}
      scrollPercentage={scrollPercentage}
      delayInSeconds={delayInSeconds}
    />
  )
}
