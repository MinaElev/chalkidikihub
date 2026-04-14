import { NextResponse } from 'next/server';
import { createAdminClient, createApiClient } from '@/lib/api-helpers';

// Vercel Hobby default = 10s — extend to max 60s
export const maxDuration = 60;

// ─── Helpers ───

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

async function authenticateAdmin(request: Request): Promise<NextResponse | null> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabaseAuth = createApiClient();
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const adminDb = createAdminClient();
  const { data: profile } = await adminDb.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return null; // authenticated OK
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

// Slug prefix → category key lookup
const SLUG_PREFIX_TO_CATEGORY: Record<string, string> = {};
for (const [catKey, catDef] of Object.entries(TOPIC_CATEGORIES)) {
  SLUG_PREFIX_TO_CATEGORY[catDef.slugPrefix] = catKey;
}

function lookupTopicFromSlug(articleSlug: string): { category: string; topicDef: TopicDef; topic: TopicDef['topics'][number] } | null {
  for (const [catKey, catDef] of Object.entries(TOPIC_CATEGORIES)) {
    if (!articleSlug.startsWith(catDef.slugPrefix)) continue;
    const topicSlug = articleSlug.slice(catDef.slugPrefix.length);
    const topic = catDef.topics.find(t => t.slug === topicSlug);
    if (topic) return { category: catKey, topicDef: catDef, topic };
  }
  return null;
}

// ─── Step 1: Generate Greek article + Unsplash + INSERT draft ───

async function handleStep1(body: Record<string, unknown>): Promise<NextResponse> {
  const category = body.category as string;
  const targetSlug = body.topic_slug as string;

  if (!category || !TOPIC_CATEGORIES[category]) {
    return NextResponse.json({ error: 'Invalid category. Use: activities, tips, culture' }, { status: 400 });
  }
  if (!targetSlug) {
    return NextResponse.json({ error: 'topic_slug is required for step 1' }, { status: 400 });
  }

  const topicDef = TOPIC_CATEGORIES[category];
  const topic = topicDef.topics.find(t => t.slug === targetSlug);
  if (!topic) {
    return NextResponse.json({ error: 'Topic not found in category' }, { status: 404 });
  }

  const supabase = createAdminClient();
  const articleSlug = `${topicDef.slugPrefix}${topic.slug}`;

  // Check if already exists
  const { data: existing } = await supabase
    .from('blog_articles')
    .select('id, slug')
    .eq('slug', articleSlug)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'Article already exists', article_id: existing.id, slug: articleSlug }, { status: 409 });
  }

  // Fetch context data from DB
  const [beachesRes, activitiesRes, villagesRes] = await Promise.all([
    supabase.from('beaches').select('name_el, slug, area, features').order('rating', { ascending: false }).limit(15),
    supabase.from('activities').select('name_el, slug, area, category').limit(15),
    supabase.from('villages').select('name_el, slug, area').order('sort_order').limit(20),
  ]);
  const beachNames = (beachesRes.data || []).map(b => b.name_el).join(', ');
  const activityNames = (activitiesRes.data || []).map(a => a.name_el).join(', ');
  const villageNames = (villagesRes.data || []).map(v => v.name_el).join(', ');

  // Generate Greek article
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

  // Unsplash image
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

  // INSERT Greek-only draft
  const { data: inserted, error: insertError } = await supabase.from('blog_articles').insert({
    slug: articleSlug,
    category: topicDef.blogCategory,
    author: 'ChalkidikiHub',
    read_time_min: article.read_time_min || 7,
    tags: article.tags || ['χαλκιδική'],
    related_area_slugs: [],
    related_beach_slugs: [],
    published_at: new Date().toISOString(),
    image_url: imageUrl,
    image_alt: imageAlt || topic.titleHint,
    title_el: article.title_el,
    excerpt_el: article.excerpt_el,
    content_el: article.content_el,
    // Leave all other language fields empty — step 2 fills them
    title_en: '', title_de: '', title_bg: '', title_ru: '', title_ro: '', title_sr: '',
    excerpt_en: '', excerpt_de: '', excerpt_bg: '', excerpt_ru: '', excerpt_ro: '', excerpt_sr: '',
    content_en: '', content_de: '', content_bg: '', content_ru: '', content_ro: '', content_sr: '',
    meta_title_el: '', meta_title_en: '', meta_title_de: '', meta_title_bg: '',
    meta_title_ru: '', meta_title_ro: '', meta_title_sr: '',
    meta_description_el: '', meta_description_en: '', meta_description_de: '', meta_description_bg: '',
    meta_description_ru: '', meta_description_ro: '', meta_description_sr: '',
  }).select('id').single();

  if (insertError) throw new Error(insertError.message);

  await supabase.from('activity_logs').insert({
    type: 'admin_action', severity: 'info',
    message: `Topic article step 1: created Greek draft "${articleSlug}"`,
    details: { slug: articleSlug, category, step: 1 },
  });

  return NextResponse.json({
    success: true,
    step: 1,
    article_id: inserted!.id,
    slug: articleSlug,
    title_el: article.title_el,
  });
}

