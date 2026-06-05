import { fetchGlobal } from '@/app/_utilities/fetchPayload'
import { LLMS_TXT_DEFAULT } from '@/app/_utilities/llmsTxtDefault'
import type { LlmsTxt } from '@/app/payload-types'

export async function GET() {
  const data = await fetchGlobal<LlmsTxt>('llms-txt', { locale: 'en', depth: 0 })
  const content = data?.content?.trim() || LLMS_TXT_DEFAULT

  return new Response(content, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
