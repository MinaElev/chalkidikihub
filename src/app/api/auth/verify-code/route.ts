// Guard: signed-in user; attempt counter in email_verifications.
import { NextRequest, NextResponse, after } from 'next/server';
import { createMailTransport, mailFrom } from '@/lib/email/mailer';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/api-helpers';
import { hashVerificationCode, MAX_VERIFY_ATTEMPTS } from '@/lib/email-verification';
import { internalHeaders } from '@/lib/route-guards';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code || !/^\d{4}$/.test(String(code))) {
      return NextResponse.json({ error: 'Μη έγκυρος κωδικός.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const admin = createAdminClient();

    const { data: profile } = await admin
      .from('profiles')
      .select('email_verified_at, full_name')
      .eq('id', user.id)
      .single();
    if (profile?.email_verified_at) {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    const { data: verification } = await admin
      .from('email_verifications')
      .select('code_hash, expires_at, attempts')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!verification || new Date(verification.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { error: 'Ο κωδικός έληξε. Ζητήστε νέο κωδικό.', expired: true },
        { status: 400 }
      );
    }

    if (verification.attempts >= MAX_VERIFY_ATTEMPTS) {
      await admin.from('email_verifications').delete().eq('user_id', user.id);
      return NextResponse.json(
        { error: 'Πολλές λανθασμένες προσπάθειες. Ζητήστε νέο κωδικό.', expired: true },
        { status: 400 }
      );
    }

    if (verification.code_hash !== hashVerificationCode(String(code), user.id)) {
      await admin
        .from('email_verifications')
        .update({ attempts: verification.attempts + 1 })
        .eq('user_id', user.id);
      const remaining = MAX_VERIFY_ATTEMPTS - verification.attempts - 1;
      return NextResponse.json(
        {
          error: remaining > 0
            ? `Λάθος κωδικός. Απομένουν ${remaining} προσπάθειες.`
            : 'Πολλές λανθασμένες προσπάθειες. Ζητήστε νέο κωδικό.',
          expired: remaining <= 0,
        },
        { status: 400 }
      );
    }

    await admin
      .from('profiles')
      .update({ email_verified_at: new Date().toISOString() })
      .eq('id', user.id);
    await admin.from('email_verifications').delete().eq('user_id', user.id);

    await admin.from('activity_logs').insert({
      type: 'user_action',
      severity: 'info',
      message: 'Email verified via 4-digit code',
      details: { user_id: user.id, email: user.email },
    });

    // Any listings submitted before verification were held back from the
    // admin-review notification — release them now.
    const { data: heldListings } = await admin
      .from('listings')
      .select('id')
      .eq('owner_id', user.id)
      .eq('status', 'pending');
    if (heldListings && heldListings.length > 0) {
      const origin = request.nextUrl.origin;
      await Promise.allSettled(
        heldListings.map((l) =>
          fetch(`${origin}/api/listings/notify-new`, {
            method: 'POST',
            headers: internalHeaders(),
            body: JSON.stringify({ listing_id: l.id }),
          })
        )
      );
    }

    // Send a one-time welcome email now that the account is fully verified.
    // Deferred via after() + best-effort so it never blocks or fails the
    // verification response. Only fires here (the alreadyVerified path returns
    // earlier), so each user gets exactly one welcome.
    if (user.email) {
      const email = user.email;
      const name = profile?.full_name || '';
      after(async () => {
        await sendWelcomeEmail(admin, email, name);
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

async function sendWelcomeEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string,
  name: string,
): Promise<void> {
  try {
    const { data: settings } = await admin
      .from('site_settings')
      .select('key, value')
      .in('key', ['gmail_address', 'gmail_app_password']);
    const map: Record<string, string> = {};
    settings?.forEach((s: { key: string; value: string }) => { map[s.key] = s.value; });
    const gmailAddress = map.gmail_address;
    const gmailPassword = map.gmail_app_password;
    if (!gmailAddress || !gmailPassword) return;

    const transporter = await createMailTransport(gmailAddress, gmailPassword.replace(/\s/g, ''));

    const cleanName = (name || '').trim().replace(/</g, '&lt;');

    await transporter.sendMail({
      from: await mailFrom(gmailAddress),
      to: email,
      subject: 'Καλωσορίσατε στο ChalkidikiHub! 🎉',
      html: `
<!DOCTYPE html>
<html lang="el"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
        <tr><td style="background:linear-gradient(135deg,#0369a1,#0284c7);padding:24px 28px;color:#fff;">
          <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;font-weight:600;">ChalkidikiHub</div>
          <div style="font-size:23px;font-weight:700;margin-top:4px;">Καλωσορίσατε! 🎉</div>
        </td></tr>

        <tr><td style="padding:26px 28px 6px;">
          <p style="margin:0 0 12px;font-size:15px;color:#374151;">${cleanName ? `Γεια σας, ${cleanName}!` : 'Γεια σας!'}</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
            Το email σας επιβεβαιώθηκε και ο λογαριασμός σας στο <strong>ChalkidikiHub</strong> είναι πλέον έτοιμος. Χαιρόμαστε πολύ που είστε μαζί μας!
          </p>
        </td></tr>

        <tr><td style="padding:18px 28px 0;">
          <div style="background:#f0f9ff;border-radius:12px;padding:16px 18px;">
            <div style="font-size:14px;font-weight:600;color:#0f172a;margin-bottom:12px;">Καταχωρήστε το κατάλυμά σας σε 6 βήματα:</div>
            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:13.5px;color:#374151;line-height:1.5;">
              <tr><td style="padding:4px 10px 4px 0;vertical-align:top;width:22px;"><span style="display:inline-block;width:20px;height:20px;background:#0284c7;color:#fff;border-radius:50%;text-align:center;font-size:12px;font-weight:700;line-height:20px;">1</span></td><td style="padding:4px 0;">Μπείτε στο <strong>Dashboard → «Νέο Κατάλυμα»</strong>.</td></tr>
              <tr><td style="padding:4px 10px 4px 0;vertical-align:top;"><span style="display:inline-block;width:20px;height:20px;background:#0284c7;color:#fff;border-radius:50%;text-align:center;font-size:12px;font-weight:700;line-height:20px;">2</span></td><td style="padding:4px 0;">Γράψτε <strong>τίτλο &amp; περιγραφή</strong> — μόνο στα Ελληνικά· μεταφράζεται αυτόματα σε 6 γλώσσες.</td></tr>
              <tr><td style="padding:4px 10px 4px 0;vertical-align:top;"><span style="display:inline-block;width:20px;height:20px;background:#0284c7;color:#fff;border-radius:50%;text-align:center;font-size:12px;font-weight:700;line-height:20px;">3</span></td><td style="padding:4px 0;">Επιλέξτε <strong>πόδι/περιοχή</strong> και σημείο στον <strong>χάρτη</strong>.</td></tr>
              <tr><td style="padding:4px 10px 4px 0;vertical-align:top;"><span style="display:inline-block;width:20px;height:20px;background:#0284c7;color:#fff;border-radius:50%;text-align:center;font-size:12px;font-weight:700;line-height:20px;">4</span></td><td style="padding:4px 0;">Βάλτε <strong>τιμή, άτομα, δωμάτια</strong> και επιλέξτε <strong>παροχές</strong>.</td></tr>
              <tr><td style="padding:4px 10px 4px 0;vertical-align:top;"><span style="display:inline-block;width:20px;height:20px;background:#0284c7;color:#fff;border-radius:50%;text-align:center;font-size:12px;font-weight:700;line-height:20px;">5</span></td><td style="padding:4px 0;">Ανεβάστε <strong>φωτογραφίες</strong> (≥5, με φυσικό φως).</td></tr>
              <tr><td style="padding:4px 10px 4px 0;vertical-align:top;"><span style="display:inline-block;width:20px;height:20px;background:#16a34a;color:#fff;border-radius:50%;text-align:center;font-size:12px;font-weight:700;line-height:20px;">6</span></td><td style="padding:4px 0;">Πατήστε <strong>«Δημοσίευση»</strong> — μπαίνει σε έλεγχο και δημοσιεύεται σύντομα!</td></tr>
            </table>
          </div>
        </td></tr>

        <tr><td style="padding:20px 28px 0;">
          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px 18px;">
            <div style="font-size:14px;font-weight:600;color:#92400e;margin-bottom:6px;">📖 Θέλετε περισσότερες λεπτομέρειες;</div>
            <p style="margin:0 0 12px;font-size:13.5px;line-height:1.6;color:#78350f;">
              Ο πλήρης οδηγός σάς δείχνει κάθε βήμα <strong>αναλυτικά, με εικόνες</strong> και χρήσιμα tips.
            </p>
            <a href="https://chalkidikihub.gr/for-owners/guide" style="display:inline-block;background:#d97706;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:9px;">Δείτε τον αναλυτικό οδηγό →</a>
          </div>
        </td></tr>

        <tr><td style="padding:18px 28px 4px;" align="center">
          <a href="https://chalkidikihub.gr/dashboard" style="display:inline-block;background:#0284c7;color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:13px 30px;border-radius:10px;">Μετάβαση στο Dashboard →</a>
        </td></tr>

        <tr><td style="padding:18px 28px 0;">
          <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;text-align:center;">
            Χρειάζεστε βοήθεια; Απαντήστε απλώς σε αυτό το email και θα σας βοηθήσουμε.
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
    }).catch(() => {
      // best-effort — the account is verified regardless of the welcome email
    });
  } catch {
    // swallow: welcome email must never affect verification
  }
}
