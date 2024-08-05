import type { NewsletterPage } from '@/app/payload-types'

import Script from 'next/script'

type Props = {
  data: NewsletterPage
}
const NewsletterEmbed = ({ data }: Props) => {
  return (
    <div className="padding-y">
      {/* MailerLite Universal */}
      <Script id="mailerlite-script">{data.newsletter}</Script>
      {/* End MailerLite Universal */}

      {/* MailerLite Form */}
      <div className="ml-embedded" data-form="ylMNsi"></div>
    </div>
  )
}

export default NewsletterEmbed
