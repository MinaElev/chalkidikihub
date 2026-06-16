import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getHostBySlug, getPublicHosts } from '@/lib/data';
import { ListingCard } from '@/components/listings/ListingCard';
import { JsonLd } from '@/components/ui/JsonLd';
import { generateBreadcrumbLD, localeUrl } from '@/lib/seo';
import { Mail, Phone, Globe, Star } from 'lucide-react';

export const revalidate = 86400; // ISR: 24h - on-demand revalidation from admin saves keeps content fresh

export async function generateStaticParams() {
  const hosts = await getPublicHosts();
  return hosts.map((h) => ({ slug: h.slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

const HOST_LABEL: Record<string, string> = {
  el: 'Φιλοξενητής', en: 'Host', de: 'Gastgeber', bg: 'Домакин',
  ru: 'Хост', ro: 'Gazdă', sr: 'Domaćin',
};
const PROPS_LABEL: Record<string, string> = {
  el: 'Καταλύματα', en: 'Properties', de: 'Unterkünfte', bg: 'Имоти',
  ru: 'Размещения', ro: 'Cazări', sr: 'Smeštaji',
};
const ABOUT_LABEL: Record<string, string> = {
  el: 'Σχετικά', en: 'About', de: 'Über', bg: 'Относно',
  ru: 'О хосте', ro: 'Despre', sr: 'O domaćinu',
};
const CONTACT_LABEL: Record<string, string> = {
  el: 'Επικοινωνία', en: 'Contact', de: 'Kontakt', bg: 'Контакт',
  ru: 'Контакты', ro: 'Contact', sr: 'Kontakt',
};
const HOME_LABEL: Record<string, string> = {
  el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало',
  ru: 'Главная', ro: 'Acasă', sr: 'Početna',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const host = await getHostBySlug(slug);
  if (!host) return { title: 'Host' };

  const title = `${host.display_name} — ${host.listings.length} ${PROPS_LABEL[locale] || 'properties'}`;
  const description =
    host.bio[locale] ||
    host.bio.el ||
    host.bio.en ||
    `${host.display_name} hosts ${host.listings.length} properties in Halkidiki. Browse their full portfolio of vacation rentals.`;

  return {
    title,
    description: description.slice(0, 160),
    openGraph: {
      title,
      description: description.slice(0, 160),
      type: 'profile',
      url: localeUrl(locale, `host/${slug}`),
      images: host.avatar_url ? [{ url: host.avatar_url, width: 600, height: 600 }] : [],
    },
    alternates: {
      canonical: localeUrl(locale, `host/${slug}`),
    },
  };
}

export default async function HostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const host = await getHostBySlug(slug);
  if (!host) notFound();

  const bio = host.bio[locale] || host.bio.el || host.bio.en || '';
  const memberYear = new Date(host.member_since).getFullYear();

  // Aggregate stats
  const totalListings = host.listings.length;
  const avgPrice = totalListings
    ? Math.round(host.listings.reduce((s, l) => s + (l.price_per_night || 0), 0) / totalListings)
    : 0;

  // Person JSON-LD
  const personLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: host.display_name,
    url: `https://chalkidikihub.gr${localeUrl(locale, `host/${slug}`)}`,
    ...(host.avatar_url ? { image: host.avatar_url } : {}),
    ...(bio ? { description: bio.slice(0, 500) } : {}),
    sameAs: [
      host.social_facebook,
      host.social_instagram,
      host.social_website,
    ].filter(Boolean),
    memberOf: {
      '@type': 'Organization',
      name: 'ChalkidikiHub',
      url: 'https://chalkidikihub.gr',
    },
  };

  return (
    <>
      <JsonLd data={personLd} />
      <JsonLd
        data={generateBreadcrumbLD([
          { name: HOME_LABEL[locale] || 'Home', url: localeUrl(locale) },
          { name: host.display_name, url: localeUrl(locale, `host/${slug}`) },
        ]) as Record<string, unknown>}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl ring-1 ring-gray-900/5 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-primary-100 ring-4 ring-primary-50 flex-shrink-0">
              {host.avatar_url ? (
                <Image
                  src={host.avatar_url}
                  alt={host.display_name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-primary-700">
                  {host.display_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider text-primary-600 font-semibold mb-1">
                {HOST_LABEL[locale] || 'Host'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {host.display_name}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {totalListings} {PROPS_LABEL[locale]?.toLowerCase() || 'properties'}
                </span>
                <span>
                  {locale === 'el' ? 'Μέλος από' : 'Member since'} {memberYear}
                </span>
                {avgPrice > 0 && (
                  <span>
                    {locale === 'el' ? 'Από' : 'From'} €{avgPrice}
                    {locale === 'el' ? '/βραδιά' : '/night'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact */}
          {(host.email || host.phone || host.social_facebook || host.social_instagram || host.social_website) && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                {CONTACT_LABEL[locale]}
              </h2>
              <div className="flex flex-wrap gap-3">
                {host.email && (
                  <a
                    href={`mailto:${host.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 transition"
                  >
                    <Mail className="w-4 h-4" /> {host.email}
                  </a>
                )}
                {host.phone && (
                  <a
                    href={`tel:${host.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 transition"
                  >
                    <Phone className="w-4 h-4" /> {host.phone}
                  </a>
                )}
                {host.social_website && (
                  <a
                    href={host.social_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 transition"
                  >
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
                {host.social_facebook && (
                  <a
                    href={host.social_facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 transition"
                  >
                    <Globe className="w-4 h-4" /> Facebook
                  </a>
                )}
                {host.social_instagram && (
                  <a
                    href={host.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 transition"
                  >
                    <Globe className="w-4 h-4" /> Instagram
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* About */}
        {bio && (
          <div className="bg-white rounded-3xl ring-1 ring-gray-900/5 p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {ABOUT_LABEL[locale]} {host.display_name}
            </h2>
            <div className="prose prose-gray max-w-none text-gray-700 whitespace-pre-line">
              {bio}
            </div>
          </div>
        )}

        {/* Listings grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {PROPS_LABEL[locale]} ({totalListings})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {host.listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </>
  );
}
