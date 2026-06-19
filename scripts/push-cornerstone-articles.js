// Push 5 cornerstone blog articles to Supabase blog_articles table.
// Each article is a full JSON file under backups/article-*.json with both EL and EN.
//
// Usage:
//   node scripts/push-cornerstone-articles.js              # dry run
//   node scripts/push-cornerstone-articles.js --commit

const fs = require('fs');
const path = require('path');

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !process.argv.includes('--commit');

const FILES = [
  'article-halkidiki-vs-corfu.json',
  'article-where-to-stay-halkidiki-first-time.json',
  'article-best-time-to-visit-halkidiki.json',
  'article-halkidiki-by-car-from-thessaloniki.json',
  'article-halkidiki-with-kids-complete-guide.json',
];

const NOW = new Date().toISOString();

(async () => {
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'} | ${FILES.length} articles`);

  for (const file of FILES) {
    const art = JSON.parse(fs.readFileSync(path.join('backups', file), 'utf8'));
    const wordsEl = art.content_el.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const wordsEn = art.content_en.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    console.log(`\n${art.slug}: ${wordsEl} EL words / ${wordsEn} EN words, ${art.category}`);

    const row = {
      slug: art.slug,
      title_el: art.title_el,
      title_en: art.title_en,
      excerpt_el: art.excerpt_el,
      excerpt_en: art.excerpt_en,
      meta_title_el: art.meta_title_el,
      meta_title_en: art.meta_title_en,
      meta_description_el: art.meta_description_el,
      meta_description_en: art.meta_description_en,
      content_el: art.content_el,
      content_en: art.content_en,
      category: art.category,
      image_url: art.image_url,
      image_alt: art.image_alt,
      author: art.author,
      read_time_min: art.read_time_min,
      tags: art.tags,
      related_area_slugs: art.related_area_slugs,
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
    if (res.ok) console.log('  OK inserted');
    else console.log(`  ERROR ${res.status}: ${await res.text()}`);
  }
})();
