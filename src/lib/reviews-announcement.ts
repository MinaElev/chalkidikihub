// One-off owner campaign: announce the new listing-reviews feature.
// Shared by the admin preview page and the send endpoint so what the admin
// previews is exactly what goes out — same convention as monthly-report.ts.

import type { createAdminClient } from './api-helpers';

type AdminSupabase = ReturnType<typeof createAdminClient>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export interface AnnouncementListing {
  slug: string;
  title: string;
}

export interface AnnouncementOwner {
  ownerId: string;
  email: string;
  name: string;
  listings: AnnouncementListing[];
}

/** Owners with at least one published listing and an email we can reach. */
export async function buildAnnouncementOwners(supabase: AdminSupabase): Promise<AnnouncementOwner[]> {
  const { data: listings } = await supabase
    .from('listings')
    .select('owner_id, slug, title_el, title_en')
    .eq('status', 'published');
  if (!listings || listings.length === 0) return [];

  const ownerIds = [...new Set(listings.map(l => l.owner_id as string))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .in('id', ownerIds);

  const profileById = new Map<string, { email: string; name: string }>();
  for (const p of profiles || []) {
    profileById.set(p.id as string, {
      email: (p as { email?: string }).email || '',
      name: (p.full_name as string) || '',
    });
  }

  const byOwner = new Map<string, AnnouncementOwner>();
  for (const l of listings) {
    const prof = profileById.get(l.owner_id as string);
    if (!prof || !prof.email) continue; // can't email → skip
    let owner = byOwner.get(l.owner_id as string);
    if (!owner) {
      owner = { ownerId: l.owner_id as string, email: prof.email, name: prof.name, listings: [] };
      byOwner.set(l.owner_id as string, owner);
    }
    owner.listings.push({
      slug: (l.slug as string) || '',
      title: (l.title_el as string) || (l.title_en as string) || (l.slug as string) || '(κατάλυμα)',
    });
  }

  return [...byOwner.values()].sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email, 'el'));
}

export const ANNOUNCEMENT_SUBJECT = '⭐ Νέο: Κριτικές επισκεπτών για το κατάλυμά σας στο ChalkidikiHub';

