/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://e30gallery.com',
  generateRobotsTxt: true,
}
