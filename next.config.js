const { withPlausibleProxy } = require('next-plausible')
const createNextIntlPlugin = require('next-intl/plugin')

const isDevelopment = process.env.NODE_ENV === 'development'

const allowedDomains = [
  process.env.NEXT_PUBLIC_PAYLOAD_URL,
  process.env.NEXT_PUBLIC_FRONTEND_URL,
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
]

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
    customDomain: 'https://plausible.e30gallery.com',
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
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: isDevelopment ? '*' : process.env.NEXT_PUBLIC_FRONTEND_URL,
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
