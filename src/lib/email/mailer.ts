import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';
import { adminDb } from '@/lib/supabase/clients';

/**
 * Outgoing mail. Uses the same Gmail account v3 used (credentials stored in
 * site_settings: gmail_address / gmail_app_password, editable in admin), so
 * nothing has to be reconfigured for the switch.
 */

let cached: { transporter: Transporter; from: string; at: number } | null = null;

async function transport() {
  if (cached && Date.now() - cached.at < 10 * 60_000) return cached;
  const { data } = await adminDb()
    .from('site_settings')
    .select('key, value')
    .in('key', ['gmail_address', 'gmail_app_password']);
  const s = Object.fromEntries((data ?? []).map((r) => [r.key, r.value as string]));
  if (!s.gmail_address || !s.gmail_app_password) return null;
  cached = {
    transporter: nodemailer.createTransport({
      service: 'gmail',
      auth: { user: s.gmail_address, pass: s.gmail_app_password.replace(/\s/g, '') },
    }),
    from: `ChalkidikiHub <${s.gmail_address}>`,
    at: Date.now(),
  };
  return cached;
}

export type Mail = { to: string; subject: string; html: string; text?: string; replyTo?: string };

export async function sendMail(mail: Mail): Promise<boolean> {
  const t = await transport();
  if (!t) {
    console.error('sendMail: Gmail credentials missing in site_settings');
    return false;
  }
  try {
    await t.transporter.sendMail({ from: t.from, ...mail });
    return true;
  } catch (err) {
    console.error('sendMail failed', (err as Error).message);
    return false;
  }
}

export const escapeHtml = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Minimal, mobile-safe email shell shared by every template. */
export function emailLayout(title: string, body: string, footer = 'ChalkidikiHub · chalkidikihub.gr') {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f3f4f6;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:14px;overflow:hidden">
<tr><td style="background:#0e7596;padding:20px 28px;color:#fff;font-size:20px;font-weight:700">${escapeHtml(title)}</td></tr>
<tr><td style="padding:24px 28px;font-size:15px;line-height:1.6">${body}</td></tr>
<tr><td style="padding:16px 28px;background:#f8fafc;font-size:12px;color:#64748b">${footer}</td></tr>
</table></td></tr></table></body></html>`;
}
