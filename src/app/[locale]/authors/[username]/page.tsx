import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ChevronRight, PenLine } from 'lucide-react';
import { createApiClient } from '@/lib/api-helpers';
import { AUTHORS, AUTHOR_LIST, authorInitials } from '@/lib/authors';
import { localeUrl, generateBreadcrumbLD } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en'] as const; // hreflang: publicLocales only

export const revalidate = 2592000; // ISR: 30d — bylines change rarely; admin saves revalidate blog

type Props = { params: Promise<{ locale: string; username: string }> };

export function generateStaticParams() {
  return AUTHOR_LIST.map((a) => ({ username: a.username }));
}

const T = {
  articlesBy: { el: 'Άρθρα του', en: 'Articles by' },
  expertise: { el: 'Εξειδίκευση', en: 'Expertise' },
  noArticles: { el: 'Δεν υπάρχουν ακόμα δημοσιευμένα άρθρα.', en: 'No published articles yet.' },
  home: { el: 'Αρχική', en: 'Home' },
  authors: { el: 'Συντάκτες', en: 'Authors' },
  readMore: { el: 'Διαβάστε', en: 'Read' },
} as const;
const pick = (d: Record<string, string>, l: string) => d[l] || d.en;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, username } = await params;
  const author = AUTHORS[username];
  if (!author) return { title: 'Not found', robots: { index: false, follow: false } };
  const role = author.role[locale] || author.role.en;
  const title = `${author.name} — ${role}`;
  const description = author.bio[locale] || author.bio.en;
  const path = `authors/${username}`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'profile', locale, siteName: 'Chalkidiki Hub' },
    alternates: {
      canonical: localeUrl(locale, path),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, localeUrl(l, path)])),
        'x-default': localeUrl('el', path),
      },
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { locale, username } = await params;
  setRequestLocale(locale);
  const author = AUTHORS[username];
  if (!author) notFound();

  const role = author.role[locale] || author.role.en;
  const bio = author.bio[locale] || author.bio.en;

  const supabase = createApiClient();
  const { data: rows } = await supabase
    .from('blog_articles')
    .select('slug, title_el, title_en, excerpt_el, excerpt_en, image_url, published_at, category')
    .eq('author', username)
    .order('published_at', { ascending: false })
    .limit(60);
  const articles = rows || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pickField = (a: any, f: string) => a[`${f}_${locale}`] || a[`${f}_el`] || a[`${f}_en`] || '';

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/authors/${username}#person`,
    name: author.name,
    url: localeUrl(locale, `authors/${username}`),
    jobTitle: role,
    description: bio,
    knowsAbout: author.knowsAbout,
    worksFor: { '@id': `${SITE_URL}/#organization` },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={personLd} />
      <JsonLd data={generateBreadcrumbLD([
        { name: pick(T.home, locale), url: localeUrl(locale) },
        { name: pick(T.authors, locale), url: localeUrl(locale, 'authors') },
        { name: author.name, url: localeUrl(locale, `authors/${username}`) },
      ]) as Record<string, unknown>} />

      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">{pick(T.home, locale)}</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/authors" className="hover:text-gray-700">{pick(T.authors, locale)}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{author.name}</span>
      </nav>

      {/* Profile header */}
      <header className="flex items-start gap-5 rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-6">
        <div className={`shrink-0 w-20 h-20 rounded-full bg-gradient-to-br ${author.avatarGradient} text-white flex items-center justify-center shadow-sm font-bold text-2xl`}>
          {authorInitials(author.name)}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{author.name}</h1>
          <p className="text-primary-700 font-medium mt-0.5">{role}</p>
          <p className="text-gray-700 leading-relaxed mt-3">{bio}</p>
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">{pick(T.expertise, locale)}</p>
            <div className="flex flex-wrap gap-2">
              {author.knowsAbout.map((k) => (
                <span key={k} className="px-2.5 py-1 bg-white border border-primary-100 text-primary-700 rounded-lg text-xs font-medium">{k}</span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Articles */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <PenLine className="w-5 h-5 text-primary-600" />
          {pick(T.articlesBy, locale)} {author.name} ({articles.length})
        </h2>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {articles.map((a) => (
              <Link key={a.slug} href={`/blog/${a.slug}`} className="group block rounded-2xl border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-sm transition-all">
                {a.image_url && (
                  <div className="relative aspect-[16/9] bg-gray-100">
                    <Image src={a.image_url} alt={pickField(a, 'title')} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width:640px) 100vw, 50vw" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 group-hover:text-primary-700 leading-snug line-clamp-2">{pickField(a, 'title')}</h3>
                  <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{pickField(a, 'excerpt')}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">{pick(T.noArticles, locale)}</p>
        )}
      </section>
    </div>
  );
}
