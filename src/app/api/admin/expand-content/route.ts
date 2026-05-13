import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { GUIDES } from '@/app/[locale]/guide/[slug]/guide-data';
import { visibleWordCount, isThinContent } from '@/lib/content-quality';

// POST /api/admin/expand-content
//
// Fills thin / empty translations with AI-written content grounded in the
// existing Greek + English source. Targets the 5 non-source locales by
// default; pass ?locales=… to override.
//
// Query params:
//   type   = places | guide   (required)
//   limit  = batch size (default 5, max 20)
//   slug   = process this slug only (optional, debugging)
//   locales = comma-separated locales (default 'de,bg,ru,ro,sr')
//
// Auth: same as the rest of /api/admin/* (flagged for token check).

export const maxDuration = 300;

const DEFAULT_TARGET_LOCALES = ['de', 'bg', 'ru', 'ro', 'sr'];
const MODEL = 'gpt-4o-mini';

const LOCALE_NAMES: Record<string, string> = {
  de: 'German',
  bg: 'Bulgarian',
  ru: 'Russian',
  ro: 'Romanian',
  sr: 'Serbian (use Latin script — Srpski, not Cyrillic)',
};

async function callOpenAI(prompt: string, maxTokens = 700): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: maxTokens,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text: string = data.choices?.[0]?.message?.content?.trim() || '';
  // Strip code fences if the model wrapped output.
  return text.replace(/^```(?:html|markdown)?\n?/i, '').replace(/```\s*$/i, '').trim();
}

function buildPrompt(opts: {
  topic: string;
  sourceEl: string;
  sourceEn: string;
  targetLocale: string;
  isHtml: boolean;
}): string {
  const { topic, sourceEl, sourceEn, targetLocale, isHtml } = opts;
  const localeName = LOCALE_NAMES[targetLocale] || targetLocale;
  const format = isHtml
    ? `HTML output ONLY. Use <h2>, <p>, <ul>, <li>, <strong>. No <html>/<body>. 180-230 words.`
    : `Plain HTML output (a few <p> tags). 160-200 words.`;
  return [
    `You are localizing a travel-site section for the Halkidiki, Greece region.`,
    `Topic: ${topic}`,
    ``,
    `Greek source (canonical, may be detailed):`,
    sourceEl || '(none)',
    ``,
    `English source:`,
    sourceEn || '(none)',
    ``,
    `Task: produce an original, factually accurate version in ${localeName}.`,
    `- Do NOT translate word-for-word. Adapt phrasing to native idiom.`,
    `- Expand modestly with related facts you confidently know about Halkidiki/Chalkidiki for this topic.`,
    `- Stay grounded — no invented place names, beaches, or restaurants.`,
    `- Keep the same structural sections as the source if applicable.`,
    `- ${format}`,
    `Output ONLY the content. No preamble, no explanation.`,
  ].join('\n');
}

type Result = { slug: string; locale: string; status: 'ok' | 'skipped' | 'failed'; reason?: string; words?: number };

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const limit = Math.max(1, Math.min(20, Number(url.searchParams.get('limit')) || 5));
  const slugFilter = url.searchParams.get('slug');
  const localesParam = url.searchParams.get('locales');
  const targetLocales = localesParam
    ? localesParam.split(',').map((s) => s.trim()).filter(Boolean)
    : DEFAULT_TARGET_LOCALES;

  if (type === 'places') return NextResponse.json(await expandPlaces(limit, slugFilter, targetLocales));
  if (type === 'guide') return NextResponse.json(await expandGuide(limit, slugFilter, targetLocales));
  if (type === 'guide-source') return NextResponse.json(await generateGuideFromScratch(limit, slugFilter));
  return NextResponse.json({ error: 'type must be places | guide | guide-source' }, { status: 400 });
}

