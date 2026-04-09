import type { Metadata } from 'next';
import { createApiClient } from '@/lib/api-helpers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; type: string }> }): Promise<Metadata> {
  const { locale, type } = await params;

  let typeName = type;
  try {
    const supabase = createApiClient();
    const { data } = await supabase.from('business_types').select('*').eq('slug', type).single();
    if (data) typeName = data[`name_${locale}`] || data.name_el || type;
  } catch {}

  const title = `${typeName} - Χαλκιδική`;
  const description = locale === 'el'
    ? `Βρείτε τα καλύτερα ${typeName.toLowerCase()} στη Χαλκιδική. Αξιολογήσεις, τηλέφωνα, ωράρια, φωτογραφίες.`
    : `Find the best ${typeName.toLowerCase()} in Halkidiki, Greece. Reviews, phone numbers, hours, photos.`;

  return {
    title,
    description,
    openGraph: { title, description, type: 'website', locale, siteName: 'Chalkidiki Hub' },
    alternates: {
      canonical: `${SITE_URL}/${locale}/restaurants/category/${type}`,
      languages: {
        el: `${SITE_URL}/el/restaurants/category/${type}`,
        en: `${SITE_URL}/en/restaurants/category/${type}`,
        de: `${SITE_URL}/de/restaurants/category/${type}`,
        bg: `${SITE_URL}/bg/restaurants/category/${type}`,
        ru: `${SITE_URL}/ru/restaurants/category/${type}`,
        ro: `${SITE_URL}/ro/restaurants/category/${type}`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
