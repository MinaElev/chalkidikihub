// Gives newly added photos what search engines and AI readers use: a Greek alt
// text that describes what the photo actually shows, and a descriptive file
// name. The file is copied to the new name (the old one is kept), the row's
// image_url / image_alt are updated, and image_optimized is set where the
// table has it (these uploads are already small WebP files).
//
// Usage: node scripts/apply-image-seo.mjs [--dry-run]
// Writes a rollback file to audit/image-seo-rollback-<date>.json (old url + alt).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const require = createRequire(path.join(root, 'package.json'));
const { createClient } = require('@supabase/supabase-js');
const env = Object.fromEntries(
  fs.readFileSync(path.join(root, '.env.local'), 'utf8').split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')]; }),
);
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const dry = process.argv.includes('--dry-run');
const BUCKET = 'content-images';

/**
 * Written after looking at each photo (23/11/2026). Places are named only
 * where the photo clearly shows them or the page is about that exact spot;
 * otherwise the text says what is visible and no more.
 */
const PHOTOS = [
  // Villages
  { table: 'villages', slug: 'tripiti', file: 'villages/tripiti-ferry-ammouliani.webp',
    alt: 'Το φέρι για την Αμμουλιανή στο λιμάνι της Τρυπητής, με γαλάζια νερά και πράσινο λόφο απέναντι' },
  { table: 'villages', slug: 'nea-triglia', file: 'villages/nea-triglia-aerial.webp',
    alt: 'Αεροφωτογραφία της Νέας Τρίγλιας με τα σπίτια, τις καλλιέργειες γύρω και τη θάλασσα στο βάθος' },
  { table: 'villages', slug: 'neos-marmaras', file: 'villages/neos-marmaras-harbour-dusk.webp',
    alt: 'Ο Νέος Μαρμαράς το σούρουπο, με το λιμάνι, τα ιστιοπλοϊκά και τα φωτισμένα σπίτια, Σιθωνία' },
  { table: 'villages', slug: 'polygyros', file: 'villages/polygyros-stone-mansion.webp',
    alt: 'Παραδοσιακό πέτρινο αρχοντικό με κεραμοσκεπή ανάμεσα σε λεύκες και πεύκα στον Πολύγυρο' },
  // Beaches
  { table: 'beaches', slug: 'katergopetra-nudist-beach-kassandra', file: 'beaches/nudist-beach-sign.webp',
    // Stock photo, not the real beach: describe only the sign.
    alt: 'Ξύλινη πινακίδα «Nude Beach – Clothing optional» σε αμμουδιά με γαλάζια θάλασσα' },
  { table: 'beaches', slug: 'elani-beach-kassandra', file: 'beaches/elani-beach-kassandra-aerial.webp',
    alt: 'Αεροφωτογραφία της παραλίας Ελάνη στην Κασσάνδρα, με τιρκουάζ νερά, αμμουδιά και πευκόδασος' },
  { table: 'beaches', slug: 'karagatsia-mainland', file: 'beaches/karagatsia-ammouliani.webp',
    alt: 'Η αμμουδιά Καραγάτσια στην Αμμουλιανή, με πέτρινη προβλήτα και πεντακάθαρα ρηχά νερά' },
  { table: 'beaches', slug: 'faka-mainland', file: 'beaches/faka-ammouliani.webp',
    alt: 'Η παραλία Φάκα στην Αμμουλιανή, με αμμουδιά, βραχώδη ακτή και νησάκι απέναντι' },
  { table: 'beaches', slug: 'stratoni-beach-mainland', file: 'beaches/stratoni-beach-aerial.webp',
    alt: 'Αεροφωτογραφία της παραλίας του Στρατωνίου με το λιμανάκι, τις ομπρέλες και τους πράσινους λόφους' },
  { table: 'beaches', slug: 'ierissos-municipal-1-mainland', file: 'beaches/ierissos-municipal-beach-aerial.webp',
    alt: 'Αεροφωτογραφία της Δημοτικής Πλαζ της Ιερισσού με τη μακριά αμμουδιά και τα τροχόσπιτα κατά μήκος της ακτής' },
  { table: 'beaches', slug: 'saint-george-athos', file: 'beaches/agios-georgios-ammouliani.webp',
    alt: 'Ρηχά, πεντακάθαρα τιρκουάζ νερά στην παραλία Άγιος Γεώργιος της Αμμουλιανής, με την απέναντι ακτή στο βάθος' },
  { table: 'beaches', slug: 'voulitsa-athos', file: 'beaches/voulitsa-beach-aerial.webp',
    alt: 'Αεροφωτογραφία της παραλίας Βουλίτσα με τις ψάθινες ομπρέλες, το beach bar και τα τιρκουάζ νερά' },
  { table: 'beaches', slug: 'tigania-beach-athos', file: 'beaches/tigania-kalamitsi-sithonia.webp',
    // Also set in src/content/rewrites/beach-alts.ts, which overrides the database for this beach.
    alt: 'Η παραλία Τηγανιά στο Καλαμίτσι της Σιθωνίας, με λείους βράχους, ψάθινες ομπρέλες και ρηχά τιρκουάζ νερά' },
  { table: 'beaches', slug: 'prassou-beach-athos', file: 'beaches/prassou-robinson-kalamitsi.webp',
    // Also set in src/content/rewrites/beach-alts.ts, which overrides the database for this beach.
    alt: 'Ο κολπίσκος της παραλίας Πράσσου (Ρόμπινσον) στο Καλαμίτσι, με αμμουδιά, λευκούς βράχους και το Άγιον Όρος στο βάθος' },
  { table: 'beaches', slug: 'trimi-beach-athos', file: 'beaches/trimi-beach-aerial.webp',
    alt: 'Αεροφωτογραφία της παραλίας Τρίμη, με λευκή άμμο, κοκκινωπούς γρανιτένιους βράχους και τιρκουάζ νερά' },
  // Activities (added 23/11/2026, second round)
  { table: 'activities', slug: 'ancient-olynthos', file: 'activities/ancient-olynthos-house-foundations.webp',
    alt: 'Τα πέτρινα θεμέλια των σπιτιών της αρχαίας Ολύνθου σε ευθείς δρόμους, με ελαιόδεντρα και βουνά στο βάθος' },
  { table: 'activities', slug: 'ancient-toroni-lekythos', file: 'activities/toroni-lekythos-aerial.webp',
    alt: 'Αεροφωτογραφία της χερσονήσου Λήκυθος στην Τορώνη, με τα ερείπια των τειχών και τιρκουάζ νερά γύρω' },
  { table: 'activities', slug: 'temple-of-poseidon-posidi', file: 'activities/poseidon-sanctuary-posidi-aerial.webp',
    alt: 'Αεροφωτογραφία της ανασκαφής του ιερού του Ποσειδώνα στο Ποσείδι, ανάμεσα σε θάμνους κοντά στην αμμουδιά' },
  { table: 'activities', slug: 'ancient-stagira', file: 'activities/ancient-stagira-walls-sea-view.webp',
    alt: 'Θέα από τα πέτρινα τείχη των Αρχαίων Σταγείρων προς κόλπο με τιρκουάζ νερά και πράσινους λόφους' },
  // Blog
  { table: 'blog_articles', slug: 'halkidiki-in-may-june', file: 'blog/halkidiki-may-june-sithonia-bay.webp',
    alt: 'Κόλπος με τιρκουάζ νερά, αμμουδιά και βραχονησίδα στη Σιθωνία, με το Άγιον Όρος στο βάθος' },
  { table: 'blog_articles', slug: 'odigos-gia-taxiarhis', file: 'blog/taxiarchis-stone-house.webp',
    alt: 'Πέτρινο σπίτι με κεραμοσκεπή και έλατα στον Ταξιάρχη, το ορεινό χωριό του Χολομώντα' },
  { table: 'blog_articles', slug: 'halkidiki-panigiria-festivals', file: 'blog/village-festival-night.webp',
    alt: 'Βραδινό πανηγύρι κάτω από πεύκα, με φωτάκια, γεμάτα τραπέζια και κόσμο' },
  { table: 'blog_articles', slug: 'halkidiki-in-september', file: 'blog/halkidiki-september-quiet-beach.webp',
    alt: 'Ήσυχη μακριά αμμουδιά με τιρκουάζ νερά και πευκόφυτους λόφους στη Χαλκιδική' },
  { table: 'blog_articles', slug: 'halkidiki-from-balkans-complete-guide', file: 'blog/halkidiki-rocky-cove.webp',
    alt: 'Βραχώδης κολπίσκος με λευκή άμμο, πεύκα και τιρκουάζ νερά στη Χαλκιδική' },
  { table: 'blog_articles', slug: 'halkidiki-in-august', file: 'blog/halkidiki-august-bay-aerial.webp',
    alt: 'Αεροφωτογραφία κόλπου με οργανωμένη παραλία και βαθυγάλαζα νερά στη Χαλκιδική' },
  { table: 'blog_articles', slug: 'halkidiki-in-winter', file: 'blog/snowy-village-christmas.webp',
    // Could not confirm the village is in Chalkidiki: no place named.
    alt: 'Χιονισμένη πλατεία ορεινού χωριού με στολισμένο χριστουγεννιάτικο δέντρο και πέτρινη βρύση' },
];