// Generates fresh el+en+all-target-locale content for guides whose source
// text is missing in every language. Different prompt from `guide` (which
// only translates/adapts existing source) — this one writes from the title
// and a short brief, with strict grounding in real Halkidiki places.
async function generateGuideFromScratch(limit: number, slugFilter: string | null) {
  const supabase = createAdminClient();
  const { data: existing } = await supabase.from('guide_overrides').select('slug, locale');
  const haveOverride = new Set((existing || []).map((r) => `${r.slug}|${r.locale}`));

  const out: Result[] = [];
  let slugsProcessed = 0;
  outer: for (const guide of GUIDES) {
    if (slugFilter && guide.slug !== slugFilter) continue;
    const el = guide.content.el || '';
    const en = guide.content.en || '';
    // Only target guides where BOTH source locales are thin/missing.
    if (!isThinContent(el) || !isThinContent(en)) continue;
    // Skip slugs whose every locale already has an override (else the
    // limit counter burns on no-op iterations and later batches return 0).
    const needsWork = ['el','en','de','bg','ru','ro','sr'].some((l) => !haveOverride.has(`${guide.slug}|${l}`));
    if (!needsWork) continue;
    if (slugsProcessed >= limit) break;
    slugsProcessed++;

    const topicTitle = guide.title.en || guide.title.el;
    const brief = guide.description.en || guide.description.el || '';

    // Generate Greek first — it's our canonical source. Then English (also
    // from scratch, not translated — keeps quality high). Then the 5
    // remaining locales translate from the new Greek.
    type LocalePlan = { locale: string; mode: 'source' | 'translate'; from?: string };
    const plan: LocalePlan[] = [
      { locale: 'el', mode: 'source' },
      { locale: 'en', mode: 'source' },
      { locale: 'de', mode: 'translate' },
      { locale: 'bg', mode: 'translate' },
      { locale: 'ru', mode: 'translate' },
      { locale: 'ro', mode: 'translate' },
      { locale: 'sr', mode: 'translate' },
    ];
    let greekText = '';
    let englishText = '';

    for (const step of plan) {
      if (haveOverride.has(`${guide.slug}|${step.locale}`)) continue;
      try {
        let prompt: string;
        if (step.mode === 'source') {
          prompt = buildFromScratchPrompt({
            title: topicTitle,
            brief,
            targetLocale: step.locale,
          });
        } else {
          prompt = buildPrompt({
            topic: `Travel guide section: "${topicTitle}" for Halkidiki, Greece.`,
            sourceEl: greekText || el,
            sourceEn: englishText || en,
            targetLocale: step.locale,
            isHtml: true,
          });
        }
        const text = await callOpenAI(prompt, 900);
        const wc = visibleWordCount(text);
        if (wc < 120) {
          out.push({ slug: guide.slug, locale: step.locale, status: 'failed', reason: `too short (${wc} words)` });
          continue;
        }
        if (step.locale === 'el') greekText = text;
        if (step.locale === 'en') englishText = text;
        const { error: upsertErr } = await supabase
          .from('guide_overrides')
          .upsert(
            {
              slug: guide.slug,
              locale: step.locale,
              content: text,
              source_locale: step.mode === 'source' ? null : 'el',
              word_count: wc,
              generator: `${MODEL}/from-scratch`,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'slug,locale' },
          );
        if (upsertErr) {
          out.push({ slug: guide.slug, locale: step.locale, status: 'failed', reason: upsertErr.message });
        } else {
          out.push({ slug: guide.slug, locale: step.locale, status: 'ok', words: wc });
        }
      } catch (e) {
        const msg = String(e).slice(0, 200);
        out.push({ slug: guide.slug, locale: step.locale, status: 'failed', reason: msg });
        if (msg.includes('429') || msg.toLowerCase().includes('quota')) break outer;
      }
    }
  }
  const ok = out.filter((r) => r.status === 'ok').length;
  const failed = out.filter((r) => r.status === 'failed').length;
  return { type: 'guide-source', processed: out.length, ok, failed, results: out };
}

function buildFromScratchPrompt(opts: { title: string; brief: string; targetLocale: string }): string {
  const { title, brief, targetLocale } = opts;
  const localeName = LOCALE_NAMES[targetLocale] || (targetLocale === 'el' ? 'Greek' : targetLocale === 'en' ? 'English' : targetLocale);
  return [
    `You are writing a travel-guide article for ChalkidikiHub, the Halkidiki (Chalkidiki, Greece) regional tourism portal.`,
    ``,
    `Topic title: "${title}"`,
    brief ? `Brief: ${brief}` : '',
    ``,
    `Task: write an original, factually accurate, engaging article in ${localeName}.`,
    `- 230-300 words.`,
    `- HTML only, with <h2>, <p>, <ul>, <li>, <strong>. No <html>/<body>.`,
    `- Open with one short intro paragraph that answers WHY this topic matters in Halkidiki.`,
    `- 2-3 themed <h2> sections covering: practical info (when/how/where), concrete recommendations, a key tip or warning.`,
    `- STRICT grounding: only mention real Halkidiki places. Real peninsulas: Kassandra, Sithonia, Athos. Real villages: Sarti, Nikiti, Afytos, Ouranoupoli, Neos Marmaras, Pefkohori, Hanioti, Kallithea, Nea Moudania, Vourvourou, Toroni, Porto Koufo, Sykia, Kalamitsi. Real beaches: Karydi (Vourvourou), Kavourotrypes, Bouzonia, Possidi, Sani, Mola Kalyva, Trani Ammouda, Kriaritsi. Do NOT invent place names.`,
    `- Tone: knowledgeable local, not marketing-speak.`,
    `- Output ONLY the HTML. No preamble, no explanation.`,
  ].filter(Boolean).join('\n');
}

