'use client'

import Script from 'next/script'

type Props = {
  code: string
}
const NewsletterEmbed = ({ code }: Props) => {
  return (
    <div>
      {/* MailerLite Universal */}
      <Script id="mailerlite-script">{code}</Script>
      {/* End MailerLite Universal */}

      {/* MailerLite Form */}
      <div className="ml-embedded" data-form="ylMNsi"></div>
    </div>
  )
}

export default NewsletterEmbed
