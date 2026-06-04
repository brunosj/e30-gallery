'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { useParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { getLocaleSwitchHref } from '@/app/_utilities/localizedUrl'
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
  const router = useRouter()
  const locale = useLocale()
  const params = useParams()

  const switchLocale = (nextLocale: string) => {
    if (nextLocale === locale) return
    const href = getLocaleSwitchHref(pathname, params)
    router.replace(href as Parameters<typeof router.replace>[0], { locale: nextLocale })
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
      <button
        type="button"
        className={classes.localeButton}
        onClick={() => switchLocale('en')}
        aria-current={locale === 'en' ? 'true' : undefined}
      >
        <span className={getLanguageClass('en')}>EN</span>
      </button>
      <span className={theme === 'light' ? classes.fontBlack : classes.fontWhite}>/</span>
      <button
        type="button"
        className={classes.localeButton}
        onClick={() => switchLocale('de')}
        aria-current={locale === 'de' ? 'true' : undefined}
      >
        <span className={getLanguageClass('de')}>DE</span>
      </button>
    </motion.div>
  )
}
