'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { useRouter } from '@/i18n/routing'
import { useSearchParams, useParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import classes from './index.module.css'
import { motion, Variants } from 'motion/react'

const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: 'easeOut',
      delay: 0.4,
    },
  },
}

type Props = {
  theme: 'light' | 'dark'
}

export default function LanguageSwitcher({ theme = 'light' }: Props) {
  const pathname = usePathname()
  const locale = useLocale()
  const params = useParams()

  // Function to create the appropriate link href based on the current route
  const createHref = (targetLocale: string) => {
    // For dynamic artist pages, we need to include the slug parameter
    if (pathname.includes('/artists/') || pathname.includes('/kuenstler/')) {
      const slug = params?.slug
      if (slug) {
        // Use type assertion to handle the type compatibility
        return {
          pathname: '/artists/[slug]',
          params: { slug: slug as string },
        } as any
      }
    }

    // For dynamic blog pages
    if (pathname.includes('/insights/')) {
      const slug = params?.slug
      if (slug) {
        // Use type assertion to handle the type compatibility
        return {
          pathname: '/insights/[...slug]',
          params: { slug: Array.isArray(slug) ? slug : [slug as string] },
        } as any
      }
    }

    // For static routes, use the pathname directly
    return pathname
  }

  const getLanguageClass = (language: string) => {
    if (locale === language) {
      return `${classes.active} ${theme === 'light' ? classes.fontBlack : classes.fontWhite}`
    }
    return classes.fontGray
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInVariants}
      className={classes.switcher}
    >
      <Link href={createHref('en')} locale="en">
        <span className={getLanguageClass('en')}>EN</span>
      </Link>
      <span className={theme === 'light' ? classes.fontBlack : classes.fontWhite}>/</span>
      <Link href={createHref('de')} locale="de">
        <span className={getLanguageClass('de')}>DE</span>
      </Link>
    </motion.div>
  )
}
