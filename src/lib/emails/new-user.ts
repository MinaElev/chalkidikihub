/**
 * Admin heads-up email for a new registration.
 *
 * Lives outside the route so it can be rendered and eyeballed without sending
 * anything — a route file may only export HTTP handlers.
 */

export interface NewUserEmailData {
  name: string;
  email: string;
  phone: string;
  when: string;
  verified: boolean;
  totalUsers: number | null;
}

function escapeHtml(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const row = (label: string, value: string) => `
      <tr>
        <td style="padding:7px 0;color:#6b7280;font-size:14px;width:130px;vertical-align:top;">${label}</td>
        <td style="padding:7px 0;color:#111827;font-size:14px;font-weight:600;">${value}</td>
      </tr>`;

export function buildNewUserEmail({ name, email, phone, when, verified, totalUsers }: NewUserEmailData): string {
  return `
<!DOCTYPE html>
<html lang="el"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">

        <tr><td style="background:linear-gradient(135deg,#075985,#0ea5e9);padding:24px 28px;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;font-weight:600;">ChalkidikiHub &middot; Admin</div>
          <div style="font-size:22px;font-weight:700;margin-top:4px;">Νέα εγγραφή χρήστη</div>
        </td></tr>

        <tr><td style="padding:22px 28px 6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row('Όνομα', escapeHtml(name))}
            ${row('Email', `<a href="mailto:${escapeHtml(email)}" style="color:#026aa7;">${escapeHtml(email)}</a>`)}
            ${row('Τηλέφωνο', phone ? `<a href="tel:${escapeHtml(phone)}" style="color:#026aa7;">${escapeHtml(phone)}</a>` : '—')}
            ${row('Εγγραφή', escapeHtml(when))}
            ${row('Επιβεβαίωση email', verified
              ? '<span style="color:#047857;">&#10003; Ολοκληρώθηκε</span>'
              : '<span style="color:#b45309;">Εκκρεμεί</span>')}
            ${row('Σύνολο χρηστών', String(totalUsers ?? '—'))}
          </table>
        </td></tr>

        <tr><td style="padding:18px 28px 26px;" align="center">
          <a href="https://chalkidikihub.gr/admin/users" style="display:inline-block;background:#026aa7;color:#ffffff;text-decoration:none;padding:12px 26px;border-radius:10px;font-size:15px;font-weight:700;">Άνοιγμα στο admin &rarr;</a>
        </td></tr>

        <tr><td style="padding:0 28px 26px;">
          <div style="border-top:1px solid #e5e7eb;padding-top:14px;font-size:12px;color:#9ca3af;line-height:1.6;">
            Αυτόματη ειδοποίηση κάθε φορά που δημιουργείται λογαριασμός. Η κατάσταση επιβεβαίωσης
            αφορά τη στιγμή της εγγραφής — δείτε το admin για την τρέχουσα.
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`.trim();
}
