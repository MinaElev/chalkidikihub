#!/usr/bin/env node
/**
 * Content audit — read-only. Scores every long text in the database, in every
 * locale, and writes audit/content-audit.{csv,md}.
 *
 *   node scripts/content-audit.mjs
 *
 * Checks (per entity × locale):
 *   missing      no text at all
 *   thin         fewer than MIN_WORDS words
 *   same-as-en   identical to the English text (never translated)
 *   wrong-script Greek letters in a non-Greek text, or Latin prose in bg/ru
 *   cliche       stock AI phrases ("unforgettable experience", "γιορτή για τον ουρανίσκο")
 *   far-mention  names another place/beach/restaurant that is > FAR_KM away —
 *                v3's AI texts recommended Kassandra beaches on Sithonia pages
 *
 * Uses the service-role key from .env.local. Never writes to the database.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
for (const line of fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
  const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
}
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const LOCALES = ['el', 'en', 'de', 'ro', 'bg', 'sr', 'ru'];
const MIN_WORDS = { beaches: 120, restaurants: 55, activities: 120, villages: 150, listings: 100, monasteries: 150, blog_articles: 400, events: 100 };
// The same text takes fewer words in Slavic languages (no articles, richer inflection):
// measured on our parallel rewrites, ru runs ~20% and sr ~15% shorter than en.
const WORD_FACTOR = { el: 1, en: 1, de: 0.95, ro: 1, bg: 0.9, sr: 0.85, ru: 0.8 };
const FAR_KM = 25;

const CLICHES = [
  /αξέχαστ\p{L}* εμπειρ/iu, /μοναδικ\p{L}* εμπειρ/iu, /γιορτή για τον ουρανίσκο/iu, /γευστικ\p{L}* εμπειρ/iu,
  /κρυμμέν\p{L}* διαμάντι/iu, /επίγει\p{L}* παράδεισ/iu, /σας περιμέν/iu, /σας προσκαλεί/iu,
  /unforgettable (experience|memories)/i, /unique experience/i, /hidden gem/i, /nestled/i, /culinary (journey|experience)/i,
  /feast for the (senses|palate)/i, /look no further/i, /a must[- ]visit/i, /whether you'?re/i,
  /unvergessliche[sn]? Erlebnis/i, /einzigartige[sn]? Erlebnis/i, /verstecktes Juwel/i,
  /experien[țt]ă (unică|de neuitat)/i, /bijuterie ascunsă/i,
  /незабравим\p{L}* (преживяване|изживяване)/iu, /уникално (преживяване|изживяване)/iu,
  /nezaboravn\p{L}* (iskustv|doživljaj)/iu, /jedinstven\p{L}* iskustv/iu,
  /незабываем\p{L}* (впечатлени|опыт)/iu, /уникальн\p{L}* (опыт|впечатлени)/iu, /кулинарн\p{L}* путешестви/iu,
];

// Beach names that are also ordinary words ("sunset", "paradise") would
// match every text that uses the word.
const COMMON_WORDS = new Set(['ηλιοβασίλεμα', 'sunset', 'sonnenuntergang', 'apus', 'залез', 'zalazak', 'закат', 'banana', 'παράδεισος', 'paradise', 'paradies', 'paradis', 'рай', 'raj', 'golden beach', 'γαλήνη', 'galini', 'white beach', 'little paradise', 'secret paradise', 'λιμανάκι', 'limanaki', 'portokali', 'πορτοκάλι', 'orange', 'καστρί', 'kastri', 'λιβάδι', 'livadi', 'πλατανιά', 'platania']);

const PROXIMITY = /κοντ[άιιν]|κοντιν|δίπλα|λίγα (λεπτά|χιλιόμετρα)|απέναντι|γειτονικ|nearby|near |close to|next to|a short (drive|walk)|minutes? (away|from)|in der nähe|nahe |nebenan|aproape|în apropiere|în vecinătate|близо|наблизо|съседн|blizu|u blizini|obližnj|рядом|поблизости|неподалёку|недалеко|соседн/iu;

const words = (t) => (t || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const plain = (t) => (t || '').replace(/<[^>]+>/g, ' ').replace(/[#*_]/g, ' ').replace(/\s+/g, ' ').trim();

function haversine(a, b) {
  if (a.lat == null || b.lat == null) return Infinity;
  const R = 6371, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

async function all(table, cols) {
  const { data, error } = await db.from(table).select(cols).limit(5000);
  if (error) throw new Error(`${table}: ${error.message}`);
  return data;
}

const nameCols = (f) => LOCALES.map((l) => `${f}_${l}`).join(',');

const [beaches, restaurants, activities, villages, listings, monasteries, articles, events] = await Promise.all([
  all('beaches', `slug,latitude,longitude,${nameCols('name')},${nameCols('description')}`),
  all('restaurants', `slug,latitude,longitude,${nameCols('name')},${nameCols('description')}`),
  all('activities', `slug,latitude,longitude,${nameCols('name')},${nameCols('description')}`),
  all('villages', `slug,latitude,longitude,${nameCols('name')},${nameCols('description')}`),
  all('listings', `slug,latitude,longitude,status,${nameCols('title')},${nameCols('description')}`),
  all('monasteries', `slug,latitude,longitude,${nameCols('name')},${nameCols('description')}`),
  all('blog_articles', `slug,published_at,${nameCols('title')},${nameCols('content')}`),
  all('events', `slug,latitude,longitude,${nameCols('name')},${nameCols('description')}`),
]);

// Apply the editorial rewrites in src/content/rewrites (<table>-<n>.json), the
// same overlay v4 serves, unless --raw asks for the database text as stored.
if (!process.argv.includes('--raw')) {
  const byTable = { beaches, restaurants, activities, villages, listings, monasteries, blog_articles: articles, events };
  const dir = path.join(ROOT, 'src/content/rewrites');
  for (const file of fs.readdirSync(dir).filter((x) => /^[a-z_]+-\d+\.json$/.test(x))) {
    const table = file.replace(/-\d+\.json$/, '');
    const field = table === 'blog_articles' ? 'content' : 'description';
    const rewrites = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    for (const row of byTable[table] ?? []) {
      for (const [l, text] of Object.entries(rewrites[row.slug] ?? {})) if (text) row[`${field}_${l}`] = text;
    }
  }
}

// Gazetteer: every named place we know, in every language, with coordinates.
const gazetteer = [];
for (const [kind, rows] of [['beach', beaches], ['restaurant', restaurants], ['village', villages]]) {
  for (const r of rows) {
    if (r.latitude == null || (r.latitude === 0 && r.longitude === 0)) continue;
    for (const l of LOCALES) {
      const raw = (r[`name_${l}`] || '').replace(/^(παραλία|beach|strand|plaja|плаж|plaža|пляж)\s+/i, '').trim();
      // Short or generic names ("Sani", "Bar") would match everywhere; skip them.
      if (raw.length < 6 || /^(beach bar|restaurant|taverna|cafe)$/i.test(raw) || COMMON_WORDS.has(raw.toLocaleLowerCase())) continue;
      gazetteer.push({ kind, slug: r.slug, name: raw, lower: raw.toLocaleLowerCase(), lat: r.latitude, lng: r.longitude });
    }
  }
}

const rowsOut = [];
function audit(table, rows, field, nameField = 'name') {
  for (const r of rows) {
    if (table === 'listings' && r.status !== 'published') continue;
    if (table === 'blog_articles' && !r.published_at) continue;
    const origin = { lat: r.latitude, lng: r.longitude };
    const en = plain(r[`${field}_en`]);
    for (const l of LOCALES) {
      const text = plain(r[`${field}_${l}`]);
      const issues = [];
      const w = words(text);
      if (!text) issues.push('missing');
      else {
        if (w < Math.round((MIN_WORDS[table] ?? 120) * (WORD_FACTOR[l] ?? 1))) issues.push(`thin:${w}`);
        if (l !== 'en' && en && text === en) issues.push('same-as-en');
        if (l !== 'el' && (text.match(/[Ͱ-Ͽ]{3,}/g) || []).length > 2) issues.push('wrong-script:greek');
        if ((l === 'bg' || l === 'ru') && (text.match(/\b[a-z]{4,}\b/g) || []).length > 12) issues.push('wrong-script:latin');
        const cl = CLICHES.filter((re) => re.test(text)).length;
        if (cl) issues.push(`cliche:${cl}`);
        if (origin.lat != null) {
          // A far place only counts when the same sentence presents it as
          // nearby — mentioning Porto Koufo for comparison is fine,
          // recommending it as "a beach nearby" from Kassandra is not.
          const far = new Set();
          for (const sentence of text.toLocaleLowerCase().split(/(?<=[.!;?·])\s+/)) {
            if (!PROXIMITY.test(sentence)) continue;
            for (const g of gazetteer) {
              if (g.slug === r.slug || !sentence.includes(g.lower)) continue;
              const km = haversine(origin, g);
              if (km > FAR_KM) far.add(`${g.name}(${Math.round(km)}km)`);
            }
          }
          if (far.size) issues.push(`far-mention:${[...far].slice(0, 3).join('|')}`);
        }
      }
      rowsOut.push({ table, slug: r.slug, locale: l, words: w, issues });
    }
  }
}

audit('beaches', beaches, 'description');
audit('restaurants', restaurants, 'description');
audit('activities', activities, 'description');
audit('villages', villages, 'description');
audit('listings', listings, 'description', 'title');
audit('monasteries', monasteries, 'description');
audit('events', events, 'description');
audit('blog_articles', articles, 'content', 'title');

// ── Output ───────────────────────────────────────────────────────────────
const outDir = path.join(ROOT, 'audit');
fs.mkdirSync(outDir, { recursive: true });
const csv = ['table,slug,locale,words,issues', ...rowsOut.map((r) => `${r.table},${r.slug},${r.locale},${r.words},"${r.issues.join('; ')}"`)];
fs.writeFileSync(path.join(outDir, 'content-audit.csv'), csv.join('\n'));

const kinds = ['missing', 'thin', 'same-as-en', 'wrong-script', 'cliche', 'far-mention'];
const byTable = {};
const byLocale = {};
const entitiesWithIssues = new Map();
for (const r of rowsOut) {
  byTable[r.table] ??= { texts: 0, clean: 0, ...Object.fromEntries(kinds.map((k) => [k, 0])) };
  byLocale[r.locale] ??= { texts: 0, clean: 0, ...Object.fromEntries(kinds.map((k) => [k, 0])) };
  for (const bucket of [byTable[r.table], byLocale[r.locale]]) {
    bucket.texts++;
    if (!r.issues.length) bucket.clean++;
    for (const k of kinds) if (r.issues.some((i) => i.startsWith(k))) bucket[k]++;
  }
  if (r.issues.length) entitiesWithIssues.set(`${r.table}/${r.slug}`, true);
}

const table = (title, data) => [
  `## ${title}`, '',
  `| | texts | clean | ${kinds.join(' | ')} |`,
  `|---|--:|--:|${kinds.map(() => '--:').join('|')}|`,
  ...Object.entries(data).map(([k, v]) => `| ${k} | ${v.texts} | ${v.clean} (${Math.round((v.clean / v.texts) * 100)}%) | ${kinds.map((x) => v[x]).join(' | ')} |`),
  '',
];

const far = rowsOut.filter((r) => r.issues.some((i) => i.startsWith('far-mention')) && r.locale === 'el').slice(0, 25);
const md = [
  '# Content audit', '',
  `_${new Date().toISOString()} · ${rowsOut.length} texts (entities × 7 locales) · ${entitiesWithIssues.size} entities with at least one issue_`, '',
  ...table('By table', byTable),
  ...table('By locale', byLocale),
  '## Geographic errors (Greek text names a place > 25 km away)', '',
  '| entity | far mentions |', '|---|---|',
  ...far.map((r) => `| ${r.table}/${r.slug} | ${r.issues.find((i) => i.startsWith('far-mention')).slice(12)} |`),
  '', '_Full list: audit/content-audit.csv_',
];
fs.writeFileSync(path.join(outDir, 'content-audit.md'), md.join('\n'));
console.log(md.slice(0, 40).join('\n'));
