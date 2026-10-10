import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta } from '@/lib/seo/compat';
import TripPlannerClient from './_client';

export const dynamic = 'force-static';

const titles: Record<string, string> = {
  el: 'AI Trip Planner Χαλκιδική — Δωρεάν Πρόγραμμα Ταξιδιού',
  en: 'AI Trip Planner Halkidiki — Free Day-by-Day Itinerary',
  de: 'KI Reiseplaner Chalkidiki — Kostenloser Reiseplan',
  bg: 'AI Планер Халкидики — Безплатен маршрут',
  ru: 'AI-планировщик Халкидики — Бесплатный маршрут',
  ro: 'AI Trip Planner Halkidiki — Itinerariu gratuit',
  sr: 'AI Planer putovanja Halkidiki — Besplatan plan',
};
const descriptions: Record<string, string> = {
  el: 'Φτιάξε δωρεάν πρόγραμμα ταξιδιού για τη Χαλκιδική με AI. Ημέρα-ημέρα με πραγματικές παραλίες, εστιατόρια και αξιοθέατα.',
  en: 'Build a free AI trip plan for Halkidiki. Day-by-day itinerary using real beaches, restaurants and attractions.',
  de: 'Erstellen Sie einen kostenlosen KI-Reiseplan für Chalkidiki mit echten Stränden, Restaurants und Sehenswürdigkeiten.',
  bg: 'Създайте безплатен AI маршрут за Халкидики с реални плажове, ресторанти и забележителности.',
  ru: 'Составьте бесплатный AI-маршрут по Халкидики с реальными пляжами, ресторанами и достопримечательностями.',
  ro: 'Creați un itinerariu AI gratuit pentru Halkidiki cu plaje, restaurante și atracții reale.',
  sr: 'Napravite besplatan AI plan putovanja za Halkidiki sa stvarnim plažama, restoranima i atrakcijama.',
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'trip-planner', locale, ogType: 'activity' });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TripPlannerClient />;
}
