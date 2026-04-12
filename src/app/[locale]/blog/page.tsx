import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta } from '@/lib/seo';
import PageClient from './_client';

const titles: Record<string, string> = {
  el: 'Blog Χαλκιδική | ChalkidikiHub',
  en: 'Halkidiki Travel Blog | ChalkidikiHub',
  de: 'Chalkidiki Reiseblog | ChalkidikiHub',
  bg: 'Блог Халкидики | ChalkidikiHub',
  ru: 'Блог Халкидики | ChalkidikiHub',
  ro: 'Blog Halkidiki | ChalkidikiHub',
  sr: 'Blog Halkidiki | ChalkidikiHub',
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
  return <PageClient />;
}
