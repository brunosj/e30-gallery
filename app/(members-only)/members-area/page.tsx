import React from 'react'
import { Link } from '@/lib/i18n'
import { redirect } from '@/lib/i18n'
import { languageTag } from '@/paraglide/runtime'
import { Button } from '@/components/Button'
import { RenderParams } from '@/components/RenderParams'
import { getMeUser } from '@/utilities/getMeUser'
import * as m from '@/paraglide/messages.js'
import MembersAreaComponent from '@/components/MembersComponent'

import classes from './index.module.css'
import { MembersOnlyPage } from '@/app/payload-types'

async function getData(locale: string) {
  const urls = [`${process.env.PAYLOAD_URL}/api/members-only-page?locale=${locale}&depth=1`]

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
  console.log(metadata)
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
    },
  }
}
export default async function Account() {
  const locale = languageTag()
  const { pageData } = await getData(locale)
  const page: MembersOnlyPage = pageData.docs[0]

  return (
    <article className={classes.account}>
      <RenderParams className={classes.params} />
      <MembersAreaComponent data={page} />
    </article>
  )
}