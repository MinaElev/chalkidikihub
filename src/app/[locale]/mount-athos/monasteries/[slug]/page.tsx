import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ChevronRight, ChevronLeft, MapPin, Calendar, Flag, Star } from 'lucide-react';
import { MONASTERIES, getMonasteryBySlug } from '../../monastery-data';
import { tr } from '../../content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro'] as const;

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return MONASTERIES.map(m => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const m = getMonasteryBySlug(slug);
  if (!m) return { title: 'Monastery | Mount Athos' };
  const title = m.metaTitle[locale] || m.metaTitle.el;
  const description = m.metaDesc[locale] || m.metaDesc.el;
  return {
    title, description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/mount-athos/monasteries/${slug}`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/mount-athos/monasteries/${slug}`])),
    },
  };
}

const NATION_LABELS: Record<string, Record<string, string>> = {
  el: { el: 'Ελληνική', en: 'Greek', de: 'Griechisch', bg: 'Гръцки', ru: 'Греческий', ro: 'Greacă' },
  rs: { el: 'Σερβική', en: 'Serbian', de: 'Serbisch', bg: 'Сръбски', ru: 'Сербский', ro: 'Sârbă' },
  bg: { el: 'Βουλγαρική', en: 'Bulgarian', de: 'Bulgarisch', bg: 'Български', ru: 'Болгарский', ro: 'Bulgară' },
  ru: { el: 'Ρωσική', en: 'Russian', de: 'Russisch', bg: 'Руски', ru: 'Русский', ro: 'Rusă' },
};

export default async function MonasteryDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const m = getMonasteryBySlug(slug);
  if (!m) notFound();

  const name = m.name[locale] || m.name.el;
  const desc = m.description[locale] || m.description.el;
  const highlights = (m.highlights[locale] || m.highlights.el).split('|');
  const nationLabel = NATION_LABELS[m.nation]?.[locale] || NATION_LABELS[m.nation]?.en || '';

  // Prev/Next
  const idx = MONASTERIES.findIndex(x => x.slug === slug);
  const prev = idx > 0 ? MONASTERIES[idx - 1] : null;
  const next = idx < MONASTERIES.length - 1 ? MONASTERIES[idx + 1] : null;

  return (
    <article>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-gray-700">{tr('home', locale)}</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/mount-athos" className="hover:text-gray-700">{tr('mountAthos', locale)}</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/mount-athos/monasteries" className="hover:text-gray-700">{tr('navMonasteries', locale)}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{name}</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 rounded-2xl p-8 md:p-10 text-white mb-8">
        <div className="flex items-center gap-2 mb-2 text-amber-200 text-sm">
          <span className="px-2 py-0.5 bg-amber-600/50 rounded-full text-xs font-bold">#{m.rank}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {m.founded}</span>
          <span className="flex items-center gap-1"><Flag className="w-3.5 h-3.5" /> {nationLabel}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
        <p className="text-amber-200 text-sm flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {tr('mountAthos', locale)}, {tr('landingLocation', locale)}
        </p>
      </div>

      {/* Description */}
      <div className="prose prose-gray max-w-none mb-8">
        <p className="text-lg text-gray-700 leading-relaxed">{desc}</p>
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            {locale === 'el' ? 'Αξιοθέατα' : locale === 'de' ? 'Sehenswürdigkeiten' : locale === 'bg' ? 'Забележителности' : locale === 'ru' ? 'Достопримечательности' : locale === 'ro' ? 'Obiective' : 'Highlights'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">{i + 1}</div>
                <span className="text-sm text-gray-800">{h.trim()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      {m.lat && m.lng && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${m.lng - 0.02},${m.lat - 0.015},${m.lng + 0.02},${m.lat + 0.015}&layer=mapnik&marker=${m.lat},${m.lng}`}
            className="w-full h-56 border-0"
            loading="lazy"
          />
        </div>
      )}

      {/* Prev/Next */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        {prev ? (
          <Link href={`/mount-athos/monasteries/${prev.slug}`} className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900">
            <ChevronLeft className="w-4 h-4" /> {prev.name[locale] || prev.name.el}
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/mount-athos/monasteries/${next.slug}`} className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900">
            {next.name[locale] || next.name.el} <ChevronRight className="w-4 h-4" />
          </Link>
        ) : <span />}
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': ['Place', 'LandmarksOrHistoricalBuildings'],
        name: name,
        description: desc,
        foundingDate: String(m.founded),
        geo: { '@type': 'GeoCoordinates', latitude: m.lat, longitude: m.lng },
        containedInPlace: { '@type': 'Place', name: 'Mount Athos, Halkidiki, Greece' },
      })}} />
    </article>
  );
}
