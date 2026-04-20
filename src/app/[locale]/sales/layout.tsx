import type { Metadata } from 'next';
import { SalesHeader } from '@/components/sales/SalesHeader';
import { SalesFooter } from '@/components/sales/SalesFooter';
import { localeUrl } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Πωλήσεις Ακινήτων Χαλκιδικής',
    description: 'Βρείτε ακίνητα προς πώληση στη Χαλκιδική — κατοικίες, διαμερίσματα, οικόπεδα και επαγγελματικούς χώρους σε Κασσάνδρα, Σιθωνία και Άθως.',
    alternates: {
      canonical: localeUrl(locale, 'sales'),
      languages: {
        ...Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, localeUrl(l, 'sales')])),
        'x-default': localeUrl('el', 'sales'),
      },
    },
  };
}

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: '#main-header, #main-footer { display: none !important; }' }} />
      <SalesHeader />
      <div className="flex-1">{children}</div>
      <SalesFooter />
    </>
  );
}
