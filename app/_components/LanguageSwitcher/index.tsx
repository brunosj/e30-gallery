import { Link, usePathname } from '@/lib/i18n'
import { languageTag } from '@/paraglide/runtime'

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const locale = languageTag()
  return (
    <div className="flex ">
      <Link href={pathname} locale="en" className={locale === 'en' ? 'font-bold' : 'text-gray-400'}>
        EN
      </Link>
      <span>/</span>
      <Link href={pathname} locale="de" className={locale === 'de' ? 'font-bold' : 'text-gray-400'}>
        DE
      </Link>
    </div>
  )
}
