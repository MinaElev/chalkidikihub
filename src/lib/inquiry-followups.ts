import 'server-only';
import { adminDb } from '@/lib/supabase/clients';
import { emailLayout, escapeHtml, sendMail } from '@/lib/email/mailer';
import { listingTitle } from '@/lib/content/listing-title';
import { isLocale, type Locale } from '@/i18n/config';
import { SITE_URL, areaStays, callButtonsHtml, replyButtonsHtml, similarFreeStays } from '@/lib/inquiry';
import { areaInviteLink } from '@/lib/area-invite';
import { mailGuestFollowup } from '@/lib/emails/inquiry-reply';

const HOUR = 3_600_000;
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());
const fmt = new Intl.DateTimeFormat('el-GR', { day: 'numeric', month: 'long', timeZone: 'UTC' });

/**
 * Follow-ups for listing requests still unanswered (reply_status null) whose
 * arrival is still ahead:
 *  A. after 24 h, one reminder to the owner with the same one-click buttons;
 *  B. after 48 h, one email to the guest with other stays free on their dates
 *     (skipped, but marked, when there are none).
 * Each goes out at most once per request (owner_reminded_at / guest_followed_at).
 * Requests older than 7 days are left alone.
 */
export async function runInquiryFollowups(): Promise<{ reminded: number; followed: number; error?: string }> {
  const db = adminDb();
  const now = Date.now();
  const { data: open, error } = await db
    .from('listing_inquiries')
    .select('id, listing_id, owner_id, guest_name, guest_email, guest_phone, check_in, check_out, guests, message, locale, reply_token, created_at, owner_reminded_at, guest_followed_at')
    .is('reply_status', null)
    .gte('created_at', new Date(now - 7 * 24 * HOUR).toISOString())
    .lte('created_at', new Date(now - 24 * HOUR).toISOString())
    .or(`check_in.is.null,check_in.gt.${today()}`)
    .limit(200);
  // Columns missing until scripts/sql/2026-11-inquiry-followups.sql has run: do nothing.
  if (error) return { reminded: 0, followed: 0, error: error.message };

  let reminded = 0;
  let followed = 0;
  for (const r of open ?? []) {
    const age = now - Date.parse(r.created_at);
    const { data: listing } = await db.from('listings').select('*').eq('id', r.listing_id).maybeSingle();
    if (!listing || listing.status !== 'published') continue;

    // A. Owner reminder.
    if (!r.owner_reminded_at) {
      const { data: owner } = r.owner_id ? await db.from('profiles').select('email, full_name').eq('id', r.owner_id).maybeSingle() : { data: null };
      const to = owner?.email || listing.contact_email;
      // Mark first, so a slow or failing mail server never sends it twice.
      await db.from('listing_inquiries').update({ owner_reminded_at: new Date().toISOString() }).eq('id', r.id);
      if (to) {
        const title = listing.title_el || listing.slug;
        const dates = r.check_in && r.check_out ? `${fmt.format(new Date(r.check_in))} – ${fmt.format(new Date(r.check_out))}` : '';
        const ok = await sendMail({
          to,
          replyTo: r.guest_email,
          subject: `Υπενθύμιση: ο επισκέπτης περιμένει απάντηση — ${title}`,
          html: emailLayout(
            'Ο επισκέπτης περιμένει απάντηση',
            `<p>${owner?.full_name ? `Γεια σας, ${escapeHtml(owner.full_name)}.` : 'Γεια σας,'}</p>
             <p>Χθες ο/η <strong>${escapeHtml(r.guest_name)}</strong> ρώτησε για διαθεσιμότητα στο <strong>${escapeHtml(title)}</strong>${dates ? ` για ${escapeHtml(dates)}` : ''}${r.guests ? `, ${r.guests} άτομα` : ''}. Δεν έχουμε δει ακόμα απάντηση.</p>
             <p>Οι επισκέπτες κλείνουν συνήθως με όποιον απαντήσει πρώτος. Ένα κλικ αρκεί:</p>
             ${replyButtonsHtml(r.reply_token)}
             <p style="margin-top:16px"><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr'}/inquiry-reply/${r.reply_token}?a=direct" style="color:#64748b;font-size:13px">Έχω ήδη απαντήσει απευθείας στον επισκέπτη</a></p>
             ${callButtonsHtml(r.guest_phone)}
             <p style="color:#64748b;font-size:13px">Μπορείτε επίσης να απαντήσετε απευθείας σε αυτό το email: θα πάει στον επισκέπτη.</p>`,
          ),
        });
        if (ok) reminded++;
      }
    }

    // B. Guest follow-up with other free stays.
    if (!r.guest_followed_at && age >= 48 * HOUR && r.check_in && r.check_out) {
      await db.from('listing_inquiries').update({ guest_followed_at: new Date().toISOString() }).eq('id', r.id);
      // Leave out every stay this guest already asked for these dates.
      const { data: asked } = await db
        .from('listing_inquiries')
        .select('listing_id')
        .eq('guest_email', r.guest_email)
        .eq('check_in', r.check_in)
        .eq('check_out', r.check_out);
      const locale = (isLocale(r.locale) ? r.locale : 'en') as Locale;
      const stays = await similarFreeStays(
        r.listing_id,
        { name: r.guest_name, email: r.guest_email, phone: r.guest_phone ?? '', message: '', checkIn: r.check_in, checkOut: r.check_out, guests: r.guests ?? 1, locale },
        (asked ?? []).map((a) => a.listing_id as string),
      ).catch(() => []);
      const exclude = (asked ?? []).map((a) => a.listing_id as string);
      const invite = await areaInviteLink(r.id, SITE_URL, locale).catch(() => null);
      const others = stays.length ? [] : await areaStays(r.listing_id, r.guests ?? 1, locale, exclude).catch(() => []);
      if (stays.length || invite) {
        const ok = await mailGuestFollowup({
          others,
          invite,
          guestEmail: r.guest_email,
          guestName: r.guest_name,
          locale,
          listingName: listingTitle(listing, locale),
          checkIn: r.check_in,
          checkOut: r.check_out,
          stays,
        });
        if (ok) followed++;
      }
    }
  }
  return { reminded, followed };
}
