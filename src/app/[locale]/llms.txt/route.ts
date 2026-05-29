/**
 * Per-locale /llms.txt — same generator as the root /llms.txt, but with
 * village/beach descriptions and area headings in the requested language.
 * URLs in the output are prefixed with /<locale>/ (except `el`, which is
 * the default unprefixed locale).
 *
 * Accessible as /el/llms.txt, /en/llms.txt, /de/llms.txt, ...
 */

import { generateLlmsTxt } from '@/lib/llms-txt';

export const revalidate = 86400;
export const dynamic = 'force-static';

const SUPPORTED = new Set(['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr']);

export function generateStaticParams() {
  return Array.from(SUPPORTED).map(locale => ({ locale }));
}

type Ctx = { params: Promise<{ locale: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { locale } = await ctx.params;
  if (!SUPPORTED.has(locale)) {
    return new Response('Unsupported locale', { status: 404 });
  }
  const body = await generateLlmsTxt(locale);
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      'Content-Language': locale,
    },
  });
}
