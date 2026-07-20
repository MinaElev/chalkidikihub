import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminClient } from '@/lib/api-helpers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

// In-memory rate limit (resets on cold start — good enough for Vercel serverless)
const ipAttempts = new Map<string, { count: number; resetAt: number }>();
const emailLastSent = new Map<string, number>();
const MAX_PER_HOUR = 3;
const EMAIL_COOLDOWN_MS = 60 * 1000;

function getIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const cleanEmail = String(email || '').slice(0, 200).trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json({ error: 'Μη έγκυρο email.' }, { status: 400 });
    }

    const ip = getIP(request);
    const now = Date.now();
    const record = ipAttempts.get(ip);
    if (record && now <= record.resetAt) {
      if (record.count >= MAX_PER_HOUR) {
        return NextResponse.json(
          { error: 'Πολλά αιτήματα επαναφοράς. Δοκιμάστε ξανά σε 1 ώρα.' },
          { status: 429 }
        );
      }
      record.count++;
    } else {
      ipAttempts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    }

    // Always report success from here on — never reveal whether the email exists.
    const okResponse = NextResponse.json({ success: true });

    const lastSent = emailLastSent.get(cleanEmail);
    if (lastSent && now - lastSent < EMAIL_COOLDOWN_MS) {
      return okResponse;
    }

    const supabase = createAdminClient();

    const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: cleanEmail,
    });
    if (linkErr || !linkData?.properties?.hashed_token) {
      // Most likely "user not found" — swallow it so the response doesn't leak that
      return okResponse;
    }
    const actionLink = `${SITE_URL}/auth/reset-password?token_hash=${encodeURIComponent(linkData.properties.hashed_token)}&type=recovery`;

    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['gmail_address', 'gmail_app_password']);
    const settingsMap: Record<string, string> = {};
    settings?.forEach(s => { settingsMap[s.key] = s.value; });
    const gmailAddress = settingsMap.gmail_address || process.env.GMAIL_ADDRESS;
    const gmailPassword = settingsMap.gmail_app_password || process.env.GMAIL_APP_PASSWORD;
    if (!gmailAddress || !gmailPassword) {
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailAddress, pass: gmailPassword.replace(/\s/g, '') },
    });

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:linear-gradient(135deg,#0d9488,#0891b2);border-radius:16px 16px 0 0;padding:30px 24px;text-align:center;">
      <h1 style="color:#fff;font-size:24px;margin:0 0 4px;">Chalkidiki<span style="color:#a5f3fc;">Hub</span></h1>
      <p style="color:#ccfbf1;font-size:13px;margin:0;">Επαναφορά Κωδικού</p>
    </div>
    <div style="background:#fff;padding:32px 24px;border:1px solid #e5e7eb;border-top:0;border-bottom:0;">
      <p style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 16px;">Γεια σου,</p>
      <p style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 24px;">
        Λάβαμε αίτημα για επαναφορά του κωδικού σου στο ChalkidikiHub. Πάτα το κουμπί παρακάτω για να ορίσεις νέο κωδικό:
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${actionLink}" style="display:inline-block;padding:14px 32px;background:#0d9488;color:#fff;text-decoration:none;font-weight:600;border-radius:12px;font-size:15px;">
          Ορισμός νέου κωδικού
        </a>
      </div>
      <p style="font-size:13px;line-height:1.6;color:#6b7280;margin:24px 0 0;">
        Αν το κουμπί δεν λειτουργεί, αντίγραψε τον παρακάτω σύνδεσμο στον browser:
      </p>
      <p style="font-size:12px;color:#0d9488;word-break:break-all;margin:8px 0 0;">
        <a href="${actionLink}" style="color:#0d9488;">${actionLink}</a>
      </p>
      <div style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin:32px 0 0;">
        <p style="font-size:13px;color:#78350f;margin:0;line-height:1.6;">
          Αν δεν ζήτησες επαναφορά κωδικού, αγνόησε αυτό το email. Ο κωδικός σου παραμένει αμετάβλητος.
        </p>
      </div>
    </div>
    <div style="background:#f9fafb;border-radius:0 0 16px 16px;padding:20px 24px;text-align:center;border:1px solid #e5e7eb;border-top:0;">
      <p style="font-size:12px;color:#9ca3af;margin:0;">
        © ${new Date().getFullYear()} ChalkidikiHub — <a href="${SITE_URL}" style="color:#0d9488;">chalkidikihub.gr</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    await transporter.sendMail({
      from: `ChalkidikiHub <${gmailAddress}>`,
      to: cleanEmail,
      subject: 'Επαναφορά κωδικού — ChalkidikiHub',
      html,
    });

    emailLastSent.set(cleanEmail, now);

    await supabase.from('activity_logs').insert({
      type: 'user_action',
      severity: 'info',
      message: `Self-service password reset email sent to ${cleanEmail}`,
      details: { email: cleanEmail, ip },
    });

    return okResponse;
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
