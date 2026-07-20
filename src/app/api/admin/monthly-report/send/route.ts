import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';
import {
  resolveMonthWindow, buildOwnerReports, getSiteMonthlyStats, monthLabelGreek,
  renderOwnerEmailHtml, renderOwnerEmailText, type OwnerReport,
} from '@/lib/monthly-report';

export const maxDuration = 300;

const SEND_DELAY_MS = 200; // gentle on the Gmail quota
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const QR_CID = 'site-qr';

// POST /api/admin/monthly-report/send
// body: { month?: 'YYYY-MM', ownerIds?: string[], testTo?: string, force?: boolean }
//
//   • testTo set   → sends ONE sample email (first owner's report) to that
//                    address only; nothing is recorded. For a dry run.
//   • otherwise    → sends to the selected owners (or all if ownerIds omitted),
//                    skipping any already sent this month unless force=true.
export async function POST(request: NextRequest) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json().catch(() => ({}));
    const testTo: string | undefined = body?.testTo?.trim() || undefined;
    const ownerIds: string[] | undefined = Array.isArray(body?.ownerIds) ? body.ownerIds : undefined;
    const force = Boolean(body?.force);
    const boost = Math.max(0, Math.floor(Number(body?.boost) || 0));

    const win = resolveMonthWindow(body?.month);
    const supabase = createAdminClient();

    // Gmail creds (same source every email in the app uses).
    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['gmail_address', 'gmail_app_password']);
    const map: Record<string, string> = {};
    settings?.forEach((s: { key: string; value: string }) => { map[s.key] = s.value; });
    const gmailAddress = map.gmail_address || process.env.GMAIL_ADDRESS || '';
    const gmailPassword = map.gmail_app_password || process.env.GMAIL_APP_PASSWORD || '';
    if (!gmailAddress || !gmailPassword) {
      return NextResponse.json({ error: 'Gmail credentials not configured (Admin → Settings).' }, { status: 500 });
    }

    const [allReports, site] = await Promise.all([
      buildOwnerReports(supabase, win, boost),
      getSiteMonthlyStats(supabase, win),
    ]);
    if (allReports.length === 0) {
      return NextResponse.json({ error: `Δεν υπάρχουν δεδομένα για ${monthLabelGreek(win.monthKey)}. Τρέξτε πρώτα το snapshot.` }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailAddress, pass: gmailPassword.replace(/\s/g, '') },
    });
    const subject = `📊 ChalkidikiHub — Η αναφορά σας για τον ${monthLabelGreek(win.monthKey)}`;

    // ChalkidikiHub QR as a CID attachment (reliable in Gmail, unlike SVG/data URIs).
    // Best-effort: if generation fails, the email still sends without the QR.
    let qrAttachment: { filename: string; content: Buffer; cid: string }[] = [];
    let renderOpts: { siteQrCid?: string } = {};
    try {
      const qrBuffer = await QRCode.toBuffer(SITE_URL, { type: 'png', width: 300, margin: 1 });
      qrAttachment = [{ filename: 'chalkidikihub-qr.png', content: qrBuffer, cid: QR_CID }];
      renderOpts = { siteQrCid: QR_CID };
    } catch { /* no QR — email still goes out */ }

    // ── Test mode: one sample to the admin, no recording ──
    if (testTo) {
      const sample = allReports[0];
      await transporter.sendMail({
        from: `ChalkidikiHub <${gmailAddress}>`,
        to: testTo,
        subject: `[TEST] ${subject}`,
        html: renderOwnerEmailHtml(sample, site, win.monthKey, renderOpts),
        text: renderOwnerEmailText(sample, site, win.monthKey),
        attachments: qrAttachment,
      });
      return NextResponse.json({ success: true, test: true, sentTo: testTo, sampleOwner: sample.name || sample.email });
    }

    // ── Real send ──
    let pool: OwnerReport[] = ownerIds
      ? allReports.filter(r => ownerIds.includes(r.ownerId))
      : allReports;
    if (!force) pool = pool.filter(r => !r.alreadySentAt);

    const skipped = allReports.length - pool.length;
    let sent = 0, failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < pool.length; i++) {
      const r = pool[i];
      try {
        await transporter.sendMail({
          from: `ChalkidikiHub <${gmailAddress}>`,
          to: r.email,
          subject,
          html: renderOwnerEmailHtml(r, site, win.monthKey, renderOpts),
          text: renderOwnerEmailText(r, site, win.monthKey),
          attachments: qrAttachment,
        });
        await supabase.from('report_sends').upsert({
          owner_id: r.ownerId,
          month: win.monthKey,
          email: r.email,
          listings: r.listings.length,
          sent_at: new Date().toISOString(),
          sent_by: auth.userId,
        }, { onConflict: 'owner_id,month' });
        sent++;
      } catch (err) {
        failed++;
        errors.push(`${r.email}: ${(err as Error).message}`);
      }
      if (i < pool.length - 1) await new Promise(res => setTimeout(res, SEND_DELAY_MS));
    }

    await supabase.from('activity_logs').insert({
      type: 'admin_action',
      severity: failed ? 'warning' : 'info',
      message: `Monthly report sent for ${win.monthKey}: ${sent} delivered${failed ? `, ${failed} failed` : ''}${skipped ? `, ${skipped} skipped` : ''}`,
      details: { month: win.monthKey, sent, failed, skipped, boost, errors: errors.slice(0, 5), by: auth.userId },
    });

    return NextResponse.json({ success: true, sent, failed, skipped, errors: errors.slice(0, 10) });
  } catch (err) {
    const msg = (err as Error).message;
    return NextResponse.json({ error: msg }, { status: msg === 'month must be YYYY-MM' ? 400 : 500 });
  }
}
