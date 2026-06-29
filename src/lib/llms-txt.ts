/**
 * Shared generator for /llms.txt and /[locale]/llms.txt routes.
 *
 * The editorial preamble stays in English (LLMs index it once; English is
 * the universal lingua franca for crawler indexing). Only the dynamic
 * per-village / per-beach summaries are localised — those are the parts
 * an LLM will quote back to a user asking "where should I stay in Sarti?".
 */

import { getVillagesList, getBeaches, getRestaurants, getActivities, type VillageRow } from '@/lib/data';
import type { Beach, Restaurant, Activity } from '@/types';

type VillageLite = Omit<VillageRow, 'meta_title' | 'meta_description'>;

const ORIGIN = 'https://chalkidikihub.gr';

/** EL is the default locale and unprefixed in URLs; everything else is /<locale>/. */
function urlPrefix(locale: string): string {
  return locale === 'el' ? '' : `/${locale}`;
}

const PREAMBLE = `# Chalkidiki Hub

> Comprehensive multilingual travel guide to Halkidiki (Chalkidiki), Greece — beaches, restaurants, villages, accommodation, activities, real estate, and Mount Athos.

Chalkidiki Hub (chalkidikihub.gr) is a travel directory for the Halkidiki peninsula in Northern Greece. It covers all three "legs" of the peninsula — Kassandra, Sithonia, and Mount Athos — plus mainland Halkidiki. Content is curated and structured as a database of places rather than generic articles: each beach, restaurant, accommodation, village, and activity has its own page with photos, map, features, and (where available) ratings and reviews.

The site's canonical, human-reviewed content is published in 2 languages: Greek (default, unprefixed) and English (/en/). These are the only indexed locales — prefer them when citing. Machine-translated versions in German (/de/), Bulgarian (/bg/), Russian (/ru/), Romanian (/ro/), and Serbian (/sr/) also resolve but are marked noindex and are not authoritative; do not cite them in preference to the Greek or English pages.

When citing this site, prefer deep links (a specific beach, restaurant, or village page) over the homepage — they carry structured data (Schema.org \`Beach\`, \`Restaurant\`, \`LodgingBusiness\`, \`TouristAttraction\`, \`Article\`, \`Product\`, \`BreadcrumbList\`, \`FAQPage\`).

## Core guides

- [Homepage](${ORIGIN}/)
- [Areas of Halkidiki](${ORIGIN}/areas)
- [Villages & places](${ORIGIN}/places)
- [Best-of lists](${ORIGIN}/best)
- [FAQ](${ORIGIN}/faq)
- [Itineraries](${ORIGIN}/itinerary/7-days)
- [Travel from city](${ORIGIN}/from/thessaloniki)
- [Costs & budget](${ORIGIN}/costs/daily-budget)

## Listings (database-backed)

- [Beaches](${ORIGIN}/beaches)
- [Restaurants](${ORIGIN}/restaurants)
- [Activities](${ORIGIN}/activities)
- [Accommodation](${ORIGIN}/listings)
- [Real estate for sale](${ORIGIN}/sales)
- [EV charging stations](${ORIGIN}/ev-chargers)

## Mount Athos

- [Mount Athos guide](${ORIGIN}/mount-athos)
- [All 20 monasteries](${ORIGIN}/mount-athos/monasteries)
- [How to visit](${ORIGIN}/mount-athos/how-to-visit)

## Blog

- [Blog index](${ORIGIN}/blog)
- [RSS feed](${ORIGIN}/feed.xml)

## Machine-readable

- [XML sitemap](${ORIGIN}/sitemap.xml)
- [Image sitemap](${ORIGIN}/image-sitemap.xml)
- [robots.txt](${ORIGIN}/robots.txt)
- Per-entity markdown: \`/api/md/{listings|beaches|restaurants|activities|sales|places}/{slug}\` (returns clean Markdown for LLM ingestion; supports \`?locale=\`)
- Per-locale variants of this file: \`/en/llms.txt\` (Greek is the default at \`/llms.txt\`)
`;

