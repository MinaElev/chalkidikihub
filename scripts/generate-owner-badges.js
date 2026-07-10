/**
 * Generates the "Featured on ChalkidikiHub" owner-badge material:
 *   marketing/guest-qr/badges.html   — self-contained page: one copyable HTML
 *                                      snippet per published listing (badge links
 *                                      to the listing page with owner-badge UTMs)
 *   marketing/guest-qr/owner-message.txt — rewritten to include the badge ask
 *
 * Every owner that pastes the badge on their site/blog gives the directory a
 * topical local backlink — 111 listings = the cheapest link building there is.
 *
 * Run: node scripts/generate-owner-badges.js
 */
const path = require('path');
const fs = require('fs');

for (const line of fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OUT = path.join(__dirname, '..', 'marketing', 'guest-qr');
fs.mkdirSync(OUT, { recursive: true });

const badgeSnippet = (slug) =>
  `<a href="https://chalkidikihub.gr/listings/${slug}?utm_source=owner-badge&utm_medium=referral&utm_campaign=featured_badge" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border:1.5px solid #0c4a6e;border-radius:999px;background:#fff;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#0c4a6e;text-decoration:none;font-weight:700">⭐ Featured on ChalkidikiHub</a>`;

async function fetchAllListings() {
  const all = [];
  for (let from = 0; ; from += 100) {
    const res = await fetch(
      `${URL}/rest/v1/listings?select=slug,title_el&status=eq.published&order=title_el&limit=100&offset=${from}`,
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

  const rows = listings
    .map((l) => {
      const snippet = badgeSnippet(l.slug);
      const escaped = snippet.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      return `
  <div class="row">
    <div class="name">${(l.title_el || l.slug).trim()}</div>
    <div class="preview">${snippet}</div>
    <textarea readonly onclick="this.select()">${escaped}</textarea>
  </div>`;
    })
    .join('\n');

  const html = `<!doctype html>
<html lang="el">
<head>
<meta charset="utf-8"/>
<title>ChalkidikiHub — Owner badges</title>
<style>
  * { box-sizing: border-box; margin: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f1f5f9; padding: 24px; max-width: 860px; margin: 0 auto; }
  h1 { color: #0c4a6e; font-size: 22px; margin-bottom: 6px; }
  p.lead { color: #475569; font-size: 14px; margin-bottom: 20px; }
  .row { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; }
  .name { font-weight: 700; color: #0f172a; margin-bottom: 8px; }
  .preview { margin-bottom: 8px; }
  textarea { width: 100%; height: 64px; font: 11px/1.4 Consolas, monospace; color: #334155; border: 1px dashed #94a3b8; border-radius: 8px; padding: 8px; background: #f8fafc; }
</style>
</head>
<body>
<h1>⭐ Owner badges — «Featured on ChalkidikiHub»</h1>
<p class="lead">Ένα snippet ανά κατάλυμα. Στείλ' το στον ιδιοκτήτη να το κολλήσει στο site/blog του — κάθε badge είναι ένα backlink προς τη σελίδα του στο ChalkidikiHub. Κλικ στο κείμενο = επιλογή όλου του κώδικα.</p>
${rows}
</body>
</html>`;

  fs.writeFileSync(path.join(OUT, 'badges.html'), html);

  const msg = `Καλησπέρα! 👋

Ετοιμάσαμε δύο πράγματα για το κατάλυμά σας από το ChalkidikiHub:

1) QR ΚΑΡΤΑ ΓΙΑ ΤΟΥΣ ΕΠΙΣΚΕΠΤΕΣ ΣΑΣ
Οι επισκέπτες τη σκανάρουν και βλέπουν αμέσως τις κοντινές παραλίες, ταβέρνες και δραστηριότητες γύρω από το κατάλυμα — στη γλώσσα τους, χωρίς εφαρμογές. Σας τη στέλνουμε συνημμένη για εκτύπωση (προτεινόμενα σημεία: πόρτα ψυγείου, είσοδος, welcome book). Οι επισκέπτες αφήνουν και γρήγορες κριτικές για τα μέρη που δοκίμασαν — κάτι που ανεβάζει την προβολή της περιοχής και του καταλύματός σας στην Google και στα AI εργαλεία (ChatGPT κ.λπ.).

2) BADGE «FEATURED ON CHALKIDIKIHUB» ΓΙΑ ΤΟ SITE ΣΑΣ
Αν έχετε δικό σας site ή blog, σας στέλνουμε ένα μικρό σήμα-κουμπί που δείχνει στη σελίδα του καταλύματός σας στο ChalkidikiHub. Το κολλάτε με copy-paste (30 δευτερόλεπτα) — δίνει κύρος στο site σας και βοηθά τη σελίδα σας να ανεβαίνει ψηλότερα στις αναζητήσεις.

Αν θέλετε οποιαδήποτε αλλαγή (μέγεθος, γλώσσα, αυτοκόλλητο αντί για κάρτα), πείτε το μας!

Ευχαριστούμε,
ChalkidikiHub — chalkidikihub.gr`;
  fs.writeFileSync(path.join(OUT, 'owner-message.txt'), msg);

  console.log(`✓ badges.html (${listings.length} snippets)`);
  console.log('✓ owner-message.txt updated (QR + badge ask)');
})().catch((e) => {
  console.error('Failed:', e);
  process.exit(1);
});
