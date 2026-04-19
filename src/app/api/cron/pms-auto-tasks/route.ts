import { NextRequest } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

/**
 * Hourly cron — creates a cleaning task for every booking whose check-out
 * falls within the next 14 days, provided:
 *   1. The owner has `auto_cleaning_enabled = true` in pms_owner_settings.
 *   2. The booking is not cancelled/blocked.
 *   3. No existing pms_tasks row with task_type='cleaning' is already tied
 *      to this booking (idempotency).
 *
 * Scheduled time = check_out date + owner's `checkout_time` (HH:MM, default
 * 11:00). If `cleaning_lead_days > 0`, we back-date the scheduled_at so the
 * cleaner comes earlier (e.g. same morning instead of after the guest
 * leaves).
 *
 * Auth: Vercel Cron `Authorization: Bearer $CRON_SECRET` header.
 */
export async function GET(req: NextRequest) {
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

  // Only owners who opted in.
  const { data: ownerSettings, error: osErr } = await supabase
    .from('pms_owner_settings')
    .select('owner_id, checkout_time, cleaning_default_assignee_name, cleaning_default_assignee_phone, cleaning_default_assignee_email, cleaning_default_cost, cleaning_lead_days')
    .eq('auto_cleaning_enabled', true);
  if (osErr) return Response.json({ error: osErr.message }, { status: 500 });

  const today = new Date().toISOString().slice(0, 10);
  const horizon = new Date();
  horizon.setUTCDate(horizon.getUTCDate() + 14);
  const horizonDate = horizon.toISOString().slice(0, 10);

  const startedAt = Date.now();
  let created = 0;
  let skipped = 0;
  let failed = 0;
  const errors: Array<{ owner: string; booking?: string; error: string }> = [];

  for (const os of ownerSettings || []) {
    const { data: bookings, error: bErr } = await supabase
      .from('pms_bookings')
      .select('id, listing_id, owner_id, check_out, guest_name')
      .eq('owner_id', os.owner_id)
      .gte('check_out', today)
      .lte('check_out', horizonDate)
      .not('status', 'in', '(cancelled,blocked)');
    if (bErr) {
      failed++;
      errors.push({ owner: os.owner_id, error: bErr.message });
      continue;
    }
    if (!bookings || bookings.length === 0) continue;

    const bookingIds = bookings.map(b => b.id);
    const { data: existing } = await supabase
      .from('pms_tasks')
      .select('booking_id')
      .eq('task_type', 'cleaning')
      .in('booking_id', bookingIds);
    const alreadyHave = new Set((existing || []).map(e => e.booking_id));

    const checkoutTime = (os.checkout_time || '11:00').trim();
    const leadDays = Math.max(0, Number(os.cleaning_lead_days) || 0);

    const rows = bookings
      .filter(b => !alreadyHave.has(b.id))
      .map(b => {
        const checkoutDay = new Date(b.check_out + 'T00:00:00Z');
        checkoutDay.setUTCDate(checkoutDay.getUTCDate() - leadDays);
        const [hh, mm] = checkoutTime.split(':').map(x => Number(x) || 0);
        checkoutDay.setUTCHours(hh, mm, 0, 0);
        return {
          listing_id: b.listing_id,
          owner_id: b.owner_id,
          booking_id: b.id,
          task_type: 'cleaning' as const,
          title: `Cleaning — ${b.guest_name || 'booking'} checkout`,
          assignee_name: os.cleaning_default_assignee_name,
          assignee_phone: os.cleaning_default_assignee_phone,
          assignee_email: os.cleaning_default_assignee_email,
          cost: os.cleaning_default_cost,
          scheduled_at: checkoutDay.toISOString(),
          status: 'pending' as const,
        };
      });

    if (rows.length === 0) {
      skipped += bookings.length;
      continue;
    }

    const { error: insErr } = await supabase.from('pms_tasks').insert(rows);
    if (insErr) {
      failed++;
      errors.push({ owner: os.owner_id, error: insErr.message });
      continue;
    }
    created += rows.length;
    skipped += bookings.length - rows.length;
  }

  return Response.json({
    ok: true,
    created,
    skipped,
    failed,
    errors: errors.slice(0, 20),
    owners_scanned: ownerSettings?.length || 0,
    duration_ms: Date.now() - startedAt,
  });
}
