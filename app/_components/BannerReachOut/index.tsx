import type { ReachOut } from '@/app/payload-types'
import { languageTag } from '@/paraglide/runtime'
import { RichText } from '@/components/RichText'
import { Button } from '@/components//Button'
import Chevron from '@/components/SVG/Chevron'
import BannerReachOutComponent from '@/components/BannerReachOut/BannerReachOutComponent'
import classes from './index.module.css'
import BannerReachOutComponentV2 from '@/components/BannerReachOut/BannerReachOutComponentV2'

async function getData(locale: string) {
  let data
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/globals/reach-out?locale=${locale}&depth=1`,
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

export default async function BannerReachOut() {
  const locale = languageTag()
  const data: ReachOut = await getData(locale)
  const banner = data

  return (
    // <BannerReachOutComponent data={banner} />
    <BannerReachOutComponentV2 data={banner} />
  )
}
