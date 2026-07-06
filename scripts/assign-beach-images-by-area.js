// Fetch one Unsplash photo per Halkidiki area (4 calls total), save to Supabase
// storage, then assign each beach without image_url the photo of its area.
//
// Usage:
//   node scripts/assign-beach-images-by-area.js              # dry-run preview
//   node scripts/assign-beach-images-by-area.js --commit

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

const AREA_QUERIES = {
  kassandra: 'kassandra halkidiki beach greece',
  sithonia: 'sithonia halkidiki beach greece',
  athos: 'mount athos greece sea',
  mainland: 'halkidiki greece coast',
};

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
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${accessKey}` } }
  );
  if (!r.ok) throw new Error(`Unsplash ${r.status}`);
  const data = await r.json();
  return data.results?.[0];
}

async function uploadToStorage(photoUrl, area, accessKey, downloadLink) {
  // Track download (Unsplash terms)
  if (downloadLink) {
    fetch(downloadLink, { headers: { Authorization: `Client-ID ${accessKey}` } }).catch(() => {});
  }

  const imgRes = await fetch(photoUrl);
  if (!imgRes.ok) throw new Error(`Image fetch ${imgRes.status}`);
  const raw = Buffer.from(await imgRes.arrayBuffer());
  // Re-encode to WebP (max 1600px) before upload — halves the payload vs the
  // raw Unsplash JPEG with no visible quality loss.
  const arrayBuf = await sharp(raw)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 72 })
    .toBuffer();
  const filename = `beaches/area-${area}-${Date.now()}.webp`;

  const up = await fetch(
    `${URL}/storage/v1/object/content-images/${filename}`,
    {
      method: 'POST',
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'image/webp',
        'x-upsert': 'true',
      },
      body: arrayBuf,
    }
  );
  if (!up.ok) throw new Error(`Storage upload ${up.status}: ${(await up.text()).slice(0,150)}`);
  return `${URL}/storage/v1/object/public/content-images/${filename}`;
}

(async () => {
  const accessKey = await getUnsplashKey();
  if (!accessKey) { console.error('No Unsplash key in env or site_settings'); process.exit(1); }

  // 1. Fetch beaches without image_url
  const r = await fetch(`${URL}/rest/v1/beaches?select=id,slug,area,image_url&order=area.asc`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  const all = await r.json();
  const targets = all.filter(b => !b.image_url || !b.image_url.trim());
  console.log(`Beaches without image_url: ${targets.length}`);
  const byArea = {};
  for (const b of targets) (byArea[b.area] ||= []).push(b);
  for (const [a, list] of Object.entries(byArea)) console.log(`  ${a}: ${list.length}`);

  if (DRY) {
    console.log('\nDRY RUN — would fetch 4 Unsplash photos (one per area) and assign.');
    return;
  }

  // 2. Per area: search Unsplash, upload, assign
  const areaUrls = {};
  for (const [area, query] of Object.entries(AREA_QUERIES)) {
    if (!byArea[area]?.length) continue;
    console.log(`\n[${area}] searching: "${query}"`);
    const photo = await searchUnsplash(query, accessKey);
    if (!photo) { console.warn(`  no result`); continue; }
    console.log(`  found photo by ${photo.user?.name} (${photo.id})`);
    try {
      const url = await uploadToStorage(photo.urls.regular, area, accessKey, photo.links.download_location);
      console.log(`  uploaded: ${url}`);
      areaUrls[area] = url;
    } catch (e) {
      console.error(`  upload failed: ${e.message}`);
    }
  }

  // 3. Assign URL per beach in that area
  console.log('\nAssigning to beaches…');
  let ok = 0, fail = 0;
  for (const [area, list] of Object.entries(byArea)) {
    const url = areaUrls[area];
    if (!url) { console.warn(`  ${area}: no url, skipping ${list.length} beaches`); continue; }
    for (const b of list) {
      const upd = await fetch(`${URL}/rest/v1/beaches?id=eq.${b.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: KEY, Authorization: `Bearer ${KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ image_url: url }),
      });
      if (upd.ok) ok++;
      else { fail++; console.error(`  ${b.slug}: ${upd.status}`); }
    }
  }
  console.log(`\nDone. ${ok} assigned, ${fail} failed.`);
})();
