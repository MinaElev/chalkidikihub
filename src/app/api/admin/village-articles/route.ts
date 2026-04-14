import { NextResponse } from 'next/server';
import { createAdminClient, createApiClient } from '@/lib/api-helpers';

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
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: maxTokens, temperature: 0.75 }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${err}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[άα]/g, 'a').replace(/[έε]/g, 'e').replace(/[ήη]/g, 'i').replace(/[ίι]/g, 'i')
    .replace(/[όο]/g, 'o').replace(/[ύυ]/g, 'y').replace(/[ώω]/g, 'o').replace(/[ς]/g, 's')
    .replace(/[σ]/g, 's').replace(/[δ]/g, 'd').replace(/[φ]/g, 'f').replace(/[γ]/g, 'g')
    .replace(/[ξ]/g, 'x').replace(/[κ]/g, 'k').replace(/[λ]/g, 'l').replace(/[μ]/g, 'm')
    .replace(/[ν]/g, 'n').replace(/[π]/g, 'p').replace(/[ρ]/g, 'r').replace(/[τ]/g, 't')
    .replace(/[θ]/g, 'th').replace(/[χ]/g, 'ch').replace(/[ψ]/g, 'ps').replace(/[ζ]/g, 'z')
    .replace(/[β]/g, 'v').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

const AREA_NAMES_EL: Record<string, string> = {
  kassandra: 'Κασσάνδρα',
  sithonia: 'Σιθωνία',
  athos: 'Άθως',
  mainland: 'Ενδοχώρα Χαλκιδικής',
};

