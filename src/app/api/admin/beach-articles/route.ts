import { NextResponse } from 'next/server';
import { createAdminClient, createApiClient } from '@/lib/api-helpers';

// Vercel Hobby default = 10s — extend to max 60s
export const maxDuration = 60;

async function getOpenAIKey(): Promise<string> {
  try {
    const supabase = createApiClient();
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'openai_api_key').single();
    if (data?.value) return data.value;
  } catch {}
  return process.env.OPENAI_API_KEY || '';
}

async function callOpenAI(prompt: string, maxTokens: number = 6000, retries: number = 2): Promise<string> {
  const apiKey = await getOpenAIKey();
  if (!apiKey) throw new Error('OpenAI API key not configured');
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: 'gpt-4o', messages: [{ role: 'user', content: prompt }], max_tokens: maxTokens, temperature: 0.75 }),
      });
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 429 && attempt < retries) {
          await new Promise(r => setTimeout(r, 5000 * (attempt + 1)));
          continue;
        }
        throw new Error(`OpenAI ${response.status}: ${errText.slice(0, 200)}`);
      }
      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) throw new Error('OpenAI returned empty response');
      return data.choices[0].message.content;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  throw new Error('OpenAI failed after retries');
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
    const targetSlug = body.beach_slug || null;
    const articleId = body.article_id || null;
    const dryRun = body.dry_run || false;

    const supabase = createAdminClient();

    // ─── STEP 1: Generate Greek article + image + save draft ───
    if (step === 1) {
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

      const results: Array<{ beach: string; slug: string; status: string; article_id?: string }> = [];
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

          // AI: Generate Greek article
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

          // Unsplash image
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

          // Insert Greek-only draft
          const { data: inserted, error: insertError } = await supabase.from('blog_articles').insert({
            slug: articleSlug,
            category: 'beaches',
            author: 'ChalkidikiHub',
            read_time_min: article.read_time_min || 6,
            tags: article.tags || [beachNameEl.toLowerCase(), 'παραλία', 'χαλκιδική'],
            related_area_slugs: [beach.area],
            related_beach_slugs: [beach.slug, ...((nearbyBeaches || []).slice(0, 2).map((b: { slug: string }) => b.slug))],
            published_at: new Date().toISOString(),
            image_url: imageUrl,
            image_alt: imageAlt || `${beachNameEn} beach Halkidiki`,
            title_el: article.title_el,
            excerpt_el: article.excerpt_el,
            content_el: article.content_el,
          }).select('id').single();

          if (insertError) throw new Error(insertError.message);

          results.push({ beach: beachNameEl, slug: articleSlug, status: 'step1_done', article_id: inserted?.id });

          // Delay between beaches to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (err) {
          errors.push({ beach: beachNameEl, error: (err as Error).message });
        }
      }

      // Log action
      await supabase.from('activity_logs').insert({
        type: 'admin_action', severity: 'info',
        message: `Beach articles step 1: ${results.filter(r => r.status === 'step1_done').length} drafted, ${results.filter(r => r.status === 'already_exists').length} skipped, ${errors.length} errors`,
        details: { results, errors },
      });

      return NextResponse.json({ success: true, step: 1, results, errors_detail: errors });
    }

    // ─── STEP 2: Translate + SEO + update ───
    if (step === 2 && articleId) {
      const { data: article } = await supabase.from('blog_articles')
        .select('id, slug, title_el, excerpt_el, content_el, image_alt')
        .eq('id', articleId).single();

      if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

      // Get beach info from slug
      const beachSlug = article.slug.replace('paralia-', '');
      const { data: beach } = await supabase.from('beaches').select('name_el, name_en, area').eq('slug', beachSlug).single();
      const beachNameEl = beach?.name_el || '';
      const beachNameEn = beach?.name_en || beachSlug;
      const areaEl = AREA_NAMES[beach?.area || '']?.el || beach?.area || '';
      const areaEn = AREA_NAMES[beach?.area || '']?.en || beach?.area || '';

      const allTranslationsPrompt = `You are an expert translator and SEO specialist for a premium tourism blog about Halkidiki beaches, Greece.
Translate and optimize everything for a beach guide about "${beachNameEn}" in ${areaEn}, Halkidiki.
Do NOT advertise any businesses — keep it about the beach and nature.

Greek title: "${article.title_el}"
Greek excerpt: "${article.excerpt_el}"

Greek content (markdown):
${article.content_el}

TRANSLATION RULES:
- Keep ALL markdown formatting exactly: ## headings, **bold**, - bullets, > blockquotes, blank lines
- Use **bold** for key features (crystal water, sandy, shallow water, etc.)
- Translate naturally for tourism audience — vivid, describe colors, sensations
- Keep each translation in its OWN language

Return ONLY JSON:
{
  "translations": {
    "title_en": "", "title_de": "", "title_bg": "", "title_ru": "", "title_ro": "", "title_sr": "",
    "excerpt_en": "", "excerpt_de": "", "excerpt_bg": "", "excerpt_ru": "", "excerpt_ro": "", "excerpt_sr": "",
    "content_en": "full markdown...", "content_de": "...", "content_bg": "...",
    "content_ru": "...", "content_ro": "...", "content_sr": "..."
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
        results: [{ beach: beachNameEl, slug: article.slug, status: 'created' }],
        errors_detail: [],
      });
    }

    return NextResponse.json({ error: 'Invalid step or missing article_id for step 2' }, { status: 400 });
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
