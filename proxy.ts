import { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

const INTERNAL_PORTS = new Set(['5173', '5174', '3000'])

const handleI18nRouting = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const proto = request.headers.get('x-forwarded-proto')
  const fwdPort = request.headers.get('x-forwarded-port')

  if (proto === 'https' && fwdPort && INTERNAL_PORTS.has(fwdPort)) {
    const headers = new Headers(request.headers)
    headers.set('x-forwarded-port', '443')
    const correctedRequest = new NextRequest(request.url, {
      headers,
      method: request.method,
      body: request.body,
      nextConfig: request.nextUrl,
    } as any)
    return handleI18nRouting(correctedRequest)
  }

  return handleI18nRouting(request)
}

export const config = {
  matcher: ['/((?!api|_next|next|.*\\..*|favicon.ico|proxy).*)'],
}
