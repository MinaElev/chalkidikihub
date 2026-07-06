// Translate the 7 newly-added blog articles to a target locale.
// Usage: node scripts/translate-new-articles.js <locale>

const fs = require('fs');
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const LOCALE = process.argv[2];

const NEW_SLUGS = ['sithonia-vs-kassandra', 'halkidiki-october-guide', 'halkidiki-with-dog', 'halkidiki-easter-guide', 'halkidiki-budget-guide', 'halkidiki-quiet-beaches', 'mount-athos-diamonitirion-guide'];
const LANG_NAMES = { en: 'English', de: 'German', bg: 'Bulgarian (Cyrillic)', ru: 'Russian (Cyrillic)', ro: 'Romanian', sr: 'Serbian (Latin script)' };

if (!LANG_NAMES[LOCALE]) { console.error('Usage: node translate-new-articles.js <en|de|bg|ru|ro|sr>'); process.exit(1); }

async function translate(article, targetLang) {
  const prompt = `Translate the following Greek blog article fields to ${targetLang}.

RULES:
- Preserve HTML tags (<p>,<h2>,<ul>,<li>,<strong>,<table>,<tr>,<th>,<td>) EXACTLY
- Preserve place names (Halkidiki, Kassandra, Sithonia, Athos, village names)
- Keep numbers/prices/distances/dates exact
- Natural native-sounding ${targetLang}

INPUT (Greek):
title: ${JSON.stringify(article.title_el)}
excerpt: ${JSON.stringify(article.excerpt_el)}
content: ${JSON.stringify(article.content_el)}
meta_title: ${JSON.stringify(article.meta_title_el)}
meta_description: ${JSON.stringify(article.meta_description_el)}

Return ONLY a JSON object with keys: title, excerpt, content, meta_title, meta_description.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.3, max_tokens: 4000, response_format: { type: 'json_object' } }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  return JSON.parse((await res.json()).choices[0].message.content);
}

(async () => {
  const inFilter = NEW_SLUGS.map(s => `"${s}"`).join(',');
  const r = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles?select=slug,title_el,excerpt_el,content_el,meta_title_el,meta_description_el&slug=in.(${inFilter})`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  const articles = await r.json();
  console.log(`${LOCALE.toUpperCase()}: translating ${articles.length} articles`);

  for (const article of articles) {
    try {
      const t = await translate(article, LANG_NAMES[LOCALE]);
      const payload = {
        [`title_${LOCALE}`]: t.title, [`excerpt_${LOCALE}`]: t.excerpt, [`content_${LOCALE}`]: t.content,
        [`meta_title_${LOCALE}`]: t.meta_title, [`meta_description_${LOCALE}`]: t.meta_description,
        updated_at: new Date().toISOString(),
      };
      const up = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles?slug=eq.${encodeURIComponent(article.slug)}`, {
        method: 'PATCH',
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(payload),
      });
      console.log(`  ${article.slug}: ${up.ok ? 'OK' : 'FAIL ' + up.status}`);
    } catch (e) { console.error(`  ${article.slug}: ERROR ${e.message}`); }
  }
  console.log('Done!');
})();
