type L = Record<string, string>;

export interface ItineraryGuide {
  slug: string;
  icon: string;
  color: string;
  title: L;
  description: L;
  metaTitle: L;
  metaDesc: L;
  content: L; // HTML with INTERNAL LINKS
}

export const ITINERARIES: ItineraryGuide[] = [
  {
    slug: '3-days', icon: 'Calendar', color: 'blue',
    title: {
      el: '3 Μέρες στη Χαλκιδική — Τέλειο Σαββατοκύριακο',
      en: '3 Days in Halkidiki — Perfect Weekend',
      de: '3 Tage in Chalkidiki — Perfektes Wochenende',
      bg: '3 Дни в Халкидики — Перфектен Уикенд',
      ru: '3 Дня в Халкидики — Идеальный Уикенд',
      ro: '3 Zile in Halkidiki — Weekend Perfect',
      sr: '3 Dana u Halkidikiju — Savršen Vikend',
    },
    description: {
      el: 'Πρόγραμμα 3 ημερών στη Χαλκιδική: Κασσάνδρα, Σιθωνία, παραλίες και φαγητό',
      en: 'A 3-day itinerary for Halkidiki: Kassandra, Sithonia, beaches and dining',
      de: 'Ein 3-Tage-Reiseplan für Chalkidiki: Kassandra, Sithonia, Strände und Essen',
      bg: 'Маршрут за 3 дни в Халкидики: Касандра, Ситония, плажове и храна',
      ru: 'Маршрут на 3 дня в Халкидики: Кассандра, Ситония, пляжи и еда',
      ro: 'Itinerar de 3 zile in Halkidiki: Kassandra, Sithonia, plaje si restaurante',
      sr: 'Plan za 3 dana u Halkidikiju: Kasandra, Sitonija, plaze i hrana',
    },
    metaTitle: {
      el: '3 Μέρες στη Χαλκιδική — Πρόγραμμα',
      en: '3 Days in Halkidiki — Itinerary',
      de: '3 Tage in Chalkidiki — Reiseplan',
      bg: '3 Дни в Халкидики — Маршрут',
      ru: '3 Дня в Халкидики — Маршрут',
      ro: '3 Zile in Halkidiki — Itinerar',
      sr: '3 Dana u Halkidikiju — Plan',
    },
    metaDesc: {
      el: 'Πώς να περάσετε 3 τέλειες μέρες στη Χαλκιδική. Παραλίες Κασσάνδρας, Σιθωνίας, εστιατόρια, αξιοθέατα. Μπάτζετ €200-400.',
      en: 'How to spend 3 perfect days in Halkidiki. Kassandra and Sithonia beaches, restaurants, sights. Budget €200-400 per person.',
      de: 'So verbringen Sie 3 perfekte Tage in Chalkidiki. Strände, Restaurants, Sehenswürdigkeiten. Budget €200-400 pro Person.',
      bg: 'Как да прекарате 3 перфектни дни в Халкидики. Плажове, ресторанти, забележителности. Бюджет €200-400.',
      ru: 'Как провести 3 идеальных дня в Халкидики. Пляжи Кассандры и Ситонии, рестораны, достопримечательности. Бюджет €200-400.',
      ro: 'Cum sa petreceti 3 zile perfecte in Halkidiki. Plaje, restaurante, obiective. Buget €200-400 de persoana.',
      sr: 'Kako provesti 3 savrsena dana u Halkidikiju. Plaze, restorani, znamenitosti. Budzet €200-400 po osobi.',
    },
    content: {
      el: `<h2>Για Ποιον Είναι Αυτό το Πρόγραμμα</h2>
<p>Αυτό το πρόγραμμα 3 ημερών είναι ιδανικό για <strong>σύντομες αποδράσεις</strong> — ζευγάρια, παρέες ή οικογένειες που θέλουν μια γρήγορη γεύση Χαλκιδικής. Εκτιμώμενο κόστος: <strong>€200-400 ανά άτομο</strong> (κατάλυμα, φαγητό, μετακινήσεις).</p>

<h2>Αναλυτικό Πρόγραμμα</h2>

<h3>Ημέρα 1 — Άφιξη & Κασσάνδρα</h3>
<p>Φτάνετε Θεσσαλονίκη και οδηγείτε προς Κασσάνδρα (1,5 ώρα). Σταματήστε στην <strong>Καλλιθέα</strong> για το πρώτο μπάνιο — κρυστάλλινα νερά σε οργανωμένη <a href="/beaches">παραλία</a>. Το απόγευμα εξερευνήστε τον Άφυτο, ένα πανέμορφο πετρόχτιστο χωριό με θέα. Βραδινό σε παραδοσιακή ταβέρνα — δείτε τα καλύτερα <a href="/in/afytos/restaurants">εστιατόρια στον Άφυτο</a>. Για <a href="/listings">κατάλυμα</a>, Κασσάνδρα ή Καλλιθέα είναι ιδανική βάση.</p>

<h3>Ημέρα 2 — Σιθωνία & Παραλίες</h3>
<p>Ξεκινήστε νωρίς για Σιθωνία. Πρώτη στάση: <strong>Καβουρότρυπες</strong> — εξωτική παραλία με λευκά βράχια. Μετά κατευθυνθείτε στο <strong>Καρύδι</strong>, μια από τις <a href="/best/beaches-sithonia">καλύτερες παραλίες Σιθωνίας</a>. Μεσημεριανό στο Πόρτο Κουφό — φρέσκα θαλασσινά στο πιο κλειστό λιμάνι της Ελλάδας. Αν θέλετε περισσότερες <a href="/activities">δραστηριότητες</a>, δοκιμάστε SUP ή kayak.</p>

<h3>Ημέρα 3 — Πρωινό Μπάνιο & Αναχώρηση</h3>
<p>Τελευταίο μπάνιο στην κοντινότερη παραλία. Εναλλακτικά: κρουαζιέρα γύρω από τον Άθω από Ουρανούπολη — δείτε τον <a href="/guide/boat-tours">οδηγό θαλάσσιων εκδρομών</a>. Αν θέλετε να συγκρίνετε Κασσάνδρα με Σιθωνία, διαβάστε τον <a href="/guide/kassandra-vs-sithonia">αναλυτικό οδηγό</a>. Για μετακίνηση, σας συστήνουμε να <a href="/guide/car-rental">νοικιάσετε αυτοκίνητο</a>.</p>

<h2>Κόστος Ανάλυση</h2>
<ul>
<li><strong>Κατάλυμα:</strong> €40-80/βράδυ (στούντιο ή δωμάτιο)</li>
<li><strong>Φαγητό:</strong> €20-40/μέρα</li>
<li><strong>Ενοικίαση αυτοκινήτου:</strong> €30-50/μέρα</li>
<li><strong>Δραστηριότητες:</strong> €20-50 συνολικά</li>
</ul>

<h2>Χρήσιμες Συμβουλές</h2>
<ul>
<li>Καλύτεροι μήνες: Ιούνιος και Σεπτέμβριος (λιγότερος κόσμος, χαμηλότερες τιμές)</li>
<li>Πάρτε αντηλιακό, καπέλο και παπούτσια θαλάσσης</li>
<li>Κλείστε κατάλυμα νωρίς αν πάτε Ιούλιο-Αύγουστο</li>
<li>Δείτε τις <a href="/faq/transport">συχνές ερωτήσεις μεταφοράς</a> πριν φύγετε</li>
</ul>`,

      en: `<h2>Who Is This Itinerary For</h2>
<p>This 3-day itinerary is ideal for <strong>quick getaways</strong> — couples, groups of friends, or families wanting a taste of Halkidiki. Estimated budget: <strong>€200-400 per person</strong> (accommodation, food, transport).</p>

<h2>Day-by-Day Breakdown</h2>

<h3>Day 1 — Arrival & Kassandra</h3>
<p>Arrive in Thessaloniki and drive to Kassandra (1.5 hours). Stop at <strong>Kallithea</strong> for your first swim — crystal-clear waters at an organized <a href="/beaches">beach</a>. In the afternoon, explore Afytos, a charming stone-built village with panoramic views. Enjoy dinner at a traditional taverna — check the best <a href="/in/afytos/restaurants">restaurants in Afytos</a>. For <a href="/listings">accommodation</a>, Kassandra or Kallithea makes an ideal base.</p>

<h3>Day 2 — Sithonia Beach Hopping</h3>
<p>Start early for Sithonia. First stop: <strong>Kavourotrypes</strong> — an exotic beach with white cliffs. Then head to <strong>Karidi</strong>, one of the <a href="/best/beaches-sithonia">best Sithonia beaches</a>. Lunch at Porto Koufo — fresh seafood at Greece's most enclosed harbor. If you want more <a href="/activities">activities</a>, try SUP or kayaking.</p>

<h3>Day 3 — Morning Swim & Departure</h3>
<p>One last swim at the nearest beach. Alternative: take a cruise around Mount Athos from Ouranoupoli — see our <a href="/guide/boat-tours">boat tours guide</a>. If you are deciding between the two main peninsulas, read our <a href="/guide/kassandra-vs-sithonia">Kassandra vs Sithonia</a> comparison. For getting around, we recommend you <a href="/guide/car-rental">rent a car</a>.</p>

<h2>Budget Breakdown</h2>
<ul>
<li><strong>Accommodation:</strong> €40-80/night (studio or room)</li>
<li><strong>Food:</strong> €20-40/day</li>
<li><strong>Car rental:</strong> €30-50/day</li>
<li><strong>Activities:</strong> €20-50 total</li>
</ul>

<h2>Tips</h2>
<ul>
<li>Best months: June and September (fewer crowds, lower prices)</li>
<li>Pack sunscreen, a hat, and water shoes</li>
<li>Book accommodation early for July-August</li>
<li>Check the <a href="/faq/transport">transport FAQ</a> before you go</li>
</ul>`,

      de: `<h2>Fur Wen Ist Dieser Reiseplan</h2>
<p>Dieser 3-Tage-Reiseplan ist ideal fur <strong>Kurzurlaube</strong> — Paare, Freundesgruppen oder Familien. Geschatztes Budget: <strong>€200-400 pro Person</strong> (Unterkunft, Essen, Transport).</p>

<h2>Tag fur Tag</h2>

<h3>Tag 1 — Ankunft & Kassandra</h3>
<p>Ankunft in Thessaloniki und Fahrt nach Kassandra (1,5 Stunden). Halt in <strong>Kallithea</strong> fur das erste Bad — kristallklares Wasser am organisierten <a href="/beaches">Strand</a>. Nachmittags erkunden Sie Afytos, ein charmantes Steindorf mit Panoramablick. Abendessen in einer traditionellen Taverne — die besten <a href="/in/afytos/restaurants">Restaurants in Afytos</a>. Fur <a href="/listings">Unterkunft</a> ist Kassandra eine ideale Basis.</p>

<h3>Tag 2 — Sithonia Strandhopping</h3>
<p>Fruh aufbrechen nach Sithonia. Erster Halt: <strong>Kavourotrypes</strong> — exotischer Strand mit weissen Klippen. Dann weiter zu <strong>Karidi</strong>, einem der <a href="/best/beaches-sithonia">besten Strande Sithonias</a>. Mittagessen in Porto Koufo — frische Meeresfruchte. Fur mehr <a href="/activities">Aktivitaten</a> probieren Sie SUP oder Kajakfahren.</p>

<h3>Tag 3 — Morgendliches Bad & Abreise</h3>
<p>Ein letztes Bad am nachsten Strand. Alternative: Kreuzfahrt um den Berg Athos — siehe unseren <a href="/guide/boat-tours">Bootstouren-Fuhrer</a>. Lesen Sie auch unseren Vergleich <a href="/guide/kassandra-vs-sithonia">Kassandra vs Sithonia</a>. Wir empfehlen einen <a href="/guide/car-rental">Mietwagen</a>.</p>

<h2>Budgetubersicht</h2>
<ul>
<li><strong>Unterkunft:</strong> €40-80/Nacht</li>
<li><strong>Essen:</strong> €20-40/Tag</li>
<li><strong>Mietwagen:</strong> €30-50/Tag</li>
<li><strong>Aktivitaten:</strong> €20-50 gesamt</li>
</ul>

<h2>Tipps</h2>
<ul>
<li>Beste Monate: Juni und September</li>
<li>Sonnencreme, Hut und Wasserschuhe einpacken</li>
<li>Fruh buchen fur Juli-August</li>
<li>Siehe die <a href="/faq/transport">Transport-FAQ</a></li>
</ul>`,

      bg: `<h2>За Кого Е Този Маршрут</h2>
<p>Този 3-дневен маршрут е идеален за <strong>кратки почивки</strong> — двойки, групи приятели или семейства. Прогнозен бюджет: <strong>€200-400 на човек</strong>.</p>

<h2>Ден по Ден</h2>

<h3>Ден 1 — Пристигане & Касандра</h3>
<p>Пристигате в Солун и карате към Касандра (1,5 часа). Спирка в <strong>Калитея</strong> за първото къпане — кристално чиста вода на организиран <a href="/beaches">плаж</a>. Следобед разгледайте Афитос — красиво каменно село с панорамна гледка. Вечеря в традиционна таверна — вижте най-добрите <a href="/in/afytos/restaurants">ресторанти в Афитос</a>. За <a href="/listings">настаняване</a> Касандра е идеална база.</p>

<h3>Ден 2 — Плажове на Ситония</h3>
<p>Тръгнете рано за Ситония. Първа спирка: <strong>Кавуротрипес</strong>. После — <strong>Кариди</strong>, един от <a href="/best/beaches-sithonia">най-добрите плажове на Ситония</a>. Обяд в Порто Куфо. За повече <a href="/activities">дейности</a> опитайте SUP или каяк.</p>

<h3>Ден 3 — Сутрешно Къпане & Заминаване</h3>
<p>Последно къпане. Алтернатива: круиз около Атон — вижте <a href="/guide/boat-tours">морски разходки</a>. Прочетете и <a href="/guide/kassandra-vs-sithonia">Касандра срещу Ситония</a>. Препоръчваме <a href="/guide/car-rental">кола под наем</a>.</p>

<h2>Бюджет</h2>
<ul>
<li><strong>Настаняване:</strong> €40-80/нощ</li>
<li><strong>Храна:</strong> €20-40/ден</li>
<li><strong>Кола:</strong> €30-50/ден</li>
<li><strong>Дейности:</strong> €20-50 общо</li>
</ul>

<h2>Съвети</h2>
<ul>
<li>Най-добри месеци: юни и септември</li>
<li>Вземете слънцезащитен крем и водни обувки</li>
<li>Резервирайте рано за юли-август</li>
<li>Вижте <a href="/faq/transport">ЧЗВ за транспорт</a></li>
</ul>`,

      ru: `<h2>Для Кого Этот Маршрут</h2>
<p>Этот 3-дневный маршрут идеален для <strong>коротких поездок</strong> — пар, компаний друзей или семей. Ориентировочный бюджет: <strong>€200-400 на человека</strong>.</p>

<h2>По Дням</h2>

<h3>День 1 — Прибытие & Кассандра</h3>
<p>Прибытие в Салоники, поездка в Кассандру (1,5 часа). Остановка в <strong>Каллифее</strong> — первое купание на организованном <a href="/beaches">пляже</a>. Днем прогулка по Афитосу — живописная деревня с панорамным видом. Ужин в таверне — лучшие <a href="/in/afytos/restaurants">рестораны Афитоса</a>. Для <a href="/listings">проживания</a> Кассандра — идеальная база.</p>

<h3>День 2 — Пляжи Ситонии</h3>
<p>Раннее отправление в Ситонию. Первая остановка: <strong>Кавуротрипес</strong> — экзотический пляж. Затем <strong>Кариди</strong>, один из <a href="/best/beaches-sithonia">лучших пляжей Ситонии</a>. Обед в Порто Куфо — свежие морепродукты. Для активного отдыха — <a href="/activities">развлечения</a>: SUP, каякинг.</p>

<h3>День 3 — Утреннее Купание & Отъезд</h3>
<p>Последнее купание. Альтернатива: круиз вокруг Афона из Уранополиса — <a href="/guide/boat-tours">морские прогулки</a>. Читайте сравнение <a href="/guide/kassandra-vs-sithonia">Кассандра vs Ситония</a>. Рекомендуем <a href="/guide/car-rental">арендовать машину</a>.</p>

<h2>Бюджет</h2>
<ul>
<li><strong>Проживание:</strong> €40-80/ночь</li>
<li><strong>Еда:</strong> €20-40/день</li>
<li><strong>Аренда авто:</strong> €30-50/день</li>
<li><strong>Развлечения:</strong> €20-50 всего</li>
</ul>

<h2>Советы</h2>
<ul>
<li>Лучшие месяцы: июнь и сентябрь</li>
<li>Возьмите солнцезащитный крем и аквашузы</li>
<li>Бронируйте заранее на июль-август</li>
<li>Смотрите <a href="/faq/transport">FAQ по транспорту</a></li>
</ul>`,

      ro: `<h2>Pentru Cine Este Acest Itinerar</h2>
<p>Acest itinerar de 3 zile este ideal pentru <strong>escapade scurte</strong> — cupluri, grupuri de prieteni sau familii. Buget estimat: <strong>€200-400 pe persoana</strong>.</p>

<h2>Zi cu Zi</h2>

<h3>Ziua 1 — Sosire & Kassandra</h3>
<p>Sositi in Salonic si conduceti spre Kassandra (1,5 ore). Oprire la <strong>Kallithea</strong> pentru prima baie — apa cristalina la o <a href="/beaches">plaja</a> organizata. Dupa-amiaza explorati Afytos — un sat din piatra cu priveliște panoramica. Cina la o taverna — cele mai bune <a href="/in/afytos/restaurants">restaurante din Afytos</a>. Pentru <a href="/listings">cazare</a>, Kassandra e baza ideala.</p>

<h3>Ziua 2 — Plajele din Sithonia</h3>
<p>Plecati devreme spre Sithonia. Prima oprire: <strong>Kavourotrypes</strong>. Apoi <strong>Karidi</strong>, una dintre cele mai bune <a href="/best/beaches-sithonia">plaje din Sithonia</a>. Pranz la Porto Koufo. Pentru mai multe <a href="/activities">activitati</a>, incercati SUP sau caiac.</p>

<h3>Ziua 3 — Baie de Dimineata & Plecare</h3>
<p>Ultima baie. Alternativa: croaziera in jurul Muntelui Athos — vezi <a href="/guide/boat-tours">tururi cu barca</a>. Cititi si <a href="/guide/kassandra-vs-sithonia">Kassandra vs Sithonia</a>. Recomandam sa <a href="/guide/car-rental">inchiriati o masina</a>.</p>

<h2>Buget</h2>
<ul>
<li><strong>Cazare:</strong> €40-80/noapte</li>
<li><strong>Mancare:</strong> €20-40/zi</li>
<li><strong>Masina:</strong> €30-50/zi</li>
<li><strong>Activitati:</strong> €20-50 total</li>
</ul>

<h2>Sfaturi</h2>
<ul>
<li>Cele mai bune luni: iunie si septembrie</li>
<li>Luati crema de soare si incaltaminte de apa</li>
<li>Rezervati din timp pentru iulie-august</li>
<li>Verificati <a href="/faq/transport">FAQ transport</a></li>
</ul>`,

      sr: `<h2>Za Koga Je Ovaj Plan</h2>
<p>Ovaj plan za 3 dana je idealan za <strong>kratke odmore</strong> — parove, grupe prijatelja ili porodice. Procenjeni budzet: <strong>€200-400 po osobi</strong>.</p>

<h2>Dan po Dan</h2>

<h3>Dan 1 — Dolazak & Kasandra</h3>
<p>Stizete u Solun i vozite do Kasandre (1,5 sat). Stanica u <strong>Kalitei</strong> za prvo kupanje na organizovanoj <a href="/beaches">plazi</a>. Popodne istrazite Afitos — selo od kamena sa panoramskim pogledom. Vecera u taverni — najbolji <a href="/in/afytos/restaurants">restorani u Afitosu</a>. Za <a href="/listings">smestaj</a>, Kasandra je idealna baza.</p>

<h3>Dan 2 — Plaze Sitonije</h3>
<p>Rano krenite za Sitoniju. Prva stanica: <strong>Kavurotripes</strong>. Zatim <strong>Karidi</strong>, jedna od <a href="/best/beaches-sithonia">najboljih plaza Sitonije</a>. Rucak u Porto Kufo. Za vise <a href="/activities">aktivnosti</a> probajte SUP ili kajak.</p>

<h3>Dan 3 — Jutarnje Kupanje & Odlazak</h3>
<p>Poslednje kupanje. Alternativa: krstarenje oko Atosa — vidite <a href="/guide/boat-tours">vodic za brodske ture</a>. Procitajte i <a href="/guide/kassandra-vs-sithonia">Kasandra vs Sitonija</a>. Preporucujemo da <a href="/guide/car-rental">iznajmite auto</a>.</p>

<h2>Budzet</h2>
<ul>
<li><strong>Smestaj:</strong> €40-80/noc</li>
<li><strong>Hrana:</strong> €20-40/dan</li>
<li><strong>Auto:</strong> €30-50/dan</li>
<li><strong>Aktivnosti:</strong> €20-50 ukupno</li>
</ul>

<h2>Saveti</h2>
<ul>
<li>Najbolji meseci: jun i septembar</li>
<li>Ponesite kremu za suncanje i vodene cipele</li>
<li>Rezervisite rano za jul-avgust</li>
<li>Pogledajte <a href="/faq/transport">FAQ o prevozu</a></li>
</ul>`,
    },
  },

  {
    slug: '5-days', icon: 'Calendar', color: 'emerald',
    title: {
      el: '5 Μέρες στη Χαλκιδική — Η Πλήρης Εμπειρία',
      en: '5 Days in Halkidiki — The Complete Experience',
      de: '5 Tage in Chalkidiki — Das Komplette Erlebnis',
      bg: '5 Дни в Халкидики — Пълното Изживяване',
      ru: '5 Дней в Халкидики — Полный Опыт',
      ro: '5 Zile in Halkidiki — Experienta Completa',
      sr: '5 Dana u Halkidikiju — Kompletno Iskustvo',
    },
    description: {
      el: 'Πρόγραμμα 5 ημερών: Κασσάνδρα, Σιθωνία, Αμμουλιανή',
      en: 'A 5-day itinerary: Kassandra, Sithonia, Ammouliani island',
      de: '5-Tage-Reiseplan: Kassandra, Sithonia, Ammouliani',
      bg: 'Маршрут за 5 дни: Касандра, Ситония, Амулиани',
      ru: 'Маршрут на 5 дней: Кассандра, Ситония, Аммулиани',
      ro: 'Itinerar de 5 zile: Kassandra, Sithonia, Ammouliani',
      sr: 'Plan za 5 dana: Kasandra, Sitonija, Amuliani',
    },
    metaTitle: {
      el: '5 Μέρες στη Χαλκιδική — Πρόγραμμα',
      en: '5 Days in Halkidiki — Itinerary',
      de: '5 Tage in Chalkidiki — Reiseplan',
      bg: '5 Дни в Халкидики — Маршрут',
      ru: '5 Дней в Халкидики — Маршрут',
      ro: '5 Zile in Halkidiki — Itinerar',
      sr: '5 Dana u Halkidikiju — Plan',
    },
    metaDesc: {
      el: 'Πλήρες πρόγραμμα 5 ημερών στη Χαλκιδική. Κασσάνδρα, Σιθωνία, Αμμουλιανή. Μπάτζετ €400-700.',
      en: 'Complete 5-day itinerary for Halkidiki. Kassandra, Sithonia, Ammouliani island. Budget €400-700 per person.',
      de: 'Kompletter 5-Tage-Reiseplan fur Chalkidiki. Kassandra, Sithonia, Ammouliani. Budget €400-700.',
      bg: 'Пълен маршрут за 5 дни в Халкидики. Касандра, Ситония, Амулиани. Бюджет €400-700.',
      ru: 'Полный маршрут на 5 дней в Халкидики. Кассандра, Ситония, Аммулиани. Бюджет €400-700.',
      ro: 'Itinerar complet de 5 zile in Halkidiki. Kassandra, Sithonia, Ammouliani. Buget €400-700.',
      sr: 'Kompletan plan za 5 dana u Halkidikiju. Kasandra, Sitonija, Amuliani. Budzet €400-700.',
    },
    content: {
      el: `<h2>Για Ποιον Είναι Αυτό το Πρόγραμμα</h2>
<p>Με 5 μέρες μπορείτε να απολαύσετε <strong>και τις δύο μεγάλες χερσονήσους</strong> συν μια ημερήσια εκδρομή στο νησί. Ιδανικό για ζευγάρια και οικογένειες. Μπάτζετ: <strong>€400-700 ανά άτομο</strong>.</p>

<h2>Αναλυτικό Πρόγραμμα</h2>

<h3>Ημέρα 1-2 — Κασσάνδρα</h3>
<p>Εξερευνήστε την <a href="/guide/kassandra">Κασσάνδρα</a> σε βάθος. Ημέρα 1: Άφυτος, Καλλιθέα, ηλιοβασίλεμα. Ημέρα 2: <a href="/beaches">παραλίες</a> Χανιώτης, νυχτερινή ζωή στα beach bars. Για <a href="/in/afytos/restaurants">φαγητό στον Άφυτο</a> δοκιμάστε παραδοσιακή κουζίνα.</p>

<h3>Ημέρα 3-4 — Σιθωνία</h3>
<p>Μετακίνηση στη <a href="/guide/sithonia">Σιθωνία</a>. Ημέρα 3: Βουρβουρού και τα νησάκια, Καβουρότρυπες. Ημέρα 4: Σάρτη, παραλία Σάρτη, ψαροταβέρνα. Δείτε τις <a href="/best/beaches-sithonia">καλύτερες παραλίες Σιθωνίας</a> και κάντε <a href="/activities">δραστηριότητες</a> στο νερό.</p>

<h3>Ημέρα 5 — Αμμουλιανή</h3>
<p>Ημερήσια εκδρομή στην <a href="/guide/ammouliani-island">Αμμουλιανή</a> — το μοναδικό κατοικημένο νησί της Χαλκιδικής. Φέρι από Τρίπητη. Παραλίες Αλυκές, Μεγάλη Άμμος. Βράδυ: τελευταίο δείπνο πριν την αναχώρηση. <a href="/guide/car-rental">Νοικιάστε αυτοκίνητο</a> για μέγιστη ευελιξία.</p>

<h2>Κόστος Ανάλυση</h2>
<ul>
<li><strong>Κατάλυμα:</strong> €40-80/βράδυ x 4 = €160-320</li>
<li><strong>Φαγητό:</strong> €25-45/μέρα x 5 = €125-225</li>
<li><strong>Αυτοκίνητο:</strong> €30-50/μέρα x 5 = €150-250</li>
<li><strong>Φέρι + δραστηριότητες:</strong> €30-60</li>
</ul>

<h2>Συμβουλές</h2>
<ul>
<li>Μείνετε 2 νύχτες Κασσάνδρα, 2 νύχτες Σιθωνία</li>
<li>Κλείστε <a href="/listings">κατάλυμα</a> νωρίς</li>
<li>Φέρτε μάσκα και αναπνευστήρα</li>
</ul>`,

      en: `<h2>Who Is This Itinerary For</h2>
<p>With 5 days you can enjoy <strong>both major peninsulas</strong> plus an island day trip. Perfect for couples and families. Budget: <strong>€400-700 per person</strong>.</p>

<h2>Day-by-Day Breakdown</h2>

<h3>Days 1-2 — Kassandra</h3>
<p>Explore <a href="/guide/kassandra">Kassandra</a> in depth. Day 1: Afytos, Kallithea, sunset views. Day 2: <a href="/beaches">beaches</a> at Hanioti, nightlife at beach bars. For <a href="/in/afytos/restaurants">dining in Afytos</a>, try the traditional cuisine.</p>

<h3>Days 3-4 — Sithonia</h3>
<p>Move to <a href="/guide/sithonia">Sithonia</a>. Day 3: Vourvourou and its islands, Kavourotrypes. Day 4: Sarti, Sarti beach, fish taverna. Check out the <a href="/best/beaches-sithonia">best Sithonia beaches</a> and enjoy water <a href="/activities">activities</a>.</p>

<h3>Day 5 — Ammouliani Island</h3>
<p>Day trip to <a href="/guide/ammouliani-island">Ammouliani</a> — Halkidiki's only inhabited island. Ferry from Tripiti. Beaches Alykes, Megali Ammos. Evening: final dinner before departure. <a href="/guide/car-rental">Rent a car</a> for maximum flexibility.</p>

<h2>Budget Breakdown</h2>
<ul>
<li><strong>Accommodation:</strong> €40-80/night x 4 = €160-320</li>
<li><strong>Food:</strong> €25-45/day x 5 = €125-225</li>
<li><strong>Car rental:</strong> €30-50/day x 5 = €150-250</li>
<li><strong>Ferry + activities:</strong> €30-60</li>
</ul>

<h2>Tips</h2>
<ul>
<li>Stay 2 nights in Kassandra, 2 nights in Sithonia</li>
<li>Book <a href="/listings">accommodation</a> early</li>
<li>Bring a snorkel mask</li>
</ul>`,

      de: `<h2>Fur Wen Ist Dieser Reiseplan</h2>
<p>Mit 5 Tagen konnen Sie <strong>beide grossen Halbinseln</strong> plus einen Inselausflug geniessen. Budget: <strong>€400-700 pro Person</strong>.</p>

<h2>Tag fur Tag</h2>

<h3>Tag 1-2 — Kassandra</h3>
<p>Erkunden Sie <a href="/guide/kassandra">Kassandra</a> ausfuhrlich. Tag 1: Afytos, Kallithea, Sonnenuntergang. Tag 2: <a href="/beaches">Strande</a> bei Hanioti, Nachtleben. Zum <a href="/in/afytos/restaurants">Essen in Afytos</a> probieren Sie die traditionelle Kuche.</p>

<h3>Tag 3-4 — Sithonia</h3>
<p>Weiter nach <a href="/guide/sithonia">Sithonia</a>. Tag 3: Vourvourou und Inseln, Kavourotrypes. Tag 4: Sarti, Fischrestaurant. Die <a href="/best/beaches-sithonia">besten Strande Sithonias</a> und Wasser-<a href="/activities">Aktivitaten</a>.</p>

<h3>Tag 5 — Ammouliani</h3>
<p>Tagesausflug nach <a href="/guide/ammouliani-island">Ammouliani</a> — Chalkidikis einzige bewohnte Insel. Fahre von Tripiti. <a href="/guide/car-rental">Mietwagen</a> empfohlen.</p>

<h2>Budgetubersicht</h2>
<ul>
<li><strong>Unterkunft:</strong> €40-80/Nacht x 4</li>
<li><strong>Essen:</strong> €25-45/Tag x 5</li>
<li><strong>Mietwagen:</strong> €30-50/Tag x 5</li>
<li><strong>Fahre + Aktivitaten:</strong> €30-60</li>
</ul>

<h2>Tipps</h2>
<ul>
<li>2 Nachte Kassandra, 2 Nachte Sithonia</li>
<li><a href="/listings">Unterkunft</a> fruh buchen</li>
<li>Schnorchelmaske mitbringen</li>
</ul>`,

      bg: `<h2>За Кого Е Този Маршрут</h2>
<p>С 5 дни можете да се насладите на <strong>двата полуострова</strong> плюс островна екскурзия. Бюджет: <strong>€400-700 на човек</strong>.</p>

<h2>Ден по Ден</h2>

<h3>Ден 1-2 — Касандра</h3>
<p>Разгледайте <a href="/guide/kassandra">Касандра</a> подробно. Ден 1: Афитос, Калитея. Ден 2: <a href="/beaches">плажове</a> при Ханиоти, нощен живот. За <a href="/in/afytos/restaurants">храна в Афитос</a> опитайте традиционната кухня.</p>

<h3>Ден 3-4 — Ситония</h3>
<p>Преместете се в <a href="/guide/sithonia">Ситония</a>. Ден 3: Вурвуру и островите, Кавуротрипес. Ден 4: Сарти. Вижте <a href="/best/beaches-sithonia">най-добрите плажове</a> и водни <a href="/activities">дейности</a>.</p>

<h3>Ден 5 — Амулиани</h3>
<p>Дневна екскурзия до <a href="/guide/ammouliani-island">Амулиани</a> — единственият населен остров. Ферибот от Трипити. <a href="/guide/car-rental">Кола под наем</a> за удобство.</p>

<h2>Бюджет</h2>
<ul>
<li><strong>Настаняване:</strong> €40-80/нощ x 4</li>
<li><strong>Храна:</strong> €25-45/ден x 5</li>
<li><strong>Кола:</strong> €30-50/ден x 5</li>
<li><strong>Ферибот + дейности:</strong> €30-60</li>
</ul>

<h2>Съвети</h2>
<ul>
<li>2 нощи Касандра, 2 нощи Ситония</li>
<li>Резервирайте <a href="/listings">настаняване</a> рано</li>
</ul>`,

      ru: `<h2>Для Кого Этот Маршрут</h2>
<p>За 5 дней вы успеете насладиться <strong>обоими полуостровами</strong> плюс островная экскурсия. Бюджет: <strong>€400-700 на человека</strong>.</p>

<h2>По Дням</h2>

<h3>Дни 1-2 — Кассандра</h3>
<p>Изучите <a href="/guide/kassandra">Кассандру</a> подробно. День 1: Афитос, Каллифея. День 2: <a href="/beaches">пляжи</a> Ханиоти, ночная жизнь. Для <a href="/in/afytos/restaurants">ужина в Афитосе</a> попробуйте традиционную кухню.</p>

<h3>Дни 3-4 — Ситония</h3>
<p>Переезд в <a href="/guide/sithonia">Ситонию</a>. День 3: Вурвуру и островки, Кавуротрипес. День 4: Сарти. Лучшие <a href="/best/beaches-sithonia">пляжи Ситонии</a> и водные <a href="/activities">развлечения</a>.</p>

<h3>День 5 — Аммулиани</h3>
<p>Однодневная поездка на <a href="/guide/ammouliani-island">Аммулиани</a> — единственный обитаемый остров Халкидиков. Паром из Трипити. <a href="/guide/car-rental">Аренда авто</a> для удобства.</p>

<h2>Бюджет</h2>
<ul>
<li><strong>Проживание:</strong> €40-80/ночь x 4</li>
<li><strong>Еда:</strong> €25-45/день x 5</li>
<li><strong>Авто:</strong> €30-50/день x 5</li>
<li><strong>Паром + развлечения:</strong> €30-60</li>
</ul>

<h2>Советы</h2>
<ul>
<li>2 ночи Кассандра, 2 ночи Ситония</li>
<li>Бронируйте <a href="/listings">жилье</a> заранее</li>
</ul>`,

      ro: `<h2>Pentru Cine Este Acest Itinerar</h2>
<p>Cu 5 zile puteti explora <strong>ambele peninsule</strong> plus o excursie pe insula. Buget: <strong>€400-700 pe persoana</strong>.</p>

<h2>Zi cu Zi</h2>

<h3>Zilele 1-2 — Kassandra</h3>
<p>Explorati <a href="/guide/kassandra">Kassandra</a> in detaliu. Ziua 1: Afytos, Kallithea. Ziua 2: <a href="/beaches">plaje</a> la Hanioti, viata de noapte. Pentru <a href="/in/afytos/restaurants">restaurante in Afytos</a> incercati bucataria traditionala.</p>

<h3>Zilele 3-4 — Sithonia</h3>
<p>Mutati-va in <a href="/guide/sithonia">Sithonia</a>. Ziua 3: Vourvourou si insulitele, Kavourotrypes. Ziua 4: Sarti. Cele mai bune <a href="/best/beaches-sithonia">plaje din Sithonia</a> si <a href="/activities">activitati</a> nautice.</p>

<h3>Ziua 5 — Ammouliani</h3>
<p>Excursie de o zi pe <a href="/guide/ammouliani-island">Ammouliani</a> — singura insula locuita. Feribot din Tripiti. <a href="/guide/car-rental">Inchiriati masina</a> pentru flexibilitate.</p>

<h2>Buget</h2>
<ul>
<li><strong>Cazare:</strong> €40-80/noapte x 4</li>
<li><strong>Mancare:</strong> €25-45/zi x 5</li>
<li><strong>Masina:</strong> €30-50/zi x 5</li>
<li><strong>Feribot + activitati:</strong> €30-60</li>
</ul>

<h2>Sfaturi</h2>
<ul>
<li>2 nopti Kassandra, 2 nopti Sithonia</li>
<li>Rezervati <a href="/listings">cazare</a> din timp</li>
</ul>`,

      sr: `<h2>Za Koga Je Ovaj Plan</h2>
<p>Sa 5 dana mozete uzivati u <strong>oba poluostrva</strong> plus izlet na ostrvo. Budzet: <strong>€400-700 po osobi</strong>.</p>

<h2>Dan po Dan</h2>

<h3>Dan 1-2 — Kasandra</h3>
<p>Istrazite <a href="/guide/kassandra">Kasandru</a> detaljno. Dan 1: Afitos, Kalitea. Dan 2: <a href="/beaches">plaze</a> u Haniotiju, nocni zivot. Za <a href="/in/afytos/restaurants">hranu u Afitosu</a> probajte tradicionalnu kuhinju.</p>

<h3>Dan 3-4 — Sitonija</h3>
<p>Preselite se u <a href="/guide/sithonia">Sitoniju</a>. Dan 3: Vurvuru i ostrvca, Kavurotripes. Dan 4: Sarti. Najbolje <a href="/best/beaches-sithonia">plaze Sitonije</a> i vodene <a href="/activities">aktivnosti</a>.</p>

<h3>Dan 5 — Amuliani</h3>
<p>Dnevni izlet na <a href="/guide/ammouliani-island">Amuliani</a> — jedino naseljeno ostrvo. Trajekt iz Tripitija. <a href="/guide/car-rental">Iznajmite auto</a> za fleksibilnost.</p>

<h2>Budzet</h2>
<ul>
<li><strong>Smestaj:</strong> €40-80/noc x 4</li>
<li><strong>Hrana:</strong> €25-45/dan x 5</li>
<li><strong>Auto:</strong> €30-50/dan x 5</li>
<li><strong>Trajekt + aktivnosti:</strong> €30-60</li>
</ul>

<h2>Saveti</h2>
<ul>
<li>2 noci Kasandra, 2 noci Sitonija</li>
<li>Rezervisite <a href="/listings">smestaj</a> rano</li>
</ul>`,
    },
  },

  {
    slug: '7-days', icon: 'Calendar', color: 'amber',
    title: {
      el: '7 Μέρες στη Χαλκιδική — Πρόγραμμα Μιας Εβδομάδας',
      en: '7 Days in Halkidiki — One Week Itinerary',
      de: '7 Tage in Chalkidiki — Eine Woche Reiseplan',
      bg: '7 Дни в Халкидики — Едноседмичен Маршрут',
      ru: '7 Дней в Халкидики — Маршрут на Неделю',
      ro: '7 Zile in Halkidiki — Itinerar de O Saptamana',
      sr: '7 Dana u Halkidikiju — Plan za Nedelju Dana',
    },
    description: {
      el: 'Πλήρες πρόγραμμα 7 ημερών: Κασσάνδρα, Σιθωνία, χωριά, νησιά, Άθως',
      en: 'Complete 7-day itinerary: Kassandra, Sithonia, villages, islands, Athos',
      de: 'Kompletter 7-Tage-Plan: Kassandra, Sithonia, Dorfer, Inseln, Athos',
      bg: 'Пълен 7-дневен маршрут: Касандра, Ситония, села, острови, Атон',
      ru: 'Полный 7-дневный маршрут: Кассандра, Ситония, деревни, острова, Афон',
      ro: 'Itinerar complet de 7 zile: Kassandra, Sithonia, sate, insule, Athos',
      sr: 'Kompletan plan za 7 dana: Kasandra, Sitonija, sela, ostrva, Atos',
    },
    metaTitle: {
      el: '7 Μέρες στη Χαλκιδική — Πρόγραμμα',
      en: '7 Days in Halkidiki — Itinerary',
      de: '7 Tage in Chalkidiki — Reiseplan',
      bg: '7 Дни в Халкидики — Маршрут',
      ru: '7 Дней в Халкидики — Маршрут',
      ro: '7 Zile in Halkidiki — Itinerar',
      sr: '7 Dana u Halkidikiju — Plan',
    },
    metaDesc: {
      el: 'Αναλυτικό πρόγραμμα 7 ημερών στη Χαλκιδική. Κασσάνδρα, Σιθωνία, ορεινά χωριά, Αμμουλιανή, Ουρανούπολη. Μπάτζετ €600-1200.',
      en: 'Detailed 7-day itinerary for Halkidiki. Kassandra, Sithonia, mountain villages, Ammouliani, Ouranoupoli. Budget €600-1200.',
      de: 'Detaillierter 7-Tage-Reiseplan fur Chalkidiki. Kassandra, Sithonia, Bergdorfer, Ammouliani. Budget €600-1200.',
      bg: 'Подробен 7-дневен маршрут за Халкидики. Касандра, Ситония, планински села, Амулиани. Бюджет €600-1200.',
      ru: 'Подробный 7-дневный маршрут по Халкидики. Кассандра, Ситония, горные деревни, Аммулиани. Бюджет €600-1200.',
      ro: 'Itinerar detaliat de 7 zile in Halkidiki. Kassandra, Sithonia, sate montane, Ammouliani. Buget €600-1200.',
      sr: 'Detaljan plan za 7 dana u Halkidikiju. Kasandra, Sitonija, planinska sela, Amuliani. Budzet €600-1200.',
    },
    content: {
      el: `<h2>Για Ποιον Είναι Αυτό το Πρόγραμμα</h2>
<p>Μια ολόκληρη εβδομάδα σας δίνει χρόνο να <strong>γνωρίσετε τη Χαλκιδική σε βάθος</strong> — παραλίες, βουνά, νησιά και πολιτισμό. Μπάτζετ: <strong>€600-1200 ανά άτομο</strong>.</p>

<h2>Αναλυτικό Πρόγραμμα</h2>

<h3>Ημέρα 1-2 — Χερσόνησος Κασσάνδρας</h3>
<p>Περιήγηση στην Κασσάνδρα. Ημέρα 1: <a href="/in/kallithea/beaches">παραλίες Καλλιθέας</a>, πεζόδρομος Αφύτου. Ημέρα 2: Χανιώτη, Πευκοχώρι, <a href="/in/hanioti/restaurants">εστιατόρια Χανιώτης</a>. Βραδινές βόλτες στα beach bars.</p>

<h3>Ημέρα 3-4 — Σιθωνία</h3>
<p>Μετακίνηση στη Σιθωνία. Ημέρα 3: Βουρβουρού, Καρύδι. Ημέρα 4: Καβουρότρυπες, Πόρτο Κουφό. Ανακαλύψτε τις πιο <a href="/best/quiet-beaches">ήσυχες παραλίες</a> και κάντε <a href="/activities">δραστηριότητες</a> στη θάλασσα.</p>

<h3>Ημέρα 5 — Ορεινά Χωριά</h3>
<p>Ημέρα εξερεύνησης στο εσωτερικό. Επισκεφτείτε την <strong>Αρναία</strong> και τον <strong>Παρθενώνα</strong> — πέτρινα χωριά με παράδοση. Δείτε τον <a href="/guide/villages">οδηγό χωριών</a>. Τοπικό μέλι, τσίπουρο, παραδοσιακές ταβέρνες.</p>

<h3>Ημέρα 6 — Αμμουλιανή & Δρένια</h3>
<p>Εκδρομή στην <a href="/guide/ammouliani-island">Αμμουλιανή</a> και τα νησάκια Δρένια. Ανεξερεύνητες παραλίες, κρυστάλλινα νερά. Φέρι από Τρίπητη. Βρείτε <a href="/listings">κατάλυμα</a> κοντά στην Ουρανούπολη.</p>

<h3>Ημέρα 7 — Ουρανούπολη & Κρουαζιέρα στον Άθω</h3>
<p>Τελευταία μέρα στην Ουρανούπολη. Κρουαζιέρα γύρω από το Άγιο Όρος — δείτε <a href="/guide/boat-tours">θαλάσσιες εκδρομές</a>. Αγορές σε τοπικά μαγαζιά, αναχώρηση. <a href="/guide/car-rental">Νοικιάστε αυτοκίνητο</a> για ολόκληρο το ταξίδι.</p>

<h2>Κόστος Ανάλυση</h2>
<ul>
<li><strong>Κατάλυμα:</strong> €40-80/βράδυ x 6 = €240-480</li>
<li><strong>Φαγητό:</strong> €25-45/μέρα x 7 = €175-315</li>
<li><strong>Αυτοκίνητο:</strong> €30-50/μέρα x 7 = €210-350</li>
<li><strong>Εκδρομές + φέρι:</strong> €50-100</li>
</ul>

<h2>Συμβουλές</h2>
<ul>
<li>Αλλάξτε βάση κάθε 2 νύχτες</li>
<li>Ξεκινήστε νωρίς τα πρωινά για ήσυχες παραλίες</li>
<li>Κρατήστε μια μέρα χωρίς πρόγραμμα</li>
</ul>`,

      en: `<h2>Who Is This Itinerary For</h2>
<p>A full week gives you time to <strong>discover Halkidiki in depth</strong> — beaches, mountains, islands, and culture. Budget: <strong>€600-1200 per person</strong>.</p>

<h2>Day-by-Day Breakdown</h2>

<h3>Days 1-2 — Kassandra Peninsula</h3>
<p>Tour of Kassandra. Day 1: <a href="/in/kallithea/beaches">Kallithea beaches</a>, Afytos village walk. Day 2: Hanioti, Pefkohori, <a href="/in/hanioti/restaurants">Hanioti restaurants</a>. Evening strolls along beach bars.</p>

<h3>Days 3-4 — Sithonia</h3>
<p>Move to Sithonia. Day 3: Vourvourou, Karidi beach. Day 4: Kavourotrypes, Porto Koufo. Discover the most <a href="/best/quiet-beaches">quiet beaches</a> and try water <a href="/activities">activities</a>.</p>

<h3>Day 5 — Mountain Villages</h3>
<p>Inland exploration day. Visit <strong>Arnea</strong> and <strong>Parthenonas</strong> — stone-built traditional villages. See the <a href="/guide/villages">villages guide</a>. Local honey, tsipouro, traditional tavernas.</p>

<h3>Day 6 — Ammouliani & Drenia Islands</h3>
<p>Trip to <a href="/guide/ammouliani-island">Ammouliani</a> and the Drenia islets. Unspoiled beaches, crystal-clear waters. Ferry from Tripiti. Find <a href="/listings">accommodation</a> near Ouranoupoli.</p>

<h3>Day 7 — Ouranoupoli & Mount Athos Cruise</h3>
<p>Final day in Ouranoupoli. Cruise around Mount Athos — see <a href="/guide/boat-tours">boat tours</a>. Shopping at local stores, then departure. <a href="/guide/car-rental">Rent a car</a> for the entire trip.</p>

<h2>Budget Breakdown</h2>
<ul>
<li><strong>Accommodation:</strong> €40-80/night x 6 = €240-480</li>
<li><strong>Food:</strong> €25-45/day x 7 = €175-315</li>
<li><strong>Car rental:</strong> €30-50/day x 7 = €210-350</li>
<li><strong>Excursions + ferry:</strong> €50-100</li>
</ul>

<h2>Tips</h2>
<ul>
<li>Change base every 2 nights for variety</li>
<li>Start mornings early for quiet beaches</li>
<li>Keep one day unplanned for relaxation</li>
</ul>`,

      de: `<h2>Fur Wen Ist Dieser Reiseplan</h2>
<p>Eine ganze Woche gibt Ihnen Zeit, <strong>Chalkidiki in der Tiefe zu entdecken</strong> — Strande, Berge, Inseln und Kultur. Budget: <strong>€600-1200 pro Person</strong>.</p>

<h2>Tag fur Tag</h2>

<h3>Tag 1-2 — Kassandra</h3>
<p>Rundfahrt Kassandra. Tag 1: <a href="/in/kallithea/beaches">Strande Kallithea</a>, Spaziergang Afytos. Tag 2: Hanioti, <a href="/in/hanioti/restaurants">Restaurants Hanioti</a>.</p>

<h3>Tag 3-4 — Sithonia</h3>
<p>Weiter nach Sithonia. Tag 3: Vourvourou, Karidi. Tag 4: Kavourotrypes, Porto Koufo. Die ruhigsten <a href="/best/quiet-beaches">Strande</a> und Wasser-<a href="/activities">Aktivitaten</a>.</p>

<h3>Tag 5 — Bergdorfer</h3>
<p>Arnea und Parthenonas erkunden. Siehe <a href="/guide/villages">Dorfer-Fuhrer</a>. Lokaler Honig und Tsipouro.</p>

<h3>Tag 6 — Ammouliani & Drenia</h3>
<p>Ausflug nach <a href="/guide/ammouliani-island">Ammouliani</a> und Drenia-Inseln. Fahre von Tripiti. <a href="/listings">Unterkunft</a> nahe Ouranoupoli.</p>

<h3>Tag 7 — Ouranoupoli & Athos-Kreuzfahrt</h3>
<p>Kreuzfahrt um den Berg Athos — <a href="/guide/boat-tours">Bootstouren</a>. Einkaufen, Abreise. <a href="/guide/car-rental">Mietwagen</a> fur die gesamte Reise.</p>

<h2>Budgetubersicht</h2>
<ul>
<li><strong>Unterkunft:</strong> €240-480</li>
<li><strong>Essen:</strong> €175-315</li>
<li><strong>Mietwagen:</strong> €210-350</li>
<li><strong>Ausfluge:</strong> €50-100</li>
</ul>

<h2>Tipps</h2>
<ul>
<li>Alle 2 Nachte Basis wechseln</li>
<li>Morgens fruh starten</li>
<li>Einen Tag frei lassen</li>
</ul>`,

      bg: `<h2>За Кого Е Този Маршрут</h2>
<p>Цяла седмица ви дава време да <strong>опознаете Халкидики в дълбочина</strong>. Бюджет: <strong>€600-1200 на човек</strong>.</p>

<h2>Ден по Ден</h2>

<h3>Ден 1-2 — Касандра</h3>
<p>Обиколка на Касандра. Ден 1: <a href="/in/kallithea/beaches">плажове Калитея</a>, Афитос. Ден 2: Ханиоти, <a href="/in/hanioti/restaurants">ресторанти Ханиоти</a>.</p>

<h3>Ден 3-4 — Ситония</h3>
<p>Преместване в Ситония. Вурвуру, Кариди, Кавуротрипес, Порто Куфо. <a href="/best/quiet-beaches">Тихи плажове</a> и <a href="/activities">дейности</a>.</p>

<h3>Ден 5 — Планински Села</h3>
<p>Арнеа и Партенонас. Вижте <a href="/guide/villages">пътеводител за селата</a>.</p>

<h3>Ден 6 — Амулиани & Дрения</h3>
<p><a href="/guide/ammouliani-island">Амулиани</a> и островите Дрения. <a href="/listings">Настаняване</a> близо до Уранополис.</p>

<h3>Ден 7 — Уранополис & Круиз до Атон</h3>
<p>Круиз около Атон — <a href="/guide/boat-tours">морски разходки</a>. <a href="/guide/car-rental">Кола под наем</a> за цялото пътуване.</p>

<h2>Бюджет</h2>
<ul>
<li><strong>Настаняване:</strong> €240-480</li>
<li><strong>Храна:</strong> €175-315</li>
<li><strong>Кола:</strong> €210-350</li>
<li><strong>Екскурзии:</strong> €50-100</li>
</ul>`,

      ru: `<h2>Для Кого Этот Маршрут</h2>
<p>Целая неделя дает время <strong>узнать Халкидики по-настоящему</strong>. Бюджет: <strong>€600-1200 на человека</strong>.</p>

<h2>По Дням</h2>

<h3>Дни 1-2 — Кассандра</h3>
<p>Осмотр Кассандры. День 1: <a href="/in/kallithea/beaches">пляжи Каллифеи</a>, Афитос. День 2: Ханиоти, <a href="/in/hanioti/restaurants">рестораны Ханиоти</a>.</p>

<h3>Дни 3-4 — Ситония</h3>
<p>Переезд в Ситонию. Вурвуру, Кариди, Кавуротрипес, Порто Куфо. <a href="/best/quiet-beaches">Тихие пляжи</a> и <a href="/activities">развлечения</a>.</p>

<h3>День 5 — Горные Деревни</h3>
<p>Арнея и Партенонас. Смотрите <a href="/guide/villages">путеводитель по деревням</a>.</p>

<h3>День 6 — Аммулиани & Дрения</h3>
<p><a href="/guide/ammouliani-island">Аммулиани</a> и островки Дрения. <a href="/listings">Жилье</a> рядом с Уранополисом.</p>

<h3>День 7 — Уранополис & Круиз к Афону</h3>
<p>Круиз вокруг Афона — <a href="/guide/boat-tours">морские прогулки</a>. <a href="/guide/car-rental">Аренда авто</a> на все путешествие.</p>

<h2>Бюджет</h2>
<ul>
<li><strong>Проживание:</strong> €240-480</li>
<li><strong>Еда:</strong> €175-315</li>
<li><strong>Авто:</strong> €210-350</li>
<li><strong>Экскурсии:</strong> €50-100</li>
</ul>`,

      ro: `<h2>Pentru Cine Este Acest Itinerar</h2>
<p>O saptamana intreaga va da timp sa <strong>descoperiti Halkidiki in profunzime</strong>. Buget: <strong>€600-1200 pe persoana</strong>.</p>

<h2>Zi cu Zi</h2>

<h3>Zilele 1-2 — Kassandra</h3>
<p>Tur Kassandra. Ziua 1: <a href="/in/kallithea/beaches">plaje Kallithea</a>, Afytos. Ziua 2: Hanioti, <a href="/in/hanioti/restaurants">restaurante Hanioti</a>.</p>

<h3>Zilele 3-4 — Sithonia</h3>
<p>Mutare in Sithonia. Vourvourou, Karidi, Kavourotrypes, Porto Koufo. <a href="/best/quiet-beaches">Plaje linistite</a> si <a href="/activities">activitati</a>.</p>

<h3>Ziua 5 — Sate Montane</h3>
<p>Arnea si Parthenonas. Vezi <a href="/guide/villages">ghidul satelor</a>.</p>

<h3>Ziua 6 — Ammouliani & Drenia</h3>
<p><a href="/guide/ammouliani-island">Ammouliani</a> si insulitele Drenia. <a href="/listings">Cazare</a> langa Ouranoupoli.</p>

<h3>Ziua 7 — Ouranoupoli & Croaziera Athos</h3>
<p>Croaziera in jurul Muntelui Athos — <a href="/guide/boat-tours">tururi cu barca</a>. <a href="/guide/car-rental">Inchiriati masina</a> pentru toata calatoria.</p>

<h2>Buget</h2>
<ul>
<li><strong>Cazare:</strong> €240-480</li>
<li><strong>Mancare:</strong> €175-315</li>
<li><strong>Masina:</strong> €210-350</li>
<li><strong>Excursii:</strong> €50-100</li>
</ul>`,

      sr: `<h2>Za Koga Je Ovaj Plan</h2>
<p>Cela nedelja vam daje vreme da <strong>upoznate Halkidiki u dubinu</strong>. Budzet: <strong>€600-1200 po osobi</strong>.</p>

<h2>Dan po Dan</h2>

<h3>Dan 1-2 — Kasandra</h3>
<p>Obilazak Kasandre. Dan 1: <a href="/in/kallithea/beaches">plaze Kalitea</a>, Afitos. Dan 2: Hanioti, <a href="/in/hanioti/restaurants">restorani Hanioti</a>.</p>

<h3>Dan 3-4 — Sitonija</h3>
<p>Preseljenje u Sitoniju. Vurvuru, Karidi, Kavurotripes, Porto Kufo. <a href="/best/quiet-beaches">Mirne plaze</a> i <a href="/activities">aktivnosti</a>.</p>

<h3>Dan 5 — Planinska Sela</h3>
<p>Arnea i Partenonas. Vidite <a href="/guide/villages">vodic za sela</a>.</p>

<h3>Dan 6 — Amuliani & Drenija</h3>
<p><a href="/guide/ammouliani-island">Amuliani</a> i ostrvca Drenija. <a href="/listings">Smestaj</a> blizu Uranopolisa.</p>

<h3>Dan 7 — Uranopolis & Krstarenje do Atosa</h3>
<p>Krstarenje oko Atosa — <a href="/guide/boat-tours">brodske ture</a>. <a href="/guide/car-rental">Iznajmite auto</a> za celo putovanje.</p>

<h2>Budzet</h2>
<ul>
<li><strong>Smestaj:</strong> €240-480</li>
<li><strong>Hrana:</strong> €175-315</li>
<li><strong>Auto:</strong> €210-350</li>
<li><strong>Izleti:</strong> €50-100</li>
</ul>`,
    },
  },

  {
    slug: '10-days', icon: 'Calendar', color: 'violet',
    title: {
      el: '10 Μέρες στη Χαλκιδική — Οι Απόλυτες Διακοπές',
      en: '10 Days in Halkidiki — The Ultimate Holiday',
      de: '10 Tage in Chalkidiki — Der Ultimative Urlaub',
      bg: '10 Дни в Халкидики — Най-Добрата Ваканция',
      ru: '10 Дней в Халкидики — Идеальный Отпуск',
      ro: '10 Zile in Halkidiki — Vacanta Suprema',
      sr: '10 Dana u Halkidikiju — Ultimativni Odmor',
    },
    description: {
      el: 'Πλήρες πρόγραμμα 10 ημερών: Κασσάνδρα, Σιθωνία, χωριά, νησιά, Θεσσαλονίκη, γαστρονομία',
      en: 'Complete 10-day itinerary: Kassandra, Sithonia, villages, islands, Thessaloniki, gastronomy',
      de: '10-Tage-Plan: Kassandra, Sithonia, Dorfer, Inseln, Thessaloniki, Gastronomie',
      bg: '10-дневен маршрут: Касандра, Ситония, села, острови, Солун, гастрономия',
      ru: '10-дневный маршрут: Кассандра, Ситония, деревни, острова, Салоники, гастрономия',
      ro: 'Itinerar de 10 zile: Kassandra, Sithonia, sate, insule, Salonic, gastronomie',
      sr: 'Plan za 10 dana: Kasandra, Sitonija, sela, ostrva, Solun, gastronomija',
    },
    metaTitle: {
      el: '10 Μέρες στη Χαλκιδική — Πρόγραμμα',
      en: '10 Days in Halkidiki — Itinerary',
      de: '10 Tage in Chalkidiki — Reiseplan',
      bg: '10 Дни в Халкидики — Маршрут',
      ru: '10 Дней в Халкидики — Маршрут',
      ro: '10 Zile in Halkidiki — Itinerar',
      sr: '10 Dana u Halkidikiju — Plan',
    },
    metaDesc: {
      el: 'Αναλυτικό πρόγραμμα 10 ημερών στη Χαλκιδική. Παραλίες, χωριά, νησιά, Θεσσαλονίκη, γαστρονομία. Μπάτζετ €900-1800.',
      en: 'Detailed 10-day itinerary for Halkidiki. Beaches, villages, islands, Thessaloniki day trip, gastronomy. Budget €900-1800.',
      de: 'Detaillierter 10-Tage-Reiseplan fur Chalkidiki. Strande, Dorfer, Inseln, Thessaloniki. Budget €900-1800.',
      bg: 'Подробен 10-дневен маршрут за Халкидики. Плажове, села, острови, Солун. Бюджет €900-1800.',
      ru: 'Подробный 10-дневный маршрут по Халкидики. Пляжи, деревни, острова, Салоники. Бюджет €900-1800.',
      ro: 'Itinerar detaliat de 10 zile in Halkidiki. Plaje, sate, insule, Salonic. Buget €900-1800.',
      sr: 'Detaljan plan za 10 dana u Halkidikiju. Plaze, sela, ostrva, Solun. Budzet €900-1800.',
    },
    content: {
      el: `<h2>Για Ποιον Είναι Αυτό το Πρόγραμμα</h2>
<p>10 ημέρες σημαίνει <strong>ολοκληρωμένες διακοπές</strong> — κάθε γωνιά της Χαλκιδικής συν εκδρομές. Ιδανικό για οικογένειες ή ζευγάρια που θέλουν να χαλαρώσουν. Μπάτζετ: <strong>€900-1800 ανά άτομο</strong>.</p>

<h2>Αναλυτικό Πρόγραμμα</h2>

<h3>Ημέρα 1-2 — Κασσάνδρα</h3>
<p><a href="/in/kallithea/beaches">Παραλίες Καλλιθέας</a>, Άφυτος, <a href="/in/hanioti/restaurants">εστιατόρια Χανιώτης</a>. Νυχτερινή ζωή στα beach bars. <a href="/guide/kassandra">Πλήρης οδηγός Κασσάνδρας</a>.</p>

<h3>Ημέρα 3-4 — Σιθωνία</h3>
<p>Βουρβουρού, Καβουρότρυπες, Σάρτη, Πόρτο Κουφό. <a href="/best/beaches-sithonia">Καλύτερες παραλίες Σιθωνίας</a>. <a href="/activities">Δραστηριότητες</a> στο νερό.</p>

<h3>Ημέρα 5 — Ορεινά Χωριά</h3>
<p>Αρναία, Παρθενώνας, Ταξιάρχης. <a href="/guide/villages">Οδηγός χωριών</a>. Τοπικά προϊόντα, παραδοσιακές ταβέρνες.</p>

<h3>Ημέρα 6 — Αμμουλιανή & Δρένια</h3>
<p><a href="/guide/ammouliani-island">Αμμουλιανή</a> και νησάκια Δρένια. Ανέγγιχτες παραλίες.</p>

<h3>Ημέρα 7 — Κρουαζιέρα Αγίου Όρους</h3>
<p>Ουρανούπολη, κρουαζιέρα <a href="/guide/boat-tours">γύρω από τον Άθω</a>. Μοναδική εμπειρία.</p>

<h3>Ημέρα 8 — Εκδρομή στη Θεσσαλονίκη</h3>
<p>Ημερήσια εκδρομή στη Θεσσαλονίκη — δείτε τον <a href="/guide/day-trips">οδηγό εκδρομών</a>. Λευκός Πύργος, Λαδάδικα, Παραλία.</p>

<h3>Ημέρα 9 — Γαστρονομία & Κρασί</h3>
<p>Ελαιοτριβεία, οινοποιεία, τοπικές γεύσεις — <a href="/guide/food-and-wine">οδηγός φαγητού & κρασιού</a>. Μέλι Χαλκιδικής, ελιές Ολυμπιάδας.</p>

<h3>Ημέρα 10 — Χαλάρωση & Αγορές</h3>
<p>Τελευταία μέρα: spa, <a href="/guide/shopping-and-souvenirs">αγορές & σουβενίρ</a>, αργό πρωινό. Τελευταίο μπάνιο και αναχώρηση. Βρείτε <a href="/listings">κατάλυμα</a> με πισίνα για την τελευταία νύχτα.</p>

<h2>Κόστος Ανάλυση</h2>
<ul>
<li><strong>Κατάλυμα:</strong> €40-80/βράδυ x 9 = €360-720</li>
<li><strong>Φαγητό:</strong> €30-50/μέρα x 10 = €300-500</li>
<li><strong>Αυτοκίνητο:</strong> €25-45/μέρα x 10 = €250-450</li>
<li><strong>Εκδρομές:</strong> €80-150</li>
</ul>

<h2>Συμβουλές</h2>
<ul>
<li>Εναλλάσσετε ενεργές μέρες με χαλαρές</li>
<li>Κλείστε <a href="/guide/car-rental">αυτοκίνητο</a> για 10 μέρες — καλύτερη τιμή</li>
<li>Σεπτέμβριος: ιδανικός μήνας για μεγάλο ταξίδι</li>
</ul>`,

      en: `<h2>Who Is This Itinerary For</h2>
<p>10 days means a <strong>comprehensive holiday</strong> — every corner of Halkidiki plus day trips. Ideal for families or couples wanting to fully unwind. Budget: <strong>€900-1800 per person</strong>.</p>

<h2>Day-by-Day Breakdown</h2>

<h3>Days 1-2 — Kassandra</h3>
<p><a href="/in/kallithea/beaches">Kallithea beaches</a>, Afytos, <a href="/in/hanioti/restaurants">Hanioti restaurants</a>. Nightlife at beach bars. <a href="/guide/kassandra">Full Kassandra guide</a>.</p>

<h3>Days 3-4 — Sithonia</h3>
<p>Vourvourou, Kavourotrypes, Sarti, Porto Koufo. <a href="/best/beaches-sithonia">Best Sithonia beaches</a>. Water <a href="/activities">activities</a>.</p>

<h3>Day 5 — Mountain Villages</h3>
<p>Arnea, Parthenonas, Taxiarchis. <a href="/guide/villages">Villages guide</a>. Local products, traditional tavernas.</p>

<h3>Day 6 — Ammouliani & Drenia</h3>
<p><a href="/guide/ammouliani-island">Ammouliani</a> and the Drenia islets. Pristine beaches.</p>

<h3>Day 7 — Mount Athos Cruise</h3>
<p>Ouranoupoli, cruise <a href="/guide/boat-tours">around Mount Athos</a>. A unique experience.</p>

<h3>Day 8 — Thessaloniki Day Trip</h3>
<p>Day trip to Thessaloniki — see the <a href="/guide/day-trips">day trips guide</a>. White Tower, Ladadika, waterfront.</p>

<h3>Day 9 — Food & Wine Tour</h3>
<p>Olive mills, wineries, local flavors — <a href="/guide/food-and-wine">food and wine guide</a>. Halkidiki honey, Olympiada olives.</p>

<h3>Day 10 — Relaxation & Shopping</h3>
<p>Final day: spa, <a href="/guide/shopping-and-souvenirs">shopping and souvenirs</a>, slow breakfast. Last swim and departure. Find <a href="/listings">accommodation</a> with a pool for the final night.</p>

<h2>Budget Breakdown</h2>
<ul>
<li><strong>Accommodation:</strong> €40-80/night x 9 = €360-720</li>
<li><strong>Food:</strong> €30-50/day x 10 = €300-500</li>
<li><strong>Car rental:</strong> €25-45/day x 10 = €250-450</li>
<li><strong>Excursions:</strong> €80-150</li>
</ul>

<h2>Tips</h2>
<ul>
<li>Alternate active days with relaxation days</li>
<li>Book a <a href="/guide/car-rental">car</a> for 10 days — better weekly rate</li>
<li>September: ideal month for a long trip</li>
</ul>`,

      de: `<h2>Fur Wen Ist Dieser Reiseplan</h2>
<p>10 Tage bedeuten <strong>umfassenden Urlaub</strong> — jede Ecke Chalkidikis plus Tagesausfluge. Budget: <strong>€900-1800 pro Person</strong>.</p>

<h2>Tag fur Tag</h2>

<h3>Tag 1-2 — Kassandra</h3>
<p><a href="/in/kallithea/beaches">Strande Kallithea</a>, Afytos, <a href="/in/hanioti/restaurants">Restaurants Hanioti</a>. <a href="/guide/kassandra">Kassandra-Fuhrer</a>.</p>

<h3>Tag 3-4 — Sithonia</h3>
<p>Vourvourou, Kavourotrypes, Sarti. <a href="/best/beaches-sithonia">Beste Strande</a>. <a href="/activities">Aktivitaten</a>.</p>

<h3>Tag 5 — Bergdorfer</h3>
<p>Arnea, Parthenonas. <a href="/guide/villages">Dorfer-Fuhrer</a>.</p>

<h3>Tag 6 — Ammouliani</h3>
<p><a href="/guide/ammouliani-island">Ammouliani</a> und Drenia-Inseln.</p>

<h3>Tag 7 — Athos-Kreuzfahrt</h3>
<p><a href="/guide/boat-tours">Bootstour</a> um den Berg Athos.</p>

<h3>Tag 8 — Thessaloniki</h3>
<p>Tagesausflug — <a href="/guide/day-trips">Ausflugsguide</a>.</p>

<h3>Tag 9 — Essen & Wein</h3>
<p>Olivenmuhlen, Weinereien — <a href="/guide/food-and-wine">Essen & Wein Guide</a>.</p>

<h3>Tag 10 — Entspannung</h3>
<p>Spa, <a href="/guide/shopping-and-souvenirs">Shopping & Souvenirs</a>. <a href="/listings">Unterkunft</a> mit Pool. <a href="/guide/car-rental">Mietwagen</a> fur 10 Tage.</p>

<h2>Budget</h2>
<ul>
<li><strong>Unterkunft:</strong> €360-720</li>
<li><strong>Essen:</strong> €300-500</li>
<li><strong>Mietwagen:</strong> €250-450</li>
<li><strong>Ausfluge:</strong> €80-150</li>
</ul>`,

      bg: `<h2>За Кого Е Този Маршрут</h2>
<p>10 дни означават <strong>пълноценна ваканция</strong>. Бюджет: <strong>€900-1800 на човек</strong>.</p>

<h2>Ден по Ден</h2>

<h3>Ден 1-2 — Касандра</h3>
<p><a href="/in/kallithea/beaches">Плажове Калитея</a>, Афитос, <a href="/in/hanioti/restaurants">ресторанти Ханиоти</a>. <a href="/guide/kassandra">Пътеводител Касандра</a>.</p>

<h3>Ден 3-4 — Ситония</h3>
<p>Вурвуру, Кавуротрипес, Сарти. <a href="/best/beaches-sithonia">Най-добри плажове</a>. <a href="/activities">Дейности</a>.</p>

<h3>Ден 5 — Планински села</h3>
<p>Арнеа, Партенонас. <a href="/guide/villages">Пътеводител за села</a>.</p>

<h3>Ден 6 — Амулиани</h3>
<p><a href="/guide/ammouliani-island">Амулиани</a> и Дрения.</p>

<h3>Ден 7 — Круиз Атон</h3>
<p><a href="/guide/boat-tours">Морска разходка</a> около Атон.</p>

<h3>Ден 8 — Солун</h3>
<p>Дневна екскурзия — <a href="/guide/day-trips">пътеводител за екскурзии</a>.</p>

<h3>Ден 9 — Храна & Вино</h3>
<p><a href="/guide/food-and-wine">Пътеводител за храна и вино</a>.</p>

<h3>Ден 10 — Почивка</h3>
<p>Спа, <a href="/guide/shopping-and-souvenirs">пазаруване</a>. <a href="/listings">Настаняване</a>. <a href="/guide/car-rental">Кола под наем</a>.</p>

<h2>Бюджет</h2>
<ul>
<li><strong>Настаняване:</strong> €360-720</li>
<li><strong>Храна:</strong> €300-500</li>
<li><strong>Кола:</strong> €250-450</li>
<li><strong>Екскурзии:</strong> €80-150</li>
</ul>`,

      ru: `<h2>Для Кого Этот Маршрут</h2>
<p>10 дней — это <strong>полноценный отпуск</strong>. Бюджет: <strong>€900-1800 на человека</strong>.</p>

<h2>По Дням</h2>

<h3>Дни 1-2 — Кассандра</h3>
<p><a href="/in/kallithea/beaches">Пляжи Каллифеи</a>, Афитос, <a href="/in/hanioti/restaurants">рестораны Ханиоти</a>. <a href="/guide/kassandra">Путеводитель по Кассандре</a>.</p>

<h3>Дни 3-4 — Ситония</h3>
<p>Вурвуру, Кавуротрипес, Сарти. <a href="/best/beaches-sithonia">Лучшие пляжи</a>. <a href="/activities">Развлечения</a>.</p>

<h3>День 5 — Горные Деревни</h3>
<p>Арнея, Партенонас. <a href="/guide/villages">Путеводитель по деревням</a>.</p>

<h3>День 6 — Аммулиани</h3>
<p><a href="/guide/ammouliani-island">Аммулиани</a> и Дрения.</p>

<h3>День 7 — Круиз к Афону</h3>
<p><a href="/guide/boat-tours">Морская прогулка</a> вокруг Афона.</p>

<h3>День 8 — Салоники</h3>
<p>Однодневная поездка — <a href="/guide/day-trips">путеводитель по экскурсиям</a>.</p>

<h3>День 9 — Еда & Вино</h3>
<p><a href="/guide/food-and-wine">Путеводитель по еде и вину</a>.</p>

<h3>День 10 — Отдых</h3>
<p>Спа, <a href="/guide/shopping-and-souvenirs">шопинг и сувениры</a>. <a href="/listings">Жилье</a>. <a href="/guide/car-rental">Аренда авто</a>.</p>

<h2>Бюджет</h2>
<ul>
<li><strong>Проживание:</strong> €360-720</li>
<li><strong>Еда:</strong> €300-500</li>
<li><strong>Авто:</strong> €250-450</li>
<li><strong>Экскурсии:</strong> €80-150</li>
</ul>`,

      ro: `<h2>Pentru Cine Este Acest Itinerar</h2>
<p>10 zile inseamna o <strong>vacanta completa</strong>. Buget: <strong>€900-1800 pe persoana</strong>.</p>

<h2>Zi cu Zi</h2>

<h3>Zilele 1-2 — Kassandra</h3>
<p><a href="/in/kallithea/beaches">Plaje Kallithea</a>, Afytos, <a href="/in/hanioti/restaurants">restaurante Hanioti</a>. <a href="/guide/kassandra">Ghid Kassandra</a>.</p>

<h3>Zilele 3-4 — Sithonia</h3>
<p>Vourvourou, Kavourotrypes, Sarti. <a href="/best/beaches-sithonia">Cele mai bune plaje</a>. <a href="/activities">Activitati</a>.</p>

<h3>Ziua 5 — Sate Montane</h3>
<p>Arnea, Parthenonas. <a href="/guide/villages">Ghidul satelor</a>.</p>

<h3>Ziua 6 — Ammouliani</h3>
<p><a href="/guide/ammouliani-island">Ammouliani</a> si Drenia.</p>

<h3>Ziua 7 — Croaziera Athos</h3>
<p><a href="/guide/boat-tours">Tur cu barca</a> in jurul Muntelui Athos.</p>

<h3>Ziua 8 — Salonic</h3>
<p>Excursie de o zi — <a href="/guide/day-trips">ghid excursii</a>.</p>

<h3>Ziua 9 — Mancare & Vin</h3>
<p><a href="/guide/food-and-wine">Ghid gastronomic</a>.</p>

<h3>Ziua 10 — Relaxare</h3>
<p>Spa, <a href="/guide/shopping-and-souvenirs">cumparaturi si suveniruri</a>. <a href="/listings">Cazare</a>. <a href="/guide/car-rental">Inchiriere masina</a>.</p>

<h2>Buget</h2>
<ul>
<li><strong>Cazare:</strong> €360-720</li>
<li><strong>Mancare:</strong> €300-500</li>
<li><strong>Masina:</strong> €250-450</li>
<li><strong>Excursii:</strong> €80-150</li>
</ul>`,

      sr: `<h2>Za Koga Je Ovaj Plan</h2>
<p>10 dana znaci <strong>kompletni odmor</strong>. Budzet: <strong>€900-1800 po osobi</strong>.</p>

<h2>Dan po Dan</h2>

<h3>Dan 1-2 — Kasandra</h3>
<p><a href="/in/kallithea/beaches">Plaze Kalitea</a>, Afitos, <a href="/in/hanioti/restaurants">restorani Hanioti</a>. <a href="/guide/kassandra">Vodic za Kasandru</a>.</p>

<h3>Dan 3-4 — Sitonija</h3>
<p>Vurvuru, Kavurotripes, Sarti. <a href="/best/beaches-sithonia">Najbolje plaze</a>. <a href="/activities">Aktivnosti</a>.</p>

<h3>Dan 5 — Planinska Sela</h3>
<p>Arnea, Partenonas. <a href="/guide/villages">Vodic za sela</a>.</p>

<h3>Dan 6 — Amuliani</h3>
<p><a href="/guide/ammouliani-island">Amuliani</a> i Drenija.</p>

<h3>Dan 7 — Krstarenje Atos</h3>
<p><a href="/guide/boat-tours">Brodska tura</a> oko Atosa.</p>

<h3>Dan 8 — Solun</h3>
<p>Dnevni izlet — <a href="/guide/day-trips">vodic za izlete</a>.</p>

<h3>Dan 9 — Hrana & Vino</h3>
<p><a href="/guide/food-and-wine">Gastronomski vodic</a>.</p>

<h3>Dan 10 — Odmor</h3>
<p>Spa, <a href="/guide/shopping-and-souvenirs">kupovina i suveniri</a>. <a href="/listings">Smestaj</a>. <a href="/guide/car-rental">Iznajmljivanje auta</a>.</p>

<h2>Budzet</h2>
<ul>
<li><strong>Smestaj:</strong> €360-720</li>
<li><strong>Hrana:</strong> €300-500</li>
<li><strong>Auto:</strong> €250-450</li>
<li><strong>Izleti:</strong> €80-150</li>
</ul>`,
    },
  },

  {
    slug: 'weekend', icon: 'Sparkles', color: 'rose',
    title: {
      el: 'Σαββατοκύριακο στη Χαλκιδική',
      en: 'Weekend Getaway to Halkidiki',
      de: 'Wochenendausflug nach Chalkidiki',
      bg: 'Уикенд в Халкидики',
      ru: 'Выходные в Халкидики',
      ro: 'Weekend in Halkidiki',
      sr: 'Vikend u Halkidikiju',
    },
    description: {
      el: 'Γρήγορη απόδραση Σαββατοκύριακου στη Χαλκιδική',
      en: 'Quick weekend escape to Halkidiki',
      de: 'Schneller Wochenendausflug nach Chalkidiki',
      bg: 'Бърз уикенд в Халкидики',
      ru: 'Быстрый уикенд в Халкидики',
      ro: 'Escapada rapida de weekend in Halkidiki',
      sr: 'Brzi vikend u Halkidikiju',
    },
    metaTitle: {
      el: 'Σαββατοκύριακο στη Χαλκιδική — Πρόγραμμα',
      en: 'Weekend Getaway to Halkidiki — Itinerary',
      de: 'Wochenendausflug Chalkidiki — Reiseplan',
      bg: 'Уикенд в Халкидики — Маршрут',
      ru: 'Выходные в Халкидики — Маршрут',
      ro: 'Weekend in Halkidiki — Itinerar',
      sr: 'Vikend u Halkidikiju — Plan',
    },
    metaDesc: {
      el: 'Γρήγορη απόδραση Σαββατοκύριακου στη Χαλκιδική. Παρασκευή-Κυριακή: Κασσάνδρα, Σιθωνία, Άφυτος. Μπάτζετ €150-300.',
      en: 'Quick weekend getaway to Halkidiki. Friday-Sunday: Kassandra, Sithonia, Afytos sunset. Budget €150-300 per person.',
      de: 'Schneller Wochenendausflug nach Chalkidiki. Freitag-Sonntag. Budget €150-300 pro Person.',
      bg: 'Бърз уикенд в Халкидики. Петък-неделя: Касандра, Ситония. Бюджет €150-300.',
      ru: 'Быстрый уикенд в Халкидики. Пятница-воскресенье: Кассандра, Ситония. Бюджет €150-300.',
      ro: 'Escapada de weekend in Halkidiki. Vineri-duminica: Kassandra, Sithonia. Buget €150-300.',
      sr: 'Brzi vikend u Halkidikiju. Petak-nedelja: Kasandra, Sitonija. Budzet €150-300.',
    },
    content: {
      el: `<h2>Για Ποιον Είναι Αυτό το Πρόγραμμα</h2>
<p>Ένα <strong>γρήγορο Σαββατοκύριακο</strong> στη Χαλκιδική — ιδανικό για κατοίκους Θεσσαλονίκης ή ταξιδιώτες με λίγο χρόνο. Μπάτζετ: <strong>€150-300 ανά άτομο</strong>.</p>

<h2>Αναλυτικό Πρόγραμμα</h2>

<h3>Παρασκευή Βράδυ — Άφιξη</h3>
<p>Φτάνετε στην Κασσάνδρα μετά τη δουλειά. Τακτοποιηθείτε στο <a href="/listings">κατάλυμα</a>, ελαφρύ δείπνο. Πώς να φτάσετε; Δείτε <a href="/guide/getting-here">πώς να έρθετε στη Χαλκιδική</a>.</p>

<h3>Σάββατο — Παραλία, Μεσημεριανό, Ηλιοβασίλεμα</h3>
<p>Πρωί: <a href="/beaches">παραλία</a> στην Καλλιθέα ή Χανιώτη. Μεσημεριανό σε ταβέρνα δίπλα στη θάλασσα. Απόγευμα: Άφυτος — ηλιοβασίλεμα από τα πιο <a href="/guide/sunset-spots">ωραία σημεία</a> της Χαλκιδικής. Βραδινό στον Άφυτο — <a href="/in/afytos/restaurants">εστιατόρια Αφύτου</a>.</p>

<h3>Κυριακή — Σιθωνία & Επιστροφή</h3>
<p>Πρωινό μπάνιο στη Σιθωνία — <a href="/best/beaches-sithonia">καλύτερες παραλίες</a>. Γρήγορο μεσημεριανό. Επιστροφή μετά το μεσημέρι. Αν θέλετε <a href="/activities">δραστηριότητες</a>, δοκιμάστε paddleboard πρωί-πρωί.</p>

<h2>Κόστος Ανάλυση</h2>
<ul>
<li><strong>Κατάλυμα:</strong> €40-70/βράδυ x 2 = €80-140</li>
<li><strong>Φαγητό:</strong> €20-35/μέρα x 2 = €40-70</li>
<li><strong>Βενζίνη:</strong> €20-30</li>
<li><strong>Δραστηριότητες:</strong> €10-30</li>
</ul>

<h2>Συμβουλές</h2>
<ul>
<li>Φύγετε νωρίς Παρασκευή για να αποφύγετε κίνηση</li>
<li>Κλείστε κατάλυμα από πριν — τα ΣΚ γεμίζουν γρήγορα</li>
<li>Για περισσότερη βοήθεια δείτε τις <a href="/faq/transport">ερωτήσεις μεταφοράς</a></li>
<li><a href="/guide/car-rental">Νοικιάστε αυτοκίνητο</a> αν δεν έχετε δικό σας</li>
</ul>`,

      en: `<h2>Who Is This Itinerary For</h2>
<p>A <strong>quick weekend escape</strong> to Halkidiki — ideal for Thessaloniki residents or travelers with limited time. Budget: <strong>€150-300 per person</strong>.</p>

<h2>Day-by-Day Breakdown</h2>

<h3>Friday Evening — Arrival</h3>
<p>Arrive in Kassandra after work. Settle into your <a href="/listings">accommodation</a>, light dinner. How to get there? See <a href="/guide/getting-here">getting to Halkidiki</a>.</p>

<h3>Saturday — Beach, Lunch, Sunset</h3>
<p>Morning: <a href="/beaches">beach</a> at Kallithea or Hanioti. Seafront taverna lunch. Afternoon: Afytos — sunset from one of the most beautiful <a href="/guide/sunset-spots">sunset spots</a> in Halkidiki. Dinner in Afytos — <a href="/in/afytos/restaurants">Afytos restaurants</a>.</p>

<h3>Sunday — Sithonia & Return</h3>
<p>Morning swim in Sithonia — <a href="/best/beaches-sithonia">best beaches</a>. Quick lunch. Head back after noon. If you want <a href="/activities">activities</a>, try paddleboarding early morning.</p>

<h2>Budget Breakdown</h2>
<ul>
<li><strong>Accommodation:</strong> €40-70/night x 2 = €80-140</li>
<li><strong>Food:</strong> €20-35/day x 2 = €40-70</li>
<li><strong>Gas:</strong> €20-30</li>
<li><strong>Activities:</strong> €10-30</li>
</ul>

<h2>Tips</h2>
<ul>
<li>Leave early Friday to avoid traffic</li>
<li>Book accommodation in advance — weekends fill up fast</li>
<li>For more help see the <a href="/faq/transport">transport FAQ</a></li>
<li><a href="/guide/car-rental">Rent a car</a> if you do not have one</li>
</ul>`,

      de: `<h2>Fur Wen Ist Dieser Reiseplan</h2>
<p>Ein <strong>schneller Wochenendausflug</strong> nach Chalkidiki — ideal fur Thessaloniki-Bewohner oder Reisende mit wenig Zeit. Budget: <strong>€150-300 pro Person</strong>.</p>

<h2>Tag fur Tag</h2>

<h3>Freitagabend — Ankunft</h3>
<p>Ankunft in Kassandra nach der Arbeit. Einchecken in die <a href="/listings">Unterkunft</a>, leichtes Abendessen. Anreise? Siehe <a href="/guide/getting-here">Anreise nach Chalkidiki</a>.</p>

<h3>Samstag — Strand, Mittagessen, Sonnenuntergang</h3>
<p>Morgens: <a href="/beaches">Strand</a> bei Kallithea oder Hanioti. Taverne am Meer. Nachmittags: Afytos — Sonnenuntergang an den schonsten <a href="/guide/sunset-spots">Aussichtspunkten</a>. Abendessen in <a href="/in/afytos/restaurants">Afytos Restaurants</a>.</p>

<h3>Sonntag — Sithonia & Ruckkehr</h3>
<p>Morgendliches Bad in Sithonia — <a href="/best/beaches-sithonia">beste Strande</a>. Schnelles Mittagessen. Ruckfahrt. Fur <a href="/activities">Aktivitaten</a> probieren Sie fruhmorgens Paddleboard.</p>

<h2>Budget</h2>
<ul>
<li><strong>Unterkunft:</strong> €80-140</li>
<li><strong>Essen:</strong> €40-70</li>
<li><strong>Benzin:</strong> €20-30</li>
<li><strong>Aktivitaten:</strong> €10-30</li>
</ul>

<h2>Tipps</h2>
<ul>
<li>Freitag fruh losfahren</li>
<li>Unterkunft im Voraus buchen</li>
<li>Siehe <a href="/faq/transport">Transport-FAQ</a></li>
<li><a href="/guide/car-rental">Mietwagen</a> wenn notig</li>
</ul>`,

      bg: `<h2>За Кого Е Този Маршрут</h2>
<p><strong>Бърз уикенд</strong> в Халкидики — идеален за жители на Солун или пътешественици с малко време. Бюджет: <strong>€150-300 на човек</strong>.</p>

<h2>Ден по Ден</h2>

<h3>Петък Вечер — Пристигане</h3>
<p>Пристигане в Касандра. Настаняване в <a href="/listings">квартира</a>. Как да стигнете? Вижте <a href="/guide/getting-here">как да стигнете до Халкидики</a>.</p>

<h3>Събота — Плаж, Обяд, Залез</h3>
<p>Сутрин: <a href="/beaches">плаж</a> в Калитея. Обяд в таверна. Следобед: Афитос — залез от <a href="/guide/sunset-spots">най-красивите места</a>. Вечеря в <a href="/in/afytos/restaurants">Афитос</a>.</p>

<h3>Неделя — Ситония & Връщане</h3>
<p>Сутрешно къпане в Ситония — <a href="/best/beaches-sithonia">най-добрите плажове</a>. Бърз обяд. За <a href="/activities">дейности</a> — падълборд.</p>

<h2>Бюджет</h2>
<ul>
<li><strong>Настаняване:</strong> €80-140</li>
<li><strong>Храна:</strong> €40-70</li>
<li><strong>Бензин:</strong> €20-30</li>
<li><strong>Дейности:</strong> €10-30</li>
</ul>

<h2>Съвети</h2>
<ul>
<li>Тръгнете рано в петък</li>
<li>Резервирайте предварително</li>
<li>Вижте <a href="/faq/transport">ЧЗВ транспорт</a></li>
<li><a href="/guide/car-rental">Кола под наем</a> ако нямате</li>
</ul>`,

      ru: `<h2>Для Кого Этот Маршрут</h2>
<p><strong>Быстрый уикенд</strong> в Халкидики — идеален для жителей Салоник или путешественников с ограниченным временем. Бюджет: <strong>€150-300 на человека</strong>.</p>

<h2>По Дням</h2>

<h3>Пятница Вечер — Прибытие</h3>
<p>Приезд в Кассандру. Заселение в <a href="/listings">жилье</a>. Как добраться? Смотрите <a href="/guide/getting-here">как доехать до Халкидиков</a>.</p>

<h3>Суббота — Пляж, Обед, Закат</h3>
<p>Утро: <a href="/beaches">пляж</a> в Каллифее. Обед в таверне. Вечер: Афитос — закат с лучших <a href="/guide/sunset-spots">смотровых площадок</a>. Ужин в <a href="/in/afytos/restaurants">ресторанах Афитоса</a>.</p>

<h3>Воскресенье — Ситония & Возвращение</h3>
<p>Утреннее купание в Ситонии — <a href="/best/beaches-sithonia">лучшие пляжи</a>. Быстрый обед. Для <a href="/activities">развлечений</a> — сапборд.</p>

<h2>Бюджет</h2>
<ul>
<li><strong>Жилье:</strong> €80-140</li>
<li><strong>Еда:</strong> €40-70</li>
<li><strong>Бензин:</strong> €20-30</li>
<li><strong>Развлечения:</strong> €10-30</li>
</ul>

<h2>Советы</h2>
<ul>
<li>Выезжайте в пятницу пораньше</li>
<li>Бронируйте заранее</li>
<li>Смотрите <a href="/faq/transport">FAQ по транспорту</a></li>
<li><a href="/guide/car-rental">Аренда авто</a> если нужно</li>
</ul>`,

      ro: `<h2>Pentru Cine Este Acest Itinerar</h2>
<p>O <strong>escapada rapida de weekend</strong> in Halkidiki — ideala pentru locuitorii din Salonic sau calatori cu timp limitat. Buget: <strong>€150-300 pe persoana</strong>.</p>

<h2>Zi cu Zi</h2>

<h3>Vineri Seara — Sosire</h3>
<p>Sosire in Kassandra. Check-in la <a href="/listings">cazare</a>. Cum ajungeti? Vezi <a href="/guide/getting-here">cum sa ajungi in Halkidiki</a>.</p>

<h3>Sambata — Plaja, Pranz, Apus</h3>
<p>Dimineata: <a href="/beaches">plaja</a> la Kallithea. Pranz la taverna. Dupa-amiaza: Afytos — apus de la cele mai frumoase <a href="/guide/sunset-spots">locuri</a>. Cina la <a href="/in/afytos/restaurants">restaurante Afytos</a>.</p>

<h3>Duminica — Sithonia & Intoarcere</h3>
<p>Baie de dimineata in Sithonia — <a href="/best/beaches-sithonia">cele mai bune plaje</a>. Pranz rapid. Pentru <a href="/activities">activitati</a> — paddleboard.</p>

<h2>Buget</h2>
<ul>
<li><strong>Cazare:</strong> €80-140</li>
<li><strong>Mancare:</strong> €40-70</li>
<li><strong>Benzina:</strong> €20-30</li>
<li><strong>Activitati:</strong> €10-30</li>
</ul>

<h2>Sfaturi</h2>
<ul>
<li>Plecati devreme vineri</li>
<li>Rezervati din timp</li>
<li>Vezi <a href="/faq/transport">FAQ transport</a></li>
<li><a href="/guide/car-rental">Inchiriati masina</a> daca e nevoie</li>
</ul>`,

      sr: `<h2>Za Koga Je Ovaj Plan</h2>
<p><strong>Brzi vikend</strong> u Halkidikiju — idealan za stanovnike Soluna ili putnike sa malo vremena. Budzet: <strong>€150-300 po osobi</strong>.</p>

<h2>Dan po Dan</h2>

<h3>Petak Vece — Dolazak</h3>
<p>Dolazak u Kasandru. Smestaj u <a href="/listings">apartman</a>. Kako stici? Vidite <a href="/guide/getting-here">kako doci do Halkidikija</a>.</p>

<h3>Subota — Plaza, Rucak, Zalazak</h3>
<p>Jutro: <a href="/beaches">plaza</a> u Kalitei. Rucak u taverni. Popodne: Afitos — zalazak sa najlepsih <a href="/guide/sunset-spots">mesta</a>. Vecera u <a href="/in/afytos/restaurants">restoranima Afitosa</a>.</p>

<h3>Nedelja — Sitonija & Povratak</h3>
<p>Jutarnje kupanje u Sitoniji — <a href="/best/beaches-sithonia">najbolje plaze</a>. Brzi rucak. Za <a href="/activities">aktivnosti</a> — paddleboard.</p>

<h2>Budzet</h2>
<ul>
<li><strong>Smestaj:</strong> €80-140</li>
<li><strong>Hrana:</strong> €40-70</li>
<li><strong>Benzin:</strong> €20-30</li>
<li><strong>Aktivnosti:</strong> €10-30</li>
</ul>

<h2>Saveti</h2>
<ul>
<li>Krenite rano u petak</li>
<li>Rezervisite unapred</li>
<li>Vidite <a href="/faq/transport">FAQ o prevozu</a></li>
<li><a href="/guide/car-rental">Iznajmite auto</a> ako je potrebno</li>
</ul>`,
    },
  },
];

export function getItinerary(slug: string) {
  return ITINERARIES.find(i => i.slug === slug);
}
