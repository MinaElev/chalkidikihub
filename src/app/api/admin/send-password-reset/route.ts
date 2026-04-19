import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireSuperAdmin();
    if (auth instanceof NextResponse) return auth;

    const { email, fullName } = await request.json();
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    const supabase = createAdminClient();

    // Generate the recovery link (does NOT send the email — we send via Gmail SMTP)
    const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: `${SITE_URL}/auth/reset-password` },
    });
    if (linkErr || !linkData?.properties?.action_link) {
      return NextResponse.json(
        { error: linkErr?.message || 'Failed to generate recovery link' },
        { status: 500 },
      );
    }
    const actionLink = linkData.properties.action_link;

    // Get Gmail credentials
    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['gmail_address', 'gmail_app_password']);

    const settingsMap: Record<string, string> = {};
    settings?.forEach(s => { settingsMap[s.key] = s.value; });

    const gmailAddress = settingsMap.gmail_address || process.env.GMAIL_ADDRESS;
    const gmailPassword = settingsMap.gmail_app_password || process.env.GMAIL_APP_PASSWORD;

    if (!gmailAddress || !gmailPassword) {
      return NextResponse.json(
        { error: 'Gmail credentials not configured. Set Gmail Address and App Password in Admin → Settings.' },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailAddress, pass: gmailPassword.replace(/\s/g, '') },
    });

    const greeting = fullName ? `Γεια σου ${fullName},` : 'Γεια σου,';
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
      <p style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 16px;">${greeting}</p>
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
      to: email,
      subject: 'Επαναφορά κωδικού — ChalkidikiHub',
      html,
    });

    await supabase.from('activity_logs').insert({
      type: 'admin_action',
      severity: 'info',
      message: `Password reset email sent to ${email}`,
      details: { email },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
