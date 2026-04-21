import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getAreas } from '@/lib/data';
import { AREAS } from '@/lib/constants';
import { MapPin } from 'lucide-react';

export async function FeaturedAreas({ locale }: { locale: string }) {
  const t = await getTranslations('areas');
  let areas = await getAreas();
  if (areas.length === 0) areas = AREAS;

  return (
    <section className="py-20 md:py-28 bg-mesh-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-badge bg-primary-50 text-primary-700 mb-3">
            <MapPin className="w-3.5 h-3.5" />
            {locale === 'el' ? 'Εξερευνήστε' : 'Explore'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('title')}</h2>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {areas.map((area) => (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-gray-900"
            >
              {area.image_url ? (
                <Image src={area.image_url} alt={area.name[locale] || area.name.el || ''} fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  quality={60}
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 group-hover:scale-110 transition-transform duration-500" />
              )}
              {/* Cinematic gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="text-xl font-bold text-white">{area.name[locale] || area.name.el}</h3>
                <p className="mt-1.5 text-sm text-white/60 line-clamp-2">{area.description[locale] || area.description.el}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white/80 group-hover:text-white group-hover:gap-2 transition-all">
                  {t('viewListings')} <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
