import { getArticles, getBeaches, getVillages } from '@/lib/db/content';
import { bestGuides, field, fromCities, guides } from '@/lib/editorial';
import { bestIndexable, loadBest } from '@/lib/content/best';
import { placeName } from '@/lib/content/place-names';
import { displayName } from '@/lib/content/nearby';
import { articleIndex, beachIndex } from '@/lib/seo/indexability';
import { isProven } from '@/lib/seo/quality';
import { localeUrl, SITE_URL } from '@/lib/seo/site';

// Public read-only summary for AI assistants (llmstxt.org). No guard needed.
// Lists only pages that are indexable in English, so assistants are pointed at the same pages search engines see.
export const revalidate = 86400;

/** Verified facts (Oct 2026), each backed by a page on the site. Keep them short and checkable. */
const FACTS = [
  'Halkidiki (Chalkidiki) is a region of northern Greece south-east of Thessaloniki, with three peninsulas: Kassandra (west), Sithonia (middle) and the Athos peninsula (east).',
  'The nearest airport is Thessaloniki (SKG): Kassandra is about 1–1.5 hours by road, Sithonia 1.5–2.5 hours, Ouranoupoli about 2 hours.',
  'Mount Athos is a self-governing monastic community of 20 monasteries and a UNESCO World Heritage Site; only men with a diamonitirion permit may enter, and anyone can see it on a boat cruise from Ouranoupoli or Ormos Panagias.',
  'Ammouliani is the only inhabited island of Halkidiki; the ferry leaves from Tripiti.',
  'The main season runs from June to September; the sea is warmest in August and September is the usual sweet spot.',
  'All Greek beaches are public: you may lay your own towel even where sunbeds are rented.',
  'Bulgaria and Romania are full Schengen members since January 2025, so there are no routine checks at the Kulata–Promachonas border; non-EU visitors from the Balkans need a biometric passport.',
  'Restaurant ratings shown on ChalkidikiHub are Google ratings; the site does not publish invented reviews.',
];

export async function GET() {
  const [beaches, villages, articles, aIdx, bIdx] = await Promise.all([getBeaches(), getVillages(), getArticles(), articleIndex(), beachIndex()]);
  const best = (await Promise.all(bestGuides().map(async (g) => ({ g, data: await loadBest(g.slug) }))))
    .filter(({ g, data }) => bestIndexable(g.slug, data?.items.length ?? 0).includes('en'));
  const en = (path: string, idx: Record<string, string[]>, slug: string) => (idx[slug] ?? []).includes('en') || isProven('en', path);
  const lines = [
    '# ChalkidikiHub',
    '',
    '> Independent guide to Halkidiki (Chalkidiki), Greece: beaches with real distances and live water temperature, villages, food, things to do, and holiday rentals booked directly with owners. Written in Greek and available in English, German, Romanian, Bulgarian, Serbian and Russian. Distances are road distances; facts are checked against sources and updated.',
    '',
    '## Key facts',
    ...FACTS.map((f) => `- ${f}`),
    '',
    '## Main sections',
    `- [Beaches](${localeUrl('en', '/beaches')}): ${beaches.length} beaches by peninsula and feature`,
    `- [Villages](${localeUrl('en', '/places')}): each with nearest beaches, food and stays`,
    `- [Peninsulas](${localeUrl('en', '/areas/kassandra')}): Kassandra, [Sithonia](${localeUrl('en', '/areas/sithonia')}), [Athos peninsula](${localeUrl('en', '/areas/athos')}), [inland Halkidiki](${localeUrl('en', '/areas/mainland')})`,
    `- [Where to stay](${localeUrl('en', '/listings')}): rentals with direct owner contact, no booking fees`,
    `- [Food & drink](${localeUrl('en', '/restaurants')})`,
    `- [Things to do](${localeUrl('en', '/activities')})`,
    `- [Mount Athos guide](${localeUrl('en', '/mount-athos')})`,
    `- [Editorial policy](${localeUrl('en', '/editorial-policy')}): how content is researched and checked`,
    '',
    '## Getting there',
    ...fromCities().map((c) => `- [${field(c.title, 'en').text}](${localeUrl('en', `/from/${c.slug}`)}): ${field(c.description, 'en').text}`),
    '',
    '## Guides',
    ...guides().map((g) => `- [${field(g.title, 'en').text}](${localeUrl('en', `/guide/${g.slug}`)})`),
    ...best.map(({ g }) => `- [${field(g.title, 'en').text}](${localeUrl('en', `/best/${g.slug}`)})`),
    '',
    '## Articles',
    ...articles
      .filter((a) => en(`/blog/${a.slug}`, aIdx, a.slug))
      .map((a) => {
        const r = a as unknown as Record<string, string | null>;
        return `- [${r.title_en ?? r.title_el}](${localeUrl('en', `/blog/${a.slug}`)})${r.excerpt_en ? `: ${r.excerpt_en.replace(/\s+/g, ' ').trim()}` : ''}`;
      }),
    '',
    '## Villages',
    ...villages.filter((v) => v.slug !== 'pyrgadikia-mainland').map((v) => `- [${placeName(v.slug, 'en', v)}](${localeUrl('en', `/places/${v.slug}`)}) — [beaches nearby](${localeUrl('en', `/places/${v.slug}/beaches`)})`),
    '',
    '## Beaches',
    ...beaches.filter((b) => en(`/beaches/${b.slug}`, bIdx, b.slug)).map((b) => `- [${displayName(b, 'en', 'beach')}](${localeUrl('en', `/beaches/${b.slug}`)})`),
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, s-maxage=86400' } });
}
