import * as m from '@/paraglide/messages.js'
import classes from './index.module.css'

export default function NotFoundPage() {
  return (
    <article className={classes.notFound}>
      <div className="container padding-y centered">
        <h1>{m.pageNotFound()}</h1>
      </div>
    </article>
  )
}
