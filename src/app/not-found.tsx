import { headers } from 'next/headers';
import Link from 'next/link';

const translations: Record<string, {
  subtitle: string; hint: string;
  home: string; listings: string; beaches: string; restaurants: string; activities: string; blog: string; contact: string;
}> = {
  el: { subtitle: 'Η ομάδα μας απολαμβάνει τη θάλασσα αυτή τη στιγμή...', hint: 'Μην χάνεις χρόνο — βρες ό,τι χρειάζεσαι:', home: 'Αρχική', listings: 'Καταλύματα', beaches: 'Παραλίες', restaurants: 'Εστιατόρια', activities: 'Αξιοθέατα', blog: 'Blog', contact: 'Επικοινωνία' },
  en: { subtitle: 'Our team is enjoying the sea right now...', hint: "Don't waste time — find what you need:", home: 'Home', listings: 'Rentals', beaches: 'Beaches', restaurants: 'Restaurants', activities: 'Activities', blog: 'Blog', contact: 'Contact' },
  de: { subtitle: 'Unser Team genießt gerade das Meer...', hint: 'Keine Zeit verlieren — finde was du brauchst:', home: 'Startseite', listings: 'Unterkünfte', beaches: 'Strände', restaurants: 'Restaurants', activities: 'Aktivitäten', blog: 'Blog', contact: 'Kontakt' },
  bg: { subtitle: 'Екипът ни се наслаждава на морето...', hint: 'Не губете време — намерете каквото ви трябва:', home: 'Начало', listings: 'Настаняване', beaches: 'Плажове', restaurants: 'Ресторанти', activities: 'Дейности', blog: 'Блог', contact: 'Контакт' },
  ru: { subtitle: 'Наша команда сейчас наслаждается морем...', hint: 'Не теряйте время — найдите то, что нужно:', home: 'Главная', listings: 'Жильё', beaches: 'Пляжи', restaurants: 'Рестораны', activities: 'Развлечения', blog: 'Блог', contact: 'Контакты' },
  ro: { subtitle: 'Echipa noastră se bucură de mare acum...', hint: 'Nu pierde timpul — găsește ce ai nevoie:', home: 'Acasă', listings: 'Cazare', beaches: 'Plaje', restaurants: 'Restaurante', activities: 'Activități', blog: 'Blog', contact: 'Contact' },
  sr: { subtitle: 'Naš tim trenutno uživa u moru...', hint: 'Ne gubite vreme — pronađite šta vam treba:', home: 'Početna', listings: 'Smeštaj', beaches: 'Plaže', restaurants: 'Restorani', activities: 'Aktivnosti', blog: 'Blog', contact: 'Kontakt' },
};

const SUPPORTED = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'];

function detectLocale(acceptLang: string | null): string {
  if (!acceptLang) return 'el';
  // Parse Accept-Language header: "en-US,en;q=0.9,el;q=0.8" → ['en', 'el']
  const langs = acceptLang
    .split(',')
    .map((part) => part.trim().split(';')[0].split('-')[0].toLowerCase())
    .filter((l) => SUPPORTED.includes(l));
  return langs[0] || 'el';
}

export default async function NotFound() {
  const hdrs = await headers();
  const locale = detectLocale(hdrs.get('accept-language'));
  const t = translations[locale] || translations.el;

  const btnStyle = { padding: '12px 20px', background: '#0284c7', color: 'white', fontWeight: 500, borderRadius: '12px', textDecoration: 'none', fontSize: '14px' } as const;
  const outlineStyle = { ...btnStyle, background: 'transparent', border: '2px solid #0284c7', color: '#0284c7' } as const;

  return (
    <html lang={locale}>
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#f9fafb' }}>
          <div style={{ textAlign: 'center', maxWidth: '550px' }}>
            <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏖️</div>
            <h1 style={{ fontSize: '72px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px' }}>404</h1>
            <p style={{ fontSize: '22px', fontWeight: 600, color: '#374151', marginBottom: '12px', lineHeight: 1.4 }}>
              {t.subtitle}
            </p>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '32px' }}>
              {t.hint}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={`/${locale}`} style={btnStyle}>🏠 {t.home}</Link>
              <Link href={`/${locale}/listings`} style={btnStyle}>🏡 {t.listings}</Link>
              <Link href={`/${locale}/beaches`} style={btnStyle}>🏖️ {t.beaches}</Link>
              <Link href={`/${locale}/restaurants`} style={btnStyle}>🍽️ {t.restaurants}</Link>
              <Link href={`/${locale}/activities`} style={btnStyle}>🏛️ {t.activities}</Link>
              <Link href={`/${locale}/blog`} style={btnStyle}>📝 {t.blog}</Link>
              <Link href={`/${locale}/contact`} style={outlineStyle}>📧 {t.contact}</Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
