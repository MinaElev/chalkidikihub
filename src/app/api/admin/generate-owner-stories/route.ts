import { NextRequest, NextResponse } from 'next/server';
import { createApiClient, createAdminClient } from '@/lib/api-helpers';

// Bulk-generate owner_story drafts for published listings missing one.
// Two OpenAI calls per listing: (1) Greek narrative, (2) batched JSON
// translation to en/de/bg/ru/ro/sr. Run repeatedly with ?limit=5 until
// all listings are covered.
//
// Trigger:
//   curl -X POST 'https://chalkidikihub.gr/api/admin/generate-owner-stories?limit=5'
//   curl -X POST 'https://chalkidikihub.gr/api/admin/generate-owner-stories?slug=stepan-house-sykia&force=1'
//
// Same auth model as the other /api/admin/* routes — no token check
// (security flagged for separate review).

export const maxDuration = 300;

async function getOpenAIKey(): Promise<string> {
  try {
    const supabase = createApiClient();
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'openai_api_key').single();
    if (data?.value) return data.value as string;
  } catch {}
  return process.env.OPENAI_API_KEY || '';
}

async function callOpenAI(prompt: string, maxTokens: number, jsonMode: boolean = false): Promise<string> {
  const apiKey = await getOpenAIKey();
  if (!apiKey) throw new Error('OpenAI API key not configured');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI ${res.status}: ${errText.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

type ListingRow = {
  slug: string;
  title_el: string | null;
  title_en: string | null;
  area: string | null;
  location_name: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  guests_max: number | null;
  price_per_night: number | null;
  amenities: string[] | null;
  description_el: string | null;
  owner_story_el: string | null;
};

function buildGreekPrompt(l: ListingRow): string {
  const amenities = (l.amenities || []).slice(0, 12).join(', ') || '—';
  return `Γράψε ένα σύντομο, αυθεντικό κείμενο 150–200 λέξεων στα Ελληνικά για το παρακάτω κατάλυμα στη Χαλκιδική. Ύφος: editor σε τρίτο πρόσωπο, λιτά, χωρίς μάρκετινγκ-φλυαρίες ("ονειρικό", "μαγευτικό", "παράδεισος"). Συγκεκριμένα facts. Καλύψε:
1. Τι είναι (τύπος + μέγεθος).
2. Πού βρίσκεται και πώς συνδέεται με την περιοχή.
3. 1–2 πραγματικά δυνατά σημεία (όχι generic).
4. Σε ποιον ταιριάζει (ζευγάρια / οικογένειες / παρέες).

Στοιχεία:
- Όνομα: ${l.title_el || l.title_en || l.slug}
- Τοποθεσία: ${l.location_name || '—'}, περιοχή ${l.area || '—'}
- Δωμάτια: ${l.bedrooms ?? '—'} | Επισκέπτες: ${l.guests_max ?? '—'} | Μπάνια: ${l.bathrooms ?? '—'}
- Παροχές: ${amenities}
- Τιμή: από €${l.price_per_night ?? '—'}/βραδιά
${l.description_el ? `\nΥπάρχουσα περιγραφή (κράτα facts, χωρίς αντιγραφή): ${l.description_el.slice(0, 600)}` : ''}

Επιστροφή ΜΟΝΟ το κείμενο (όχι τίτλος, όχι markdown, όχι εισαγωγή).`;
}

function buildTranslatePrompt(greek: string): string {
  return `Translate the following Greek text into 6 languages. Return STRICT JSON with this exact shape:
{"en":"...","de":"...","bg":"...","ru":"...","ro":"...","sr":"..."}

Rules:
- "sr" must use Serbian Latin script (not Cyrillic).
- Preserve tone and length (within ±15%).
- Do NOT translate proper names of villages/areas — keep them as-is.
- Do NOT add disclaimers, prefixes or extra fields.

Greek source:
${greek}`;
}

type TranslationMap = { en: string; de: string; bg: string; ru: string; ro: string; sr: string };

async function translate(greek: string): Promise<Partial<TranslationMap>> {
  try {
    const raw = await callOpenAI(buildTranslatePrompt(greek), 1500, true);
    const parsed = JSON.parse(raw);
    return {
      en: typeof parsed.en === 'string' ? parsed.en : undefined,
      de: typeof parsed.de === 'string' ? parsed.de : undefined,
      bg: typeof parsed.bg === 'string' ? parsed.bg : undefined,
      ru: typeof parsed.ru === 'string' ? parsed.ru : undefined,
      ro: typeof parsed.ro === 'string' ? parsed.ro : undefined,
      sr: typeof parsed.sr === 'string' ? parsed.sr : undefined,
    };
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const limit = Math.min(20, Math.max(1, Number(url.searchParams.get('limit')) || 5));
  const force = url.searchParams.get('force') === '1';
  const onlySlug = url.searchParams.get('slug');

  // Service-role client — RLS would block updates with the anon key.
  const supabase = createAdminClient();

  let query = supabase
    .from('listings')
    .select('slug, title_el, title_en, area, location_name, bedrooms, bathrooms, guests_max, price_per_night, amenities, description_el, owner_story_el')
    .eq('status', 'published');

  if (onlySlug) {
    query = query.eq('slug', onlySlug);
  } else if (!force) {
    query = query.is('owner_story_el', null);
  }

  query = query.limit(limit);

  const { data: listings, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!listings || listings.length === 0) {
    return NextResponse.json({ processed: 0, message: 'No listings need owner_story' });
  }

  const results: Array<{ slug: string; status: 'ok' | 'failed'; reason?: string }> = [];

  for (const listing of listings as ListingRow[]) {
    try {
      const greek = (await callOpenAI(buildGreekPrompt(listing), 600)).trim();
      if (!greek || greek.length < 80) {
        results.push({ slug: listing.slug, status: 'failed', reason: 'short_or_empty_greek' });
        continue;
      }

      const tr = await translate(greek);

      const { error: updateErr } = await supabase
        .from('listings')
        .update({
          owner_story_el: greek,
          owner_story_en: tr.en ?? null,
          owner_story_de: tr.de ?? null,
          owner_story_bg: tr.bg ?? null,
          owner_story_ru: tr.ru ?? null,
          owner_story_ro: tr.ro ?? null,
          owner_story_sr: tr.sr ?? null,
        })
        .eq('slug', listing.slug);

      if (updateErr) {
        results.push({ slug: listing.slug, status: 'failed', reason: updateErr.message });
      } else {
        results.push({ slug: listing.slug, status: 'ok' });
      }
    } catch (e) {
      results.push({ slug: listing.slug, status: 'failed', reason: String(e).slice(0, 200) });
    }
  }

  return NextResponse.json({
    processed: results.length,
    ok: results.filter((r) => r.status === 'ok').length,
    failed: results.filter((r) => r.status === 'failed').length,
    results,
  });
}
