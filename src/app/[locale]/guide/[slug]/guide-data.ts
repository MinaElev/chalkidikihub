type L = Record<string, string>;

export interface Guide {
  slug: string;
  icon: string;
  color: string;
  title: L;
  description: L;
  metaTitle: L;
  metaDesc: L;
  content: L; // HTML content per language
}

export const GUIDES: Guide[] = [
  {
    slug: 'summer', icon: 'Sun', color: 'amber',
    title: { el: 'Καλοκαίρι στη Χαλκιδική', en: 'Summer in Halkidiki', de: 'Sommer in Chalkidiki', bg: 'Лято в Халкидики', ru: 'Лето в Халкидики', ro: 'Vara în Halkidiki' },
    description: { el: 'Ο απόλυτος οδηγός για καλοκαιρινές διακοπές', en: 'The ultimate guide to summer holidays', de: 'Der ultimative Sommerurlaubsführer', bg: 'Пълен пътеводител за лятна ваканция', ru: 'Полный путеводитель по летнему отдыху', ro: 'Ghidul complet pentru vacanța de vară' },
    metaTitle: { el: 'Καλοκαίρι στη Χαλκιδική — Οδηγός | ChalkidikiHub', en: 'Summer in Halkidiki — Guide', de: 'Sommer in Chalkidiki — Reiseführer', bg: 'Лято в Халкидики — Пътеводител', ru: 'Лето в Халкидики — Путеводитель', ro: 'Vara în Halkidiki — Ghid' },
    metaDesc: { el: 'Τα πάντα για τις καλοκαιρινές διακοπές στη Χαλκιδική: παραλίες, νυχτερινή ζωή, φαγητό, καταλύματα, tips.', en: 'Everything about summer holidays in Halkidiki: beaches, nightlife, food, accommodation, tips.', de: 'Alles über Sommerurlaub in Chalkidiki: Strände, Nachtleben, Essen, Unterkunft.', bg: 'Всичко за лятната ваканция в Халкидики: плажове, нощен живот, храна, настаняване.', ru: 'Всё о летнем отдыхе в Халкидики: пляжи, ночная жизнь, еда, проживание.', ro: 'Tot despre vacanța de vară în Halkidiki: plaje, viață de noapte, mâncare, cazare.' },
    content: {
      el: '<h2>Γιατί Χαλκιδική το Καλοκαίρι;</h2><p>Η Χαλκιδική είναι ο <strong>κορυφαίος καλοκαιρινός προορισμός</strong> της Βόρειας Ελλάδας. Με 3 χερσονήσους, 500+ χιλιόμετρα ακτογραμμής και κρυστάλλινα νερά, προσφέρει κάτι για κάθε ταξιδιώτη.</p><h2>Καλύτερη Περίοδος</h2><p>Η ιδανική περίοδος είναι <strong>Ιούνιος-Σεπτέμβριος</strong>. Ο Ιούνιος είναι τέλειος για ήρεμες διακοπές, ενώ Ιούλιος-Αύγουστος είναι η αιχμή με ζωντανή ατμόσφαιρα.</p><h2>Τι να Κάνετε</h2><ul><li><strong>Παραλίες:</strong> Πάνω από 100 παραλίες — αμμώδεις, βοτσαλωτές, οργανωμένες ή ερημικές</li><li><strong>Water sports:</strong> Windsurf, kayak, SUP, jet ski, σκάφη</li><li><strong>Νυχτερινή ζωή:</strong> Beach bars στην Κασσάνδρα, γαλήνη στη Σιθωνία</li><li><strong>Εκδρομές:</strong> Κρουαζιέρα γύρω από τον Άθω, Βουρβουρού νησάκια</li></ul><h2>Πρακτικές Πληροφορίες</h2><ul><li>Θερμοκρασία: 28-35°C, θάλασσα 24-27°C</li><li>Κρατήστε νωρίς — η Χαλκιδική γεμίζει τον Αύγουστο</li><li>Νοικιάστε αυτοκίνητο για να εξερευνήσετε</li></ul>',
      en: '<h2>Why Halkidiki in Summer?</h2><p>Halkidiki is the <strong>top summer destination</strong> of Northern Greece. With 3 peninsulas, 500+ km of coastline, and crystal-clear waters, it offers something for every traveler.</p><h2>Best Time</h2><p>The ideal period is <strong>June-September</strong>. June is perfect for quiet holidays, while July-August is peak season with a lively atmosphere.</p><h2>What to Do</h2><ul><li><strong>Beaches:</strong> Over 100 beaches — sandy, pebble, organized, or secluded</li><li><strong>Water sports:</strong> Windsurf, kayak, SUP, jet ski, boat tours</li><li><strong>Nightlife:</strong> Beach bars in Kassandra, tranquility in Sithonia</li><li><strong>Excursions:</strong> Cruise around Mount Athos, Vourvourou islands</li></ul><h2>Practical Info</h2><ul><li>Temperature: 28-35°C, sea 24-27°C</li><li>Book early — Halkidiki fills up in August</li><li>Rent a car to explore properly</li></ul>',
      de: '<h2>Warum Chalkidiki im Sommer?</h2><p>Chalkidiki ist das <strong>Top-Sommerziel</strong> Nordgriechenlands. Mit 3 Halbinseln, 500+ km Küste und kristallklarem Wasser bietet es für jeden etwas.</p><h2>Beste Reisezeit</h2><p>Die ideale Zeit ist <strong>Juni-September</strong>. Juni ist perfekt für ruhigen Urlaub, Juli-August ist Hochsaison.</p><h2>Was tun</h2><ul><li><strong>Strände:</strong> Über 100 Strände — Sand, Kies, organisiert oder einsam</li><li><strong>Wassersport:</strong> Windsurfen, Kajak, SUP, Jet-Ski</li><li><strong>Nachtleben:</strong> Beach Bars in Kassandra, Ruhe in Sithonia</li></ul><h2>Praktische Infos</h2><ul><li>Temperatur: 28-35°C, Meer 24-27°C</li><li>Frühzeitig buchen — August ist voll</li><li>Mietwagen empfohlen</li></ul>',
      bg: '<h2>Защо Халкидики през лятото?</h2><p>Халкидики е <strong>топ лятна дестинация</strong> в Северна Гърция. С 3 полуострова, 500+ км брегова линия и кристално чисти води.</p><h2>Най-добро време</h2><p>Идеалният период е <strong>юни-септември</strong>.</p><h2>Какво да правите</h2><ul><li><strong>Плажове:</strong> Над 100 плажа</li><li><strong>Водни спортове:</strong> Уиндсърф, каяк, SUP</li><li><strong>Нощен живот:</strong> Плажни барове в Касандра</li></ul>',
      ru: '<h2>Почему Халкидики летом?</h2><p>Халкидики — <strong>главное летнее направление</strong> Северной Греции. 3 полуострова, 500+ км побережья, кристально чистые воды.</p><h2>Лучшее время</h2><p>Идеальный период — <strong>июнь-сентябрь</strong>.</p><h2>Чем заняться</h2><ul><li><strong>Пляжи:</strong> Более 100 пляжей</li><li><strong>Водные виды спорта:</strong> Виндсёрфинг, каяк, SUP</li><li><strong>Ночная жизнь:</strong> Пляжные бары в Кассандре</li></ul>',
      ro: '<h2>De ce Halkidiki vara?</h2><p>Halkidiki este <strong>destinația de vară numărul 1</strong> din nordul Greciei. Cu 3 peninsule, 500+ km de coastă și ape cristalline.</p><h2>Cel mai bun moment</h2><p>Perioada ideală este <strong>iunie-septembrie</strong>.</p><h2>Ce să faceți</h2><ul><li><strong>Plaje:</strong> Peste 100 de plaje</li><li><strong>Sporturi nautice:</strong> Windsurf, caiac, SUP</li><li><strong>Viață de noapte:</strong> Baruri de plajă în Kassandra</li></ul>',
    },
  },
  {
    slug: 'easter', icon: 'Church', color: 'purple',
    title: { el: 'Πάσχα στη Χαλκιδική', en: 'Easter in Halkidiki', de: 'Ostern in Chalkidiki', bg: 'Великден в Халкидики', ru: 'Пасха в Халкидики', ro: 'Paștele în Halkidiki' },
    description: { el: 'Παραδοσιακό Πάσχα δίπλα στη θάλασσα', en: 'Traditional Easter by the sea', de: 'Traditionelles Ostern am Meer', bg: 'Традиционен Великден край морето', ru: 'Традиционная Пасха у моря', ro: 'Paște tradițional lângă mare' },
    metaTitle: { el: 'Πάσχα στη Χαλκιδική | ChalkidikiHub', en: 'Easter in Halkidiki', de: 'Ostern in Chalkidiki', bg: 'Великден в Халкидики', ru: 'Пасха в Халкидики', ro: 'Paștele în Halkidiki' },
    metaDesc: { el: 'Πάσχα στη Χαλκιδική: έθιμα, τοπικές γεύσεις, εκκλησίες, παραδοσιακά χωριά.', en: 'Easter in Halkidiki: customs, local flavors, churches, traditional villages.', de: 'Ostern in Chalkidiki: Bräuche, lokale Aromen, Kirchen, traditionelle Dörfer.', bg: 'Великден в Халкидики: обичаи, местни вкусове, църкви, традиционни села.', ru: 'Пасха в Халкидики: обычаи, местные вкусы, церкви, традиционные деревни.', ro: 'Paștele în Halkidiki: obiceiuri, arome locale, biserici, sate tradiționale.' },
    content: {
      el: '<h2>Πάσχα στη Χαλκιδική</h2><p>Η Χαλκιδική προσφέρει μια <strong>μοναδική πασχαλινή εμπειρία</strong> που συνδυάζει παράδοση, φύση και θάλασσα.</p><h2>Έθιμα & Εκδηλώσεις</h2><ul><li><strong>Μεγάλη Παρασκευή:</strong> Επιτάφιος στα χωριά — Αρναία, Πολύγυρος, Νικήτη</li><li><strong>Ανάσταση:</strong> Πυροτεχνήματα δίπλα στη θάλασσα</li><li><strong>Πασχαλινό τραπέζι:</strong> Αρνί σούβλας, κοκορέτσι, τσουρέκι</li></ul><h2>Πού να Πάτε</h2><p>Τα <strong>ορεινά χωριά</strong> (Αρναία, Παρθενώνας, Ταξιάρχης) προσφέρουν αυθεντική εμπειρία. Οι παραλιακοί οικισμοί είναι ήρεμοι αυτή την εποχή.</p><h2>Καιρός</h2><p>Απρίλιος: 15-22°C, ιδανικός για περιπάτους και εκδρομές.</p>',
      en: '<h2>Easter in Halkidiki</h2><p>Halkidiki offers a <strong>unique Easter experience</strong> combining tradition, nature, and the sea.</p><h2>Customs & Events</h2><ul><li><strong>Good Friday:</strong> Epitaphios procession in villages — Arnea, Polygyros, Nikiti</li><li><strong>Resurrection:</strong> Fireworks by the sea</li><li><strong>Easter table:</strong> Spit-roasted lamb, kokoretsi, tsoureki</li></ul><h2>Where to Go</h2><p><strong>Mountain villages</strong> (Arnea, Parthenonas, Taxiarchis) offer authentic experiences.</p><h2>Weather</h2><p>April: 15-22°C, ideal for walks and excursions.</p>',
      de: '<h2>Ostern in Chalkidiki</h2><p>Chalkidiki bietet ein <strong>einzigartiges Ostererlebnis</strong>: Tradition, Natur und Meer.</p><h2>Bräuche</h2><ul><li><strong>Karfreitag:</strong> Epitaphios-Prozession in Dörfern</li><li><strong>Auferstehung:</strong> Feuerwerk am Meer</li><li><strong>Ostertisch:</strong> Lamm am Spieß, Kokoretsi, Tsoureki</li></ul><h2>Wohin</h2><p>Bergdörfer (Arnea, Parthenonas) bieten authentische Erlebnisse.</p>',
      bg: '<h2>Великден в Халкидики</h2><p>Халкидики предлага <strong>уникално великденско преживяване</strong>.</p><h2>Обичаи</h2><ul><li><strong>Разпети петък:</strong> Литийно шествие в селата</li><li><strong>Великденска трапеза:</strong> Агне на чеверме</li></ul>',
      ru: '<h2>Пасха в Халкидики</h2><p>Халкидики предлагает <strong>уникальный пасхальный опыт</strong>.</p><h2>Обычаи</h2><ul><li><strong>Страстная пятница:</strong> Крестный ход в деревнях</li><li><strong>Пасхальный стол:</strong> Ягнёнок на вертеле</li></ul>',
      ro: '<h2>Paștele în Halkidiki</h2><p>Halkidiki oferă o <strong>experiență pascală unică</strong>.</p><h2>Obiceiuri</h2><ul><li><strong>Vinerea Mare:</strong> Procesiune în sate</li><li><strong>Masa de Paște:</strong> Miel la proțap</li></ul>',
    },
  },
  {
    slug: 'honeymoon', icon: 'Heart', color: 'rose',
    title: { el: 'Γαμήλιο Ταξίδι στη Χαλκιδική', en: 'Honeymoon in Halkidiki', de: 'Flitterwochen in Chalkidiki', bg: 'Меден месец в Халкидики', ru: 'Медовый месяц в Халкидики', ro: 'Luna de miere în Halkidiki' },
    description: { el: 'Ρομαντικός οδηγός για ζευγάρια', en: 'Romantic guide for couples', de: 'Romantischer Reiseführer für Paare', bg: 'Романтичен пътеводител за двойки', ru: 'Романтический путеводитель для пар', ro: 'Ghid romantic pentru cupluri' },
    metaTitle: { el: 'Γαμήλιο Ταξίδι Χαλκιδική | Ρομαντικές Διακοπές', en: 'Honeymoon Halkidiki | Romantic Holidays', de: 'Flitterwochen Chalkidiki', bg: 'Меден месец Халкидики', ru: 'Медовый месяц Халкидики', ro: 'Luna de miere Halkidiki' },
    metaDesc: { el: 'Ρομαντικές διακοπές στη Χαλκιδική: ήρεμες παραλίες, boutique ξενοδοχεία, δείπνο με θέα.', en: 'Romantic holidays in Halkidiki: quiet beaches, boutique hotels, dinner with sea views.', de: 'Romantischer Urlaub in Chalkidiki: ruhige Strände, Boutique-Hotels, Abendessen mit Meerblick.', bg: 'Романтична ваканция в Халкидики: тихи плажове, бутик хотели, вечеря с морска гледка.', ru: 'Романтический отдых в Халкидики: тихие пляжи, бутик-отели, ужин с видом на море.', ro: 'Vacanță romantică în Halkidiki: plaje liniștite, hoteluri boutique, cină cu vedere la mare.' },
    content: {
      el: '<h2>Γιατί Χαλκιδική για Γαμήλιο Ταξίδι;</h2><p>Η Χαλκιδική συνδυάζει <strong>εξωτικές παραλίες, ρομαντικά εστιατόρια και πολυτελή καταλύματα</strong> σε απόσταση αναπνοής.</p><h2>Ρομαντικές Παραλίες</h2><ul><li><strong>Καρύδι:</strong> Τιρκουάζ νερά σε πευκοδάσος</li><li><strong>Πορτοκάλι (Καβουρότρυπες):</strong> Εξωτικό τοπίο</li><li><strong>Σάνη:</strong> Πολυτελής ατμόσφαιρα</li></ul><h2>Ρομαντικά Δείπνα</h2><p>Ταβέρνες δίπλα στη θάλασσα στη <strong>Νικήτη</strong>, gourmet εστιατόρια στη <strong>Σάνη</strong>, ψαροταβέρνες στο <strong>Πόρτο Κουφό</strong>.</p><h2>Tips για Ζευγάρια</h2><ul><li>Προτιμήστε Σιθωνία για ηρεμία</li><li>Σεπτέμβριος = ιδανικός μήνας (ζέστη χωρίς κόσμο)</li><li>Νοικιάστε σκάφος για private εκδρομή</li></ul>',
      en: '<h2>Why Halkidiki for a Honeymoon?</h2><p>Halkidiki combines <strong>exotic beaches, romantic restaurants, and luxury accommodation</strong>.</p><h2>Romantic Beaches</h2><ul><li><strong>Karidi:</strong> Turquoise waters in pine forest</li><li><strong>Orange Beach (Kavourotrypes):</strong> Exotic landscape</li><li><strong>Sani:</strong> Luxurious atmosphere</li></ul><h2>Romantic Dinners</h2><p>Seaside taverns in Nikiti, gourmet restaurants in Sani, fish taverns in Porto Koufo.</p><h2>Tips for Couples</h2><ul><li>Choose Sithonia for tranquility</li><li>September = ideal month</li><li>Rent a boat for a private excursion</li></ul>',
      de: '<h2>Warum Chalkidiki für Flitterwochen?</h2><p>Chalkidiki bietet <strong>exotische Strände, romantische Restaurants und Luxusunterkünfte</strong>.</p><h2>Romantische Strände</h2><ul><li><strong>Karidi:</strong> Türkisfarbenes Wasser</li><li><strong>Orange Beach:</strong> Exotische Landschaft</li></ul><h2>Tipps für Paare</h2><ul><li>Sithonia für Ruhe wählen</li><li>September = idealer Monat</li></ul>',
      bg: '<h2>Защо Халкидики за меден месец?</h2><p>Халкидики предлага <strong>екзотични плажове, романтични ресторанти и луксозно настаняване</strong>.</p><h2>Романтични плажове</h2><ul><li><strong>Кариди</strong></li><li><strong>Портокали</strong></li></ul>',
      ru: '<h2>Почему Халкидики для медового месяца?</h2><p>Халкидики предлагает <strong>экзотические пляжи, романтические рестораны и роскошное размещение</strong>.</p><h2>Романтические пляжи</h2><ul><li><strong>Кариди</strong></li><li><strong>Портокали</strong></li></ul>',
      ro: '<h2>De ce Halkidiki pentru luna de miere?</h2><p>Halkidiki oferă <strong>plaje exotice, restaurante romantice și cazare de lux</strong>.</p><h2>Plaje romantice</h2><ul><li><strong>Karidi</strong></li><li><strong>Portokali</strong></li></ul>',
    },
  },
  {
    slug: 'families', icon: 'Users', color: 'blue',
    title: { el: 'Οικογενειακές Διακοπές Χαλκιδική', en: 'Family Holidays in Halkidiki', de: 'Familienurlaub in Chalkidiki', bg: 'Семейна ваканция в Халкидики', ru: 'Семейный отдых в Халкидики', ro: 'Vacanță în familie în Halkidiki' },
    description: { el: 'Τα πάντα για διακοπές με παιδιά', en: 'Everything for holidays with children', de: 'Alles für Urlaub mit Kindern', bg: 'Всичко за ваканция с деца', ru: 'Всё для отдыха с детьми', ro: 'Tot pentru vacanța cu copiii' },
    metaTitle: { el: 'Οικογενειακές Διακοπές Χαλκιδική | Παιδιά', en: 'Family Holidays Halkidiki | Kids', de: 'Familienurlaub Chalkidiki', bg: 'Семейна ваканция Халкидики', ru: 'Семейный отдых Халкидики', ro: 'Vacanță familie Halkidiki' },
    metaDesc: { el: 'Οικογενειακές διακοπές στη Χαλκιδική: ασφαλείς παραλίες, παιδικές δραστηριότητες, κατάλληλα καταλύματα.', en: 'Family holidays in Halkidiki: safe beaches, kids activities, suitable accommodation.', de: 'Familienurlaub in Chalkidiki: sichere Strände, Kinderaktivitäten, passende Unterkunft.', bg: 'Семейна ваканция: безопасни плажове, занимания за деца, подходящо настаняване.', ru: 'Семейный отдых: безопасные пляжи, детские развлечения, подходящее жильё.', ro: 'Vacanță în familie: plaje sigure, activități pentru copii, cazare potrivită.' },
    content: {
      el: '<h2>Η Χαλκιδική για Οικογένειες</h2><p>Η Χαλκιδική είναι <strong>ιδανική για οικογένειες</strong> με ρηχά νερά, ασφαλείς παραλίες και πολλές δραστηριότητες.</p><h2>Ασφαλείς Παραλίες</h2><ul><li><strong>Καλλιθέα:</strong> Ρηχά νερά, οργανωμένη</li><li><strong>Χανιώτη:</strong> Αμμουδιά, ναυαγοσώστης</li><li><strong>Νικήτη:</strong> Ήρεμη, οικογενειακή</li></ul><h2>Δραστηριότητες για Παιδιά</h2><ul><li>Σπήλαιο Πετραλώνων — εκπαιδευτική εκδρομή</li><li>Water parks και θαλάσσια σπορ</li><li>Βόλτα με καραβάκι γύρω από τον Άθω</li></ul><h2>Πρακτικά Tips</h2><ul><li>Επιλέξτε κατάλυμα με κουζίνα</li><li>Κρατήστε αυτοκίνητο για ευελιξία</li><li>Ιούνιος & Σεπτέμβριος = λιγότερος κόσμος</li></ul>',
      en: '<h2>Halkidiki for Families</h2><p>Halkidiki is <strong>perfect for families</strong> with shallow waters, safe beaches, and many activities.</p><h2>Safe Beaches</h2><ul><li><strong>Kallithea:</strong> Shallow waters, organized</li><li><strong>Hanioti:</strong> Sandy, lifeguard</li><li><strong>Nikiti:</strong> Calm, family-friendly</li></ul><h2>Kids Activities</h2><ul><li>Petralona Cave — educational trip</li><li>Water parks and water sports</li><li>Boat trip around Mount Athos</li></ul><h2>Practical Tips</h2><ul><li>Choose accommodation with kitchen</li><li>Rent a car for flexibility</li><li>June & September = fewer crowds</li></ul>',
      de: '<h2>Chalkidiki für Familien</h2><p>Chalkidiki ist <strong>perfekt für Familien</strong> mit flachem Wasser und sicheren Stränden.</p><h2>Sichere Strände</h2><ul><li><strong>Kallithea:</strong> Flaches Wasser, organisiert</li><li><strong>Hanioti:</strong> Sandig, Rettungsschwimmer</li></ul><h2>Aktivitäten für Kinder</h2><ul><li>Petralona-Höhle</li><li>Wasserparks und Wassersport</li></ul>',
      bg: '<h2>Халкидики за семейства</h2><p>Халкидики е <strong>идеална за семейства</strong> с плитки води и безопасни плажове.</p><h2>Безопасни плажове</h2><ul><li><strong>Калитея</strong></li><li><strong>Ханиоти</strong></li></ul>',
      ru: '<h2>Халкидики для семей</h2><p>Халкидики — <strong>идеальное место для семей</strong> с мелководьем и безопасными пляжами.</p><h2>Безопасные пляжи</h2><ul><li><strong>Каллифея</strong></li><li><strong>Ханиоти</strong></li></ul>',
      ro: '<h2>Halkidiki pentru familii</h2><p>Halkidiki este <strong>perfectă pentru familii</strong> cu ape puțin adânci și plaje sigure.</p><h2>Plaje sigure</h2><ul><li><strong>Kallithea</strong></li><li><strong>Hanioti</strong></li></ul>',
    },
  },
  {
    slug: 'budget', icon: 'Wallet', color: 'green',
    title: { el: 'Budget Διακοπές Χαλκιδική', en: 'Budget Holidays in Halkidiki', de: 'Günstig in Chalkidiki', bg: 'Евтина ваканция в Халкидики', ru: 'Бюджетный отдых в Халкидики', ro: 'Vacanță ieftină în Halkidiki' },
    description: { el: 'Πώς να κάνεις φτηνές διακοπές', en: 'How to holiday on a budget', de: 'Günstig Urlaub machen', bg: 'Как да почивате евтино', ru: 'Как отдохнуть бюджетно', ro: 'Cum să faci vacanță ieftin' },
    metaTitle: { el: 'Φτηνές Διακοπές Χαλκιδική | Budget Tips', en: 'Budget Holidays Halkidiki', de: 'Günstig Chalkidiki', bg: 'Евтина ваканция Халкидики', ru: 'Бюджетный отдых Халкидики', ro: 'Vacanță ieftină Halkidiki' },
    metaDesc: { el: 'Φτηνές διακοπές στη Χαλκιδική: δωρεάν παραλίες, οικονομικά καταλύματα, tips εξοικονόμησης.', en: 'Budget holidays in Halkidiki: free beaches, affordable accommodation, saving tips.', de: 'Günstiger Urlaub: freie Strände, erschwingliche Unterkunft, Spartipps.', bg: 'Евтина ваканция: безплатни плажове, достъпно настаняване, съвети.', ru: 'Бюджетный отдых: бесплатные пляжи, доступное жильё, советы.', ro: 'Vacanță ieftină: plaje gratuite, cazare accesibilă, sfaturi.' },
    content: {
      el: '<h2>Φτηνές Διακοπές στη Χαλκιδική</h2><p>Η Χαλκιδική προσφέρει <strong>εξαιρετικές διακοπές με χαμηλό budget</strong>. Δείτε πώς.</p><h2>Δωρεάν Παραλίες</h2><p>Οι περισσότερες παραλίες είναι <strong>δωρεάν</strong>. Αποφύγετε τις οργανωμένες και πηγαίνετε στις ελεύθερες.</p><h2>Φτηνή Διαμονή</h2><ul><li>Ενοικιαζόμενα δωμάτια αντί ξενοδοχεία</li><li>Camping — πολλά campings στη Σιθωνία</li><li>Κρατήστε νωρίς για καλύτερες τιμές</li></ul><h2>Φαγητό</h2><ul><li>Σουβλατζίδικα και ψητοπωλεία — 5-8€/άτομο</li><li>Μαγειρέψτε στο κατάλυμα</li><li>Λαϊκές αγορές για φρέσκα φρούτα</li></ul><h2>Tips Εξοικονόμησης</h2><ul><li>Ιούνιος & Σεπτέμβριος = χαμηλότερες τιμές</li><li>ΚΤΕΛ αντί αυτοκινήτου</li><li>Δωρεάν δραστηριότητες: πεζοπορία, σπήλαια, χωριά</li></ul>',
      en: '<h2>Budget Holidays in Halkidiki</h2><p>Halkidiki offers <strong>great holidays on a low budget</strong>.</p><h2>Free Beaches</h2><p>Most beaches are <strong>free</strong>. Skip organized ones and go to free beaches.</p><h2>Cheap Accommodation</h2><ul><li>Rental rooms instead of hotels</li><li>Camping — many campsites in Sithonia</li><li>Book early for better prices</li></ul><h2>Food</h2><ul><li>Souvlaki shops — €5-8/person</li><li>Cook at your accommodation</li><li>Local markets for fresh fruit</li></ul><h2>Saving Tips</h2><ul><li>June & September = lower prices</li><li>Bus (KTEL) instead of car</li><li>Free activities: hiking, caves, villages</li></ul>',
      de: '<h2>Günstiger Urlaub in Chalkidiki</h2><p>Chalkidiki bietet <strong>tollen Urlaub mit kleinem Budget</strong>.</p><h2>Kostenlose Strände</h2><p>Die meisten Strände sind <strong>kostenlos</strong>.</p><h2>Günstige Unterkunft</h2><ul><li>Zimmer statt Hotels</li><li>Camping in Sithonia</li></ul><h2>Spartipps</h2><ul><li>Juni & September = niedrigere Preise</li><li>Bus statt Mietwagen</li></ul>',
      bg: '<h2>Евтина ваканция в Халкидики</h2><p>Халкидики предлага <strong>страхотна ваканция с нисък бюджет</strong>.</p><h2>Безплатни плажове</h2><p>Повечето плажове са <strong>безплатни</strong>.</p><h2>Евтино настаняване</h2><ul><li>Стаи под наем вместо хотели</li><li>Къмпинг в Ситония</li></ul>',
      ru: '<h2>Бюджетный отдых в Халкидики</h2><p>Халкидики предлагает <strong>отличный отдых с небольшим бюджетом</strong>.</p><h2>Бесплатные пляжи</h2><p>Большинство пляжей <strong>бесплатные</strong>.</p><h2>Дешёвое жильё</h2><ul><li>Комнаты вместо отелей</li><li>Кемпинг в Ситонии</li></ul>',
      ro: '<h2>Vacanță ieftină în Halkidiki</h2><p>Halkidiki oferă <strong>vacanță excelentă cu buget redus</strong>.</p><h2>Plaje gratuite</h2><p>Majoritatea plajelor sunt <strong>gratuite</strong>.</p><h2>Cazare ieftină</h2><ul><li>Camere în loc de hoteluri</li><li>Camping în Sithonia</li></ul>',
    },
  },
  {
    slug: 'winter', icon: 'Snowflake', color: 'blue',
    title: { el: 'Χειμώνας στη Χαλκιδική', en: 'Winter in Halkidiki', de: 'Winter in Chalkidiki', bg: 'Зима в Халкидики', ru: 'Зима в Халкидики', ro: 'Iarna în Halkidiki' },
    description: { el: 'Χαλκιδική εκτός σεζόν', en: 'Halkidiki off-season', de: 'Chalkidiki außerhalb der Saison', bg: 'Халкидики извън сезона', ru: 'Халкидики вне сезона', ro: 'Halkidiki în afara sezonului' },
    metaTitle: { el: 'Χειμώνας στη Χαλκιδική | Εκτός Σεζόν', en: 'Winter in Halkidiki | Off Season', de: 'Winter Chalkidiki', bg: 'Зима в Халкидики', ru: 'Зима в Халкидики', ro: 'Iarna în Halkidiki' },
    metaDesc: { el: 'Η Χαλκιδική τον χειμώνα: ορεινά χωριά, τοπικές γεύσεις, πεζοπορία, spa, χαμηλές τιμές.', en: 'Halkidiki in winter: mountain villages, local flavors, hiking, spa, low prices.', de: 'Chalkidiki im Winter: Bergdörfer, lokale Aromen, Wandern, Spa, niedrige Preise.', bg: 'Халкидики през зимата: планински села, местни вкусове, пешеходни маршрути, ниски цени.', ru: 'Халкидики зимой: горные деревни, местные вкусы, пешие прогулки, низкие цены.', ro: 'Halkidiki iarna: sate montane, arome locale, drumeții, prețuri mici.' },
    content: {
      el: '<h2>Χαλκιδική τον Χειμώνα</h2><p>Η Χαλκιδική δεν είναι μόνο καλοκαιρινός προορισμός. Τον <strong>χειμώνα αποκαλύπτει μια εντελώς διαφορετική πλευρά</strong>.</p><h2>Ορεινά Χωριά</h2><ul><li><strong>Αρναία:</strong> Παραδοσιακή αρχιτεκτονική, μέλι, τσίπουρο</li><li><strong>Ταξιάρχης:</strong> Ελατοδάσος, πεζοπορία</li><li><strong>Παρθενώνας:</strong> Πέτρινα σπίτια, θέα Σιθωνία</li></ul><h2>Δραστηριότητες</h2><ul><li>Πεζοπορία στα μονοπάτια</li><li>Σπήλαιο Πετραλώνων</li><li>Τοπικές ταβέρνες με κρεατικά</li><li>Spa & wellness</li></ul><h2>Γιατί Χειμώνα;</h2><p>Χαμηλές τιμές, μηδενικός συνωστισμός, αυθεντικές εμπειρίες.</p>',
      en: '<h2>Halkidiki in Winter</h2><p>Halkidiki is not just a summer destination. In <strong>winter it reveals a completely different side</strong>.</p><h2>Mountain Villages</h2><ul><li><strong>Arnea:</strong> Traditional architecture, honey, tsipouro</li><li><strong>Taxiarchis:</strong> Fir forest, hiking</li><li><strong>Parthenonas:</strong> Stone houses, Sithonia views</li></ul><h2>Activities</h2><ul><li>Hiking trails</li><li>Petralona Cave</li><li>Local taverns with meat dishes</li><li>Spa & wellness</li></ul><h2>Why Winter?</h2><p>Low prices, zero crowds, authentic experiences.</p>',
      de: '<h2>Chalkidiki im Winter</h2><p>Chalkidiki ist nicht nur ein Sommerziel. Im <strong>Winter zeigt es eine völlig andere Seite</strong>.</p><h2>Bergdörfer</h2><ul><li><strong>Arnea:</strong> Traditionelle Architektur</li><li><strong>Taxiarchis:</strong> Tannenwald, Wandern</li></ul><h2>Warum Winter?</h2><p>Niedrige Preise, keine Massen, authentische Erlebnisse.</p>',
      bg: '<h2>Халкидики през зимата</h2><p>Халкидики не е само лятна дестинация. <strong>През зимата разкрива съвсем различна страна</strong>.</p><h2>Планински села</h2><ul><li><strong>Арнеа</strong></li><li><strong>Таксиархис</strong></li></ul>',
      ru: '<h2>Халкидики зимой</h2><p>Халкидики — не только летнее направление. <strong>Зимой полуостров открывается с другой стороны</strong>.</p><h2>Горные деревни</h2><ul><li><strong>Арнея</strong></li><li><strong>Таксиархис</strong></li></ul>',
      ro: '<h2>Halkidiki iarna</h2><p>Halkidiki nu este doar o destinație de vară. <strong>Iarna dezvăluie o latură complet diferită</strong>.</p><h2>Sate montane</h2><ul><li><strong>Arnea</strong></li><li><strong>Taxiarchis</strong></li></ul>',
    },
  },
  {
    slug: 'nightlife', icon: 'Music', color: 'violet',
    title: { el: 'Νυχτερινή Ζωή Χαλκιδικής', en: 'Halkidiki Nightlife', de: 'Nachtleben in Chalkidiki', bg: 'Нощен живот в Халкидики', ru: 'Ночная жизнь Халкидики', ro: 'Viața de noapte în Halkidiki' },
    description: { el: 'Bars, clubs, beach parties', en: 'Bars, clubs, beach parties', de: 'Bars, Clubs, Beach-Partys', bg: 'Барове, клубове, плажни партита', ru: 'Бары, клубы, пляжные вечеринки', ro: 'Baruri, cluburi, petreceri pe plajă' },
    metaTitle: { el: 'Νυχτερινή Ζωή Χαλκιδικής | Bars & Clubs', en: 'Halkidiki Nightlife | Bars & Clubs', de: 'Nachtleben Chalkidiki', bg: 'Нощен живот Халкидики', ru: 'Ночная жизнь Халкидики', ro: 'Viața de noapte Halkidiki' },
    metaDesc: { el: 'Νυχτερινή ζωή Χαλκιδικής: beach bars, clubs, live music, beach parties στην Κασσάνδρα και Σιθωνία.', en: 'Halkidiki nightlife: beach bars, clubs, live music, beach parties in Kassandra and Sithonia.', de: 'Nachtleben Chalkidiki: Beach Bars, Clubs, Live-Musik, Beach-Partys.', bg: 'Нощен живот: плажни барове, клубове, жива музика, плажни партита.', ru: 'Ночная жизнь: пляжные бары, клубы, живая музыка, пляжные вечеринки.', ro: 'Viața de noapte: baruri de plajă, cluburi, muzică live, petreceri.' },
    content: {
      el: '<h2>Νυχτερινή Ζωή στη Χαλκιδική</h2><p>Η Χαλκιδική έχει <strong>ζωντανή νυχτερινή ζωή</strong>, κυρίως στην Κασσάνδρα.</p><h2>Κασσάνδρα — Η Βασίλισσα</h2><ul><li><strong>Χανιώτη:</strong> Πεζόδρομος γεμάτος bars και clubs</li><li><strong>Πευκοχώρι:</strong> Beach bars δίπλα στη θάλασσα</li><li><strong>Καλλιθέα:</strong> Ζωντανή ατμόσφαιρα</li></ul><h2>Σιθωνία — Χαλαρή Ατμόσφαιρα</h2><p>Η Σιθωνία είναι πιο ήρεμη αλλά στη <strong>Νικήτη</strong> και τη <strong>Σάρτη</strong> υπάρχουν εξαιρετικά cocktail bars.</p><h2>Tips</h2><ul><li>Η ζωή ξεκινά μετά τις 23:00</li><li>Beach parties κυρίως Ιούλιο-Αύγουστο</li><li>Dress code: casual chic</li></ul>',
      en: '<h2>Nightlife in Halkidiki</h2><p>Halkidiki has <strong>vibrant nightlife</strong>, especially in Kassandra.</p><h2>Kassandra — The Queen</h2><ul><li><strong>Hanioti:</strong> Pedestrian street full of bars and clubs</li><li><strong>Pefkohori:</strong> Beach bars by the sea</li><li><strong>Kallithea:</strong> Lively atmosphere</li></ul><h2>Sithonia — Relaxed Vibes</h2><p>Sithonia is quieter but <strong>Nikiti</strong> and <strong>Sarti</strong> have excellent cocktail bars.</p><h2>Tips</h2><ul><li>Nightlife starts after 23:00</li><li>Beach parties mainly July-August</li><li>Dress code: casual chic</li></ul>',
      de: '<h2>Nachtleben in Chalkidiki</h2><p>Chalkidiki hat <strong>lebhaftes Nachtleben</strong>, besonders in Kassandra.</p><h2>Kassandra</h2><ul><li><strong>Hanioti:</strong> Fußgängerzone voller Bars</li><li><strong>Pefkohori:</strong> Beach Bars</li></ul>',
      bg: '<h2>Нощен живот в Халкидики</h2><p>Халкидики има <strong>оживен нощен живот</strong>, особено в Касандра.</p><h2>Касандра</h2><ul><li><strong>Ханиоти:</strong> Пешеходна зона с барове</li></ul>',
      ru: '<h2>Ночная жизнь Халкидики</h2><p>Халкидики отличается <strong>оживлённой ночной жизнью</strong>, особенно в Кассандре.</p><h2>Кассандра</h2><ul><li><strong>Ханиоти:</strong> Пешеходная улица с барами</li></ul>',
      ro: '<h2>Viața de noapte în Halkidiki</h2><p>Halkidiki are <strong>viață de noapte vibrantă</strong>, mai ales în Kassandra.</p><h2>Kassandra</h2><ul><li><strong>Hanioti:</strong> Stradă pietonală cu baruri</li></ul>',
    },
  },
  // ── Monthly guides ──
  {
    slug: 'june', icon: 'Sun', color: 'sky',
    title: { el: 'Χαλκιδική τον Ιούνιο', en: 'Halkidiki in June', de: 'Chalkidiki im Juni', bg: 'Халкидики през юни', ru: 'Халкидики в июне', ro: 'Halkidiki în iunie', sr: 'Halkidiki u junu' },
    description: { el: 'Ο ιδανικός μήνας για ήρεμες διακοπές', en: 'The perfect month for peaceful holidays', de: 'Der perfekte Monat für ruhigen Urlaub', bg: 'Идеалният месец за спокойна почивка', ru: 'Идеальный месяц для спокойного отдыха', ro: 'Luna perfectă pentru vacanță liniștită', sr: 'Idealan mesec za miran odmor' },
    metaTitle: { el: 'Χαλκιδική τον Ιούνιο — Καιρός, Παραλίες, Tips | ChalkidikiHub', en: 'Halkidiki in June — Weather, Beaches, Tips', de: 'Chalkidiki im Juni — Wetter, Strände, Tipps', bg: 'Халкидики през юни — Време, Плажове', ru: 'Халкидики в июне — Погода, Пляжи', ro: 'Halkidiki în iunie — Vreme, Plaje', sr: 'Halkidiki u junu — Vreme, Plaže' },
    metaDesc: { el: 'Χαλκιδική Ιούνιος: θερμοκρασία 28°C, θάλασσα 23°C, ήρεμες παραλίες, χαμηλές τιμές. Ο τέλειος μήνας για διακοπές.', en: 'Halkidiki June: 28°C, sea 23°C, quiet beaches, lower prices. The perfect month for holidays.', de: 'Chalkidiki Juni: 28°C, Meer 23°C, ruhige Strände, niedrige Preise.', bg: 'Халкидики юни: 28°C, море 23°C, тихи плажове, ниски цени.', ru: 'Халкидики июнь: 28°C, море 23°C, тихие пляжи, низкие цены.', ro: 'Halkidiki iunie: 28°C, mare 23°C, plaje liniștite, prețuri mici.', sr: 'Halkidiki jun: 28°C, more 23°C, mirne plaže, niske cene.' },
    content: {
      el: '<h2>Γιατί Ιούνιος;</h2><p>Ο Ιούνιος είναι ο <strong>κρυφός θησαυρός</strong> της Χαλκιδικής. Ζέστη χωρίς καύσωνα, άδειες παραλίες, χαμηλότερες τιμές.</p><h2>Καιρός</h2><ul><li><strong>Θερμοκρασία αέρα:</strong> 25-30°C</li><li><strong>Θάλασσα:</strong> 22-24°C — ιδανική για κολύμπι</li><li><strong>Βροχές:</strong> Σχεδόν μηδενικές</li><li><strong>Ώρες ηλιοφάνειας:</strong> 14+ ώρες/ημέρα</li></ul><h2>Γιατί είναι ιδανικός</h2><ul><li>✅ Λιγότερος κόσμος — οι παραλίες είναι ήρεμες</li><li>✅ Χαμηλότερες τιμές σε καταλύματα (20-30% κάτω από Ιούλιο)</li><li>✅ Ιδανικός για οικογένειες με μικρά παιδιά</li><li>✅ Φύση σε πλήρη άνθιση — πράσινο τοπίο</li><li>✅ Εστιατόρια χωρίς αναμονή</li></ul><h2>Τι να Κάνετε</h2><ul><li>🏖️ Εξερευνήστε κρυφές παραλίες χωρίς κόσμο</li><li>🥾 Πεζοπορία πριν ζεστάνει πολύ</li><li>🍷 Wine tasting στα τοπικά οινοποιεία</li><li>⛵ Κρουαζιέρα γύρω από τον Άθω</li><li>🐟 Φρέσκο ψάρι σε ψαροχώρια</li></ul><h2>Πρακτικά Tips</h2><ul><li>Κρατήστε νωρίς — ο Ιούνιος γεμίζει γρήγορα πλέον</li><li>Νοικιάστε αυτοκίνητο — τα ΚΤΕΛ δεν καλύπτουν τα πάντα</li><li>Πάρτε αντηλιακό — ο ήλιος είναι ήδη δυνατός</li></ul>',
      en: '<h2>Why June?</h2><p>June is Halkidiki\'s <strong>hidden gem</strong>. Warm without heatwaves, empty beaches, lower prices.</p><h2>Weather</h2><ul><li><strong>Air temperature:</strong> 25-30°C</li><li><strong>Sea:</strong> 22-24°C — perfect for swimming</li><li><strong>Rain:</strong> Almost none</li><li><strong>Sunshine:</strong> 14+ hours/day</li></ul><h2>Why it\'s ideal</h2><ul><li>✅ Fewer crowds — beaches are peaceful</li><li>✅ Lower prices (20-30% less than July)</li><li>✅ Great for families with young kids</li><li>✅ Nature in full bloom — green landscape</li><li>✅ Restaurants without waiting</li></ul><h2>What to Do</h2><ul><li>🏖️ Explore hidden beaches without crowds</li><li>🥾 Hiking before it gets too hot</li><li>🍷 Wine tasting at local wineries</li><li>⛵ Cruise around Mount Athos</li><li>🐟 Fresh fish in fishing villages</li></ul><h2>Practical Tips</h2><ul><li>Book early — June fills up fast now</li><li>Rent a car — buses don\'t cover everything</li><li>Bring sunscreen — the sun is already strong</li></ul>',
      de: '<h2>Warum Juni?</h2><p>Juni ist Chalkidikis <strong>Geheimtipp</strong>. Warm ohne Hitzewelle, leere Strände, niedrigere Preise.</p><h2>Wetter</h2><ul><li><strong>Luft:</strong> 25-30°C</li><li><strong>Meer:</strong> 22-24°C</li><li><strong>Regen:</strong> Fast keiner</li></ul><h2>Aktivitäten</h2><ul><li>Versteckte Strände entdecken</li><li>Wandern vor der Hitze</li><li>Weinverkostung in lokalen Weingütern</li><li>Bootstour um den Berg Athos</li></ul>',
      bg: '<h2>Защо юни?</h2><p>Юни е <strong>скритото съкровище</strong> на Халкидики. Топло без жега, празни плажове, по-ниски цени.</p><h2>Време</h2><ul><li><strong>Температура:</strong> 25-30°C</li><li><strong>Море:</strong> 22-24°C</li></ul><h2>Какво да правите</h2><ul><li>Открийте скрити плажове</li><li>Разходки в природата</li><li>Круиз около Атон</li></ul>',
      ru: '<h2>Почему июнь?</h2><p>Июнь — <strong>скрытая жемчужина</strong> Халкидики. Тепло без жары, пустые пляжи, низкие цены.</p><h2>Погода</h2><ul><li><strong>Воздух:</strong> 25-30°C</li><li><strong>Море:</strong> 22-24°C</li></ul><h2>Чем заняться</h2><ul><li>Скрытые пляжи без толп</li><li>Пешие прогулки</li><li>Круиз вокруг Афона</li></ul>',
      ro: '<h2>De ce iunie?</h2><p>Iunie este <strong>comoara ascunsă</strong> a Halkidiki. Cald fără caniculă, plaje goale, prețuri mai mici.</p><h2>Vreme</h2><ul><li><strong>Temperatură:</strong> 25-30°C</li><li><strong>Mare:</strong> 22-24°C</li></ul><h2>Ce să faci</h2><ul><li>Descoperă plaje ascunse</li><li>Drumeții</li><li>Croazieră în jurul Muntelui Athos</li></ul>',
      sr: '<h2>Zašto jun?</h2><p>Jun je <strong>skriveno blago</strong> Halkidikija. Toplo bez vrućina, prazne plaže, niže cene.</p><h2>Vreme</h2><ul><li><strong>Temperatura:</strong> 25-30°C</li><li><strong>More:</strong> 22-24°C</li></ul>',
    },
  },
  {
    slug: 'july-august', icon: 'Thermometer', color: 'red',
    title: { el: 'Χαλκιδική Ιούλιο & Αύγουστο', en: 'Halkidiki in July & August', de: 'Chalkidiki im Juli & August', bg: 'Халкидики юли-август', ru: 'Халкидики в июле-августе', ro: 'Halkidiki în iulie-august', sr: 'Halkidiki u julu i avgustu' },
    description: { el: 'Peak season — ζέστη, ζωή, ενέργεια', en: 'Peak season — heat, life, energy', de: 'Hochsaison — Hitze, Leben, Energie', bg: 'Пик сезон — жега, живот, енергия', ru: 'Пик сезона — жара, жизнь, энергия', ro: 'Vârf de sezon — căldură, viață, energie', sr: 'Vrh sezone — vrućina, život, energija' },
    metaTitle: { el: 'Χαλκιδική Ιούλιο-Αύγουστο — Ό,τι Πρέπει να Ξέρετε', en: 'Halkidiki July-August — Everything You Need to Know', de: 'Chalkidiki Juli-August — Alles Wissenswerte', bg: 'Халкидики юли-август — Всичко, което трябва да знаете', ru: 'Халкидики июль-август — Всё, что нужно знать', ro: 'Halkidiki iulie-august — Tot ce trebuie să știți', sr: 'Halkidiki jul-avgust — Sve što treba da znate' },
    metaDesc: { el: 'Χαλκιδική Ιούλιος-Αύγουστος: 35°C, beach parties, κόσμος, τιμές. Tips για κρατήσεις, ήρεμες παραλίες, εστιατόρια.', en: 'Halkidiki July-August: 35°C, beach parties, crowds, prices. Tips for bookings, quiet beaches, restaurants.', de: 'Chalkidiki Juli-August: 35°C, Beach-Partys, Menschenmassen, Preise.', bg: 'Халкидики юли-август: 35°C, плажни партита, тълпи, цени.', ru: 'Халкидики июль-август: 35°C, пляжные вечеринки, толпы, цены.', ro: 'Halkidiki iulie-august: 35°C, petreceri, mulțimi, prețuri.', sr: 'Halkidiki jul-avgust: 35°C, plaž-žurke, gužve, cene.' },
    content: {
      el: '<h2>Peak Season στη Χαλκιδική</h2><p>Ιούλιος και Αύγουστος είναι οι <strong>πιο δημοφιλείς μήνες</strong>. Ζέστη, κόσμος, ενέργεια — αλλά και υψηλότερες τιμές.</p><h2>Καιρός</h2><ul><li><strong>Θερμοκρασία:</strong> 30-38°C (σκιά)</li><li><strong>Θάλασσα:</strong> 25-28°C — ζεστή!</li><li><strong>Βροχές:</strong> Σχεδόν αδύνατες</li><li><strong>Μελτέμι:</strong> Μπορεί να φυσάει αρκετά</li></ul><h2>Πλεονεκτήματα</h2><ul><li>🎉 Ζωντανή ατμόσφαιρα παντού</li><li>🎵 Beach parties & live music</li><li>🌊 Ζεστή θάλασσα — ιδανική και τη νύχτα</li><li>🍽️ Όλα τα εστιατόρια ανοιχτά</li></ul><h2>Μειονεκτήματα & Tips</h2><ul><li>⚠️ Κρατήστε κατάλυμα 2-3 μήνες νωρίτερα</li><li>⚠️ Αποφύγετε παραλίες σε ΣΚ — πάτε καθημερινές</li><li>⚠️ Ψάξτε παραλίες στη νότια Σιθωνία για ηρεμία</li><li>💡 Πηγαίνετε παραλία πριν τις 10:00 ή μετά τις 17:00</li><li>💡 Κρατήστε τραπέζι σε εστιατόρια</li></ul><h2>Ήρεμες Εναλλακτικές</h2><p>Αν θέλετε ηρεμία ακόμα και τον Αύγουστο:</p><ul><li><strong>Πόρτο Κουφό</strong> — κρυφός κόλπος</li><li><strong>Τορώνη</strong> — μακριά από την αιχμή</li><li><strong>Αρμενιστής</strong> — μεγάλη παραλία, χωράει κόσμο</li></ul>',
      en: '<h2>Peak Season in Halkidiki</h2><p>July and August are the <strong>most popular months</strong>. Heat, crowds, energy — but also higher prices.</p><h2>Weather</h2><ul><li><strong>Temperature:</strong> 30-38°C (shade)</li><li><strong>Sea:</strong> 25-28°C — warm!</li><li><strong>Rain:</strong> Almost impossible</li></ul><h2>Advantages</h2><ul><li>🎉 Lively atmosphere everywhere</li><li>🎵 Beach parties & live music</li><li>🌊 Warm sea — perfect even at night</li></ul><h2>Disadvantages & Tips</h2><ul><li>⚠️ Book accommodation 2-3 months ahead</li><li>⚠️ Avoid beaches on weekends</li><li>⚠️ Look for beaches in southern Sithonia for peace</li><li>💡 Go to the beach before 10:00 or after 17:00</li></ul><h2>Peaceful Alternatives</h2><ul><li><strong>Porto Koufo</strong> — hidden bay</li><li><strong>Toroni</strong> — away from peak</li><li><strong>Armenistis</strong> — big beach, plenty of space</li></ul>',
      de: '<h2>Hochsaison in Chalkidiki</h2><p>Juli und August sind die <strong>beliebtesten Monate</strong>.</p><h2>Wetter</h2><ul><li><strong>Temperatur:</strong> 30-38°C</li><li><strong>Meer:</strong> 25-28°C</li></ul><h2>Tipps</h2><ul><li>Unterkunft 2-3 Monate vorher buchen</li><li>Strände unter der Woche besuchen</li><li>Südliche Sithonia für Ruhe</li></ul>',
      bg: '<h2>Пик сезон в Халкидики</h2><p>Юли и август са <strong>най-популярните месеци</strong>.</p><h2>Време</h2><ul><li><strong>Температура:</strong> 30-38°C</li><li><strong>Море:</strong> 25-28°C</li></ul><h2>Съвети</h2><ul><li>Резервирайте 2-3 месеца предварително</li><li>Посетете плажа в делнични дни</li></ul>',
      ru: '<h2>Пик сезона в Халкидики</h2><p>Июль и август — <strong>самые популярные месяцы</strong>.</p><h2>Погода</h2><ul><li><strong>Температура:</strong> 30-38°C</li><li><strong>Море:</strong> 25-28°C</li></ul><h2>Советы</h2><ul><li>Бронируйте за 2-3 месяца</li><li>Пляжи в будни</li></ul>',
      ro: '<h2>Vârf de sezon</h2><p>Iulie și august sunt <strong>cele mai populare luni</strong>.</p><h2>Vreme</h2><ul><li><strong>Temperatură:</strong> 30-38°C</li><li><strong>Mare:</strong> 25-28°C</li></ul>',
      sr: '<h2>Vrh sezone u Halkidikiju</h2><p>Jul i avgust su <strong>najpopularniji meseci</strong>.</p><h2>Vreme</h2><ul><li><strong>Temperatura:</strong> 30-38°C</li><li><strong>More:</strong> 25-28°C</li></ul>',
    },
  },
  {
    slug: 'september', icon: 'Sunset', color: 'orange',
    title: { el: 'Χαλκιδική τον Σεπτέμβριο', en: 'Halkidiki in September', de: 'Chalkidiki im September', bg: 'Халкидики през септември', ru: 'Халкидики в сентябре', ro: 'Halkidiki în septembrie', sr: 'Halkidiki u septembru' },
    description: { el: 'Ο χρυσός μήνας — ζέστη, ηρεμία, χαμηλές τιμές', en: 'The golden month — warmth, peace, lower prices', de: 'Der goldene Monat — Wärme, Ruhe, niedrige Preise', bg: 'Златният месец — топлина, спокойствие, ниски цени', ru: 'Золотой месяц — тепло, спокойствие, низкие цены', ro: 'Luna de aur — căldură, liniște, prețuri mici', sr: 'Zlatni mesec — toplota, mir, niske cene' },
    metaTitle: { el: 'Χαλκιδική Σεπτέμβριο — Ο Καλύτερος Μήνας; | ChalkidikiHub', en: 'Halkidiki in September — The Best Month?', de: 'Chalkidiki September — Der beste Monat?', bg: 'Халкидики септември — Най-добрият месец?', ru: 'Халкидики сентябрь — Лучший месяц?', ro: 'Halkidiki septembrie — Cea mai bună lună?', sr: 'Halkidiki septembar — Najbolji mesec?' },
    metaDesc: { el: 'Χαλκιδική Σεπτέμβριος: 28°C, ζεστή θάλασσα 26°C, άδειες παραλίες, τιμές πτώσης. Ο μυστικός καλύτερος μήνας.', en: 'Halkidiki September: 28°C, warm sea 26°C, empty beaches, falling prices. The secret best month.', de: 'Chalkidiki September: 28°C, warmes Meer 26°C, leere Strände, fallende Preise.', bg: 'Халкидики септември: 28°C, топло море 26°C, празни плажове, намалени цени.', ru: 'Халкидики сентябрь: 28°C, тёплое море 26°C, пустые пляжи, падающие цены.', ro: 'Halkidiki septembrie: 28°C, mare caldă 26°C, plaje goale, prețuri în scădere.', sr: 'Halkidiki septembar: 28°C, toplo more 26°C, prazne plaže, niže cene.' },
    content: {
      el: '<h2>Σεπτέμβριος — Ο Μυστικός Θησαυρός</h2><p>Πολλοί ντόπιοι θεωρούν τον Σεπτέμβριο τον <strong>καλύτερο μήνα</strong> για τη Χαλκιδική. Και έχουν δίκιο.</p><h2>Καιρός</h2><ul><li><strong>Αέρας:</strong> 25-30°C — τέλειος</li><li><strong>Θάλασσα:</strong> 25-27°C — πιο ζεστή από τον Ιούνιο!</li><li><strong>Βροχές:</strong> Σπάνιες (1-2 βροχές τον μήνα)</li></ul><h2>Γιατί είναι ο καλύτερος μήνας</h2><ul><li>🏖️ Παραλίες σχεδόν άδειες μετά τις 10 Σεπτεμβρίου</li><li>💰 Τιμές πέφτουν 30-40% σε σχέση με Αύγουστο</li><li>🌊 Η θάλασσα έχει αποθηκεύσει ολόκληρο το καλοκαίρι ζέστη</li><li>🍇 Σεζόν σταφυλιών — τρυγητός, κρασί, γιορτές</li><li>🌅 Τα πιο όμορφα ηλιοβασιλέματα του χρόνου</li></ul><h2>Τι να Κάνετε</h2><ul><li>🏊 Κολύμπι σε εγκαταλελειμμένες παραλίες</li><li>🍷 Γιορτές κρασιού & τρυγητού</li><li>🥾 Πεζοπορία χωρίς ζέστη</li><li>🚴 Ποδηλασία στην ενδοχώρα</li><li>🍽️ Φρέσκα σύκα, σταφύλια, ελιές</li></ul><h2>Για Ποιους;</h2><ul><li>✅ Ζευγάρια — ρομαντική ατμόσφαιρα</li><li>✅ Ηλικιωμένοι — ιδανική θερμοκρασία</li><li>✅ Φωτογράφοι — μαγικό φως</li><li>✅ Digital nomads — ησυχία + καλό internet</li></ul>',
      en: '<h2>September — The Secret Treasure</h2><p>Many locals consider September the <strong>best month</strong> for Halkidiki. And they\'re right.</p><h2>Weather</h2><ul><li><strong>Air:</strong> 25-30°C — perfect</li><li><strong>Sea:</strong> 25-27°C — warmer than June!</li><li><strong>Rain:</strong> Rare (1-2 rains per month)</li></ul><h2>Why it\'s the best month</h2><ul><li>🏖️ Beaches almost empty after September 10</li><li>💰 Prices drop 30-40% compared to August</li><li>🌊 The sea stored all summer\'s warmth</li><li>🍇 Grape season — harvest, wine, festivals</li><li>🌅 Most beautiful sunsets of the year</li></ul><h2>What to Do</h2><ul><li>🏊 Swim on deserted beaches</li><li>🍷 Wine harvest festivals</li><li>🥾 Hiking without the heat</li><li>🚴 Cycling in the hinterland</li><li>🍽️ Fresh figs, grapes, olives</li></ul><h2>Who is it for?</h2><ul><li>✅ Couples — romantic atmosphere</li><li>✅ Seniors — ideal temperature</li><li>✅ Photographers — magical light</li><li>✅ Digital nomads — quiet + good internet</li></ul>',
      de: '<h2>September — Der Geheimtipp</h2><p>Viele Einheimische halten September für den <strong>besten Monat</strong>.</p><h2>Wetter</h2><ul><li><strong>Luft:</strong> 25-30°C</li><li><strong>Meer:</strong> 25-27°C — wärmer als Juni!</li></ul><h2>Warum September</h2><ul><li>Leere Strände ab 10. September</li><li>Preise sinken 30-40%</li><li>Weinlese-Feste</li><li>Wandern ohne Hitze</li></ul>',
      bg: '<h2>Септември — Скритото съкровище</h2><p>Много местни смятат септември за <strong>най-добрия месец</strong>.</p><h2>Време</h2><ul><li><strong>Температура:</strong> 25-30°C</li><li><strong>Море:</strong> 25-27°C</li></ul><h2>Защо септември</h2><ul><li>Празни плажове след 10 септември</li><li>Цените падат с 30-40%</li></ul>',
      ru: '<h2>Сентябрь — Секретное сокровище</h2><p>Многие местные считают сентябрь <strong>лучшим месяцем</strong>.</p><h2>Погода</h2><ul><li><strong>Воздух:</strong> 25-30°C</li><li><strong>Море:</strong> 25-27°C</li></ul><h2>Почему сентябрь</h2><ul><li>Пустые пляжи после 10 сентября</li><li>Цены падают на 30-40%</li></ul>',
      ro: '<h2>Septembrie — Comoara ascunsă</h2><p>Mulți localnici consideră septembrie <strong>cea mai bună lună</strong>.</p><h2>Vreme</h2><ul><li><strong>Temperatură:</strong> 25-30°C</li><li><strong>Mare:</strong> 25-27°C</li></ul>',
      sr: '<h2>Septembar — Skriveno blago</h2><p>Mnogi meštani smatraju septembar <strong>najboljim mesecom</strong>.</p><h2>Vreme</h2><ul><li><strong>Temperatura:</strong> 25-30°C</li><li><strong>More:</strong> 25-27°C</li></ul>',
    },
  },
  // ── Getting here + Comparison ──
  {
    slug: 'getting-here', icon: 'Plane', color: 'indigo',
    title: { el: 'Πώς να Φτάσετε στη Χαλκιδική', en: 'How to Get to Halkidiki', de: 'Anreise nach Chalkidiki', bg: 'Как да стигнете до Халкидики', ru: 'Как добраться до Халкидики', ro: 'Cum ajungi în Halkidiki', sr: 'Kako doći do Halkidikija' },
    description: { el: 'Αεροδρόμιο, αυτοκίνητο, λεωφορείο — όλοι οι τρόποι', en: 'Airport, car, bus — all the ways', de: 'Flughafen, Auto, Bus — alle Wege', bg: 'Летище, кола, автобус — всички начини', ru: 'Аэропорт, авто, автобус — все способы', ro: 'Aeroport, mașină, autobuz — toate căile', sr: 'Aerodrom, auto, autobus — svi načini' },
    metaTitle: { el: 'Πώς να Φτάσετε στη Χαλκιδική — Αεροδρόμιο, Αυτοκίνητο, ΚΤΕΛ', en: 'How to Get to Halkidiki — Airport, Car, Bus Guide', de: 'Anreise Chalkidiki — Flughafen, Auto, Bus', bg: 'Как да стигнете до Халкидики — Летище, Кола, Автобус', ru: 'Как добраться до Халкидики — Аэропорт, Авто, Автобус', ro: 'Cum ajungi în Halkidiki — Aeroport, Mașină, Autobuz', sr: 'Kako doći do Halkidikija — Aerodrom, Auto, Autobus' },
    metaDesc: { el: 'Αναλυτικός οδηγός: πώς φτάνετε Χαλκιδική από Θεσσαλονίκη, Σόφια, Βουκουρέστι, Βελιγράδι. Αεροδρόμιο SKG, ΚΤΕΛ, αυτοκίνητο, transfer.', en: 'Complete guide: how to reach Halkidiki from Thessaloniki, Sofia, Bucharest, Belgrade. SKG airport, bus, car, transfer.', de: 'Anreise Chalkidiki: von Thessaloniki, Sofia, Bukarest, Belgrad. Flughafen SKG, Bus, Auto, Transfer.', bg: 'Как да стигнете до Халкидики: от Солун, София, Букурещ, Белград. Летище SKG, автобус, кола.', ru: 'Как добраться до Халкидики: из Салоник, Софии, Бухареста, Белграда. Аэропорт SKG, автобус, авто.', ro: 'Cum ajungi în Halkidiki: din Salonic, Sofia, București, Belgrad. Aeroport SKG, autobuz, mașină.', sr: 'Kako doći do Halkidikija: iz Soluna, Sofije, Bukurešta, Beograda. Aerodrom SKG, autobus, auto.' },
    content: {
      el: '<h2>Αεροδρόμιο Θεσσαλονίκης (SKG)</h2><p>Το αεροδρόμιο «Μακεδονία» (SKG) είναι η <strong>κύρια πύλη</strong> για τη Χαλκιδική, μόλις 60-120 λεπτά με αυτοκίνητο.</p><h3>Αποστάσεις από SKG</h3><ul><li><strong>Κασσάνδρα (Πευκοχώρι):</strong> ~100 km / 1:20 ώρα</li><li><strong>Σιθωνία (Νικήτη):</strong> ~110 km / 1:30 ώρα</li><li><strong>Ουρανούπολη (Άθως):</strong> ~130 km / 1:50 ώρα</li></ul><h2>Με Αυτοκίνητο</h2><h3>Από Θεσσαλονίκη</h3><p>Εθνική οδός → Περιφερειακή → Ε. Ο. Θεσσαλονίκης-Χαλκιδικής. Δρόμος σε <strong>εξαιρετική κατάσταση</strong>.</p><h3>Από Σόφια (Βουλγαρία)</h3><p>~400 km / 4-5 ώρες. Σύνορα Προμαχώνα → Σέρρες → Θεσσαλονίκη → Χαλκιδική.</p><h3>Από Βουκουρέστι (Ρουμανία)</h3><p>~700 km / 8-9 ώρες. Μέσω Βουλγαρίας (Σόφια ή Βέλικο Τάρνοβο).</p><h3>Από Βελιγράδι (Σερβία)</h3><p>~600 km / 6-7 ώρες. Νις → Σκόπια → Θεσσαλονίκη → Χαλκιδική.</p><h2>Με Λεωφορείο (ΚΤΕΛ)</h2><ul><li><strong>ΚΤΕΛ Χαλκιδικής</strong> — δρομολόγια από Θεσσαλονίκη (ΚΤΕΛ Μακεδονία)</li><li>Κασσάνδρα: 5-8 δρομολόγια/ημέρα</li><li>Σιθωνία: 3-5 δρομολόγια/ημέρα</li><li>Τιμή: ~10-15€ μονή διαδρομή</li></ul><h2>Transfer Services</h2><p>Ιδιωτικά transfer από αεροδρόμιο: 60-100€ ανάλογα με προορισμό. Βολικό για οικογένειες.</p><h2>Ενοικίαση Αυτοκινήτου</h2><p><strong>Συνιστάται ανεπιφύλακτα.</strong> Η Χαλκιδική δεν έχει πλήρες δίκτυο ΜΜΜ. Με αυτοκίνητο εξερευνείτε κρυφές παραλίες και χωριά.</p>',
      en: '<h2>Thessaloniki Airport (SKG)</h2><p>"Macedonia" airport (SKG) is the <strong>main gateway</strong> to Halkidiki, just 60-120 minutes by car.</p><h3>Distances from SKG</h3><ul><li><strong>Kassandra (Pefkohori):</strong> ~100 km / 1:20h</li><li><strong>Sithonia (Nikiti):</strong> ~110 km / 1:30h</li><li><strong>Ouranoupoli (Athos):</strong> ~130 km / 1:50h</li></ul><h2>By Car</h2><h3>From Thessaloniki</h3><p>Highway → Ring road → Thessaloniki-Halkidiki road. Roads in <strong>excellent condition</strong>.</p><h3>From Sofia (Bulgaria)</h3><p>~400 km / 4-5 hours via Promachonas border → Serres → Thessaloniki.</p><h3>From Bucharest (Romania)</h3><p>~700 km / 8-9 hours via Bulgaria.</p><h3>From Belgrade (Serbia)</h3><p>~600 km / 6-7 hours via Niš → Skopje → Thessaloniki.</p><h2>By Bus (KTEL)</h2><ul><li><strong>KTEL Halkidikis</strong> — routes from Thessaloniki</li><li>Kassandra: 5-8 trips/day</li><li>Sithonia: 3-5 trips/day</li><li>Price: ~€10-15 one way</li></ul><h2>Transfer Services</h2><p>Private transfers from airport: €60-100 depending on destination.</p><h2>Car Rental</h2><p><strong>Highly recommended.</strong> Halkidiki lacks full public transport. A car lets you discover hidden beaches and villages.</p>',
      de: '<h2>Flughafen Thessaloniki (SKG)</h2><p>Der Flughafen ist das <strong>Tor nach Chalkidiki</strong>, 60-120 Min. mit dem Auto.</p><h3>Entfernungen</h3><ul><li><strong>Kassandra:</strong> ~100 km / 1:20h</li><li><strong>Sithonia:</strong> ~110 km / 1:30h</li></ul><h2>Mit dem Auto</h2><h3>Von Sofia</h3><p>~400 km / 4-5 Stunden.</p><h3>Von Bukarest</h3><p>~700 km / 8-9 Stunden.</p><h2>KTEL-Bus</h2><p>Ab Thessaloniki 5-8 Verbindungen/Tag. Preis: ~10-15€.</p><h2>Mietwagen</h2><p><strong>Sehr empfohlen.</strong> Kein vollständiges ÖPNV-Netz.</p>',
      bg: '<h2>Летище Солун (SKG)</h2><p>Летището е <strong>главната врата</strong> към Халкидики, на 60-120 мин. с кола.</p><h3>Разстояния</h3><ul><li><strong>Касандра:</strong> ~100 км / 1:20ч</li><li><strong>Ситония:</strong> ~110 км / 1:30ч</li></ul><h2>С кола от София</h2><p>~400 км / 4-5 часа. Граница Кулата/Промахон → Серес → Солун → Халкидики.</p><h2>С автобус (KTEL)</h2><p>От Солун, 5-8 курса/ден. Цена: ~10-15€.</p>',
      ru: '<h2>Аэропорт Салоники (SKG)</h2><p>Аэропорт — <strong>главные ворота</strong> в Халкидики, 60-120 мин. на машине.</p><h3>Расстояния</h3><ul><li><strong>Кассандра:</strong> ~100 км / 1:20ч</li><li><strong>Ситония:</strong> ~110 км / 1:30ч</li></ul><h2>На машине из Софии</h2><p>~400 км / 4-5 часов.</p><h2>Автобус (KTEL)</h2><p>Из Салоник, 5-8 рейсов/день. Цена: ~10-15€.</p>',
      ro: '<h2>Aeroportul Salonic (SKG)</h2><p>Aeroportul este <strong>poarta principală</strong> spre Halkidiki, la 60-120 min. cu mașina.</p><h3>Distanțe</h3><ul><li><strong>Kassandra:</strong> ~100 km / 1:20h</li><li><strong>Sithonia:</strong> ~110 km / 1:30h</li></ul><h2>Cu mașina din București</h2><p>~700 km / 8-9 ore prin Bulgaria.</p>',
      sr: '<h2>Aerodrom Solun (SKG)</h2><p>Aerodrom je <strong>glavna kapija</strong> za Halkidiki, 60-120 min. kolima.</p><h3>Rastojanja</h3><ul><li><strong>Kasandra:</strong> ~100 km / 1:20h</li><li><strong>Sitonija:</strong> ~110 km / 1:30h</li></ul><h2>Kolima iz Beograda</h2><p>~600 km / 6-7 sati. Niš → Skoplje → Solun → Halkidiki.</p>',
    },
  },
  {
    slug: 'kassandra-vs-sithonia', icon: 'Scale', color: 'violet',
    title: { el: 'Κασσάνδρα vs Σιθωνία — Ποιά να Επιλέξετε;', en: 'Kassandra vs Sithonia — Which to Choose?', de: 'Kassandra vs Sithonia — Welche wählen?', bg: 'Касандра vs Ситония — Коя да изберете?', ru: 'Кассандра vs Ситония — Что выбрать?', ro: 'Kassandra vs Sithonia — Pe care o alegeți?', sr: 'Kasandra vs Sitonija — Koju izabrati?' },
    description: { el: 'Πλήρης σύγκριση των δύο χερσονήσων', en: 'Complete comparison of the two peninsulas', de: 'Vollständiger Vergleich der beiden Halbinseln', bg: 'Пълно сравнение на двата полуострова', ru: 'Полное сравнение двух полуостровов', ro: 'Comparație completă a celor două peninsule', sr: 'Potpuno poređenje dva poluostrva' },
    metaTitle: { el: 'Κασσάνδρα ή Σιθωνία; Πλήρης Σύγκριση | ChalkidikiHub', en: 'Kassandra or Sithonia? Full Comparison', de: 'Kassandra oder Sithonia? Vergleich', bg: 'Касандра или Ситония? Сравнение', ru: 'Кассандра или Ситония? Сравнение', ro: 'Kassandra sau Sithonia? Comparație', sr: 'Kasandra ili Sitonija? Poređenje' },
    metaDesc: { el: 'Κασσάνδρα ή Σιθωνία; Παραλίες, νυχτερινή ζωή, τιμές, εστιατόρια, οικογένειες. Πλήρης σύγκριση για τις σωστές διακοπές.', en: 'Kassandra or Sithonia? Beaches, nightlife, prices, restaurants, families. Full comparison for the right holiday.', de: 'Kassandra oder Sithonia? Strände, Nachtleben, Preise, Restaurants. Vergleich.', bg: 'Касандра или Ситония? Плажове, нощен живот, цени, ресторанти. Сравнение.', ru: 'Кассандра или Ситония? Пляжи, ночная жизнь, цены, рестораны. Сравнение.', ro: 'Kassandra sau Sithonia? Plaje, viață de noapte, prețuri, restaurante. Comparație.', sr: 'Kasandra ili Sitonija? Plaže, noćni život, cene, restorani. Poređenje.' },
    content: {
      el: '<h2>Η Μεγάλη Ερώτηση</h2><p>Κάθε τουρίστας που σχεδιάζει διακοπές στη Χαλκιδική αναρωτιέται: <strong>Κασσάνδρα ή Σιθωνία;</strong> Η απάντηση εξαρτάται από το τι ψάχνετε.</p><h2>Σύγκριση σε Κατηγορίες</h2><table><tr><th>Κατηγορία</th><th>Κασσάνδρα</th><th>Σιθωνία</th></tr><tr><td><strong>Παραλίες</strong></td><td>Οργανωμένες, αμμώδεις, εύκολη πρόσβαση</td><td>Εξωτικές, κρυφοί κόλποι, πευκοδάσος</td></tr><tr><td><strong>Νυχτερινή ζωή</strong></td><td>⭐⭐⭐⭐⭐ — Beach bars, clubs, parties</td><td>⭐⭐ — Χαλαρά cocktail bars</td></tr><tr><td><strong>Εστιατόρια</strong></td><td>Πολλά, τουριστικά + αυθεντικά</td><td>Λιγότερα, πιο αυθεντικά</td></tr><tr><td><strong>Τιμές</strong></td><td>€€-€€€ (πιο τουριστικές)</td><td>€-€€ (πιο οικονομικές)</td></tr><tr><td><strong>Ατμόσφαιρα</strong></td><td>Ζωντανή, κοσμοπολίτικη</td><td>Ήρεμη, φυσική, χαλαρή</td></tr><tr><td><strong>Οικογένειες</strong></td><td>✅ Ρηχά νερά, πολλές υπηρεσίες</td><td>✅ Ησυχία, φύση</td></tr><tr><td><strong>Ζευγάρια</strong></td><td>Beach bars, νυχτερινή ζωή</td><td>⭐ Ρομαντική ατμόσφαιρα</td></tr></table><h2>Κασσάνδρα — Για Ποιους;</h2><ul><li>✅ Νέοι που θέλουν νυχτερινή ζωή</li><li>✅ Οικογένειες που θέλουν υπηρεσίες & οργάνωση</li><li>✅ Πρώτη φορά στη Χαλκιδική</li><li>✅ Shopping lovers</li></ul><h2>Σιθωνία — Για Ποιους;</h2><ul><li>✅ Ζευγάρια που ψάχνουν ρομαντισμό</li><li>✅ Φυσιολάτρες & εξερευνητές</li><li>✅ Όσοι θέλουν ηρεμία</li><li>✅ Budget travelers</li><li>✅ Repeat visitors</li></ul><h2>Η Δική μας Πρόταση</h2><p>Πρώτη φορά; <strong>Κασσάνδρα.</strong> Ψάχνετε ηρεμία; <strong>Σιθωνία.</strong> Έχετε 10+ μέρες; <strong>Και τις δύο!</strong></p>',
      en: '<h2>The Big Question</h2><p>Every tourist planning a Halkidiki holiday asks: <strong>Kassandra or Sithonia?</strong> The answer depends on what you\'re looking for.</p><h2>Comparison</h2><table><tr><th>Category</th><th>Kassandra</th><th>Sithonia</th></tr><tr><td><strong>Beaches</strong></td><td>Organized, sandy, easy access</td><td>Exotic, hidden coves, pine forest</td></tr><tr><td><strong>Nightlife</strong></td><td>⭐⭐⭐⭐⭐ — Beach bars, clubs</td><td>⭐⭐ — Relaxed cocktail bars</td></tr><tr><td><strong>Restaurants</strong></td><td>Many, touristy + authentic</td><td>Fewer, more authentic</td></tr><tr><td><strong>Prices</strong></td><td>€€-€€€ (more touristy)</td><td>€-€€ (more affordable)</td></tr><tr><td><strong>Atmosphere</strong></td><td>Lively, cosmopolitan</td><td>Calm, natural, relaxed</td></tr><tr><td><strong>Families</strong></td><td>✅ Shallow waters, many services</td><td>✅ Quiet, nature</td></tr><tr><td><strong>Couples</strong></td><td>Beach bars, nightlife</td><td>⭐ Romantic atmosphere</td></tr></table><h2>Kassandra — For Whom?</h2><ul><li>✅ Young people wanting nightlife</li><li>✅ Families wanting services & organization</li><li>✅ First-timers to Halkidiki</li></ul><h2>Sithonia — For Whom?</h2><ul><li>✅ Couples seeking romance</li><li>✅ Nature lovers & explorers</li><li>✅ Budget travelers</li><li>✅ Repeat visitors</li></ul><h2>Our Recommendation</h2><p>First time? <strong>Kassandra.</strong> Seeking peace? <strong>Sithonia.</strong> Have 10+ days? <strong>Both!</strong></p>',
      de: '<h2>Die große Frage</h2><p>Jeder Tourist fragt: <strong>Kassandra oder Sithonia?</strong></p><h2>Vergleich</h2><table><tr><th>Kategorie</th><th>Kassandra</th><th>Sithonia</th></tr><tr><td>Strände</td><td>Organisiert, sandig</td><td>Exotisch, versteckte Buchten</td></tr><tr><td>Nachtleben</td><td>⭐⭐⭐⭐⭐</td><td>⭐⭐</td></tr><tr><td>Preise</td><td>€€-€€€</td><td>€-€€</td></tr></table><h2>Empfehlung</h2><p>Erstes Mal? <strong>Kassandra.</strong> Ruhe? <strong>Sithonia.</strong></p>',
      bg: '<h2>Големият въпрос</h2><p>Всеки турист пита: <strong>Касандра или Ситония?</strong></p><h2>Касандра</h2><p>Оживена, организирани плажове, нощен живот.</p><h2>Ситония</h2><p>Спокойна, екзотични плажове, природа.</p><h2>Нашата препоръка</h2><p>За първи път? <strong>Касандра.</strong> За спокойствие? <strong>Ситония.</strong></p>',
      ru: '<h2>Большой вопрос</h2><p>Каждый турист спрашивает: <strong>Кассандра или Ситония?</strong></p><h2>Кассандра</h2><p>Оживлённая, организованные пляжи, ночная жизнь.</p><h2>Ситония</h2><p>Спокойная, экзотические пляжи, природа.</p><h2>Наша рекомендация</h2><p>Впервые? <strong>Кассандра.</strong> Для покоя? <strong>Ситония.</strong></p>',
      ro: '<h2>Marea întrebare</h2><p>Fiecare turist întreabă: <strong>Kassandra sau Sithonia?</strong></p><h2>Kassandra</h2><p>Animată, plaje organizate, viață de noapte.</p><h2>Sithonia</h2><p>Liniștită, plaje exotice, natură.</p><h2>Recomandarea noastră</h2><p>Prima dată? <strong>Kassandra.</strong> Pentru liniște? <strong>Sithonia.</strong></p>',
      sr: '<h2>Veliko pitanje</h2><p>Svaki turista pita: <strong>Kasandra ili Sitonija?</strong></p><h2>Kasandra</h2><p>Živahna, organizovane plaže, noćni život.</p><h2>Sitonija</h2><p>Mirna, egzotične plaže, priroda.</p><h2>Naša preporuka</h2><p>Prvi put? <strong>Kasandra.</strong> Za mir? <strong>Sitonija.</strong></p>',
    },
  },
  {
    slug: 'weather', icon: 'CloudSun', color: 'sky',
    title: { el: 'Καιρός στη Χαλκιδική — Μήνα με Μήνα', en: 'Halkidiki Weather — Month by Month', de: 'Wetter in Chalkidiki — Monat für Monat', bg: 'Времето в Халкидики — Месец по месец', ru: 'Погода в Халкидики — По месяцам', ro: 'Vremea în Halkidiki — Lună de lună', sr: 'Vreme u Halkidikiju — Mesec po mesec' },
    description: { el: 'Αναλυτική πρόγνωση καιρού & τι να πακετάρετε', en: 'Detailed weather breakdown & packing tips', de: 'Detaillierte Wetterübersicht & Packtipps', bg: 'Подробна прогноза за времето и какво да си вземете', ru: 'Подробная погода и что взять с собой', ro: 'Vremea detaliată și sfaturi de împachetat', sr: 'Detaljna prognoza vremena i saveti za pakovanje' },
    metaTitle: { el: 'Καιρός Χαλκιδική — Θερμοκρασίες, Βροχές, Θάλασσα | ChalkidikiHub', en: 'Halkidiki Weather — Temperatures, Rain, Sea Temp', de: 'Chalkidiki Wetter — Temperaturen, Regen, Meertemp.', bg: 'Времето в Халкидики — Температури, дъжд, море', ru: 'Погода Халкидики — Температура, дождь, море', ro: 'Vremea Halkidiki — Temperaturi, ploaie, mare', sr: 'Vreme Halkidiki — Temperature, kiša, more' },
    metaDesc: { el: 'Πλήρης οδηγός καιρού Χαλκιδικής: θερμοκρασία αέρα & θάλασσας, βροχοπτώσεις, ώρες ηλιοφάνειας, άνεμοι ανά μήνα. Τι να πακετάρετε.', en: 'Complete Halkidiki weather guide: air & sea temperatures, rainfall, sunshine hours, wind by month. What to pack.', de: 'Kompletter Chalkidiki-Wetterführer: Luft- & Meertemperaturen, Niederschlag, Sonnenstunden, Wind pro Monat.', bg: 'Пълен пътеводител за времето в Халкидики: температура на въздуха и морето, валежи, слънчеви часове по месеци.', ru: 'Полный гид по погоде Халкидики: температура воздуха и моря, осадки, солнечные часы по месяцам.', ro: 'Ghid complet meteo Halkidiki: temperaturi aer și mare, precipitații, ore de soare pe lună.', sr: 'Kompletan vodič za vreme Halkidikija: temperature vazduha i mora, padavine, sunčani sati po mesecu.' },
    content: {
      el: '<h2>Κλίμα Χαλκιδικής</h2><p>Η Χαλκιδική απολαμβάνει <strong>μεσογειακό κλίμα</strong> με ζεστά, ξηρά καλοκαίρια και ήπιους, υγρούς χειμώνες. Η τοποθεσία της ανάμεσα στον Θερμαϊκό κόλπο και το Αιγαίο δημιουργεί ιδανικές συνθήκες για θαλάσσιες διακοπές από Μάιο ως Οκτώβριο.</p><h2>Πίνακας Καιρού ανά Μήνα</h2><table><tr><th>Μήνας</th><th>Αέρας °C</th><th>Θάλασσα °C</th><th>Βροχή mm</th><th>Ηλιοφάνεια ώρες</th><th>Άνεμος</th></tr><tr><td>Ιανουάριος</td><td>5-10</td><td>13</td><td>45</td><td>3</td><td>Μέτριος</td></tr><tr><td>Φεβρουάριος</td><td>6-11</td><td>13</td><td>40</td><td>4</td><td>Μέτριος</td></tr><tr><td>Μάρτιος</td><td>8-14</td><td>14</td><td>40</td><td>5</td><td>Μέτριος</td></tr><tr><td>Απρίλιος</td><td>12-19</td><td>16</td><td>35</td><td>7</td><td>Ελαφρύς</td></tr><tr><td>Μάιος</td><td>17-25</td><td>19</td><td>30</td><td>9</td><td>Ελαφρύς</td></tr><tr><td>Ιούνιος</td><td>22-30</td><td>23</td><td>20</td><td>11</td><td>Ελαφρύς</td></tr><tr><td>Ιούλιος</td><td>25-33</td><td>25</td><td>10</td><td>12</td><td>Ελαφρύς</td></tr><tr><td>Αύγουστος</td><td>25-33</td><td>26</td><td>10</td><td>11</td><td>Ελαφρύς</td></tr><tr><td>Σεπτέμβριος</td><td>21-28</td><td>24</td><td>25</td><td>9</td><td>Ελαφρύς</td></tr><tr><td>Οκτώβριος</td><td>15-22</td><td>20</td><td>45</td><td>6</td><td>Μέτριος</td></tr><tr><td>Νοέμβριος</td><td>10-16</td><td>17</td><td>55</td><td>4</td><td>Μέτριος</td></tr><tr><td>Δεκέμβριος</td><td>6-12</td><td>15</td><td>50</td><td>3</td><td>Μέτριος</td></tr></table><h2>Τι να Πακετάρετε</h2><ul><li><strong>Καλοκαίρι (Ιούν-Αύγ):</strong> Ελαφριά ρούχα, αντηλιακό SPF50, καπέλο, σαγιονάρες, μαγιό, ελαφρύ μπουφάν για τα βράδια</li><li><strong>Άνοιξη/Φθινόπωρο (Απρ-Μάι, Σεπ-Οκτ):</strong> Στρώσεις, αδιάβροχο, κλειστά παπούτσια για πεζοπορία, μαγιό (η θάλασσα ζεσταίνει νωρίς)</li><li><strong>Χειμώνας (Νοέ-Μάρ):</strong> Ζεστά ρούχα, ομπρέλα, αδιάβροχα παπούτσια</li></ul><h2>Ιδιαιτερότητες</h2><p>Η <strong>Σιθωνία</strong> τείνει να είναι 1-2°C πιο δροσερή από την Κασσάνδρα λόγω πυκνότερης βλάστησης. Ο <strong>Βαρδάρης</strong> (βόρειος άνεμος) μπορεί να φέρει ξαφνική δροσιά ακόμα και τον Ιούλιο.</p>',
      en: '<h2>Halkidiki Climate</h2><p>Halkidiki enjoys a <strong>Mediterranean climate</strong> with hot, dry summers and mild, wet winters. Its position between the Thermaic Gulf and the Aegean creates ideal conditions for seaside holidays from May through October.</p><h2>Monthly Weather Table</h2><table><tr><th>Month</th><th>Air °C</th><th>Sea °C</th><th>Rain mm</th><th>Sunshine hrs</th><th>Wind</th></tr><tr><td>January</td><td>5-10</td><td>13</td><td>45</td><td>3</td><td>Moderate</td></tr><tr><td>February</td><td>6-11</td><td>13</td><td>40</td><td>4</td><td>Moderate</td></tr><tr><td>March</td><td>8-14</td><td>14</td><td>40</td><td>5</td><td>Moderate</td></tr><tr><td>April</td><td>12-19</td><td>16</td><td>35</td><td>7</td><td>Light</td></tr><tr><td>May</td><td>17-25</td><td>19</td><td>30</td><td>9</td><td>Light</td></tr><tr><td>June</td><td>22-30</td><td>23</td><td>20</td><td>11</td><td>Light</td></tr><tr><td>July</td><td>25-33</td><td>25</td><td>10</td><td>12</td><td>Light</td></tr><tr><td>August</td><td>25-33</td><td>26</td><td>10</td><td>11</td><td>Light</td></tr><tr><td>September</td><td>21-28</td><td>24</td><td>25</td><td>9</td><td>Light</td></tr><tr><td>October</td><td>15-22</td><td>20</td><td>45</td><td>6</td><td>Moderate</td></tr><tr><td>November</td><td>10-16</td><td>17</td><td>55</td><td>4</td><td>Moderate</td></tr><tr><td>December</td><td>6-12</td><td>15</td><td>50</td><td>3</td><td>Moderate</td></tr></table><h2>Packing Tips</h2><ul><li><strong>Summer (Jun-Aug):</strong> Light clothes, SPF50 sunscreen, hat, flip-flops, swimwear, light jacket for evenings</li><li><strong>Spring/Autumn (Apr-May, Sep-Oct):</strong> Layers, rain jacket, closed shoes for hiking, swimwear (sea warms early)</li><li><strong>Winter (Nov-Mar):</strong> Warm clothing, umbrella, waterproof shoes</li></ul><h2>Local Quirks</h2><p><strong>Sithonia</strong> tends to be 1-2°C cooler than Kassandra due to denser pine forest cover. The <strong>Vardaris</strong> (north wind) can bring sudden cool spells even in July.</p>',
      de: '<h2>Klima in Chalkidiki</h2><p>Chalkidiki genießt ein <strong>mediterranes Klima</strong> mit heißen, trockenen Sommern und milden, feuchten Wintern.</p><h2>Monatliche Wettertabelle</h2><table><tr><th>Monat</th><th>Luft °C</th><th>Meer °C</th><th>Regen mm</th><th>Sonne Std</th></tr><tr><td>Januar</td><td>5-10</td><td>13</td><td>45</td><td>3</td></tr><tr><td>Februar</td><td>6-11</td><td>13</td><td>40</td><td>4</td></tr><tr><td>März</td><td>8-14</td><td>14</td><td>40</td><td>5</td></tr><tr><td>April</td><td>12-19</td><td>16</td><td>35</td><td>7</td></tr><tr><td>Mai</td><td>17-25</td><td>19</td><td>30</td><td>9</td></tr><tr><td>Juni</td><td>22-30</td><td>23</td><td>20</td><td>11</td></tr><tr><td>Juli</td><td>25-33</td><td>25</td><td>10</td><td>12</td></tr><tr><td>August</td><td>25-33</td><td>26</td><td>10</td><td>11</td></tr><tr><td>September</td><td>21-28</td><td>24</td><td>25</td><td>9</td></tr><tr><td>Oktober</td><td>15-22</td><td>20</td><td>45</td><td>6</td></tr><tr><td>November</td><td>10-16</td><td>17</td><td>55</td><td>4</td></tr><tr><td>Dezember</td><td>6-12</td><td>15</td><td>50</td><td>3</td></tr></table><h2>Packtipps</h2><ul><li><strong>Sommer:</strong> Leichte Kleidung, Sonnencreme SPF50, Hut, Flip-Flops, leichte Jacke für Abende</li><li><strong>Frühling/Herbst:</strong> Schichten, Regenjacke, geschlossene Schuhe</li><li><strong>Winter:</strong> Warme Kleidung, Regenschirm</li></ul>',
      bg: '<h2>Климат на Халкидики</h2><p>Халкидики се радва на <strong>средиземноморски климат</strong> с горещи, сухи лета и меки, влажни зими.</p><h2>Таблица на времето по месеци</h2><table><tr><th>Месец</th><th>Въздух °C</th><th>Море °C</th><th>Дъжд mm</th><th>Слънце ч.</th></tr><tr><td>Януари</td><td>5-10</td><td>13</td><td>45</td><td>3</td></tr><tr><td>Февруари</td><td>6-11</td><td>13</td><td>40</td><td>4</td></tr><tr><td>Март</td><td>8-14</td><td>14</td><td>40</td><td>5</td></tr><tr><td>Април</td><td>12-19</td><td>16</td><td>35</td><td>7</td></tr><tr><td>Май</td><td>17-25</td><td>19</td><td>30</td><td>9</td></tr><tr><td>Юни</td><td>22-30</td><td>23</td><td>20</td><td>11</td></tr><tr><td>Юли</td><td>25-33</td><td>25</td><td>10</td><td>12</td></tr><tr><td>Август</td><td>25-33</td><td>26</td><td>10</td><td>11</td></tr><tr><td>Септември</td><td>21-28</td><td>24</td><td>25</td><td>9</td></tr><tr><td>Октомври</td><td>15-22</td><td>20</td><td>45</td><td>6</td></tr><tr><td>Ноември</td><td>10-16</td><td>17</td><td>55</td><td>4</td></tr><tr><td>Декември</td><td>6-12</td><td>15</td><td>50</td><td>3</td></tr></table><h2>Какво да вземете</h2><ul><li><strong>Лято:</strong> Леки дрехи, слънцезащитен крем SPF50, шапка, чехли, бански</li><li><strong>Пролет/Есен:</strong> Пластове дрехи, дъждобран, затворени обувки</li><li><strong>Зима:</strong> Топли дрехи, чадър</li></ul>',
      ru: '<h2>Климат Халкидиков</h2><p>Халкидики наслаждаются <strong>средиземноморским климатом</strong> с жарким сухим летом и мягкой влажной зимой.</p><h2>Таблица погоды по месяцам</h2><table><tr><th>Месяц</th><th>Воздух °C</th><th>Море °C</th><th>Дождь мм</th><th>Солнце час</th></tr><tr><td>Январь</td><td>5-10</td><td>13</td><td>45</td><td>3</td></tr><tr><td>Февраль</td><td>6-11</td><td>13</td><td>40</td><td>4</td></tr><tr><td>Март</td><td>8-14</td><td>14</td><td>40</td><td>5</td></tr><tr><td>Апрель</td><td>12-19</td><td>16</td><td>35</td><td>7</td></tr><tr><td>Май</td><td>17-25</td><td>19</td><td>30</td><td>9</td></tr><tr><td>Июнь</td><td>22-30</td><td>23</td><td>20</td><td>11</td></tr><tr><td>Июль</td><td>25-33</td><td>25</td><td>10</td><td>12</td></tr><tr><td>Август</td><td>25-33</td><td>26</td><td>10</td><td>11</td></tr><tr><td>Сентябрь</td><td>21-28</td><td>24</td><td>25</td><td>9</td></tr><tr><td>Октябрь</td><td>15-22</td><td>20</td><td>45</td><td>6</td></tr><tr><td>Ноябрь</td><td>10-16</td><td>17</td><td>55</td><td>4</td></tr><tr><td>Декабрь</td><td>6-12</td><td>15</td><td>50</td><td>3</td></tr></table><h2>Что взять с собой</h2><ul><li><strong>Лето:</strong> Лёгкая одежда, солнцезащитный крем SPF50, шляпа, шлёпанцы, купальник</li><li><strong>Весна/Осень:</strong> Слои одежды, дождевик, закрытая обувь</li><li><strong>Зима:</strong> Тёплая одежда, зонт</li></ul>',
      ro: '<h2>Clima din Halkidiki</h2><p>Halkidiki se bucură de o <strong>climă mediteraneană</strong> cu veri calde și uscate și ierni blânde și umede.</p><h2>Tabel meteo lunar</h2><table><tr><th>Luna</th><th>Aer °C</th><th>Mare °C</th><th>Ploaie mm</th><th>Soare ore</th></tr><tr><td>Ianuarie</td><td>5-10</td><td>13</td><td>45</td><td>3</td></tr><tr><td>Februarie</td><td>6-11</td><td>13</td><td>40</td><td>4</td></tr><tr><td>Martie</td><td>8-14</td><td>14</td><td>40</td><td>5</td></tr><tr><td>Aprilie</td><td>12-19</td><td>16</td><td>35</td><td>7</td></tr><tr><td>Mai</td><td>17-25</td><td>19</td><td>30</td><td>9</td></tr><tr><td>Iunie</td><td>22-30</td><td>23</td><td>20</td><td>11</td></tr><tr><td>Iulie</td><td>25-33</td><td>25</td><td>10</td><td>12</td></tr><tr><td>August</td><td>25-33</td><td>26</td><td>10</td><td>11</td></tr><tr><td>Septembrie</td><td>21-28</td><td>24</td><td>25</td><td>9</td></tr><tr><td>Octombrie</td><td>15-22</td><td>20</td><td>45</td><td>6</td></tr><tr><td>Noiembrie</td><td>10-16</td><td>17</td><td>55</td><td>4</td></tr><tr><td>Decembrie</td><td>6-12</td><td>15</td><td>50</td><td>3</td></tr></table><h2>Ce să împachetați</h2><ul><li><strong>Vara:</strong> Haine ușoare, protecție solară SPF50, pălărie, papuci, costum de baie</li><li><strong>Primăvara/Toamna:</strong> Straturi, jachetă de ploaie, pantofi închiși</li><li><strong>Iarna:</strong> Haine groase, umbrelă</li></ul>',
      sr: '<h2>Klima Halkidikija</h2><p>Halkidiki uživa u <strong>mediteranskoj klimi</strong> sa vrućim, suvim letima i blagim, vlažnim zimama.</p><h2>Mesečna tabela vremena</h2><table><tr><th>Mesec</th><th>Vazduh °C</th><th>More °C</th><th>Kiša mm</th><th>Sunce sati</th></tr><tr><td>Januar</td><td>5-10</td><td>13</td><td>45</td><td>3</td></tr><tr><td>Februar</td><td>6-11</td><td>13</td><td>40</td><td>4</td></tr><tr><td>Mart</td><td>8-14</td><td>14</td><td>40</td><td>5</td></tr><tr><td>April</td><td>12-19</td><td>16</td><td>35</td><td>7</td></tr><tr><td>Maj</td><td>17-25</td><td>19</td><td>30</td><td>9</td></tr><tr><td>Jun</td><td>22-30</td><td>23</td><td>20</td><td>11</td></tr><tr><td>Jul</td><td>25-33</td><td>25</td><td>10</td><td>12</td></tr><tr><td>Avgust</td><td>25-33</td><td>26</td><td>10</td><td>11</td></tr><tr><td>Septembar</td><td>21-28</td><td>24</td><td>25</td><td>9</td></tr><tr><td>Oktobar</td><td>15-22</td><td>20</td><td>45</td><td>6</td></tr><tr><td>Novembar</td><td>10-16</td><td>17</td><td>55</td><td>4</td></tr><tr><td>Decembar</td><td>6-12</td><td>15</td><td>50</td><td>3</td></tr></table><h2>Šta poneti</h2><ul><li><strong>Leto:</strong> Laka odeća, krema za sunčanje SPF50, šešir, japanke, kupaći kostim</li><li><strong>Proleće/Jesen:</strong> Slojevi odeće, kišna jakna, zatvorene cipele</li><li><strong>Zima:</strong> Topla odeća, kišobran</li></ul>',
    },
  },
  {
    slug: 'best-time-to-visit', icon: 'CalendarCheck', color: 'emerald',
    title: { el: 'Πότε να Επισκεφτείτε τη Χαλκιδική', en: 'Best Time to Visit Halkidiki', de: 'Beste Reisezeit für Chalkidiki', bg: 'Кога да посетите Халкидики', ru: 'Лучшее время для посещения Халкидиков', ro: 'Cel mai bun moment să vizitezi Halkidiki', sr: 'Najbolje vreme za posetu Halkidikiju' },
    description: { el: 'Οδηγός επιλογής περιόδου ανάλογα με budget & προτιμήσεις', en: 'Decision guide based on budget, crowds & weather', de: 'Entscheidungshilfe nach Budget, Massen & Wetter', bg: 'Наръчник за избор на период спрямо бюджет и предпочитания', ru: 'Гид выбора периода по бюджету, погоде и людям', ro: 'Ghid de decizie pe baza bugetului, aglomerației și vremii', sr: 'Vodič za izbor perioda prema budžetu, gužvama i vremenu' },
    metaTitle: { el: 'Πότε να Πάτε Χαλκιδική — Καλύτερη Εποχή | ChalkidikiHub', en: 'Best Time to Visit Halkidiki — Season Guide', de: 'Beste Reisezeit Chalkidiki — Saisonführer', bg: 'Кога да посетите Халкидики — Сезонен гид', ru: 'Лучшее время для Халкидиков — Сезонный гид', ro: 'Cel mai bun moment pentru Halkidiki — Ghid sezonier', sr: 'Najbolje vreme za Halkidiki — Sezonski vodič' },
    metaDesc: { el: 'Πότε να επισκεφτείτε τη Χαλκιδική; Σύγκριση εποχών: τιμές, καιρός, πλήθη, εκδηλώσεις. Μάιος-Ιούνιος, Ιούλιος-Αύγουστος, Σεπτέμβριος.', en: 'When to visit Halkidiki? Season comparison: prices, weather, crowds, events. May-June, July-August, September.', de: 'Wann Chalkidiki besuchen? Saisonvergleich: Preise, Wetter, Menschenmengen.', bg: 'Кога да посетите Халкидики? Сравнение на сезоните: цени, време, тълпи.', ru: 'Когда ехать в Халкидики? Сравнение сезонов: цены, погода, толпы.', ro: 'Când să vizitezi Halkidiki? Comparație sezoane: prețuri, vreme, aglomerație.', sr: 'Kada posetiti Halkidiki? Poređenje sezona: cene, vreme, gužve.' },
    content: {
      el: '<h2>Ποια Εποχή σας Ταιριάζει;</h2><p>Η Χαλκιδική είναι προορισμός κυρίως από <strong>Μάιο ως Οκτώβριο</strong>, αλλά κάθε περίοδος έχει τα πλεονεκτήματά της.</p><h2>Σύγκριση Εποχών</h2><table><tr><th>Περίοδος</th><th>Καιρός</th><th>Πλήθη</th><th>Τιμές</th><th>Ιδανικό για</th></tr><tr><td><strong>Μάι-Ιούν</strong></td><td>22-28°C, θάλασσα 20-23°C</td><td>Χαμηλά-Μέτρια</td><td>€€ (-20-30%)</td><td>Ζευγάρια, πεζοπορία, budget</td></tr><tr><td><strong>Ιούλ-Αύγ</strong></td><td>30-35°C, θάλασσα 25-27°C</td><td>Πολύ υψηλά</td><td>€€€ (αιχμή)</td><td>Οικογένειες, νυχτερινή ζωή, νέοι</td></tr><tr><td><strong>Σεπτέμβριος</strong></td><td>25-30°C, θάλασσα 24-25°C</td><td>Μέτρια</td><td>€€ (-20%)</td><td>Όλους! Ζεστή θάλασσα, λίγος κόσμος</td></tr><tr><td><strong>Οκτώβριος</strong></td><td>18-24°C, θάλασσα 20-22°C</td><td>Χαμηλά</td><td>€ (-40%)</td><td>Φυσιολάτρες, ηρεμία</td></tr></table><h2>Μάιος-Ιούνιος: Η Έξυπνη Επιλογή</h2><p>Ήλιος χωρίς τον καύσωνα, χαμηλές τιμές, άδειες παραλίες. Η φύση είναι πράσινη και ανθισμένη. Ιδανικό για πεζοπορία στο Άγιο Όρος, τα χωριά, και εξερεύνηση.</p><h2>Ιούλιος-Αύγουστος: Αιχμή Καλοκαιριού</h2><p>Η κορυφαία περίοδος αν θέλετε <strong>νυχτερινή ζωή</strong> και ζωντάνια. Τα beach bars στην Κασσάνδρα είναι σε πλήρη λειτουργία. Κρατήστε πολύ νωρίς — τα ξενοδοχεία γεμίζουν 2-3 μήνες πριν.</p><h2>Σεπτέμβριος: Το Μυστικό Καλύτερο</h2><p>Πολλοί ντόπιοι θεωρούν τον Σεπτέμβριο τον <strong>καλύτερο μήνα</strong>. Η θάλασσα είναι στο ζεστότερό της (24-25°C), ο κόσμος φεύγει, οι τιμές πέφτουν, αλλά τα εστιατόρια παραμένουν ανοιχτά.</p><h2>Η Δική μας Πρόταση</h2><p>Budget? <strong>Μάιος ή Οκτώβριος.</strong> Οικογένεια; <strong>Ιούνιος.</strong> Party? <strong>Ιούλιος-Αύγουστος.</strong> Τέλεια ισορροπία; <strong>Σεπτέμβριος.</strong></p>',
      en: '<h2>Which Season Suits You?</h2><p>Halkidiki is primarily a <strong>May-October destination</strong>, but each period has its own advantages.</p><h2>Season Comparison</h2><table><tr><th>Period</th><th>Weather</th><th>Crowds</th><th>Prices</th><th>Ideal for</th></tr><tr><td><strong>May-Jun</strong></td><td>22-28°C, sea 20-23°C</td><td>Low-Medium</td><td>€€ (-20-30%)</td><td>Couples, hiking, budget</td></tr><tr><td><strong>Jul-Aug</strong></td><td>30-35°C, sea 25-27°C</td><td>Very High</td><td>€€€ (peak)</td><td>Families, nightlife, young groups</td></tr><tr><td><strong>September</strong></td><td>25-30°C, sea 24-25°C</td><td>Medium</td><td>€€ (-20%)</td><td>Everyone! Warm sea, fewer crowds</td></tr><tr><td><strong>October</strong></td><td>18-24°C, sea 20-22°C</td><td>Low</td><td>€ (-40%)</td><td>Nature lovers, tranquility</td></tr></table><h2>May-June: The Smart Choice</h2><p>Sunshine without the heatwave, low prices, empty beaches. Nature is green and blooming. Ideal for hiking in Mount Athos area, visiting villages, and exploration.</p><h2>July-August: Peak Summer</h2><p>The prime period for <strong>nightlife</strong> and buzz. Beach bars in Kassandra are in full swing. Book very early — hotels fill up 2-3 months ahead.</p><h2>September: The Secret Best</h2><p>Many locals consider September the <strong>best month</strong>. The sea is at its warmest (24-25°C), crowds thin out, prices drop, but restaurants stay open.</p><h2>Our Recommendation</h2><p>Budget? <strong>May or October.</strong> Family? <strong>June.</strong> Party? <strong>July-August.</strong> Perfect balance? <strong>September.</strong></p>',
      de: '<h2>Welche Saison passt zu Ihnen?</h2><p>Chalkidiki ist hauptsächlich ein <strong>Mai-Oktober-Reiseziel</strong>.</p><h2>Saisonvergleich</h2><table><tr><th>Zeitraum</th><th>Wetter</th><th>Menschenmengen</th><th>Preise</th><th>Ideal für</th></tr><tr><td><strong>Mai-Jun</strong></td><td>22-28°C</td><td>Niedrig-Mittel</td><td>€€ (-20-30%)</td><td>Paare, Wandern, Budget</td></tr><tr><td><strong>Jul-Aug</strong></td><td>30-35°C</td><td>Sehr hoch</td><td>€€€ (Hochsaison)</td><td>Familien, Nachtleben</td></tr><tr><td><strong>September</strong></td><td>25-30°C</td><td>Mittel</td><td>€€ (-20%)</td><td>Alle! Warmes Meer</td></tr><tr><td><strong>Oktober</strong></td><td>18-24°C</td><td>Niedrig</td><td>€ (-40%)</td><td>Naturliebhaber, Ruhe</td></tr></table><h2>Unsere Empfehlung</h2><p>Budget? <strong>Mai oder Oktober.</strong> Familie? <strong>Juni.</strong> Party? <strong>Juli-August.</strong> Perfekte Balance? <strong>September.</strong></p>',
      bg: '<h2>Кой сезон ви подхожда?</h2><p>Халкидики е дестинация предимно от <strong>май до октомври</strong>.</p><h2>Сравнение на сезоните</h2><table><tr><th>Период</th><th>Време</th><th>Тълпи</th><th>Цени</th><th>Идеално за</th></tr><tr><td><strong>Май-Юни</strong></td><td>22-28°C</td><td>Ниски-Средни</td><td>€€ (-20-30%)</td><td>Двойки, пешеходен туризъм</td></tr><tr><td><strong>Юли-Авг</strong></td><td>30-35°C</td><td>Много високи</td><td>€€€</td><td>Семейства, нощен живот</td></tr><tr><td><strong>Септември</strong></td><td>25-30°C</td><td>Средни</td><td>€€ (-20%)</td><td>Всички! Топло море</td></tr><tr><td><strong>Октомври</strong></td><td>18-24°C</td><td>Ниски</td><td>€ (-40%)</td><td>Природа, спокойствие</td></tr></table><h2>Нашата препоръка</h2><p>Бюджет? <strong>Май или октомври.</strong> Семейство? <strong>Юни.</strong> Парти? <strong>Юли-Август.</strong> Перфектен баланс? <strong>Септември.</strong></p>',
      ru: '<h2>Какой сезон вам подходит?</h2><p>Халкидики — направление преимущественно с <strong>мая по октябрь</strong>.</p><h2>Сравнение сезонов</h2><table><tr><th>Период</th><th>Погода</th><th>Толпы</th><th>Цены</th><th>Идеально для</th></tr><tr><td><strong>Май-Июнь</strong></td><td>22-28°C</td><td>Низкие-Средние</td><td>€€ (-20-30%)</td><td>Пары, походы, бюджет</td></tr><tr><td><strong>Июль-Авг</strong></td><td>30-35°C</td><td>Очень высокие</td><td>€€€</td><td>Семьи, ночная жизнь</td></tr><tr><td><strong>Сентябрь</strong></td><td>25-30°C</td><td>Средние</td><td>€€ (-20%)</td><td>Все! Тёплое море</td></tr><tr><td><strong>Октябрь</strong></td><td>18-24°C</td><td>Низкие</td><td>€ (-40%)</td><td>Природа, спокойствие</td></tr></table><h2>Наша рекомендация</h2><p>Бюджет? <strong>Май или октябрь.</strong> Семья? <strong>Июнь.</strong> Вечеринки? <strong>Июль-Август.</strong> Идеальный баланс? <strong>Сентябрь.</strong></p>',
      ro: '<h2>Ce sezon vi se potrivește?</h2><p>Halkidiki este o destinație predominant din <strong>mai până în octombrie</strong>.</p><h2>Comparație sezoane</h2><table><tr><th>Perioada</th><th>Vreme</th><th>Aglomerație</th><th>Prețuri</th><th>Ideal pentru</th></tr><tr><td><strong>Mai-Iun</strong></td><td>22-28°C</td><td>Scăzută-Medie</td><td>€€ (-20-30%)</td><td>Cupluri, drumeții, buget</td></tr><tr><td><strong>Iul-Aug</strong></td><td>30-35°C</td><td>Foarte mare</td><td>€€€</td><td>Familii, viață de noapte</td></tr><tr><td><strong>Septembrie</strong></td><td>25-30°C</td><td>Medie</td><td>€€ (-20%)</td><td>Toți! Mare caldă</td></tr><tr><td><strong>Octombrie</strong></td><td>18-24°C</td><td>Scăzută</td><td>€ (-40%)</td><td>Natură, liniște</td></tr></table><h2>Recomandarea noastră</h2><p>Buget? <strong>Mai sau octombrie.</strong> Familie? <strong>Iunie.</strong> Petreceri? <strong>Iulie-August.</strong> Echilibru perfect? <strong>Septembrie.</strong></p>',
      sr: '<h2>Koja sezona vam odgovara?</h2><p>Halkidiki je destinacija pretežno od <strong>maja do oktobra</strong>.</p><h2>Poređenje sezona</h2><table><tr><th>Period</th><th>Vreme</th><th>Gužve</th><th>Cene</th><th>Idealno za</th></tr><tr><td><strong>Maj-Jun</strong></td><td>22-28°C</td><td>Niske-Srednje</td><td>€€ (-20-30%)</td><td>Parove, pešačenje, budžet</td></tr><tr><td><strong>Jul-Avg</strong></td><td>30-35°C</td><td>Veoma visoke</td><td>€€€</td><td>Porodice, noćni život</td></tr><tr><td><strong>Septembar</strong></td><td>25-30°C</td><td>Srednje</td><td>€€ (-20%)</td><td>Sve! Toplo more</td></tr><tr><td><strong>Oktobar</strong></td><td>18-24°C</td><td>Niske</td><td>€ (-40%)</td><td>Priroda, mir</td></tr></table><h2>Naša preporuka</h2><p>Budžet? <strong>Maj ili oktobar.</strong> Porodica? <strong>Jun.</strong> Žurke? <strong>Jul-Avgust.</strong> Savršena ravnoteža? <strong>Septembar.</strong></p>',
    },
  },
  {
    slug: 'hotels', icon: 'Hotel', color: 'indigo',
    title: { el: 'Ξενοδοχεία & Καταλύματα στη Χαλκιδική', en: 'Hotels & Accommodation in Halkidiki', de: 'Hotels & Unterkünfte in Chalkidiki', bg: 'Хотели и настаняване в Халкидики', ru: 'Отели и жильё в Халкидиках', ro: 'Hoteluri și cazare în Halkidiki', sr: 'Hoteli i smeštaj u Halkidikiju' },
    description: { el: 'Πλήρης οδηγός καταλυμάτων ανά περιοχή & budget', en: 'Complete accommodation guide by area & budget', de: 'Kompletter Unterkunftsführer nach Gebiet & Budget', bg: 'Пълен гид за настаняване по район и бюджет', ru: 'Полный гид по жилью по районам и бюджету', ro: 'Ghid complet de cazare pe zonă și buget', sr: 'Kompletan vodič za smeštaj po oblasti i budžetu' },
    metaTitle: { el: 'Ξενοδοχεία Χαλκιδικής — Πού να Μείνετε | ChalkidikiHub', en: 'Halkidiki Hotels — Where to Stay', de: 'Chalkidiki Hotels — Wo übernachten', bg: 'Хотели Халкидики — Къде да отседнете', ru: 'Отели Халкидики — Где остановиться', ro: 'Hoteluri Halkidiki — Unde să stați', sr: 'Hoteli Halkidiki — Gde odsjesti' },
    metaDesc: { el: 'Πού να μείνετε στη Χαλκιδική: πολυτελή resorts, boutique ξενοδοχεία, διαμερίσματα, βίλες. Κασσάνδρα, Σιθωνία, Αθως. Τιμές & tips.', en: 'Where to stay in Halkidiki: luxury resorts, boutique hotels, apartments, villas. Kassandra, Sithonia, Athos. Prices & tips.', de: 'Wo übernachten in Chalkidiki: Luxusresorts, Boutique-Hotels, Apartments, Villen. Kassandra, Sithonia, Athos.', bg: 'Къде да отседнете в Халкидики: луксозни курорти, бутикови хотели, апартаменти, вили.', ru: 'Где остановиться в Халкидиках: роскошные курорты, бутик-отели, апартаменты, виллы.', ro: 'Unde să stați în Halkidiki: resorturi de lux, hoteluri boutique, apartamente, vile.', sr: 'Gde odsjesti u Halkidikiju: luksuzni rizortovi, butik hoteli, apartmani, vile.' },
    content: {
      el: '<h2>Τύποι Καταλυμάτων</h2><p>Η Χαλκιδική προσφέρει καταλύματα για κάθε budget, από <strong>πολυτελή resorts 5 αστέρων</strong> ως απλά δωμάτια και campings.</p><h2>Πολυτελή Resorts</h2><ul><li><strong>Sani Resort</strong> — Κασσάνδρα. 5 ξενοδοχεία σε ιδιωτική έκταση 1.000 στρ. με μαρίνα, σπα, 7 παραλίες</li><li><strong>Ikos Oceania & Ikos Olivia</strong> — Κασσάνδρα. All-inclusive πολυτέλειας, βραβευμένα παγκοσμίως</li><li><strong>Eagles Palace</strong> — Ουρανούπολη. Μπροστά στον Άθω, σπα, ιδιωτική παραλία</li><li><strong>Porto Carras Grand Resort</strong> — Σιθωνία. Τεράστιο resort με γήπεδο γκολφ, μαρίνα, οινοποιείο</li></ul><h2>Ανά Περιοχή</h2><h3>Κασσάνδρα (1η χερσόνησος)</h3><p>Η πιο <strong>ανεπτυγμένη τουριστικά</strong>. Πολλά ξενοδοχεία, εστιατόρια, νυχτερινή ζωή. Ιδανική για πρώτη φορά ή νέους.</p><h3>Σιθωνία (2η χερσόνησος)</h3><p>Πιο <strong>ήρεμη και φυσική</strong>. Βίλες, μικρά ξενοδοχεία, ενοικιαζόμενα. Ιδανική για ζευγάρια και οικογένειες.</p><h3>Χερσόνησος Αθω</h3><p>Η πιο <strong>απομονωμένη</strong>. Ουρανούπολη ως βάση. Λίγα αλλά ποιοτικά καταλύματα.</p><h2>Κατηγορίες Τιμών (ανά βράδυ, καλοκαίρι)</h2><table><tr><th>Κατηγορία</th><th>Τιμή/βράδυ</th><th>Τι περιμένετε</th></tr><tr><td>Budget</td><td>€50-80</td><td>Studios, δωμάτια, απλές εγκαταστάσεις</td></tr><tr><td>Mid-range</td><td>€80-150</td><td>3-4★ ξενοδοχεία, πισίνα, πρωινό</td></tr><tr><td>Luxury</td><td>€150+</td><td>5★ resorts, σπα, all-inclusive, ιδιωτική παραλία</td></tr></table><h2>Tips Κράτησης</h2><ul><li>Κλείστε <strong>3-4 μήνες νωρίτερα</strong> για Ιούλιο-Αύγουστο</li><li>Σεπτέμβριος: εξαιρετικές τιμές με καλό καιρό</li><li>Ελέγξτε Booking.com + απευθείας site — συχνά φθηνότερα</li></ul>',
      en: '<h2>Accommodation Types</h2><p>Halkidiki offers accommodation for every budget, from <strong>5-star luxury resorts</strong> to simple rooms and campgrounds.</p><h2>Luxury Resorts</h2><ul><li><strong>Sani Resort</strong> — Kassandra. 5 hotels on a private 1,000-acre estate with marina, spa, 7 beaches</li><li><strong>Ikos Oceania & Ikos Olivia</strong> — Kassandra. World-award-winning luxury all-inclusive</li><li><strong>Eagles Palace</strong> — Ouranoupoli. Facing Mount Athos, spa, private beach</li><li><strong>Porto Carras Grand Resort</strong> — Sithonia. Huge resort with golf course, marina, winery</li></ul><h2>By Area</h2><h3>Kassandra (1st peninsula)</h3><p>The most <strong>tourist-developed</strong> area. Many hotels, restaurants, nightlife. Ideal for first-timers or young travelers.</p><h3>Sithonia (2nd peninsula)</h3><p>More <strong>quiet and natural</strong>. Villas, small hotels, rentals. Ideal for couples and families.</p><h3>Athos Peninsula</h3><p>The most <strong>remote</strong> area. Ouranoupoli as a base. Few but quality accommodations.</p><h2>Price Tiers (per night, summer)</h2><table><tr><th>Category</th><th>Price/night</th><th>What to expect</th></tr><tr><td>Budget</td><td>€50-80</td><td>Studios, rooms, basic facilities</td></tr><tr><td>Mid-range</td><td>€80-150</td><td>3-4★ hotels, pool, breakfast</td></tr><tr><td>Luxury</td><td>€150+</td><td>5★ resorts, spa, all-inclusive, private beach</td></tr></table><h2>Booking Tips</h2><ul><li>Book <strong>3-4 months ahead</strong> for July-August</li><li>September: excellent prices with great weather</li><li>Check Booking.com + direct hotel sites — often cheaper direct</li></ul>',
      de: '<h2>Unterkunftsarten</h2><p>Chalkidiki bietet Unterkünfte für jedes Budget, von <strong>5-Sterne-Luxusresorts</strong> bis zu einfachen Zimmern.</p><h2>Luxusresorts</h2><ul><li><strong>Sani Resort</strong> — Kassandra. 5 Hotels auf privatem Gelände mit Marina und Spa</li><li><strong>Ikos Oceania & Ikos Olivia</strong> — Kassandra. Preisgekrönte Luxus-All-Inclusive</li><li><strong>Eagles Palace</strong> — Ouranoupoli. Blick auf den Athos, Spa, Privatstrand</li></ul><h2>Nach Gebiet</h2><h3>Kassandra</h3><p>Am <strong>touristisch entwickeltsten</strong>. Viele Hotels, Restaurants, Nachtleben.</p><h3>Sithonia</h3><p><strong>Ruhiger und natürlicher</strong>. Villen, kleine Hotels, Ferienwohnungen.</p><h3>Athos-Halbinsel</h3><p>Am <strong>abgelegensten</strong>. Ouranoupoli als Basis.</p><h2>Preiskategorien (pro Nacht, Sommer)</h2><table><tr><th>Kategorie</th><th>Preis/Nacht</th><th>Was erwartet Sie</th></tr><tr><td>Budget</td><td>€50-80</td><td>Studios, einfache Ausstattung</td></tr><tr><td>Mittelklasse</td><td>€80-150</td><td>3-4★ Hotels, Pool, Frühstück</td></tr><tr><td>Luxus</td><td>€150+</td><td>5★ Resorts, Spa, All-Inclusive</td></tr></table>',
      bg: '<h2>Видове настаняване</h2><p>Халкидики предлага настаняване за всеки бюджет, от <strong>луксозни курорти с 5 звезди</strong> до прости стаи.</p><h2>Луксозни курорти</h2><ul><li><strong>Sani Resort</strong> — Касандра. 5 хотела с марина, спа, 7 плажа</li><li><strong>Ikos Oceania & Ikos Olivia</strong> — Касандра. Награждавани луксозни all-inclusive</li><li><strong>Eagles Palace</strong> — Уранополис. Пред Атон, спа, частен плаж</li></ul><h2>По район</h2><h3>Касандра</h3><p>Най-<strong>развита туристически</strong>. Много хотели, ресторанти, нощен живот.</p><h3>Ситония</h3><p>По-<strong>спокойна и природна</strong>. Вили, малки хотели.</p><h3>Полуостров Атон</h3><p>Най-<strong>отдалеченият</strong> район. Уранополис като база.</p><h2>Ценови категории (на нощ, лято)</h2><table><tr><th>Категория</th><th>Цена/нощ</th><th>Какво да очаквате</th></tr><tr><td>Бюджет</td><td>€50-80</td><td>Студия, стаи, основни удобства</td></tr><tr><td>Средна класа</td><td>€80-150</td><td>3-4★ хотели, басейн, закуска</td></tr><tr><td>Луксозен</td><td>€150+</td><td>5★ курорти, спа, all-inclusive</td></tr></table>',
      ru: '<h2>Типы размещения</h2><p>Халкидики предлагают жильё на любой бюджет, от <strong>5-звёздочных курортов</strong> до простых комнат.</p><h2>Люксовые курорты</h2><ul><li><strong>Sani Resort</strong> — Кассандра. 5 отелей на частной территории с мариной, спа, 7 пляжами</li><li><strong>Ikos Oceania & Ikos Olivia</strong> — Кассандра. Отмеченные наградами люксовые all-inclusive</li><li><strong>Eagles Palace</strong> — Уранополис. Вид на Афон, спа, частный пляж</li></ul><h2>По районам</h2><h3>Кассандра</h3><p>Самый <strong>развитый туристически</strong>. Много отелей, ресторанов, ночная жизнь.</p><h3>Ситония</h3><p>Более <strong>тихая и природная</strong>. Виллы, маленькие отели.</p><h3>Полуостров Афон</h3><p>Самый <strong>удалённый</strong> район. Уранополис как база.</p><h2>Ценовые категории (за ночь, лето)</h2><table><tr><th>Категория</th><th>Цена/ночь</th><th>Что ожидать</th></tr><tr><td>Бюджет</td><td>€50-80</td><td>Студии, комнаты, базовые удобства</td></tr><tr><td>Средний</td><td>€80-150</td><td>3-4★ отели, бассейн, завтрак</td></tr><tr><td>Люкс</td><td>€150+</td><td>5★ курорты, спа, all-inclusive</td></tr></table>',
      ro: '<h2>Tipuri de cazare</h2><p>Halkidiki oferă cazare pentru orice buget, de la <strong>resorturi de lux 5 stele</strong> la camere simple.</p><h2>Resorturi de lux</h2><ul><li><strong>Sani Resort</strong> — Kassandra. 5 hoteluri pe un domeniu privat cu marină, spa, 7 plaje</li><li><strong>Ikos Oceania & Ikos Olivia</strong> — Kassandra. All-inclusive de lux premiat mondial</li><li><strong>Eagles Palace</strong> — Ouranoupoli. Vedere la Athos, spa, plajă privată</li></ul><h2>Pe zone</h2><h3>Kassandra</h3><p>Cea mai <strong>dezvoltată turistic</strong>. Multe hoteluri, restaurante, viață de noapte.</p><h3>Sithonia</h3><p>Mai <strong>liniștită și naturală</strong>. Vile, hoteluri mici.</p><h3>Peninsula Athos</h3><p>Cea mai <strong>izolată</strong> zonă. Ouranoupoli ca bază.</p><h2>Categorii de prețuri (pe noapte, vara)</h2><table><tr><th>Categorie</th><th>Preț/noapte</th><th>Ce să așteptați</th></tr><tr><td>Buget</td><td>€50-80</td><td>Studiouri, camere, facilități de bază</td></tr><tr><td>Clasă medie</td><td>€80-150</td><td>Hoteluri 3-4★, piscină, mic dejun</td></tr><tr><td>Lux</td><td>€150+</td><td>Resorturi 5★, spa, all-inclusive</td></tr></table>',
      sr: '<h2>Tipovi smeštaja</h2><p>Halkidiki nudi smeštaj za svaki budžet, od <strong>luksuznih rizortova sa 5 zvezdica</strong> do jednostavnih soba.</p><h2>Luksuzni rizortovi</h2><ul><li><strong>Sani Resort</strong> — Kasandra. 5 hotela na privatnom imanju sa marinom, spa, 7 plaža</li><li><strong>Ikos Oceania & Ikos Olivia</strong> — Kasandra. Svetski nagrađivani luksuzni all-inclusive</li><li><strong>Eagles Palace</strong> — Uranopolis. Pogled na Atos, spa, privatna plaža</li></ul><h2>Po oblastima</h2><h3>Kasandra</h3><p>Najrazvijenija <strong>turistički</strong>. Mnogo hotela, restorana, noćni život.</p><h3>Sitonija</h3><p><strong>Mirnija i prirodnija</strong>. Vile, mali hoteli.</p><h3>Poluostrvo Atos</h3><p>Najudaljenija <strong>oblast</strong>. Uranopolis kao baza.</p><h2>Cenovne kategorije (po noći, leto)</h2><table><tr><th>Kategorija</th><th>Cena/noć</th><th>Šta očekivati</th></tr><tr><td>Budžet</td><td>€50-80</td><td>Studiji, sobe, osnovne pogodnosti</td></tr><tr><td>Srednja klasa</td><td>€80-150</td><td>3-4★ hoteli, bazen, doručak</td></tr><tr><td>Luksuz</td><td>€150+</td><td>5★ rizortovi, spa, all-inclusive</td></tr></table>',
    },
  },
  {
    slug: 'all-inclusive', icon: 'Star', color: 'amber',
    title: { el: 'All-Inclusive Resorts στη Χαλκιδική', en: 'Best All-Inclusive Resorts in Halkidiki', de: 'All-Inclusive-Resorts in Chalkidiki', bg: 'All-Inclusive курорти в Халкидики', ru: 'All-Inclusive курорты в Халкидиках', ro: 'Resorturi All-Inclusive în Halkidiki', sr: 'All-Inclusive rizortovi u Halkidikiju' },
    description: { el: 'Τα καλύτερα all-inclusive resorts & τι περιλαμβάνουν', en: 'Top all-inclusive resorts & what they include', de: 'Top All-Inclusive-Resorts & was enthalten ist', bg: 'Топ all-inclusive курорти и какво включват', ru: 'Лучшие all-inclusive курорты и что включено', ro: 'Cele mai bune resorturi all-inclusive și ce includ', sr: 'Najbolji all-inclusive rizortovi i šta uključuju' },
    metaTitle: { el: 'All-Inclusive Χαλκιδική — Καλύτερα Resorts | ChalkidikiHub', en: 'Halkidiki All-Inclusive — Best Resorts', de: 'Chalkidiki All-Inclusive — Beste Resorts', bg: 'Халкидики All-Inclusive — Най-добри курорти', ru: 'Халкидики All-Inclusive — Лучшие курорты', ro: 'Halkidiki All-Inclusive — Cele mai bune resorturi', sr: 'Halkidiki All-Inclusive — Najbolji rizortovi' },
    metaDesc: { el: 'Τα καλύτερα all-inclusive resorts Χαλκιδικής: Ikos, Sani, Potidea Palace, Pallini Beach. Τιμές, τι περιλαμβάνεται, tips επιλογής.', en: 'Best Halkidiki all-inclusive resorts: Ikos, Sani, Potidea Palace, Pallini Beach. Prices, what\'s included, tips.', de: 'Beste Chalkidiki All-Inclusive-Resorts: Ikos, Sani, Potidea Palace. Preise und Tipps.', bg: 'Най-добрите all-inclusive курорти в Халкидики: Ikos, Sani, Potidea Palace. Цени и съвети.', ru: 'Лучшие all-inclusive курорты Халкидиков: Ikos, Sani, Potidea Palace. Цены и советы.', ro: 'Cele mai bune resorturi all-inclusive Halkidiki: Ikos, Sani, Potidea Palace. Prețuri și sfaturi.', sr: 'Najbolji all-inclusive rizortovi Halkidikija: Ikos, Sani, Potidea Palace. Cene i saveti.' },
    content: {
      el: '<h2>Γιατί All-Inclusive στη Χαλκιδική;</h2><p>Τα all-inclusive resorts της Χαλκιδικής συνδυάζουν <strong>ελληνική φιλοξενία</strong> με διεθνή πρότυπα πολυτέλειας. Πληρώνετε μία φορά και απολαμβάνετε τα πάντα.</p><h2>Κορυφαία Resorts</h2><h3>Ikos Oceania (Κασσάνδρα)</h3><p>Βραβευμένο ως <strong>κορυφαίο all-inclusive παγκοσμίως</strong>. Gourmet εστιατόρια (Ιταλικό, Ασιατικό, Ελληνικό), ιδιωτική παραλία, σπα, παιδικά προγράμματα. Τιμή: ~€250-500/βράδυ για 2 άτομα.</p><h3>Ikos Olivia (Κασσάνδρα)</h3><p>Αδερφό resort του Oceania, ελαφρώς πιο <strong>οικογενειακό</strong>. Εξαιρετικές εγκαταστάσεις, πράσινοι κήποι. Τιμή: ~€220-450/βράδυ.</p><h3>Sani Resort (Κασσάνδρα)</h3><p>5 ξενοδοχεία (Sani Beach, Sani Club, Sani Asterias, Porto Sani, Sani Dunes). Μαρίνα, <strong>οικολογικό</strong> resort, 7 χλμ παραλία. Τιμή: ~€200-600/βράδυ ανάλογα ξενοδοχείο.</p><h3>Potidea Palace (Κασσάνδρα)</h3><p>Στην είσοδο της Κασσάνδρας, <strong>εξαιρετική σχέση τιμής-ποιότητας</strong>. Μεγάλη πισίνα, ιδιωτική παραλία. Τιμή: ~€120-200/βράδυ.</p><h3>Pallini Beach (Κασσάνδρα)</h3><p>Δίπλα στο Καλλιθέα, οικογενειακό, <strong>μεγάλη αμμώδης παραλία</strong>. Τιμή: ~€100-180/βράδυ.</p><h2>Τι Περιλαμβάνεται Συνήθως</h2><ul><li>Πρωινό, μεσημεριανό & βραδινό (buffet + a-la-carte)</li><li>Τοπικά & εισαγωγικά ποτά, κοκτέιλ, κρασιά</li><li>Πισίνα, παραλία, ξαπλώστρες, ομπρέλες</li><li>Παιδικά προγράμματα & club</li><li>Wi-Fi, γυμναστήριο, βασικό σπα</li></ul><h2>Tips Επιλογής</h2><ul><li>Ελέγξτε αν τα <strong>premium ποτά</strong> περιλαμβάνονται ή μόνο τοπικά</li><li>Σύγκρινε half-board vs all-inclusive — μερικές φορές η διαφορά είναι μικρή</li><li>Κρατήστε νωρίς για <strong>early booking εκπτώσεις 15-25%</strong></li></ul>',
      en: '<h2>Why All-Inclusive in Halkidiki?</h2><p>Halkidiki\'s all-inclusive resorts combine <strong>Greek hospitality</strong> with international luxury standards. Pay once, enjoy everything.</p><h2>Top Resorts</h2><h3>Ikos Oceania (Kassandra)</h3><p>Awarded as <strong>world\'s leading all-inclusive</strong> multiple times. Gourmet restaurants (Italian, Asian, Greek), private beach, spa, kids\' programs. Price: ~€250-500/night for 2.</p><h3>Ikos Olivia (Kassandra)</h3><p>Sister resort to Oceania, slightly more <strong>family-oriented</strong>. Excellent facilities, lush gardens. Price: ~€220-450/night.</p><h3>Sani Resort (Kassandra)</h3><p>5 hotels (Sani Beach, Sani Club, Sani Asterias, Porto Sani, Sani Dunes). Marina, <strong>eco-certified</strong> resort, 7km beach. Price: ~€200-600/night depending on hotel.</p><h3>Potidea Palace (Kassandra)</h3><p>At Kassandra\'s entrance, <strong>great value for money</strong>. Large pool, private beach. Price: ~€120-200/night.</p><h3>Pallini Beach (Kassandra)</h3><p>Near Kallithea, family-friendly, <strong>large sandy beach</strong>. Price: ~€100-180/night.</p><h2>What\'s Typically Included</h2><ul><li>Breakfast, lunch & dinner (buffet + a-la-carte)</li><li>Local & imported drinks, cocktails, wines</li><li>Pool, beach, sun loungers, umbrellas</li><li>Kids\' programs & club</li><li>Wi-Fi, gym, basic spa</li></ul><h2>Choosing Tips</h2><ul><li>Check if <strong>premium drinks</strong> are included or only local brands</li><li>Compare half-board vs all-inclusive — sometimes the difference is small</li><li>Book early for <strong>early-bird discounts of 15-25%</strong></li></ul>',
      de: '<h2>Warum All-Inclusive in Chalkidiki?</h2><p>Chalkidikis All-Inclusive-Resorts kombinieren <strong>griechische Gastfreundschaft</strong> mit internationalem Luxusstandard.</p><h2>Top-Resorts</h2><ul><li><strong>Ikos Oceania</strong> — Kassandra. Weltweit ausgezeichnetes All-Inclusive. ~€250-500/Nacht</li><li><strong>Ikos Olivia</strong> — Kassandra. Familienfreundlicher. ~€220-450/Nacht</li><li><strong>Sani Resort</strong> — Kassandra. 5 Hotels, Marina, Öko-Resort. ~€200-600/Nacht</li><li><strong>Potidea Palace</strong> — Kassandra. Gutes Preis-Leistung. ~€120-200/Nacht</li><li><strong>Pallini Beach</strong> — Kassandra. Familienfreundlich. ~€100-180/Nacht</li></ul><h2>Was enthalten ist</h2><ul><li>Frühstück, Mittag- & Abendessen</li><li>Lokale & importierte Getränke</li><li>Pool, Strand, Liegen, Sonnenschirme</li><li>Kinderprogramme & Club</li></ul>',
      bg: '<h2>Защо All-Inclusive в Халкидики?</h2><p>All-inclusive курортите в Халкидики съчетават <strong>гръцко гостоприемство</strong> с международен лукс.</p><h2>Топ курорти</h2><ul><li><strong>Ikos Oceania</strong> — Касандра. Световно награждаван. ~€250-500/нощ</li><li><strong>Ikos Olivia</strong> — Касандра. По-семеен. ~€220-450/нощ</li><li><strong>Sani Resort</strong> — Касандра. 5 хотела, марина, еко-курорт. ~€200-600/нощ</li><li><strong>Potidea Palace</strong> — Касандра. Добро съотношение качество-цена. ~€120-200/нощ</li><li><strong>Pallini Beach</strong> — Касандра. За семейства. ~€100-180/нощ</li></ul><h2>Какво е включено</h2><ul><li>Закуска, обяд и вечеря</li><li>Местни и вносни напитки</li><li>Басейн, плаж, шезлонги</li><li>Детски програми</li></ul>',
      ru: '<h2>Почему All-Inclusive в Халкидиках?</h2><p>All-inclusive курорты Халкидиков сочетают <strong>греческое гостеприимство</strong> с международными стандартами роскоши.</p><h2>Топ-курорты</h2><ul><li><strong>Ikos Oceania</strong> — Кассандра. Мировой лидер all-inclusive. ~€250-500/ночь</li><li><strong>Ikos Olivia</strong> — Кассандра. Более семейный. ~€220-450/ночь</li><li><strong>Sani Resort</strong> — Кассандра. 5 отелей, марина, эко-курорт. ~€200-600/ночь</li><li><strong>Potidea Palace</strong> — Кассандра. Отличное соотношение цена-качество. ~€120-200/ночь</li><li><strong>Pallini Beach</strong> — Кассандра. Для семей. ~€100-180/ночь</li></ul><h2>Что включено</h2><ul><li>Завтрак, обед и ужин</li><li>Местные и импортные напитки</li><li>Бассейн, пляж, шезлонги</li><li>Детские программы</li></ul>',
      ro: '<h2>De ce All-Inclusive în Halkidiki?</h2><p>Resorturile all-inclusive din Halkidiki combină <strong>ospitalitatea greacă</strong> cu standardele internaționale de lux.</p><h2>Top resorturi</h2><ul><li><strong>Ikos Oceania</strong> — Kassandra. Premiat mondial. ~€250-500/noapte</li><li><strong>Ikos Olivia</strong> — Kassandra. Mai orientat spre familii. ~€220-450/noapte</li><li><strong>Sani Resort</strong> — Kassandra. 5 hoteluri, marină, eco-resort. ~€200-600/noapte</li><li><strong>Potidea Palace</strong> — Kassandra. Raport calitate-preț excelent. ~€120-200/noapte</li><li><strong>Pallini Beach</strong> — Kassandra. Pentru familii. ~€100-180/noapte</li></ul><h2>Ce este inclus</h2><ul><li>Mic dejun, prânz și cină</li><li>Băuturi locale și de import</li><li>Piscină, plajă, șezlonguri</li><li>Programe pentru copii</li></ul>',
      sr: '<h2>Zašto All-Inclusive u Halkidikiju?</h2><p>All-inclusive rizortovi u Halkidikiju kombinuju <strong>grčko gostoprimstvo</strong> sa međunarodnim standardima luksuza.</p><h2>Top rizortovi</h2><ul><li><strong>Ikos Oceania</strong> — Kasandra. Svetski nagrađivan. ~€250-500/noć</li><li><strong>Ikos Olivia</strong> — Kasandra. Više porodičan. ~€220-450/noć</li><li><strong>Sani Resort</strong> — Kasandra. 5 hotela, marina, eko-rizort. ~€200-600/noć</li><li><strong>Potidea Palace</strong> — Kasandra. Odličan odnos cene i kvaliteta. ~€120-200/noć</li><li><strong>Pallini Beach</strong> — Kasandra. Za porodice. ~€100-180/noć</li></ul><h2>Šta je uključeno</h2><ul><li>Doručak, ručak i večera</li><li>Domaća i uvozna pića</li><li>Bazen, plaža, ležaljke</li><li>Dečiji programi</li></ul>',
    },
  },
  {
    slug: 'car-rental', icon: 'Car', color: 'slate',
    title: { el: 'Ενοικίαση Αυτοκινήτου στη Χαλκιδική', en: 'Car Rental in Halkidiki', de: 'Mietwagen in Chalkidiki', bg: 'Коли под наем в Халкидики', ru: 'Аренда автомобиля в Халкидиках', ro: 'Închiriere auto în Halkidiki', sr: 'Rent-a-car u Halkidikiju' },
    description: { el: 'Οδηγίες ενοικίασης, οδήγησης & πρακτικά tips', en: 'Rental tips, driving guide & practical info', de: 'Mietwagen-Tipps, Fahrhinweise & praktische Infos', bg: 'Съвети за наемане, шофиране и практическа информация', ru: 'Советы по аренде, вождению и практическая информация', ro: 'Sfaturi închiriere, ghid de condus și informații practice', sr: 'Saveti za iznajmljivanje, vožnju i praktične informacije' },
    metaTitle: { el: 'Ενοικίαση Αυτοκινήτου Χαλκιδική — Οδηγός | ChalkidikiHub', en: 'Car Rental Halkidiki — Complete Guide', de: 'Mietwagen Chalkidiki — Kompletter Führer', bg: 'Коли под наем Халкидики — Пълен гид', ru: 'Аренда авто Халкидики — Полный гид', ro: 'Închiriere auto Halkidiki — Ghid complet', sr: 'Rent-a-car Halkidiki — Kompletan vodič' },
    metaDesc: { el: 'Ενοικίαση αυτοκινήτου Χαλκιδική: αεροδρόμιο SKG, τιμές, ελληνικοί κανόνες, δρόμοι, parking, βενζινάδικα. Πρακτικός οδηγός.', en: 'Car rental Halkidiki: SKG airport, prices, Greek driving rules, road conditions, parking, fuel stations. Practical guide.', de: 'Mietwagen Chalkidiki: Flughafen SKG, Preise, griechische Verkehrsregeln, Straßen, Parkplätze.', bg: 'Коли под наем Халкидики: летище SKG, цени, гръцки правила, пътища, паркинг.', ru: 'Аренда авто Халкидики: аэропорт SKG, цены, греческие правила, дороги, парковка.', ro: 'Închiriere auto Halkidiki: aeroport SKG, prețuri, reguli grecești, drumuri, parcare.', sr: 'Rent-a-car Halkidiki: aerodrom SKG, cene, grčka pravila, putevi, parking.' },
    content: {
      el: '<h2>Χρειάζεστε Αυτοκίνητο;</h2><p><strong>Ναι, σίγουρα.</strong> Η Χαλκιδική δεν έχει καλό δημόσιο μεταφορικό δίκτυο. Αυτοκίνητο σας δίνει ελευθερία να εξερευνήσετε παραλίες, χωριά και κρυφά σημεία.</p><h2>Ενοικίαση από Αεροδρόμιο SKG</h2><p>Το αεροδρόμιο Θεσσαλονίκης <strong>\"Μακεδονία\" (SKG)</strong> είναι η πύλη εισόδου. Εταιρείες στο αεροδρόμιο: Hertz, Avis, Europcar, Sixt, και τοπικές (συχνά φθηνότερες).</p><ul><li>Τιμή καλοκαίρι: ~€30-60/ημέρα για μικρό αυτοκίνητο</li><li>Κρατήστε online, τουλάχιστον 2 εβδομάδες πριν</li><li>Full insurance (CDW + theft) — αξίζει πάντα</li></ul><h2>Αποστάσεις & Χρόνοι</h2><table><tr><th>Διαδρομή</th><th>Απόσταση</th><th>Χρόνος</th></tr><tr><td>SKG → Κασσάνδρα (Πευκοχώρι)</td><td>~120 χλμ</td><td>~1:30</td></tr><tr><td>SKG → Σιθωνία (Νικήτη)</td><td>~110 χλμ</td><td>~1:20</td></tr><tr><td>SKG → Ουρανούπολη</td><td>~130 χλμ</td><td>~1:40</td></tr><tr><td>Κασσάνδρα → Σιθωνία</td><td>~60-80 χλμ</td><td>~1:00</td></tr></table><h2>Οδήγηση στη Χαλκιδική</h2><ul><li><strong>Δρόμοι:</strong> Κύριοι δρόμοι καλοί, δευτερεύοντες (προς παραλίες) μπορεί να είναι χωματόδρομοι</li><li><strong>Parking:</strong> Δωρεάν στις περισσότερες παραλίες, πληρωτικό σε δημοφιλείς (€3-5/ημέρα)</li><li><strong>Βενζινάδικα:</strong> Αρκετά στους κύριους δρόμους, λιγότερα στη νότια Σιθωνία</li><li><strong>Κίνηση:</strong> Σαββατοκύριακα Ιουλίου-Αυγούστου μπορεί να έχει κίνηση στην είσοδο Κασσάνδρας</li></ul><h2>Κανόνες που Πρέπει να Ξέρετε</h2><ul><li>Όριο ταχύτητας: 50 χλμ/ώρα σε κατοικημένες, 90 χλμ/ώρα εκτός, 130 χλμ/ώρα σε αυτοκινητόδρομο</li><li>Ζώνη ασφαλείας υποχρεωτική για όλους</li><li>Κινητό: ΑΠΑΓΟΡΕΥΕΤΑΙ χωρίς hands-free</li><li>Αλκοόλ: 0.5‰ όριο (0.2‰ για νέους οδηγούς)</li><li>Φώτα: Υποχρεωτικά ημέρα-νύχτα σε αυτοκινητοδρόμους</li></ul>',
      en: '<h2>Do You Need a Car?</h2><p><strong>Absolutely yes.</strong> Halkidiki has limited public transport. A car gives you the freedom to explore beaches, villages, and hidden gems.</p><h2>Renting from SKG Airport</h2><p>Thessaloniki\'s <strong>"Macedonia" Airport (SKG)</strong> is the gateway. Companies at the airport: Hertz, Avis, Europcar, Sixt, and local firms (often cheaper).</p><ul><li>Summer price: ~€30-60/day for a small car</li><li>Book online at least 2 weeks ahead</li><li>Full insurance (CDW + theft) — always worth it</li></ul><h2>Distances & Drive Times</h2><table><tr><th>Route</th><th>Distance</th><th>Time</th></tr><tr><td>SKG → Kassandra (Pefkochori)</td><td>~120 km</td><td>~1:30</td></tr><tr><td>SKG → Sithonia (Nikiti)</td><td>~110 km</td><td>~1:20</td></tr><tr><td>SKG → Ouranoupoli</td><td>~130 km</td><td>~1:40</td></tr><tr><td>Kassandra → Sithonia</td><td>~60-80 km</td><td>~1:00</td></tr></table><h2>Driving in Halkidiki</h2><ul><li><strong>Roads:</strong> Main roads are good; secondary roads (to beaches) can be unpaved</li><li><strong>Parking:</strong> Free at most beaches, paid at popular ones (€3-5/day)</li><li><strong>Fuel stations:</strong> Plenty on main roads, fewer in southern Sithonia</li><li><strong>Traffic:</strong> July-August weekends can have congestion at Kassandra\'s entrance</li></ul><h2>Greek Driving Rules to Know</h2><ul><li>Speed limits: 50 km/h in towns, 90 km/h outside, 130 km/h on motorways</li><li>Seatbelts mandatory for all passengers</li><li>Mobile phones: PROHIBITED without hands-free</li><li>Alcohol limit: 0.5‰ (0.2‰ for new drivers)</li><li>Headlights: Mandatory day and night on motorways</li></ul>',
      de: '<h2>Brauchen Sie ein Auto?</h2><p><strong>Definitiv ja.</strong> Chalkidiki hat begrenzten öffentlichen Verkehr. Ein Auto gibt Ihnen Freiheit.</p><h2>Mietwagen am Flughafen SKG</h2><p>Thessalonikis Flughafen <strong>"Macedonia" (SKG)</strong> ist das Tor. Firmen: Hertz, Avis, Europcar, Sixt und lokale Anbieter.</p><ul><li>Sommerpreis: ~€30-60/Tag für einen Kleinwagen</li><li>Mindestens 2 Wochen vorher online buchen</li><li>Vollkasko (CDW + Diebstahl) — immer empfehlenswert</li></ul><h2>Entfernungen</h2><table><tr><th>Strecke</th><th>Entfernung</th><th>Zeit</th></tr><tr><td>SKG → Kassandra</td><td>~120 km</td><td>~1:30</td></tr><tr><td>SKG → Sithonia</td><td>~110 km</td><td>~1:20</td></tr><tr><td>SKG → Ouranoupoli</td><td>~130 km</td><td>~1:40</td></tr></table><h2>Verkehrsregeln</h2><ul><li>Geschwindigkeitsbegrenzung: 50 km/h in Orten, 90 km/h außerhalb, 130 km/h Autobahn</li><li>Anschnallpflicht für alle</li><li>Handy nur mit Freisprechanlage</li><li>Alkoholgrenze: 0,5‰</li></ul>',
      bg: '<h2>Имате ли нужда от кола?</h2><p><strong>Определено да.</strong> Халкидики има ограничен обществен транспорт.</p><h2>Наемане от летище SKG</h2><p>Летище Солун <strong>\"Македония\" (SKG)</strong> е входната точка. Компании: Hertz, Avis, Europcar, Sixt и местни фирми.</p><ul><li>Лятна цена: ~€30-60/ден за малка кола</li><li>Резервирайте онлайн поне 2 седмици предварително</li><li>Пълна застраховка — винаги си заслужава</li></ul><h2>Разстояния</h2><table><tr><th>Маршрут</th><th>Разстояние</th><th>Време</th></tr><tr><td>SKG → Касандра</td><td>~120 км</td><td>~1:30</td></tr><tr><td>SKG → Ситония</td><td>~110 км</td><td>~1:20</td></tr><tr><td>SKG → Уранополис</td><td>~130 км</td><td>~1:40</td></tr></table><h2>Правила за движение</h2><ul><li>Ограничение на скоростта: 50 км/ч в населено място, 90 км/ч извън, 130 км/ч на магистрала</li><li>Колани задължителни за всички</li><li>Телефон само с хендсфри</li><li>Алкохол: 0,5‰</li></ul>',
      ru: '<h2>Нужна ли вам машина?</h2><p><strong>Однозначно да.</strong> В Халкидиках ограниченный общественный транспорт.</p><h2>Аренда в аэропорту SKG</h2><p>Аэропорт Салоников <strong>\"Македония\" (SKG)</strong> — входные ворота. Компании: Hertz, Avis, Europcar, Sixt и местные фирмы.</p><ul><li>Летняя цена: ~€30-60/день за маленькую машину</li><li>Бронируйте онлайн минимум за 2 недели</li><li>Полная страховка — всегда стоит того</li></ul><h2>Расстояния</h2><table><tr><th>Маршрут</th><th>Расстояние</th><th>Время</th></tr><tr><td>SKG → Кассандра</td><td>~120 км</td><td>~1:30</td></tr><tr><td>SKG → Ситония</td><td>~110 км</td><td>~1:20</td></tr><tr><td>SKG → Уранополис</td><td>~130 км</td><td>~1:40</td></tr></table><h2>Правила дорожного движения</h2><ul><li>Ограничение скорости: 50 км/ч в городе, 90 км/ч за городом, 130 км/ч на автостраде</li><li>Ремни безопасности обязательны для всех</li><li>Телефон только с хендс-фри</li><li>Алкоголь: 0,5‰</li></ul>',
      ro: '<h2>Aveți nevoie de mașină?</h2><p><strong>Cu siguranță da.</strong> Halkidiki are transport public limitat.</p><h2>Închiriere de la aeroportul SKG</h2><p>Aeroportul Thessaloniki <strong>"Macedonia" (SKG)</strong> este poarta de intrare. Companii: Hertz, Avis, Europcar, Sixt și firme locale.</p><ul><li>Preț vara: ~€30-60/zi pentru o mașină mică</li><li>Rezervați online cu cel puțin 2 săptămâni înainte</li><li>Asigurare completă — merită întotdeauna</li></ul><h2>Distanțe</h2><table><tr><th>Traseu</th><th>Distanță</th><th>Timp</th></tr><tr><td>SKG → Kassandra</td><td>~120 km</td><td>~1:30</td></tr><tr><td>SKG → Sithonia</td><td>~110 km</td><td>~1:20</td></tr><tr><td>SKG → Ouranoupoli</td><td>~130 km</td><td>~1:40</td></tr></table><h2>Reguli de circulație</h2><ul><li>Limită de viteză: 50 km/h în localități, 90 km/h în afară, 130 km/h pe autostradă</li><li>Centuri obligatorii pentru toți</li><li>Telefon doar cu hands-free</li><li>Alcool: 0,5‰</li></ul>',
      sr: '<h2>Da li vam treba auto?</h2><p><strong>Svakako da.</strong> Halkidiki ima ograničen javni prevoz.</p><h2>Iznajmljivanje sa aerodroma SKG</h2><p>Aerodrom Solun <strong>\"Makedonija\" (SKG)</strong> je ulazna tačka. Kompanije: Hertz, Avis, Europcar, Sixt i lokalne firme.</p><ul><li>Letnja cena: ~€30-60/dan za mali auto</li><li>Rezervišite online najmanje 2 nedelje unapred</li><li>Puno osiguranje — uvek se isplati</li></ul><h2>Rastojanja</h2><table><tr><th>Ruta</th><th>Rastojanje</th><th>Vreme</th></tr><tr><td>SKG → Kasandra</td><td>~120 km</td><td>~1:30</td></tr><tr><td>SKG → Sitonija</td><td>~110 km</td><td>~1:20</td></tr><tr><td>SKG → Uranopolis</td><td>~130 km</td><td>~1:40</td></tr></table><h2>Saobraćajni propisi</h2><ul><li>Ograničenje brzine: 50 km/h u naselju, 90 km/h van naselja, 130 km/h na autoputu</li><li>Pojasevi obavezni za sve</li><li>Telefon samo sa hends-fri</li><li>Alkohol: 0,5‰</li></ul>',
    },
  },
  {
    slug: 'camping', icon: 'Tent', color: 'green',
    title: { el: 'Camping στη Χαλκιδική', en: 'Camping in Halkidiki', de: 'Camping in Chalkidiki', bg: 'Къмпинг в Халкидики', ru: 'Кемпинг в Халкидиках', ro: 'Camping în Halkidiki', sr: 'Kampovanje u Halkidikiju' },
    description: { el: 'Καλύτερα campings, τιμές & κανόνες ελεύθερης κατασκήνωσης', en: 'Best campgrounds, prices & wild camping rules', de: 'Beste Campingplätze, Preise & Wildcamping-Regeln', bg: 'Най-добрите къмпинги, цени и правила за диво къмпингуване', ru: 'Лучшие кемпинги, цены и правила дикого кемпинга', ro: 'Cele mai bune campinguri, prețuri și reguli de camping sălbatic', sr: 'Najbolji kampovi, cene i pravila za divlje kampovanje' },
    metaTitle: { el: 'Camping Χαλκιδική — Καλύτερα Campings | ChalkidikiHub', en: 'Camping Halkidiki — Best Campgrounds', de: 'Camping Chalkidiki — Beste Campingplätze', bg: 'Къмпинг Халкидики — Най-добри къмпинги', ru: 'Кемпинг Халкидики — Лучшие кемпинги', ro: 'Camping Halkidiki — Cele mai bune campinguri', sr: 'Kampovanje Halkidiki — Najbolji kampovi' },
    metaDesc: { el: 'Camping στη Χαλκιδική: Αρμενιστής, Ακτή Ονείρου, τιμές €15-30/βράδυ, κανόνες ελεύθερης κατασκήνωσης, καλύτερες παραλίες.', en: 'Camping in Halkidiki: Armenistis, Akti Oneirou, prices €15-30/night, wild camping rules, best camping beaches.', de: 'Camping Chalkidiki: Armenistis, Akti Oneirou, Preise €15-30/Nacht, Wildcamping-Regeln.', bg: 'Къмпинг Халкидики: Арменистис, Акти Онейру, цени €15-30/нощ, правила за диво къмпингуване.', ru: 'Кемпинг Халкидики: Арменистис, Акти Онейру, цены €15-30/ночь, правила дикого кемпинга.', ro: 'Camping Halkidiki: Armenistis, Akti Oneirou, prețuri €15-30/noapte, reguli de camping sălbatic.', sr: 'Kampovanje Halkidiki: Armenistis, Akti Oneiru, cene €15-30/noć, pravila za divlje kampovanje.' },
    content: {
      el: '<h2>Camping στη Χαλκιδική</h2><p>Η Χαλκιδική είναι ένας από τους <strong>καλύτερους προορισμούς camping στην Ελλάδα</strong>, με πευκοδάση που φτάνουν ως τη θάλασσα και οργανωμένα campings υψηλής ποιότητας.</p><h2>Κορυφαία Campings</h2><h3>Armenistis Camping (Σιθωνία)</h3><p>Το <strong>διασημότερο camping της Ελλάδας</strong>. Στις ακτές της Σιθωνίας, μέσα σε πευκόδασος. Supermarket, εστιατόρια, beach bar, water sports. Τιμή: ~€20-35/βράδυ για σκηνή + 2 άτομα.</p><h3>Akti Oneirou (Σιθωνία)</h3><p>Κοντά στο Βουρβουρού, <strong>ονειρεμένο τοπίο</strong>. Μικρότερο, πιο ήσυχο. Τιμή: ~€15-25/βράδυ.</p><h3>Camping Ouranoupoli</h3><p>Κοντά στο λιμάνι για τον Άθω. <strong>Βάση εξερεύνησης</strong> για την 3η χερσόνησο. Τιμή: ~€15-20/βράδυ.</p><h3>Camping Sithonia Village</h3><p>Κοντά στον Νέο Μαρμαρά, <strong>οικογενειακό</strong>. Πισίνα, παιδική χαρά. Τιμή: ~€18-28/βράδυ.</p><h2>Τιμές & Τι Περιλαμβάνεται</h2><ul><li>Βασική τιμή: €15-30/βράδυ (σκηνή + 2 άτομα)</li><li>Ρεύμα: +€3-5</li><li>Τροχόσπιτο/campervan: +€5-10</li><li>Συνήθως περιλαμβάνουν: ντους, τουαλέτες, supermarket, Wi-Fi</li></ul><h2>Ελεύθερη Κατασκήνωση</h2><p>Η ελεύθερη κατασκήνωση είναι <strong>τεχνικά παράνομη</strong> στην Ελλάδα, αλλά στην πράξη γίνεται ανεκτή σε απομακρυσμένες παραλίες, ιδίως στη <strong>νότια Σιθωνία</strong>. Μην αφήνετε σκουπίδια και σεβαστείτε τη φύση.</p><h2>Καλύτερες Παραλίες για Camping</h2><ul><li><strong>Καρύδι</strong> — Πευκόδασος, κρυστάλλινα νερά</li><li><strong>Φάβα</strong> — Αμμώδης, ρηχά νερά</li><li><strong>Καβουρότρυπες</strong> — Εξωτικές σπηλιές, τιρκουάζ νερά</li></ul>',
      en: '<h2>Camping in Halkidiki</h2><p>Halkidiki is one of the <strong>best camping destinations in Greece</strong>, with pine forests reaching the sea and high-quality organized campgrounds.</p><h2>Top Campgrounds</h2><h3>Armenistis Camping (Sithonia)</h3><p>The <strong>most famous campground in Greece</strong>. On Sithonia\'s coast, nestled in pine forest. Supermarket, restaurants, beach bar, water sports. Price: ~€20-35/night for tent + 2 people.</p><h3>Akti Oneirou (Sithonia)</h3><p>Near Vourvourou, <strong>dreamy landscape</strong>. Smaller, quieter. Price: ~€15-25/night.</p><h3>Camping Ouranoupoli</h3><p>Near the port for Mount Athos. <strong>Exploration base</strong> for the 3rd peninsula. Price: ~€15-20/night.</p><h3>Camping Sithonia Village</h3><p>Near Neos Marmaras, <strong>family-friendly</strong>. Pool, playground. Price: ~€18-28/night.</p><h2>Prices & What\'s Included</h2><ul><li>Base price: €15-30/night (tent + 2 people)</li><li>Electricity: +€3-5</li><li>Caravan/campervan: +€5-10</li><li>Usually includes: showers, toilets, minimarket, Wi-Fi</li></ul><h2>Wild Camping</h2><p>Wild camping is <strong>technically illegal</strong> in Greece, but in practice it is tolerated at remote beaches, especially in <strong>southern Sithonia</strong>. Leave no trace and respect nature.</p><h2>Best Camping Beaches</h2><ul><li><strong>Karidi</strong> — Pine forest, crystal waters</li><li><strong>Fava</strong> — Sandy, shallow waters</li><li><strong>Kavourotrypes</strong> — Exotic caves, turquoise waters</li></ul>',
      de: '<h2>Camping in Chalkidiki</h2><p>Chalkidiki ist eines der <strong>besten Camping-Reiseziele Griechenlands</strong>, mit Pinienwäldern direkt am Meer.</p><h2>Top-Campingplätze</h2><ul><li><strong>Armenistis Camping</strong> — Sithonia. Berühmtester Campingplatz Griechenlands. ~€20-35/Nacht</li><li><strong>Akti Oneirou</strong> — Sithonia. Traumhafte Landschaft. ~€15-25/Nacht</li><li><strong>Camping Ouranoupoli</strong> — Basis für Athos. ~€15-20/Nacht</li><li><strong>Camping Sithonia Village</strong> — Familienfreundlich. ~€18-28/Nacht</li></ul><h2>Preise</h2><ul><li>Grundpreis: €15-30/Nacht (Zelt + 2 Personen)</li><li>Strom: +€3-5</li><li>Wohnmobil: +€5-10</li></ul><h2>Wildcamping</h2><p>Wildcamping ist in Griechenland <strong>offiziell verboten</strong>, wird aber an abgelegenen Stränden, besonders in Süd-Sithonia, toleriert.</p>',
      bg: '<h2>Къмпинг в Халкидики</h2><p>Халкидики е една от <strong>най-добрите къмпинг дестинации в Гърция</strong>.</p><h2>Топ къмпинги</h2><ul><li><strong>Armenistis</strong> — Ситония. Най-известният къмпинг в Гърция. ~€20-35/нощ</li><li><strong>Akti Oneirou</strong> — Ситония. Мечтан пейзаж. ~€15-25/нощ</li><li><strong>Camping Ouranoupoli</strong> — База за Атон. ~€15-20/нощ</li><li><strong>Camping Sithonia Village</strong> — Семеен. ~€18-28/нощ</li></ul><h2>Цени</h2><ul><li>Базова цена: €15-30/нощ (палатка + 2 души)</li><li>Ток: +€3-5</li><li>Каравана: +€5-10</li></ul><h2>Диво къмпингуване</h2><p>Дивото къмпингуване е <strong>технически незаконно</strong> в Гърция, но се толерира на отдалечени плажове, особено в <strong>южна Ситония</strong>.</p>',
      ru: '<h2>Кемпинг в Халкидиках</h2><p>Халкидики — одно из <strong>лучших мест для кемпинга в Греции</strong>.</p><h2>Лучшие кемпинги</h2><ul><li><strong>Armenistis</strong> — Ситония. Самый известный кемпинг Греции. ~€20-35/ночь</li><li><strong>Akti Oneirou</strong> — Ситония. Сказочный пейзаж. ~€15-25/ночь</li><li><strong>Camping Ouranoupoli</strong> — База для Афона. ~€15-20/ночь</li><li><strong>Camping Sithonia Village</strong> — Семейный. ~€18-28/ночь</li></ul><h2>Цены</h2><ul><li>Базовая цена: €15-30/ночь (палатка + 2 человека)</li><li>Электричество: +€3-5</li><li>Автодом: +€5-10</li></ul><h2>Дикий кемпинг</h2><p>Дикий кемпинг <strong>формально незаконен</strong> в Греции, но на практике допускается на отдалённых пляжах, особенно на <strong>юге Ситонии</strong>.</p>',
      ro: '<h2>Camping în Halkidiki</h2><p>Halkidiki este una dintre <strong>cele mai bune destinații de camping din Grecia</strong>.</p><h2>Top campinguri</h2><ul><li><strong>Armenistis</strong> — Sithonia. Cel mai faimos camping din Grecia. ~€20-35/noapte</li><li><strong>Akti Oneirou</strong> — Sithonia. Peisaj de vis. ~€15-25/noapte</li><li><strong>Camping Ouranoupoli</strong> — Bază pentru Athos. ~€15-20/noapte</li><li><strong>Camping Sithonia Village</strong> — Pentru familii. ~€18-28/noapte</li></ul><h2>Prețuri</h2><ul><li>Preț de bază: €15-30/noapte (cort + 2 persoane)</li><li>Electricitate: +€3-5</li><li>Rulotă: +€5-10</li></ul><h2>Camping sălbatic</h2><p>Campingul sălbatic este <strong>tehnic ilegal</strong> în Grecia, dar tolerat pe plaje izolate, mai ales în <strong>sudul Sithoniei</strong>.</p>',
      sr: '<h2>Kampovanje u Halkidikiju</h2><p>Halkidiki je jedna od <strong>najboljih kampovanje destinacija u Grčkoj</strong>.</p><h2>Top kampovi</h2><ul><li><strong>Armenistis</strong> — Sitonija. Najpoznatiji kamp u Grčkoj. ~€20-35/noć</li><li><strong>Akti Oneiru</strong> — Sitonija. Sanjivi pejzaž. ~€15-25/noć</li><li><strong>Camping Ouranoupoli</strong> — Baza za Atos. ~€15-20/noć</li><li><strong>Camping Sithonia Village</strong> — Porodičan. ~€18-28/noć</li></ul><h2>Cene</h2><ul><li>Osnovna cena: €15-30/noć (šator + 2 osobe)</li><li>Struja: +€3-5</li><li>Kamper: +€5-10</li></ul><h2>Divlje kampovanje</h2><p>Divlje kampovanje je <strong>tehnički ilegalno</strong> u Grčkoj, ali se toleriše na udaljenim plažama, posebno u <strong>južnoj Sitoniji</strong>.</p>',
    },
  },
  {
    slug: 'villages', icon: 'Church', color: 'orange',
    title: { el: 'Γραφικά Χωριά της Χαλκιδικής', en: 'Charming Villages of Halkidiki', de: 'Malerische Dörfer in Chalkidiki', bg: 'Очарователни села в Халкидики', ru: 'Живописные деревни Халкидиков', ro: 'Sate pitorești din Halkidiki', sr: 'Šarmantna sela Halkidikija' },
    description: { el: 'Τα πιο όμορφα χωριά & τι να δείτε σε κάθε ένα', en: 'Most beautiful villages & what to see in each', de: 'Die schönsten Dörfer & was es zu sehen gibt', bg: 'Най-красивите села и какво да видите във всяко', ru: 'Самые красивые деревни и что посмотреть в каждой', ro: 'Cele mai frumoase sate și ce să vedeți în fiecare', sr: 'Najlepša sela i šta videti u svakom' },
    metaTitle: { el: 'Χωριά Χαλκιδικής — Άφυτος, Νικήτη, Παρθενώνας | ChalkidikiHub', en: 'Halkidiki Villages — Afytos, Nikiti, Parthenonas', de: 'Chalkidiki Dörfer — Afytos, Nikiti, Parthenonas', bg: 'Села Халкидики — Афитос, Никити, Партенонас', ru: 'Деревни Халкидики — Афитос, Никити, Партенонас', ro: 'Sate Halkidiki — Afytos, Nikiti, Parthenonas', sr: 'Sela Halkidikija — Afitos, Nikiti, Partenonas' },
    metaDesc: { el: 'Τα πιο γραφικά χωριά Χαλκιδικής: Άφυτος, Νικήτη, Παρθενώνας, Αρναία, Νέος Μαρμαράς, Σάρτη. Ιστορία, αξιοθέατα, φαγητό.', en: 'Most charming Halkidiki villages: Afytos, Nikiti, Parthenonas, Arnea, Neos Marmaras, Sarti. History, sights, food.', de: 'Charmanteste Chalkidiki-Dörfer: Afytos, Nikiti, Parthenonas, Arnea. Geschichte, Sehenswürdigkeiten, Essen.', bg: 'Най-очарователните села в Халкидики: Афитос, Никити, Партенонас, Арнеа. История, забележителности, храна.', ru: 'Самые красивые деревни Халкидиков: Афитос, Никити, Партенонас, Арнея. История, достопримечательности, еда.', ro: 'Cele mai fermecătoare sate din Halkidiki: Afytos, Nikiti, Parthenonas, Arnea. Istorie, obiective, mâncare.', sr: 'Najšarmantnija sela Halkidikija: Afitos, Nikiti, Partenonas, Arnea. Istorija, znamenitosti, hrana.' },
    content: {
      el: '<h2>Χωριά Χαλκιδικής</h2><p>Πέρα από τις παραλίες, η Χαλκιδική κρύβει <strong>μαγευτικά χωριά</strong> με πέτρινα σπίτια, παραδοσιακές ταβέρνες και αυθεντική ατμόσφαιρα.</p><h2>Άφυτος (Κασσάνδρα)</h2><p>Το <strong>αρχοντικό χωριό</strong> της Κασσάνδρας. Πέτρινα σπίτια στον γκρεμό με πανοραμική θέα στη θάλασσα. Παραδοσιακή πλατεία, καλλιτεχνικά εργαστήρια, γκαλερί. Μην χάσετε το ηλιοβασίλεμα από τα μπαλκόνια.</p><h2>Παλιά Νικήτη (Σιθωνία)</h2><p>Η <strong>παλιά πόλη της Νικήτης</strong> ανακαινίστηκε με σεβασμό. Στενά δρομάκια, πέτρινα σπίτια, εργαστήρια μελιού και κεραμικής. Η Νικήτη είναι γνωστή για το <strong>εξαιρετικό μέλι</strong> της.</p><h2>Παρθενώνας</h2><p>Εγκαταλειμμένο ορεινό χωριό που <strong>αναστηλώθηκε</strong> σε πολιτιστικό χωριό. Πανοραμική θέα στον Τορωναίο κόλπο. Μουσείο, ταβέρνες, πεζοπορικά μονοπάτια. Ιδανικό για ημερήσια εκδρομή.</p><h2>Αρναία</h2><p>Η <strong>πρωτεύουσα του ορεινού</strong> Χαλκιδικής. Παραδοσιακά πέτρινα αρχοντικά, εβδομαδιαία λαϊκή αγορά (Σάββατο), τοπικά προϊόντα (μέλι, τσίπουρο, γλυκά κουταλιού). Υψόμετρο ~600μ — δροσερό ακόμα και το καλοκαίρι.</p><h2>Νέος Μαρμαράς (Σιθωνία)</h2><p>Το <strong>μεγαλύτερο χωριό</strong> της Σιθωνίας. Ζωντανό λιμάνι, εστιατόρια θαλασσινών, νυχτερινή ζωή. Κοντά στο Porto Carras.</p><h2>Σάρτη (Σιθωνία)</h2><p>Γραφικό ψαροχώρι με <strong>μεγάλη αμμώδη παραλία</strong> και θέα στο Άγιο Όρος. Τουριστικό αλλά αυθεντικό.</p><h2>Σίβηρη (Κασσάνδρα)</h2><p>Χωριό-θέρετρο με <strong>φεστιβάλ Κασσάνδρας</strong> (κάθε καλοκαίρι). Ωραία παραλία, οικογενειακό.</p>',
      en: '<h2>Halkidiki Villages</h2><p>Beyond the beaches, Halkidiki hides <strong>enchanting villages</strong> with stone houses, traditional tavernas, and authentic atmosphere.</p><h2>Afytos (Kassandra)</h2><p>The <strong>aristocratic village</strong> of Kassandra. Stone houses perched on cliffs with panoramic sea views. Traditional square, art workshops, galleries. Do not miss the sunset from the balconies.</p><h2>Old Nikiti (Sithonia)</h2><p>The <strong>old town of Nikiti</strong> has been respectfully restored. Narrow lanes, stone houses, honey and ceramic workshops. Nikiti is famous for its <strong>exceptional honey</strong>.</p><h2>Parthenonas</h2><p>An abandoned mountain village <strong>restored</strong> into a cultural settlement. Panoramic views of the Toronean Gulf. Museum, tavernas, hiking trails. Ideal for a day trip.</p><h2>Arnea</h2><p>The <strong>mountain capital</strong> of Halkidiki. Traditional stone mansions, weekly farmers\' market (Saturday), local products (honey, tsipouro, spoon sweets). At ~600m elevation — cool even in summer.</p><h2>Neos Marmaras (Sithonia)</h2><p>Sithonia\'s <strong>largest village</strong>. Lively harbor, seafood restaurants, nightlife. Near Porto Carras resort.</p><h2>Sarti (Sithonia)</h2><p>A picturesque fishing village with a <strong>large sandy beach</strong> and views of Mount Athos. Touristic but authentic.</p><h2>Siviri (Kassandra)</h2><p>A resort village hosting the <strong>Kassandra Festival</strong> every summer. Nice beach, family-friendly.</p>',
      de: '<h2>Dörfer in Chalkidiki</h2><p>Jenseits der Strände verbirgt Chalkidiki <strong>bezaubernde Dörfer</strong>.</p><h2>Afytos (Kassandra)</h2><p>Das <strong>aristokratische Dorf</strong> Kassandras. Steinhäuser auf Klippen mit Meerblick. Kunstwerkstätten, Galerien.</p><h2>Alt-Nikiti (Sithonia)</h2><p>Restaurierte Altstadt mit Honig- und Keramikwerkstätten. Berühmt für <strong>ausgezeichneten Honig</strong>.</p><h2>Parthenonas</h2><p>Verlassenes Bergdorf, <strong>restauriert</strong> zum Kulturdorf. Panoramablick auf den Toronäischen Golf.</p><h2>Arnea</h2><p><strong>Berghauptstadt</strong> Chalkidikis. Steinvillen, Wochenmarkt (Samstag), lokale Produkte. ~600m Höhe — kühl im Sommer.</p><h2>Neos Marmaras</h2><p>Sithonias <strong>größtes Dorf</strong>. Hafen, Fischrestaurants, Nachtleben.</p><h2>Sarti</h2><p>Fischerdorf mit <strong>großem Sandstrand</strong> und Blick auf den Athos.</p>',
      bg: '<h2>Села в Халкидики</h2><p>Отвъд плажовете Халкидики крие <strong>очарователни села</strong>.</p><h2>Афитос (Касандра)</h2><p><strong>Аристократичното село</strong> на Касандра. Каменни къщи на скали с панорамна гледка към морето.</p><h2>Стар Никити (Ситония)</h2><p>Реставриран стар град с работилници за мед и керамика. Известен с <strong>отличния си мед</strong>.</p><h2>Партенонас</h2><p>Изоставено планинско село, <strong>реставрирано</strong> в културно селище. Панорамна гледка.</p><h2>Арнеа</h2><p><strong>Планинската столица</strong> на Халкидики. Каменни къщи, седмичен пазар (събота), местни продукти. ~600м надморска височина.</p><h2>Неос Мармарас</h2><p>Най-<strong>голямото село</strong> на Ситония. Оживено пристанище, ресторанти.</p><h2>Сарти</h2><p>Рибарско село с <strong>голям пясъчен плаж</strong> и гледка към Атон.</p>',
      ru: '<h2>Деревни Халкидиков</h2><p>За пределами пляжей Халкидики скрывают <strong>очаровательные деревни</strong>.</p><h2>Афитос (Кассандра)</h2><p><strong>Аристократическая деревня</strong> Кассандры. Каменные дома на скалах с панорамным видом на море.</p><h2>Старый Никити (Ситония)</h2><p>Бережно восстановленный старый город с мастерскими мёда и керамики. Известен <strong>отличным мёдом</strong>.</p><h2>Партенонас</h2><p>Заброшенная горная деревня, <strong>восстановленная</strong> в культурное поселение. Панорамный вид на Торонейский залив.</p><h2>Арнея</h2><p><strong>Горная столица</strong> Халкидиков. Каменные особняки, субботний рынок, местные продукты (мёд, ципуро). Высота ~600м — прохладно даже летом.</p><h2>Неос Мармарас</h2><p>Самая <strong>большая деревня</strong> Ситонии. Оживлённая гавань, рестораны морепродуктов.</p><h2>Сарти</h2><p>Рыбацкая деревня с <strong>большим песчаным пляжем</strong> и видом на Афон.</p>',
      ro: '<h2>Sate din Halkidiki</h2><p>Dincolo de plaje, Halkidiki ascunde <strong>sate fermecătoare</strong>.</p><h2>Afytos (Kassandra)</h2><p>Satul <strong>aristocratic</strong> al Kassandrei. Case de piatră pe stânci cu vedere panoramică la mare.</p><h2>Nikiti Vechi (Sithonia)</h2><p>Oraș vechi restaurat cu ateliere de miere și ceramică. Renumit pentru <strong>mierea sa excepțională</strong>.</p><h2>Parthenonas</h2><p>Sat montan abandonat, <strong>restaurat</strong> ca așezare culturală. Vedere panoramică.</p><h2>Arnea</h2><p><strong>Capitala montană</strong> a Halkidikiului. Case de piatră, piață săptămânală (sâmbătă), produse locale. ~600m altitudine.</p><h2>Neos Marmaras</h2><p>Cel mai <strong>mare sat</strong> din Sithonia. Port animat, restaurante cu fructe de mare.</p><h2>Sarti</h2><p>Sat pescăresc cu <strong>plajă mare de nisip</strong> și vedere la Athos.</p>',
      sr: '<h2>Sela Halkidikija</h2><p>Iza plaža, Halkidiki krije <strong>očaravajuća sela</strong>.</p><h2>Afitos (Kasandra)</h2><p><strong>Aristokratsko selo</strong> Kasandre. Kamene kuće na liticama sa panoramskim pogledom na more.</p><h2>Stari Nikiti (Sitonija)</h2><p>Restauriran stari grad sa radionicama meda i keramike. Poznat po <strong>izuzetnom medu</strong>.</p><h2>Partenonas</h2><p>Napušteno planinsko selo, <strong>restaurirano</strong> u kulturno naselje. Panoramski pogled.</p><h2>Arnea</h2><p><strong>Planinska prestonica</strong> Halkidikija. Kamene kuće, nedeljni market (subota), lokalni proizvodi. ~600m nadmorske visine.</p><h2>Neos Marmaras</h2><p>Najveće <strong>selo</strong> Sitonije. Živahna luka, restorani morskih plodova.</p><h2>Sarti</h2><p>Ribarsko selo sa <strong>velikom peščanom plažom</strong> i pogledom na Atos.</p>',
    },
  },
  {
    slug: 'map', icon: 'Map', color: 'blue',
    title: { el: 'Χάρτης & Γεωγραφία Χαλκιδικής', en: 'Halkidiki Map & Geography Guide', de: 'Chalkidiki Karte & Geografie', bg: 'Карта и география на Халкидики', ru: 'Карта и география Халкидиков', ro: 'Harta și geografia Halkidiki', sr: 'Mapa i geografija Halkidikija' },
    description: { el: 'Οδηγός γεωγραφίας: 3 χερσόνησοι, αποστάσεις, προσανατολισμός', en: 'Geography guide: 3 peninsulas, distances, orientation', de: 'Geografie-Führer: 3 Halbinseln, Entfernungen, Orientierung', bg: 'Географски гид: 3 полуострова, разстояния, ориентация', ru: 'Географический гид: 3 полуострова, расстояния, ориентация', ro: 'Ghid geografic: 3 peninsule, distanțe, orientare', sr: 'Geografski vodič: 3 poluostrva, rastojanja, orijentacija' },
    metaTitle: { el: 'Χάρτης Χαλκιδικής — Γεωγραφία & Αποστάσεις | ChalkidikiHub', en: 'Halkidiki Map — Geography & Distances', de: 'Chalkidiki Karte — Geografie & Entfernungen', bg: 'Карта Халкидики — География и разстояния', ru: 'Карта Халкидики — География и расстояния', ro: 'Harta Halkidiki — Geografie și distanțe', sr: 'Mapa Halkidikija — Geografija i rastojanja' },
    metaDesc: { el: 'Χάρτης Χαλκιδικής: 3 χερσόνησοι (Κασσάνδρα, Σιθωνία, Άθως), αποστάσεις, χρόνοι οδήγησης, τι βρίσκεται πού. Πλήρης οδηγός προσανατολισμού.', en: 'Halkidiki map: 3 peninsulas (Kassandra, Sithonia, Athos), distances, driving times, what\'s where. Complete orientation guide.', de: 'Chalkidiki-Karte: 3 Halbinseln, Entfernungen, Fahrzeiten, was wo ist. Orientierungsführer.', bg: 'Карта на Халкидики: 3 полуострова, разстояния, време за шофиране, какво къде е.', ru: 'Карта Халкидиков: 3 полуострова, расстояния, время в пути, что где находится.', ro: 'Harta Halkidiki: 3 peninsule, distanțe, timpuri de condus, ce e unde.', sr: 'Mapa Halkidikija: 3 poluostrva, rastojanja, vremena vožnje, šta je gde.' },
    content: {
      el: '<h2>Η Γεωγραφία της Χαλκιδικής</h2><p>Η Χαλκιδική μοιάζει με <strong>τρίαινα</strong> ή τρία δάχτυλα που εκτείνονται στο Αιγαίο Πέλαγος. Τρεις χερσόνησοι — Κασσάνδρα, Σιθωνία, Άθως — ξεκινούν από ένα κοινό σώμα γης βόρεια.</p><h2>Οι 3 Χερσόνησοι</h2><h3>Κασσάνδρα (1η — Δυτική)</h3><p>Η πιο κοντινή στη Θεσσαλονίκη (~1 ώρα). Η πιο <strong>τουριστικά ανεπτυγμένη</strong>: ξενοδοχεία, beach bars, νυχτερινή ζωή, εμπορικά. Κορυφαία χωριά: Καλλιθέα, Χανιώτη, Πευκοχώρι, Πολύχρονο, Άφυτος, Σίβηρη.</p><h3>Σιθωνία (2η — Μεσαία)</h3><p>Η πιο <strong>φυσική και ήρεμη</strong>. Πευκοδάση, κρυφοί κόλποι, εξωτικές παραλίες. Λιγότερα ξενοδοχεία, περισσότερες βίλες και campings. Κορυφαία μέρη: Νικήτη, Βουρβουρού, Νέος Μαρμαράς, Σάρτη, Τορώνη, Καβουρότρυπες.</p><h3>Άθως (3η — Ανατολική)</h3><p>Η πιο <strong>μυστηριώδης</strong>. Το νότιο τμήμα είναι το Άγιο Όρος (αυτόνομη μοναστική πολιτεία — <strong>μόνο για άνδρες</strong>, με ειδική άδεια). Η Ουρανούπολη είναι η πύλη εισόδου και τελευταίο προσβάσιμο σημείο.</p><h2>Αποστάσεις & Χρόνοι Οδήγησης</h2><table><tr><th>Από</th><th>Προς</th><th>Χλμ</th><th>Χρόνος</th></tr><tr><td>Θεσσαλονίκη (SKG)</td><td>Νέα Μουδανιά</td><td>60</td><td>0:45</td></tr><tr><td>Θεσσαλονίκη</td><td>Κασσάνδρα (κέντρο)</td><td>100</td><td>1:15</td></tr><tr><td>Θεσσαλονίκη</td><td>Σιθωνία (Νικήτη)</td><td>110</td><td>1:20</td></tr><tr><td>Θεσσαλονίκη</td><td>Ουρανούπολη</td><td>130</td><td>1:40</td></tr><tr><td>Κασσάνδρα (νότια)</td><td>Σιθωνία (νότια)</td><td>100</td><td>1:30</td></tr></table><h2>Πώς να Πλοηγηθείτε</h2><ul><li>Η <strong>Νέα Μουδανιά</strong> είναι ο κεντρικός κόμβος — από εκεί διακλαδώνεστε προς Κασσάνδρα ή Σιθωνία</li><li>Χρησιμοποιήστε <strong>Google Maps</strong> — λειτουργεί καλά στην περιοχή</li><li>Η Κασσάνδρα έχει κυκλικό δρόμο (μπορείτε να κάνετε τον γύρο)</li><li>Η Σιθωνία επίσης — αλλά ο νότιος δρόμος είναι πιο στενός</li><li>Ο δρόμος για Ουρανούπολη περνά μέσα από ορεινή Χαλκιδική (Αρναία, Σταγείρα)</li></ul><h2>Τι Βρίσκεται Πού</h2><ul><li><strong>Νυχτερινή ζωή:</strong> Κασσάνδρα (Καλλιθέα, Χανιώτη)</li><li><strong>Ήρεμες παραλίες:</strong> Σιθωνία (Καρύδι, Καβουρότρυπες)</li><li><strong>Πολιτισμός:</strong> Άφυτος, Αρναία, Παρθενώνας</li><li><strong>Πολυτέλεια:</strong> Sani Resort, Ikos (Κασσάνδρα)</li><li><strong>Camping:</strong> Σιθωνία (Αρμενιστής)</li><li><strong>Άγιο Όρος:</strong> Ουρανούπολη → καράβι</li></ul>',
      en: '<h2>Halkidiki Geography</h2><p>Halkidiki resembles a <strong>trident</strong> or three fingers extending into the Aegean Sea. Three peninsulas — Kassandra, Sithonia, Athos — branch out from a shared mainland body to the north.</p><h2>The 3 Peninsulas</h2><h3>Kassandra (1st — Western)</h3><p>Closest to Thessaloniki (~1 hour). The most <strong>tourist-developed</strong>: hotels, beach bars, nightlife, shopping. Key villages: Kallithea, Hanioti, Pefkochori, Polychrono, Afytos, Siviri.</p><h3>Sithonia (2nd — Middle)</h3><p>The most <strong>natural and tranquil</strong>. Pine forests, hidden coves, exotic beaches. Fewer hotels, more villas and campgrounds. Key spots: Nikiti, Vourvourou, Neos Marmaras, Sarti, Toroni, Kavourotrypes.</p><h3>Athos (3rd — Eastern)</h3><p>The most <strong>mysterious</strong>. The southern part is Mount Athos (autonomous monastic state — <strong>men only</strong>, special permit required). Ouranoupoli is the gateway and the last accessible point.</p><h2>Distances & Drive Times</h2><table><tr><th>From</th><th>To</th><th>Km</th><th>Time</th></tr><tr><td>Thessaloniki (SKG)</td><td>Nea Moudania</td><td>60</td><td>0:45</td></tr><tr><td>Thessaloniki</td><td>Kassandra (center)</td><td>100</td><td>1:15</td></tr><tr><td>Thessaloniki</td><td>Sithonia (Nikiti)</td><td>110</td><td>1:20</td></tr><tr><td>Thessaloniki</td><td>Ouranoupoli</td><td>130</td><td>1:40</td></tr><tr><td>Kassandra (south)</td><td>Sithonia (south)</td><td>100</td><td>1:30</td></tr></table><h2>How to Navigate</h2><ul><li><strong>Nea Moudania</strong> is the central hub — from there you branch to Kassandra or Sithonia</li><li>Use <strong>Google Maps</strong> — it works well in the area</li><li>Kassandra has a circular road (you can drive around the entire peninsula)</li><li>Sithonia too — but the southern road is narrower</li><li>The road to Ouranoupoli passes through mountain Halkidiki (Arnea, Stagira)</li></ul><h2>What\'s Where</h2><ul><li><strong>Nightlife:</strong> Kassandra (Kallithea, Hanioti)</li><li><strong>Quiet beaches:</strong> Sithonia (Karidi, Kavourotrypes)</li><li><strong>Culture:</strong> Afytos, Arnea, Parthenonas</li><li><strong>Luxury:</strong> Sani Resort, Ikos (Kassandra)</li><li><strong>Camping:</strong> Sithonia (Armenistis)</li><li><strong>Mount Athos:</strong> Ouranoupoli → boat</li></ul>',
      de: '<h2>Geografie Chalkidikis</h2><p>Chalkidiki gleicht einem <strong>Dreizack</strong> oder drei Fingern, die in die Ägäis ragen. Drei Halbinseln — Kassandra, Sithonia, Athos — zweigen von einem gemeinsamen Festlandkörper ab.</p><h2>Die 3 Halbinseln</h2><h3>Kassandra (1. — Westlich)</h3><p>Am nächsten zu Thessaloniki (~1 Stunde). Am <strong>touristisch entwickeltsten</strong>: Hotels, Beach Bars, Nachtleben.</p><h3>Sithonia (2. — Mitte)</h3><p>Am <strong>natürlichsten und ruhigsten</strong>. Pinienwälder, versteckte Buchten, exotische Strände.</p><h3>Athos (3. — Östlich)</h3><p>Am <strong>geheimnisvollsten</strong>. Südteil ist der Berg Athos (autonomer Mönchsstaat — <strong>nur Männer</strong>). Ouranoupoli ist das Tor.</p><h2>Entfernungen</h2><table><tr><th>Von</th><th>Nach</th><th>Km</th><th>Zeit</th></tr><tr><td>Thessaloniki</td><td>Kassandra</td><td>100</td><td>1:15</td></tr><tr><td>Thessaloniki</td><td>Sithonia</td><td>110</td><td>1:20</td></tr><tr><td>Thessaloniki</td><td>Ouranoupoli</td><td>130</td><td>1:40</td></tr></table><h2>Was ist wo</h2><ul><li><strong>Nachtleben:</strong> Kassandra</li><li><strong>Ruhige Strände:</strong> Sithonia</li><li><strong>Kultur:</strong> Afytos, Arnea</li><li><strong>Luxus:</strong> Sani, Ikos</li><li><strong>Camping:</strong> Sithonia</li><li><strong>Berg Athos:</strong> Ouranoupoli → Boot</li></ul>',
      bg: '<h2>География на Халкидики</h2><p>Халкидики прилича на <strong>тризъбец</strong> или три пръста, простиращи се в Егейско море.</p><h2>3-те полуострова</h2><h3>Касандра (1-ви — Западен)</h3><p>Най-близо до Солун (~1 час). Най-<strong>туристически развит</strong>.</p><h3>Ситония (2-ри — Среден)</h3><p>Най-<strong>естествен и спокоен</strong>. Борови гори, скрити заливи.</p><h3>Атон (3-ти — Източен)</h3><p>Най-<strong>мистериозен</strong>. Южната част е Света Гора (<strong>само за мъже</strong>). Уранополис е входната точка.</p><h2>Разстояния</h2><table><tr><th>От</th><th>До</th><th>Км</th><th>Време</th></tr><tr><td>Солун</td><td>Касандра</td><td>100</td><td>1:15</td></tr><tr><td>Солун</td><td>Ситония</td><td>110</td><td>1:20</td></tr><tr><td>Солун</td><td>Уранополис</td><td>130</td><td>1:40</td></tr></table><h2>Какво къде е</h2><ul><li><strong>Нощен живот:</strong> Касандра</li><li><strong>Тихи плажове:</strong> Ситония</li><li><strong>Култура:</strong> Афитос, Арнеа</li><li><strong>Лукс:</strong> Sani, Ikos</li><li><strong>Къмпинг:</strong> Ситония</li><li><strong>Света Гора:</strong> Уранополис → лодка</li></ul>',
      ru: '<h2>География Халкидиков</h2><p>Халкидики напоминают <strong>трезубец</strong> или три пальца, вытянутых в Эгейское море.</p><h2>3 полуострова</h2><h3>Кассандра (1-й — Западный)</h3><p>Ближайший к Салоникам (~1 час). Самый <strong>туристически развитый</strong>.</p><h3>Ситония (2-й — Средний)</h3><p>Самый <strong>природный и спокойный</strong>. Сосновые леса, скрытые бухты.</p><h3>Афон (3-й — Восточный)</h3><p>Самый <strong>загадочный</strong>. Южная часть — Святая Гора Афон (автономное монашеское государство — <strong>только мужчины</strong>). Уранополис — ворота.</p><h2>Расстояния</h2><table><tr><th>Откуда</th><th>Куда</th><th>Км</th><th>Время</th></tr><tr><td>Салоники</td><td>Кассандра</td><td>100</td><td>1:15</td></tr><tr><td>Салоники</td><td>Ситония</td><td>110</td><td>1:20</td></tr><tr><td>Салоники</td><td>Уранополис</td><td>130</td><td>1:40</td></tr></table><h2>Что где находится</h2><ul><li><strong>Ночная жизнь:</strong> Кассандра</li><li><strong>Тихие пляжи:</strong> Ситония</li><li><strong>Культура:</strong> Афитос, Арнея</li><li><strong>Роскошь:</strong> Sani, Ikos</li><li><strong>Кемпинг:</strong> Ситония</li><li><strong>Святая Гора:</strong> Уранополис → корабль</li></ul>',
      ro: '<h2>Geografia Halkidiki</h2><p>Halkidiki seamănă cu un <strong>trident</strong> sau trei degete extinse în Marea Egee.</p><h2>Cele 3 peninsule</h2><h3>Kassandra (1-a — Vestică)</h3><p>Cea mai apropiată de Thessaloniki (~1 oră). Cea mai <strong>dezvoltată turistic</strong>.</p><h3>Sithonia (a 2-a — Centrală)</h3><p>Cea mai <strong>naturală și liniștită</strong>. Păduri de pini, golfuri ascunse.</p><h3>Athos (a 3-a — Estică)</h3><p>Cea mai <strong>misterioasă</strong>. Partea sudică este Muntele Athos (stat monastic autonom — <strong>doar bărbați</strong>). Ouranoupoli este poarta.</p><h2>Distanțe</h2><table><tr><th>De la</th><th>La</th><th>Km</th><th>Timp</th></tr><tr><td>Thessaloniki</td><td>Kassandra</td><td>100</td><td>1:15</td></tr><tr><td>Thessaloniki</td><td>Sithonia</td><td>110</td><td>1:20</td></tr><tr><td>Thessaloniki</td><td>Ouranoupoli</td><td>130</td><td>1:40</td></tr></table><h2>Ce e unde</h2><ul><li><strong>Viață de noapte:</strong> Kassandra</li><li><strong>Plaje liniștite:</strong> Sithonia</li><li><strong>Cultură:</strong> Afytos, Arnea</li><li><strong>Lux:</strong> Sani, Ikos</li><li><strong>Camping:</strong> Sithonia</li><li><strong>Muntele Athos:</strong> Ouranoupoli → barcă</li></ul>',
      sr: '<h2>Geografija Halkidikija</h2><p>Halkidiki podseća na <strong>trozubac</strong> ili tri prsta koja se pružaju u Egejsko more.</p><h2>3 poluostrva</h2><h3>Kasandra (1. — Zapadno)</h3><p>Najbliže Solunu (~1 sat). Najrazvijenije <strong>turistički</strong>.</p><h3>Sitonija (2. — Srednje)</h3><p>Najprirodnija i <strong>najmirnija</strong>. Borove šume, skriveni zalivi.</p><h3>Atos (3. — Istočno)</h3><p>Najmisteriozan <strong>poluostrvo</strong>. Južni deo je Sveta Gora (autonomna monaška država — <strong>samo za muškarce</strong>). Uranopolis je kapija.</p><h2>Rastojanja</h2><table><tr><th>Od</th><th>Do</th><th>Km</th><th>Vreme</th></tr><tr><td>Solun</td><td>Kasandra</td><td>100</td><td>1:15</td></tr><tr><td>Solun</td><td>Sitonija</td><td>110</td><td>1:20</td></tr><tr><td>Solun</td><td>Uranopolis</td><td>130</td><td>1:40</td></tr></table><h2>Šta je gde</h2><ul><li><strong>Noćni život:</strong> Kasandra</li><li><strong>Mirne plaže:</strong> Sitonija</li><li><strong>Kultura:</strong> Afitos, Arnea</li><li><strong>Luksuz:</strong> Sani, Ikos</li><li><strong>Kampovanje:</strong> Sitonija</li><li><strong>Sveta Gora:</strong> Uranopolis → brod</li></ul>',
    },
  },
  // ─── 1. FOOD AND WINE ───
  {
    slug: 'food-and-wine',
    icon: 'Wine',
    color: 'red',
    title: {
      el: 'Γαστρονομία & Κρασί Χαλκιδικής',
      en: 'Halkidiki Food & Wine Guide',
      de: 'Kulinarik & Wein in Chalkidiki',
      bg: 'Кулинарен гид за Халкидики',
      ru: 'Гастрономия и вино Халкидики',
      ro: 'Ghid culinar Halkidiki',
      sr: 'Gastronomija i vino Halkidikija',
    },
    description: {
      el: 'Ελιές PDO, μέλι, τσίπουρο, οινοποιεία και παραδοσιακά πιάτα της Χαλκιδικής.',
      en: 'PDO olives, local honey, tsipouro, award-winning wineries and traditional Halkidiki dishes.',
      de: 'PDO-Oliven, lokaler Honig, Tsipouro, preisgekrönte Weingüter und traditionelle Gerichte.',
      bg: 'PDO маслини, местен мед, ципуро, винарни и традиционни ястия от Халкидики.',
      ru: 'Оливки PDO, местный мёд, ципуро, винодельни и традиционные блюда Халкидики.',
      ro: 'Măsline PDO, miere locală, tsipouro, crame premiate și preparate tradiționale.',
      sr: 'PDO masline, lokalni med, cipouro, vinarije i tradicionalna jela Halkidikija.',
    },
    metaTitle: {
      el: 'Γαστρονομικός Οδηγός Χαλκιδικής | Φαγητό, Κρασί & Ελιές',
      en: 'Halkidiki Food & Wine Guide | Olives, Wineries & Local Cuisine',
      de: 'Chalkidiki Kulinarik-Guide | Oliven, Weingüter & Küche',
      bg: 'Кулинарен гид за Халкидики | Маслини, винарни и местна кухня',
      ru: 'Гастрономический гид по Халкидики | Оливки, винодельни и кухня',
      ro: 'Ghid culinar Halkidiki | Măsline, crame și bucătărie locală',
      sr: 'Gastronomski vodič za Halkidiki | Masline, vinarije i lokalna kuhinja',
    },
    metaDesc: {
      el: 'Ανακαλύψτε τις γεύσεις της Χαλκιδικής: ελιές PDO, μέλι, τσίπουρο, οινοποιεία Porto Carras & Tsantali, ταβέρνες και αγορές.',
      en: 'Discover Halkidiki flavours: PDO olives, local honey, tsipouro, Porto Carras & Tsantali wineries, tavernas and farmers markets.',
      de: 'Entdecken Sie Chalkidikis Aromen: PDO-Oliven, Honig, Tsipouro, Weingüter Porto Carras & Tsantali, Tavernen und Märkte.',
      bg: 'Открийте вкусовете на Халкидики: PDO маслини, мед, ципуро, винарни Porto Carras и Tsantali, таверни и пазари.',
      ru: 'Откройте вкусы Халкидики: оливки PDO, мёд, ципуро, винодельни Porto Carras и Tsantali, таверны и рынки.',
      ro: 'Descoperă aromele Halkidiki: măsline PDO, miere, tsipouro, cramele Porto Carras și Tsantali, taverne și piețe.',
      sr: 'Otkrijte ukuse Halkidikija: PDO masline, med, cipouro, vinarije Porto Carras i Tsantali, taverne i pijace.',
    },
    content: {
      el: `<h2>Οι Θρυλικές Ελιές Χαλκιδικής</h2>
<p>Η Χαλκιδική παράγει τις μεγαλύτερες πράσινες ελιές στον κόσμο, με <strong>Προστατευόμενη Ονομασία Προέλευσης (ΠΟΠ)</strong>. Η ποικιλία «Χαλκιδικής» είναι σαρκώδης, βουτυράτη και ιδανική τόσο ως επιτραπέζια ελιά όσο και για εξαιρετικό παρθένο ελαιόλαδο.</p>
<ul>
  <li><strong>Ελαιοτριβείο Λιότοπι (Αρναία)</strong> — ξεναγήσεις και γευσιγνωσία</li>
  <li><strong>Ελαιοτριβείο Ολυμπιάδας</strong> — παραδοσιακό πέτρινο ελαιοτριβείο</li>
  <li><strong>Αγροτικοί Συνεταιρισμοί</strong> — αγοράστε απευθείας από τον παραγωγό</li>
</ul>

<h2>Μέλι & Τσίπουρο</h2>
<p>Τα πευκοδάση της Σιθωνίας δίνουν σκούρο, αρωματικό <strong>πευκόμελο</strong>, ενώ τα θυμάρια της Κασσάνδρας δίνουν ανθόμελο. Το τσίπουρο — το τοπικό απόσταγμα σταφυλιού — σερβίρεται παγωμένο με μεζέδες σε κάθε ταβέρνα.</p>

<h2>Οινοποιεία</h2>
<table>
  <tr><th>Οινοποιείο</th><th>Περιοχή</th><th>Ειδικότητα</th></tr>
  <tr><td>Domaine Porto Carras</td><td>Σιθωνία (Νέος Μαρμαράς)</td><td>Μεγαλύτερος βιολογικός αμπελώνας Ελλάδας, Cabernet & Λημνιό</td></tr>
  <tr><td>Tsantali</td><td>Αγιος Παύλος, Μαρώνεια</td><td>Αγιορείτικες ποικιλίες, Rapsani, Μοσχάτο</td></tr>
  <tr><td>Claudia Papayianni</td><td>Αρναία</td><td>Boutique κρασιά από ορεινούς αμπελώνες</td></tr>
</table>

<h2>Παραδοσιακά Πιάτα</h2>
<ul>
  <li><strong>Μπουγάτσα</strong> — κρέμα ή τυρί σε φύλλο, πρωινό κλασικό</li>
  <li><strong>Σουβλάκι & Γύρος</strong> — χοιρινό ή κοτόπουλο, πάντα με τζατζίκι</li>
  <li><strong>Φρέσκα ψάρια</strong> — τσιπούρα, λαβράκι, χταπόδι στα κάρβουνα</li>
  <li><strong>Χόρτα</strong> — βραστά αγριόχορτα με λεμόνι και ελαιόλαδο</li>
  <li><strong>Γαρίδες Σαγανάκι</strong> — γαρίδες σε σάλτσα ντομάτας με φέτα</li>
</ul>

<h2>Λαϊκές Αγορές</h2>
<p>Κάθε χωριό έχει εβδομαδιαία λαϊκή αγορά. Οι πιο γνωστές: <strong>Πολύγυρος</strong> (Σάββατο), <strong>Κασσανδρεία</strong> (Τρίτη), <strong>Νικήτη</strong> (Τετάρτη). Αγοράστε φρέσκα φρούτα, τυριά, ελιές και μέλι σε τιμές παραγωγού.</p>`,

      en: `<h2>The Legendary Halkidiki Olives</h2>
<p>Halkidiki produces the largest green olives in the world, bearing a <strong>Protected Designation of Origin (PDO)</strong> label. The "Halkidiki" variety is fleshy, buttery, and prized both as a table olive and for premium extra-virgin olive oil.</p>
<ul>
  <li><strong>Liotopi Olive Mill (Arnea)</strong> — guided tours and tastings</li>
  <li><strong>Olympiada Traditional Mill</strong> — stone-press olive oil production</li>
  <li><strong>Local Cooperatives</strong> — buy directly from producers at farm-gate prices</li>
</ul>

<h2>Honey & Tsipouro</h2>
<p>Sithonia's pine forests produce dark, aromatic <strong>pine honey</strong>, while Kassandra's thyme fields yield floral blossom honey. Tsipouro — the local grape spirit — is served ice-cold with mezedes (small plates) at every taverna. Ask for "tsipouro me meli" (with honey) for a local twist.</p>

<h2>Wineries</h2>
<table>
  <tr><th>Winery</th><th>Location</th><th>Specialty</th></tr>
  <tr><td>Domaine Porto Carras</td><td>Sithonia (Neos Marmaras)</td><td>Greece's largest organic vineyard, Cabernet & Limnio blends</td></tr>
  <tr><td>Tsantali</td><td>Agios Pavlos, Maronia</td><td>Mount Athos varieties, Rapsani, Muscat</td></tr>
  <tr><td>Claudia Papayianni</td><td>Arnea</td><td>Boutique wines from mountain vineyards at 600m altitude</td></tr>
</table>

<h2>Traditional Dishes You Must Try</h2>
<ul>
  <li><strong>Bougatsa</strong> — flaky pastry filled with custard cream or cheese, a breakfast staple</li>
  <li><strong>Souvlaki & Gyros</strong> — pork or chicken skewers, always with tzatziki</li>
  <li><strong>Fresh Fish</strong> — grilled sea bream (tsipoura), sea bass (lavraki), charcoal octopus</li>
  <li><strong>Horta</strong> — boiled wild greens with lemon juice and olive oil</li>
  <li><strong>Garides Saganaki</strong> — shrimp baked in tomato sauce with feta cheese</li>
</ul>

<h2>Farmers Markets (Laiki Agora)</h2>
<p>Every village holds a weekly open-air market. The most popular: <strong>Polygyros</strong> (Saturday), <strong>Kassandreia</strong> (Tuesday), <strong>Nikiti</strong> (Wednesday). Buy fresh seasonal fruit, artisan cheeses, olives, and honey at producer prices — typically 30-50% less than tourist shops.</p>`,

      de: `<h2>Die legendären Oliven von Chalkidiki</h2>
<p>Chalkidiki produziert die größten grünen Oliven der Welt mit dem <strong>geschützten Ursprungsbezeichnung (g.U.)</strong>-Siegel. Die Sorte „Chalkidiki" ist fleischig, buttrig und sowohl als Tafelolive als auch für erstklassiges Olivenöl geschätzt.</p>
<ul>
  <li><strong>Liotopi Olivenmühle (Arnea)</strong> — Führungen und Verkostungen</li>
  <li><strong>Traditionelle Mühle Olympiada</strong> — Steinpress-Olivenölproduktion</li>
  <li><strong>Lokale Genossenschaften</strong> — Direktkauf vom Erzeuger</li>
</ul>

<h2>Honig & Tsipouro</h2>
<p>Sithonias Kiefernwälder liefern dunklen, aromatischen <strong>Pinienhonig</strong>, während Kassandras Thymianfelder Blütenhonig ergeben. Tsipouro — der lokale Traubenbrand — wird eiskalt mit Mezedes in jeder Taverne serviert.</p>

<h2>Weingüter</h2>
<table>
  <tr><th>Weingut</th><th>Lage</th><th>Spezialität</th></tr>
  <tr><td>Domaine Porto Carras</td><td>Sithonia (Neos Marmaras)</td><td>Größter Bio-Weinberg Griechenlands, Cabernet & Limnio</td></tr>
  <tr><td>Tsantali</td><td>Agios Pavlos</td><td>Athos-Sorten, Rapsani, Muskat</td></tr>
  <tr><td>Claudia Papayianni</td><td>Arnea</td><td>Boutique-Weine aus Bergweinbergen auf 600 m Höhe</td></tr>
</table>

<h2>Traditionelle Gerichte</h2>
<ul>
  <li><strong>Bougatsa</strong> — Blätterteig mit Vanillecreme oder Käse, Frühstücksklassiker</li>
  <li><strong>Souvlaki & Gyros</strong> — Schweine- oder Hähnchen-Spieße mit Tzatziki</li>
  <li><strong>Frischer Fisch</strong> — gegrillte Dorade, Wolfsbarsch, Oktopus vom Holzkohlegrill</li>
  <li><strong>Horta</strong> — gekochte Wildkräuter mit Zitrone und Olivenöl</li>
  <li><strong>Garides Saganaki</strong> — Garnelen in Tomatensauce mit Feta überbacken</li>
</ul>

<h2>Wochenmärkte</h2>
<p>Jedes Dorf hat einen wöchentlichen Markt. Die beliebtesten: <strong>Polygyros</strong> (Samstag), <strong>Kassandreia</strong> (Dienstag), <strong>Nikiti</strong> (Mittwoch). Frisches Obst, Käse, Oliven und Honig zu Erzeugerpreisen — 30-50 % günstiger als in Touristenläden.</p>`,

      bg: `<h2>Легендарните маслини на Халкидики</h2>
<p>Халкидики произвежда най-големите зелени маслини в света, със <strong>Защитено наименование за произход (ЗНП)</strong>. Сортът „Халкидики" е месест, маслен и ценен както като трапезна маслина, така и за първокласно зехтин.</p>
<ul>
  <li><strong>Маслинова мелница Лиотопи (Арнеа)</strong> — обиколки и дегустации</li>
  <li><strong>Традиционна мелница Олимпиада</strong> — производство на зехтин с каменна преса</li>
  <li><strong>Местни кооперативи</strong> — купувайте директно от производители</li>
</ul>

<h2>Мед и ципуро</h2>
<p>Боровите гори на Ситония произвеждат тъмен, ароматен <strong>боров мед</strong>, а полята с мащерка в Касандра дават цветен мед. Ципуро — местният гроздов дестилат — се сервира ледено студено с мезета във всяка таверна.</p>

<h2>Винарни</h2>
<table>
  <tr><th>Винарна</th><th>Местоположение</th><th>Специалитет</th></tr>
  <tr><td>Domaine Porto Carras</td><td>Ситония (Неос Мармарас)</td><td>Най-голямото био лозе в Гърция, Каберне и Лимнио</td></tr>
  <tr><td>Tsantali</td><td>Агиос Павлос</td><td>Атонски сортове, Рапсани, Мускат</td></tr>
  <tr><td>Claudia Papayianni</td><td>Арнеа</td><td>Бутикови вина от планински лозя на 600 м</td></tr>
</table>

<h2>Традиционни ястия</h2>
<ul>
  <li><strong>Бугаца</strong> — бутер тесто с крем или сирене, класическа закуска</li>
  <li><strong>Сувлаки и гирос</strong> — свинско или пилешко на шиш, винаги с цацики</li>
  <li><strong>Прясна риба</strong> — ципура, лаврак, октопод на въглища</li>
  <li><strong>Хорта</strong> — варени диви билки с лимон и зехтин</li>
  <li><strong>Гаридес саганаки</strong> — скариди в доматен сос с фета</li>
</ul>

<h2>Фермерски пазари</h2>
<p>Всяко село има седмичен пазар. Най-популярните: <strong>Полигирос</strong> (събота), <strong>Касандрия</strong> (вторник), <strong>Никити</strong> (сряда). Пресни плодове, сирена, маслини и мед на цени от производителя.</p>`,

      ru: `<h2>Легендарные оливки Халкидики</h2>
<p>Халкидики производит крупнейшие зелёные оливки в мире со знаком <strong>Защищённого наименования происхождения (PDO)</strong>. Сорт «Халкидики» — мясистый, маслянистый, ценится и как столовая оливка, и для премиального оливкового масла.</p>
<ul>
  <li><strong>Маслодавильня Лиотопи (Арнея)</strong> — экскурсии и дегустации</li>
  <li><strong>Традиционная давильня Олимпиада</strong> — производство масла на каменном прессе</li>
  <li><strong>Местные кооперативы</strong> — покупайте напрямую у производителей</li>
</ul>

<h2>Мёд и ципуро</h2>
<p>Сосновые леса Ситонии дают тёмный ароматный <strong>сосновый мёд</strong>, а тимьяновые поля Кассандры — цветочный. Ципуро — местный виноградный дистиллят — подаётся ледяным с мезедес (закусками) в каждой таверне.</p>

<h2>Винодельни</h2>
<table>
  <tr><th>Винодельня</th><th>Расположение</th><th>Специализация</th></tr>
  <tr><td>Domaine Porto Carras</td><td>Ситония (Неос Мармарас)</td><td>Крупнейший органический виноградник Греции, Каберне и Лимнио</td></tr>
  <tr><td>Tsantali</td><td>Агиос Павлос</td><td>Афонские сорта, Рапсани, Мускат</td></tr>
  <tr><td>Claudia Papayianni</td><td>Арнея</td><td>Бутиковые вина с горных виноградников на высоте 600 м</td></tr>
</table>

<h2>Традиционные блюда</h2>
<ul>
  <li><strong>Бугаца</strong> — слоёное тесто с кремом или сыром, классический завтрак</li>
  <li><strong>Сувлаки и гирос</strong> — шашлычки из свинины или курицы с дзадзики</li>
  <li><strong>Свежая рыба</strong> — дорада, сибас, осьминог на углях</li>
  <li><strong>Хорта</strong> — варёные дикие травы с лимоном и оливковым маслом</li>
  <li><strong>Гаридес саганаки</strong> — креветки в томатном соусе с фетой</li>
</ul>

<h2>Фермерские рынки</h2>
<p>В каждой деревне есть еженедельный рынок. Самые популярные: <strong>Полигирос</strong> (суббота), <strong>Кассандрия</strong> (вторник), <strong>Никити</strong> (среда). Свежие фрукты, сыры, оливки и мёд по ценам производителей — на 30-50% дешевле туристических магазинов.</p>`,

      ro: `<h2>Legendare măsline din Halkidiki</h2>
<p>Halkidiki produce cele mai mari măsline verzi din lume, cu <strong>Denumire de Origine Protejată (DOP)</strong>. Soiul „Halkidiki" este cărnos, uleios și apreciat atât ca măslină de masă, cât și pentru ulei de măsline extravirgin.</p>
<ul>
  <li><strong>Moara de măsline Liotopi (Arnea)</strong> — tururi ghidate și degustări</li>
  <li><strong>Moara tradițională Olympiada</strong> — producție de ulei cu presă de piatră</li>
  <li><strong>Cooperative locale</strong> — cumpărați direct de la producători</li>
</ul>

<h2>Miere și tsipouro</h2>
<p>Pădurile de pin din Sithonia produc <strong>miere de pin</strong> întunecată și aromată, iar câmpurile de cimbru din Kassandra oferă miere de flori. Tsipouro — distilatul local din struguri — se servește rece cu mezedes în fiecare tavernă.</p>

<h2>Crame</h2>
<table>
  <tr><th>Cramă</th><th>Locație</th><th>Specialitate</th></tr>
  <tr><td>Domaine Porto Carras</td><td>Sithonia (Neos Marmaras)</td><td>Cea mai mare vie organică din Grecia, Cabernet & Limnio</td></tr>
  <tr><td>Tsantali</td><td>Agios Pavlos</td><td>Soiuri de Athos, Rapsani, Muscat</td></tr>
  <tr><td>Claudia Papayianni</td><td>Arnea</td><td>Vinuri boutique din vii montane la 600 m altitudine</td></tr>
</table>

<h2>Preparate tradiționale</h2>
<ul>
  <li><strong>Bougatsa</strong> — plăcintă foietaj cu cremă sau brânză, clasic pentru micul dejun</li>
  <li><strong>Souvlaki & Gyros</strong> — frigărui de porc sau pui, mereu cu tzatziki</li>
  <li><strong>Pește proaspăt</strong> — doradă, biban de mare, caracatiță la grătar</li>
  <li><strong>Horta</strong> — verdeturi sălbatice fierte cu lămâie și ulei de măsline</li>
  <li><strong>Garides Saganaki</strong> — creveți în sos de roșii cu feta</li>
</ul>

<h2>Piețe fermierilor</h2>
<p>Fiecare sat are piață săptămânală. Cele mai populare: <strong>Polygyros</strong> (sâmbătă), <strong>Kassandreia</strong> (marți), <strong>Nikiti</strong> (miercuri). Fructe proaspete, brânzeturi, măsline și miere la prețuri de producător.</p>`,

      sr: `<h2>Legendarne masline Halkidikija</h2>
<p>Halkidiki proizvodi najveće zelene masline na svetu, sa <strong>Zaštićenom oznakom porekla (ZOP)</strong>. Sorta „Halkidiki" je mesnata, puterasta i cenjena kao stona maslina i za prvoklasno maslinovo ulje.</p>
<ul>
  <li><strong>Uljara Liotopi (Arnea)</strong> — obilasci i degustacije</li>
  <li><strong>Tradicionalna uljara Olimpijada</strong> — proizvodnja ulja na kamenoj presi</li>
  <li><strong>Lokalne zadruge</strong> — kupujte direktno od proizvođača</li>
</ul>

<h2>Med i cipouro</h2>
<p>Borove šume Sitonije proizvode tamni, aromatični <strong>borov med</strong>, dok polja timijana na Kasandri daju cvetni med. Cipouro — lokalni destilat od grožđa — služi se leden sa mezedesima u svakoj taverni.</p>

<h2>Vinarije</h2>
<table>
  <tr><th>Vinarija</th><th>Lokacija</th><th>Specijalitet</th></tr>
  <tr><td>Domaine Porto Carras</td><td>Sitonija (Neos Marmaras)</td><td>Najveći organski vinograd u Grčkoj, Kaberne i Limnio</td></tr>
  <tr><td>Tsantali</td><td>Agios Pavlos</td><td>Atonske sorte, Rapsani, Muskat</td></tr>
  <tr><td>Claudia Papayianni</td><td>Arnea</td><td>Butik vina sa planinskih vinograda na 600 m</td></tr>
</table>

<h2>Tradicionalna jela</h2>
<ul>
  <li><strong>Bugaca</strong> — lisnato testo sa kremom ili sirom, klasičan doručak</li>
  <li><strong>Suvlaki i giros</strong> — ražnjići od svinjetine ili piletine, uvek sa dzadzikim</li>
  <li><strong>Sveža riba</strong> — orada, brancin, hobotnica na ćumuru</li>
  <li><strong>Horta</strong> — kuvano divlje bilje sa limunom i maslinovim uljem</li>
  <li><strong>Garides saganaki</strong> — škampi u sosu od paradajza sa fetom</li>
</ul>

<h2>Pijace</h2>
<p>Svako selo ima nedeljnu pijacu. Najpopularnije: <strong>Poligiros</strong> (subota), <strong>Kasandrija</strong> (utorak), <strong>Nikiti</strong> (sreda). Sveže voće, sirevi, masline i med po cenama proizvođača.</p>`,
    },
  },
  // ─── 2. AMMOULIANI ISLAND ───
  {
    slug: 'ammouliani-island',
    icon: 'Sailboat',
    color: 'cyan',
    title: {
      el: 'Αμμουλιανή: Ο Κρυφός Παράδεισος',
      en: 'Ammouliani Island Day Trip Guide',
      de: 'Ammouliani Insel — Tagesausflug',
      bg: 'Остров Амулиани — Еднодневна екскурзия',
      ru: 'Остров Аммулиани — однодневная поездка',
      ro: 'Insula Ammouliani — Excursie de o zi',
      sr: 'Ostrvo Amuliani — Jednodnevni izlet',
    },
    description: {
      el: 'Φέρι 15\' από Τρυπητή, παραλίες Αλυκές & Μεγάλη Άμμος, βαρκάδα στα Δρένια.',
      en: '15-min ferry from Tripiti, Alikes & Megali Ammos beaches, Drenia islands boat trip.',
      de: '15-Min-Fähre ab Tripiti, Strände Alikes & Megali Ammos, Bootstour zu den Drenia-Inseln.',
      bg: '15-мин. ферибот от Трипити, плажове Аликес и Мегали Амос, лодка до Дрения.',
      ru: '15 мин на пароме из Трипити, пляжи Аликес и Мегали Аммос, лодочная поездка на острова Дрения.',
      ro: 'Feribot 15 min din Tripiti, plajele Alikes și Megali Ammos, excursie cu barca la insulele Drenia.',
      sr: 'Trajekt 15 min iz Tripitija, plaže Alikes i Megali Amos, izlet brodom do ostrva Drenija.',
    },
    metaTitle: {
      el: 'Αμμουλιανή & Δρένια | Οδηγός Ημερήσιας Εκδρομής',
      en: 'Ammouliani Island & Drenia | Day Trip Guide from Halkidiki',
      de: 'Ammouliani & Drenia | Tagesausflug-Guide ab Chalkidiki',
      bg: 'Амулиани и Дрения | Гид за еднодневна екскурзия',
      ru: 'Аммулиани и Дрения | Гид по однодневной поездке из Халкидики',
      ro: 'Ammouliani și Drenia | Ghid excursie de o zi din Halkidiki',
      sr: 'Amuliani i Drenija | Vodič za jednodnevni izlet iz Halkidikija',
    },
    metaDesc: {
      el: 'Πλήρης οδηγός για την Αμμουλιανή: φέρι, παραλίες, Δρένια, ταβέρνες. Το μοναδικό κατοικημένο νησί της Χαλκιδικής.',
      en: 'Complete guide to Ammouliani: ferry details, best beaches, Drenia islands boat trip, tavernas. Halkidiki\'s only inhabited island.',
      de: 'Kompletter Guide für Ammouliani: Fähre, beste Strände, Drenia-Bootstour, Tavernen. Chalkidikis einzige bewohnte Insel.',
      bg: 'Пълен гид за Амулиани: ферибот, най-добри плажове, лодка до Дрения, таверни. Единственият обитаван остров на Халкидики.',
      ru: 'Полный гид по Аммулиани: паром, лучшие пляжи, лодка на Дрения, таверны. Единственный обитаемый остров Халкидики.',
      ro: 'Ghid complet Ammouliani: feribot, cele mai bune plaje, excursie Drenia, taverne. Singura insulă locuită din Halkidiki.',
      sr: 'Kompletan vodič za Amuliani: trajekt, najbolje plaže, izlet do Drenije, taverne. Jedino naseljeno ostrvo Halkidikija.',
    },
    content: {
      el: `<h2>Πώς Φτάνετε</h2>
<p>Το φέρι αναχωρεί από τον <strong>Τρυπητή</strong> (10 χλμ νότια της Ουρανούπολης) κάθε 30-60 λεπτά το καλοκαίρι. Η διαδρομή διαρκεί μόλις <strong>15 λεπτά</strong> και κοστίζει περίπου <strong>€3 ανά άτομο</strong> (€12-15 για αυτοκίνητο).</p>
<ul>
  <li>Πρώτο φέρι: ~07:00 — Τελευταίο: ~23:00 (καλοκαίρι)</li>
  <li>Εκτός σεζόν: κάθε 1-2 ώρες</li>
  <li>Δεν χρειάζεστε αυτοκίνητο — το νησί είναι μικρό (4,5 km²)</li>
</ul>

<h2>Καλύτερες Παραλίες</h2>
<ul>
  <li><strong>Αλυκές</strong> — η πιο δημοφιλής, ρηχά τιρκουάζ νερά, beach bar, ιδανική για οικογένειες</li>
  <li><strong>Μεγάλη Άμμος</strong> — μεγάλη αμμώδης παραλία κοντά στο χωριό, εύκολη πρόσβαση</li>
  <li><strong>Κατσαμπάς</strong> — πιο ήσυχη, αμμοχάλικο, κρυστάλλινα νερά</li>
  <li><strong>Φάκα</strong> — μικρός απομονωμένος κόλπος, ιδανικός για σνόρκελ</li>
</ul>

<h2>Εκδρομή στα Δρένια (Γαϊδουρονήσι)</h2>
<p>Τα <strong>νησάκια Δρένια</strong> βρίσκονται λίγα λεπτά με βάρκα από την Αμμουλιανή. Ακατοίκητα, με εξωτικά τιρκουάζ νερά που θυμίζουν Καραϊβική. Βαρκάδες αναχωρούν και από την <strong>Ουρανούπολη</strong> (€15-25).</p>

<h2>Φαγητό & Ταβέρνες</h2>
<p>Το μικρό χωριό της Αμμουλιανής έχει εξαιρετικές ψαροταβέρνες. Δοκιμάστε φρέσκο ψάρι, χταπόδι στα κάρβουνα και τοπικό κρασί. Οι τιμές είναι λογικές — ένα γεύμα με ψάρι κοστίζει €12-18 ανά άτομο.</p>`,

      en: `<h2>How to Get There</h2>
<p>The ferry departs from <strong>Tripiti</strong> (10 km south of Ouranoupoli) every 30-60 minutes in summer. The crossing takes just <strong>15 minutes</strong> and costs approximately <strong>€3 per person</strong> (€12-15 with a car).</p>
<ul>
  <li>First ferry: ~07:00 — Last: ~23:00 (summer)</li>
  <li>Off-season: every 1-2 hours</li>
  <li>You don't need a car — the island is tiny (4.5 km²), walkable or rent a bike</li>
</ul>

<h2>Best Beaches</h2>
<ul>
  <li><strong>Alikes</strong> — the most popular, shallow turquoise waters, beach bar, perfect for families</li>
  <li><strong>Megali Ammos</strong> — large sandy beach near the village, easy access</li>
  <li><strong>Katsambas</strong> — quieter, pebble-sand mix, crystal-clear water</li>
  <li><strong>Faka</strong> — small secluded cove, ideal for snorkeling</li>
</ul>

<h2>Drenia Islands Boat Trip (Donkey Island)</h2>
<p>The <strong>Drenia islets</strong> lie just minutes by boat from Ammouliani. Uninhabited, with exotic turquoise waters reminiscent of the Caribbean. Boat trips depart from Ammouliani village (€10-15) or from <strong>Ouranoupoli</strong> (€15-25 including Drenia stop).</p>
<ul>
  <li>Typical trip: 2-4 hours with swimming stops</li>
  <li>Bring: sunscreen, water, snorkel gear, shade hat</li>
  <li>No facilities on Drenia — pack everything you need</li>
</ul>

<h2>Eating & Drinking</h2>
<p>Ammouliani's small village has excellent fish tavernas right on the waterfront. Try fresh grilled fish, charcoal octopus, and local wine. Prices are reasonable — a fish meal costs €12-18 per person. The village also has mini-markets for basics, a bakery, and a couple of cafés.</p>`,

      de: `<h2>Anreise</h2>
<p>Die Fähre legt in <strong>Tripiti</strong> (10 km südlich von Ouranoupoli) alle 30-60 Minuten im Sommer ab. Die Überfahrt dauert nur <strong>15 Minuten</strong> und kostet ca. <strong>3 € pro Person</strong> (12-15 € mit Auto).</p>
<ul>
  <li>Erste Fähre: ~07:00 — Letzte: ~23:00 (Sommer)</li>
  <li>Nebensaison: alle 1-2 Stunden</li>
  <li>Kein Auto nötig — die Insel ist winzig (4,5 km²)</li>
</ul>

<h2>Beste Strände</h2>
<ul>
  <li><strong>Alikes</strong> — der beliebteste, flaches türkises Wasser, Beach Bar, ideal für Familien</li>
  <li><strong>Megali Ammos</strong> — großer Sandstrand nahe dem Dorf</li>
  <li><strong>Katsambas</strong> — ruhiger, Kies-Sand-Mix, kristallklares Wasser</li>
  <li><strong>Faka</strong> — kleine abgelegene Bucht, ideal zum Schnorcheln</li>
</ul>

<h2>Drenia-Inseln Bootstour (Eselinsel)</h2>
<p>Die <strong>Drenia-Inselchen</strong> liegen nur Minuten per Boot von Ammouliani entfernt. Unbewohnt, mit exotisch türkisem Wasser. Bootstouren starten vom Ammouliani-Dorf (10-15 €) oder von <strong>Ouranoupoli</strong> (15-25 €).</p>

<h2>Essen & Trinken</h2>
<p>Das kleine Dorf bietet ausgezeichnete Fischtavernen direkt am Wasser. Frischer gegrillter Fisch, Oktopus vom Holzkohlegrill und lokaler Wein. Ein Fischgericht kostet 12-18 € pro Person.</p>`,

      bg: `<h2>Как да стигнете</h2>
<p>Ферибот тръгва от <strong>Трипити</strong> (10 км южно от Уранополи) на всеки 30-60 минути лятото. Прекосяването отнема само <strong>15 минути</strong> и струва около <strong>€3 на човек</strong> (€12-15 с кола).</p>
<ul>
  <li>Първи ферибот: ~07:00 — Последен: ~23:00 (лято)</li>
  <li>Извън сезона: на всеки 1-2 часа</li>
  <li>Не ви трябва кола — островът е малък (4,5 км²)</li>
</ul>

<h2>Най-добри плажове</h2>
<ul>
  <li><strong>Аликес</strong> — най-популярният, плитки тюркоазени води, бийч бар, идеален за семейства</li>
  <li><strong>Мегали Амос</strong> — голям пясъчен плаж близо до селото</li>
  <li><strong>Кацампас</strong> — по-тих, чакъл и пясък, кристално чиста вода</li>
  <li><strong>Фака</strong> — малък уединен залив, идеален за шнорхелинг</li>
</ul>

<h2>Екскурзия до острови Дрения</h2>
<p><strong>Островчетата Дрения</strong> са на минути с лодка от Амулиани. Необитаеми, с екзотични тюркоазени води. Лодки тръгват от село Амулиани (€10-15) или от <strong>Уранополи</strong> (€15-25).</p>

<h2>Хранене</h2>
<p>Малкото село има отлични рибни таверни на брега. Опитайте прясна риба на скара, октопод на въглища и местно вино. Цени: €12-18 на човек за рибно ястие.</p>`,

      ru: `<h2>Как добраться</h2>
<p>Паром отправляется из <strong>Трипити</strong> (10 км южнее Уранополиса) каждые 30-60 минут летом. Переправа занимает всего <strong>15 минут</strong> и стоит около <strong>€3 с человека</strong> (€12-15 с машиной).</p>
<ul>
  <li>Первый паром: ~07:00 — Последний: ~23:00 (лето)</li>
  <li>Вне сезона: каждые 1-2 часа</li>
  <li>Машина не нужна — остров крошечный (4,5 км²)</li>
</ul>

<h2>Лучшие пляжи</h2>
<ul>
  <li><strong>Аликес</strong> — самый популярный, мелкая бирюзовая вода, бич-бар, идеален для семей</li>
  <li><strong>Мегали Аммос</strong> — большой песчаный пляж у деревни</li>
  <li><strong>Кацампас</strong> — тихий, галечно-песчаный, кристально чистая вода</li>
  <li><strong>Фака</strong> — маленькая уединённая бухта, идеальна для снорклинга</li>
</ul>

<h2>Острова Дрения (Ослиный остров)</h2>
<p><strong>Островки Дрения</strong> — в нескольких минутах на лодке от Аммулиани. Необитаемые, с экзотической бирюзовой водой. Лодки отходят из деревни Аммулиани (€10-15) или из <strong>Уранополиса</strong> (€15-25).</p>

<h2>Еда и таверны</h2>
<p>Маленькая деревня острова предлагает отличные рыбные таверны на набережной. Свежая рыба на гриле, осьминог на углях, местное вино. Обед с рыбой — €12-18 с человека.</p>`,

      ro: `<h2>Cum ajungi</h2>
<p>Feribotul pleacă din <strong>Tripiti</strong> (10 km sud de Ouranoupoli) la fiecare 30-60 minute vara. Traversarea durează doar <strong>15 minute</strong> și costă aproximativ <strong>€3 pe persoană</strong> (€12-15 cu mașina).</p>
<ul>
  <li>Primul feribot: ~07:00 — Ultimul: ~23:00 (vară)</li>
  <li>Extrasezon: la fiecare 1-2 ore</li>
  <li>Nu ai nevoie de mașină — insula e mică (4,5 km²)</li>
</ul>

<h2>Cele mai bune plaje</h2>
<ul>
  <li><strong>Alikes</strong> — cea mai populară, ape turcoaz puțin adânci, beach bar, perfectă pentru familii</li>
  <li><strong>Megali Ammos</strong> — plajă mare de nisip lângă sat</li>
  <li><strong>Katsambas</strong> — mai liniștită, mix de pietriș și nisip</li>
  <li><strong>Faka</strong> — golf mic izolat, ideal pentru snorkeling</li>
</ul>

<h2>Excursie la insulele Drenia</h2>
<p><strong>Insulițele Drenia</strong> sunt la câteva minute cu barca de Ammouliani. Nelocuite, cu ape turcoaz exotice. Bărci pleacă din satul Ammouliani (€10-15) sau din <strong>Ouranoupoli</strong> (€15-25).</p>

<h2>Unde mănânci</h2>
<p>Satul mic are taverne de pește excelente pe malul mării. Pește proaspăt la grătar, caracatiță pe cărbuni și vin local. Prețuri: €12-18 pe persoană pentru un prânz cu pește.</p>`,

      sr: `<h2>Kako stići</h2>
<p>Trajekt polazi iz <strong>Tripitija</strong> (10 km južno od Uranopolija) svakih 30-60 minuta leti. Prelaz traje samo <strong>15 minuta</strong> i košta oko <strong>€3 po osobi</strong> (€12-15 sa kolima).</p>
<ul>
  <li>Prvi trajekt: ~07:00 — Poslednji: ~23:00 (leto)</li>
  <li>Van sezone: svakih 1-2 sata</li>
  <li>Ne trebaju vam kola — ostrvo je malo (4,5 km²)</li>
</ul>

<h2>Najbolje plaže</h2>
<ul>
  <li><strong>Alikes</strong> — najpopularnija, plitka tirkizna voda, bič bar, savršena za porodice</li>
  <li><strong>Megali Amos</strong> — velika peščana plaža blizu sela</li>
  <li><strong>Kacampas</strong> — mirnija, mešavina šljunka i peska, kristalno čista voda</li>
  <li><strong>Faka</strong> — mali izolovani zaliv, idealan za ronjenje</li>
</ul>

<h2>Izlet do ostrva Drenija</h2>
<p><strong>Ostrvca Drenija</strong> su na samo par minuta čamcem od Amulianija. Nenaseljena, sa egzotičnim tirkiznim vodama. Čamci polaze iz sela Amuliani (€10-15) ili iz <strong>Uranopolija</strong> (€15-25).</p>

<h2>Gde jesti</h2>
<p>Malo selo ima odlične riblji taverne na obali. Sveža riba sa roštilja, hobotnica na ćumuru i lokalno vino. Cene: €12-18 po osobi za riblji ručak.</p>`,
    },
  },
  // ─── 3. THESSALONIKI TO HALKIDIKI ───
  {
    slug: 'thessaloniki-to-halkidiki',
    icon: 'Bus',
    color: 'gray',
    title: {
      el: 'Από Θεσσαλονίκη στη Χαλκιδική',
      en: 'Thessaloniki to Halkidiki Transport Guide',
      de: 'Von Thessaloniki nach Chalkidiki',
      bg: 'От Солун до Халкидики — транспортен гид',
      ru: 'Из Салоников в Халкидики — транспорт',
      ro: 'Din Salonic în Halkidiki — ghid transport',
      sr: 'Od Soluna do Halkidikija — prevoz',
    },
    description: {
      el: 'ΚΤΕΛ, ταξί, transfer, ενοικίαση αυτοκινήτου. Χρόνοι, κόστη και συμβουλές.',
      en: 'KTEL bus, taxi, private transfer, car rental. Travel times, costs and tips.',
      de: 'KTEL-Bus, Taxi, Privattransfer, Mietwagen. Fahrzeiten, Kosten und Tipps.',
      bg: 'КТЕЛ автобус, такси, частен трансфер, кола под наем. Времена, цени и съвети.',
      ru: 'Автобус КТЕЛ, такси, частный трансфер, аренда авто. Время, стоимость и советы.',
      ro: 'Autobuz KTEL, taxi, transfer privat, închiriere mașină. Durate, costuri și sfaturi.',
      sr: 'KTEL autobus, taksi, privatni transfer, rent-a-car. Vreme, cene i saveti.',
    },
    metaTitle: {
      el: 'Θεσσαλονίκη → Χαλκιδική | Μεταφορά, ΚΤΕΛ & Transfer',
      en: 'Thessaloniki to Halkidiki | Bus, Transfer & Car Rental Guide',
      de: 'Thessaloniki nach Chalkidiki | Bus, Transfer & Mietwagen',
      bg: 'Солун → Халкидики | Автобус, трансфер и кола под наем',
      ru: 'Салоники → Халкидики | Автобус, трансфер и аренда авто',
      ro: 'Salonic → Halkidiki | Autobuz, transfer și închiriere auto',
      sr: 'Solun → Halkidiki | Autobus, transfer i rent-a-car',
    },
    metaDesc: {
      el: 'Πώς να πάτε από Θεσσαλονίκη/αεροδρόμιο SKG στη Χαλκιδική: ΚΤΕΛ (€12-15), ταξί (€80-120), transfer (€60-80), ενοικίαση αυτοκινήτου.',
      en: 'How to get from Thessaloniki/SKG airport to Halkidiki: KTEL bus (€12-15), taxi (€80-120), private transfer (€60-80), car rental options.',
      de: 'Von Thessaloniki/SKG Flughafen nach Chalkidiki: KTEL-Bus (12-15 €), Taxi (80-120 €), Privattransfer (60-80 €), Mietwagen.',
      bg: 'Как да стигнете от Солун/летище SKG до Халкидики: КТЕЛ автобус (€12-15), такси (€80-120), трансфер (€60-80), кола под наем.',
      ru: 'Как добраться из Салоников/аэропорта SKG в Халкидики: автобус КТЕЛ (€12-15), такси (€80-120), трансфер (€60-80), аренда авто.',
      ro: 'Cum ajungi din Salonic/aeroportul SKG în Halkidiki: autobuz KTEL (€12-15), taxi (€80-120), transfer (€60-80), închiriere auto.',
      sr: 'Kako stići od Soluna/aerodroma SKG do Halkidikija: KTEL autobus (€12-15), taksi (€80-120), transfer (€60-80), rent-a-car.',
    },
    content: {
      el: `<h2>ΚΤΕΛ Χαλκιδικής (Δημόσιο Λεωφορείο)</h2>
<p>Η πιο οικονομική επιλογή. Τα λεωφορεία αναχωρούν από τον <strong>σταθμό ΚΤΕΛ Χαλκιδικής</strong> στη Θεσσαλονίκη (οδός Καρακάση 68).</p>
<table>
  <tr><th>Προορισμός</th><th>Διάρκεια</th><th>Κόστος</th><th>Δρομολόγια/Ημέρα</th></tr>
  <tr><td>Κασσάνδρα (Καλλιθέα)</td><td>1,5-2 ώρες</td><td>€12-14</td><td>6-8 το καλοκαίρι</td></tr>
  <tr><td>Σιθωνία (Νικήτη/Νέος Μαρμαράς)</td><td>2-2,5 ώρες</td><td>€13-15</td><td>4-6</td></tr>
  <tr><td>Ουρανούπολη</td><td>2,5-3 ώρες</td><td>€14-15</td><td>3-5</td></tr>
</table>
<p><strong>Σημαντικό:</strong> Το ΚΤΕΛ δεν περνάει από το αεροδρόμιο SKG. Πρέπει πρώτα να πάτε στο κέντρο (λεωφορείο 01X, €2, 45 λεπτά).</p>

<h2>Ιδιωτικό Transfer</h2>
<p>Η πιο βολική επιλογή, ειδικά από το αεροδρόμιο. Ο οδηγός σας περιμένει στις αφίξεις.</p>
<ul>
  <li><strong>Κόστος:</strong> €60-80 για Κασσάνδρα, €70-90 για Σιθωνία, €80-100 για Ουρανούπολη</li>
  <li><strong>Πλεονέκτημα:</strong> Door-to-door, παιδικά καθίσματα κατόπιν αιτήματος</li>
  <li>Κλείστε online εκ των προτέρων για καλύτερη τιμή</li>
</ul>

<h2>Ταξί</h2>
<p>Τα ταξί είναι διαθέσιμα στο αεροδρόμιο αλλά <strong>ακριβότερα</strong> από τα transfer.</p>
<ul>
  <li>Αεροδρόμιο → Κασσάνδρα: €80-100</li>
  <li>Αεροδρόμιο → Σιθωνία: €100-120</li>
  <li>Αεροδρόμιο → Ουρανούπολη: €110-130</li>
  <li><strong>Συμβουλή:</strong> Κανονίστε τιμή εκ των προτέρων!</li>
</ul>

<h2>Ενοικίαση Αυτοκινήτου</h2>
<p>Η <strong>ιδανική επιλογή</strong> αν θέλετε να εξερευνήσετε. Εταιρείες στο αεροδρόμιο SKG: Avis, Hertz, Sixt, Enterprise, τοπικές (Auto Union, Avance). Τιμές: €25-50/ημέρα ανάλογα σεζόν.</p>
<ul>
  <li>Αεροδρόμιο SKG → Κασσάνδρα: 80 km, ~1 ώρα</li>
  <li>Αεροδρόμιο SKG → Σιθωνία (Νικήτη): 110 km, ~1,5 ώρα</li>
  <li>Αεροδρόμιο SKG → Ουρανούπολη: 130 km, ~2 ώρες</li>
</ul>`,

      en: `<h2>KTEL Halkidiki (Public Bus)</h2>
<p>The most affordable option. Buses depart from the <strong>KTEL Halkidikis bus station</strong> in Thessaloniki (68 Karakasi Street, east of the city centre).</p>
<table>
  <tr><th>Destination</th><th>Duration</th><th>Cost</th><th>Departures/Day</th></tr>
  <tr><td>Kassandra (Kallithea)</td><td>1.5-2 hours</td><td>€12-14</td><td>6-8 in summer</td></tr>
  <tr><td>Sithonia (Nikiti/Neos Marmaras)</td><td>2-2.5 hours</td><td>€13-15</td><td>4-6</td></tr>
  <tr><td>Ouranoupoli</td><td>2.5-3 hours</td><td>€14-15</td><td>3-5</td></tr>
</table>
<p><strong>Important:</strong> KTEL does not stop at SKG airport. You must first reach the city centre (airport bus 01X, €2, 45 minutes) or take a taxi to the KTEL station (€15-20).</p>

<h2>Private Transfer</h2>
<p>The most convenient option, especially from the airport. Your driver meets you at arrivals with a name sign.</p>
<ul>
  <li><strong>Cost:</strong> €60-80 to Kassandra, €70-90 to Sithonia, €80-100 to Ouranoupoli</li>
  <li><strong>Advantages:</strong> Door-to-door, child seats on request, no waiting</li>
  <li>Book online in advance for best prices — operators include Welcome Pickups, Kiwitaxi</li>
</ul>

<h2>Taxi</h2>
<p>Taxis are available at the airport but <strong>more expensive</strong> than pre-booked transfers.</p>
<ul>
  <li>Airport → Kassandra: €80-100</li>
  <li>Airport → Sithonia: €100-120</li>
  <li>Airport → Ouranoupoli: €110-130</li>
  <li><strong>Tip:</strong> Always agree on a price before departure — meters are rarely used for long distances</li>
</ul>

<h2>Car Rental (Recommended)</h2>
<p>The <strong>ideal choice</strong> if you want to explore freely. Agencies at SKG airport include Avis, Hertz, Sixt, Enterprise, and locals (Auto Union, Avance). Rates: €25-50/day depending on season.</p>
<ul>
  <li>SKG Airport → Kassandra: 80 km, ~1 hour via the new highway</li>
  <li>SKG Airport → Sithonia (Nikiti): 110 km, ~1.5 hours</li>
  <li>SKG Airport → Ouranoupoli: 130 km, ~2 hours</li>
</ul>
<p><strong>Driving tips:</strong> Roads are generally good. Gas stations close early in small villages — fill up on the main road. Parking is free almost everywhere except Ouranoupoli centre in peak season.</p>`,

      de: `<h2>KTEL Chalkidiki (Öffentlicher Bus)</h2>
<p>Die günstigste Option. Busse fahren vom <strong>KTEL-Busbahnhof Chalkidiki</strong> in Thessaloniki (Karakasi-Straße 68) ab.</p>
<table>
  <tr><th>Ziel</th><th>Dauer</th><th>Kosten</th><th>Abfahrten/Tag</th></tr>
  <tr><td>Kassandra (Kallithea)</td><td>1,5-2 Std.</td><td>12-14 €</td><td>6-8 im Sommer</td></tr>
  <tr><td>Sithonia (Nikiti)</td><td>2-2,5 Std.</td><td>13-15 €</td><td>4-6</td></tr>
  <tr><td>Ouranoupoli</td><td>2,5-3 Std.</td><td>14-15 €</td><td>3-5</td></tr>
</table>
<p><strong>Wichtig:</strong> KTEL fährt nicht zum Flughafen SKG. Erst ins Zentrum (Flughafenbus 01X, 2 €, 45 Min.).</p>

<h2>Privattransfer</h2>
<ul>
  <li><strong>Kosten:</strong> 60-80 € nach Kassandra, 70-90 € nach Sithonia, 80-100 € nach Ouranoupoli</li>
  <li>Tür-zu-Tür-Service, Kindersitze auf Anfrage</li>
  <li>Online im Voraus buchen für beste Preise</li>
</ul>

<h2>Taxi</h2>
<ul>
  <li>Flughafen → Kassandra: 80-100 €</li>
  <li>Flughafen → Sithonia: 100-120 €</li>
  <li>Flughafen → Ouranoupoli: 110-130 €</li>
  <li><strong>Tipp:</strong> Preis vorher vereinbaren!</li>
</ul>

<h2>Mietwagen (Empfohlen)</h2>
<p>Die <strong>ideale Wahl</strong> zum Erkunden. Agenturen am SKG: Avis, Hertz, Sixt, Enterprise. Preise: 25-50 €/Tag je nach Saison.</p>
<ul>
  <li>SKG → Kassandra: 80 km, ~1 Stunde</li>
  <li>SKG → Sithonia (Nikiti): 110 km, ~1,5 Stunden</li>
  <li>SKG → Ouranoupoli: 130 km, ~2 Stunden</li>
</ul>`,

      bg: `<h2>КТЕЛ Халкидики (Обществен автобус)</h2>
<p>Най-евтиният вариант. Автобусите тръгват от <strong>автогара КТЕЛ Халкидики</strong> в Солун (ул. Каракаси 68).</p>
<table>
  <tr><th>Дестинация</th><th>Продължителност</th><th>Цена</th><th>Курсове/Ден</th></tr>
  <tr><td>Касандра (Калитея)</td><td>1,5-2 часа</td><td>€12-14</td><td>6-8 лятото</td></tr>
  <tr><td>Ситония (Никити)</td><td>2-2,5 часа</td><td>€13-15</td><td>4-6</td></tr>
  <tr><td>Уранополи</td><td>2,5-3 часа</td><td>€14-15</td><td>3-5</td></tr>
</table>
<p><strong>Важно:</strong> КТЕЛ не спира на летище SKG. Първо трябва да стигнете до центъра (автобус 01X, €2, 45 мин).</p>

<h2>Частен трансфер</h2>
<ul>
  <li><strong>Цена:</strong> €60-80 до Касандра, €70-90 до Ситония, €80-100 до Уранополи</li>
  <li>Услуга от врата до врата, детски седалки при заявка</li>
</ul>

<h2>Такси</h2>
<ul>
  <li>Летище → Касандра: €80-100</li>
  <li>Летище → Ситония: €100-120</li>
  <li>Летище → Уранополи: €110-130</li>
</ul>

<h2>Кола под наем (Препоръчително)</h2>
<p><strong>Идеалният избор</strong> за свободно изследване. Цени: €25-50/ден.</p>
<ul>
  <li>SKG → Касандра: 80 км, ~1 час</li>
  <li>SKG → Ситония: 110 км, ~1,5 часа</li>
  <li>SKG → Уранополи: 130 км, ~2 часа</li>
</ul>`,

      ru: `<h2>Автобус КТЕЛ (Общественный транспорт)</h2>
<p>Самый бюджетный вариант. Автобусы отправляются с <strong>автовокзала КТЕЛ Халкидики</strong> в Салониках (ул. Каракаси 68).</p>
<table>
  <tr><th>Направление</th><th>Время</th><th>Стоимость</th><th>Рейсов/День</th></tr>
  <tr><td>Кассандра (Каллифея)</td><td>1,5-2 часа</td><td>€12-14</td><td>6-8 летом</td></tr>
  <tr><td>Ситония (Никити)</td><td>2-2,5 часа</td><td>€13-15</td><td>4-6</td></tr>
  <tr><td>Уранополис</td><td>2,5-3 часа</td><td>€14-15</td><td>3-5</td></tr>
</table>
<p><strong>Важно:</strong> КТЕЛ не заезжает в аэропорт SKG. Сначала доберитесь до центра (автобус 01X, €2, 45 минут).</p>

<h2>Частный трансфер</h2>
<ul>
  <li><strong>Стоимость:</strong> €60-80 до Кассандры, €70-90 до Ситонии, €80-100 до Уранополиса</li>
  <li>Дверь-в-дверь, детские кресла по запросу</li>
  <li>Бронируйте онлайн заранее — Welcome Pickups, Kiwitaxi</li>
</ul>

<h2>Такси</h2>
<ul>
  <li>Аэропорт → Кассандра: €80-100</li>
  <li>Аэропорт → Ситония: €100-120</li>
  <li>Аэропорт → Уранополис: €110-130</li>
  <li><strong>Совет:</strong> Всегда договаривайтесь о цене заранее!</li>
</ul>

<h2>Аренда автомобиля (Рекомендуется)</h2>
<p><strong>Идеальный выбор</strong> для свободного путешествия. Прокат в аэропорту SKG: Avis, Hertz, Sixt, Enterprise. Цены: €25-50/день.</p>
<ul>
  <li>SKG → Кассандра: 80 км, ~1 час по автостраде</li>
  <li>SKG → Ситония (Никити): 110 км, ~1,5 часа</li>
  <li>SKG → Уранополис: 130 км, ~2 часа</li>
</ul>`,

      ro: `<h2>Autobuz KTEL (Transport public)</h2>
<p>Cea mai accesibilă opțiune. Autobuzele pleacă de la <strong>autogara KTEL Halkidiki</strong> din Salonic (strada Karakasi 68).</p>
<table>
  <tr><th>Destinație</th><th>Durată</th><th>Cost</th><th>Curse/Zi</th></tr>
  <tr><td>Kassandra (Kallithea)</td><td>1,5-2 ore</td><td>€12-14</td><td>6-8 vara</td></tr>
  <tr><td>Sithonia (Nikiti)</td><td>2-2,5 ore</td><td>€13-15</td><td>4-6</td></tr>
  <tr><td>Ouranoupoli</td><td>2,5-3 ore</td><td>€14-15</td><td>3-5</td></tr>
</table>
<p><strong>Important:</strong> KTEL nu oprește la aeroportul SKG. Trebuie mai întâi să ajungi în centru (autobuz 01X, €2, 45 min).</p>

<h2>Transfer privat</h2>
<ul>
  <li><strong>Cost:</strong> €60-80 la Kassandra, €70-90 la Sithonia, €80-100 la Ouranoupoli</li>
  <li>Serviciu ușă-la-ușă, scaune auto pentru copii la cerere</li>
</ul>

<h2>Taxi</h2>
<ul>
  <li>Aeroport → Kassandra: €80-100</li>
  <li>Aeroport → Sithonia: €100-120</li>
  <li>Aeroport → Ouranoupoli: €110-130</li>
</ul>

<h2>Închiriere mașină (Recomandat)</h2>
<p><strong>Alegerea ideală</strong> pentru explorare liberă. Agenții la SKG: Avis, Hertz, Sixt. Prețuri: €25-50/zi.</p>
<ul>
  <li>SKG → Kassandra: 80 km, ~1 oră</li>
  <li>SKG → Sithonia: 110 km, ~1,5 ore</li>
  <li>SKG → Ouranoupoli: 130 km, ~2 ore</li>
</ul>`,

      sr: `<h2>KTEL autobus (Javni prevoz)</h2>
<p>Najjeftinija opcija. Autobusi polaze sa <strong>autobuske stanice KTEL Halkidiki</strong> u Solunu (ulica Karakasi 68).</p>
<table>
  <tr><th>Destinacija</th><th>Trajanje</th><th>Cena</th><th>Polazaka/Dan</th></tr>
  <tr><td>Kasandra (Kalitea)</td><td>1,5-2 sata</td><td>€12-14</td><td>6-8 leti</td></tr>
  <tr><td>Sitonija (Nikiti)</td><td>2-2,5 sata</td><td>€13-15</td><td>4-6</td></tr>
  <tr><td>Uranopoli</td><td>2,5-3 sata</td><td>€14-15</td><td>3-5</td></tr>
</table>
<p><strong>Važno:</strong> KTEL ne staje na aerodromu SKG. Prvo morate do centra (autobus 01X, €2, 45 min).</p>

<h2>Privatni transfer</h2>
<ul>
  <li><strong>Cena:</strong> €60-80 do Kasandre, €70-90 do Sitonije, €80-100 do Uranopolija</li>
  <li>Od vrata do vrata, dečja sedišta na zahtev</li>
</ul>

<h2>Taksi</h2>
<ul>
  <li>Aerodrom → Kasandra: €80-100</li>
  <li>Aerodrom → Sitonija: €100-120</li>
  <li>Aerodrom → Uranopoli: €110-130</li>
</ul>

<h2>Rent-a-car (Preporučeno)</h2>
<p><strong>Idealan izbor</strong> za slobodno istraživanje. Agencije na SKG: Avis, Hertz, Sixt. Cene: €25-50/dan.</p>
<ul>
  <li>SKG → Kasandra: 80 km, ~1 sat</li>
  <li>SKG → Sitonija: 110 km, ~1,5 sat</li>
  <li>SKG → Uranopoli: 130 km, ~2 sata</li>
</ul>`,
    },
  },
  // ─── 4. ROAD TRIP ───
  {
    slug: 'road-trip',
    icon: 'Route',
    color: 'teal',
    title: {
      el: '7ήμερο Road Trip στη Χαλκιδική',
      en: '7-Day Halkidiki Road Trip Itinerary',
      de: '7-Tage Roadtrip durch Chalkidiki',
      bg: '7-дневно пътешествие с кола из Халкидики',
      ru: '7-дневное автопутешествие по Халкидики',
      ro: 'Itinerar 7 zile cu mașina în Halkidiki',
      sr: '7-dnevni road trip kroz Halkidiki',
    },
    description: {
      el: 'Κασσάνδρα, Σιθωνία, Αμμουλιανή, Άθως cruise, ορεινά χωριά. Πλήρες πρόγραμμα.',
      en: 'Kassandra, Sithonia, Ammouliani, Athos cruise, mountain villages. Complete day-by-day plan.',
      de: 'Kassandra, Sithonia, Ammouliani, Athos-Kreuzfahrt, Bergdörfer. Täglicher Plan.',
      bg: 'Касандра, Ситония, Амулиани, круиз Атос, планински села. Пълна програма по дни.',
      ru: 'Кассандра, Ситония, Аммулиани, круиз к Афону, горные деревни. Подробный план по дням.',
      ro: 'Kassandra, Sithonia, Ammouliani, croazieră Athos, sate montane. Plan complet pe zile.',
      sr: 'Kasandra, Sitonija, Amuliani, Atos krstarenje, planinska sela. Kompletan plan po danima.',
    },
    metaTitle: {
      el: '7ήμερο Road Trip Χαλκιδικής | Πλήρες Πρόγραμμα',
      en: '7-Day Halkidiki Road Trip | Complete Itinerary & Driving Distances',
      de: '7-Tage Chalkidiki Roadtrip | Komplette Route & Entfernungen',
      bg: '7-дневен road trip Халкидики | Пълен маршрут и разстояния',
      ru: '7-дневный road trip по Халкидики | Маршрут и расстояния',
      ro: 'Road trip 7 zile Halkidiki | Itinerar complet și distanțe',
      sr: '7-dnevni road trip Halkidiki | Kompletan plan i rastojanja',
    },
    metaDesc: {
      el: 'Ιδανικό 7ήμερο road trip στη Χαλκιδική: Κασσάνδρα, Σιθωνία, Αμμουλιανή, Άθως, ορεινά χωριά. Αποστάσεις, στάσεις και συμβουλές.',
      en: 'Perfect 7-day Halkidiki road trip: Kassandra, Sithonia, Ammouliani, Athos cruise, Arnea. Driving distances, stops and tips.',
      de: 'Perfekter 7-Tage-Roadtrip durch Chalkidiki: Kassandra, Sithonia, Ammouliani, Athos, Arnea. Entfernungen und Tipps.',
      bg: 'Перфектен 7-дневен road trip в Халкидики: Касандра, Ситония, Амулиани, Атос, Арнеа. Разстояния и съвети.',
      ru: 'Идеальный 7-дневный road trip по Халкидики: Кассандра, Ситония, Аммулиани, Афон, Арнея. Расстояния и советы.',
      ro: 'Road trip perfect 7 zile Halkidiki: Kassandra, Sithonia, Ammouliani, Athos, Arnea. Distanțe și sfaturi.',
      sr: 'Savršen 7-dnevni road trip Halkidiki: Kasandra, Sitonija, Amuliani, Atos, Arnea. Rastojanja i saveti.',
    },
    content: {
      el: `<h2>Ημέρα 1-2: Κασσάνδρα</h2>
<p>Ξεκινήστε από τη <strong>Θεσσαλονίκη</strong> (80 km, 1 ώρα). Βάση: Αφύτος ή Καλλιθέα.</p>
<ul>
  <li><strong>Ημέρα 1:</strong> Άφυτος (πέτρινο χωριό με θέα), Καλλιθέα (ναός Άμμωνα Δία, beach bars), ηλιοβασίλεμα στο Σίβηρι</li>
  <li><strong>Ημέρα 2:</strong> Ποσείδι (φάρος, αμμώδης παραλία), Σάνη (μαρίνα & resort), Πολύχρονο για μεσημεριανό</li>
</ul>
<p><strong>Αποστάσεις:</strong> Αφύτος → Καλλιθέα: 8 km | Καλλιθέα → Ποσείδι: 25 km | Ποσείδι → Σάνη: 30 km</p>

<h2>Ημέρα 3-4: Σιθωνία</h2>
<p>Μετακίνηση Κασσάνδρα → Βουρβουρού: 90 km, 1,5 ώρα.</p>
<ul>
  <li><strong>Ημέρα 3:</strong> Βουρβουρού (βαρκάδα στη Blue Lagoon), Καβουρότρυπες (εξωτικοί βράχοι), Σάρτη (ηλιοβασίλεμα)</li>
  <li><strong>Ημέρα 4:</strong> Πόρτο Κουφό (φυσικό λιμάνι, ψαροταβέρνες), Τορώνη (αρχαίο κάστρο), Νικήτη (παλιό χωριό, μελισσοκομείο)</li>
</ul>
<p><strong>Αποστάσεις:</strong> Βουρβουρού → Καβουρότρυπες: 15 km | Σάρτη → Πόρτο Κουφό: 25 km</p>

<h2>Ημέρα 5: Αμμουλιανή</h2>
<p>Σιθωνία → Τρυπητή: 80 km, 1,5 ώρα. Φέρι 15 λεπτά (€3).</p>
<ul>
  <li>Πρωί: Παραλία Αλυκές, κολύμπι</li>
  <li>Μεσημέρι: Βαρκάδα στα Δρένια (€10-15)</li>
  <li>Απόγευμα: Ψαροταβέρνα στο χωριό</li>
</ul>

<h2>Ημέρα 6: Ουρανούπολη & Κρουαζιέρα Άθως</h2>
<p>Τρυπητή → Ουρανούπολη: 10 km.</p>
<ul>
  <li>Πρωί: Κρουαζιέρα κατά μήκος του Αγίου Όρους (€20-30, 3 ώρες) — θέα στα μοναστήρια από τη θάλασσα</li>
  <li>Απόγευμα: Πύργος Προσφορά, παραλία Ουρανούπολης, βόλτα στα σοκάκια</li>
</ul>

<h2>Ημέρα 7: Ορεινά Χωριά</h2>
<p>Ουρανούπολη → Αρναία: 65 km, 1 ώρα.</p>
<ul>
  <li><strong>Αρναία:</strong> Λαογραφικό Μουσείο, πέτρινα αρχοντικά, τοπικό μέλι</li>
  <li><strong>Παρθενώνας:</strong> Εγκαταλελειμμένο χωριό μετατραπέν σε εστιατόρια με θέα (15 km από Νέο Μαρμαρά)</li>
  <li>Επιστροφή Θεσσαλονίκη: 100 km, 1,5 ώρα</li>
</ul>`,

      en: `<h2>Day 1-2: Kassandra Peninsula</h2>
<p>Depart from <strong>Thessaloniki/SKG airport</strong> (80 km, 1 hour). Base yourself in Afytos or Kallithea.</p>
<ul>
  <li><strong>Day 1:</strong> Afytos (stone village with clifftop sea views), Kallithea (ruins of the Temple of Ammon Zeus, lively beach bars), sunset at Siviri beach</li>
  <li><strong>Day 2:</strong> Possidi (lighthouse, long sandy beach), Sani Resort area (marina stroll), Polychrono for a seafood lunch</li>
</ul>
<p><strong>Driving distances:</strong> Afytos → Kallithea: 8 km | Kallithea → Possidi: 25 km | Possidi → Sani: 30 km</p>

<h2>Day 3-4: Sithonia Peninsula</h2>
<p>Transfer Kassandra → Vourvourou: 90 km, 1.5 hours via the main road.</p>
<ul>
  <li><strong>Day 3:</strong> Vourvourou (boat to the Blue Lagoon — €10-15), Kavourotrypes (dramatic orange cliffs, turquoise coves), Sarti for sunset with Mount Athos views</li>
  <li><strong>Day 4:</strong> Porto Koufo (natural harbour, best fish tavernas), Toroni (ancient fortress ruins, sandy beach), Nikiti (old village walk, honey farm visit)</li>
</ul>
<p><strong>Driving distances:</strong> Vourvourou → Kavourotrypes: 15 km | Sarti → Porto Koufo: 25 km | Porto Koufo → Nikiti: 45 km</p>

<h2>Day 5: Ammouliani Island</h2>
<p>Sithonia → Tripiti ferry port: 80 km, 1.5 hours. Ferry: 15 min, €3/person.</p>
<ul>
  <li>Morning: Alikes beach — the island's best, with shallow turquoise water</li>
  <li>Midday: Boat trip to Drenia uninhabited islets (€10-15 from Ammouliani port)</li>
  <li>Afternoon: Seafood lunch at a waterfront taverna in the village</li>
</ul>

<h2>Day 6: Ouranoupoli & Mount Athos Cruise</h2>
<p>Tripiti → Ouranoupoli: 10 km, 15 minutes.</p>
<ul>
  <li>Morning: Mount Athos cruise along the monastic peninsula (€20-30, 3 hours) — see ancient monasteries from the sea. Book at the harbour the evening before</li>
  <li>Afternoon: Prosforiou Tower (Byzantine landmark), Ouranoupoli beach, browse icon and souvenir shops</li>
</ul>

<h2>Day 7: Mountain Villages & Return</h2>
<p>Ouranoupoli → Arnea: 65 km, 1 hour through scenic mountain roads.</p>
<ul>
  <li><strong>Arnea:</strong> Folklore Museum, stone mansions, local honey and textiles. Coffee at the plateia (village square)</li>
  <li><strong>Parthenonas:</strong> A once-abandoned stone village reborn as a dining destination with panoramic Toroneos Gulf views (15 km from Neos Marmaras)</li>
  <li>Return to Thessaloniki: 100 km, 1.5 hours via the highway</li>
</ul>

<h2>Practical Tips</h2>
<ul>
  <li><strong>Total driving:</strong> ~500 km over 7 days — very manageable</li>
  <li><strong>Fuel:</strong> Fill up at main-road stations; small village pumps may close by 20:00</li>
  <li><strong>Best months:</strong> June and September for fewer crowds and warm weather</li>
  <li><strong>Navigation:</strong> Google Maps works well; download offline maps for mountain areas</li>
</ul>`,

      de: `<h2>Tag 1-2: Kassandra-Halbinsel</h2>
<p>Abfahrt von <strong>Thessaloniki/SKG</strong> (80 km, 1 Stunde). Basis: Afytos oder Kallithea.</p>
<ul>
  <li><strong>Tag 1:</strong> Afytos (Steindorf mit Meerblick), Kallithea (Tempel des Ammon Zeus, Beach Bars), Sonnenuntergang in Siviri</li>
  <li><strong>Tag 2:</strong> Possidi (Leuchtturm, Sandstrand), Sani (Marina), Polychrono (Fisch-Mittagessen)</li>
</ul>
<p><strong>Entfernungen:</strong> Afytos → Kallithea: 8 km | Kallithea → Possidi: 25 km</p>

<h2>Tag 3-4: Sithonia-Halbinsel</h2>
<p>Kassandra → Vourvourou: 90 km, 1,5 Stunden.</p>
<ul>
  <li><strong>Tag 3:</strong> Vourvourou (Boot zur Blauen Lagune), Kavourotrypes (Felsenklippen), Sarti (Sonnenuntergang mit Athos-Blick)</li>
  <li><strong>Tag 4:</strong> Porto Koufo (Naturhafen, Fischtavernen), Toroni (antike Festung), Nikiti (altes Dorf)</li>
</ul>

<h2>Tag 5: Ammouliani-Insel</h2>
<p>Sithonia → Tripiti: 80 km. Fähre: 15 Min., 3 €/Person.</p>
<ul>
  <li>Alikes-Strand, Bootstour zu den Drenia-Inseln, Fischtaverne im Dorf</li>
</ul>

<h2>Tag 6: Ouranoupoli & Athos-Kreuzfahrt</h2>
<ul>
  <li>Athos-Kreuzfahrt (20-30 €, 3 Stunden) — Klöster vom Meer aus sehen</li>
  <li>Prosforiou-Turm, Strand, Souvenirläden</li>
</ul>

<h2>Tag 7: Bergdörfer & Rückfahrt</h2>
<ul>
  <li><strong>Arnea:</strong> Volkskundemuseum, Steinhäuser, lokaler Honig</li>
  <li><strong>Parthenonas:</strong> Restauriertes Bergdorf mit Panoramablick</li>
  <li>Rückfahrt Thessaloniki: 100 km, 1,5 Stunden</li>
</ul>`,

      bg: `<h2>Ден 1-2: Полуостров Касандра</h2>
<p>Тръгване от <strong>Солун/летище SKG</strong> (80 км, 1 час). База: Афитос или Калитея.</p>
<ul>
  <li><strong>Ден 1:</strong> Афитос (каменно село с гледка), Калитея (храм на Амон Зевс, бийч барове), залез в Сивири</li>
  <li><strong>Ден 2:</strong> Посиди (фар, пясъчен плаж), Сани (марина), Полихроно (обяд с риба)</li>
</ul>

<h2>Ден 3-4: Полуостров Ситония</h2>
<p>Касандра → Вурвуру: 90 км, 1,5 часа.</p>
<ul>
  <li><strong>Ден 3:</strong> Вурвуру (лодка до Синята лагуна), Кавуротрипес, Сарти (залез с изглед към Атос)</li>
  <li><strong>Ден 4:</strong> Порто Куфо (рибни таверни), Торони (антична крепост), Никити (старо село)</li>
</ul>

<h2>Ден 5: Остров Амулиани</h2>
<p>Ситония → Трипити: 80 км. Ферибот: 15 мин, €3.</p>
<ul><li>Плаж Аликес, лодка до Дрения, рибна таверна</li></ul>

<h2>Ден 6: Уранополи и круиз Атос</h2>
<ul><li>Круиз покрай Атос (€20-30, 3 часа), кула Просфорион, плаж</li></ul>

<h2>Ден 7: Планински села</h2>
<ul>
  <li><strong>Арнеа:</strong> Музей, каменни къщи, мед</li>
  <li><strong>Партенонас:</strong> Възстановено село с панорама</li>
  <li>Връщане в Солун: 100 км, 1,5 часа</li>
</ul>`,

      ru: `<h2>День 1-2: Полуостров Кассандра</h2>
<p>Выезд из <strong>Салоников/аэропорта SKG</strong> (80 км, 1 час). База: Афитос или Каллифея.</p>
<ul>
  <li><strong>День 1:</strong> Афитос (каменная деревня с видом на море), Каллифея (руины храма Аммона Зевса, бич-бары), закат в Сивири</li>
  <li><strong>День 2:</strong> Поссиди (маяк, песчаный пляж), Сани (марина), Полихроно (обед с морепродуктами)</li>
</ul>
<p><strong>Расстояния:</strong> Афитос → Каллифея: 8 км | Каллифея → Поссиди: 25 км</p>

<h2>День 3-4: Полуостров Ситония</h2>
<p>Кассандра → Вурвуру: 90 км, 1,5 часа.</p>
<ul>
  <li><strong>День 3:</strong> Вурвуру (лодка в Голубую лагуну), Кавуротрипес (скалистые бухты), Сарти (закат с видом на Афон)</li>
  <li><strong>День 4:</strong> Порто Куфо (рыбные таверны), Торони (крепость), Никити (старая деревня, пасека)</li>
</ul>

<h2>День 5: Остров Аммулиани</h2>
<p>Ситония → Трипити: 80 км. Паром: 15 мин, €3.</p>
<ul><li>Пляж Аликес, лодка на Дрения (€10-15), обед в рыбной таверне</li></ul>

<h2>День 6: Уранополис и круиз к Афону</h2>
<ul><li>Круиз вдоль Афона (€20-30, 3 часа) — монастыри с моря</li>
<li>Башня Просфорион, пляж, сувениры</li></ul>

<h2>День 7: Горные деревни и возвращение</h2>
<ul>
  <li><strong>Арнея:</strong> Фольклорный музей, каменные особняки, мёд</li>
  <li><strong>Партенонас:</strong> Восстановленная деревня с панорамой</li>
  <li>Возвращение в Салоники: 100 км, 1,5 часа</li>
</ul>
<p><strong>Итого:</strong> ~500 км за 7 дней. Лучшие месяцы: июнь и сентябрь.</p>`,

      ro: `<h2>Ziua 1-2: Peninsula Kassandra</h2>
<p>Plecare din <strong>Salonic/aeroportul SKG</strong> (80 km, 1 oră). Baza: Afytos sau Kallithea.</p>
<ul>
  <li><strong>Ziua 1:</strong> Afytos (sat de piatră cu priveliște), Kallithea (templul lui Ammon Zeus, beach baruri), apus la Siviri</li>
  <li><strong>Ziua 2:</strong> Possidi (far, plajă de nisip), Sani (marină), Polychrono (prânz cu pește)</li>
</ul>

<h2>Ziua 3-4: Peninsula Sithonia</h2>
<p>Kassandra → Vourvourou: 90 km, 1,5 ore.</p>
<ul>
  <li><strong>Ziua 3:</strong> Vourvourou (barcă la Laguna Albastră), Kavourotrypes, Sarti (apus cu vedere la Athos)</li>
  <li><strong>Ziua 4:</strong> Porto Koufo (taverne de pește), Toroni (cetate antică), Nikiti (sat vechi)</li>
</ul>

<h2>Ziua 5: Insula Ammouliani</h2>
<p>Sithonia → Tripiti: 80 km. Feribot: 15 min, €3.</p>
<ul><li>Plaja Alikes, barcă la Drenia, tavernă de pește</li></ul>

<h2>Ziua 6: Ouranoupoli & Croazieră Athos</h2>
<ul><li>Croazieră Athos (€20-30, 3 ore), Turnul Prosforiou, plajă</li></ul>

<h2>Ziua 7: Sate montane și întoarcere</h2>
<ul>
  <li><strong>Arnea:</strong> Muzeu, case de piatră, miere locală</li>
  <li><strong>Parthenonas:</strong> Sat restaurat cu panoramă</li>
  <li>Întoarcere Salonic: 100 km, 1,5 ore</li>
</ul>`,

      sr: `<h2>Dan 1-2: Poluostrvo Kasandra</h2>
<p>Polazak iz <strong>Soluna/aerodroma SKG</strong> (80 km, 1 sat). Baza: Afitos ili Kalitea.</p>
<ul>
  <li><strong>Dan 1:</strong> Afitos (kameno selo sa pogledom), Kalitea (hram Amona Zevsa, bič barovi), zalazak u Siviriju</li>
  <li><strong>Dan 2:</strong> Posidi (svetionik, peščana plaža), Sani (marina), Polihrono (ručak sa ribom)</li>
</ul>

<h2>Dan 3-4: Poluostrvo Sitonija</h2>
<p>Kasandra → Vurvuru: 90 km, 1,5 sat.</p>
<ul>
  <li><strong>Dan 3:</strong> Vurvuru (čamac do Plave lagune), Kavurotrupes, Sarti (zalazak sa pogledom na Atos)</li>
  <li><strong>Dan 4:</strong> Porto Kufo (riblji taverne), Toroni (antička tvrđava), Nikiti (staro selo)</li>
</ul>

<h2>Dan 5: Ostrvo Amuliani</h2>
<p>Sitonija → Tripiti: 80 km. Trajekt: 15 min, €3.</p>
<ul><li>Plaža Alikes, čamac do Drenije, riblja taverna</li></ul>

<h2>Dan 6: Uranopoli i krstarenje Atos</h2>
<ul><li>Krstarenje pored Atosa (€20-30, 3 sata), Kula Prosforion, plaža</li></ul>

<h2>Dan 7: Planinska sela i povratak</h2>
<ul>
  <li><strong>Arnea:</strong> Muzej, kamene kuće, lokalni med</li>
  <li><strong>Partenonas:</strong> Obnovljeno selo sa panoramom</li>
  <li>Povratak u Solun: 100 km, 1,5 sat</li>
</ul>`,
    },
  },
  // ─── 5. LUXURY ───
  {
    slug: 'luxury',
    icon: 'Crown',
    color: 'yellow',
    title: {
      el: 'Πολυτελείς Διακοπές στη Χαλκιδική',
      en: 'Luxury Holidays in Halkidiki',
      de: 'Luxusurlaub in Chalkidiki',
      bg: 'Луксозна почивка в Халкидики',
      ru: 'Роскошный отдых в Халкидики',
      ro: 'Vacanță de lux în Halkidiki',
      sr: 'Luksuzni odmor u Halkidikiju',
    },
    description: {
      el: 'Sani Resort, Eagles Palace, Danai Beach, Ikos, yacht, gourmet dining.',
      en: 'Sani Resort, Eagles Palace, Danai Beach, Ikos, private yachts and gourmet dining.',
      de: 'Sani Resort, Eagles Palace, Danai Beach, Ikos, Privatyachten und Gourmet-Dining.',
      bg: 'Sani Resort, Eagles Palace, Danai Beach, Ikos, частни яхти и гурме ресторанти.',
      ru: 'Sani Resort, Eagles Palace, Danai Beach, Ikos, частные яхты и высокая кухня.',
      ro: 'Sani Resort, Eagles Palace, Danai Beach, Ikos, iahturi private și dining gourmet.',
      sr: 'Sani Resort, Eagles Palace, Danai Beach, Ikos, privatne jahte i gurme restorani.',
    },
    metaTitle: {
      el: 'Πολυτελή Ξενοδοχεία & Εμπειρίες Χαλκιδικής',
      en: 'Luxury Hotels & Experiences in Halkidiki | 5-Star Guide',
      de: 'Luxushotels & Erlebnisse in Chalkidiki | 5-Sterne-Guide',
      bg: 'Луксозни хотели и преживявания в Халкидики',
      ru: 'Роскошные отели и впечатления Халкидики | 5-звёздочный гид',
      ro: 'Hoteluri de lux și experiențe în Halkidiki',
      sr: 'Luksuzni hoteli i iskustva u Halkidikiju',
    },
    metaDesc: {
      el: 'Οι καλύτερες πολυτελείς εμπειρίες στη Χαλκιδική: Sani Resort, Eagles Palace, Danai Beach, yacht, gourmet εστιατόρια.',
      en: 'The finest luxury experiences in Halkidiki: Sani Resort, Eagles Palace, Danai Beach, private yacht charters and Michelin-level dining.',
      de: 'Die besten Luxuserlebnisse in Chalkidiki: Sani Resort, Eagles Palace, Danai Beach, Privatyachten und Gourmet-Restaurants.',
      bg: 'Най-добрите луксозни преживявания в Халкидики: Sani Resort, Eagles Palace, Danai Beach, яхти и гурме ресторанти.',
      ru: 'Лучшие люкс-впечатления Халкидики: Sani Resort, Eagles Palace, Danai Beach, яхты и рестораны высокой кухни.',
      ro: 'Cele mai bune experiențe de lux în Halkidiki: Sani Resort, Eagles Palace, Danai Beach, iahturi și restaurante gourmet.',
      sr: 'Najbolja luksuzna iskustva u Halkidikiju: Sani Resort, Eagles Palace, Danai Beach, jahte i gurme restorani.',
    },
    content: {
      el: `<h2>Κορυφαία 5-Αστέρια Resort</h2>
<table>
  <tr><th>Resort</th><th>Τοποθεσία</th><th>Highlights</th><th>Από (€/νύχτα)</th></tr>
  <tr><td>Sani Resort</td><td>Κασσάνδρα</td><td>Ιδιωτική μαρίνα, Michelin dining, Sani Festival</td><td>€250+</td></tr>
  <tr><td>Eagles Palace & Villas</td><td>Ουρανούπολη</td><td>Spa, ιδιωτική παραλία, θέα Άθως</td><td>€200+</td></tr>
  <tr><td>Danai Beach Resort</td><td>Νικήτη</td><td>Boutique 5*, εστιατόριο βραβευμένο</td><td>€300+</td></tr>
  <tr><td>Miraggio Thermal Spa</td><td>Κασσάνδρα (Παλιούρι)</td><td>Θερμαλισμός, 6 πισίνες, ιδιωτική μαρίνα</td><td>€220+</td></tr>
  <tr><td>Ikos Olivia</td><td>Γερακινή</td><td>Infinite Lifestyle (all-in), 5 εστιατόρια</td><td>€350+</td></tr>
  <tr><td>Ikos Oceania</td><td>Νέα Μουδανιά</td><td>Michelin-chef dining, Tesla transfers</td><td>€400+</td></tr>
</table>

<h2>Ιδιωτικά Yacht & Transfers</h2>
<ul>
  <li><strong>Ενοικίαση σκάφους:</strong> Από €500/ημέρα για sailboat, €1.500+ για μηχανοκίνητο yacht με κυβερνήτη</li>
  <li><strong>Ελικόπτερο:</strong> Μεταφορά SKG → Σάνη ή Ουρανούπολη σε 20-30 λεπτά (~€800-1.200)</li>
  <li><strong>VIP transfer:</strong> Mercedes/BMW με οδηγό από €100</li>
</ul>

<h2>Gourmet Εμπειρίες</h2>
<ul>
  <li>Wine tasting στο <strong>Domaine Porto Carras</strong> με ιδιωτικό sommelier</li>
  <li>Chef's table στο <strong>Sani Gourmet Festival</strong> (κάθε Ιούλιο)</li>
  <li>Μαθήματα μαγειρικής με τοπικά υλικά σε boutique hotel</li>
</ul>`,

      en: `<h2>Top 5-Star Resorts</h2>
<table>
  <tr><th>Resort</th><th>Location</th><th>Highlights</th><th>From (€/night)</th></tr>
  <tr><td>Sani Resort</td><td>Kassandra</td><td>Private marina, Michelin-level dining, annual Sani Festival</td><td>€250+</td></tr>
  <tr><td>Eagles Palace & Villas</td><td>Ouranoupoli</td><td>Full-service spa, private beach, Mount Athos views</td><td>€200+</td></tr>
  <tr><td>Danai Beach Resort</td><td>Nikiti</td><td>Boutique 5-star, award-winning restaurant, exclusive feel</td><td>€300+</td></tr>
  <tr><td>Miraggio Thermal Spa</td><td>Kassandra (Paliouri)</td><td>Thermal spa, 6 pools, private marina, adults-only wing</td><td>€220+</td></tr>
  <tr><td>Ikos Olivia</td><td>Gerakini</td><td>Infinite Lifestyle all-inclusive, 5 restaurants, beach butler</td><td>€350+</td></tr>
  <tr><td>Ikos Oceania</td><td>Nea Moudania</td><td>Michelin-chef restaurants, Tesla transfers, kids club</td><td>€400+</td></tr>
</table>

<h2>Private Yacht & Helicopter</h2>
<ul>
  <li><strong>Yacht charter:</strong> From €500/day for a sailboat, €1,500+ for a motorised yacht with skipper. Full-day cruises to Mount Athos or Drenia islands available</li>
  <li><strong>Helicopter transfer:</strong> SKG airport → Sani or Ouranoupoli in 20-30 minutes (~€800-1,200)</li>
  <li><strong>VIP car transfer:</strong> Mercedes/BMW with driver from €100</li>
</ul>

<h2>Gourmet Experiences</h2>
<ul>
  <li>Private wine tasting at <strong>Domaine Porto Carras</strong> with personal sommelier</li>
  <li>Chef's table at the <strong>Sani Gourmet Festival</strong> (every July) — guest chefs from around the world</li>
  <li>Cooking classes with local ingredients at boutique hotels</li>
  <li>Olive oil sommelier experience in Arnea mountain village</li>
  <li>Sunset dinner on a private catamaran</li>
</ul>

<h2>Exclusive Beaches</h2>
<p>Most luxury resorts offer private beach sections with premium sunbeds (€30-50/day). For a true VIP experience, charter a boat to <strong>Drenia islands</strong> for a private beach picnic arranged by your hotel concierge.</p>`,

      de: `<h2>Top 5-Sterne-Resorts</h2>
<table>
  <tr><th>Resort</th><th>Lage</th><th>Highlights</th><th>Ab (€/Nacht)</th></tr>
  <tr><td>Sani Resort</td><td>Kassandra</td><td>Privatmarina, Michelin-Dining, Sani Festival</td><td>250 €+</td></tr>
  <tr><td>Eagles Palace & Villas</td><td>Ouranoupoli</td><td>Spa, Privatstrand, Athos-Blick</td><td>200 €+</td></tr>
  <tr><td>Danai Beach Resort</td><td>Nikiti</td><td>Boutique 5-Sterne, preisgekröntes Restaurant</td><td>300 €+</td></tr>
  <tr><td>Miraggio Thermal Spa</td><td>Kassandra</td><td>Thermalquelle, 6 Pools, Privatmarina</td><td>220 €+</td></tr>
  <tr><td>Ikos Olivia</td><td>Gerakini</td><td>All-Inclusive, 5 Restaurants, Strandbutler</td><td>350 €+</td></tr>
</table>

<h2>Privatyacht & Helikopter</h2>
<ul>
  <li><strong>Yachtcharter:</strong> Ab 500 €/Tag (Segelboot), 1.500 €+ (Motoryacht mit Skipper)</li>
  <li><strong>Helikoptertransfer:</strong> SKG → Sani in 20 Min. (~800-1.200 €)</li>
  <li><strong>VIP-Transfer:</strong> Mercedes mit Fahrer ab 100 €</li>
</ul>

<h2>Gourmet-Erlebnisse</h2>
<ul>
  <li>Private Weinprobe im Domaine Porto Carras</li>
  <li>Chef's Table beim Sani Gourmet Festival (Juli)</li>
  <li>Sonnenuntergangs-Dinner auf privatem Katamaran</li>
</ul>`,

      bg: `<h2>Топ 5-звездни курорти</h2>
<table>
  <tr><th>Курорт</th><th>Локация</th><th>Акценти</th><th>От (€/нощ)</th></tr>
  <tr><td>Sani Resort</td><td>Касандра</td><td>Частна марина, Michelin dining, Sani Festival</td><td>€250+</td></tr>
  <tr><td>Eagles Palace</td><td>Уранополи</td><td>Спа, частен плаж, изглед Атос</td><td>€200+</td></tr>
  <tr><td>Danai Beach</td><td>Никити</td><td>Бутик 5 звезди, награждаван ресторант</td><td>€300+</td></tr>
  <tr><td>Miraggio Thermal</td><td>Касандра</td><td>Термален спа, 6 басейна</td><td>€220+</td></tr>
  <tr><td>Ikos Olivia</td><td>Геракини</td><td>All-inclusive, 5 ресторанта</td><td>€350+</td></tr>
</table>

<h2>Частни яхти и хеликоптер</h2>
<ul>
  <li><strong>Яхта:</strong> от €500/ден (платноходка), €1500+ (моторна с капитан)</li>
  <li><strong>Хеликоптер:</strong> SKG → Сани за 20 мин (~€800-1200)</li>
</ul>

<h2>Гурме преживявания</h2>
<ul>
  <li>Дегустация на вино в Domaine Porto Carras</li>
  <li>Chef's table на Sani Gourmet Festival (юли)</li>
  <li>Вечеря на частен катамаран по залез</li>
</ul>`,

      ru: `<h2>Лучшие 5-звёздочные курорты</h2>
<table>
  <tr><th>Курорт</th><th>Расположение</th><th>Особенности</th><th>От (€/ночь)</th></tr>
  <tr><td>Sani Resort</td><td>Кассандра</td><td>Частная марина, Michelin dining, фестиваль Sani</td><td>€250+</td></tr>
  <tr><td>Eagles Palace & Villas</td><td>Уранополис</td><td>Спа, частный пляж, вид на Афон</td><td>€200+</td></tr>
  <tr><td>Danai Beach Resort</td><td>Никити</td><td>Бутик 5 звёзд, награждённый ресторан</td><td>€300+</td></tr>
  <tr><td>Miraggio Thermal Spa</td><td>Кассандра</td><td>Термальный спа, 6 бассейнов, марина</td><td>€220+</td></tr>
  <tr><td>Ikos Olivia</td><td>Геракини</td><td>Всё включено, 5 ресторанов, пляжный батлер</td><td>€350+</td></tr>
  <tr><td>Ikos Oceania</td><td>Неа Муданья</td><td>Michelin-шефы, Tesla-трансферы</td><td>€400+</td></tr>
</table>

<h2>Частные яхты и вертолёт</h2>
<ul>
  <li><strong>Яхта:</strong> от €500/день (парусник), €1500+ (моторная с капитаном)</li>
  <li><strong>Вертолёт:</strong> SKG → Сани или Уранополис за 20-30 мин (~€800-1200)</li>
  <li><strong>VIP-трансфер:</strong> Mercedes/BMW с водителем от €100</li>
</ul>

<h2>Гастрономические впечатления</h2>
<ul>
  <li>Дегустация вин в Domaine Porto Carras с личным сомелье</li>
  <li>Chef's table на фестивале Sani Gourmet (июль)</li>
  <li>Ужин на закате на частном катамаране</li>
</ul>`,

      ro: `<h2>Top resorturi 5 stele</h2>
<table>
  <tr><th>Resort</th><th>Locație</th><th>Puncte forte</th><th>De la (€/noapte)</th></tr>
  <tr><td>Sani Resort</td><td>Kassandra</td><td>Marină privată, Michelin dining, Sani Festival</td><td>€250+</td></tr>
  <tr><td>Eagles Palace</td><td>Ouranoupoli</td><td>Spa, plajă privată, vedere Athos</td><td>€200+</td></tr>
  <tr><td>Danai Beach</td><td>Nikiti</td><td>Boutique 5 stele, restaurant premiat</td><td>€300+</td></tr>
  <tr><td>Miraggio Thermal</td><td>Kassandra</td><td>Spa termal, 6 piscine</td><td>€220+</td></tr>
  <tr><td>Ikos Olivia</td><td>Gerakini</td><td>All-inclusive, 5 restaurante</td><td>€350+</td></tr>
</table>

<h2>Iahturi și helicopter</h2>
<ul>
  <li><strong>Iaht:</strong> de la €500/zi (velier), €1500+ (iaht cu motor și skipper)</li>
  <li><strong>Helicopter:</strong> SKG → Sani în 20 min (~€800-1200)</li>
</ul>

<h2>Experiențe gourmet</h2>
<ul>
  <li>Degustare de vinuri la Domaine Porto Carras</li>
  <li>Chef's table la Sani Gourmet Festival (iulie)</li>
  <li>Cină la apus pe catamaran privat</li>
</ul>`,

      sr: `<h2>Top 5-zvezdični rezorti</h2>
<table>
  <tr><th>Rezort</th><th>Lokacija</th><th>Istaknuto</th><th>Od (€/noć)</th></tr>
  <tr><td>Sani Resort</td><td>Kasandra</td><td>Privatna marina, Michelin dining, Sani Festival</td><td>€250+</td></tr>
  <tr><td>Eagles Palace</td><td>Uranopoli</td><td>Spa, privatna plaža, pogled na Atos</td><td>€200+</td></tr>
  <tr><td>Danai Beach</td><td>Nikiti</td><td>Butik 5 zvezdica, nagrađivan restoran</td><td>€300+</td></tr>
  <tr><td>Miraggio Thermal</td><td>Kasandra</td><td>Termalni spa, 6 bazena</td><td>€220+</td></tr>
  <tr><td>Ikos Olivia</td><td>Gerakini</td><td>All-inclusive, 5 restorana</td><td>€350+</td></tr>
</table>

<h2>Privatne jahte i helikopter</h2>
<ul>
  <li><strong>Jahta:</strong> od €500/dan (jedrilica), €1500+ (motorna sa skiperom)</li>
  <li><strong>Helikopter:</strong> SKG → Sani za 20 min (~€800-1200)</li>
</ul>

<h2>Gurme iskustva</h2>
<ul>
  <li>Degustacija vina u Domaine Porto Carras</li>
  <li>Chef's table na Sani Gourmet Festivalu (jul)</li>
  <li>Večera na zalasku na privatnom katamaranu</li>
</ul>`,
    },
  },
  // ─── 6. VILLAS ───
  {
    slug: 'villas',
    icon: 'Home',
    color: 'stone',
    title: {
      el: 'Ενοικίαση Βίλας στη Χαλκιδική',
      en: 'Halkidiki Villa Rental Guide',
      de: 'Villen mieten in Chalkidiki',
      bg: 'Наем на вила в Халкидики',
      ru: 'Аренда вилл в Халкидики',
      ro: 'Închiriere vile în Halkidiki',
      sr: 'Iznajmljivanje vila u Halkidikiju',
    },
    description: {
      el: 'Γιατί βίλα, περιοχές, τι να προσέξετε, τιμές και συμβουλές κράτησης.',
      en: 'Why choose a villa, best areas, what to look for, prices and booking tips.',
      de: 'Warum eine Villa, beste Gebiete, worauf achten, Preise und Buchungstipps.',
      bg: 'Защо вила, най-добри райони, какво да търсите, цени и съвети за резервация.',
      ru: 'Почему вилла, лучшие районы, на что обратить внимание, цены и советы по бронированию.',
      ro: 'De ce vilă, cele mai bune zone, la ce să fii atent, prețuri și sfaturi de rezervare.',
      sr: 'Zašto vila, najbolja područja, na šta obratiti pažnju, cene i saveti za rezervaciju.',
    },
    metaTitle: {
      el: 'Βίλες Χαλκιδική | Οδηγός Ενοικίασης & Τιμές',
      en: 'Halkidiki Villa Rental | Areas, Prices & Booking Guide',
      de: 'Villen Chalkidiki | Gebiete, Preise & Buchungsguide',
      bg: 'Вили Халкидики | Райони, цени и гид за резервация',
      ru: 'Виллы Халкидики | Районы, цены и гид по бронированию',
      ro: 'Vile Halkidiki | Zone, prețuri și ghid de rezervare',
      sr: 'Vile Halkidiki | Područja, cene i vodič za rezervaciju',
    },
    metaDesc: {
      el: 'Πλήρης οδηγός ενοικίασης βίλας στη Χαλκιδική: περιοχές, τιμές (€80-300/νύχτα), τι να προσέξετε, πότε να κλείσετε.',
      en: 'Complete Halkidiki villa rental guide: best areas, prices (€80-300/night), what to look for, when to book.',
      de: 'Kompletter Villen-Mietguide Chalkidiki: beste Gebiete, Preise (80-300 €/Nacht), Buchungstipps.',
      bg: 'Пълен гид за наем на вила в Халкидики: райони, цени (€80-300/нощ), какво да търсите.',
      ru: 'Полный гид по аренде вилл в Халкидики: районы, цены (€80-300/ночь), на что обратить внимание.',
      ro: 'Ghid complet închiriere vile Halkidiki: zone, prețuri (€80-300/noapte), sfaturi de rezervare.',
      sr: 'Kompletan vodič za iznajmljivanje vila u Halkidikiju: područja, cene (€80-300/noć), saveti.',
    },
    content: {
      el: `<h2>Γιατί Βίλα αντί Ξενοδοχείο;</h2>
<ul>
  <li><strong>Χώρος:</strong> Ιδανικό για οικογένειες και παρέες — ξεχωριστά υπνοδωμάτια, κουζίνα, αυλή</li>
  <li><strong>Ιδιωτικότητα:</strong> Πισίνα, BBQ, κήπος χωρίς ξένους</li>
  <li><strong>Οικονομία:</strong> Μαγειρεύετε σπίτι, χωρίζετε το κόστος — συχνά φθηνότερα από 2+ δωμάτια ξενοδοχείου</li>
  <li><strong>Αυθεντικότητα:</strong> Ζήστε σαν ντόπιος</li>
</ul>

<h2>Καλύτερες Περιοχές</h2>
<table>
  <tr><th>Περιοχή</th><th>Χαρακτήρας</th><th>Ιδανικό για</th></tr>
  <tr><td>Σιθωνία</td><td>Ήσυχη, φύση, απομόνωση</td><td>Ζευγάρια, χαλάρωση</td></tr>
  <tr><td>Κασσάνδρα</td><td>Ζωντανή, υπηρεσίες, nightlife</td><td>Οικογένειες, νέους</td></tr>
  <tr><td>Ουρανούπολη</td><td>Γραφική, κοντά σε Άθως</td><td>Πολιτιστικό ενδιαφέρον</td></tr>
</table>

<h2>Τιμές</h2>
<ul>
  <li><strong>2 υπνοδωμάτια:</strong> €80-150/νύχτα (χωρίς πισίνα: €80-100, με πισίνα: €120-150)</li>
  <li><strong>4 υπνοδωμάτια luxury:</strong> €150-300/νύχτα</li>
  <li><strong>Peak season (Ιούλιος-Αύγουστος):</strong> +30-50% πάνω από Ιούνιο/Σεπτέμβριο</li>
</ul>

<h2>Τι να Προσέξετε</h2>
<ul>
  <li>Πισίνα (ιδιωτική ή κοινόχρηστη)</li>
  <li>Θέα θάλασσα ή βουνό</li>
  <li>BBQ / υπαίθρια κουζίνα</li>
  <li>Απόσταση από παραλία (πολλές βίλες είναι 1-5 km — χρειάζεστε αυτοκίνητο)</li>
  <li>WiFi ποιότητα — ρωτήστε πριν κλείσετε</li>
  <li>A/C σε όλα τα δωμάτια</li>
</ul>

<h2>Συμβουλές Κράτησης</h2>
<p>Κλείστε μέχρι <strong>Μάρτιο</strong> για καλοκαίρι — οι καλύτερες βίλες εξαφανίζονται γρήγορα. Ελέγξτε Airbnb, Booking.com, VRBO και τοπικά γραφεία. Ζητήστε πρόσφατες φωτογραφίες και reviews.</p>`,

      en: `<h2>Why Choose a Villa Over a Hotel?</h2>
<ul>
  <li><strong>Space:</strong> Perfect for families and groups — separate bedrooms, full kitchen, garden</li>
  <li><strong>Privacy:</strong> Your own pool, BBQ area, and outdoor space with no strangers</li>
  <li><strong>Value:</strong> Cook at home, split costs — often cheaper than 2+ hotel rooms for groups</li>
  <li><strong>Authenticity:</strong> Live like a local in a residential neighbourhood</li>
</ul>

<h2>Best Areas for Villas</h2>
<table>
  <tr><th>Area</th><th>Character</th><th>Best for</th></tr>
  <tr><td>Sithonia</td><td>Quiet, nature-focused, secluded</td><td>Couples, relaxation seekers</td></tr>
  <tr><td>Kassandra</td><td>Lively, good services, nightlife</td><td>Families, young groups</td></tr>
  <tr><td>Ouranoupoli area</td><td>Scenic, near Mount Athos</td><td>Cultural explorers</td></tr>
</table>

<h2>Price Ranges</h2>
<ul>
  <li><strong>2-bedroom without pool:</strong> €80-100/night</li>
  <li><strong>2-bedroom with pool:</strong> €120-150/night</li>
  <li><strong>4-bedroom luxury with pool & sea view:</strong> €150-300/night</li>
  <li><strong>Peak season (July-August):</strong> Add 30-50% compared to June/September prices</li>
  <li><strong>Minimum stay:</strong> Most require 5-7 nights in peak season, 3 nights off-peak</li>
</ul>

<h2>What to Look For</h2>
<ul>
  <li><strong>Pool:</strong> Private vs. shared — private pools are worth the premium in summer</li>
  <li><strong>Sea view:</strong> Dramatically increases price but worth it for the sunset</li>
  <li><strong>BBQ:</strong> Essential for the Greek villa experience — evening grilling is a ritual</li>
  <li><strong>Distance to beach:</strong> Many villas are 1-5 km inland — you'll need a car</li>
  <li><strong>WiFi quality:</strong> Ask before booking; rural Sithonia can be patchy</li>
  <li><strong>A/C in all rooms:</strong> Non-negotiable for July-August</li>
</ul>

<h2>Booking Tips</h2>
<ul>
  <li>Book by <strong>March</strong> for summer — the best villas sell out fast</li>
  <li>Check Airbnb, Booking.com, VRBO, and local agencies for comparison</li>
  <li>Ask for recent photos and read recent reviews carefully</li>
  <li>Confirm cleaning fees, key handover process, and cancellation policy</li>
  <li>Self-catering tip: large supermarkets in Kassandreia, Nikiti, and Neos Marmaras stock everything</li>
</ul>`,

      de: `<h2>Warum eine Villa statt Hotel?</h2>
<ul>
  <li><strong>Platz:</strong> Perfekt für Familien — separate Schlafzimmer, Küche, Garten</li>
  <li><strong>Privatsphäre:</strong> Eigener Pool, BBQ, keine Fremden</li>
  <li><strong>Preis-Leistung:</strong> Selbst kochen, Kosten teilen — oft günstiger als 2+ Hotelzimmer</li>
</ul>

<h2>Beste Gebiete</h2>
<table>
  <tr><th>Gebiet</th><th>Charakter</th><th>Ideal für</th></tr>
  <tr><td>Sithonia</td><td>Ruhig, naturnah, abgelegen</td><td>Paare, Erholung</td></tr>
  <tr><td>Kassandra</td><td>Lebendig, gute Infrastruktur</td><td>Familien, junge Gruppen</td></tr>
  <tr><td>Ouranoupoli</td><td>Malerisch, nahe Athos</td><td>Kulturinteressierte</td></tr>
</table>

<h2>Preise</h2>
<ul>
  <li><strong>2 Schlafzimmer ohne Pool:</strong> 80-100 €/Nacht</li>
  <li><strong>2 Schlafzimmer mit Pool:</strong> 120-150 €/Nacht</li>
  <li><strong>4 Schlafzimmer Luxus:</strong> 150-300 €/Nacht</li>
  <li><strong>Hauptsaison (Juli-August):</strong> +30-50 %</li>
</ul>

<h2>Worauf achten</h2>
<ul>
  <li>Pool (privat vs. geteilt)</li>
  <li>Meerblick, BBQ, Entfernung zum Strand</li>
  <li>WiFi-Qualität, Klimaanlage in allen Zimmern</li>
</ul>

<h2>Buchungstipps</h2>
<p>Bis <strong>März</strong> buchen für den Sommer. Airbnb, Booking.com, VRBO und lokale Agenturen vergleichen. Aktuelle Fotos und Bewertungen prüfen.</p>`,

      bg: `<h2>Защо вила вместо хотел?</h2>
<ul>
  <li><strong>Пространство:</strong> Идеално за семейства — отделни спални, кухня, двор</li>
  <li><strong>Уединение:</strong> Собствен басейн, барбекю, без непознати</li>
  <li><strong>Стойност:</strong> Готвите сами, делите разходите</li>
</ul>

<h2>Най-добри райони</h2>
<table>
  <tr><th>Район</th><th>Характер</th><th>Подходящ за</th></tr>
  <tr><td>Ситония</td><td>Тих, природа, уединение</td><td>Двойки, релакс</td></tr>
  <tr><td>Касандра</td><td>Оживен, услуги, нощен живот</td><td>Семейства, млади</td></tr>
  <tr><td>Уранополи</td><td>Живописен, близо до Атос</td><td>Културен туризъм</td></tr>
</table>

<h2>Цени</h2>
<ul>
  <li><strong>2 спални без басейн:</strong> €80-100/нощ</li>
  <li><strong>2 спални с басейн:</strong> €120-150/нощ</li>
  <li><strong>4 спални лукс:</strong> €150-300/нощ</li>
  <li><strong>Пик сезон (юли-август):</strong> +30-50%</li>
</ul>

<h2>Съвети</h2>
<p>Резервирайте до <strong>март</strong> за лятото. Проверете Airbnb, Booking.com и местни агенции. Питайте за WiFi и климатик.</p>`,

      ru: `<h2>Почему вилла, а не отель?</h2>
<ul>
  <li><strong>Пространство:</strong> Идеально для семей и компаний — отдельные спальни, кухня, сад</li>
  <li><strong>Приватность:</strong> Свой бассейн, барбекю, никаких посторонних</li>
  <li><strong>Экономия:</strong> Готовите сами, делите расходы — часто дешевле 2+ номеров в отеле</li>
</ul>

<h2>Лучшие районы</h2>
<table>
  <tr><th>Район</th><th>Характер</th><th>Для кого</th></tr>
  <tr><td>Ситония</td><td>Тихая, природа, уединение</td><td>Пары, отдых</td></tr>
  <tr><td>Кассандра</td><td>Живая, инфраструктура, ночная жизнь</td><td>Семьи, молодёжь</td></tr>
  <tr><td>Уранополис</td><td>Живописный, рядом с Афоном</td><td>Культурный туризм</td></tr>
</table>

<h2>Цены</h2>
<ul>
  <li><strong>2 спальни без бассейна:</strong> €80-100/ночь</li>
  <li><strong>2 спальни с бассейном:</strong> €120-150/ночь</li>
  <li><strong>4 спальни люкс:</strong> €150-300/ночь</li>
  <li><strong>Пик (июль-август):</strong> +30-50%</li>
</ul>

<h2>Советы по бронированию</h2>
<p>Бронируйте до <strong>марта</strong> на лето. Сравнивайте Airbnb, Booking.com, VRBO и местные агентства. Спрашивайте о WiFi и кондиционерах.</p>`,

      ro: `<h2>De ce vilă în loc de hotel?</h2>
<ul>
  <li><strong>Spațiu:</strong> Perfect pentru familii — dormitoare separate, bucătărie, grădină</li>
  <li><strong>Intimitate:</strong> Piscină proprie, grătar, fără străini</li>
  <li><strong>Valoare:</strong> Gătești acasă, împarți costurile</li>
</ul>

<h2>Cele mai bune zone</h2>
<table>
  <tr><th>Zonă</th><th>Caracter</th><th>Potrivit pentru</th></tr>
  <tr><td>Sithonia</td><td>Liniștită, natură, izolare</td><td>Cupluri, relaxare</td></tr>
  <tr><td>Kassandra</td><td>Animată, servicii, viață de noapte</td><td>Familii, tineri</td></tr>
  <tr><td>Ouranoupoli</td><td>Pitorească, lângă Athos</td><td>Turism cultural</td></tr>
</table>

<h2>Prețuri</h2>
<ul>
  <li><strong>2 dormitoare fără piscină:</strong> €80-100/noapte</li>
  <li><strong>2 dormitoare cu piscină:</strong> €120-150/noapte</li>
  <li><strong>4 dormitoare lux:</strong> €150-300/noapte</li>
  <li><strong>Sezon de vârf (iulie-august):</strong> +30-50%</li>
</ul>

<h2>Sfaturi de rezervare</h2>
<p>Rezervă până în <strong>martie</strong> pentru vară. Compară Airbnb, Booking.com și agenții locale.</p>`,

      sr: `<h2>Zašto vila umesto hotela?</h2>
<ul>
  <li><strong>Prostor:</strong> Savršeno za porodice — odvojene spavaće sobe, kuhinja, dvorište</li>
  <li><strong>Privatnost:</strong> Sopstveni bazen, roštilj, bez stranaca</li>
  <li><strong>Vrednost:</strong> Kuvate sami, delite troškove</li>
</ul>

<h2>Najbolja područja</h2>
<table>
  <tr><th>Područje</th><th>Karakter</th><th>Za koga</th></tr>
  <tr><td>Sitonija</td><td>Mirna, priroda, izolacija</td><td>Parove, opuštanje</td></tr>
  <tr><td>Kasandra</td><td>Živahna, usluge, noćni život</td><td>Porodice, mlade</td></tr>
  <tr><td>Uranopoli</td><td>Slikovit, blizu Atosa</td><td>Kulturni turizam</td></tr>
</table>

<h2>Cene</h2>
<ul>
  <li><strong>2 spavaće bez bazena:</strong> €80-100/noć</li>
  <li><strong>2 spavaće sa bazenom:</strong> €120-150/noć</li>
  <li><strong>4 spavaće lux:</strong> €150-300/noć</li>
  <li><strong>Vrhunac sezone (jul-avg):</strong> +30-50%</li>
</ul>

<h2>Saveti za rezervaciju</h2>
<p>Rezervišite do <strong>marta</strong> za leto. Uporedite Airbnb, Booking.com i lokalne agencije.</p>`,
    },
  },
  // ─── 7. MAY ───
  {
    slug: 'may',
    icon: 'Flower2',
    color: 'pink',
    title: {
      el: 'Χαλκιδική τον Μάιο',
      en: 'Halkidiki in May',
      de: 'Chalkidiki im Mai',
      bg: 'Халкидики през май',
      ru: 'Халкидики в мае',
      ro: 'Halkidiki în mai',
      sr: 'Halkidiki u maju',
    },
    description: {
      el: '20-26°C, αγριολούλουδα, χαμηλές τιμές, λίγοι τουρίστες, ιδανικό για πεζοπορία.',
      en: '20-26°C, wildflowers, low prices, few tourists, ideal for hiking and cycling.',
      de: '20-26°C, Wildblumen, niedrige Preise, wenige Touristen, ideal zum Wandern.',
      bg: '20-26°C, диви цветя, ниски цени, малко туристи, идеално за пешеходен туризъм.',
      ru: '20-26°C, полевые цветы, низкие цены, мало туристов, идеально для пеших прогулок.',
      ro: '20-26°C, flori sălbatice, prețuri mici, puțini turiști, ideal pentru drumeții.',
      sr: '20-26°C, divlje cveće, niske cene, malo turista, idealno za pešačenje.',
    },
    metaTitle: {
      el: 'Χαλκιδική Μάιος | Καιρός, Παραλίες & Τιμές',
      en: 'Halkidiki in May | Weather, Beaches & Prices Guide',
      de: 'Chalkidiki im Mai | Wetter, Strände & Preise',
      bg: 'Халкидики през май | Време, плажове и цени',
      ru: 'Халкидики в мае | Погода, пляжи и цены',
      ro: 'Halkidiki în mai | Vreme, plaje și prețuri',
      sr: 'Halkidiki u maju | Vreme, plaže i cene',
    },
    metaDesc: {
      el: 'Μάιος στη Χαλκιδική: καιρός 20-26°C, θάλασσα 18-20°C, τιμές -30-40%, αγριολούλουδα, πεζοπορία. Τι να περιμένετε.',
      en: 'May in Halkidiki: weather 20-26°C, sea 18-20°C, prices 30-40% below peak, wildflowers, hiking. What to expect.',
      de: 'Mai in Chalkidiki: Wetter 20-26°C, Meer 18-20°C, Preise 30-40% unter Hauptsaison, Wildblumen.',
      bg: 'Май в Халкидики: 20-26°C, море 18-20°C, цени -30-40%, диви цветя, пешеходен туризъм.',
      ru: 'Май в Халкидики: погода 20-26°C, море 18-20°C, цены на 30-40% ниже пика, полевые цветы.',
      ro: 'Mai în Halkidiki: vreme 20-26°C, mare 18-20°C, prețuri -30-40%, flori sălbatice.',
      sr: 'Maj u Halkidikiju: vreme 20-26°C, more 18-20°C, cene -30-40%, divlje cveće.',
    },
    content: {
      el: `<h2>Καιρός</h2>
<p>Ο Μάιος φέρνει <strong>ζεστές, ηλιόλουστες μέρες</strong> χωρίς τον καύσωνα του καλοκαιριού. Θερμοκρασία αέρα: <strong>20-26°C</strong>, θάλασσα: <strong>18-20°C</strong> (κολυμπήσιμη για τους τολμηρούς — ζεσταίνει στα τέλη Μαΐου).</p>
<ul>
  <li>Ηλιοφάνεια: 9-10 ώρες/ημέρα</li>
  <li>Βροχή: 3-5 ημέρες τον μήνα (σύντομες μπόρες)</li>
  <li>Ιδανικό για outdoor δραστηριότητες</li>
</ul>

<h2>Γιατί Μάιο;</h2>
<ul>
  <li><strong>Τιμές 30-40% κάτω</strong> από Ιούλιο-Αύγουστο</li>
  <li><strong>Ελάχιστοι τουρίστες</strong> — παραλίες σχεδόν άδειες</li>
  <li><strong>Αγριολούλουδα:</strong> Παπαρούνες, μαργαρίτες, θυμάρι ανθισμένο — φανταστικό τοπίο</li>
  <li><strong>Πεζοπορία & Ποδηλασία:</strong> Ιδανικές θερμοκρασίες</li>
  <li><strong>Ορθόδοξο Πάσχα:</strong> Μερικές χρονιές πέφτει τον Μάιο — μοναδική εμπειρία</li>
</ul>

<h2>Τι να Προσέξετε</h2>
<ul>
  <li>Δεν λειτουργούν όλα τα beach bars ακόμα (ανοίγουν σταδιακά)</li>
  <li>Κάποια εστιατόρια/ξενοδοχεία ανοίγουν μέσα-τέλη Μαΐου</li>
  <li>Φέρτε ελαφρύ μπουφάν για τα βράδια</li>
</ul>`,

      en: `<h2>Weather</h2>
<p>May brings <strong>warm, sunny days</strong> without the summer heat. Air temperature: <strong>20-26°C</strong>, sea: <strong>18-20°C</strong> (swimmable for the brave — it warms up significantly by late May).</p>
<ul>
  <li>Sunshine: 9-10 hours/day</li>
  <li>Rain: 3-5 days per month (brief afternoon showers)</li>
  <li>Perfect temperature for outdoor activities</li>
</ul>

<h2>Why Visit in May?</h2>
<ul>
  <li><strong>Prices 30-40% lower</strong> than July-August peak season</li>
  <li><strong>Very few tourists</strong> — beaches are nearly empty, no reservation needed anywhere</li>
  <li><strong>Wildflowers in bloom:</strong> Poppies, daisies, wild thyme — the landscape is spectacular</li>
  <li><strong>Hiking & cycling:</strong> Ideal temperatures for the trails around Sithonia and the mountain villages</li>
  <li><strong>Orthodox Easter:</strong> Some years it falls in May — an unforgettable cultural experience with midnight church services, fireworks, and spit-roasted lamb</li>
</ul>

<h2>What to Be Aware Of</h2>
<ul>
  <li>Not all beach bars are open yet — they open gradually through May</li>
  <li>Some restaurants and hotels open mid-to-late May</li>
  <li>Bring a light jacket for evenings (15-18°C after dark)</li>
  <li>Water sports operators may not be running until late May</li>
  <li>Car rental is still essential — buses run less frequently than summer</li>
</ul>

<h2>Best Activities for May</h2>
<ul>
  <li>Hiking the coastal trails of Sithonia</li>
  <li>Visiting the mountain village of Arnea (wildflower meadows)</li>
  <li>Wine tasting at Porto Carras (open year-round)</li>
  <li>Mount Athos cruise (boats run daily from mid-May)</li>
  <li>Photography — the light and landscapes are at their peak</li>
</ul>`,

      de: `<h2>Wetter</h2>
<p>Mai bringt <strong>warme, sonnige Tage</strong> ohne Sommerhitze. Lufttemperatur: <strong>20-26°C</strong>, Meer: <strong>18-20°C</strong> (schwimmbar für Mutige — wird Ende Mai deutlich wärmer).</p>
<ul>
  <li>Sonnenschein: 9-10 Stunden/Tag</li>
  <li>Regen: 3-5 Tage/Monat (kurze Schauer)</li>
</ul>

<h2>Warum im Mai?</h2>
<ul>
  <li><strong>Preise 30-40 % niedriger</strong> als Juli-August</li>
  <li><strong>Kaum Touristen</strong> — fast leere Strände</li>
  <li><strong>Wildblumen:</strong> Mohn, Gänseblümchen, blühender Thymian</li>
  <li><strong>Wandern & Radfahren:</strong> Ideale Temperaturen</li>
  <li><strong>Orthodoxes Ostern:</strong> Fällt manchmal in den Mai</li>
</ul>

<h2>Was beachten</h2>
<ul>
  <li>Nicht alle Beach Bars offen (öffnen schrittweise)</li>
  <li>Leichte Jacke für Abende mitbringen</li>
  <li>Mietwagen wichtig — Busse fahren seltener</li>
</ul>`,

      bg: `<h2>Време</h2>
<p>Май носи <strong>топли, слънчеви дни</strong> без лятната жега. Въздух: <strong>20-26°C</strong>, море: <strong>18-20°C</strong> (за смелчаци — затопля се значително в края на май).</p>

<h2>Защо май?</h2>
<ul>
  <li><strong>Цени 30-40% по-ниски</strong> от юли-август</li>
  <li><strong>Много малко туристи</strong> — плажовете са почти празни</li>
  <li><strong>Диви цветя:</strong> Макове, маргаритки, мащерка в цвят</li>
  <li><strong>Пешеходен туризъм и колоездене:</strong> Идеални температури</li>
  <li><strong>Православен Великден:</strong> Понякога пада през май</li>
</ul>

<h2>Какво да имате предвид</h2>
<ul>
  <li>Не всички бийч барове са отворени</li>
  <li>Вземете леко яке за вечерите</li>
  <li>Кола под наем е необходима</li>
</ul>`,

      ru: `<h2>Погода</h2>
<p>Май приносит <strong>тёплые, солнечные дни</strong> без летней жары. Воздух: <strong>20-26°C</strong>, море: <strong>18-20°C</strong> (купаться можно ближе к концу мая).</p>

<h2>Почему май?</h2>
<ul>
  <li><strong>Цены на 30-40% ниже</strong> пикового сезона</li>
  <li><strong>Минимум туристов</strong> — пляжи почти пустые</li>
  <li><strong>Полевые цветы:</strong> Маки, ромашки, цветущий тимьян — потрясающие пейзажи</li>
  <li><strong>Пешие прогулки:</strong> Идеальная температура для троп Ситонии и горных деревень</li>
  <li><strong>Православная Пасха:</strong> Иногда приходится на май — незабываемые впечатления</li>
</ul>

<h2>На что обратить внимание</h2>
<ul>
  <li>Не все бич-бары открыты (открываются постепенно)</li>
  <li>Возьмите лёгкую куртку на вечер (15-18°C после заката)</li>
  <li>Арендуйте авто — автобусы ходят реже</li>
</ul>`,

      ro: `<h2>Vremea</h2>
<p>Mai aduce <strong>zile calde și însorite</strong> fără căldura verii. Temperatură: <strong>20-26°C</strong>, mare: <strong>18-20°C</strong> (pentru curajosi — se încălzește la sfârșitul lui mai).</p>

<h2>De ce în mai?</h2>
<ul>
  <li><strong>Prețuri cu 30-40% mai mici</strong> decât iulie-august</li>
  <li><strong>Foarte puțini turiști</strong> — plaje aproape goale</li>
  <li><strong>Flori sălbatice:</strong> Maci, margarete, cimbru înflorit</li>
  <li><strong>Drumeții și ciclism:</strong> Temperaturi ideale</li>
  <li><strong>Paștele ortodox:</strong> Uneori cade în mai</li>
</ul>

<h2>Ce să ai în vedere</h2>
<ul>
  <li>Nu toate beach barurile sunt deschise</li>
  <li>Adu o jachetă ușoară pentru seri</li>
  <li>Mașina este esențială</li>
</ul>`,

      sr: `<h2>Vreme</h2>
<p>Maj donosi <strong>tople, sunčane dane</strong> bez letnje vreline. Temperatura: <strong>20-26°C</strong>, more: <strong>18-20°C</strong> (za hrabre — zagreva se krajem maja).</p>

<h2>Zašto maj?</h2>
<ul>
  <li><strong>Cene 30-40% niže</strong> od jula-avgusta</li>
  <li><strong>Vrlo malo turista</strong> — plaže skoro prazne</li>
  <li><strong>Divlje cveće:</strong> Mak, tratinčice, cvetajući timijan</li>
  <li><strong>Pešačenje i biciklizam:</strong> Idealne temperature</li>
  <li><strong>Pravoslavni Uskrs:</strong> Ponekad pada u maju</li>
</ul>

<h2>Na šta obratiti pažnju</h2>
<ul>
  <li>Nisu svi bič barovi otvoreni</li>
  <li>Ponesite laganu jaknu za večeri</li>
  <li>Rent-a-car je neophodan</li>
</ul>`,
    },
  },
  // ─── 8. OCTOBER ───
  {
    slug: 'october',
    icon: 'Leaf',
    color: 'orange',
    title: {
      el: 'Χαλκιδική τον Οκτώβριο',
      en: 'Halkidiki in October',
      de: 'Chalkidiki im Oktober',
      bg: 'Халкидики през октомври',
      ru: 'Халкидики в октябре',
      ro: 'Halkidiki în octombrie',
      sr: 'Halkidiki u oktobru',
    },
    description: {
      el: '20-24°C, θάλασσα 21-23°C, ελαιοσυγκομιδή, εξαιρετική αξία, άδειες παραλίες.',
      en: '20-24°C, sea 21-23°C (warmer than June!), olive harvest, great value, empty beaches.',
      de: '20-24°C, Meer 21-23°C, Olivenernte, hervorragendes Preis-Leistungs-Verhältnis.',
      bg: '20-24°C, море 21-23°C, бране на маслини, отлична стойност, празни плажове.',
      ru: '20-24°C, море 21-23°C (теплее чем в июне!), сбор оливок, отличные цены.',
      ro: '20-24°C, mare 21-23°C, culesul măslinelor, valoare excelentă, plaje goale.',
      sr: '20-24°C, more 21-23°C, berba maslina, odlična vrednost, prazne plaže.',
    },
    metaTitle: {
      el: 'Χαλκιδική Οκτώβριος | Καιρός, Δραστηριότητες & Τιμές',
      en: 'Halkidiki in October | Weather, Activities & Value Guide',
      de: 'Chalkidiki im Oktober | Wetter, Aktivitäten & Preise',
      bg: 'Халкидики октомври | Време, активности и цени',
      ru: 'Халкидики в октябре | Погода, активности и цены',
      ro: 'Halkidiki octombrie | Vreme, activități și prețuri',
      sr: 'Halkidiki oktobar | Vreme, aktivnosti i cene',
    },
    metaDesc: {
      el: 'Οκτώβριος στη Χαλκιδική: 20-24°C, θάλασσα 21-23°C, ελαιοσυγκομιδή, 40-50% κάτω τιμές, πεζοπορία, τρύγος.',
      en: 'October in Halkidiki: 20-24°C, sea 21-23°C, olive harvest, prices 40-50% below peak, hiking, grape harvest.',
      de: 'Oktober in Chalkidiki: 20-24°C, Meer 21-23°C, Olivenernte, 40-50% günstigere Preise.',
      bg: 'Октомври в Халкидики: 20-24°C, море 21-23°C, бране на маслини, 40-50% по-ниски цени.',
      ru: 'Октябрь в Халкидики: 20-24°C, море 21-23°C, сбор оливок, цены на 40-50% ниже пика.',
      ro: 'Octombrie în Halkidiki: 20-24°C, mare 21-23°C, culesul măslinelor, prețuri -40-50%.',
      sr: 'Oktobar u Halkidikiju: 20-24°C, more 21-23°C, berba maslina, cene -40-50%.',
    },
    content: {
      el: `<h2>Καιρός</h2>
<p>Ο Οκτώβριος είναι <strong>ένα κρυμμένο μυστικό</strong>. Θερμοκρασία αέρα: <strong>20-24°C</strong>, θάλασσα: <strong>21-23°C</strong> — πιο ζεστή από τον Ιούνιο! Η θάλασσα έχει αποθηκεύσει τη ζέστη του καλοκαιριού.</p>

<h2>Γιατί Οκτώβριο;</h2>
<ul>
  <li><strong>Τιμές 40-50% κάτω</strong> — τα καλύτερα deals της χρονιάς</li>
  <li><strong>Ζεστή θάλασσα</strong> — κολύμπι μέχρι μέσα Οκτωβρίου σίγουρα</li>
  <li><strong>Ελαιοσυγκομιδή:</strong> Δείτε τα ελαιοτριβεία σε λειτουργία</li>
  <li><strong>Τρύγος σταφυλιών:</strong> Επισκεφθείτε οινοποιεία κατά τη συγκομιδή</li>
  <li><strong>Πεζοπορία:</strong> Ιδανικές θερμοκρασίες, φθινοπωρινά χρώματα</li>
  <li><strong>Άδειες παραλίες:</strong> Απολαύστε χωρίς συνωστισμό</li>
</ul>

<h2>Τι Κλείνει;</h2>
<ul>
  <li>Τα περισσότερα beach bars κλείνουν μέσα Οκτωβρίου</li>
  <li>Κάποια ξενοδοχεία/εστιατόρια κλείνουν μετά τις 15 Οκτωβρίου</li>
  <li><strong>Κασσάνδρα</strong> μένει ανοιχτή περισσότερο από Σιθωνία</li>
  <li>Ουρανούπολη: Κρουαζιέρες Άθως λειτουργούν μέχρι τέλη Οκτωβρίου</li>
</ul>`,

      en: `<h2>Weather</h2>
<p>October is <strong>Halkidiki's hidden gem</strong>. Air temperature: <strong>20-24°C</strong>, sea: <strong>21-23°C</strong> — remarkably, warmer than June! The sea has stored the summer's heat, creating ideal swimming conditions.</p>
<ul>
  <li>Sunshine: 7-8 hours/day</li>
  <li>Rain: 5-7 days (autumn showers, usually brief)</li>
  <li>Evenings: 15-18°C — pleasant for outdoor dining</li>
</ul>

<h2>Why Visit in October?</h2>
<ul>
  <li><strong>Prices 40-50% below peak</strong> — the best deals of the year on accommodation</li>
  <li><strong>Warm sea:</strong> Comfortable swimming until mid-October, possible until late October</li>
  <li><strong>Olive harvest season:</strong> Watch olive mills in full operation, join a harvest experience</li>
  <li><strong>Grape harvest:</strong> Visit wineries during the crush — Porto Carras and Tsantali welcome visitors</li>
  <li><strong>Hiking:</strong> Perfect temperatures and beautiful autumn colours in the mountain villages</li>
  <li><strong>Empty beaches:</strong> Enjoy Halkidiki's best beaches with barely another soul in sight</li>
</ul>

<h2>What Closes and What Stays Open?</h2>
<ul>
  <li>Most beach bars close by mid-October</li>
  <li>Some hotels and restaurants close after October 15</li>
  <li><strong>Kassandra</strong> stays open longest — more year-round businesses</li>
  <li><strong>Sithonia:</strong> Many places close early-to-mid October, but Nikiti and Neos Marmaras keep going</li>
  <li><strong>Ouranoupoli:</strong> Mount Athos cruises run until late October</li>
  <li><strong>Ammouliani:</strong> Ferry runs year-round but reduced schedule</li>
</ul>

<h2>October Tips</h2>
<ul>
  <li>Book accommodation that's confirmed open — call ahead</li>
  <li>Bring layers — mornings and evenings are cooler</li>
  <li>Rent a car — bus service reduces significantly after September</li>
  <li>Try fresh-pressed olive oil at local mills — it's the freshest you'll ever taste</li>
</ul>`,

      de: `<h2>Wetter</h2>
<p>Oktober ist <strong>Chalkidikis Geheimtipp</strong>. Luft: <strong>20-24°C</strong>, Meer: <strong>21-23°C</strong> — erstaunlicherweise wärmer als im Juni!</p>

<h2>Warum im Oktober?</h2>
<ul>
  <li><strong>Preise 40-50 % unter Hauptsaison</strong></li>
  <li><strong>Warmes Meer:</strong> Baden bis Mitte Oktober möglich</li>
  <li><strong>Olivenernte:</strong> Olivenmühlen in Betrieb erleben</li>
  <li><strong>Weinlese:</strong> Weingüter während der Ernte besuchen</li>
  <li><strong>Wandern:</strong> Perfekte Temperaturen, Herbstfarben</li>
  <li><strong>Leere Strände:</strong> Kaum andere Besucher</li>
</ul>

<h2>Was schließt?</h2>
<ul>
  <li>Die meisten Beach Bars schließen Mitte Oktober</li>
  <li>Kassandra bleibt am längsten offen</li>
  <li>Athos-Kreuzfahrten bis Ende Oktober</li>
</ul>`,

      bg: `<h2>Време</h2>
<p>Октомври е <strong>скритото съкровище на Халкидики</strong>. Въздух: <strong>20-24°C</strong>, море: <strong>21-23°C</strong> — по-топло от юни!</p>

<h2>Защо октомври?</h2>
<ul>
  <li><strong>Цени 40-50% по-ниски</strong></li>
  <li><strong>Топло море:</strong> Плуване до средата на октомври</li>
  <li><strong>Бране на маслини:</strong> Посетете работеща маслинова мелница</li>
  <li><strong>Гроздобер:</strong> Посетете винарни по време на реколтата</li>
  <li><strong>Празни плажове:</strong> Насладете се без тълпи</li>
</ul>

<h2>Какво затваря?</h2>
<ul>
  <li>Повечето бийч барове затварят в средата на октомври</li>
  <li>Касандра остава отворена най-дълго</li>
  <li>Круизи до Атос работят до края на октомври</li>
</ul>`,

      ru: `<h2>Погода</h2>
<p>Октябрь — <strong>скрытая жемчужина Халкидики</strong>. Воздух: <strong>20-24°C</strong>, море: <strong>21-23°C</strong> — удивительно, теплее чем в июне!</p>

<h2>Почему октябрь?</h2>
<ul>
  <li><strong>Цены на 40-50% ниже</strong> пикового сезона</li>
  <li><strong>Тёплое море:</strong> Купание до середины октября</li>
  <li><strong>Сбор оливок:</strong> Посмотрите маслодавильни в работе</li>
  <li><strong>Виноградный сбор:</strong> Посетите винодельни во время урожая</li>
  <li><strong>Пешие прогулки:</strong> Идеальная температура, осенние краски</li>
  <li><strong>Пустые пляжи:</strong> Наслаждайтесь без толп</li>
</ul>

<h2>Что закрывается?</h2>
<ul>
  <li>Большинство бич-баров закрывается к середине октября</li>
  <li>Кассандра работает дольше всех</li>
  <li>Круизы к Афону — до конца октября</li>
</ul>`,

      ro: `<h2>Vremea</h2>
<p>Octombrie este <strong>bijuteria ascunsă a Halkidiki</strong>. Aer: <strong>20-24°C</strong>, mare: <strong>21-23°C</strong> — mai cald decât în iunie!</p>

<h2>De ce în octombrie?</h2>
<ul>
  <li><strong>Prețuri cu 40-50% mai mici</strong></li>
  <li><strong>Mare caldă:</strong> Înot până la mijlocul lui octombrie</li>
  <li><strong>Culesul măslinelor:</strong> Vizitează o moară de măsline în funcțiune</li>
  <li><strong>Recolta de struguri:</strong> Vizitează cramele în timpul recoltei</li>
  <li><strong>Plaje goale:</strong> Bucură-te fără aglomerație</li>
</ul>

<h2>Ce se închide?</h2>
<ul>
  <li>Majoritatea beach barurilor se închid la mijlocul lui octombrie</li>
  <li>Kassandra rămâne deschisă cel mai mult</li>
  <li>Croaziere Athos până la sfârșitul lui octombrie</li>
</ul>`,

      sr: `<h2>Vreme</h2>
<p>Oktobar je <strong>skriveni dragulj Halkidikija</strong>. Vazduh: <strong>20-24°C</strong>, more: <strong>21-23°C</strong> — toplije nego u junu!</p>

<h2>Zašto oktobar?</h2>
<ul>
  <li><strong>Cene 40-50% niže</strong> od vrhunca sezone</li>
  <li><strong>Toplo more:</strong> Kupanje do sredine oktobra</li>
  <li><strong>Berba maslina:</strong> Posetite uljaru u radu</li>
  <li><strong>Berba grožđa:</strong> Posetite vinarije tokom berbe</li>
  <li><strong>Prazne plaže:</strong> Uživajte bez gužve</li>
</ul>

<h2>Šta se zatvara?</h2>
<ul>
  <li>Većina bič barova zatvara sredinom oktobra</li>
  <li>Kasandra ostaje otvorena najduže</li>
  <li>Atos krstarenja rade do kraja oktobra</li>
</ul>`,
    },
  },
  // ─── 9. BOAT TOURS ───
  {
    slug: 'boat-tours',
    icon: 'Ship',
    color: 'blue',
    title: {
      el: 'Βαρκάδες & Κρουαζιέρες Χαλκιδικής',
      en: 'Halkidiki Boat Tours & Cruises',
      de: 'Bootstouren & Kreuzfahrten in Chalkidiki',
      bg: 'Морски разходки и круизи в Халкидики',
      ru: 'Морские прогулки и круизы Халкидики',
      ro: 'Excursii cu barca și croaziere în Halkidiki',
      sr: 'Izleti brodom i krstarenja u Halkidikiju',
    },
    description: {
      el: 'Κρουαζιέρα Άθως, Δρένια, Blue Lagoon, ενοικίαση σκάφους, ηλιοβασίλεμα, ψάρεμα.',
      en: 'Mount Athos cruise, Drenia islands, Blue Lagoon, boat rental, sunset cruises, fishing trips.',
      de: 'Athos-Kreuzfahrt, Drenia-Inseln, Blaue Lagune, Bootsverleih, Angeltouren.',
      bg: 'Круиз Атос, острови Дрения, Синя лагуна, наем на лодка, залези, риболов.',
      ru: 'Круиз к Афону, острова Дрения, Голубая лагуна, аренда лодки, закат, рыбалка.',
      ro: 'Croazieră Athos, insulele Drenia, Laguna Albastră, închiriere barcă, apusuri, pescuit.',
      sr: 'Atos krstarenje, ostrva Drenija, Plava laguna, iznajmljivanje čamca, zalasci, ribolov.',
    },
    metaTitle: {
      el: 'Βαρκάδες Χαλκιδική | Άθως, Δρένια, Blue Lagoon',
      en: 'Halkidiki Boat Tours | Athos Cruise, Drenia, Blue Lagoon',
      de: 'Bootstouren Chalkidiki | Athos, Drenia, Blaue Lagune',
      bg: 'Морски разходки Халкидики | Атос, Дрения, Синя лагуна',
      ru: 'Морские прогулки Халкидики | Афон, Дрения, Голубая лагуна',
      ro: 'Excursii cu barca Halkidiki | Athos, Drenia, Laguna Albastră',
      sr: 'Izleti brodom Halkidiki | Atos, Drenija, Plava laguna',
    },
    metaDesc: {
      el: 'Όλες οι βαρκάδες στη Χαλκιδική: κρουαζιέρα Άθως (€20-30), Δρένια, Blue Lagoon Βουρβουρού, ενοικίαση σκάφους, ψάρεμα.',
      en: 'All Halkidiki boat tours: Mount Athos cruise (€20-30), Drenia islands, Blue Lagoon from Vourvourou, private boat rental (€200-400/day), fishing.',
      de: 'Alle Bootstouren in Chalkidiki: Athos-Kreuzfahrt (20-30 €), Drenia, Blaue Lagune, Bootsverleih (200-400 €/Tag).',
      bg: 'Всички морски разходки в Халкидики: круиз Атос (€20-30), Дрения, Синя лагуна, наем на лодка (€200-400/ден).',
      ru: 'Все морские прогулки Халкидики: круиз к Афону (€20-30), Дрения, Голубая лагуна, аренда лодки (€200-400/день).',
      ro: 'Toate excursiile cu barca Halkidiki: croazieră Athos (€20-30), Drenia, Laguna Albastră, închiriere barcă (€200-400/zi).',
      sr: 'Svi izleti brodom Halkidiki: Atos krstarenje (€20-30), Drenija, Plava laguna, iznajmljivanje čamca (€200-400/dan).',
    },
    content: {
      el: `<h2>Κρουαζιέρα Αγίου Όρους</h2>
<p>Η πιο δημοφιλής βαρκάδα στη Χαλκιδική. Αναχώρηση από <strong>Ουρανούπολη</strong>, 3 ώρες κατά μήκος της δυτικής ακτής του Αγίου Όρους.</p>
<ul>
  <li><strong>Κόστος:</strong> €20-30/άτομο</li>
  <li><strong>Διάρκεια:</strong> 3 ώρες</li>
  <li><strong>Τι βλέπετε:</strong> Μοναστήρια από τη θάλασσα (Δοχειαρίου, Ξενοφώντος, Αγίου Παντελεήμονος), βράχοι, δάση</li>
  <li><strong>Περίοδος:</strong> Μάιος-Οκτώβριος, καθημερινά</li>
  <li><strong>Κράτηση:</strong> Στο λιμάνι Ουρανούπολης, ένα βράδυ πριν</li>
</ul>

<h2>Δρένια & Αμμουλιανή</h2>
<p>Βαρκάδες στα ακατοίκητα νησάκια <strong>Δρένια</strong> από Ουρανούπολη ή Αμμουλιανή. Εξωτικά τιρκουάζ νερά, κολύμπι, σνόρκελ.</p>
<ul>
  <li>Από Ουρανούπολη: €15-25, 4-5 ώρες</li>
  <li>Από Αμμουλιανή: €10-15, 2-3 ώρες</li>
</ul>

<h2>Blue Lagoon (Βουρβουρού)</h2>
<p>Μικρά σκάφη σας πάνε στη <strong>Γαλάζια Λίμνη</strong> — ρηχά, κρυστάλλινα νερά ανάμεσα σε νησάκια κοντά στο Βουρβουρού.</p>
<ul>
  <li><strong>Κόστος:</strong> €10-20/άτομο ή €100-150 ενοικίαση σκάφους χωρίς δίπλωμα</li>
  <li><strong>Διάρκεια:</strong> Half-day</li>
</ul>

<h2>Ενοικίαση Ιδιωτικού Σκάφους</h2>
<ul>
  <li><strong>Χωρίς δίπλωμα (30hp):</strong> €100-200/ημέρα</li>
  <li><strong>Με κυβερνήτη:</strong> €200-400/ημέρα</li>
  <li><strong>Yacht:</strong> €500+/ημέρα</li>
</ul>

<h2>Ηλιοβασίλεμα & Ψάρεμα</h2>
<ul>
  <li><strong>Sunset cruise:</strong> Από Νέο Μαρμαρά ή Πόρτο Κουφό, €25-40/άτομο με κρασί</li>
  <li><strong>Ψάρεμα:</strong> Ημερήσιες εκδρομές €40-60/άτομο, μαγειρεύετε το ψάρεμά σας</li>
</ul>`,

      en: `<h2>Mount Athos Cruise</h2>
<p>The most popular boat trip in Halkidiki. Departs from <strong>Ouranoupoli harbour</strong>, sailing 3 hours along the western coast of the Mount Athos peninsula.</p>
<ul>
  <li><strong>Cost:</strong> €20-30 per person</li>
  <li><strong>Duration:</strong> 3 hours</li>
  <li><strong>What you see:</strong> Ancient monasteries from the sea (Dochiariou, Xenophontos, Panteleimonos), dramatic cliffs, dense forests, Mount Athos peak (2,033m)</li>
  <li><strong>Season:</strong> May to October, daily departures</li>
  <li><strong>Booking:</strong> At Ouranoupoli harbour — book the evening before in peak season</li>
  <li><strong>Note:</strong> Women cannot visit Mount Athos on land, but the cruise is open to everyone</li>
</ul>

<h2>Drenia Islands</h2>
<p>Boat trips to the uninhabited <strong>Drenia islets</strong> (also called Donkey Island) — exotic turquoise waters, swimming, and snorkeling.</p>
<ul>
  <li>From Ouranoupoli: €15-25, 4-5 hours with swimming stops</li>
  <li>From Ammouliani: €10-15, 2-3 hours</li>
  <li>No facilities on the islands — bring water, snacks, sunscreen</li>
</ul>

<h2>Blue Lagoon (Vourvourou)</h2>
<p>Small boats take you to the <strong>Blue Lagoon</strong> — shallow, crystal-clear water between tiny islets near Vourvourou. One of Halkidiki's most photographed spots.</p>
<ul>
  <li><strong>Cost:</strong> €10-20/person on a group boat, or €100-150 for a no-licence boat rental</li>
  <li><strong>Duration:</strong> Half-day</li>
  <li><strong>Tip:</strong> Go early morning to avoid crowds in July-August</li>
</ul>

<h2>Private Boat Rental</h2>
<table>
  <tr><th>Type</th><th>Price/Day</th><th>Notes</th></tr>
  <tr><td>No-licence boat (up to 30hp)</td><td>€100-200</td><td>No licence needed, easy to drive</td></tr>
  <tr><td>Boat with skipper</td><td>€200-400</td><td>Larger boats, full-day tours</td></tr>
  <tr><td>Sailing yacht with crew</td><td>€500+</td><td>Luxury, multi-day available</td></tr>
</table>

<h2>Sunset Cruises & Fishing Trips</h2>
<ul>
  <li><strong>Sunset cruise:</strong> From Neos Marmaras or Porto Koufo, €25-40/person with wine and snacks</li>
  <li><strong>Fishing trips:</strong> Full-day excursions €40-60/person — catch and cook your own fish on board or at a taverna</li>
</ul>

<h2>What to Bring</h2>
<ul>
  <li>Sunscreen (SPF 50 — reflection off water intensifies UV)</li>
  <li>Hat and sunglasses</li>
  <li>Snorkel gear (available to rent on some tours)</li>
  <li>Light towel and swimwear</li>
  <li>Water and snacks (not all tours include refreshments)</li>
  <li>Motion sickness tablets if prone to seasickness</li>
</ul>`,

      de: `<h2>Athos-Kreuzfahrt</h2>
<p>Die beliebteste Bootstour Chalkidikis. Abfahrt vom <strong>Hafen Ouranoupoli</strong>, 3 Stunden entlang der Westküste des Athos.</p>
<ul>
  <li><strong>Kosten:</strong> 20-30 €/Person</li>
  <li><strong>Dauer:</strong> 3 Stunden</li>
  <li><strong>Was Sie sehen:</strong> Klöster vom Meer, Klippen, Wälder</li>
  <li><strong>Saison:</strong> Mai bis Oktober, täglich</li>
</ul>

<h2>Drenia-Inseln</h2>
<ul>
  <li>Ab Ouranoupoli: 15-25 €, 4-5 Stunden</li>
  <li>Ab Ammouliani: 10-15 €, 2-3 Stunden</li>
</ul>

<h2>Blaue Lagune (Vourvourou)</h2>
<ul>
  <li>10-20 €/Person (Gruppenboot) oder 100-150 € Bootsverleih ohne Schein</li>
  <li>Tipp: Morgens früh fahren im Hochsommer</li>
</ul>

<h2>Privater Bootsverleih</h2>
<table>
  <tr><th>Typ</th><th>Preis/Tag</th></tr>
  <tr><td>Ohne Schein (bis 30 PS)</td><td>100-200 €</td></tr>
  <tr><td>Mit Skipper</td><td>200-400 €</td></tr>
  <tr><td>Segelyacht mit Crew</td><td>500 €+</td></tr>
</table>

<h2>Sonnenuntergang & Angeln</h2>
<ul>
  <li>Sunset-Cruise: 25-40 €/Person mit Wein</li>
  <li>Angeltouren: 40-60 €/Person, Ganztag</li>
</ul>`,

      bg: `<h2>Круиз Атос</h2>
<p>Най-популярната морска разходка. Отплаване от <strong>пристанище Уранополи</strong>, 3 часа покрай западния бряг на Атос.</p>
<ul>
  <li><strong>Цена:</strong> €20-30/човек</li>
  <li><strong>Продължителност:</strong> 3 часа</li>
  <li><strong>Сезон:</strong> май-октомври, ежедневно</li>
</ul>

<h2>Острови Дрения</h2>
<ul>
  <li>От Уранополи: €15-25, 4-5 часа</li>
  <li>От Амулиани: €10-15, 2-3 часа</li>
</ul>

<h2>Синя лагуна (Вурвуру)</h2>
<ul>
  <li>€10-20/човек или €100-150 наем на лодка без книжка</li>
</ul>

<h2>Наем на частна лодка</h2>
<table>
  <tr><th>Тип</th><th>Цена/Ден</th></tr>
  <tr><td>Без книжка (до 30 к.с.)</td><td>€100-200</td></tr>
  <tr><td>Със скипер</td><td>€200-400</td></tr>
  <tr><td>Яхта с екипаж</td><td>€500+</td></tr>
</table>`,

      ru: `<h2>Круиз к Афону</h2>
<p>Самая популярная морская прогулка. Отправление из <strong>порта Уранополиса</strong>, 3 часа вдоль западного побережья Афона.</p>
<ul>
  <li><strong>Стоимость:</strong> €20-30/человек</li>
  <li><strong>Продолжительность:</strong> 3 часа</li>
  <li><strong>Что увидите:</strong> Монастыри с моря, скалы, леса, пик Афон (2033 м)</li>
  <li><strong>Сезон:</strong> май-октябрь, ежедневно</li>
</ul>

<h2>Острова Дрения</h2>
<ul>
  <li>Из Уранополиса: €15-25, 4-5 часов</li>
  <li>Из Аммулиани: €10-15, 2-3 часа</li>
</ul>

<h2>Голубая лагуна (Вурвуру)</h2>
<ul>
  <li>€10-20/человек или €100-150 аренда лодки без прав</li>
</ul>

<h2>Аренда лодки</h2>
<table>
  <tr><th>Тип</th><th>Цена/день</th></tr>
  <tr><td>Без прав (до 30 л.с.)</td><td>€100-200</td></tr>
  <tr><td>С капитаном</td><td>€200-400</td></tr>
  <tr><td>Яхта с экипажем</td><td>€500+</td></tr>
</table>

<h2>Закат и рыбалка</h2>
<ul>
  <li>Закатный круиз: €25-40/человек с вином</li>
  <li>Рыбалка: €40-60/человек, весь день</li>
</ul>`,

      ro: `<h2>Croazieră Athos</h2>
<p>Cea mai populară excursie pe mare. Plecare din <strong>portul Ouranoupoli</strong>, 3 ore de-a lungul coastei vestice a Athosului.</p>
<ul>
  <li><strong>Cost:</strong> €20-30/persoană</li>
  <li><strong>Durată:</strong> 3 ore</li>
  <li><strong>Sezon:</strong> mai-octombrie, zilnic</li>
</ul>

<h2>Insulele Drenia</h2>
<ul>
  <li>Din Ouranoupoli: €15-25, 4-5 ore</li>
  <li>Din Ammouliani: €10-15, 2-3 ore</li>
</ul>

<h2>Laguna Albastră (Vourvourou)</h2>
<ul>
  <li>€10-20/persoană sau €100-150 închiriere barcă fără permis</li>
</ul>

<h2>Închiriere barcă privată</h2>
<table>
  <tr><th>Tip</th><th>Preț/Zi</th></tr>
  <tr><td>Fără permis (până la 30 CP)</td><td>€100-200</td></tr>
  <tr><td>Cu skipper</td><td>€200-400</td></tr>
  <tr><td>Iaht cu echipaj</td><td>€500+</td></tr>
</table>`,

      sr: `<h2>Atos krstarenje</h2>
<p>Najpopularniji izlet brodom. Polazak iz <strong>luke Uranopoli</strong>, 3 sata duž zapadne obale Atosa.</p>
<ul>
  <li><strong>Cena:</strong> €20-30/osobi</li>
  <li><strong>Trajanje:</strong> 3 sata</li>
  <li><strong>Sezona:</strong> maj-oktobar, svakodnevno</li>
</ul>

<h2>Ostrva Drenija</h2>
<ul>
  <li>Iz Uranopolija: €15-25, 4-5 sati</li>
  <li>Iz Amulianija: €10-15, 2-3 sata</li>
</ul>

<h2>Plava laguna (Vurvuru)</h2>
<ul>
  <li>€10-20/osobi ili €100-150 iznajmljivanje čamca bez dozvole</li>
</ul>

<h2>Iznajmljivanje privatnog čamca</h2>
<table>
  <tr><th>Tip</th><th>Cena/Dan</th></tr>
  <tr><td>Bez dozvole (do 30 KS)</td><td>€100-200</td></tr>
  <tr><td>Sa skiperom</td><td>€200-400</td></tr>
  <tr><td>Jahta sa posadom</td><td>€500+</td></tr>
</table>`,
    },
  },
  // ─── 10. WITH DOGS ───
  {
    slug: 'with-dogs',
    icon: 'Dog',
    color: 'amber',
    title: {
      el: 'Χαλκιδική με Σκύλο',
      en: 'Halkidiki with Dogs — Pet-Friendly Guide',
      de: 'Chalkidiki mit Hund — Haustierfreundlicher Guide',
      bg: 'Халкидики с куче — гид за домашни любимци',
      ru: 'Халкидики с собакой — гид для путешествия с питомцем',
      ro: 'Halkidiki cu câini — ghid pet-friendly',
      sr: 'Halkidiki sa psom — vodič za ljubimce',
    },
    description: {
      el: 'Pet-friendly παραλίες, κατάλυμα, κτηνίατροι, ταξίδι με κατοικίδιο από εξωτερικό.',
      en: 'Pet-friendly beaches, accommodation, vets, travelling with pets from abroad.',
      de: 'Hundefreundliche Strände, Unterkünfte, Tierärzte, Einreise mit Haustier.',
      bg: 'Плажове за кучета, настаняване, ветеринари, пътуване с домашен любимец от чужбина.',
      ru: 'Пляжи для собак, размещение, ветеринары, поездка с питомцем из-за рубежа.',
      ro: 'Plaje pet-friendly, cazare, veterinari, călătorie cu animale de companie din străinătate.',
      sr: 'Plaže za pse, smeštaj, veterinari, putovanje sa ljubimcima iz inostranstva.',
    },
    metaTitle: {
      el: 'Χαλκιδική με Σκύλο | Παραλίες, Κατάλυμα & Συμβουλές',
      en: 'Halkidiki with Dogs | Pet-Friendly Beaches & Accommodation',
      de: 'Chalkidiki mit Hund | Hundestrände & Unterkünfte',
      bg: 'Халкидики с куче | Плажове и настаняване за домашни любимци',
      ru: 'Халкидики с собакой | Пляжи и жильё для питомцев',
      ro: 'Halkidiki cu câini | Plaje și cazare pet-friendly',
      sr: 'Halkidiki sa psom | Plaže i smeštaj za ljubimce',
    },
    metaDesc: {
      el: 'Οδηγός pet-friendly Χαλκιδική: παραλίες σκύλων, φιλικά καταλύματα, κτηνίατροι, EU Pet Passport, συμβουλές.',
      en: 'Pet-friendly Halkidiki guide: dog beaches, accommodation, vets, EU Pet Passport requirements, essential tips.',
      de: 'Haustierfreundlicher Chalkidiki-Guide: Hundestrände, Unterkünfte, Tierärzte, EU-Heimtierausweis.',
      bg: 'Гид за домашни любимци в Халкидики: плажове за кучета, настаняване, ветеринари, EU Pet Passport.',
      ru: 'Гид pet-friendly Халкидики: пляжи для собак, жильё, ветеринары, EU Pet Passport.',
      ro: 'Ghid pet-friendly Halkidiki: plaje pentru câini, cazare, veterinari, EU Pet Passport.',
      sr: 'Pet-friendly vodič Halkidiki: plaže za pse, smeštaj, veterinari, EU Pet Passport.',
    },
    content: {
      el: `<h2>Κανόνες για Σκύλους στις Παραλίες</h2>
<p>Στην Ελλάδα, οι σκύλοι <strong>επιτρέπονται στις ελεύθερες (μη οργανωμένες) παραλίες</strong> αλλά απαγορεύονται στις οργανωμένες/επί πληρωμή. Στην πράξη, σε πολλές ήσυχες παραλίες κανείς δεν θα σας πει τίποτα.</p>

<h2>Καλύτερες Παραλίες για Σκύλους</h2>
<ul>
  <li><strong>Ελεύθερες παραλίες Σιθωνίας:</strong> Πολλές μικρές παραλίες χωρίς ξαπλώστρες</li>
  <li><strong>Καβουρότρυπες</strong> (τα ελεύθερα τμήματα) — αρκετός χώρος</li>
  <li><strong>Τορώνη</strong> — μεγάλη παραλία, ελεύθερα τμήματα</li>
  <li><strong>Ακτές Κασσάνδρας</strong> εκτός σεζόν — σχεδόν άδειες</li>
</ul>

<h2>Κατάλυμα</h2>
<ul>
  <li><strong>Βίλες με αυλή:</strong> Η ιδανική επιλογή — ο σκύλος έχει χώρο</li>
  <li>Στο Booking.com/Airbnb: φιλτράρετε «pets allowed»</li>
  <li>Πολλά μικρά ξενοδοχεία δέχονται μικρά κατοικίδια — ρωτήστε πριν</li>
  <li>Τα μεγάλα resort συνήθως <strong>δεν δέχονται</strong> κατοικίδια</li>
</ul>

<h2>Κτηνίατροι</h2>
<p>Κτηνιατρεία υπάρχουν σε <strong>Πολύγυρο</strong>, <strong>Κασσανδρεία</strong> και <strong>Νέα Μουδανιά</strong>. Τα 24ωρα κτηνιατρεία βρίσκονται στη Θεσσαλονίκη.</p>

<h2>Ταξίδι από Εξωτερικό</h2>
<ul>
  <li><strong>EU Pet Passport:</strong> Υποχρεωτικό για ταξίδια εντός ΕΕ</li>
  <li><strong>Εμβολιασμός λύσσας:</strong> Τουλάχιστον 21 ημέρες πριν</li>
  <li><strong>Microchip:</strong> Υποχρεωτικό</li>
  <li>Εκτός ΕΕ: Πιθανόν χρειάζεται τίτλο αντισωμάτων λύσσας</li>
</ul>

<h2>Απαραίτητα</h2>
<ul>
  <li>Μπολ νερού φορητό</li>
  <li>Σκιά (ομπρέλα ή τέντα) — η ζέστη είναι επικίνδυνη</li>
  <li>Σακούλες καθαριότητας</li>
  <li>Αντιπαρασιτικό (κουνούπια μεταφέρουν λεϊσμανίαση)</li>
</ul>`,

      en: `<h2>Dog Rules on Greek Beaches</h2>
<p>In Greece, dogs are <strong>allowed on free (unorganised) beaches</strong> but technically prohibited on organised/paid beaches with sunbeds. In practice, on quiet beaches — especially in Sithonia — nobody will bother you, particularly in the morning or off-season.</p>

<h2>Best Dog-Friendly Beaches</h2>
<ul>
  <li><strong>Free beaches in Sithonia:</strong> Dozens of small coves without sunbeds — perfect for dogs</li>
  <li><strong>Kavourotrypes</strong> (free sections) — plenty of space, rocky coves for exploration</li>
  <li><strong>Toroni</strong> — long beach with free sections, shallow water</li>
  <li><strong>Kassandra beaches off-season</strong> — nearly empty, dogs welcome everywhere</li>
  <li><strong>Ammouliani quiet bays</strong> — Faka and Katsambas are secluded</li>
</ul>

<h2>Pet-Friendly Accommodation</h2>
<ul>
  <li><strong>Villas with garden:</strong> The ideal choice — your dog has space to roam</li>
  <li>On Booking.com/Airbnb: filter by "pets allowed"</li>
  <li>Many small hotels accept small pets — always confirm beforehand</li>
  <li>Large resorts usually <strong>do not accept</strong> pets</li>
  <li>Expect a small pet surcharge (€5-15/night) at some properties</li>
</ul>

<h2>Veterinary Clinics</h2>
<p>Vet clinics are available in <strong>Polygyros</strong>, <strong>Kassandreia</strong>, and <strong>Nea Moudania</strong>. For emergencies, 24-hour vet hospitals are in Thessaloniki (1-1.5 hours away).</p>

<h2>Travelling with Pets from Abroad</h2>
<ul>
  <li><strong>EU Pet Passport:</strong> Required for travel within the EU</li>
  <li><strong>Rabies vaccination:</strong> At least 21 days before travel</li>
  <li><strong>Microchip:</strong> Mandatory (ISO 11784/11785 standard)</li>
  <li><strong>Non-EU countries:</strong> May need a rabies antibody titre test (blood test 30+ days before travel)</li>
  <li><strong>Airlines:</strong> Check pet-in-cabin weight limits; most allow up to 8 kg in cabin</li>
</ul>

<h2>Essential Items to Bring</h2>
<ul>
  <li>Portable water bowl — dehydration is a real risk in summer heat</li>
  <li>Shade solution (beach umbrella or pop-up tent) — dogs overheat quickly</li>
  <li>Waste bags — always clean up after your dog</li>
  <li><strong>Tick and mosquito prevention:</strong> Greek mosquitoes can carry leishmaniasis — use a repellent collar or spot-on treatment</li>
  <li>Dog-safe sunscreen for light-coloured or thin-coated breeds</li>
  <li>Avoid walking on hot sand/asphalt between 12:00-16:00 in summer</li>
</ul>`,

      de: `<h2>Hunderegeln an griechischen Stränden</h2>
<p>In Griechenland sind Hunde an <strong>freien (nicht organisierten) Stränden erlaubt</strong>, aber an organisierten Stränden mit Liegen verboten. In der Praxis stört sich an ruhigen Stränden niemand daran.</p>

<h2>Beste Hundestrände</h2>
<ul>
  <li><strong>Freie Strände in Sithonia:</strong> Viele kleine Buchten ohne Liegen</li>
  <li><strong>Kavourotrypes</strong> (freie Abschnitte)</li>
  <li><strong>Toroni</strong> — langer Strand mit freien Bereichen</li>
</ul>

<h2>Haustierfreundliche Unterkünfte</h2>
<ul>
  <li><strong>Villen mit Garten:</strong> Die ideale Wahl</li>
  <li>Booking.com/Airbnb: Filter «Haustiere erlaubt»</li>
  <li>Große Resorts akzeptieren meist <strong>keine</strong> Haustiere</li>
</ul>

<h2>Einreise mit Haustier</h2>
<ul>
  <li><strong>EU-Heimtierausweis:</strong> Pflicht innerhalb der EU</li>
  <li><strong>Tollwutimpfung:</strong> Mind. 21 Tage vorher</li>
  <li><strong>Mikrochip:</strong> Pflicht</li>
  <li><strong>Zeckenschutz:</strong> Wichtig — Leishmaniose-Gefahr durch Mücken</li>
</ul>`,

      bg: `<h2>Правила за кучета на гръцките плажове</h2>
<p>В Гърция кучета са <strong>разрешени на свободни (неорганизирани) плажове</strong>, но забранени на организирани с чадъри. На практика, на тихи плажове никой не се притеснява.</p>

<h2>Най-добри плажове за кучета</h2>
<ul>
  <li><strong>Свободни плажове в Ситония:</strong> Много малки заливи без шезлонги</li>
  <li><strong>Кавуротрипес</strong> (свободни секции)</li>
  <li><strong>Торони</strong> — дълъг плаж със свободни части</li>
</ul>

<h2>Настаняване с домашни любимци</h2>
<ul>
  <li><strong>Вили с двор:</strong> Идеалният избор</li>
  <li>Филтрирайте «pets allowed» в Booking.com/Airbnb</li>
</ul>

<h2>Пътуване от чужбина</h2>
<ul>
  <li><strong>EU Pet Passport:</strong> Задължителен в ЕС</li>
  <li><strong>Ваксина бяс:</strong> Минимум 21 дни преди</li>
  <li><strong>Микрочип:</strong> Задължителен</li>
  <li><strong>Защита от кърлежи:</strong> Важна — лайшманиоза от комари</li>
</ul>`,

      ru: `<h2>Правила для собак на пляжах Греции</h2>
<p>В Греции собаки <strong>допускаются на свободные (неорганизованные) пляжи</strong>, но запрещены на платных пляжах с шезлонгами. На практике, на тихих пляжах Ситонии никто не возражает.</p>

<h2>Лучшие пляжи для собак</h2>
<ul>
  <li><strong>Свободные пляжи Ситонии:</strong> Множество бухт без шезлонгов</li>
  <li><strong>Кавуротрипес</strong> (свободные участки)</li>
  <li><strong>Торони</strong> — длинный пляж со свободными зонами</li>
</ul>

<h2>Жильё с питомцами</h2>
<ul>
  <li><strong>Виллы с садом:</strong> Идеальный выбор</li>
  <li>Фильтруйте «pets allowed» на Booking.com/Airbnb</li>
  <li>Крупные курорты обычно <strong>не принимают</strong> питомцев</li>
</ul>

<h2>Поездка из-за рубежа</h2>
<ul>
  <li><strong>EU Pet Passport:</strong> Обязателен в ЕС</li>
  <li><strong>Прививка от бешенства:</strong> Минимум за 21 день</li>
  <li><strong>Микрочип:</strong> Обязателен</li>
  <li><strong>Защита от клещей:</strong> Важна — лейшманиоз от комаров</li>
</ul>`,

      ro: `<h2>Reguli pentru câini pe plajele din Grecia</h2>
<p>În Grecia, câinii sunt <strong>permisi pe plajele libere (neorganizate)</strong> dar interziși pe cele organizate cu șezlonguri. În practică, pe plajele liniștite nimeni nu obiectează.</p>

<h2>Cele mai bune plaje pentru câini</h2>
<ul>
  <li><strong>Plaje libere în Sithonia:</strong> Multe golfuri mici fără șezlonguri</li>
  <li><strong>Kavourotrypes</strong> (secțiuni libere)</li>
  <li><strong>Toroni</strong> — plajă lungă cu zone libere</li>
</ul>

<h2>Cazare pet-friendly</h2>
<ul>
  <li><strong>Vile cu grădină:</strong> Alegerea ideală</li>
  <li>Filtrează «pets allowed» pe Booking.com/Airbnb</li>
</ul>

<h2>Călătorie din străinătate</h2>
<ul>
  <li><strong>EU Pet Passport:</strong> Obligatoriu în UE</li>
  <li><strong>Vaccin antirabic:</strong> Minim 21 zile înainte</li>
  <li><strong>Microcip:</strong> Obligatoriu</li>
  <li><strong>Protecție anti-căpușe:</strong> Importantă — leishmanioza de la țânțari</li>
</ul>`,

      sr: `<h2>Pravila za pse na grčkim plažama</h2>
<p>U Grčkoj su psi <strong>dozvoljeni na slobodnim (neorganizovanim) plažama</strong> ali zabranjeni na organizovanim sa ležaljkama. U praksi, na mirnim plažama niko ne prigovara.</p>

<h2>Najbolje plaže za pse</h2>
<ul>
  <li><strong>Slobodne plaže Sitonije:</strong> Mnogo malih uvala bez ležaljki</li>
  <li><strong>Kavurotrupes</strong> (slobodni delovi)</li>
  <li><strong>Toroni</strong> — dugačka plaža sa slobodnim zonama</li>
</ul>

<h2>Smeštaj sa ljubimcima</h2>
<ul>
  <li><strong>Vile sa dvorištem:</strong> Idealan izbor</li>
  <li>Filtrirajte «pets allowed» na Booking.com/Airbnb</li>
</ul>

<h2>Putovanje iz inostranstva</h2>
<ul>
  <li><strong>EU Pet Passport:</strong> Obavezan u EU</li>
  <li><strong>Vakcina protiv besnila:</strong> Minimum 21 dan pre</li>
  <li><strong>Mikročip:</strong> Obavezan</li>
  <li><strong>Zaštita od krpelja:</strong> Važna — lajšmanioza od komaraca</li>
</ul>`,
    },
  },
  // ─── 11. DIVING ───
  {
    slug: 'diving',
    icon: 'Waves',
    color: 'blue',
    title: {
      el: 'Κατάδυση & Σνόρκελ στη Χαλκιδική',
      en: 'Diving & Snorkeling in Halkidiki',
      de: 'Tauchen & Schnorcheln in Chalkidiki',
      bg: 'Гмуркане и шнорхелинг в Халкидики',
      ru: 'Дайвинг и снорклинг в Халкидики',
      ro: 'Scufundări și snorkeling în Halkidiki',
      sr: 'Ronjenje i šnorkl u Halkidikiju',
    },
    description: {
      el: 'Κέντρα κατάδυσης, PADI, σημεία κατάδυσης, σνόρκελ, κόστη και σεζόν.',
      en: 'Dive centres, PADI courses, dive sites, snorkeling spots, costs and season.',
      de: 'Tauchzentren, PADI-Kurse, Tauchplätze, Schnorchelspots, Kosten und Saison.',
      bg: 'Центрове за гмуркане, PADI курсове, места за гмуркане, шнорхелинг, цени и сезон.',
      ru: 'Дайв-центры, курсы PADI, дайв-сайты, снорклинг-споты, стоимость и сезон.',
      ro: 'Centre de scufundări, cursuri PADI, locuri de scufundare, snorkeling, costuri și sezon.',
      sr: 'Centri za ronjenje, PADI kursevi, mesta za ronjenje, šnorkl, cene i sezona.',
    },
    metaTitle: {
      el: 'Κατάδυση Χαλκιδική | PADI, Σημεία & Σνόρκελ',
      en: 'Halkidiki Diving & Snorkeling | PADI, Dive Sites & Costs',
      de: 'Tauchen Chalkidiki | PADI, Tauchplätze & Schnorcheln',
      bg: 'Гмуркане Халкидики | PADI, места и шнорхелинг',
      ru: 'Дайвинг Халкидики | PADI, дайв-сайты и снорклинг',
      ro: 'Scufundări Halkidiki | PADI, locuri și snorkeling',
      sr: 'Ronjenje Halkidiki | PADI, mesta i šnorkl',
    },
    metaDesc: {
      el: 'Κατάδυση στη Χαλκιδική: κέντρα PADI, ορατότητα 15-30m, ναυάγια, σπηλιές, σνόρκελ σε Καβουρότρυπες & Καρύδι. Κόστος €40-60/κατάδυση.',
      en: 'Diving in Halkidiki: PADI centres, 15-30m visibility, shipwrecks, caves, snorkeling at Kavourotrypes & Karidi. Cost €40-60/dive.',
      de: 'Tauchen in Chalkidiki: PADI-Zentren, 15-30 m Sicht, Wracks, Höhlen, Schnorcheln. Kosten 40-60 €/Tauchgang.',
      bg: 'Гмуркане в Халкидики: PADI центрове, видимост 15-30 м, потънали кораби, пещери, шнорхелинг. Цена €40-60/гмуркане.',
      ru: 'Дайвинг в Халкидики: PADI-центры, видимость 15-30 м, затонувшие корабли, пещеры, снорклинг. Стоимость €40-60/погружение.',
      ro: 'Scufundări în Halkidiki: centre PADI, vizibilitate 15-30m, epave, peșteri, snorkeling. Cost €40-60/scufundare.',
      sr: 'Ronjenje u Halkidikiju: PADI centri, vidljivost 15-30m, olupine, pećine, šnorkl. Cena €40-60/ronjenje.',
    },
    content: {
      el: `<h2>Γιατί Κατάδυση στη Χαλκιδική;</h2>
<p>Τα νερά της Χαλκιδικής προσφέρουν <strong>ορατότητα 15-30 μέτρων</strong>, ζεστή θερμοκρασία (22-27°C, Ιούνιος-Οκτώβριος) και ποικιλία υποβρύχιων τοπίων: βραχώδεις σχηματισμοί, σπηλιές, ναυάγια και πλούσια θαλάσσια ζωή.</p>

<h2>Κέντρα Κατάδυσης</h2>
<ul>
  <li><strong>Κασσάνδρα:</strong> Dive centres σε Καλλιθέα, Σάνη, Πεφκοχώρι</li>
  <li><strong>Σιθωνία:</strong> Κέντρα σε Νικήτη, Νέο Μαρμαρά, Σάρτη</li>
  <li><strong>Ουρανούπολη:</strong> Κατάδυση κοντά στο Άγιο Όρος</li>
</ul>
<p>Τα περισσότερα προσφέρουν <strong>πιστοποιήσεις PADI</strong> (Open Water, Advanced, Rescue).</p>

<h2>Κορυφαία Σημεία Κατάδυσης</h2>
<table>
  <tr><th>Σημείο</th><th>Βάθος</th><th>Ενδιαφέρον</th></tr>
  <tr><td>Σπηλιές Σιθωνίας</td><td>10-25m</td><td>Υποθαλάσσιες σπηλιές, σταλακτίτες</td></tr>
  <tr><td>Ναυάγιο κοντά στο Πόρτο Κουφό</td><td>18-30m</td><td>Ξύλινο ναυάγιο, ψάρια</td></tr>
  <tr><td>Reef walls Ουρανούπολης</td><td>12-35m</td><td>Κάθετοι βράχοι, χταπόδια, σφουγγάρια</td></tr>
  <tr><td>Καβουρότρυπες</td><td>5-15m</td><td>Ιδανικό για αρχάριους, φυσικές αψίδες</td></tr>
</table>

<h2>Κόστη</h2>
<ul>
  <li><strong>Μεμονωμένη κατάδυση:</strong> €40-60</li>
  <li><strong>Discover Scuba (δοκιμαστική):</strong> €60-80</li>
  <li><strong>PADI Open Water (πιστοποίηση):</strong> €300-400</li>
  <li><strong>Πακέτο 5 καταδύσεων:</strong> €180-250</li>
</ul>

<h2>Σνόρκελ — Καλύτερα Σημεία</h2>
<ul>
  <li><strong>Καβουρότρυπες:</strong> Βράχοι, αψίδες, πολύχρωμα ψάρια</li>
  <li><strong>Καρύδι (Βουρβουρού):</strong> Ρηχά τιρκουάζ νερά, αχινοί, αστερίες</li>
  <li><strong>Φάκα (Αμμουλιανή):</strong> Κρυστάλλινη μικρή παραλία</li>
  <li><strong>Πόρτο Κουφό:</strong> Ήσυχος κόλπος, πλούσιος βυθός</li>
</ul>`,

      en: `<h2>Why Dive in Halkidiki?</h2>
<p>Halkidiki's waters offer <strong>15-30 metre visibility</strong>, warm temperatures (22-27°C, June to October), and diverse underwater landscapes: rocky formations, caves, shipwrecks, and rich marine life including octopus, moray eels, groupers, and colourful reef fish.</p>

<h2>Dive Centres</h2>
<ul>
  <li><strong>Kassandra:</strong> Dive centres in Kallithea, Sani, Pefkochori</li>
  <li><strong>Sithonia:</strong> Centres in Nikiti, Neos Marmaras, Sarti — generally the best diving due to dramatic coastline</li>
  <li><strong>Ouranoupoli:</strong> Diving near Mount Athos — less visited, pristine waters</li>
</ul>
<p>Most centres offer <strong>PADI certifications</strong> (Open Water, Advanced Open Water, Rescue Diver) taught in English, Greek, and often German or Russian.</p>

<h2>Top Dive Sites</h2>
<table>
  <tr><th>Site</th><th>Depth</th><th>Highlights</th></tr>
  <tr><td>Sithonia Sea Caves</td><td>10-25m</td><td>Underwater caves with stalactites, swim-throughs</td></tr>
  <tr><td>Porto Koufo Shipwreck</td><td>18-30m</td><td>Wooden shipwreck colonised by marine life</td></tr>
  <tr><td>Ouranoupoli Reef Walls</td><td>12-35m</td><td>Vertical walls, octopus, sponges, sea fans</td></tr>
  <tr><td>Kavourotrypes Arches</td><td>5-15m</td><td>Natural rock arches, ideal for beginners</td></tr>
</table>

<h2>Costs</h2>
<ul>
  <li><strong>Single fun dive (certified divers):</strong> €40-60</li>
  <li><strong>Discover Scuba Diving (intro):</strong> €60-80</li>
  <li><strong>PADI Open Water certification:</strong> €300-400 (3-4 days)</li>
  <li><strong>5-dive package:</strong> €180-250</li>
  <li><strong>Full equipment rental:</strong> Usually included in dive price</li>
</ul>

<h2>Best Snorkeling Spots</h2>
<ul>
  <li><strong>Kavourotrypes:</strong> Rocky coves with natural arches, colourful fish, excellent visibility</li>
  <li><strong>Karidi Beach (Vourvourou):</strong> Shallow turquoise water, sea urchins, starfish — bring water shoes</li>
  <li><strong>Faka (Ammouliani):</strong> Crystal-clear small beach, quiet and pristine</li>
  <li><strong>Porto Koufo:</strong> Calm harbour bay with rich seabed</li>
  <li><strong>Blue Lagoon (Vourvourou islets):</strong> Shallow water between islets, perfect for families</li>
</ul>

<h2>Diving Season & Tips</h2>
<ul>
  <li><strong>Best months:</strong> June to October (water 22-27°C)</li>
  <li><strong>Wetsuit:</strong> 3mm shorty in summer, 5mm full suit in June and October</li>
  <li><strong>Certification:</strong> Book your PADI course 1-2 days before you want to start</li>
  <li><strong>Snorkel gear:</strong> Available to buy cheaply in beach shops, or rent from dive centres (€10-15/day)</li>
</ul>`,

      de: `<h2>Warum in Chalkidiki tauchen?</h2>
<p>Chalkidikis Gewässer bieten <strong>15-30 m Sicht</strong>, warme Temperaturen (22-27°C, Juni-Oktober) und vielfältige Unterwasserlandschaften: Felsenformationen, Höhlen, Wracks und reiches Meeresleben.</p>

<h2>Tauchzentren</h2>
<ul>
  <li><strong>Kassandra:</strong> Kallithea, Sani, Pefkochori</li>
  <li><strong>Sithonia:</strong> Nikiti, Neos Marmaras, Sarti — beste Tauchplätze</li>
  <li><strong>Ouranoupoli:</strong> Tauchen nahe Athos</li>
</ul>

<h2>Top-Tauchplätze</h2>
<table>
  <tr><th>Platz</th><th>Tiefe</th><th>Highlights</th></tr>
  <tr><td>Sithonia-Höhlen</td><td>10-25 m</td><td>Unterwasserhöhlen, Stalaktiten</td></tr>
  <tr><td>Porto-Koufo-Wrack</td><td>18-30 m</td><td>Holzwrack mit Meeresbewuchs</td></tr>
  <tr><td>Ouranoupoli Riffwände</td><td>12-35 m</td><td>Vertikale Wände, Schwämme</td></tr>
</table>

<h2>Kosten</h2>
<ul>
  <li><strong>Einzeltauchgang:</strong> 40-60 €</li>
  <li><strong>Schnuppertauchen:</strong> 60-80 €</li>
  <li><strong>PADI Open Water:</strong> 300-400 €</li>
</ul>

<h2>Schnorchelspots</h2>
<ul>
  <li><strong>Kavourotrypes:</strong> Felsenbuchten, bunte Fische</li>
  <li><strong>Karidi (Vourvourou):</strong> Flaches türkises Wasser</li>
  <li><strong>Porto Koufo:</strong> Ruhige Bucht, reicher Meeresboden</li>
</ul>`,

      bg: `<h2>Защо да се гмуркате в Халкидики?</h2>
<p>Водите предлагат <strong>видимост 15-30 метра</strong>, топла температура (22-27°C, юни-октомври) и разнообразни подводни пейзажи: скални формации, пещери, потънали кораби.</p>

<h2>Центрове за гмуркане</h2>
<ul>
  <li><strong>Касандра:</strong> Калитея, Сани, Пефкохори</li>
  <li><strong>Ситония:</strong> Никити, Неос Мармарас, Сарти</li>
  <li><strong>Уранополи:</strong> Близо до Атос</li>
</ul>

<h2>Цени</h2>
<ul>
  <li><strong>Единично гмуркане:</strong> €40-60</li>
  <li><strong>Пробно гмуркане:</strong> €60-80</li>
  <li><strong>PADI Open Water:</strong> €300-400</li>
</ul>

<h2>Шнорхелинг</h2>
<ul>
  <li><strong>Кавуротрипес:</strong> Скални арки, цветни риби</li>
  <li><strong>Кариди (Вурвуру):</strong> Плитки тюркоазени води</li>
  <li><strong>Порто Куфо:</strong> Спокоен залив, богат морски живот</li>
</ul>`,

      ru: `<h2>Почему дайвинг в Халкидики?</h2>
<p>Воды Халкидики предлагают <strong>видимость 15-30 метров</strong>, тёплую температуру (22-27°C, июнь-октябрь) и разнообразные подводные ландшафты: скалы, пещеры, затонувшие корабли и богатую морскую жизнь.</p>

<h2>Дайв-центры</h2>
<ul>
  <li><strong>Кассандра:</strong> Каллифея, Сани, Пефкохори</li>
  <li><strong>Ситония:</strong> Никити, Неос Мармарас, Сарти — лучшие дайв-сайты</li>
  <li><strong>Уранополис:</strong> Дайвинг у Афона</li>
</ul>

<h2>Стоимость</h2>
<ul>
  <li><strong>Одно погружение:</strong> €40-60</li>
  <li><strong>Пробное погружение:</strong> €60-80</li>
  <li><strong>PADI Open Water:</strong> €300-400</li>
  <li><strong>Пакет 5 погружений:</strong> €180-250</li>
</ul>

<h2>Снорклинг</h2>
<ul>
  <li><strong>Кавуротрипес:</strong> Скальные арки, цветные рыбы</li>
  <li><strong>Кариди (Вурвуру):</strong> Мелкая бирюзовая вода</li>
  <li><strong>Порто Куфо:</strong> Спокойная бухта, богатое дно</li>
</ul>`,

      ro: `<h2>De ce scufundări în Halkidiki?</h2>
<p>Apele oferă <strong>vizibilitate de 15-30 metri</strong>, temperatură caldă (22-27°C, iunie-octombrie) și peisaje subacvatice diverse: formațiuni stâncoase, peșteri, epave.</p>

<h2>Centre de scufundări</h2>
<ul>
  <li><strong>Kassandra:</strong> Kallithea, Sani, Pefkochori</li>
  <li><strong>Sithonia:</strong> Nikiti, Neos Marmaras, Sarti</li>
  <li><strong>Ouranoupoli:</strong> Lângă Athos</li>
</ul>

<h2>Costuri</h2>
<ul>
  <li><strong>Scufundare singulară:</strong> €40-60</li>
  <li><strong>Scufundare de probă:</strong> €60-80</li>
  <li><strong>PADI Open Water:</strong> €300-400</li>
</ul>

<h2>Snorkeling</h2>
<ul>
  <li><strong>Kavourotrypes:</strong> Arcade de stâncă, pești colorați</li>
  <li><strong>Karidi (Vourvourou):</strong> Apă turcoaz puțin adâncă</li>
  <li><strong>Porto Koufo:</strong> Golf liniștit, viață marină bogată</li>
</ul>`,

      sr: `<h2>Zašto ronjenje u Halkidikiju?</h2>
<p>Vode nude <strong>vidljivost 15-30 metara</strong>, toplu temperaturu (22-27°C, jun-oktobar) i raznovrsne podvodne pejzaže: stenovite formacije, pećine, olupine i bogat morski život.</p>

<h2>Centri za ronjenje</h2>
<ul>
  <li><strong>Kasandra:</strong> Kalitea, Sani, Pefkohori</li>
  <li><strong>Sitonija:</strong> Nikiti, Neos Marmaras, Sarti — najbolja mesta</li>
  <li><strong>Uranopoli:</strong> Ronjenje blizu Atosa</li>
</ul>

<h2>Cene</h2>
<ul>
  <li><strong>Pojedinačno ronjenje:</strong> €40-60</li>
  <li><strong>Probno ronjenje:</strong> €60-80</li>
  <li><strong>PADI Open Water:</strong> €300-400</li>
  <li><strong>Paket 5 zarona:</strong> €180-250</li>
</ul>

<h2>Šnorkl</h2>
<ul>
  <li><strong>Kavurotrupes:</strong> Stenoviti lukovi, šarene ribe</li>
  <li><strong>Karidi (Vurvuru):</strong> Plitka tirkizna voda</li>
  <li><strong>Porto Kufo:</strong> Miran zaliv, bogat morski život</li>
</ul>`,
    },
  },
  {
    slug: 'halkidiki-vs-thassos',
    icon: 'Scale',
    color: 'violet',
    title: {
      el: 'Χαλκιδική ή Θάσος: Σύγκριση',
      en: 'Halkidiki vs Thassos: Which to Choose',
      de: 'Chalkidiki vs. Thassos: Welches Reiseziel wählen',
      bg: 'Халкидики или Тасос: Кое да изберем',
      ru: 'Халкидики или Тасос: Что выбрать',
      ro: 'Halkidiki sau Thassos: Ce să alegi',
      sr: 'Halkidiki ili Tasos: Šta izabrati',
    },
    description: {
      el: 'Αναλυτική σύγκριση ανάμεσα σε Χαλκιδική και Θάσο — παραλίες, πρόσβαση, νυχτερινή ζωή, τιμές και ποιο ταιριάζει σε εσάς.',
      en: 'Detailed comparison between Halkidiki and Thassos — beaches, access, nightlife, prices, and which suits your travel style.',
      de: 'Detaillierter Vergleich zwischen Chalkidiki und Thassos — Strände, Zugang, Nachtleben, Preise und was zu Ihrem Reisestil passt.',
      bg: 'Подробно сравнение между Халкидики и Тасос — плажове, достъп, нощен живот, цени и кое е по-подходящо за вас.',
      ru: 'Подробное сравнение Халкидики и Тасоса — пляжи, доступность, ночная жизнь, цены и что подойдёт именно вам.',
      ro: 'Comparație detaliată între Halkidiki și Thassos — plaje, acces, viață de noapte, prețuri și care ți se potrivește.',
      sr: 'Detaljna uporedba Halkidikija i Tasosa — plaže, pristup, noćni život, cene i šta vam više odgovara.',
    },
    metaTitle: {
      el: 'Χαλκιδική ή Θάσος; Πλήρης σύγκριση 2025',
      en: 'Halkidiki vs Thassos – Full Comparison Guide 2025',
      de: 'Chalkidiki oder Thassos – Kompletter Vergleich 2025',
      bg: 'Халкидики или Тасос – Пълно сравнение 2025',
      ru: 'Халкидики или Тасос – Полное сравнение 2025',
      ro: 'Halkidiki sau Thassos – Ghid comparativ complet 2025',
      sr: 'Halkidiki ili Tasos – Potpuni vodič za poređenje 2025',
    },
    metaDesc: {
      el: 'Χαλκιδική ή Θάσος; Συγκρίνουμε παραλίες, πρόσβαση, κόστος, νυχτερινή ζωή και καταλύματα για να διαλέξετε τον ιδανικό προορισμό.',
      en: 'Halkidiki or Thassos? We compare beaches, access, costs, nightlife, and accommodation to help you pick the perfect Greek destination.',
      de: 'Chalkidiki oder Thassos? Wir vergleichen Strände, Zugang, Kosten, Nachtleben und Unterkünfte für Ihre perfekte Wahl.',
      bg: 'Халкидики или Тасос? Сравняваме плажове, достъп, цени, нощен живот и настаняване, за да изберете идеалната дестинация.',
      ru: 'Халкидики или Тасос? Сравниваем пляжи, доступ, цены, ночную жизнь и жильё, чтобы вы выбрали идеальное направление.',
      ro: 'Halkidiki sau Thassos? Comparăm plaje, acces, costuri, viață de noapte și cazare pentru a alege destinația perfectă.',
      sr: 'Halkidiki ili Tasos? Upoređujemo plaže, pristup, troškove, noćni život i smeštaj da izaberete savršenu destinaciju.',
    },
    content: {
      el: `<h2>Χαλκιδική ή Θάσος: Ο μεγάλος διαχωρισμός</h2>
<p>Δύο από τους πιο δημοφιλείς προορισμούς στη Βόρεια Ελλάδα, η Χαλκιδική και η Θάσος προσελκύουν εκατομμύρια τουρίστες κάθε χρόνο. Ας δούμε ποιο ταιριάζει στις ανάγκες σας.</p>

<table>
<tr><th>Κριτήριο</th><th>Χαλκιδική</th><th>Θάσος</th></tr>
<tr><td><strong>Πρόσβαση</strong></td><td>Με αυτοκίνητο, απευθείας από Θεσσαλονίκη (45 λεπτά–2 ώρες)</td><td>Φέρι από Κεραμωτή (40 λεπτά) ή Καβάλα (1,5 ώρα)</td></tr>
<tr><td><strong>Ακτογραμμή</strong></td><td>500+ χλμ ακτών σε 3 χερσονήσους</td><td>~100 χλμ γύρω από το νησί</td></tr>
<tr><td><strong>Παραλίες</strong></td><td>Πολύ ποικίλες: αμμώδεις, βραχώδεις, οργανωμένες & ερημικές</td><td>Σμαραγδένια νερά, μικρότερες αλλά πανέμορφες</td></tr>
<tr><td><strong>Νυχτερινή ζωή</strong></td><td>Πλούσια, ιδιαίτερα στην Κασσάνδρα (Καλλιθέα, Χανιώτη)</td><td>Ήσυχη, παραδοσιακά μπαρ και beach bars</td></tr>
<tr><td><strong>Κατάλληλο για</strong></td><td>Οικογένειες, ζευγάρια, νέους, ομάδες</td><td>Ζευγάρια, φυσιολάτρες, ήσυχες διακοπές</td></tr>
<tr><td><strong>Τιμές</strong></td><td>Μέτριες – Υψηλές (ανάλογα περιοχή)</td><td>Μέτριες</td></tr>
</table>

<h2>Πλεονεκτήματα Χαλκιδικής</h2>
<ul>
<li><strong>Ποικιλία:</strong> Τρεις εντελώς διαφορετικές χερσόνησοι — Κασσάνδρα για νυχτερινή ζωή, Σιθωνία για φύση, Άθως για πνευματικότητα</li>
<li><strong>Εύκολη πρόσβαση:</strong> Δεν χρειάζεται φέρι, φτάνετε με αυτοκίνητο</li>
<li><strong>Υποδομές:</strong> Μεγάλα ξενοδοχεία, all-inclusive resorts, πολλά εστιατόρια</li>
<li><strong>Ημερήσιες εκδρομές:</strong> Θεσσαλονίκη, Μετέωρα, Βεργίνα κοντά</li>
</ul>

<h2>Πλεονεκτήματα Θάσου</h2>
<ul>
<li><strong>Νησιωτικό αίσθημα:</strong> Η αίσθηση του νησιού χωρίς μακρύ ταξίδι</li>
<li><strong>Σμαραγδένια νερά:</strong> Εξωτικές παραλίες όπως Marble Beach και Giola</li>
<li><strong>Ησυχία:</strong> Ιδανικό για χαλάρωση μακριά από πλήθη</li>
<li><strong>Μικρό μέγεθος:</strong> Μπορείτε να γυρίσετε ολόκληρο το νησί σε μια μέρα</li>
</ul>

<h2>Πότε να επιλέξετε τι</h2>
<p>Αν θέλετε <strong>πολλές επιλογές</strong>, δυνατή νυχτερινή ζωή και εύκολες ημερήσιες εκδρομές, επιλέξτε Χαλκιδική. Αν αναζητάτε <strong>ήσυχες νησιωτικές διακοπές</strong> με εντυπωσιακά νερά, η Θάσος είναι η επιλογή σας.</p>`,

      en: `<h2>Halkidiki vs Thassos: The Big Decision</h2>
<p>Two of Northern Greece's most popular destinations, Halkidiki and Thassos attract millions of visitors every year. Both offer stunning Aegean beaches, but the experience is very different. Here's how to choose.</p>

<table>
<tr><th>Criteria</th><th>Halkidiki</th><th>Thassos</th></tr>
<tr><td><strong>Access</strong></td><td>Drive directly from Thessaloniki (45 min–2 hrs)</td><td>Ferry from Keramoti (40 min) or Kavala (1.5 hrs)</td></tr>
<tr><td><strong>Coastline</strong></td><td>500+ km across 3 peninsulas</td><td>~100 km around the island</td></tr>
<tr><td><strong>Beaches</strong></td><td>Hugely varied: sandy, rocky, organized & secluded</td><td>Emerald waters, smaller but stunning</td></tr>
<tr><td><strong>Nightlife</strong></td><td>Vibrant, especially Kassandra (Kallithea, Hanioti)</td><td>Quiet, traditional bars and beach bars</td></tr>
<tr><td><strong>Best for</strong></td><td>Families, couples, youth, groups</td><td>Couples, nature lovers, peaceful holidays</td></tr>
<tr><td><strong>Prices</strong></td><td>Moderate to High (depends on area)</td><td>Moderate</td></tr>
<tr><td><strong>Car needed?</strong></td><td>Yes, essential for exploring</td><td>Yes, recommended for island tour</td></tr>
<tr><td><strong>Day trips</strong></td><td>Thessaloniki, Meteora, Vergina, Pella</td><td>Kavala, Philippi, Drama (Aggitis Cave)</td></tr>
</table>

<h2>Why Choose Halkidiki</h2>
<ul>
<li><strong>Variety:</strong> Three distinct peninsulas — Kassandra for nightlife, Sithonia for nature, Athos for spirituality</li>
<li><strong>No ferry needed:</strong> Drive straight from the airport, no scheduling around boats</li>
<li><strong>Infrastructure:</strong> Large hotels, all-inclusive resorts, hundreds of restaurants and tavernas</li>
<li><strong>Day trip hub:</strong> Thessaloniki is 1 hour away, Meteora a day trip, Vergina's royal tombs 1.5 hours</li>
<li><strong>500 km of coast:</strong> Even in peak August, you can find quiet coves</li>
</ul>

<h2>Why Choose Thassos</h2>
<ul>
<li><strong>Island atmosphere:</strong> The feeling of a Greek island without a long journey from the mainland</li>
<li><strong>Emerald waters:</strong> Marble Beach, Giola natural pool, and Porto Vathy are extraordinary</li>
<li><strong>Compact:</strong> You can drive around the entire island in a day</li>
<li><strong>Quieter:</strong> Less crowded than Halkidiki even in August</li>
<li><strong>Affordable:</strong> Generally lower prices for accommodation and dining</li>
</ul>

<h2>The Verdict</h2>
<p>If you want <strong>diverse experiences</strong>, strong nightlife, easy day trips, and no reliance on ferry schedules, choose Halkidiki. If you crave a <strong>peaceful island escape</strong> with emerald waters and a relaxed pace, Thassos is your destination. Many visitors do both across separate trips — they're complementary, not competitors.</p>`,

      de: `<h2>Chalkidiki vs. Thassos: Die große Entscheidung</h2>
<p>Zwei der beliebtesten Reiseziele in Nordgriechenland, Chalkidiki und Thassos, ziehen jedes Jahr Millionen von Besuchern an. Beide bieten herrliche Ägäis-Strände, aber das Erlebnis ist ganz unterschiedlich.</p>

<table>
<tr><th>Kriterium</th><th>Chalkidiki</th><th>Thassos</th></tr>
<tr><td><strong>Anreise</strong></td><td>Direkt mit dem Auto ab Thessaloniki (45 Min.–2 Std.)</td><td>Fähre von Keramoti (40 Min.) oder Kavala (1,5 Std.)</td></tr>
<tr><td><strong>Küstenlinie</strong></td><td>Über 500 km an 3 Halbinseln</td><td>Ca. 100 km rund um die Insel</td></tr>
<tr><td><strong>Strände</strong></td><td>Sehr vielfältig: sandig, felsig, organisiert & abgelegen</td><td>Smaragdgrünes Wasser, kleiner aber atemberaubend</td></tr>
<tr><td><strong>Nachtleben</strong></td><td>Lebendig, besonders auf Kassandra</td><td>Ruhig, traditionelle Bars</td></tr>
<tr><td><strong>Ideal für</strong></td><td>Familien, Paare, Jugendliche, Gruppen</td><td>Paare, Naturliebhaber, ruhiger Urlaub</td></tr>
<tr><td><strong>Preise</strong></td><td>Mittel bis Hoch</td><td>Moderat</td></tr>
</table>

<h2>Vorteile von Chalkidiki</h2>
<ul>
<li><strong>Vielfalt:</strong> Drei verschiedene Halbinseln mit jeweils eigenem Charakter</li>
<li><strong>Keine Fähre nötig:</strong> Direkter Zugang mit dem Auto</li>
<li><strong>Infrastruktur:</strong> Große Hotels, All-Inclusive-Resorts, viele Restaurants</li>
<li><strong>Ausflüge:</strong> Thessaloniki (1 Std.), Meteora (Tagesausflug), Vergina (1,5 Std.)</li>
</ul>

<h2>Vorteile von Thassos</h2>
<ul>
<li><strong>Inselgefühl:</strong> Griechisches Inselflair ohne lange Anreise</li>
<li><strong>Smaragdgrünes Wasser:</strong> Marble Beach, Giola und Porto Vathy sind außergewöhnlich</li>
<li><strong>Kompakt:</strong> Die gesamte Insel lässt sich an einem Tag umrunden</li>
<li><strong>Ruhiger:</strong> Weniger überlaufen als Chalkidiki, selbst im August</li>
</ul>

<h2>Fazit</h2>
<p>Wer <strong>abwechslungsreiche Erlebnisse</strong>, Nachtleben und Tagesausflüge sucht, wählt Chalkidiki. Wer eine <strong>ruhige Inselflucht</strong> mit traumhaftem Wasser bevorzugt, sollte Thassos wählen.</p>`,

      bg: `<h2>Халкидики или Тасос: Голямото решение</h2>
<p>Две от най-популярните дестинации в Северна Гърция, Халкидики и Тасос привличат милиони туристи всяка година. И двете предлагат зашеметяващи плажове на Егейско море, но преживяването е доста различно.</p>

<table>
<tr><th>Критерий</th><th>Халкидики</th><th>Тасос</th></tr>
<tr><td><strong>Достъп</strong></td><td>С кола от Солун (45 мин–2 часа)</td><td>Ферибот от Керамоти (40 мин) или Кавала (1,5 часа)</td></tr>
<tr><td><strong>Брегова линия</strong></td><td>500+ км по 3 полуострова</td><td>~100 км около острова</td></tr>
<tr><td><strong>Плажове</strong></td><td>Много разнообразни: пясъчни, скалисти, организирани и уединени</td><td>Изумрудени води, по-малки но зашеметяващи</td></tr>
<tr><td><strong>Нощен живот</strong></td><td>Оживен, особено в Касандра</td><td>Спокоен, традиционни барове</td></tr>
<tr><td><strong>Подходящ за</strong></td><td>Семейства, двойки, младежи, групи</td><td>Двойки, любители на природата, спокойни почивки</td></tr>
<tr><td><strong>Цени</strong></td><td>Умерени до Високи</td><td>Умерени</td></tr>
</table>

<h2>Защо Халкидики</h2>
<ul>
<li><strong>Разнообразие:</strong> Три различни полуострова — Касандра за нощен живот, Ситония за природа, Атон за духовност</li>
<li><strong>Без ферибот:</strong> Директен достъп с кола от летището</li>
<li><strong>Инфраструктура:</strong> Големи хотели, ол-инклузив курорти, стотици ресторанти</li>
<li><strong>Екскурзии:</strong> Солун на 1 час, Метеора за еднодневна екскурзия</li>
</ul>

<h2>Защо Тасос</h2>
<ul>
<li><strong>Островно усещане:</strong> Гръцки островен дух без дълго пътуване</li>
<li><strong>Изумрудени води:</strong> Marble Beach, Giola и Porto Vathy са изключителни</li>
<li><strong>Компактен:</strong> Целият остров може да се обиколи за един ден</li>
<li><strong>По-спокоен:</strong> По-малко пренаселен от Халкидики дори през август</li>
</ul>

<h2>Заключение</h2>
<p>Ако искате <strong>разнообразни преживявания</strong>, нощен живот и лесни екскурзии — изберете Халкидики. Ако мечтаете за <strong>спокойно островно бягство</strong> с кристални води — Тасос е вашата дестинация.</p>`,

      ru: `<h2>Халкидики или Тасос: Большой выбор</h2>
<p>Два самых популярных направления Северной Греции — Халкидики и Тасос — каждый год привлекают миллионы туристов. Оба предлагают потрясающие пляжи Эгейского моря, но впечатления сильно отличаются.</p>

<table>
<tr><th>Критерий</th><th>Халкидики</th><th>Тасос</th></tr>
<tr><td><strong>Доступ</strong></td><td>На машине из Салоник (45 мин–2 часа)</td><td>Паром из Керамоти (40 мин) или Кавалы (1,5 часа)</td></tr>
<tr><td><strong>Побережье</strong></td><td>500+ км на 3 полуостровах</td><td>~100 км вокруг острова</td></tr>
<tr><td><strong>Пляжи</strong></td><td>Очень разнообразные: песчаные, скалистые, организованные и дикие</td><td>Изумрудные воды, компактнее, но великолепные</td></tr>
<tr><td><strong>Ночная жизнь</strong></td><td>Активная, особенно на Кассандре</td><td>Спокойная, традиционные бары</td></tr>
<tr><td><strong>Для кого</strong></td><td>Семьи, пары, молодёжь, компании</td><td>Пары, любители природы, спокойный отдых</td></tr>
<tr><td><strong>Цены</strong></td><td>Средние–Высокие</td><td>Умеренные</td></tr>
</table>

<h2>Почему Халкидики</h2>
<ul>
<li><strong>Разнообразие:</strong> Три разных полуострова — Кассандра для ночной жизни, Ситония для природы, Афон для духовности</li>
<li><strong>Без парома:</strong> Прямой доступ на авто из аэропорта</li>
<li><strong>Инфраструктура:</strong> Крупные отели, всё включено, сотни ресторанов</li>
<li><strong>Экскурсии:</strong> Салоники за 1 час, Метеоры — дневная поездка</li>
</ul>

<h2>Почему Тасос</h2>
<ul>
<li><strong>Островная атмосфера:</strong> Ощущение греческого острова без долгого пути</li>
<li><strong>Изумрудные воды:</strong> Marble Beach, Giola и Porto Vathy поразительны</li>
<li><strong>Компактный:</strong> Весь остров можно объехать за день</li>
<li><strong>Спокойнее:</strong> Меньше людей, чем на Халкидиках, даже в августе</li>
</ul>

<h2>Итог</h2>
<p>Если хотите <strong>разнообразие</strong>, ночную жизнь и лёгкие экскурсии — выбирайте Халкидики. Если мечтаете о <strong>спокойном островном отдыхе</strong> с изумрудными водами — ваш выбор Тасос.</p>`,

      ro: `<h2>Halkidiki sau Thassos: Marea decizie</h2>
<p>Două dintre cele mai populare destinații din nordul Greciei, Halkidiki și Thassos atrag milioane de turiști în fiecare an. Ambele oferă plaje superbe în Marea Egee, dar experiența este foarte diferită.</p>

<table>
<tr><th>Criteriu</th><th>Halkidiki</th><th>Thassos</th></tr>
<tr><td><strong>Acces</strong></td><td>Cu mașina din Salonic (45 min–2 ore)</td><td>Cu feribotul din Keramoti (40 min) sau Kavala (1,5 ore)</td></tr>
<tr><td><strong>Linia de coastă</strong></td><td>500+ km pe 3 peninsule</td><td>~100 km în jurul insulei</td></tr>
<tr><td><strong>Plaje</strong></td><td>Foarte variate: nisip, stâncă, organizate și sălbatice</td><td>Ape smarald, mai mici dar spectaculoase</td></tr>
<tr><td><strong>Viață de noapte</strong></td><td>Vibrantă, mai ales în Kassandra (Kallithea, Hanioti)</td><td>Liniștită, baruri tradiționale</td></tr>
<tr><td><strong>Potrivit pentru</strong></td><td>Familii, cupluri, tineri, grupuri</td><td>Cupluri, iubitori de natură, vacanțe liniștite</td></tr>
<tr><td><strong>Prețuri</strong></td><td>Moderate spre Ridicate</td><td>Moderate</td></tr>
<tr><td><strong>Mașină necesară?</strong></td><td>Da, esențială pentru explorare</td><td>Da, recomandată pentru turul insulei</td></tr>
<tr><td><strong>Excursii de o zi</strong></td><td>Salonic, Meteora, Vergina, Pella</td><td>Kavala, Philippi, Drama (Peștera Aggitis)</td></tr>
</table>

<h2>De ce să alegi Halkidiki</h2>
<ul>
<li><strong>Diversitate:</strong> Trei peninsule distincte — Kassandra pentru viața de noapte, Sithonia pentru natură, Athos pentru spiritualitate</li>
<li><strong>Fără feribot:</strong> Ajungi direct cu mașina de la aeroport</li>
<li><strong>Infrastructură:</strong> Hoteluri mari, resorturi all-inclusive, sute de restaurante și taverne</li>
<li><strong>Excursii ușoare:</strong> Salonic la 1 oră, Meteora pentru o excursie de zi, mormintele regale de la Vergina la 1,5 ore</li>
<li><strong>500 km de coastă:</strong> Chiar și în august, poți găsi golfuri liniștite</li>
</ul>

<h2>De ce să alegi Thassos</h2>
<ul>
<li><strong>Atmosferă insulară:</strong> Simți spiritul insulei grecești fără o călătorie lungă</li>
<li><strong>Ape smarald:</strong> Marble Beach, Giola și Porto Vathy sunt extraordinare</li>
<li><strong>Compact:</strong> Poți face turul insulei într-o zi</li>
<li><strong>Mai liniștit:</strong> Mai puțin aglomerat decât Halkidiki chiar și în august</li>
<li><strong>Accesibil:</strong> Prețuri mai mici la cazare și masă</li>
</ul>

<h2>Verdictul</h2>
<p>Dacă vrei <strong>experiențe diverse</strong>, viață de noapte, excursii ușoare și fără dependență de feribot — alege Halkidiki. Dacă visezi la o <strong>evadare insulară liniștită</strong> cu ape smarald — Thassos este destinația ta. Mulți vizitatori le fac pe amândouă în călătorii separate!</p>`,

      sr: `<h2>Halkidiki ili Tasos: Velika odluka</h2>
<p>Dve od najpopularnijih destinacija u severnoj Grčkoj, Halkidiki i Tasos privlače milione turista svake godine. Obe nude prelepe plaže Egejskog mora, ali iskustvo je veoma različito.</p>

<table>
<tr><th>Kriterijum</th><th>Halkidiki</th><th>Tasos</th></tr>
<tr><td><strong>Pristup</strong></td><td>Kolima iz Soluna (45 min–2 sata)</td><td>Trajekt iz Keramotija (40 min) ili Kavale (1,5 sat)</td></tr>
<tr><td><strong>Obala</strong></td><td>500+ km na 3 poluostrva</td><td>~100 km oko ostrva</td></tr>
<tr><td><strong>Plaže</strong></td><td>Vrlo raznovrsne: peščane, stenovite, uređene i skrivene</td><td>Smaragdne vode, manje ali zadivljujuće</td></tr>
<tr><td><strong>Noćni život</strong></td><td>Živahan, posebno na Kasandri</td><td>Miran, tradicionalni barovi</td></tr>
<tr><td><strong>Najbolje za</strong></td><td>Porodice, parove, mlade, grupe</td><td>Parove, ljubitelje prirode, miran odmor</td></tr>
<tr><td><strong>Cene</strong></td><td>Umerene do Visoke</td><td>Umerene</td></tr>
</table>

<h2>Zašto Halkidiki</h2>
<ul>
<li><strong>Raznovrsnost:</strong> Tri različita poluostrva — Kasandra za noćni život, Sitonija za prirodu, Atos za duhovnost</li>
<li><strong>Bez trajekta:</strong> Direktan pristup kolima sa aerodroma</li>
<li><strong>Infrastruktura:</strong> Veliki hoteli, all-inclusive rizorta, stotine restorana</li>
<li><strong>Izleti:</strong> Solun na 1 sat, Meteora za jednodnevni izlet</li>
</ul>

<h2>Zašto Tasos</h2>
<ul>
<li><strong>Ostrvska atmosfera:</strong> Osećaj grčkog ostrva bez dugog putovanja</li>
<li><strong>Smaragdne vode:</strong> Marble Beach, Giola i Porto Vathy su neverovatni</li>
<li><strong>Kompaktan:</strong> Celo ostrvo možete obići za jedan dan</li>
<li><strong>Mirniji:</strong> Manje gužve nego na Halkidikiju čak i u avgustu</li>
</ul>

<h2>Zaključak</h2>
<p>Ako želite <strong>raznovrsna iskustva</strong>, noćni život i lake izlete — izaberite Halkidiki. Ako sanjate o <strong>mirnom ostrvskom bekstvu</strong> sa smaragdnim vodama — Tasos je vaša destinacija.</p>`,
    },
  },

  {
    slug: 'sithonia',
    icon: 'TreePine',
    color: 'emerald',
    title: {
      el: 'Σιθωνία: Ο Πλήρης Οδηγός',
      en: 'Sithonia: The Complete Guide',
      de: 'Sithonia: Der Komplette Reiseführer',
      bg: 'Ситония: Пълен пътеводител',
      ru: 'Ситония: Полный путеводитель',
      ro: 'Sithonia: Ghid Complet',
      sr: 'Sitonija: Kompletan vodič',
    },
    description: {
      el: 'Χωριά, παραλίες, φύση και στάσεις στη δεύτερη χερσόνησο — ο πιο πράσινος και ήσυχος «δάχτυλο» της Χαλκιδικής.',
      en: 'Villages, beaches, nature, and stops along Halkidiki\'s second peninsula — the greenest and most tranquil finger.',
      de: 'Dörfer, Strände, Natur und Stopps auf Chalkidikis zweiter Halbinsel — dem grünsten und ruhigsten Finger.',
      bg: 'Села, плажове, природа и спирки по втория полуостров на Халкидики — най-зеленият и спокоен „пръст".',
      ru: 'Деревни, пляжи, природа и остановки на втором полуострове Халкидиков — самом зелёном и спокойном «пальце».',
      ro: 'Sate, plaje, natură și opriri pe a doua peninsulă a Halkidikiului — cel mai verde și liniștit „deget".',
      sr: 'Sela, plaže, priroda i stanice na drugom poluostrvu Halkidikija — najzeleniji i najmirniji „prst".',
    },
    metaTitle: {
      el: 'Σιθωνία Χαλκιδικής: Χωριά, Παραλίες & Οδηγός',
      en: 'Sithonia Halkidiki: Villages, Beaches & Guide',
      de: 'Sithonia Chalkidiki: Dörfer, Strände & Reiseführer',
      bg: 'Ситония Халкидики: Села, плажове и пътеводител',
      ru: 'Ситония Халкидики: Деревни, пляжи и путеводитель',
      ro: 'Sithonia Halkidiki: Sate, plaje și ghid',
      sr: 'Sitonija Halkidiki: Sela, plaže i vodič',
    },
    metaDesc: {
      el: 'Ανακαλύψτε τη Σιθωνία: Νικήτη, Νέος Μαρμαράς, Σάρτη, Βουρβουρού, καλύτερες παραλίες, πού να μείνετε και τι να δείτε.',
      en: 'Discover Sithonia: Nikiti, Neos Marmaras, Sarti, Vourvourou, best beaches, where to stay, and what to see.',
      de: 'Entdecken Sie Sithonia: Nikiti, Neos Marmaras, Sarti, Vourvourou, die besten Strände und Unterkünfte.',
      bg: 'Открийте Ситония: Никити, Неос Мармарас, Сарти, Вурвуру, най-добрите плажове и къде да отседнете.',
      ru: 'Откройте Ситонию: Никити, Неос Мармарас, Сарти, Вурвуру, лучшие пляжи, где остановиться и что посмотреть.',
      ro: 'Descoperă Sithonia: Nikiti, Neos Marmaras, Sarti, Vourvourou, cele mai bune plaje și unde să stai.',
      sr: 'Otkrijte Sitoniju: Nikiti, Neos Marmaras, Sarti, Vurvuru, najbolje plaže i gde odsjesti.',
    },
    content: {
      el: `<h2>Σιθωνία: Η φυσική ομορφιά της Χαλκιδικής</h2>
<p>Η Σιθωνία, το μεσαίο «δάχτυλο» της Χαλκιδικής, είναι ο πιο πράσινος και ήρεμος προορισμός στην περιοχή. Πυκνά πευκοδάση κατεβαίνουν ως τη θάλασσα, κρυφοί κολπίσκοι κρύβουν τυρκουάζ νερά, και τα χωριά διατηρούν τον αυθεντικό τους χαρακτήρα.</p>

<h2>Χωριά της Σιθωνίας</h2>
<ul>
<li><strong>Νικήτη:</strong> Η «πύλη» της Σιθωνίας. Το παλιό χωριό με πέτρινα σπίτια είναι ένα από τα ωραιότερα της Χαλκιδικής. Εξαιρετική μελισσοκομία — δοκιμάστε τοπικό μέλι.</li>
<li><strong>Νέος Μαρμαράς:</strong> Η μεγαλύτερη κωμόπολη, χτισμένη αμφιθεατρικά πάνω από το λιμάνι. Πολλά εστιατόρια, μίνι μάρκετ, φαρμακεία.</li>
<li><strong>Σάρτη:</strong> Μεγάλη αμμώδης παραλία με θέα στο Άγιο Όρος. Ζωντανό χωριό, ιδανικό για οικογένειες.</li>
<li><strong>Βουρβουρού:</strong> Γαλήνιος κόλπος με νησάκια, ιδανικό για kayak και SUP.</li>
<li><strong>Πόρτο Κουφό:</strong> Ο μεγαλύτερος φυσικός λιμένας του Αιγαίου, περικυκλωμένος από βράχους. Φρέσκα ψάρια στις ταβέρνες.</li>
<li><strong>Τορώνη:</strong> Αρχαιολογικός χώρος και υπέροχη παραλία σε ένα μέρος.</li>
</ul>

<h2>Κορυφαίες παραλίες</h2>
<ul>
<li><strong>Καβουρότρυπες (Πορτοκάλι):</strong> Μικροί κολπίσκοι με λευκή άμμο και πεύκα — η πιο φωτογραφημένη παραλία</li>
<li><strong>Καρύδι:</strong> Ρηχά τυρκουάζ νερά, ιδανικά για παιδιά</li>
<li><strong>Λαγονήσι:</strong> Κρυφός παράδεισος, πρόσβαση με χωματόδρομο</li>
<li><strong>Φάβα:</strong> Δύο ημικυκλικοί κόλποι σαν πισίνα</li>
<li><strong>Τηγάνια:</strong> Μικρές σπηλιές και βράχια, εξωτική ατμόσφαιρα</li>
</ul>

<h2>Πού να μείνετε</h2>
<ul>
<li><strong>Για ησυχία:</strong> Βουρβουρού, Πόρτο Κουφό</li>
<li><strong>Για οικογένειες:</strong> Σάρτη, Νικήτη</li>
<li><strong>Για ευκολίες:</strong> Νέος Μαρμαράς</li>
<li><strong>Για ρομαντισμό:</strong> Τορώνη, Καλαμίτσι</li>
</ul>

<h2>Η παραλιακή διαδρομή</h2>
<p>Η οδήγηση γύρω από τη Σιθωνία είναι εμπειρία από μόνη της. Ξεκινήστε από τη Νικήτη, κατεβείτε στην ανατολική πλευρά (Βουρβουρού → Σάρτη), γυρίστε στο Πόρτο Κουφό και ανεβείτε στη δυτική (Τορώνη → Νέος Μαρμαράς). Σύνολο: περίπου 100 χλμ.</p>`,

      en: `<h2>Sithonia: The Natural Beauty of Halkidiki</h2>
<p>Sithonia, the middle "finger" of Halkidiki, is the greenest and most peaceful destination in the region. Dense pine forests cascade down to the sea, hidden coves conceal turquoise waters, and villages retain their authentic character. If Kassandra is the party peninsula, Sithonia is where nature lovers come to decompress.</p>

<h2>Villages of Sithonia</h2>
<ul>
<li><strong>Nikiti:</strong> The "gateway" to Sithonia. The old village with stone houses and narrow streets is one of Halkidiki's prettiest. Famous for beekeeping — try the local thyme honey. Good selection of tavernas and shops.</li>
<li><strong>Neos Marmaras:</strong> The largest town, built amphitheatrically above its harbor. You'll find supermarkets, pharmacies, ATMs, and many restaurants. Porto Carras resort is nearby.</li>
<li><strong>Sarti:</strong> A large sandy beach stretching endlessly with views of Mount Athos. Lively village center, ideal for families. Great beach bars and water sports.</li>
<li><strong>Vourvourou:</strong> A serene bay dotted with small islands (Diaporos being the largest). Perfect for kayaking, SUP, and boat trips. The water is impossibly calm.</li>
<li><strong>Porto Koufo:</strong> The largest natural harbor in the Aegean, surrounded by rocky cliffs. A fishing village with excellent fresh-fish tavernas. Wonderfully isolated.</li>
<li><strong>Toroni:</strong> Archaeological ruins and a gorgeous beach in one spot. The ancient fortress overlooks a long stretch of golden sand.</li>
</ul>

<h2>Top Beaches</h2>
<ul>
<li><strong>Kavourotrypes (Orange Beach):</strong> Small rocky coves with white sand and pines reaching the waterline — the most photographed beach in Halkidiki. Arrive early in summer or you won't find space.</li>
<li><strong>Karidi:</strong> Shallow turquoise waters in a sheltered cove, perfect for children and snorkeling. Near Vourvourou.</li>
<li><strong>Lagonisi:</strong> A hidden paradise accessible via a dirt road. Pristine sand, clear water, minimal crowds even in August.</li>
<li><strong>Fava Beach:</strong> Two semicircular bays that look like natural swimming pools, framed by rocky headlands.</li>
<li><strong>Tigania Beach:</strong> Small caves, rock formations, and an exotic atmosphere. Access involves a short walk from the parking area.</li>
</ul>

<h2>Where to Stay by Vibe</h2>
<ul>
<li><strong>Peace and quiet:</strong> Vourvourou, Porto Koufo, Kalamitsi</li>
<li><strong>Family-friendly:</strong> Sarti, Nikiti (good facilities, shallow beaches)</li>
<li><strong>Convenience and amenities:</strong> Neos Marmaras (shops, restaurants, nightlife)</li>
<li><strong>Romantic escape:</strong> Toroni, small Vourvourou studios with sea views</li>
</ul>

<h2>Driving the Coastal Road</h2>
<p>The Sithonia coastal road is an experience in itself. Start from Nikiti, head down the east coast (Vourvourou, Sarti), round the tip at Porto Koufo, and climb back up the west coast (Toroni, Neos Marmaras). Total loop: approximately 100 km. Budget a full day if you want to stop at beaches. The road is paved but narrow in places — drive carefully and enjoy the pine-scented journey.</p>

<h2>Practical Tips</h2>
<ul>
<li>Fill up on fuel at Nikiti or Neos Marmaras — gas stations are sparse in southern Sithonia</li>
<li>Mobile signal can be weak in remote beach areas</li>
<li>Many beaches have no facilities — bring water and snacks</li>
<li>The western coast gets better sunsets; the eastern coast has morning sun</li>
</ul>`,

      de: `<h2>Sithonia: Die natürliche Schönheit Chalkidikis</h2>
<p>Sithonia, der mittlere „Finger" von Chalkidiki, ist das grünste und friedlichste Reiseziel der Region. Dichte Kiefernwälder reichen bis ans Meer, versteckte Buchten bergen türkisfarbenes Wasser, und die Dörfer bewahren ihren authentischen Charakter.</p>

<h2>Dörfer von Sithonia</h2>
<ul>
<li><strong>Nikiti:</strong> Das „Tor" zu Sithonia. Das alte Dorf mit Steinhäusern gehört zu den schönsten Chalkidikis. Berühmt für Imkerei — probieren Sie den lokalen Thymian-Honig.</li>
<li><strong>Neos Marmaras:</strong> Die größte Ortschaft, amphitheatralisch über dem Hafen gebaut. Supermärkte, Apotheken, Geldautomaten und viele Restaurants.</li>
<li><strong>Sarti:</strong> Ein endlos langer Sandstrand mit Blick auf den Berg Athos. Lebhaftes Dorfzentrum, ideal für Familien.</li>
<li><strong>Vourvourou:</strong> Eine ruhige Bucht mit kleinen Inseln. Perfekt zum Kajakfahren und für Bootsausflüge.</li>
<li><strong>Porto Koufo:</strong> Der größte natürliche Hafen der Ägäis, umgeben von Felsklippen. Exzellente Fisch-Tavernen.</li>
<li><strong>Toroni:</strong> Archäologische Ruinen und ein wunderschöner Strand an einem Ort.</li>
</ul>

<h2>Top-Strände</h2>
<ul>
<li><strong>Kavourotrypes (Orange Beach):</strong> Kleine felsige Buchten mit weißem Sand und Kiefern — der meistfotografierte Strand.</li>
<li><strong>Karidi:</strong> Flaches türkisfarbenes Wasser, perfekt für Kinder und zum Schnorcheln.</li>
<li><strong>Lagonisi:</strong> Ein verstecktes Paradies über einen Feldweg erreichbar.</li>
<li><strong>Fava Beach:</strong> Zwei halbkreisförmige Buchten wie natürliche Schwimmbecken.</li>
<li><strong>Tigania Beach:</strong> Kleine Höhlen und Felsformationen mit exotischer Atmosphäre.</li>
</ul>

<h2>Unterkunft nach Stimmung</h2>
<ul>
<li><strong>Ruhe und Frieden:</strong> Vourvourou, Porto Koufo, Kalamitsi</li>
<li><strong>Familienfreundlich:</strong> Sarti, Nikiti</li>
<li><strong>Annehmlichkeiten:</strong> Neos Marmaras</li>
<li><strong>Romantischer Rückzugsort:</strong> Toroni</li>
</ul>

<h2>Die Küstenstraße</h2>
<p>Die Küstenstraße um Sithonia ist ein Erlebnis für sich. Beginnen Sie in Nikiti, fahren Sie die Ostküste hinunter (Vourvourou, Sarti), runden Sie die Spitze bei Porto Koufo und steigen Sie die Westküste hinauf (Toroni, Neos Marmaras). Gesamtschleife: ca. 100 km. Planen Sie einen ganzen Tag ein, wenn Sie an Stränden halten möchten.</p>`,

      bg: `<h2>Ситония: Природната красота на Халкидики</h2>
<p>Ситония, средният „пръст" на Халкидики, е най-зелената и спокойна дестинация в региона. Гъсти борови гори се спускат до морето, скрити заливи крият тюркоазени води, а селата запазват автентичния си характер.</p>

<h2>Села на Ситония</h2>
<ul>
<li><strong>Никити:</strong> „Портата" на Ситония. Старото село с каменни къщи е едно от най-красивите в Халкидики. Прочуто с пчеларство.</li>
<li><strong>Неос Мармарас:</strong> Най-големият град, амфитеатрално построен над пристанището. Супермаркети, аптеки, банкомати.</li>
<li><strong>Сарти:</strong> Дълъг пясъчен плаж с гледка към Атон. Оживено село, идеално за семейства.</li>
<li><strong>Вурвуру:</strong> Спокоен залив с малки островчета. Перфектно за кайак и SUP.</li>
<li><strong>Порто Куфо:</strong> Най-голямото естествено пристанище в Егейско море, заобиколено от скални стени.</li>
<li><strong>Торони:</strong> Археологически руини и прекрасен плаж на едно място.</li>
</ul>

<h2>Топ плажове</h2>
<ul>
<li><strong>Кавуротрипес (Оранжев плаж):</strong> Малки скалисти заливчета с бял пясък и борове — най-фотографираният плаж.</li>
<li><strong>Кариди:</strong> Плитки тюркоазени води, перфектни за деца и шноркелинг.</li>
<li><strong>Лагониси:</strong> Скрит рай, достъпен по черен път.</li>
<li><strong>Фава:</strong> Два полукръгли залива като естествени басейни.</li>
<li><strong>Тигания:</strong> Малки пещери и скални формации с екзотична атмосфера.</li>
</ul>

<h2>Къде да отседнете</h2>
<ul>
<li><strong>За тишина:</strong> Вурвуру, Порто Куфо, Каламици</li>
<li><strong>За семейства:</strong> Сарти, Никити</li>
<li><strong>За удобства:</strong> Неос Мармарас</li>
<li><strong>За романтика:</strong> Торони</li>
</ul>

<h2>Крайбрежният път</h2>
<p>Шофирането около Ситония е преживяване само по себе си. Започнете от Никити, слезте по източния бряг (Вурвуру, Сарти), заобиколете при Порто Куфо и се качете по западния (Торони, Неос Мармарас). Обща обиколка: около 100 км.</p>`,

      ru: `<h2>Ситония: Природная красота Халкидиков</h2>
<p>Ситония — средний «палец» Халкидиков — самое зелёное и спокойное направление региона. Густые сосновые леса спускаются к морю, скрытые бухты прячут бирюзовую воду, а деревни сохраняют свой аутентичный характер.</p>

<h2>Деревни Ситонии</h2>
<ul>
<li><strong>Никити:</strong> «Ворота» Ситонии. Старая деревня с каменными домами — одна из самых красивых в Халкидиках. Знаменитое пчеловодство — попробуйте местный тимьяновый мёд.</li>
<li><strong>Неос Мармарас:</strong> Крупнейший город, амфитеатром над гаванью. Супермаркеты, аптеки, банкоматы, множество ресторанов.</li>
<li><strong>Сарти:</strong> Длинный песчаный пляж с видом на Афон. Оживлённая деревня, идеальна для семей.</li>
<li><strong>Вурвуру:</strong> Тихая бухта с островками. Идеально для каякинга и SUP.</li>
<li><strong>Порто Куфо:</strong> Крупнейшая естественная гавань Эгейского моря, окружённая скалами. Отличные рыбные таверны.</li>
<li><strong>Торони:</strong> Археологические руины и чудесный пляж в одном месте.</li>
</ul>

<h2>Лучшие пляжи</h2>
<ul>
<li><strong>Кавуротрипес (Оранжевый пляж):</strong> Маленькие бухты с белым песком и соснами — самый фотографируемый пляж Халкидиков.</li>
<li><strong>Кариди:</strong> Мелководье с бирюзовой водой, идеально для детей.</li>
<li><strong>Лагониси:</strong> Скрытый рай по грунтовой дороге.</li>
<li><strong>Фава:</strong> Два полукруглых залива как природные бассейны.</li>
<li><strong>Тигания:</strong> Маленькие пещеры и скалы с экзотической атмосферой.</li>
</ul>

<h2>Где остановиться</h2>
<ul>
<li><strong>Для тишины:</strong> Вурвуру, Порто Куфо, Каламици</li>
<li><strong>Для семей:</strong> Сарти, Никити</li>
<li><strong>Для удобств:</strong> Неос Мармарас</li>
<li><strong>Для романтики:</strong> Торони</li>
</ul>

<h2>Прибрежная дорога</h2>
<p>Поездка вокруг Ситонии — это отдельное приключение. Начните из Никити, спуститесь по восточному побережью (Вурвуру → Сарти), обогните мыс у Порто Куфо и поднимитесь по западному (Торони → Неос Мармарас). Весь маршрут: около 100 км.</p>`,

      ro: `<h2>Sithonia: Frumusețea naturală a Halkidikiului</h2>
<p>Sithonia, „degetul" din mijloc al Halkidikiului, este cea mai verde și liniștită destinație din regiune. Păduri dese de pini coboară până la mare, golfuri ascunse ascund ape turcoaz, iar satele își păstrează caracterul autentic.</p>

<h2>Sate din Sithonia</h2>
<ul>
<li><strong>Nikiti:</strong> „Poarta" Sithoniei. Satul vechi cu case de piatră e unul dintre cele mai frumoase din Halkidiki. Renumit pentru apicultură — gustați mierea locală de cimbru.</li>
<li><strong>Neos Marmaras:</strong> Cel mai mare oraș, construit amfiteatral deasupra portului. Supermarketuri, farmacii, bancomate, multe restaurante.</li>
<li><strong>Sarti:</strong> Plajă lungă de nisip cu vedere la Muntele Athos. Sat animat, ideal pentru familii.</li>
<li><strong>Vourvourou:</strong> Golf liniștit cu insulițe. Perfect pentru caiac și SUP.</li>
<li><strong>Porto Koufo:</strong> Cel mai mare port natural din Egee, înconjurat de stânci. Taverne excelente cu pește proaspăt.</li>
<li><strong>Toroni:</strong> Ruine arheologice și o plajă superbă într-un singur loc.</li>
</ul>

<h2>Cele mai bune plaje</h2>
<ul>
<li><strong>Kavourotrypes (Orange Beach):</strong> Golfuri stâncoase cu nisip alb și pini — cea mai fotografiată plajă din Halkidiki.</li>
<li><strong>Karidi:</strong> Apă turcoaz puțin adâncă, perfectă pentru copii și snorkeling.</li>
<li><strong>Lagonisi:</strong> Un paradis ascuns accesibil pe drum de pământ.</li>
<li><strong>Fava Beach:</strong> Două golfuri semicirculare ca niște piscine naturale.</li>
<li><strong>Tigania Beach:</strong> Peșteri mici și formațiuni stâncoase cu atmosferă exotică.</li>
</ul>

<h2>Unde să stai</h2>
<ul>
<li><strong>Pentru liniște:</strong> Vourvourou, Porto Koufo, Kalamitsi</li>
<li><strong>Pentru familii:</strong> Sarti, Nikiti</li>
<li><strong>Pentru facilități:</strong> Neos Marmaras</li>
<li><strong>Pentru romantism:</strong> Toroni</li>
</ul>

<h2>Drumul de coastă</h2>
<p>Conducerea în jurul Sithoniei este o experiență în sine. Pornește din Nikiti, coboară pe coasta de est (Vourvourou → Sarti), ocolește la Porto Koufo și urcă pe coasta de vest (Toroni → Neos Marmaras). Bucla totală: aproximativ 100 km.</p>`,

      sr: `<h2>Sitonija: Prirodna lepota Halkidikija</h2>
<p>Sitonija, srednji „prst" Halkidikija, je najzelenija i najmirnija destinacija u regionu. Guste borove šume se spuštaju do mora, skriveni zalivi kriju tirkizne vode, a sela čuvaju svoj autentičan karakter.</p>

<h2>Sela Sitonije</h2>
<ul>
<li><strong>Nikiti:</strong> „Kapija" Sitonije. Staro selo sa kamenim kućama jedno je od najlepših u Halkidikiju. Poznato po pčelarstvu.</li>
<li><strong>Neos Marmaras:</strong> Najveći grad, amfiteatralno izgrađen iznad luke. Supermarketi, apoteke, bankomati, mnogi restorani.</li>
<li><strong>Sarti:</strong> Dugačka peščana plaža sa pogledom na Atos. Živopisno selo, idealno za porodice.</li>
<li><strong>Vurvuru:</strong> Miran zaliv sa ostrvima. Savršeno za kajak i SUP.</li>
<li><strong>Porto Kufo:</strong> Najveća prirodna luka u Egeju, okružena stenama. Odlične riblje taverne.</li>
<li><strong>Toroni:</strong> Arheološke ruševine i predivna plaža na jednom mestu.</li>
</ul>

<h2>Top plaže</h2>
<ul>
<li><strong>Kavurotripas (Orange Beach):</strong> Mali stenoviti zalivi sa belim peskom i borovima — najfotografisanija plaža.</li>
<li><strong>Karidi:</strong> Plitka tirkizna voda, savršena za decu i ronjenje.</li>
<li><strong>Lagonisi:</strong> Skriveni raj dostupan makadamskim putem.</li>
<li><strong>Fava:</strong> Dva polukružna zaliva kao prirodni bazeni.</li>
<li><strong>Tigania:</strong> Male pećine i stenovite formacije sa egzotičnom atmosferom.</li>
</ul>

<h2>Gde odsjesti</h2>
<ul>
<li><strong>Za mir:</strong> Vurvuru, Porto Kufo, Kalamici</li>
<li><strong>Za porodice:</strong> Sarti, Nikiti</li>
<li><strong>Za udobnosti:</strong> Neos Marmaras</li>
<li><strong>Za romantiku:</strong> Toroni</li>
</ul>

<h2>Obalni put</h2>
<p>Vožnja oko Sitonije je iskustvo samo po sebi. Krenite iz Nikitija, spustite se istočnom obalom (Vurvuru → Sarti), zaobiđite kod Porto Kufa i popnite se zapadnom (Toroni → Neos Marmaras). Ukupna petlja: oko 100 km.</p>`,
    },
  },

  {
    slug: 'kassandra',
    icon: 'Palmtree',
    color: 'cyan',
    title: {
      el: 'Κασσάνδρα: Ο Πλήρης Οδηγός',
      en: 'Kassandra: The Complete Guide',
      de: 'Kassandra: Der Komplette Reiseführer',
      bg: 'Касандра: Пълен пътеводител',
      ru: 'Кассандра: Полный путеводитель',
      ro: 'Kassandra: Ghid Complet',
      sr: 'Kasandra: Kompletan vodič',
    },
    description: {
      el: 'Η πρώτη χερσόνησος — ζωντανή, με δυναμική νυχτερινή ζωή, ιστορικά χωριά, οικογενειακές παραλίες και εύκολη πρόσβαση.',
      en: 'The first peninsula — lively, with vibrant nightlife, historic villages, family beaches, and easy access from Thessaloniki.',
      de: 'Die erste Halbinsel — lebendig, mit pulsierendem Nachtleben, historischen Dörfern und familienfreundlichen Stränden.',
      bg: 'Първият полуостров — жив, с динамичен нощен живот, исторически села, семейни плажове и лесен достъп.',
      ru: 'Первый полуостров — живой, с активной ночной жизнью, историческими деревнями, семейными пляжами и лёгким доступом.',
      ro: 'Prima peninsulă — plină de viață, cu viață de noapte vibrantă, sate istorice, plaje pentru familii și acces ușor.',
      sr: 'Prvo poluostrvo — živahno, sa dinamičnim noćnim životom, istorijskim selima, porodičnim plažama i lakim pristupom.',
    },
    metaTitle: {
      el: 'Κασσάνδρα Χαλκιδικής: Χωριά, Παραλίες & Νυχτερινή Ζωή',
      en: 'Kassandra Halkidiki: Villages, Beaches & Nightlife Guide',
      de: 'Kassandra Chalkidiki: Dörfer, Strände & Nachtleben',
      bg: 'Касандра Халкидики: Села, плажове и нощен живот',
      ru: 'Кассандра Халкидики: Деревни, пляжи и ночная жизнь',
      ro: 'Kassandra Halkidiki: Sate, plaje și viață de noapte',
      sr: 'Kasandra Halkidiki: Sela, plaže i noćni život',
    },
    metaDesc: {
      el: 'Ανακαλύψτε την Κασσάνδρα: Άφυτος, Καλλιθέα, Χανιώτη, παραλίες, νυχτερινή ζωή, ιστορικοί τόποι και πού να μείνετε.',
      en: 'Discover Kassandra: Afytos, Kallithea, Hanioti, top beaches, nightlife, historical sites, and where to stay.',
      de: 'Entdecken Sie Kassandra: Afytos, Kallithea, Hanioti, Strände, Nachtleben und historische Stätten.',
      bg: 'Открийте Касандра: Афитос, Калитеа, Ханиоти, плажове, нощен живот и исторически места.',
      ru: 'Откройте Кассандру: Афитос, Каллифея, Ханиоти, пляжи, ночная жизнь и исторические места.',
      ro: 'Descoperă Kassandra: Afytos, Kallithea, Hanioti, plaje, viață de noapte și locuri istorice.',
      sr: 'Otkrijte Kasandru: Afitos, Kalitea, Hanioti, plaže, noćni život i istorijska mesta.',
    },
    content: {
      el: `<h2>Κασσάνδρα: Το ζωντανό πρόσωπο της Χαλκιδικής</h2>
<p>Η Κασσάνδρα είναι η πρώτη και πιο εύκολα προσβάσιμη χερσόνησος, μόλις 50 λεπτά από τη Θεσσαλονίκη. Είναι ιδανική για όσους θέλουν ζωντανές διακοπές με εξαιρετικές παραλίες, νυχτερινή ζωή και ιστορικά χωριά.</p>

<h2>Χωριά & Περιοχές</h2>
<ul>
<li><strong>Άφυτος:</strong> Πέτρινο χωριό σε βράχο πάνω από τη θάλασσα. Γραφική πλατεία, παραδοσιακά καφενεία, υπέροχα ηλιοβασιλέματα. Το πιο γοητευτικό χωριό της Κασσάνδρας.</li>
<li><strong>Καλλιθέα:</strong> Δυνατή νυχτερινή ζωή με μεγάλα club και beach bars. Θέρμες, ναός Δία Άμμωνος, πολλά εστιατόρια.</li>
<li><strong>Χανιώτη:</strong> Τουριστικό κέντρο, μεγάλη αμμώδης παραλία, εμπορικός πεζόδρομος, κατάλληλο για οικογένειες και νέους.</li>
<li><strong>Πευκοχώρι:</strong> Μεγάλη παραλία, πολλά ξενοδοχεία, ιδανικό για οικογένειες. Κοντά στο ακρωτήριο Κασσάνδρας.</li>
<li><strong>Σίβηρι:</strong> Ιδανικό για οικογένειες, πολιτιστικό φεστιβάλ κάθε καλοκαίρι, παραλία με ρηχά νερά.</li>
<li><strong>Ποσείδι:</strong> Ο φάρος στο ακρωτήριο, αμμώδης παραλία, ήσυχη ατμόσφαιρα.</li>
<li><strong>Νέα Φώκαια:</strong> Παραδοσιακό ψαροχώρι, γνήσιες ταβέρνες με θαλασσινά.</li>
</ul>

<h2>Κορυφαίες Παραλίες</h2>
<ul>
<li><strong>Παραλία Αφύτου:</strong> Κάτω από τους βράχους, με χαλίκι και κρυστάλλινα νερά</li>
<li><strong>Καλλιθέα:</strong> Μεγάλη, οργανωμένη, με πολλά beach bars</li>
<li><strong>Ποσείδι:</strong> Αμμώδης, ιδανική για ηλιοβασίλεμα</li>
<li><strong>Σάνη:</strong> Ιδιωτικές παραλίες του Sani Resort, εξαιρετικές</li>
<li><strong>Χρούσσω:</strong> Ήσυχη, αμμώδης, λιγότερο τουριστική</li>
</ul>

<h2>Νυχτερινή Ζωή</h2>
<p>Η Κασσάνδρα φημίζεται για τα <strong>beach bars</strong> και τα <strong>clubs</strong>. Οι βασικοί προορισμοί:</p>
<ul>
<li>Καλλιθέα: Μεγάλα clubs στην παραλία</li>
<li>Χανιώτη: Μπαρ στον πεζόδρομο</li>
<li>Σίβηρι: Beach bars με μουσικά event</li>
</ul>

<h2>Ιστορικά Σημεία</h2>
<ul>
<li><strong>Κανάλι Ποτίδαιας:</strong> Αρχαίο κανάλι που χωρίζει την Κασσάνδρα από την ηπειρωτική χώρα</li>
<li><strong>Αρχαία Όλυνθος:</strong> Κοντά, εντυπωσιακά ψηφιδωτά δαπέδα</li>
<li><strong>Ναός Δία Άμμωνος:</strong> Στην Καλλιθέα, αρχαίο ιερό</li>
</ul>`,

      en: `<h2>Kassandra: The Lively Face of Halkidiki</h2>
<p>Kassandra is the first and most accessible peninsula, just 50 minutes from Thessaloniki airport. It's the go-to for visitors who want lively holidays with excellent beaches, vibrant nightlife, and charming villages, all with great infrastructure.</p>

<h2>Villages & Areas</h2>
<ul>
<li><strong>Afytos:</strong> A stone-built village perched on a cliff above the sea. Picturesque main square with traditional cafes, artisan shops, and spectacular sunset views over the Thermaikos Gulf. The most charming village on Kassandra.</li>
<li><strong>Kallithea:</strong> The nightlife capital of Halkidiki. Large beach clubs, thermal baths, the ancient Temple of Zeus Ammon, and plenty of restaurants. Popular with younger crowds.</li>
<li><strong>Hanioti:</strong> A well-developed tourist center with a long sandy beach, pedestrian shopping street, and a good mix of family-friendly and lively areas. Mini-markets, restaurants, and beach bars line the waterfront.</li>
<li><strong>Pefkohori:</strong> A large beach resort area, ideal for families. Close to the cape of Kassandra with its lighthouse. Many all-inclusive hotels.</li>
<li><strong>Siviri:</strong> Family-oriented village with a cultural festival every summer (Kassandra Festival at the amphitheater). Shallow waters, safe for children.</li>
<li><strong>Possidi:</strong> The lighthouse at Cape Possidi marks a beautiful sandy beach, with calm waters on both sides of the cape. Peaceful atmosphere.</li>
<li><strong>Nea Fokea:</strong> A traditional fishing village at the peninsula's entrance. The Byzantine Tower of St. Paul overlooks the harbor. Authentic seafood tavernas.</li>
</ul>

<h2>Top Beaches</h2>
<ul>
<li><strong>Afytos Beach:</strong> Below the cliffs, pebbly with crystal-clear water and a dramatic setting</li>
<li><strong>Kallithea Beach:</strong> Long, organized, with multiple beach bars and water sports</li>
<li><strong>Possidi Cape:</strong> Sandy spit with water on both sides, perfect for sunset</li>
<li><strong>Sani Beach:</strong> Private resort beaches with exceptional facilities</li>
<li><strong>Hanioti Beach:</strong> Wide sandy stretch, great for families with gentle slope into the sea</li>
<li><strong>Kriopigi Beach:</strong> Less crowded, pine-fringed, cooler waters (the name means "cold spring")</li>
</ul>

<h2>Nightlife Scene</h2>
<p>Kassandra has the best nightlife in Halkidiki. The main hubs:</p>
<ul>
<li><strong>Kallithea:</strong> Large beach clubs with international DJs, open-air parties running until dawn</li>
<li><strong>Hanioti:</strong> Bars and cocktail lounges on the pedestrian street, more relaxed than Kallithea</li>
<li><strong>Siviri:</strong> Beach bars with music events, especially popular with families by day and younger crowds by night</li>
<li><strong>Sani Resort:</strong> Upscale bars and the Sani Festival with jazz and classical music performances</li>
</ul>

<h2>Family-Friendly Areas</h2>
<p>The best areas for families with children:</p>
<ul>
<li><strong>Siviri:</strong> Shallow waters, playground, calm atmosphere</li>
<li><strong>Pefkohori:</strong> All-inclusive hotels, kids' clubs, organized beaches</li>
<li><strong>Hanioti:</strong> Everything within walking distance, pediatrician available in summer</li>
<li><strong>Nea Fokea:</strong> Quiet, affordable, authentic Greek family experience</li>
</ul>

<h2>Historical Sites</h2>
<ul>
<li><strong>Nea Potidea Canal:</strong> An ancient waterway separating Kassandra from the mainland, originally dug in the 1st century BC. Walk along both sides.</li>
<li><strong>Ancient Olynthos (nearby):</strong> Impressive floor mosaics from the 4th century BC, one of the best-preserved classical Greek city plans</li>
<li><strong>Temple of Zeus Ammon:</strong> In Kallithea, a 4th-century BC sanctuary with restored columns</li>
<li><strong>Nea Fokea Tower:</strong> Byzantine-era Tower of St. Paul with a chapel and harbor views</li>
</ul>

<h2>Where to Stay</h2>
<ul>
<li><strong>Budget:</strong> Nea Fokea, Kriopigi — affordable rooms and apartments</li>
<li><strong>Mid-range families:</strong> Hanioti, Pefkohori — good value with amenities</li>
<li><strong>Nightlife seekers:</strong> Kallithea — walking distance to clubs</li>
<li><strong>Luxury:</strong> Sani Resort, Afytos boutique hotels — premium experience</li>
<li><strong>Charm:</strong> Afytos — stone guesthouses with character</li>
</ul>`,

      de: `<h2>Kassandra: Das lebhafte Gesicht Chalkidikis</h2>
<p>Kassandra ist die erste und am leichtesten erreichbare Halbinsel, nur 50 Minuten vom Flughafen Thessaloniki entfernt. Sie bietet lebhafte Ferien mit exzellenten Stränden, pulsierendem Nachtleben und charmanten Dörfern.</p>

<h2>Dörfer & Gebiete</h2>
<ul>
<li><strong>Afytos:</strong> Steinernes Dorf auf einer Klippe über dem Meer. Malerischer Hauptplatz, traditionelle Cafés und spektakuläre Sonnenuntergänge.</li>
<li><strong>Kallithea:</strong> Die Nachtleben-Hauptstadt von Chalkidiki. Große Beach-Clubs, Thermalbäder, der antike Tempel des Zeus Ammon.</li>
<li><strong>Hanioti:</strong> Entwickeltes Touristenzentrum mit langem Sandstrand, Fußgängerzone und guter Mischung aus familienfreundlich und lebendig.</li>
<li><strong>Pefkohori:</strong> Großer Badeort, ideal für Familien. Viele All-Inclusive-Hotels.</li>
<li><strong>Siviri:</strong> Familienorientiert mit einem jährlichen Kulturfestival im Amphitheater.</li>
<li><strong>Possidi:</strong> Leuchtturm am Kap Possidi, schöner Sandstrand, ruhige Atmosphäre.</li>
<li><strong>Nea Fokea:</strong> Traditionelles Fischerdorf mit byzantinischem Turm und authentischen Meeresfrüchte-Tavernen.</li>
</ul>

<h2>Top-Strände</h2>
<ul>
<li><strong>Afytos Strand:</strong> Unter den Klippen, kieselig mit kristallklarem Wasser</li>
<li><strong>Kallithea Strand:</strong> Lang, organisiert, viele Beach-Bars</li>
<li><strong>Kap Possidi:</strong> Sandbank mit Wasser auf beiden Seiten</li>
<li><strong>Sani Strand:</strong> Private Resort-Strände mit erstklassigen Einrichtungen</li>
</ul>

<h2>Nachtleben</h2>
<ul>
<li><strong>Kallithea:</strong> Große Beach-Clubs mit internationalen DJs</li>
<li><strong>Hanioti:</strong> Bars und Cocktail-Lounges in der Fußgängerzone</li>
<li><strong>Sani Resort:</strong> Gehobene Bars und das Sani-Festival mit Jazz und Klassik</li>
</ul>

<h2>Historische Stätten</h2>
<ul>
<li><strong>Kanal von Nea Potidea:</strong> Antiker Wasserweg, der Kassandra vom Festland trennt</li>
<li><strong>Antikes Olynth:</strong> Beeindruckende Bodenmosaike aus dem 4. Jh. v. Chr.</li>
<li><strong>Tempel des Zeus Ammon:</strong> In Kallithea, ein Heiligtum aus dem 4. Jh. v. Chr.</li>
</ul>`,

      bg: `<h2>Касандра: Живото лице на Халкидики</h2>
<p>Касандра е първият и най-лесно достъпен полуостров, на само 50 минути от летище Солун. Идеална за тези, които искат оживена почивка с отлични плажове, динамичен нощен живот и чаровни села.</p>

<h2>Села и райони</h2>
<ul>
<li><strong>Афитос:</strong> Каменно село на скала над морето. Живописен площад, традиционни кафенета и зашеметяващи залези.</li>
<li><strong>Калитеа:</strong> Столицата на нощния живот. Големи плажни клубове, термални бани, храм на Зевс Амон.</li>
<li><strong>Ханиоти:</strong> Развит туристически център с дълъг пясъчен плаж и пешеходна зона за пазаруване.</li>
<li><strong>Пефкохори:</strong> Голям курортен район, идеален за семейства. Много ол-инклузив хотели.</li>
<li><strong>Сивири:</strong> Семеен, с културен фестивал всяко лято. Плитки води за деца.</li>
<li><strong>Посиди:</strong> Фар на нос Посиди, пясъчен плаж, спокойна атмосфера.</li>
<li><strong>Неа Фокеа:</strong> Традиционно рибарско село с византийска кула и автентични таверни.</li>
</ul>

<h2>Топ плажове</h2>
<ul>
<li><strong>Плаж Афитос:</strong> Под скалите, с камъчета и кристално чиста вода</li>
<li><strong>Плаж Калитеа:</strong> Дълъг, организиран, с много плажни барове</li>
<li><strong>Нос Посиди:</strong> Пясъчна коса с вода от двете страни</li>
<li><strong>Плаж Сани:</strong> Частни курортни плажове с изключителни удобства</li>
</ul>

<h2>Нощен живот</h2>
<ul>
<li><strong>Калитеа:</strong> Големи плажни клубове с международни DJ-и</li>
<li><strong>Ханиоти:</strong> Барове и коктейл лаунджове на пешеходната улица</li>
<li><strong>Сани Ризорт:</strong> Луксозни барове и Сани Фестивал с джаз и класика</li>
</ul>

<h2>Исторически забележителности</h2>
<ul>
<li><strong>Канал Потидея:</strong> Древен воден път, разделящ Касандра от материка</li>
<li><strong>Древен Олинтос:</strong> Впечатляващи подови мозайки от IV в. пр.н.е.</li>
<li><strong>Храм на Зевс Амон:</strong> В Калитеа, светилище от IV в. пр.н.е.</li>
</ul>`,

      ru: `<h2>Кассандра: Живое лицо Халкидиков</h2>
<p>Кассандра — первый и самый доступный полуостров, всего 50 минут от аэропорта Салоник. Идеальна для тех, кто хочет активный отдых с отличными пляжами, яркой ночной жизнью и очаровательными деревнями.</p>

<h2>Деревни и районы</h2>
<ul>
<li><strong>Афитос:</strong> Каменная деревня на утёсе над морем. Живописная площадь, традиционные кафе и потрясающие закаты.</li>
<li><strong>Каллифея:</strong> Столица ночной жизни Халкидиков. Большие пляжные клубы, термальные бани, храм Зевса Аммона.</li>
<li><strong>Ханиоти:</strong> Развитый туристический центр с длинным песчаным пляжем и пешеходной улицей.</li>
<li><strong>Пефкохори:</strong> Большой курортный район, идеальный для семей. Много отелей «всё включено».</li>
<li><strong>Сивири:</strong> Семейный, с культурным фестивалем каждое лето. Мелководье для детей.</li>
<li><strong>Поссиди:</strong> Маяк на мысе, песчаный пляж, спокойная атмосфера.</li>
<li><strong>Неа Фокея:</strong> Традиционная рыбацкая деревня с византийской башней и аутентичными тавернами.</li>
</ul>

<h2>Лучшие пляжи</h2>
<ul>
<li><strong>Пляж Афитос:</strong> Под утёсами, галька и кристально чистая вода</li>
<li><strong>Пляж Каллифея:</strong> Длинный, оборудованный, с пляжными барами</li>
<li><strong>Мыс Поссиди:</strong> Песчаная коса с водой с обеих сторон</li>
<li><strong>Пляж Сани:</strong> Частные пляжи курорта с первоклассным сервисом</li>
</ul>

<h2>Ночная жизнь</h2>
<ul>
<li><strong>Каллифея:</strong> Большие пляжные клубы с международными диджеями</li>
<li><strong>Ханиоти:</strong> Бары и коктейльные лаунджи на пешеходной улице</li>
<li><strong>Сани Ризорт:</strong> Элитные бары и фестиваль Сани с джазом и классической музыкой</li>
</ul>

<h2>Исторические места</h2>
<ul>
<li><strong>Канал Потидеи:</strong> Древний водный путь, отделяющий Кассандру от материка</li>
<li><strong>Древний Олинф:</strong> Впечатляющие напольные мозаики IV века до н.э.</li>
<li><strong>Храм Зевса Аммона:</strong> В Каллифее, святилище IV века до н.э.</li>
</ul>`,

      ro: `<h2>Kassandra: Fața plină de viață a Halkidikiului</h2>
<p>Kassandra este prima și cea mai accesibilă peninsulă, la doar 50 de minute de aeroportul Salonic. Ideală pentru vacanțe pline de viață, cu plaje excelente, viață de noapte vibrantă și sate pitorești.</p>

<h2>Sate și zone</h2>
<ul>
<li><strong>Afytos:</strong> Sat de piatră pe o stâncă deasupra mării. Piață pictorească, cafenele tradiționale și apusuri spectaculoase.</li>
<li><strong>Kallithea:</strong> Capitala vieții de noapte din Halkidiki. Cluburi mari pe plajă, băi termale, Templul lui Zeus Ammon.</li>
<li><strong>Hanioti:</strong> Centru turistic dezvoltat cu plajă lungă de nisip și stradă pietonală comercială.</li>
<li><strong>Pefkohori:</strong> Zonă mare de stațiune, ideală pentru familii. Multe hoteluri all-inclusive.</li>
<li><strong>Siviri:</strong> Orientat spre familii, cu festival cultural în fiecare vară. Ape puțin adânci pentru copii.</li>
<li><strong>Possidi:</strong> Far la Cap Possidi, plajă de nisip, atmosferă liniștită.</li>
<li><strong>Nea Fokea:</strong> Sat tradițional de pescari cu turn bizantin și taverne autentice cu fructe de mare.</li>
</ul>

<h2>Cele mai bune plaje</h2>
<ul>
<li><strong>Plaja Afytos:</strong> Sub stânci, cu pietriș și apă cristalină</li>
<li><strong>Plaja Kallithea:</strong> Lungă, organizată, cu multe baruri pe plajă</li>
<li><strong>Capul Possidi:</strong> Limbă de nisip cu apă pe ambele părți</li>
<li><strong>Plaja Sani:</strong> Plaje private de resort cu facilități excepționale</li>
</ul>

<h2>Viață de noapte</h2>
<ul>
<li><strong>Kallithea:</strong> Cluburi mari pe plajă cu DJ internaționali</li>
<li><strong>Hanioti:</strong> Baruri și lounge-uri pe strada pietonală</li>
<li><strong>Sani Resort:</strong> Baruri de lux și Festivalul Sani cu jazz și muzică clasică</li>
</ul>

<h2>Locuri istorice</h2>
<ul>
<li><strong>Canalul Potidea:</strong> Canal antic care separă Kassandra de continent</li>
<li><strong>Olynthos antic:</strong> Mozaicuri impresionante de podea din sec. IV î.Hr.</li>
<li><strong>Templul lui Zeus Ammon:</strong> La Kallithea, sanctuar din sec. IV î.Hr.</li>
</ul>`,

      sr: `<h2>Kasandra: Živahno lice Halkidikija</h2>
<p>Kasandra je prvo i najdostupnije poluostrvo, na samo 50 minuta od aerodroma Soluna. Idealna za one koji žele živahan odmor sa odličnim plažama, dinamičnim noćnim životom i šarmantnim selima.</p>

<h2>Sela i oblasti</h2>
<ul>
<li><strong>Afitos:</strong> Kameno selo na litici iznad mora. Slikovit trg, tradicionalne kafane i spektakularni zalasci sunca.</li>
<li><strong>Kalitea:</strong> Prestonica noćnog života Halkidikija. Veliki plaže klubovi, termalne banje, Hram Zevsa Amona.</li>
<li><strong>Hanioti:</strong> Razvijeni turistički centar sa dugačkom peščanom plažom i pešačkom zonom.</li>
<li><strong>Pefkohori:</strong> Veliki odmarališni prostor, idealan za porodice. Mnogi all-inclusive hoteli.</li>
<li><strong>Siviri:</strong> Porodično orijentisan, sa kulturnim festivalom svakog leta. Plitke vode za decu.</li>
<li><strong>Posidi:</strong> Svetionik na rtu, peščana plaža, mirna atmosfera.</li>
<li><strong>Nea Fokea:</strong> Tradicionalno ribarsko selo sa vizantijskom kulom i autentičnim tavernama.</li>
</ul>

<h2>Top plaže</h2>
<ul>
<li><strong>Plaža Afitos:</strong> Ispod litica, šljunak i kristalno čista voda</li>
<li><strong>Plaža Kalitea:</strong> Duga, uređena, sa mnogo plaža barova</li>
<li><strong>Rt Posidi:</strong> Peščani sprud sa vodom sa obe strane</li>
<li><strong>Plaža Sani:</strong> Privatne plaže rizorta sa izuzetnim sadržajima</li>
</ul>

<h2>Noćni život</h2>
<ul>
<li><strong>Kalitea:</strong> Veliki plaža klubovi sa međunarodnim DJ-evima</li>
<li><strong>Hanioti:</strong> Barovi i koktel loundži na pešačkoj ulici</li>
<li><strong>Sani Rizort:</strong> Luksuzni barovi i Sani Festival sa džezom i klasičnom muzikom</li>
</ul>

<h2>Istorijske znamenitosti</h2>
<ul>
<li><strong>Kanal Potideje:</strong> Drevni vodeni put koji odvaja Kasandru od kopna</li>
<li><strong>Drevni Olint:</strong> Impresivni podni mozaici iz IV veka pre n.e.</li>
<li><strong>Hram Zevsa Amona:</strong> U Kalitei, svetilište iz IV veka pre n.e.</li>
</ul>`,
    },
  },

  {
    slug: 'day-trips',
    icon: 'Compass',
    color: 'indigo',
    title: {
      el: 'Ημερήσιες Εκδρομές από τη Χαλκιδική',
      en: 'Day Trips from Halkidiki',
      de: 'Tagesausflüge von Chalkidiki',
      bg: 'Еднодневни екскурзии от Халкидики',
      ru: 'Однодневные поездки из Халкидиков',
      ro: 'Excursii de o zi din Halkidiki',
      sr: 'Jednodnevni izleti iz Halkidikija',
    },
    description: {
      el: 'Θεσσαλονίκη, Μετέωρα, Βεργίνα, Πέλλα, Έδεσσα, σπήλαιο Πετραλώνων, Αρναία — οι καλύτερες ημερήσιες εκδρομές.',
      en: 'Thessaloniki, Meteora, Vergina, Pella, Edessa, Petralona Cave, Arnea — the best day trips from your Halkidiki base.',
      de: 'Thessaloniki, Meteora, Vergina, Pella, Edessa, Petralona-Höhle, Arnea — die besten Tagesausflüge.',
      bg: 'Солун, Метеора, Вергина, Пела, Едеса, пещера Петралона, Арнеа — най-добрите еднодневни екскурзии.',
      ru: 'Салоники, Метеоры, Вергина, Пелла, Эдесса, пещера Петралона, Арнеа — лучшие однодневные поездки.',
      ro: 'Salonic, Meteora, Vergina, Pella, Edessa, Peștera Petralona, Arnea — cele mai bune excursii de o zi.',
      sr: 'Solun, Meteora, Vergina, Pela, Edesa, pećina Petralona, Arnea — najbolji jednodnevni izleti.',
    },
    metaTitle: {
      el: 'Ημερήσιες εκδρομές Χαλκιδική: Μετέωρα, Βεργίνα, Θεσσαλονίκη',
      en: 'Day Trips from Halkidiki: Meteora, Vergina, Thessaloniki',
      de: 'Tagesausflüge Chalkidiki: Meteora, Vergina, Thessaloniki',
      bg: 'Еднодневни екскурзии Халкидики: Метеора, Вергина, Солун',
      ru: 'Однодневные поездки из Халкидиков: Метеоры, Вергина, Салоники',
      ro: 'Excursii de o zi Halkidiki: Meteora, Vergina, Salonic',
      sr: 'Jednodnevni izleti Halkidiki: Meteora, Vergina, Solun',
    },
    metaDesc: {
      el: 'Ημερήσιες εκδρομές από τη Χαλκιδική: Θεσσαλονίκη, Μετέωρα, Βεργίνα, Πέλλα, Έδεσσα και αξιοθέατα εντός Χαλκιδικής.',
      en: 'Best day trips from Halkidiki: Thessaloniki, Meteora monasteries, Vergina royal tombs, Pella, Edessa waterfalls, and more.',
      de: 'Beste Tagesausflüge von Chalkidiki: Thessaloniki, Meteora-Klöster, Vergina-Königsgräber, Pella und Edessa.',
      bg: 'Най-добри еднодневни екскурзии от Халкидики: Солун, манастири Метеора, кралски гробници Вергина, Пела, Едеса.',
      ru: 'Лучшие однодневные поездки из Халкидиков: Салоники, монастыри Метеоры, гробницы Вергины, Пелла, водопады Эдессы.',
      ro: 'Cele mai bune excursii de o zi din Halkidiki: Salonic, mănăstirile Meteora, mormintele regale Vergina, Pella, Edessa.',
      sr: 'Najbolji jednodnevni izleti iz Halkidikija: Solun, manastiri Meteora, kraljevske grobnice Vergina, Pela, Edesa.',
    },
    content: {
      el: `<h2>Εκδρομές εκτός Χαλκιδικής</h2>

<h2>Θεσσαλονίκη (1 ώρα)</h2>
<p>Η δεύτερη μεγαλύτερη πόλη της Ελλάδας, με τον Λευκό Πύργο, τη Ροτόντα, τα βυζαντινά μνημεία (UNESCO), την παραλία και εξαιρετική γαστρονομία. Ιδανική για μια ημέρα αστικής περιήγησης.</p>

<h2>Μετέωρα (3 ώρες)</h2>
<p>Μοναστήρια κρεμασμένα σε γιγάντιους βράχους — μνημείο UNESCO. Επισκεφθείτε 2-3 μοναστήρια, αξίζει η μεγάλη διαδρομή. Ξεκινήστε νωρίς το πρωί.</p>

<h2>Βεργίνα (1,5 ώρα)</h2>
<p>Οι βασιλικοί τάφοι του Φιλίππου Β΄, πατέρα του Μεγάλου Αλεξάνδρου. Εντυπωσιακό υπόγειο μουσείο με χρυσά ευρήματα. Μνημείο UNESCO.</p>

<h2>Πέλλα (1,5 ώρα)</h2>
<p>Γενέτειρα του Μεγάλου Αλεξάνδρου. Αρχαιολογικός χώρος με ψηφιδωτά και σύγχρονο μουσείο.</p>

<h2>Έδεσσα (2 ώρες)</h2>
<p>Η πόλη με τους καταρράκτες μέσα στο κέντρο. Ρομαντικός περίπατος δίπλα στα νερά, ιδανική για ζευγάρια.</p>

<h2>Εντός Χαλκιδικής</h2>
<ul>
<li><strong>Σπήλαιο Πετραλώνων:</strong> Τα αρχαιότερα ανθρώπινα ευρήματα στην Ευρώπη (700.000 ετών)</li>
<li><strong>Αρναία:</strong> Παραδοσιακό ορεινό χωριό, γνωστό για το παζάρι του Σαββάτου</li>
<li><strong>Κρουαζιέρα στο Άγιο Όρος:</strong> Πλοήγηση κατά μήκος της ακτής για θέα των μοναστηριών</li>
</ul>`,

      en: `<h2>Day Trips Beyond Halkidiki</h2>

<h2>Thessaloniki (1 hour)</h2>
<p>Greece's vibrant second city is an easy day trip from any point in Halkidiki. Highlights include the White Tower, the Rotunda, Byzantine churches (UNESCO), the waterfront promenade, Modiano Market for food, and the Archaeological Museum. A perfect city break from beach life. Leave early to maximize your time.</p>

<h2>Meteora (3 hours)</h2>
<p>Monasteries perched on towering rock pillars — a UNESCO World Heritage site and one of Greece's most iconic landscapes. You can visit 2-3 monasteries in a day. The drive through the Thessalian plain is scenic. Depart by 7 AM to make the most of the day. Organized tours from Halkidiki are available but renting a car gives more flexibility.</p>

<h2>Vergina (1.5 hours)</h2>
<p>The royal tombs of Philip II, father of Alexander the Great, discovered in 1977. The underground museum is extraordinary — gold crowns, armor, and artifacts in their original burial setting. A UNESCO World Heritage site and one of the most important archaeological discoveries in Greece. Allow 1.5-2 hours for the museum.</p>

<h2>Pella (1.5 hours)</h2>
<p>The birthplace of Alexander the Great and ancient capital of Macedonia. The archaeological site features stunning pebble mosaics, and the modern museum houses artifacts from the kingdom's golden age. Often combined with Vergina in a single day trip.</p>

<h2>Edessa (2 hours)</h2>
<p>Famous for its waterfalls cascading through the city center — a unique sight in Greece. Walk behind the waterfall curtain, explore the old quarter, and enjoy the cool microclimate. A romantic stop, especially popular with couples. Can be combined with Pella on the return route.</p>

<h2>Within Halkidiki</h2>
<ul>
<li><strong>Petralona Cave:</strong> One of Europe's most important paleontological sites, with stalactites, stalagmites, and evidence of human habitation dating back 700,000 years. The cave maintains a constant 17 degrees Celsius year-round. Allow 1 hour for the guided tour.</li>
<li><strong>Arnea Saturday Market:</strong> A traditional mountain village known for its Saturday bazaar where locals sell honey, olive oil, handmade textiles, and fresh produce. Beautiful stone architecture and plane-tree-shaded squares.</li>
<li><strong>Mount Athos Cruise:</strong> A boat trip along the western coast of the Athos peninsula, passing by the monasteries without landing (which requires a special permit for men only). Departs from Ouranoupoli. A unique way to see this UNESCO monastic community from the sea.</li>
</ul>

<table>
<tr><th>Destination</th><th>Distance from Kassandra</th><th>Distance from Sithonia</th><th>Highlights</th></tr>
<tr><td>Thessaloniki</td><td>~1 hr</td><td>~1.5 hrs</td><td>White Tower, museums, food</td></tr>
<tr><td>Meteora</td><td>~3 hrs</td><td>~3.5 hrs</td><td>Cliff-top monasteries</td></tr>
<tr><td>Vergina</td><td>~1.5 hrs</td><td>~2 hrs</td><td>Royal tombs, gold artifacts</td></tr>
<tr><td>Pella</td><td>~1.5 hrs</td><td>~2 hrs</td><td>Alexander's birthplace, mosaics</td></tr>
<tr><td>Edessa</td><td>~2 hrs</td><td>~2.5 hrs</td><td>City waterfalls</td></tr>
<tr><td>Petralona Cave</td><td>~30 min</td><td>~45 min</td><td>Prehistoric cave</td></tr>
</table>`,

      de: `<h2>Tagesausflüge von Chalkidiki</h2>

<h2>Thessaloniki (1 Stunde)</h2>
<p>Griechenlands lebendige zweitgrößte Stadt mit dem Weißen Turm, der Rotunda, byzantinischen Kirchen (UNESCO), der Uferpromenade und dem Modiano-Markt. Ein perfekter Städtetrip vom Strand.</p>

<h2>Meteora (3 Stunden)</h2>
<p>Klöster auf riesigen Felssäulen — UNESCO-Weltkulturerbe. Besuchen Sie 2-3 Klöster an einem Tag. Starten Sie früh morgens.</p>

<h2>Vergina (1,5 Stunden)</h2>
<p>Die Königsgräber Philipps II., Vater Alexanders des Großen. Außergewöhnliches unterirdisches Museum mit Goldkronen und Artefakten. UNESCO-Weltkulturerbe.</p>

<h2>Pella (1,5 Stunden)</h2>
<p>Geburtsort Alexanders des Großen. Archäologische Stätte mit beeindruckenden Kieselmosaiken und modernem Museum.</p>

<h2>Edessa (2 Stunden)</h2>
<p>Berühmt für Wasserfälle mitten im Stadtzentrum. Gehen Sie hinter den Wasservorhang, romantisch für Paare.</p>

<h2>Innerhalb von Chalkidiki</h2>
<ul>
<li><strong>Petralona-Höhle:</strong> Europas älteste menschliche Spuren (700.000 Jahre). Geführte Tour ca. 1 Stunde.</li>
<li><strong>Arnea Samstagmarkt:</strong> Traditionelles Bergdorf mit Honig, Olivenöl und handgefertigten Textilien.</li>
<li><strong>Athos-Kreuzfahrt:</strong> Bootsfahrt entlang der Küste der Athos-Halbinsel mit Blick auf die Klöster. Ab Ouranoupoli.</li>
</ul>`,

      bg: `<h2>Еднодневни екскурзии от Халкидики</h2>

<h2>Солун (1 час)</h2>
<p>Вторият по големина град в Гърция с Белата кула, Ротондата, византийски църкви (UNESCO), крайбрежната алея и пазар Модиано.</p>

<h2>Метеора (3 часа)</h2>
<p>Манастири на гигантски скални стълбове — обект на UNESCO. Посетете 2-3 манастира за един ден. Тръгнете рано сутринта.</p>

<h2>Вергина (1,5 часа)</h2>
<p>Кралските гробници на Филип II, баща на Александър Велики. Впечатляващ подземен музей със златни корони и артефакти. Обект на UNESCO.</p>

<h2>Пела (1,5 часа)</h2>
<p>Родно място на Александър Велики. Археологически обект с мозайки и модерен музей.</p>

<h2>Едеса (2 часа)</h2>
<p>Известна с водопадите в центъра на града. Романтична разходка зад водната завеса.</p>

<h2>В Халкидики</h2>
<ul>
<li><strong>Пещера Петралона:</strong> Най-старите човешки следи в Европа (700 000 години).</li>
<li><strong>Пазар в Арнеа:</strong> Традиционно планинско село, съботен базар с мед, зехтин и текстил.</li>
<li><strong>Круиз до Атон:</strong> Лодка по западния бряг на Атон с гледка към манастирите. От Уранополис.</li>
</ul>`,

      ru: `<h2>Однодневные поездки из Халкидиков</h2>

<h2>Салоники (1 час)</h2>
<p>Второй по величине город Греции с Белой башней, Ротондой, византийскими церквями (ЮНЕСКО), набережной и рынком Модиано. Идеальный городской перерыв от пляжного отдыха.</p>

<h2>Метеоры (3 часа)</h2>
<p>Монастыри на гигантских скальных столбах — объект ЮНЕСКО и один из самых узнаваемых пейзажей Греции. За день можно посетить 2-3 монастыря. Выезжайте рано утром.</p>

<h2>Вергина (1,5 часа)</h2>
<p>Царские гробницы Филиппа II, отца Александра Македонского. Потрясающий подземный музей с золотыми коронами и артефактами. Объект ЮНЕСКО.</p>

<h2>Пелла (1,5 часа)</h2>
<p>Родина Александра Македонского и древняя столица Македонии. Мозаики и современный музей.</p>

<h2>Эдесса (2 часа)</h2>
<p>Знаменита водопадами прямо в центре города. Романтическая прогулка за водяной завесой.</p>

<h2>В Халкидиках</h2>
<ul>
<li><strong>Пещера Петралона:</strong> Древнейшие следы человека в Европе (700 000 лет). Экскурсия около 1 часа.</li>
<li><strong>Субботний рынок Арнеа:</strong> Горная деревня с мёдом, оливковым маслом и ручным текстилем.</li>
<li><strong>Круиз к Афону:</strong> Поездка на лодке вдоль побережья полуострова Афон с видом на монастыри. Из Уранополиса.</li>
</ul>`,

      ro: `<h2>Excursii de o zi din Halkidiki</h2>

<h2>Salonic (1 oră)</h2>
<p>Al doilea oraș al Greciei, cu Turnul Alb, Rotonda, biserici bizantine (UNESCO), faleza și Piața Modiano. O pauză urbană perfectă de la viața de plajă.</p>

<h2>Meteora (3 ore)</h2>
<p>Mănăstiri pe stâlpi uriași de stâncă — sit UNESCO și unul dintre cele mai emblematice peisaje ale Greciei. Poți vizita 2-3 mănăstiri într-o zi. Pleacă devreme dimineața.</p>

<h2>Vergina (1,5 ore)</h2>
<p>Mormintele regale ale lui Filip al II-lea, tatăl lui Alexandru cel Mare. Muzeu subteran extraordinar cu coroane de aur și artefacte. Sit UNESCO.</p>

<h2>Pella (1,5 ore)</h2>
<p>Locul nașterii lui Alexandru cel Mare și capitala antică a Macedoniei. Mozaicuri și muzeu modern.</p>

<h2>Edessa (2 ore)</h2>
<p>Celebră pentru cascadele din centrul orașului. Plimbare romantică în spatele cortinei de apă.</p>

<h2>În Halkidiki</h2>
<ul>
<li><strong>Peștera Petralona:</strong> Cele mai vechi urme umane din Europa (700.000 de ani). Tur ghidat de ~1 oră.</li>
<li><strong>Piața de sâmbătă din Arnea:</strong> Sat montan tradițional cu miere, ulei de măsline și textile artizanale.</li>
<li><strong>Croazieră la Athos:</strong> Cu barca de-a lungul coastei peninsulei Athos cu vedere la mănăstiri. Din Ouranoupoli.</li>
</ul>`,

      sr: `<h2>Jednodnevni izleti iz Halkidikija</h2>

<h2>Solun (1 sat)</h2>
<p>Drugi po veličini grad Grčke sa Belom kulom, Rotondom, vizantijskim crkvama (UNESCO), kejom i tržnicom Modijano.</p>

<h2>Meteora (3 sata)</h2>
<p>Manastiri na gigantskim stenskim stubovima — UNESCO svetska baština. Posetite 2-3 manastira za jedan dan. Krenite rano ujutru.</p>

<h2>Vergina (1,5 sat)</h2>
<p>Kraljevske grobnice Filipa II, oca Aleksandra Velikog. Izuzetan podzemni muzej sa zlatnim krunama i artefaktima. UNESCO baština.</p>

<h2>Pela (1,5 sat)</h2>
<p>Rodno mesto Aleksandra Velikog i drevna prestonica Makedonije. Mozaici i moderan muzej.</p>

<h2>Edesa (2 sata)</h2>
<p>Poznata po vodopadima u centru grada. Romantična šetnja iza vodene zavese.</p>

<h2>U Halkidikiju</h2>
<ul>
<li><strong>Pećina Petralona:</strong> Najstariji ljudski tragovi u Evropi (700.000 godina). Obilazak oko 1 sat.</li>
<li><strong>Subotnja pijaca Arnea:</strong> Tradicionalno planinsko selo sa medom, maslinovim uljem i ručno rađenim tekstilom.</li>
<li><strong>Krstarenje do Atosa:</strong> Brodom duž obale poluostrva Atos sa pogledom na manastire. Iz Uranopolisa.</li>
</ul>`,
    },
  },

  {
    slug: 'wedding',
    icon: 'Heart',
    color: 'rose',
    title: {
      el: 'Γάμος στη Χαλκιδική',
      en: 'Destination Wedding in Halkidiki',
      de: 'Hochzeit in Chalkidiki',
      bg: 'Сватба в Халкидики',
      ru: 'Свадьба в Халкидиках',
      ro: 'Nuntă în Halkidiki',
      sr: 'Venčanje u Halkidikiju',
    },
    description: {
      el: 'Οδηγός γάμου στη Χαλκιδική — δημοφιλείς χώροι, νομικές απαιτήσεις, καλύτεροι μήνες, κόστη και ιδέες μήνα του μέλιτος.',
      en: 'Wedding guide for Halkidiki — popular venues, legal requirements, best months, costs, and honeymoon ideas.',
      de: 'Hochzeitsführer für Chalkidiki — beliebte Veranstaltungsorte, rechtliche Anforderungen, beste Monate, Kosten und Flitterwochen.',
      bg: 'Сватбен пътеводител за Халкидики — популярни места, правни изисквания, най-добри месеци, разходи и идеи за меден месец.',
      ru: 'Свадебный гид по Халкидикам — популярные площадки, юридические требования, лучшие месяцы, расходы и идеи для медового месяца.',
      ro: 'Ghid de nuntă pentru Halkidiki — locuri populare, cerințe legale, cele mai bune luni, costuri și idei de lună de miere.',
      sr: 'Vodič za venčanje u Halkidikiju — popularna mesta, pravni zahtevi, najbolji meseci, troškovi i ideje za medeni mesec.',
    },
    metaTitle: {
      el: 'Γάμος στη Χαλκιδική: Χώροι, Έγγραφα & Κόστος',
      en: 'Halkidiki Destination Wedding: Venues, Requirements & Costs',
      de: 'Hochzeit Chalkidiki: Orte, Anforderungen & Kosten',
      bg: 'Сватба в Халкидики: Места, документи и разходи',
      ru: 'Свадьба в Халкидиках: Площадки, документы и расходы',
      ro: 'Nuntă în Halkidiki: Locuri, documente și costuri',
      sr: 'Venčanje Halkidiki: Mesta, dokumenti i troškovi',
    },
    metaDesc: {
      el: 'Σχεδιάστε τον γάμο σας στη Χαλκιδική: χώροι τελετών, νομικά έγγραφα, κόστη, φωτογράφοι, και ιδέες μήνα του μέλιτος.',
      en: 'Plan your Halkidiki destination wedding: ceremony venues, legal documents, costs, photographers, and honeymoon extension ideas.',
      de: 'Planen Sie Ihre Hochzeit in Chalkidiki: Zeremonieorte, Dokumente, Kosten, Fotografen und Flitterwochenideen.',
      bg: 'Планирайте сватбата си в Халкидики: места за церемонии, документи, разходи, фотографи и идеи за меден месец.',
      ru: 'Спланируйте свадьбу в Халкидиках: площадки, документы, расходы, фотографы и идеи для медового месяца.',
      ro: 'Planificați nunta în Halkidiki: locuri pentru ceremonie, documente legale, costuri, fotografi și idei de lună de miere.',
      sr: 'Isplanirajte venčanje u Halkidikiju: mesta za ceremoniju, dokumenti, troškovi, fotografi i ideje za medeni mesec.',
    },
    content: {
      el: `<h2>Γάμος στη Χαλκιδική</h2>
<p>Η Χαλκιδική είναι ένας μαγικός προορισμός γάμου: γαλάζια νερά, πευκόφυτες ακτές, πέτρινα εκκλησάκια και πολυτελή resorts. Όλα τα συστατικά για μια αξέχαστη τελετή.</p>

<h2>Δημοφιλείς Χώροι</h2>
<ul>
<li><strong>Sani Resort:</strong> Πολυτελείς χώροι δεξιώσεων δίπλα στη θάλασσα, ξενοδοχεία 5 αστέρων</li>
<li><strong>Παραλιακοί χώροι:</strong> Πολλά beach bars και ξενοδοχεία προσφέρουν τελετές στην άμμο</li>
<li><strong>Παραδοσιακά εκκλησάκια:</strong> Πέτρινα εκκλησάκια σε χωριά όπως Άφυτος και Νικήτη</li>
<li><strong>Porto Carras:</strong> Μεγάλο resort στη Σιθωνία με δικό του αμπελώνα</li>
</ul>

<h2>Νομικές Απαιτήσεις για Αλλοδαπούς</h2>
<ul>
<li>Πιστοποιητικό γέννησης (με apostille)</li>
<li>Πιστοποιητικό ελεύθερης κατάστασης</li>
<li>Διαβατήρια</li>
<li>Πιστοποιητικό διαζυγίου (αν ισχύει)</li>
<li>Όλα τα έγγραφα πρέπει να μεταφραστούν στα ελληνικά</li>
</ul>

<h2>Καλύτεροι Μήνες</h2>
<p><strong>Μάιος–Ιούνιος</strong> και <strong>Σεπτέμβριος–Οκτώβριος</strong>: ιδανική θερμοκρασία (25-28°C), λιγότερος κόσμος, καλύτερες τιμές.</p>

<h2>Κόστος</h2>
<ul>
<li>Βασικός πολιτικός γάμος: από 1.000€</li>
<li>Μεσαία δεξίωση (50 άτομα): 5.000–15.000€</li>
<li>Πολυτελής γάμος σε resort: 20.000–50.000€+</li>
</ul>`,

      en: `<h2>Getting Married in Halkidiki</h2>
<p>Halkidiki is a dreamy destination wedding location: azure waters, pine-fringed shores, stone chapels, and luxury resorts. The combination of natural beauty, Mediterranean climate, and excellent infrastructure makes it perfect for couples seeking a memorable ceremony by the sea.</p>

<h2>Popular Venues</h2>
<ul>
<li><strong>Sani Resort:</strong> Five-star luxury venues right on the beach. Multiple event spaces, professional wedding coordination, and premium accommodation for guests. Kassandra peninsula.</li>
<li><strong>Beach venues:</strong> Many beach bars and hotels offer barefoot-on-the-sand ceremonies. Especially popular on Sithonia's western coast with its sunset views.</li>
<li><strong>Traditional chapels:</strong> Stone-built chapels in villages like Afytos, Nikiti, and Nea Fokea offer intimate, authentic Greek wedding settings. Some are perched on cliffs with sea views.</li>
<li><strong>Porto Carras Resort:</strong> A large resort complex in Sithonia with its own vineyard and winery — unique for a wine-themed wedding.</li>
<li><strong>Olive groves:</strong> Several venues offer ceremonies among ancient olive trees, a distinctly Halkidiki experience.</li>
</ul>

<h2>Legal Requirements for Foreigners</h2>
<p>Getting legally married in Greece as a foreigner requires several documents:</p>
<ul>
<li><strong>Birth certificates</strong> (with apostille stamp)</li>
<li><strong>Certificate of No Impediment</strong> (proof you are free to marry, issued by your embassy or home country)</li>
<li><strong>Valid passports</strong></li>
<li><strong>Divorce decree</strong> (if previously married, with apostille)</li>
<li><strong>Death certificate of former spouse</strong> (if widowed)</li>
<li>All documents must be <strong>translated into Greek</strong> by an official translator</li>
<li>Documents are submitted to the local municipality (Dimarcheio) at least one week before the ceremony</li>
</ul>
<p><strong>Civil vs Religious:</strong> Civil ceremonies are simpler and performed by the mayor. Greek Orthodox ceremonies require both partners to be baptized Christians (not necessarily Orthodox). Catholic ceremonies require coordination with the local diocese.</p>

<h2>Best Months</h2>
<p><strong>May–June</strong> and <strong>September–October</strong> are ideal: pleasant temperatures (25-28 degrees Celsius), fewer crowds, better rates for venues and accommodation, and beautiful light for photography. July-August is possible but hot and more expensive.</p>

<h2>Photography</h2>
<p>Halkidiki offers extraordinary wedding photo locations: Afytos cliffside, Possidi lighthouse at sunset, pine-shaded beaches of Sithonia, stone village squares, and olive groves. The golden hour light is exceptional from May to October.</p>

<h2>Cost Overview</h2>
<ul>
<li><strong>Basic civil ceremony:</strong> From 1,000 euros (municipality fee, translator, basic setup)</li>
<li><strong>Mid-range reception (50 guests):</strong> 5,000–15,000 euros</li>
<li><strong>Luxury resort wedding:</strong> 20,000–50,000+ euros (Sani, Porto Carras)</li>
<li><strong>Wedding planner:</strong> 1,500–5,000 euros (highly recommended for destination weddings)</li>
</ul>

<h2>Honeymoon Extension Ideas</h2>
<ul>
<li>Spend a week exploring all three peninsulas</li>
<li>Take a sunset sailing trip from Neos Marmaras</li>
<li>Day trip to Meteora for dramatic photos</li>
<li>Wine tasting at local Halkidiki vineyards</li>
<li>Couples spa at a luxury resort</li>
</ul>`,

      de: `<h2>Heiraten in Chalkidiki</h2>
<p>Chalkidiki ist ein traumhafter Hochzeitsort: azurblaues Wasser, kieferngesäumte Küsten, steinerne Kapellen und Luxusresorts.</p>

<h2>Beliebte Veranstaltungsorte</h2>
<ul>
<li><strong>Sani Resort:</strong> Fünf-Sterne-Luxus direkt am Strand mit professioneller Hochzeitskoordination</li>
<li><strong>Strandlocations:</strong> Viele Beach-Bars und Hotels bieten Zeremonien am Strand an</li>
<li><strong>Traditionelle Kapellen:</strong> Steinkapellen in Dörfern wie Afytos und Nikiti</li>
<li><strong>Porto Carras:</strong> Resort-Komplex in Sithonia mit eigenem Weingut</li>
</ul>

<h2>Rechtliche Anforderungen für Ausländer</h2>
<ul>
<li>Geburtsurkunden (mit Apostille)</li>
<li>Ehefähigkeitszeugnis</li>
<li>Gültige Reisepässe</li>
<li>Scheidungsurteil (falls zutreffend)</li>
<li>Alle Dokumente müssen ins Griechische übersetzt werden</li>
</ul>

<h2>Beste Monate</h2>
<p><strong>Mai–Juni</strong> und <strong>September–Oktober</strong>: angenehme Temperaturen, weniger Menschenmassen, bessere Preise.</p>

<h2>Kosten</h2>
<ul>
<li>Einfache standesamtliche Trauung: ab 1.000€</li>
<li>Mittlerer Empfang (50 Gäste): 5.000–15.000€</li>
<li>Luxus-Resort-Hochzeit: 20.000–50.000€+</li>
</ul>`,

      bg: `<h2>Сватба в Халкидики</h2>
<p>Халкидики е мечтана дестинация за сватба: лазурни води, борови брегове, каменни параклиси и луксозни курорти.</p>

<h2>Популярни места</h2>
<ul>
<li><strong>Sani Resort:</strong> Петзвезден лукс на плажа с професионална сватбена координация</li>
<li><strong>Плажни места:</strong> Много плажни барове предлагат церемонии на пясъка</li>
<li><strong>Традиционни параклиси:</strong> Каменни параклиси в села като Афитос и Никити</li>
<li><strong>Porto Carras:</strong> Курортен комплекс в Ситония с лозе и изба</li>
</ul>

<h2>Правни изисквания за чужденци</h2>
<ul>
<li>Удостоверения за раждане (с апостил)</li>
<li>Удостоверение за свободно семейно положение</li>
<li>Валидни паспорти</li>
<li>Решение за развод (ако е приложимо)</li>
<li>Всички документи трябва да бъдат преведени на гръцки</li>
</ul>

<h2>Най-добри месеци</h2>
<p><strong>Май–Юни</strong> и <strong>Септември–Октомври</strong>: приятни температури, по-малко хора, по-добри цени.</p>

<h2>Разходи</h2>
<ul>
<li>Основен граждански брак: от 1 000€</li>
<li>Среден прием (50 гости): 5 000–15 000€</li>
<li>Луксозна сватба в курорт: 20 000–50 000€+</li>
</ul>`,

      ru: `<h2>Свадьба в Халкидиках</h2>
<p>Халкидики — волшебное место для свадьбы: лазурные воды, сосновые берега, каменные часовни и роскошные курорты.</p>

<h2>Популярные площадки</h2>
<ul>
<li><strong>Sani Resort:</strong> Пятизвёздочный люкс на берегу моря с профессиональной свадебной координацией</li>
<li><strong>Пляжные площадки:</strong> Многие бич-бары и отели предлагают церемонии на песке</li>
<li><strong>Традиционные часовни:</strong> Каменные часовни в деревнях Афитос и Никити</li>
<li><strong>Porto Carras:</strong> Курортный комплекс в Ситонии с собственным виноградником</li>
</ul>

<h2>Юридические требования для иностранцев</h2>
<ul>
<li>Свидетельства о рождении (с апостилем)</li>
<li>Справка о семейном положении</li>
<li>Действительные паспорта</li>
<li>Свидетельство о разводе (если применимо)</li>
<li>Все документы переводятся на греческий язык</li>
</ul>

<h2>Лучшие месяцы</h2>
<p><strong>Май–июнь</strong> и <strong>сентябрь–октябрь</strong>: приятная температура, меньше людей, лучшие цены.</p>

<h2>Стоимость</h2>
<ul>
<li>Простая гражданская церемония: от 1 000€</li>
<li>Средний банкет (50 гостей): 5 000–15 000€</li>
<li>Роскошная свадьба в курорте: 20 000–50 000€+</li>
</ul>`,

      ro: `<h2>Nuntă în Halkidiki</h2>
<p>Halkidiki este o destinație de vis pentru nuntă: ape azurii, țărmuri cu pini, capele de piatră și resorturi de lux.</p>

<h2>Locuri populare</h2>
<ul>
<li><strong>Sani Resort:</strong> Lux cu cinci stele pe plajă, cu coordonare profesională a nunții</li>
<li><strong>Locuri pe plajă:</strong> Multe baruri pe plajă oferă ceremonii pe nisip</li>
<li><strong>Capele tradiționale:</strong> Capele de piatră în sate ca Afytos și Nikiti</li>
<li><strong>Porto Carras:</strong> Complex de resort în Sithonia cu vie proprie</li>
</ul>

<h2>Cerințe legale pentru străini</h2>
<ul>
<li>Certificate de naștere (cu apostilă)</li>
<li>Certificat de stare civilă liberă</li>
<li>Pașapoarte valabile</li>
<li>Certificat de divorț (dacă este cazul)</li>
<li>Toate documentele trebuie traduse în greacă</li>
</ul>

<h2>Cele mai bune luni</h2>
<p><strong>Mai–Iunie</strong> și <strong>Septembrie–Octombrie</strong>: temperaturi plăcute, mai puțini turiști, prețuri mai bune.</p>

<h2>Costuri</h2>
<ul>
<li>Căsătorie civilă de bază: de la 1.000€</li>
<li>Recepție medie (50 invitați): 5.000–15.000€</li>
<li>Nuntă de lux la resort: 20.000–50.000€+</li>
</ul>`,

      sr: `<h2>Venčanje u Halkidikiju</h2>
<p>Halkidiki je čarobna destinacija za venčanje: azurne vode, borove obale, kamene kapele i luksuzni rizorta.</p>

<h2>Popularna mesta</h2>
<ul>
<li><strong>Sani Resort:</strong> Petogvezdični luksuz na plaži sa profesionalnom koordinacijom venčanja</li>
<li><strong>Plaže:</strong> Mnogi plaža barovi nude ceremonije na pesku</li>
<li><strong>Tradicionalne kapele:</strong> Kamene kapele u selima poput Afitosa i Nikitija</li>
<li><strong>Porto Carras:</strong> Rizort kompleks u Sitoniji sa sopstvenim vinogradom</li>
</ul>

<h2>Pravni zahtevi za strance</h2>
<ul>
<li>Izvodi iz matične knjige rođenih (sa apostilom)</li>
<li>Uverenje o slobodnom bračnom stanju</li>
<li>Važeći pasoši</li>
<li>Presuda o razvodu (ako je primenljivo)</li>
<li>Sva dokumenta moraju biti prevedena na grčki</li>
</ul>

<h2>Najbolji meseci</h2>
<p><strong>Maj–Jun</strong> i <strong>Septembar–Oktobar</strong>: prijatne temperature, manje gužve, bolje cene.</p>

<h2>Troškovi</h2>
<ul>
<li>Osnovno građansko venčanje: od 1.000€</li>
<li>Srednji prijem (50 gostiju): 5.000–15.000€</li>
<li>Luksuzno venčanje u rizortu: 20.000–50.000€+</li>
</ul>`,
    },
  },

  {
    slug: 'driving-distances',
    icon: 'Navigation',
    color: 'slate',
    title: {
      el: 'Αποστάσεις & Χρόνοι Οδήγησης',
      en: 'Driving Distances & Times',
      de: 'Fahrstrecken & Fahrzeiten',
      bg: 'Разстояния и време за шофиране',
      ru: 'Расстояния и время в пути',
      ro: 'Distanțe și timpi de conducere',
      sr: 'Udaljenosti i vremena vožnje',
    },
    description: {
      el: 'Πρακτικός πίνακας αποστάσεων — από το αεροδρόμιο Θεσσαλονίκης σε κάθε προορισμό και μεταξύ χερσονήσων.',
      en: 'Practical driving times table — from Thessaloniki airport to every destination and between peninsulas.',
      de: 'Praktische Fahrzeiten-Tabelle — vom Flughafen Thessaloniki zu jedem Ziel und zwischen den Halbinseln.',
      bg: 'Практическа таблица с времена за шофиране — от летище Солун до всяка дестинация и между полуостровите.',
      ru: 'Практическая таблица времени в пути — от аэропорта Салоник до каждого направления и между полуостровами.',
      ro: 'Tabel practic de timpi de conducere — de la aeroportul Salonic la fiecare destinație și între peninsule.',
      sr: 'Praktična tabela vremena vožnje — od aerodroma Solun do svake destinacije i između poluostrva.',
    },
    metaTitle: {
      el: 'Αποστάσεις Χαλκιδική: Χρόνοι οδήγησης από Θεσσαλονίκη',
      en: 'Halkidiki Driving Distances: Times from Thessaloniki Airport',
      de: 'Chalkidiki Fahrstrecken: Fahrzeiten ab Thessaloniki',
      bg: 'Разстояния Халкидики: Време за шофиране от Солун',
      ru: 'Расстояния Халкидики: Время в пути из Салоник',
      ro: 'Distanțe Halkidiki: Timpi de conducere de la Salonic',
      sr: 'Udaljenosti Halkidiki: Vremena vožnje od Soluna',
    },
    metaDesc: {
      el: 'Πλήρης πίνακας αποστάσεων και χρόνων οδήγησης στη Χαλκιδική: αεροδρόμιο Θεσσαλονίκης προς Κασσάνδρα, Σιθωνία, Ουρανούπολη.',
      en: 'Complete driving distances and times in Halkidiki: Thessaloniki airport to Kassandra, Sithonia, Ouranoupoli, and between peninsulas.',
      de: 'Vollständige Fahrstrecken und -zeiten in Chalkidiki: Flughafen Thessaloniki nach Kassandra, Sithonia und Ouranoupoli.',
      bg: 'Пълна таблица разстояния и времена в Халкидики: летище Солун до Касандра, Ситония, Уранополис.',
      ru: 'Полная таблица расстояний и времени в пути по Халкидикам: аэропорт Салоник до Кассандры, Ситонии, Уранополиса.',
      ro: 'Tabel complet de distanțe și timpi în Halkidiki: aeroportul Salonic la Kassandra, Sithonia, Ouranoupoli.',
      sr: 'Kompletna tabela udaljenosti i vremena u Halkidikiju: aerodrom Solun do Kasandre, Sitonije, Uranopolisa.',
    },
    content: {
      el: `<h2>Αποστάσεις από το Αεροδρόμιο Θεσσαλονίκης (SKG)</h2>

<h2>Κασσάνδρα</h2>
<table>
<tr><th>Προορισμός</th><th>Απόσταση</th><th>Χρόνος</th></tr>
<tr><td>Νέα Μουδανιά</td><td>60 χλμ</td><td>45 λεπτά</td></tr>
<tr><td>Νέα Ποτίδαια</td><td>70 χλμ</td><td>50 λεπτά</td></tr>
<tr><td>Καλλιθέα</td><td>85 χλμ</td><td>1 ώρα</td></tr>
<tr><td>Χανιώτη</td><td>95 χλμ</td><td>1 ώρα 15 λεπτά</td></tr>
<tr><td>Πευκοχώρι</td><td>100 χλμ</td><td>1 ώρα 20 λεπτά</td></tr>
<tr><td>Άφυτος</td><td>80 χλμ</td><td>1 ώρα</td></tr>
</table>

<h2>Σιθωνία</h2>
<table>
<tr><th>Προορισμός</th><th>Απόσταση</th><th>Χρόνος</th></tr>
<tr><td>Νικήτη</td><td>90 χλμ</td><td>1 ώρα 10 λεπτά</td></tr>
<tr><td>Νέος Μαρμαράς</td><td>110 χλμ</td><td>1 ώρα 25 λεπτά</td></tr>
<tr><td>Βουρβουρού</td><td>115 χλμ</td><td>1 ώρα 30 λεπτά</td></tr>
<tr><td>Σάρτη</td><td>140 χλμ</td><td>2 ώρες</td></tr>
<tr><td>Πόρτο Κουφό</td><td>145 χλμ</td><td>2 ώρες 10 λεπτά</td></tr>
</table>

<h2>Άθως</h2>
<table>
<tr><th>Προορισμός</th><th>Απόσταση</th><th>Χρόνος</th></tr>
<tr><td>Ουρανούπολη</td><td>135 χλμ</td><td>2 ώρες</td></tr>
</table>

<h2>Μεταξύ Χερσονήσων</h2>
<table>
<tr><th>Διαδρομή</th><th>Χρόνος</th></tr>
<tr><td>Χανιώτη → Νικήτη</td><td>50 λεπτά</td></tr>
<tr><td>Χανιώτη → Σάρτη</td><td>1 ώρα 45 λεπτά</td></tr>
<tr><td>Νέος Μαρμαράς → Ουρανούπολη</td><td>1 ώρα 30 λεπτά</td></tr>
</table>`,

      en: `<h2>Driving Times from Thessaloniki Airport (SKG)</h2>
<p>All times are approximate and based on normal summer traffic conditions. During peak weekends (especially Friday afternoons and Sunday evenings), add 20-40 minutes for the Thessaloniki–Nea Moudania stretch. The main highway is well-maintained and dual carriageway until Nea Moudania.</p>

<h2>To Kassandra Peninsula</h2>
<table>
<tr><th>Destination</th><th>Distance</th><th>Drive Time</th></tr>
<tr><td>Nea Moudania</td><td>60 km</td><td>45 min</td></tr>
<tr><td>Nea Potidea (canal)</td><td>70 km</td><td>50 min</td></tr>
<tr><td>Nea Fokea</td><td>73 km</td><td>55 min</td></tr>
<tr><td>Afytos</td><td>80 km</td><td>1 hr</td></tr>
<tr><td>Kallithea</td><td>85 km</td><td>1 hr</td></tr>
<tr><td>Kriopigi</td><td>90 km</td><td>1 hr 5 min</td></tr>
<tr><td>Hanioti</td><td>95 km</td><td>1 hr 15 min</td></tr>
<tr><td>Pefkohori</td><td>100 km</td><td>1 hr 20 min</td></tr>
<tr><td>Siviri</td><td>88 km</td><td>1 hr 5 min</td></tr>
<tr><td>Possidi</td><td>92 km</td><td>1 hr 10 min</td></tr>
</table>

<h2>To Sithonia Peninsula</h2>
<table>
<tr><th>Destination</th><th>Distance</th><th>Drive Time</th></tr>
<tr><td>Nikiti</td><td>90 km</td><td>1 hr 10 min</td></tr>
<tr><td>Neos Marmaras</td><td>110 km</td><td>1 hr 25 min</td></tr>
<tr><td>Vourvourou</td><td>115 km</td><td>1 hr 30 min</td></tr>
<tr><td>Sarti</td><td>140 km</td><td>2 hrs</td></tr>
<tr><td>Toroni</td><td>130 km</td><td>1 hr 50 min</td></tr>
<tr><td>Porto Koufo</td><td>145 km</td><td>2 hrs 10 min</td></tr>
<tr><td>Kalamitsi</td><td>135 km</td><td>1 hr 55 min</td></tr>
</table>

<h2>To Athos Area</h2>
<table>
<tr><th>Destination</th><th>Distance</th><th>Drive Time</th></tr>
<tr><td>Arnea</td><td>95 km</td><td>1 hr 20 min</td></tr>
<tr><td>Ouranoupoli</td><td>135 km</td><td>2 hrs</td></tr>
<tr><td>Stagira (Aristotle)</td><td>110 km</td><td>1 hr 40 min</td></tr>
</table>

<h2>Between Peninsulas</h2>
<table>
<tr><th>Route</th><th>Drive Time</th><th>Notes</th></tr>
<tr><td>Hanioti → Nikiti</td><td>50 min</td><td>Via Nea Moudania junction</td></tr>
<tr><td>Hanioti → Sarti</td><td>1 hr 45 min</td><td>Via Nea Moudania, then east coast</td></tr>
<tr><td>Kallithea → Neos Marmaras</td><td>1 hr 10 min</td><td>Main road via Nikiti</td></tr>
<tr><td>Neos Marmaras → Ouranoupoli</td><td>1 hr 30 min</td><td>Cross-peninsula via Nikiti</td></tr>
<tr><td>Afytos → Vourvourou</td><td>1 hr 15 min</td><td>Via Nea Moudania junction</td></tr>
</table>

<h2>Practical Driving Tips</h2>
<ul>
<li><strong>Fuel up</strong> before entering southern Sithonia — stations are sparse</li>
<li><strong>Tolls:</strong> No tolls on Halkidiki roads (unlike the Thessaloniki–Athens highway)</li>
<li><strong>Parking:</strong> Free in most villages; paid parking in popular beach areas during summer</li>
<li><strong>Road quality:</strong> Main roads are good; some beach access roads are unpaved</li>
<li><strong>GPS:</strong> Google Maps works well and is updated; offline maps recommended in remote areas</li>
</ul>`,

      de: `<h2>Fahrzeiten vom Flughafen Thessaloniki (SKG)</h2>
<p>Alle Zeiten sind Richtwerte bei normalem Sommerverkehr. An Spitzenwochenenden 20-40 Minuten auf der Strecke Thessaloniki–Nea Moudania dazurechnen.</p>

<h2>Nach Kassandra</h2>
<table>
<tr><th>Ziel</th><th>Entfernung</th><th>Fahrzeit</th></tr>
<tr><td>Nea Moudania</td><td>60 km</td><td>45 Min.</td></tr>
<tr><td>Nea Potidea</td><td>70 km</td><td>50 Min.</td></tr>
<tr><td>Afytos</td><td>80 km</td><td>1 Std.</td></tr>
<tr><td>Kallithea</td><td>85 km</td><td>1 Std.</td></tr>
<tr><td>Hanioti</td><td>95 km</td><td>1 Std. 15 Min.</td></tr>
<tr><td>Pefkohori</td><td>100 km</td><td>1 Std. 20 Min.</td></tr>
</table>

<h2>Nach Sithonia</h2>
<table>
<tr><th>Ziel</th><th>Entfernung</th><th>Fahrzeit</th></tr>
<tr><td>Nikiti</td><td>90 km</td><td>1 Std. 10 Min.</td></tr>
<tr><td>Neos Marmaras</td><td>110 km</td><td>1 Std. 25 Min.</td></tr>
<tr><td>Vourvourou</td><td>115 km</td><td>1 Std. 30 Min.</td></tr>
<tr><td>Sarti</td><td>140 km</td><td>2 Std.</td></tr>
<tr><td>Porto Koufo</td><td>145 km</td><td>2 Std. 10 Min.</td></tr>
</table>

<h2>Nach Athos</h2>
<table>
<tr><th>Ziel</th><th>Entfernung</th><th>Fahrzeit</th></tr>
<tr><td>Ouranoupoli</td><td>135 km</td><td>2 Std.</td></tr>
</table>

<h2>Zwischen den Halbinseln</h2>
<table>
<tr><th>Route</th><th>Fahrzeit</th></tr>
<tr><td>Hanioti → Nikiti</td><td>50 Min.</td></tr>
<tr><td>Hanioti → Sarti</td><td>1 Std. 45 Min.</td></tr>
<tr><td>Neos Marmaras → Ouranoupoli</td><td>1 Std. 30 Min.</td></tr>
</table>`,

      bg: `<h2>Времена за шофиране от летище Солун (SKG)</h2>

<h2>До Касандра</h2>
<table>
<tr><th>Дестинация</th><th>Разстояние</th><th>Време</th></tr>
<tr><td>Неа Муданя</td><td>60 км</td><td>45 мин</td></tr>
<tr><td>Калитеа</td><td>85 км</td><td>1 час</td></tr>
<tr><td>Ханиоти</td><td>95 км</td><td>1 час 15 мин</td></tr>
<tr><td>Пефкохори</td><td>100 км</td><td>1 час 20 мин</td></tr>
</table>

<h2>До Ситония</h2>
<table>
<tr><th>Дестинация</th><th>Разстояние</th><th>Време</th></tr>
<tr><td>Никити</td><td>90 км</td><td>1 час 10 мин</td></tr>
<tr><td>Вурвуру</td><td>115 км</td><td>1 час 30 мин</td></tr>
<tr><td>Сарти</td><td>140 км</td><td>2 часа</td></tr>
</table>

<h2>До Атон</h2>
<table>
<tr><th>Дестинация</th><th>Разстояние</th><th>Време</th></tr>
<tr><td>Уранополис</td><td>135 км</td><td>2 часа</td></tr>
</table>

<h2>Между полуостровите</h2>
<table>
<tr><th>Маршрут</th><th>Време</th></tr>
<tr><td>Ханиоти → Никити</td><td>50 мин</td></tr>
<tr><td>Ханиоти → Сарти</td><td>1 час 45 мин</td></tr>
<tr><td>Неос Мармарас → Уранополис</td><td>1 час 30 мин</td></tr>
</table>`,

      ru: `<h2>Время в пути от аэропорта Салоник (SKG)</h2>

<h2>До Кассандры</h2>
<table>
<tr><th>Направление</th><th>Расстояние</th><th>Время</th></tr>
<tr><td>Неа Муданья</td><td>60 км</td><td>45 мин</td></tr>
<tr><td>Каллифея</td><td>85 км</td><td>1 час</td></tr>
<tr><td>Ханиоти</td><td>95 км</td><td>1 час 15 мин</td></tr>
<tr><td>Пефкохори</td><td>100 км</td><td>1 час 20 мин</td></tr>
</table>

<h2>До Ситонии</h2>
<table>
<tr><th>Направление</th><th>Расстояние</th><th>Время</th></tr>
<tr><td>Никити</td><td>90 км</td><td>1 час 10 мин</td></tr>
<tr><td>Вурвуру</td><td>115 км</td><td>1 час 30 мин</td></tr>
<tr><td>Сарти</td><td>140 км</td><td>2 часа</td></tr>
</table>

<h2>До Афона</h2>
<table>
<tr><th>Направление</th><th>Расстояние</th><th>Время</th></tr>
<tr><td>Уранополис</td><td>135 км</td><td>2 часа</td></tr>
</table>

<h2>Между полуостровами</h2>
<table>
<tr><th>Маршрут</th><th>Время</th></tr>
<tr><td>Ханиоти → Никити</td><td>50 мин</td></tr>
<tr><td>Ханиоти → Сарти</td><td>1 час 45 мин</td></tr>
<tr><td>Неос Мармарас → Уранополис</td><td>1 час 30 мин</td></tr>
</table>`,

      ro: `<h2>Timpi de conducere de la Aeroportul Salonic (SKG)</h2>

<h2>Spre Kassandra</h2>
<table>
<tr><th>Destinație</th><th>Distanță</th><th>Timp</th></tr>
<tr><td>Nea Moudania</td><td>60 km</td><td>45 min</td></tr>
<tr><td>Nea Potidea</td><td>70 km</td><td>50 min</td></tr>
<tr><td>Afytos</td><td>80 km</td><td>1 oră</td></tr>
<tr><td>Kallithea</td><td>85 km</td><td>1 oră</td></tr>
<tr><td>Hanioti</td><td>95 km</td><td>1 oră 15 min</td></tr>
<tr><td>Pefkohori</td><td>100 km</td><td>1 oră 20 min</td></tr>
</table>

<h2>Spre Sithonia</h2>
<table>
<tr><th>Destinație</th><th>Distanță</th><th>Timp</th></tr>
<tr><td>Nikiti</td><td>90 km</td><td>1 oră 10 min</td></tr>
<tr><td>Neos Marmaras</td><td>110 km</td><td>1 oră 25 min</td></tr>
<tr><td>Vourvourou</td><td>115 km</td><td>1 oră 30 min</td></tr>
<tr><td>Sarti</td><td>140 km</td><td>2 ore</td></tr>
<tr><td>Porto Koufo</td><td>145 km</td><td>2 ore 10 min</td></tr>
</table>

<h2>Spre Athos</h2>
<table>
<tr><th>Destinație</th><th>Distanță</th><th>Timp</th></tr>
<tr><td>Ouranoupoli</td><td>135 km</td><td>2 ore</td></tr>
</table>

<h2>Între peninsule</h2>
<table>
<tr><th>Rută</th><th>Timp</th></tr>
<tr><td>Hanioti → Nikiti</td><td>50 min</td></tr>
<tr><td>Hanioti → Sarti</td><td>1 oră 45 min</td></tr>
<tr><td>Neos Marmaras → Ouranoupoli</td><td>1 oră 30 min</td></tr>
</table>`,

      sr: `<h2>Vremena vožnje od aerodroma Solun (SKG)</h2>

<h2>Do Kasandre</h2>
<table>
<tr><th>Destinacija</th><th>Udaljenost</th><th>Vreme</th></tr>
<tr><td>Nea Mudanja</td><td>60 km</td><td>45 min</td></tr>
<tr><td>Kalitea</td><td>85 km</td><td>1 sat</td></tr>
<tr><td>Hanioti</td><td>95 km</td><td>1 sat 15 min</td></tr>
<tr><td>Pefkohori</td><td>100 km</td><td>1 sat 20 min</td></tr>
</table>

<h2>Do Sitonije</h2>
<table>
<tr><th>Destinacija</th><th>Udaljenost</th><th>Vreme</th></tr>
<tr><td>Nikiti</td><td>90 km</td><td>1 sat 10 min</td></tr>
<tr><td>Vurvuru</td><td>115 km</td><td>1 sat 30 min</td></tr>
<tr><td>Sarti</td><td>140 km</td><td>2 sata</td></tr>
</table>

<h2>Do Atosa</h2>
<table>
<tr><th>Destinacija</th><th>Udaljenost</th><th>Vreme</th></tr>
<tr><td>Uranopolis</td><td>135 km</td><td>2 sata</td></tr>
</table>

<h2>Između poluostrva</h2>
<table>
<tr><th>Ruta</th><th>Vreme</th></tr>
<tr><td>Hanioti → Nikiti</td><td>50 min</td></tr>
<tr><td>Hanioti → Sarti</td><td>1 sat 45 min</td></tr>
<tr><td>Neos Marmaras → Uranopolis</td><td>1 sat 30 min</td></tr>
</table>`,
    },
  },

  {
    slug: 'aristotle-trail',
    icon: 'BookOpen',
    color: 'amber',
    title: {
      el: 'Πολιτιστική Διαδρομή & Ιστορία',
      en: 'Cultural Trail & History',
      de: 'Kulturpfad & Geschichte',
      bg: 'Културен маршрут и история',
      ru: 'Культурный маршрут и история',
      ro: 'Traseu cultural și istorie',
      sr: 'Kulturna staza i istorija',
    },
    description: {
      el: 'Αρχαία Στάγειρα, Πάρκο Αριστοτέλη, Σπήλαιο Πετραλώνων, Αρχαία Όλυνθος, Αρναία — ο πολιτιστικός πλούτος της Χαλκιδικής.',
      en: 'Ancient Stagira, Aristotle\'s Park, Petralona Cave, Ancient Olynthos, Arnea — Halkidiki\'s rich cultural heritage.',
      de: 'Antikes Stagira, Aristoteles-Park, Petralona-Höhle, Antikes Olynth, Arnea — Chalkidikis reiches Kulturerbe.',
      bg: 'Древна Стагира, Парк на Аристотел, пещера Петралона, древен Олинтос, Арнеа — богатото наследство на Халкидики.',
      ru: 'Древняя Стагира, Парк Аристотеля, пещера Петралона, древний Олинф, Арнеа — богатое наследие Халкидиков.',
      ro: 'Stagira antică, Parcul lui Aristotel, Peștera Petralona, Olynthos antic, Arnea — moștenirea culturală a Halkidikiului.',
      sr: 'Drevna Stagira, Park Aristotela, pećina Petralona, drevni Olint, Arnea — bogato kulturno nasleđe Halkidikija.',
    },
    metaTitle: {
      el: 'Πολιτισμός Χαλκιδικής: Αριστοτέλης, Πετράλωνα & Ιστορία',
      en: 'Halkidiki Culture: Aristotle, Petralona Cave & History',
      de: 'Chalkidiki Kultur: Aristoteles, Petralona & Geschichte',
      bg: 'Култура Халкидики: Аристотел, Петралона и история',
      ru: 'Культура Халкидиков: Аристотель, Петралона и история',
      ro: 'Cultură Halkidiki: Aristotel, Petralona și istorie',
      sr: 'Kultura Halkidikija: Aristotel, Petralona i istorija',
    },
    metaDesc: {
      el: 'Εξερευνήστε τον πολιτισμό της Χαλκιδικής: Αρχαία Στάγειρα, Πάρκο Αριστοτέλη, σπήλαιο Πετραλώνων, Αρχαία Όλυνθος, Αρναία.',
      en: 'Explore Halkidiki\'s cultural side: Ancient Stagira, Aristotle\'s Park, Petralona Cave, Ancient Olynthos, Arnea, Polygyros museum.',
      de: 'Erkunden Sie Chalkidikis Kulturseite: Antikes Stagira, Aristoteles-Park, Petralona-Höhle, Antikes Olynth, Arnea.',
      bg: 'Разгледайте културната страна на Халкидики: Древна Стагира, Парк на Аристотел, пещера Петралона, древен Олинтос.',
      ru: 'Исследуйте культуру Халкидиков: Древняя Стагира, Парк Аристотеля, пещера Петралона, древний Олинф.',
      ro: 'Explorează latura culturală a Halkidikiului: Stagira antică, Parcul lui Aristotel, Peștera Petralona, Olynthos antic.',
      sr: 'Istražite kulturnu stranu Halkidikija: Drevna Stagira, Park Aristotela, pećina Petralona, drevni Olint.',
    },
    content: {
      el: `<h2>Αρχαία Στάγειρα</h2>
<p>Η γενέτειρα του Αριστοτέλη (384 π.Χ.), κοντά στο σημερινό χωριό Ολυμπιάδα. Ο αρχαιολογικός χώρος περιλαμβάνει τείχη, αγορά και ναούς. Η θέα στο Αιγαίο είναι εκπληκτική.</p>

<h2>Πάρκο Αριστοτέλη</h2>
<p>Υπαίθριο διαδραστικό μουσείο κοντά στα Στάγειρα. Εκθέματα που δείχνουν τις αρχές της φυσικής — φακοί, πρίσματα, ηχητικοί σωλήνες. Ιδανικό για παιδιά και ενήλικες.</p>

<h2>Σπήλαιο Πετραλώνων</h2>
<p>Ανακαλύφθηκε το 1959. Περιέχει τα αρχαιότερα ανθρώπινα ευρήματα στην Ευρώπη (700.000 ετών). Σταλακτίτες, σταλαγμίτες, και ανθρωπολογικό μουσείο.</p>

<h2>Αρχαία Όλυνθος</h2>
<p>Κλασική ελληνική πόλη με εντυπωσιακά ψηφιδωτά δαπέδα του 4ου αι. π.Χ. Ένα από τα καλύτερα παραδείγματα αρχαίας πολεοδομίας (ιπποδάμειο σύστημα).</p>

<h2>Αρχαιολογικό Μουσείο Πολυγύρου</h2>
<p>Η πρωτεύουσα της Χαλκιδικής φιλοξενεί ένα εξαιρετικό μουσείο με ευρήματα από ολόκληρη την περιοχή.</p>

<h2>Αρναία</h2>
<p>Παραδοσιακό ορεινό χωριό με πέτρινη αρχιτεκτονική, λαογραφικό μουσείο και φημισμένο σαββατιάτικο παζάρι. Δροσερή απόδραση από τη ζέστη.</p>

<h2>Κανάλι Ποτίδαιας</h2>
<p>Αρχαίο κανάλι που χωρίζει τη χερσόνησο Κασσάνδρας. Σημαντικό στρατηγικό σημείο από τους Περσικούς πολέμους.</p>`,

      en: `<h2>Ancient Stagira — Birthplace of Aristotle</h2>
<p>Perched on a hilltop near the modern village of Olympiada, Ancient Stagira is where the philosopher Aristotle was born in 384 BC. The archaeological site includes city walls, an agora, and temple foundations, with panoramic views over the Aegean Sea. Aristotle spent his early years here before leaving for Athens to study under Plato. The site is atmospheric and rarely crowded.</p>

<h2>Aristotle's Park</h2>
<p>Located near Stagira, this open-air interactive museum brings Aristotle's observations about the natural world to life. Hands-on exhibits demonstrate principles of physics: optical lenses, prisms, sound tubes, a sundial, a compass, and water flow experiments. It is both educational and entertaining, perfect for families with children. Free admission, open year-round.</p>

<h2>Petralona Cave</h2>
<p>Discovered in 1959 by a local shepherd, Petralona Cave contains some of the oldest evidence of human habitation in Europe, dating back approximately 700,000 years. The cave features spectacular stalactites and stalagmites, and the associated Anthropological Museum displays the famous Petralona Skull and stone tools. The cave maintains a constant temperature of 17 degrees Celsius, making it a cool retreat on hot summer days. Guided tours last approximately one hour.</p>

<h2>Ancient Olynthos</h2>
<p>One of the most important classical Greek archaeological sites, Ancient Olynthos features remarkable pebble mosaics from the 4th century BC, depicting mythological scenes. The city was laid out in the Hippodamian grid plan — one of the earliest examples of urban planning in history. Destroyed by Philip II of Macedon in 348 BC. The on-site museum explains the city's significance.</p>

<h2>Archaeological Museum of Polygyros</h2>
<p>The capital of Halkidiki houses an excellent museum with artifacts from across the region: pottery, sculptures, gold jewelry, coins, and inscriptions spanning thousands of years. A good rainy-day activity and an excellent overview of the region's deep history.</p>

<h2>Arnea — Traditional Mountain Village</h2>
<p>A beautifully preserved mountain village with traditional Macedonian stone-and-timber architecture. The Folklore Museum showcases local weaving traditions. Arnea is famous for its Saturday morning market where locals sell honey, olive oil, handmade textiles, and herbs. The village square with its ancient plane tree is a perfect spot for a coffee break. At 600 meters elevation, it offers a cool escape from summer heat.</p>

<h2>Nea Potidea Canal</h2>
<p>This narrow canal separates the Kassandra peninsula from the mainland, originally constructed in antiquity. It played a strategic role during the Persian Wars (Xerxes' canal was on the Athos peninsula). Today, you can walk along both sides and watch small boats passing through. The modern town of Nea Potidea grew around it.</p>`,

      de: `<h2>Antikes Stagira — Geburtsort des Aristoteles</h2>
<p>Auf einem Hügel nahe dem Dorf Olympiada gelegen, ist das antike Stagira der Geburtsort des Philosophen Aristoteles (384 v. Chr.). Der archäologische Ort umfasst Stadtmauern, eine Agora und Tempelfundamente mit Panoramablick auf die Ägäis.</p>

<h2>Aristoteles-Park</h2>
<p>Ein Freiluft-Museum nahe Stagira mit interaktiven Exponaten zu physikalischen Prinzipien: Linsen, Prismen, Klangröhren und Wasserexperimente. Perfekt für Familien. Freier Eintritt, ganzjährig geöffnet.</p>

<h2>Petralona-Höhle</h2>
<p>1959 entdeckt. Enthält die ältesten Belege menschlicher Besiedlung in Europa (ca. 700.000 Jahre). Spektakuläre Stalaktiten und Stalagmiten. Geführte Touren dauern ca. eine Stunde.</p>

<h2>Antikes Olynth</h2>
<p>Bemerkenswerte Kieselmosaike aus dem 4. Jh. v. Chr. Die Stadt war im hippodamischen Rastersystem angelegt — eines der frühesten Beispiele der Stadtplanung.</p>

<h2>Archäologisches Museum Polygyros</h2>
<p>Hervorragendes Museum mit Funden aus ganz Chalkidiki: Keramik, Skulpturen, Goldschmuck und Münzen.</p>

<h2>Arnea</h2>
<p>Traditionelles Bergdorf mit mazedonischer Steinarchitektur. Berühmt für den Samstagmarkt mit Honig, Olivenöl und Textilien.</p>`,

      bg: `<h2>Древна Стагира — Родно място на Аристотел</h2>
<p>На хълм близо до село Олимпиада, Древна Стагира е родното място на философа Аристотел (384 г. пр.н.е.). Археологическият обект включва градски стени, агора и основи на храмове.</p>

<h2>Парк на Аристотел</h2>
<p>Музей на открито близо до Стагира с интерактивни експонати за физични принципи. Безплатен вход, отворен целогодишно.</p>

<h2>Пещера Петралона</h2>
<p>Открита през 1959 г. Съдържа най-старите доказателства за човешко обитаване в Европа (около 700 000 години). Водени обиколки около 1 час.</p>

<h2>Древен Олинтос</h2>
<p>Забележителни мозайки от камъчета от IV в. пр.н.е. Градът е планиран по хиподамовата решетъчна система.</p>

<h2>Археологически музей Полигирос</h2>
<p>Отличен музей с находки от цял Халкидики: керамика, скулптури, злато и монети.</p>

<h2>Арнеа</h2>
<p>Традиционно планинско село с каменна архитектура. Прочуто със съботния пазар с мед, зехтин и текстил.</p>`,

      ru: `<h2>Древняя Стагира — Родина Аристотеля</h2>
<p>На вершине холма рядом с деревней Олимпиада находится Древняя Стагира — место рождения философа Аристотеля в 384 году до н.э. Археологический комплекс включает городские стены, агору и фундаменты храмов с панорамным видом на Эгейское море.</p>

<h2>Парк Аристотеля</h2>
<p>Интерактивный музей под открытым небом рядом со Стагирой. Экспонаты демонстрируют принципы физики: линзы, призмы, звуковые трубы, солнечные часы. Бесплатный вход, открыт круглый год.</p>

<h2>Пещера Петралона</h2>
<p>Обнаружена в 1959 году. Содержит древнейшие свидетельства обитания человека в Европе (около 700 000 лет). Экскурсии длятся около часа.</p>

<h2>Древний Олинф</h2>
<p>Замечательные мозаики из гальки IV века до н.э. Город планировался по гипподамовой системе — один из ранних примеров градостроительства.</p>

<h2>Археологический музей Полигироса</h2>
<p>Отличный музей с находками со всего полуострова: керамика, скульптуры, золотые украшения и монеты.</p>

<h2>Арнеа</h2>
<p>Традиционная горная деревня с каменной архитектурой. Знаменита субботним рынком с мёдом, оливковым маслом и текстилем.</p>`,

      ro: `<h2>Stagira antică — Locul de naștere al lui Aristotel</h2>
<p>Pe un deal lângă satul Olympiada, Stagira antică este locul nașterii filozofului Aristotel în 384 î.Hr. Situl include ziduri, agora și fundații de temple cu vedere panoramică la Marea Egee.</p>

<h2>Parcul lui Aristotel</h2>
<p>Muzeu interactiv în aer liber lângă Stagira. Exponate care demonstrează principii de fizică. Intrare gratuită, deschis tot anul.</p>

<h2>Peștera Petralona</h2>
<p>Descoperită în 1959. Conține cele mai vechi dovezi ale habitatului uman din Europa (~700.000 ani). Tururi ghidate de ~1 oră.</p>

<h2>Olynthos antic</h2>
<p>Mozaicuri remarcabile de pietricele din sec. IV î.Hr. Orașul a fost planificat după sistemul hipodamic.</p>

<h2>Muzeul Arheologic Polygyros</h2>
<p>Muzeu excelent cu artefacte din toată regiunea: ceramică, sculpturi, bijuterii de aur și monede.</p>

<h2>Arnea</h2>
<p>Sat montan tradițional cu arhitectură de piatră. Renumit pentru piața de sâmbătă cu miere, ulei de măsline și textile artizanale.</p>`,

      sr: `<h2>Drevna Stagira — Rodno mesto Aristotela</h2>
<p>Na brežuljku blizu sela Olimpijada, Drevna Stagira je rodno mesto filozofa Aristotela (384. g. pre n.e.). Arheološki lokalitet uključuje gradske zidine, agoru i temelje hramova sa panoramskim pogledom na Egejsko more.</p>

<h2>Park Aristotela</h2>
<p>Muzej na otvorenom blizu Stagire sa interaktivnim eksponatima o fizičkim principima. Besplatan ulaz, otvoren cele godine.</p>

<h2>Pećina Petralona</h2>
<p>Otkrivena 1959. Sadrži najstarije dokaze o ljudskom staništu u Evropi (~700.000 godina). Vođene ture oko 1 sat.</p>

<h2>Drevni Olint</h2>
<p>Izvanredni mozaici od šljunka iz IV veka pre n.e. Grad je planiran po hipodamovom sistemu — jedan od najranijih primera urbanizma.</p>

<h2>Arheološki muzej Poligiros</h2>
<p>Odličan muzej sa nalazima iz celog Halkidikija: keramika, skulpture, zlatni nakit i novčići.</p>

<h2>Arnea</h2>
<p>Tradicionalno planinsko selo sa kamenom arhitekturom. Poznato po subotnjoj pijaci sa medom, maslinovim uljem i tekstilom.</p>`,
    },
  },

  {
    slug: 'sunset-spots',
    icon: 'SunDim',
    color: 'orange',
    title: {
      el: 'Σημεία Ηλιοβασιλέματος',
      en: 'Best Sunset Spots',
      de: 'Die schönsten Sonnenuntergänge',
      bg: 'Най-добрите места за залез',
      ru: 'Лучшие точки заката',
      ro: 'Cele mai bune locuri de apus',
      sr: 'Najbolja mesta za zalazak sunca',
    },
    description: {
      el: 'Οι καλύτερες τοποθεσίες για ηλιοβασίλεμα — Άφυτος, Ποσείδι, Νέος Μαρμαράς, Σίβηρι — και τα καλύτερα μπαρ για κοκτέιλ στο ηλιοβασίλεμα.',
      en: 'The best sunset viewpoints — Afytos, Possidi, Neos Marmaras, Siviri — plus the best bars for sunset cocktails.',
      de: 'Die besten Aussichtspunkte für Sonnenuntergänge — Afytos, Possidi, Neos Marmaras, Siviri — und die besten Bars für Sonnenuntergangs-Cocktails.',
      bg: 'Най-добрите места за залез — Афитос, Посиди, Неос Мармарас, Сивири — и най-добрите барове за коктейли при залез.',
      ru: 'Лучшие точки для заката — Афитос, Поссиди, Неос Мармарас, Сивири — и лучшие бары для коктейлей на закате.',
      ro: 'Cele mai bune puncte de apus — Afytos, Possidi, Neos Marmaras, Siviri — și cele mai bune baruri pentru cocteiluri la apus.',
      sr: 'Najbolja mesta za zalazak sunca — Afitos, Posidi, Neos Marmaras, Siviri — i najbolji barovi za koktele na zalasku.',
    },
    metaTitle: {
      el: 'Ηλιοβασιλέματα Χαλκιδικής: Κορυφαία σημεία & μπαρ',
      en: 'Halkidiki Sunsets: Top Spots & Bars for Golden Hour',
      de: 'Chalkidiki Sonnenuntergänge: Top-Orte & Bars',
      bg: 'Залези Халкидики: Топ места и барове',
      ru: 'Закаты Халкидиков: Лучшие места и бары',
      ro: 'Apusuri Halkidiki: Cele mai bune locuri și baruri',
      sr: 'Zalasci sunca Halkidiki: Najbolja mesta i barovi',
    },
    metaDesc: {
      el: 'Ανακαλύψτε τα καλύτερα σημεία για ηλιοβασίλεμα στη Χαλκιδική: Άφυτος, Ποσείδι, Νέος Μαρμαράς, Πόρτο Κουφό και κορυφαία μπαρ.',
      en: 'Discover the best sunset spots in Halkidiki: Afytos cliff terrace, Possidi lighthouse, Neos Marmaras, Porto Koufo, and top sunset bars.',
      de: 'Entdecken Sie die besten Orte für Sonnenuntergänge in Chalkidiki: Afytos, Possidi, Neos Marmaras und Top-Bars.',
      bg: 'Открийте най-добрите места за залез в Халкидики: Афитос, Посиди, Неос Мармарас и топ барове.',
      ru: 'Откройте лучшие места для заката в Халкидиках: Афитос, Поссиди, Неос Мармарас и лучшие бары.',
      ro: 'Descoperă cele mai bune locuri de apus în Halkidiki: Afytos, Possidi, Neos Marmaras și cele mai bune baruri.',
      sr: 'Otkrijte najbolja mesta za zalazak sunca u Halkidikiju: Afitos, Posidi, Neos Marmaras i top barovi.',
    },
    content: {
      el: `<h2>Κορυφαία σημεία ηλιοβασιλέματος</h2>

<h2>Άφυτος — Βεράντα στο Θερμαϊκό</h2>
<p>Ο βράχος του Αφύτου βλέπει δυτικά στον Θερμαϊκό Κόλπο, προσφέροντας ίσως το πιο δραματικό ηλιοβασίλεμα της Χαλκιδικής. Τα καφέ στο χείλος του γκρεμού είναι ιδανικά για κοκτέιλ.</p>

<h2>Ακρωτήριο Ποσείδι</h2>
<p>Ο φάρος στην άκρη μιας αμμώδους γλώσσας, με θέα 270 μοιρών. Το ηλιοβασίλεμα δίπλα στον φάρο είναι μαγικό.</p>

<h2>Λιμάνι Νέου Μαρμαρά</h2>
<p>Η παραλία δίπλα στο λιμάνι βλέπει δυτικά. Ψαροταβέρνες με θέα ηλιοβασίλεμα δίπλα στα σκάφη.</p>

<h2>Πόρτο Κουφό</h2>
<p>Ηλιοβασίλεμα μέσα από τα στενά εισόδου του κόλπου — μοναδικό φρέιμ φωτογραφίας.</p>

<h2>Σίβηρι Beach Bars</h2>
<p>Τα beach bars του Σίβηρι βλέπουν δυτικά. Μουσική, κοκτέιλ και ηλιοβασίλεμα — τέλειος συνδυασμός.</p>

<h2>Σάρτη — Ανατολή!</h2>
<p><strong>Σημείωση:</strong> Η Σάρτη βλέπει ανατολικά, προς το Αιγαίο και το Άγιο Όρος. Δεν βλέπετε ηλιοβασίλεμα εδώ, αλλά η <strong>ανατολή</strong> με φόντο το Άγιο Όρος είναι εξίσου εντυπωσιακή!</p>`,

      en: `<h2>Top Sunset Viewpoints in Halkidiki</h2>
<p>Halkidiki's western-facing coastlines offer some of the most spectacular sunsets in Northern Greece. The Thermaikos Gulf acts as a natural mirror, and on clear evenings the sky turns shades of orange, pink, and purple that reflect off the calm Aegean waters.</p>

<h2>Afytos Cliff Terrace</h2>
<p>The cliff-edge cafes and terraces of Afytos face west over the Thermaikos Gulf, making this arguably the most dramatic sunset spot in all of Halkidiki. The stone village, the ancient plane tree in the square, and the panoramic sea view combine for an unforgettable golden hour. Grab a table at one of the cliff-side cafes early in the evening — they fill up fast in summer.</p>

<h2>Possidi Cape Lighthouse</h2>
<p>The lighthouse at Cape Possidi sits at the tip of a sandy spit with a nearly 270-degree water view. Watching the sun sink beside the lighthouse with water on both sides creates a magical atmosphere. Relatively uncrowded and wonderfully photogenic. Bring a blanket and stay on the sand.</p>

<h2>Neos Marmaras Port</h2>
<p>The western-facing waterfront of Neos Marmaras offers sunset views directly from the harbor. Sit at a taverna with fresh fish while the sky changes color behind the fishing boats. The town's amphitheatrical layout means higher streets also catch great views.</p>

<h2>Porto Koufo Bay Entrance</h2>
<p>The narrow entrance to Porto Koufo's enclosed harbor creates a natural frame for the setting sun. Walk up to the cliffs above the bay entrance for an elevated perspective. The light bouncing between the rock walls is unique to this location.</p>

<h2>Siviri Beach Bars</h2>
<p>Siviri's beach bars face west and have made sunset watching into an event. Music, cocktails, and the golden sky — it's the most social sunset experience in Halkidiki. Popular with both families (early evening) and younger crowds (later).</p>

<h2>Sarti — Actually a SUNRISE Spot</h2>
<p><strong>Important note:</strong> Sarti faces east toward the Aegean and Mount Athos. You won't see the sunset here. However, the <strong>sunrise over Mount Athos</strong> is equally spectacular — the holy mountain's silhouette against the dawn sky is one of the most photographed views in Halkidiki. Set your alarm early; it's worth it.</p>

<h2>Best Bars for Sunset Drinks</h2>
<ul>
<li><strong>Afytos:</strong> The cliff-terrace cafes along the main square — any of them will do</li>
<li><strong>Siviri:</strong> Beach bars with chill-out music and loungers facing the sunset</li>
<li><strong>Neos Marmaras:</strong> Waterfront cocktail bars along the harbor promenade</li>
<li><strong>Kallithea:</strong> Upscale beach clubs with DJ sets during golden hour</li>
<li><strong>Sani Resort:</strong> The marina bars at Sani offer premium sunset cocktails in an elegant setting</li>
</ul>

<h2>Photography Tips</h2>
<ul>
<li>Best months: May, June, September — cleaner air, more dramatic colors</li>
<li>Arrive 30 minutes before sunset for the best warm light</li>
<li>Stay 15 minutes after the sun dips — the afterglow is often the best part</li>
<li>Use foreground elements: the Afytos cliff, Possidi lighthouse, fishing boats at Neos Marmaras</li>
</ul>`,

      de: `<h2>Die besten Sonnenuntergänge in Chalkidiki</h2>

<h2>Afytos Klippenterrasse</h2>
<p>Die Cafés am Klippenrand von Afytos blicken nach Westen über den Thermaikos-Golf. Der wohl dramatischste Sonnenuntergangsort in ganz Chalkidiki. Reservieren Sie früh — die Plätze sind im Sommer schnell vergeben.</p>

<h2>Leuchtturm Kap Possidi</h2>
<p>Der Leuchtturm an der Spitze einer Sandbank mit fast 270-Grad-Wasserpanorama. Magische Atmosphäre mit Wasser auf beiden Seiten.</p>

<h2>Hafen von Neos Marmaras</h2>
<p>Die nach Westen gerichtete Uferpromenade bietet Sonnenuntergänge direkt vom Hafen. Frischer Fisch in der Taverne, während der Himmel die Farben wechselt.</p>

<h2>Porto Koufo</h2>
<p>Der enge Eingang zum Hafen rahmt die untergehende Sonne natürlich ein.</p>

<h2>Siviri Beach-Bars</h2>
<p>Die Beach-Bars blicken nach Westen — Musik, Cocktails und goldener Himmel.</p>

<h2>Sarti — Eigentlich ein SONNENAUFGANGS-Ort!</h2>
<p><strong>Wichtig:</strong> Sarti blickt nach Osten zum Ägäischen Meer und Berg Athos. Kein Sonnenuntergang hier, aber der <strong>Sonnenaufgang über dem Berg Athos</strong> ist ebenso spektakulär!</p>`,

      bg: `<h2>Най-добрите места за залез в Халкидики</h2>

<h2>Тераса Афитос</h2>
<p>Кафенетата на ръба на скалата в Афитос гледат на запад към залива Термаикос. Може би най-драматичното място за залез в Халкидики.</p>

<h2>Фар на нос Посиди</h2>
<p>Фарът на пясъчната коса с почти 270-градусова гледка към водата. Магическа атмосфера.</p>

<h2>Пристанище Неос Мармарас</h2>
<p>Крайбрежието гледа на запад — залез директно от пристанището. Прясна риба в таверна, докато небето сменя цветовете.</p>

<h2>Порто Куфо</h2>
<p>Тесният вход на залива обрамчва залязващото слънце.</p>

<h2>Сарти — Всъщност за ИЗГРЕВ!</h2>
<p><strong>Важно:</strong> Сарти гледа на изток. Няма залез тук, но <strong>изгревът над Атон</strong> е не по-малко зрелищен!</p>`,

      ru: `<h2>Лучшие точки для заката в Халкидиках</h2>

<h2>Терраса Афитос</h2>
<p>Кафе на краю утёса в Афитосе смотрят на запад, на залив Термаикос. Пожалуй, самая впечатляющая точка для заката во всей Халкидике. Занимайте столик заранее.</p>

<h2>Маяк мыса Поссиди</h2>
<p>Маяк на кончике песчаной косы с обзором почти 270 градусов. Волшебная атмосфера с водой по обе стороны.</p>

<h2>Порт Неос Мармарас</h2>
<p>Набережная смотрит на запад — закат прямо из порта. Свежая рыба в таверне, пока небо меняет цвета.</p>

<h2>Порто Куфо</h2>
<p>Узкий вход в залив создаёт естественную раму для заходящего солнца.</p>

<h2>Сивири</h2>
<p>Пляжные бары обращены на запад — музыка, коктейли и золотое небо.</p>

<h2>Сарти — На самом деле для РАССВЕТА!</h2>
<p><strong>Важно:</strong> Сарти смотрит на восток, на Эгейское море и гору Афон. Заката здесь не увидите, но <strong>рассвет над Афоном</strong> не менее впечатляющий!</p>`,

      ro: `<h2>Cele mai bune locuri de apus în Halkidiki</h2>

<h2>Terasa Afytos</h2>
<p>Cafenelele de pe stâncă la Afytos sunt orientate spre vest, spre Golful Thermaikos. Cel mai dramatic loc de apus din Halkidiki. Ocupă o masă devreme.</p>

<h2>Farul de la Capul Possidi</h2>
<p>Farul pe vârful unei limbi de nisip cu vedere de aproape 270 de grade. Atmosferă magică.</p>

<h2>Portul Neos Marmaras</h2>
<p>Faleza orientată spre vest oferă apusuri direct din port. Pește proaspăt la tavernă în timp ce cerul își schimbă culorile.</p>

<h2>Porto Koufo</h2>
<p>Intrarea îngustă în golf încadrează natural soarele care apune.</p>

<h2>Sarti — De fapt pentru RĂSĂRIT!</h2>
<p><strong>Notă:</strong> Sarti este orientat spre est. Nu vei vedea apusul aici, dar <strong>răsăritul deasupra Muntelui Athos</strong> este la fel de spectaculos!</p>`,

      sr: `<h2>Najbolja mesta za zalazak sunca u Halkidikiju</h2>

<h2>Terasa Afitos</h2>
<p>Kafići na ivici litice u Afitosu gledaju na zapad prema Termajskom zalivu. Verovatno najdramatičnije mesto za zalazak sunca u celom Halkidikiju.</p>

<h2>Svetionik na rtu Posidi</h2>
<p>Svetionik na vrhu peščanog spruda sa gotovo 270-stepenim pogledom. Magična atmosfera sa vodom sa obe strane.</p>

<h2>Luka Neos Marmaras</h2>
<p>Obala okrenuta na zapad — zalazak sunca direktno iz luke. Sveža riba u taverni dok nebo menja boje.</p>

<h2>Porto Kufo</h2>
<p>Uzak ulaz u zaliv prirodno uokviruje zalazeće sunce.</p>

<h2>Sarti — Zapravo za IZLAZAK sunca!</h2>
<p><strong>Napomena:</strong> Sarti gleda na istok. Ovde nema zalaska sunca, ali je <strong>izlazak sunca iznad Atosa</strong> jednako spektakularan!</p>`,
    },
  },

  {
    slug: 'shopping-and-souvenirs',
    icon: 'ShoppingBag',
    color: 'pink',
    title: {
      el: 'Αγορές & Σουβενίρ',
      en: 'Shopping & Souvenirs',
      de: 'Einkaufen & Souvenirs',
      bg: 'Пазаруване и сувенири',
      ru: 'Покупки и сувениры',
      ro: 'Cumpărături și suveniruri',
      sr: 'Kupovina i suveniri',
    },
    description: {
      el: 'Τι να αγοράσετε: ελιές Χαλκιδικής, μέλι, ελαιόλαδο, τσίπουρο, χειροποίητα σαπούνια — και πού να τα βρείτε.',
      en: 'What to buy: Halkidiki green olives, local honey, olive oil, tsipouro, handmade soap, olive wood crafts — and where to find them.',
      de: 'Was man kaufen sollte: Chalkidiki-Oliven, Honig, Olivenöl, Tsipouro, handgemachte Seife — und wo man sie findet.',
      bg: 'Какво да купите: маслини от Халкидики, мед, зехтин, ципуро, ръчно правен сапун — и къде да ги намерите.',
      ru: 'Что купить: халкидикские оливки, местный мёд, оливковое масло, ципуро, мыло ручной работы — и где искать.',
      ro: 'Ce să cumperi: măsline Halkidiki, miere, ulei de măsline, tsipouro, săpun handmade — și unde le găsești.',
      sr: 'Šta kupiti: Halkidiki masline, med, maslinovo ulje, cipouro, ručno pravljeni sapun — i gde ih naći.',
    },
    metaTitle: {
      el: 'Αγορές Χαλκιδικής: Ελιές, Μέλι, Σουβενίρ & Πού',
      en: 'Halkidiki Shopping: Olives, Honey, Souvenirs & Where to Buy',
      de: 'Chalkidiki Einkaufen: Oliven, Honig, Souvenirs & Wo',
      bg: 'Пазаруване Халкидики: Маслини, мед, сувенири и къде',
      ru: 'Покупки в Халкидиках: Оливки, мёд, сувениры и где',
      ro: 'Cumpărături Halkidiki: Măsline, miere, suveniruri și unde',
      sr: 'Kupovina Halkidiki: Masline, med, suveniri i gde',
    },
    metaDesc: {
      el: 'Τι να αγοράσετε στη Χαλκιδική: πράσινες ελιές PDO, θυμαρίσιο μέλι, ελαιόλαδο, τσίπουρο, ελαιόξυλα και πού να ψωνίσετε.',
      en: 'What to buy in Halkidiki: PDO green olives, thyme honey, cold-pressed olive oil, tsipouro, olive wood crafts, and where to shop.',
      de: 'Was man in Chalkidiki kaufen sollte: PDO-Oliven, Thymian-Honig, Olivenöl, Tsipouro, und wo man einkaufen kann.',
      bg: 'Какво да купите в Халкидики: PDO маслини, мед от мащерка, зехтин, ципуро и къде да пазарувате.',
      ru: 'Что купить в Халкидиках: оливки PDO, тимьяновый мёд, оливковое масло, ципуро и где делать покупки.',
      ro: 'Ce să cumperi în Halkidiki: măsline PDO, miere de cimbru, ulei de măsline, tsipouro și unde să faci cumpărături.',
      sr: 'Šta kupiti u Halkidikiju: PDO masline, med od timijana, maslinovo ulje, cipouro i gde kupovati.',
    },
    content: {
      el: `<h2>Τι να αγοράσετε στη Χαλκιδική</h2>

<h2>Ελιές Χαλκιδικής (ΠΟΠ)</h2>
<p>Οι πράσινες ελιές Χαλκιδικής έχουν Προστατευόμενη Ονομασία Προέλευσης (ΠΟΠ) και θεωρούνται από τις καλύτερες παγκοσμίως. Μεγάλες, σαρκώδεις, με ήπια γεύση. Βρίσκονται παντού — σούπερ μάρκετ, ελαιοτριβεία, τοπικά μαγαζιά.</p>

<h2>Τοπικό μέλι</h2>
<p>Θυμαρίσιο και πευκόμελο — η Χαλκιδική φημίζεται για την ποιότητα μελιού. Η Νικήτη είναι κέντρο μελισσοκομίας. Αγοράστε απευθείας από παραγωγούς στην Αρναία ή σε τοπικά μαγαζιά.</p>

<h2>Ελαιόλαδο</h2>
<p>Ψυχρής έκθλιψης, εξαιρετικό παρθένο. Αγοράστε από τοπικά ελαιοτριβεία ή σούπερ μάρκετ — πολύ φθηνότερο από ό,τι στο εξωτερικό.</p>

<h2>Τσίπουρο</h2>
<p>Το τοπικό απόσταγμα, παρόμοιο με γκράπα ή ρακία. Δοκιμάστε με ή χωρίς γλυκάνισο.</p>

<h2>Άλλα σουβενίρ</h2>
<ul>
<li><strong>Χειροποίητα σαπούνια:</strong> Με ελαιόλαδο, λεβάντα ή θυμάρι</li>
<li><strong>Κατασκευές από ελαιόξυλο:</strong> Σανίδες κοπής, κουτάλια, μπολ</li>
<li><strong>Φυσικά σφουγγάρια:</strong> Από τοπικούς ψαράδες</li>
<li><strong>Τοπικό κρασί:</strong> Ποικιλίες Μαλαγουζιά και Ασύρτικο</li>
</ul>

<h2>Πού να ψωνίσετε</h2>
<ul>
<li><strong>Παζάρι Αρναίας:</strong> Κάθε Σάββατο — μέλι, λάδι, υφαντά</li>
<li><strong>Αγορά Πολυγύρου:</strong> Η πρωτεύουσα, με μεγάλη αγορά</li>
<li><strong>Τουριστικά μαγαζιά Αφύτου/Νικήτης:</strong> Γοητευτικά καταστήματα σε πέτρινα σοκάκια</li>
<li><strong>Σούπερ μάρκετ:</strong> Lidl, AB, Masoutis — εξαιρετικό ελαιόλαδο σε πολύ χαμηλές τιμές</li>
</ul>`,

      en: `<h2>What to Buy in Halkidiki</h2>
<p>Halkidiki isn't just about beaches — it produces some of Greece's finest food products. These make excellent gifts and souvenirs that capture the flavors of your holiday.</p>

<h2>Halkidiki Green Olives (PDO)</h2>
<p>Halkidiki's green olives carry Protected Designation of Origin (PDO) status and are considered among the finest in the world. They are large, fleshy, and mild in flavor — distinctly different from Kalamata olives. The olive groves cover much of the interior landscape. You can buy them everywhere: supermarkets, olive oil mills, roadside stands, and specialty shops. Vacuum-packed options travel well in luggage.</p>

<h2>Local Honey</h2>
<p>Halkidiki produces exceptional honey, particularly thyme honey and pine honey. The area around Nikiti is a beekeeping center. Buy directly from producers at the Arnea Saturday market or from dedicated honey shops in tourist villages. Thyme honey has an intense, aromatic flavor; pine honey is darker with a rich, earthy taste.</p>

<h2>Olive Oil</h2>
<p>Cold-pressed extra virgin olive oil from local mills. Halkidiki's olive oil is fruity and mild, perfect for salads and cooking. Buying from local producers or even supermarkets gives you excellent quality at a fraction of the price you'd pay abroad. Tin cans are best for transport.</p>

<h2>Tsipouro</h2>
<p>The local grape spirit, similar to Italian grappa or Turkish raki. Available with or without anise flavoring. A staple at every Greek meal, usually served alongside meze (small dishes). Buy at liquor stores or supermarkets. Makes a unique gift.</p>

<h2>More Souvenirs</h2>
<ul>
<li><strong>Handmade soap:</strong> Olive oil-based soaps infused with lavender, thyme, or honey — lightweight and easy to pack</li>
<li><strong>Olive wood crafts:</strong> Cutting boards, salad servers, bowls, and kitchen utensils carved from local olive wood. Each piece is unique due to the wood's natural grain.</li>
<li><strong>Natural sea sponges:</strong> Harvested by local divers, available in tourist shops throughout the peninsula</li>
<li><strong>Local wine:</strong> Look for Malagouzia (aromatic white) and Assyrtiko (crisp white) from local vineyards. Porto Carras winery in Sithonia is well-known.</li>
<li><strong>Herbs and spices:</strong> Dried oregano, mountain tea (tsai tou vounou), and sage from the hillsides</li>
</ul>

<h2>Where to Shop</h2>
<ul>
<li><strong>Arnea Saturday Market:</strong> The most authentic shopping experience — local producers sell honey, olive oil, handwoven textiles, herbs, and fresh produce every Saturday morning. The village itself is worth the trip.</li>
<li><strong>Polygyros Market:</strong> The capital of Halkidiki has a good weekly market and several specialty food shops</li>
<li><strong>Tourist shops in Afytos:</strong> Charming shops along the stone-paved streets selling crafts, jewelry, and local products</li>
<li><strong>Tourist shops in Nikiti old village:</strong> Small artisan shops in the restored stone houses, specializing in honey and olive products</li>
<li><strong>Supermarkets:</strong> Lidl, AB Vassilopoulos, Masoutis — excellent olive oil and olives at very low prices. Stock up before you leave.</li>
<li><strong>Airport duty-free:</strong> Limited Halkidiki products; buy locally for better selection and prices</li>
</ul>

<h2>Packing Tips</h2>
<ul>
<li>Olive oil in tins is safer than glass bottles for luggage</li>
<li>Vacuum-sealed olives pack flat and won't leak</li>
<li>Honey jars should be wrapped in plastic bags as a precaution</li>
<li>Tsipouro bottles should be padded in checked luggage</li>
<li>Check airline liquid limits for carry-on if buying last minute</li>
</ul>`,

      de: `<h2>Was man in Chalkidiki kaufen sollte</h2>

<h2>Chalkidiki Grüne Oliven (PDO)</h2>
<p>Die grünen Oliven aus Chalkidiki tragen den Status Geschützte Ursprungsbezeichnung und gelten als eine der besten weltweit. Groß, fleischig und mild im Geschmack.</p>

<h2>Lokaler Honig</h2>
<p>Chalkidiki produziert außergewöhnlichen Honig, besonders Thymian-Honig und Kiefern-Honig. Die Gegend um Nikiti ist ein Imkerei-Zentrum.</p>

<h2>Olivenöl</h2>
<p>Kaltgepresstes natives Olivenöl extra aus lokalen Mühlen. Im Supermarkt kaufen — hervorragende Qualität zu einem Bruchteil des Preises.</p>

<h2>Tsipouro</h2>
<p>Lokaler Traubenschnaps, ähnlich wie Grappa. Mit oder ohne Anis erhältlich.</p>

<h2>Weitere Souvenirs</h2>
<ul>
<li><strong>Handgemachte Seife:</strong> Auf Olivenöl-Basis mit Lavendel oder Thymian</li>
<li><strong>Olivenholz-Handwerk:</strong> Schneidebretter, Salatbesteck, Schüsseln</li>
<li><strong>Natürliche Schwämme:</strong> Von lokalen Tauchern geerntet</li>
<li><strong>Lokaler Wein:</strong> Malagouzia und Assyrtiko von lokalen Weingütern</li>
</ul>

<h2>Wo einkaufen</h2>
<ul>
<li><strong>Arnea Samstagmarkt:</strong> Honig, Olivenöl, handgewebte Textilien</li>
<li><strong>Touristengeschäfte Afytos:</strong> Handwerk und lokale Produkte in steinernen Gassen</li>
<li><strong>Supermärkte:</strong> Lidl, AB, Masoutis — sehr günstig für Olivenöl</li>
</ul>`,

      bg: `<h2>Какво да купите в Халкидики</h2>

<h2>Зелени маслини от Халкидики (PDO)</h2>
<p>Зелените маслини от Халкидики имат Защитено наименование за произход и се считат за едни от най-добрите в света. Големи, месести и с мек вкус.</p>

<h2>Местен мед</h2>
<p>Изключителен мед от мащерка и бор. Районът около Никити е център на пчеларството.</p>

<h2>Зехтин</h2>
<p>Студено пресован екстра върджин от местни маслобойни. Отлично качество на ниска цена.</p>

<h2>Ципуро</h2>
<p>Местна гроздова ракия, подобна на граппа. С или без анасон.</p>

<h2>Други сувенири</h2>
<ul>
<li><strong>Ръчно правен сапун:</strong> На база зехтин с лавандула или мащерка</li>
<li><strong>Изделия от маслиново дърво:</strong> Дъски за рязане, лъжици, купи</li>
<li><strong>Естествени гъби:</strong> Събирани от местни водолази</li>
<li><strong>Местно вино:</strong> Малагузия и Асиртико</li>
</ul>

<h2>Къде да пазарувате</h2>
<ul>
<li><strong>Съботен пазар Арнеа:</strong> Мед, зехтин, ръчно тъкани текстили</li>
<li><strong>Магазини в Афитос:</strong> Занаяти и местни продукти</li>
<li><strong>Супермаркети:</strong> Lidl, AB, Masoutis — много евтин зехтин</li>
</ul>`,

      ru: `<h2>Что купить в Халкидиках</h2>

<h2>Зелёные оливки Халкидики (PDO)</h2>
<p>Зелёные оливки Халкидики имеют статус Защищённого наименования происхождения и считаются одними из лучших в мире. Крупные, мясистые, с мягким вкусом.</p>

<h2>Местный мёд</h2>
<p>Исключительный мёд, особенно тимьяновый и сосновый. Район Никити — центр пчеловодства. Покупайте напрямую у производителей на субботнем рынке Арнеа.</p>

<h2>Оливковое масло</h2>
<p>Холодного отжима, экстра вёрджин из местных маслобоен. Отличное качество по доступной цене — в разы дешевле, чем дома.</p>

<h2>Ципуро</h2>
<p>Местный виноградный дистиллят, похожий на граппу. С анисом или без. Неповторимый подарок.</p>

<h2>Другие сувениры</h2>
<ul>
<li><strong>Мыло ручной работы:</strong> На основе оливкового масла с лавандой или тимьяном</li>
<li><strong>Изделия из оливкового дерева:</strong> Разделочные доски, ложки, миски</li>
<li><strong>Натуральные губки:</strong> Добытые местными ныряльщиками</li>
<li><strong>Местное вино:</strong> Малагузия (ароматное белое) и Асиртико</li>
</ul>

<h2>Где покупать</h2>
<ul>
<li><strong>Субботний рынок Арнеа:</strong> Мёд, масло, ручной текстиль</li>
<li><strong>Магазины в Афитосе:</strong> Ремесленные изделия и местные продукты</li>
<li><strong>Супермаркеты:</strong> Lidl, AB, Masoutis — отличное масло по низким ценам</li>
</ul>`,

      ro: `<h2>Ce să cumperi în Halkidiki</h2>

<h2>Măsline verzi Halkidiki (PDO)</h2>
<p>Măslinele verzi din Halkidiki au statut de Denumire de Origine Protejată și sunt considerate printre cele mai bune din lume. Mari, cărnoase și cu gust blând.</p>

<h2>Miere locală</h2>
<p>Miere excepțională de cimbru și pin. Zona Nikiti este un centru apicol. Cumpără direct de la producători la piața de sâmbătă din Arnea.</p>

<h2>Ulei de măsline</h2>
<p>Presat la rece, extra virgin, de la mori locale. Calitate excelentă la prețuri mult mai mici decât acasă.</p>

<h2>Tsipouro</h2>
<p>Distilat local din struguri, similar cu grappa. Cu sau fără anason. Un cadou unic.</p>

<h2>Alte suveniruri</h2>
<ul>
<li><strong>Săpun handmade:</strong> Pe bază de ulei de măsline cu lavandă sau cimbru</li>
<li><strong>Obiecte din lemn de măslin:</strong> Tocătoare, linguri, boluri</li>
<li><strong>Bureți naturali:</strong> Culeși de scafandri locali</li>
<li><strong>Vin local:</strong> Malagouzia și Assyrtiko de la crame locale</li>
</ul>

<h2>Unde să faci cumpărături</h2>
<ul>
<li><strong>Piața de sâmbătă Arnea:</strong> Miere, ulei, textile artizanale — cel mai autentic</li>
<li><strong>Magazine în Afytos:</strong> Artizanat și produse locale pe străduțe de piatră</li>
<li><strong>Magazine în Nikiti vechi:</strong> Magazine mici de artizanat în case de piatră restaurate</li>
<li><strong>Supermarketuri:</strong> Lidl, AB, Masoutis — ulei de măsline excelent la prețuri foarte mici</li>
</ul>`,

      sr: `<h2>Šta kupiti u Halkidikiju</h2>

<h2>Halkidiki zelene masline (PDO)</h2>
<p>Zelene masline iz Halkidikija imaju status Zaštićene oznake porekla i smatraju se jednim od najboljih na svetu. Velike, mesnate i blagog ukusa.</p>

<h2>Lokalni med</h2>
<p>Izuzetan med od timijana i bora. Oblast oko Nikitija je centar pčelarstva. Kupujte direktno od proizvođača na subotnjoj pijaci u Arnei.</p>

<h2>Maslinovo ulje</h2>
<p>Hladno ceđeno, ekstra devičansko iz lokalnih uljara. Odličan kvalitet po pristupačnoj ceni.</p>

<h2>Cipouro</h2>
<p>Lokalni destilat od grožđa, sličan grapi. Sa ili bez anisa. Jedinstven poklon.</p>

<h2>Drugi suveniri</h2>
<ul>
<li><strong>Ručno pravljeni sapun:</strong> Na bazi maslinovog ulja sa lavandom ili timijanom</li>
<li><strong>Predmeti od maslinovog drveta:</strong> Daske za sečenje, kašike, činije</li>
<li><strong>Prirodni sunđeri:</strong> Sakupljeni od lokalnih ronilaca</li>
<li><strong>Lokalno vino:</strong> Malaguzija i Asirtiko sa lokalnih vinarija</li>
</ul>

<h2>Gde kupovati</h2>
<ul>
<li><strong>Subotnja pijaca Arnea:</strong> Med, ulje, ručno tkani tekstil — najautentičnije iskustvo</li>
<li><strong>Prodavnice u Afitosu:</strong> Zanatski predmeti i lokalni proizvodi</li>
<li><strong>Supermarketi:</strong> Lidl, AB, Masoutis — odlično maslinovo ulje po veoma niskim cenama</li>
</ul>`,
    },
  },
  {
    slug: 'halkidiki-vs-crete', icon: 'Scale', color: 'blue',
    title: { el: 'Χαλκιδική ή Κρήτη;', en: 'Halkidiki vs Crete', de: 'Chalkidiki oder Kreta?', bg: 'Халкидики или Крит?', ru: 'Халкидики или Крит?', ro: 'Halkidiki sau Creta?', sr: 'Halkidiki ili Krit?' },
    description: { el: 'Σύγκριση δύο κορυφαίων προορισμών', en: 'Comparing two top destinations', de: 'Vergleich zweier Top-Ziele', bg: 'Сравнение на две топ дестинации', ru: 'Сравнение двух топ-направлений', ro: 'Comparație între două destinații de top', sr: 'Poređenje dve top destinacije' },
    metaTitle: { el: 'Χαλκιδική ή Κρήτη; Σύγκριση 2026 | ChalkidikiHub', en: 'Halkidiki vs Crete 2026 — Full Comparison', de: 'Chalkidiki vs Kreta 2026 — Vergleich', bg: 'Халкидики или Крит 2026 — Сравнение', ru: 'Халкидики или Крит 2026 — Сравнение', ro: 'Halkidiki vs Creta 2026 — Comparație', sr: 'Halkidiki ili Krit 2026 — Poređenje' },
    metaDesc: { el: 'Χαλκιδική ή Κρήτη; Παραλίες, κόστος, πρόσβαση, φαγητό, δραστηριότητες — η πλήρης σύγκριση.', en: 'Halkidiki or Crete? Beaches, cost, access, food, activities — the full comparison.', de: 'Chalkidiki oder Kreta? Strände, Kosten, Anreise, Essen — der vollständige Vergleich.', bg: 'Халкидики или Крит? Плажове, цени, достъп, храна — пълно сравнение.', ru: 'Халкидики или Крит? Пляжи, стоимость, доступ, еда — полное сравнение.', ro: 'Halkidiki sau Creta? Plaje, costuri, acces, mâncare — comparație completă.', sr: 'Halkidiki ili Krit? Plaže, cene, pristup, hrana — potpuno poređenje.' },
    content: {
      el: `<h2>Χαλκιδική ή Κρήτη;</h2><p>Δύο κορυφαίοι ελληνικοί προορισμοί με διαφορετικό χαρακτήρα. Η <strong>Κρήτη</strong> είναι το μεγαλύτερο νησί της Ελλάδας με πλούσια ιστορία, βουνά και εξωτικές παραλίες. Η <strong>Χαλκιδική</strong> είναι μια χερσόνησος στη Βόρεια Ελλάδα με 3 "πόδια", πευκόφυτες ακτές και πιο ήρεμη ατμόσφαιρα.</p><h2>Παραλίες</h2><p>Η Κρήτη διαθέτει διάσημες παραλίες (Ελαφονήσι, Μπάλος). Η Χαλκιδική έχει πάνω από <a href="/beaches">100 παραλίες</a> με λευκή άμμο και πευκοδάση — ιδιαίτερα στη <a href="/guide/sithonia">Σιθωνία</a>. Για πιο ρηχά και οικογενειακά νερά → Χαλκιδική.</p><h2>Πρόσβαση</h2><p>Η Χαλκιδική κερδίζει εύκολα: μόλις 1 ώρα από το αεροδρόμιο Θεσσαλονίκης, χωρίς ferry. Στην Κρήτη χρειάζεστε πτήση και συχνά εσωτερικές μετακινήσεις. Δείτε τον οδηγό <a href="/guide/getting-here">πρόσβασης</a>.</p><h2>Κόστος</h2><p>Η Χαλκιδική είναι <strong>γενικά φθηνότερη</strong> σε φαγητό και καταλύματα. Δείτε τον <a href="/costs/daily-budget">αναλυτικό προϋπολογισμό</a>.</p><h2>Φαγητό</h2><p>Η Κρήτη φημίζεται για την κρητική διατροφή. Η Χαλκιδική προσφέρει φρέσκα ψάρια, μουσακά και παραδοσιακά <a href="/restaurants">εστιατόρια</a>.</p><h2>Ποιος νικάει;</h2><p>Για χαλαρές διακοπές χωρίς ferry → <strong>Χαλκιδική</strong>. Για αρχαία και ορεινή εξερεύνηση → Κρήτη.</p>`,
      en: `<h2>Halkidiki vs Crete</h2><p>Two top Greek destinations with very different personalities. <strong>Crete</strong> is Greece's largest island, with rich history, dramatic mountains, and exotic beaches. <strong>Halkidiki</strong> is a mainland peninsula in Northern Greece with 3 "legs", pine-covered shores, and a calmer vibe.</p><h2>Beaches</h2><p>Crete has famous beaches like Elafonissi and Balos. Halkidiki has over <a href="/beaches">100 beaches</a> with white sand and pine forests — especially in <a href="/guide/sithonia">Sithonia</a>. For shallow, family-friendly waters → Halkidiki wins.</p><h2>Access</h2><p>Halkidiki wins easily: just 1 hour from Thessaloniki airport — no ferry needed. Crete requires a flight and often internal transfers. See our <a href="/guide/getting-here">access guide</a>.</p><h2>Cost</h2><p>Halkidiki is generally <strong>cheaper</strong> for food and accommodation. See the <a href="/costs/daily-budget">daily budget</a>.</p><h2>Food</h2><p>Crete is famous for Cretan cuisine. Halkidiki offers fresh seafood, moussaka, and traditional <a href="/restaurants">tavernas</a>.</p><h2>Who wins?</h2><p>For relaxed holidays without a ferry → <strong>Halkidiki</strong>. For ancient ruins and mountain exploration → Crete.</p>`,
      de: `<h2>Chalkidiki oder Kreta?</h2><p>Zwei Top-Ziele Griechenlands mit unterschiedlichem Charakter. <strong>Kreta</strong> ist die größte Insel Griechenlands mit reicher Geschichte. <strong>Chalkidiki</strong> ist eine Halbinsel in Nordgriechenland mit 3 "Beinen" und kieferngesäumten Küsten.</p><h2>Strände</h2><p>Kreta hat berühmte Strände (Elafonissi, Balos). Chalkidiki hat über <a href="/beaches">100 Strände</a> — besonders in <a href="/guide/sithonia">Sithonia</a>.</p><h2>Anreise</h2><p>Chalkidiki gewinnt: nur 1 Stunde vom Flughafen Thessaloniki. Siehe <a href="/guide/getting-here">Anreise-Guide</a>.</p><h2>Kosten</h2><p>Chalkidiki ist im Allgemeinen <strong>günstiger</strong>. Siehe <a href="/costs/daily-budget">Tagesbudget</a>.</p><h2>Wer gewinnt?</h2><p>Für entspannten Urlaub → <strong>Chalkidiki</strong>. Für antike Ruinen → Kreta.</p>`,
      bg: `<h2>Халкидики или Крит?</h2><p>Две топ гръцки дестинации. <strong>Крит</strong> е най-големият остров с богата история. <strong>Халкидики</strong> е полуостров в Северна Гърция с 3 "крака" и борови брегове.</p><h2>Плажове</h2><p>Халкидики има над <a href="/beaches">100 плажа</a> — особено в <a href="/guide/sithonia">Ситония</a>.</p><h2>Достъп</h2><p>Халкидики побеждава: само 1 час от летище Солун, без ферибот.</p><h2>Цена</h2><p>Халкидики е по-евтин. Виж <a href="/costs/daily-budget">дневен бюджет</a>.</p><h2>Кой печели?</h2><p>За спокойна ваканция без ферибот → <strong>Халкидики</strong>.</p>`,
      ru: `<h2>Халкидики или Крит?</h2><p>Два топовых греческих направления. <strong>Крит</strong> — крупнейший остров Греции с богатой историей. <strong>Халкидики</strong> — полуостров в Северной Греции с 3 "ногами" и сосновыми берегами.</p><h2>Пляжи</h2><p>Халкидики предлагает более <a href="/beaches">100 пляжей</a> — особенно в <a href="/guide/sithonia">Ситонии</a>.</p><h2>Доступ</h2><p>Халкидики выигрывает: всего 1 час от аэропорта Салоник, без парома.</p><h2>Цена</h2><p>Халкидики дешевле. См. <a href="/costs/daily-budget">дневной бюджет</a>.</p><h2>Кто побеждает?</h2><p>Для спокойного отдыха без парома → <strong>Халкидики</strong>.</p>`,
      ro: `<h2>Halkidiki sau Creta?</h2><p>Două destinații grecești de top. <strong>Creta</strong> este cea mai mare insulă a Greciei. <strong>Halkidiki</strong> este o peninsulă în nordul Greciei cu 3 "picioare" și țărmuri cu pini.</p><h2>Plaje</h2><p>Halkidiki are peste <a href="/beaches">100 de plaje</a> — mai ales în <a href="/guide/sithonia">Sithonia</a>.</p><h2>Acces</h2><p>Halkidiki câștigă: doar 1 oră de la aeroportul Salonic, fără feribot.</p><h2>Cost</h2><p>Halkidiki este mai ieftin. Vezi <a href="/costs/daily-budget">buget zilnic</a>.</p><h2>Cine câștigă?</h2><p>Pentru vacanțe relaxate fără feribot → <strong>Halkidiki</strong>.</p>`,
      sr: `<h2>Halkidiki ili Krit?</h2><p>Dve top grčke destinacije. <strong>Krit</strong> je najveće ostrvo Grčke. <strong>Halkidiki</strong> je poluostrvo u severnoj Grčkoj sa 3 "noge" i borovim obalama.</p><h2>Plaže</h2><p>Halkidiki ima preko <a href="/beaches">100 plaža</a> — naročito u <a href="/guide/sithonia">Sitoniji</a>.</p><h2>Pristup</h2><p>Halkidiki pobeđuje: samo 1 sat od aerodroma Solun, bez trajekta.</p><h2>Cena</h2><p>Halkidiki je jeftiniji. Vidite <a href="/costs/daily-budget">dnevni budžet</a>.</p><h2>Ko pobeđuje?</h2><p>Za opuštenu vakanciju bez trajekta → <strong>Halkidiki</strong>.</p>`,
    },
  },
  {
    slug: 'halkidiki-vs-rhodes', icon: 'Scale', color: 'amber',
    title: { el: 'Χαλκιδική ή Ρόδος;', en: 'Halkidiki vs Rhodes', de: 'Chalkidiki oder Rhodos?', bg: 'Халкидики или Родос?', ru: 'Халкидики или Родос?', ro: 'Halkidiki sau Rodos?', sr: 'Halkidiki ili Rodos?' },
    description: { el: 'Νησί ιπποτών ή χερσόνησος πεύκων;', en: 'Knights island or pine peninsula?', de: 'Ritterinsel oder Kiefernhalbinsel?', bg: 'Остров на рицарите или борист полуостров?', ru: 'Остров рыцарей или сосновый полуостров?', ro: 'Insula cavalerilor sau peninsula de pini?', sr: 'Ostrvo vitezova ili borov poluostrvo?' },
    metaTitle: { el: 'Χαλκιδική ή Ρόδος; Σύγκριση 2026', en: 'Halkidiki vs Rhodes — Full 2026 Comparison', de: 'Chalkidiki vs Rhodos — Vergleich 2026', bg: 'Халкидики или Родос 2026', ru: 'Халкидики или Родос 2026', ro: 'Halkidiki vs Rodos 2026', sr: 'Halkidiki ili Rodos 2026' },
    metaDesc: { el: 'Ρόδος ή Χαλκιδική; Πού να πάτε για παραλίες, ιστορία, κόστος και πρόσβαση.', en: 'Rhodes or Halkidiki? Where to go for beaches, history, cost, and access.', de: 'Rhodos oder Chalkidiki? Strände, Geschichte, Kosten, Anreise.', bg: 'Родос или Халкидики? Къде да отидете.', ru: 'Родос или Халкидики? Куда ехать.', ro: 'Rodos sau Halkidiki? Unde să mergeți.', sr: 'Rodos ili Halkidiki? Gde ići.' },
    content: {
      el: `<h2>Χαλκιδική ή Ρόδος;</h2><p>Δύο εντελώς διαφορετικοί προορισμοί. Η <strong>Ρόδος</strong> είναι το νησί των Ιπποτών με μεσαιωνική πόλη-μνημείο UNESCO. Η <strong>Χαλκιδική</strong> είναι η πρασινοντυμένη χερσόνησος της Μακεδονίας με πευκοδασωμένες ακτές.</p><h2>Ιστορία & Πολιτισμός</h2><p>Η Ρόδος κερδίζει στην ιστορική κληρονομιά. Η Χαλκιδική όμως φιλοξενεί το <a href="/mount-athos">Άγιο Όρος</a> και αρχαία μνημεία στο <a href="/guide/aristotle-trail">μονοπάτι του Αριστοτέλη</a>.</p><h2>Παραλίες</h2><p>Η Ρόδος έχει παραλίες με βότσαλα και ανέμους. Η Χαλκιδική έχει <a href="/beaches">παραλίες με λευκή άμμο</a> και ρηχά νερά.</p><h2>Πρόσβαση</h2><p>Χαλκιδική → 1 ώρα από SKG, χωρίς πτήση εσωτερικού. Ρόδος → διεθνές αεροδρόμιο αλλά απομονωμένο. Δείτε <a href="/from/sofia">ταξίδι από Σόφια</a>.</p><h2>Κόστος</h2><p>Η Χαλκιδική είναι γενικά φθηνότερη. Δείτε τις <a href="/costs/food-prices">τιμές φαγητού</a>.</p><h2>Ποιος νικάει;</h2><p>Για ιστορία → Ρόδος. Για ηρεμία, πεύκα, εύκολη πρόσβαση → <strong>Χαλκιδική</strong>.</p>`,
      en: `<h2>Halkidiki vs Rhodes</h2><p>Two very different destinations. <strong>Rhodes</strong> is the Knights' island with its UNESCO medieval old town. <strong>Halkidiki</strong> is Macedonia's green peninsula with pine-covered shores.</p><h2>History & Culture</h2><p>Rhodes wins on historical heritage. But Halkidiki hosts <a href="/mount-athos">Mount Athos</a> and ancient monuments on the <a href="/guide/aristotle-trail">Aristotle Trail</a>.</p><h2>Beaches</h2><p>Rhodes has pebble beaches and windy coasts. Halkidiki has <a href="/beaches">white sand beaches</a> and shallow waters.</p><h2>Access</h2><p>Halkidiki → 1 hour from SKG airport, no domestic flight. Rhodes → international airport but isolated. See <a href="/from/sofia">travel from Sofia</a>.</p><h2>Cost</h2><p>Halkidiki is generally cheaper. See <a href="/costs/food-prices">food prices</a>.</p><h2>Who wins?</h2><p>For history → Rhodes. For tranquility, pines, easy access → <strong>Halkidiki</strong>.</p>`,
      de: `<h2>Chalkidiki oder Rhodos?</h2><p>Zwei sehr unterschiedliche Ziele. <strong>Rhodos</strong> ist die Ritterinsel mit UNESCO-Altstadt. <strong>Chalkidiki</strong> ist die grüne Halbinsel Makedoniens.</p><h2>Geschichte</h2><p>Rhodos gewinnt bei Geschichte. Chalkidiki bietet <a href="/mount-athos">Athos</a>.</p><h2>Strände</h2><p>Chalkidiki hat <a href="/beaches">weiße Sandstrände</a>.</p><h2>Anreise</h2><p>Chalkidiki → 1 Std. vom SKG-Flughafen.</p><h2>Wer gewinnt?</h2><p>Für Geschichte → Rhodos. Für Ruhe → <strong>Chalkidiki</strong>.</p>`,
      bg: `<h2>Халкидики или Родос?</h2><p><strong>Родос</strong> е остров на рицарите. <strong>Халкидики</strong> е зелен полуостров в Македония.</p><h2>История</h2><p>Родос печели в историята. Халкидики има <a href="/mount-athos">Атон</a>.</p><h2>Плажове</h2><p>Халкидики — <a href="/beaches">бели пясъчни плажове</a>.</p><h2>Достъп</h2><p>Халкидики → 1 час от SKG.</p><h2>Кой печели?</h2><p>За история → Родос. За спокойствие → <strong>Халкидики</strong>.</p>`,
      ru: `<h2>Халкидики или Родос?</h2><p><strong>Родос</strong> — остров рыцарей. <strong>Халкидики</strong> — зелёный полуостров Македонии.</p><h2>История</h2><p>Родос побеждает. Халкидики имеет <a href="/mount-athos">Афон</a>.</p><h2>Пляжи</h2><p>Халкидики — <a href="/beaches">белые песчаные пляжи</a>.</p><h2>Доступ</h2><p>Халкидики → 1 час от SKG.</p><h2>Кто побеждает?</h2><p>Для истории → Родос. Для тишины → <strong>Халкидики</strong>.</p>`,
      ro: `<h2>Halkidiki sau Rodos?</h2><p><strong>Rodos</strong> este insula cavalerilor. <strong>Halkidiki</strong> este peninsula verde a Macedoniei.</p><h2>Istorie</h2><p>Rodos câștigă. Halkidiki are <a href="/mount-athos">Athos</a>.</p><h2>Plaje</h2><p>Halkidiki — <a href="/beaches">plaje cu nisip alb</a>.</p><h2>Acces</h2><p>Halkidiki → 1 oră de la SKG.</p><h2>Cine câștigă?</h2><p>Pentru istorie → Rodos. Pentru liniște → <strong>Halkidiki</strong>.</p>`,
      sr: `<h2>Halkidiki ili Rodos?</h2><p><strong>Rodos</strong> je ostrvo vitezova. <strong>Halkidiki</strong> je zeleno poluostrvo Makedonije.</p><h2>Istorija</h2><p>Rodos pobeđuje. Halkidiki ima <a href="/mount-athos">Atos</a>.</p><h2>Plaže</h2><p>Halkidiki — <a href="/beaches">bele peščane plaže</a>.</p><h2>Pristup</h2><p>Halkidiki → 1 sat od SKG.</p><h2>Ko pobeđuje?</h2><p>Za istoriju → Rodos. Za mir → <strong>Halkidiki</strong>.</p>`,
    },
  },
  {
    slug: 'halkidiki-vs-corfu', icon: 'Scale', color: 'emerald',
    title: { el: 'Χαλκιδική ή Κέρκυρα;', en: 'Halkidiki vs Corfu', de: 'Chalkidiki oder Korfu?', bg: 'Халкидики или Корфу?', ru: 'Халкидики или Корфу?', ro: 'Halkidiki sau Corfu?', sr: 'Halkidiki ili Krf?' },
    description: { el: 'Ιόνιο ή Αιγαίο;', en: 'Ionian or Aegean?', de: 'Ionisch oder Ägäisch?', bg: 'Йонийско или Егейско?', ru: 'Ионическое или Эгейское?', ro: 'Ionian sau Egeean?', sr: 'Jonsko ili Egejsko?' },
    metaTitle: { el: 'Χαλκιδική ή Κέρκυρα; Σύγκριση 2026', en: 'Halkidiki vs Corfu — 2026 Comparison', de: 'Chalkidiki vs Korfu 2026', bg: 'Халкидики или Корфу 2026', ru: 'Халкидики или Корфу 2026', ro: 'Halkidiki vs Corfu 2026', sr: 'Halkidiki ili Krf 2026' },
    metaDesc: { el: 'Κέρκυρα ή Χαλκιδική; Κλίμα, παραλίες, κόστος και πρόσβαση.', en: 'Corfu or Halkidiki? Climate, beaches, cost, access.', de: 'Korfu oder Chalkidiki? Klima, Strände, Kosten.', bg: 'Корфу или Халкидики? Климат, плажове.', ru: 'Корфу или Халкидики? Климат, пляжи.', ro: 'Corfu sau Halkidiki? Climă, plaje.', sr: 'Krf ili Halkidiki? Klima, plaže.' },
    content: {
      el: `<h2>Χαλκιδική ή Κέρκυρα;</h2><p>Δύο όμορφοι προορισμοί σε διαφορετικές θάλασσες. Η <strong>Κέρκυρα</strong> ανήκει στα Ιόνια με ενετική αρχιτεκτονική και καταπράσινα τοπία. Η <strong>Χαλκιδική</strong> βρίσκεται στο Αιγαίο με 3 χερσονήσους και πευκοδάση.</p><h2>Κλίμα</h2><p>Η Κέρκυρα είναι πιο υγρή (περισσότερη βλάστηση). Η Χαλκιδική έχει πιο ξηρό, μεσογειακό κλίμα — δες τον <a href="/guide/weather">οδηγό καιρού</a>.</p><h2>Παραλίες</h2><p>Η Κέρκυρα έχει βραχώδεις παραλίες σε πέτρινα λαγκάδια (Παλαιοκαστρίτσα). Η Χαλκιδική έχει ατελείωτες αμμουδιές — δες τις <a href="/best/beaches-sithonia">καλύτερες της Σιθωνίας</a>.</p><h2>Πρόσβαση</h2><p>Χαλκιδική → 1 ώρα από το αεροδρόμιο Θεσσαλονίκης, χωρίς ferry. Κέρκυρα → πτήση ή ferry. Δείτε <a href="/from/belgrade">πρόσβαση από Βελιγράδι</a>.</p><h2>Κόστος</h2><p>Η Χαλκιδική είναι σαφώς πιο οικονομική. Δες <a href="/costs/accommodation-prices">τιμές καταλυμάτων</a>.</p><h2>Ποιος νικάει;</h2><p>Για Βρετανική ατμόσφαιρα & ενετική πόλη → Κέρκυρα. Για ευκολία, κόστος, αμμουδιές → <strong>Χαλκιδική</strong>.</p>`,
      en: `<h2>Halkidiki vs Corfu</h2><p>Two beautiful destinations in different seas. <strong>Corfu</strong> is in the Ionian with Venetian architecture and lush landscapes. <strong>Halkidiki</strong> is in the Aegean with 3 peninsulas and pine forests.</p><h2>Climate</h2><p>Corfu is wetter (more vegetation). Halkidiki has a drier Mediterranean climate — see the <a href="/guide/weather">weather guide</a>.</p><h2>Beaches</h2><p>Corfu has rocky beaches in stone coves (Paleokastritsa). Halkidiki has endless sandy beaches — see <a href="/best/beaches-sithonia">best of Sithonia</a>.</p><h2>Access</h2><p>Halkidiki → 1 hour from Thessaloniki airport, no ferry. Corfu → flight or ferry. See <a href="/from/belgrade">access from Belgrade</a>.</p><h2>Cost</h2><p>Halkidiki is clearly more affordable. See <a href="/costs/accommodation-prices">accommodation prices</a>.</p><h2>Who wins?</h2><p>For British-feel and Venetian town → Corfu. For ease, cost, sandy beaches → <strong>Halkidiki</strong>.</p>`,
      de: `<h2>Chalkidiki oder Korfu?</h2><p><strong>Korfu</strong> liegt im Ionischen Meer mit venezianischer Architektur. <strong>Chalkidiki</strong> liegt in der Ägäis mit 3 Halbinseln.</p><h2>Klima</h2><p>Korfu ist feuchter. Chalkidiki mediterran-trocken.</p><h2>Strände</h2><p>Chalkidiki hat lange Sandstrände — siehe <a href="/beaches">Strände</a>.</p><h2>Anreise</h2><p>Chalkidiki → 1 Std. vom Flughafen.</p><h2>Wer gewinnt?</h2><p>Für venezianische Stadt → Korfu. Für Einfachheit → <strong>Chalkidiki</strong>.</p>`,
      bg: `<h2>Халкидики или Корфу?</h2><p><strong>Корфу</strong> е в Йонийско море. <strong>Халкидики</strong> е в Егейско море с 3 полуострова.</p><h2>Климат</h2><p>Корфу е по-влажен.</p><h2>Плажове</h2><p>Халкидики има дълги пясъчни <a href="/beaches">плажове</a>.</p><h2>Достъп</h2><p>Халкидики → 1 час от летището.</p><h2>Кой печели?</h2><p>За ленив престой → <strong>Халкидики</strong>.</p>`,
      ru: `<h2>Халкидики или Корфу?</h2><p><strong>Корфу</strong> в Ионическом море. <strong>Халкидики</strong> в Эгейском море с 3 полуостровами.</p><h2>Климат</h2><p>Корфу влажнее.</p><h2>Пляжи</h2><p>Халкидики — длинные <a href="/beaches">песчаные пляжи</a>.</p><h2>Доступ</h2><p>Халкидики → 1 час от аэропорта.</p><h2>Кто побеждает?</h2><p>Для отдыха → <strong>Халкидики</strong>.</p>`,
      ro: `<h2>Halkidiki sau Corfu?</h2><p><strong>Corfu</strong> este în Marea Ionică. <strong>Halkidiki</strong> în Marea Egee cu 3 peninsule.</p><h2>Climă</h2><p>Corfu e mai umed.</p><h2>Plaje</h2><p>Halkidiki — <a href="/beaches">plaje cu nisip</a>.</p><h2>Acces</h2><p>Halkidiki → 1 oră de la aeroport.</p><h2>Cine câștigă?</h2><p>Pentru vacanțe ușoare → <strong>Halkidiki</strong>.</p>`,
      sr: `<h2>Halkidiki ili Krf?</h2><p><strong>Krf</strong> je u Jonskom moru. <strong>Halkidiki</strong> u Egejskom sa 3 poluostrva.</p><h2>Klima</h2><p>Krf je vlažniji.</p><h2>Plaže</h2><p>Halkidiki — <a href="/beaches">peščane plaže</a>.</p><h2>Pristup</h2><p>Halkidiki → 1 sat od aerodroma.</p><h2>Ko pobeđuje?</h2><p>Za lak odmor → <strong>Halkidiki</strong>.</p>`,
    },
  },
  {
    slug: 'for-seniors', icon: 'Heart', color: 'rose',
    title: { el: 'Χαλκιδική για Ηλικιωμένους', en: 'Halkidiki for Seniors', de: 'Chalkidiki für Senioren', bg: 'Халкидики за възрастни', ru: 'Халкидики для пожилых', ro: 'Halkidiki pentru seniori', sr: 'Halkidiki za starije' },
    description: { el: 'Εύκολη πρόσβαση, ήρεμες παραλίες', en: 'Easy access, calm beaches', de: 'Einfacher Zugang, ruhige Strände', bg: 'Лесен достъп, спокойни плажове', ru: 'Лёгкий доступ, спокойные пляжи', ro: 'Acces ușor, plaje liniștite', sr: 'Lak pristup, mirne plaže' },
    metaTitle: { el: 'Χαλκιδική για Ηλικιωμένους — Οδηγός 2026', en: 'Halkidiki for Seniors — 2026 Guide', de: 'Chalkidiki für Senioren 2026', bg: 'Халкидики за възрастни 2026', ru: 'Халкидики для пожилых 2026', ro: 'Halkidiki pentru seniori 2026', sr: 'Halkidiki za starije 2026' },
    metaDesc: { el: 'Οδηγός για ηλικιωμένους: εύκολη πρόσβαση, ήρεμα καταλύματα, προσβάσιμες παραλίες.', en: 'Guide for senior travelers: easy access, calm accommodation, accessible beaches.', de: 'Reiseführer für Senioren: einfache Anreise, ruhige Unterkünfte.', bg: 'Пътеводител за възрастни: лесен достъп, спокойни плажове.', ru: 'Путеводитель для пожилых: лёгкий доступ.', ro: 'Ghid pentru seniori: acces ușor.', sr: 'Vodič za starije: lak pristup.' },
    content: {
      el: `<h2>Γιατί Χαλκιδική για Ηλικιωμένους;</h2><p>Η Χαλκιδική είναι <strong>ιδανικός προορισμός</strong> για μεγαλύτερους ταξιδιώτες: 1 ώρα από το αεροδρόμιο Θεσσαλονίκης, ήπιο κλίμα, ήρεμες παραλίες και εξαιρετικές ιατρικές υπηρεσίες.</p><h2>Προσβάσιμες Παραλίες</h2><ul><li><strong>Κρυοπηγή & Χανιώτη:</strong> Οργανωμένες με ξαπλώστρες και εύκολη πρόσβαση</li><li><strong>Σάνη:</strong> Πολυτελείς εγκαταστάσεις με ράμπες</li><li><strong>Νέα Φώκαια:</strong> Μικρή παραλιακή βόλτα</li></ul>Δείτε όλες τις <a href="/beaches">παραλίες</a>.<h2>Ιδανική Περίοδος</h2><p>Μάιος, Ιούνιος, <a href="/guide/september">Σεπτέμβριος</a> ή <a href="/guide/may">Μάιος</a> — χωρίς υπερβολική ζέστη και κοσμοσυρροή.</p><h2>Καταλύματα</h2><p>Επιλέξτε <a href="/guide/all-inclusive">all-inclusive</a> resorts ή <a href="/guide/hotels">boutique ξενοδοχεία</a> με πισίνα και εστιατόριο επί τόπου.</p><h2>Δραστηριότητες</h2><ul><li>Χαλαρωτικοί περίπατοι σε <a href="/villages">παραδοσιακά χωριά</a> (Αφυτος, Παρθενώνας)</li><li>Κρουαζιέρα γύρω από το <a href="/mount-athos">Άγιο Όρος</a></li><li>Θερμά λουτρά στον Άγιο Παρασκευή</li></ul><h2>Ιατρικές Υπηρεσίες</h2><p>Κέντρα υγείας σε Κασσάνδρα, Πολύγυρο, Νέα Μουδανιά. Θεσσαλονίκη 1 ώρα μακριά για ιατρικές υπηρεσίες υψηλού επιπέδου.</p>`,
      en: `<h2>Why Halkidiki for Seniors?</h2><p>Halkidiki is an <strong>ideal destination</strong> for older travelers: only 1 hour from Thessaloniki airport, mild climate, calm beaches, and excellent medical services.</p><h2>Accessible Beaches</h2><ul><li><strong>Kriopigi & Hanioti:</strong> Organized with loungers and easy access</li><li><strong>Sani:</strong> Luxury facilities with ramps</li><li><strong>Nea Fokea:</strong> Short seaside promenade</li></ul>See all <a href="/beaches">beaches</a>.<h2>Best Period</h2><p>May, June, <a href="/guide/september">September</a> or <a href="/guide/may">May</a> — no extreme heat or crowds.</p><h2>Accommodation</h2><p>Choose <a href="/guide/all-inclusive">all-inclusive</a> resorts or <a href="/guide/hotels">boutique hotels</a> with pool and on-site restaurant.</p><h2>Activities</h2><ul><li>Relaxing walks in <a href="/villages">traditional villages</a> (Afytos, Parthenonas)</li><li>Cruise around <a href="/mount-athos">Mount Athos</a></li><li>Thermal baths at Agia Paraskevi</li></ul><h2>Medical Services</h2><p>Health centers in Kassandra, Polygyros, Nea Moudania. Thessaloniki is 1 hour away for top-level medical services.</p>`,
      de: `<h2>Warum Chalkidiki für Senioren?</h2><p>Chalkidiki ist <strong>ideal für ältere Reisende</strong>: nur 1 Stunde vom Flughafen, mildes Klima, ruhige Strände.</p><h2>Zugängliche Strände</h2><ul><li><strong>Kriopigi & Hanioti:</strong> Organisiert mit Liegen</li><li><strong>Sani:</strong> Luxus mit Rampen</li></ul>Siehe alle <a href="/beaches">Strände</a>.<h2>Beste Zeit</h2><p>Mai, Juni, <a href="/guide/september">September</a> — keine extreme Hitze.</p><h2>Unterkunft</h2><p>Wählen Sie <a href="/guide/all-inclusive">All-inclusive</a> Resorts.</p><h2>Aktivitäten</h2><p>Spaziergänge in <a href="/villages">traditionellen Dörfern</a>.</p>`,
      bg: `<h2>Защо Халкидики за възрастни?</h2><p>Халкидики е <strong>идеална дестинация</strong>: само 1 час от летището, мек климат.</p><h2>Достъпни плажове</h2><ul><li><strong>Криопиги & Ханиоти:</strong> Организирани</li></ul>Виж всички <a href="/beaches">плажове</a>.<h2>Най-добро време</h2><p>Май, юни, <a href="/guide/september">септември</a>.</p><h2>Настаняване</h2><p><a href="/guide/all-inclusive">All-inclusive</a> курорти.</p>`,
      ru: `<h2>Почему Халкидики для пожилых?</h2><p>Халкидики — <strong>идеальное направление</strong>: всего 1 час от аэропорта, мягкий климат.</p><h2>Доступные пляжи</h2><ul><li><strong>Криопиги и Ханиоти</strong></li></ul>См. все <a href="/beaches">пляжи</a>.<h2>Лучшее время</h2><p>Май, июнь, <a href="/guide/september">сентябрь</a>.</p><h2>Размещение</h2><p><a href="/guide/all-inclusive">All-inclusive</a> курорты.</p>`,
      ro: `<h2>De ce Halkidiki pentru seniori?</h2><p>Halkidiki este <strong>destinația ideală</strong>: doar 1 oră de la aeroport, climă blândă.</p><h2>Plaje accesibile</h2><ul><li><strong>Kriopigi & Hanioti</strong></li></ul>Vezi toate <a href="/beaches">plajele</a>.<h2>Cel mai bun moment</h2><p>Mai, iunie, <a href="/guide/september">septembrie</a>.</p><h2>Cazare</h2><p>Stațiuni <a href="/guide/all-inclusive">all-inclusive</a>.</p>`,
      sr: `<h2>Zašto Halkidiki za starije?</h2><p>Halkidiki je <strong>idealna destinacija</strong>: samo 1 sat od aerodroma, blaga klima.</p><h2>Pristupačne plaže</h2><ul><li><strong>Kriopigi i Hanioti</strong></li></ul>Vidite sve <a href="/beaches">plaže</a>.<h2>Najbolje vreme</h2><p>Maj, jun, <a href="/guide/september">septembar</a>.</p><h2>Smeštaj</h2><p><a href="/guide/all-inclusive">All-inclusive</a> resorti.</p>`,
    },
  },
  {
    slug: 'for-couples', icon: 'HeartHandshake', color: 'pink',
    title: { el: 'Χαλκιδική για Ζευγάρια', en: 'Halkidiki for Couples', de: 'Chalkidiki für Paare', bg: 'Халкидики за двойки', ru: 'Халкидики для пар', ro: 'Halkidiki pentru cupluri', sr: 'Halkidiki za parove' },
    description: { el: 'Ρομαντικές στιγμές στην καρδιά του Αιγαίου', en: 'Romantic moments in the heart of the Aegean', de: 'Romantische Momente in der Ägäis', bg: 'Романтични моменти', ru: 'Романтические моменты', ro: 'Momente romantice', sr: 'Romantični trenuci' },
    metaTitle: { el: 'Χαλκιδική για Ζευγάρια — Ρομαντικός Οδηγός 2026', en: 'Halkidiki for Couples — Romantic Guide 2026', de: 'Chalkidiki für Paare — Romantikführer 2026', bg: 'Халкидики за двойки 2026', ru: 'Халкидики для пар 2026', ro: 'Halkidiki pentru cupluri 2026', sr: 'Halkidiki za parove 2026' },
    metaDesc: { el: 'Ρομαντικές δραστηριότητες για ζευγάρια: βόλτες στη θάλασσα, δείπνα με θέα, boutique καταλύματα.', en: 'Romantic activities for couples: seaside walks, dinners with a view, boutique stays.', de: 'Romantische Aktivitäten für Paare.', bg: 'Романтични дейности за двойки.', ru: 'Романтические занятия для пар.', ro: 'Activități romantice pentru cupluri.', sr: 'Romantične aktivnosti za parove.' },
    content: {
      el: `<h2>Χαλκιδική για Ζευγάρια</h2><p>Πέρα από τον <a href="/guide/honeymoon">γαμήλιο ταξίδι</a>, η Χαλκιδική προσφέρει <strong>αμέτρητες ρομαντικές εμπειρίες</strong> για ζευγάρια κάθε ηλικίας και προϋπολογισμού.</p><h2>Ρομαντικές Παραλίες</h2><ul><li><strong>Καβουρότρυπες (Πορτοκάλι):</strong> Εξωτικό σκηνικό για βουτιές στα δύο</li><li><strong>Καρύδι:</strong> Τυρκουάζ νερά σε απομόνωση</li><li><strong>Τριπότι:</strong> Μικρός παράδεισος στη Σιθωνία</li></ul>Δείτε τις <a href="/best/romantic-getaways">καλύτερες ρομαντικές αποδράσεις</a>.<h2>Δείπνα με Θέα</h2><p>Οι <a href="/restaurants">ταβέρνες</a> της Νικήτης και του Πόρτο Κουφό προσφέρουν απίστευτες θέες. Για gourmet εμπειρία, επιλέξτε το Sani Resort.</p><h2>Ρομαντικές Δραστηριότητες</h2><ul><li>Ιδιωτική κρουαζιέρα γύρω από το <a href="/mount-athos">Άγιο Όρος</a></li><li>Περίπατος στα <a href="/guide/sunset-spots">σημεία ηλιοβασιλέματος</a></li><li>Spa day στη Σάνη</li><li>Βόλτα στα <a href="/villages">παραδοσιακά χωριά</a></li></ul><h2>Ιδανική Περίοδος</h2><p>Μάιος ή Σεπτέμβριος — χωρίς κόσμο, τέλειος καιρός.</p>`,
      en: `<h2>Halkidiki for Couples</h2><p>Beyond the <a href="/guide/honeymoon">honeymoon</a>, Halkidiki offers <strong>countless romantic experiences</strong> for couples of all ages and budgets.</p><h2>Romantic Beaches</h2><ul><li><strong>Kavourotrypes (Orange Beach):</strong> Exotic setting for couple's swims</li><li><strong>Karidi:</strong> Turquoise waters in seclusion</li><li><strong>Tripoti:</strong> Small paradise in Sithonia</li></ul>See <a href="/best/romantic-getaways">best romantic getaways</a>.<h2>Dinners with a View</h2><p>Seaside <a href="/restaurants">tavernas</a> in Nikiti and Porto Koufo offer amazing views. For gourmet, choose Sani Resort.</p><h2>Romantic Activities</h2><ul><li>Private cruise around <a href="/mount-athos">Mount Athos</a></li><li>Walk at <a href="/guide/sunset-spots">sunset spots</a></li><li>Spa day in Sani</li><li>Stroll through <a href="/villages">traditional villages</a></li></ul><h2>Best Period</h2><p>May or September — no crowds, perfect weather.</p>`,
      de: `<h2>Chalkidiki für Paare</h2><p>Über die <a href="/guide/honeymoon">Flitterwochen</a> hinaus bietet Chalkidiki <strong>unzählige romantische Erlebnisse</strong>.</p><h2>Romantische Strände</h2><ul><li><strong>Kavourotrypes:</strong> Exotisch</li><li><strong>Karidi:</strong> Türkis in Einsamkeit</li></ul><h2>Essen mit Aussicht</h2><p><a href="/restaurants">Tavernen</a> in Nikiti und Porto Koufo.</p><h2>Aktivitäten</h2><p>Kreuzfahrt um <a href="/mount-athos">Athos</a>.</p>`,
      bg: `<h2>Халкидики за двойки</h2><p>Халкидики предлага <strong>безброй романтични преживявания</strong>.</p><h2>Романтични плажове</h2><ul><li><strong>Кавуротрипес</strong></li><li><strong>Кариди</strong></li></ul><h2>Вечери с гледка</h2><p><a href="/restaurants">Таверни</a> в Никити.</p>`,
      ru: `<h2>Халкидики для пар</h2><p>Халкидики предлагает <strong>бесчисленные романтические впечатления</strong>.</p><h2>Романтические пляжи</h2><ul><li><strong>Кавуротрипес</strong></li><li><strong>Кариди</strong></li></ul><h2>Ужины с видом</h2><p><a href="/restaurants">Таверны</a> в Никити.</p>`,
      ro: `<h2>Halkidiki pentru cupluri</h2><p>Halkidiki oferă <strong>nenumărate experiențe romantice</strong>.</p><h2>Plaje romantice</h2><ul><li><strong>Kavourotrypes</strong></li><li><strong>Karidi</strong></li></ul><h2>Cine cu priveliște</h2><p><a href="/restaurants">Taverne</a> în Nikiti.</p>`,
      sr: `<h2>Halkidiki za parove</h2><p>Halkidiki nudi <strong>bezbroj romantičnih iskustava</strong>.</p><h2>Romantične plaže</h2><ul><li><strong>Kavurotripes</strong></li><li><strong>Karidi</strong></li></ul><h2>Večere sa pogledom</h2><p><a href="/restaurants">Taverne</a> u Nikitiju.</p>`,
    },
  },
  {
    slug: 'for-solo-travelers', icon: 'User', color: 'indigo',
    title: { el: 'Χαλκιδική για Solo Ταξιδιώτες', en: 'Halkidiki for Solo Travelers', de: 'Chalkidiki für Solo-Reisende', bg: 'Халкидики за соло пътници', ru: 'Халкидики для соло-путешественников', ro: 'Halkidiki pentru călători singuri', sr: 'Halkidiki za solo putnike' },
    description: { el: 'Ταξίδι χωρίς παρέα — ο οδηγός σου', en: 'Your solo travel guide', de: 'Dein Solo-Reiseführer', bg: 'Твоят соло пътеводител', ru: 'Ваш соло-путеводитель', ro: 'Ghidul tău solo', sr: 'Tvoj solo vodič' },
    metaTitle: { el: 'Solo Ταξίδι στη Χαλκιδική — Οδηγός 2026', en: 'Solo Travel Halkidiki — 2026 Guide', de: 'Solo-Reise Chalkidiki 2026', bg: 'Соло пътуване Халкидики 2026', ru: 'Соло-путешествие Халкидики 2026', ro: 'Călătorie solo Halkidiki 2026', sr: 'Solo putovanje Halkidiki 2026' },
    metaDesc: { el: 'Ασφάλεια, μεταφορές, διασκέδαση, προϋπολογισμός για solo ταξιδιώτες στη Χαλκιδική.', en: 'Safety, transport, fun, budget for solo travelers in Halkidiki.', de: 'Sicherheit, Transport, Budget für Solo-Reisende.', bg: 'Безопасност, транспорт, бюджет за соло пътници.', ru: 'Безопасность, транспорт, бюджет для соло-путешественников.', ro: 'Siguranță, transport, buget pentru călători singuri.', sr: 'Bezbednost, prevoz, budžet za solo putnike.' },
    content: {
      el: `<h2>Solo Ταξίδι στη Χαλκιδική</h2><p>Η Χαλκιδική είναι <strong>ασφαλής, φιλόξενη και ιδανική για solo ταξιδιώτες</strong>. Οι ντόπιοι είναι εξαιρετικά φιλικοί, το έγκλημα σχεδόν ανύπαρκτο, και υπάρχουν πολλά κοινωνικά σημεία.</p><h2>Ασφάλεια</h2><p>Η Χαλκιδική συγκαταλέγεται στις ασφαλέστερες περιοχές της Ευρώπης. Μπορείτε να περπατάτε μόνοι τη νύχτα στα τουριστικά χωριά χωρίς άγχος.</p><h2>Που να Μείνετε</h2><ul><li><strong>Κασσάνδρα:</strong> Νυχτερινή ζωή, κόσμος, εύκολο να γνωρίσετε ανθρώπους</li><li><strong>Νικήτη:</strong> Ήρεμη αλλά κοινωνική</li><li><strong>Ουρανούπολη:</strong> Σημείο εκκίνησης για κρουαζιέρες</li></ul>Δείτε <a href="/guide/hotels">hotels</a>.<h2>Μεταφορές</h2><p>Τα <strong>λεωφορεία KTEL</strong> συνδέουν όλα τα χωριά με τη Θεσσαλονίκη. Για μεγαλύτερη ελευθερία, δείτε τον <a href="/guide/car-rental">οδηγό ενοικίασης αυτοκινήτου</a>.</p><h2>Social Spots</h2><ul><li>Beach bars στη Χανιώτη και Καλλιθέα</li><li>Ομαδικές κρουαζιέρες γύρω από το <a href="/mount-athos">Άγιο Όρος</a></li><li>Μαθήματα windsurf στη Βουρβουρού</li><li>Group <a href="/activities">δραστηριότητες</a></li></ul><h2>Προϋπολογισμός</h2><p>Ένας solo ταξιδιώτης χρειάζεται €60-100/μέρα. Δείτε αναλυτικά στο <a href="/costs/daily-budget">ημερήσιο budget</a>.</p>`,
      en: `<h2>Solo Travel in Halkidiki</h2><p>Halkidiki is <strong>safe, welcoming, and ideal for solo travelers</strong>. Locals are extremely friendly, crime is nearly non-existent, and there are plenty of social spots.</p><h2>Safety</h2><p>Halkidiki ranks among the safest regions in Europe. You can walk alone at night in tourist villages worry-free.</p><h2>Where to Stay</h2><ul><li><strong>Kassandra:</strong> Nightlife, crowds, easy to meet people</li><li><strong>Nikiti:</strong> Calm but social</li><li><strong>Ouranoupoli:</strong> Starting point for cruises</li></ul>See <a href="/guide/hotels">hotels</a>.<h2>Transport</h2><p><strong>KTEL buses</strong> connect all villages to Thessaloniki. For more freedom, see the <a href="/guide/car-rental">car rental guide</a>.</p><h2>Social Spots</h2><ul><li>Beach bars in Hanioti and Kallithea</li><li>Group cruises around <a href="/mount-athos">Mount Athos</a></li><li>Windsurf lessons in Vourvourou</li><li>Group <a href="/activities">activities</a></li></ul><h2>Budget</h2><p>A solo traveler needs €60-100/day. See details in <a href="/costs/daily-budget">daily budget</a>.</p>`,
      de: `<h2>Solo-Reise in Chalkidiki</h2><p>Chalkidiki ist <strong>sicher, gastfreundlich</strong> für Solo-Reisende.</p><h2>Sicherheit</h2><p>Eine der sichersten Regionen Europas.</p><h2>Wo übernachten</h2><ul><li><strong>Kassandra:</strong> Nachtleben</li><li><strong>Nikiti:</strong> Ruhig</li></ul><h2>Transport</h2><p>KTEL-Busse. Siehe <a href="/guide/car-rental">Mietwagen</a>.</p><h2>Budget</h2><p>€60-100/Tag. Siehe <a href="/costs/daily-budget">Tagesbudget</a>.</p>`,
      bg: `<h2>Соло пътуване в Халкидики</h2><p>Халкидики е <strong>безопасна и гостоприемна</strong>.</p><h2>Безопасност</h2><p>Един от най-безопасните региони в Европа.</p><h2>Къде да отседнете</h2><ul><li><strong>Касандра</strong></li><li><strong>Никити</strong></li></ul><h2>Транспорт</h2><p>KTEL автобуси.</p><h2>Бюджет</h2><p>€60-100/ден. Виж <a href="/costs/daily-budget">дневен бюджет</a>.</p>`,
      ru: `<h2>Соло-путешествие в Халкидики</h2><p>Халкидики — <strong>безопасна и гостеприимна</strong>.</p><h2>Безопасность</h2><p>Один из самых безопасных регионов Европы.</p><h2>Где остановиться</h2><ul><li><strong>Кассандра</strong></li><li><strong>Никити</strong></li></ul><h2>Транспорт</h2><p>Автобусы KTEL.</p><h2>Бюджет</h2><p>€60-100/день. См. <a href="/costs/daily-budget">дневной бюджет</a>.</p>`,
      ro: `<h2>Călătorie solo în Halkidiki</h2><p>Halkidiki este <strong>sigură și ospitalieră</strong>.</p><h2>Siguranță</h2><p>Una dintre cele mai sigure regiuni din Europa.</p><h2>Unde să stai</h2><ul><li><strong>Kassandra</strong></li><li><strong>Nikiti</strong></li></ul><h2>Transport</h2><p>Autobuze KTEL.</p><h2>Buget</h2><p>€60-100/zi. Vezi <a href="/costs/daily-budget">buget zilnic</a>.</p>`,
      sr: `<h2>Solo putovanje u Halkidikiju</h2><p>Halkidiki je <strong>bezbedan i gostoljubiv</strong>.</p><h2>Bezbednost</h2><p>Jedan od najbezbednijih regiona Evrope.</p><h2>Gde odsesti</h2><ul><li><strong>Kasandra</strong></li><li><strong>Nikiti</strong></li></ul><h2>Prevoz</h2><p>KTEL autobusi.</p><h2>Budžet</h2><p>€60-100/dan. Vidite <a href="/costs/daily-budget">dnevni budžet</a>.</p>`,
    },
  },
  {
    slug: 'tips', icon: 'Lightbulb', color: 'yellow',
    title: { el: 'Tips για τη Χαλκιδική', en: 'Halkidiki Tips', de: 'Tipps für Chalkidiki', bg: 'Съвети за Халкидики', ru: 'Советы для Халкидики', ro: 'Sfaturi pentru Halkidiki', sr: 'Saveti za Halkidiki' },
    description: { el: '20+ μυστικά που πρέπει να γνωρίζεις', en: '20+ insider secrets', de: '20+ Insider-Geheimnisse', bg: '20+ insider тайни', ru: '20+ инсайдерских секретов', ro: '20+ secrete insider', sr: '20+ insajderskih tajni' },
    metaTitle: { el: '20+ Tips για τη Χαλκιδική 2026', en: '20+ Halkidiki Tips for 2026', de: '20+ Chalkidiki-Tipps 2026', bg: '20+ съвета за Халкидики 2026', ru: '20+ советов для Халкидики 2026', ro: '20+ sfaturi Halkidiki 2026', sr: '20+ saveta Halkidiki 2026' },
    metaDesc: { el: 'Οι πιο χρήσιμες συμβουλές για τις διακοπές σας στη Χαλκιδική.', en: 'The most useful tips for your Halkidiki holiday.', de: 'Die nützlichsten Tipps für Ihren Chalkidiki-Urlaub.', bg: 'Най-полезните съвети.', ru: 'Самые полезные советы.', ro: 'Cele mai utile sfaturi.', sr: 'Najkorisniji saveti.' },
    content: {
      el: `<h2>20+ Tips για τη Χαλκιδική</h2><p>Συμβουλές που θα κάνουν τις διακοπές σου <strong>πιο εύκολες, φθηνές και αξέχαστες</strong>.</p><h2>Πριν φτάσεις</h2><ul><li>Κράτησε νωρίς — Αύγουστος γεμίζει από τον Απρίλιο</li><li>Πτήση προς Θεσσαλονίκη (SKG), όχι Αθήνα — δες <a href="/guide/getting-here">πως θα έρθεις</a></li><li>Νοίκιασε <a href="/guide/car-rental">αυτοκίνητο</a> online για καλύτερες τιμές</li><li>Φέρε αντηλιακό SPF50+</li></ul><h2>Παραλίες</h2><ul><li>Φτάσε πριν τις 10πμ για να βρεις ξαπλώστρα</li><li>Οι καλύτερες <a href="/best/free-beaches">δωρεάν παραλίες</a> είναι στη Σιθωνία</li><li>Φέρε νερά παπούτσια για βραχώδεις παραλίες</li></ul><h2>Φαγητό</h2><ul><li>Φάε όπου τρώνε οι ντόπιοι — δες <a href="/best/traditional-tavernas">παραδοσιακές ταβέρνες</a></li><li>Δοκίμασε φρέσκα ψάρια στη Νικήτη</li><li>Τοπικά κρασιά από το Πορτο Κουφό</li></ul><h2>Εξερεύνηση</h2><ul><li>Δες και τα δύο "πόδια": Κασσάνδρα και <a href="/guide/sithonia">Σιθωνία</a></li><li>Κάνε <a href="/guide/day-trips">εκδρομές μιας ημέρας</a></li><li>Επισκέψου <a href="/villages">παραδοσιακά χωριά</a> (Αρναία, Παρθενώνας)</li></ul><h2>Χρήσιμα</h2><ul><li>ATM σε κάθε χωριό — αλλά καλύτερα τράπεζα σε μεγάλες πόλεις</li><li>WiFi παντού στα καφέ</li><li>Supermarkets Lidl/AB για φθηνά ψώνια</li></ul>`,
      en: `<h2>20+ Halkidiki Tips</h2><p>Tips that will make your holiday <strong>easier, cheaper, and more memorable</strong>.</p><h2>Before You Arrive</h2><ul><li>Book early — August fills up by April</li><li>Fly to Thessaloniki (SKG), not Athens — see <a href="/guide/getting-here">how to get here</a></li><li>Rent a <a href="/guide/car-rental">car</a> online for better prices</li><li>Bring SPF50+ sunscreen</li></ul><h2>Beaches</h2><ul><li>Arrive before 10am to get a lounger</li><li>Best <a href="/best/free-beaches">free beaches</a> are in Sithonia</li><li>Bring water shoes for rocky beaches</li></ul><h2>Food</h2><ul><li>Eat where locals eat — see <a href="/best/traditional-tavernas">traditional tavernas</a></li><li>Try fresh fish in Nikiti</li><li>Local wines from Porto Koufo</li></ul><h2>Exploration</h2><ul><li>See both "legs": Kassandra and <a href="/guide/sithonia">Sithonia</a></li><li>Take <a href="/guide/day-trips">day trips</a></li><li>Visit <a href="/villages">traditional villages</a> (Arnea, Parthenonas)</li></ul><h2>Useful</h2><ul><li>ATMs in every village — but banks in larger towns are better</li><li>WiFi everywhere at cafés</li><li>Lidl/AB supermarkets for cheap shopping</li></ul>`,
      de: `<h2>20+ Chalkidiki-Tipps</h2><p>Tipps für <strong>einfacheren, günstigeren Urlaub</strong>.</p><h2>Vor der Ankunft</h2><ul><li>Früh buchen</li><li>Nach Thessaloniki fliegen — <a href="/guide/getting-here">Anreise</a></li><li><a href="/guide/car-rental">Mietwagen</a> online</li></ul><h2>Strände</h2><ul><li>Vor 10 Uhr ankommen</li><li><a href="/best/free-beaches">Kostenlose Strände</a> in Sithonia</li></ul><h2>Essen</h2><ul><li><a href="/best/traditional-tavernas">Traditionelle Tavernen</a></li></ul><h2>Erkundung</h2><ul><li>Kassandra und <a href="/guide/sithonia">Sithonia</a></li><li><a href="/villages">Dörfer</a></li></ul>`,
      bg: `<h2>20+ съвета за Халкидики</h2><p>Съвети за <strong>по-лесна и евтина ваканция</strong>.</p><h2>Преди пристигане</h2><ul><li>Резервирайте рано</li><li>Летище Солун — <a href="/guide/getting-here">как да стигнете</a></li><li><a href="/guide/car-rental">Кола под наем</a></li></ul><h2>Плажове</h2><ul><li>Пристигайте преди 10ч</li><li><a href="/best/free-beaches">Безплатни плажове</a></li></ul><h2>Храна</h2><ul><li><a href="/best/traditional-tavernas">Традиционни таверни</a></li></ul>`,
      ru: `<h2>20+ советов для Халкидики</h2><p>Советы для <strong>более лёгкого и дешёвого отдыха</strong>.</p><h2>До приезда</h2><ul><li>Бронируйте заранее</li><li>Аэропорт Салоники — <a href="/guide/getting-here">как добраться</a></li><li><a href="/guide/car-rental">Аренда авто</a></li></ul><h2>Пляжи</h2><ul><li>Приезжайте до 10 утра</li><li><a href="/best/free-beaches">Бесплатные пляжи</a></li></ul><h2>Еда</h2><ul><li><a href="/best/traditional-tavernas">Традиционные таверны</a></li></ul>`,
      ro: `<h2>20+ sfaturi pentru Halkidiki</h2><p>Sfaturi pentru o <strong>vacanță mai ușoară și ieftină</strong>.</p><h2>Înainte de sosire</h2><ul><li>Rezervați devreme</li><li>Aeroport Salonic — <a href="/guide/getting-here">cum ajungeți</a></li><li><a href="/guide/car-rental">Închiriere mașină</a></li></ul><h2>Plaje</h2><ul><li>Ajungeți înainte de 10</li><li><a href="/best/free-beaches">Plaje gratuite</a></li></ul><h2>Mâncare</h2><ul><li><a href="/best/traditional-tavernas">Taverne tradiționale</a></li></ul>`,
      sr: `<h2>20+ saveta za Halkidiki</h2><p>Saveti za <strong>lakši i jeftiniji odmor</strong>.</p><h2>Pre dolaska</h2><ul><li>Rezervišite rano</li><li>Aerodrom Solun — <a href="/guide/getting-here">kako doći</a></li><li><a href="/guide/car-rental">Rent-a-car</a></li></ul><h2>Plaže</h2><ul><li>Dođite pre 10h</li><li><a href="/best/free-beaches">Besplatne plaže</a></li></ul><h2>Hrana</h2><ul><li><a href="/best/traditional-tavernas">Tradicionalne taverne</a></li></ul>`,
    },
  },
  {
    slug: 'mistakes-to-avoid', icon: 'AlertTriangle', color: 'red',
    title: { el: 'Λάθη που πρέπει να Αποφύγεις', en: 'Mistakes to Avoid', de: 'Fehler vermeiden', bg: 'Грешки, които да избягвате', ru: 'Ошибки, которых следует избегать', ro: 'Greșeli de evitat', sr: 'Greške koje treba izbegavati' },
    description: { el: 'Τα συνηθέστερα λάθη τουριστών', en: 'The most common tourist mistakes', de: 'Die häufigsten Touristenfehler', bg: 'Най-честите грешки', ru: 'Самые частые ошибки', ro: 'Cele mai comune greșeli', sr: 'Najčešće greške' },
    metaTitle: { el: 'Λάθη στη Χαλκιδική που πρέπει να Αποφύγεις 2026', en: 'Halkidiki Mistakes to Avoid 2026', de: 'Chalkidiki-Fehler vermeiden 2026', bg: 'Грешки в Халкидики 2026', ru: 'Ошибки в Халкидики 2026', ro: 'Greșeli Halkidiki 2026', sr: 'Greške u Halkidikiju 2026' },
    metaDesc: { el: 'Τα πιο συχνά λάθη που κάνουν οι τουρίστες στη Χαλκιδική — και πώς να τα αποφύγεις.', en: 'The most common mistakes tourists make in Halkidiki — and how to avoid them.', de: 'Die häufigsten Touristenfehler — und wie man sie vermeidet.', bg: 'Най-честите грешки на туристите.', ru: 'Самые частые ошибки туристов.', ro: 'Cele mai comune greșeli turistice.', sr: 'Najčešće turističke greške.' },
    content: {
      el: `<h2>Λάθη που Κάνουν οι Τουρίστες</h2><p>Αποφύγετε αυτά για να έχετε <strong>τις καλύτερες δυνατές διακοπές</strong>.</p><h2>Προγραμματισμός</h2><ul><li><strong>Να κλείνετε τελευταία στιγμή:</strong> Τον Αύγουστο δεν θα βρείτε τίποτα — κράτηση από Απρίλιο</li><li><strong>Να πιστεύετε ότι όλα είναι κοντά:</strong> Η Χαλκιδική είναι μεγάλη, δες <a href="/guide/driving-distances">αποστάσεις</a></li><li><strong>Να μην νοικιάζετε αυτοκίνητο:</strong> Χωρίς αμάξι χάνεις το 70% — δες <a href="/guide/car-rental">οδηγό</a></li></ul><h2>Παραλίες</h2><ul><li><strong>Μόνο στην Κασσάνδρα:</strong> Η <a href="/guide/sithonia">Σιθωνία</a> έχει τις πιο όμορφες παραλίες</li><li><strong>Μόνο organized beaches:</strong> Οι <a href="/best/free-beaches">ελεύθερες παραλίες</a> συχνά είναι πιο όμορφες</li></ul><h2>Φαγητό</h2><ul><li><strong>Να τρώτε σε tourist traps:</strong> Αποφύγετε εστιατόρια δίπλα στην πλαζ με μενού σε 5 γλώσσες</li><li><strong>Να παραγγέλνετε σουβλάκι σε ψαροταβέρνα:</strong> Επιλέξτε σωστό <a href="/restaurants">εστιατόριο</a></li></ul><h2>Άλλα</h2><ul><li><strong>Να μη σεβαστείτε dress code στο <a href="/mount-athos">Άγιο Όρος</a></strong> (μόνο άνδρες επιτρέπονται)</li><li><strong>Να οδηγείτε μεθυσμένοι:</strong> Ελληνική αστυνομία είναι αυστηρή</li><li><strong>Να μην έχετε μετρητά:</strong> Σε ταβέρνες και παραλίες χρειάζεσαι cash</li></ul>`,
      en: `<h2>Mistakes Tourists Make</h2><p>Avoid these to have <strong>the best possible holiday</strong>.</p><h2>Planning</h2><ul><li><strong>Booking last minute:</strong> August is fully booked by April</li><li><strong>Thinking everything is nearby:</strong> Halkidiki is big — see <a href="/guide/driving-distances">distances</a></li><li><strong>Not renting a car:</strong> Without one, you miss 70% — see <a href="/guide/car-rental">guide</a></li></ul><h2>Beaches</h2><ul><li><strong>Only visiting Kassandra:</strong> <a href="/guide/sithonia">Sithonia</a> has the most beautiful beaches</li><li><strong>Only organized beaches:</strong> <a href="/best/free-beaches">Free beaches</a> are often more beautiful</li></ul><h2>Food</h2><ul><li><strong>Eating at tourist traps:</strong> Avoid restaurants next to the beach with menus in 5 languages</li><li><strong>Ordering souvlaki at a fish tavern:</strong> Pick the right <a href="/restaurants">restaurant</a></li></ul><h2>Other</h2><ul><li><strong>Not respecting dress code at <a href="/mount-athos">Mount Athos</a></strong> (men only)</li><li><strong>Driving drunk:</strong> Greek police are strict</li><li><strong>No cash:</strong> Tavernas and beaches require cash</li></ul>`,
      de: `<h2>Touristenfehler</h2><p>Vermeiden Sie diese für den <strong>besten Urlaub</strong>.</p><h2>Planung</h2><ul><li>Last-minute buchen</li><li>Alles liegt angeblich nah — <a href="/guide/driving-distances">Entfernungen</a></li><li>Kein <a href="/guide/car-rental">Mietwagen</a></li></ul><h2>Strände</h2><ul><li>Nur Kassandra — <a href="/guide/sithonia">Sithonia</a> ist schöner</li></ul><h2>Essen</h2><ul><li>Touristenfallen vermeiden</li></ul><h2>Sonstiges</h2><ul><li>Kein Bargeld dabei</li></ul>`,
      bg: `<h2>Грешки на туристите</h2><p>Избягвайте тези за <strong>най-добра ваканция</strong>.</p><h2>Планиране</h2><ul><li>Резервация в последния момент</li><li>Халкидики е голяма — <a href="/guide/driving-distances">разстояния</a></li><li>Без кола под наем</li></ul><h2>Плажове</h2><ul><li>Само Касандра — <a href="/guide/sithonia">Ситония</a></li></ul><h2>Храна</h2><ul><li>Избягвайте туристически капани</li></ul>`,
      ru: `<h2>Ошибки туристов</h2><p>Избегайте этих для <strong>лучшего отдыха</strong>.</p><h2>Планирование</h2><ul><li>Бронирование в последний момент</li><li>Халкидики большая — <a href="/guide/driving-distances">расстояния</a></li><li>Без аренды авто</li></ul><h2>Пляжи</h2><ul><li>Только Кассандра — <a href="/guide/sithonia">Ситония</a></li></ul><h2>Еда</h2><ul><li>Избегайте туристических ловушек</li></ul>`,
      ro: `<h2>Greșelile turiștilor</h2><p>Evitați acestea pentru <strong>cea mai bună vacanță</strong>.</p><h2>Planificare</h2><ul><li>Rezervare last-minute</li><li>Halkidiki este mare — <a href="/guide/driving-distances">distanțe</a></li><li>Fără mașină închiriată</li></ul><h2>Plaje</h2><ul><li>Doar Kassandra — <a href="/guide/sithonia">Sithonia</a></li></ul><h2>Mâncare</h2><ul><li>Evitați capcanele turistice</li></ul>`,
      sr: `<h2>Greške turista</h2><p>Izbegavajte ove za <strong>najbolji odmor</strong>.</p><h2>Planiranje</h2><ul><li>Rezervacija u poslednjem trenutku</li><li>Halkidiki je velik — <a href="/guide/driving-distances">udaljenosti</a></li><li>Bez iznajmljenog auta</li></ul><h2>Plaže</h2><ul><li>Samo Kasandra — <a href="/guide/sithonia">Sitonija</a></li></ul><h2>Hrana</h2><ul><li>Izbegavajte turističke zamke</li></ul>`,
    },
  },
  {
    slug: 'scams-to-avoid', icon: 'ShieldAlert', color: 'red',
    title: { el: 'Απάτες που πρέπει να Αποφύγεις', en: 'Scams to Avoid', de: 'Betrügereien vermeiden', bg: 'Измами, които да избягвате', ru: 'Мошенничества, которых следует избегать', ro: 'Escrocherii de evitat', sr: 'Prevare koje treba izbegavati' },
    description: { el: 'Πώς να προστατευτείς από τουριστικές παγίδες', en: 'How to protect yourself from tourist traps', de: 'Wie Sie sich vor Touristenfallen schützen', bg: 'Как да се предпазите', ru: 'Как защититься', ro: 'Cum să te protejezi', sr: 'Kako da se zaštitite' },
    metaTitle: { el: 'Απάτες στη Χαλκιδική — Οδηγός Προστασίας 2026', en: 'Halkidiki Scams — Protection Guide 2026', de: 'Chalkidiki-Betrügereien 2026', bg: 'Измами в Халкидики 2026', ru: 'Мошенничества в Халкидики 2026', ro: 'Escrocherii Halkidiki 2026', sr: 'Prevare u Halkidikiju 2026' },
    metaDesc: { el: 'Οδηγός για να αποφύγεις κοινές απάτες στη Χαλκιδική: ταξί, εστιατόρια, πλαστά προϊόντα.', en: 'Guide to avoiding common Halkidiki scams: taxis, restaurants, fake products.', de: 'So vermeiden Sie Betrügereien in Chalkidiki.', bg: 'Как да избегнете измами.', ru: 'Как избежать мошенничества.', ro: 'Cum să eviți escrocheriile.', sr: 'Kako izbeći prevare.' },
    content: {
      el: `<h2>Απάτες στη Χαλκιδική</h2><p>Η Χαλκιδική είναι <strong>γενικά ασφαλής</strong> αλλά όπως παντού υπάρχουν μερικές τουριστικές παγίδες που θες να αποφύγεις.</p><h2>Ταξί</h2><ul><li><strong>Ζήτα μετρητή (ταξίμετρο):</strong> Κάποιοι οδηγοί θα σου πουν "flat rate" — συνήθως 20-40% πάνω</li><li><strong>Επιβάρυνση αποσκευών:</strong> Νόμιμη αλλά μικρή (€0.40/τσάντα)</li><li>Προτίμησε apps όπως <strong>Beat</strong></li></ul><h2>Εστιατόρια</h2><ul><li><strong>Χωρίς τιμές στο μενού:</strong> Αν το μενού δεν έχει τιμές, προχώρα παρακάτω</li><li><strong>"Ειδική πρόταση της ημέρας":</strong> Ρώτα τιμή πριν παραγγείλεις</li><li>Δες <a href="/best/traditional-tavernas">αξιόπιστες ταβέρνες</a></li></ul><h2>Παραλίες</h2><ul><li><strong>"Free" ξαπλώστρες με υποχρέωση κατανάλωσης:</strong> Ρώτα πρώτα</li><li><strong>Τιμές ανά αντικείμενο:</strong> Μερικά beach bars χρεώνουν και την ομπρέλα και την ξαπλώστρα χωριστά</li></ul><h2>Σουβενίρ</h2><ul><li><strong>"Τοπικό λάδι":</strong> Ελέγξτε τη συσκευασία — πολλά είναι εισαγωγής</li><li><strong>"Χειροποίητα":</strong> Πολλά έρχονται από Τουρκία/Κίνα</li><li>Αγόρασε από <a href="/best/traditional-tavernas">παραδοσιακές ταβέρνες</a> και <a href="/villages">χωριά</a> όπως Αρναία</li></ul><h2>Συναλλαγές</h2><ul><li><strong>Δυναμική μετατροπή νομίσματος (DCC):</strong> Πάντα πλήρωνε σε ΕΥΡΩ, όχι στο νόμισμα σου</li><li><strong>Κρυφή χρέωση:</strong> Ρώτα πάντα "συμπεριλαμβάνεται το σέρβις;"</li></ul>`,
      en: `<h2>Scams in Halkidiki</h2><p>Halkidiki is <strong>generally safe</strong> but, like anywhere, there are a few tourist traps to avoid.</p><h2>Taxis</h2><ul><li><strong>Ask for the meter:</strong> Some drivers offer "flat rate" — usually 20-40% more</li><li><strong>Luggage surcharge:</strong> Legal but small (€0.40/bag)</li><li>Prefer apps like <strong>Beat</strong></li></ul><h2>Restaurants</h2><ul><li><strong>No prices on menu:</strong> If no prices, walk away</li><li><strong>"Today's special":</strong> Ask price before ordering</li><li>See <a href="/best/traditional-tavernas">trusted tavernas</a></li></ul><h2>Beaches</h2><ul><li><strong>"Free" loungers with consumption requirement:</strong> Ask first</li><li><strong>Per-item pricing:</strong> Some beach bars charge umbrella and lounger separately</li></ul><h2>Souvenirs</h2><ul><li><strong>"Local oil":</strong> Check the label — many are imported</li><li><strong>"Handmade":</strong> Many come from Turkey/China</li><li>Buy from <a href="/villages">traditional villages</a> like Arnea</li></ul><h2>Transactions</h2><ul><li><strong>Dynamic Currency Conversion (DCC):</strong> Always pay in EUROS, not your currency</li><li><strong>Hidden charges:</strong> Always ask "is service included?"</li></ul>`,
      de: `<h2>Betrügereien in Chalkidiki</h2><p>Chalkidiki ist <strong>sicher</strong>, aber es gibt einige Touristenfallen.</p><h2>Taxis</h2><ul><li>Taxameter verlangen</li><li>Apps wie Beat bevorzugen</li></ul><h2>Restaurants</h2><ul><li>Menü ohne Preise — weitergehen</li><li>Siehe <a href="/best/traditional-tavernas">vertrauenswürdige Tavernen</a></li></ul><h2>Strände</h2><ul><li>Kostenlose Liegen oft mit Konsumzwang</li></ul><h2>Souvenirs</h2><ul><li>Angebliches Lokalöl prüfen</li><li>In <a href="/villages">Dörfern</a> kaufen</li></ul><h2>Transaktionen</h2><ul><li>Immer in Euro zahlen</li></ul>`,
      bg: `<h2>Измами в Халкидики</h2><p>Халкидики е <strong>безопасна</strong>, но има някои туристически капани.</p><h2>Такси</h2><ul><li>Искайте таксиметър</li><li>Приложения като Beat</li></ul><h2>Ресторанти</h2><ul><li>Меню без цени — продължете</li><li><a href="/best/traditional-tavernas">Доверени таверни</a></li></ul><h2>Плажове</h2><ul><li>"Безплатни" шезлонги често с консумация</li></ul><h2>Сувенири</h2><ul><li>Купувайте в <a href="/villages">селата</a></li></ul>`,
      ru: `<h2>Мошенничества в Халкидики</h2><p>Халкидики <strong>безопасна</strong>, но есть туристические ловушки.</p><h2>Такси</h2><ul><li>Требуйте счётчик</li><li>Приложения как Beat</li></ul><h2>Рестораны</h2><ul><li>Меню без цен — проходите мимо</li><li><a href="/best/traditional-tavernas">Проверенные таверны</a></li></ul><h2>Пляжи</h2><ul><li>"Бесплатные" лежаки часто с обязательным заказом</li></ul><h2>Сувениры</h2><ul><li>Покупайте в <a href="/villages">деревнях</a></li></ul>`,
      ro: `<h2>Escrocherii în Halkidiki</h2><p>Halkidiki este <strong>sigură</strong>, dar există câteva capcane turistice.</p><h2>Taxi</h2><ul><li>Cereți taximetrul</li><li>Aplicații ca Beat</li></ul><h2>Restaurante</h2><ul><li>Meniu fără prețuri — plecați</li><li><a href="/best/traditional-tavernas">Taverne de încredere</a></li></ul><h2>Plaje</h2><ul><li>Șezlonguri "gratuite" adesea cu consum obligatoriu</li></ul><h2>Suveniruri</h2><ul><li>Cumpărați din <a href="/villages">sate</a></li></ul>`,
      sr: `<h2>Prevare u Halkidikiju</h2><p>Halkidiki je <strong>bezbedan</strong>, ali postoje turističke zamke.</p><h2>Taksi</h2><ul><li>Tražite taksimetar</li><li>Aplikacije kao Beat</li></ul><h2>Restorani</h2><ul><li>Meni bez cena — preskočite</li><li><a href="/best/traditional-tavernas">Pouzdane taverne</a></li></ul><h2>Plaže</h2><ul><li>"Besplatne" ležaljke često sa obaveznom konzumacijom</li></ul><h2>Suveniri</h2><ul><li>Kupujte u <a href="/villages">selima</a></li></ul>`,
    },
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find(g => g.slug === slug);
}
