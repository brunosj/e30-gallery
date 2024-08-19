import type { ArtSocietyPage, Testimonial } from '../../payload-types'

import React from 'react'
import { redirect } from '@/lib/i18n'
import { languageTag } from '@/paraglide/runtime'
import { RenderParams } from '@/components/RenderParams'
import { getMeUser } from '../../_utilities/getMeUser'
import cn from 'classnames'
import { ArtSocietyHero } from '@/components/ArtSocietyHero'
import { ArtSocietyBenefits } from '@/components/ArtSocietyBenefits'
import { Testimonials } from '@/components/Testimonials'
import classes from './index.module.css'

async function getData(locale: string) {
  const urls = [
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/art-society-page?locale=${locale}&depth=1`,
  ]

  const fetchPromises = urls.map(url =>
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
      },
    }),
  )

  try {
    const responses = await Promise.all(fetchPromises)
    const data = await Promise.all(responses.map(res => res.json()))
    const pageData = data[0]
    return { pageData }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export async function generateMetadata() {
  const locale = languageTag()
  const { pageData } = await getData(locale)
  const metadata = pageData.docs[0].meta
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
    },
  }
}

export default async function Login() {
  const locale = languageTag()
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
