// Generate unique Greek descriptions for beaches that don't have one yet.
//
// Usage:
//   node scripts/generate-beach-descriptions.js              # dry-run, prints 3 samples
//   node scripts/generate-beach-descriptions.js --limit 5    # dry-run, 5 samples
//   node scripts/generate-beach-descriptions.js --commit     # generate + write all empty
//   node scripts/generate-beach-descriptions.js --commit --limit 20  # only first 20
//
// Strategy: each beach gets a different "style" + "tone" seed, real facts
// (name, peninsula, nearest village from lat/lng), and is asked NOT to use
// clichés ("κρυστάλλινα νερά" etc.). Output is varied, factual, non-templated.
//
// Cost: gpt-4o-mini ~$0.0005 per beach. 140 beaches ≈ $0.07.

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) { console.error('Missing Supabase env'); process.exit(1); }

const DRY_RUN = !process.argv.includes('--commit');
const LIMIT = (() => {
  const i = process.argv.indexOf('--limit');
  return i >= 0 ? parseInt(process.argv[i + 1], 10) : (DRY_RUN ? 3 : Infinity);
})();

// Anchor villages for nearest-village hint. Approximate centroids.
const VILLAGES = [
  // Kassandra
  ['Κασσανδρεία', 40.0691, 23.3942], ['Νέα Φώκαια', 40.1494, 23.3331],
  ['Καλλιθέα', 40.0533, 23.4156], ['Κρυοπηγή', 40.0314, 23.4011],
  ['Πολύχρονο', 40.0150, 23.3922], ['Χανιώτη', 40.0008, 23.5760],
  ['Πευκοχώρι', 39.9933, 23.6080], ['Παλιούρι', 39.9325, 23.6710],
  ['Σκάλα Φούρκας', 40.0928, 23.4399], ['Φούρκα', 40.1056, 23.4517],
  ['Νέα Σκιώνη', 39.9447, 23.5471], ['Λουτρά Αγίας Παρασκευής', 39.9544, 23.6498],
  ['Σάνη', 40.0844, 23.3208], ['Άφυτος', 40.1014, 23.4317],
  ['Σιβηρή', 39.9853, 23.4639], ['Πευκοχώρι', 39.9933, 23.6080],
  ['Νέα Πλάγια', 40.2596, 23.2169], ['Φλογητά', 40.2554, 23.2110],
  ['Νέα Καλλικράτεια', 40.3148, 23.0654], ['Σωζόπολη', 40.1655, 23.3261],
  ['Μόλα Καλύβα', 40.1764, 23.3270], ['Μηλιά', 40.0510, 23.5500],
  // Sithonia
  ['Νικήτη', 40.2128, 23.6629], ['Νέος Μαρμαράς', 40.0950, 23.7806],
  ['Ορμός Παναγίας', 40.2356, 23.7338], ['Βουρβουρού', 40.1864, 23.7861],
  ['Σάρτη', 40.0917, 23.9789], ['Σύκια', 40.0376, 23.9381],
  ['Καλαμίτσι', 39.9912, 23.9919], ['Τορώνη', 39.9856, 23.8975],
  ['Πόρτο Κουφό', 39.9650, 23.9230], ['Μεταγγίτσι', 40.3187, 23.8090],
  ['Άγιος Νικόλαος Σιθωνίας', 40.2350, 23.7197], ['Παρθενώνας', 40.1300, 23.8120],
  // Athos / mainland east
  ['Ουρανούπολη', 40.3247, 23.9826], ['Ιερισσός', 40.3950, 23.8867],
  ['Στρατώνι', 40.5074, 23.8261], ['Νέα Ρόδα', 40.3669, 23.9367],
  ['Πυργαδίκια', 40.3530, 23.7295], ['Νεοχώρι Χαλκιδικής', 40.3681, 23.7898],
  ['Γομάτι', 40.4314, 23.8231], ['Στάγειρα', 40.5347, 23.7505],
  ['Ολυμπιάδα', 40.5944, 23.7964], ['Στρατονίκη', 40.5172, 23.8120],
  ['Άγιος Παύλος', 40.4275, 23.6878], ['Νικήτη', 40.2128, 23.6629],
  // Mainland north
  ['Πορταριά', 40.2972, 23.1842], ['Άγιος Μάμας', 40.2376, 23.3406],
  ['Καλλιθέα Χαλκιδικής', 40.2733, 23.2456], ['Ψακούδια', 40.2542, 23.4942],
  ['Γερακινή', 40.2614, 23.4544], ['Μεταμόρφωση', 40.2731, 23.4253],
  ['Καλύβες Πολυγύρου', 40.3253, 23.3961], ['Πολύγυρος', 40.3795, 23.4444],
  ['Βραστά', 40.4256, 23.4097], ['Βάρβαρα', 40.4886, 23.5658],
  ['Παλαιοχώρι', 40.5694, 23.6906],
];

