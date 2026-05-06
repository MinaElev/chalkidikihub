export type AboutSection =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; items: string[] };

export type AboutContent = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  body: AboutSection[];
  stats: { label: string; value: string }[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
};

export const ABOUT: Record<string, AboutContent> = {
  el: {
    metaTitle: 'Σχετικά με το ChalkidikiHub | Ποιοι είμαστε',
    metaDescription:
      'Το ChalkidikiHub είναι μια ανεξάρτητη πύλη για τη Χαλκιδική: 500+ καταλύματα, παραλίες, εστιατόρια και οδηγοί ταξιδιού σε 7 γλώσσες — χωρίς προμήθειες και με δομημένα δεδομένα ορατά σε AI.',
    hero: {
      eyebrow: 'Ποιοι είμαστε',
      title: 'Η Χαλκιδική, χωρίς μεσάζοντες',
      lead:
        'Το ChalkidikiHub είναι μια ανεξάρτητη ταξιδιωτική πύλη χτισμένη από Έλληνες, για όποιον σχεδιάζει διακοπές στη Χαλκιδική. Βοηθάμε τον επισκέπτη να βρει το σωστό κατάλυμα και τον ιδιοκτήτη να φτάσει σε νέους πελάτες — χωρίς προμήθειες, χωρίς αλγόριθμους που στρεβλώνουν τις λίστες, χωρίς να κρύβονται τα στοιχεία επικοινωνίας πίσω από paywall.',
    },
    body: [
      { type: 'h2', text: 'Η αποστολή μας' },
      {
        type: 'p',
        text:
          'Πιστεύουμε ότι η Χαλκιδική αξίζει μια πύλη που δεν φιλτράρεται από αλγόριθμους εξωτερικών εταιρειών. Booking, Airbnb και Expedia παίρνουν 15–30% από κάθε κράτηση και αντιμετωπίζουν την περιοχή ως ένα ακόμη γενικό προορισμό. Εμείς δουλεύουμε με 0% προμήθεια. Ο επισκέπτης βλέπει το πραγματικό κατάλυμα, επικοινωνεί απευθείας με τον ιδιοκτήτη μέσω τηλεφώνου, email ή WhatsApp, και ο ιδιοκτήτης κρατά κάθε ευρώ της κράτησης.',
      },
      {
        type: 'p',
        text:
          'Επιπλέον, το site είναι ειδικά σχεδιασμένο ώστε να διαβάζεται από AI assistants — ChatGPT, Gemini, Claude, Perplexity. Όταν κάποιος ρωτά «πού να μείνω στη Χαλκιδική;» θέλουμε η απάντηση να μην έρχεται μόνο από Booking, αλλά από μια ελληνική, ανεξάρτητη πηγή που γνωρίζει τα χωριά, τις παραλίες και τους ιδιοκτήτες προσωπικά.',
      },
      { type: 'h2', text: 'Τι θα βρεις στο site' },
      {
        type: 'list',
        items: [
          '500+ καταλύματα: βίλες, διαμερίσματα, παραδοσιακά πετρόκτιστα, ξενοδοχεία και studios — με φωτογραφίες, χάρτη και απευθείας επικοινωνία',
          'Αναλυτικούς οδηγούς για 60+ χωριά της Κασσάνδρας, Σιθωνίας και της κυρίως Χαλκιδικής',
          'Λίστες με τις καλύτερες παραλίες ανά τύπο (αμμώδεις, οργανωμένες, ελεύθερες, οικογενειακές)',
          'Εστιατόρια, beach bars, παραδοσιακές ταβέρνες και cafés',
          'Δραστηριότητες: water sports, boat trips, ιστορικά μνημεία, πεζοπορίες',
          'Σταθμούς φόρτισης ηλεκτρικών αυτοκινήτων και πρακτικές πληροφορίες (καιρός, μεταφορές, πρόσβαση από Θεσσαλονίκη, οδηγίες για το Άγιο Όρος)',
          'Blog με ταξιδιωτικά άρθρα, οδηγούς ανά μήνα και συγκρίσεις προορισμών',
        ],
      },
      { type: 'h2', text: 'Σε τι διαφέρουμε' },
      {
        type: 'list',
        items: [
          '0% προμήθεια στις κρατήσεις — ποτέ δεν αλλάζει αυτό',
          'Πραγματικός άνθρωπος πίσω από κάθε email, όχι chatbot',
          'Πλήρης μετάφραση σε 7 γλώσσες (Ελληνικά, English, Deutsch, Български, Русский, Română, Srpski)',
          'Δομημένα δεδομένα και schema markup — το κατάλυμά σου εμφανίζεται σε AI απαντήσεις και Google rich results',
          'QR Guest Guide: ψηφιακός concierge για τους ξενοδόχους — οι πελάτες σκανάρουν ένα QR στο δωμάτιο και βρίσκουν αμέσως τα γύρω μέρη',
          'Δωρεάν εγγραφή — χωρίς setup fees, χωρίς μηνιαίες συνδρομές, χωρίς κρυφές χρεώσεις',
        ],
      },
      { type: 'h2', text: 'Επικοινωνία' },
      {
        type: 'p',
        text:
          'Ο ChalkidikiHub λειτουργεί από τον Μηνά Ελευθεριάδη. Είμαι Έλληνας, έχω ζήσει και ταξιδέψει στη Χαλκιδική, και απαντώ προσωπικά σε κάθε email στο mnc@hotmail.gr. Έχεις κατάλυμα και θες να εμφανίζεται; Φτιάξε δωρεάν λογαριασμό σε λιγότερο από 5 λεπτά και προσθεσε τη δική σου καταχώρηση στο directory.',
      },
    ],
    stats: [
      { label: 'Καταλύματα', value: '500+' },
      { label: 'Γλώσσες', value: '7' },
      { label: 'Προμήθεια', value: '0%' },
    ],
    ctaTitle: 'Έχεις κατάλυμα στη Χαλκιδική;',
    ctaSubtitle: 'Δωρεάν εγγραφή σε 5 λεπτά. 0% προμήθεια, για πάντα.',
    ctaButton: 'Καταχώρησε το κατάλυμα',
  },

  en: {
    metaTitle: 'About ChalkidikiHub | Who we are',
    metaDescription:
      'ChalkidikiHub is an independent travel directory for Halkidiki, Greece: 500+ stays, beaches, restaurants and travel guides in 7 languages — zero commissions and structured data visible to AI assistants.',
    hero: {
      eyebrow: 'Who we are',
      title: 'Halkidiki, without the middlemen',
      lead:
        'ChalkidikiHub is an independent travel directory built by locals, for anyone planning a trip to Halkidiki, Greece. We help travellers find the right stay and we help property owners reach new guests — with no commissions, no algorithms hiding listings, and no contact details locked behind a paywall.',
    },
    body: [
      { type: 'h2', text: 'Our mission' },
      {
        type: 'p',
        text:
          'We believe Halkidiki deserves a directory that is not filtered through the algorithms of foreign companies. Booking, Airbnb and Expedia take 15–30% on every reservation and treat the region as just another generic destination. We work with 0% commission. Travellers see the actual property, contact the owner directly by phone, email or WhatsApp, and the owner keeps every euro of the booking.',
      },
      {
        type: 'p',
        text:
          'Beyond that, the site is purpose-built to be read by AI assistants — ChatGPT, Gemini, Claude, Perplexity. When someone asks "where should I stay in Halkidiki?" we want the answer to come not only from Booking, but from an independent Greek source that knows the villages, the beaches and the owners personally.',
      },
      { type: 'h2', text: 'What you will find on the site' },
      {
        type: 'list',
        items: [
          '500+ stays: villas, apartments, traditional stone houses, hotels and studios — with photos, map and direct contact',
          'Detailed guides for 60+ villages across Kassandra, Sithonia and mainland Halkidiki',
          'Curated beach lists by type (sandy, organised, free, family-friendly)',
          'Restaurants, beach bars, traditional tavernas and cafés',
          'Activities: water sports, boat trips, historical sites, hiking trails',
          'EV charging stations and practical info (weather, transport, getting in from Thessaloniki, Mount Athos access)',
          'A blog with travel articles, month-by-month guides and destination comparisons',
        ],
      },
      { type: 'h2', text: 'How we are different' },
      {
        type: 'list',
        items: [
          '0% commission on bookings — that never changes',
          'A real person behind every email, never a chatbot',
          'Full translation in 7 languages (Greek, English, German, Bulgarian, Russian, Romanian, Serbian)',
          'Structured data and schema markup — your property surfaces in AI answers and Google rich results',
          'QR Guest Guide: a digital concierge for hosts — guests scan a QR in the room and instantly see what is nearby',
          'Free registration — no setup fees, no monthly subscription, no hidden charges',
        ],
      },
      { type: 'h2', text: 'Get in touch' },
      {
        type: 'p',
        text:
          'ChalkidikiHub is operated by Minas Eleftheriadis. I am Greek, I have lived and travelled across Halkidiki, and I personally reply to every email at mnc@hotmail.gr. Do you own a property in the area? Create a free account in under 5 minutes and add your listing to the directory.',
      },
    ],
    stats: [
      { label: 'Properties', value: '500+' },
      { label: 'Languages', value: '7' },
      { label: 'Commission', value: '0%' },
    ],
    ctaTitle: 'Own a property in Halkidiki?',
    ctaSubtitle: 'Free registration in 5 minutes. 0% commission, forever.',
    ctaButton: 'List your property',
  },

  de: {
    metaTitle: 'Über ChalkidikiHub | Wer wir sind',
    metaDescription:
      'ChalkidikiHub ist ein unabhängiges Reiseverzeichnis für Chalkidiki: 500+ Unterkünfte, Strände, Restaurants und Reiseführer in 7 Sprachen — ohne Provision und mit strukturierten Daten für KI-Assistenten.',
    hero: {
      eyebrow: 'Wer wir sind',
      title: 'Chalkidiki, ohne Zwischenhändler',
      lead:
        'ChalkidikiHub ist ein unabhängiges Reiseverzeichnis, das von Einheimischen für alle entwickelt wurde, die einen Urlaub in Chalkidiki planen. Wir helfen Reisenden, die passende Unterkunft zu finden, und Vermietern, neue Gäste zu erreichen — ohne Provisionen, ohne Algorithmen, die Einträge verstecken, und ohne Kontaktdaten hinter einer Bezahlschranke.',
    },
    body: [
      { type: 'h2', text: 'Unsere Mission' },
      {
        type: 'p',
        text:
          'Wir glauben, dass Chalkidiki ein Verzeichnis verdient, das nicht durch die Algorithmen ausländischer Konzerne gefiltert wird. Booking, Airbnb und Expedia verlangen 15–30% pro Buchung und behandeln die Region wie ein beliebiges Reiseziel. Wir arbeiten mit 0% Provision. Reisende sehen die tatsächliche Unterkunft, nehmen direkt per Telefon, E-Mail oder WhatsApp Kontakt auf — und der Vermieter behält jeden Euro der Buchung.',
      },
      {
        type: 'p',
        text:
          'Darüber hinaus ist die Seite gezielt so gebaut, dass sie von KI-Assistenten gelesen werden kann — ChatGPT, Gemini, Claude, Perplexity. Wenn jemand fragt: „Wo soll ich in Chalkidiki übernachten?", möchten wir, dass die Antwort nicht nur von Booking stammt, sondern von einer unabhängigen griechischen Quelle, die die Dörfer, Strände und Vermieter persönlich kennt.',
      },
      { type: 'h2', text: 'Was Sie auf der Seite finden' },
      {
        type: 'list',
        items: [
          '500+ Unterkünfte: Villen, Apartments, traditionelle Steinhäuser, Hotels und Studios — mit Fotos, Karte und direktem Kontakt',
          'Ausführliche Reiseführer für über 60 Dörfer in Kassandra, Sithonia und im Festland-Chalkidiki',
          'Kuratierte Strandlisten nach Typ (sandig, organisiert, kostenlos, familienfreundlich)',
          'Restaurants, Beach-Bars, traditionelle Tavernen und Cafés',
          'Aktivitäten: Wassersport, Bootstouren, historische Stätten, Wanderwege',
          'E-Auto-Ladestationen und praktische Infos (Wetter, Anreise aus Thessaloniki, Zugang zum Berg Athos)',
          'Ein Blog mit Reiseartikeln, Monats-Guides und Zielvergleichen',
        ],
      },
      { type: 'h2', text: 'Was uns unterscheidet' },
      {
        type: 'list',
        items: [
          '0% Provision auf Buchungen — daran ändert sich nie etwas',
          'Eine echte Person hinter jeder E-Mail, kein Chatbot',
          'Vollständige Übersetzung in 7 Sprachen (Griechisch, Englisch, Deutsch, Bulgarisch, Russisch, Rumänisch, Serbisch)',
          'Strukturierte Daten und Schema Markup — Ihre Unterkunft erscheint in KI-Antworten und Google Rich Results',
          'QR Guest Guide: digitaler Concierge für Gastgeber — Gäste scannen einen QR-Code im Zimmer und sehen sofort, was in der Umgebung ist',
          'Kostenlose Registrierung — keine Einrichtungsgebühren, kein monatliches Abo, keine versteckten Kosten',
        ],
      },
      { type: 'h2', text: 'Kontakt' },
      {
        type: 'p',
        text:
          'ChalkidikiHub wird von Minas Eleftheriadis betrieben. Ich bin Grieche, habe in Chalkidiki gelebt und gereist, und beantworte persönlich jede E-Mail an mnc@hotmail.gr. Sie besitzen eine Unterkunft in der Region? Erstellen Sie in weniger als 5 Minuten ein kostenloses Konto und tragen Sie Ihre Unterkunft in das Verzeichnis ein.',
      },
    ],
    stats: [
      { label: 'Unterkünfte', value: '500+' },
      { label: 'Sprachen', value: '7' },
      { label: 'Provision', value: '0%' },
    ],
    ctaTitle: 'Haben Sie eine Unterkunft in Chalkidiki?',
    ctaSubtitle: 'Kostenlose Registrierung in 5 Minuten. 0% Provision, für immer.',
    ctaButton: 'Unterkunft eintragen',
  },

  bg: {
    metaTitle: 'За ChalkidikiHub | Кои сме ние',
    metaDescription:
      'ChalkidikiHub е независим туристически каталог за Халкидики: 500+ настанявания, плажове, ресторанти и пътеводители на 7 езика — без комисиона и със структурирани данни за AI асистенти.',
    hero: {
      eyebrow: 'Кои сме ние',
      title: 'Халкидики, без посредници',
      lead:
        'ChalkidikiHub е независим туристически каталог, изграден от гърци, за всеки, който планира почивка в Халкидики. Помагаме на пътниците да намерят подходящото настаняване, а на собствениците — да достигнат до нови гости. Без комисиони, без алгоритми, които скриват обявите, без контактни данни заключени зад платежна стена.',
    },
    body: [
      { type: 'h2', text: 'Нашата мисия' },
      {
        type: 'p',
        text:
          'Смятаме, че Халкидики заслужава каталог, който не е филтриран през алгоритмите на чужди компании. Booking, Airbnb и Expedia вземат 15–30% от всяка резервация и третират региона като поредната дестинация. Ние работим с 0% комисиона. Пътниците виждат истинското настаняване, свързват се директно със собственика по телефон, имейл или WhatsApp, а собственикът запазва всяко евро от резервацията.',
      },
      {
        type: 'p',
        text:
          'Освен това сайтът е специално изграден така, че да се чете от AI асистенти — ChatGPT, Gemini, Claude, Perplexity. Когато някой попита „къде да отседна в Халкидики?", искаме отговорът да идва не само от Booking, а от независим гръцки източник, който познава селата, плажовете и собствениците лично.',
      },
      { type: 'h2', text: 'Какво ще намерите в сайта' },
      {
        type: 'list',
        items: [
          '500+ настанявания: вили, апартаменти, традиционни каменни къщи, хотели и студия — със снимки, карта и директен контакт',
          'Подробни пътеводители за 60+ села в Касандра, Ситония и континентална Халкидики',
          'Подбрани списъци с плажове по тип (пясъчни, организирани, свободни, семейни)',
          'Ресторанти, плажни барове, традиционни таверни и кафенета',
          'Дейности: водни спортове, лодки, исторически забележителности, туристически маршрути',
          'Зарядни станции за електромобили и практическа информация (време, транспорт от Солун, достъп до Атон)',
          'Блог със статии за пътувания, месечни ръководства и сравнения на дестинации',
        ],
      },
      { type: 'h2', text: 'С какво се различаваме' },
      {
        type: 'list',
        items: [
          '0% комисиона за резервации — никога не се променя',
          'Реален човек зад всеки имейл, никога чатбот',
          'Пълен превод на 7 езика (гръцки, английски, немски, български, руски, румънски, сръбски)',
          'Структурирани данни и schema markup — вашият имот се появява в AI отговори и Google rich results',
          'QR Guest Guide: дигитален конситерж за домакините — гостите сканират QR код в стаята и веднага виждат какво има наоколо',
          'Безплатна регистрация — без такси за настройка, без месечен абонамент, без скрити такси',
        ],
      },
      { type: 'h2', text: 'Контакт' },
      {
        type: 'p',
        text:
          'ChalkidikiHub се управлява от Минас Елефтериадис. Грък съм, живял съм и съм пътувал из Халкидики, и лично отговарям на всеки имейл на mnc@hotmail.gr. Имате имот в района? Създайте безплатен акаунт за по-малко от 5 минути и добавете обявата си към каталога.',
      },
    ],
    stats: [
      { label: 'Имоти', value: '500+' },
      { label: 'Езици', value: '7' },
      { label: 'Комисиона', value: '0%' },
    ],
    ctaTitle: 'Имате имот в Халкидики?',
    ctaSubtitle: 'Безплатна регистрация за 5 минути. 0% комисиона, завинаги.',
    ctaButton: 'Добавете обявата',
  },

  ru: {
    metaTitle: 'О ChalkidikiHub | Кто мы',
    metaDescription:
      'ChalkidikiHub — независимый туристический каталог Халкидики: 500+ вариантов жилья, пляжи, рестораны и путеводители на 7 языках. Без комиссий, со структурированными данными для AI-ассистентов.',
    hero: {
      eyebrow: 'Кто мы',
      title: 'Халкидики без посредников',
      lead:
        'ChalkidikiHub — независимый туристический каталог, созданный греками для всех, кто планирует поездку на Халкидики. Мы помогаем путешественникам найти подходящее жильё, а владельцам — привлечь новых гостей. Без комиссий, без алгоритмов, скрывающих объявления, и без контактных данных за платным доступом.',
    },
    body: [
      { type: 'h2', text: 'Наша миссия' },
      {
        type: 'p',
        text:
          'Мы считаем, что Халкидики заслуживает каталога, не отфильтрованного алгоритмами иностранных компаний. Booking, Airbnb и Expedia берут 15–30% с каждого бронирования и относятся к региону как к очередному обычному направлению. Мы работаем с 0% комиссии. Путешественник видит реальное жильё, связывается с владельцем напрямую по телефону, email или WhatsApp, а владелец оставляет себе каждое евро бронирования.',
      },
      {
        type: 'p',
        text:
          'Кроме того, сайт специально построен так, чтобы его могли читать AI-ассистенты — ChatGPT, Gemini, Claude, Perplexity. Когда кто-то спрашивает «где остановиться на Халкидики?», мы хотим, чтобы ответ приходил не только от Booking, но и от независимого греческого источника, который знает деревни, пляжи и владельцев лично.',
      },
      { type: 'h2', text: 'Что вы найдёте на сайте' },
      {
        type: 'list',
        items: [
          '500+ вариантов жилья: виллы, апартаменты, традиционные каменные дома, отели и студии — с фотографиями, картой и прямым контактом',
          'Подробные путеводители по 60+ деревням Кассандры, Ситонии и материковой Халкидики',
          'Подборки пляжей по типу (песчаные, оборудованные, свободные, семейные)',
          'Рестораны, пляжные бары, традиционные таверны и кафе',
          'Активный отдых: водные виды спорта, морские прогулки, исторические места, треккинг',
          'Зарядные станции для электромобилей и практическая информация (погода, транспорт из Салоник, доступ на Афон)',
          'Блог с путеводителями по месяцам и сравнениями направлений',
        ],
      },
      { type: 'h2', text: 'Чем мы отличаемся' },
      {
        type: 'list',
        items: [
          '0% комиссии с бронирований — это никогда не меняется',
          'Реальный человек за каждым письмом, никаких чат-ботов',
          'Полный перевод на 7 языков (греческий, английский, немецкий, болгарский, русский, румынский, сербский)',
          'Структурированные данные и schema markup — ваш объект появляется в ответах AI и Google rich results',
          'QR Guest Guide: цифровой консьерж для хозяев — гости сканируют QR-код в комнате и сразу видят, что рядом',
          'Бесплатная регистрация — никаких сборов за настройку, ежемесячной подписки или скрытых платежей',
        ],
      },
      { type: 'h2', text: 'Связаться с нами' },
      {
        type: 'p',
        text:
          'ChalkidikiHub управляет Минас Элефтериадис. Я грек, жил и путешествовал по Халкидики, и лично отвечаю на каждое письмо по адресу mnc@hotmail.gr. Владеете жильём в регионе? Создайте бесплатный аккаунт менее чем за 5 минут и добавьте своё объявление в каталог.',
      },
    ],
    stats: [
      { label: 'Объекты', value: '500+' },
      { label: 'Языки', value: '7' },
      { label: 'Комиссия', value: '0%' },
    ],
    ctaTitle: 'У вас есть жильё на Халкидики?',
    ctaSubtitle: 'Бесплатная регистрация за 5 минут. 0% комиссии, навсегда.',
    ctaButton: 'Добавить объявление',
  },

  ro: {
    metaTitle: 'Despre ChalkidikiHub | Cine suntem',
    metaDescription:
      'ChalkidikiHub este un director turistic independent pentru Halkidiki: peste 500 de cazări, plaje, restaurante și ghiduri în 7 limbi — fără comisioane și cu date structurate pentru asistenții AI.',
    hero: {
      eyebrow: 'Cine suntem',
      title: 'Halkidiki, fără intermediari',
      lead:
        'ChalkidikiHub este un director turistic independent construit de greci, pentru oricine își planifică o vacanță în Halkidiki. Ajutăm călătorii să găsească cazarea potrivită și proprietarii să ajungă la oaspeți noi — fără comisioane, fără algoritmi care ascund anunțurile și fără date de contact blocate în spatele unei taxe.',
    },
    body: [
      { type: 'h2', text: 'Misiunea noastră' },
      {
        type: 'p',
        text:
          'Credem că Halkidiki merită un director care nu este filtrat prin algoritmii companiilor străine. Booking, Airbnb și Expedia iau 15–30% din fiecare rezervare și tratează regiunea ca pe o destinație generică oarecare. Noi lucrăm cu 0% comision. Călătorii văd cazarea reală, contactează direct proprietarul prin telefon, email sau WhatsApp, iar proprietarul păstrează fiecare euro din rezervare.',
      },
      {
        type: 'p',
        text:
          'În plus, site-ul este construit special pentru a fi citit de asistenți AI — ChatGPT, Gemini, Claude, Perplexity. Când cineva întreabă „unde să stau în Halkidiki?", vrem ca răspunsul să vină nu doar de la Booking, ci și de la o sursă grecească independentă, care cunoaște satele, plajele și proprietarii personal.',
      },
      { type: 'h2', text: 'Ce vei găsi pe site' },
      {
        type: 'list',
        items: [
          'Peste 500 de cazări: vile, apartamente, case tradiționale din piatră, hoteluri și studio-uri — cu fotografii, hartă și contact direct',
          'Ghiduri detaliate pentru peste 60 de sate din Kassandra, Sithonia și Halkidiki continentală',
          'Liste curate de plaje pe categorii (cu nisip, organizate, libere, pentru familii)',
          'Restaurante, beach bar-uri, taverne tradiționale și cafenele',
          'Activități: sporturi nautice, plimbări cu barca, situri istorice, trasee de drumeție',
          'Stații de încărcare pentru mașini electrice și informații practice (vreme, transport din Salonic, acces pe Muntele Athos)',
          'Un blog cu articole de călătorie, ghiduri lună cu lună și comparații între destinații',
        ],
      },
      { type: 'h2', text: 'Prin ce ne diferențiem' },
      {
        type: 'list',
        items: [
          '0% comision la rezervări — asta nu se schimbă niciodată',
          'O persoană reală în spatele fiecărui email, niciodată un chatbot',
          'Traducere completă în 7 limbi (greacă, engleză, germană, bulgară, rusă, română, sârbă)',
          'Date structurate și schema markup — proprietatea ta apare în răspunsurile AI și în Google rich results',
          'QR Guest Guide: concierge digital pentru gazde — oaspeții scanează un QR în cameră și văd imediat ce este în apropiere',
          'Înregistrare gratuită — fără taxe de configurare, fără abonament lunar, fără costuri ascunse',
        ],
      },
      { type: 'h2', text: 'Contact' },
      {
        type: 'p',
        text:
          'ChalkidikiHub este operat de Minas Eleftheriadis. Sunt grec, am locuit și am călătorit în Halkidiki și răspund personal la fiecare email trimis la mnc@hotmail.gr. Aveți o proprietate în zonă? Creați un cont gratuit în mai puțin de 5 minute și adăugați anunțul în director.',
      },
    ],
    stats: [
      { label: 'Proprietăți', value: '500+' },
      { label: 'Limbi', value: '7' },
      { label: 'Comision', value: '0%' },
    ],
    ctaTitle: 'Aveți o proprietate în Halkidiki?',
    ctaSubtitle: 'Înregistrare gratuită în 5 minute. 0% comision, pentru totdeauna.',
    ctaButton: 'Adăugați proprietatea',
  },

  sr: {
    metaTitle: 'O ChalkidikiHub | Ko smo mi',
    metaDescription:
      'ChalkidikiHub je nezavisni turistički direktorijum za Halkidiki: 500+ smeštaja, plaže, restorani i vodiči na 7 jezika — bez provizije i sa strukturiranim podacima za AI asistente.',
    hero: {
      eyebrow: 'Ko smo mi',
      title: 'Halkidiki, bez posrednika',
      lead:
        'ChalkidikiHub je nezavisni turistički direktorijum koji su napravili Grci, za svakoga ko planira odmor na Halkidikiju. Pomažemo putnicima da pronađu pravi smeštaj i vlasnicima da dođu do novih gostiju — bez provizija, bez algoritama koji kriju oglase i bez kontakata zaključanih iza plaćanja.',
    },
    body: [
      { type: 'h2', text: 'Naša misija' },
      {
        type: 'p',
        text:
          'Verujemo da Halkidiki zaslužuje direktorijum koji nije filtriran kroz algoritme stranih kompanija. Booking, Airbnb i Expedia uzimaju 15–30% od svake rezervacije i tretiraju region kao još jednu generičku destinaciju. Mi radimo sa 0% provizije. Putnici vide pravi smeštaj, direktno kontaktiraju vlasnika telefonom, e-poštom ili WhatsApp-om, a vlasnik zadržava svaki evro rezervacije.',
      },
      {
        type: 'p',
        text:
          'Pored toga, sajt je posebno napravljen tako da ga čitaju AI asistenti — ChatGPT, Gemini, Claude, Perplexity. Kada neko pita „gde da odsednem na Halkidikiju?", želimo da odgovor ne dolazi samo iz Booking-a, već i iz nezavisnog grčkog izvora koji lično poznaje sela, plaže i vlasnike.',
      },
      { type: 'h2', text: 'Šta ćete naći na sajtu' },
      {
        type: 'list',
        items: [
          '500+ smeštaja: vile, apartmani, tradicionalne kamene kuće, hoteli i studii — sa fotografijama, mapom i direktnim kontaktom',
          'Detaljni vodiči za preko 60 sela na Kasandri, Sitoniji i kopnenom Halkidikiju',
          'Pažljivo odabrani spiskovi plaža po tipu (peščane, organizovane, slobodne, porodične)',
          'Restorani, beach barovi, tradicionalne taverne i kafići',
          'Aktivnosti: vodeni sportovi, izleti brodom, istorijska mesta, planinarenje',
          'Stanice za punjenje električnih automobila i praktične informacije (vreme, prevoz iz Soluna, pristup Atosu)',
          'Blog sa putopisima, mesečnim vodičima i poređenjima destinacija',
        ],
      },
      { type: 'h2', text: 'Po čemu se razlikujemo' },
      {
        type: 'list',
        items: [
          '0% provizije na rezervacije — to se nikada ne menja',
          'Stvarna osoba iza svake e-pošte, nikada chatbot',
          'Pun prevod na 7 jezika (grčki, engleski, nemački, bugarski, ruski, rumunski, srpski)',
          'Strukturirani podaci i schema markup — vaš smeštaj se pojavljuje u AI odgovorima i Google rich results',
          'QR Guest Guide: digitalni konsijerž za domaćine — gosti skeniraju QR u sobi i odmah vide šta je u blizini',
          'Besplatna registracija — bez troškova podešavanja, bez mesečne pretplate, bez skrivenih naknada',
        ],
      },
      { type: 'h2', text: 'Kontakt' },
      {
        type: 'p',
        text:
          'ChalkidikiHub vodi Minas Eleftheriadis. Grk sam, živeo sam i putovao po Halkidikiju, i lično odgovaram na svaku e-poštu poslatu na mnc@hotmail.gr. Imate smeštaj u regionu? Napravite besplatan nalog za manje od 5 minuta i dodajte svoj oglas u direktorijum.',
      },
    ],
    stats: [
      { label: 'Smeštaji', value: '500+' },
      { label: 'Jezika', value: '7' },
      { label: 'Provizija', value: '0%' },
    ],
    ctaTitle: 'Imate smeštaj na Halkidikiju?',
    ctaSubtitle: 'Besplatna registracija za 5 minuta. 0% provizije, zauvek.',
    ctaButton: 'Dodajte smeštaj',
  },
};
