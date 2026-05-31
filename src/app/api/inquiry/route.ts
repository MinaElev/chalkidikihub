import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminClient } from '@/lib/api-helpers';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slugs = searchParams.get('slugs')?.split(',').filter(Boolean) || [];
    if (slugs.length === 0) return NextResponse.json([]);

    const supabase = createAdminClient();

    // Fetch inquiries that mention these slugs in the message
    const { data: msgs } = await supabase
      .from('contact_messages')
      .select('id, name, email, subject, message, created_at')
      .like('subject', 'Αίτημα διαθεσιμότητας%')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!msgs) return NextResponse.json([]);

    // Filter to only those matching the owner's listing slugs
    const filtered = msgs.filter(m =>
      slugs.some(slug => m.message?.includes(slug))
    );

    return NextResponse.json(filtered.slice(0, 20), {
      headers: { 'Cache-Control': 'private, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, checkin, checkout, guests, message, listing_slug, listing_title } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 });
    }

    // Validate + sanitize inputs
    const cleanName = escapeHtml((name || '').slice(0, 200));
    const cleanEmail = (email || '').slice(0, 200).replace(/[\n\r]/g, ''); // prevent header injection
    const cleanPhone = escapeHtml((phone || '').slice(0, 30));
    const cleanMessage = escapeHtml((message || '').slice(0, 2000));
    const cleanTitle = escapeHtml((listing_title || '').slice(0, 300));
    const cleanSlug = (listing_slug || '').slice(0, 200).replace(/[^a-z0-9-]/g, '');

    const supabase = createAdminClient();

    // Save to contact_messages
    await supabase.from('contact_messages').insert({
      name: cleanName,
      email: cleanEmail,
      subject: `Αίτημα διαθεσιμότητας: ${cleanTitle}`,
      message: `Κατάλυμα: ${cleanTitle} (${cleanSlug})
Check-in: ${checkin || '-'}
Check-out: ${checkout || '-'}
Άτομα: ${guests || '-'}
Τηλέφωνο: ${cleanPhone}

${cleanMessage}`,
      locale: 'el',
    });

    // Try to send email to listing owner
    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['gmail_address', 'gmail_app_password']);

    const settingsMap: Record<string, string> = {};
    settings?.forEach(s => { settingsMap[s.key] = s.value; });

    const gmailAddress = settingsMap.gmail_address;
    const gmailPassword = settingsMap.gmail_app_password;

    // Get listing owner email — prefer profiles.email, fall back to listings.contact_email
    const { data: listing } = await supabase
      .from('listings')
      .select('owner_id, contact_email')
      .eq('slug', listing_slug)
      .single();

    if (listing && gmailAddress && gmailPassword) {
      let ownerEmail: string | null = null;
      let ownerName: string | null = null;

      if (listing.owner_id) {
        const { data: owner } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', listing.owner_id)
          .single();
        if (owner?.email) {
          ownerEmail = owner.email;
          ownerName = owner.full_name || null;
        }
      }

      if (!ownerEmail && listing.contact_email) {
        ownerEmail = listing.contact_email;
      }

      if (ownerEmail) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: gmailAddress, pass: gmailPassword.replace(/\s/g, '') },
        });

        const greeting = ownerName ? `Γεια σας, ${escapeHtml(ownerName)}.` : 'Γεια σας,';
        const guestEmailEsc = escapeHtml(cleanEmail);
        const guestNameEsc = cleanName;
        const guestPhoneEsc = cleanPhone;
        const messageEsc = cleanMessage;

        const waHref = guestPhoneEsc
          ? `https://wa.me/${guestPhoneEsc.replace(/[^0-9]/g, '')}`
          : null;
        const nights = (() => {
          if (!checkin || !checkout) return null;
          const a = new Date(String(checkin));
          const b = new Date(String(checkout));
          if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
          const n = Math.round((b.getTime() - a.getTime()) / 86_400_000);
          return n > 0 ? n : null;
        })();
        const fmtDate = (s: string) => {
          const d = new Date(s);
          if (isNaN(d.getTime())) return escapeHtml(s);
          return d.toLocaleDateString('el-GR', { day: '2-digit', month: 'short', year: 'numeric' });
        };

        await transporter.sendMail({
          from: `ChalkidikiHub <${gmailAddress}>`,
          to: ownerEmail,
          replyTo: cleanEmail,
          subject: `🔔 Νέο αίτημα διαθεσιμότητας — ${listing_title}`,
          html: `
<!DOCTYPE html>
<html lang="el">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#111827;">
  <div style="display:none;max-height:0;overflow:hidden;color:transparent;">Νέο αίτημα διαθεσιμότητας από ${guestNameEsc} για ${cleanTitle}${nights ? ` — ${nights} ${nights === 1 ? 'βράδυ' : 'βράδια'}` : ''}.</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">

        <!-- Header / brand -->
        <tr><td style="background:linear-gradient(135deg,#0369a1,#0284c7);padding:22px 28px;color:#ffffff;">
          <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.85;font-weight:600;">ChalkidikiHub</div>
          <div style="font-size:22px;font-weight:700;margin-top:4px;">🔔 Νέο αίτημα διαθεσιμότητας</div>
        </td></tr>

        <!-- Automation notice -->
        <tr><td style="padding:16px 28px 0;">
          <div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:6px;padding:12px 14px;font-size:13px;line-height:1.5;color:#1e3a8a;">
            <strong>✉️ Αυτοματοποιημένο μήνυμα</strong> — Αυτό το email στάλθηκε αυτόματα από την πλατφόρμα <strong>ChalkidikiHub</strong> όταν κάποιος επισκέπτης συμπλήρωσε τη φόρμα «Ζητήστε Διαθεσιμότητα» στη σελίδα του καταλύματός σας. Δεν χρειάζεται να απαντήσετε σε εμάς.
          </div>
        </td></tr>

        <!-- Intro -->
        <tr><td style="padding:20px 28px 4px;">
          <p style="margin:0 0 6px;font-size:15px;color:#374151;">${greeting}</p>
          <p style="margin:0;font-size:15px;line-height:1.55;color:#374151;">
            Ένας υποψήφιος επισκέπτης ενδιαφέρθηκε για το κατάλυμά σας <strong>«${cleanTitle}»</strong> και ζήτησε πληροφορίες διαθεσιμότητας. Παρακάτω θα βρείτε όλα τα στοιχεία του αιτήματος.
          </p>
        </td></tr>

        <!-- Stay summary card -->
        <tr><td style="padding:20px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
            <tr><td style="padding:16px 18px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#6b7280;margin-bottom:10px;">📅 Στοιχεία διαμονής</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                ${checkin ? `<tr><td style="padding:4px 0;color:#6b7280;width:110px;">Check-in</td><td style="padding:4px 0;color:#111827;font-weight:600;">${fmtDate(String(checkin))}</td></tr>` : ''}
                ${checkout ? `<tr><td style="padding:4px 0;color:#6b7280;">Check-out</td><td style="padding:4px 0;color:#111827;font-weight:600;">${fmtDate(String(checkout))}</td></tr>` : ''}
                ${nights ? `<tr><td style="padding:4px 0;color:#6b7280;">Διάρκεια</td><td style="padding:4px 0;color:#111827;font-weight:600;">${nights} ${nights === 1 ? 'βράδυ' : 'βράδια'}</td></tr>` : ''}
                ${guests ? `<tr><td style="padding:4px 0;color:#6b7280;">Άτομα</td><td style="padding:4px 0;color:#111827;font-weight:600;">${escapeHtml(String(guests))}</td></tr>` : ''}
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Guest contact card -->
        <tr><td style="padding:14px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;">
            <tr><td style="padding:16px 18px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#15803d;margin-bottom:10px;">👤 Στοιχεία επισκέπτη</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                <tr><td style="padding:4px 0;color:#6b7280;width:110px;">Όνομα</td><td style="padding:4px 0;color:#111827;font-weight:600;">${guestNameEsc}</td></tr>
                <tr><td style="padding:4px 0;color:#6b7280;">Email</td><td style="padding:4px 0;"><a href="mailto:${guestEmailEsc}" style="color:#0369a1;text-decoration:none;font-weight:600;">${guestEmailEsc}</a></td></tr>
                ${guestPhoneEsc ? `<tr><td style="padding:4px 0;color:#6b7280;">Τηλέφωνο</td><td style="padding:4px 0;"><a href="tel:${guestPhoneEsc}" style="color:#0369a1;text-decoration:none;font-weight:600;">${guestPhoneEsc}</a></td></tr>` : ''}
              </table>
            </td></tr>
          </table>
        </td></tr>

        ${messageEsc ? `
        <!-- Guest message -->
        <tr><td style="padding:14px 28px 0;">
          <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#6b7280;margin-bottom:8px;">💬 Μήνυμα επισκέπτη</div>
          <div style="background:#ffffff;border:1px solid #e5e7eb;border-left:4px solid #0284c7;border-radius:6px;padding:14px 16px;font-size:14px;line-height:1.6;color:#374151;white-space:pre-wrap;font-style:italic;">${messageEsc}</div>
        </td></tr>` : ''}

        <!-- Action buttons -->
        <tr><td style="padding:24px 28px 8px;" align="center">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:0 6px 8px;">
                <a href="mailto:${guestEmailEsc}?subject=${encodeURIComponent('Re: Αίτημα διαθεσιμότητας — ' + listing_title)}" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:600;">✉️ Απάντηση με email</a>
              </td>
              ${guestPhoneEsc ? `<td style="padding:0 6px 8px;">
                <a href="tel:${guestPhoneEsc}" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:600;">📞 Κλήση</a>
              </td>` : ''}
              ${waHref ? `<td style="padding:0 6px 8px;">
                <a href="${waHref}" style="display:inline-block;background:#25d366;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:600;">💬 WhatsApp</a>
              </td>` : ''}
            </tr>
          </table>
        </td></tr>

        <!-- How to reply tip -->
        <tr><td style="padding:8px 28px 4px;">
          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 16px;font-size:13px;line-height:1.55;color:#78350f;">
            💡 <strong>Tip:</strong> Πατώντας απλά <strong>Reply</strong> σε αυτό το email, η απάντησή σας πάει <u>απευθείας στον επισκέπτη</u> (${guestEmailEsc}) — όχι στην πλατφόρμα. Συνιστούμε γρήγορη απάντηση εντός λίγων ωρών για καλύτερες πιθανότητες κράτησης.
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:22px 28px 26px;border-top:1px solid #f3f4f6;margin-top:16px;">
          <p style="margin:0;font-size:12px;line-height:1.5;color:#9ca3af;text-align:center;">
            Αυτό το μήνυμα στάλθηκε αυτόματα από την πλατφόρμα <strong style="color:#6b7280;">ChalkidikiHub</strong>.<br>
            Λάβατε το email επειδή το κατάλυμά σας προβάλλεται στο <a href="https://chalkidikihub.gr" style="color:#0284c7;text-decoration:none;">chalkidikihub.gr</a> και κάποιος υπέβαλε αίτημα διαθεσιμότητας.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
          `,
        }).catch(() => {});
      }
    }

    // Log
    await supabase.from('activity_logs').insert({
      type: 'user_action',
      severity: 'info',
      message: `Inquiry submitted for ${listing_title}`,
      details: { listing_slug, name, email, checkin, checkout, guests },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
