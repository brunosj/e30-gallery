import React from 'react'
import { redirect } from 'next/navigation'

import { buildPageMetadata } from '@/app/_utilities/generatePageMetadata'
import { RenderParams } from '../../_components/RenderParams'
import { getMeUser } from '../../_utilities/getMeUser'
import { CreateAccountForm } from './CreateAccountForm'

import classes from './index.module.css'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  return buildPageMetadata({
    locale,
    href: '/create-account',
    title: 'Create Account',
    description: 'Create your E30 Gallery account',
    noIndex: true,
  })
}

export default async function CreateAccount() {
  const result = await getMeUser({
    validUserRedirect: `/account?message=${encodeURIComponent(
      'Cannot create a new account while logged in, please log out and try again.',
    )}`,
  })

  if (result.redirectUrl) {
    redirect(result.redirectUrl)
  }

  return (
    <article className={classes.createAccount}>
      <h1>Create Account</h1>
      <RenderParams />
      <CreateAccountForm />
    </article>
  )
}
