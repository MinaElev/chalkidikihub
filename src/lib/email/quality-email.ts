/**
 * "A few small things need your attention" — the quality reminder sent from
 * Admin → Mass Email. One email per owner, one section per listing that has
 * issues, each with exactly what to add or fix and a button to its edit page.
 *
 * Tone: informative and caring, never a warning. No invented statistics.
 * Self-contained HTML (inline styles, tables) so it renders in every client.
 */
import type { QualityIssue } from '@/lib/listing-quality';

const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export type QualityEmailListing = { id: string; title: string; issues: QualityIssue[] };

export function qualityEmail(o: {
  ownerName: string | null;
  listings: QualityEmailListing[];
  siteUrl: string;
}): { subject: string; html: string; text: string } {
  const many = o.listings.length > 1;
  const subject = many
    ? 'Μικρές βελτιώσεις για τις καταχωρήσεις σας στο ChalkidikiHub'
    : `Μικρές βελτιώσεις για την καταχώρησή σας «${o.listings[0]?.title || ''}»`;
  const editUrl = (id: string, section?: string) => `${o.siteUrl}/dashboard/listings/${id}/edit${section ? `#${section}` : ''}`;
  // Names are stored in the nominative; Greek greets in the vocative, which can't
  // be derived reliably, so the greeting stays name-free.
  const hello = 'Γεια σας,';

  const P = (html: string) =>
    `<tr><td style="padding:0 28px 14px"><p style="margin:0;font-size:15px;line-height:1.7;color:#374151">${html}</p></td></tr>`;

  const listingBlock = (l: QualityEmailListing) => {
    const items = l.issues.map((i) => `
          <tr>
            <td style="width:22px;vertical-align:top;padding:8px 0 0;font-size:14px;color:${i.weight === 'important' ? '#d97706' : '#0e7596'}">●</td>
            <td style="padding:6px 0">
              <div style="font-size:14.5px;font-weight:700;color:#0f172a">${esc(i.title)}</div>
              <div style="font-size:14px;line-height:1.6;color:#475569;margin-top:2px">${esc(i.detail)}</div>
              <a href="${editUrl(l.id, i.section)}" style="display:inline-block;margin-top:3px;font-size:13px;font-weight:600;color:#0e7596;text-decoration:none">Συμπλήρωση εδώ &rarr;</a>
            </td>
          </tr>`).join('');
    return `
    <tr><td style="padding:4px 28px 18px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;background:#ffffff">
        <tr><td style="padding:14px 18px 6px;border-bottom:1px solid #f1f5f9">
          <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;font-weight:600">Κατάλυμα</div>
          <div style="font-size:17px;font-weight:700;color:#0f172a;margin-top:2px">${esc(l.title)}</div>
        </td></tr>
        <tr><td style="padding:8px 18px 4px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>
        </td></tr>
        <tr><td style="padding:10px 18px 16px">
          <a href="${editUrl(l.id, l.issues[0]?.section)}" style="display:inline-block;background:#0e7596;color:#ffffff;text-decoration:none;padding:11px 22px;border-radius:9px;font-size:14px;font-weight:700">Επεξεργασία καταχώρησης</a>
        </td></tr>
      </table>
    </td></tr>`;
  };

  const html = `<!doctype html><html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#0f172a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden">
  <tr><td style="background:linear-gradient(135deg,#0e7596,#0ea5e9);padding:28px;color:#ffffff">
    <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:.9;font-weight:600">ChalkidikiHub</div>
    <div style="font-size:24px;font-weight:700;margin-top:4px;line-height:1.3">Λίγες μικρές βελτιώσεις, περισσότεροι επισκέπτες</div>
  </td></tr>
  <tr><td style="height:22px"></td></tr>
  ${P(hello)}
  ${P(`Σας γράφουμε σχετικά με ${many ? 'τις καταχωρήσεις σας' : 'την καταχώρησή σας'} στο ChalkidikiHub. Βλέπουμε ότι η ζήτηση για διαμονή στη Χαλκιδική αρχίζει να αυξάνεται, και θέλουμε ${many ? 'τα καταλύματά σας να είναι έτοιμα' : 'το κατάλυμά σας να είναι έτοιμο'} να την υποδεχτ${many ? 'ούν' : 'εί'}.`)}
  ${P(`Ελέγξαμε ${many ? 'τις καταχωρήσεις σας' : 'την καταχώρησή σας'} και εντοπίσαμε κάποια μικρά ζητήματα που χρειάζονται την προσοχή σας. Είναι απλά στη διόρθωση και κάνουν πραγματική διαφορά: μια πλήρης καταχώρηση ξεχωρίζει στις αναζητήσεις, κερδίζει την εμπιστοσύνη των επισκεπτών και φέρνει περισσότερες επισκέψεις και, κατ’ επέκταση, περισσότερες κρατήσεις.`)}
  ${P(many ? '<strong>Ακολουθεί, για κάθε κατάλυμα, τι χρειάζεται να προσθέσετε ή να διορθώσετε:</strong>' : '<strong>Ακολουθεί τι χρειάζεται να προσθέσετε ή να διορθώσετε:</strong>')}
  ${o.listings.map(listingBlock).join('')}
  <tr><td style="padding:4px 28px 18px">
    <div style="background:#f0f9ff;border-left:4px solid #0ea5e9;border-radius:8px;padding:14px 16px;font-size:14.5px;line-height:1.7;color:#0c4a6e">
      Νοιαζόμαστε για την επιτυχία ${many ? 'των καταλυμάτων σας' : 'του καταλύματός σας'} όσο κι εσείς. Αν χρειαστείτε βοήθεια σε οποιοδήποτε βήμα, με τις φωτογραφίες, την περιγραφή ή τον χάρτη, απαντήστε απλώς σε αυτό το email και θα σας βοηθήσουμε προσωπικά.
    </div>
  </td></tr>
  ${P('Με εκτίμηση,<br><strong>Η ομάδα του ChalkidikiHub</strong>')}
  <tr><td style="padding:10px 28px 26px">
    <div style="border-top:1px solid #e5e7eb;padding-top:14px;font-size:12px;line-height:1.6;color:#9ca3af">
      Λαμβάνετε αυτό το ενημερωτικό email επειδή έχετε καταχώρηση στο ChalkidikiHub.<br>
      <a href="${o.siteUrl}" style="color:#6b7280">chalkidikihub.gr</a> &nbsp;·&nbsp; <a href="${o.siteUrl}/dashboard/listings" style="color:#6b7280">Τα καταλύματά μου</a>
    </div>
  </td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    'Γεια σας,',
    '',
    `Σας γράφουμε σχετικά με ${many ? 'τις καταχωρήσεις σας' : 'την καταχώρησή σας'} στο ChalkidikiHub. Βλέπουμε ότι η ζήτηση για διαμονή στη Χαλκιδική αρχίζει να αυξάνεται.`,
    'Εντοπίσαμε κάποια μικρά ζητήματα που χρειάζονται την προσοχή σας:',
    '',
    ...o.listings.flatMap((l) => [
      `■ ${l.title}`,
      ...l.issues.map((i) => `  - ${i.title}: ${i.detail} (${editUrl(l.id, i.section)})`),
      `  Επεξεργασία: ${editUrl(l.id, l.issues[0]?.section)}`,
      '',
    ]),
    'Νοιαζόμαστε για την επιτυχία σας. Αν χρειαστείτε βοήθεια, απαντήστε σε αυτό το email.',
    '',
    'Η ομάδα του ChalkidikiHub',
  ].join('\n');

  return { subject, html, text };
}
