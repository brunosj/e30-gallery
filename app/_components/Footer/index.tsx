import type { Footer } from '@/app/payload-types'
import { languageTag } from '@/paraglide/runtime'
import LongLogo from '@/components/SVG/LongLogo'
import * as m from '@/paraglide/messages.js'

import classes from './index.module.css'

async function getData(locale: string) {
  let data
  try {
    const res = await fetch(
      `${process.env.PAYLOAD_URL}/api/globals/footer?locale=${locale}&depth=1`,
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

export default async function Footer() {
  const locale = languageTag()
  const data: Footer = await getData(locale)
  const footer = data

  return (
    <section className={classes.bg}>
      <div className={[classes.footer, ''].filter(Boolean).join(' ')}>
        <div className={classes.content}>
          <div className={[classes.logo, 'container padding-y'].filter(Boolean).join(' ')}>
            <LongLogo />
          </div>
          <div className="container padding-y-sm">
            <p>
              © {new Date().getFullYear()}. E30 Gallery, {m.allRightsReserved()}.
            </p>
          </div>
          {/* <div className={classes.text}>
            <RichText content={banner.text} />
          </div> */}
          {/* <Button
            href={banner.link.url}
            newTab={banner.link.newTab}
            label={banner.link.label}
            appearance={banner.link.appearance}
          /> */}
        </div>
      </div>
    </section>
  )
}