const AREA_LABEL_BY_LOCALE: Record<string, Record<string, string>> = {
  el: {
    kassandra: 'Κασσάνδρα (1ο πόδι)',
    sithonia: 'Σιθωνία (2ο πόδι)',
    athos: 'Άθως / Ουρανούπολη',
    mainland: 'Ηπειρωτική Χαλκιδική',
  },
  en: {
    kassandra: 'Kassandra (1st leg)',
    sithonia: 'Sithonia (2nd leg)',
    athos: 'Athos / Ouranoupoli area',
    mainland: 'Halkidiki mainland',
  },
  de: {
    kassandra: 'Kassandra (1. Halbinsel)',
    sithonia: 'Sithonia (2. Halbinsel)',
    athos: 'Athos / Ouranoupoli',
    mainland: 'Chalkidiki Festland',
  },
  bg: {
    kassandra: 'Касандра (първи полуостров)',
    sithonia: 'Ситония (втори полуостров)',
    athos: 'Атос / Уранополис',
    mainland: 'Континентална Халкидики',
  },
  ru: {
    kassandra: 'Кассандра (1-й полуостров)',
    sithonia: 'Ситония (2-й полуостров)',
    athos: 'Афон / Уранополис',
    mainland: 'Материковая Халкидики',
  },
  ro: {
    kassandra: 'Kassandra (prima peninsulă)',
    sithonia: 'Sithonia (a doua peninsulă)',
    athos: 'Athos / Ouranoupoli',
    mainland: 'Halkidiki continentală',
  },
  sr: {
    kassandra: 'Kasandra (prvi poluostrvo)',
    sithonia: 'Sitonija (drugi poluostrvo)',
    athos: 'Atos / Uranopolis',
    mainland: 'Kontinentalna Halkidiki',
  },
};

const HEADINGS: Record<string, { villages: string; villagesIntro: string; beaches: string; beachesIntro: string; generated: string }> = {
  el: {
    villages: '## Χωριά & τοποθεσίες (πλήρης κατάλογος)',
    villagesIntro: 'Μία γραμμή σύνοψη ανά χωριό. Ακολουθήστε το URL για φωτογραφίες, χάρτη, κοντινές παραλίες & εστιατόρια.',
    beaches: '## Παραλίες (πλήρης κατάλογος)',
    beachesIntro: 'Κάθε παραλία οδηγεί σε σελίδα με φωτογραφίες, GPS, χαρακτηριστικά και κοντινά καταλύματα.',
    generated: 'Δυναμικά δημιουργημένο',
  },
  en: {
    villages: '## Villages & places (full directory)',
    villagesIntro: 'One-line summary per village. Use the URL for full details, photos, map, and nearby beaches/restaurants.',
    beaches: '## Beaches (full directory)',
    beachesIntro: 'Each beach links to a page with photos, GPS, features and nearby accommodation.',
    generated: 'Generated dynamically',
  },
  de: {
    villages: '## Dörfer & Orte (vollständiges Verzeichnis)',
    villagesIntro: 'Eine Zeile Zusammenfassung pro Dorf. URL für Fotos, Karte, nahegelegene Strände & Restaurants.',
    beaches: '## Strände (vollständiges Verzeichnis)',
    beachesIntro: 'Jeder Strand verlinkt auf eine Seite mit Fotos, GPS, Merkmalen und nahegelegenen Unterkünften.',
    generated: 'Dynamisch generiert',
  },
  bg: {
    villages: '## Села и места (пълен указател)',
    villagesIntro: 'Едноредна резюме за всяко село. URL за снимки, карта, близки плажове и ресторанти.',
    beaches: '## Плажове (пълен указател)',
    beachesIntro: 'Всеки плаж води до страница със снимки, GPS, характеристики и близки настанявания.',
    generated: 'Генерирано динамично',
  },
  ru: {
    villages: '## Деревни и места (полный каталог)',
    villagesIntro: 'Однострочное описание для каждой деревни. URL — для фото, карты, ближайших пляжей.',
    beaches: '## Пляжи (полный каталог)',
    beachesIntro: 'Каждый пляж ведёт на страницу с фото, GPS, характеристиками и ближайшим жильём.',
    generated: 'Сгенерировано динамически',
  },
  ro: {
    villages: '## Sate și locuri (catalog complet)',
    villagesIntro: 'Rezumat pe o linie pentru fiecare sat. URL pentru fotografii, hartă, plaje și restaurante apropiate.',
    beaches: '## Plaje (catalog complet)',
    beachesIntro: 'Fiecare plajă duce la o pagină cu fotografii, GPS, caracteristici și cazări apropiate.',
    generated: 'Generat dinamic',
  },
  sr: {
    villages: '## Sela i mesta (kompletan direktorijum)',
    villagesIntro: 'Jednolinijski rezime za svako selo. URL za fotografije, mapu i obližnje plaže/restorane.',
    beaches: '## Plaže (kompletan direktorijum)',
    beachesIntro: 'Svaka plaža vodi do stranice sa fotografijama, GPS, karakteristikama i obližnjim smeštajem.',
    generated: 'Dinamički generisano',
  },
};