function haversineM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function nearestVillage(lat, lon) {
  let best = null, bestDist = Infinity;
  for (const [name, vLat, vLon] of VILLAGES) {
    const d = haversineM(lat, lon, vLat, vLon);
    if (d < bestDist) { bestDist = d; best = name; }
  }
  return { name: best, distKm: Math.round(bestDist / 100) / 10 };
}

const AREA_EL = {
  kassandra: 'χερσόνησο της Κασσάνδρας',
  sithonia: 'χερσόνησο της Σιθωνίας',
  athos: 'χερσόνησο του Άθω',
  mainland: 'ηπειρωτική Χαλκιδική',
};

// 8 structural styles to randomize opening + ordering of info
const STYLES = [
  'Ξεκίνα από την πρόσβαση και πώς φτάνει κάποιος εκεί, μετά πέρασε στο τοπίο και τη φύση γύρω.',
  'Άνοιξε με μια εικόνα του τοπίου (βλάστηση, βράχια, σχήμα ακτής), και κλείσε με πρακτικές πληροφορίες.',
  'Ξεκίνα τοποθετώντας την παραλία γεωγραφικά (σχέση με κοντινό χωριό/περιοχή), μετά περιέγραψε το νερό και την άμμο.',
  'Άρχισε με το χαρακτήρα της παραλίας (ήσυχη, οργανωμένη, για ψάρεμα κ.λπ.) και τι ταιριάζει σε ποιον.',
  'Βάλε πρώτα μια λεπτομέρεια που τη ξεχωρίζει (π.χ. απόμερη, βότσαλο, ηλιοβασίλεμα), μετά τα γενικά.',
  'Πλαισίωσέ τη σαν στάση μέσα σε μια ευρύτερη διαδρομή στην περιοχή — τι έχει γύρω.',
  'Δώσε έμφαση στο νερό (διαύγεια, βάθος, χρώμα από τη γεωλογία) και πες ποια ώρα της ημέρας είναι καλύτερη.',
  'Ξεκίνα με ιστορική/ετυμολογική παρατήρηση αν το όνομα έχει νόημα, αλλιώς με τη φυσική γεωγραφία.',
];

const TONES = [
  'καθημερινός, φιλικός — σαν να μιλάει ντόπιος σε επισκέπτη',
  'περιγραφικός και ήρεμος — λογοτεχνικός χωρίς εξεζητημένο λεξιλόγιο',
  'πρακτικός, σαν οδηγός ταξιδίου — στοιχεία και κατευθύνσεις',
];

