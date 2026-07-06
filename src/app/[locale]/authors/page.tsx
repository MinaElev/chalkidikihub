import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { AUTHOR_LIST, authorInitials } from '@/lib/authors';
import { localeUrl } from '@/lib/seo';

const LOCALES = ['el', 'en'] as const;
export const revalidate = 2592000; // ISR: 30d

type Props = { params: Promise<{ locale: string }> };

const T = {
  title: { el: 'Η συντακτική μας ομάδα', en: 'Our editorial team' },
  intro: {
    el: 'Οι συντάκτες του ChalkidikiHub γράφουν με βάση πραγματική, τοπική εμπειρία — χωρίς clickbait και χωρίς προμήθειες από booking sites.',
    en: 'The ChalkidikiHub editors write from real, on-the-ground local experience — no clickbait, no commissions from booking sites.',
  },
  home: { el: 'Αρχική', en: 'Home' },
  authors: { el: 'Συντάκτες', en: 'Authors' },
} as const;
const pick = (d: Record<string, string>, l: string) => d[l] || d.en;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = pick(T.title, locale);
  const description = pick(T.intro, locale);
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', locale, siteName: 'Chalkidiki Hub' },
    alternates: {
      canonical: localeUrl(locale, 'authors'),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, localeUrl(l, 'authors')])),
        'x-default': localeUrl('el', 'authors'),
      },
    },
  };
}

export default async function AuthorsIndex({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">{pick(T.home, locale)}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{pick(T.authors, locale)}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900">{pick(T.title, locale)}</h1>
      <p className="text-gray-600 mt-2 max-w-2xl">{pick(T.intro, locale)}</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {AUTHOR_LIST.map((author) => (
          <Link key={author.username} href={`/authors/${author.username}`}
            className="group flex items-start gap-4 rounded-2xl border border-gray-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all">
            <div className={`shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${author.avatarGradient} text-white flex items-center justify-center shadow-sm font-bold text-xl`}>
              {authorInitials(author.name)}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary-700">{author.name}</h2>
              <p className="text-sm font-medium text-primary-700">{author.role[locale] || author.role.en}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">{author.bio[locale] || author.bio.en}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
