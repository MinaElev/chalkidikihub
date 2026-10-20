import { setRequestLocale } from 'next-intl/server';
import { MountAthosNav } from './MountAthosNav';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function MountAthosLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
  const pre = locale === 'el' ? '' : `/${locale}`;
  const athosName: Record<string, string> = { el: 'Άγιον Όρος', en: 'Mount Athos', de: 'Berg Athos', bg: 'Света гора', ru: 'Афон', ro: 'Muntele Athos', sr: 'Sveta Gora' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section BreadcrumbList (Home › Mount Athos) — these pages had none. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: ({"el":"Αρχική","en":"Home","de":"Startseite","bg":"Начало","ru":"Главная","ro":"Acasă","sr":"Početna"} as Record<string, string>)[locale] ?? "Home", item: `${SITE}${pre || '/'}` },
          { '@type': 'ListItem', position: 2, name: athosName[locale] || athosName.en, item: `${SITE}${pre}/mount-athos` },
        ],
      })}} />
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <MountAthosNav />
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
