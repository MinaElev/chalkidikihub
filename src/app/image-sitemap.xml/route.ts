import { NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

// 48h, matching sitemap.xml: image URLs change on the same cadence as the
// URL set (admin edits), and Googlebot-Image reads lastmod per entry anyway.
export const revalidate = 172800;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const supabase = createApiClient();

  // Fetch all content with images in parallel
  const [beaches, restaurants, activities, listings, sales, articles, villages] = await Promise.all([
    supabase.from('beaches').select('slug, name_el, name_en, image_url, location_name'),
    supabase.from('restaurants').select('slug, name_el, name_en, image_url, location_name'),
    supabase.from('activities').select('slug, name_el, name_en, image_url, location_name'),
    supabase.from('listings').select('id, slug, title_el, title_en, location_name, status').eq('status', 'published'),
    supabase.from('sales').select('id, slug, title_el, title_en, location_name, status').eq('status', 'published'),
    supabase.from('blog_articles').select('slug, title_el, title_en, image_url, category'),
    supabase.from('villages').select('slug, name_el, name_en, image_url'),
  ]);

  // Fetch listing images separately (listing_images.listing_id → listings.id)
  const { data: listingImages } = await supabase
    .from('listing_images')
    .select('listing_id, image_url, is_cover');

  // Fetch sale images (sale_images.sale_id → sales.id)
  const { data: saleImages } = await supabase
    .from('sale_images')
    .select('sale_id, image_url, is_cover');

  // Build listing image map keyed by listing ID
  const listingImgMap = new Map<string, string[]>();
  (listingImages || []).forEach(img => {
    const list = listingImgMap.get(img.listing_id) || [];
    if (img.is_cover) list.unshift(img.image_url);
    else list.push(img.image_url);
    listingImgMap.set(img.listing_id, list);
  });

  // Build sale image map keyed by sale ID
  const saleImgMap = new Map<string, string[]>();
  (saleImages || []).forEach(img => {
    const list = saleImgMap.get(img.sale_id) || [];
    if (img.is_cover) list.unshift(img.image_url);
    else list.push(img.image_url);
    saleImgMap.set(img.sale_id, list);
  });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // ── Beaches ──
  (beaches.data || []).forEach(b => {
    if (!b.image_url) return;
    const caption = `${b.name_el || b.name_en}${b.location_name ? `, ${b.location_name}` : ''} — Χαλκιδική`;
    xml += `  <url>
    <loc>${baseUrl}/beaches/${b.slug}</loc>
    <image:image>
      <image:loc>${escapeXml(b.image_url)}</image:loc>
      <image:title>${escapeXml(b.name_el || b.name_en || '')}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
      <image:geo_location>Halkidiki, Greece</image:geo_location>
    </image:image>
  </url>
`;
  });

  // ── Restaurants ──
  (restaurants.data || []).forEach(r => {
    if (!r.image_url) return;
    const caption = `${r.name_el || r.name_en}${r.location_name ? `, ${r.location_name}` : ''} — Χαλκιδική`;
    xml += `  <url>
    <loc>${baseUrl}/restaurants/${r.slug}</loc>
    <image:image>
      <image:loc>${escapeXml(r.image_url)}</image:loc>
      <image:title>${escapeXml(r.name_el || r.name_en || '')}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
      <image:geo_location>Halkidiki, Greece</image:geo_location>
    </image:image>
  </url>
`;
  });

  // ── Activities ──
  (activities.data || []).forEach(a => {
    if (!a.image_url) return;
    const caption = `${a.name_el || a.name_en}${a.location_name ? `, ${a.location_name}` : ''} — Χαλκιδική`;
    xml += `  <url>
    <loc>${baseUrl}/activities/${a.slug}</loc>
    <image:image>
      <image:loc>${escapeXml(a.image_url)}</image:loc>
      <image:title>${escapeXml(a.name_el || a.name_en || '')}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
      <image:geo_location>Halkidiki, Greece</image:geo_location>
    </image:image>
  </url>
`;
  });

  // ── Listings (multiple images per listing) ──
  (listings.data || []).forEach(l => {
    const images = listingImgMap.get(l.id) || [];
    if (images.length === 0) return;
    const title = l.title_el || l.title_en || '';
    const caption = `${title}${l.location_name ? `, ${l.location_name}` : ''} — Κατάλυμα Χαλκιδική`;
    xml += `  <url>
    <loc>${baseUrl}/listings/${l.slug}</loc>
`;
    images.slice(0, 10).forEach(imgUrl => {
      xml += `    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
      <image:geo_location>Halkidiki, Greece</image:geo_location>
    </image:image>
`;
    });
    xml += `  </url>
`;
  });

  // ── Sales (multiple images per sale) ──
  (sales.data || []).forEach(s => {
    const images = saleImgMap.get(s.id) || [];
    if (images.length === 0) return;
    const title = s.title_el || s.title_en || '';
    const caption = `${title}${s.location_name ? `, ${s.location_name}` : ''} — Πωλήσεις Χαλκιδική`;
    xml += `  <url>
    <loc>${baseUrl}/sales/${s.slug}</loc>
`;
    images.slice(0, 10).forEach(imgUrl => {
      xml += `    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
      <image:geo_location>Halkidiki, Greece</image:geo_location>
    </image:image>
`;
    });
    xml += `  </url>
`;
  });

  // ── Blog ──
  (articles.data || []).forEach(a => {
    if (!a.image_url) return;
    xml += `  <url>
    <loc>${baseUrl}/blog/${a.slug}</loc>
    <image:image>
      <image:loc>${escapeXml(a.image_url)}</image:loc>
      <image:title>${escapeXml(a.title_el || a.title_en || '')}</image:title>
      <image:caption>${escapeXml((a.title_el || a.title_en || '') + ' — Chalkidiki Hub Blog')}</image:caption>
    </image:image>
  </url>
`;
  });

  // ── Villages ──
  (villages.data || []).forEach(v => {
    if (!v.image_url) return;
    xml += `  <url>
    <loc>${baseUrl}/places/${v.slug}</loc>
    <image:image>
      <image:loc>${escapeXml(v.image_url)}</image:loc>
      <image:title>${escapeXml(v.name_el || v.name_en || '')}</image:title>
      <image:caption>${escapeXml((v.name_el || v.name_en || '') + ', Χαλκιδική')}</image:caption>
      <image:geo_location>Halkidiki, Greece</image:geo_location>
    </image:image>
  </url>
`;
  });

  xml += `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=172800, stale-while-revalidate=172800',
    },
  });
}
