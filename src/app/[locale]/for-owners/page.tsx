'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Globe, Search, Sparkles, Users, CheckCircle, ArrowRight, Zap, ImageIcon } from 'lucide-react';

type ContentType = {
  hero: { title: string; subtitle: string; cta: string; cta2: string };
  featuresTitle: string;
  features: { icon: typeof Globe; title: string; desc: string }[];
  howItWorks: { title: string; steps: { num: string; title: string; desc: string }[] };
  free: { title: string; answer: string; desc: string };
  whyUs: { title: string; items: string[] };
  cta: { title: string; subtitle: string; button: string };
};

const content: Record<string, ContentType> = {
  el: {
    hero: {
      title: 'Προβάλετε το κατάλυμά σας σε 7 γλώσσες. Δωρεάν.',
      subtitle: 'Το ChalkidikiHub είναι η μοναδική πλατφόρμα της Χαλκιδικής που προβάλλει αυτόματα το κατάλυμά σας σε Ελληνικά, Αγγλικά, Γερμανικά, Βουλγάρικα, Ρωσικά, Ρουμάνικα και Σέρβικα.',
      cta: 'Δωρεάν Εγγραφή',
      cta2: 'Δείτε πώς λειτουργεί',
    },
    featuresTitle: 'Τι κερδίζετε με το ChalkidikiHub',
    features: [
      {
        icon: Globe,
        title: '7 Γλώσσες Αυτόματα',
        desc: 'Γράφετε μόνο στα Ελληνικά. Το AI μεταφράζει αυτόματα σε 6 ακόμα γλώσσες. Φτάνετε τουρίστες από Γερμανία, Βουλγαρία, Ρωσία, Ρουμανία, Σερβία.',
      },
      {
        icon: Search,
        title: 'SEO στη Google',
        desc: 'Κάθε κατάλυμα βελτιστοποιείται αυτόματα για τη Google σε κάθε γλώσσα. Meta titles, descriptions, structured data.',
      },
      {
        icon: Sparkles,
        title: 'AI-Powered',
        desc: 'Τεχνητή νοημοσύνη δημιουργεί SEO tags, μεταφράσεις και βελτιστοποιεί τις φωτογραφίες σας αυτόματα.',
      },
      {
        icon: Users,
        title: 'Χιλιάδες Επισκέπτες',
        desc: 'Παραλίες, εστιατόρια, αξιοθέατα, blog - το site κρατάει τους επισκέπτες μέσα και τους οδηγεί στο κατάλυμά σας.',
      },
      {
        icon: ImageIcon,
        title: 'Φωτογραφίες & Χάρτης',
        desc: 'Ανεβάστε φωτογραφίες, επιλέξτε τοποθεσία στο χάρτη. Αυτόματη βελτιστοποίηση εικόνων.',
      },
      {
        icon: Zap,
        title: 'Links Κρατήσεων',
        desc: 'Συνδέστε Booking.com, Airbnb, το site σας. Οι επισκέπτες κλείνουν απευθείας.',
      },
    ],
    howItWorks: {
      title: 'Πώς λειτουργεί',
      steps: [
        { num: '1', title: 'Εγγραφή', desc: 'Δημιουργήστε δωρεάν λογαριασμό σε 30 δευτερόλεπτα.' },
        { num: '2', title: 'Καταχώρηση', desc: 'Βάλτε τίτλο, περιγραφή, φωτογραφίες, τιμή. Μόνο στα Ελληνικά.' },
        { num: '3', title: 'AI Μαγεία', desc: 'Το AI μεταφράζει, δημιουργεί SEO, βελτιστοποιεί εικόνες αυτόματα.' },
        { num: '4', title: 'Online!', desc: 'Το κατάλυμά σας εμφανίζεται σε 7 γλώσσες στη Google.' },
      ],
    },
    free: {
      title: 'Πόσο κοστίζει;',
      answer: 'Δωρεάν έως 31/12/2026.',
      desc: 'Οι καταχωρήσεις έως τις 31 Δεκεμβρίου 2026 μένουν δωρεάν για πάντα. Από 1 Ιανουαρίου 2027, οι νέες καταχωρήσεις έχουν ετήσιο πακέτο 90€/έτος (με ΦΠΑ 24%). Πάντα χωρίς προμήθεια στις κρατήσεις σας.',
    },
    whyUs: {
      title: 'Γιατί ChalkidikiHub;',
      items: [
        'Η μόνη πλατφόρμα με 7 γλώσσες',
        'AI-powered SEO & μεταφράσεις',
        'Δωρεάν έως 31/12/2026 (μετά 90€/έτος)',
        'Φτιαγμένο ειδικά για τη Χαλκιδική',
        'Παραλίες, εστιατόρια, blog = πολλοί επισκέπτες',
        'Mobile app (PWA)',
      ],
    },
    cta: {
      title: 'Έτοιμοι;',
      subtitle: 'Καταχωρήστε το κατάλυμά σας σε 2 λεπτά. Δωρεάν.',
      button: 'Δωρεάν Εγγραφή →',
    },
  },
  en: {
    hero: {
      title: 'Promote your property in 7 languages. For free.',
      subtitle: 'ChalkidikiHub is the only Halkidiki platform that automatically promotes your property in Greek, English, German, Bulgarian, Russian, Romanian and Serbian.',
      cta: 'Free Registration',
      cta2: 'See how it works',
    },
    featuresTitle: 'What you get with ChalkidikiHub',
    features: [
      {
        icon: Globe,
        title: '7 Languages Automatically',
        desc: 'Write only in Greek. AI automatically translates to 6 more languages. Reach tourists from Germany, Bulgaria, Russia, Romania, Serbia.',
      },
      {
        icon: Search,
        title: 'Google SEO',
        desc: 'Every property is automatically optimized for Google in each language. Meta titles, descriptions, structured data.',
      },
      {
        icon: Sparkles,
        title: 'AI-Powered',
        desc: 'Artificial intelligence creates SEO tags, translations and optimizes your photos automatically.',
      },
      {
        icon: Users,
        title: 'Thousands of Visitors',
        desc: 'Beaches, restaurants, attractions, blog - the site keeps visitors engaged and leads them to your property.',
      },
      {
        icon: ImageIcon,
        title: 'Photos & Map',
        desc: 'Upload photos, pick location on map. Automatic image optimization.',
      },
      {
        icon: Zap,
        title: 'Booking Links',
        desc: 'Connect Booking.com, Airbnb, your website. Visitors book directly.',
      },
    ],
    howItWorks: {
      title: 'How it works',
      steps: [
        { num: '1', title: 'Register', desc: 'Create a free account in 30 seconds.' },
        { num: '2', title: 'List', desc: 'Add title, description, photos, price. Only in Greek.' },
        { num: '3', title: 'AI Magic', desc: 'AI translates, creates SEO, optimizes images automatically.' },
        { num: '4', title: 'Online!', desc: 'Your property appears in 7 languages on Google.' },
      ],
    },
    free: {
      title: 'How much does it cost?',
      answer: 'Free until Dec 31, 2026.',
      desc: 'Listings created by December 31, 2026 stay free forever. From January 1, 2027, new listings have an annual package of €90/year (incl. 24% VAT). Always zero commission on your bookings.',
    },
    whyUs: {
      title: 'Why ChalkidikiHub?',
      items: [
        'The only platform with 7 languages',
        'AI-powered SEO & translations',
        'Free until Dec 31, 2026 (then €90/yr)',
        'Built specifically for Halkidiki',
        'Beaches, restaurants, blog = many visitors',
        'Mobile app (PWA)',
      ],
    },
    cta: {
      title: 'Ready?',
      subtitle: 'List your property in 2 minutes. Free.',
      button: 'Free Registration →',
    },
  },
  de: {
    hero: {
      title: 'Bewerben Sie Ihre Unterkunft in 7 Sprachen. Kostenlos.',
      subtitle: 'ChalkidikiHub ist die einzige Chalkidiki-Plattform, die Ihre Unterkunft automatisch auf Griechisch, Englisch, Deutsch, Bulgarisch, Russisch, Rumänisch und Serbisch bewirbt.',
      cta: 'Kostenlos registrieren',
      cta2: 'So funktioniert es',
    },
    featuresTitle: 'Was Sie mit ChalkidikiHub bekommen',
    features: [
      {
        icon: Globe,
        title: '7 Sprachen automatisch',
        desc: 'Schreiben Sie nur auf Griechisch. KI übersetzt automatisch in 6 weitere Sprachen. Erreichen Sie Touristen aus Deutschland, Bulgarien, Russland, Rumänien, Serbien.',
      },
      {
        icon: Search,
        title: 'Google SEO',
        desc: 'Jede Unterkunft wird automatisch für Google in jeder Sprache optimiert. Meta-Titel, Beschreibungen, strukturierte Daten.',
      },
      {
        icon: Sparkles,
        title: 'KI-gestützt',
        desc: 'Künstliche Intelligenz erstellt SEO-Tags, Übersetzungen und optimiert Ihre Fotos automatisch.',
      },
      {
        icon: Users,
        title: 'Tausende Besucher',
        desc: 'Strände, Restaurants, Sehenswürdigkeiten, Blog - die Website bindet Besucher und führt sie zu Ihrer Unterkunft.',
      },
      {
        icon: ImageIcon,
        title: 'Fotos & Karte',
        desc: 'Laden Sie Fotos hoch, wählen Sie den Standort auf der Karte. Automatische Bildoptimierung.',
      },
      {
        icon: Zap,
        title: 'Buchungslinks',
        desc: 'Verknüpfen Sie Booking.com, Airbnb, Ihre Website. Besucher buchen direkt.',
      },
    ],
    howItWorks: {
      title: 'So funktioniert es',
      steps: [
        { num: '1', title: 'Registrieren', desc: 'Erstellen Sie in 30 Sekunden ein kostenloses Konto.' },
        { num: '2', title: 'Eintragen', desc: 'Titel, Beschreibung, Fotos, Preis hinzufügen. Nur auf Griechisch.' },
        { num: '3', title: 'KI-Magie', desc: 'KI übersetzt, erstellt SEO, optimiert Bilder automatisch.' },
        { num: '4', title: 'Online!', desc: 'Ihre Unterkunft erscheint in 7 Sprachen bei Google.' },
      ],
    },
    free: {
      title: 'Was kostet es?',
      answer: 'Kostenlos bis 31.12.2026.',
      desc: 'Inserate, die bis zum 31. Dezember 2026 erstellt werden, bleiben für immer kostenlos. Ab dem 1. Januar 2027 gilt für neue Inserate ein Jahrespaket von 90 €/Jahr (inkl. 24% MwSt.). Immer ohne Buchungsprovision.',
    },
    whyUs: {
      title: 'Warum ChalkidikiHub?',
      items: [
        'Die einzige Plattform mit 7 Sprachen',
        'KI-gestütztes SEO & Übersetzungen',
        'Kostenlos bis 31.12.2026 (danach 90 €/Jahr)',
        'Speziell für Chalkidiki entwickelt',
        'Strände, Restaurants, Blog = viele Besucher',
        'Mobile App (PWA)',
      ],
    },
    cta: {
      title: 'Bereit?',
      subtitle: 'Tragen Sie Ihre Unterkunft in 2 Minuten ein. Kostenlos.',
      button: 'Kostenlos registrieren →',
    },
  },
  bg: {
    hero: {
      title: 'Рекламирайте имота си на 7 езика. Безплатно.',
      subtitle: 'ChalkidikiHub е единствената платформа за Халкидики, която автоматично рекламира имота ви на гръцки, английски, немски, български, руски, румънски и сръбски.',
      cta: 'Безплатна регистрация',
      cta2: 'Вижте как работи',
    },
    featuresTitle: 'Какво получавате с ChalkidikiHub',
    features: [
      {
        icon: Globe,
        title: '7 езика автоматично',
        desc: 'Пишете само на гръцки. AI автоматично превежда на още 6 езика. Достигнете туристи от Германия, България, Русия, Румъния, Сърбия.',
      },
      {
        icon: Search,
        title: 'SEO в Google',
        desc: 'Всеки имот се оптимизира автоматично за Google на всеки език. Мета заглавия, описания, структурирани данни.',
      },
      {
        icon: Sparkles,
        title: 'AI технология',
        desc: 'Изкуственият интелект създава SEO тагове, преводи и оптимизира снимките ви автоматично.',
      },
      {
        icon: Users,
        title: 'Хиляди посетители',
        desc: 'Плажове, ресторанти, забележителности, блог - сайтът задържа посетителите и ги насочва към вашия имот.',
      },
      {
        icon: ImageIcon,
        title: 'Снимки и карта',
        desc: 'Качете снимки, изберете местоположение на картата. Автоматична оптимизация на изображения.',
      },
      {
        icon: Zap,
        title: 'Линкове за резервации',
        desc: 'Свържете Booking.com, Airbnb, вашия сайт. Посетителите резервират директно.',
      },
    ],
    howItWorks: {
      title: 'Как работи',
      steps: [
        { num: '1', title: 'Регистрация', desc: 'Създайте безплатен акаунт за 30 секунди.' },
        { num: '2', title: 'Обява', desc: 'Добавете заглавие, описание, снимки, цена. Само на гръцки.' },
        { num: '3', title: 'AI магия', desc: 'AI превежда, създава SEO, оптимизира изображения автоматично.' },
        { num: '4', title: 'Онлайн!', desc: 'Имотът ви се показва на 7 езика в Google.' },
      ],
    },
    free: {
      title: 'Колко струва?',
      answer: 'Безплатно до 31.12.2026 г.',
      desc: 'Обявите, създадени до 31 декември 2026 г., остават безплатни завинаги. От 1 януари 2027 г. новите обяви имат годишен пакет от 90€/година (вкл. 24% ДДС). Винаги без комисиона за резервациите.',
    },
    whyUs: {
      title: 'Защо ChalkidikiHub?',
      items: [
        'Единствената платформа със 7 езика',
        'AI-базирано SEO и преводи',
        'Безплатно до 31.12.2026 (след това 90€/год.)',
        'Създадено специално за Халкидики',
        'Плажове, ресторанти, блог = много посетители',
        'Мобилно приложение (PWA)',
      ],
    },
    cta: {
      title: 'Готови ли сте?',
      subtitle: 'Регистрирайте имота си за 2 минути. Безплатно.',
      button: 'Безплатна регистрация →',
    },
  },
  ru: {
    hero: {
      title: 'Продвигайте свою недвижимость на 7 языках. Бесплатно.',
      subtitle: 'ChalkidikiHub -- единственная платформа Халкидики, которая автоматически продвигает вашу недвижимость на греческом, английском, немецком, болгарском, русском, румынском и сербском языках.',
      cta: 'Бесплатная регистрация',
      cta2: 'Узнайте, как это работает',
    },
    featuresTitle: 'Что вы получаете с ChalkidikiHub',
    features: [
      {
        icon: Globe,
        title: '7 языков автоматически',
        desc: 'Пишите только на греческом. ИИ автоматически переводит на 6 других языков. Привлекайте туристов из Германии, Болгарии, России, Румынии, Сербии.',
      },
      {
        icon: Search,
        title: 'SEO в Google',
        desc: 'Каждый объект автоматически оптимизируется для Google на каждом языке. Мета-заголовки, описания, структурированные данные.',
      },
      {
        icon: Sparkles,
        title: 'На базе ИИ',
        desc: 'Искусственный интеллект создает SEO-теги, переводы и автоматически оптимизирует ваши фотографии.',
      },
      {
        icon: Users,
        title: 'Тысячи посетителей',
        desc: 'Пляжи, рестораны, достопримечательности, блог -- сайт удерживает посетителей и направляет их к вашему объекту.',
      },
      {
        icon: ImageIcon,
        title: 'Фото и карта',
        desc: 'Загружайте фотографии, выбирайте местоположение на карте. Автоматическая оптимизация изображений.',
      },
      {
        icon: Zap,
        title: 'Ссылки для бронирования',
        desc: 'Подключите Booking.com, Airbnb, ваш сайт. Посетители бронируют напрямую.',
      },
    ],
    howItWorks: {
      title: 'Как это работает',
      steps: [
        { num: '1', title: 'Регистрация', desc: 'Создайте бесплатный аккаунт за 30 секунд.' },
        { num: '2', title: 'Размещение', desc: 'Добавьте название, описание, фотографии, цену. Только на греческом.' },
        { num: '3', title: 'Магия ИИ', desc: 'ИИ переводит, создает SEO, оптимизирует изображения автоматически.' },
        { num: '4', title: 'Онлайн!', desc: 'Ваш объект появляется на 7 языках в Google.' },
      ],
    },
    free: {
      title: 'Сколько это стоит?',
      answer: 'Бесплатно до 31.12.2026.',
      desc: 'Объявления, созданные до 31 декабря 2026 года, остаются бесплатными навсегда. С 1 января 2027 года для новых объявлений действует годовой пакет 90€/год (вкл. НДС 24%). Всегда без комиссии за бронирования.',
    },
    whyUs: {
      title: 'Почему ChalkidikiHub?',
      items: [
        'Единственная платформа с 7 языками',
        'SEO и переводы на базе ИИ',
        'Бесплатно до 31.12.2026 (затем 90€/год)',
        'Создано специально для Халкидики',
        'Пляжи, рестораны, блог = много посетителей',
        'Мобильное приложение (PWA)',
      ],
    },
    cta: {
      title: 'Готовы?',
      subtitle: 'Разместите свой объект за 2 минуты. Бесплатно.',
      button: 'Бесплатная регистрация →',
    },
  },
  ro: {
    hero: {
      title: 'Promovati proprietatea in 7 limbi. Gratuit.',
      subtitle: 'ChalkidikiHub este singura platforma din Halkidiki care promoveaza automat proprietatea dumneavoastra in greaca, engleza, germana, bulgara, rusa, romana si sarba.',
      cta: 'Inregistrare gratuita',
      cta2: 'Vedeti cum functioneaza',
    },
    featuresTitle: 'Ce primiți cu ChalkidikiHub',
    features: [
      {
        icon: Globe,
        title: '7 limbi automat',
        desc: 'Scrieti doar in greaca. AI traduce automat in alte 6 limbi. Ajungeti la turisti din Germania, Bulgaria, Rusia, Romania, Serbia.',
      },
      {
        icon: Search,
        title: 'SEO pe Google',
        desc: 'Fiecare proprietate este optimizata automat pentru Google in fiecare limba. Meta titluri, descrieri, date structurate.',
      },
      {
        icon: Sparkles,
        title: 'Bazat pe AI',
        desc: 'Inteligenta artificiala creeaza taguri SEO, traduceri si optimizeaza fotografiile automat.',
      },
      {
        icon: Users,
        title: 'Mii de vizitatori',
        desc: 'Plaje, restaurante, atractii, blog - site-ul mentine vizitatorii si ii directioneaza catre proprietatea dumneavoastra.',
      },
      {
        icon: ImageIcon,
        title: 'Fotografii si harta',
        desc: 'Incarcati fotografii, alegeti locatia pe harta. Optimizare automata a imaginilor.',
      },
      {
        icon: Zap,
        title: 'Linkuri de rezervare',
        desc: 'Conectati Booking.com, Airbnb, site-ul dumneavoastra. Vizitatorii rezerva direct.',
      },
    ],
    howItWorks: {
      title: 'Cum functioneaza',
      steps: [
        { num: '1', title: 'Inregistrare', desc: 'Creati un cont gratuit in 30 de secunde.' },
        { num: '2', title: 'Listare', desc: 'Adaugati titlu, descriere, fotografii, pret. Doar in greaca.' },
        { num: '3', title: 'Magia AI', desc: 'AI traduce, creeaza SEO, optimizeaza imaginile automat.' },
        { num: '4', title: 'Online!', desc: 'Proprietatea dumneavoastra apare in 7 limbi pe Google.' },
      ],
    },
    free: {
      title: 'Cat costa?',
      answer: 'Gratuit pana la 31.12.2026.',
      desc: 'Anunturile create pana la 31 decembrie 2026 raman gratuite pentru totdeauna. De la 1 ianuarie 2027, anunturile noi au un pachet anual de 90€/an (inclusiv TVA 24%). Intotdeauna fara comision la rezervari.',
    },
    whyUs: {
      title: 'De ce ChalkidikiHub?',
      items: [
        'Singura platforma cu 7 limbi',
        'SEO si traduceri bazate pe AI',
        'Gratuit pana la 31.12.2026 (apoi 90€/an)',
        'Creat special pentru Halkidiki',
        'Plaje, restaurante, blog = multi vizitatori',
        'Aplicatie mobila (PWA)',
      ],
    },
    cta: {
      title: 'Sunteti gata?',
      subtitle: 'Listati proprietatea in 2 minute. Gratuit.',
      button: 'Inregistrare gratuita →',
    },
  },
  sr: {
    hero: {
      title: 'Promovisite svoj smestaj na 7 jezika. Besplatno.',
      subtitle: 'ChalkidikiHub je jedina platforma za Halkidiki koja automatski promovisie vas smestaj na grckom, engleskom, nemackom, bugarskom, ruskom, rumunskom i srpskom.',
      cta: 'Besplatna registracija',
      cta2: 'Pogledajte kako funkcionise',
    },
    featuresTitle: 'Šta dobijate uz ChalkidikiHub',
    features: [
      {
        icon: Globe,
        title: '7 jezika automatski',
        desc: 'Pisite samo na grckom. AI automatski prevodi na jos 6 jezika. Doseznite turiste iz Nemacke, Bugarske, Rusije, Rumunije, Srbije.',
      },
      {
        icon: Search,
        title: 'SEO na Google-u',
        desc: 'Svaki smestaj se automatski optimizuje za Google na svakom jeziku. Meta naslovi, opisi, strukturirani podaci.',
      },
      {
        icon: Sparkles,
        title: 'AI tehnologija',
        desc: 'Vestacka inteligencija kreira SEO tagove, prevode i automatski optimizuje vase fotografije.',
      },
      {
        icon: Users,
        title: 'Hiljade posetilaca',
        desc: 'Plaze, restorani, znamenitosti, blog - sajt zadrzava posetioce i usmerava ih ka vasem smestaju.',
      },
      {
        icon: ImageIcon,
        title: 'Fotografije i mapa',
        desc: 'Otpremite fotografije, izaberite lokaciju na mapi. Automatska optimizacija slika.',
      },
      {
        icon: Zap,
        title: 'Linkovi za rezervaciju',
        desc: 'Povezite Booking.com, Airbnb, vas sajt. Posetioci rezervisu direktno.',
      },
    ],
    howItWorks: {
      title: 'Kako funkcionise',
      steps: [
        { num: '1', title: 'Registracija', desc: 'Napravite besplatan nalog za 30 sekundi.' },
        { num: '2', title: 'Objava', desc: 'Dodajte naslov, opis, fotografije, cenu. Samo na grckom.' },
        { num: '3', title: 'AI magija', desc: 'AI prevodi, kreira SEO, optimizuje slike automatski.' },
        { num: '4', title: 'Online!', desc: 'Vas smestaj se pojavljuje na 7 jezika na Google-u.' },
      ],
    },
    free: {
      title: 'Koliko kosta?',
      answer: 'Besplatno do 31.12.2026.',
      desc: 'Oglasi kreirani do 31. decembra 2026. ostaju besplatni zauvek. Od 1. januara 2027, novi oglasi imaju godisnji paket od 90€/godisnje (uklj. 24% PDV). Uvek bez provizije na rezervacije.',
    },
    whyUs: {
      title: 'Zasto ChalkidikiHub?',
      items: [
        'Jedina platforma sa 7 jezika',
        'SEO i prevodi bazirani na AI',
        'Besplatno do 31.12.2026 (zatim 90€/god.)',
        'Napravljeno posebno za Halkidiki',
        'Plaze, restorani, blog = mnogo posetilaca',
        'Mobilna aplikacija (PWA)',
      ],
    },
    cta: {
      title: 'Spremni?',
      subtitle: 'Registrujte svoj smestaj za 2 minuta. Besplatno.',
      button: 'Besplatna registracija →',
    },
  },
};

