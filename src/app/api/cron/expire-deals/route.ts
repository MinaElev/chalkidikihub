import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminClient } from '@/lib/api-helpers';

export const maxDuration = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const ADMIN_EMAIL = 'mnc@hotmail.gr';
const SEND_DELAY_MS = 150; // gentle on the Gmail quota, like the broadcast dispatch

interface ExpiredDeal {
  deal_id: string;
  listing_id: string;
  owner_id: string;
  owner_email: string | null;
  owner_name: string | null;
  listing_title_el: string | null;
  listing_title_en: string | null;
  listing_slug: string | null;
  start_date: string;
  end_date: string;
  note: string | null;
}

function escapeHtml(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtRange(s: string, e: string): string {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  const sd = new Date(s + 'T00:00:00').toLocaleDateString('el-GR', opts);
  const ed = new Date(e + 'T00:00:00').toLocaleDateString('el-GR', opts);
  return s === e ? sd : `${sd} – ${ed}`;
}

function ownerEmailHtml(deal: ExpiredDeal): string {
  const title = escapeHtml(deal.listing_title_el || deal.listing_title_en || '(κατάλυμα)');
  const name = escapeHtml(deal.owner_name || '');
  const range = fmtRange(deal.start_date, deal.end_date);
  const note = deal.note ? escapeHtml(deal.note) : '';
  const newDealUrl = `${SITE_URL}/dashboard/last-minute`;

  return `<!DOCTYPE html>
<html lang="el"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">

        <tr><td style="background:linear-gradient(135deg,#475569,#64748b);padding:26px 28px;color:#fff;">
          <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;font-weight:600;">ChalkidikiHub · Τελευταία στιγμή</div>
          <div style="font-size:22px;font-weight:700;margin-top:4px;line-height:1.25;">Η διαθεσιμότητα έκλεισε αυτόματα</div>
        </td></tr>

        <tr><td style="padding:24px 28px 4px;">
          <p style="margin:0 0 10px;font-size:15px;color:#374151;">${name ? `Γεια σας, ${name}.` : 'Γεια σας,'}</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
            Η διαθεσιμότητα τελευταίας στιγμής που είχατε δημοσιεύσει έληξε, επειδή πέρασε η ημερομηνία «έως» που είχατε ορίσει. Την αποσύραμε αυτόματα — <strong>δεν εμφανίζεται πλέον</strong> στην αρχική σελίδα ούτε στη σελίδα διαθεσιμοτήτων.
          </p>
        </td></tr>

        <tr><td style="padding:18px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;">
            <tr><td style="padding:14px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                <tr><td style="padding:3px 0;color:#64748b;width:110px;">Κατάλυμα</td><td style="padding:3px 0;color:#111827;font-weight:600;">${title}</td></tr>
                <tr><td style="padding:3px 0;color:#64748b;">Ημερομηνίες</td><td style="padding:3px 0;color:#111827;">${range}</td></tr>
                ${note ? `<tr><td style="padding:3px 0;color:#64748b;">Σημείωση</td><td style="padding:3px 0;color:#111827;">${note}</td></tr>` : ''}
                <tr><td style="padding:3px 0;color:#64748b;">Κατάσταση</td><td style="padding:3px 0;"><span style="background:#e2e8f0;color:#475569;padding:2px 10px;border-radius:9999px;font-size:12px;font-weight:700;">Έκλεισε</span></td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:22px 28px 4px;">
          <p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">
            Άνοιξε ξανά διαθεσιμότητα από ακύρωση; Δημοσιεύστε νέα σε λίγα δευτερόλεπτα — εμφανίζεται στην αρχική και ποστάρεται αυτόματα στο Facebook.
          </p>
        </td></tr>

        <tr><td style="padding:16px 28px 4px;" align="center">
          <a href="${newDealUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:13px 26px;border-radius:10px;font-size:15px;font-weight:700;box-shadow:0 2px 4px rgba(22,163,74,0.25);">⚡ Δημοσίευσε νέα διαθεσιμότητα →</a>
        </td></tr>

        <tr><td style="padding:24px 28px 28px;border-top:1px solid #f3f4f6;margin-top:20px;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;text-align:center;">
            Αν έχετε απορίες, απαντήστε σε αυτό το email.<br>
            <strong style="color:#6b7280;">ChalkidikiHub</strong> · <a href="${newDealUrl}" style="color:#0284c7;text-decoration:none;">Dashboard</a> · <a href="https://chalkidikihub.gr" style="color:#0284c7;text-decoration:none;">chalkidikihub.gr</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

function ownerEmailText(deal: ExpiredDeal): string {
  const title = deal.listing_title_el || deal.listing_title_en || '(κατάλυμα)';
  return [
    'ChalkidikiHub — Η διαθεσιμότητα τελευταίας στιγμής έκλεισε αυτόματα',
    '',
    `Κατάλυμα: ${title}`,
    `Ημερομηνίες: ${fmtRange(deal.start_date, deal.end_date)}`,
    deal.note ? `Σημείωση: ${deal.note}` : '',
    '',
    'Πέρασε η ημερομηνία «έως» που είχατε ορίσει, οπότε την αποσύραμε αυτόματα — δεν εμφανίζεται πλέον στην αρχική ούτε στη σελίδα διαθεσιμοτήτων.',
    '',
    `Δημοσιεύστε νέα διαθεσιμότητα: ${SITE_URL}/dashboard/last-minute`,
    '',
    'ChalkidikiHub · chalkidikihub.gr',
  ].filter(Boolean).join('\n');
}

/**
 * Daily cron (Vercel) — closes last-minute deals whose end_date has passed and
 * emails their owners.
 *
 * The flip is done in a single atomic SQL function (expire_last_minute_deals,
 * migration 050) that returns *exactly* the just-expired rows, so a double run
 * can't double-email: the second run finds nothing (rows are already 'expired').
 * Public hiding is already enforced by RLS (end_date >= current_date), so this
 * job is only about the status flip + owner notification.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // Atomic flip + fetch of the rows that just closed.
    const { data, error } = await supabase.rpc('expire_last_minute_deals');
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const deals = (data || []) as ExpiredDeal[];
    if (deals.length === 0) {
      return NextResponse.json({ success: true, expired: 0, emailed: 0 });
    }

    // Gmail creds (same source every email in the app uses).
    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['gmail_address', 'gmail_app_password']);
    const map: Record<string, string> = {};
    settings?.forEach((s: { key: string; value: string }) => { map[s.key] = s.value; });
    const gmailAddress = map.gmail_address || process.env.GMAIL_ADDRESS || '';
    const gmailPassword = map.gmail_app_password || process.env.GMAIL_APP_PASSWORD || '';

    let emailed = 0;
    let failed = 0;

    if (gmailAddress && gmailPassword) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailAddress, pass: gmailPassword.replace(/\s/g, '') },
      });

      for (let i = 0; i < deals.length; i++) {
        const deal = deals[i];
        if (!deal.owner_email) continue; // orphaned/admin-imported deal — nothing to notify
        try {
          await transporter.sendMail({
            from: `ChalkidikiHub <${gmailAddress}>`,
            to: deal.owner_email,
            replyTo: ADMIN_EMAIL,
            subject: `Η διαθεσιμότητα τελευταίας στιγμής έκλεισε — ${deal.listing_title_el || deal.listing_title_en || ''}`.trim(),
            html: ownerEmailHtml(deal),
            text: ownerEmailText(deal),
          });
          emailed++;
        } catch {
          failed++;
        }
        if (i < deals.length - 1) await new Promise(r => setTimeout(r, SEND_DELAY_MS));
      }
    }

    await supabase.from('activity_logs').insert({
      type: 'user_action',
      severity: 'info',
      message: `Last-minute deals auto-expired: ${deals.length} closed, ${emailed} owner(s) emailed${failed ? `, ${failed} failed` : ''}`,
      details: {
        expired: deals.length,
        emailed,
        failed,
        deal_ids: deals.map(d => d.deal_id),
        no_creds: !(gmailAddress && gmailPassword),
      },
    });

    return NextResponse.json({ success: true, expired: deals.length, emailed, failed });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