export async function POST(request: Request) {
  try {
    // Auth check
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabaseAuth = createApiClient();
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminDb = createAdminClient();
    const { data: profile } = await adminDb.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const targetSlug = body.village_slug || null; // null = all villages
    const dryRun = body.dry_run || false;

    const supabase = adminDb;

    // Fetch villages
    let villageQuery = supabase.from('villages').select('*').order('sort_order');
    if (targetSlug) villageQuery = villageQuery.eq('slug', targetSlug);
    const { data: villages, error: vErr } = await villageQuery;
    if (vErr || !villages?.length) {
      return NextResponse.json({ error: 'No villages found', details: vErr?.message }, { status: 404 });
    }

    // Check which villages already have articles
    const { data: existingArticles } = await supabase
      .from('blog_articles')
      .select('slug')
      .like('slug', 'odigos-gia-%');
    const existingSlugs = new Set((existingArticles || []).map(a => a.slug));

    const results: Array<{ village: string; slug: string; status: string }> = [];
    const errors: Array<{ village: string; error: string }> = [];

    for (const village of villages) {
      const villageNameEl = village.name_el || '';
      const articleSlug = `odigos-gia-${village.slug}`;

      // Skip if article already exists
      if (existingSlugs.has(articleSlug)) {
        results.push({ village: villageNameEl, slug: articleSlug, status: 'already_exists' });
        continue;
      }

      if (dryRun) {
        results.push({ village: villageNameEl, slug: articleSlug, status: 'dry_run' });
        continue;
      }

      try {
        const areaEl = AREA_NAMES_EL[village.area] || village.area;

        // Fetch related content for this village's area
        const [beachesRes, restaurantsRes, activitiesRes, listingsRes] = await Promise.all([
          supabase.from('beaches').select('name_el, slug, features, rating, description_el').eq('area', village.area).order('rating', { ascending: false }).limit(10),
          supabase.from('restaurants').select('name_el, slug, cuisine, rating, price_level').eq('area', village.area).order('rating', { ascending: false }).limit(10),
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

        // ── STEP 1: Generate Greek article ──
        const articlePrompt = `Είσαι ένας ταξιδιωτικός journalist που ζει στη Χαλκιδική 20 χρόνια. Γράψε τον ΑΠΟΛΥΤΟ οδηγό για το χωριό "${villageNameEl}" στην περιοχή ${areaEl}, Χαλκιδική.

ΠΛΗΡΟΦΟΡΙΕΣ ΠΟΥ ΕΧΕΙΣ:
- Χωριό: ${villageNameEl} (${village.name_en || ''})
- Περιοχή: ${areaEl}
- Πληθυσμός: ${village.population || 'μικρό χωριό'}
- Περιγραφή: ${village.description_el || ''}
- Γεωγραφική θέση: lat ${village.latitude}, lng ${village.longitude}
- Κοντινές παραλίες: ${beachInfo || 'πολλές παραλίες στην περιοχή'}
- Εστιατόρια: ${restaurantInfo || 'τοπικές ταβέρνες'}
- Δραστηριότητες: ${activityInfo || 'εξερεύνηση, κολύμβηση'}
- Καταλύματα: ${listingInfo || 'ενοικιαζόμενα δωμάτια'}

ΔΟΜΗ ΑΡΘΡΟΥ (ΥΠΟΧΡΕΩΤΙΚΗ):
1. Εισαγωγικό <p> — γιατί αξίζει να επισκεφτείς αυτό το χωριό, τι το κάνει μοναδικό
2. <h2>Γνωρίστε ${villageNameEl}</h2> — ιστορία, χαρακτήρας, ατμόσφαιρα, αρχιτεκτονική
3. <h2>Παραλίες κοντά στ${villageNameEl.endsWith('η') || villageNameEl.endsWith('ά') ? 'η' : 'ο'} ${villageNameEl}</h2> — αναλυτικά 3-5 παραλίες, τι προσφέρει η καθεμία
4. <h2>Πού να φάτε</h2> — εστιατόρια, ταβέρνες, τι να δοκιμάσετε
5. <h2>Τι να κάνετε</h2> — δραστηριότητες, αξιοθέατα, εκδρομές, νυχτερινή ζωή
6. <h2>Πού να μείνετε</h2> — τύποι καταλυμάτων, τιμές, tips κράτησης
7. <h2>Πώς να φτάσετε</h2> — απόσταση από Θεσσαλονίκη, μεταφορικά μέσα
8. <h2>Πρακτικές πληροφορίες</h2> — καλύτερη εποχή, τι να πάρετε μαζί, tips

ΚΑΝΟΝΕΣ:
- Γράψε 1000-1500 λέξεις
- Χρησιμοποίησε <h2>, <h3>, <p>, <ul><li>, <strong>, <blockquote>
- Ανέφερε ΠΡΑΓΜΑΤΙΚΑ ονόματα (παραλίες, εστιατόρια) από τα data που σου δίνω
- Γράψε σαν φίλος που δίνει συμβουλές, ΟΧΙ σαν Wikipedia
- Βάλε 1 <blockquote> με insider tip
- Κάθε <h2> section να έχει τουλάχιστον 2 παραγράφους ή λίστα
- ΟΧΙ markdown — ΜΟΝΟ HTML tags
- Keywords: ${villageNameEl}, Χαλκιδική, ${areaEl}, παραλίες, καταλύματα, εστιατόρια

Επίστρεψε ΜΟΝΟ JSON:
{
  "title_el": "Ελκυστικός τίτλος μέχρι 65 χαρακτήρες — πρέπει να περιέχει '${villageNameEl}' και 'Χαλκιδική'",
  "excerpt_el": "1-2 προτάσεις δελεαστική περίληψη μέχρι 200 χαρακτήρες",
  "content_el": "<p>Εισαγωγή...</p><h2>...</h2>...",
  "read_time_min": 7,
  "tags": ["${villageNameEl.toLowerCase()}", "χαλκιδική", "${areaEl.toLowerCase()}", "tag4", "tag5", "tag6"],
  "unsplash_query": "Halkidiki ${village.name_en || villageNameEl} Greece village"
}`;

        const articleRaw = await callOpenAI(articlePrompt, 5000);
        const article = JSON.parse(articleRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

        if (!article.title_el || !article.content_el) throw new Error('AI returned incomplete article');

        // ── STEP 2: Fetch Unsplash image ──
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

        // ── STEP 3: Translations (titles + excerpts) + SEO ──
        const seoPrompt = `You are an expert translator and SEO specialist for a tourism website about Halkidiki, Greece.

Translate and optimize the following for a village guide article about "${village.name_en || villageNameEl}" in ${AREA_NAMES_EL[village.area] || village.area}, Halkidiki.

Greek title: "${article.title_el}"
Greek excerpt: "${article.excerpt_el}"

Return ONLY JSON:
{
  "translations": {
    "title_en": "", "title_de": "", "title_bg": "", "title_ru": "", "title_ro": "", "title_sr": "",
    "excerpt_en": "", "excerpt_de": "", "excerpt_bg": "", "excerpt_ru": "", "excerpt_ro": "", "excerpt_sr": ""
  },
  "seo": {
    "meta_title_el": "max 60 chars, include ${villageNameEl} and Χαλκιδική",
    "meta_title_en": "max 60 chars, include ${village.name_en || villageNameEl} and Halkidiki",
    "meta_title_de": "max 60 chars", "meta_title_bg": "max 60 chars",
    "meta_title_ru": "max 60 chars", "meta_title_ro": "max 60 chars", "meta_title_sr": "max 60 chars",
    "meta_description_el": "max 155 chars, compelling, include ${villageNameEl}, παραλίες, εστιατόρια",
    "meta_description_en": "max 155 chars", "meta_description_de": "max 155 chars",
    "meta_description_bg": "max 155 chars", "meta_description_ru": "max 155 chars",
    "meta_description_ro": "max 155 chars", "meta_description_sr": "max 155 chars",
    "image_alt": "English descriptive alt text for village photo"
  }
}`;

        const seoRaw = await callOpenAI(seoPrompt, 3000);
        const seo = JSON.parse(seoRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

        // ── STEP 4: Translate full content to 6 languages ──
        const translatePrompt = `Translate this Greek HTML article about the village "${villageNameEl}" in Halkidiki, Greece to 6 languages.
Keep ALL HTML tags exactly as they are. Translate naturally for tourism audience.

Greek content:
${article.content_el}

Return ONLY JSON:
{
  "content_en": "...", "content_de": "...", "content_bg": "...",
  "content_ru": "...", "content_ro": "...", "content_sr": "..."
}`;

        const transRaw = await callOpenAI(translatePrompt, 10000);
        const trans = JSON.parse(transRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

        // ── STEP 4.5: AI Polish & Format all content ──
        const polishPrompt = `You are an expert content editor for a premium tourism blog about Halkidiki, Greece.

Polish and enhance the following HTML article content in 7 languages. For EACH language:

1. Ensure proper HTML structure: clear <h2>/<h3> headings, well-formed <p> paragraphs (3-4 sentences each), <ul><li> bullet lists where appropriate
2. Add <strong> to highlight key names (beaches, restaurants, villages) and important phrases
3. Add 1-2 <blockquote> with insider tips or memorable quotes (styled as travel tips)
4. Ensure every <h2> section has at least 2 paragraphs or a paragraph + list
5. Make the text engaging, scannable, and tourism-friendly — like a friend giving advice
6. Do NOT change facts, names, or meaning — only restructure and enhance formatting
7. Do NOT add markdown — use ONLY HTML tags (<h2>, <h3>, <p>, <ul>, <li>, <strong>, <blockquote>, <em>)
8. Keep each translation in its OWN language — do not mix languages

Return ONLY a JSON object with the polished content for each language:
{
  "content_el": "<p>...</p><h2>...</h2>...",
  "content_en": "<p>...</p><h2>...</h2>...",
  "content_de": "...", "content_bg": "...",
  "content_ru": "...", "content_ro": "...", "content_sr": "..."
}

=== CONTENT TO POLISH ===

GREEK (content_el):
${article.content_el}

ENGLISH (content_en):
${trans.content_en || ''}

GERMAN (content_de):
${trans.content_de || ''}

BULGARIAN (content_bg):
${trans.content_bg || ''}

RUSSIAN (content_ru):
${trans.content_ru || ''}

ROMANIAN (content_ro):
${trans.content_ro || ''}

SERBIAN (content_sr):
${trans.content_sr || ''}`;

        let polished: Record<string, string> = {};
        try {
          const polishRaw = await callOpenAI(polishPrompt, 15000);
          polished = JSON.parse(polishRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
        } catch {
          // If polishing fails, use unpolished content
          polished = {};
        }

        // Use polished content if available, fall back to original
        const finalContentEl = polished.content_el || article.content_el;
        const finalContentEn = polished.content_en || trans.content_en || '';
        const finalContentDe = polished.content_de || trans.content_de || '';
        const finalContentBg = polished.content_bg || trans.content_bg || '';
        const finalContentRu = polished.content_ru || trans.content_ru || '';
        const finalContentRo = polished.content_ro || trans.content_ro || '';
        const finalContentSr = polished.content_sr || trans.content_sr || '';

        // ── STEP 5: Insert article ──
        const { error: insertError } = await supabase.from('blog_articles').insert({
          slug: articleSlug,
          category: 'guides',
          author: 'ChalkidikiHub',
          read_time_min: article.read_time_min || 7,
          tags: article.tags || [villageNameEl.toLowerCase(), 'χαλκιδική'],
          related_area_slugs: [village.area],
          related_beach_slugs: (beaches).slice(0, 3).map((b: { slug: string }) => b.slug),
          published_at: new Date().toISOString(),
          image_url: imageUrl,
          image_alt: imageAlt || seo.seo?.image_alt || `${village.name_en} village Halkidiki`,
          // Greek
          title_el: article.title_el,
          excerpt_el: article.excerpt_el,
          content_el: finalContentEl,
          // Translations
          title_en: seo.translations?.title_en || '', title_de: seo.translations?.title_de || '',
          title_bg: seo.translations?.title_bg || '', title_ru: seo.translations?.title_ru || '',
          title_ro: seo.translations?.title_ro || '', title_sr: seo.translations?.title_sr || '',
          excerpt_en: seo.translations?.excerpt_en || '', excerpt_de: seo.translations?.excerpt_de || '',
          excerpt_bg: seo.translations?.excerpt_bg || '', excerpt_ru: seo.translations?.excerpt_ru || '',
          excerpt_ro: seo.translations?.excerpt_ro || '', excerpt_sr: seo.translations?.excerpt_sr || '',
          content_en: finalContentEn, content_de: finalContentDe,
          content_bg: finalContentBg, content_ru: finalContentRu,
          content_ro: finalContentRo, content_sr: finalContentSr,
          // SEO
          meta_title_el: seo.seo?.meta_title_el || '', meta_title_en: seo.seo?.meta_title_en || '',
          meta_title_de: seo.seo?.meta_title_de || '', meta_title_bg: seo.seo?.meta_title_bg || '',
          meta_title_ru: seo.seo?.meta_title_ru || '', meta_title_ro: seo.seo?.meta_title_ro || '',
          meta_title_sr: seo.seo?.meta_title_sr || '',
          meta_description_el: seo.seo?.meta_description_el || '', meta_description_en: seo.seo?.meta_description_en || '',
          meta_description_de: seo.seo?.meta_description_de || '', meta_description_bg: seo.seo?.meta_description_bg || '',
          meta_description_ru: seo.seo?.meta_description_ru || '', meta_description_ro: seo.seo?.meta_description_ro || '',
          meta_description_sr: seo.seo?.meta_description_sr || '',
        });

        if (insertError) throw new Error(insertError.message);

        results.push({ village: villageNameEl, slug: articleSlug, status: 'created' });

        // Small delay between villages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        errors.push({ village: villageNameEl, error: (err as Error).message });
      }
    }

    // Log action
    await supabase.from('activity_logs').insert({
      type: 'admin_action', severity: 'info',
      message: `Village articles batch: ${results.filter(r => r.status === 'created').length} created, ${results.filter(r => r.status === 'already_exists').length} skipped, ${errors.length} errors`,
      details: { results, errors },
    });

    return NextResponse.json({
      success: true,
      total_villages: villages.length,
      created: results.filter(r => r.status === 'created').length,
      skipped: results.filter(r => r.status === 'already_exists').length,
      errors: errors.length,
      results,
      errors_detail: errors,
    });
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
