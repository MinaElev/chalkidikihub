'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ArrowRight, BedDouble, CalendarDays, CalendarOff, Check, CheckCircle, Globe, Home, ImageIcon, Mail, MessageCircle, Percent, PlayCircle, Search, Sparkles, Users, Zap } from 'lucide-react';

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
      title: 'Promovați-vă proprietatea în 7 limbi. Gratuit.',
      subtitle: 'ChalkidikiHub este singura platformă din Halkidiki care vă promovează automat proprietatea în greacă, engleză, germană, bulgară, rusă, română și sârbă.',
      cta: 'Înregistrare gratuită',
      cta2: 'Vedeți cum funcționează',
    },
    featuresTitle: 'Ce primiți cu ChalkidikiHub',
    features: [
      {
        icon: Globe,
        title: '7 limbi automat',
        desc: 'Scrieți doar în greacă. AI traduce automat în alte 6 limbi. Ajungeți la turiști din Germania, Bulgaria, Rusia, România, Serbia.',
      },
      {
        icon: Search,
        title: 'SEO pe Google',
        desc: 'Fiecare proprietate este optimizată automat pentru Google în fiecare limbă. Meta titluri, descrieri, date structurate.',
      },
      {
        icon: Sparkles,
        title: 'Bazat pe AI',
        desc: 'Inteligența artificială creează etichete SEO, traduceri și optimizează automat fotografiile.',
      },
      {
        icon: Users,
        title: 'Mii de vizitatori',
        desc: 'Plaje, restaurante, atracții, blog — site-ul îi reține pe vizitatori și îi îndreaptă spre proprietatea dumneavoastră.',
      },
      {
        icon: ImageIcon,
        title: 'Fotografii și hartă',
        desc: 'Încărcați fotografii, alegeți locația pe hartă. Optimizare automată a imaginilor.',
      },
      {
        icon: Zap,
        title: 'Linkuri de rezervare',
        desc: 'Conectați Booking.com, Airbnb, site-ul dumneavoastră. Vizitatorii rezervă direct.',
      },
    ],
    howItWorks: {
      title: 'Cum funcționează',
      steps: [
        { num: '1', title: 'Înregistrare', desc: 'Creați un cont gratuit în 30 de secunde.' },
        { num: '2', title: 'Listare', desc: 'Adăugați titlu, descriere, fotografii, preț. Doar în greacă.' },
        { num: '3', title: 'Magia AI', desc: 'AI traduce, creează SEO și optimizează automat imaginile.' },
        { num: '4', title: 'Online!', desc: 'Proprietatea dumneavoastră apare în 7 limbi pe Google.' },
      ],
    },
    free: {
      title: 'Cât costă?',
      answer: 'Gratuit până la 31.12.2026.',
      desc: 'Anunțurile create până la 31 decembrie 2026 rămân gratuite pentru totdeauna. De la 1 ianuarie 2027, anunțurile noi au un pachet anual de 90 €/an (inclusiv TVA 24%). Întotdeauna fără comision la rezervări.',
    },
    whyUs: {
      title: 'De ce ChalkidikiHub?',
      items: [
        'Singura platformă cu 7 limbi',
        'SEO și traduceri bazate pe AI',
        'Gratuit până la 31.12.2026 (apoi 90 €/an)',
        'Creat special pentru Halkidiki',
        'Plaje, restaurante, blog = mulți vizitatori',
        'Aplicație mobilă (PWA)',
      ],
    },
    cta: {
      title: 'Sunteți gata?',
      subtitle: 'Listați proprietatea în 2 minute. Gratuit.',
      button: 'Înregistrare gratuită →',
    },
  },
  sr: {
    hero: {
      title: 'Promovišite svoj smeštaj na 7 jezika. Besplatno.',
      subtitle: 'ChalkidikiHub je jedina platforma za Halkidiki koja automatski promoviše vaš smeštaj na grčkom, engleskom, nemačkom, bugarskom, ruskom, rumunskom i srpskom.',
      cta: 'Besplatna registracija',
      cta2: 'Pogledajte kako funkcioniše',
    },
    featuresTitle: 'Šta dobijate uz ChalkidikiHub',
    features: [
      {
        icon: Globe,
        title: '7 jezika automatski',
        desc: 'Pišite samo na grčkom. AI automatski prevodi na još 6 jezika. Dosegnite turiste iz Nemačke, Bugarske, Rusije, Rumunije, Srbije.',
      },
      {
        icon: Search,
        title: 'SEO na Google-u',
        desc: 'Svaki smeštaj se automatski optimizuje za Google na svakom jeziku. Meta naslovi, opisi, strukturirani podaci.',
      },
      {
        icon: Sparkles,
        title: 'AI tehnologija',
        desc: 'Veštačka inteligencija kreira SEO oznake, prevode i automatski optimizuje vaše fotografije.',
      },
      {
        icon: Users,
        title: 'Hiljade posetilaca',
        desc: 'Plaže, restorani, znamenitosti, blog — sajt zadržava posetioce i usmerava ih ka vašem smeštaju.',
      },
      {
        icon: ImageIcon,
        title: 'Fotografije i mapa',
        desc: 'Otpremite fotografije, izaberite lokaciju na mapi. Automatska optimizacija slika.',
      },
      {
        icon: Zap,
        title: 'Linkovi za rezervaciju',
        desc: 'Povežite Booking.com, Airbnb, vaš sajt. Posetioci rezervišu direktno.',
      },
    ],
    howItWorks: {
      title: 'Kako funkcioniše',
      steps: [
        { num: '1', title: 'Registracija', desc: 'Napravite besplatan nalog za 30 sekundi.' },
        { num: '2', title: 'Objava', desc: 'Dodajte naslov, opis, fotografije, cenu. Samo na grčkom.' },
        { num: '3', title: 'AI magija', desc: 'AI prevodi, kreira SEO, optimizuje slike automatski.' },
        { num: '4', title: 'Online!', desc: 'Vaš smeštaj se pojavljuje na 7 jezika na Google-u.' },
      ],
    },
    free: {
      title: 'Koliko košta?',
      answer: 'Besplatno do 31.12.2026.',
      desc: 'Oglasi kreirani do 31. decembra 2026. ostaju besplatni zauvek. Od 1. januara 2027. novi oglasi imaju godišnji paket od 90 € (uklj. 24% PDV). Uvek bez provizije na rezervacije.',
    },
    whyUs: {
      title: 'Zašto ChalkidikiHub?',
      items: [
        'Jedina platforma sa 7 jezika',
        'SEO i prevodi bazirani na AI',
        'Besplatno do 31.12.2026 (zatim 90€/god.)',
        'Napravljeno posebno za Halkidiki',
        'Plaže, restorani, blog = mnogo posetilaca',
        'Mobilna aplikacija (PWA)',
      ],
    },
    cta: {
      title: 'Spremni?',
      subtitle: 'Registrujte svoj smeštaj za 2 minuta. Besplatno.',
      button: 'Besplatna registracija →',
    },
  },
};

