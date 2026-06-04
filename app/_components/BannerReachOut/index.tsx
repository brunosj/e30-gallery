import type { ReachOut } from '@/app/payload-types'
import { getLocale } from 'next-intl/server'
import BannerReachOutComponentV2 from '@/components/BannerReachOut/BannerReachOutComponentV2'
import { fetchGlobal } from '@/app/_utilities/fetchPayload'

export default async function BannerReachOut() {
  const locale = await getLocale()
  const data = await fetchGlobal<ReachOut>('reach-out', { locale, depth: 1 })

  if (!data) {
    return null
  }

  return <BannerReachOutComponentV2 data={data} />
}
