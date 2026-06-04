import { getSiteUrl } from '@/app/_utilities/siteUrl'

type BreadcrumbItem = { name: string; url: string }

type StructuredDataProps = {
  locale: string
  includeBaseSchemas?: boolean
  type?: 'website' | 'article' | 'person' | 'event' | 'breadcrumb'
  pageTitle?: string
  pageDescription?: string
  pageUrl?: string
  pageImage?: string
  publishedTime?: string
  modifiedTime?: string
  breadcrumbs?: BreadcrumbItem[]
  personName?: string
  personCountry?: string
  personWebsite?: string
  eventStartDate?: string
  eventEndDate?: string
  eventLocation?: string
}

export function StructuredData({
  locale,
  includeBaseSchemas = true,
  type = 'website',
  pageTitle,
  pageDescription,
  pageUrl,
  pageImage,
  publishedTime,
  modifiedTime,
  breadcrumbs,
  personName,
  personCountry,
  personWebsite,
  eventStartDate,
  eventEndDate,
  eventLocation,
}: StructuredDataProps) {
  const baseUrl = getSiteUrl()
  const siteName = 'E30 Gallery'
  const siteDescription =
    'Contemporary art gallery in Frankfurt am Main, Germany — exhibitions, artists, and cultural programming.'
  const logoImage = `${baseUrl}/e30-gallery.jpg`
  const organizationId = `${baseUrl}/#organization`
  const websiteId = `${baseUrl}/#website`

  const organizationSchema = {
    '@type': 'ArtGallery',
    '@id': organizationId,
    name: siteName,
    url: baseUrl,
    logo: { '@type': 'ImageObject', url: logoImage },
    image: logoImage,
    description: siteDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Frankfurt am Main',
      addressCountry: 'DE',
    },
    sameAs: [
      'https://www.instagram.com/e30gallery/',
      'https://www.facebook.com/e30gallery',
    ],
  }

  const websiteSchema = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: baseUrl,
    name: siteName,
    description: siteDescription,
    publisher: { '@id': organizationId },
    inLanguage: ['en', 'de'],
  }

  const baseGraph = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema, websiteSchema],
  }

  const schemas: Array<Record<string, unknown>> = []

  if (type === 'article' && pageTitle && pageUrl) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: pageTitle,
      description: pageDescription || siteDescription,
      image: pageImage || logoImage,
      url: pageUrl,
      datePublished: publishedTime || new Date().toISOString(),
      dateModified: modifiedTime || publishedTime || new Date().toISOString(),
      author: { '@type': 'Organization', name: siteName },
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: { '@type': 'ImageObject', url: logoImage },
      },
      inLanguage: locale === 'de' ? 'de-DE' : 'en-US',
      mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    })
  }

  if (type === 'person' && pageTitle && pageUrl) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: personName || pageTitle,
      url: pageUrl,
      image: pageImage || logoImage,
      description: pageDescription,
      nationality: personCountry || undefined,
      sameAs: personWebsite ? [personWebsite] : undefined,
      worksFor: { '@type': 'ArtGallery', name: siteName, url: baseUrl },
    })
  }

  if (type === 'event' && pageTitle && pageUrl) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ExhibitionEvent',
      name: pageTitle,
      description: pageDescription,
      url: pageUrl,
      image: pageImage || logoImage,
      startDate: eventStartDate,
      endDate: eventEndDate,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: eventLocation || siteName,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Frankfurt am Main',
          addressCountry: 'DE',
        },
      },
      organizer: { '@type': 'ArtGallery', name: siteName, url: baseUrl },
    })
  }

  if (type === 'breadcrumb' && breadcrumbs?.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    })
  }

  return (
    <>
      {includeBaseSchemas && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(baseGraph) }}
        />
      )}
      {schemas.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
