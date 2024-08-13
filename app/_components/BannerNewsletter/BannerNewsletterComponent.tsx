'use client'

import React from 'react'
import type { NewsletterBanner } from '@/app/payload-types'
import Chevron from '@/components/SVG/Chevron'
import { Link } from '@/lib/i18n'
import { fadeInVariants } from '@/utilities/animationVariants'
import { motion } from 'framer-motion'

import classes from './index.module.css'

export default function BannerNewsletterComponent({ banner }: { banner: NewsletterBanner }) {
  return (
    <React.Fragment>
      <Link href={banner.link.reference?.value.slug} className={classes.link}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.9 }}
          variants={fadeInVariants}
        >
          <Chevron color="var(--color-black)" size={35} className="iconTopLeft" />
          <div className={classes.title}>
            <h1 className={classes.heading}>{banner.title}</h1>
          </div>
          <Chevron color="var(--color-black)" size={35} className="iconBottomRight" />
        </motion.div>
      </Link>
    </React.Fragment>
  )
}
