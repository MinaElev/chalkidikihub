import { NextRequest } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { syncFeed } from '@/lib/pms/ical-sync';

/**
 * Cron endpoint — pulls every active iCal feed in the system.
 *
 * Called hourly by Vercel Cron (see vercel.json). Vercel signs cron
 * invocations with the CRON_SECRET env var in the `Authorization` header;
 * we reject anything else so the endpoint isn't a public DoS target.
 *
 * Uses the service-role key directly — cron runs server-side, no user
 * session, and we need to touch rows across every owner.
 */
export async function GET(req: NextRequest) {
  // Vercel Cron auth: https://vercel.com/docs/cron-jobs#securing-cron-jobs
  const authHeader = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return Response.json({ error: 'service client not configured' }, { status: 500 });
  }

  const supabase = createServiceClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: feeds, error } = await supabase
    .from('pms_ical_feeds')
    .select('id, listing_id, owner_id, source, import_url')
    .eq('active', true)
    .limit(500);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const startedAt = Date.now();
  const results = [];
  for (const feed of feeds || []) {
    const r = await syncFeed(supabase, feed);
    results.push(r);
  }

  return Response.json({
    ok: true,
    feeds_processed: results.length,
    duration_ms: Date.now() - startedAt,
    results,
  });
}
