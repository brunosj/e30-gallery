import { NextIntlClientProvider } from 'next-intl'
import type { Menu, Social } from '@/app/payload-types'
import { AuthProvider } from '@/providers/Auth'
import { MenuProvider } from '@/providers/Menu'
import { SocialsProvider } from '@/providers/Socials'

interface ProvidersProps {
  children: React.ReactNode
  locale: string
  messages: any
  menu?: Menu | null
  socials?: Social | null
}

export default function Providers({
  children,
  locale,
  messages,
  menu = null,
  socials = null,
}: ProvidersProps) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <MenuProvider menu={menu}>
        <SocialsProvider socials={socials}>
          <AuthProvider api="rest">{children}</AuthProvider>
        </SocialsProvider>
      </MenuProvider>
    </NextIntlClientProvider>
  )
}
