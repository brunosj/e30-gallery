import type { Menu } from '@/app/payload-types'
import { fetchGlobal } from '@/app/_utilities/fetchPayload'

export async function fetchMenu(locale: string): Promise<Menu | null> {
  return fetchGlobal<Menu>('menu', { locale, depth: 1 })
}
