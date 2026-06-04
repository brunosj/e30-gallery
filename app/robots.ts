import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/app/_utilities/siteUrl'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/create-account',
          '/recover-password',
          '/reset-password',
          '/logout',
          '/newsletter-success',
          '/members-area',
          '/mitgliederbereich',
          '/account',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
