// Insert 7 new blog articles into blog_articles table (Greek master copy).
// Translations follow via translate-blog-and-beaches.js.
//
// Usage:
//   node scripts/insert-new-articles.js              # dry run
//   node scripts/insert-new-articles.js --commit

const fs = require('fs');
const path = require('path');

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !process.argv.includes('--commit');

const ARTICLES = [
  {
    slug: 'sithonia-vs-kassandra',
    file: 'sithonia-vs-kassandra.html',
    title: 'Σιθωνία ή Κασσάνδρα; Ο οριστικός οδηγός σύγκρισης',
    excerpt: 'Κασσάνδρα ή Σιθωνία για τις διακοπές σου; Σύγκριση σε παραλίες, ατμόσφαιρα, τιμές και πρόσβαση — με σαφή σύσταση ανά τύπο επισκέπτη.',
    category: 'guides',
    tags: ['σιθωνία', 'κασσάνδρα', 'σύγκριση', 'οδηγός', 'παραλίες'],
    read_time: 6,
  },
  {
    slug: 'halkidiki-october-guide',
    file: 'halkidiki-october.html',
    title: 'Χαλκιδική τον Οκτώβριο: Αξίζει;',
    excerpt: 'Παραλία και ησυχία με 40% χαμηλότερες τιμές. Ο πλήρης οδηγός για τη Χαλκιδική τον Οκτώβριο — καιρός, θάλασσα, τι λειτουργεί, τι να κάνεις.',
    category: 'tips',
    tags: ['οκτώβριος', 'φθινόπωρο', 'off-season', 'τιμές', 'οινοτουρισμός'],
    read_time: 5,
  },
  {
    slug: 'halkidiki-with-dog',
    file: 'halkidiki-with-dog.html',
    title: 'Χαλκιδική με Σκύλο: Παραλίες, Καταλύματα & Πρακτικά',
    excerpt: 'Ταξίδι με τον σκύλο σου στη Χαλκιδική; Dog-friendly παραλίες, καταλύματα που δέχονται κατοικίδια, ο νόμος, και πώς να προστατέψεις τον σκύλο από τη ζέστη.',
    category: 'tips',
    tags: ['σκύλος', 'κατοικίδια', 'pet-friendly', 'παραλίες', 'οδηγός'],
    read_time: 6,
  },
  {
    slug: 'halkidiki-easter-guide',
    file: 'halkidiki-easter.html',
    title: 'Πάσχα στη Χαλκιδική: Έθιμα, Χωριά & Οδηγός',
    excerpt: 'Ζήσε το αυθεντικό ελληνικό Πάσχα στη Χαλκιδική. Έθιμα Μεγάλης Εβδομάδας, ορεινά χωριά, πασχαλινές γεύσεις και πρακτικός οδηγός για το 2026.',
    category: 'culture',
    tags: ['πάσχα', 'έθιμα', 'άνοιξη', 'χωριά', 'παράδοση'],
    read_time: 5,
  },
  {
    slug: 'halkidiki-budget-guide',
    file: 'halkidiki-budget-guide.html',
    title: 'Χαλκιδική με Budget: Εβδομάδα Διακοπών με 500-700€',
    excerpt: 'Η Χαλκιδική δεν είναι ακριβή αν ξέρεις πώς. Αναλυτικός budget οδηγός: διαμονή, φαγητό, μεταφορά, δωρεάν δραστηριότητες — με δείγμα εβδομάδας.',
    category: 'tips',
    tags: ['budget', 'οικονομικά', 'τιμές', 'διακοπές', 'οδηγός'],
    read_time: 6,
  },
  {
    slug: 'halkidiki-quiet-beaches',
    file: 'halkidiki-quiet-beaches.html',
    title: 'Ήσυχες Παραλίες Χαλκιδικής Χωρίς Κόσμο',
    excerpt: 'Παραλίες όπου βρίσκεις ησυχία ακόμα και τον Αύγουστο. Απομονωμένες κολπίσκους σε Σιθωνία και Κασσάνδρα, με πρακτικές συμβουλές πρόσβασης.',
    category: 'beaches',
    tags: ['ήσυχες παραλίες', 'απομονωμένες', 'σιθωνία', 'κασσάνδρα', 'ησυχία'],
    read_time: 5,
  },
  {
    slug: 'mount-athos-diamonitirion-guide',
    file: 'mount-athos-diamonitirion-guide.html',
    title: 'Άγιο Όρος: Πλήρης Οδηγός για Διαμονητήριο 2026',
    excerpt: 'Βήμα-βήμα πώς να αποκτήσεις διαμονητήριο για το Άγιο Όρος: κράτηση, παραλαβή, φέρι, κανόνες, τι να φέρεις. Και η εναλλακτική κρουαζιέρα για γυναίκες.',
    category: 'culture',
    tags: ['άγιο όρος', 'διαμονητήριο', 'προσκύνημα', 'μονές', 'οδηγός'],
    read_time: 7,
  },
];

const NOW = new Date().toISOString();

(async () => {
  const dir = path.join(__dirname, 'new-articles');
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'} | ${ARTICLES.length} articles`);

  for (const art of ARTICLES) {
    const content = fs.readFileSync(path.join(dir, art.file), 'utf8');
    const words = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    console.log(`\n${art.slug}: ${words} words, ${art.category}`);

    const row = {
      slug: art.slug,
      title_el: art.title,
      excerpt_el: art.excerpt,
      content_el: content,
      meta_title_el: `${art.title} | ChalkidikiHub`,
      meta_description_el: art.excerpt,
      category: art.category,
      author: 'ChalkidikihubWriterTeam',
      read_time_min: art.read_time,
      tags: art.tags,
      image_url: '',
      published_at: NOW,
      updated_at: NOW,
    };

    if (DRY) { console.log('  [DRY] would INSERT'); continue; }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
    console.log(`  ${res.ok ? 'OK inserted' : 'ERROR ' + res.status + ': ' + await res.text()}`);
  }
})();
