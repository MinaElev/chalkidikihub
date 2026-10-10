import { getBeaches, getVillages } from '@/lib/db/content';
import { bestGuides, field, guides } from '@/lib/editorial';
import { placeName } from '@/lib/content/place-names';
import { displayName } from '@/lib/content/nearby';
import { localeUrl, SITE_URL } from '@/lib/seo/site';

// Public read-only summary for AI assistants (llmstxt.org). No guard needed.
export const revalidate = 86400;

export async function GET() {
  const [beaches, villages] = await Promise.all([getBeaches(), getVillages()]);
  const lines = [
    '# ChalkidikiHub',
    '',
    '> Independent guide to Halkidiki (Chalkidiki), Greece: beaches with real distances and live water temperature, villages, food, things to do, and holiday rentals booked directly with owners. Available in Greek, English, German, Romanian, Bulgarian, Serbian and Russian.',
    '',
    '## Main sections',
    `- [Beaches](${localeUrl('en', '/beaches')}): ${beaches.length} beaches by peninsula and feature`,
    `- [Villages](${localeUrl('en', '/places')}): each with nearest beaches, food and stays`,
    `- [Where to stay](${localeUrl('en', '/listings')}): rentals with direct owner contact, no booking fees`,
    `- [Food & drink](${localeUrl('en', '/restaurants')})`,
    `- [Things to do](${localeUrl('en', '/activities')})`,
    `- [Mount Athos guide](${localeUrl('en', '/mount-athos')})`,
    `- [Getting to Halkidiki](${localeUrl('en', '/from')})`,
    '',
    '## Guides',
    ...guides().map((g) => `- [${field(g.title, 'en').text}](${localeUrl('en', `/guide/${g.slug}`)})`),
    ...bestGuides().map((g) => `- [${field(g.title, 'en').text}](${localeUrl('en', `/best/${g.slug}`)})`),
    '',
    '## Villages',
    ...villages.filter((v) => v.slug !== 'pyrgadikia-mainland').map((v) => `- [${placeName(v.slug, 'en', v)}](${localeUrl('en', `/places/${v.slug}`)}) — [beaches nearby](${localeUrl('en', `/places/${v.slug}/beaches`)})`),
    '',
    '## Beaches',
    ...beaches.map((b) => `- [${displayName(b, 'en', 'beach')}](${localeUrl('en', `/beaches/${b.slug}`)})`),
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, s-maxage=86400' } });
}
