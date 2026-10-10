import type { Metadata } from 'next';
import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta } from '@/lib/seo/compat';
import ContactClient from './_client';
import { ClientIntl } from '@/components/ClientIntl';

const titles: Record<string, string> = {
  el: 'Επικοινωνία',
  en: 'Contact Us',
  de: 'Kontakt',
  bg: 'Контакти',
  ru: 'Контакты',
  ro: 'Contact',
  sr: 'Kontakt',
};

const descriptions: Record<string, string> = {
  el: 'Επικοινωνήστε μαζί μας για ερωτήσεις σχετικά με τη Χαλκιδική.',
  en: 'Contact us for questions about Halkidiki tourism and accommodations.',
  de: 'Kontaktieren Sie uns für Fragen zu Chalkidiki.',
  bg: 'Свържете се с нас за въпроси относно Халкидики.',
  ru: 'Свяжитесь с нами по вопросам о Халкидики.',
  ro: 'Contactați-ne pentru întrebări despre Halkidiki.',
  sr: 'Kontaktirajte nas za pitanja o Halkidikiju.',
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // Utility page with a form + address — no standalone search value. Keep it
  // crawlable (follow) but out of the index so it isn't flagged as thin.
  return { ...collectionMeta({ titles, descriptions, path: 'contact', locale }), robots: { index: false, follow: true } };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  // ContactClient reads ?subject / ?message so campaign links can arrive
  // pre-addressed; useSearchParams needs a Suspense boundary or the whole
  // prerendered route falls back to client-side rendering.
  return (
    <ClientIntl namespaces={['contact', 'common']}>
      <Suspense>
        <ContactClient />
      </Suspense>
    </ClientIntl>
  );
}
