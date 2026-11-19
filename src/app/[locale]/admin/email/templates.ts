/**
 * Ready-made bodies for the mass-mail composer.
 *
 * Each one is an HTML *fragment*: /api/admin/send-email wraps whatever it gets
 * in `<div style="font-family:system-ui…">`, so there is no <html>/<head> here
 * and no <style> block either — mail clients strip those. Everything is inline
 * styles on tables, which is what the transactional emails
 * (api/listings/notify-published) already use, so a campaign looks like it came
 * from the same place as the automated mail.
 *
 * Lines marked with an HTML comment are the bits to adjust before sending;
 * comments never render in the email.
 */

export interface EmailTemplate {
  id: string;
  /** Shown on the picker button. */
  name: string;
  /** One line of "when would I send this". */
  hint: string;
  emoji: string;
  subject: string;
  body: string;
}

// ── Shared pieces, so every template stays visually identical ──────────
const shell = (accentFrom: string, accentTo: string, eyebrow: string, title: string, sub: string, inner: string) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">

      <tr><td style="background:linear-gradient(135deg,${accentFrom},${accentTo});padding:28px;color:#ffffff;">
        <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;font-weight:600;">${eyebrow}</div>
        <div style="font-size:26px;font-weight:700;margin-top:4px;line-height:1.25;">${title}</div>
        <div style="font-size:15px;opacity:0.95;margin-top:6px;">${sub}</div>
      </td></tr>
${inner}
      <tr><td style="padding:26px 28px 30px;">
        <div style="border-top:1px solid #e5e7eb;padding-top:16px;font-size:12px;line-height:1.6;color:#9ca3af;">
          Λαμβάνετε αυτό το email επειδή έχετε καταχώρηση στο ChalkidikiHub.<br>
          <a href="https://chalkidikihub.gr" style="color:#6b7280;">chalkidikihub.gr</a> &nbsp;·&nbsp;
          <a href="https://chalkidikihub.gr/contact" style="color:#6b7280;">Επικοινωνία</a>
        </div>
      </td></tr>

    </table>
  </td></tr>
</table>`.trim();

const p = (text: string) =>
  `      <tr><td style="padding:0 28px 14px;"><p style="margin:0;font-size:15px;line-height:1.7;color:#374151;">${text}</p></td></tr>`;

const cta = (href: string, label: string, color: string) =>
  `      <tr><td style="padding:8px 28px 4px;" align="center">
        <a href="${href}" style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;padding:14px 30px;border-radius:10px;font-size:15px;font-weight:700;">${label}</a>
      </td></tr>`;

const bullets = (color: string, bg: string, border: string, items: string[]) =>
  `      <tr><td style="padding:4px 28px 18px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:10px;">
          <tr><td style="padding:16px 18px;">
