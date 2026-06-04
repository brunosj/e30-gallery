import type { ArtSocietyPage } from '@/app/payload-types'
import React from 'react'
import Image from 'next/image'
import { ResetPasswordForm } from './ResetPasswordForm'
import BannerNewsletter from '@/components/BannerNewsletter'
import cn from 'classnames'
import { getImageUrl } from '@/app/_utilities/getImageUrl'
import classes from './index.module.css'
import { buildPageMetadata } from '@/app/_utilities/generatePageMetadata'
import { fetchSingleton } from '@/app/_utilities/fetchPayload'
import type { Metadata } from 'next'

type Params = Promise<{ locale: string }>

async function getArtSocietyPage(locale: string) {
  const pageData = await fetchSingleton<ArtSocietyPage>('art-society-page', { locale, depth: 1 })
  if (!pageData?.docs?.length) {
    throw new Error('Failed to fetch art society page')
  }
  return pageData
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const pageData = await getArtSocietyPage(locale)
  const doc = pageData.docs[0]
  const metadata = doc.meta
  return buildPageMetadata({
    locale,
    href: '/reset-password',
    title: doc.title ?? '',
    description: metadata?.description,
    noIndex: true,
  })
}

export default async function ResetPassword({ params }: { params: Params }) {
  const { locale } = await params
  const pageData = await getArtSocietyPage(locale)
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
      {page.Banners?.newsletterBoolean && <BannerNewsletter />}
    </>
  )
}
