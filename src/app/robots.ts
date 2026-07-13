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

  // Hidden locales (auto-translated, not human-reviewed). Routes still
  // resolve so any inbound link keeps working, but crawlers are asked
  // not to index — belt-and-braces alongside the noindex meta tag and
  // the absence of these from sitemap/hreflang. Re-enable a locale by
  // adding it to publicLocales in src/i18n/config.ts and removing it
  // from this list.
  // de + ro went public 2026-07-10 after a full re-translation from the
  // corrected Greek (ro is the largest foreign-visitor market — drive-in).
  const hiddenLocalePaths = ['/bg/', '/ru/', '/sr/'];

  // LLM / AI crawlers we allow — major Western search/training bots that
  // can drive real referral traffic or AI-chat citations. Each bot matches
  // the MOST specific group in robots.txt, so this block must repeat the
  // private-path disallows.
  const aiBots = [
    // OpenAI
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
    // Anthropic
    'ClaudeBot', 'Claude-Web', 'Claude-SearchBot', 'anthropic-ai',
    // Perplexity
    'PerplexityBot', 'Perplexity-User',
    // Google Gemini / Apple Intelligence (opt-in)
    'Google-Extended', 'Applebot-Extended',
    // DuckDuckGo AI, Mistral, Diffbot, Meta, Cohere, YouBot
    'DuckAssistBot', 'YouBot',
    'MistralAI-User', 'Diffbot', 'Meta-ExternalAgent', 'cohere-ai',
  ];

  // Aggressive / low-ROI crawlers we explicitly block to save bandwidth +
  // ISR write quota. Bytespider (ByteDance/TikTok) and Amazonbot (Alexa)
  // send near-zero referral traffic for a Greek tourism niche but crawl
  // very heavily. CCBot (Common Crawl) feeds open-source LLMs, but the
  // major ones we care about (ChatGPT, Claude, Gemini, Perplexity) crawl
  // us directly via their own bots, so dropping CCBot has minimal real
  // downside. Re-enable any of these by moving them to the `aiBots` list.
  const blockedBots = [
    'Bytespider', 'CCBot', 'Amazonbot',
    // SEO-tool crawlers: they index the site for THEIR paying customers
    // (competitor backlink reports), send zero referral traffic, and were
    // part of the bot swarm burning Fast Origin Transfer / function
    // invocations. Blocking them has no effect on Google/Bing rankings.
    'AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'BLEXBot',
    'DataForSeoBot', 'serpstatbot', 'ZoomBot', 'MegaIndex.ru',
    // PetalBot (Huawei/Petal Search) crawls aggressively; negligible reach
    // for a Greek tourism audience.
    'PetalBot',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        // /api/md/ is the markdown alternative for entity detail pages —
        // intentionally crawlable so LLM agents (Perplexity, Claude tool-use,
        // ChatGPT browse) can fetch clean machine-readable content.
        allow: ['/', '/api/md/'],
        disallow: [...privatePaths, ...hiddenLocalePaths, '/api/'],
      },
      {
        // Allow social media crawlers to access OG images
        userAgent: ['facebookexternalhit', 'Twitterbot', 'LinkedInBot', 'Slackbot'],
        allow: ['/api/og'],
      },
      {
        // Explicit allow for AI/LLM crawlers — signals opt-in for search
        // indexing and (where applicable) training. Keeps private areas
        // blocked, same as the default group. /api/md/ explicitly allowed
        // so these bots discover the markdown variants.
        userAgent: aiBots,
        allow: ['/', '/api/md/'],
        disallow: [...privatePaths, ...hiddenLocalePaths, '/api/'],
      },
      {
        // Full block for aggressive low-ROI crawlers (see blockedBots above).
        userAgent: blockedBots,
        disallow: '/',
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/image-sitemap.xml`],
    host: baseUrl,
  };
}
