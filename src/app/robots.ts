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

  // LLM / AI crawlers — listed explicitly so `*-Extended` opt-ins and
  // search/training bots see a clear "allowed" directive for this site.
  // Each bot matches the MOST specific group in robots.txt, so this block
  // must repeat the private-path disallows.
  const aiBots = [
    // OpenAI
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
    // Anthropic
    'ClaudeBot', 'Claude-Web', 'Claude-SearchBot', 'anthropic-ai',
    // Perplexity
    'PerplexityBot', 'Perplexity-User',
    // Google Gemini / Apple Intelligence (opt-in)
    'Google-Extended', 'Applebot-Extended',
    // Common Crawl (feeds most open-source LLMs)
    'CCBot',
    // Others
    'DuckAssistBot', 'Amazonbot', 'Bytespider', 'YouBot',
    'MistralAI-User', 'Diffbot', 'Meta-ExternalAgent', 'cohere-ai',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...privatePaths, '/api/'],
      },
      {
        // Allow social media crawlers to access OG images
        userAgent: ['facebookexternalhit', 'Twitterbot', 'LinkedInBot', 'Slackbot'],
        allow: ['/api/og'],
      },
      {
        // Explicit allow for AI/LLM crawlers — signals opt-in for search
        // indexing and (where applicable) training. Keeps private areas
        // blocked, same as the default group.
        userAgent: aiBots,
        allow: '/',
        disallow: [...privatePaths, '/api/'],
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/image-sitemap.xml`],
    host: baseUrl,
  };
}
