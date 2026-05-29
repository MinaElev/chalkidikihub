/**
 * Canonical /llms.txt (English). Per-locale variants live at
 * /[locale]/llms.txt; both share the generator in src/lib/llms-txt.ts.
 *
 * Cached 24h; tagged for revalidation on village/beach edits via the
 * underlying unstable_cache wrappers in src/lib/data.ts.
 */

import { generateLlmsTxt } from '@/lib/llms-txt';

export const revalidate = 86400;
export const dynamic = 'force-static';

export async function GET() {
  const body = await generateLlmsTxt('en');
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
