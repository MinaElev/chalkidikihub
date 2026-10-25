import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';
import { adminDb } from '@/lib/supabase/clients';

/**
 * Outgoing mail — the one place that decides how email leaves the site.
 *
 * Default: the Gmail account v3 used (site_settings: gmail_address /
 * gmail_app_password, editable in admin).
 *
 * Optional: a regular SMTP server, e.g. the hosting provider's mail server for
 * info@chalkidikihub.gr. Many shared hosts block outgoing connections to
 * Gmail, while their own mail server is always reachable. Configure it either
 * in site_settings (smtp_host, smtp_port, smtp_user, smtp_password, smtp_from)
 * or in the environment (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD,
 * SMTP_FROM); when present it takes precedence over Gmail.
 */

const SENDER_NAME = 'ChalkidikiHub';
const TTL = 10 * 60_000;

type Smtp = { host: string; port: number; user: string; pass: string; from: string };
type Settings = { smtp: Smtp | null; gmailUser: string; gmailPass: string };

let settingsCache: { value: Settings; at: number } | null = null;

async function settings(): Promise<Settings> {
  if (settingsCache && Date.now() - settingsCache.at < TTL) return settingsCache.value;
  const { data } = await adminDb()
    .from('site_settings')
    .select('key, value')
    .in('key', ['gmail_address', 'gmail_app_password', 'smtp_host', 'smtp_port', 'smtp_user', 'smtp_password', 'smtp_from']);
  const s = Object.fromEntries((data ?? []).map((r) => [r.key, String(r.value ?? '').trim()]));
  const host = process.env.SMTP_HOST || s.smtp_host;
  const user = process.env.SMTP_USER || s.smtp_user;
  const pass = process.env.SMTP_PASSWORD || s.smtp_password;
  const smtp = host && user && pass
    ? { host, user, pass, port: Number(process.env.SMTP_PORT || s.smtp_port) || 587, from: process.env.SMTP_FROM || s.smtp_from || user }
    : null;
  const value = {
    smtp,
    gmailUser: s.gmail_address || process.env.GMAIL_ADDRESS || '',
    gmailPass: (s.gmail_app_password || process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, ''),
  };
  settingsCache = { value, at: Date.now() };
  return value;
}

/**
 * Without limits nodemailer waits up to 2 minutes to connect and 10 minutes on
 * a silent socket. On a host whose firewall drops outgoing SMTP that turned a
 * signup into a spinner that never ended, so every transport fails fast.
 */
const TIMEOUTS = { connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 30_000 };

/** Extra nodemailer options some senders use (connection pooling, rate limits). */
type Extra = { pool?: boolean; maxConnections?: number; maxMessages?: number; rateDelta?: number; rateLimit?: number };

/**
 * A transporter for the configured provider. `gmailUser`/`gmailPass` are the
 * Gmail credentials the caller already looked up; they are used only when no
 * SMTP server is configured.
 */
export async function createMailTransport(gmailUser?: string, gmailPass?: string, extra: Extra = {}): Promise<Transporter> {
  const s = await settings();
  if (s.smtp) {
    return nodemailer.createTransport({
      host: s.smtp.host,
      port: s.smtp.port,
      secure: s.smtp.port === 465,
      auth: { user: s.smtp.user, pass: s.smtp.pass },
      ...TIMEOUTS,
      ...extra,
    } as Parameters<typeof nodemailer.createTransport>[0]);
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser || s.gmailUser, pass: (gmailPass || s.gmailPass).replace(/\s/g, '') },
    ...TIMEOUTS,
    ...extra,
  } as Parameters<typeof nodemailer.createTransport>[0]);
}

/** The From header that matches the provider (a mismatched sender is rejected or flagged as spam). */
export async function mailFrom(gmailUser?: string): Promise<string> {
  const s = await settings();
  return `${SENDER_NAME} <${s.smtp ? s.smtp.from : gmailUser || s.gmailUser}>`;
}

/** Which provider is active and whether the server can log in — for the admin check. Sends nothing. */
export async function verifyMail(): Promise<{ provider: 'smtp' | 'gmail' | 'none'; from: string; ok: boolean; ms?: number; error?: string }> {
  const s = await settings();
  const provider = s.smtp ? 'smtp' : s.gmailUser && s.gmailPass ? 'gmail' : 'none';
  if (provider === 'none') return { provider, from: '', ok: false, error: 'No mail credentials configured' };
  const from = await mailFrom();
  const start = Date.now();
  try {
    await (await createMailTransport()).verify();
    return { provider, from, ok: true, ms: Date.now() - start };
  } catch (err) {
    const e = err as Error & { code?: string };
    return { provider, from, ok: false, ms: Date.now() - start, error: [e.code, e.message].filter(Boolean).join(': ').slice(0, 300) };
  }
}

export type Mail = { to: string; subject: string; html: string; text?: string; replyTo?: string };

export async function sendMail(mail: Mail): Promise<boolean> {
  const s = await settings();
  if (!s.smtp && !(s.gmailUser && s.gmailPass)) {
    console.error('sendMail: no mail credentials (site_settings gmail_* or smtp_*)');
    return false;
  }
  try {
    await (await createMailTransport()).sendMail({ from: await mailFrom(), ...mail });
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