type HeroCopy = {
  badge: string;
  /** The title in two parts; the second (the last word) is underlined. */
  titleA: string;
  titleB: string;
  lead: string;
  /** The line in bold. "Most owners receive requests": 62 of the 66 owners with a published listing had received one by Nov 2026. */
  strong: string;
  cta: string;
  services: string;
  benefits: [string, string, string, string];
  /** The illustration on the right: an example, not a real listing or guest. */
  demo: {
    example: string; name: string; shown: string; place: string; beds: string; guests: string;
    request: string; dates: string; party: string; ago: string; reply: string; replyText: string; noSync: string;
  };
};

const hero: Record<string, HeroCopy> = {
  el: {
    badge: 'Για ιδιοκτήτες καταλυμάτων στη Χαλκιδική',
    titleA: 'Προβάλετε το κατάλυμά σας στη Χαλκιδική και δεχτείτε απευθείας', titleB: 'αιτήματα',
    lead: 'Φέρτε το κατάλυμά σας μπροστά σε στοχευμένο κοινό που ενδιαφέρεται για διακοπές στη Χαλκιδική, επικοινωνήστε απευθείας με επισκέπτες και λάβετε αιτήματα ενδιαφέροντος, χωρίς προμήθεια ανά κράτηση.',
    strong: 'Δεν χρειάζεται σύνδεση διαθεσιμότητας: οι περισσότεροι ιδιοκτήτες λαμβάνουν αιτήματα ενδιαφέροντος.',
    cta: 'Καταχωρήστε το κατάλυμά σας', services: 'Τι παρέχουμε',
    benefits: ['Απευθείας αιτήματα', 'Χωρίς προμήθεια', 'Δεν απαιτείται live availability', 'Προβολή σε ταξιδιώτες της Χαλκιδικής'],
    demo: {
      example: 'Παράδειγμα', name: 'Το κατάλυμά σας', shown: 'Προβάλλεται', place: 'Σιθωνία, Χαλκιδική', beds: '3 υπνοδωμάτια', guests: 'έως 6 άτομα',
      request: 'Νέο αίτημα ενδιαφέροντος', dates: '24 – 29 Ιουλίου', party: '2 ενήλικες + 1 παιδί', ago: 'πριν από 8 λεπτά',
      reply: 'Απάντηση ιδιοκτήτη', replyText: '«Ευχαριστώ για το ενδιαφέρον! Το κατάλυμα είναι διαθέσιμο για τις ημερομηνίες που ζητάτε. Να σας στείλω περισσότερες πληροφορίες;»',
      noSync: 'Χωρίς συγχρονισμό ημερολογίου',
    },
  },
  en: {
    badge: 'For accommodation owners in Halkidiki',
    titleA: 'List your property in Halkidiki and receive direct', titleB: 'requests',
    lead: 'Put your property in front of people who are planning a holiday in Halkidiki, talk to guests directly and receive enquiries, with no commission per booking.',
    strong: 'You do not need to sync your availability: most owners receive enquiries.',
    cta: 'List your property', services: 'What we offer',
    benefits: ['Direct requests', 'No commission', 'No live availability needed', 'Seen by travellers to Halkidiki'],
    demo: {
      example: 'Example', name: 'Your property', shown: 'Listed', place: 'Sithonia, Halkidiki', beds: '3 bedrooms', guests: 'up to 6 guests',
      request: 'New enquiry', dates: '24 – 29 July', party: '2 adults + 1 child', ago: '8 minutes ago',
      reply: 'Owner’s reply', replyText: '“Thank you for your interest! The property is available on the dates you asked for. Shall I send you more details?”',
      noSync: 'No calendar sync needed',
    },
  },
  de: {
    badge: 'Für Vermieter von Unterkünften auf Chalkidiki',
    titleA: 'Präsentieren Sie Ihre Unterkunft auf Chalkidiki und erhalten Sie direkte', titleB: 'Anfragen',
    lead: 'Zeigen Sie Ihre Unterkunft Menschen, die einen Urlaub auf Chalkidiki planen, kommunizieren Sie direkt mit Gästen und erhalten Sie Anfragen, ohne Provision pro Buchung.',
    strong: 'Sie müssen Ihre Verfügbarkeit nicht synchronisieren: Die meisten Vermieter erhalten Anfragen.',
    cta: 'Unterkunft eintragen', services: 'Was wir bieten',
    benefits: ['Direkte Anfragen', 'Keine Provision', 'Keine Live-Verfügbarkeit nötig', 'Sichtbar für Chalkidiki-Reisende'],
    demo: {
      example: 'Beispiel', name: 'Ihre Unterkunft', shown: 'Online', place: 'Sithonia, Chalkidiki', beds: '3 Schlafzimmer', guests: 'bis zu 6 Gäste',
      request: 'Neue Anfrage', dates: '24. – 29. Juli', party: '2 Erwachsene + 1 Kind', ago: 'vor 8 Minuten',
      reply: 'Antwort des Vermieters', replyText: '„Vielen Dank für Ihr Interesse! Die Unterkunft ist an den gewünschten Tagen frei. Soll ich Ihnen weitere Informationen senden?“',
      noSync: 'Ohne Kalendersynchronisierung',
    },
  },
  bg: {
    badge: 'За собственици на места за настаняване в Халкидики',
    titleA: 'Представете имота си в Халкидики и получавайте директни', titleB: 'запитвания',
    lead: 'Покажете имота си на хора, които планират почивка в Халкидики, общувайте директно с гостите и получавайте запитвания, без комисиона за резервация.',
    strong: 'Не е нужно да синхронизирате заетостта: повечето собственици получават запитвания.',
    cta: 'Регистрирайте имота си', services: 'Какво предлагаме',
    benefits: ['Директни запитвания', 'Без комисиона', 'Без календар на живо', 'Видимост пред пътуващите към Халкидики'],
    demo: {
      example: 'Пример', name: 'Вашият имот', shown: 'Публикуван', place: 'Ситония, Халкидики', beds: '3 спални', guests: 'до 6 души',
      request: 'Ново запитване', dates: '24 – 29 юли', party: '2 възрастни + 1 дете', ago: 'преди 8 минути',
      reply: 'Отговор на собственика', replyText: '„Благодаря за интереса! Имотът е свободен за посочените дати. Да ви изпратя ли повече информация?“',
      noSync: 'Без синхронизиране на календар',
    },
  },
  ru: {
    badge: 'Для владельцев жилья на Халкидиках',
    titleA: 'Покажите своё жильё на Халкидиках и получайте прямые', titleB: 'запросы',
    lead: 'Покажите своё жильё тем, кто планирует отдых на Халкидиках, общайтесь с гостями напрямую и получайте запросы без комиссии за бронирование.',
    strong: 'Синхронизировать календарь не нужно: большинство владельцев получают запросы.',
    cta: 'Разместить жильё', services: 'Что мы предлагаем',
    benefits: ['Прямые запросы', 'Без комиссии', 'Календарь в реальном времени не нужен', 'Вас видят туристы, едущие на Халкидики'],
    demo: {
      example: 'Пример', name: 'Ваше жильё', shown: 'Опубликовано', place: 'Ситония, Халкидики', beds: '3 спальни', guests: 'до 6 гостей',
      request: 'Новый запрос', dates: '24 – 29 июля', party: '2 взрослых + 1 ребёнок', ago: '8 минут назад',
      reply: 'Ответ владельца', replyText: '«Спасибо за интерес! Жильё свободно на выбранные даты. Прислать вам больше информации?»',
      noSync: 'Без синхронизации календаря',
    },
  },
  ro: {
    badge: 'Pentru proprietarii de cazări din Halkidiki',
    titleA: 'Promovați-vă cazarea în Halkidiki și primiți direct', titleB: 'cereri',
    lead: 'Aduceți-vă cazarea în fața unui public care își plănuiește vacanța în Halkidiki, comunicați direct cu turiștii și primiți cereri, fără comision pe rezervare.',
    strong: 'Nu este nevoie să vă sincronizați disponibilitatea: majoritatea proprietarilor primesc cereri.',
    cta: 'Înscrieți-vă cazarea', services: 'Ce oferim',
    benefits: ['Cereri directe', 'Fără comision', 'Fără disponibilitate live', 'Vizibilitate în fața turiștilor din Halkidiki'],
    demo: {
      example: 'Exemplu', name: 'Cazarea dumneavoastră', shown: 'Publicată', place: 'Sithonia, Halkidiki', beds: '3 dormitoare', guests: 'până la 6 persoane',
      request: 'Cerere nouă', dates: '24 – 29 iulie', party: '2 adulți + 1 copil', ago: 'acum 8 minute',
      reply: 'Răspunsul proprietarului', replyText: '„Vă mulțumesc pentru interes! Cazarea este liberă în perioada dorită. Să vă trimit mai multe detalii?”',
      noSync: 'Fără sincronizarea calendarului',
    },
  },
  sr: {
    badge: 'Za vlasnike smeštaja na Halkidikiju',
    titleA: 'Predstavite svoj smeštaj na Halkidikiju i primajte direktne', titleB: 'upite',
    lead: 'Predstavite svoj smeštaj ljudima koji planiraju odmor na Halkidikiju, komunicirajte direktno sa gostima i primajte upite, bez provizije po rezervaciji.',
    strong: 'Nije potrebno da sinhronizujete dostupnost: većina vlasnika dobija upite.',
    cta: 'Prijavite svoj smeštaj', services: 'Šta nudimo',
    benefits: ['Direktni upiti', 'Bez provizije', 'Bez dostupnosti uživo', 'Vidljivost kod putnika za Halkidiki'],
    demo: {
      example: 'Primer', name: 'Vaš smeštaj', shown: 'Objavljeno', place: 'Sitonija, Halkidiki', beds: '3 spavaće sobe', guests: 'do 6 osoba',
      request: 'Novi upit', dates: '24 – 29. jul', party: '2 odrasle osobe + 1 dete', ago: 'pre 8 minuta',
      reply: 'Odgovor vlasnika', replyText: '„Hvala na interesovanju! Smeštaj je slobodan u traženom terminu. Da vam pošaljem više informacija?“',
      noSync: 'Bez sinhronizacije kalendara',
    },
  },
};

