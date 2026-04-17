import type { Metadata } from 'next';
import { createApiClient } from '@/lib/api-helpers';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;

  const supabase = createApiClient();
  const { data } = await supabase
    .from('listings')
    .select(
      'title_el, title_en, tagline_el, tagline_en, tagline_de, tagline_bg, tagline_ru, tagline_ro, tagline_sr, owner_story_el, owner_story_en, location_name',
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!data) {
    return { title: 'Stay | ChalkidikiHub' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = data as any;
  const title: string =
    row[`title_${locale}`] || row.title_el || row.title_en || 'Stay';
  const tagline: string =
    row[`tagline_${locale}`] || row.tagline_el || row.tagline_en || '';
  const story: string =
    row[`owner_story_${locale}`] || row.owner_story_el || row.owner_story_en || '';

  const fullTitle = tagline ? `${title} — ${tagline}` : `${title} | ChalkidikiHub`;
  const description =
    (story || '').slice(0, 160) || tagline || `${title} in ${row.location_name}`;

  return {
    title: fullTitle,
    description,
    openGraph: { title: fullTitle, description, type: 'website', locale },
    alternates: {
      canonical: localeUrl(locale, `stay/${slug}`),
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/stay/${slug}`])),
    },
  };
}

export default function StayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
