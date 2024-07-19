const { paraglide } = require('@inlang/paraglide-next/plugin')

const allowedDomains = [process.env.NEXT_PUBLIC_PAYLOAD_URL, process.env.NEXT_PUBLIC_FRONTEND_URL]

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    frame-src 'self' https://art.kunstmatrix.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' ${allowedDomains.join(' ')};
    upgrade-insecure-requests;
`

module.exports = paraglide({
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
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // { key: 'Access-Control-Allow-Origin', value: 'http://localhost:5173' },
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
    ],
  },
})
