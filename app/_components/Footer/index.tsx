import type { Footer } from '@/app/payload-types'
import { languageTag } from '@/paraglide/runtime'
import LongLogo from '@/components/SVG/LongLogo'
import * as m from '@/paraglide/messages.js'
import { FooterNav } from '@/components/Footer/Nav'
import cn from 'classnames'
import { Link } from '@/lib/i18n'
import classes from './index.module.css'

async function getData(locale: string) {
  let data
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/globals/footer?locale=${locale}&depth=1`,
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
    <>
      <footer className={classes.bg}>
        <div className={classes.footer}>
          <div className={classes.content}>
            <div className={classes.footerNav}>
              <FooterNav data={footer} />
            </div>
            <div className={classes.copyright}>
              <div className={cn(classes.logo, 'container padding-y-sm')}>
                <LongLogo />
              </div>
              <div className="container padding-y-sm">
                <p>
                  © {new Date().getFullYear()} E30 Gallery, {m.allRightsReserved()}. Website by{' '}
                  <Link
                    href="https://landozone.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.link}
                  >
                    landozone
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
