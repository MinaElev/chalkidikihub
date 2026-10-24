import { NextRequest, NextResponse } from 'next/server';
import { createMailTransport, mailFrom } from '@/lib/email/mailer';
import { createAdminClient } from '@/lib/api-helpers';
import { requireInternalOrSuperAdmin } from '@/lib/route-guards';

const ADMIN_EMAIL = 'mnc@hotmail.gr';

/**
 * Internal alert to the admin when money flows back (refund or dispute), so a
 * chargeback/refund never passes silently. Called by the webhook and the admin
 * refund endpoint; mirrors the unauthenticated internal-notify pattern.
 */
export async function POST(request: NextRequest) {
  const __auth = await requireInternalOrSuperAdmin(request); if (__auth instanceof NextResponse) return __auth;
  try {
    const { listing_id, kind, amount_cents } = await request.json();
    if (!listing_id) return NextResponse.json({ error: 'Missing listing_id' }, { status: 400 });

    const supabase = createAdminClient();
    const { data: listing } = await supabase
      .from('listings').select('title_el, slug').eq('id', listing_id).maybeSingle();

    const { data: settings } = await supabase
      .from('site_settings').select('key, value').in('key', ['gmail_address', 'gmail_app_password']);
    const map: Record<string, string> = {};
    settings?.forEach((s) => { map[s.key] = s.value; });
    if (!map.gmail_address || !map.gmail_app_password) {
      return NextResponse.json({ success: true, skipped: 'email_not_configured' });
    }
    const transporter = await createMailTransport(map.gmail_address, map.gmail_app_password.replace(/\s/g, ''));

    const label = kind === 'dispute' ? 'Αμφισβήτηση (chargeback)' : 'Επιστροφή χρημάτων';
    const amount = amount_cents != null ? `${(amount_cents / 100).toFixed(2)}€` : '—';
    const title = String(listing?.title_el || listing_id).replace(/[<>&]/g, '');

    await transporter.sendMail({
      from: await mailFrom(map.gmail_address),
      to: ADMIN_EMAIL,
      subject: `⚠️ ${label} — ${title}`,
      html: `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;color:#111827;line-height:1.6;">
        <p><strong>${label}</strong> για την καταχώρηση <strong>«${title}»</strong>.</p>
        <p>Ποσό: <strong>${amount}</strong></p>
        <p>Η καταχώρηση απενεργοποιήθηκε αυτόματα (archived, plan expired).</p>
        <p><a href="https://chalkidikihub.gr/el/admin/billing">Άνοιγμα Admin · Χρεώσεις</a></p>
      </div>`,
    }).catch((e) => { console.error('refund alert failed', e); });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
