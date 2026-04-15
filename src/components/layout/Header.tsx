'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserMenu } from './UserMenu';
import { FavoritesCounter } from './FavoritesCounter';
import { useState, useRef, useEffect } from 'react';
import { BrandIcon } from '@/components/ui/BrandLogo';
import { Menu, X, ChevronDown, MapPin, Building } from 'lucide-react';

interface Village { slug: string; name: Record<string, string>; area: string }

function MegaMenuAreas({ onClose, villages }: { onClose: () => void; villages: Village[] }) {
  const locale = useLocale();
  const tAreas = useTranslations('areas');

  const areas = [
    { slug: 'kassandra', label: tAreas('kassandra.name'), color: 'bg-blue-500' },
    { slug: 'sithonia', label: tAreas('sithonia.name'), color: 'bg-green-500' },
    { slug: 'athos', label: tAreas('athos.name'), color: 'bg-amber-500' },
    { slug: 'mainland', label: tAreas('mainlandHalkidiki.name'), color: 'bg-gray-400' },
  ];

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-5"
      onMouseLeave={onClose}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-4 gap-5">
          {areas.map(area => {
            const areaVillages = villages.filter(v => v.area === area.slug);
            return (
              <div key={area.slug}>
                <Link href={`/areas/${area.slug}`} onClick={onClose}
                  className="flex items-center gap-2 mb-3 group">
                  <div className={`w-2 h-2 rounded-full ${area.color}`} />
                  <span className="text-sm font-bold text-gray-900 group-hover:text-primary-600">{area.label}</span>
                </Link>
                <div className="flex flex-wrap gap-1.5">
                  {areaVillages.slice(0, 8).map(v => (
                    <Link key={v.slug} href={`/places/${v.slug}`} onClick={onClose}
                      className="text-[11px] px-2 py-1 bg-gray-50 border border-gray-200 rounded-full text-gray-600 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-colors">
                      {v.name[locale] || v.name.el}
                    </Link>
                  ))}
                  {areaVillages.length > 8 && (
                    <Link href={`/areas/${area.slug}`} onClick={onClose}
                      className="text-[11px] px-2 py-1 text-primary-600 hover:underline">
                      +{areaVillages.length - 8}
                    </Link>
                  )}
                </div>
                {area.slug === 'athos' && (
                  <Link href="/mount-athos" onClick={onClose}
                    className="flex items-center gap-2 mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors">
                    <span className="text-sm">⛪</span>
                    <div>
                      <div className="text-[11px] font-semibold text-amber-800">{locale === 'el' ? 'Οδηγός Αγίου Όρους' : locale === 'sr' ? 'Vodič Sveta Gora' : 'Mount Athos Guide'}</div>
                      <div className="text-[9px] text-amber-600">20 {locale === 'el' ? 'Μονές' : locale === 'sr' ? 'Manastira' : 'Monasteries'}</div>
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
          <Link href="/areas" onClick={onClose} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
            📍 {locale === 'el' ? 'Όλες οι περιοχές' : 'All areas'}
          </Link>
          <Link href="/beaches" onClick={onClose} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
            🏖️ {locale === 'el' ? 'Παραλίες' : locale === 'sr' ? 'Plaže' : 'Beaches'}
          </Link>
          <Link href="/activities" onClick={onClose} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
            🏛️ {locale === 'el' ? 'Δραστηριότητες' : locale === 'sr' ? 'Aktivnosti' : 'Activities'}
          </Link>
          <Link href="/map" onClick={onClose} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
            🗺️ {locale === 'el' ? 'Χάρτης' : locale === 'sr' ? 'Mapa' : 'Map'}
          </Link>
          <Link href="/ev-chargers" onClick={onClose} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
            ⚡ EV
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [villages, setVillages] = useState<Village[]>([]);
  const villagesFetched = useRef(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<NodeJS.Timeout | null>(null);

  function handleMegaEnter() {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
    // Lazy-load villages on first open only
    if (!villagesFetched.current) {
      villagesFetched.current = true;
      fetch('/api/villages')
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setVillages(data); })
        .catch(() => {});
    }
  }
  function handleMegaLeave() {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[1000] bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm shadow-gray-900/[0.03]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BrandIcon size={32} />
            <span className="font-bold text-xl text-gray-900">
              Chalkidiki<span className="text-primary-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors">
              {t('home')}
            </Link>
            <Link href="/listings" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors">
              {t('listings')}
            </Link>

            {/* Mega Menu trigger */}
            <div ref={megaRef} onMouseEnter={handleMegaEnter} onMouseLeave={handleMegaLeave}>
              <button
                onClick={() => setMegaOpen(!megaOpen)}
                aria-expanded={megaOpen}
                aria-label="Areas menu"
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${megaOpen ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'}`}
              >
                {t('areas')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <Link href="/restaurants" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors">
              {t('restaurants')}
            </Link>
            <Link href="/blog" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors">
              {t('blog')}
            </Link>

            {/* Sales button */}
            <Link href="/sales"
              className="flex items-center gap-1.5 ml-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Building className="w-3.5 h-3.5" />
              {t('sales')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <FavoritesCounter />
            <LanguageSwitcher />
            <div className="hidden md:flex items-center gap-2">
              <UserMenu />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mega Menu - Areas (desktop only, mobile has inline areas) */}
        {megaOpen && (
          <div className="hidden md:block" ref={megaRef} onMouseEnter={handleMegaEnter} onMouseLeave={handleMegaLeave}>
            <MegaMenuAreas onClose={() => setMegaOpen(false)} villages={villages} />
          </div>
        )}

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-1">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>{t('home')}</Link>
              <Link href="/listings" className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>{t('listings')}</Link>

              <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">{t('areas')}</div>
              {([
                { slug: 'kassandra', icon: '🔵', el: 'Κασσάνδρα', de: 'Kassandra', bg: 'Касандра', ru: 'Кассандра', ro: 'Kassandra', sr: 'Kasandra', en: 'Kassandra' },
                { slug: 'sithonia', icon: '🟢', el: 'Σιθωνία', de: 'Sithonia', bg: 'Ситония', ru: 'Ситония', ro: 'Sithonia', sr: 'Sitonija', en: 'Sithonia' },
                { slug: 'athos', icon: '🟡', el: 'Άθως', de: 'Athos', bg: 'Атос', ru: 'Афон', ro: 'Athos', sr: 'Atos', en: 'Athos' },
                { slug: 'mainland', icon: '⚪', el: 'Ενδοχώρα', de: 'Hinterland', bg: 'Вътрешност', ru: 'Материк', ro: 'Interior', sr: 'Unutrašnjost', en: 'Mainland' },
              ] as const).map(area => (
                <Link key={area.slug} href={`/areas/${area.slug}`} className="px-6 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}>
                  {area.icon} {area[locale as keyof typeof area] || area.en}
                </Link>
              ))}
              <Link href="/beaches" className="px-6 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>🏖️ {t('beaches')}</Link>
              <Link href="/activities" className="px-6 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>🏛️ {t('activities')}</Link>

              <Link href="/restaurants" className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>{t('restaurants')}</Link>
              <Link href="/blog" className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>{t('blog')}</Link>

              <Link href="/sales" className="mx-4 mt-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg text-center flex items-center justify-center gap-2"
                onClick={() => setMobileMenuOpen(false)}>
                <Building className="w-4 h-4" /> {t('sales')}
              </Link>

              <hr className="my-2" />
              <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>{t('login')}</Link>
              <Link href="/auth/register" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg text-center"
                onClick={() => setMobileMenuOpen(false)}>{t('register')}</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
