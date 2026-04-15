import type { Metadata } from 'next';
import { collectionMeta } from '@/lib/seo';

const titles: Record<string, string> = {
  el: 'Φαγητό & Ποτό Χαλκιδικής',
  en: 'Halkidiki Restaurants & Dining',
  de: 'Restaurants & Gastronomie in Chalkidiki',
  bg: 'Ресторанти и заведения в Халкидики',
  ru: 'Рестораны и кафе Халкидики',
  ro: 'Restaurante și gastronomie în Halkidiki',
  sr: 'Restorani i gastronomija Halkidikija',
};

const descriptions: Record<string, string> = {
  el: 'Εστιατόρια, ταβέρνες, καφετέριες και beach bars στη Χαλκιδική — ελληνική κουζίνα, θαλασσινά και τοπικές γεύσεις σε Κασσάνδρα, Σιθωνία και Άθως.',
  en: 'Restaurants, tavernas, cafés and beach bars in Halkidiki — Greek cuisine, seafood and local flavors in Kassandra, Sithonia and Athos.',
  de: 'Restaurants, Tavernen, Cafés und Strandbars in Chalkidiki — griechische Küche, Meeresfrüchte und lokale Aromen in Kassandra, Sithonia und Athos.',
  bg: 'Ресторанти, таверни, кафенета и плажни барове в Халкидики — гръцка кухня, морски деликатеси и местни вкусове в Касандра, Ситония и Атон.',
  ru: 'Рестораны, таверны, кафе и пляжные бары на Халкидики — греческая кухня, морепродукты и местные вкусы на Кассандре, Ситонии и Афоне.',
  ro: 'Restaurante, taverne, cafenele și baruri de plajă în Halkidiki — bucătărie grecească, fructe de mare și arome locale în Kassandra, Sithonia și Athos.',
  sr: 'Restorani, taverne, kafići i beach barovi na Halkidikiju — grčka kuhinja, morski plodovi i lokalni ukusi na Kasandri, Sitoniji i Atosu.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'restaurants', locale, ogType: 'restaurant' });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
