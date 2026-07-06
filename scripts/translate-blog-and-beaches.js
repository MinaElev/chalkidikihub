// Translate Greek blog articles and beach descriptions to target locales.
//
// Usage:
//   node scripts/translate-blog-and-beaches.js --locale en                    # dry-run, sample 3
//   node scripts/translate-blog-and-beaches.js --locale en --commit           # all blog + beaches
//   node scripts/translate-blog-and-beaches.js --locale en --commit --blog    # blog only
//   node scripts/translate-blog-and-beaches.js --locale en --commit --beaches # beaches only
//   node scripts/translate-blog-and-beaches.js --locale en --commit --limit 5 # only 5 items
//
// Model: gpt-4o-mini (cheap, good for translation)
// Cost estimate: ~$2-3 for ALL items × ALL 6 locales

const fs = require('fs');
const path = require('path');

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_KEY) { console.error('Missing OPENAI_API_KEY'); process.exit(1); }
if (!SUPABASE_URL) { console.error('Missing Supabase env'); process.exit(1); }

const DRY = !process.argv.includes('--commit');
const LOCALE = (() => {
  const i = process.argv.indexOf('--locale');
  if (i < 0) { console.error('Required: --locale <en|de|bg|ru|ro|sr>'); process.exit(1); }
  return process.argv[i + 1];
})();
const LIMIT = (() => {
  const i = process.argv.indexOf('--limit');
  return i >= 0 ? parseInt(process.argv[i + 1], 10) : (DRY ? 3 : Infinity);
})();
const BLOG_ONLY = process.argv.includes('--blog');
const BEACHES_ONLY = process.argv.includes('--beaches');

const LANG_NAMES = {
  en: 'English',
  de: 'German (Deutsch)',
  bg: 'Bulgarian (Български)',
  ru: 'Russian (Русский)',
  ro: 'Romanian (Română)',
  sr: 'Serbian (Srpski, Latin script)',
};

if (!LANG_NAMES[LOCALE]) { console.error('Unsupported locale: ' + LOCALE); process.exit(1); }

const MODEL = 'gpt-4o-mini';

async function callOpenAI(prompt, expectJson = true) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 4000,
      ...(expectJson ? { response_format: { type: 'json_object' } } : {}),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

function buildBlogPrompt(article, targetLang) {
  return `Translate the following Greek blog article fields to ${targetLang}.

IMPORTANT RULES:
- Preserve HTML tags (<p>, <h2>, <ul>, <li>, <strong>, <table>, etc.) EXACTLY as in source
- Preserve proper nouns of places (Halkidiki, Kassandra, Sithonia, Athos, etc.) — use standard transliteration if needed
- Maintain factual accuracy — distances, prices, hours are precise data
- Natural, native-sounding ${targetLang} — not literal translation
- Keep the same tone (informative, practical, friendly)
- Do NOT add or remove information

INPUT (Greek):
title: ${JSON.stringify(article.title_el)}
excerpt: ${JSON.stringify(article.excerpt_el)}
content: ${JSON.stringify(article.content_el)}
meta_title: ${JSON.stringify(article.meta_title_el || '')}
meta_description: ${JSON.stringify(article.meta_description_el || '')}

OUTPUT: Return ONLY a JSON object with keys: title, excerpt, content, meta_title, meta_description.
Each value is the translated string in ${targetLang}. No explanations, no markdown wrapping.`;
}

function buildBeachPrompt(beach, targetLang) {
  return `Translate the following Greek beach description fields to ${targetLang}.

IMPORTANT RULES:
- Preserve paragraph breaks (\\n\\n) EXACTLY as in source
- Preserve proper nouns of places (Halkidiki, Kassandra, Sithonia, Athos, beach names) — use standard transliteration if needed
- Maintain factual accuracy — distances, prices, hours are precise data
- Natural, native-sounding ${targetLang} — not literal translation
- Keep the same tone (informative, practical, friendly)

INPUT (Greek):
name: ${JSON.stringify(beach.name_el)}
description: ${JSON.stringify(beach.description_el)}
meta_title: ${JSON.stringify(beach.meta_title_el || '')}
meta_description: ${JSON.stringify(beach.meta_description_el || '')}

OUTPUT: Return ONLY a JSON object with keys: name, description, meta_title, meta_description.
Each value is the translated string in ${targetLang}. No explanations, no markdown wrapping.`;
}

