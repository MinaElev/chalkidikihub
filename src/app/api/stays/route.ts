// Guard: public read-only content (the same cards /listings renders).
import { NextResponse, type NextRequest } from 'next/server';
import { isLocale } from '@/i18n/config';
import { buildStayItems } from '@/lib/content/stay-items';

/**
 * All open stays as cards, for /listings: the page ships only the first ten
 * per area and fetches the rest here once the visitor filters or asks for
 * a whole area. The data behind it is cached (getListings), and the response
 * is cached by the proxy for an hour, like the page itself.
 */
export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') ?? '';
  if (!isLocale(locale)) return NextResponse.json({ error: 'locale' }, { status: 400 });
  const items = await buildStayItems(locale);
  return NextResponse.json(items, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
