import type { NewsletterBanner } from '@/app/payload-types'
import { getLocale } from 'next-intl/server'
import BannerNewsletterComponent from './BannerNewsletterComponent'
import { fetchGlobal } from '@/app/_utilities/fetchPayload'

export default async function BannerNewsletter() {
  const locale = await getLocale()
  const banner = await fetchGlobal<NewsletterBanner>('newsletter-banner', { locale, depth: 1 })

  if (!banner) {
    return null
  }

  return (
    <section className="container bgWhite padding-y-sm border-t-black">
      <BannerNewsletterComponent banner={banner} />
    </section>
  )
}