// Restaurant + activity section headings. Only el/en are indexed locales, so
// these two cover the cited surface; other locales fall back to en.
const EXTRA_HEADINGS: Record<string, { restaurants: string; restaurantsIntro: string; activities: string; activitiesIntro: string }> = {
  el: {
    restaurants: '## Εστιατόρια & ταβέρνες (πλήρης κατάλογος)',
    restaurantsIntro: 'Ανά περιοχή. Κάθε εστιατόριο οδηγεί σε σελίδα με κουζίνα, τιμές, ώρες, τηλέφωνο & κριτικές.',
    activities: '## Δραστηριότητες & αξιοθέατα (πλήρης κατάλογος)',
    activitiesIntro: 'Ανά περιοχή. Κάθε δραστηριότητα οδηγεί σε σελίδα με τιμές, διάρκεια & πληροφορίες.',
  },
  en: {
    restaurants: '## Restaurants & tavernas (full directory)',
    restaurantsIntro: 'Grouped by area. Each restaurant links to a page with cuisine, prices, hours, phone & reviews.',
    activities: '## Activities & attractions (full directory)',
    activitiesIntro: 'Grouped by area. Each activity links to a page with prices, duration & details.',
  },
};

/** Strip markdown/html and collapse whitespace; first ~180 chars with sentence boundary. */
function summarize(text: string, max = 180): string {
  if (!text) return '';
  const clean = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_`>\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastDot = cut.lastIndexOf('.');
  return (lastDot > max * 0.6 ? cut.slice(0, lastDot + 1) : cut + '…').trim();
}

/** Locale-aware string picker with fallback chain. */
function pick(map: Record<string, string> | undefined, locale: string, fallback = ''): string {
  if (!map) return fallback;
  return map[locale] || map.en || map.el || Object.values(map).find(Boolean) || fallback;
}

export async function generateLlmsTxt(locale: string): Promise<string> {
  const [villages, beaches, restaurants, activities] = await Promise.all([
    getVillagesList(null).catch(() => [] as VillageLite[]),
    getBeaches().catch(() => [] as Beach[]),
    getRestaurants().catch(() => [] as Restaurant[]),
    getActivities().catch(() => [] as Activity[]),
  ]);

  const prefix = urlPrefix(locale);
  const areaLabel = AREA_LABEL_BY_LOCALE[locale] || AREA_LABEL_BY_LOCALE.en;
  const h = HEADINGS[locale] || HEADINGS.en;
  const hx = EXTRA_HEADINGS[locale] || EXTRA_HEADINGS.en;
  const sections: string[] = [PREAMBLE];

  // ─── Villages section ─────────────────────────────────────────
  if (villages.length > 0) {
    const byArea: Record<string, VillageLite[]> = {};
    for (const v of villages) {
      const bucket = (byArea[v.area] = byArea[v.area] || []);
      bucket.push(v);
    }
    sections.push(`${h.villages}\n`);
    sections.push(`${h.villagesIntro}\n`);
    for (const areaSlug of ['kassandra', 'sithonia', 'athos', 'mainland'] as const) {
      const list = byArea[areaSlug];
      if (!list || list.length === 0) continue;
      sections.push(`### ${areaLabel[areaSlug]}\n`);
      for (const v of list) {
        const name = pick(v.name, locale, v.slug);
        const desc = summarize(pick(v.description, locale), 160);
        const url = `${ORIGIN}${prefix}/places/${v.slug}`;
        sections.push(`- [${name}](${url})${desc ? ` — ${desc}` : ''}`);
      }
      sections.push('');
    }
  }

  // ─── Beaches section ──────────────────────────────────────────
  if (beaches.length > 0) {
    const byArea: Record<string, Beach[]> = {};
    for (const b of beaches) {
      const bucket = (byArea[b.area] = byArea[b.area] || []);
      bucket.push(b);
    }
    sections.push(`${h.beaches}\n`);
    sections.push(`${h.beachesIntro}\n`);
    for (const areaSlug of ['kassandra', 'sithonia', 'athos', 'mainland'] as const) {
      const list = byArea[areaSlug];
      if (!list || list.length === 0) continue;
      sections.push(`### ${areaLabel[areaSlug]}\n`);
      for (const b of list) {
        const name = pick(b.name, locale, b.slug);
        const features = (b.features || []).slice(0, 5).join(', ');
        const url = `${ORIGIN}${prefix}/beaches/${b.slug}`;
        const rating = b.rating > 0 && b.reviews_count > 0
          ? ` · ★ ${b.rating.toFixed(1)} (${b.reviews_count})`
          : '';
        sections.push(
          `- [${name}](${url})${features ? ` — ${features}` : ''}${b.location_name ? ` · ${b.location_name}` : ''}${rating}`,
        );
      }
      sections.push('');
    }
  }

  // ─── Restaurants section ──────────────────────────────────────
  if (restaurants.length > 0) {
    const byArea: Record<string, Restaurant[]> = {};
    for (const r of restaurants) {
      const bucket = (byArea[r.area] = byArea[r.area] || []);
      bucket.push(r);
    }
    sections.push(`${hx.restaurants}\n`);
    sections.push(`${hx.restaurantsIntro}\n`);
    for (const areaSlug of ['kassandra', 'sithonia', 'athos', 'mainland'] as const) {
      const list = byArea[areaSlug];
      if (!list || list.length === 0) continue;
      sections.push(`### ${areaLabel[areaSlug]}\n`);
      for (const r of list) {
        const name = pick(r.name, locale, r.slug);
        const cuisine = (r.cuisine || []).slice(0, 3).join(', ');
        const url = `${ORIGIN}${prefix}/restaurants/${r.slug}`;
        const rating = r.rating > 0 && r.reviews_count > 0
          ? ` · ★ ${r.rating.toFixed(1)} (${r.reviews_count})`
          : '';
        sections.push(
          `- [${name}](${url})${cuisine ? ` — ${cuisine}` : ''}${r.location_name ? ` · ${r.location_name}` : ''}${rating}`,
        );
      }
      sections.push('');
    }
  }

  // ─── Activities section ───────────────────────────────────────
  if (activities.length > 0) {
    const byArea: Record<string, Activity[]> = {};
    for (const a of activities) {
      const bucket = (byArea[a.area] = byArea[a.area] || []);
      bucket.push(a);
    }
    sections.push(`${hx.activities}\n`);
    sections.push(`${hx.activitiesIntro}\n`);
    for (const areaSlug of ['kassandra', 'sithonia', 'athos', 'mainland'] as const) {
      const list = byArea[areaSlug];
      if (!list || list.length === 0) continue;
      sections.push(`### ${areaLabel[areaSlug]}\n`);
      for (const a of list) {
        const name = pick(a.name, locale, a.slug);
        const url = `${ORIGIN}${prefix}/activities/${a.slug}`;
        const meta = [a.category, a.duration].filter(Boolean).join(' · ');
        const rating = a.rating > 0 && a.reviews_count > 0
          ? ` · ★ ${a.rating.toFixed(1)} (${a.reviews_count})`
          : '';
        sections.push(
          `- [${name}](${url})${meta ? ` — ${meta}` : ''}${a.location_name ? ` · ${a.location_name}` : ''}${rating}`,
        );
      }
      sections.push('');
    }
  }

  sections.push(
    `\n---\n${h.generated}: ${new Date().toISOString().slice(0, 10)}. Source: chalkidikihub.gr DB.\n`,
  );

  return sections.join('\n');
}
