import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/auth/', '/admin/'],
      },
      {
        // Allow social media crawlers to access OG images
        userAgent: ['facebookexternalhit', 'Twitterbot', 'LinkedInBot', 'Slackbot'],
        allow: ['/api/og'],
      },
      {
        // Block all other bots from API routes (except OG)
        userAgent: '*',
        disallow: ['/api/'],
        allow: ['/api/og'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
