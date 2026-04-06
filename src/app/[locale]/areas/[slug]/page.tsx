import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { AREAS } from '@/lib/constants';
import { AreaListings } from '@/components/listings/AreaListings';
import { AreaBeaches, AreaRestaurants, AreaActivities, AreaChargers } from '@/components/listings/AreaContent';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AreaHero } from '@/components/layout/AreaHero';
import { JsonLd } from '@/components/ui/JsonLd';
import type { Metadata } from 'next';

import { Area } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return AREAS.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const area = AREAS.find((a) => a.slug === slug);
  if (!area) return { title: 'Area | Chalkidiki Hub' };

  const name = area.name[locale] || area.name.el;
  const desc = area.description[locale] || area.description.el;

  return {
    title: `${name} - Χαλκιδική | Chalkidiki Hub`,
    description: desc,
    openGraph: {
      title: `${name} - Χαλκιδική`,
      description: desc,
      type: 'website',
      locale,
      siteName: 'Chalkidiki Hub',
      ...(area.image_url ? { images: [{ url: area.image_url, alt: name, width: 1200, height: 630 }] } : {}),
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/areas/${slug}`,
      languages: {
        el: `${SITE_URL}/el/areas/${slug}`,
        en: `${SITE_URL}/en/areas/${slug}`,
        de: `${SITE_URL}/de/areas/${slug}`,
        bg: `${SITE_URL}/bg/areas/${slug}`,
        ru: `${SITE_URL}/ru/areas/${slug}`,
        ro: `${SITE_URL}/ro/areas/${slug}`,
      },
    },
  };
}

export default async function AreaDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const area = AREAS.find((a) => a.slug === slug);
  if (!area) notFound();

  return <AreaDetail locale={locale} area={area} areaSlug={slug as Area} />;
}

const AREA_FAQS: Record<string, Array<{ q: Record<string, string>; a: Record<string, string> }>> = {
  kassandra: [
    {
      q: { el: 'Πώς φτάνω στην Κασσάνδρα;', en: 'How do I get to Kassandra?' },
      a: { el: 'Η Κασσάνδρα απέχει περίπου 1 ώρα από τη Θεσσαλονίκη. Μπορείτε να φτάσετε με αυτοκίνητο ή ΚΤΕΛ.', en: 'Kassandra is about 1 hour from Thessaloniki. You can get there by car or KTEL bus.' },
    },
    {
      q: { el: 'Ποιες είναι οι καλύτερες παραλίες στην Κασσάνδρα;', en: 'What are the best beaches in Kassandra?' },
      a: { el: 'Οι πιο δημοφιλείς παραλίες είναι η Σάνη, το Ποσείδι, η Καλλιθέα και η Χανιώτη.', en: 'The most popular beaches are Sani, Possidi, Kallithea and Hanioti.' },
    },
    {
      q: { el: 'Πότε είναι η καλύτερη εποχή για Κασσάνδρα;', en: 'When is the best time to visit Kassandra?' },
      a: { el: 'Ιούνιος-Σεπτέμβριος για κολύμπι, Μάιος και Οκτώβριος για ηρεμία και χαμηλότερες τιμές.', en: 'June-September for swimming, May and October for quieter stays and lower prices.' },
    },
  ],
  sithonia: [
    {
      q: { el: 'Τι κάνει τη Σιθωνία μοναδική;', en: 'What makes Sithonia unique?' },
      a: { el: 'Η Σιθωνία είναι γνωστή για τις εξωτικές παραλίες, τη φύση και τη γαλήνη, ιδανική για οικογένειες και ζευγάρια.', en: 'Sithonia is known for its exotic beaches, nature and tranquility, ideal for families and couples.' },
    },
    {
      q: { el: 'Ποιες είναι οι καλύτερες παραλίες στη Σιθωνία;', en: 'What are the best beaches in Sithonia?' },
      a: { el: 'Καρύδι, Πορτοκάλι (Καβουρότρυπες), Βουρβουρού και Σάρτη είναι κορυφαίες επιλογές.', en: 'Karidi, Orange (Kavourotrypes), Vourvourou and Sarti are top choices.' },
    },
    {
      q: { el: 'Υπάρχει νυχτερινή ζωή στη Σιθωνία;', en: 'Is there nightlife in Sithonia?' },
      a: { el: 'Η Σιθωνία είναι πιο ήσυχη, αλλά στη Νικήτη και τη Σάρτη υπάρχουν μπαρ και εστιατόρια.', en: 'Sithonia is quieter, but Nikiti and Sarti have bars and restaurants.' },
    },
  ],
  athos: [
    {
      q: { el: 'Μπορώ να επισκεφτώ το Άγιον Όρος;', en: 'Can I visit Mount Athos?' },
      a: { el: 'Το Άγιον Όρος είναι προσβάσιμο μόνο σε άνδρες με ειδική άδεια. Η ευρύτερη περιοχή του Άθω προσφέρει παραλίες και αξιοθέατα.', en: 'Mount Athos monastery is accessible only to men with special permits. The wider Athos area offers beaches and attractions.' },
    },
    {
      q: { el: 'Ποιες παραλίες υπάρχουν στον Άθω;', en: 'What beaches are there in Athos area?' },
      a: { el: 'Ντεβελίκι, Κομίτσα και η παραλία της Ουρανούπολης είναι εξαιρετικές.', en: 'Develiki, Komitsa and Ouranoupoli beach are excellent choices.' },
    },
    {
      q: { el: 'Πώς φτάνω στην Ουρανούπολη;', en: 'How do I get to Ouranoupoli?' },
      a: { el: 'Η Ουρανούπολη απέχει 2 ώρες από Θεσσαλονίκη, μέσω Πολυγύρου ή Αρναίας.', en: 'Ouranoupoli is about 2 hours from Thessaloniki, via Polygyros or Arnea.' },
    },
  ],
  mainland: [
    {
      q: { el: 'Τι αξίζει να δω στην ενδοχώρα;', en: 'What is worth seeing in mainland Halkidiki?' },
      a: { el: 'Ο Πολύγυρος, η Αρναία, το σπήλαιο Πετραλώνων και παραδοσιακά χωριά.', en: 'Polygyros, Arnea, Petralona cave and traditional villages.' },
    },
    {
      q: { el: 'Πού μπορώ να φάω στην ενδοχώρα;', en: 'Where can I eat in mainland Halkidiki?' },
      a: { el: 'Τα Νέα Μουδανιά και η Νέα Ποτίδαια έχουν εξαιρετικές ψαροταβέρνες και εστιατόρια.', en: 'Nea Moudania and Nea Potidea have excellent fish taverns and restaurants.' },
    },
    {
      q: { el: 'Είναι κατάλληλη η ενδοχώρα για οικογένειες;', en: 'Is mainland Halkidiki suitable for families?' },
      a: { el: 'Ναι! Αρχαιολογικοί χώροι, σπήλαια, πάρκα και ήρεμες παραλίες κάνουν ιδανικές διακοπές.', en: 'Yes! Archaeological sites, caves, parks and calm beaches make it perfect for family holidays.' },
    },
  ],
};

function AreaDetail({
  locale,
  area,
  areaSlug,
}: {
  locale: string;
  area: (typeof AREAS)[number];
  areaSlug: Area;
}) {
  const tNav = useTranslations('nav');
  const faqs = AREA_FAQS[areaSlug] || [];

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q[locale] || faq.q.el,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a[locale] || faq.a.el,
      },
    })),
  } : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {faqSchema && <JsonLd data={faqSchema} />}
      <Breadcrumbs items={[{ label: tNav('areas'), href: '/areas' }, { label: area.name[locale] || area.name.el }]} />

      {/* Area Hero - fetches live from DB */}
      <AreaHero slug={areaSlug} />

      {/* Listings - fetches from DB */}
      <AreaListings area={areaSlug} />

      {/* Beaches - fetches from DB */}
      <AreaBeaches area={areaSlug} />

      {/* Activities - fetches from DB */}
      <AreaActivities area={areaSlug} />

      {/* Restaurants - fetches from DB */}
      <AreaRestaurants area={areaSlug} />

      {/* EV Chargers - fetches from DB */}
      <AreaChargers area={areaSlug} />

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Συχνές Ερωτήσεις</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden group">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 font-medium text-gray-900">
                  {faq.q[locale] || faq.q.el}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-4 text-gray-600">{faq.a[locale] || faq.a.el}</div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
