import PlausibleProvider from 'next-plausible'
import { NextIntlClientProvider } from 'next-intl'
import { AuthProvider } from '@/providers/Auth'

interface ProvidersProps {
  children: React.ReactNode
  locale: string
  messages: any
}

export default function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <PlausibleProvider
      domain="e30gallery.com"
      scriptProps={{
        onLoad: () => console.log('Plausible script loaded successfully'),
        onError: e => console.error('Plausible script failed to load:', e),
      }}
    >
      <NextIntlClientProvider messages={messages} locale={locale}>
        <AuthProvider api="rest">{children}</AuthProvider>
      </NextIntlClientProvider>
    </PlausibleProvider>
  )
}
