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
import type { PropertyType } from '@/types';

export const revalidate = 3600; // ISR: 1 hour

const VALID_TYPES = ['apartment', 'house', 'land', 'commercial', 'other'] as const;

const TYPE_LABELS: Record<string, Record<string, string>> = {
  apartment: { el: 'Διαμερίσματα', en: 'Apartments', de: 'Wohnungen', bg: 'Апартаменти', ru: 'Квартиры', ro: 'Apartamente', sr: 'Stanovi' },
  house: { el: 'Σπίτια & Μεζονέτες', en: 'Houses & Maisonettes', de: 'Häuser & Maisonetten', bg: 'Къщи', ru: 'Дома', ro: 'Case', sr: 'Kuće' },
  land: { el: 'Οικόπεδα', en: 'Land Plots', de: 'Grundstücke', bg: 'Парцели', ru: 'Участки', ro: 'Terenuri', sr: 'Placevi' },
  commercial: { el: 'Επαγγελματικοί Χώροι', en: 'Commercial Properties', de: 'Gewerbeimmobilien', bg: 'Търговски имоти', ru: 'Коммерческая недвижимость', ro: 'Spații comerciale', sr: 'Poslovni prostori' },
  other: { el: 'Λοιπά Ακίνητα', en: 'Other Properties', de: 'Sonstige Immobilien', bg: 'Други имоти', ru: 'Прочая недвижимость', ro: 'Alte proprietăți', sr: 'Ostale nekretnine' },
};

const HALKIDIKI: Record<string, string> = {
  el: 'Χαλκιδική', en: 'Halkidiki', de: 'Chalkidiki', bg: 'Халкидики', ru: 'Халкидики', ro: 'Halkidiki', sr: 'Halkidiki',
};

const TYPE_META_DESC: Record<string, Record<string, string>> = {
  apartment: {
    el: 'Διαμερίσματα προς πώληση στη Χαλκιδική. Studio, δυάρια, τριάρια κοντά σε παραλίες — ιδανικά για επένδυση ή διακοπές.',
    en: 'Apartments for sale in Halkidiki. Studios, 1-bed and 2-bed flats near beaches — ideal for investment or holidays.',
    de: 'Wohnungen zum Verkauf in Chalkidiki. Studios, 1- und 2-Zimmer-Wohnungen nahe Strände — ideal als Investition oder Feriendomizil.',
    bg: 'Апартаменти за продажба в Халкидики. Студия, едностайни и двустайни апартаменти близо до плажове — идеални за инвестиция или ваканция.',
    ru: 'Квартиры на продажу в Халкидики. Студии, одно- и двухкомнатные квартиры у пляжей — идеально для инвестиций или отдыха.',
    ro: 'Apartamente de vânzare în Halkidiki. Garsoniere, apartamente cu 1-2 camere lângă plaje — ideale pentru investiții sau vacanțe.',
    sr: 'Stanovi na prodaju u Halkidikiju. Garsonjere, jednosobni i dvosobni stanovi blizu plaža — idealni za investiciju ili odmor.',
  },
  house: {
    el: 'Σπίτια και μεζονέτες προς πώληση στη Χαλκιδική. Μονοκατοικίες, βίλες και μεζονέτες με κήπο, πισίνα, θέα θάλασσα.',
    en: 'Houses and maisonettes for sale in Halkidiki. Detached homes, villas and maisonettes with garden, pool, sea views.',
    de: 'Häuser und Maisonetten zum Verkauf in Chalkidiki. Einfamilienhäuser, Villen und Maisonetten mit Garten, Pool, Meerblick.',
    bg: 'Къщи и мезонети за продажба в Халкидики. Самостоятелни къщи, вили и мезонети с градина, басейн, морска гледка.',
    ru: 'Дома и мезонеты на продажу в Халкидики. Частные дома, виллы и мезонеты с садом, бассейном, видом на море.',
    ro: 'Case și maisonete de vânzare în Halkidiki. Case individuale, vile și maisonete cu grădină, piscină, vedere la mare.',
    sr: 'Kuće i mezoneti na prodaju u Halkidikiju. Porodične kuće, vile i mezoneti sa baštom, bazenom, pogledom na more.',
  },
  land: {
    el: 'Οικόπεδα προς πώληση στη Χαλκιδική. Εντός σχεδίου, εκτός σχεδίου, αγροτεμάχια — ιδανικά για κατασκευή ή επένδυση.',
    en: 'Land plots for sale in Halkidiki. Building plots, agricultural land — ideal for construction or investment.',
    de: 'Grundstücke zum Verkauf in Chalkidiki. Baugrundstücke, landwirtschaftliche Flächen — ideal für Bau oder Investition.',
    bg: 'Парцели за продажба в Халкидики. Строителни парцели, земеделска земя — идеални за строителство или инвестиция.',
    ru: 'Участки на продажу в Халкидики. Земельные участки под строительство и сельскохозяйственные — для строительства или инвестиций.',
    ro: 'Terenuri de vânzare în Halkidiki. Parcele construibile, teren agricol — ideale pentru construcție sau investiție.',
    sr: 'Placevi na prodaju u Halkidikiju. Građevinski placevi, poljoprivredno zemljište — idealni za izgradnju ili investiciju.',
  },
  commercial: {
    el: 'Επαγγελματικοί χώροι προς πώληση στη Χαλκιδική. Καταστήματα, γραφεία, αποθήκες, τουριστικές μονάδες.',
    en: 'Commercial properties for sale in Halkidiki. Shops, offices, warehouses, tourism businesses.',
    de: 'Gewerbeimmobilien zum Verkauf in Chalkidiki. Geschäfte, Büros, Lagerhäuser, Tourismusbetriebe.',
    bg: 'Търговски имоти за продажба в Халкидики. Магазини, офиси, складове, туристически обекти.',
    ru: 'Коммерческая недвижимость на продажу в Халкидики. Магазины, офисы, склады, туристические объекты.',
    ro: 'Spații comerciale de vânzare în Halkidiki. Magazine, birouri, depozite, afaceri turistice.',
    sr: 'Poslovni prostori na prodaju u Halkidikiju. Prodavnice, kancelarije, magacini, turistički objekti.',
  },
  other: {
    el: 'Λοιπά ακίνητα προς πώληση στη Χαλκιδική. Ειδικές κατηγορίες ακινήτων — γκαράζ, αποθήκες, ειδικές χρήσεις.',
    en: 'Other properties for sale in Halkidiki. Special property types — garages, storage units, special use.',
    de: 'Sonstige Immobilien zum Verkauf in Chalkidiki. Besondere Immobilientypen — Garagen, Lagerflächen, Sondernutzung.',
    bg: 'Други имоти за продажба в Халкидики. Специални типове имоти — гаражи, складове, специално предназначение.',
    ru: 'Прочая недвижимость на продажу в Халкидики. Особые типы — гаражи, склады, специальное назначение.',
    ro: 'Alte proprietăți de vânzare în Halkidiki. Tipuri speciale — garaje, depozite, utilizări speciale.',
    sr: 'Ostale nekretnine na prodaju u Halkidikiju. Posebne kategorije — garaže, magacini, specijalna namena.',
  },
};

