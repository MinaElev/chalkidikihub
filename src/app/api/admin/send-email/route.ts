import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';

// Other bulk-mail routes in this codebase already raise this; this one never
// did, which is why a large list died mid-flight with no trace.
export const maxDuration = 300;

interface Recipient { email: string; name?: string }
interface SendResult { email: string; ok: boolean; error?: string }

export async function POST(request: NextRequest) {
  try {
    const auth = await requireSuperAdmin();
    if (auth instanceof NextResponse) return auth;

    const { recipients, subject, body, batchIndex, batchTotal } = await request.json() as {
      recipients: Recipient[]; subject: string; body: string;
      batchIndex?: number; batchTotal?: number;
    };

    if (!recipients?.length || !subject || !body) {
      return NextResponse.json({ error: 'Missing recipients, subject or body' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['gmail_address', 'gmail_app_password']);

    const settingsMap: Record<string, string> = {};
    settings?.forEach(s => { settingsMap[s.key] = s.value; });

    const gmailAddress = settingsMap.gmail_address || process.env.GMAIL_ADDRESS;
    const gmailPassword = settingsMap.gmail_app_password || process.env.GMAIL_APP_PASSWORD;

    if (!gmailAddress || !gmailPassword) {
      return NextResponse.json({ error: 'Gmail credentials not configured. Set Gmail Address and App Password in Admin → Settings.' }, { status: 500 });
    }

    // Pooled: one SMTP connection reused for the whole batch instead of a fresh
    // handshake per message, which is where most of the old runtime went.
    // rateLimit paces us so Gmail doesn't start refusing.
    const transporter = nodemailer.createTransport({
      pool: true,
      service: 'gmail',
      maxConnections: 1,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 4,
      auth: {
        user: gmailAddress,
        pass: gmailPassword.replace(/\s/g, ''),
      },
    });

    const results: SendResult[] = [];

    for (const recipient of recipients) {
      try {
        await transporter.sendMail({
          from: `ChalkidikiHub <${gmailAddress}>`,
          to: recipient.email,
          subject,
          html: `<div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333;">${body}</div>`,
        });
        results.push({ email: recipient.email, ok: true });
      } catch (err) {
        results.push({ email: recipient.email, ok: false, error: (err as Error).message });
      }
    }

    transporter.close();

    const sent = results.filter(r => r.ok).length;
    const failedList = results.filter(r => !r.ok);

    // One log row per batch, written before responding. If a later batch dies,
    // everything already delivered stays on record — the old version logged
    // once at the very end, so a timeout erased the whole history.
    const batchLabel = batchTotal && batchTotal > 1 ? ` (${(batchIndex ?? 0) + 1}/${batchTotal})` : '';
    await supabase.from('activity_logs').insert({
      type: 'admin_action',
      severity: failedList.length ? 'warning' : 'info',
      message: `Mass email sent${batchLabel}: ${sent} delivered, ${failedList.length} failed`,
      details: {
        subject,
        recipientCount: recipients.length,
        sent,
        failed: failedList.length,
        // Full list, not a sample — this is what a retry is built from.
        failedEmails: failedList.map(r => r.email),
        errors: failedList.map(r => `${r.email}: ${r.error}`),
        emails: recipients.map(r => r.email),
        batchIndex: batchIndex ?? null,
        batchTotal: batchTotal ?? null,
      },
    });

    return NextResponse.json({
      sent,
      failed: failedList.length,
      results,
      errors: failedList.map(r => `${r.email}: ${r.error}`),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