// ─── Step 2: Translate 6 langs + SEO → UPDATE ───

async function handleStep2(body: Record<string, unknown>): Promise<NextResponse> {
  const articleId = body.article_id as string;
  if (!articleId) {
    return NextResponse.json({ error: 'article_id is required for step 2' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Read article from DB
  const { data: article, error: fetchError } = await supabase
    .from('blog_articles')
    .select('id, slug, title_el, excerpt_el, content_el, image_alt')
    .eq('id', articleId)
    .single();

  if (fetchError || !article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  // Determine category and topic from slug
  const lookup = lookupTopicFromSlug(article.slug);
  if (!lookup) {
    return NextResponse.json({ error: `Cannot determine category/topic from slug: ${article.slug}` }, { status: 400 });
  }
  const { topicDef, topic } = lookup;

  // Translate + SEO in one call
  const allTranslationsPrompt = `Expert translator and SEO specialist for premium Halkidiki tourism blog.
Translate and optimize everything for article: "${topic.titleHint}" (${topicDef.label})

Greek title: "${article.title_el}"
Greek excerpt: "${article.excerpt_el}"

Greek content (markdown):
${article.content_el}

TRANSLATION RULES:
- Keep ALL markdown formatting: ## headings, **bold**, - bullets, > blockquotes, blank lines
- Use **bold** for key phrases and place names
- Translate naturally for tourism audience — engaging, scannable
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

  const allTransRaw = await callOpenAI(allTranslationsPrompt, 12000);
  const allTrans = JSON.parse(allTransRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
  const trans = allTrans.translations || {};
  const seo = allTrans.seo || {};

  // UPDATE the record with translations + SEO
  const { error: updateError } = await supabase.from('blog_articles').update({
    title_en: trans.title_en || '', title_de: trans.title_de || '',
    title_bg: trans.title_bg || '', title_ru: trans.title_ru || '',
    title_ro: trans.title_ro || '', title_sr: trans.title_sr || '',
    excerpt_en: trans.excerpt_en || '', excerpt_de: trans.excerpt_de || '',
    excerpt_bg: trans.excerpt_bg || '', excerpt_ru: trans.excerpt_ru || '',
    excerpt_ro: trans.excerpt_ro || '', excerpt_sr: trans.excerpt_sr || '',
    content_en: trans.content_en || '',
    content_de: trans.content_de || '',
    content_bg: trans.content_bg || '',
    content_ru: trans.content_ru || '',
    content_ro: trans.content_ro || '',
    content_sr: trans.content_sr || '',
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

  await supabase.from('activity_logs').insert({
    type: 'admin_action', severity: 'info',
    message: `Topic article step 2: translated "${article.slug}" (6 langs + SEO)`,
    details: { slug: article.slug, article_id: articleId, step: 2 },
  });

  return NextResponse.json({
    success: true,
    step: 2,
    article_id: articleId,
    slug: article.slug,
    translations: Object.keys(trans).length,
  });
}

// ─── POST handler ───

export async function POST(request: Request) {
  try {
    const authResponse = await authenticateAdmin(request);
    if (authResponse) return authResponse;

    const body = await request.json().catch(() => ({}));
    const step = body.step as number;

    if (step === 1) {
      return await handleStep1(body);
    } else if (step === 2) {
      return await handleStep2(body);
    } else {
      return NextResponse.json({ error: 'Invalid step. Use step: 1 or step: 2' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// ─── GET: Show status for all categories ───

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
