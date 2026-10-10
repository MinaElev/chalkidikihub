import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

interface QRRecipient {
  email: string;
  ownerName: string;
  listingTitle: string;
  listingSlug: string;
  listingId: string;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireSuperAdmin();
    if (auth instanceof NextResponse) return auth;

    const { recipients, subject, messageHtml }: {
      recipients: QRRecipient[];
      subject: string;
      messageHtml: string;
    } = await request.json();

    if (!recipients?.length || !subject || !messageHtml) {
      return NextResponse.json({ error: 'Missing recipients, subject or message' }, { status: 400 });
    }

    // Get Gmail credentials from DB
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
      return NextResponse.json(
        { error: 'Gmail credentials not configured. Set Gmail Address and App Password in Admin → Settings.' },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailAddress,
        pass: gmailPassword.replace(/\s/g, ''),
      },
    });

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const r of recipients) {
      try {
        // Generate QR code as PNG buffer
        const guestUrl = `${SITE_URL}/guest/${r.listingSlug}`;
        const qrBuffer = await QRCode.toBuffer(guestUrl, {
          type: 'png',
          width: 400,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: { dark: '#000000', light: '#FFFFFF' },
        });

        // Build personalized HTML with inline QR image (cid reference)
        const personalizedBody = messageHtml
          .replace(/\{owner_name\}/g, r.ownerName || 'Αγαπητέ ιδιοκτήτη')
          .replace(/\{listing_title\}/g, r.listingTitle)
          .replace(/\{guest_url\}/g, guestUrl)
          .replace(/\{listing_url\}/g, `${SITE_URL}/listings/${r.listingSlug}`);

        const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0d9488,#0891b2);border-radius:16px 16px 0 0;padding:30px 24px;text-align:center;">
      <h1 style="color:#fff;font-size:24px;margin:0 0 4px;">Chalkidiki<span style="color:#a5f3fc;">Hub</span></h1>
      <p style="color:#ccfbf1;font-size:13px;margin:0;">QR Guest Guide</p>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:32px 24px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
      <div style="font-size:15px;line-height:1.7;color:#374151;">
        ${personalizedBody}
      </div>

      <!-- QR Code Section -->
      <div style="text-align:center;margin:32px 0;padding:24px;background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;">
        <p style="font-size:14px;font-weight:600;color:#111827;margin:0 0 16px;">
          QR Code — ${r.listingTitle}
        </p>
        <img src="cid:qrcode-${r.listingSlug}" alt="QR Code for ${r.listingTitle}"
             style="width:250px;height:250px;border:1px solid #e5e7eb;border-radius:8px;" />
        <p style="font-size:12px;color:#6b7280;margin:16px 0 0;">
          Σκανάρετε το QR code για να δείτε τη σελίδα Guest Guide
        </p>
        <a href="${guestUrl}" style="display:inline-block;margin-top:8px;font-size:12px;color:#0d9488;word-break:break-all;">
          ${guestUrl}
        </a>
      </div>

      <!-- Instructions -->
      <div style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin:24px 0 0;">
        <p style="font-size:14px;font-weight:600;color:#92400e;margin:0 0 8px;">📋 Οδηγίες:</p>
        <ol style="margin:0;padding-left:18px;font-size:13px;color:#78350f;line-height:1.8;">
          <li>Κατεβάστε ή τυπώστε αυτό το QR code</li>
          <li>Τοποθετήστε το σε κάθε δωμάτιο ή στη reception</li>
          <li>Οι πελάτες σκανάρουν και βλέπουν παραλίες, εστιατόρια, δραστηριότητες κοντά</li>
          <li>Δουλεύει αυτόματα σε 7 γλώσσες!</li>
        </ol>
      </div>
    </div>

    <!-- Footer -->
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
          to: r.email,
          subject: subject.replace(/\{listing_title\}/g, r.listingTitle),
          html,
          attachments: [
            {
              filename: `qr-${r.listingSlug}.png`,
              content: qrBuffer,
              cid: `qrcode-${r.listingSlug}`,
            },
          ],
        });
        sent++;
      } catch (err) {
        failed++;
        errors.push(`${r.email} (${r.listingTitle}): ${(err as Error).message}`);
      }

      // Throttle if many recipients
      if (recipients.length > 5) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    // Log the action
    await supabase.from('activity_logs').insert({
      type: 'admin_action',
      severity: 'info',
      message: `QR email sent: ${sent} delivered, ${failed} failed`,
      details: { subject, recipientCount: recipients.length, sent, failed, errors: errors.slice(0, 5) },
    });

    return NextResponse.json({ sent, failed, errors: errors.slice(0, 10) });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
