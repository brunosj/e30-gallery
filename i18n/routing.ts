import { defineRouting } from 'next-intl/routing'

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
      de: '/gallery',
    },
    '/artists/[slug]': {
      en: '/artists/[slug]',
      de: '/kuenstler/[slug]',
    },
    '/exhibitions/[slug]': {
      en: '/exhibitions/[slug]',
      de: '/exhibitions/[slug]',
    },
    '/insights': {
      en: '/insights',
      de: '/insights',
    },
    '/art-society': {
      en: '/art-society',
      de: '/art-society',
    },
    '/members-area': {
      en: '/members-area',
      de: '/mitgliederbereich',
    },
    '/insights/[slug]': {
      en: '/insights/[slug]',
      de: '/insights/[slug]',
    },
    '/contact': {
      en: '/contact',
      de: '/kontakt',
    },
    '/legal': {
      en: '/legal-notice',
      de: '/rechtlicher-hinweis',
    },
    '/data-privacy': {
      en: '/data-privacy',
      de: '/datenschutz',
    },
    '/newsletter': {
      en: '/newsletter',
      de: '/newsletter',
    },
    '/newsletter-success': {
      en: '/newsletter-success',
      de: '/newsletter-success',
    },
  },
})
