import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AREAS } from '@/lib/constants';
import { seedListings } from '@/lib/seed-data';
import { MapPin } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AreasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AreasContent locale={locale} />;
}

function AreasContent({ locale }: { locale: string }) {
  const t = useTranslations('areas');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-3 text-lg text-gray-600">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {AREAS.map((area) => {
          const listingsInArea = seedListings.filter((l) => l.area === area.slug);
          return (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[16/9] bg-gray-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${area.image_url})` }}
                />
                <div className="absolute inset-0 bg-primary-900/20" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h2 className="text-2xl font-bold text-white">{area.name[locale]}</h2>
                  <p className="mt-2 text-sm text-gray-200 line-clamp-2">
                    {area.description[locale]}
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <span className="flex items-center gap-1 text-sm text-primary-300">
                      <MapPin className="w-4 h-4" />
                      {t('listingsCount', { count: listingsInArea.length })}
                    </span>
                    <span className="text-sm font-medium text-primary-300 group-hover:text-primary-200 transition-colors">
                      {t('viewListings')} &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
