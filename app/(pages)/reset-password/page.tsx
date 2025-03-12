import type { ArtSocietyPage, Media } from '@/app/payload-types'
import React, { Suspense } from 'react'

import { languageTag } from '@/paraglide/runtime'
import Image from 'next/image'
import { ResetPasswordForm } from './ResetPasswordForm'
import BannerNewsletter from '@/components/BannerNewsletter'
import cn from 'classnames'
import { getImageUrl } from '@/app/_utilities/getImageUrl'
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
    title: pageData.docs[0].title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
    },
  }
}

export default async function ResetPassword() {
  const locale = languageTag()
  const { pageData } = await getData(locale)
  const page: ArtSocietyPage = pageData.docs[0]
  return (
    <>
      <article className={classes.grid}>
        <div className={cn(classes.imageColumn)}>
          <Image
            src={
              typeof page.resetPasswordImage === 'string'
                ? page.resetPasswordImage
                : getImageUrl(page.resetPasswordImage?.url ?? '')
            }
            alt={
              typeof page.resetPasswordImage === 'string'
                ? ''
                : (page.resetPasswordImage?.title ?? '')
            }
            className={classes.image}
            fill
          />
        </div>
        <div className={classes.formColumn}>
          <div className={classes.formContainer}>
            <ResetPasswordForm />
          </div>
        </div>
      </article>
      {page.Banners?.newsletterBoolean && (
        <Suspense fallback={null}>
          <BannerNewsletter />
        </Suspense>
      )}
    </>
  )
}
