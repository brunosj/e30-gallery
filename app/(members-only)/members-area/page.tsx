import React from 'react'
import { languageTag } from '@/paraglide/runtime'
import MembersAreaPage from '@/components/MembersAreaPage/page'

import classes from './index.module.css'

async function getData(locale: string) {
  const urls = [
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/members-only-page?locale=${locale}&depth=1`,
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

export default function MembersArea() {
  return (
    <article>
      <MembersAreaPage />
    </article>
  )
}
