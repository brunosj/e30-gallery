import type { ReachOut } from '@/app/payload-types'
import { languageTag } from '@/paraglide/runtime'

async function getData(locale: string) {
  let data
  try {
    const res = await fetch(
      `${process.env.PAYLOAD_URL}/api/globals/reach-out?locale=${locale}&depth=1`,
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
  console.log(banner)

  return (
    <section className="">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">{banner.title}</h2>
        {/* <p className="text-lg">{banner.text}</p> */}
      </div>
    </section>
  )
}
