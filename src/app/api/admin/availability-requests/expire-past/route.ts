import { NextResponse } from 'next/server';
import { createMailTransport, mailFrom } from '@/lib/email/mailer';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';
import {
  loadGmailCreds,
  buildExpiryEmail,
  SEND_DELAY_MS,
  type AvailabilityRequestRow,
} from '@/lib/availability/dispatch';

// Expiring N requests + sending N polite nudge emails runs sequentially with a
// small delay (Gmail-safe), so give it room. Admin-triggered, infrequent.
export const maxDuration = 60;

// POST — find every ACTIVE request whose check-in date is already in the past,
// mark it `expired`, and send the guest a friendly "hope you found a place /
// try last-minute deals" email. Idempotent: once a row is expired it is no
// longer `active`, so a second run won't touch or re-email it.
export async function POST() {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const supabase = createAdminClient();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString().slice(0, 10);

    const { data: rows, error } = await supabase
      .from('availability_requests')
      .select(
        'id, public_token, guest_name, guest_email, guest_phone, area, check_in, check_out, adults, children, budget_min, budget_max, property_type, notes, locale',
      )
      .eq('status', 'active')
      .lt('check_in', todayIso);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const list = (rows || []) as AvailabilityRequestRow[];
    if (list.length === 0) {
      return NextResponse.json({ expired: 0, emailed: 0, failed: 0, ids: [] });
    }

    const ids = list.map(r => r.id);

    // Expire first — this is the authoritative action and must not depend on
    // whether the (best-effort) emails go out.
    const { error: updErr } = await supabase
      .from('availability_requests')
      .update({ status: 'expired' })
      .in('id', ids);

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    // Best-effort nudge emails.
    let emailed = 0;
    let failed = 0;
    const creds = await loadGmailCreds(supabase);
    if (creds) {
      const transporter = await createMailTransport(creds.user, creds.pass.replace(/\s/g, ''));
      for (let i = 0; i < list.length; i++) {
        const req = list[i];
        if (!req.guest_email) continue;
        const { subject, html, text } = buildExpiryEmail(req);
        try {
          await transporter.sendMail({
            from: await mailFrom(creds.user),
            to: req.guest_email,
            subject,
            html,
            text,
          });
          emailed++;
        } catch {
          failed++;
        }
        if (i < list.length - 1) {
          await new Promise(r => setTimeout(r, SEND_DELAY_MS));
        }
      }
    }

    await supabase
      .from('activity_logs')
      .insert({
        type: 'admin_action',
        severity: 'info',
        message: `Expired ${ids.length} past-check-in availability requests (${emailed} nudge emails sent, ${failed} failed)`,
        details: { expired: ids.length, emailed, failed },
      })
      .then(
        () => {},
        () => {},
      );

    return NextResponse.json({ expired: ids.length, emailed, failed, ids });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
