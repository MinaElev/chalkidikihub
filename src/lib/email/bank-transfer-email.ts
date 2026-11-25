import { emailLayout, escapeHtml } from '@/lib/email/mailer';

export type BankDetails = { iban: string; beneficiary: string; bank: string; bic: string };

/**
 * Sent to the owner when they choose to pay by bank transfer: the listing is
 * submitted, it goes live once the deposit arrives, and here is where to pay
 * and what to write as the payment reference (the listing name).
 */
export function bankTransferEmail(o: {
  ownerName: string | null;
  listingTitle: string;
  amountLabel: string;
  planLabel: string;
  renewal: boolean;
  bank: BankDetails;
  dashboardUrl: string;
}): { subject: string; html: string; text: string } {
  const title = o.listingTitle || '(χωρίς τίτλο)';
  const t = escapeHtml(title);
  const subject = o.renewal
    ? `Ανανέωση «${title}» — αναμένεται η τραπεζική κατάθεση`
    : `Η καταχώρηση «${title}» ολοκληρώθηκε — αναμένεται η τραπεζική κατάθεση`;

  const row = (label: string, value: string, mono = false) =>
    `<tr><td style="padding:6px 0;color:#64748b;width:150px;vertical-align:top">${label}</td>`
    + `<td style="padding:6px 0;color:#0f172a;font-weight:600;${mono ? 'font-family:Consolas,Menlo,monospace;letter-spacing:0.5px;' : ''}">${escapeHtml(value)}</td></tr>`;

  const hasIban = Boolean(o.bank.iban);
  const details = hasIban
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px">
<tr><td style="padding:14px 18px">
<div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0e7596;margin-bottom:6px">Στοιχεία κατάθεσης</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
${o.bank.bank ? row('Τράπεζα', o.bank.bank) : ''}
${o.bank.beneficiary ? row('Δικαιούχος', o.bank.beneficiary) : ''}
${row('IBAN', o.bank.iban, true)}
${o.bank.bic ? row('BIC / SWIFT', o.bank.bic, true) : ''}
${row('Ποσό', o.amountLabel)}
${row('Πακέτο', o.planLabel)}
</table></td></tr></table>
<div style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:8px;padding:14px 16px;margin:0 0 18px">
<div style="font-size:13px;color:#92400e">Στην αιτιολογία / στα σχόλια της κατάθεσης γράψτε:</div>
<div style="font-size:18px;font-weight:700;color:#0f172a;margin-top:4px">${t}</div>
</div>`
    : `<p style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px">Θα επικοινωνήσουμε σύντομα μαζί σας με τα στοιχεία του τραπεζικού λογαριασμού. Στην αιτιολογία της κατάθεσης θα γράψετε το όνομα του καταλύματος: <strong>${t}</strong>.</p>`;

  const intro = o.renewal
    ? `<p>Καταγράψαμε ότι θα ανανεώσετε τη συνδρομή του καταλύματος <strong>«${t}»</strong> με τραπεζική κατάθεση.</p>
<p>Η ανανέωση ολοκληρώνεται μόλις λάβουμε την κατάθεση.</p>`
    : `<p>Η καταχώρηση του καταλύματος <strong>«${t}»</strong> ολοκληρώθηκε.</p>
<p>Για να εμφανιστεί στο ChalkidikiHub, <strong>αναμένεται η τραπεζική κατάθεση</strong>.</p>`;

  // Name-free greeting: names are stored in the nominative, Greek needs the vocative.
  const body = `<p>Γεια σας,</p>
${intro}
${details}
<p>Μόλις λάβουμε την κατάθεση, ${o.renewal ? 'ανανεώνουμε τη συνδρομή' : 'ενεργοποιούμε την καταχώρηση'} και σας στέλνουμε απόδειξη με email. Αν προτιμάτε, μπορείτε να πληρώσετε και με κάρτα από τη σελίδα Χρεώσεων.</p>
<p style="text-align:center;margin:24px 0 8px"><a href="${o.dashboardUrl}" style="display:inline-block;background:#0e7596;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">Συνδρομές &amp; πληρωμές</a></p>`;

  const text = [
    'Γεια σας,',
    '',
    o.renewal
      ? `Καταγράψαμε ότι θα ανανεώσετε τη συνδρομή του καταλύματος «${title}» με τραπεζική κατάθεση.`
      : `Η καταχώρηση του καταλύματος «${title}» ολοκληρώθηκε. Για να εμφανιστεί στο ChalkidikiHub, αναμένεται η τραπεζική κατάθεση.`,
    '',
    ...(hasIban
      ? [
          'Στοιχεία κατάθεσης',
          o.bank.bank ? `Τράπεζα: ${o.bank.bank}` : null,
          o.bank.beneficiary ? `Δικαιούχος: ${o.bank.beneficiary}` : null,
          `IBAN: ${o.bank.iban}`,
          o.bank.bic ? `BIC/SWIFT: ${o.bank.bic}` : null,
          `Ποσό: ${o.amountLabel} (${o.planLabel})`,
          '',
          `Στην αιτιολογία / στα σχόλια της κατάθεσης γράψτε: ${title}`,
        ]
      : ['Θα επικοινωνήσουμε σύντομα μαζί σας με τα στοιχεία του τραπεζικού λογαριασμού.']),
    '',
    `Μόλις λάβουμε την κατάθεση, σας στέλνουμε απόδειξη. ${o.dashboardUrl}`,
  ].filter((l) => l !== null).join('\n');

  return { subject, html: emailLayout(o.renewal ? 'Ανανέωση με τραπεζική κατάθεση' : 'Αναμένεται η τραπεζική κατάθεση', body), text };
}
