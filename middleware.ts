import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all paths except static assets, API routes, etc.
  matcher: [
    // Match all routes except:
    // - _next (Next.js files)
    // - api (API routes)
    // - Static files with extensions (like .jpg, .png, etc.)
    // - Specific static files like favicon.ico
    // - proxy (proxy)
    '/((?!api|_next|.*\\..*|favicon.ico|proxy).*)',
  ],
}
