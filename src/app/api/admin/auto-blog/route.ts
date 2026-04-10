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
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: maxTokens, temperature: 0.7 }),
  });
  if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
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

// Topic templates — rotate every 14 days
const TOPICS = [
  { template: 'best-beaches-{area}', category: 'beaches', promptEl: 'Γράψε οδηγό για τις καλύτερες παραλίες στην περιοχή {areaEl} της Χαλκιδικής. Ανέφερε τις παραλίες: {beachNames}. Για κάθε παραλία γράψε 2-3 προτάσεις (τι τη κάνει ξεχωριστή, τύπος άμμου/βοτσάλου, αν είναι οργανωμένη, ιδανική για ποιον).' },
  { template: 'village-guide-{village}', category: 'guides', promptEl: 'Γράψε πλήρη τουριστικό οδηγό για το χωριό {villageName} στη Χαλκιδική. Ανέφερε κοντινές παραλίες ({beachNames}), εστιατόρια ({restaurantNames}), τι να κάνεις, πώς να πας, πού να μείνεις.' },
  { template: 'food-guide-{area}', category: 'food', promptEl: 'Γράψε γαστρονομικό οδηγό για την περιοχή {areaEl}. Ανέφερε εστιατόρια: {restaurantNames}. Τοπικές γεύσεις, θαλασσινά, ταβέρνες, street food, tips.' },
  { template: 'hidden-gems-{area}', category: 'tips', promptEl: 'Γράψε άρθρο για κρυμμένα μαγαλιά στην {areaEl} Χαλκιδική που οι τουρίστες δεν ξέρουν. Μυστικές παραλίες, άγνωστα χωριά ({villageNames}), τοπικές εμπειρίες.' },
  { template: 'family-holidays-halkidiki', category: 'tips', promptEl: 'Γράψε οδηγό για οικογενειακές διακοπές στη Χαλκιδική. Ασφαλείς παραλίες με ρηχά νερά, παιδικές δραστηριότητες ({activityNames}), κατάλληλα χωριά ({villageNames}).' },
  { template: 'complete-guide-{village}', category: 'guides', promptEl: 'Γράψε πλήρη οδηγό για {villageName}: ιστορία, χαρακτήρας, παραλίες ({beachNames}), φαγητό ({restaurantNames}), δραστηριότητες, νυχτερινή ζωή, πρακτικές πληροφορίες.' },
  { template: 'best-beach-bars-halkidiki', category: 'food', promptEl: 'Γράψε οδηγό για τα καλύτερα beach bars στη Χαλκιδική. Ανέφερε εστιατόρια/bars: {restaurantNames}. Ατμόσφαιρα, κοκτέιλ, μουσική, θέα, τιμές.' },
  { template: 'historical-sites-halkidiki', category: 'culture', promptEl: 'Γράψε για τα ιστορικά μνημεία της Χαλκιδικής. Αρχαία Στάγειρα, Όλυνθος, Πετράλωνα, Άγιο Όρος. Δραστηριότητες: {activityNames}. Πολιτιστικές εκδρομές.' },
  { template: 'water-sports-halkidiki', category: 'activities', promptEl: 'Γράψε οδηγό θαλάσσιων σπορ στη Χαλκιδική. Windsurf, kayak, SUP, jet ski, scuba diving. Παραλίες: {beachNames}. Δραστηριότητες: {activityNames}.' },
  { template: 'romantic-getaway-{area}', category: 'tips', promptEl: 'Γράψε οδηγό ρομαντικής απόδρασης στην {areaEl}. Ήρεμες παραλίες, ρομαντικά εστιατόρια ({restaurantNames}), ηλιοβασιλέματα, boutique καταλύματα, χωριά ({villageNames}).' },
  { template: 'budget-holidays-halkidiki', category: 'tips', promptEl: 'Γράψε οδηγό budget διακοπών στη Χαλκιδική. Δωρεάν παραλίες, φτηνό φαγητό, camping, εναλλακτικές διαμονής, μετακίνηση. Χωριά: {villageNames}.' },
  { template: 'nightlife-{area}', category: 'guides', promptEl: 'Γράψε οδηγό νυχτερινής ζωής στην {areaEl}. Bars, clubs, beach parties, live music. Εστιατόρια/bars: {restaurantNames}. Τα hotspots, τι να περιμένεις.' },
  { template: 'autumn-halkidiki', category: 'tips', promptEl: 'Γράψε γιατί η Χαλκιδική είναι τέλεια και το φθινόπωρο. Ήπιος καιρός, άδειες παραλίες ({beachNames}), χαμηλές τιμές, πεζοπορία, μανιτάρια, τοπικά φεστιβάλ.' },
  { template: 'local-flavors-halkidiki', category: 'food', promptEl: 'Γράψε για τοπικά προϊόντα και γεύσεις Χαλκιδικής. Ελιές, μέλι, τσίπουρο, θαλασσινά, χωριάτικες ταβέρνες ({restaurantNames}). Αγορές, food tours.' },
];

