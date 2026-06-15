import { cache } from 'react'
import { normalizeSlug } from '@/app/_utilities/normalizeSlug'

const DEFAULT_REVALIDATE = false as const

export function collectionTag(collection: string): string {
  return `cms:${collection}`
}

export function docTag(collection: string, slug: string): string {
  return `cms:${collection}:${slug}`
}

export function globalTag(slug: string): string {
  return `cms:global:${slug}`
}

type FetchPayloadOptions = {
  locale?: string
  revalidate?: number | false
  tags?: string[]
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: string
}

function getPayloadBase(): string | null {
  return process.env.NEXT_PUBLIC_PAYLOAD_URL?.replace(/\/$/, '') ?? null
}

async function fetchPayloadUncached<T>(
  path: string,
  { locale, revalidate = DEFAULT_REVALIDATE, tags = [], method = 'GET', body }: FetchPayloadOptions = {},
): Promise<T | null> {
  const base = getPayloadBase()
  const apiKey = process.env.PAYLOAD_API_KEY
  if (!base || !apiKey) {
    return null
  }

  const url = new URL(path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`)
  if (locale) {
    url.searchParams.set('locale', locale)
  }

  try {
    const res = await fetch(url.toString(), {
      method,
      body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `users API-Key ${apiKey}`,
      },
      next: { revalidate, tags },
    })

    if (!res.ok) {
      console.error('Payload fetch failed:', res.status, res.statusText, url.toString())
      return null
    }

    return (await res.json()) as T
  } catch (error) {
    console.error('Payload fetch error:', error)
    return null
  }
}

export type PayloadListResponse<T> = {
  docs: T[]
  totalDocs?: number
  limit?: number
  totalPages?: number
  page?: number
  pagingCounter?: number
  hasPrevPage?: boolean
  hasNextPage?: boolean
  prevPage?: number | null
  nextPage?: number | null
}

type ListOptions = {
  locale: string
  depth?: number
  limit?: number
  where?: Record<string, unknown>
  revalidate?: number | false
}

export const fetchList = cache(
  async <T>(
    collection: string,
    { locale, depth = 1, limit = 1000, where, revalidate }: ListOptions,
  ): Promise<PayloadListResponse<T> | null> => {
    const params = new URLSearchParams({
      locale,
      depth: String(depth),
      limit: String(limit),
    })
    if (where) {
      params.set('where', JSON.stringify(where))
    }
    return fetchPayloadUncached<PayloadListResponse<T>>(`/api/${collection}?${params}`, {
      locale,
      revalidate,
      tags: [collectionTag(collection)],
    })
  },
)

type DocOptions = {
  locale: string
  slug: string
  depth?: number
  revalidate?: number | false
}

export const fetchDocBySlug = cache(
  async <T>(
    collection: string,
    { locale, slug, depth = 2, revalidate }: DocOptions,
  ): Promise<PayloadListResponse<T> | null> => {
    const normalizedSlug = normalizeSlug(slug)
    const params = new URLSearchParams({
      locale,
      depth: String(depth),
      'where[slug][equals]': normalizedSlug,
    })
    return fetchPayloadUncached<PayloadListResponse<T>>(`/api/${collection}?${params}`, {
      locale,
      revalidate,
      tags: [collectionTag(collection), docTag(collection, normalizedSlug)],
    })
  },
)

type SingletonOptions = {
  locale: string
  depth?: number
  revalidate?: number | false
}

/** Payload singleton collections (homepage, artists-page, etc.) */
export const fetchSingleton = cache(
  async <T>(
    collection: string,
    { locale, depth = 2, revalidate }: SingletonOptions,
  ): Promise<PayloadListResponse<T> | null> => {
    const params = new URLSearchParams({
      locale,
      depth: String(depth),
    })
    return fetchPayloadUncached<PayloadListResponse<T>>(`/api/${collection}?${params}`, {
      locale,
      revalidate,
      tags: [collectionTag(collection)],
    })
  },
)

type GlobalOptions = {
  locale: string
  depth?: number
  revalidate?: number | false
}

export const fetchGlobal = cache(
  async <T>(slug: string, { locale, depth = 1, revalidate }: GlobalOptions): Promise<T | null> => {
    const params = new URLSearchParams({
      locale,
      depth: String(depth),
    })
    return fetchPayloadUncached<T>(`/api/globals/${slug}?${params}`, {
      locale,
      revalidate,
      tags: [globalTag(slug)],
    })
  },
)
