import { Link, usePathname } from '@/lib/i18n'
import { languageTag } from '@/paraglide/runtime'
import classes from './index.module.css'

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const locale = languageTag()
  return (
    <div className={classes.switcher}>
      <Link href={pathname} locale="en" className={locale === 'en' ? `${classes.active}` : 'gray'}>
        EN
      </Link>
      <span>/</span>
      <Link href={pathname} locale="de" className={locale === 'de' ? `${classes.active}` : 'gray'}>
        DE
      </Link>
    </div>
  )
}
