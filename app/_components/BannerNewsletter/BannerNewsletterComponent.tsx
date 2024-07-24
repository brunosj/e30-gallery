'use client'

import React from 'react'
import type { NewsletterBanner } from '@/app/payload-types'
import Chevron from '@/components/SVG/Chevron'
import { Link } from '@/lib/i18n'
import { Fade, Slide } from 'react-awesome-reveal'

import classes from './index.module.css'

export default function BannerNewsletterComponent({ banner }: { banner: NewsletterBanner }) {
  return (
    <React.Fragment>
      <Link href={banner.link.url} target="_blank" className={classes.link}>
        <Fade triggerOnce duration={750}>
          <Chevron color="var(--color-black)" size={35} className="iconTopLeft" />
          <div className={classes.title}>
            <h1 className={classes.heading}>{banner.title}</h1>
          </div>
          <Chevron color="var(--color-black)" size={35} className="iconBottomRight" />
        </Fade>
      </Link>
    </React.Fragment>
  )
}
