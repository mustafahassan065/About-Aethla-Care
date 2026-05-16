/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://aethlacare.qa',
  generateRobotsTxt: true,
  exclude: ['/admin/*'],
  robotsTxtOptions: {
    additionalSitemaps: ['https://aethlacare.qa/sitemap.xml'],
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/api'] },
    ],
  },
}
