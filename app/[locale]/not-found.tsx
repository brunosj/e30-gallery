import classes from './index.module.css'
import { getTranslations } from 'next-intl/server'

export default async function NotFoundPage() {
  const t = await getTranslations()
  return (
    <article className={classes.notFound}>
      <div className="container padding-y centered">
        <h1>{t('pageNotFound')}</h1>
      </div>
    </article>
  )
}
