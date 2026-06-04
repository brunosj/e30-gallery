import type { GenericPage } from '@/app/payload-types'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import {
  buildNotFoundMetadata,
  buildPageMetadata,
} from '@/app/_utilities/generatePageMetadata'
import {
  genericPageHref,
  localizedAbsoluteUrl,
} from '@/app/_utilities/localizedUrl'
import { getSiteUrl } from '@/app/_utilities/siteUrl'
import { StructuredData } from '@/app/_components/StructuredData'
import type { Metadata } from 'next'
import GenericPageClient from '@/app/_components/GenericPageClient'
import { fetchDocBySlug } from '@/app/_utilities/fetchPayload'
import { generateLocaleSlugParams } from '@/app/_utilities/staticParams'

export const dynamicParams = true

export async function generateStaticParams() {
  return generateLocaleSlugParams('generic-pages')
}

type Params = Promise<{ locale: string; slug: string }>

const getData = cache(async (locale: string, slug: string) => {
  const pageData = await fetchDocBySlug<GenericPage>('generic-pages', {
    locale,
    slug,
    depth: 1,
  })
  return { pageData }
})

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  const { pageData } = await getData(locale, slug)

  if (!pageData?.docs.length) {
    return buildNotFoundMetadata()
  }

  const doc = pageData.docs[0]
  const metadata = doc.meta
  return buildPageMetadata({
    locale,
    href: genericPageHref(slug),
    title: doc.title || slug,
    description: metadata?.description,
    keywords: metadata?.keywords,
  })
}

export default async function GenericPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  const { pageData } = await getData(locale, slug)

  if (!pageData?.docs.length) {
    return notFound()
  }

  const page: GenericPage = pageData.docs[0]
  const pageUrl = localizedAbsoluteUrl(getSiteUrl(), locale, genericPageHref(slug))

  return (
    <>
      <StructuredData
        locale={locale}
        includeBaseSchemas={false}
        type="breadcrumb"
        breadcrumbs={[{ name: page.title || slug, url: pageUrl }]}
      />
      <GenericPageClient page={page} />
    </>
  )
}
