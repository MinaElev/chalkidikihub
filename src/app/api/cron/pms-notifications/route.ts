import { NextRequest } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { loadGmailCreds } from '@/lib/pms/dispatch';
import { sendOwnerAlert, type NotificationKind } from '@/lib/pms/notifications';

/**
 * Hourly cron — emails the owner when:
 *   • a new inquiry arrives (recent, still inquiry)
 *   • a new booking lands in confirmed/pending
 *   • a task slipped past its scheduled_at (re-alert once per day)
 *   • a check-in is today
 *   • a check-out is today
 *
 * Toggles live on pms_owner_settings (notify_*). Destination is
 * `reply_to_email` or the owner's account email if blank. Idempotency is
 * handled by sendOwnerAlert via pms_notifications.
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

  const creds = await loadGmailCreds(supabase);
  if (!creds) {
    return Response.json(
      { ok: false, error: 'gmail_creds_missing' },
      { status: 200 },
    );
  }

  const { data: ownerSettings, error: osErr } = await supabase
    .from('pms_owner_settings')
    .select('owner_id, reply_to_email, notify_new_inquiry, notify_new_booking, notify_overdue_tasks, notify_check_in_today, notify_check_out_today')
    .or('notify_new_inquiry.eq.true,notify_new_booking.eq.true,notify_overdue_tasks.eq.true,notify_check_in_today.eq.true,notify_check_out_today.eq.true');
  if (osErr) return Response.json({ error: osErr.message }, { status: 500 });

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const recentCutoff = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(); // last 2h

  const startedAt = Date.now();
  const counts = { sent: 0, skipped: 0, failed: 0 };
  const errors: Array<{ owner: string; kind: string; ref: string; error: string }> = [];

  const listingCache = new Map<string, { title_el: string | null; title_en: string | null } | null>();
  async function getListing(id: string) {
    if (listingCache.has(id)) return listingCache.get(id)!;
    const { data } = await supabase
      .from('listings')
      .select('title_el, title_en')
      .eq('id', id)
      .maybeSingle();
    listingCache.set(id, (data as { title_el: string | null; title_en: string | null } | null) || null);
    return listingCache.get(id)!;
  }

  for (const os of ownerSettings || []) {
    // Resolve destination email — reply_to_email first, then auth.users.email.
    let emailTo = os.reply_to_email || '';
    if (!emailTo) {
      const { data: authUser } = await supabase.auth.admin.getUserById(os.owner_id);
      emailTo = authUser?.user?.email || '';
    }
    if (!emailTo) { counts.skipped++; continue; }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

    // ── new_inquiry ───────────────────────────────────────────────────
    if (os.notify_new_inquiry) {
      const { data: inquiries } = await supabase
        .from('pms_bookings')
        .select('id, listing_id, guest_name, guest_email, check_in, check_out, created_at')
        .eq('owner_id', os.owner_id)
        .eq('status', 'inquiry')
        .gte('created_at', recentCutoff)
        .limit(50);
      for (const b of inquiries || []) {
        const l = await getListing(b.listing_id);
        const name = l?.title_el || l?.title_en || '';
        const r = await sendAlert(supabase, {
          ownerId: os.owner_id, kind: 'new_inquiry', refId: b.id,
          emailTo, creds, footer: name,
          subjectEl: `Νέο αίτημα κράτησης — ${name}`,
          subjectEn: `New inquiry — ${name}`,
          bodyEl: `Νέο ενδιαφέρον για το "${name}".\n\nΌνομα: ${b.guest_name || '—'}\nEmail: ${b.guest_email || '—'}\nCheck-in: ${b.check_in}\nCheck-out: ${b.check_out}\n\nΔες το στο PMS: ${baseUrl}/dashboard/pms/bookings`,
          bodyEn: `New interest for "${name}".\n\nName: ${b.guest_name || '—'}\nEmail: ${b.guest_email || '—'}\nCheck-in: ${b.check_in}\nCheck-out: ${b.check_out}\n\nOpen in PMS: ${baseUrl}/dashboard/pms/bookings`,
        }, counts, errors);
        void r;
      }
    }

    // ── new_booking ───────────────────────────────────────────────────
    if (os.notify_new_booking) {
      const { data: bookings } = await supabase
        .from('pms_bookings')
        .select('id, listing_id, guest_name, guest_email, check_in, check_out, total_amount, currency, status')
        .eq('owner_id', os.owner_id)
        .in('status', ['confirmed', 'pending'])
        .gte('created_at', recentCutoff)
        .limit(50);
      for (const b of bookings || []) {
        const l = await getListing(b.listing_id);
        const name = l?.title_el || l?.title_en || '';
        const total = b.total_amount != null ? `${Number(b.total_amount).toFixed(2)} ${b.currency || 'EUR'}` : '—';
        await sendAlert(supabase, {
          ownerId: os.owner_id, kind: 'new_booking', refId: b.id,
          emailTo, creds, footer: name,
          subjectEl: `Νέα κράτηση — ${name}`,
          subjectEn: `New booking — ${name}`,
          bodyEl: `Κλείστηκε κράτηση για "${name}".\n\nΌνομα: ${b.guest_name || '—'}\nEmail: ${b.guest_email || '—'}\nCheck-in: ${b.check_in}\nCheck-out: ${b.check_out}\nΣύνολο: ${total}\nStatus: ${b.status}\n\nΔες το στο PMS: ${baseUrl}/dashboard/pms/bookings/${b.id}`,
          bodyEn: `New booking for "${name}".\n\nName: ${b.guest_name || '—'}\nEmail: ${b.guest_email || '—'}\nCheck-in: ${b.check_in}\nCheck-out: ${b.check_out}\nTotal: ${total}\nStatus: ${b.status}\n\nOpen in PMS: ${baseUrl}/dashboard/pms/bookings/${b.id}`,
        }, counts, errors);
      }
    }

    // ── overdue_task (re-notify once per day, ref_date=today) ─────────
    if (os.notify_overdue_tasks) {
      const { data: tasks } = await supabase
        .from('pms_tasks')
        .select('id, listing_id, title, task_type, scheduled_at, assignee_name')
        .eq('owner_id', os.owner_id)
        .eq('status', 'pending')
        .lt('scheduled_at', now.toISOString())
        .limit(50);
      for (const t of tasks || []) {
        const l = await getListing(t.listing_id);
        const name = l?.title_el || l?.title_en || '';
        const when = new Date(t.scheduled_at).toLocaleString('el-GR');
        await sendAlert(supabase, {
          ownerId: os.owner_id, kind: 'overdue_task', refId: t.id, refDate: today,
          emailTo, creds, footer: name,
          subjectEl: `Εκπρόθεσμη εργασία — ${t.title}`,
          subjectEn: `Overdue task — ${t.title}`,
          bodyEl: `Εργασία που πέρασε το scheduled time.\n\nΚατάλυμα: ${name}\nΤίτλος: ${t.title}\nΤύπος: ${t.task_type}\nΠρογραμματισμένη: ${when}\nΣυνεργάτης: ${t.assignee_name || '—'}\n\nΔες την στο PMS: ${baseUrl}/dashboard/pms/tasks/${t.id}`,
          bodyEn: `A task has passed its scheduled time.\n\nListing: ${name}\nTitle: ${t.title}\nType: ${t.task_type}\nScheduled: ${when}\nAssignee: ${t.assignee_name || '—'}\n\nOpen in PMS: ${baseUrl}/dashboard/pms/tasks/${t.id}`,
        }, counts, errors);
      }
    }

    // ── check_in_today (ref_date = today) ─────────────────────────────
    if (os.notify_check_in_today) {
      const { data: ins } = await supabase
        .from('pms_bookings')
        .select('id, listing_id, guest_name, guest_phone, guest_email, check_in, check_out, num_guests')
        .eq('owner_id', os.owner_id)
        .in('status', ['confirmed', 'checked_in'])
        .eq('check_in', today)
        .limit(50);
      for (const b of ins || []) {
        const l = await getListing(b.listing_id);
        const name = l?.title_el || l?.title_en || '';
        await sendAlert(supabase, {
          ownerId: os.owner_id, kind: 'check_in_today', refId: b.id, refDate: today,
          emailTo, creds, footer: name,
          subjectEl: `Check-in σήμερα — ${name}`,
          subjectEn: `Check-in today — ${name}`,
          bodyEl: `Check-in σήμερα για "${name}".\n\nΌνομα: ${b.guest_name || '—'}\nΤηλέφωνο: ${b.guest_phone || '—'}\nEmail: ${b.guest_email || '—'}\nΆτομα: ${b.num_guests ?? '—'}\nChk-in: ${b.check_in}\nChk-out: ${b.check_out}\n\nΔες στο PMS: ${baseUrl}/dashboard/pms/bookings/${b.id}`,
          bodyEn: `Check-in today for "${name}".\n\nName: ${b.guest_name || '—'}\nPhone: ${b.guest_phone || '—'}\nEmail: ${b.guest_email || '—'}\nGuests: ${b.num_guests ?? '—'}\nChk-in: ${b.check_in}\nChk-out: ${b.check_out}\n\nOpen in PMS: ${baseUrl}/dashboard/pms/bookings/${b.id}`,
        }, counts, errors);
      }
    }

    // ── check_out_today (ref_date = today) ────────────────────────────
    if (os.notify_check_out_today) {
      const { data: outs } = await supabase
        .from('pms_bookings')
        .select('id, listing_id, guest_name, check_in, check_out')
        .eq('owner_id', os.owner_id)
        .in('status', ['confirmed', 'checked_in', 'checked_out'])
        .eq('check_out', today)
        .limit(50);
      for (const b of outs || []) {
        const l = await getListing(b.listing_id);
        const name = l?.title_el || l?.title_en || '';
        await sendAlert(supabase, {
          ownerId: os.owner_id, kind: 'check_out_today', refId: b.id, refDate: today,
          emailTo, creds, footer: name,
          subjectEl: `Check-out σήμερα — ${name}`,
          subjectEn: `Check-out today — ${name}`,
          bodyEl: `Check-out σήμερα για "${name}".\n\nΌνομα: ${b.guest_name || '—'}\nChk-in: ${b.check_in}\nChk-out: ${b.check_out}\n\nΜην ξεχάσεις τον καθαρισμό & τυχόν damage check.\nPMS: ${baseUrl}/dashboard/pms/bookings/${b.id}`,
          bodyEn: `Check-out today for "${name}".\n\nName: ${b.guest_name || '—'}\nChk-in: ${b.check_in}\nChk-out: ${b.check_out}\n\nDon't forget the cleaning & damage check.\nPMS: ${baseUrl}/dashboard/pms/bookings/${b.id}`,
        }, counts, errors);
      }
    }
  }

  return Response.json({
    ok: true,
    ...counts,
    owners_scanned: ownerSettings?.length || 0,
    errors: errors.slice(0, 20),
    duration_ms: Date.now() - startedAt,
  });
}

type AlertArgs = {
  ownerId: string;
  kind: NotificationKind;
  refId: string;
  refDate?: string;
  emailTo: string;
  creds: { user: string; pass: string };
  footer: string;
  subjectEl: string;
  subjectEn: string;
  bodyEl: string;
  bodyEn: string;
};

async function sendAlert(
  supabase: SupabaseClient,
  args: AlertArgs,
  counts: { sent: number; skipped: number; failed: number },
  errors: Array<{ owner: string; kind: string; ref: string; error: string }>,
) {
  const result = await sendOwnerAlert(supabase, args);
  if (result === 'sent') counts.sent++;
  else if (result === 'failed') {
    counts.failed++;
    errors.push({ owner: args.ownerId, kind: args.kind, ref: args.refId, error: 'send_failed' });
  } else counts.skipped++;
}
