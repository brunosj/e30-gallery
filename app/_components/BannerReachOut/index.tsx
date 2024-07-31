import type { ReachOut } from '@/app/payload-types'
import { languageTag } from '@/paraglide/runtime'
import { RichText } from '@/components/RichText'
import { Button } from '@/components//Button'
import Chevron from '@/components/SVG/Chevron'

import classes from './index.module.css'

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
    <section className={classes.bg}>
      <div className={[classes.reachOut, 'container', 'padding-y-sm'].filter(Boolean).join(' ')}>
        <div className={classes.title}>
          <Chevron color="var(--color-white)" size={25} className="iconTopLeft" />
          <div className={classes.title}>
            <div className="spacedTitle">
              {banner.title.split(' ').map((word, index) => (
                <span className={classes.titleElements} key={index}>
                  {word}
                </span>
              ))}
            </div>
          </div>
          <Chevron color="var(--color-white)" size={25} className="iconBottomRight" />
        </div>
        <div className={classes.content}>
          <div className={classes.text}>
            <RichText content={banner.text} />
          </div>
          <Button link={banner.link} />
        </div>
      </div>
    </section>
  )
}