export default function ForOwnersPage() {
  const locale = useLocale();
  const t = content[locale] || content.en;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 md:py-28">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">{t.hero.title}</h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">{t.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl text-lg hover:bg-primary-50 transition-colors shadow-lg">
              {t.hero.cta}
            </Link>
            <Link href="/for-owners/services" className="px-8 py-4 border-2 border-white/30 text-white font-medium rounded-xl text-lg hover:bg-white/10 transition-colors">
              {locale === 'el' ? 'Τι Παρέχουμε →' : locale === 'de' ? 'Was wir bieten →' : locale === 'bg' ? 'Какво предлагаме →' : locale === 'ru' ? 'Что мы предлагаем →' : locale === 'ro' ? 'Ce oferim →' : locale === 'sr' ? 'Šta nudimo →' : 'What We Offer →'}
            </Link>
            <a href="#how" className="px-8 py-4 border-2 border-white/30 text-white font-medium rounded-xl text-lg hover:bg-white/10 transition-colors">
              {t.hero.cta2}
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {/* h2 keeps the hero h1 from skipping straight to the h3 feature cards */}
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t.featuresTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.map((f, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t.howItWorks.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {t.howItWorks.steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
                {idx < 3 && <ArrowRight className="w-5 h-5 text-primary-400 mx-auto mt-4 hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free */}
      <section className="py-16 md:py-24 bg-green-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.free.title}</h2>
          <div className="text-5xl font-bold text-green-600 mb-4">{t.free.answer}</div>
          <p className="text-gray-600">{t.free.desc}</p>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">{t.whyUs.title}</h2>
          <div className="space-y-3">
            {t.whyUs.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.cta.title}</h2>
          <p className="text-lg text-primary-100 mb-8">{t.cta.subtitle}</p>
          <Link href="/auth/register"
            className="inline-flex px-10 py-4 bg-white text-primary-700 font-bold rounded-xl text-lg hover:bg-primary-50 transition-colors shadow-lg">
            {t.cta.button}
          </Link>
        </div>
      </section>
    </div>
  );
}