function categoryTitle(type: string, locale: string): string {
  const typeLabel = TYPE_LABELS[type]?.[locale] || TYPE_LABELS[type]?.en || type;
  const halkidiki = HALKIDIKI[locale] || HALKIDIKI.en;
  const templates: Record<string, string> = {
    el: `${typeLabel} προς Πώληση στη ${halkidiki}`,
    en: `${typeLabel} for Sale in ${halkidiki}`,
    de: `${typeLabel} zum Verkauf in ${halkidiki}`,
    bg: `${typeLabel} за продажба в ${halkidiki}`,
    ru: `${typeLabel} на продажу в ${halkidiki}`,
    ro: `${typeLabel} de vânzare în ${halkidiki}`,
    sr: `${typeLabel} na prodaju u ${halkidiki}`,
  };
  return templates[locale] || templates.en;
}

type Props = { params: Promise<{ locale: string; type: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type } = await params;
  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) return {};

  const titles = Object.fromEntries(
    ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'].map(l => [l, `${categoryTitle(type, l)} | ChalkidikiHub`]),
  );
  const descriptions = Object.fromEntries(
    ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'].map(l => [l, TYPE_META_DESC[type]?.[l] || TYPE_META_DESC[type]?.en || `${TYPE_LABELS[type]?.en || type} for sale in Halkidiki`]),
  );

  return collectionMeta({ titles, descriptions, path: `sales/category/${type}`, locale, ogType: 'sales' });
}

export default async function SalesCategoryPage({ params }: Props) {
  const { locale, type } = await params;

  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) notFound();

  setRequestLocale(locale);

  const allSales = await getSales();
  const sales = allSales.filter(s => s.property_type === (type as PropertyType));

  const typeLabel = TYPE_LABELS[type]?.[locale] || TYPE_LABELS[type]?.en || type;
  const title = categoryTitle(type, locale);

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
          { label: typeLabel },
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
              {locale === 'el' ? 'Δεν βρέθηκαν ακίνητα σε αυτή την κατηγορία.' : 'No properties found in this category.'}
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