function buildPrompt(beach) {
  const village = nearestVillage(beach.latitude, beach.longitude);
  const style = STYLES[Math.floor(Math.random() * STYLES.length)];
  const tone = TONES[Math.floor(Math.random() * TONES.length)];
  const len = 80 + Math.floor(Math.random() * 40); // 80-120 words variation

  const nameClean = beach.name_el.replace(/^Παραλία\s+/, '').trim();

  return `Γράψε ένα μοναδικό κείμενο ${len} λέξεων στα ελληνικά για την παραλία "${beach.name_el}" στη Χαλκιδική.

ΠΡΑΓΜΑΤΙΚΑ ΣΤΟΙΧΕΙΑ:
- Ονομασία: ${beach.name_el}
- Περιοχή: ${AREA_EL[beach.area] || 'Χαλκιδική'}
- Πλησιέστερο χωριό: ${village.name} (~${village.distKm} χλμ)
- Συντεταγμένες: ${beach.latitude.toFixed(4)}, ${beach.longitude.toFixed(4)}

ΔΟΜΗ ΑΥΤΟΥ ΤΟΥ ΚΕΙΜΕΝΟΥ: ${style}
ΥΦΟΣ: ${tone}

ΚΑΝΟΝΕΣ — ΥΠΟΧΡΕΩΤΙΚΟ ΝΑ ΤΗΡΗΘΟΥΝ:
1. ΑΠΑΓΟΡΕΥΟΝΤΑΙ τα clichés: "κρυστάλλινα νερά", "γαλαζοπράσινα νερά", "παράδεισος", "εξωτικός προορισμός", "must-visit", "ιδανική για", "συνδυάζει".
2. ΜΗΝ ξεκινάς με "Η παραλία...". Βρες άλλη αρχή.
3. ΜΗΝ ψεύδεσαι: αν δεν ξέρεις σίγουρα κάτι (π.χ. αν έχει beach bar, αν είναι αμμώδης ή με βότσαλο), μη το αναφέρεις. Μείνε σε πληροφορίες που μπορούν να συμπεραθούν από τη θέση και το όνομα.
4. Αναφέρσου σε πραγματικά κοντινά τοπωνύμια (${village.name}, ${AREA_EL[beach.area]}).
5. Όχι bullet points, όχι headings — απλό τρέχον κείμενο, ένα ή δύο παραγράφους.
6. Όχι meta-σχόλια ("σε αυτό το κείμενο θα...").
7. Απάντησε ΜΟΝΟ με το κείμενο, χωρίς εισαγωγή ή τίτλο.

Γράψε τώρα.`;
}

async function callOpenAI(prompt) {
  if (!OPENAI_KEY) {
    // try fetch from site_settings
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?key=eq.openai_api_key&select=value`, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    });
    const rows = await res.json();
    const key = rows?.[0]?.value;
    if (!key) throw new Error('No OPENAI_API_KEY in env or site_settings');
    process.env.OPENAI_API_KEY = key;
  }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.95,
      top_p: 0.92,
      presence_penalty: 0.6,
      frequency_penalty: 0.5,
      max_tokens: 500,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

(async () => {
  // Fetch beaches with empty description_el
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/beaches?select=id,slug,name_el,area,latitude,longitude,description_el&or=(description_el.is.null,description_el.eq.)&order=slug.asc`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  if (!res.ok) { console.error('Fetch failed:', await res.text()); process.exit(1); }
  const all = await res.json();
  const beaches = all.slice(0, LIMIT);
  console.log(`Found ${all.length} beaches without description_el. Processing ${beaches.length}.`);

  let done = 0, failed = 0;
  for (const b of beaches) {
    const prompt = buildPrompt(b);
    try {
      const text = await callOpenAI(prompt);
      console.log(`\n--- ${b.slug} (${b.area}) ---`);
      console.log(text);

      if (!DRY_RUN) {
        const upd = await fetch(`${SUPABASE_URL}/rest/v1/beaches?id=eq.${b.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({ description_el: text }),
        });
        if (!upd.ok) {
          console.error(`  PATCH failed: ${upd.status} ${await upd.text()}`);
          failed++; continue;
        }
      }
      done++;
      // small pacing delay
      await new Promise(r => setTimeout(r, 250));
    } catch (e) {
      console.error(`  ${b.slug}: ${e.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${done} generated, ${failed} failed. ${DRY_RUN ? '(dry run — pass --commit to save)' : ''}`);
})();
