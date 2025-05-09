import { NextIntlClientProvider } from 'next-intl'
import { AuthProvider } from '@/providers/Auth'

interface ProvidersProps {
  children: React.ReactNode
  locale: string
  messages: any
}

export default function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AuthProvider api="rest">{children}</AuthProvider>
    </NextIntlClientProvider>
  )
}
