'use client'

import React, { useState, useEffect } from 'react'
import { languageTag } from '@/paraglide/runtime'
import { RenderParams } from '@/components/RenderParams'
import MembersAreaComponent from '@/components/MembersComponent'
import { RiseLoader } from 'react-spinners'
import classes from './index.module.css'
import { MembersOnlyPage } from '@/app/payload-types'

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

export default function MembersAreaPage() {
  const locale = languageTag()
  const [page, setPage] = useState<MembersOnlyPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const { pageData } = await getData(locale)
        setPage(pageData.docs[0])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [locale])

  if (loading) {
    return (
      <div className="loader">
        <RiseLoader />
      </div>
    )
  }

  if (!page) {
    return <div>Error loading page data</div>
  }

  return (
    <>
      <RenderParams className={classes.params} />
      <MembersAreaComponent data={page} />
    </>
  )
}
