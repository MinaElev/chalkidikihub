// Try to upgrade each beach from its area-generic image to a per-beach Unsplash
// photo. Searches by "{Beach Name} Halkidiki beach" and uses the top result.
// Falls back to keeping the area image if Unsplash returns nothing usable or
// rate-limits.
//
// Rate-limited: Unsplash demo tier is 50/hour, so we pace 75s between calls.
// Use --fast to drop pacing (only if you have an approved production key).
//
// Usage:
//   node scripts/assign-per-beach-unsplash.js                # dry-run, 3 samples
//   node scripts/assign-per-beach-unsplash.js --commit       # all 140, throttled
//   node scripts/assign-per-beach-unsplash.js --commit --fast
//   node scripts/assign-per-beach-unsplash.js --commit --limit 50

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function loadEnv() {
  const p = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  }
}
loadEnv();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !process.argv.includes('--commit');
const FAST = process.argv.includes('--fast');
const LIMIT = (() => {
  const i = process.argv.indexOf('--limit');
  return i >= 0 ? parseInt(process.argv[i + 1], 10) : (DRY ? 3 : Infinity);
})();
const DELAY_MS = FAST ? 500 : 75000; // 75s between calls = 48 req/hour

async function getUnsplashKey() {
  if (process.env.UNSPLASH_ACCESS_KEY) return process.env.UNSPLASH_ACCESS_KEY;
  const r = await fetch(`${URL}/rest/v1/site_settings?key=eq.unsplash_access_key&select=value`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  const rows = await r.json();
  return rows?.[0]?.value;
}

async function searchUnsplash(query, accessKey) {
  const r = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${accessKey}` } }
  );
  if (r.status === 403) return { rateLimited: true };
  if (!r.ok) throw new Error(`Unsplash ${r.status}`);
  const data = await r.json();
  return { photo: data.results?.[0] };
}

async function uploadToStorage(photoUrl, slug, accessKey, downloadLink) {
  if (downloadLink) {
    fetch(downloadLink, { headers: { Authorization: `Client-ID ${accessKey}` } }).catch(() => {});
  }
  const imgRes = await fetch(photoUrl);
  if (!imgRes.ok) throw new Error(`fetch ${imgRes.status}`);
  const raw = Buffer.from(await imgRes.arrayBuffer());
  // Re-encode to WebP (max 1600px) before upload — Unsplash `regular` is a
  // ~1080px JPEG (150-500 KB); WebP roughly halves it with no visible loss.
  const buf = await sharp(raw)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 72 })
    .toBuffer();
  const filename = `beaches/${slug}-${Date.now()}.webp`;
  const up = await fetch(`${URL}/storage/v1/object/content-images/${filename}`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'image/webp',
      'x-upsert': 'true',
    },
    body: buf,
  });
  if (!up.ok) throw new Error(`storage ${up.status}`);
  return `${URL}/storage/v1/object/public/content-images/${filename}`;
}

// Identify "generic" Latin-transliterated beach names that won't match well
function looksGeneric(name) {
  return /^(small|beach|nudist|wet|white|paralia|παραλία)\b/i.test(name.trim()) ||
         /γυμνιστ/i.test(name);
}

(async () => {
  const accessKey = await getUnsplashKey();
  if (!accessKey) { console.error('No Unsplash key'); process.exit(1); }

  // Pick beaches currently using area-generic photos (i.e. uploaded by previous script)
  const r = await fetch(`${URL}/rest/v1/beaches?select=id,slug,name_el,name_en,area,image_url&order=slug.asc`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  const all = await r.json();
  const targets = all.filter(b => /area-(kassandra|sithonia|athos|mainland)-\d+\.jpg/.test(b.image_url || ''));
  console.log(`Area-generic beaches: ${targets.length}`);

  // Filter out beaches with generic names (would just return random beaches)
  const queryable = targets.filter(b => !looksGeneric(b.name_en || b.name_el || ''));
  console.log(`Queryable (specific names): ${queryable.length}`);
  const queue = queryable.slice(0, LIMIT);
  console.log(`Processing: ${queue.length}.  Delay between calls: ${DELAY_MS/1000}s`);

  let upgraded = 0, kept = 0, failed = 0;

  for (let i = 0; i < queue.length; i++) {
    const b = queue[i];
    const name = (b.name_en || b.name_el).replace(/^Παραλία\s+/, '').trim();
    const query = `${name} Halkidiki beach`;

    try {
      const result = await searchUnsplash(query, accessKey);
      if (result.rateLimited) {
        console.error(`\n[${i+1}/${queue.length}] Rate limited at ${b.slug}. Stopping.`);
        break;
      }
      if (!result.photo) {
        console.log(`[${i+1}/${queue.length}] ${b.slug.padEnd(40)} no result for "${query}"`);
        kept++;
      } else {
        if (DRY) {
          console.log(`[${i+1}/${queue.length}] ${b.slug.padEnd(40)} would assign: ${result.photo.urls.regular} (${result.photo.user?.name})`);
        } else {
          const url = await uploadToStorage(result.photo.urls.regular, b.slug, accessKey, result.photo.links.download_location);
          const upd = await fetch(`${URL}/rest/v1/beaches?id=eq.${b.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              apikey: KEY, Authorization: `Bearer ${KEY}`,
              Prefer: 'return=minimal',
            },
            body: JSON.stringify({ image_url: url }),
          });
          if (!upd.ok) throw new Error(`PATCH ${upd.status}`);
          console.log(`[${i+1}/${queue.length}] ${b.slug.padEnd(40)} ✓ "${query}"`);
        }
        upgraded++;
      }
    } catch (e) {
      console.error(`[${i+1}/${queue.length}] ${b.slug}: ${e.message}`);
      failed++;
    }

    if (i < queue.length - 1) await new Promise(r => setTimeout(r, DELAY_MS));
  }

  console.log(`\nDone. Upgraded: ${upgraded}, kept area-default: ${kept}, failed: ${failed}.`);
})();
