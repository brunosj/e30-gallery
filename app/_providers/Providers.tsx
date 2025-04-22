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
    <PlausibleProvider domain="e30gallery.com">
      <NextIntlClientProvider messages={messages} locale={locale}>
        <AuthProvider api="rest">{children}</AuthProvider>
      </NextIntlClientProvider>
    </PlausibleProvider>
  )
}
