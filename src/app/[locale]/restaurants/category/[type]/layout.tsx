import type { Metadata } from 'next';
import { createApiClient } from '@/lib/api-helpers';
import { localeUrl, ogImageUrl } from '@/lib/seo';

const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

const descTemplates: Record<string, (name: string) => string> = {
  el: (n) => `Βρείτε τα καλύτερα ${n.toLowerCase()} στη Χαλκιδική. Αξιολογήσεις, τηλέφωνα, ωράρια, φωτογραφίες.`,
  en: (n) => `Find the best ${n.toLowerCase()} in Halkidiki, Greece. Reviews, phone numbers, hours, photos.`,
  de: (n) => `Finden Sie die besten ${n} in Chalkidiki. Bewertungen, Telefonnummern, Öffnungszeiten, Fotos.`,
  bg: (n) => `Намерете най-добрите ${n.toLowerCase()} в Халкидики. Отзиви, телефони, работно време, снимки.`,
  ru: (n) => `Найдите лучшие ${n.toLowerCase()} на Халкидики. Отзывы, телефоны, часы работы, фото.`,
  ro: (n) => `Găsiți cele mai bune ${n.toLowerCase()} în Halkidiki. Recenzii, telefoane, program, fotografii.`,
  sr: (n) => `Pronađite najbolje ${n.toLowerCase()} na Halkidikiju. Recenzije, telefoni, radno vreme, fotografije.`,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; type: string }> }): Promise<Metadata> {
  const { locale, type } = await params;

  let typeName = type;
  try {
    const supabase = createApiClient();
    const { data } = await supabase.from('business_types').select('*').eq('slug', type).single();
    if (data) typeName = data[`name_${locale}`] || data.name_el || type;
  } catch {}

  const title = `${typeName} — Halkidiki`;
  const description = (descTemplates[locale] || descTemplates.en)(typeName);
  const image = ogImageUrl(title, 'restaurant');

  return {
    title,
    description,
    openGraph: {
      title, description, type: 'website', locale, siteName: 'Chalkidiki Hub',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image', title, description, images: [image],
    },
    alternates: {
      canonical: localeUrl(locale, `restaurants/category/${type}`),
      languages: Object.fromEntries(
        LOCALES.map(l => [l, localeUrl(l, `restaurants/category/${type}`)])
      ),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
