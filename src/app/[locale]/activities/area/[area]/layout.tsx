import type { Metadata } from 'next';
import { AREAS } from '@/lib/constants';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; area: string }> }): Promise<Metadata> {
  const { locale, area } = await params;
  const areaInfo = AREAS.find(a => a.slug === area);
  const areaName = areaInfo?.name[locale] || areaInfo?.name.en || area;
  const title = `Δραστηριότητες ${areaName} - Χαλκιδική`;
  const description = `Δραστηριότητες και αξιοθέατα στην περιοχή ${areaName}, Χαλκιδική. Εκδρομές, σπορ, πολιτισμός και ψυχαγωγία.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/activities/area/${area}`,
      languages: Object.fromEntries(
        LOCALES.map(l => [l, `${SITE_URL}/${l}/activities/area/${area}`])
      ),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
