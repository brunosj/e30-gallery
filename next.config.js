const { paraglide } = require('@inlang/paraglide-next/plugin')
const { withPlausibleProxy } = require('next-plausible')

const isDevelopment = process.env.NODE_ENV === 'development'

const allowedDomains = [
  process.env.NEXT_PUBLIC_PAYLOAD_URL,
  process.env.NEXT_PUBLIC_FRONTEND_URL,
  'https://art.kunstmatrix.com',
  'https://www.artworkarchive.com',
  'https://cdnjs.cloudflare.com',
  'https://assets.mailerlite.com',
  'https://storage.mlcdn.com',
  'https://groot.mailerlite.com',
  'https://assets.mlcdn.com',
  'https://player.vimeo.com',
  'https://www.youtube.com',
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

module.exports = withPlausibleProxy({
  customDomain: 'https://plausible.e30gallery.com',
})(
  paraglide({
    paraglide: {
      project: './project.inlang',
      outdir: './paraglide',
    },
    // env: {
    //   NEXT_PUBLIC_PAYLOAD_URL: 'http://localhost:3000',
    // },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
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
  }),
)
