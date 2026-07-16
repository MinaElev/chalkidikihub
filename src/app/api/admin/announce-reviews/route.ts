import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';
import {
  ANNOUNCEMENT_SUBJECT, buildAnnouncementOwners,
  renderAnnouncementHtml, renderAnnouncementText,
} from '@/lib/reviews-announcement';

export const maxDuration = 300;

const SEND_DELAY_MS = 200; // gentle on the Gmail quota (same as monthly report)

// GET /api/admin/announce-reviews — recipient preview for the admin page.
export async function GET() {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;
  try {
    const owners = await buildAnnouncementOwners(createAdminClient());
    return NextResponse.json({
      subject: ANNOUNCEMENT_SUBJECT,
      owners: owners.map(o => ({
        ownerId: o.ownerId, email: o.email, name: o.name,
        listings: o.listings.map(l => l.title),
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/admin/announce-reviews
// body: { testTo?: string, ownerIds?: string[] }
//   • testTo set → ONE sample email (first owner, or the admin's own data if
//                  they own listings) to that address; nothing recorded.
//   • otherwise  → sends to the selected owners (or all if ownerIds omitted).
export async function POST(request: NextRequest) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json().catch(() => ({}));
    const testTo: string | undefined = body?.testTo?.trim() || undefined;
    const ownerIds: string[] | undefined = Array.isArray(body?.ownerIds) ? body.ownerIds : undefined;

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

    const allOwners = await buildAnnouncementOwners(supabase);
    if (allOwners.length === 0) {
      return NextResponse.json({ error: 'Δεν βρέθηκαν ιδιοκτήτες με δημοσιευμένο κατάλυμα και email.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailAddress, pass: gmailPassword.replace(/\s/g, '') },
    });

    // ── Test mode: one sample, nothing recorded ──
    if (testTo) {
      const sample = allOwners[0];
      await transporter.sendMail({
        from: `ChalkidikiHub <${gmailAddress}>`,
        to: testTo,
        subject: `[TEST] ${ANNOUNCEMENT_SUBJECT}`,
        html: renderAnnouncementHtml(sample),
        text: renderAnnouncementText(sample),
      });
      return NextResponse.json({ success: true, test: true, sentTo: testTo, sampleOwner: sample.name || sample.email });
    }

    // ── Real send ──
    const pool = ownerIds ? allOwners.filter(o => ownerIds.includes(o.ownerId)) : allOwners;
    let sent = 0, failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < pool.length; i++) {
      const o = pool[i];
      try {
        await transporter.sendMail({
          from: `ChalkidikiHub <${gmailAddress}>`,
          to: o.email,
          subject: ANNOUNCEMENT_SUBJECT,
          html: renderAnnouncementHtml(o),
          text: renderAnnouncementText(o),
        });
        sent++;
      } catch (err) {
        failed++;
        errors.push(`${o.email}: ${(err as Error).message}`);
      }
      if (i < pool.length - 1) await new Promise(res => setTimeout(res, SEND_DELAY_MS));
    }

    // "Mass email sent:" prefix so the send shows up in the /admin/email history.
    await supabase.from('activity_logs').insert({
      type: 'admin_action',
      severity: failed ? 'warning' : 'info',
      message: `Mass email sent: ${sent} delivered, ${failed} failed`,
      details: {
        subject: ANNOUNCEMENT_SUBJECT,
        campaign: 'reviews-announcement',
        recipientCount: pool.length,
        sent, failed,
        errors: errors.slice(0, 5),
        emails: pool.map(o => o.email),
      },
    });

    return NextResponse.json({ success: true, sent, failed, errors: errors.slice(0, 10) });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