${items.map((i) => `            <div style="font-size:14.5px;line-height:1.6;color:${color};padding:5px 0;">${i}</div>`).join('\n')}
          </td></tr>
        </table>
      </td></tr>`;

/**
 * Pre-addressed contact link: lands in Admin → Μηνύματα with the subject
 * already set, so website-offer replies are distinguishable from general mail.
 * The matching option exists in contact/_client.tsx's subject list.
 */
const INTEREST_URL =
  'https://chalkidikihub.gr/contact?subject=%CE%99%CF%83%CF%84%CE%BF%CF%83%CE%B5%CE%BB%CE%AF%CE%B4%CE%B1%20%CE%BA%CE%B1%CF%84%CE%B1%CE%BB%CF%8D%CE%BC%CE%B1%CF%84%CE%BF%CF%82%20%28mdeploy%29&message=%CE%95%CE%BD%CE%B4%CE%B9%CE%B1%CF%86%CE%AD%CF%81%CE%BF%CE%BC%CE%B1%CE%B9%20%CE%B3%CE%B9%CE%B1%20%CF%84%CE%B7%CE%BD%20%CE%BA%CE%B1%CF%84%CE%B1%CF%83%CE%BA%CE%B5%CF%85%CE%AE%20%CE%B9%CF%83%CF%84%CE%BF%CF%83%CE%B5%CE%BB%CE%AF%CE%B4%CE%B1%CF%82%20%CE%B3%CE%B9%CE%B1%20%CF%84%CE%BF%20%CE%BA%CE%B1%CF%84%CE%AC%CE%BB%CF%85%CE%BC%CE%AC%20%CE%BC%CE%BF%CF%85%20%28%CF%80%CF%81%CE%BF%CF%83%CF%86%CE%BF%CF%81%CE%AC%20200%E2%82%AC%20%CF%83%CE%B5%20%CF%83%CF%85%CE%BD%CE%B5%CF%81%CE%B3%CE%B1%CF%83%CE%AF%CE%B1%20%CE%BC%CE%B5%20%CF%84%CE%B7%CE%BD%20mdeploy.gr%29.%0A%0A%CE%8C%CE%BD%CE%BF%CE%BC%CE%B1%20%CE%BA%CE%B1%CF%84%CE%B1%CE%BB%CF%8D%CE%BC%CE%B1%CF%84%CE%BF%CF%82%3A%0A%CE%A0%CE%B5%CF%81%CE%B9%CE%BF%CF%87%CE%AE%3A%0A%CE%A4%CE%B7%CE%BB%CE%AD%CF%86%CF%89%CE%BD%CE%BF%3A';

const SITE = 'https://chalkidikihub.gr';

/** Full-width screenshot from /public/email (served by our own host, so it needs the deploy first). */
const shot = (file: string, alt: string, caption: string) =>
  `      <tr><td style="padding:4px 28px 18px;">
        <img src="${SITE}/email/${file}" alt="${alt}" width="584" style="display:block;width:100%;max-width:584px;height:auto;border:1px solid #e5e7eb;border-radius:10px;">
        <div style="font-size:12.5px;line-height:1.5;color:#6b7280;margin-top:8px;text-align:center;">${caption}</div>
      </td></tr>`;

/** Numbered step: blue circle + bold title + text. */
const step = (n: number, title: string, text: string) =>
  `      <tr><td style="padding:0 28px 14px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td width="40" valign="top"><div style="width:30px;height:30px;border-radius:15px;background:#026aa7;color:#ffffff;font-size:15px;font-weight:700;line-height:30px;text-align:center;">${n}</div></td>
          <td valign="top" style="font-size:15px;line-height:1.6;color:#374151;"><strong style="color:#111827;">${title}</strong><br>${text}</td>
        </tr></table>
      </td></tr>`;

const label = (text: string, color: string) =>
  `      <tr><td style="padding:14px 28px 6px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${color};margin-bottom:6px;">${text}</div>
      </td></tr>`;

/** Where to copy the link on each platform (menu names per their help pages, Nov 2026). */
const platformBox = (name: string, color: string, path: string, note: string) =>
  `      <tr><td style="padding:0 28px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid ${color};border-radius:10px;">
          <tr><td style="padding:14px 16px;">
            <div style="font-size:15px;font-weight:700;color:#111827;">${name}</div>
            <div style="font-size:14.5px;line-height:1.7;color:#374151;margin-top:4px;">${path}</div>
            <div style="font-size:12.5px;line-height:1.5;color:#6b7280;margin-top:6px;">${note}</div>
          </td></tr>
        </table>
      </td></tr>`;

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  // ── 0. iCal sync with Airbnb / Booking.com ───────────────────────────
  {
    id: 'ical-sync',
    name: 'Νέο: ζωντανή διαθεσιμότητα από Airbnb / Booking',
    hint: 'Ανακοίνωση του συγχρονισμού iCal, με οδηγίες βήμα-βήμα',
    emoji: '📅',
    subject: 'Νέο: η διαθεσιμότητά σας από Airbnb & Booking.com, ζωντανά στο ChalkidikiHub',
    body: shell(
      '#026aa7', '#0ea5e9',
      'ChalkidikiHub · Νέα δυνατότητα',
      'Το ημερολόγιό σας, πάντα ενημερωμένο. Αυτόματα.',
      'Συνδέστε Airbnb ή Booking.com μία φορά, σε 2 λεπτά',
      [
        p('Γεια σας,'),
        p('Πόσες φορές σας ρώτησε κάποιος «είναι ελεύθερο τον Αύγουστο;» για ημερομηνίες που είχαν κλείσει εδώ και μήνες; Από σήμερα, ο επισκέπτης το βλέπει <strong>πριν σας γράψει</strong>.'),
        p('Αν το κατάλυμά σας είναι ήδη στο <strong>Airbnb</strong> ή στο <strong>Booking.com</strong>, το ChalkidikiHub μπορεί πλέον να διαβάζει το ημερολόγιό σας από εκεί και να δείχνει στη σελίδα σας <strong>ποιες μέρες είναι ελεύθερες και ποιες κλεισμένες</strong>, για τους επόμενους τρεις μήνες, στις 7 γλώσσες του site.'),
        shot('ical-public-calendar.png', 'Το ημερολόγιο διαθεσιμότητας όπως το βλέπει ο επισκέπτης στη σελίδα του καταλύματος', 'Έτσι βλέπει ο επισκέπτης τη διαθεσιμότητα στη σελίδα του καταλύματός σας.'),
        label('Τι κερδίζετε', '#026aa7'),
        bullets('#075985', '#f0f9ff', '#bae6fd', [
          '🔄 <strong>Μηδέν διπλή δουλειά.</strong> Μια νέα κράτηση στο Airbnb ή στο Booking.com εμφανίζεται και εδώ, χωρίς να αγγίξετε τίποτα. Ο συγχρονισμός γίνεται αυτόματα κάθε λίγες ώρες.',
          '📩 <strong>Πιο «ζεστά» αιτήματα.</strong> Ο επισκέπτης σας γράφει για μέρες που ξέρει ότι είναι ελεύθερες. Λιγότερα άσκοπα email, περισσότερες πραγματικές κρατήσεις.',
          '✅ <strong>Αξιοπιστία που φαίνεται.</strong> Ένα ενημερωμένο ημερολόγιο, με την ένδειξη «Ενημερώθηκε», δείχνει ενεργό ιδιοκτήτη. Και ο επισκέπτης κλείνει πιο εύκολα με κάποιον που εμπιστεύεται.',
          '💶 <strong>Απευθείας κράτηση, 0% προμήθεια.</strong> Όποιος σας βρει εδώ, κλείνει απευθείας μαζί σας. Χωρίς επιπλέον χρέωση για τη νέα δυνατότητα.',
          '🔒 <strong>Μόνο ημερομηνίες.</strong> Δεν βλέπουμε και δεν δείχνουμε ονόματα επισκεπτών ή στοιχεία κρατήσεων· μόνο ποιες μέρες είναι κλεισμένες.',
        ]),
        label('Πώς το ενεργοποιείτε · 2 λεπτά', '#026aa7'),
        step(1, 'Αντιγράψτε τον σύνδεσμο iCal', 'Από το Airbnb ή το Booking.com (δείτε παρακάτω πού ακριβώς θα τον βρείτε). Είναι ένας σύνδεσμος που ξεκινά με <em>https://</em>.'),
        step(2, 'Ανοίξτε το ημερολόγιο του καταλύματός σας στο ChalkidikiHub', 'Πίνακας ελέγχου → <strong>Τα Καταλύματά μου</strong> → στο κατάλυμα, το κουμπί <strong>Ημερολόγιο</strong>.'),
        shot('ical-step2-calendar-button.png', 'Η λίστα Τα Καταλύματά μου, με τονισμένο το κουμπί Ημερολόγιο', 'Στα «Τα Καταλύματά μου», πατήστε <strong>Ημερολόγιο</strong> στο κατάλυμα που θέλετε να συνδέσετε.'),
        step(3, 'Επικολλήστε τον σύνδεσμο και πατήστε «Προσθήκη»', 'Στην ενότητα <strong>Συγχρονισμός με Airbnb / Booking.com</strong>. Ο πρώτος συγχρονισμός γίνεται αμέσως και βλέπετε πόσες κλεισμένες μέρες βρέθηκαν.'),
        shot('ical-owner-sync.png', 'Η ενότητα Συγχρονισμός με Airbnb / Booking.com στον πίνακα ελέγχου του ιδιοκτήτη', 'Η ενότητα συγχρονισμού στον πίνακα ελέγχου σας, με ένα συνδεδεμένο ημερολόγιο Airbnb.'),
        step(4, 'Ενεργοποιήστε τη «Δημόσια εμφάνιση ημερολογίου»', 'Στην ίδια σελίδα, γυρίστε τον διακόπτη σε <strong>ΝΑΙ</strong>. Μόνο τότε βλέπουν οι επισκέπτες το ημερολόγιο· μέχρι εκεί το βλέπετε μόνο εσείς.'),
        p('<span style="font-size:13.5px;color:#6b7280;">Οι μέρες που ήρθαν από Airbnb/Booking.com σημειώνονται με μια κουκκίδα και ενημερώνονται μόνες τους. Μπορείτε να συνεχίσετε να μπλοκάρετε και δικές σας μέρες με το χέρι· ο συγχρονισμός δεν τις αγγίζει. Έχετε και τις δύο πλατφόρμες; Προσθέστε και τους δύο συνδέσμους.</span>'),
        label('Πού θα βρείτε τον σύνδεσμο', '#026aa7'),
        platformBox(
          'Airbnb',
          '#ff5a5f',
          'Από υπολογιστή: <strong>Ημερολόγιο</strong> → επιλέξτε το κατάλυμα → <strong>Διαθεσιμότητα</strong> → <strong>Σύνδεση ημερολογίων</strong> → <strong>Σύνδεση με άλλον ιστότοπο</strong> → αντιγράψτε τον <strong>σύνδεσμο ημερολογίου Airbnb</strong>.',
          'Η ονομασία των μενού μπορεί να διαφέρει λίγο ανάλογα με την έκδοση του Airbnb. Αναζητήστε «Σύνδεση ημερολογίων» / «Connect calendars».',
        ),
        platformBox(
          'Booking.com',
          '#003580',
          'Στο <strong>Extranet</strong>: <strong>Τιμές &amp; Διαθεσιμότητα</strong> → <strong>Συγχρονισμός ημερολογίων</strong> → <strong>Αντιγραφή συνδέσμου</strong>. Επιλέξτε να εξάγονται οι κλεισμένες <em>και</em> οι μη διαθέσιμες μέρες.',
          'Η Booking.com δίνει αυτή την επιλογή μόνο σε καταλύματα χωρίς channel manager και με έως 20 τύπους δωματίων (ένα κατάλυμα ανά τύπο). Αν δεν τη βλέπετε, συνδέστε μόνο το Airbnb.',
        ),
        cta(`${SITE}/dashboard/listings`, 'Συνδέστε το ημερολόγιό σας →', '#026aa7'),
        p('<span style="font-size:13.5px;color:#6b7280;">Κάτι δεν δουλεύει ή δεν βρίσκετε τον σύνδεσμο; Γράψτε μας από τη <a href="' + SITE + '/contact" style="color:#026aa7;font-weight:600;">φόρμα επικοινωνίας</a> και θα σας βοηθήσουμε να το συνδέσετε.</span>'),
      ].join('\n'),
    ),
  },

  // ── 1. mdeploy.gr partnership ────────────────────────────────────────
  {
    id: 'mdeploy-website',
    name: 'Συνεργασία mdeploy.gr — ιστοσελίδα 200€',
    hint: 'Για ιδιοκτήτες χωρίς δική τους ιστοσελίδα',
    emoji: '🌐',
    subject: 'Η δική σας ιστοσελίδα με 200€ — απευθείας κρατήσεις, χωρίς προμήθειες',
    body: shell(
      '#075985', '#0ea5e9',
      'ChalkidikiHub · Νέα συνεργασία',
      'Αποκτήστε τη δική σας ιστοσελίδα με 200€',
      'Σε συνεργασία με την mdeploy.gr',
      [
        p('Γεια σας,'),
        p('Τα περισσότερα καταλύματα στη Χαλκιδική βασίζονται αποκλειστικά σε πλατφόρμες τρίτων για να βρεθούν — και πληρώνουν προμήθεια σε κάθε κράτηση.'),
        p('Γι\' αυτό ξεκινήσαμε μια <strong>νέα συνεργασία με την mdeploy.gr</strong>: αναλαμβάνει την κατασκευή ιστοσελίδας για καταλύματα που δεν έχουν ακόμη δική τους, με κόστος <strong>μόνο 200€</strong>.'),
        `      <tr><td style="padding:4px 28px 18px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;">
          <tr><td style="padding:22px 20px;" align="center">
            <div style="font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#0369a1;">Κόστος κατασκευής</div>
            <div style="font-size:42px;font-weight:800;color:#0c4a6e;line-height:1.1;margin:6px 0 4px;">200€</div>
            <div style="font-size:14px;color:#1e40af;">για ολοκληρωμένη ιστοσελίδα καταλύματος</div>
          </td></tr>
        </table>
      </td></tr>`,
        `      <tr><td style="padding:2px 28px 6px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0369a1;margin-bottom:8px;">Τι περιλαμβάνει</div>
      </td></tr>`,
        `      <tr><td style="padding:0 28px 18px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;">
          <tr><td style="padding:14px 18px;">
            <div style="font-size:14.5px;line-height:1.55;color:#1f2937;padding:6px 0;"><span style="color:#16a34a;font-weight:700;">&#10003;</span>&nbsp;&nbsp;Landing page για το κατάλυμά σας</div>
            <div style="font-size:14.5px;line-height:1.55;color:#1f2937;padding:6px 0;"><span style="color:#16a34a;font-weight:700;">&#10003;</span>&nbsp;&nbsp;Responsive σχεδιασμός — σωστή εμφάνιση σε κινητό, tablet και υπολογιστή</div>
            <div style="font-size:14.5px;line-height:1.55;color:#1f2937;padding:6px 0;"><span style="color:#16a34a;font-weight:700;">&#10003;</span>&nbsp;&nbsp;Φόρμα επικοινωνίας για απευθείας αιτήματα</div>
            <div style="font-size:14.5px;line-height:1.55;color:#1f2937;padding:6px 0;"><span style="color:#16a34a;font-weight:700;">&#10003;</span>&nbsp;&nbsp;Βασικό τεχνικό SEO, ώστε να σας βρίσκει η Google</div>
            <div style="font-size:14.5px;line-height:1.55;color:#1f2937;padding:6px 0;"><span style="color:#16a34a;font-weight:700;">&#10003;</span>&nbsp;&nbsp;Φιλοξενία και SSL για 1 χρόνο</div>
          </td></tr>
        </table>
      </td></tr>`,
        `      <tr><td style="padding:10px 28px 6px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0369a1;margin-bottom:6px;">Γιατί αξίζει</div>
      </td></tr>`,
        bullets('#1e3a8a', '#f8fafc', '#e2e8f0', [
          '<strong>Κρατήσεις απευθείας από τον επισκέπτη</strong> — χωρίς προμήθειες σε κανέναν ενδιάμεσο.',
          '<strong>Ένα ακόμη κανάλι προβολής</strong>, δίπλα στην καταχώρησή σας στο ChalkidikiHub.',
          '<strong>Δική σας παρουσία στο ίντερνετ</strong> — το όνομα, οι φωτογραφίες και οι όροι σας, όπως τα θέλετε.',
          '<strong>Αξιοπιστία</strong> — ο επισκέπτης που σας βρίσκει βλέπει ένα επαγγελματικό site, όχι μόνο μια αγγελία.',
        ]),
        p('Την κατασκευή αναλαμβάνει η <a href="https://mdeploy.gr" style="color:#026aa7;font-weight:600;text-decoration:underline;">mdeploy.gr</a> — μπορείτε να δείτε τη δουλειά τους στο site τους.'),
        `      <tr><td style="padding:10px 28px 6px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0369a1;margin-bottom:6px;">Πώς δηλώνετε ενδιαφέρον</div>
      </td></tr>`,
        p('Διαλέξτε ό,τι σας βολεύει — δεν δεσμεύεστε σε τίποτα. Θα επικοινωνήσουμε μαζί σας για να δούμε τι χρειάζεται το δικό σας κατάλυμα:'),
        `      <tr><td style="padding:4px 28px 6px;" align="center">
        <a href="${INTEREST_URL}" style="display:inline-block;background:#026aa7;color:#ffffff;text-decoration:none;padding:15px 32px;border-radius:10px;font-size:16px;font-weight:700;">✍️ Δηλώνω ενδιαφέρον — 1 λεπτό</a>
        <div style="font-size:12.5px;color:#6b7280;margin-top:10px;">Σύντομη φόρμα, συμπληρωμένη εκ των προτέρων. Δεν χρειάζεται λογαριασμός.</div>
      </td></tr>`,
        `      <tr><td style="padding:14px 28px 6px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="45%" style="border-top:1px solid #e5e7eb;font-size:0;line-height:0;">&nbsp;</td>
            <td align="center" style="padding:0 12px;font-size:12px;color:#9ca3af;white-space:nowrap;">ή</td>
            <td width="45%" style="border-top:1px solid #e5e7eb;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
        </table>
      </td></tr>`,
        p('<strong>Απαντήστε απλώς σε αυτό το email</strong> γράφοντας «με ενδιαφέρει» — το διαβάζουμε και επικοινωνούμε μαζί σας.'),
        `      <tr><td style="padding:10px 28px 4px;" align="center">
        <a href="https://mdeploy.gr" style="display:inline-block;background:#ffffff;color:#026aa7;text-decoration:none;padding:12px 26px;border-radius:10px;font-size:14px;font-weight:700;border:1px solid #bfdbfe;">Δείτε πρώτα το mdeploy.gr →</a>
      </td></tr>`,
        p('<span style="font-size:13.5px;color:#6b7280;">Η προσφορά αφορά ιδιοκτήτες καταλυμάτων που είναι ήδη καταχωρημένοι στο ChalkidikiHub.</span>'),
      ].join('\n'),
    ),
  },

  // ── 5. Booking.com VAT change vs our model ───────────────────────────
  {
    id: 'booking-vat-2026',
    name: 'Booking 20,58% vs εμείς 0%',
    hint: 'Η αλλαγή ΦΠΑ της Booking από 1/12/2026',
    emoji: '📉',
    subject: 'Από 1η Δεκεμβρίου η Booking κρατά 20,58%. Εμείς συνεχίζουμε με 0%.',
    body: shell(
      '#7f1d1d', '#dc2626',
      'ChalkidikiHub · Ενημέρωση',
      'Η προμήθεια της Booking μόλις ακρίβυνε',
      'Τι αλλάζει από 1η Δεκεμβρίου 2026',
      [
        p('Γεια σας,'),
        p('Από <strong>1η Δεκεμβρίου 2026</strong>, η Booking.com χρεώνει <strong>ΦΠΑ 24% πάνω στην προμήθειά της</strong> σε ιδιώτες οικοδεσπότες που δεν έχουν ΑΦΜ καταχωρημένο στο VIES.'),
        p('Το ποσοστό της προμήθειας δεν άλλαξε. Άλλαξε το τι πληρώνετε πάνω σε αυτήν: με προμήθεια 16,6%, η <strong>πραγματική επιβάρυνση γίνεται 20,58%</strong>.'),
        `      <tr><td style="padding:10px 28px 6px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#b91c1c;margin-bottom:8px;">Σε μια κράτηση 1.000 €</div>
      </td></tr>`,
        `      <tr><td style="padding:0 28px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:10px 12px;border-bottom:2px solid #e5e7eb;"></td>
            <td align="right" style="padding:10px 12px;border-bottom:2px solid #e5e7eb;font-weight:700;color:#991b1b;white-space:nowrap;">Booking.com</td>
            <td align="right" style="padding:10px 12px;border-bottom:2px solid #e5e7eb;font-weight:700;color:#047857;white-space:nowrap;">ChalkidikiHub</td>
          </tr>
          <tr>
            <td style="padding:9px 12px;border-bottom:1px solid #f1f5f9;color:#374151;">Προμήθεια</td>
            <td align="right" style="padding:9px 12px;border-bottom:1px solid #f1f5f9;white-space:nowrap;">166,00 €</td>
            <td align="right" style="padding:9px 12px;border-bottom:1px solid #f1f5f9;white-space:nowrap;">0,00 €</td>
          </tr>
          <tr>
            <td style="padding:9px 12px;border-bottom:1px solid #f1f5f9;color:#374151;">ΦΠΑ 24% επί προμήθειας</td>
            <td align="right" style="padding:9px 12px;border-bottom:1px solid #f1f5f9;white-space:nowrap;">39,84 €</td>
            <td align="right" style="padding:9px 12px;border-bottom:1px solid #f1f5f9;white-space:nowrap;">—</td>
          </tr>
          <tr>
            <td style="padding:12px;background:#f8fafc;font-weight:700;color:#111827;">Καθαρά σε εσάς</td>
            <td align="right" style="padding:12px;background:#fef2f2;font-weight:700;color:#991b1b;white-space:nowrap;">794,16 €</td>
            <td align="right" style="padding:12px;background:#f0fdf4;font-weight:700;color:#047857;white-space:nowrap;">1.000,00 €</td>
          </tr>
        </table>
      </td></tr>`,
        p('<span style="font-size:12.5px;color:#6b7280;">Το παράδειγμα χρησιμοποιεί προμήθεια 16,6%· η δική σας μπορεί να διαφέρει. Η χρέωση αφορά όσους δεν έχουν ΑΦΜ στο VIES — προθεσμία καταχώρησης ΑΦΜ στη Booking: <strong>31 Οκτωβρίου 2026</strong>.</span>'),
        `      <tr><td style="padding:14px 28px 6px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#047857;margin-bottom:6px;">Η διαφορά μας</div>
      </td></tr>`,
        bullets('#065f46', '#f0fdf4', '#bbf7d0', [
          '<strong>0% προμήθεια στις κρατήσεις.</strong> Ο επισκέπτης επικοινωνεί απευθείας μαζί σας — δεν μεσολαβούμε στην πληρωμή και δεν κρατάμε τίποτα.',
          '<strong>Σταθερό κόστος, όχι ποσοστό.</strong> Δωρεάν έως 31/12/2026, μετά 90€/έτος ανά κατάλυμα — είτε κάνετε 5 κρατήσεις είτε 50.',
          '<strong>Η καταχώρησή σας σε 7 γλώσσες</strong>, με το δικό σας τηλέφωνο και email στη σελίδα.',
        ]),
        p('Δεν σας λέμε να φύγετε από τη Booking — για πολλούς είναι σημαντικό κανάλι. Σας λέμε ότι κάθε κράτηση που έρχεται απευθείας είναι μια κράτηση που κρατάτε ολόκληρη, και ότι αυτό μετράει περισσότερο από πριν.'),
        cta('https://chalkidikihub.gr/dashboard', 'Δείτε την καταχώρησή σας →', '#047857'),
        p('<span style="font-size:13.5px;color:#6b7280;">Αναλυτικά τι αλλάζει, με παραδείγματα και προθεσμίες, στο <a href="https://chalkidikihub.gr/blog/booking-com-fpa-24-promitheia-idiotes" style="color:#026aa7;font-weight:600;">άρθρο μας</a>. Δεν αποτελεί φορολογική συμβουλή — για το δικό σας καθεστώς, μιλήστε με τον λογιστή σας.</span>'),
      ].join('\n'),
    ),
  },

  // ── 2. Welcome / listing is live ─────────────────────────────────────
  {
    id: 'welcome-owner',
    name: 'Καλωσόρισμα ιδιοκτήτη',
    hint: 'Τι κερδίζει από την καταχώρηση, τι να κάνει μετά',
    emoji: '👋',
    subject: 'Καλώς ήρθατε στο ChalkidikiHub — τι μπορείτε να κάνετε από σήμερα',
    body: shell(
      '#15803d', '#16a34a',
      'ChalkidikiHub',
      'Καλώς ήρθατε',
      'Η καταχώρησή σας είναι ενεργή',
      [
        p('Γεια σας,'),
        p('Χαιρόμαστε που είστε μαζί μας. Το ChalkidikiHub προβάλλει καταλύματα της Χαλκιδικής σε επισκέπτες που ψάχνουν <strong>απευθείας</strong> τον ιδιοκτήτη — χωρίς μεσάζοντες.'),
        bullets('#166534', '#f0fdf4', '#bbf7d0', [
          '<strong>0% προμήθεια</strong> στις κρατήσεις σας. Πάντα.',
          '<strong>Η καταχώρησή σας σε 7 γλώσσες</strong> — ελληνικά, αγγλικά, γερμανικά, ρουμανικά, σερβικά, βουλγαρικά, ρωσικά.',
          '<strong>Αιτήματα διαθεσιμότητας</strong> από επισκέπτες, απευθείας στο email σας.',
          '<strong>Δωρεάν έως 31/12/2026</strong>, μετά 90€/έτος ανά κατάλυμα.',
        ]),
        p('Για να αποδώσει καλύτερα η καταχώρησή σας, φροντίστε να έχετε <strong>καθαρές φωτογραφίες</strong>, <strong>ενημερωμένη τιμή</strong> και <strong>σωστό τηλέφωνο επικοινωνίας</strong>.'),
        cta('https://chalkidikihub.gr/dashboard', 'Άνοιγμα πίνακα ελέγχου →', '#16a34a'),
      ].join('\n'),
    ),
  },

  // ── 3. Last-minute availability push ─────────────────────────────────
  {
    id: 'last-minute',
    name: 'Προσφορές τελευταίας στιγμής',
    hint: 'Κάλεσμα να δηλώσουν κενές ημερομηνίες',
    emoji: '⚡',
    subject: 'Έχετε κενές ημέρες; Δηλώστε τις και προβάλλονται στην αρχική',
    body: shell(
      '#b45309', '#f59e0b',
      'ChalkidikiHub · Τελευταία στιγμή',
      'Μην αφήσετε ημέρες κενές',
      'Οι προσφορές σας μπροστά στους επισκέπτες',
      [
        p('Γεια σας,'),
        p('Μια κενή ημερομηνία δεν φέρνει τίποτα. Μια δηλωμένη προσφορά τελευταίας στιγμής, όμως, <strong>προβάλλεται στην αρχική σελίδα</strong> του ChalkidikiHub και φτάνει σε επισκέπτες που ψάχνουν <em>τώρα</em>.'),
        bullets('#92400e', '#fffbeb', '#fde68a', [
          'Εμφανίζεται σε <strong>όλους τους επισκέπτες</strong> της αρχικής.',
          'Κοινοποιείται και στα <strong>social</strong> μας.',
          'Δηλώνετε μόνο τις ημερομηνίες που θέλετε — <strong>χωρίς δέσμευση</strong>.',
        ]),
        p('Χρειάζεται λιγότερο από ένα λεπτό από τον πίνακα ελέγχου σας.'),
        cta('https://chalkidikihub.gr/dashboard', 'Δήλωση ημερομηνιών →', '#d97706'),
      ].join('\n'),
    ),
  },

  // ── 4. Pre-season housekeeping ───────────────────────────────────────
  {
    id: 'pre-season',
    name: 'Υπενθύμιση πριν τη σεζόν',
    hint: 'Ενημέρωση φωτογραφιών, τιμών και στοιχείων',
    emoji: '🗓️',
    subject: 'Η σεζόν πλησιάζει — 5 λεπτά για να είναι έτοιμη η καταχώρησή σας',
    body: shell(
      '#0c4a6e', '#0284c7',
      'ChalkidikiHub',
      'Ετοιμάστε την καταχώρησή σας',
      'Πέντε λεπτά τώρα, περισσότερες κρατήσεις μετά',
      [
        p('Γεια σας,'),
        p('Οι επισκέπτες έχουν ήδη αρχίσει να ψάχνουν για φέτος. Πριν το κύμα των αναζητήσεων, αξίζει ένας γρήγορος έλεγχος:'),
        bullets('#075985', '#f0f9ff', '#bae6fd', [
          '📸 <strong>Φωτογραφίες</strong> — η πρώτη εικόνα κρίνει αν θα ανοίξει κανείς την καταχώρηση.',
          '💶 <strong>Τιμή ανά βράδυ</strong> — μια παλιά τιμή κοστίζει αξιοπιστία.',
          '📞 <strong>Τηλέφωνο & email</strong> — εκεί φτάνουν τα αιτήματα των επισκεπτών.',
          '📝 <strong>Περιγραφή & παροχές</strong> — όσα δηλώσετε, τόσα φίλτρα σας βρίσκουν.',
        ]),
        p('Κάθε αλλαγή μεταφράζεται αυτόματα και στις 7 γλώσσες του site.'),
        cta('https://chalkidikihub.gr/dashboard', 'Έλεγχος καταχώρησης →', '#0284c7'),
      ].join('\n'),
    ),
  },
];
