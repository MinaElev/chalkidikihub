import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { JsonLd } from '@/components/ui/JsonLd';
import { localeUrl, SOCIAL_LINKS } from '@/lib/seo';
import { ABOUT } from './about-content';
import { Sparkles, Mail, Home as HomeIcon } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

type Props = { params: Promise<{ locale: string }> };

export const dynamic = 'force-static';
export const revalidate = 86400;

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const c = ABOUT[locale] || ABOUT.en;

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: c.metaTitle,
    description: c.metaDescription,
    url: localeUrl(locale, 'about'),
    inLanguage: locale,
    mainEntity: {
      '@type': 'Organization',
      name: 'Chalkidiki Hub',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512.png`, width: 512, height: 512 },
      description: c.metaDescription,
      foundingDate: '2024',
      founder: { '@type': 'Person', name: 'Minas Eleftheriadis' },
      email: 'mnc@hotmail.gr',
      areaServed: {
        '@type': 'Place',
        name: 'Halkidiki, Greece',
        geo: { '@type': 'GeoCoordinates', latitude: 40.15, longitude: 23.6 },
      },
      ...(SOCIAL_LINKS.length > 0 ? { sameAs: SOCIAL_LINKS } : {}),
    },
  };

  return (
    <>
      <JsonLd data={aboutSchema} />

      <section className="relative bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider text-primary-200 mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            {c.hero.eyebrow}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
            {c.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl">
            {c.hero.lead}
          </p>

          <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
            {c.stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/8 border border-white/10 px-4 py-4">
                <div className="text-2xl md:text-3xl font-bold tracking-tight">{s.value}</div>
                <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 prose prose-gray max-w-none">
        {c.body.map((block, i) => {
          if (block.type === 'h2') {
            return (
              <h2 key={i} className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 first:mt-0 mb-4">
                {block.text}
              </h2>
            );
          }
          if (block.type === 'p') {
            const parts = block.text.split('mnc@hotmail.gr');
            if (parts.length === 2) {
              return (
                <p key={i} className="text-gray-700 leading-relaxed mb-4">
                  {parts[0]}
                  <a href="mailto:mnc@hotmail.gr" className="text-primary-600 hover:underline font-medium">
                    mnc@hotmail.gr
                  </a>
                  {parts[1]}
                </p>
              );
            }
            return (
              <p key={i} className="text-gray-700 leading-relaxed mb-4">
                {block.text}
              </p>
            );
          }
          return (
            <ul key={i} className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              {block.items.map((it, j) => (
                <li key={j} className="leading-relaxed">{it}</li>
              ))}
            </ul>
          );
        })}
      </article>

      <section className="bg-primary-50 border-t border-primary-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.ctaTitle}</h2>
          <p className="text-gray-600 mb-7">{c.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-sm transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              {c.ctaButton}
            </Link>
            <a
              href="mailto:mnc@hotmail.gr"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border-2 border-primary-200 hover:border-primary-400 text-primary-700 font-semibold rounded-xl transition-colors"
            >
              <Mail className="w-5 h-5" />
              mnc@hotmail.gr
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
