import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Για Ιδιοκτήτες',
    description: 'Καταχωρίστε δωρεάν την επιχείρησή σας στο Chalkidiki Hub — προβολή καταλυμάτων, εστιατορίων και δραστηριοτήτων στη Χαλκιδική σε 6 γλώσσες.',
    alternates: {
      canonical: localeUrl(locale, 'for-owners'),
      languages: {
        ...Object.fromEntries(['el','en'].map(l => [l, localeUrl(l, 'for-owners')])),
        'x-default': localeUrl('el', 'for-owners'),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
