import type { Social } from '@/app/payload-types'
import { fetchGlobal } from '@/app/_utilities/fetchPayload'

export async function fetchSocials(locale: string): Promise<Social | null> {
  return fetchGlobal<Social>('socials', { locale, depth: 1 })
}
