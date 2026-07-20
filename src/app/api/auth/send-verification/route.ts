import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/api-helpers';
import { hashVerificationCode } from '@/lib/email-verification';

const CODE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute between sends
const MAX_SENDS_PER_HOUR = 5;

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const admin = createAdminClient();

    const { data: profile } = await admin
      .from('profiles')
      .select('email_verified_at, full_name')
      .eq('id', user.id)
      .single();

    if (profile?.email_verified_at) {
      return NextResponse.json({ alreadyVerified: true });
    }

    // Rate limits: 1/minute cooldown, max 5/hour
    const { data: existing } = await admin
      .from('email_verifications')
      .select('last_sent_at, sends_in_window, window_started_at')
      .eq('user_id', user.id)
      .maybeSingle();

    const now = Date.now();
    let sendsInWindow = 1;
    let windowStartedAt = new Date(now).toISOString();
    if (existing) {
      if (now - new Date(existing.last_sent_at).getTime() < RESEND_COOLDOWN_MS) {
        return NextResponse.json(
          { error: 'Περιμένετε 1 λεπτό πριν ζητήσετε νέο κωδικό.' },
          { status: 429 }
        );
      }
      const windowAge = now - new Date(existing.window_started_at).getTime();
      if (windowAge < 60 * 60 * 1000) {
        if (existing.sends_in_window >= MAX_SENDS_PER_HOUR) {
          return NextResponse.json(
            { error: 'Πολλές αποστολές κωδικού. Δοκιμάστε ξανά σε 1 ώρα.' },
            { status: 429 }
          );
        }
        sendsInWindow = existing.sends_in_window + 1;
        windowStartedAt = existing.window_started_at;
      }
    }

    const code = String(randomInt(0, 10000)).padStart(4, '0');

    const { error: upsertError } = await admin.from('email_verifications').upsert({
      user_id: user.id,
      code_hash: hashVerificationCode(code, user.id),
      expires_at: new Date(now + CODE_TTL_MS).toISOString(),
      attempts: 0,
      last_sent_at: new Date(now).toISOString(),
      sends_in_window: sendsInWindow,
      window_started_at: windowStartedAt,
    });
    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    const { data: settings } = await admin
      .from('site_settings')
      .select('key, value')
      .in('key', ['gmail_address', 'gmail_app_password']);
    const settingsMap: Record<string, string> = {};
    settings?.forEach((s) => { settingsMap[s.key] = s.value; });
    const gmailAddress = settingsMap.gmail_address;
    const gmailPassword = settingsMap.gmail_app_password;
    if (!gmailAddress || !gmailPassword) {
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailAddress, pass: gmailPassword.replace(/\s/g, '') },
    });

    const name = (profile?.full_name || '').trim();

    await transporter.sendMail({
      from: `ChalkidikiHub <${gmailAddress}>`,
      to: user.email,
      subject: `${code} — Κωδικός επιβεβαίωσης ChalkidikiHub`,
      html: `
<!DOCTYPE html>
<html lang="el"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
        <tr><td style="background:linear-gradient(135deg,#0369a1,#0284c7);padding:22px 28px;color:#fff;">
          <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;font-weight:600;">ChalkidikiHub</div>
          <div style="font-size:22px;font-weight:700;margin-top:4px;">Επιβεβαίωση email</div>
        </td></tr>

        <tr><td style="padding:24px 28px 4px;">
          <p style="margin:0 0 10px;font-size:15px;color:#374151;">${name ? `Γεια σας, ${name.replace(/</g, '&lt;')}.` : 'Γεια σας,'}</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
            Χρησιμοποιήστε τον παρακάτω κωδικό για να επιβεβαιώσετε το email σας:
          </p>
        </td></tr>

        <tr><td style="padding:20px 28px 0;" align="center">
          <div style="display:inline-block;background:#f0f9ff;border:2px dashed #0284c7;border-radius:12px;padding:16px 32px;font-size:36px;font-weight:700;letter-spacing:12px;color:#0369a1;font-family:monospace;">${code}</div>
        </td></tr>

        <tr><td style="padding:20px 28px 0;">
          <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;text-align:center;">
            Ο κωδικός ισχύει για <strong>15 λεπτά</strong>. Αν δεν κάνατε εσείς εγγραφή στο ChalkidikiHub, αγνοήστε αυτό το email.
          </p>
        </td></tr>

        <tr><td style="padding:22px 28px 26px;border-top:1px solid #f3f4f6;margin-top:20px;">
          <p style="margin:20px 0 0;font-size:12px;line-height:1.5;color:#9ca3af;text-align:center;">
            <strong style="color:#6b7280;">ChalkidikiHub</strong> · <a href="https://chalkidikihub.gr" style="color:#0284c7;text-decoration:none;">chalkidikihub.gr</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
