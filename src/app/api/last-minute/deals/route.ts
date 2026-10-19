// Guard: public read-only — active last-minute deals of published listings (RLS allows anon reads).
import { NextRequest, NextResponse } from 'next/server';
import { publicDb } from '@/lib/supabase/clients';
import { locales, type Locale } from '@/i18n/config';
import { publicSlug } from '@/content/rewrites/slug-renames';

type Raw = {
  id: string;
  start_date: string;
  end_date: string;
  note: string | null;
  listings: (Record<string, unknown> & { slug: string; area: string; listing_images: { image_url: string; is_cover: boolean; sort_order: number }[] | null }) | null;
};

/**
 * Feeds the homepage deals popup. v3 queried Supabase from the browser, which
 * shipped the 53 KB Supabase client to every homepage visitor; this answers
 * from the CDN cache instead.
 */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('locale') as Locale | null;
  const locale: Locale = raw && (locales as readonly string[]).includes(raw) ? raw : 'en';
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await publicDb()
    .from('last_minute_deals')
    .select(`id, start_date, end_date, note, listings!inner(slug, area, status, title_${locale}, title_en, title_el, listing_images(image_url, is_cover, sort_order))`)
    .eq('status', 'active')
    .eq('listings.status', 'published')
    .gte('end_date', today)
    .order('start_date', { ascending: true })
    .limit(12);
  if (error) return NextResponse.json([], { status: 200 });

  const deals = ((data ?? []) as unknown as Raw[])
    .filter((d) => d.listings)
    .map((d) => {
      const l = d.listings!;
      const imgs = l.listing_images ?? [];
      const cover = imgs.find((i) => i.is_cover) ?? [...imgs].sort((a, b) => a.sort_order - b.sort_order)[0];
      return {
        id: d.id,
        slug: publicSlug('listings', l.slug),
        title: (l[`title_${locale}`] as string) || (l.title_en as string) || (l.title_el as string) || l.slug,
        area: l.area,
        note: d.note,
        start_date: d.start_date,
        end_date: d.end_date,
        image: cover?.image_url ?? null,
      };
    });
  return NextResponse.json(deals, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } });
}
