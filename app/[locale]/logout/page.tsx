import React from 'react'

import { buildPageMetadata } from '@/app/_utilities/generatePageMetadata'
import { LogoutPage } from './LogoutPage'
import BannerNewsletter from '@/components/BannerNewsletter'

import classes from './index.module.css'
import type { Metadata } from 'next'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    locale,
    href: '/logout',
    title: 'Logout',
    noIndex: true,
  })
}

export default async function Logout() {
  return (
    <>
      <article className={classes.logout}>
        <LogoutPage />
      </article>
      <BannerNewsletter />
    </>
  )
}
