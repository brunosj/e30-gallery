'use client'

import { GenericPage } from '@/app/payload-types'
import { RichText } from '@/components/RichText'
import classes from './index.module.css'

interface GenericPageClientProps {
  page: GenericPage
}

export const GenericPageClient: React.FC<GenericPageClientProps> = ({ page }) => {
  return (
    <article className={classes.page}>
      <div className="container padding-y">
        <div className={classes.text}>
          <h1 className="padding-b">{page.title}</h1>
          {page.meta?.description ? (
            <p className={classes.lead}>{page.meta.description}</p>
          ) : null}
          <RichText content={page.text} />
        </div>
      </div>
    </article>
  )
}

export default GenericPageClient
