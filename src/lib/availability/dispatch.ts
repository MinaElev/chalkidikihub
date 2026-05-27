/**
 * Availability broadcast dispatch
 * -----------------------------------------------------------------------
 * Matches a request to candidate owners and sends the broadcast email via
 * Gmail/nodemailer. Called inline from the POST handler — 8 emails × ~300ms
 * fits in a Vercel serverless invocation, no cron needed.
 *
 * Hard Gmail-friendly caps:
 *   - MAX_RECIPIENTS_PER_REQUEST = 8
 *   - MAX_REQUESTS_PER_DAY       = 30 (~240 broadcast emails/day)
 *   - 300ms delay between sends
 *   - Per-owner weekly cap honoured via owner_broadcast_settings.max_per_week
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export const MAX_RECIPIENTS_PER_REQUEST = 8;
export const MAX_REQUESTS_PER_DAY = 30;
export const SEND_DELAY_MS = 300;
const DEFAULT_MAX_PER_WEEK = 10;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export interface AvailabilityRequestRow {
  id: string;
  public_token: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  area: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  budget_min: number | null;
  budget_max: number | null;
  property_type: string | null;
  notes: string | null;
  locale: string;
}

interface CandidateOwner {
  owner_id: string;
  email: string;
  listing_count: number;
  last_broadcast_at: string | null;
}

export async function loadGmailCreds(
  supabase: SupabaseClient,
): Promise<{ user: string; pass: string } | null> {
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['gmail_address', 'gmail_app_password']);
  const map: Record<string, string> = {};
  settings?.forEach((s: { key: string; value: string }) => {
    map[s.key] = s.value;
  });
  const user = map.gmail_address || process.env.GMAIL_ADDRESS || '';
  const pass = map.gmail_app_password || process.env.GMAIL_APP_PASSWORD || '';
  if (!user || !pass) return null;
  return { user, pass };
}

// Find owners eligible to receive this broadcast. Filters:
//   - listings.area == request.area, status == 'published'
//   - listing.guests_max >= adults + children
//   - (if property_type given) listing.property_type matches (when column exists)
//   - owner not opted out
//   - owner.areas (if set) includes request.area
//   - owner weekly cap not exceeded
//   - de-duplicated by owner_id
// Ranks by least-recently-broadcasted (round-robin fairness).
export async function findCandidateOwners(
  supabase: SupabaseClient,
  req: AvailabilityRequestRow,
): Promise<CandidateOwner[]> {
  const totalGuests = (req.adults || 0) + (req.children || 0);

  // 1. Listings matching area + capacity
  const { data: listings } = await supabase
    .from('listings')
    .select('owner_id, guests_max')
    .eq('area', req.area)
    .eq('status', 'published')
    .gte('guests_max', totalGuests);

  if (!listings || listings.length === 0) return [];

  // De-duplicate by owner_id (some owners have multiple listings)
  const ownerToCount = new Map<string, number>();
  for (const l of listings) {
    ownerToCount.set(l.owner_id, (ownerToCount.get(l.owner_id) || 0) + 1);
  }
  const ownerIds = Array.from(ownerToCount.keys());
  if (ownerIds.length === 0) return [];

  // 2. Load owner settings
  const settingsRes = await supabase
    .from('owner_broadcast_settings')
    .select('owner_id, opted_out, max_per_week, areas')
    .in('owner_id', ownerIds);

  // We also need actual auth emails — profiles table doesn't hold them on
  // every project. Fall back to auth.admin.listUsers via service role.
  const emailMap = new Map<string, string>();
  // Try the auth admin API (works under service role)
  try {
    // Page through enough users to cover ownerIds. Most projects have <1000.
    const { data: usersData } = await (supabase.auth as unknown as {
      admin: {
        listUsers: (opts?: { page?: number; perPage?: number }) => Promise<{
          data: { users: Array<{ id: string; email?: string }> };
        }>;
      };
    }).admin.listUsers({ page: 1, perPage: 1000 });
    for (const u of usersData?.users || []) {
      if (u.email && ownerIds.includes(u.id)) emailMap.set(u.id, u.email);
    }
  } catch {
    // ignore — owners without resolvable emails get skipped below
  }

  const settingsMap = new Map<string, { opted_out: boolean; max_per_week: number; areas: string[] | null }>();
  for (const s of settingsRes.data || []) {
    settingsMap.set(s.owner_id, {
      opted_out: !!s.opted_out,
      max_per_week: s.max_per_week ?? DEFAULT_MAX_PER_WEEK,
      areas: s.areas,
    });
  }

  // 3. Weekly-cap check + last-broadcast lookup
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const { data: recentRecipients } = await supabase
    .from('availability_request_recipients')
    .select('owner_id, sent_at')
    .in('owner_id', ownerIds)
    .gte('sent_at', weekAgo);

  const weekCount = new Map<string, number>();
  const lastBroadcast = new Map<string, string>();
  for (const r of recentRecipients || []) {
    weekCount.set(r.owner_id, (weekCount.get(r.owner_id) || 0) + 1);
    const prev = lastBroadcast.get(r.owner_id);
    if (!prev || r.sent_at > prev) lastBroadcast.set(r.owner_id, r.sent_at);
  }

  // 4. Filter + rank
  const candidates: CandidateOwner[] = [];
  for (const ownerId of ownerIds) {
    const email = emailMap.get(ownerId);
    if (!email) continue;
    const settings = settingsMap.get(ownerId);
    if (settings?.opted_out) continue;
    if (settings?.areas && !settings.areas.includes(req.area)) continue;
    const cap = settings?.max_per_week ?? DEFAULT_MAX_PER_WEEK;
    if ((weekCount.get(ownerId) || 0) >= cap) continue;
    candidates.push({
      owner_id: ownerId,
      email,
      listing_count: ownerToCount.get(ownerId) || 0,
      last_broadcast_at: lastBroadcast.get(ownerId) || null,
    });
  }

  // Round-robin: oldest broadcast first (nulls = never contacted = first)
  candidates.sort((a, b) => {
    if (a.last_broadcast_at === b.last_broadcast_at) return 0;
    if (a.last_broadcast_at === null) return -1;
    if (b.last_broadcast_at === null) return 1;
    return a.last_broadcast_at.localeCompare(b.last_broadcast_at);
  });

  return candidates.slice(0, MAX_RECIPIENTS_PER_REQUEST);
}

const AREA_LABELS: Record<string, string> = {
  kassandra: 'Κασσάνδρα',
  sithonia: 'Σιθωνία',
  athos: 'Άθως',
  mainland: 'Ενδοχώρα Χαλκιδικής',
};

function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.max(
    1,
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000),
  );
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function buildOwnerEmailHtml(
  req: AvailabilityRequestRow,
  responseUrl: string,
  unsubscribeUrl: string,
): string {
  const area = AREA_LABELS[req.area] || req.area;
  const nights = nightsBetween(req.check_in, req.check_out);
  const total = (req.adults || 0) + (req.children || 0);
  const budget =
    req.budget_min && req.budget_max
      ? `${req.budget_min}€ – ${req.budget_max}€ / βράδυ`
      : req.budget_min
        ? `από ${req.budget_min}€ / βράδυ`
        : req.budget_max
          ? `έως ${req.budget_max}€ / βράδυ`
          : '—';

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:24px;">
  <div style="background:#fff;border-radius:16px;padding:28px 24px;border:1px solid #e5e7eb;color:#111827;font-size:15px;line-height:1.6;">
    <div style="font-size:13px;color:#0284c7;font-weight:600;margin-bottom:6px;">CHALKIDIKIHUB · ΑΙΤΗΜΑ ΔΙΑΘΕΣΙΜΟΤΗΤΑΣ</div>
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#0f172a;">Νέο αίτημα για ${escapeHtml(area)}</h1>

    <table style="width:100%;border-collapse:collapse;font-size:14px;margin:18px 0;">
      <tr><td style="padding:6px 0;color:#6b7280;width:130px;">Ημερομηνίες</td><td style="padding:6px 0;color:#111827;font-weight:600;">${fmtDate(req.check_in)} → ${fmtDate(req.check_out)} (${nights} βράδια)</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Άτομα</td><td style="padding:6px 0;color:#111827;font-weight:600;">${req.adults} ενήλικες${req.children ? ` + ${req.children} παιδιά` : ''} (σύνολο ${total})</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Budget</td><td style="padding:6px 0;color:#111827;font-weight:600;">${escapeHtml(budget)}</td></tr>
      ${req.property_type ? `<tr><td style="padding:6px 0;color:#6b7280;">Τύπος</td><td style="padding:6px 0;color:#111827;font-weight:600;">${escapeHtml(req.property_type)}</td></tr>` : ''}
      <tr><td style="padding:6px 0;color:#6b7280;">Επισκέπτης</td><td style="padding:6px 0;color:#111827;font-weight:600;">${escapeHtml(req.guest_name)}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Τηλέφωνο</td><td style="padding:6px 0;color:#111827;font-weight:600;">${escapeHtml(req.guest_phone)}</td></tr>
    </table>

    ${req.notes ? `<div style="background:#f9fafb;border-radius:10px;padding:14px;margin:14px 0;font-size:14px;color:#374151;"><strong style="color:#111827;">Σημειώσεις:</strong><br/>${escapeHtml(req.notes)}</div>` : ''}

    <div style="margin:24px 0 6px;text-align:center;">
      <a href="${responseUrl}?a=available" style="display:inline-block;background:#10b981;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600;margin:4px;">✓ Διαθέσιμο</a>
      <a href="${responseUrl}?a=unavailable" style="display:inline-block;background:#f3f4f6;color:#374151;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600;margin:4px;">✗ Δεν είμαι διαθέσιμος</a>
    </div>
    <div style="text-align:center;margin-bottom:8px;">
      <a href="${responseUrl}" style="color:#0284c7;font-size:13px;text-decoration:underline;">Δες λεπτομέρειες & στείλε τιμή/μήνυμα →</a>
    </div>

    <div style="margin-top:28px;padding:16px;background:#f9fafb;border-radius:12px;border:1px solid #f3f4f6;font-size:13px;color:#374151;line-height:1.6;">
      <strong style="display:block;color:#0f172a;margin-bottom:6px;">💡 Νέα δυνατότητα του ChalkidikiHub</strong>
      Οι επισκέπτες κάνουν αιτήματα για εύρεση διαμονής στη Χαλκιδική και η πλατφόρμα ειδοποιεί αυτόματα τους ιδιοκτήτες με ταιριαστά καταλύματα. <strong>Αν μπορείς να εξυπηρετήσεις τον επισκέπτη, επικοινώνησε απευθείας μαζί του</strong> στο τηλέφωνο που αναγράφεται παραπάνω.
    </div>
    <div style="margin-top:14px;padding:14px 16px;background:#fef3c7;border-radius:12px;border:1px solid #fde68a;font-size:13px;color:#78350f;line-height:1.6;">
      <strong style="color:#92400e;">Δεν θες να λαμβάνεις τέτοια emails;</strong><br/>
      Μπορείς να τα απενεργοποιήσεις από το <a href="${unsubscribeUrl}" style="color:#92400e;font-weight:600;text-decoration:underline;">Dashboard → Αιτήματα διαθεσιμότητας</a> και να ορίσεις τα πόδια που σε ενδιαφέρουν ή να βγεις τελείως με ένα κλικ.
    </div>
    <div style="margin-top:18px;padding-top:14px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;line-height:1.5;text-align:center;">
      Λαμβάνεις αυτό το email γιατί έχεις δημοσιευμένα καταλύματα στη ${escapeHtml(area)} στο ChalkidikiHub.<br/>
      <a href="${unsubscribeUrl}" style="color:#9ca3af;">Διαχείριση ειδοποιήσεων / Unsubscribe</a> · ChalkidikiHub
    </div>
  </div>
</div></body></html>`;
}

export function buildOwnerEmailText(
  req: AvailabilityRequestRow,
  responseUrl: string,
  unsubscribeUrl: string,
): string {
  const area = AREA_LABELS[req.area] || req.area;
  const nights = nightsBetween(req.check_in, req.check_out);
  return [
    `ChalkidikiHub — Νέο αίτημα διαθεσιμότητας για ${area}`,
    ``,
    `Ημερομηνίες: ${fmtDate(req.check_in)} → ${fmtDate(req.check_out)} (${nights} βράδια)`,
    `Άτομα: ${req.adults} ενήλικες${req.children ? ` + ${req.children} παιδιά` : ''}`,
    req.budget_min || req.budget_max
      ? `Budget: ${req.budget_min || '?'}€ – ${req.budget_max || '?'}€ / βράδυ`
      : '',
    req.property_type ? `Τύπος: ${req.property_type}` : '',
    `Επισκέπτης: ${req.guest_name}`,
    `Τηλέφωνο: ${req.guest_phone}`,
    req.notes ? `\nΣημειώσεις:\n${req.notes}` : '',
    ``,
    `Διαθέσιμο: ${responseUrl}?a=available`,
    `Δεν είμαι διαθέσιμος: ${responseUrl}?a=unavailable`,
    `Λεπτομέρειες & τιμή: ${responseUrl}`,
    ``,
    `--`,
    `Νέα δυνατότητα του ChalkidikiHub: οι επισκέπτες κάνουν αιτήματα για εύρεση διαμονής και η πλατφόρμα ειδοποιεί τους ιδιοκτήτες με ταιριαστά καταλύματα. Αν μπορείς να εξυπηρετήσεις, επικοινώνησε απευθείας με τον επισκέπτη στο τηλέφωνο παραπάνω.`,
    ``,
    `Απενεργοποίηση/ρύθμιση: από το Dashboard → Αιτήματα διαθεσιμότητας μπορείς να σταματήσεις τέτοια emails ή να ορίσεις πόδια που σε ενδιαφέρουν.`,
    `Link: ${unsubscribeUrl}`,
  ]
    .filter(Boolean)
    .join('\n');
}

// Dispatch the broadcast: insert recipient rows + send Gmail in sequence
// with delay. Returns counts; caller updates request row.
export async function dispatchBroadcast(
  supabase: SupabaseClient,
  req: AvailabilityRequestRow,
): Promise<{ sent: number; failed: number; skipped_no_creds: boolean }> {
  const creds = await loadGmailCreds(supabase);
  if (!creds) return { sent: 0, failed: 0, skipped_no_creds: true };

  const candidates = await findCandidateOwners(supabase, req);
  if (candidates.length === 0) return { sent: 0, failed: 0, skipped_no_creds: false };

  const area = AREA_LABELS[req.area] || req.area;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: creds.user, pass: creds.pass.replace(/\s/g, '') },
  });

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    const responseToken = cryptoRandomToken();
    const responseUrl = `${SITE_URL}/r/${responseToken}`;
    const unsubscribeUrl = `${SITE_URL}/dashboard/broadcast-settings`;

    // Insert recipient row first so we have audit even if send fails
    const { error: insErr } = await supabase
      .from('availability_request_recipients')
      .insert({
        request_id: req.id,
        owner_id: c.owner_id,
        response_token: responseToken,
        send_status: 'sent', // updated below if it fails
      });

    if (insErr) {
      // Unique violation (already sent to this owner) → skip
      continue;
    }

    try {
      await transporter.sendMail({
        from: `ChalkidikiHub <${creds.user}>`,
        to: c.email,
        subject: `Αίτημα διαθεσιμότητας · ${area} · ${fmtDate(req.check_in)} → ${fmtDate(req.check_out)}`,
        html: buildOwnerEmailHtml(req, responseUrl, unsubscribeUrl),
        text: buildOwnerEmailText(req, responseUrl, unsubscribeUrl),
        replyTo: `${SITE_URL}/requests/${req.public_token}`,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      });
      sent++;
    } catch (err) {
      failed++;
      await supabase
        .from('availability_request_recipients')
        .update({ send_status: 'failed', error: (err as Error).message.slice(0, 500) })
        .eq('request_id', req.id)
        .eq('owner_id', c.owner_id);
    }

    if (i < candidates.length - 1) {
      await new Promise(r => setTimeout(r, SEND_DELAY_MS));
    }
  }

  return { sent, failed, skipped_no_creds: false };
}

// ─── Guest email templates (el + en) ─────────────────────────────────
// Two locales only to keep dispatch.ts manageable; other supported locales
// fall back to English (every European tourist understands at least one).
type GuestLocale = 'el' | 'en';

function pickGuestLocale(locale: string | undefined | null): GuestLocale {
  return locale === 'el' ? 'el' : 'en';
}

const AREA_LABELS_EN: Record<string, string> = {
  kassandra: 'Kassandra',
  sithonia: 'Sithonia',
  athos: 'Athos',
  mainland: 'Halkidiki mainland',
};

function localizedArea(area: string, locale: GuestLocale): string {
  return (locale === 'el' ? AREA_LABELS : AREA_LABELS_EN)[area] || area;
}

const GUEST_COPY = {
  confirmation: {
    el: {
      subject: (area: string) => `Λάβαμε το αίτημά σου για ${area} — δες την πορεία`,
      heading: 'Λάβαμε το αίτημά σου! ✨',
      sentLine: (n: number) =>
        n > 0
          ? `Στείλαμε το αίτημά σου σε <strong>${n} ιδιοκτήτες</strong> με ταιριαστά καταλύματα στην περιοχή.`
          : `Αυτή τη στιγμή δεν βρήκαμε ιδιοκτήτες με ταιριαστά καταλύματα. Το αίτημά σου παραμένει ενεργό και θα δοκιμάσουμε ξανά αν προκύψει διαθεσιμότητα.`,
      whatNext: 'Όσοι έχουν διαθέσιμο θα απαντήσουν εντός 24–48 ωρών απευθείας εδώ ή θα σε καλέσουν στο τηλέφωνο που έδωσες.',
      ctaLabel: 'Δες την πορεία του αιτήματος',
      tipTitle: '💡 Tip',
      tipBody: 'Αποθήκευσε αυτό το email — το link σε αυτό είναι μοναδικό για εσένα και χρειάζεται κάθε φορά που θες να δεις νέες απαντήσεις.',
      summary: 'Σύνοψη αιτήματος',
      labelDates: 'Ημερομηνίες',
      labelGuests: 'Άτομα',
      labelArea: 'Περιοχή',
      footer: 'ChalkidikiHub · chalkidikihub.gr',
      textHeading: (area: string) => `Λάβαμε το αίτημά σου για ${area}!`,
      textSent: (n: number) => (n > 0 ? `Στείλαμε το αίτημά σου σε ${n} ιδιοκτήτες.` : 'Δεν βρήκαμε ταιριαστούς ιδιοκτήτες αυτή τη στιγμή — θα δοκιμάσουμε ξανά.'),
      textCta: 'Δες την πορεία:',
      textTip: 'Κράτησε αυτό το link — το χρειάζεσαι κάθε φορά που θες να δεις απαντήσεις.',
    },
    en: {
      subject: (area: string) => `We received your request for ${area} — track it here`,
      heading: 'We got your request! ✨',
      sentLine: (n: number) =>
        n > 0
          ? `We notified <strong>${n} owners</strong> with matching properties in the area.`
          : `We couldn't find owners with matching availability right now. Your request stays active and we'll try again if something opens up.`,
      whatNext: 'Owners with availability typically reply within 24–48 hours, either here or by calling the number you provided.',
      ctaLabel: 'Track your request',
      tipTitle: '💡 Tip',
      tipBody: 'Save this email — the link is unique to you and you need it any time you want to check for new replies.',
      summary: 'Request summary',
      labelDates: 'Dates',
      labelGuests: 'Guests',
      labelArea: 'Area',
      footer: 'ChalkidikiHub · chalkidikihub.gr',
      textHeading: (area: string) => `We received your request for ${area}!`,
      textSent: (n: number) => (n > 0 ? `We notified ${n} owners.` : `No matching owners right now — we'll try again.`),
      textCta: 'Track your request:',
      textTip: 'Keep this link — you need it to check for new replies.',
    },
  },
  firstResponse: {
    el: {
      subject: (area: string) => `Ένας ιδιοκτήτης απάντησε στο αίτημά σου για ${area}`,
      heading: 'Έχεις την πρώτη απάντηση! 🎉',
      greet: (name: string) => `Γεια σου ${name},`,
      body: (area: string) =>
        `Ένας ιδιοκτήτης απάντησε στο αίτημά σου για διαμονή στη ${area}. Μπορεί να ακολουθήσουν κι άλλοι τις επόμενες ώρες.`,
      ctaLabel: 'Δες τις απαντήσεις',
      tip: 'Κράτησε αυτό το link — το χρειάζεσαι κάθε φορά που θες να δεις νέες απαντήσεις.',
      textHeading: (area: string) => `Έχεις την πρώτη απάντηση στο αίτημά σου για ${area}!`,
      textCta: 'Δες τις απαντήσεις:',
    },
    en: {
      subject: (area: string) => `An owner replied to your request for ${area}`,
      heading: 'You got your first reply! 🎉',
      greet: (name: string) => `Hi ${name},`,
      body: (area: string) =>
        `An owner replied to your request for accommodation in ${area}. More replies may come in the next few hours.`,
      ctaLabel: 'See the replies',
      tip: 'Keep this link — you need it any time you want to check for new replies.',
      textHeading: (area: string) => `You got your first reply for ${area}!`,
      textCta: 'See replies:',
    },
  },
} as const;

function fmtDateLocalized(iso: string, locale: GuestLocale): string {
  return new Date(iso).toLocaleDateString(locale === 'el' ? 'el-GR' : 'en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

// Send the guest a confirmation email as soon as their request is submitted,
// containing the dashboard link they can revisit anytime. This runs once per
// request; the first-response notification still fires separately later.
export async function sendGuestConfirmation(
  supabase: SupabaseClient,
  req: AvailabilityRequestRow,
  sentCount: number,
): Promise<void> {
  if (!req.guest_email) return;
  const creds = await loadGmailCreds(supabase);
  if (!creds) return;

  const locale = pickGuestLocale(req.locale);
  const copy = GUEST_COPY.confirmation[locale];
  const area = localizedArea(req.area, locale);
  const dashboardUrl = `${SITE_URL}/requests/${req.public_token}`;
  const nights = nightsBetween(req.check_in, req.check_out);
  const totalGuests = (req.adults || 0) + (req.children || 0);

  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:24px;">
  <div style="background:#fff;border-radius:16px;padding:28px 24px;border:1px solid #e5e7eb;color:#111827;font-size:15px;line-height:1.6;">
    <div style="font-size:13px;color:#0284c7;font-weight:600;margin-bottom:6px;">CHALKIDIKIHUB</div>
    <h1 style="margin:0 0 14px;font-size:22px;font-weight:700;color:#0f172a;">${copy.heading}</h1>

    <p style="margin:0 0 14px;color:#374151;">${copy.sentLine(sentCount)}</p>
    <p style="margin:0 0 22px;color:#374151;">${copy.whatNext}</p>

    <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:22px;font-size:14px;">
      <div style="font-weight:600;color:#0f172a;margin-bottom:10px;">${copy.summary}</div>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:4px 0;color:#6b7280;width:110px;">${copy.labelArea}</td><td style="padding:4px 0;color:#111827;font-weight:600;">${escapeHtml(area)}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;">${copy.labelDates}</td><td style="padding:4px 0;color:#111827;font-weight:600;">${fmtDateLocalized(req.check_in, locale)} → ${fmtDateLocalized(req.check_out, locale)} (${nights} ${locale === 'el' ? 'βράδια' : 'nights'})</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;">${copy.labelGuests}</td><td style="padding:4px 0;color:#111827;font-weight:600;">${totalGuests}</td></tr>
      </table>
    </div>

    <p style="text-align:center;margin:0 0 18px;">
      <a href="${dashboardUrl}" style="display:inline-block;background:#0284c7;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">${copy.ctaLabel} →</a>
    </p>

    <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:14px;font-size:13px;color:#78350f;line-height:1.55;">
      <strong style="color:#92400e;">${copy.tipTitle}</strong> ${copy.tipBody}
    </div>

    <div style="margin-top:24px;padding-top:14px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;text-align:center;">
      ${copy.footer}
    </div>
  </div>
</div></body></html>`;

  const text = [
    copy.textHeading(area),
    '',
    copy.textSent(sentCount),
    '',
    `${copy.labelDates}: ${fmtDateLocalized(req.check_in, locale)} → ${fmtDateLocalized(req.check_out, locale)}`,
    `${copy.labelGuests}: ${totalGuests}`,
    '',
    `${copy.textCta} ${dashboardUrl}`,
    '',
    copy.textTip,
    '',
    copy.footer,
  ].join('\n');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: creds.user, pass: creds.pass.replace(/\s/g, '') },
  });

  await transporter
    .sendMail({
      from: `ChalkidikiHub <${creds.user}>`,
      to: req.guest_email,
      subject: copy.subject(area),
      html,
      text,
    })
    .catch(() => {
      // ignore — visitor still sees dashboard URL on the success page
    });
}

// Notify the guest that their first response came in. Single email — does NOT
// fire on subsequent responses to keep Gmail quota safe.
export async function notifyGuestFirstResponse(
  supabase: SupabaseClient,
  requestId: string,
): Promise<void> {
  const { data: req } = await supabase
    .from('availability_requests')
    .select('public_token, guest_email, guest_name, area, locale')
    .eq('id', requestId)
    .single();
  if (!req) return;

  const { count } = await supabase
    .from('availability_responses')
    .select('id', { count: 'exact', head: true })
    .eq('request_id', requestId);
  if ((count || 0) !== 1) return; // not the first

  const creds = await loadGmailCreds(supabase);
  if (!creds) return;

  const locale = pickGuestLocale(req.locale);
  const copy = GUEST_COPY.firstResponse[locale];
  const area = localizedArea(req.area, locale);
  const dashboardUrl = `${SITE_URL}/requests/${req.public_token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: creds.user, pass: creds.pass.replace(/\s/g, '') },
  });

  await transporter
    .sendMail({
      from: `ChalkidikiHub <${creds.user}>`,
      to: req.guest_email,
      subject: copy.subject(area),
      html: `<div style="font-family:system-ui;max-width:480px;margin:0 auto;padding:24px;">
  <h2 style="color:#0284c7;margin:0 0 12px;">${copy.heading}</h2>
  <p style="color:#374151;line-height:1.6;">${copy.greet(escapeHtml(req.guest_name))}</p>
  <p style="color:#374151;line-height:1.6;">${copy.body(escapeHtml(area))}</p>
  <p style="text-align:center;margin:24px 0;"><a href="${dashboardUrl}" style="background:#0284c7;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;">${copy.ctaLabel}</a></p>
  <p style="color:#9ca3af;font-size:12px;line-height:1.5;">${copy.tip} ChalkidikiHub.</p>
</div>`,
      text: `${copy.textHeading(area)}\n\n${copy.textCta} ${dashboardUrl}\n\nChalkidikiHub`,
    })
    .catch(() => {
      // ignore — guest still sees responses on the dashboard
    });
}

function cryptoRandomToken(): string {
  // 32-char URL-safe random — using Web Crypto via the Node runtime
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function generatePublicToken(): string {
  return cryptoRandomToken();
}