async function expandPlaces(limit: number, slugFilter: string | null, targetLocales: string[]) {
  const supabase = createAdminClient();
  let q = supabase
    .from('villages')
    .select('slug, name_el, name_en, description_el, description_en, description_de, description_bg, description_ru, description_ro, description_sr, area');
  if (slugFilter) q = q.eq('slug', slugFilter);
  const { data: rows, error } = await q;
  if (error) return { error: error.message };

  const out: Result[] = [];
  let attempts = 0;
  outer: for (const row of rows || []) {
    const el = (row as Record<string, string | null>).description_el || '';
    const en = (row as Record<string, string | null>).description_en || '';
    if (isThinContent(el) && isThinContent(en)) {
      out.push({ slug: row.slug, locale: '*', status: 'skipped', reason: 'source el+en both thin' });
      continue;
    }
    for (const loc of targetLocales) {
      if (attempts >= limit) break outer;
      const current = (row as Record<string, string | null>)[`description_${loc}`] || '';
      if (!isThinContent(current)) continue;
      attempts++;
      try {
        const topic = `Village of ${row.name_el} (${row.name_en}), in ${row.area} peninsula, Halkidiki, Greece.`;
        const text = await callOpenAI(buildPrompt({
          topic, sourceEl: el, sourceEn: en, targetLocale: loc, isHtml: true,
        }));
        const wc = visibleWordCount(text);
        if (wc < 80) {
          out.push({ slug: row.slug, locale: loc, status: 'failed', reason: `too short (${wc} words)` });
          continue;
        }
        const update: Record<string, unknown> = {};
        update[`description_${loc}`] = text;
        const { error: updErr } = await supabase.from('villages').update(update).eq('slug', row.slug);
        if (updErr) {
          out.push({ slug: row.slug, locale: loc, status: 'failed', reason: updErr.message });
        } else {
          out.push({ slug: row.slug, locale: loc, status: 'ok', words: wc });
        }
      } catch (e) {
        const msg = String(e).slice(0, 200);
        out.push({ slug: row.slug, locale: loc, status: 'failed', reason: msg });
        // Bail out early on upstream quota errors — no point burning through
        // the rest of the batch when every call will hit the same 429.
        if (msg.includes('429') || msg.toLowerCase().includes('quota')) break outer;
      }
    }
  }
  const ok = out.filter((r) => r.status === 'ok').length;
  const failed = out.filter((r) => r.status === 'failed').length;
  return { type: 'places', processed: out.length, ok, failed, results: out };
}

async function expandGuide(limit: number, slugFilter: string | null, targetLocales: string[]) {
  const supabase = createAdminClient();
  const { data: existing } = await supabase.from('guide_overrides').select('slug, locale');
  const haveOverride = new Set((existing || []).map((r) => `${r.slug}|${r.locale}`));

  const out: Result[] = [];
  let attempts = 0;
  outer: for (const guide of GUIDES) {
    if (slugFilter && guide.slug !== slugFilter) continue;
    const el = guide.content.el || '';
    const en = guide.content.en || '';
    if (isThinContent(el) && isThinContent(en)) {
      out.push({ slug: guide.slug, locale: '*', status: 'skipped', reason: 'source el+en both thin' });
      continue;
    }
    for (const loc of targetLocales) {
      if (attempts >= limit) break outer;
      const current = guide.content[loc] || '';
      if (!isThinContent(current)) continue;
      if (haveOverride.has(`${guide.slug}|${loc}`)) continue;
      attempts++;
      try {
        const topic = `Travel guide section: "${guide.title.en || guide.title.el}" for Halkidiki, Greece.`;
        const text = await callOpenAI(buildPrompt({
          topic, sourceEl: el, sourceEn: en, targetLocale: loc, isHtml: true,
        }));
        const wc = visibleWordCount(text);
        if (wc < 100) {
          out.push({ slug: guide.slug, locale: loc, status: 'failed', reason: `too short (${wc} words)` });
          continue;
        }
        const { error: upsertErr } = await supabase
          .from('guide_overrides')
          .upsert(
            {
              slug: guide.slug,
              locale: loc,
              content: text,
              source_locale: isThinContent(el) ? 'en' : 'el',
              word_count: wc,
              generator: MODEL,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'slug,locale' },
          );
        if (upsertErr) {
          out.push({ slug: guide.slug, locale: loc, status: 'failed', reason: upsertErr.message });
        } else {
          out.push({ slug: guide.slug, locale: loc, status: 'ok', words: wc });
        }
      } catch (e) {
        const msg = String(e).slice(0, 200);
        out.push({ slug: guide.slug, locale: loc, status: 'failed', reason: msg });
        if (msg.includes('429') || msg.toLowerCase().includes('quota')) break outer;
      }
    }
  }
  const ok = out.filter((r) => r.status === 'ok').length;
  const failed = out.filter((r) => r.status === 'failed').length;
  return { type: 'guide', processed: out.length, ok, failed, results: out };
}
