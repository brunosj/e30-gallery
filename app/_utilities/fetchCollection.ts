import { fetchList, type PayloadListResponse } from '@/app/_utilities/fetchPayload'

type FetchCollectionOptions = {
  locale: string
  limit?: number
  depth?: number
}

export async function fetchCollection<T extends { slug?: string | null }>(
  collection: string,
  { locale, limit = 1000, depth = 0 }: FetchCollectionOptions,
): Promise<PayloadListResponse<T> | null> {
  return fetchList<T>(collection, { locale, limit, depth })
}

export type { PayloadListResponse }
