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

const AREA_NAMES: Record<string, Record<string, string>> = {
  kassandra: { el: 'Κασσάνδρα', en: 'Kassandra' },
  sithonia: { el: 'Σιθωνία', en: 'Sithonia' },
  athos: { el: 'Άθως', en: 'Athos' },
  mainland: { el: 'Ενδοχώρα Χαλκιδικής', en: 'Halkidiki Mainland' },
};

const FEATURE_LABELS_EL: Record<string, string> = {
  sandy: 'αμμώδης', organized: 'οργανωμένη', free: 'ελεύθερη πρόσβαση', parking: 'πάρκινγκ',
  beachBar: 'beach bar', shallowWater: 'ρηχά νερά', sunbeds: 'ξαπλώστρες', waterSports: 'θαλάσσια σπορ',
  lifeguard: 'ναυαγοσώστης', accessible: 'προσβάσιμη ΑμεΑ', secluded: 'απομονωμένη',
  nudist: 'γυμνιστών', blueFlag: 'γαλάζια σημαία', snorkeling: 'snorkeling',
  camping: 'camping', rocky: 'βραχώδης', pebbly: 'βοτσαλωτή',
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

    const body = await request.json().catch(() => ({}));
    const targetSlug = body.beach_slug || null;
    const dryRun = body.dry_run || false;

    const supabase = adminDb;

    // Fetch beaches
    let beachQuery = supabase.from('beaches').select('*').order('rating', { ascending: false });
    if (targetSlug) beachQuery = beachQuery.eq('slug', targetSlug);
    const { data: beaches, error: bErr } = await beachQuery;
    if (bErr || !beaches?.length) {
      return NextResponse.json({ error: 'No beaches found', details: bErr?.message }, { status: 404 });
    }

    // Check which beaches already have articles
    const { data: existingArticles } = await supabase
      .from('blog_articles')
      .select('slug')
      .like('slug', 'paralia-%');
    const existingSlugs = new Set((existingArticles || []).map(a => a.slug));

    const results: Array<{ beach: string; slug: string; status: string }> = [];
    const errors: Array<{ beach: string; error: string }> = [];

    for (const beach of beaches) {
      const beachNameEl = beach.name_el || '';
      const beachNameEn = beach.name_en || beach.slug;
      const articleSlug = `paralia-${beach.slug}`;

      if (existingSlugs.has(articleSlug)) {
        results.push({ beach: beachNameEl, slug: articleSlug, status: 'already_exists' });
        continue;
      }

      if (dryRun) {
        results.push({ beach: beachNameEl, slug: articleSlug, status: 'dry_run' });
        continue;
      }

      try {
        const areaEl = AREA_NAMES[beach.area]?.el || beach.area;
        const areaEn = AREA_NAMES[beach.area]?.en || beach.area;
        const features = (beach.features || []) as string[];
        const featuresEl = features.map(f => FEATURE_LABELS_EL[f] || f).join(', ');
        const locationName = beach.location_name || '';
        const descriptionEl = beach.description_el || '';

        // Fetch nearby beaches for context
        const { data: nearbyBeaches } = await supabase
          .from('beaches')
          .select('name_el, slug, features, rating')
          .eq('area', beach.area)
          .neq('slug', beach.slug)
          .order('rating', { ascending: false })
          .limit(5);
        const nearbyInfo = (nearbyBeaches || []).map(b => b.name_el).join(', ');

        // ── STEP 1: Generate Greek article ──
        const articlePrompt = `Είσαι ταξιδιωτικός journalist που ζει στη Χαλκιδική 20 χρόνια. Γράψε έναν ΠΛΗΡΗ οδηγό για την παραλία "${beachNameEl}" στην περιοχή ${areaEl}, Χαλκιδική.

ΠΛΗΡΟΦΟΡΙΕΣ:
- Παραλία: ${beachNameEl} (${beachNameEn})
- Περιοχή: ${areaEl}
- Τοποθεσία: ${locationName}
- Χαρακτηριστικά: ${featuresEl}
- Βαθμολογία: ${beach.rating || '?'}/5
- Συντεταγμένες: ${beach.latitude}, ${beach.longitude}
- Υπάρχουσα περιγραφή: ${descriptionEl}
- Κοντινές παραλίες: ${nearbyInfo || 'υπάρχουν πολλές κοντά'}

ΔΟΜΗ ΑΡΘΡΟΥ (ΥΠΟΧΡΕΩΤΙΚΗ):
1. Εισαγωγική παράγραφος — γιατί ξεχωρίζει αυτή η παραλία, πρώτη εντύπωση
2. ## Η Παραλία ${beachNameEl} — περιγραφή τοπίου, νερού, άμμου, ατμόσφαιρας
3. ## Τι θα βρείτε εκεί — παροχές, ξαπλώστρες, beach bar, σπορ, ελεύθερη/οργανωμένη
4. ## Για ποιον είναι ιδανική — οικογένειες, ζευγάρια, νέοι, σπορ, ηρεμία
5. ## Πώς να φτάσετε — δρόμος, πάρκινγκ, πρόσβαση, απόσταση από Θεσσαλονίκη
6. ## Κοντινές παραλίες — 2-3 εναλλακτικές στην ίδια περιοχή
7. ## Tips & Συμβουλές — καλύτερη ώρα, τι να πάρετε μαζί, μυστικά

ΚΑΝΟΝΕΣ ΜΟΡΦΟΠΟΙΗΣΗΣ:
- Γράψε 800-1200 λέξεις
- Χρησιμοποίησε MARKDOWN format:
  - Headings: "## Τίτλος" και "### Υποτίτλος"
  - Bold: **σημαντικές λέξεις** και **χαρακτηριστικά**
  - Bullet lists: "- item"
  - Κενή γραμμή μεταξύ παραγράφων
  - Blockquote: "> insider tip"
- ΟΧΙ HTML tags — ΜΟΝΟ markdown
- Γράψε σαν φίλος — ζεστό, αυθεντικό ύφος
- Βάλε 1 blockquote ("> ") με insider tip
- ΟΧΙ διαφήμιση μαγαζιών — μόνο γενικές αναφορές (π.χ. "υπάρχουν beach bar", ΟΧΙ ονόματα)
- ΟΧΙ εστιατόρια/ξενοδοχεία — ΜΟΝΟ η παραλία και η φύση
- Keywords: ${beachNameEl}, παραλία, Χαλκιδική, ${areaEl}

Επίστρεψε ΜΟΝΟ JSON:
{
  "title_el": "Ελκυστικός τίτλος μέχρι 65 χαρακτήρες με '${beachNameEl}' και 'Χαλκιδική'",
  "excerpt_el": "1-2 προτάσεις δελεαστική περίληψη μέχρι 200 χαρακτήρες",
  "content_el": "Εισαγωγική παράγραφος...\\n\\n## Η Παραλία...\\n\\nΚείμενο...",
  "read_time_min": 6,
  "tags": ["${beachNameEl.toLowerCase()}", "παραλία", "χαλκιδική", "${areaEl.toLowerCase()}", "tag5", "tag6"],
  "unsplash_query": "Halkidiki ${beachNameEn} beach Greece crystal water"
}`;

        const articleRaw = await callOpenAI(articlePrompt, 5000);
        const article = JSON.parse(articleRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

        if (!article.title_el || !article.content_el) throw new Error('AI returned incomplete article');

        // ── STEP 2: Fetch Unsplash image ──
        let imageUrl = beach.image_url || '';
        let imageAlt = '';
        try {
          const { data: unsplashSetting } = await supabase.from('site_settings').select('value').eq('key', 'unsplash_access_key').single();
          const unsplashKey = unsplashSetting?.value || process.env.UNSPLASH_ACCESS_KEY;
          if (unsplashKey && !imageUrl) {
            const query = article.unsplash_query || `Halkidiki ${beachNameEn} beach Greece`;
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

Translate and optimize the following for a beach guide article about "${beachNameEn}" beach in ${areaEn}, Halkidiki.

Greek title: "${article.title_el}"
Greek excerpt: "${article.excerpt_el}"

Return ONLY JSON:
{
  "translations": {
    "title_en": "", "title_de": "", "title_bg": "", "title_ru": "", "title_ro": "", "title_sr": "",
    "excerpt_en": "", "excerpt_de": "", "excerpt_bg": "", "excerpt_ru": "", "excerpt_ro": "", "excerpt_sr": ""
  },
  "seo": {
    "meta_title_el": "max 60 chars, include ${beachNameEl} and Χαλκιδική",
    "meta_title_en": "max 60 chars, include ${beachNameEn} and Halkidiki",
    "meta_title_de": "max 60 chars", "meta_title_bg": "max 60 chars",
    "meta_title_ru": "max 60 chars", "meta_title_ro": "max 60 chars", "meta_title_sr": "max 60 chars",
    "meta_description_el": "max 155 chars, compelling, include ${beachNameEl}",
    "meta_description_en": "max 155 chars", "meta_description_de": "max 155 chars",
    "meta_description_bg": "max 155 chars", "meta_description_ru": "max 155 chars",
    "meta_description_ro": "max 155 chars", "meta_description_sr": "max 155 chars",
    "image_alt": "English descriptive alt text for beach photo"
  }
}`;

        const seoRaw = await callOpenAI(seoPrompt, 3000);
        const seo = JSON.parse(seoRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

        // ── STEP 4: Translate full content to 6 languages ──
        const translatePrompt = `Translate this Greek markdown article about the beach "${beachNameEl}" in Halkidiki, Greece to 6 languages.
Keep ALL markdown formatting exactly as it is (## headings, **bold**, - bullets, > blockquotes, blank lines between paragraphs). Translate naturally for tourism audience.
Do NOT advertise any businesses — keep it about the beach and nature.

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
        const polishPrompt = `You are an expert content editor for a premium tourism blog about Halkidiki beaches in Greece.

Polish and enhance the following MARKDOWN beach article content in 7 languages. For EACH language:

1. Use "## " for main section headings and "### " for subheadings
2. Use **bold** to highlight key features (crystal water, sandy, shallow water, etc.)
3. Add 1 blockquote with "> " prefix as an insider tip for visitors
4. Separate paragraphs with blank lines (two newlines)
5. Use "- " for bullet lists
6. Make text vivid — describe colors, sensations, atmosphere
7. Do NOT add any business names, restaurant names, or hotel names — keep it about nature
8. Do NOT use any HTML tags — use ONLY markdown formatting
9. Keep each translation in its OWN language

Return ONLY JSON:
{
  "content_el": "Intro with **bold**...\\n\\n## Heading\\n\\nText...",
  "content_en": "...", "content_de": "...", "content_bg": "...",
  "content_ru": "...", "content_ro": "...", "content_sr": "..."
}

=== CONTENT ===

GREEK: ${article.content_el}

ENGLISH: ${trans.content_en || ''}

GERMAN: ${trans.content_de || ''}

BULGARIAN: ${trans.content_bg || ''}

RUSSIAN: ${trans.content_ru || ''}

ROMANIAN: ${trans.content_ro || ''}

SERBIAN: ${trans.content_sr || ''}`;

        let polished: Record<string, string> = {};
        try {
          const polishRaw = await callOpenAI(polishPrompt, 15000);
          polished = JSON.parse(polishRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
        } catch {
          polished = {};
        }

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
          category: 'beaches',
          author: 'ChalkidikiHub',
          read_time_min: article.read_time_min || 6,
          tags: article.tags || [beachNameEl.toLowerCase(), 'παραλία', 'χαλκιδική'],
          related_area_slugs: [beach.area],
          related_beach_slugs: [beach.slug, ...((nearbyBeaches || []).slice(0, 2).map((b: { slug: string }) => b.slug))],
          published_at: new Date().toISOString(),
          image_url: imageUrl,
          image_alt: imageAlt || seo.seo?.image_alt || `${beachNameEn} beach Halkidiki`,
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

        results.push({ beach: beachNameEl, slug: articleSlug, status: 'created' });

        // Delay between beaches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        errors.push({ beach: beachNameEl, error: (err as Error).message });
      }
    }

    // Log action
    await supabase.from('activity_logs').insert({
      type: 'admin_action', severity: 'info',
      message: `Beach articles batch: ${results.filter(r => r.status === 'created').length} created, ${results.filter(r => r.status === 'already_exists').length} skipped, ${errors.length} errors`,
      details: { results, errors },
    });

    return NextResponse.json({
      success: true,
      total_beaches: beaches.length,
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

// GET: Show status
export async function GET() {
  try {
    const supabase = createApiClient();

    const { data: beaches } = await supabase.from('beaches').select('slug, name_el, area, rating, features').order('rating', { ascending: false });
    const { data: articles } = await supabase.from('blog_articles').select('slug').like('slug', 'paralia-%');

    const existingSlugs = new Set((articles || []).map(a => a.slug));
    const status = (beaches || []).map(b => ({
      beach: b.name_el,
      slug: b.slug,
      area: b.area,
      rating: b.rating,
      features: b.features || [],
      article_slug: `paralia-${b.slug}`,
      has_article: existingSlugs.has(`paralia-${b.slug}`),
    }));

    return NextResponse.json({
      total: status.length,
      with_article: status.filter(s => s.has_article).length,
      without_article: status.filter(s => !s.has_article).length,
      beaches: status,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
