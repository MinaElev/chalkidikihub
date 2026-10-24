import { NextRequest, NextResponse } from 'next/server';
import { createMailTransport, mailFrom } from '@/lib/email/mailer';
import { createAdminClient } from '@/lib/api-helpers';
import { netFromGross } from '@/lib/billing';
import { requireInternalOrSuperAdmin } from '@/lib/route-guards';

const ADMIN_EMAIL = 'mnc@hotmail.gr';

function escapeHtml(str: string): string {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function eur(cents: number): string {
  return (cents / 100).toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '€';
}

/**
 * Payment receipt to the owner, fired after a successful (or free) activation.
 * Distinct from notify-new (which tells the ADMIN a paid listing is ready to
 * review): this is the owner's proof of payment — amount, VAT split, discount,
 * validity window — plus the "in review, we'll publish it" reassurance.
 *
 * Loads the payment row itself (by stripe_session_id) so the numbers are the
 * canonical ones we recorded, never client-supplied.
 */
export async function POST(request: NextRequest) {
  const __auth = await requireInternalOrSuperAdmin(request); if (__auth instanceof NextResponse) return __auth;
  try {
    const { listing_id, session_id } = await request.json();
    if (!listing_id) return NextResponse.json({ error: 'Missing listing_id' }, { status: 400 });

    const supabase = createAdminClient();

    const { data: listing } = await supabase
      .from('listings')
      .select('id, title_el, area, location_name, owner_id, plan_expires_at')
      .eq('id', listing_id)
      .single();
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    // The payment we're receipting — prefer the exact session, else the latest.
    let payQuery = supabase
      .from('billing_payments')
      .select('amount_cents, currency, discount_code, discount_cents, paid_at, plan')
      .eq('listing_id', listing_id)
      .order('paid_at', { ascending: false })
      .limit(1);
    if (session_id) payQuery = supabase
      .from('billing_payments')
      .select('amount_cents, currency, discount_code, discount_cents, paid_at, plan')
      .eq('stripe_session_id', session_id)
      .limit(1);
    const { data: payRows } = await payQuery;
    const pay = payRows?.[0];
    if (!pay) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

    let ownerEmail: string | null = null;
    let ownerName: string | null = null;
    if (listing.owner_id) {
      const { data: owner } = await supabase
        .from('profiles').select('email, full_name').eq('id', listing.owner_id).single();
      ownerEmail = owner?.email || null;
      ownerName = owner?.full_name || null;
    }
    if (!ownerEmail) return NextResponse.json({ success: true, skipped: 'no_owner_email' });

    const { data: settings } = await supabase
      .from('site_settings').select('key, value').in('key', ['gmail_address', 'gmail_app_password']);
    const map: Record<string, string> = {};
    settings?.forEach((s) => { map[s.key] = s.value; });
    if (!map.gmail_address || !map.gmail_app_password) {
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 });
    }
    const transporter = await createMailTransport(map.gmail_address, map.gmail_app_password.replace(/\s/g, ''));

    const amount = pay.amount_cents || 0;
    const isFree = amount <= 0;
    const netCents = Math.round(netFromGross(amount) * 100);
    const vatCents = amount - netCents;
    const title = escapeHtml(listing.title_el || '(χωρίς τίτλο)');
    const ownerNameEsc = escapeHtml(ownerName || '');
    const paidDate = pay.paid_at ? new Date(pay.paid_at).toLocaleDateString('el-GR', { day: '2-digit', month: 'long', year: 'numeric' }) : '';
    const expiry = listing.plan_expires_at ? new Date(listing.plan_expires_at).toLocaleDateString('el-GR', { day: '2-digit', month: 'long', year: 'numeric' }) : '';
    const dashUrl = 'https://chalkidikihub.gr/el/dashboard/billing';

    const rows = [
      `<tr><td style="padding:6px 0;color:#6b7280;width:180px;">Κατάλυμα</td><td style="padding:6px 0;color:#111827;font-weight:600;">${title}</td></tr>`,
      `<tr><td style="padding:6px 0;color:#6b7280;">Ημερομηνία</td><td style="padding:6px 0;color:#111827;">${paidDate}</td></tr>`,
      pay.discount_code
        ? `<tr><td style="padding:6px 0;color:#6b7280;">Κωδικός έκπτωσης</td><td style="padding:6px 0;color:#111827;">${escapeHtml(pay.discount_code)} (−${eur(pay.discount_cents || 0)})</td></tr>`
        : '',
      isFree
        ? `<tr><td style="padding:6px 0;color:#6b7280;">Ποσό</td><td style="padding:6px 0;"><span style="background:#dcfce7;color:#166534;padding:2px 10px;border-radius:9999px;font-size:12px;font-weight:700;">Δωρεάν ενεργοποίηση</span></td></tr>`
        : `<tr><td style="padding:6px 0;color:#6b7280;">Καθαρή αξία</td><td style="padding:6px 0;color:#111827;">${eur(netCents)}</td></tr>
           <tr><td style="padding:6px 0;color:#6b7280;">ΦΠΑ 24%</td><td style="padding:6px 0;color:#111827;">${eur(vatCents)}</td></tr>
           <tr><td style="padding:8px 0 6px;color:#111827;font-weight:700;border-top:1px solid #e5e7eb;">Σύνολο</td><td style="padding:8px 0 6px;color:#111827;font-weight:700;border-top:1px solid #e5e7eb;">${eur(amount)}</td></tr>`,
      expiry ? `<tr><td style="padding:6px 0;color:#6b7280;">Ισχύς έως</td><td style="padding:6px 0;color:#111827;font-weight:600;">${expiry}</td></tr>` : '',
    ].join('');

    await transporter.sendMail({
      from: await mailFrom(map.gmail_address),
      to: ownerEmail,
      replyTo: ADMIN_EMAIL,
      subject: isFree
        ? `✅ Ενεργοποίηση καταχώρησης — ${listing.title_el}`
        : `🧾 Απόδειξη πληρωμής ${eur(amount)} — ${listing.title_el}`,
      html: `
<!DOCTYPE html>
<html lang="el"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
        <tr><td style="background:linear-gradient(135deg,#15803d,#16a34a);padding:24px 28px;color:#fff;">
          <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;font-weight:600;">ChalkidikiHub</div>
          <div style="font-size:23px;font-weight:700;margin-top:4px;">${isFree ? '✅ Η καταχώρηση ενεργοποιήθηκε' : '🧾 Απόδειξη πληρωμής'}</div>
        </td></tr>

        <tr><td style="padding:24px 28px 4px;">
          <p style="margin:0 0 10px;font-size:15px;color:#374151;">${ownerNameEsc ? `Γεια σας, ${ownerNameEsc}.` : 'Γεια σας,'}</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
            ${isFree
              ? `Η ετήσια καταχώρηση για το <strong>«${title}»</strong> ενεργοποιήθηκε.`
              : `Λάβαμε την πληρωμή σας για την ετήσια καταχώρηση του <strong>«${title}»</strong>. Ευχαριστούμε!`}
          </p>
        </td></tr>

        <tr><td style="padding:18px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;font-size:14px;">
            <tr><td style="padding:14px 18px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">${rows}</table>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:18px 28px 0;">
          <div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:8px;padding:14px 16px;font-size:14px;line-height:1.6;color:#1e3a8a;">
            ⏳ <strong>Επόμενο βήμα:</strong> Η ομάδα του ChalkidikiHub ελέγχει την καταχώρηση και τη <strong>δημοσιεύει</strong> — συνήθως εντός λίγων ωρών. Θα λάβετε νέο email μόλις γίνει live.
          </div>
        </td></tr>

        ${isFree ? '' : `<tr><td style="padding:14px 28px 0;">
          <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">
            Χρειάζεστε <strong>τιμολόγιο</strong>; Απαντήστε σε αυτό το email με τα στοιχεία τιμολόγησης (επωνυμία, ΑΦΜ, ΔΟΥ, διεύθυνση) και θα σας το εκδώσουμε.
          </p>
        </td></tr>`}

        <tr><td style="padding:22px 28px 8px;" align="center">
          <a href="${dashUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">Προβολή Χρέωσης</a>
        </td></tr>

        <tr><td style="padding:20px 28px 26px;border-top:1px solid #f3f4f6;">
          <p style="margin:0;font-size:12px;line-height:1.5;color:#9ca3af;text-align:center;">
            <strong style="color:#6b7280;">ChalkidikiHub</strong> · <a href="https://chalkidikihub.gr" style="color:#0284c7;text-decoration:none;">chalkidikihub.gr</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
    }).catch((e) => { console.error('receipt email failed', e); });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
