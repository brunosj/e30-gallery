import type { Footer } from '@/app/payload-types'
import { getLocale } from 'next-intl/server'
import LongLogo from '@/components/SVG/LongLogo'
import { getTranslations } from 'next-intl/server'
import { FooterNav } from '@/components/Footer/Nav'
import cn from 'classnames'
import { fetchGlobal } from '@/app/_utilities/fetchPayload'

import classes from './index.module.css'

export default async function Footer() {
  const locale = await getLocale()
  const footer = await fetchGlobal<Footer>('footer', { locale, depth: 1 })
  const t = await getTranslations()

  if (!footer) {
    return null
  }

  return (
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
                © {new Date().getFullYear()} E30 Gallery, {t('allRightsReserved')}. Website by{' '}
                <a
                  href="https://landozone.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.link}
                >
                  landozone
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
