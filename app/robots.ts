import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://norexfashion.com').replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/checkout',  '/wishlist', '/login', '/signup'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
