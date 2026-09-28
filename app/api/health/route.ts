import { NextResponse } from 'next/server'

// Deploy + uptime health check: must fail when the CMS (or its MongoDB) is down, unlike `/`.
export const dynamic = 'force-dynamic'

export async function GET() {
  const base = process.env.NEXT_PUBLIC_PAYLOAD_URL?.replace(/\/$/, '')
  const apiKey = process.env.PAYLOAD_API_KEY
  if (!base || !apiKey) {
    return NextResponse.json({ status: 'error', cms: 'not configured' }, { status: 503 })
  }

  try {
    const res = await fetch(`${base}/api/globals/footer?depth=0`, {
      headers: { Authorization: `users API-Key ${apiKey}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) {
      return NextResponse.json({ status: 'error', cms: res.status }, { status: 503 })
    }
    return NextResponse.json({ status: 'ok' })
  } catch {
    return NextResponse.json({ status: 'error', cms: 'unreachable' }, { status: 503 })
  }
}
