import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

  // Block private areas across all locales. With `localePrefix: 'as-needed'`
  // the default locale ('el') is unprefixed, so we also list raw paths.
  const privatePaths = [
    '/dashboard/',
    '/auth/',
    '/admin/',
    '/en/dashboard/', '/en/auth/', '/en/admin/',
    '/de/dashboard/', '/de/auth/', '/de/admin/',
    '/bg/dashboard/', '/bg/auth/', '/bg/admin/',
    '/ru/dashboard/', '/ru/auth/', '/ru/admin/',
    '/ro/dashboard/', '/ro/auth/', '/ro/admin/',
    '/sr/dashboard/', '/sr/auth/', '/sr/admin/',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
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
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/image-sitemap.xml`],
  };
}
