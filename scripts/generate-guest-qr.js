/**
 * Generates per-listing QR material for the guest-concierge review flow.
 *
 * For every published listing it creates a QR pointing to
 *   https://chalkidikihub.gr/guest/<slug>?utm_source=qr&utm_medium=print&utm_campaign=guest_concierge
 * and writes:
 *   marketing/guest-qr/png/<slug>.png          — 1200px QR for stickers
 *   marketing/guest-qr/print-sheet.html        — self-contained A4 sheet (2 cards/page,
 *                                                QRs embedded as data URIs) ready to print
 *   marketing/guest-qr/owner-message.txt       — Greek message to send owners with the QR
 *
 * Run: node scripts/generate-guest-qr.js
 */
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

for (const line of fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const OUT = path.join(__dirname, '..', 'marketing', 'guest-qr');
const PNG_DIR = path.join(OUT, 'png');
fs.mkdirSync(PNG_DIR, { recursive: true });

const guestUrl = (slug) =>
  `https://chalkidikihub.gr/guest/${slug}?utm_source=qr&utm_medium=print&utm_campaign=guest_concierge`;

async function fetchAllListings() {
  const all = [];
  for (let from = 0; ; from += 100) {
    const res = await fetch(
      `${URL}/rest/v1/listings?select=slug,title_el,location_name&status=eq.published&order=title_el&limit=100&offset=${from}`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
    );
    if (!res.ok) throw new Error(`listings: ${res.status}`);
    const page = await res.json();
    all.push(...page);
    if (page.length < 100) return all;
  }
}

(async () => {
  const listings = await fetchAllListings();
  console.log(`Published listings: ${listings.length}`);

  const cards = [];
  for (const l of listings) {
    const url = guestUrl(l.slug);
    // Sticker PNG
    await QRCode.toFile(path.join(PNG_DIR, `${l.slug}.png`), url, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 1200,
      margin: 2,
      color: { dark: '#0c4a6eff', light: '#ffffffff' },
    });
    // Data URI for the print sheet
    const dataUri = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      width: 520,
      margin: 2,
      color: { dark: '#0c4a6e', light: '#ffffff' },
    });
    cards.push({ ...l, dataUri });
  }

  const cardHtml = cards
    .map(
      (c) => `
  <div class="card">
    <div class="head">
      <div class="brand">ChalkidikiHub</div>
      <div class="title">${(c.title_el || c.slug).trim()}</div>
      <div class="loc">${c.location_name || ''}</div>
    </div>
    <img class="qr" src="${c.dataUri}" alt="QR" />
    <div class="cta">
      <p class="el">Σκανάρετε για τον <strong>οδηγό της περιοχής</strong>:<br/>παραλίες, ταβέρνες &amp; tips γύρω σας</p>
      <p class="en">Scan for your <strong>local guide</strong>:<br/>beaches, tavernas &amp; tips around you</p>
      <p class="review">⭐ Πείτε μας τη γνώμη σας — Leave a quick review</p>
    </div>
  </div>`,
    )
    .join('\n');

  const html = `<!doctype html>
<html lang="el">
<head>
<meta charset="utf-8"/>
<title>ChalkidikiHub — Guest QR print sheet</title>
<style>
  * { box-sizing: border-box; margin: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f1f5f9; padding: 16px; }
  .sheet { display: grid; grid-template-columns: 1fr; gap: 12px; max-width: 148mm; margin: 0 auto; }
  .card {
    background: #fff; border: 2px solid #0c4a6e; border-radius: 14px;
    padding: 10mm 8mm; text-align: center; page-break-inside: avoid;
    height: 130mm; display: flex; flex-direction: column; justify-content: space-between;
  }
  .brand { color: #0c4a6e; font-weight: 800; letter-spacing: .4px; font-size: 13px; text-transform: uppercase; }
  .title { font-size: 19px; font-weight: 700; color: #0f172a; margin-top: 2mm; }
  .loc { font-size: 12px; color: #64748b; }
  .qr { width: 62mm; height: 62mm; margin: 3mm auto; }
  .cta .el { font-size: 13px; color: #0f172a; }
  .cta .en { font-size: 12px; color: #475569; margin-top: 1.5mm; }
  .review { margin-top: 2.5mm; font-size: 12px; color: #b45309; font-weight: 600; }
  @media print {
    body { background: #fff; padding: 0; }
    .sheet { max-width: none; }
    .card { border-width: 1.5pt; }
  }
</style>
</head>
<body>
<div class="sheet">
${cardHtml}
</div>
</body>
</html>`;

  fs.writeFileSync(path.join(OUT, 'print-sheet.html'), html);

  const msg = `Καλησπέρα! 👋

Ετοιμάσαμε για το κατάλυμά σας ένα QR από το ChalkidikiHub: οι επισκέπτες σας το σκανάρουν και βλέπουν αμέσως τις κοντινές παραλίες, ταβέρνες και δραστηριότητες γύρω από το κατάλυμα — στη γλώσσα τους, χωρίς εφαρμογές.

Σας στέλνουμε συνημμένη την κάρτα για εκτύπωση. Προτεινόμενα σημεία: πόρτα ψυγείου, είσοδος, welcome book.

Μας βοηθάει πολύ και εσάς και εμάς: οι επισκέπτες αφήνουν και γρήγορες κριτικές για τις παραλίες/ταβέρνες που δοκίμασαν, κάτι που ανεβάζει την προβολή όλης της περιοχής (και του καταλύματός σας) στην Google και στα AI εργαλεία.

Αν θέλετε αλλαγή (μέγεθος, γλώσσα, αυτοκόλλητο αντί για κάρτα), πείτε το μας!

Ευχαριστούμε,
ChalkidikiHub — chalkidikihub.gr`;
  fs.writeFileSync(path.join(OUT, 'owner-message.txt'), msg);

  console.log(`✓ ${cards.length} QR PNGs -> marketing/guest-qr/png/`);
  console.log('✓ print-sheet.html (all cards, self-contained, A5-sized cards)');
  console.log('✓ owner-message.txt');
})().catch((e) => {
  console.error('Failed:', e);
  process.exit(1);
});
