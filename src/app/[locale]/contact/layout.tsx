import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

const TITLES: Record<string, string> = {
  el: 'Επικοινωνία',
  en: 'Contact',
  de: 'Kontakt',
  bg: 'Контакт',
  ru: 'Контакты',
  ro: 'Contact',
  sr: 'Kontakt',
};

const DESCRIPTIONS: Record<string, string> = {
  el: 'Επικοινωνήστε μαζί μας για πληροφορίες, προτάσεις ή συνεργασίες σχετικά με τη Χαλκιδική. Φόρμα επικοινωνίας και στοιχεία επαφής.',
  en: 'Contact ChalkidikiHub for information, suggestions or partnerships about Halkidiki. Contact form, phone, email and social media channels.',
  de: 'Kontaktieren Sie ChalkidikiHub für Informationen, Vorschläge oder Partnerschaften zu Chalkidiki. Kontaktformular, Telefon, E-Mail und Social Media.',
  bg: 'Свържете се с ChalkidikiHub за информация, предложения или партньорства за Халкидики. Форма за връзка, телефон, имейл и социални мрежи.',
  ru: 'Свяжитесь с ChalkidikiHub для информации, предложений или партнёрств о Халкидики. Форма обратной связи, телефон, email и социальные сети.',
  ro: 'Contactați ChalkidikiHub pentru informații, sugestii sau parteneriate despre Halkidiki. Formular de contact, telefon, email și rețele sociale.',
  sr: 'Kontaktirajte ChalkidikiHub za informacije, predloge ili saradnju o Halkidikiju. Kontakt forma, telefon, email i društvene mreže.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates: {
      canonical: localeUrl(locale, 'contact'),
      languages: {
        ...Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, localeUrl(l, 'contact')])),
        'x-default': localeUrl('el', 'contact'),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
