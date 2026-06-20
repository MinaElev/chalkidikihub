import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getSales } from '@/lib/data';
import { collectionMeta, generateItemListLD, localeUrl } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { SaleCard } from '@/components/sales/SaleCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Building } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export const revalidate = 2592000; // ISR: 30d - on-demand revalidation from admin saves keeps content fresh

const VALID_AREAS = ['kassandra', 'sithonia', 'athos', 'mainland'] as const;
type ValidArea = (typeof VALID_AREAS)[number];

const AREA_NAMES: Record<ValidArea, Record<string, string>> = {
  kassandra: { el: 'Κασσάνδρα', en: 'Kassandra', de: 'Kassandra', bg: 'Касандра', ru: 'Кассандра', ro: 'Kassandra', sr: 'Kasandra' },
  sithonia: { el: 'Σιθωνία', en: 'Sithonia', de: 'Sithonia', bg: 'Ситония', ru: 'Ситония', ro: 'Sithonia', sr: 'Sitonija' },
  athos: { el: 'Άθως', en: 'Athos', de: 'Athos', bg: 'Атон', ru: 'Афон', ro: 'Athos', sr: 'Atos' },
  mainland: { el: 'Ηπειρωτική Χαλκιδική', en: 'Mainland Halkidiki', de: 'Festland Chalkidiki', bg: 'Континентален Халкидики', ru: 'Материковые Халкидики', ro: 'Halkidiki continental', sr: 'Kopneni Halkidiki' },
};

const HALKIDIKI: Record<string, string> = {
  el: 'Χαλκιδική', en: 'Halkidiki', de: 'Chalkidiki', bg: 'Халкидики', ru: 'Халкидики', ro: 'Halkidiki', sr: 'Halkidiki',
};

function areaTitle(area: ValidArea, locale: string): string {
  const areaName = AREA_NAMES[area]?.[locale] || AREA_NAMES[area]?.en || area;
  const halkidiki = HALKIDIKI[locale] || HALKIDIKI.en;
  const templates: Record<string, string> = {
    el: `Ακίνητα προς Πώληση στη ${areaName}, ${halkidiki}`,
    en: `Properties for Sale in ${areaName}, ${halkidiki}`,
    de: `Immobilien zum Verkauf in ${areaName}, ${halkidiki}`,
    bg: `Имоти за продажба в ${areaName}, ${halkidiki}`,
    ru: `Недвижимость на продажу в ${areaName}, ${halkidiki}`,
    ro: `Proprietăți de vânzare în ${areaName}, ${halkidiki}`,
    sr: `Nekretnine na prodaju u ${areaName}, ${halkidiki}`,
  };
  return templates[locale] || templates.en;
}

function areaDescription(area: ValidArea, locale: string): string {
  const areaName = AREA_NAMES[area]?.[locale] || AREA_NAMES[area]?.en || area;
  const halkidiki = HALKIDIKI[locale] || HALKIDIKI.en;
  const templates: Record<string, string> = {
    el: `Βρείτε σπίτια, διαμερίσματα, οικόπεδα και επαγγελματικούς χώρους προς πώληση στη ${areaName}, ${halkidiki}. Ενημερωμένες αγγελίες με φωτογραφίες, τιμές και χαρακτηριστικά.`,
    en: `Find houses, apartments, land plots and commercial properties for sale in ${areaName}, ${halkidiki}. Updated listings with photos, prices and features.`,
    de: `Finden Sie Häuser, Wohnungen, Grundstücke und Gewerbeimmobilien zum Verkauf in ${areaName}, ${halkidiki}. Aktuelle Angebote mit Fotos, Preisen und Ausstattung.`,
    bg: `Намерете къщи, апартаменти, парцели и търговски имоти за продажба в ${areaName}, ${halkidiki}. Актуални обяви с снимки, цени и характеристики.`,
    ru: `Найдите дома, квартиры, участки и коммерческую недвижимость на продажу в ${areaName}, ${halkidiki}. Актуальные объявления с фото, ценами и характеристиками.`,
    ro: `Găsiți case, apartamente, terenuri și proprietăți comerciale de vânzare în ${areaName}, ${halkidiki}. Anunțuri actualizate cu fotografii, prețuri și caracteristici.`,
    sr: `Pronađite kuće, stanove, placeve i poslovne prostore na prodaju u ${areaName}, ${halkidiki}. Ažurirani oglasi sa fotografijama, cenama i karakteristikama.`,
  };
  return templates[locale] || templates.en;
}

type Props = { params: Promise<{ locale: string; area: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, area } = await params;
  if (!VALID_AREAS.includes(area as ValidArea)) return {};

  const validArea = area as ValidArea;
  const titles = Object.fromEntries(
    ['el', 'en'].map(l => [l, `${areaTitle(validArea, l)}`]),
  );
  const descriptions = Object.fromEntries(
    ['el', 'en'].map(l => [l, areaDescription(validArea, l)]),
  );

  return collectionMeta({ titles, descriptions, path: `sales/area/${area}`, locale, ogType: 'sales' });
}

export default async function SalesAreaPage({ params }: Props) {
  const { locale, area } = await params;

  if (!VALID_AREAS.includes(area as ValidArea)) notFound();
  const validArea = area as ValidArea;

  setRequestLocale(locale);

  const allSales = await getSales();
  const sales = allSales.filter(s => s.area === validArea);

  const areaName = AREA_NAMES[validArea]?.[locale] || AREA_NAMES[validArea]?.en || area;
  const title = areaTitle(validArea, locale);

  const sectionLabel: Record<string, string> = {
    el: 'Πωλήσεις', en: 'Sales', de: 'Verkäufe', bg: 'Продажби', ru: 'Продажи', ro: 'Vânzări', sr: 'Prodaje',
  };

  const itemListLD = generateItemListLD(
    title,
    sales.map(s => ({
      name: s.title[locale] || s.title.el || s.title.en,
      url: localeUrl(locale, `sales/${s.slug}`),
    })),
  );

  return (
    <>
      <JsonLd data={itemListLD as Record<string, unknown>} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[
          { label: sectionLabel[locale] || 'Sales', href: '/sales' },
          { label: areaName },
        ]} />

        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">{title}</h1>
        <p className="text-gray-600 mb-8">
          {sales.length} {locale === 'el' ? 'ακίνητα' : locale === 'de' ? 'Immobilien' : locale === 'bg' ? 'имота' : locale === 'ru' ? 'объектов' : 'properties'}
        </p>

        {sales.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sales.map(sale => <SaleCard key={sale.id} sale={sale} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-500">
              {locale === 'el' ? 'Δεν βρέθηκαν ακίνητα σε αυτή την περιοχή.' : 'No properties found in this area.'}
            </p>
            <Link href="/sales" className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
              {locale === 'el' ? 'Δείτε όλα τα ακίνητα' : 'View all properties'} &rarr;
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
