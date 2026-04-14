import { NextResponse } from 'next/server';
import { createAdminClient, createApiClient } from '@/lib/api-helpers';

// Vercel Hobby: default 10s, max 60s
export const maxDuration = 60;

async function getOpenAIKey(): Promise<string> {
  try {
    const supabase = createApiClient();
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'openai_api_key').single();
    if (data?.value) return data.value;
  } catch {}
  return process.env.OPENAI_API_KEY || '';
}

async function callOpenAI(prompt: string, maxTokens: number = 6000): Promise<string> {
  const apiKey = await getOpenAIKey();
  if (!apiKey) throw new Error('OpenAI API key not configured');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'gpt-4o', messages: [{ role: 'user', content: prompt }], max_tokens: maxTokens, temperature: 0.75 }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${err}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

const AREA_NAMES_EL: Record<string, string> = {
  kassandra: 'Κασσάνδρα',
  sithonia: 'Σιθωνία',
  athos: 'Άθως',
  mainland: 'Ενδοχώρα Χαλκιδικής',
};

async function authCheck(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return null;
  const supabaseAuth = createApiClient();
  const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
  if (error || !user) return null;
  const adminDb = createAdminClient();
  const { data: profile } = await adminDb.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'superadmin') return null;
  return user;
}

// ═══════════════════════════════════════════════════════════
// POST: 2-step article generation
// step=1 → Greek article + Unsplash + save draft (~25s)
// step=2 → Translate 6 langs + SEO + update record (~30s)
// ═══════════════════════════════════════════════════════════
export async function POST(request: Request) {
  try {
    const user = await authCheck(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const step = body.step || 1;
    const targetSlug = body.village_slug || null;
    const articleId = body.article_id || null;

    const supabase = createAdminClient();

    // ─── STEP 1: Generate Greek article + image + save draft ───
    if (step === 1) {
      // Fetch village
      let villageQuery = supabase.from('villages').select('*').order('sort_order');
      if (targetSlug) villageQuery = villageQuery.eq('slug', targetSlug);
      const { data: villages, error: vErr } = await villageQuery;
      if (vErr || !villages?.length) {
        return NextResponse.json({ error: 'No villages found' }, { status: 404 });
      }

      // Check existing
      const { data: existingArticles } = await supabase
        .from('blog_articles').select('slug').like('slug', 'odigos-gia-%');
      const existingSlugs = new Set((existingArticles || []).map(a => a.slug));

      const results: Array<{ village: string; slug: string; status: string; article_id?: string }> = [];
      const errors: Array<{ village: string; error: string }> = [];

      for (const village of villages) {
        const villageNameEl = village.name_el || '';
        const articleSlug = `odigos-gia-${village.slug}`;

        if (existingSlugs.has(articleSlug)) {
          results.push({ village: villageNameEl, slug: articleSlug, status: 'already_exists' });
          continue;
        }

        try {
          const areaEl = AREA_NAMES_EL[village.area] || village.area;

          // Fetch context data
          const [beachesRes, restaurantsRes, activitiesRes, listingsRes] = await Promise.all([
            supabase.from('beaches').select('name_el, slug, features, rating').eq('area', village.area).order('rating', { ascending: false }).limit(10),
            supabase.from('restaurants').select('name_el, slug, cuisine, price_level').eq('area', village.area).order('rating', { ascending: false }).limit(10),
            supabase.from('activities').select('name_el, slug, category').eq('area', village.area).limit(8),
            supabase.from('listings').select('title_el, slug, price_per_night, guests_max').eq('area', village.area).eq('status', 'published').limit(5),
          ]);

          const beaches = beachesRes.data || [];
          const restaurants = restaurantsRes.data || [];
          const activities = activitiesRes.data || [];
          const listings = listingsRes.data || [];

          const beachInfo = beaches.map(b => `${b.name_el} (${(b.features || []).slice(0, 3).join(', ')})`).join('; ');
          const restaurantInfo = restaurants.map(r => `${r.name_el} (${(r.cuisine || []).join('/')}, ${r.price_level || 'moderate'})`).join('; ');
          const activityInfo = activities.map(a => `${a.name_el} (${a.category})`).join('; ');
          const listingInfo = listings.map(l => `${l.title_el} (${l.price_per_night}€/βράδυ, ${l.guests_max} άτομα)`).join('; ');

          // AI: Generate Greek article
          const articlePrompt = `Είσαι ένας ταξιδιωτικός journalist που ζει στη Χαλκιδική 20 χρόνια. Γράψε τον ΑΠΟΛΥΤΟ οδηγό για το χωριό "${villageNameEl}" στην περιοχή ${areaEl}, Χαλκιδική.

ΠΛΗΡΟΦΟΡΙΕΣ:
- Χωριό: ${villageNameEl} (${village.name_en || ''})
- Περιοχή: ${areaEl}
- Πληθυσμός: ${village.population || 'μικρό χωριό'}
- Περιγραφή: ${village.description_el || ''}
- Κοντινές παραλίες: ${beachInfo || 'πολλές παραλίες στην περιοχή'}
- Εστιατόρια: ${restaurantInfo || 'τοπικές ταβέρνες'}
- Δραστηριότητες: ${activityInfo || 'εξερεύνηση, κολύμβηση'}
- Καταλύματα: ${listingInfo || 'ενοικιαζόμενα δωμάτια'}

ΔΟΜΗ (ΥΠΟΧΡΕΩΤΙΚΗ):
1. Εισαγωγική παράγραφος
2. ## Γνωρίστε ${villageNameEl}
3. ## Παραλίες κοντά στ${villageNameEl.endsWith('η') || villageNameEl.endsWith('ά') ? 'η' : 'ο'} ${villageNameEl}
4. ## Πού να φάτε
5. ## Τι να κάνετε
6. ## Πού να μείνετε
7. ## Πώς να φτάσετε
8. ## Πρακτικές πληροφορίες

ΜΟΡΦΟΠΟΙΗΣΗ: MARKDOWN μόνο (## headings, **bold**, - bullets, > blockquote). ΟΧΙ HTML. 1000-1500 λέξεις. Γράψε σαν φίλος.

Επίστρεψε ΜΟΝΟ JSON:
{
  "title_el": "Τίτλος ≤65 χαρ. με '${villageNameEl}' και 'Χαλκιδική'",
  "excerpt_el": "Περίληψη ≤200 χαρ.",
  "content_el": "markdown...",
  "read_time_min": 7,
  "tags": ["${villageNameEl.toLowerCase()}", "χαλκιδική", "${areaEl.toLowerCase()}", "tag4", "tag5"],
  "unsplash_query": "Halkidiki ${village.name_en || villageNameEl} Greece village"
}`;

          const articleRaw = await callOpenAI(articlePrompt, 5000);
          const article = JSON.parse(articleRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
          if (!article.title_el || !article.content_el) throw new Error('AI returned incomplete article');

          // Unsplash image
          let imageUrl = village.image_url || '';
          let imageAlt = '';
          try {
            const { data: unsplashSetting } = await supabase.from('site_settings').select('value').eq('key', 'unsplash_access_key').single();
            const unsplashKey = unsplashSetting?.value || process.env.UNSPLASH_ACCESS_KEY;
            if (unsplashKey && !imageUrl) {
              const query = article.unsplash_query || `Halkidiki ${village.name_en} Greece`;
              const uRes = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
                { headers: { Authorization: `Client-ID ${unsplashKey}` } }
              );
              if (uRes.ok) {
                const uData = await uRes.json();
                const photos = uData.results || [];
                if (photos.length > 0) {
                  const photo = photos[Math.floor(Math.random() * Math.min(photos.length, 3))];
                  imageUrl = photo.urls?.regular || '';
                  imageAlt = photo.alt_description || photo.description || query;
                  if (photo.links?.download_location) {
                    fetch(photo.links.download_location, { headers: { Authorization: `Client-ID ${unsplashKey}` } }).catch(() => {});
                  }
                }
              }
            }
          } catch {}

          // Insert Greek-only draft
          const { data: inserted, error: insertError } = await supabase.from('blog_articles').insert({
            slug: articleSlug,
            category: 'guides',
            author: 'ChalkidikiHub',
            read_time_min: article.read_time_min || 7,
            tags: article.tags || [villageNameEl.toLowerCase(), 'χαλκιδική'],
            related_area_slugs: [village.area],
            related_beach_slugs: beaches.slice(0, 3).map((b: { slug: string }) => b.slug),
            published_at: new Date().toISOString(),
            image_url: imageUrl,
            image_alt: imageAlt || `${village.name_en} village Halkidiki`,
            title_el: article.title_el,
            excerpt_el: article.excerpt_el,
            content_el: article.content_el,
          }).select('id').single();

          if (insertError) throw new Error(insertError.message);

          results.push({ village: villageNameEl, slug: articleSlug, status: 'step1_done', article_id: inserted?.id });
        } catch (err) {
          errors.push({ village: villageNameEl, error: (err as Error).message });
        }
      }

      return NextResponse.json({ success: true, step: 1, results, errors_detail: errors });
    }

    // ─── STEP 2: Translate + SEO + update ───
    if (step === 2 && articleId) {
      const { data: article } = await supabase.from('blog_articles')
        .select('id, slug, title_el, excerpt_el, content_el, image_alt')
        .eq('id', articleId).single();

      if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

      // Get village info from slug
      const villageSlug = article.slug.replace('odigos-gia-', '');
      const { data: village } = await supabase.from('villages').select('name_el, name_en, area').eq('slug', villageSlug).single();
      const villageNameEl = village?.name_el || '';
      const areaEl = AREA_NAMES_EL[village?.area || ''] || village?.area || '';

      const allTranslationsPrompt = `You are an expert translator and SEO specialist for a premium tourism blog about Halkidiki, Greece.
Translate and optimize everything for a village guide about "${village?.name_en || villageNameEl}" in ${areaEl}, Halkidiki.

Greek title: "${article.title_el}"
Greek excerpt: "${article.excerpt_el}"

Greek content (markdown):
${article.content_el}

RULES: Keep ALL markdown formatting. Translate naturally for tourism. Each language stays in its OWN language.

Return ONLY JSON:
{
  "translations": {
    "title_en": "", "title_de": "", "title_bg": "", "title_ru": "", "title_ro": "", "title_sr": "",
    "excerpt_en": "", "excerpt_de": "", "excerpt_bg": "", "excerpt_ru": "", "excerpt_ro": "", "excerpt_sr": "",
    "content_en": "full markdown...", "content_de": "...", "content_bg": "...",
    "content_ru": "...", "content_ro": "...", "content_sr": "..."
  },
  "seo": {
    "meta_title_el": "max 60 chars with ${villageNameEl}", "meta_title_en": "max 60 chars",
    "meta_title_de": "", "meta_title_bg": "", "meta_title_ru": "", "meta_title_ro": "", "meta_title_sr": "",
    "meta_description_el": "max 155 chars", "meta_description_en": "", "meta_description_de": "",
    "meta_description_bg": "", "meta_description_ru": "", "meta_description_ro": "", "meta_description_sr": "",
    "image_alt": "English alt text"
  }
}`;

      const allTransRaw = await callOpenAI(allTranslationsPrompt, 12000);
      const allTrans = JSON.parse(allTransRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
      const trans = allTrans.translations || {};
      const seo = allTrans.seo || {};

      // Update with translations + SEO
      const { error: updateError } = await supabase.from('blog_articles').update({
        title_en: trans.title_en || '', title_de: trans.title_de || '',
        title_bg: trans.title_bg || '', title_ru: trans.title_ru || '',
        title_ro: trans.title_ro || '', title_sr: trans.title_sr || '',
        excerpt_en: trans.excerpt_en || '', excerpt_de: trans.excerpt_de || '',
        excerpt_bg: trans.excerpt_bg || '', excerpt_ru: trans.excerpt_ru || '',
        excerpt_ro: trans.excerpt_ro || '', excerpt_sr: trans.excerpt_sr || '',
        content_en: trans.content_en || '', content_de: trans.content_de || '',
        content_bg: trans.content_bg || '', content_ru: trans.content_ru || '',
        content_ro: trans.content_ro || '', content_sr: trans.content_sr || '',
        meta_title_el: seo.meta_title_el || '', meta_title_en: seo.meta_title_en || '',
        meta_title_de: seo.meta_title_de || '', meta_title_bg: seo.meta_title_bg || '',
        meta_title_ru: seo.meta_title_ru || '', meta_title_ro: seo.meta_title_ro || '',
        meta_title_sr: seo.meta_title_sr || '',
        meta_description_el: seo.meta_description_el || '', meta_description_en: seo.meta_description_en || '',
        meta_description_de: seo.meta_description_de || '', meta_description_bg: seo.meta_description_bg || '',
        meta_description_ru: seo.meta_description_ru || '', meta_description_ro: seo.meta_description_ro || '',
        meta_description_sr: seo.meta_description_sr || '',
        image_alt: seo.image_alt || article.image_alt || '',
      }).eq('id', articleId);

      if (updateError) throw new Error(updateError.message);

      return NextResponse.json({
        success: true, step: 2,
        results: [{ village: villageNameEl, slug: article.slug, status: 'created' }],
        errors_detail: [],
      });
    }

    return NextResponse.json({ error: 'Invalid step' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// GET: Show status / list villages
export async function GET() {
  try {
    const supabase = createApiClient();
    const { data: villages } = await supabase.from('villages').select('slug, name_el, area').order('sort_order');
    const { data: articles } = await supabase.from('blog_articles').select('slug').like('slug', 'odigos-gia-%');

    const existingSlugs = new Set((articles || []).map(a => a.slug));
    const status = (villages || []).map(v => ({
      village: v.name_el,
      slug: v.slug,
      area: v.area,
      article_slug: `odigos-gia-${v.slug}`,
      has_article: existingSlugs.has(`odigos-gia-${v.slug}`),
    }));

    return NextResponse.json({
      total: status.length,
      with_article: status.filter(s => s.has_article).length,
      without_article: status.filter(s => !s.has_article).length,
      villages: status,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
