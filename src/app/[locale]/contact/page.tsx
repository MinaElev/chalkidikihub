import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta } from '@/lib/seo';
import ContactClient from './_client';

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
  return collectionMeta({ titles, descriptions, path: 'contact', locale });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactClient />;
}
