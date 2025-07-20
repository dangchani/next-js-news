import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/admin/',
        '/_next/',
        '/favicon.ico',
      ],
    },
    sitemap: 'https://your-domain.com/sitemap.xml',
  }
} 