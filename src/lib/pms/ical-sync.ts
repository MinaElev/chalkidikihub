import type { SupabaseClient } from '@supabase/supabase-js';
import { parseIcal } from './ical';

export interface SyncResult {
  feedId: string;
  ok: boolean;
  imported: number;
  updated: number;
  removed: number;
  error?: string;
}

/**
 * Pull events from a single iCal feed and upsert them into pms_bookings
 * as source-tagged blocks.
 *
 * Reconciliation rules:
 *   - Each event UID becomes external_id on pms_bookings
 *   - (source, external_id) is the unique key for synced rows
 *   - If an event disappears from the feed → mark matching booking cancelled
 *   - We never touch direct / manual bookings (source must match feed.source)
 */
export async function syncFeed(
  supabase: SupabaseClient,
  feed: { id: string; listing_id: string; owner_id: string; source: string; import_url: string }
): Promise<SyncResult> {
  const markError = async (error: string) => {
    await supabase
      .from('pms_ical_feeds')
      .update({ last_synced_at: new Date().toISOString(), last_sync_status: 'error', last_sync_error: error })
      .eq('id', feed.id);
    return { feedId: feed.id, ok: false, imported: 0, updated: 0, removed: 0, error };
  };

  // 1. Fetch the remote .ics (timeout 10s)
  let icalText: string;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(feed.import_url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'ChalkidikiHub-PMS/1.0 (+https://chalkidikihub.gr)' },
    });
    clearTimeout(t);
    if (!res.ok) return markError(`HTTP ${res.status} from ${feed.source}`);
    icalText = await res.text();
    if (icalText.length > 5 * 1024 * 1024) return markError('Feed exceeds 5 MB');
  } catch (err) {
    return markError(err instanceof Error ? err.message : 'fetch failed');
  }

  // 2. Parse
  const events = parseIcal(icalText);
  if (!icalText.includes('BEGIN:VCALENDAR')) return markError('Response is not a valid iCal feed');

  // 3. Pull existing synced bookings for this listing+source
  const { data: existing, error: listErr } = await supabase
    .from('pms_bookings')
    .select('id, external_id, status')
    .eq('listing_id', feed.listing_id)
    .eq('source', feed.source);
  if (listErr) return markError(`existing-rows: ${listErr.message}`);

  const existingMap = new Map<string, { id: string; status: string }>();
  for (const r of existing || []) {
    if (r.external_id) existingMap.set(r.external_id, { id: r.id, status: r.status });
  }

  const incomingUids = new Set<string>();
  let imported = 0;
  let updated = 0;

  // 4. Upsert every incoming event
  for (const ev of events) {
    if (!ev.uid || !ev.start || !ev.end) continue;
    if (ev.status === 'CANCELLED') continue;

    incomingUids.add(ev.uid);
    const existingRow = existingMap.get(ev.uid);

    const payload = {
      listing_id: feed.listing_id,
      owner_id: feed.owner_id,
      source: feed.source,
      external_id: ev.uid,
      status: 'confirmed' as const,
      check_in: ev.start,
      check_out: ev.end,
      guest_name: ev.summary?.slice(0, 120) || null,
      notes: ev.description?.slice(0, 2000) || null,
      payment_status: 'na' as const,
    };

    if (existingRow) {
      // Update
      const { error } = await supabase
        .from('pms_bookings')
        .update({
          check_in: payload.check_in,
          check_out: payload.check_out,
          guest_name: payload.guest_name,
          notes: payload.notes,
          status: 'confirmed',
        })
        .eq('id', existingRow.id);
      if (!error) updated++;
    } else {
      const { error } = await supabase.from('pms_bookings').insert(payload);
      if (!error) imported++;
    }
  }

  // 5. Cancel rows whose UID disappeared from the feed
  let removed = 0;
  for (const [uid, row] of existingMap) {
    if (!incomingUids.has(uid) && row.status !== 'cancelled') {
      const { error } = await supabase
        .from('pms_bookings')
        .update({ status: 'cancelled' })
        .eq('id', row.id);
      if (!error) removed++;
    }
  }

  // 6. Mark feed as successfully synced
  await supabase
    .from('pms_ical_feeds')
    .update({
      last_synced_at: new Date().toISOString(),
      last_sync_status: 'ok',
      last_sync_error: null,
      events_imported: events.length,
    })
    .eq('id', feed.id);

  return { feedId: feed.id, ok: true, imported, updated, removed };
}
