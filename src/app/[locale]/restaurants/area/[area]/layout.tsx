import type { Metadata } from 'next';
import { AREAS } from '@/lib/constants';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; area: string }> }): Promise<Metadata> {
  const { locale, area } = await params;
  const areaInfo = AREAS.find(a => a.slug === area);
  const areaName = areaInfo?.name[locale] || areaInfo?.name.en || area;
  const title = `Φαγητό & Ποτό ${areaName} - Χαλκιδική`;
  const description = `Εστιατόρια, ταβέρνες και καφέ στην περιοχή ${areaName}, Χαλκιδική. Κριτικές, μενού και κρατήσεις.`;

  return {
    title,
    description,
    alternates: {
      canonical: localeUrl(locale, `restaurants/area/${area}`),
      languages: Object.fromEntries(
        LOCALES.map(l => [l, localeUrl(l, `restaurants/area/${area}`)])
      ),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
