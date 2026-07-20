import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminClient } from '@/lib/api-helpers';

const ADMIN_EMAIL = 'mnc@hotmail.gr';

function escapeHtml(str: string): string {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function POST(request: NextRequest) {
  try {
    const { listing_id } = await request.json();
    if (!listing_id) {
      return NextResponse.json({ error: 'Missing listing_id' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: listing } = await supabase
      .from('listings')
      .select('id, slug, title_el, area, location_name, price_per_night, guests_max, bedrooms, bathrooms, contact_phone, contact_email, website_url, booking_url, airbnb_url, description_el, owner_id, created_at, status')
      .eq('id', listing_id)
      .single();

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    let ownerEmail: string | null = null;
    let ownerName: string | null = null;
    let ownerPhone: string | null = null;
    if (listing.owner_id) {
      const { data: owner } = await supabase
        .from('profiles')
        .select('email, full_name, phone, email_verified_at')
        .eq('id', listing.owner_id)
        .single();
      if (owner) {
        // Owner hasn't verified their email yet — hold the notification.
        // verify-code re-fires notify-new for pending listings once verified.
        if (!owner.email_verified_at) {
          return NextResponse.json({ skipped: 'owner_unverified' });
        }
        ownerEmail = owner.email || null;
        ownerName = owner.full_name || null;
        ownerPhone = owner.phone || null;
      }
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
    const desc = escapeHtml((listing.description_el || '').slice(0, 800));
    const cPhone = escapeHtml(listing.contact_phone || '');
    const cEmail = escapeHtml(listing.contact_email || '');
    const website = escapeHtml(listing.website_url || '');
    const bookingUrl = escapeHtml(listing.booking_url || '');
    const airbnbUrl = escapeHtml(listing.airbnb_url || '');
    const ownerNameEsc = escapeHtml(ownerName || '');
    const ownerEmailEsc = escapeHtml(ownerEmail || '');
    const ownerPhoneEsc = escapeHtml(ownerPhone || '');
    const adminEditUrl = `https://chalkidikihub.gr/el/admin/listings/${listing.id}/edit`;
    const publicPreviewUrl = `https://chalkidikihub.gr/el/listings/${listing.slug}`;

    // 1) Admin email -> mnc@hotmail.gr
    await transporter.sendMail({
      from: `ChalkidikiHub <${gmailAddress}>`,
      to: ADMIN_EMAIL,
      replyTo: ownerEmail || gmailAddress,
      subject: `🆕 Νέο listing προς έγκριση — ${listing.title_el}`,
      html: `
<!DOCTYPE html>
<html lang="el"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
        <tr><td style="background:linear-gradient(135deg,#b45309,#d97706);padding:22px 28px;color:#fff;">
          <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;font-weight:600;">ChalkidikiHub · Admin</div>
          <div style="font-size:22px;font-weight:700;margin-top:4px;">🆕 Νέο listing προς έγκριση</div>
        </td></tr>

        <tr><td style="padding:20px 28px 0;">
          <div style="background:#fffbeb;border-left:4px solid #d97706;border-radius:6px;padding:12px 14px;font-size:13px;line-height:1.5;color:#78350f;">
            Ένας χρήστης μόλις καταχώρησε νέο κατάλυμα. Είναι σε κατάσταση <strong>pending</strong> και δεν εμφανίζεται δημόσια μέχρι να το εγκρίνεις.
          </div>
        </td></tr>

        <tr><td style="padding:20px 28px 0;">
          <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#6b7280;margin-bottom:10px;">🏠 Κατάλυμα</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;font-size:14px;">
            <tr><td style="padding:12px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                <tr><td style="padding:4px 0;color:#6b7280;width:140px;">Τίτλος</td><td style="padding:4px 0;color:#111827;font-weight:600;">${title}</td></tr>
                <tr><td style="padding:4px 0;color:#6b7280;">Περιοχή</td><td style="padding:4px 0;color:#111827;">${area} — ${loc}</td></tr>
                <tr><td style="padding:4px 0;color:#6b7280;">Τιμή/βράδυ</td><td style="padding:4px 0;color:#111827;">€${listing.price_per_night}</td></tr>
                <tr><td style="padding:4px 0;color:#6b7280;">Χωρητικότητα</td><td style="padding:4px 0;color:#111827;">${listing.guests_max} άτομα · ${listing.bedrooms} bed / ${listing.bathrooms} bath</td></tr>
                ${cPhone ? `<tr><td style="padding:4px 0;color:#6b7280;">Τηλ. listing</td><td style="padding:4px 0;"><a href="tel:${cPhone}" style="color:#0369a1;text-decoration:none;font-weight:600;">${cPhone}</a></td></tr>` : ''}
                ${cEmail ? `<tr><td style="padding:4px 0;color:#6b7280;">Email listing</td><td style="padding:4px 0;"><a href="mailto:${cEmail}" style="color:#0369a1;text-decoration:none;font-weight:600;">${cEmail}</a></td></tr>` : ''}
                ${website ? `<tr><td style="padding:4px 0;color:#6b7280;">Website</td><td style="padding:4px 0;"><a href="${website}" style="color:#0369a1;">${website}</a></td></tr>` : ''}
                ${bookingUrl ? `<tr><td style="padding:4px 0;color:#6b7280;">Booking.com</td><td style="padding:4px 0;"><a href="${bookingUrl}" style="color:#0369a1;">link</a></td></tr>` : ''}
                ${airbnbUrl ? `<tr><td style="padding:4px 0;color:#6b7280;">Airbnb</td><td style="padding:4px 0;"><a href="${airbnbUrl}" style="color:#0369a1;">link</a></td></tr>` : ''}
              </table>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:14px 28px 0;">
          <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#15803d;margin-bottom:10px;">👤 Στοιχεία χρήστη που το καταχώρησε</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;font-size:14px;">
            <tr><td style="padding:12px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                <tr><td style="padding:4px 0;color:#6b7280;width:140px;">Όνομα</td><td style="padding:4px 0;color:#111827;font-weight:600;">${ownerNameEsc || '(δεν δηλώθηκε)'}</td></tr>
                <tr><td style="padding:4px 0;color:#6b7280;">Email</td><td style="padding:4px 0;">${ownerEmailEsc ? `<a href="mailto:${ownerEmailEsc}" style="color:#0369a1;text-decoration:none;font-weight:600;">${ownerEmailEsc}</a>` : '-'}</td></tr>
                <tr><td style="padding:4px 0;color:#6b7280;">Τηλέφωνο</td><td style="padding:4px 0;">${ownerPhoneEsc ? `<a href="tel:${ownerPhoneEsc}" style="color:#0369a1;text-decoration:none;font-weight:600;">${ownerPhoneEsc}</a>` : '-'}</td></tr>
                <tr><td style="padding:4px 0;color:#6b7280;">User ID</td><td style="padding:4px 0;font-family:monospace;font-size:12px;color:#6b7280;">${escapeHtml(listing.owner_id || '')}</td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        ${desc ? `<tr><td style="padding:14px 28px 0;">
          <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#6b7280;margin-bottom:8px;">📝 Περιγραφή</div>
          <div style="background:#fff;border:1px solid #e5e7eb;border-left:4px solid #0284c7;border-radius:6px;padding:12px 14px;font-size:13px;line-height:1.6;color:#374151;white-space:pre-wrap;">${desc}${listing.description_el && listing.description_el.length > 800 ? '…' : ''}</div>
        </td></tr>` : ''}

        <tr><td style="padding:24px 28px 8px;" align="center">
          <a href="${adminEditUrl}" style="display:inline-block;background:#d97706;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:600;margin:0 4px 8px;">✏️ Επεξεργασία / Έγκριση</a>
          <a href="${publicPreviewUrl}" style="display:inline-block;background:#0284c7;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:600;margin:0 4px 8px;">👁️ Preview</a>
        </td></tr>

        <tr><td style="padding:20px 28px 26px;border-top:1px solid #f3f4f6;">
          <p style="margin:0;font-size:12px;line-height:1.5;color:#9ca3af;text-align:center;">
            Αυτοματοποιημένη ειδοποίηση από <strong style="color:#6b7280;">ChalkidikiHub</strong> · ${new Date(listing.created_at).toLocaleString('el-GR')}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
    }).catch((e) => { console.error('admin notify failed', e); });

    // 2) Owner confirmation email
    if (ownerEmail) {
      await transporter.sendMail({
        from: `ChalkidikiHub <${gmailAddress}>`,
        to: ownerEmail,
        replyTo: ADMIN_EMAIL,
        subject: `✅ Λάβαμε την καταχώρηση του καταλύματός σας — ${listing.title_el}`,
        html: `
<!DOCTYPE html>
<html lang="el"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
        <tr><td style="background:linear-gradient(135deg,#0369a1,#0284c7);padding:22px 28px;color:#fff;">
          <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;font-weight:600;">ChalkidikiHub</div>
          <div style="font-size:22px;font-weight:700;margin-top:4px;">✅ Λάβαμε την καταχώρησή σας</div>
        </td></tr>

        <tr><td style="padding:24px 28px 4px;">
          <p style="margin:0 0 10px;font-size:15px;color:#374151;">${ownerNameEsc ? `Γεια σας, ${ownerNameEsc}.` : 'Γεια σας,'}</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
            Σας ευχαριστούμε που καταχωρήσατε το κατάλυμά σας <strong>«${title}»</strong> στο ChalkidikiHub.
          </p>
        </td></tr>

        <tr><td style="padding:18px 28px 0;">
          <div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:8px;padding:14px 16px;font-size:14px;line-height:1.6;color:#1e3a8a;">
            ⏳ <strong>Η καταχώρηση είναι υπό έλεγχο</strong><br>
            Η ομάδα του ChalkidikiHub θα ελέγξει τα στοιχεία και <strong>θα δημοσιεύσει αυτόματα</strong> το κατάλυμά σας μόλις ολοκληρωθεί ο έλεγχος. Συνήθως αυτό γίνεται εντός λίγων ωρών.
          </div>
        </td></tr>

        <tr><td style="padding:20px 28px 0;">
          <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#6b7280;margin-bottom:10px;">Στοιχεία καταχώρησης</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;font-size:14px;">
            <tr><td style="padding:12px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                <tr><td style="padding:4px 0;color:#6b7280;width:130px;">Τίτλος</td><td style="padding:4px 0;color:#111827;font-weight:600;">${title}</td></tr>
                <tr><td style="padding:4px 0;color:#6b7280;">Περιοχή</td><td style="padding:4px 0;color:#111827;">${area} — ${loc}</td></tr>
                <tr><td style="padding:4px 0;color:#6b7280;">Τιμή/βράδυ</td><td style="padding:4px 0;color:#111827;">€${listing.price_per_night}</td></tr>
                <tr><td style="padding:4px 0;color:#6b7280;">Κατάσταση</td><td style="padding:4px 0;"><span style="background:#fef3c7;color:#92400e;padding:2px 10px;border-radius:9999px;font-size:12px;font-weight:600;">Σε έλεγχο</span></td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:20px 28px 0;">
          <p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">
            Θα λάβετε νέο email μόλις το κατάλυμα δημοσιευτεί. Μπορείτε επίσης να δείτε / επεξεργαστείτε την καταχώρηση οποιαδήποτε στιγμή από το dashboard σας.
          </p>
        </td></tr>

        <tr><td style="padding:22px 28px 8px;" align="center">
          <a href="https://chalkidikihub.gr/el/dashboard/listings" style="display:inline-block;background:#0284c7;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:600;">📋 Προβολή Dashboard</a>
        </td></tr>

        <tr><td style="padding:20px 28px 26px;border-top:1px solid #f3f4f6;">
          <p style="margin:0;font-size:12px;line-height:1.5;color:#9ca3af;text-align:center;">
            Αν έχετε απορίες, απαντήστε σε αυτό το email.<br>
            <strong style="color:#6b7280;">ChalkidikiHub</strong> · <a href="https://chalkidikihub.gr" style="color:#0284c7;text-decoration:none;">chalkidikihub.gr</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
      }).catch((e) => { console.error('owner notify failed', e); });
    }

    await supabase.from('activity_logs').insert({
      type: 'user_action',
      severity: 'info',
      message: `New listing submitted for review: ${listing.title_el}`,
      details: { listing_id: listing.id, slug: listing.slug, owner_id: listing.owner_id, owner_email: ownerEmail },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
