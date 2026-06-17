import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminClient } from '@/lib/api-helpers';

const ADMIN_EMAIL = 'mnc@hotmail.gr';

function escapeHtml(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Owner-facing notification fired the first (or any subsequent) time a
 * listing transitions from pending/draft → published. The on-submission
 * email already tells owners "we'll email you again when it's live",
 * this endpoint is what makes that promise true.
 *
 * Content highlights the discoverability + tooling story so owners see
 * the platform's value the moment their listing is approved: the seven
 * languages we translate to, the per-listing QR code that turns the
 * physical space into a discovery surface, and the platform tools
 * (zero commission, calendar, brand site, availability requests,
 * social kit, analytics, SEO) they now have access to.
 */
export async function POST(request: NextRequest) {
  try {
    const { listing_id } = await request.json();
    if (!listing_id) {
      return NextResponse.json({ error: 'Missing listing_id' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: listing } = await supabase
      .from('listings')
      .select('id, slug, title_el, area, location_name, price_per_night, guests_max, bedrooms, bathrooms, owner_id, status')
      .eq('id', listing_id)
      .single();

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Belt + braces: only fire when the row really is published. The caller
    // is supposed to flip the status first, but if the email fires before
    // the update lands the owner gets a confusing "your listing is live"
    // email for a draft.
    if (listing.status !== 'published') {
      return NextResponse.json({ error: 'Listing not published yet' }, { status: 400 });
    }

    let ownerEmail: string | null = null;
    let ownerName: string | null = null;
    if (listing.owner_id) {
      const { data: owner } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', listing.owner_id)
        .single();
      if (owner) {
        ownerEmail = owner.email || null;
        ownerName = owner.full_name || null;
      }
    }

    if (!ownerEmail) {
      // No-op (and no error) — orphaned listings or pre-launch admin
      // imports without an owner row are a normal state, not a failure.
      return NextResponse.json({ success: true, skipped: 'no_owner_email' });
    }

    const { data: settings } = await supabase
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

    const title = escapeHtml(listing.title_el || '(χωρίς τίτλο)');
    const area = escapeHtml(listing.area || '');
    const loc = escapeHtml(listing.location_name || '');
    const ownerNameEsc = escapeHtml(ownerName || '');
    const publicUrl = `https://chalkidikihub.gr/listings/${listing.slug}`;
    const qrUrl = `https://chalkidikihub.gr/dashboard/listings/${listing.id}/qr`;
    const editUrl = `https://chalkidikihub.gr/dashboard/listings/${listing.id}/edit`;
    const dashboardUrl = `https://chalkidikihub.gr/dashboard/listings`;

    await transporter.sendMail({
      from: `ChalkidikiHub <${gmailAddress}>`,
      to: ownerEmail,
      replyTo: ADMIN_EMAIL,
      subject: `🎉 Το κατάλυμά σας είναι LIVE — ${listing.title_el}`,
      html: `
<!DOCTYPE html>
<html lang="el"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">

        <!-- Hero -->
        <tr><td style="background:linear-gradient(135deg,#15803d,#16a34a);padding:28px 28px;color:#fff;">
          <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;font-weight:600;">ChalkidikiHub</div>
          <div style="font-size:26px;font-weight:700;margin-top:4px;line-height:1.2;">🎉 Το κατάλυμά σας είναι LIVE!</div>
          <div style="font-size:15px;opacity:0.95;margin-top:6px;">Δημοσιεύτηκε στο chalkidikihub.gr</div>
        </td></tr>

        <!-- Intro -->
        <tr><td style="padding:24px 28px 4px;">
          <p style="margin:0 0 10px;font-size:15px;color:#374151;">${ownerNameEsc ? `Γεια σας, ${ownerNameEsc}.` : 'Γεια σας,'}</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
            Συγχαρητήρια! Το κατάλυμά σας <strong>«${title}»</strong> εγκρίθηκε και είναι πλέον ορατό σε ταξιδιώτες από όλη την Ευρώπη.
          </p>
        </td></tr>

        <!-- Listing summary card -->
        <tr><td style="padding:18px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;font-size:14px;">
            <tr><td style="padding:14px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                <tr><td style="padding:3px 0;color:#166534;width:120px;">Τίτλος</td><td style="padding:3px 0;color:#111827;font-weight:600;">${title}</td></tr>
                <tr><td style="padding:3px 0;color:#166534;">Περιοχή</td><td style="padding:3px 0;color:#111827;">${area}${loc ? ` — ${loc}` : ''}</td></tr>
                <tr><td style="padding:3px 0;color:#166534;">Τιμή/βράδυ</td><td style="padding:3px 0;color:#111827;">€${listing.price_per_night || '—'}</td></tr>
                <tr><td style="padding:3px 0;color:#166534;">Κατάσταση</td><td style="padding:3px 0;"><span style="background:#dcfce7;color:#166534;padding:2px 10px;border-radius:9999px;font-size:12px;font-weight:700;">✓ Δημοσιευμένο</span></td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Primary CTA -->
        <tr><td style="padding:18px 28px 0;" align="center">
          <a href="${publicUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:700;box-shadow:0 2px 4px rgba(22,163,74,0.25);">👁️ Δες το live listing →</a>
        </td></tr>

        <!-- Section: 7 languages -->
        <tr><td style="padding:28px 28px 0;">
          <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0369a1;margin-bottom:8px;">🌍 Πολυγλωσσικό περιεχόμενο</div>
          <div style="font-size:18px;font-weight:700;color:#111827;margin-bottom:8px;">Το κατάλυμά σας μεταφράστηκε σε 7 γλώσσες</div>
          <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#4b5563;">
            Έτσι, επισκέπτες από όλη την Ευρώπη μπορούν να σας βρουν στη γλώσσα τους και να επικοινωνήσουν απευθείας μαζί σας:
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;">
            <tr><td style="padding:14px 16px;">
              <div style="font-size:14px;line-height:2;color:#1e3a8a;">
                <span style="display:inline-block;padding:4px 12px;margin:2px;background:#fff;border:1px solid #bfdbfe;border-radius:9999px;font-weight:600;">🇬🇷 Ελληνικά</span>
                <span style="display:inline-block;padding:4px 12px;margin:2px;background:#fff;border:1px solid #bfdbfe;border-radius:9999px;font-weight:600;">🇬🇧 Αγγλικά</span>
                <span style="display:inline-block;padding:4px 12px;margin:2px;background:#fff;border:1px solid #bfdbfe;border-radius:9999px;font-weight:600;">🇩🇪 Γερμανικά</span>
                <span style="display:inline-block;padding:4px 12px;margin:2px;background:#fff;border:1px solid #bfdbfe;border-radius:9999px;font-weight:600;">🇧🇬 Βουλγαρικά</span>
                <span style="display:inline-block;padding:4px 12px;margin:2px;background:#fff;border:1px solid #bfdbfe;border-radius:9999px;font-weight:600;">🇷🇺 Ρωσικά</span>
                <span style="display:inline-block;padding:4px 12px;margin:2px;background:#fff;border:1px solid #bfdbfe;border-radius:9999px;font-weight:600;">🇷🇴 Ρουμανικά</span>
                <span style="display:inline-block;padding:4px 12px;margin:2px;background:#fff;border:1px solid #bfdbfe;border-radius:9999px;font-weight:600;">🇷🇸 Σερβικά</span>
              </div>
            </td></tr>
          </table>
        </td></tr>

        <!-- Section: QR -->
        <tr><td style="padding:28px 28px 0;">
          <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6d28d9;margin-bottom:8px;">📱 Νέο · QR Code για επισκέπτες</div>
          <div style="font-size:18px;font-weight:700;color:#111827;margin-bottom:8px;">Φτιάξαμε QR Code για το κατάλυμά σας</div>
          <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#4b5563;">
            Εκτυπώστε το και τοποθετήστε το στον χώρο σας — στην είσοδο, στην κουζίνα, σε welcome card. Όταν ο επισκέπτης σκανάρει, ανοίγει αυτόματα η σελίδα οδηγού της περιοχής σας: τι να φάει, πού να πάει, τι να επισκεφτεί.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#7c3aed,#a855f7);border-radius:12px;">
            <tr><td style="padding:18px 20px;">
              <div style="color:#fff;font-size:14px;line-height:1.6;">
                <div style="font-weight:700;margin-bottom:10px;">✨ Μηδέν προσπάθεια για εσάς. Εκπληκτική εμπειρία για τον επισκέπτη.</div>
                <div style="font-size:13px;opacity:0.95;line-height:1.7;">
                  • Δωρεάν εκτύπωση<br>
                  • Οδηγός περιοχής σε 7 γλώσσες<br>
                  • Τοπικές προτάσεις (παραλίες, εστιατόρια, δραστηριότητες)
                </div>
              </div>
              <div style="margin-top:14px;text-align:center;">
                <a href="${qrUrl}" style="display:inline-block;background:#fff;color:#7c3aed;text-decoration:none;padding:11px 22px;border-radius:8px;font-size:14px;font-weight:700;">Πάρε το QR Code του καταλύματος →</a>
              </div>
            </td></tr>
          </table>
        </td></tr>

        <!-- Section: Platform benefits -->
        <tr><td style="padding:28px 28px 0;">
          <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6b7280;margin-bottom:14px;">✨ Όλα όσα έχετε ως ιδιοκτήτης</div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <!-- 0% commission -->
            <tr><td style="padding:0 0 10px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                <tr>
                  <td valign="top" style="padding:14px 8px 14px 16px;width:38px;font-size:22px;">💸</td>
                  <td style="padding:14px 16px 14px 0;">
                    <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:2px;">0% προμήθεια στις κρατήσεις</div>
                    <div style="font-size:13px;line-height:1.5;color:#4b5563;">Οι επισκέπτες επικοινωνούν απευθείας μαζί σας — δεν παίρνουμε προμήθεια από καμία κράτηση.</div>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Availability requests -->
            <tr><td style="padding:0 0 10px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                <tr>
                  <td valign="top" style="padding:14px 8px 14px 16px;width:38px;font-size:22px;">📡</td>
                  <td style="padding:14px 16px 14px 0;">
                    <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:2px;">Άμεσες ειδοποιήσεις από επισκέπτες που ψάχνουν</div>
                    <div style="font-size:13px;line-height:1.5;color:#4b5563;">Ο επισκέπτης κάνει 1 αίτημα διαθεσιμότητας στην πλατφόρμα. Σας ειδοποιούμε αυτόματα. Απαντάτε με 1 click αν είστε διαθέσιμοι.</div>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Calendar -->
            <tr><td style="padding:0 0 10px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                <tr>
                  <td valign="top" style="padding:14px 8px 14px 16px;width:38px;font-size:22px;">📅</td>
                  <td style="padding:14px 16px 14px 0;">
                    <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:2px;">Ημερολόγιο διαθεσιμότητας</div>
                    <div style="font-size:13px;line-height:1.5;color:#4b5563;">Δείξτε στους επισκέπτες ποιες ημερομηνίες είναι ελεύθερες ή κλεισμένες. Επικαιροποίηση με 1 click.</div>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Brand site -->
            <tr><td style="padding:0 0 10px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                <tr>
                  <td valign="top" style="padding:14px 8px 14px 16px;width:38px;font-size:22px;">🎨</td>
                  <td style="padding:14px 16px 14px 0;">
                    <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:2px;">Brand site για το κατάλυμα</div>
                    <div style="font-size:13px;line-height:1.5;color:#4b5563;">Φτιάξτε δωρεάν σελίδα-website για το κατάλυμά σας με χρώματα, λογότυπο και τη δική σας προβολή.</div>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Social Kit -->
            <tr><td style="padding:0 0 10px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                <tr>
                  <td valign="top" style="padding:14px 8px 14px 16px;width:38px;font-size:22px;">📸</td>
                  <td style="padding:14px 16px 14px 0;">
                    <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:2px;">Έτοιμα γραφιστικά για Instagram/Facebook/TikTok</div>
                    <div style="font-size:13px;line-height:1.5;color:#4b5563;">Δωρεάν, έτοιμες εικόνες για post — φτιαγμένες αυτόματα με τα στοιχεία του καταλύματός σας.</div>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- SEO -->
            <tr><td style="padding:0 0 10px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                <tr>
                  <td valign="top" style="padding:14px 8px 14px 16px;width:38px;font-size:22px;">🔍</td>
                  <td style="padding:14px 16px 14px 0;">
                    <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:2px;">SEO βελτιστοποιημένο για Google</div>
                    <div style="font-size:13px;line-height:1.5;color:#4b5563;">Schema markup, hreflang, sitemap, μεταδεδομένα — όλα δομημένα ώστε το Google να βρει και να προτείνει το κατάλυμά σας.</div>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Analytics (last, beta) -->
            <tr><td style="padding:0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                <tr>
                  <td valign="top" style="padding:14px 8px 14px 16px;width:38px;font-size:22px;">📈</td>
                  <td style="padding:14px 16px 14px 0;">
                    <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:2px;">Analytics <span style="background:#dbeafe;color:#1e40af;font-size:10px;padding:1px 6px;border-radius:4px;font-weight:700;letter-spacing:0.5px;margin-left:4px;">BETA</span></div>
                    <div style="font-size:13px;line-height:1.5;color:#4b5563;">Δείτε πόσοι είδαν το κατάλυμά σας, από ποιες χώρες προέρχονται και ποιες σελίδες σας επισκέφτηκαν.</div>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Final CTAs -->
        <tr><td style="padding:28px 28px 0;" align="center">
          <a href="${publicUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:11px 18px;border-radius:8px;font-size:13px;font-weight:600;margin:0 4px 8px;">👁️ Live listing</a>
          <a href="${qrUrl}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:11px 18px;border-radius:8px;font-size:13px;font-weight:600;margin:0 4px 8px;">📱 QR Code</a>
          <a href="${editUrl}" style="display:inline-block;background:#0284c7;color:#fff;text-decoration:none;padding:11px 18px;border-radius:8px;font-size:13px;font-weight:600;margin:0 4px 8px;">✏️ Επεξεργασία</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 28px 28px;border-top:1px solid #f3f4f6;margin-top:20px;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;text-align:center;">
            Αν έχετε απορίες ή θέλετε βοήθεια, απαντήστε σε αυτό το email.<br>
            <strong style="color:#6b7280;">ChalkidikiHub</strong> · <a href="${dashboardUrl}" style="color:#0284c7;text-decoration:none;">Dashboard</a> · <a href="https://chalkidikihub.gr" style="color:#0284c7;text-decoration:none;">chalkidikihub.gr</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`,
    }).catch((e) => { console.error('published notify failed', e); });

    await supabase.from('activity_logs').insert({
      type: 'user_action',
      severity: 'info',
      message: `Listing published — owner notified: ${listing.title_el}`,
      details: { listing_id: listing.id, slug: listing.slug, owner_id: listing.owner_id, owner_email: ownerEmail },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
