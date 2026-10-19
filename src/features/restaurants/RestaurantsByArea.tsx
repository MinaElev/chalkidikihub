import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { AREA_SLUGS, type RestaurantCard } from '@/lib/db/content';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { AREA_LOCATIVE } from '@/lib/content/place-names';
import { itemListLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Card, CardGrid } from '@/components/ui/Card';
import { Section } from '@/components/ui/Layout';

/** Restaurants grouped by peninsula, best-rated (by review volume) first. */
export async function RestaurantsByArea({ locale, items }: { locale: Locale; items: RestaurantCard[] }) {
  const [t, cuisines] = await Promise.all([
    getTranslations({ locale, namespace: 'food' }),
    getTranslations({ locale, namespace: 'cuisineTypes' }),
  ]);
  const villages = await closestVillagesFor(items, locale, 10);
  const weight = (r: RestaurantCard) => (r.rating ?? 0) * Math.log10(10 + (r.reviews_count ?? 0));

  return (
    <>
      {AREA_SLUGS.map((area) => {
        const list = items.filter((r) => r.area === area).sort((a, b) => weight(b) - weight(a));
        if (!list.length) return null;
        return (
          <Section key={area} id={area} title={t('inArea', { area: AREA_LOCATIVE[area][locale] })}>
            <CardGrid>
              {list.map((r, i) => (
                <Card
                  key={r.slug}
                  href={`/restaurants/${r.slug}`}
                favorite={{ type: 'restaurant', slug: r.slug }}
                  title={displayName(r, locale, 'restaurant')}
                  eyebrow={villages.get(r.slug)}
                  image={r.image_url}
                  imageAlt={r.image_alt}
                  priority={area === 'kassandra' && i < 2}
                  badges={(r.cuisine ?? []).filter((c) => cuisines.has(c)).slice(0, 2).map((c) => cuisines(c))}
                  {...ratingProps(r, 'restaurant')}
                />
              ))}
            </CardGrid>
          </Section>
        );
      })}
      <JsonLd data={itemListLd(locale, items.map((r) => ({ name: displayName(r, locale, 'restaurant'), path: `/restaurants/${r.slug}` })))} />
    </>
  );
}
