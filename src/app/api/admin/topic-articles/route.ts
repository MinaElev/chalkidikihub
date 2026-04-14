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

// ─── Topic definitions ───
interface TopicDef {
  label: string;
  blogCategory: string;
  slugPrefix: string;
  topics: Array<{ slug: string; titleHint: string; context: string }>;
}

const TOPIC_CATEGORIES: Record<string, TopicDef> = {
  activities: {
    label: 'Δραστηριότητες',
    blogCategory: 'activities',
    slugPrefix: 'drastiriotita-',
    topics: [
      { slug: 'diving-halkidiki', titleHint: 'Καταδύσεις στη Χαλκιδική', context: 'Scuba diving spots, diving schools, marine life, best locations for beginners and advanced divers in Halkidiki' },
      { slug: 'hiking-trails-halkidiki', titleHint: 'Πεζοπορία στη Χαλκιδική', context: 'Hiking trails, mountain paths, nature walks, difficulty levels, scenic routes across Kassandra, Sithonia and Athos' },
      { slug: 'sailing-halkidiki', titleHint: 'Ιστιοπλοΐα στη Χαλκιδική', context: 'Sailing routes, boat rental, yacht charters, marinas, best winds and seasons, island hopping from Halkidiki' },
      { slug: 'kayaking-sup-halkidiki', titleHint: 'Kayak & SUP στη Χαλκιδική', context: 'Sea kayaking routes, SUP spots, calm bays, guided tours, equipment rental, best beaches for paddling' },
      { slug: 'mountain-biking-halkidiki', titleHint: 'Mountain Biking στη Χαλκιδική', context: 'Mountain bike trails, cycling routes, terrain types, bike rental, off-road adventures in pine forests' },
      { slug: 'fishing-halkidiki', titleHint: 'Ψάρεμα στη Χαλκιδική', context: 'Fishing spots, fishing boat trips, catch types, seasonal fishing, traditional techniques, Porto Koufo, Ierissos' },
      { slug: 'horseback-riding-halkidiki', titleHint: 'Ιππασία στη Χαλκιδική', context: 'Horse riding on beaches, forest trails, riding schools, sunset rides, family-friendly activities' },
      { slug: 'water-sports-guide', titleHint: 'Θαλάσσια Σπορ στη Χαλκιδική', context: 'Jet ski, parasailing, banana boat, windsurfing, wakeboarding, best organized beaches for water sports' },
      { slug: 'boat-trips-islands', titleHint: 'Βόλτες με σκάφος στη Χαλκιδική', context: 'Boat trips to Drenia islands, Ammouliani, Diaporos, blue lagoon, glass bottom boats, private charters' },
      { slug: 'camping-halkidiki', titleHint: 'Camping στη Χαλκιδική', context: 'Campsites, free camping spots, beach camping, pine forest camping, camping tips, equipment checklist' },
    ],
  },
  tips: {
    label: 'Συμβουλές Ταξιδιού',
    blogCategory: 'tips',
    slugPrefix: 'symvouli-',
    topics: [
      { slug: 'first-time-halkidiki', titleHint: 'Πρώτη φορά στη Χαλκιδική', context: 'First time visitor guide, what to expect, top tips, common mistakes, best areas for first-timers' },
      { slug: 'budget-travel-halkidiki', titleHint: 'Χαλκιδική με μικρό budget', context: 'Budget travel tips, free beaches, cheap eats, affordable accommodation, money-saving hacks' },
      { slug: 'halkidiki-with-kids', titleHint: 'Χαλκιδική με παιδιά', context: 'Family travel guide, kid-friendly beaches, shallow water, playgrounds, family restaurants, baby equipment' },
      { slug: 'halkidiki-for-couples', titleHint: 'Χαλκιδική για ζευγάρια', context: 'Romantic getaways, secluded beaches, sunset spots, romantic restaurants, honeymoon tips' },
      { slug: 'nightlife-guide', titleHint: 'Νυχτερινή ζωή στη Χαλκιδική', context: 'Beach bars, clubs, live music, Kassandra nightlife vs Sithonia chill vibes, summer parties' },
      { slug: 'best-time-to-visit', titleHint: 'Πότε να πας Χαλκιδική', context: 'Monthly guide June-September, shoulder season benefits, weather, crowds, prices by month, Easter, autumn' },
      { slug: 'road-trip-itinerary', titleHint: 'Road trip στη Χαλκιδική', context: '7-day road trip itinerary, day-by-day plan, must-see stops, driving tips, petrol stations, scenic routes' },
      { slug: 'hidden-gems-halkidiki', titleHint: 'Κρυμμένα διαμάντια Χαλκιδικής', context: 'Secret spots, unknown beaches, hidden villages, local-only tavernas, off-the-beaten-path experiences' },
      { slug: 'pet-friendly-halkidiki', titleHint: 'Χαλκιδική με κατοικίδια', context: 'Pet-friendly beaches, dog-friendly accommodation, vet locations, pet travel tips, regulations' },
      { slug: 'digital-nomad-halkidiki', titleHint: 'Digital nomad στη Χαλκιδική', context: 'Coworking spots, WiFi quality, best cafes to work, long-stay accommodation, off-season life' },
    ],
  },
  culture: {
    label: 'Πολιτισμός & Ιστορία',
    blogCategory: 'culture',
    slugPrefix: 'politismos-',
    topics: [
      { slug: 'ancient-history-halkidiki', titleHint: 'Αρχαία ιστορία Χαλκιδικής', context: 'Ancient Olynthos, Stageira (Aristotle birthplace), Potidea, archaeological sites, ancient colonies' },
      { slug: 'traditional-festivals', titleHint: 'Παραδοσιακά πανηγύρια', context: 'Village festivals (panigiria), saints days, summer events, music, dance, local food at festivals' },
      { slug: 'local-cuisine-guide', titleHint: 'Τοπική κουζίνα Χαλκιδικής', context: 'Traditional dishes, fresh fish, local honey, olive oil, wine, mussels, octopus, local products' },
      { slug: 'olive-oil-tradition', titleHint: 'Ελαιόλαδο Χαλκιδικής', context: 'Olive oil production, olive groves, tastings, Halkidiki olives (the famous variety), harvest season' },
      { slug: 'wine-halkidiki', titleHint: 'Κρασί & αμπέλια Χαλκιδικής', context: 'Wine production, local varieties, wineries to visit, wine tasting, Tsantali, vineyard tours' },
      { slug: 'byzantine-heritage', titleHint: 'Βυζαντινή κληρονομιά', context: 'Byzantine towers, churches, frescoes, Ouranoupolis tower, monasteries influence, pilgrimage routes' },
      { slug: 'traditional-architecture', titleHint: 'Παραδοσιακή αρχιτεκτονική', context: 'Stone houses, Macedonian architecture, preserved villages like Afytos, Parthenon, Nikiti old village' },
      { slug: 'music-dance-traditions', titleHint: 'Μουσική & χοροί Χαλκιδικής', context: 'Traditional music, folk dances, local instruments, summer concerts, cultural events' },
      { slug: 'fishing-traditions', titleHint: 'Αλιευτική παράδοση', context: 'Fishing villages, traditional fishing methods, fish markets, boat building, maritime culture' },
      { slug: 'mythology-legends', titleHint: 'Μύθοι & θρύλοι Χαλκιδικής', context: 'Giant Athos legend, Poseidon and the trident, Xerxes canal, mythological connections, local legends' },
    ],
  },
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
    const category = body.category as string; // 'activities' | 'tips' | 'culture'
    const targetSlug = body.topic_slug as string || null;
    const dryRun = body.dry_run || false;

    if (!category || !TOPIC_CATEGORIES[category]) {
      return NextResponse.json({ error: 'Invalid category. Use: activities, tips, culture' }, { status: 400 });
    }

    const topicDef = TOPIC_CATEGORIES[category];
    const supabase = adminDb;

    // Check existing articles
    const { data: existingArticles } = await supabase
      .from('blog_articles')
      .select('slug')
      .like('slug', `${topicDef.slugPrefix}%`);
    const existingSlugs = new Set((existingArticles || []).map(a => a.slug));

    // Filter topics
    let topics = topicDef.topics;
    if (targetSlug) {
      topics = topics.filter(t => t.slug === targetSlug);
      if (topics.length === 0) return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    const results: Array<{ topic: string; slug: string; status: string }> = [];
    const errors: Array<{ topic: string; error: string }> = [];

    // Fetch context data from DB
    const [beachesRes, activitiesRes, villagesRes] = await Promise.all([
      supabase.from('beaches').select('name_el, slug, area, features').order('rating', { ascending: false }).limit(15),
      supabase.from('activities').select('name_el, slug, area, category').limit(15),
      supabase.from('villages').select('name_el, slug, area').order('sort_order').limit(20),
    ]);
    const beachNames = (beachesRes.data || []).map(b => b.name_el).join(', ');
    const activityNames = (activitiesRes.data || []).map(a => a.name_el).join(', ');
    const villageNames = (villagesRes.data || []).map(v => v.name_el).join(', ');

    for (const topic of topics) {
      const articleSlug = `${topicDef.slugPrefix}${topic.slug}`;

      if (existingSlugs.has(articleSlug)) {
        results.push({ topic: topic.titleHint, slug: articleSlug, status: 'already_exists' });
        continue;
      }

      if (dryRun) {
        results.push({ topic: topic.titleHint, slug: articleSlug, status: 'dry_run' });
        continue;
      }

      try {
        // ── STEP 1: Generate Greek article ──
        const articlePrompt = `Είσαι ταξιδιωτικός journalist που ζει στη Χαλκιδική 20 χρόνια. Γράψε ένα ΕΞΑΙΡΕΤΙΚΟ άρθρο με θέμα: "${topic.titleHint}".

ΚΑΤΗΓΟΡΙΑ: ${topicDef.label}
CONTEXT: ${topic.context}

ΓΝΩΣΗ ΓΙΑ ΤΗΝ ΧΑΛΚΙΔΙΚΗ:
- Παραλίες: ${beachNames}
- Δραστηριότητες: ${activityNames}
- Χωριά: ${villageNames}
- 3 χερσόνησοι: Κασσάνδρα (τουριστική, νυχτερινή ζωή), Σιθωνία (φύση, ηρεμία), Άθως (πνευματικότητα, ιστορία)
- Απόσταση από Θεσσαλονίκη: 1-2 ώρες

ΔΟΜΗ ΑΡΘΡΟΥ:
1. Εισαγωγική παράγραφος — hook τον αναγνώστη, γιατί αξίζει αυτό το θέμα
2-3. 3-5 sections με ## headings — κάθε section αναπτύσσει μια πτυχή του θέματος
4. ## Πρακτικές Συμβουλές — actionable tips
5. Κλείσιμο — σύνοψη, call to action

ΚΑΝΟΝΕΣ ΜΟΡΦΟΠΟΙΗΣΗΣ:
- Γράψε 1000-1500 λέξεις
- Χρησιμοποίησε MARKDOWN format:
  - Headings: "## Τίτλος" και "### Υποτίτλος"
  - Bold: **σημαντικές λέξεις**
  - Bullet lists: "- item"
  - Κενή γραμμή μεταξύ παραγράφων
  - Blockquote: "> insider tip" (1-2 στο άρθρο)
- ΟΧΙ HTML tags — ΜΟΝΟ markdown
- Γράψε σαν φίλος που μοιράζεται εμπειρίες
- Ανέφερε ΠΡΑΓΜΑΤΙΚΑ ονόματα τοποθεσιών (παραλίες, χωριά) από τα data
- ΟΧΙ διαφήμιση μαγαζιών — γενικές αναφορές μόνο
- Keywords: Χαλκιδική, ${topic.titleHint}

Επίστρεψε ΜΟΝΟ JSON:
{
  "title_el": "Ελκυστικός τίτλος μέχρι 65 χαρακτήρες με 'Χαλκιδική'",
  "excerpt_el": "1-2 προτάσεις περίληψη μέχρι 200 χαρακτήρες",
  "content_el": "Εισαγωγή...\\n\\n## Section...\\n\\nText...",
  "read_time_min": 7,
  "tags": ["χαλκιδική", "tag2", "tag3", "tag4", "tag5"],
  "unsplash_query": "Halkidiki Greece ${topic.context.split(',')[0]}"
}`;

        const articleRaw = await callOpenAI(articlePrompt, 5000);
        const article = JSON.parse(articleRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
        if (!article.title_el || !article.content_el) throw new Error('AI returned incomplete article');

        // ── STEP 2: Unsplash image ──
        let imageUrl = '';
        let imageAlt = '';
        try {
          const { data: unsplashSetting } = await supabase.from('site_settings').select('value').eq('key', 'unsplash_access_key').single();
          const unsplashKey = unsplashSetting?.value || process.env.UNSPLASH_ACCESS_KEY;
          if (unsplashKey) {
            const query = article.unsplash_query || `Halkidiki Greece ${topic.titleHint}`;
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

        // ── STEP 3: SEO + Title translations ──
        const seoPrompt = `Expert translator and SEO specialist for Halkidiki tourism website.

Translate and optimize for article: "${topic.titleHint}" (${topicDef.label})

Greek title: "${article.title_el}"
Greek excerpt: "${article.excerpt_el}"

Return ONLY JSON:
{
  "translations": {
    "title_en": "", "title_de": "", "title_bg": "", "title_ru": "", "title_ro": "", "title_sr": "",
    "excerpt_en": "", "excerpt_de": "", "excerpt_bg": "", "excerpt_ru": "", "excerpt_ro": "", "excerpt_sr": ""
  },
  "seo": {
    "meta_title_el": "max 60 chars", "meta_title_en": "max 60 chars",
    "meta_title_de": "max 60 chars", "meta_title_bg": "max 60 chars",
    "meta_title_ru": "max 60 chars", "meta_title_ro": "max 60 chars", "meta_title_sr": "max 60 chars",
    "meta_description_el": "max 155 chars", "meta_description_en": "max 155 chars",
    "meta_description_de": "max 155 chars", "meta_description_bg": "max 155 chars",
    "meta_description_ru": "max 155 chars", "meta_description_ro": "max 155 chars",
    "meta_description_sr": "max 155 chars",
    "image_alt": "English alt text"
  }
}`;

        const seoRaw = await callOpenAI(seoPrompt, 3000);
        const seo = JSON.parse(seoRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

        // ── STEP 4: Translate content ──
        const translatePrompt = `Translate this Greek markdown article about "${topic.titleHint}" in Halkidiki, Greece to 6 languages.
Keep ALL markdown formatting (## headings, **bold**, - bullets, > blockquotes, blank lines). Translate naturally for tourism audience.

Greek content:
${article.content_el}

Return ONLY JSON:
{
  "content_en": "...", "content_de": "...", "content_bg": "...",
  "content_ru": "...", "content_ro": "...", "content_sr": "..."
}`;

        const transRaw = await callOpenAI(translatePrompt, 10000);
        const trans = JSON.parse(transRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

        // ── STEP 4.5: AI Polish ──
        const polishPrompt = `Expert content editor for premium Halkidiki tourism blog.

Polish this MARKDOWN article in 7 languages about "${topic.titleHint}":

1. "## " for headings, "### " for subheadings
2. **bold** key phrases and place names
3. 1-2 blockquotes with "> " as insider tips
4. Blank lines between paragraphs
5. "- " for bullet lists
6. Engaging, scannable — like a friend sharing experiences
7. Do NOT change facts — only enhance formatting
8. ONLY markdown, NO HTML tags
9. Each language stays in its OWN language

Return ONLY JSON:
{
  "content_el": "...", "content_en": "...", "content_de": "...",
  "content_bg": "...", "content_ru": "...", "content_ro": "...", "content_sr": "..."
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

        // ── STEP 5: Insert ──
        const { error: insertError } = await supabase.from('blog_articles').insert({
          slug: articleSlug,
          category: topicDef.blogCategory,
          author: 'ChalkidikiHub',
          read_time_min: article.read_time_min || 7,
          tags: article.tags || ['χαλκιδική'],
          related_area_slugs: [],
          related_beach_slugs: [],
          published_at: new Date().toISOString(),
          image_url: imageUrl,
          image_alt: imageAlt || seo.seo?.image_alt || topic.titleHint,
          title_el: article.title_el, excerpt_el: article.excerpt_el,
          content_el: polished.content_el || article.content_el,
          title_en: seo.translations?.title_en || '', title_de: seo.translations?.title_de || '',
          title_bg: seo.translations?.title_bg || '', title_ru: seo.translations?.title_ru || '',
          title_ro: seo.translations?.title_ro || '', title_sr: seo.translations?.title_sr || '',
          excerpt_en: seo.translations?.excerpt_en || '', excerpt_de: seo.translations?.excerpt_de || '',
          excerpt_bg: seo.translations?.excerpt_bg || '', excerpt_ru: seo.translations?.excerpt_ru || '',
          excerpt_ro: seo.translations?.excerpt_ro || '', excerpt_sr: seo.translations?.excerpt_sr || '',
          content_en: polished.content_en || trans.content_en || '',
          content_de: polished.content_de || trans.content_de || '',
          content_bg: polished.content_bg || trans.content_bg || '',
          content_ru: polished.content_ru || trans.content_ru || '',
          content_ro: polished.content_ro || trans.content_ro || '',
          content_sr: polished.content_sr || trans.content_sr || '',
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
        results.push({ topic: topic.titleHint, slug: articleSlug, status: 'created' });

        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (err) {
        errors.push({ topic: topic.titleHint, error: (err as Error).message });
      }
    }

    await supabase.from('activity_logs').insert({
      type: 'admin_action', severity: 'info',
      message: `Topic articles [${category}]: ${results.filter(r => r.status === 'created').length} created, ${results.filter(r => r.status === 'already_exists').length} skipped, ${errors.length} errors`,
      details: { category, results, errors },
    });

    return NextResponse.json({
      success: true, category,
      total: topics.length,
      created: results.filter(r => r.status === 'created').length,
      skipped: results.filter(r => r.status === 'already_exists').length,
      errors: errors.length,
      results, errors_detail: errors,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// GET: Show status for all categories
export async function GET(request: Request) {
  try {
    const supabase = createApiClient();
    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    const allStatus: Record<string, unknown> = {};

    const categories = category ? [category] : Object.keys(TOPIC_CATEGORIES);

    for (const cat of categories) {
      const def = TOPIC_CATEGORIES[cat];
      if (!def) continue;

      const { data: articles } = await supabase
        .from('blog_articles')
        .select('slug')
        .like('slug', `${def.slugPrefix}%`);
      const existingSlugs = new Set((articles || []).map(a => a.slug));

      const topics = def.topics.map(t => ({
        topic: t.titleHint,
        slug: t.slug,
        article_slug: `${def.slugPrefix}${t.slug}`,
        has_article: existingSlugs.has(`${def.slugPrefix}${t.slug}`),
      }));

      allStatus[cat] = {
        label: def.label,
        total: topics.length,
        with_article: topics.filter(t => t.has_article).length,
        without_article: topics.filter(t => !t.has_article).length,
        topics,
      };
    }

    return NextResponse.json(allStatus);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
