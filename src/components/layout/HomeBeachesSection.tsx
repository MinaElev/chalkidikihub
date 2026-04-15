import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { BeachCard } from '@/components/listings/BeachCard';
import { getBeaches } from '@/lib/data';
import { Waves, ArrowRight } from 'lucide-react';

export async function HomeBeachesSection({ locale }: { locale: string }) {
  const tBeaches = await getTranslations('beaches');
  const tCommon = await getTranslations('common');
  const beaches = await getBeaches();
  const featured = beaches.slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-mesh-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-badge bg-blue-50 text-blue-700 mb-3">
              <Waves className="w-3.5 h-3.5" />
              {locale === 'el' ? 'Κορυφαίες' : 'Top Rated'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{tBeaches('title')}</h2>
            <p className="mt-2 text-gray-500">{tBeaches('subtitle')}</p>
          </div>
          <Link
            href="/beaches"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            {tCommon('viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((beach) => (
            <BeachCard key={beach.id} beach={beach} />
          ))}
        </div>
      </div>
    </section>
  );
}
