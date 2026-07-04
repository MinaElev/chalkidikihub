'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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

// Client-side locale detection. The root not-found lives outside the [locale]
// segment, so it has no locale param. We must NOT read headers() here — doing so
// flips every ISR route that renders this 404 boundary from static to dynamic at
// runtime and 500s the page. Detecting on the client (URL path first, then
// navigator.language) keeps this component fully static and safe for ISR.
function detectLocale(): string {
  if (typeof window === 'undefined') return 'el';
  const seg = window.location.pathname.split('/')[1]?.toLowerCase();
  if (seg && SUPPORTED.includes(seg)) return seg;
  const nav = navigator.language?.split('-')[0]?.toLowerCase();
  if (nav && SUPPORTED.includes(nav)) return nav;
  return 'el';
}

export default function NotFoundContent() {
  const [locale, setLocale] = useState('el');

  useEffect(() => {
    const l = detectLocale();
    setLocale(l);
    document.documentElement.lang = l;
  }, []);

  const t = translations[locale] || translations.el;

  const btnStyle = { padding: '12px 20px', background: '#0284c7', color: 'white', fontWeight: 500, borderRadius: '12px', textDecoration: 'none', fontSize: '14px' } as const;
  const outlineStyle = { ...btnStyle, background: 'transparent', border: '2px solid #0284c7', color: '#0284c7' } as const;

  return (
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
  );
}
