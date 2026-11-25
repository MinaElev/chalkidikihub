/**
 * "Please answer even when you're full": the polite reminder sent from
 * Admin → Mass Email to owners who leave many guest requests unanswered.
 * States the owner's real numbers, explains that a "not available" reply takes
 * one click and lets the guest move on at once, and (optionally) lists the
 * requests still waiting.
 *
 * Tone: friendly, thankful, never a warning. Every claim must be true: the
 * guest's request page does show who is not available, and the platform does
 * keep the response numbers (this very page). No ranking claims.
 */
import type { OwnerResponseRate } from '@/lib/response-rates';

const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const AREA: Record<string, string> = {
  kassandra: 'Κασσάνδρα',
  sithonia: 'Σιθωνία',
  athos: 'Άθως',
  mainland: 'Ενδοχώρα Χαλκιδικής',
};

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('el-GR', { day: 'numeric', month: 'short', timeZone: 'UTC' }) : '—';

export function responseEmail(o: OwnerResponseRate, opts: { includeList: boolean; siteUrl: string }): { subject: string; html: string; text: string } {
  const subject = 'Μια μικρή παράκληση για τα αιτήματα των επισκεπτών';
  const P = (html: string) =>
    `<tr><td style="padding:0 28px 14px"><p style="margin:0;font-size:15px;line-height:1.7;color:#374151">${html}</p></td></tr>`;

  const numbers = `σε <strong>${o.answered} από τα ${o.received}</strong> αιτήματα επισκεπτών που σας στάλθηκαν (<strong>${o.rate}%</strong>)`;
  const list = opts.includeList ? o.unanswered : [];
  const rows = list.map((u) => `
        <tr>
          <td style="padding:9px 0;border-top:1px solid #f1f5f9;font-size:14px;color:#0f172a">
            <strong>${esc(AREA[u.area || ''] || u.area || '')}</strong> · ${fmt(u.checkIn)} → ${fmt(u.checkOut)}${u.guests ? ` · ${u.guests} ${u.guests === 1 ? 'άτομο' : 'άτομα'}` : ''}
            <div style="font-size:12.5px;color:#64748b;margin-top:2px">Στάλθηκε ${fmt(u.sentAt)}</div>
          </td>
          <td style="padding:9px 0;border-top:1px solid #f1f5f9;text-align:right;white-space:nowrap">
            ${u.url ? `<a href="${esc(u.url)}" style="font-size:13px;font-weight:600;color:#0e7596;text-decoration:none">Απάντηση &rarr;</a>` : '<span style="font-size:12.5px;color:#94a3b8">έκλεισε</span>'}
          </td>
        </tr>`).join('');

  const html = `<!doctype html><html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#0f172a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden">
  <tr><td style="background:linear-gradient(135deg,#0e7596,#0ea5e9);padding:28px;color:#ffffff">
    <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:.9;font-weight:600">ChalkidikiHub</div>
    <div style="font-size:24px;font-weight:700;margin-top:4px;line-height:1.3">Ένα κλικ κάνει τη διαφορά για τον επισκέπτη</div>
  </td></tr>
  <tr><td style="height:22px"></td></tr>
  ${P('Καλησπέρα σας,')}
  ${P('Σας ευχαριστούμε που είστε μαζί μας στο ChalkidikiHub. Κάθε φορά που ένας επισκέπτης αναζητά διαμονή στην περιοχή σας, σας στέλνουμε το αίτημά του με email, ώστε να μπορείτε να του απαντήσετε απευθείας.')}
  ${P(`Κοιτάζοντας τα στατιστικά της πλατφόρμας, είδαμε ότι τους τελευταίους μήνες έχετε απαντήσει ${numbers}. Το καταλαβαίνουμε απόλυτα: συχνά τα αιτήματα αφορούν ημερομηνίες που είστε ήδη γεμάτοι, και τότε φαίνεται πως δεν υπάρχει λόγος να απαντήσετε.`)}
  <tr><td style="padding:4px 28px 18px">
    <div style="background:#f0f9ff;border-left:4px solid #0ea5e9;border-radius:8px;padding:14px 16px;font-size:15px;line-height:1.7;color:#0c4a6e">
      <strong>Η παράκλησή μας:</strong> όταν δεν έχετε διαθεσιμότητα για τις ημερομηνίες που ζητά ο επισκέπτης, πατήστε απλώς το κουμπί <strong>«✗ Δεν είμαι διαθέσιμος»</strong> μέσα στο email του αιτήματος. Είναι ένα κλικ, χωρίς τιμή και χωρίς μήνυμα.
    </div>
  </td></tr>
  ${P('Έτσι ο επισκέπτης βλέπει αμέσως στη σελίδα του αιτήματός του ποιοι δεν είναι διαθέσιμοι, δεν περιμένει άσκοπα και συνεχίζει την αναζήτησή του. Και για εμάς είναι σημαντικό: καταγράφουμε την ανταπόκριση κάθε καταλύματος στα αιτήματα, και τα καταλύματα που απαντούν δίνουν στους επισκέπτες την εικόνα μιας ζωντανής, αξιόπιστης πλατφόρμας.')}
  ${list.length ? `
  ${P('<strong>Τα πιο πρόσφατα αιτήματα που έμειναν χωρίς απάντηση:</strong>')}
  <tr><td style="padding:0 28px 18px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
  </td></tr>` : ''}
  ${P('Αν κάτι δεν λειτουργεί σωστά, αν δεν σας φτάνουν τα email ή αν προτιμάτε να λαμβάνετε λιγότερα αιτήματα, απαντήστε απλώς σε αυτό το email και θα το κανονίσουμε μαζί.')}
  ${P('Σας ευχαριστούμε πολύ για τη συνεργασία!<br><br>Με εκτίμηση,<br><strong>Η ομάδα του ChalkidikiHub</strong>')}
  <tr><td style="padding:10px 28px 26px">
    <div style="border-top:1px solid #e5e7eb;padding-top:14px;font-size:12px;color:#9ca3af">ChalkidikiHub · <a href="${esc(opts.siteUrl)}" style="color:#9ca3af">chalkidikihub.gr</a></div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  const text = [
    'Καλησπέρα σας,',
    '',
    `Κοιτάζοντας τα στατιστικά της πλατφόρμας, είδαμε ότι έχετε απαντήσει σε ${o.answered} από τα ${o.received} αιτήματα επισκεπτών που σας στάλθηκαν (${o.rate}%).`,
    '',
    'Η παράκλησή μας: όταν δεν έχετε διαθεσιμότητα για τις ημερομηνίες που ζητά ο επισκέπτης, πατήστε το κουμπί «Δεν είμαι διαθέσιμος» μέσα στο email του αιτήματος. Είναι ένα κλικ.',
    'Έτσι ο επισκέπτης βλέπει αμέσως ποιοι δεν είναι διαθέσιμοι και συνεχίζει την αναζήτησή του.',
    ...(list.length ? ['', 'Αιτήματα χωρίς απάντηση:', ...list.map((u) => `- ${AREA[u.area || ''] || u.area || ''}, ${fmt(u.checkIn)} → ${fmt(u.checkOut)}${u.url ? `: ${u.url}` : ''}`)] : []),
    '',
    'Σας ευχαριστούμε πολύ,',
    'Η ομάδα του ChalkidikiHub',
  ].join('\n');

  return { subject, html, text };
}
