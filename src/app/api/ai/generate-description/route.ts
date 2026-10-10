import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createApiClient } from '@/lib/api-helpers';
import { requireSuperAdmin, requireUser } from '@/lib/auth/guards';
import { allowRequest } from '@/lib/rate-limit';

export const maxDuration = 60;

async function getOpenAIKey(): Promise<string> {
  try {
    const supabase = createApiClient();
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'openai_api_key').single();
    if (data?.value) return data.value;
  } catch {}
  return process.env.OPENAI_API_KEY || '';
}

const AREA_EL: Record<string, string> = {
  kassandra: 'Κασσάνδρα', sithonia: 'Σιθωνία', athos: 'Άθως', mainland: 'ενδοχώρα Χαλκιδικής',
};
const TYPE_EL: Record<string, string> = {
  rooms: 'ενοικιαζόμενα δωμάτια', studio: 'studio', apartment: 'διαμέρισμα',
  maisonette: 'μεζονέτα', house: 'μονοκατοικία', villa: 'βίλα',
};

/**
 * POST /api/ai/generate-description
 * Owner-facing: drafts a warm, honest Greek description for a new listing from
 * the fields already filled in. The owner reviews/edits it; the site's existing
 * pipeline auto-translates the final text into the other 6 languages.
 */
export async function POST(request: NextRequest) {
  // v4 guard
  const __auth = await requireUser(); if (__auth instanceof NextResponse) return __auth;
  if (!(await allowRequest(request, 'ai-describe', 30, 60))) return NextResponse.json({ error: 'too_many_requests' }, { status: 429 });
  try {
    // Auth: only signed-in owners (this spends the OpenAI budget).
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = (await request.json()) as {
      title?: string; area?: string; location_name?: string; property_type?: string;
      guests_max?: number; bedrooms?: number; bathrooms?: number; amenities?: string[];
      keywords?: string;
    };

    const apiKey = await getOpenAIKey();
    if (!apiKey) return NextResponse.json({ error: 'OpenAI key not configured' }, { status: 500 });

    const area = AREA_EL[body.area || ''] || 'Χαλκιδική';
    const type = TYPE_EL[body.property_type || ''] || 'κατάλυμα';
    const amenities = (body.amenities || []).slice(0, 20).join(', ');

    const prompt = `Είσαι έμπειρος κειμενογράφος τουριστικών καταλυμάτων για τη Χαλκιδική.
Γράψε μια ΕΛΚΥΣΤΙΚΗ, ΕΙΛΙΚΡΙΝΗ περιγραφή στα ΕΛΛΗΝΙΚΑ για ένα κατάλυμα προς ενοικίαση.

Κανόνες:
- 90–140 λέξεις, 2 μικρές παράγραφοι, ζεστό αλλά όχι υπερβολικό ύφος.
- Ανάδειξε την τοποθεσία (πόσο κοντά στη θάλασσα/παραλίες), τον τύπο, τη χωρητικότητα και 3-5 από τις παροχές με φυσικό τρόπο.
- ΜΗΝ επινοείς ανύπαρκτες παροχές, αποστάσεις σε μέτρα, ή αστέρια/βραβεία. Χρησιμοποίησε μόνο ό,τι σου δίνεται.
- Απόφυγε κλισέ επαναλήψεις· γράψε σαν άνθρωπος, όχι λίστα.
- Κλείσε με μια διακριτική πρόσκληση (π.χ. «ιδανικό για...»).
- Επίστρεψε ΜΟΝΟ έγκυρο JSON: {"description":"..."} χωρίς markdown.

Στοιχεία καταλύματος:
- Τίτλος: "${(body.title || '').slice(0, 120)}"
- Τύπος: ${type}
- Περιοχή: ${area}${body.location_name ? ` (${body.location_name})` : ''}
- Χωρητικότητα: ${body.guests_max || '?'} άτομα, ${body.bedrooms ?? '?'} υπνοδωμάτια, ${body.bathrooms ?? '?'} μπάνια
- Παροχές: ${amenities || '—'}
- Έμφαση/λέξεις-κλειδιά από τον ιδιοκτήτη: "${(body.keywords || '').slice(0, 200)}"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 700,
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
    const parsed = JSON.parse(content) as { description?: string };
    return NextResponse.json({ description: (parsed.description || '').trim() });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
