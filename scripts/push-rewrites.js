// Push rewritten HTML articles to Supabase blog_articles.
//
// Reads scripts/rewrites/<slug>.html and updates content_el for matching slug.
// Also updates excerpt_el (1st paragraph trimmed), read_time_min (words/200), updated_at.
//
// Usage:
//   node scripts/push-rewrites.js              # dry-run (show what would change)
//   node scripts/push-rewrites.js --commit     # actually update DB
//   node scripts/push-rewrites.js --commit --slug when-to-visit-halkidiki   # single

const fs = require('fs');
const path = require('path');

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const { revalidate } = require('./lib/revalidate');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing Supabase env');
  process.exit(1);
}

const DRY = !process.argv.includes('--commit');
const SLUG_FILTER = (() => {
  const i = process.argv.indexOf('--slug');
  return i >= 0 ? process.argv[i + 1] : null;
})();

function deriveExcerpt(html) {
  const firstP = html.match(/<p>([\s\S]*?)<\/p>/);
  if (!firstP) return '';
  const text = firstP[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return text.length > 200 ? text.substring(0, 197) + '...' : text;
}

function wordCount(html) {
  return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

async function updateArticle(slug, html) {
  const excerpt = deriveExcerpt(html);
  const words = wordCount(html);
  const readTime = Math.max(3, Math.round(words / 200));
  const body = {
    content_el: html,
    excerpt_el: excerpt,
    read_time_min: readTime,
    updated_at: new Date().toISOString(),
  };

  console.log(`\n=== ${slug} ===`);
  console.log(`  words: ${words}, read_time: ${readTime}min`);
  console.log(`  excerpt: ${excerpt.substring(0, 100)}...`);

  if (DRY) {
    console.log('  [DRY] would PATCH');
    return false;
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(`  ERROR ${res.status}: ${await res.text()}`);
    return false;
  }
  const rows = await res.json();
  console.log(`  OK updated (${rows.length} row)`);
  return true;
}

(async () => {
  const dir = path.join(__dirname, 'rewrites');
  if (!fs.existsSync(dir)) {
    console.error('No scripts/rewrites/ directory');
    process.exit(1);
  }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  console.log(`Found ${files.length} HTML rewrite(s) in ${dir}`);
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'}`);

  const changed = [];
  for (const file of files) {
    const slug = file.replace(/\.html$/, '');
    if (SLUG_FILTER && slug !== SLUG_FILTER) continue;
    const html = fs.readFileSync(path.join(dir, file), 'utf8');
    if (await updateArticle(slug, html)) changed.push(slug);
  }

  if (DRY) {
    console.log('\nDry-run complete. Re-run with --commit to apply.');
  } else if (changed.length) {
    console.log(`\nRevalidating ${changed.length} article(s) on the live site...`);
    await revalidate('blog', changed);
  }
})();
