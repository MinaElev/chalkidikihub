import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta, generateItemListLD, localeUrl } from '@/lib/seo';
import { getBlogArticles } from '@/lib/data';
import { JsonLd } from '@/components/ui/JsonLd';
import PageClient from './_client';

export const revalidate = 2592000; // ISR: 30d - on-demand revalidation from admin saves keeps content fresh

const titles: Record<string, string> = {
  el: 'Blog Χαλκιδική',
  en: 'Halkidiki Travel Blog',
  de: 'Chalkidiki Reiseblog',
  bg: 'Блог Халкидики',
  ru: 'Блог Халкидики',
  ro: 'Blog Halkidiki',
  sr: 'Blog Halkidiki',
};

const descriptions: Record<string, string> = {
  el: 'Οδηγοί, συμβουλές και άρθρα για τη Χαλκιδική. Παραλίες, φαγητό, αξιοθέατα και ταξιδιωτικές συμβουλές.',
  en: 'Guides, tips and articles about Halkidiki. Beaches, food, attractions and travel advice.',
  de: 'Reiseführer, Tipps und Artikel über Chalkidiki. Strände, Essen und Sehenswürdigkeiten.',
  bg: 'Пътеводители, съвети и статии за Халкидики. Плажове, храна и забележителности.',
  ru: 'Путеводители, советы и статьи о Халкидики. Пляжи, еда и достопримечательности.',
  ro: 'Ghiduri, sfaturi și articole despre Halkidiki. Plaje, mâncare și atracții turistice.',
  sr: 'Vodiči, saveti i članci o Halkidikiju. Plaže, hrana i znamenitosti.',
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'blog', locale, ogType: 'blog' });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const articles = await getBlogArticles();
  const itemListLD = generateItemListLD(
    titles[locale] || titles.en,
    articles.map((a) => ({
      name: a.title[locale] || a.title.el || a.title.en,
      url: localeUrl(locale, `blog/${a.slug}`),
    })),
  );
  return (
    <>
      <JsonLd data={itemListLD as Record<string, unknown>} />
      <PageClient initialData={articles} />
    </>
  );
}
