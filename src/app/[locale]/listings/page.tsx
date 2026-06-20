import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta, generateItemListLD, localeUrl } from '@/lib/seo';
import { getListings } from '@/lib/data';
import { JsonLd } from '@/components/ui/JsonLd';
import PageClient from './_client';

export const revalidate = 2592000; // ISR: 30d - on-demand revalidation from admin saves keeps content fresh

const titles: Record<string, string> = {
  el: 'Ενοικιαζόμενα Καταλύματα Χαλκιδική',
  en: 'Vacation Rentals Halkidiki',
  de: 'Ferienwohnungen Chalkidiki',
  bg: 'Настаняване Халкидики',
  ru: 'Аренда жилья Халкидики',
  ro: 'Cazare Halkidiki',
  sr: 'Smeštaj Halkidiki',
};

const descriptions: Record<string, string> = {
  el: 'Βρείτε το ιδανικό κατάλυμα στη Χαλκιδική. Σπίτια, διαμερίσματα και βίλες κοντά στη θάλασσα.',
  en: 'Find the perfect vacation rental in Halkidiki. Houses, apartments, and villas near the sea.',
  de: 'Finden Sie die perfekte Ferienunterkunft in Chalkidiki. Häuser, Wohnungen und Villen am Meer.',
  bg: 'Намерете перфектното настаняване в Халкидики. Къщи, апартаменти и вили близо до морето.',
  ru: 'Найдите идеальное жильё в Халкидики. Дома, квартиры и виллы у моря.',
  ro: 'Găsiți cazarea perfectă în Halkidiki. Case, apartamente și vile lângă mare.',
  sr: 'Pronađite savršen smeštaj u Halkidikiju. Kuće, stanovi i vile pored mora.',
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'listings', locale, ogType: 'listing' });
}

// Filter chips — server-rendered links to /listings/type/[type] so
// Google finds all filter pages via crawl instead of sitemap-only.
const FILTER_CHIPS: Array<{ slug: string; labels: Record<string, string> }> = [
  { slug: 'with-pool',    labels: { el: 'Με πισίνα',      en: 'With pool',      de: 'Mit Pool',           bg: 'С басейн',           ru: 'С бассейном',      ro: 'Cu piscină',       sr: 'Sa bazenom' } },
  { slug: 'sea-view',     labels: { el: 'Με θέα θάλασσα', en: 'Sea view',       de: 'Mit Meerblick',      bg: 'С морска гледка',    ru: 'С видом на море',  ro: 'Cu vedere la mare', sr: 'Pogled na more' } },
  { slug: 'pet-friendly', labels: { el: 'Pet-friendly',    en: 'Pet-friendly',   de: 'Haustierfreundlich', bg: 'За домашни любимци', ru: 'Для питомцев',     ro: 'Pet-friendly',      sr: 'Za ljubimce' } },
  { slug: 'family',       labels: { el: 'Οικογενειακά',    en: 'Family',         de: 'Familien',           bg: 'Семейни',            ru: 'Семейные',         ro: 'Familii',           sr: 'Porodični' } },
  { slug: 'budget',       labels: { el: 'Οικονομικά',      en: 'Budget',         de: 'Günstig',            bg: 'Евтини',             ru: 'Бюджетные',        ro: 'Ieftine',           sr: 'Povoljni' } },
  { slug: 'luxury',       labels: { el: 'Πολυτελή',        en: 'Luxury',         de: 'Luxus',              bg: 'Луксозни',           ru: 'Люкс',             ro: 'Lux',               sr: 'Luksuzni' } },
];

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const listings = await getListings();
  const itemListLD = generateItemListLD(
    titles[locale] || titles.en,
    listings.map((l) => ({
      name: l.title[locale] || l.title.el || l.title.en,
      url: localeUrl(locale, `listings/${l.slug}`),
    })),
  );
  const prefix = locale === 'el' ? '' : `/${locale}`;
  return (
    <>
      <JsonLd data={itemListLD as Record<string, unknown>} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav aria-label="Filter by type" className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 self-center mr-1">
            {locale === 'el' ? 'Φίλτρα:' : 'Filters:'}
          </span>
          {FILTER_CHIPS.map(chip => (
            <a
              key={chip.slug}
              href={`${prefix}/listings/type/${chip.slug}`}
              className="px-3 py-1.5 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              {chip.labels[locale] || chip.labels.en}
            </a>
          ))}
        </nav>
      </div>
      <PageClient initialData={listings} />
    </>
  );
}
