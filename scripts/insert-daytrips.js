// Insert 6 day-trip blog articles.
const fs = require('fs'), path = require('path');
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !process.argv.includes('--commit');

const ARTICLES = [
  { slug: 'best-day-trips-from-halkidiki', file: 'best-day-trips-from-halkidiki.html',
    title: 'Καλύτερες Ημερήσιες Εκδρομές από τη Χαλκιδική', read_time: 6,
    excerpt: 'Θεσσαλονίκη, Βεργίνα, Όλυμπος, Έδεσσα, Μετέωρα — οι καλύτερες ημερήσιες εκδρομές από τη Χαλκιδική με αποστάσεις, χρόνους και πρακτικές συμβουλές.',
    tags: ['εκδρομές', 'day trips', 'θεσσαλονίκη', 'βεργίνα', 'μετέωρα'] },
  { slug: 'day-trip-thessaloniki', file: 'day-trip-thessaloniki.html',
    title: 'Εκδρομή στη Θεσσαλονίκη από τη Χαλκιδική', read_time: 6,
    excerpt: 'Ημερήσια εκδρομή στη Θεσσαλονίκη: Λευκός Πύργος, Άνω Πόλη, αγορές, γαστρονομία. Αποστάσεις, τι να δεις, πρακτικές συμβουλές.',
    tags: ['θεσσαλονίκη', 'εκδρομή', 'πόλη', 'αγορές', 'μουσεία'] },
  { slug: 'day-trip-vergina', file: 'day-trip-vergina.html',
    title: 'Εκδρομή στη Βεργίνα: Ο Τάφος του Φιλίππου', read_time: 6,
    excerpt: 'Επίσκεψη στους Βασιλικούς Τάφους της Βεργίνας — ο ασύλητος τάφος του Φιλίππου Β΄, μνημείο UNESCO. Ιστορία, μουσείο, πρακτικά από τη Χαλκιδική.',
    tags: ['βεργίνα', 'φίλιππος', 'αρχαιολογία', 'unesco', 'μακεδονία'] },
  { slug: 'day-trip-olympus-dion', file: 'day-trip-olympus-dion.html',
    title: 'Εκδρομή στον Όλυμπο & Δίον από τη Χαλκιδική', read_time: 6,
    excerpt: 'Το βουνό των θεών και η αρχαία ιερή πόλη Δίον. Αρχαιολογικό πάρκο, Λιτόχωρο, φαράγγι Ενιπέα. Οδηγός ημερήσιας εκδρομής.',
    tags: ['όλυμπος', 'δίον', 'λιτόχωρο', 'βουνό', 'αρχαιολογία'] },
  { slug: 'day-trip-meteora', file: 'day-trip-meteora.html',
    title: 'Εκδρομή στα Μετέωρα από τη Χαλκιδική', read_time: 7,
    excerpt: 'Τα μοναστήρια στους βράχους — UNESCO. Πόσο απέχουν, τα 6 ενεργά μοναστήρια, ντύσιμο, ημερήσια ή διανυκτέρευση. Πλήρης οδηγός.',
    tags: ['μετέωρα', 'μοναστήρια', 'unesco', 'εκδρομή', 'καλαμπάκα'] },
  { slug: 'day-trip-edessa', file: 'day-trip-edessa.html',
    title: 'Εκδρομή στην Έδεσσα: Καταρράκτες & Νερά', read_time: 5,
    excerpt: 'Η πόλη των νερών με τους υψηλότερους καταρράκτες των Βαλκανίων. Βαρόσι, υδρόμυλοι, συνδυασμοί με Βεργίνα/Πόζαρ. Δροσερή καλοκαιρινή εκδρομή.',
    tags: ['έδεσσα', 'καταρράκτες', 'βαρόσι', 'φύση', 'εκδρομή'] },
];

const NOW = new Date().toISOString();

(async () => {
  const dir = path.join(__dirname, 'daytrips');
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'} | ${ARTICLES.length} articles`);
  for (const art of ARTICLES) {
    const content = fs.readFileSync(path.join(dir, art.file), 'utf8');
    const words = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    console.log(`\n${art.slug}: ${words} words`);
    const row = {
      slug: art.slug, title_el: art.title, excerpt_el: art.excerpt, content_el: content,
      meta_title_el: `${art.title} | ChalkidikiHub`, meta_description_el: art.excerpt,
      category: 'guides', author: 'ChalkidikihubWriterTeam', read_time_min: art.read_time,
      tags: art.tags, image_url: '', published_at: NOW, updated_at: NOW,
    };
    if (DRY) { console.log('  [DRY] would INSERT'); continue; }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles`, {
      method: 'POST',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(row),
    });
    console.log(`  ${res.ok ? 'OK inserted' : 'ERROR ' + res.status + ': ' + await res.text()}`);
  }
})();
