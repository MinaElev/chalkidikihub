import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

const TYPE_META: Record<string, Record<string, { title: string; desc: string }>> = {
  'with-pool': {
    el: { title: 'Καταλύματα με Πισίνα | Χαλκιδική', desc: 'Ενοικιαζόμενα δωμάτια και βίλες με πισίνα στη Χαλκιδική.' },
    en: { title: 'Accommodation with Pool | Halkidiki', desc: 'Rental rooms and villas with pool in Halkidiki.' },
    de: { title: 'Unterkünfte mit Pool | Chalkidiki', desc: 'Ferienwohnungen und Villen mit Pool in Chalkidiki.' },
    bg: { title: 'Настаняване с басейн | Халкидики', desc: 'Стаи под наем и вили с басейн в Халкидики.' },
    ru: { title: 'Жильё с бассейном | Халкидики', desc: 'Апартаменты и виллы с бассейном в Халкидики.' },
    ro: { title: 'Cazare cu piscină | Halkidiki', desc: 'Camere și vile cu piscină în Halkidiki.' },
  },
  'sea-view': {
    el: { title: 'Καταλύματα με Θέα Θάλασσα | Χαλκιδική', desc: 'Καταλύματα με εκπληκτική θέα στη θάλασσα στη Χαλκιδική.' },
    en: { title: 'Sea View Accommodation | Halkidiki', desc: 'Accommodation with stunning sea views in Halkidiki.' },
    de: { title: 'Unterkünfte mit Meerblick | Chalkidiki', desc: 'Unterkünfte mit atemberaubendem Meerblick.' },
    bg: { title: 'Настаняване с морска гледка | Халкидики', desc: 'Настаняване с невероятна морска гледка.' },
    ru: { title: 'Жильё с видом на море | Халкидики', desc: 'Жильё с потрясающим видом на море.' },
    ro: { title: 'Cazare cu vedere la mare | Halkidiki', desc: 'Cazare cu priveliște uimitoare la mare.' },
  },
  'pet-friendly': {
    el: { title: 'Pet-Friendly Καταλύματα | Χαλκιδική', desc: 'Καταλύματα φιλικά προς κατοικίδια στη Χαλκιδική.' },
    en: { title: 'Pet-Friendly Accommodation | Halkidiki', desc: 'Pet-friendly accommodation in Halkidiki.' },
    de: { title: 'Haustierfreundliche Unterkünfte | Chalkidiki', desc: 'Haustierfreundliche Ferienwohnungen in Chalkidiki.' },
    bg: { title: 'Настаняване за домашни любимци | Халкидики', desc: 'Настаняване, приятелско към домашни любимци.' },
    ru: { title: 'Жильё для питомцев | Халкидики', desc: 'Жильё, дружелюбное к домашним животным.' },
    ro: { title: 'Cazare pet-friendly | Halkidiki', desc: 'Cazare prietenoasă cu animalele de companie.' },
  },
  'family': {
    el: { title: 'Οικογενειακά Καταλύματα | Χαλκιδική', desc: 'Ευρύχωρα καταλύματα κατάλληλα για οικογένειες στη Χαλκιδική.' },
    en: { title: 'Family Accommodation | Halkidiki', desc: 'Spacious family-friendly accommodation in Halkidiki.' },
    de: { title: 'Familienunterkünfte | Chalkidiki', desc: 'Geräumige familienfreundliche Unterkünfte.' },
    bg: { title: 'Семейно настаняване | Халкидики', desc: 'Просторно семейно настаняване в Халкидики.' },
    ru: { title: 'Семейное жильё | Халкидики', desc: 'Просторное семейное жильё в Халкидики.' },
    ro: { title: 'Cazare pentru familii | Halkidiki', desc: 'Cazare spațioasă pentru familii în Halkidiki.' },
  },
  'budget': {
    el: { title: 'Οικονομικά Καταλύματα | Χαλκιδική', desc: 'Φτηνά ενοικιαζόμενα δωμάτια στη Χαλκιδική — κάτω από 50€/νύχτα.' },
    en: { title: 'Budget Accommodation | Halkidiki', desc: 'Cheap rental rooms in Halkidiki — under €50/night.' },
    de: { title: 'Günstige Unterkünfte | Chalkidiki', desc: 'Günstige Zimmer in Chalkidiki — unter 50€/Nacht.' },
    bg: { title: 'Евтино настаняване | Халкидики', desc: 'Евтини стаи под наем — под 50€/нощувка.' },
    ru: { title: 'Бюджетное жильё | Халкидики', desc: 'Дешёвые комнаты — до 50€/ночь.' },
    ro: { title: 'Cazare ieftină | Halkidiki', desc: 'Camere ieftine — sub 50€/noapte.' },
  },
  'luxury': {
    el: { title: 'Πολυτελή Καταλύματα | Χαλκιδική', desc: 'Πολυτελείς βίλες και σουίτες στη Χαλκιδική.' },
    en: { title: 'Luxury Accommodation | Halkidiki', desc: 'Luxury villas and suites in Halkidiki.' },
    de: { title: 'Luxusunterkünfte | Chalkidiki', desc: 'Luxusvillen und Suiten in Chalkidiki.' },
    bg: { title: 'Луксозно настаняване | Халкидики', desc: 'Луксозни вили и апартаменти в Халкидики.' },
    ru: { title: 'Люкс жильё | Халкидики', desc: 'Роскошные виллы и сьюты в Халкидики.' },
    ro: { title: 'Cazare de lux | Halkidiki', desc: 'Vile și suite de lux în Halkidiki.' },
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; type: string }> }): Promise<Metadata> {
  const { locale, type } = await params;
  const meta = TYPE_META[type]?.[locale] || TYPE_META[type]?.en;
  if (!meta) return { title: 'Listings | ChalkidikiHub' };
  return {
    title: meta.title, description: meta.desc,
    alternates: {
      canonical: localeUrl(locale, `listings/type/${type}`),
      languages: Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `listings/type/${type}`)])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
