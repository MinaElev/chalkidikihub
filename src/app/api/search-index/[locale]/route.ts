// Guard: public read-only content (the same names and links every page already shows).
import { NextResponse } from 'next/server';
import { locales, type Locale } from '@/i18n/config';
import { searchEntries } from '@/lib/search/entries';

/**
 * GET /api/search-index/{locale} — every searchable page, compact, for the
 * as-you-type suggestions. Built once a day per locale and served as a static
 * file, so typing in the search box never hits the database: the browser
 * fetches this once (on first focus) and matches locally on each key press.
 *
 * Row: [kind, href, title, subtitle, image, keys joined by "|", boost]
 */
export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const rows = (await searchEntries(locale)).map((e) => [e.kind, e.href, e.title, e.sub, e.image ?? '', e.keys.join('|'), e.boost]);
  return NextResponse.json(rows, { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } });
}