const AREA_NAMES_EL: Record<string, string> = { kassandra: 'Κασσάνδρα', sithonia: 'Σιθωνία', athos: 'Άθως', mainland: 'Ενδοχώρα' };
const AREAS = ['kassandra', 'sithonia', 'athos', 'mainland'];

export async function POST(request: Request) {
  try {
    // Auth: check cron secret OR Bearer token
    const isCron = request.headers.get('x-cron-secret') === process.env.CRON_SECRET;
    if (!isCron) {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');
      if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

      const supabaseAuth = createApiClient();
      const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
      if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

      const { data: profile } = await supabaseAuth.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createAdminClient();

    // 1. Pick topic based on day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const topicIdx = dayOfYear % TOPICS.length;
    const topic = TOPICS[topicIdx];

    // 2. Pick random area and village
    const area = AREAS[dayOfYear % AREAS.length];
    const areaEl = AREA_NAMES_EL[area];

    // Fetch real data
    const [beachesRes, restaurantsRes, villagesRes, activitiesRes] = await Promise.all([
      supabase.from('beaches').select('name_el, slug, features, rating').eq('area', area).order('rating', { ascending: false }).limit(8),
      supabase.from('restaurants').select('name_el, slug, cuisine, rating').eq('area', area).order('rating', { ascending: false }).limit(8),
      supabase.from('villages').select('name_el, slug').eq('area', area).limit(10),
      supabase.from('activities').select('name_el, slug, category').eq('area', area).limit(6),
    ]);

    const beaches = (beachesRes.data || []) as Array<{ name_el: string; slug: string; features: string[]; rating: number }>;
    const restaurants = (restaurantsRes.data || []) as Array<{ name_el: string; slug: string; cuisine: string[]; rating: number }>;
    const villages = (villagesRes.data || []) as Array<{ name_el: string; slug: string }>;
    const activities = (activitiesRes.data || []) as Array<{ name_el: string; slug: string; category: string }>;

    // Pick a random village for village-specific topics
    const randomVillage = villages[dayOfYear % Math.max(villages.length, 1)];
    const villageName = randomVillage?.name_el || 'Χανιώτη';

    // Build context strings
    const beachNames = beaches.map(b => b.name_el).join(', ') || 'Σάρτη, Καρύδι, Πορτοκάλι';
    const restaurantNames = restaurants.map(r => r.name_el).join(', ') || 'τοπικά εστιατόρια';
    const villageNames = villages.map(v => v.name_el).join(', ') || 'τοπικά χωριά';
    const activityNames = activities.map(a => a.name_el).join(', ') || 'αξιοθέατα περιοχής';

    // 3. Generate Greek article
    const articlePrompt = `Είσαι ένας έμπειρος ταξιδιωτικός blogger που γράφει για τη Χαλκιδική, Ελλάδα.

${topic.promptEl
  .replace(/{areaEl}/g, areaEl)
  .replace(/{villageName}/g, villageName)
  .replace(/{beachNames}/g, beachNames)
  .replace(/{restaurantNames}/g, restaurantNames)
  .replace(/{villageNames}/g, villageNames)
  .replace(/{activityNames}/g, activityNames)}

ΚΑΝΟΝΕΣ:
- Γράψε 800-1200 λέξεις στα Ελληνικά
- Χρησιμοποίησε HTML formatting: <h2>, <h3>, <p>, <ul><li>, <strong>
- Χώρισε σε 4-5 ενότητες με headings
- Γράψε φυσικό, engaging κείμενο σαν travel blog
- Ανέφερε ΠΡΑΓΜΑΤΙΚΑ ονόματα τοπίων που σου δίνω
- Πρόσθεσε πρακτικές πληροφορίες (πώς πας, τιμές, tips)
- Μην χρησιμοποιείς markdown — ΜΟΝΟ HTML tags

Επίστρεψε ΜΟΝΟ JSON:
{
  "title_el": "Τίτλος στα ελληνικά (μέχρι 70 χαρακτήρες)",
  "excerpt_el": "Σύντομη περίληψη 1-2 προτάσεις (μέχρι 200 χαρακτήρες)",
  "content_el": "<h2>Heading</h2><p>Content...</p>...",
  "read_time_min": 6,
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

    const articleRaw = await callOpenAI(articlePrompt, 4000);
    const article = JSON.parse(articleRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

    if (!article.title_el || !article.content_el) {
      throw new Error('AI did not return valid article');
    }

    // 4. Get translations + SEO
    const seoPrompt = `You are an expert translator and SEO specialist for a tourism website about Halkidiki, Greece.

Given the following Greek content, do TWO things:

1. TRANSLATE the title and excerpt to: English (en), German (de), Bulgarian (bg), Russian (ru), Romanian (ro)
2. GENERATE SEO-optimized meta titles and meta descriptions in ALL 6 languages (including Greek)

Content:
- Title (Greek): "${article.title_el}"
- Excerpt (Greek): "${article.excerpt_el}"
- Category: ${topic.category}
- Location: ${areaEl}, Halkidiki, Greece

Return ONLY JSON:
{
  "translations": {
    "title_en": "", "title_de": "", "title_bg": "", "title_ru": "", "title_ro": "",
    "excerpt_en": "", "excerpt_de": "", "excerpt_bg": "", "excerpt_ru": "", "excerpt_ro": ""
  },
  "seo": {
    "meta_title_el": "max 60 chars", "meta_title_en": "", "meta_title_de": "", "meta_title_bg": "", "meta_title_ru": "", "meta_title_ro": "",
    "meta_description_el": "max 155 chars", "meta_description_en": "", "meta_description_de": "", "meta_description_bg": "", "meta_description_ru": "", "meta_description_ro": "",
    "image_alt": "English alt text"
  }
}`;

    const seoRaw = await callOpenAI(seoPrompt, 3000);
    const seo = JSON.parse(seoRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

    // 5. Translate full content to 5 languages
    const translatePrompt = `Translate the following Greek HTML tourism article to 5 languages. Keep ALL HTML tags exactly as they are.

Greek content:
${article.content_el}

Return ONLY JSON:
{
  "content_en": "English HTML...",
  "content_de": "German HTML...",
  "content_bg": "Bulgarian HTML...",
  "content_ru": "Russian HTML...",
  "content_ro": "Romanian HTML..."
}

IMPORTANT: Translate naturally, keep EXACT same HTML structure, translate ALL content.`;

    const translationsRaw = await callOpenAI(translatePrompt, 8000);
    const translations = JSON.parse(translationsRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

    // 6. Generate slug
    const slug = slugify(article.title_el) + '-' + Date.now().toString(36).slice(-4);

    // 7. Insert article
    const { error: insertError } = await supabase.from('blog_articles').insert({
      slug,
      category: topic.category,
      author: 'ChalkidikiHub AI',
      read_time_min: article.read_time_min || 6,
      tags: article.tags || [],
      related_area_slugs: [area],
      related_beach_slugs: beaches.slice(0, 3).map(b => b.slug),
      published_at: new Date().toISOString(),
      // Greek
      title_el: article.title_el,
      excerpt_el: article.excerpt_el,
      content_el: article.content_el,
      // Translations
      title_en: seo.translations.title_en, title_de: seo.translations.title_de,
      title_bg: seo.translations.title_bg, title_ru: seo.translations.title_ru, title_ro: seo.translations.title_ro,
      excerpt_en: seo.translations.excerpt_en, excerpt_de: seo.translations.excerpt_de,
      excerpt_bg: seo.translations.excerpt_bg, excerpt_ru: seo.translations.excerpt_ru, excerpt_ro: seo.translations.excerpt_ro,
      content_en: translations.content_en, content_de: translations.content_de,
      content_bg: translations.content_bg, content_ru: translations.content_ru, content_ro: translations.content_ro,
      // SEO
      meta_title_el: seo.seo.meta_title_el, meta_title_en: seo.seo.meta_title_en,
      meta_title_de: seo.seo.meta_title_de, meta_title_bg: seo.seo.meta_title_bg,
      meta_title_ru: seo.seo.meta_title_ru, meta_title_ro: seo.seo.meta_title_ro,
      meta_description_el: seo.seo.meta_description_el, meta_description_en: seo.seo.meta_description_en,
      meta_description_de: seo.seo.meta_description_de, meta_description_bg: seo.seo.meta_description_bg,
      meta_description_ru: seo.seo.meta_description_ru, meta_description_ro: seo.seo.meta_description_ro,
      image_alt: seo.seo.image_alt || '',
    });

    if (insertError) throw new Error(`DB insert failed: ${insertError.message}`);

    // 8. Log
    await supabase.from('activity_logs').insert({
      type: 'admin_action', severity: 'info',
      message: `Auto-blog: "${article.title_el}" (${topic.category})`,
      details: { slug, topic: topic.template, area, dayOfYear },
    });

    return NextResponse.json({
      success: true,
      slug,
      title: article.title_el,
      category: topic.category,
      area,
      wordCount: article.content_el.split(/\s+/).length,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
