import type { Metadata } from 'next';
import { createApiClient } from '@/lib/api-helpers';
import { localeUrl } from '@/lib/seo';

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
      canonical: localeUrl(locale, `restaurants/category/${type}`),
      languages: Object.fromEntries(
        ['el','en','de','bg','ru','ro','sr'].map(l => [l, localeUrl(l, `restaurants/category/${type}`)])
      ),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
