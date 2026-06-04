import type { ArtSocietyPage } from '../../payload-types'
import { cache } from 'react'
import React from 'react'
import { redirect } from 'next/navigation'
import { RenderParams } from '@/components/RenderParams'
import { getMeUser } from '../../_utilities/getMeUser'
import cn from 'classnames'
import { ArtSocietyHero } from '@/components/ArtSocietyHero'
import { ArtSocietyBenefits } from '@/components/ArtSocietyBenefits'
import { Testimonials } from '@/components/Testimonials'
import classes from './index.module.css'
import { buildPageMetadata } from '@/app/_utilities/generatePageMetadata'
import { fetchSingleton } from '@/app/_utilities/fetchPayload'
import type { Metadata } from 'next'

type Params = Promise<{ locale: string }>

const getData = cache(async (locale: string) => {
  const pageData = await fetchSingleton<ArtSocietyPage>('art-society-page', { locale, depth: 1 })
  if (!pageData?.docs?.length) {
    throw new Error('Failed to fetch art society page')
  }
  return { pageData }
})

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const { pageData } = await getData(locale)
  const doc = pageData.docs[0]
  const metadata = doc.meta
  return buildPageMetadata({
    locale,
    href: '/art-society',
    title: doc.title ?? '',
    description: metadata?.description,
    keywords: metadata?.keywords,
  })
}

export default async function Login({ params }: { params: Params }) {
  const { locale } = await params
  const { pageData } = await getData(locale)
  const page: ArtSocietyPage = pageData.docs[0]

  const result = await getMeUser({
    validUserRedirect: `/members-area`,
  })

  if (result.redirectUrl) {
    redirect(result.redirectUrl)
  }

  return (
    <article>
      <RenderParams className={cn(classes.params, 'container')} />
      <ArtSocietyHero data={page} />
      <ArtSocietyBenefits data={page} />
      <Testimonials data={page} />
    </article>
  )
}