const BENEFIT_ICONS = [Mail, Percent, CalendarOff, Users] as const;

export default function ForOwnersPage() {
  const locale = useLocale();
  const t = content[locale] || content.en;
  const h = hero[locale] || hero.en;
  const d = h.demo;

  return (
    <div>
      {/* Hero: light, like the home page, with an example of what an owner gets */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-sea-100 px-4 py-1.5 text-sm font-medium text-sea-800">
              <Home className="size-4" aria-hidden /> {h.badge}
            </p>
            <h1 className="mt-5 text-3xl font-extrabold leading-[1.12] tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {h.titleA}{' '}
              <span className="relative inline-block">
                {h.titleB}
                <span className="absolute inset-x-0 -bottom-1.5 h-1.5 rounded-full bg-sea-400/70" aria-hidden />
              </span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              {h.lead} <strong className="font-bold text-gray-900">{h.strong}</strong>
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-sea-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-sea-600/30 transition-colors hover:bg-sea-700">
                {h.cta} <ArrowRight className="size-5" aria-hidden />
              </Link>
              <a href="#how" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-sea-800 transition-colors hover:bg-sea-50">
                <PlayCircle className="size-5" aria-hidden /> {t.hero.cta2}
              </a>
              <Link href="/for-owners/services" className="inline-flex items-center gap-1 px-2 py-2 text-sm font-semibold text-sea-700 hover:underline">
                {h.services} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-gray-200">
              {h.benefits.map((b, i) => {
                const Icon = BENEFIT_ICONS[i];
                return (
                  <li key={b} className="sm:px-4 sm:first:pl-0">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-sea-50 text-sea-600"><Icon className="size-6" aria-hidden /></span>
                    <span className="mt-3 block text-sm font-semibold leading-snug text-gray-900">{b}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Illustration: an example listing, request and reply. Marked as an example; no real listing or guest. */}
          <div className="relative isolate min-h-[30rem] overflow-hidden rounded-[2rem] p-5 shadow-xl sm:p-7" aria-label={d.example}>
            <Image src="/images/hero/halkidiki-hero.webp" alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="-z-20 object-cover" />
            <span className="absolute inset-0 -z-10 bg-gradient-to-b from-sea-900/10 via-transparent to-sea-900/30" aria-hidden />
            <p className="absolute left-5 top-5 rounded-full bg-gray-900/70 px-3 py-1 text-xs font-semibold text-white sm:left-7 sm:top-7">{d.example}</p>

            <div className="ml-auto mt-10 max-w-xs rounded-2xl bg-white p-4 shadow-lg">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-gray-900">{d.name}</p>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700"><Check className="size-3" aria-hidden /> {d.shown}</span>
              </div>
              <p className="mt-0.5 text-sm text-slate-600">{d.place}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><BedDouble className="size-4 text-sea-600" aria-hidden /> {d.beds}</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-600"><Users className="size-4 text-sea-600" aria-hidden /> {d.guests}</p>
            </div>

            <div className="mt-5 max-w-sm rounded-2xl bg-white p-4 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <p className="flex items-center gap-2 font-bold text-gray-900"><Mail className="size-5 text-sea-600" aria-hidden /> {d.request}</p>
                <span className="shrink-0 text-xs text-slate-500">{d.ago}</span>
              </div>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-700"><CalendarDays className="size-4 text-slate-400" aria-hidden /> {d.dates}</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-700"><Users className="size-4 text-slate-400" aria-hidden /> {d.party}</p>
            </div>

            <div className="ml-auto mt-4 max-w-sm rounded-2xl bg-white p-4 shadow-lg">
              <p className="flex items-center justify-between gap-2 font-bold text-gray-900">
                <span className="flex items-center gap-2"><MessageCircle className="size-5 text-sea-600" aria-hidden /> {d.reply}</span>
                <CheckCircle className="size-5 text-emerald-500" aria-hidden />
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{d.replyText}</p>
            </div>

            <p className="ml-auto mt-4 flex w-fit items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 text-sm font-bold text-sea-800 shadow-lg">
              <CalendarOff className="size-5" aria-hidden /> {d.noSync}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* h2 keeps the hero h1 from skipping straight to the h3 feature cards */}
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{t.featuresTitle}</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-sea-50 text-sea-600"><f.icon className="size-6" aria-hidden /></span>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 bg-sky-50 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{t.howItWorks.title}</h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.howItWorks.steps.map((step) => (
              <li key={step.num} className="rounded-2xl bg-white p-6 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-full bg-sea-600 text-lg font-bold text-white">{step.num}</span>
                <h3 className="mt-4 font-bold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Price and reasons, side by side */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7 sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{t.free.title}</h2>
            <p className="mt-4 text-3xl font-extrabold text-emerald-700 sm:text-4xl">{t.free.answer}</p>
            <p className="mt-4 leading-relaxed text-slate-700">{t.free.desc}</p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{t.whyUs.title}</h2>
            <ul className="mt-5 space-y-3">
              {t.whyUs.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-emerald-500" aria-hidden />
                  <span className="font-medium text-gray-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-4 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-[#0b2540] to-[#0a3a5f] px-6 py-12 text-center text-white sm:py-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.cta.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-white/85">{t.cta.subtitle}</p>
          <Link href="/auth/register" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-lg font-bold text-sea-800 shadow-lg transition-colors hover:bg-sea-50">
            {h.cta} <ArrowRight className="size-5" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
