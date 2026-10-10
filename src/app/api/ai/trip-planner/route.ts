// Guard: public → per-IP rate limit in ai_request_log + result cache.
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { createApiClient, createAdminClient } from '@/lib/api-helpers';

export const maxDuration = 60;

// Public-endpoint guards: cap expensive OpenAI calls per visitor, and reuse
// identical itineraries instead of paying for them twice.
const RATE_LIMIT = 8;              // OpenAI-backed calls …
const RATE_WINDOW_MIN = 60;        // … per IP per this many minutes
const CACHE_TTL_DAYS = 30;

function clientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

async function getOpenAIKey(): Promise<string> {
  try {
    const supabase = createApiClient();
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'openai_api_key').single();
    if (data?.value) return data.value;
  } catch {}
  return process.env.OPENAI_API_KEY || '';
}

const AREA_EL: Record<string, string> = {
  kassandra: 'Κασσάνδρα', sithonia: 'Σιθωνία', athos: 'Άθως (Ουρανούπολη/Ιερισσός)', mainland: 'ενδοχώρα Χαλκιδικής',
};
const PARTY_EL: Record<string, string> = {
  family: 'οικογένεια με παιδιά', couple: 'ζευγάρι', friends: 'παρέα φίλων', solo: 'μόνος/η',
};

type CatalogRow = { slug: string; name_el?: string; name_en?: string; location_name?: string; area?: string };
type CatItem = { key: string; type: string; slug: string; name: string; location: string };

