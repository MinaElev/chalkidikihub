import type { Metadata } from 'next';
import { SalesHeader } from '@/components/sales/SalesHeader';
import { SalesFooter } from '@/components/sales/SalesFooter';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Πωλήσεις Ακινήτων Χαλκιδικής',
    description: 'Βρείτε ακίνητα προς πώληση στη Χαλκιδική — κατοικίες, διαμερίσματα, οικόπεδα και επαγγελματικούς χώρους σε Κασσάνδρα, Σιθωνία και Άθως.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/sales`,
      languages: {
        el: `${SITE_URL}/el/sales`, en: `${SITE_URL}/en/sales`,
        de: `${SITE_URL}/de/sales`, bg: `${SITE_URL}/bg/sales`,
        ru: `${SITE_URL}/ru/sales`, ro: `${SITE_URL}/ro/sales`,
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
