import Script from 'next/script'

const NewsletterEmbed = () => {
  return (
    <div className="padding-y">
      {/* MailerLite Universal */}
      <Script id="mailerlite-script">
        {`
          (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
          .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
          n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
          (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
          ml('account', '892300');
        `}
      </Script>
      {/* End MailerLite Universal */}

      {/* MailerLite Form */}
      <div className="ml-embedded" data-form="ylMNsi"></div>
    </div>
  )
}

export default NewsletterEmbed
