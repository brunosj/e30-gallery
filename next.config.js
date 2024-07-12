const { paraglide } = require('@inlang/paraglide-next/plugin')
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = paraglide({
  paraglide: {
    project: './project.inlang',
    outdir: './paraglide',
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
  ...nextConfig,
})
