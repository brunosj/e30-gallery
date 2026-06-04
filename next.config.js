const { withPlausibleProxy } = require('next-plausible')
const createNextIntlPlugin = require('next-intl/plugin')

const isDevelopment = process.env.NODE_ENV === 'development'
const plausibleSrc =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.e30gallery.com/js/script.js'

const productionOrigins = ['https://e30gallery.com', 'https://cms.e30gallery.com']

const uniqueAllowedDomains = domains =>
  [...new Set(domains.filter(domain => typeof domain === 'string' && domain.length > 0))]

const allowedDomains = uniqueAllowedDomains([
  process.env.NEXT_PUBLIC_PAYLOAD_URL,
  process.env.NEXT_PUBLIC_FRONTEND_URL,
  process.env.NEXT_PUBLIC_SITE_URL,
  ...productionOrigins,
  'https://art.kunstmatrix.com',
  'https://www.artworkarchive.com',
  'https://cdnjs.cloudflare.com',
  'https://*.mailerlite.com',
  'https://storage.mlcdn.com',
  'https://groot.mailerlite.com',
  'https://assets.mlcdn.com',
  'https://connect.mailerlite.com',
  'https://player.vimeo.com',
  'https://www.youtube.com',
  'https://plausible.e30gallery.com',
  'https://challenges.cloudflare.com',
  'https://*.cloudflare.com',
  ...(isDevelopment ? ['http://localhost:3000', 'http://localhost:5173'] : []),
])

const corsAllowOrigin = isDevelopment
  ? '*'
  : process.env.NEXT_PUBLIC_FRONTEND_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://e30gallery.com'

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' ${allowedDomains.join(' ')};
    style-src 'self' 'unsafe-inline' ${allowedDomains.join(' ')};
    img-src 'self' data: blob: ${allowedDomains.join(' ')};
    frame-src 'self' ${allowedDomains.join(' ')};
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self' ${allowedDomains.join(' ')};
    frame-ancestors 'none';
    connect-src 'self' ${isDevelopment ? '*' : allowedDomains.join(' ')};
    ${isDevelopment ? '' : 'upgrade-insecure-requests;'}
`
  .replace(/\s{2,}/g, ' ')
  .trim()

// Create the next-intl plugin
const withNextIntl = createNextIntlPlugin()

// Combine with the plausible proxy
const withPlugins = config => {
  // First apply the base config to withPlausibleProxy
  const withPlausible = withPlausibleProxy({
    src: plausibleSrc,
  })(config)

  // Then apply withNextIntl to the result
  return withNextIntl(withPlausible)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep your existing settings
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    const securityHeaders = [
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
      ...(isDevelopment
        ? []
        : [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
          ]),
    ]

    return [
      {
        source: '/(.*)',
        headers: [
          ...securityHeaders,
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: corsAllowOrigin,
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, Cache-Control',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
  images: {
    localPatterns: [
      {
        pathname: '/E30_logo.png',
        search: '?v=1',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/e30/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.e30gallery.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
}

module.exports = withPlugins(nextConfig)
