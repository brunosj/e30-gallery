import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'de'],
  localePrefix: 'never',
  defaultLocale: 'de',

  // Use cookie for locale detection
  localeCookie: {
    // Custom name for the cookie
    name: 'NEXT_LOCALE',
    // Extended duration (one year)
    maxAge: 60 * 60 * 24 * 365,
  },

  // Configure localized pathnames
  pathnames: {
    '/artists': {
      en: '/artists',
      de: '/kuenstler',
    },
    '/exhibitions': {
      en: '/exhibitions',
      de: '/ausstellungen',
    },
    '/gallery': {
      en: '/gallery',
      de: '/galerie',
    },
    '/artists/[slug]': {
      en: '/artists/[slug]',
      de: '/kuenstler/[slug]',
    },
    '/art-society': {
      en: '/art-society',
      de: '/art-society',
    },
    '/members-area': {
      en: '/members-area',
      de: '/mitgliederbereich',
    },
    '/blog/[...slug]': {
      en: '/blog/[...slug]',
      de: '/blog/[...slug]',
    },
  },
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
