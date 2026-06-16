import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { getGuide, GUIDES } from './guide-data';
import { notFound } from 'next/navigation';
import { localeUrl, generateTemplatedArticleLD } from '@/lib/seo';
import { isThinContent } from '@/lib/content-quality';
import { createApiClient } from '@/lib/api-helpers';
import { FaqSection } from '@/components/ui/FaqSection';
import { generateGuideFaqs } from '@/lib/faq-generators';

export const revalidate = 86400; // ISR: 24h - on-demand revalidation from admin saves keeps content fresh

// Module-level cache: load ALL guide overrides once per server process.
// Prevents 378 prerendered guide pages from each issuing their own DB call
// at build time (which timed out a Vercel build at 45min when the table
// didn't yet exist).
//
// Short TTL so freshly-written AI overrides become visible without waiting
// for the serverless instance to be recycled. ISR revalidate (1h) still
// dominates for end users — the cache only kicks in within a request burst.
const CACHE_TTL_MS = 60_000;
let _cache: { at: number; promise: Promise<Map<string, string>> } | null = null;

function loadOverrides(): Promise<Map<string, string>> {
  if (_cache && Date.now() - _cache.at < CACHE_TTL_MS) return _cache.promise;
  const promise = (async () => {
    try {
      const supabase = createApiClient();
      const { data, error } = await supabase
        .from('guide_overrides')
        .select('slug, locale, content');
      if (error || !data) return new Map<string, string>();
      const m = new Map<string, string>();
      for (const r of data) {
        if (r.content && !isThinContent(r.content)) {
          m.set(`${r.slug}|${r.locale}`, r.content);
        }
      }
      return m;
    } catch {
      return new Map<string, string>();
    }
  })();
  _cache = { at: Date.now(), promise };
  return promise;
}

async function resolveContent(slug: string, locale: string, fallback: string): Promise<string> {
  const overrides = await loadOverrides();
  return overrides.get(`${slug}|${locale}`) || fallback;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en'] as const; // hreflang: publicLocales only - hidden locales remain routable but unindexed

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: 'Not Found' };

  const title = guide.metaTitle[locale] || guide.metaTitle.en;
  const desc = guide.metaDesc[locale] || guide.metaDesc.en;
  // Hide thin/empty translations from the index. Check the override first
  // so AI-filled pages re-enter the index automatically.
  const resolved = await resolveContent(slug, locale, guide.content[locale] || '');
  const thin = isThinContent(resolved);
  return {
    title,
    description: desc,
    ...(thin ? { robots: { index: false, follow: true } } : {}),
    openGraph: { title, description: desc, type: 'website', locale, siteName: 'Chalkidiki Hub', images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=guide`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [`${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=guide`] },
    alternates: {
      canonical: localeUrl(locale, `guide/${slug}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `guide/${slug}`)])),
        'x-default': localeUrl('el', `guide/${slug}`),
      },
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const guide = getGuide(slug);
  if (!guide) notFound();

  const title = guide.title[locale] || guide.title.en;
  const content = await resolveContent(slug, locale, guide.content[locale] || guide.content.el);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">{locale === 'el' ? 'Αρχική' : 'Home'}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{title}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{title}</h1>

      <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-ul:my-3 prose-blockquote:border-primary-500 prose-blockquote:text-gray-600"
        dangerouslySetInnerHTML={{ __html: content }} />

      {/* More guides */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{locale === 'el' ? 'Περισσότεροι Οδηγοί' : 'More Guides'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GUIDES.filter(g => g.slug !== slug).map(g => (
            <Link key={g.slug} href={`/guide/${g.slug}`}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <span className="text-sm font-medium text-gray-800">{g.title[locale] || g.title.en}</span>
            </Link>
          ))}
        </div>
      </div>

      <FaqSection faqs={generateGuideFaqs(guide, locale)} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateTemplatedArticleLD({
        url: localeUrl(locale, `guide/${slug}`),
        headline: title,
        description: guide.description[locale] || guide.description.en,
        locale,
        section: 'Halkidiki guide',
        htmlContent: content,
      }))}} />
    </div>
  );
}
