// Move specific sales records into the listings table (mis-registered as sales).
// Usage:
//   node scripts/move-sales-to-listings.js          (dry-run)
//   node scripts/move-sales-to-listings.js --commit (apply changes)
const fs = require('fs');

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !process.argv.includes('--commit');

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const SLUGS = [
  'monokatoikia-stin-paralia-40-2667222-23-184278nea-plagia-chalkidikis',
  'diorofi-katoikia-me-tzakoyzi-stin-nea-potidaia-nea-potidaia',
];

const H = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

async function req(method, path, body, prefer) {
  const headers = { ...H };
  if (prefer) headers.Prefer = prefer;
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

const ALLOWED_AREAS = new Set(['kassandra', 'sithonia', 'athos', 'mainland']);

function mapSaleToListing(sale) {
  const area = ALLOWED_AREAS.has(sale.area) ? sale.area : 'mainland';
  return {
    owner_id: sale.owner_id,
    slug: sale.slug,
    title_el: sale.title_el || '',
    title_en: sale.title_en || '',
    title_de: sale.title_de || '',
    title_bg: sale.title_bg || '',
    title_ru: sale.title_ru || '',
    title_ro: sale.title_ro || '',
    description_el: sale.description_el || '',
    description_en: sale.description_en || '',
    description_de: sale.description_de || '',
    description_bg: sale.description_bg || '',
    description_ru: sale.description_ru || '',
    description_ro: sale.description_ro || '',
    area,
    location_name: sale.location_name || '',
    latitude: sale.latitude || 0,
    longitude: sale.longitude || 0,
    price_per_night: sale.price || 0,
    currency: sale.currency || 'EUR',
    guests_max: 2,
    bedrooms: sale.bedrooms || 1,
    bathrooms: sale.bathrooms || 1,
    amenities: [],
    status: 'draft',
    meta_title_el: sale.meta_title_el || '',
    meta_title_en: sale.meta_title_en || '',
    meta_description_el: sale.meta_description_el || '',
    meta_description_en: sale.meta_description_en || '',
    image_alt: sale.image_alt || '',
    created_at: sale.created_at,
    updated_at: new Date().toISOString(),
  };
}

(async () => {
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'}`);

  for (const slug of SLUGS) {
    console.log(`\n=== ${slug} ===`);

    // 1) Fetch sale
    const sales = await req('GET', `/rest/v1/sales?slug=eq.${encodeURIComponent(slug)}&select=*`);
    if (!sales.length) { console.log('  sale not found, skipping'); continue; }
    const sale = sales[0];
    console.log(`  sale.id=${sale.id} owner=${sale.owner_id} area=${sale.area} price=${sale.price} status=${sale.status}`);

    // 2) Check listings collision
    const existing = await req('GET', `/rest/v1/listings?slug=eq.${encodeURIComponent(slug)}&select=id`);
    if (existing.length) { console.log(`  ! listing with same slug already exists (${existing[0].id}), skipping`); continue; }

    // 3) Fetch sale images
    const saleImages = await req('GET', `/rest/v1/sale_images?sale_id=eq.${sale.id}&select=*&order=sort_order.asc`);
    console.log(`  sale_images: ${saleImages.length}`);

    const listingPayload = mapSaleToListing(sale);
    console.log(`  -> listing: area=${listingPayload.area} price_per_night=${listingPayload.price_per_night} status=${listingPayload.status}`);

    if (DRY) { console.log('  [DRY] would insert listing + images and delete sale'); continue; }

    // 4) Insert listing
    const inserted = await req('POST', '/rest/v1/listings', listingPayload, 'return=representation');
    const listingId = inserted[0].id;
    console.log(`  inserted listing ${listingId}`);

    // 5) Insert listing_images
    if (saleImages.length) {
      const imgPayload = saleImages.map(im => ({
        listing_id: listingId,
        image_url: im.image_url,
        sort_order: im.sort_order || 0,
        is_cover: !!im.is_cover,
      }));
      await req('POST', '/rest/v1/listing_images', imgPayload, 'return=minimal');
      console.log(`  inserted ${imgPayload.length} listing_images`);
    }

    // 6) Delete sale_images then sale (sale_images have FK CASCADE but be explicit)
    await req('DELETE', `/rest/v1/sale_images?sale_id=eq.${sale.id}`, undefined, 'return=minimal');
    await req('DELETE', `/rest/v1/sales?id=eq.${sale.id}`, undefined, 'return=minimal');
    console.log('  deleted original sale + sale_images');
  }

  console.log('\nDone.');
})().catch(err => { console.error(err); process.exit(1); });
