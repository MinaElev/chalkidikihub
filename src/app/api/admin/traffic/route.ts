// Guard: superadmin only.
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';

/**
 * GET ?from=YYYY-MM-DD&to=YYYY-MM-DD → the traffic report for that range and
 * for the same-length range just before it (for the "vs previous" figures),
 * plus listing titles so pages can show names instead of slugs.
 */
const DAY = 86400000;
/** Admin data: never let the nginx proxy cache keep a copy. */
const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };
const isDate = (s: string | null): s is string => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);

export async function GET(req: NextRequest) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  const from = req.nextUrl.searchParams.get('from');
  const to = req.nextUrl.searchParams.get('to');
  if (!isDate(from) || !isDate(to) || from > to) return NextResponse.json({ error: 'bad_range' }, { status: 400, ...NO_STORE });

  const span = Math.round((Date.parse(to) - Date.parse(from)) / DAY) + 1;
  const prevTo = new Date(Date.parse(from) - DAY).toISOString().slice(0, 10);
  const prevFrom = new Date(Date.parse(from) - span * DAY).toISOString().slice(0, 10);

  const db = createAdminClient();
  const [cur, prev, listings] = await Promise.all([
    db.rpc('analytics_report', { p_from: from, p_to: to }),
    db.rpc('analytics_report', { p_from: prevFrom, p_to: prevTo }),
    db.from('listings').select('slug, title_el, owner_id').not('slug', 'is', null),
  ]);
  if (cur.error) {
    // The table/functions are created by scripts/sql/analytics.sql.
    const missing = /analytics_report|analytics_daily|does not exist|schema cache/i.test(cur.error.message);
    return NextResponse.json({ setup: !missing, error: cur.error.message }, { status: missing ? 200 : 500, ...NO_STORE });
  }
  const titles: Record<string, string> = {};
  for (const l of listings.data || []) if (l.slug) titles[l.slug] = l.title_el || l.slug;

  return NextResponse.json({
    setup: true, from, to, prevFrom, prevTo,
    report: cur.data, previous: prev.error ? null : prev.data, titles,
  }, NO_STORE);
}