/**
 * POST /api/ai/trip-planner
 * Builds a day-by-day Chalkidiki itinerary from the site's OWN database
 * (beaches / restaurants / activities). The model may only reference items
 * from the supplied catalog; we validate every returned slug back against it,
 * so links always resolve and nothing is invented.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      days?: number; area?: string; party?: string; interests?: string[]; locale?: string;
    };
    const days = Math.min(Math.max(Number(body.days) || 3, 1), 7);
    const area = body.area && AREA_EL[body.area] ? body.area : '';
    const party = body.party && PARTY_EL[body.party] ? body.party : '';
    const interests = (body.interests || []).slice(0, 8);
    const locale = body.locale || 'el';

    const apiKey = await getOpenAIKey();
    if (!apiKey) return NextResponse.json({ error: 'OpenAI key not configured' }, { status: 500 });

    const supabase = createApiClient();

    // Guard tables (cache + rate-limit log) have RLS enabled with no public
    // policies, so they must be read/written with the service-role client.
    // If the key is absent the endpoint degrades gracefully (unprotected).
    let admin: ReturnType<typeof createAdminClient> | null = null;
    try { admin = createAdminClient(); } catch { admin = null; }

    // ── Cache: identical request → reuse stored itinerary (free, instant) ──
    const cacheKey = createHash('sha1')
      .update(JSON.stringify({ days, area, party, interests: [...interests].sort(), locale }))
      .digest('hex');
    if (admin) {
      try {
        const cutoff = new Date(Date.now() - CACHE_TTL_DAYS * 86_400_000).toISOString();
        const { data: cached } = await admin
          .from('trip_planner_cache')
          .select('result')
          .eq('cache_key', cacheKey)
          .gte('created_at', cutoff)
          .maybeSingle();
        if (cached?.result) return NextResponse.json(cached.result);
      } catch { /* table missing or unavailable → skip cache */ }
    }

    // ── Rate limit: cap OpenAI-backed calls per IP (cache hits are exempt) ──
    const ip = clientIp(request);
    if (admin) {
      try {
        const since = new Date(Date.now() - RATE_WINDOW_MIN * 60_000).toISOString();
        const { count } = await admin
          .from('ai_request_log')
          .select('id', { count: 'exact', head: true })
          .eq('ip', ip)
          .eq('endpoint', 'trip-planner')
          .gte('created_at', since);
        if ((count || 0) >= RATE_LIMIT) {
          return NextResponse.json(
            { error: locale === 'el'
              ? 'Πολλά αιτήματα σε λίγη ώρα. Δοκίμασε ξανά σε λίγο.'
              : 'Too many requests in a short time. Please try again later.' },
            { status: 429 },
          );
        }
        await admin.from('ai_request_log').insert({ ip, endpoint: 'trip-planner' });
      } catch { /* table missing or unavailable → skip rate limiting */ }
    }

    const sel = 'slug, name_el, name_en, location_name, area';
    const fetchCat = (table: string) => {
      const base = supabase.from(table).select(sel);
      return (area ? base.eq('area', area) : base).limit(30);
    };

    const [beachesRes, restaurantsRes, activitiesRes] = await Promise.all([
      fetchCat('beaches'),
      fetchCat('restaurants'),
      fetchCat('activities'),
    ]);

    function toItems(rows: CatalogRow[] | null, type: string): CatItem[] {
      return (rows || []).map((r) => ({
        key: `${type}:${r.slug}`,
        type,
        slug: r.slug,
        name: r.name_el || r.name_en || r.slug,
        location: r.location_name || '',
      }));
    }
    const beaches = toItems(beachesRes.data as CatalogRow[], 'beach');
    const restaurants = toItems(restaurantsRes.data as CatalogRow[], 'restaurant');
    const activities = toItems(activitiesRes.data as CatalogRow[], 'activity');
    const catalog = [...beaches, ...restaurants, ...activities];
    const catalogMap = new Map(catalog.map((c) => [c.key, c]));

    if (catalog.length === 0) {
      return NextResponse.json({ error: 'No content available for this area' }, { status: 404 });
    }

    const catalogText = [
      'ΠΑΡΑΛΙΕΣ:', ...beaches.map((b) => `- beach:${b.slug} — ${b.name}${b.location ? ` (${b.location})` : ''}`),
      '', 'ΕΣΤΙΑΤΟΡΙΑ / ΦΑΓΗΤΟ:', ...restaurants.map((r) => `- restaurant:${r.slug} — ${r.name}${r.location ? ` (${r.location})` : ''}`),
      '', 'ΔΡΑΣΤΗΡΙΟΤΗΤΕΣ / ΑΞΙΟΘΕΑΤΑ:', ...activities.map((a) => `- activity:${a.slug} — ${a.name}${a.location ? ` (${a.location})` : ''}`),
    ].join('\n');

    const areaLine = area ? `Περιοχή: ${AREA_EL[area]}.` : 'Περιοχή: όλη η Χαλκιδική (Κασσάνδρα, Σιθωνία, Άθως, ενδοχώρα).';
    const partyLine = party ? `Ταξιδιώτες: ${PARTY_EL[party]}.` : '';
    const interestsLine = interests.length ? `Ενδιαφέροντα: ${interests.join(', ')}.` : '';

    const prompt = `Είσαι ειδικός τοπικός ταξιδιωτικός σύμβουλος για τη Χαλκιδική.
Σχεδίασε ένα ρεαλιστικό πρόγραμμα ${days} ημερών.
${areaLine} ${partyLine} ${interestsLine}

ΑΥΣΤΗΡΟΙ ΚΑΝΟΝΕΣ:
- Χρησιμοποίησε ΜΟΝΟ σημεία από τον παρακάτω κατάλογο. ΜΗΝ επινοείς μέρη, παραλίες, εστιατόρια ή αξιοθέατα εκτός καταλόγου.
- Κάθε reference πρέπει να είναι ΑΚΡΙΒΩΣ ένα key από τον κατάλογο (μορφή "beach:slug", "restaurant:slug", "activity:slug").
- Κατανoμή λογική ανά ημέρα (γεωγραφική εγγύτητα, να μη διασχίζει άσκοπα όλη τη Χαλκιδική σε μία μέρα).
- Ζεστό, πρακτικό ύφος στα ΕΛΛΗΝΙΚΑ. Σύντομες προτάσεις.
- Επίστρεψε ΜΟΝΟ έγκυρο JSON, χωρίς markdown, στη μορφή:
{"intro":"σύντομη εισαγωγή 1-2 προτάσεις","days":[{"day":1,"title":"τίτλος ημέρας","morning":"...","afternoon":"...","evening":"...","places":["beach:slug","restaurant:slug"]}]}

ΚΑΤΑΛΟΓΟΣ ΔΙΑΘΕΣΙΜΩΝ ΣΗΜΕΙΩΝ:
${catalogText}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      return NextResponse.json({ error: `OpenAI ${response.status}: ${t.slice(0, 150)}` }, { status: 502 });
    }
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return NextResponse.json({ error: 'Empty response' }, { status: 502 });

    const parsed = JSON.parse(content) as {
      intro?: string;
      days?: { day?: number; title?: string; morning?: string; afternoon?: string; evening?: string; places?: string[] }[];
    };

    const pathMap: Record<string, string> = { beach: 'beaches', restaurant: 'restaurants', activity: 'activities' };
    const prefix = locale === 'el' ? '' : `/${locale}`;

    const outDays = (parsed.days || []).slice(0, days).map((d, i) => {
      const seen = new Set<string>();
      const places = (d.places || [])
        .map((key) => catalogMap.get(key))
        .filter((c): c is CatItem => !!c && !seen.has(c.key) && (seen.add(c.key), true))
        .map((c) => ({ type: c.type, slug: c.slug, name: c.name, location: c.location, href: `${prefix}/${pathMap[c.type]}/${c.slug}` }));
      return {
        day: d.day || i + 1,
        title: d.title || `Ημέρα ${i + 1}`,
        morning: d.morning || '',
        afternoon: d.afternoon || '',
        evening: d.evening || '',
        places,
      };
    });

    const result = { intro: parsed.intro || '', days: outDays };

    // Store for identical future requests (best-effort).
    if (admin) {
      try {
        await admin.from('trip_planner_cache').upsert(
          { cache_key: cacheKey, result, created_at: new Date().toISOString() },
          { onConflict: 'cache_key' },
        );
      } catch { /* table missing or unavailable → skip */ }
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