function esc(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function reviewFormUrl(slug: string): string {
  return `${SITE_URL}/listings/${slug}#review-form`;
}

export function renderAnnouncementHtml(owner: AnnouncementOwner): string {
  const name = esc(owner.name || '');

  const listingButtons = owner.listings.map(l => `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 10px;">
      <tr><td style="background:linear-gradient(135deg,#0369a1,#0284c7);border-radius:10px;">
        <a href="${reviewFormUrl(l.slug)}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">
          ✍️ ${esc(l.title)} — Φόρμα κριτικής
        </a>
      </td></tr>
    </table>`).join('');

  const steps = [
    ['1', 'Ο επισκέπτης ανοίγει τη σελίδα του καταλύματός σας και βρίσκει τη φόρμα «Αφήστε κριτική».'],
    ['2', 'Επιλέγει αστέρια, γράφει το όνομά του και δυο λόγια για την εμπειρία του — 30 δευτερόλεπτα, χωρίς εγγραφή ή λογαριασμό.'],
    ['3', 'Η κριτική ελέγχεται από την ομάδα μας και, μόλις εγκριθεί, δημοσιεύεται στη σελίδα σας.'],
  ].map(([n, txt]) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
      <tr>
        <td width="34" style="vertical-align:top;">
          <div style="width:26px;height:26px;border-radius:50%;background:#e0f2fe;color:#0369a1;font-weight:800;font-size:14px;text-align:center;line-height:26px;">${n}</div>
        </td>
        <td style="font-size:14px;line-height:1.6;color:#374151;">${txt}</td>
      </tr>
    </table>`).join('');

  return `<!DOCTYPE html>
<html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">

        <tr><td style="background:linear-gradient(135deg,#0369a1,#0284c7);padding:24px 28px;color:#fff;">
          <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;font-weight:600;">ChalkidikiHub · Νέα δυνατότητα</div>
          <div style="font-size:22px;font-weight:700;margin-top:4px;">⭐ Κριτικές επισκεπτών για το κατάλυμά σας</div>
        </td></tr>

        <tr><td style="padding:22px 28px 4px;">
          <p style="margin:0 0 10px;font-size:15px;color:#374151;">${name ? `Γεια σας, ${name}! 👋` : 'Γεια σας! 👋'}</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
            Από σήμερα, η σελίδα του καταλύματός σας στο ChalkidikiHub δέχεται <strong>κριτικές επισκεπτών</strong> — από χρήστες και μη, χωρίς να χρειάζεται λογαριασμός. Μην ξεχνάτε: <strong>οι επισκέπτες αναζητούν πάντα τις αξιολογήσεις ενός καταλύματος</strong> πριν στείλουν αίτημα. Τώρα θα τις βρίσκουν στη σελίδα σας.
          </p>
        </td></tr>

        <tr><td style="padding:20px 28px 4px;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#64748b;margin-bottom:12px;">Τι κερδίζετε</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;">
            <tr><td style="padding:16px 18px;">
              <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#374151;">🤝 <strong>Εμπιστοσύνη = αιτήματα.</strong> Ένα κατάλυμα με πραγματικές κριτικές πείθει πολύ πιο εύκολα από ένα χωρίς.</p>
              <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#374151;">⭐ <strong>Αστεράκια στην Google.</strong> Με εγκεκριμένες κριτικές, το κατάλυμά σας γίνεται υποψήφιο να εμφανίζεται στα αποτελέσματα αναζήτησης με βαθμολογία — περισσότερα κλικ προς τη σελίδα σας.</p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">💶 <strong>Όπως όλα στο ChalkidikiHub:</strong> δωρεάν, χωρίς προμήθειες, χωρίς μεσάζοντες.</p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:20px 28px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;">
            <tr><td style="padding:16px 18px;">
              <div style="font-size:14px;font-weight:800;color:#166534;margin-bottom:6px;">🛡️ Εδώ είμαστε στο πλευρό σας</div>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#166534;">
                Σε αντίθεση με άλλες πλατφόρμες, <strong>καμία κριτική δεν δημοσιεύεται αυτόματα</strong>. Κάθε μία ελέγχεται από την ομάδα μας πριν εμφανιστεί — δεν επιτρέπουμε κακοπροαίρετη δυσφήμιση ούτε ατεκμηρίωτα σχόλια. Στόχος μας είναι οι αξιολογήσεις να είναι πάντα <strong>αληθινές και ουσιαστικές</strong>.
              </p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:20px 28px 4px;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#64748b;margin-bottom:12px;">Πώς λειτουργεί</div>
          ${steps}
        </td></tr>

        <tr><td style="padding:20px 28px 4px;" align="center">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#64748b;margin-bottom:12px;">${owner.listings.length > 1 ? 'Οι σελίδες κριτικής των καταλυμάτων σας' : 'Η σελίδα κριτικής του καταλύματός σας'}</div>
          ${listingButtons}
        </td></tr>

        <tr><td style="padding:20px 28px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;">
            <tr><td style="padding:16px 18px;">
              <div style="font-size:14px;font-weight:800;color:#92400e;margin-bottom:6px;">💡 Σπάστε πρώτοι τον πάγο</div>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#92400e;">
                Η πρώτη κριτική είναι πάντα η πιο δύσκολη — γι&#8217; αυτό δοκιμάστε <strong>εσείς πρώτοι</strong> τη φόρμα, να δείτε πόσο απλή είναι (και τι θα θέλατε να διαβάζει εκεί ο επόμενος επισκέπτης σας). Μετά στείλτε το παραπάνω λινκ στους πιο πρόσφατους ικανοποιημένους επισκέπτες σας — δυο γραμμές στο μήνυμα αρκούν: <em>«Αν περάσατε όμορφα, θα μας βοηθούσε πολύ μια κριτική»</em>. Μόλις μπει η πρώτη, οι επόμενες έρχονται πιο εύκολα.
              </p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:22px 28px 26px;">
          <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">
            Είμαστε εδώ για ό,τι χρειαστείτε — απαντήστε απλώς σε αυτό το email.<br>
            Με εκτίμηση,<br><strong>Η ομάδα του ChalkidikiHub</strong>
          </p>
        </td></tr>

        <tr><td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:16px 28px;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            Λαμβάνετε αυτό το email επειδή έχετε κατάλυμα στο <a href="${SITE_URL}" style="color:#0369a1;text-decoration:none;">chalkidikihub.gr</a>.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function renderAnnouncementText(owner: AnnouncementOwner): string {
  const links = owner.listings.map(l => `  • ${l.title}: ${reviewFormUrl(l.slug)}`).join('\n');
  return `Γεια σας${owner.name ? `, ${owner.name}` : ''}!

Από σήμερα η σελίδα του καταλύματός σας στο ChalkidikiHub δέχεται κριτικές επισκεπτών — χωρίς να χρειάζεται λογαριασμός. Οι επισκέπτες αναζητούν πάντα τις αξιολογήσεις ενός καταλύματος πριν στείλουν αίτημα — τώρα θα τις βρίσκουν στη σελίδα σας.

Τι κερδίζετε:
  • Εμπιστοσύνη = περισσότερα αιτήματα.
  • Με εγκεκριμένες κριτικές, υποψηφιότητα για αστεράκια στα αποτελέσματα της Google.
  • Δωρεάν, χωρίς προμήθειες.

Εδώ είμαστε στο πλευρό σας: σε αντίθεση με άλλες πλατφόρμες, καμία κριτική δεν δημοσιεύεται αυτόματα. Κάθε μία ελέγχεται πριν εμφανιστεί — δεν επιτρέπουμε κακοπροαίρετη δυσφήμιση ούτε ατεκμηρίωτα σχόλια. Στόχος: αληθινές και ουσιαστικές αξιολογήσεις.

Πώς λειτουργεί:
  1. Ο επισκέπτης ανοίγει τη σελίδα του καταλύματός σας και βρίσκει τη φόρμα «Αφήστε κριτική».
  2. Επιλέγει αστέρια, γράφει όνομα και σχόλιο — 30 δευτερόλεπτα, χωρίς εγγραφή.
  3. Μόλις εγκριθεί από την ομάδα μας, δημοσιεύεται.

${owner.listings.length > 1 ? 'Οι σελίδες κριτικής των καταλυμάτων σας' : 'Η σελίδα κριτικής του καταλύματός σας'}:
${links}

Σπάστε πρώτοι τον πάγο: δοκιμάστε εσείς τη φόρμα να δείτε πόσο απλή είναι, και στείλτε το λινκ στους πιο πρόσφατους ικανοποιημένους επισκέπτες σας — «Αν περάσατε όμορφα, θα μας βοηθούσε πολύ μια κριτική». Η πρώτη φέρνει τις επόμενες.

Με εκτίμηση,
Η ομάδα του ChalkidikiHub
${SITE_URL}`;
}