const HAS_OPTIMIZED = new Set(['beaches', 'blog_articles', 'restaurants', 'activities', 'areas']);
const publicUrl = (p) => db.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;
const rollback = [];

for (const p of PHOTOS) {
  const { data: row, error } = await db.from(p.table).select('id, slug, image_url, image_alt').eq('slug', p.slug).single();
  if (error || !row) { console.log('SKIP (not found)', p.table, p.slug, error?.message); continue; }
  const prefix = `/object/public/${BUCKET}/`;
  const at = row.image_url?.indexOf(prefix) ?? -1;
  if (at < 0) { console.log('SKIP (not in our storage)', p.slug); continue; }
  const from = decodeURIComponent(row.image_url.slice(at + prefix.length).split('?')[0]);
  const to = p.file;
  const already = from === to;
  rollback.push({ table: p.table, id: row.id, slug: p.slug, image_url: row.image_url, image_alt: row.image_alt });
  console.log(`${dry ? '[dry] ' : ''}${p.table} ${p.slug}: ${from} -> ${to}`);
  if (dry) continue;

  if (!already) {
    // Copy (keeps the bytes and their cache headers); the old file stays, nothing links to it after the update.
    const { error: cpErr } = await db.storage.from(BUCKET).copy(from, to);
    if (cpErr && !/exists/i.test(cpErr.message)) { console.log('  copy failed:', cpErr.message); continue; }
  }
  const patch = { image_url: publicUrl(to), image_alt: p.alt };
  if (HAS_OPTIMIZED.has(p.table)) patch.image_optimized = true;
  if (p.table !== 'villages') patch.updated_at = new Date().toISOString();
  const { error: upErr } = await db.from(p.table).update(patch).eq('id', row.id);
  if (upErr) { console.log('  update failed:', upErr.message); continue; }
  // The new URL must load before we call it done.
  const ok = (await fetch(patch.image_url, { method: 'HEAD' })).ok;
  console.log(`  ${ok ? 'ok' : 'NEW URL DOES NOT LOAD'}`);
}

if (!dry) {
  fs.mkdirSync(path.join(root, 'audit'), { recursive: true });
  // Timestamped, so a second run never overwrites the first run's rollback.
  const f = path.join(root, 'audit', `image-seo-rollback-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.json`);
  fs.writeFileSync(f, JSON.stringify(rollback, null, 1));
  console.log('rollback saved:', path.relative(root, f));
}