async function fetchRows(table, selectCols) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=${selectCols}&order=slug`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  return res.json();
}

async function updateRow(table, slug, payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ ...payload, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`PATCH ${res.status}: ${await res.text()}`);
}

async function translateBlog() {
  console.log(`\n=== BLOG (${LOCALE}) ===`);
  const cols = `slug,title_el,excerpt_el,content_el,meta_title_el,meta_description_el,title_${LOCALE},content_${LOCALE}`;
  const rows = await fetchRows('blog_articles', cols);
  // Skip articles whose Greek source is empty, but DO translate articles that
  // already have a target translation — when the EL was rewritten, the old
  // translation is stale and we need to refresh it.
  const todo = rows.filter(r => r.content_el && r.content_el.length > 100).slice(0, LIMIT);
  console.log(`  ${todo.length} articles to translate (of ${rows.length} total)`);

  for (let i = 0; i < todo.length; i++) {
    const article = todo[i];
    console.log(`  [${i + 1}/${todo.length}] ${article.slug}`);
    try {
      const response = await callOpenAI(buildBlogPrompt(article, LANG_NAMES[LOCALE]));
      const t = JSON.parse(response);
      const payload = {
        [`title_${LOCALE}`]: t.title || '',
        [`excerpt_${LOCALE}`]: t.excerpt || '',
        [`content_${LOCALE}`]: t.content || '',
        [`meta_title_${LOCALE}`]: t.meta_title || '',
        [`meta_description_${LOCALE}`]: t.meta_description || '',
      };
      if (DRY) {
        console.log(`    [DRY] title: ${t.title?.substring(0, 60)}`);
        console.log(`    [DRY] content sample: ${t.content?.substring(0, 100)}`);
      } else {
        await updateRow('blog_articles', article.slug, payload);
        console.log(`    OK (${t.content?.length} chars)`);
      }
    } catch (e) {
      console.error(`    ERROR: ${e.message}`);
    }
  }
}

async function translateBeaches() {
  console.log(`\n=== BEACHES (${LOCALE}) ===`);
  const cols = `slug,name_el,description_el,meta_title_el,meta_description_el`;
  const rows = await fetchRows('beaches', cols);
  const todo = rows.filter(r => r.description_el && r.description_el.length > 100).slice(0, LIMIT);
  console.log(`  ${todo.length} beaches to translate (of ${rows.length} total)`);

  for (let i = 0; i < todo.length; i++) {
    const beach = todo[i];
    console.log(`  [${i + 1}/${todo.length}] ${beach.slug}`);
    try {
      const response = await callOpenAI(buildBeachPrompt(beach, LANG_NAMES[LOCALE]));
      const t = JSON.parse(response);
      const payload = {
        [`name_${LOCALE}`]: t.name || '',
        [`description_${LOCALE}`]: t.description || '',
        [`meta_title_${LOCALE}`]: t.meta_title || '',
        [`meta_description_${LOCALE}`]: t.meta_description || '',
      };
      if (DRY) {
        console.log(`    [DRY] name: ${t.name}`);
        console.log(`    [DRY] desc sample: ${t.description?.substring(0, 100)}`);
      } else {
        await updateRow('beaches', beach.slug, payload);
        console.log(`    OK (${t.description?.length} chars)`);
      }
    } catch (e) {
      console.error(`    ERROR: ${e.message}`);
    }
  }
}

(async () => {
  console.log(`Locale: ${LOCALE} (${LANG_NAMES[LOCALE]})`);
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'}`);
  console.log(`Model: ${MODEL}`);

  if (!BEACHES_ONLY) await translateBlog();
  if (!BLOG_ONLY) await translateBeaches();

  if (DRY) console.log('\nDry-run complete. Re-run with --commit to apply.');
})();
