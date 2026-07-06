// Enhance restaurant descriptions: expand from ~180 to ~250 words with
// location context, price range, best dishes, practical hours.
// Uses GPT-4o-mini with structured prompt.
//
// Usage:
//   node scripts/enhance-restaurants.js --commit
//   node scripts/enhance-restaurants.js --commit --limit 5  # test first

const fs = require('fs');
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const DRY = !process.argv.includes('--commit');
const LIMIT = (() => {
  const i = process.argv.indexOf('--limit');
  return i >= 0 ? parseInt(process.argv[i + 1]) : (DRY ? 3 : Infinity);
})();

const AREA_EL = { kassandra: 'Κασσάνδρα', sithonia: 'Σιθωνία', athos: 'Άθω / Ουρανούπολη', mainland: 'κεντρική Χαλκιδική' };

async function enhance(rest) {
  const area = AREA_EL[rest.area] || rest.area;
  const prompt = `Βελτίωσε την παρακάτω ελληνική περιγραφή εστιατορίου/καφέ/bar στη Χαλκιδική.

ΟΔΗΓΙΕΣ:
- Κράτα την υπάρχουσα δομή και τα headings (## χωρίς αλλαγές)
- Πρόσθεσε 40-60 λέξεις με χρήσιμες πρακτικές πληροφορίες που λείπουν (π.χ. τιμή γεύματος, ώρες, parking, κατηγορία πελατολογίου)
- Απόφυγε clichés ("μαγευτική εμπειρία", "μοναδικές γεύσεις")
- Γράψε σε 2ο/3ο πρόσωπο, πρακτικό ύφος
- Προσθήκη πληροφοριών: τιμές (σε ευρώ, εκτιμώμενο τραπέζι για 2), εποχή λειτουργίας, αν υπάρχει χώρος στάθμευσης
- ΜΗΝ αλλάξεις το όνομα, τα highlights ή τα βασικά facts
- Περιοχή: ${area}

ΥΠΑΡΧΟΥΣΑ ΠΕΡΙΓΡΑΦΗ:
${rest.description_el}

Επέστρεψε ΜΟΝΟ τη βελτιωμένη περιγραφή, χωρίς επεξήγηση.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.4, max_tokens: 1500 }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  return (await res.json()).choices[0].message.content.trim();
}

(async () => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?select=slug,name_el,area,description_el&order=slug`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  const restaurants = await r.json();
  const todo = restaurants.filter(r => r.description_el && r.description_el.length > 50).slice(0, LIMIT);
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'} | ${todo.length} restaurants`);

  for (const rest of todo) {
    const beforeWords = rest.description_el.split(/\s+/).filter(Boolean).length;
    try {
      const enhanced = await enhance(rest);
      const afterWords = enhanced.split(/\s+/).filter(Boolean).length;
      if (DRY) {
        console.log(`  ${rest.slug}: ${beforeWords}→${afterWords}w [DRY]`);
        console.log('  ', enhanced.substring(0, 100) + '...');
        continue;
      }
      const up = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?slug=eq.${encodeURIComponent(rest.slug)}`, {
        method: 'PATCH',
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ description_el: enhanced, updated_at: new Date().toISOString() }),
      });
      console.log(`  ${rest.slug}: ${beforeWords}→${afterWords}w ${up.ok ? 'OK' : 'FAIL ' + up.status}`);
    } catch (e) {
      console.error(`  ${rest.slug}: ERROR ${e.message}`);
    }
  }
  console.log('\nDone!');
})();
