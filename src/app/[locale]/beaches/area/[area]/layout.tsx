import type { Metadata } from 'next';
import { AREAS } from '@/lib/constants';
import { localeUrl } from '@/lib/seo';

const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; area: string }> }): Promise<Metadata> {
  const { locale, area } = await params;
  const areaInfo = AREAS.find(a => a.slug === area);
  const areaName = areaInfo?.name[locale] || areaInfo?.name.en || area;
  const title = `Παραλίες ${areaName} - Χαλκιδική`;
  const description = `Ανακαλύψτε τις καλύτερες παραλίες στην περιοχή ${areaName}, Χαλκιδική. Αξιολογήσεις, χάρτης, φωτογραφίες και πληροφορίες.`;

  return {
    title,
    description,
    alternates: {
      canonical: localeUrl(locale, `beaches/area/${area}`),
      languages: Object.fromEntries(
        LOCALES.map(l => [l, localeUrl(l, `beaches/area/${area}`)])
      ),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
