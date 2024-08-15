import { Link, usePathname } from '@/lib/i18n'
import { languageTag } from '@/paraglide/runtime'
import classes from './index.module.css'
import { motion } from 'framer-motion'

const fadeInVariants = {
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
  const locale = languageTag()

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
      <Link href={pathname} locale="en">
        <span className={getLanguageClass('en')}>EN</span>
      </Link>
      <span className={theme === 'light' ? classes.fontBlack : classes.fontWhite}>/</span>
      <Link href={pathname} locale="de">
        <span className={getLanguageClass('de')}>DE</span>
      </Link>
    </motion.div>
  )
}
