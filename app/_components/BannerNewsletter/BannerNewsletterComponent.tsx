'use client'

import React from 'react'
import type { NewsletterBanner } from '@/app/payload-types'
import Chevron from '@/components/SVG/Chevron'
import { Link } from '@/i18n/navigation'

import { fadeInVariants } from '@/utilities/animationVariants'
import { motion } from 'framer-motion'

import classes from './index.module.css'

export default function BannerNewsletterComponent({ banner }: { banner: NewsletterBanner }) {
  return (
    <React.Fragment>
      <Link
        href={
          banner.link.reference?.relationTo && banner.link.reference.value
            ? {
                pathname: `/${banner.link.reference.relationTo}` as any,
                query:
                  banner.link.type === 'reference' &&
                  typeof banner.link.reference.value !== 'string'
                    ? { id: (banner.link.reference.value as { id: string }).id }
                    : undefined,
              }
            : ('/newsletter-page' as any)
        }
        className={classes.link}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
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
