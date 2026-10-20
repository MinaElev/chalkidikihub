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
      ro: '3 zile în Halkidiki — weekendul perfect',
      sr: '3 Dana u Halkidikiju — Savršen Vikend',
    },
    description: {
      el: 'Πρόγραμμα 3 ημερών στη Χαλκιδική: Κασσάνδρα, Σιθωνία, παραλίες και φαγητό',
      en: 'A 3-day itinerary for Halkidiki: Kassandra, Sithonia, beaches and dining',
      de: 'Ein 3-Tage-Reiseplan für Chalkidiki: Kassandra, Sithonia, Strände und Essen',
      bg: 'Маршрут за 3 дни в Халкидики: Касандра, Ситония, плажове и храна',
      ru: 'Маршрут на 3 дня в Халкидики: Кассандра, Ситония, пляжи и еда',
      ro: 'Itinerar de 3 zile în Halkidiki: Kassandra, Sithonia, plaje și restaurante',
      sr: 'Plan za 3 dana na Halkidikiju: Kasandra, Sitonija, plaže i hrana',
    },
    metaTitle: {
      el: '3 Μέρες στη Χαλκιδική — Πρόγραμμα',
      en: '3 Days in Halkidiki — Itinerary',
      de: '3 Tage in Chalkidiki — Reiseplan',
      bg: '3 Дни в Халкидики — Маршрут',
      ru: '3 Дня в Халкидики — Маршрут',
      ro: '3 zile în Halkidiki — itinerar',
      sr: '3 dana na Halkidikiju — plan',
    },
    metaDesc: {
      el: 'Πώς να περάσετε 3 τέλειες μέρες στη Χαλκιδική. Παραλίες Κασσάνδρας, Σιθωνίας, εστιατόρια, αξιοθέατα. Μπάτζετ €200-400.',
      en: 'How to spend 3 perfect days in Halkidiki. Kassandra and Sithonia beaches, restaurants, sights. Budget €200-400 per person.',
      de: 'So verbringen Sie 3 perfekte Tage in Chalkidiki. Strände, Restaurants, Sehenswürdigkeiten. Budget €200-400 pro Person.',
      bg: 'Как да прекарате 3 перфектни дни в Халкидики. Плажове, ресторанти, забележителности. Бюджет €200-400.',
      ru: 'Как провести 3 идеальных дня в Халкидики. Пляжи Кассандры и Ситонии, рестораны, достопримечательности. Бюджет €200-400.',
      ro: 'Cum să petreceți 3 zile perfecte în Halkidiki: plaje în Kassandra și Sithonia, restaurante, obiective. Buget €200-400 de persoană.',
      sr: 'Kako provesti 3 savršena dana na Halkidikiju: plaže Kasandre i Sitonije, restorani, znamenitosti. Budžet €200-400 po osobi.',
    },
    content: {
      el: `<h2>Για Ποιον Είναι Αυτό το Πρόγραμμα</h2>
<p>Αυτό το πρόγραμμα 3 ημερών είναι ιδανικό για <strong>σύντομες αποδράσεις</strong> — ζευγάρια, παρέες ή οικογένειες που θέλουν μια γρήγορη γεύση Χαλκιδικής. Εκτιμώμενο κόστος: <strong>€200-400 ανά άτομο</strong> (κατάλυμα, φαγητό, μετακινήσεις).</p>

<h2>Αναλυτικό Πρόγραμμα</h2>

<h3>Ημέρα 1 — Άφιξη & Κασσάνδρα</h3>
<p>Φτάνετε Θεσσαλονίκη και οδηγείτε προς Κασσάνδρα (1,5 ώρα). Σταματήστε στην <strong>Καλλιθέα</strong> για το πρώτο μπάνιο — κρυστάλλινα νερά σε οργανωμένη <a href="/beaches">παραλία</a>. Το απόγευμα εξερευνήστε τον Άφυτο, ένα πανέμορφο πετρόχτιστο χωριό με θέα. Βραδινό σε παραδοσιακή ταβέρνα — δείτε τα καλύτερα <a href="/places/afytos/restaurants">εστιατόρια στον Άφυτο</a>. Για <a href="/listings">κατάλυμα</a>, Κασσάνδρα ή Καλλιθέα είναι ιδανική βάση.</p>

<h3>Ημέρα 2 — Σιθωνία & Παραλίες</h3>
<p>Ξεκινήστε νωρίς για Σιθωνία. Πρώτη στάση: <strong>Καβουρότρυπες</strong> — εξωτική παραλία με λευκά βράχια. Μετά κατευθυνθείτε στο <strong>Καρύδι</strong>, μια από τις <a href="/best/beaches-sithonia">καλύτερες παραλίες Σιθωνίας</a>. Μεσημεριανό στο Πόρτο Κουφό — φρέσκα θαλασσινά δίπλα στο λιμάνι. Αν θέλετε περισσότερες <a href="/activities">δραστηριότητες</a>, δοκιμάστε SUP ή kayak.</p>

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
<p>Arrive in Thessaloniki and drive to Kassandra (1.5 hours). Stop at <strong>Kallithea</strong> for your first swim — crystal-clear waters at an organized <a href="/beaches">beach</a>. In the afternoon, explore Afytos, a charming stone-built village with panoramic views. Enjoy dinner at a traditional taverna — check the best <a href="/places/afytos/restaurants">restaurants in Afytos</a>. For <a href="/listings">accommodation</a>, Kassandra or Kallithea makes an ideal base.</p>

<h3>Day 2 — Sithonia Beach Hopping</h3>
<p>Start early for Sithonia. First stop: <strong>Kavourotrypes</strong> — an exotic beach with white cliffs. Then head to <strong>Karidi</strong>, one of the <a href="/best/beaches-sithonia">best Sithonia beaches</a>. Lunch at Porto Koufo — fresh seafood by the harbour. If you want more <a href="/activities">activities</a>, try SUP or kayaking.</p>

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

      de: `<h2>Für wen ist dieser Reiseplan?</h2>
<p>Dieser 3-Tage-Plan ist ideal für <strong>Kurztrips</strong> — Paare, Freundesgruppen oder Familien, die Chalkidiki kennenlernen möchten. Geschätztes Budget: <strong>€200-400 pro Person</strong> (Unterkunft, Essen, Transport).</p>
<h2>Tag für Tag</h2>
<h3>Tag 1 — Ankunft & Kassandra</h3>
<p>Ankunft in Thessaloniki und Fahrt nach Kassandra (etwa 1,5 Stunden). Erstes Bad in <strong>Kallithea</strong> — klares Wasser an einem organisierten <a href="/beaches">Strand</a>. Nachmittags Afytos erkunden, ein Steindorf mit weitem Blick über das Meer. Abendessen in einer traditionellen Taverne — siehe die <a href="/places/afytos/restaurants">Restaurants in Afytos</a>. Als <a href="/listings">Unterkunft</a> eignet sich Kassandra, etwa Kallithea, gut als Basis.</p>
<h3>Tag 2 — Strände von Sithonia</h3>
<p>Früh nach Sithonia aufbrechen. Erster Halt: <strong>Kavourotrypes</strong> — Buchten mit weißen Felsen und türkisem Wasser. Danach <strong>Karidi</strong>, einer der <a href="/best/beaches-sithonia">schönsten Strände Sithonias</a>. Mittagessen in Porto Koufo — frischer Fisch am Hafen. Wer mehr <a href="/activities">Aktivitäten</a> möchte, probiert SUP oder Kajak.</p>
<h3>Tag 3 — Baden & Abreise</h3>
<p>Ein letztes Bad am nächstgelegenen Strand. Alternative: eine Bootsfahrt rund um den Athos ab Ouranoupoli — siehe unseren <a href="/guide/boat-tours">Führer zu Bootstouren</a>. Wenn Sie zwischen den beiden Halbinseln schwanken, lesen Sie <a href="/guide/kassandra-vs-sithonia">Kassandra oder Sithonia</a>. Für unterwegs empfehlen wir einen <a href="/guide/car-rental">Mietwagen</a>.</p>
<h2>Budget</h2>
<ul>
<li><strong>Unterkunft:</strong> €40-80/Nacht (Studio oder Zimmer)</li>
<li><strong>Essen:</strong> €20-40/Tag</li>
<li><strong>Mietwagen:</strong> €30-50/Tag</li>
<li><strong>Aktivitäten:</strong> €20-50 insgesamt</li>
</ul>
<h2>Tipps</h2>
<ul>
<li>Beste Monate: Juni und September (weniger Andrang, niedrigere Preise)</li>
<li>Sonnencreme, Hut und Badeschuhe einpacken</li>
<li>Für Juli-August früh buchen</li>
<li>Vorher die <a href="/faq/transport">FAQ zum Transport</a> lesen</li>
</ul>`,

      bg: `<h2>За Кого Е Този Маршрут</h2>
<p>Този 3-дневен маршрут е идеален за <strong>кратки почивки</strong> — двойки, групи приятели или семейства. Прогнозен бюджет: <strong>€200-400 на човек</strong>.</p>

<h2>Ден по Ден</h2>

<h3>Ден 1 — Пристигане & Касандра</h3>
<p>Пристигате в Солун и карате към Касандра (1,5 часа). Спирка в <strong>Калитея</strong> за първото къпане — кристално чиста вода на организиран <a href="/beaches">плаж</a>. Следобед разгледайте Афитос — красиво каменно село с панорамна гледка. Вечеря в традиционна таверна — вижте най-добрите <a href="/places/afytos/restaurants">ресторанти в Афитос</a>. За <a href="/listings">настаняване</a> Касандра е идеална база.</p>

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
<p>Прибытие в Салоники, поездка в Кассандру (1,5 часа). Остановка в <strong>Каллифее</strong> — первое купание на организованном <a href="/beaches">пляже</a>. Днем прогулка по Афитосу — живописная деревня с панорамным видом. Ужин в таверне — лучшие <a href="/places/afytos/restaurants">рестораны Афитоса</a>. Для <a href="/listings">проживания</a> Кассандра — идеальная база.</p>

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

      ro: `<h2>Pentru cine este acest itinerar</h2>
<p>Acest itinerar de 3 zile este ideal pentru <strong>escapade scurte</strong> — cupluri, grupuri de prieteni sau familii care vor să cunoască Halkidiki. Buget estimat: <strong>€200-400 de persoană</strong> (cazare, mâncare, transport).</p>
<h2>Zi cu zi</h2>
<h3>Ziua 1 — Sosire și Kassandra</h3>
<p>Ajungeți în Salonic și conduceți spre Kassandra (circa 1,5 ore). Prima baie la <strong>Kallithea</strong> — apă limpede pe o <a href="/beaches">plajă</a> amenajată. După-amiaza explorați Afytos, un sat de piatră cu priveliști largi spre mare. Cină la o tavernă tradițională — vedeți <a href="/places/afytos/restaurants">restaurantele din Afytos</a>. Pentru <a href="/listings">cazare</a>, Kassandra (de exemplu Kallithea) este o bază ideală.</p>
<h3>Ziua 2 — Plajele din Sithonia</h3>
<p>Plecați devreme spre Sithonia. Prima oprire: <strong>Kavourotrypes</strong> — golfulețe cu stânci albe și apă turcoaz. Apoi <strong>Karidi</strong>, una dintre <a href="/best/beaches-sithonia">cele mai frumoase plaje din Sithonia</a>. Prânz la Porto Koufo — pește proaspăt lângă port. Pentru mai multe <a href="/activities">activități</a>, încercați SUP sau caiac.</p>
<h3>Ziua 3 — Baie și plecare</h3>
<p>O ultimă baie la cea mai apropiată plajă. Alternativ: o croazieră în jurul Muntelui Athos din Ouranoupoli — vedeți <a href="/guide/boat-tours">ghidul plimbărilor cu barca</a>. Dacă ezitați între cele două peninsule, citiți <a href="/guide/kassandra-vs-sithonia">Kassandra sau Sithonia</a>. Pentru deplasări vă recomandăm să <a href="/guide/car-rental">închiriați o mașină</a>.</p>
<h2>Buget</h2>
<ul>
<li><strong>Cazare:</strong> €40-80/noapte (garsonieră sau cameră)</li>
<li><strong>Mâncare:</strong> €20-40/zi</li>
<li><strong>Mașină închiriată:</strong> €30-50/zi</li>
<li><strong>Activități:</strong> €20-50 în total</li>
</ul>
<h2>Sfaturi</h2>
<ul>
<li>Cele mai bune luni: iunie și septembrie (mai puțină aglomerație, prețuri mai mici)</li>
<li>Luați cremă de soare, pălărie și încălțări de apă</li>
<li>Pentru iulie-august rezervați cazarea din timp</li>
<li>Citiți <a href="/faq/transport">întrebările frecvente despre transport</a> înainte de plecare</li>
</ul>`,

      sr: `<h2>Za koga je ovaj plan</h2>
<p>Ovaj plan za 3 dana idealan je za <strong>kratke izlete</strong> — parove, društvo ili porodice koje žele da upoznaju Halkidiki. Okvirni budžet: <strong>€200-400 po osobi</strong> (smeštaj, hrana, prevoz).</p>
<h2>Dan po dan</h2>
<h3>Dan 1 — Dolazak i Kasandra</h3>
<p>Stignite u Solun i vozite do Kasandre (oko 1,5 sat). Prvo kupanje u <strong>Kalitei</strong> — bistra voda na uređenoj <a href="/beaches">plaži</a>. Popodne obiđite Afitos, kameno selo sa širokim pogledom na more. Večera u tradicionalnoj taverni — pogledajte <a href="/places/afytos/restaurants">restorane u Afitosu</a>. Za <a href="/listings">smeštaj</a>, Kasandra (npr. Kalitea) je idealna baza.</p>
<h3>Dan 2 — Plaže Sitonije</h3>
<p>Krenite rano ka Sitoniji. Prva stanica: <strong>Kavurotripes</strong> — uvale s belim stenama i tirkiznom vodom. Zatim <strong>Karidi</strong>, jedna od <a href="/best/beaches-sithonia">najlepših plaža Sitonije</a>. Ručak u Porto Kufu — sveža riba pored luke. Za više <a href="/activities">aktivnosti</a> probajte SUP ili kajak.</p>
<h3>Dan 3 — Kupanje i polazak</h3>
<p>Poslednje kupanje na najbližoj plaži. Alternativa: krstarenje oko Svete Gore iz Uranupolisa — pogledajte <a href="/guide/boat-tours">vodič za izlete brodom</a>. Ako se dvoumite između dva poluostrva, pročitajte <a href="/guide/kassandra-vs-sithonia">Kasandra ili Sitonija</a>. Za obilazak preporučujemo da <a href="/guide/car-rental">iznajmite automobil</a>.</p>
<h2>Budžet</h2>
<ul>
<li><strong>Smeštaj:</strong> €40-80 po noći (studio ili soba)</li>
<li><strong>Hrana:</strong> €20-40 dnevno</li>
<li><strong>Rent-a-car:</strong> €30-50 dnevno</li>
<li><strong>Aktivnosti:</strong> €20-50 ukupno</li>
</ul>
<h2>Saveti</h2>
<ul>
<li>Najbolji meseci: jun i septembar (manje gužve, niže cene)</li>
<li>Ponesite kremu za sunčanje, šešir i papuče za vodu</li>
<li>Za jul-avgust rezervišite smeštaj rano</li>
<li>Pre puta pogledajte <a href="/faq/transport">česta pitanja o prevozu</a></li>
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
      ro: '5 zile în Halkidiki — experiența completă',
      sr: '5 Dana u Halkidikiju — Kompletno Iskustvo',
    },
    description: {
      el: 'Πρόγραμμα 5 ημερών: Κασσάνδρα, Σιθωνία, Αμμουλιανή',
      en: 'A 5-day itinerary: Kassandra, Sithonia, Ammouliani island',
      de: '5-Tage-Reiseplan: Kassandra, Sithonia, Ammouliani',
      bg: 'Маршрут за 5 дни: Касандра, Ситония, Амулиани',
      ru: 'Маршрут на 5 дней: Кассандра, Ситония, Аммулиани',
      ro: 'Itinerar de 5 zile: Kassandra, Sithonia și insula Ammouliani',
      sr: 'Plan za 5 dana: Kasandra, Sitonija i ostrvo Amuljani',
    },
    metaTitle: {
      el: '5 Μέρες στη Χαλκιδική — Πρόγραμμα',
      en: '5 Days in Halkidiki — Itinerary',
      de: '5 Tage in Chalkidiki — Reiseplan',
      bg: '5 Дни в Халкидики — Маршрут',
      ru: '5 Дней в Халкидики — Маршрут',
      ro: '5 zile în Halkidiki — itinerar',
      sr: '5 dana na Halkidikiju — plan',
    },
    metaDesc: {
      el: 'Πλήρες πρόγραμμα 5 ημερών στη Χαλκιδική. Κασσάνδρα, Σιθωνία, Αμμουλιανή. Μπάτζετ €400-700.',
      en: 'Complete 5-day itinerary for Halkidiki. Kassandra, Sithonia, Ammouliani island. Budget €400-700 per person.',
      de: 'Kompletter 5-Tage-Reiseplan für Chalkidiki: Kassandra, Sithonia, Ammouliani. Budget €400-700 pro Person.',
      bg: 'Пълен маршрут за 5 дни в Халкидики. Касандра, Ситония, Амулиани. Бюджет €400-700.',
      ru: 'Полный маршрут на 5 дней в Халкидики. Кассандра, Ситония, Аммулиани. Бюджет €400-700.',
      ro: 'Itinerar complet de 5 zile în Halkidiki: Kassandra, Sithonia, Ammouliani. Buget €400-700 de persoană.',
      sr: 'Kompletan plan za 5 dana na Halkidikiju: Kasandra, Sitonija, Amuljani. Budžet €400-700 po osobi.',
    },
    content: {
      el: `<h2>Για Ποιον Είναι Αυτό το Πρόγραμμα</h2>
<p>Με 5 μέρες μπορείτε να απολαύσετε <strong>και τις δύο μεγάλες χερσονήσους</strong> συν μια ημερήσια εκδρομή στο νησί. Ιδανικό για ζευγάρια και οικογένειες. Μπάτζετ: <strong>€400-700 ανά άτομο</strong>.</p>

<h2>Αναλυτικό Πρόγραμμα</h2>

<h3>Ημέρα 1-2 — Κασσάνδρα</h3>
<p>Εξερευνήστε την <a href="/guide/kassandra">Κασσάνδρα</a> σε βάθος. Ημέρα 1: Άφυτος, Καλλιθέα, ηλιοβασίλεμα. Ημέρα 2: <a href="/beaches">παραλίες</a> Χανιώτης, νυχτερινή ζωή στα beach bars. Για <a href="/places/afytos/restaurants">φαγητό στον Άφυτο</a> δοκιμάστε παραδοσιακή κουζίνα.</p>

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
<p>Explore <a href="/guide/kassandra">Kassandra</a> in depth. Day 1: Afytos, Kallithea, sunset views. Day 2: <a href="/beaches">beaches</a> at Hanioti, nightlife at beach bars. For <a href="/places/afytos/restaurants">dining in Afytos</a>, try the traditional cuisine.</p>

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

      de: `<h2>Für wen ist dieser Reiseplan?</h2>
<p>In 5 Tagen erleben Sie <strong>beide großen Halbinseln</strong> und einen Inselausflug. Ideal für Paare und Familien. Budget: <strong>€400-700 pro Person</strong>.</p>
<h2>Tag für Tag</h2>
<h3>Tag 1-2 — Kassandra</h3>
<p>Entdecken Sie <a href="/guide/kassandra">Kassandra</a> ausführlich. Tag 1: Afytos und Kallithea. Tag 2: <a href="/beaches">Strände</a> bei Hanioti, abends Strandbars. Zum <a href="/places/afytos/restaurants">Essen in Afytos</a> die traditionelle Küche probieren.</p>
<h3>Tag 3-4 — Sithonia</h3>
<p>Weiter nach <a href="/guide/sithonia">Sithonia</a>. Tag 3: Vourvourou mit seinen Inselchen, Kavourotrypes. Tag 4: Sarti, Strand und Fischtaverne. Siehe die <a href="/best/beaches-sithonia">schönsten Strände Sithonias</a> und die <a href="/activities">Wassersportangebote</a>.</p>
<h3>Tag 5 — Insel Ammouliani</h3>
<p>Tagesausflug nach <a href="/guide/ammouliani-island">Ammouliani</a> — die einzige bewohnte Insel Chalkidikis. Fähre ab Tripiti. Strände Alykes und Megali Ammos. Abends ein letztes Abendessen vor der Abreise. Mit einem <a href="/guide/car-rental">Mietwagen</a> sind Sie am flexibelsten.</p>
<h2>Budget</h2>
<ul>
<li><strong>Unterkunft:</strong> €40-80/Nacht x 4 = €160-320</li>
<li><strong>Essen:</strong> €25-45/Tag x 5 = €125-225</li>
<li><strong>Mietwagen:</strong> €30-50/Tag x 5 = €150-250</li>
<li><strong>Fähre + Aktivitäten:</strong> €30-60</li>
</ul>
<h2>Tipps</h2>
<ul>
<li>2 Nächte auf Kassandra, 2 Nächte auf Sithonia</li>
<li><a href="/listings">Unterkunft</a> früh buchen</li>
<li>Schnorchelmaske mitnehmen</li>
</ul>`,

      bg: `<h2>За Кого Е Този Маршрут</h2>
<p>С 5 дни можете да се насладите на <strong>двата полуострова</strong> плюс островна екскурзия. Бюджет: <strong>€400-700 на човек</strong>.</p>

<h2>Ден по Ден</h2>

<h3>Ден 1-2 — Касандра</h3>
<p>Разгледайте <a href="/guide/kassandra">Касандра</a> подробно. Ден 1: Афитос, Калитея. Ден 2: <a href="/beaches">плажове</a> при Ханиоти, нощен живот. За <a href="/places/afytos/restaurants">храна в Афитос</a> опитайте традиционната кухня.</p>

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
<p>Изучите <a href="/guide/kassandra">Кассандру</a> подробно. День 1: Афитос, Каллифея. День 2: <a href="/beaches">пляжи</a> Ханиоти, ночная жизнь. Для <a href="/places/afytos/restaurants">ужина в Афитосе</a> попробуйте традиционную кухню.</p>

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

      ro: `<h2>Pentru cine este acest itinerar</h2>
<p>În 5 zile puteți explora <strong>ambele peninsule mari</strong> și o insulă. Perfect pentru cupluri și familii. Buget: <strong>€400-700 de persoană</strong>.</p>
<h2>Zi cu zi</h2>
<h3>Zilele 1-2 — Kassandra</h3>
<p>Explorați <a href="/guide/kassandra">Kassandra</a> în detaliu. Ziua 1: Afytos și Kallithea. Ziua 2: <a href="/beaches">plaje</a> la Hanioti, seara beach baruri. Pentru <a href="/places/afytos/restaurants">masa în Afytos</a>, încercați bucătăria tradițională.</p>
<h3>Zilele 3-4 — Sithonia</h3>
<p>Mutați-vă în <a href="/guide/sithonia">Sithonia</a>. Ziua 3: Vourvourou și insulițele sale, Kavourotrypes. Ziua 4: Sarti, plaja și o tavernă de pește. Vedeți <a href="/best/beaches-sithonia">cele mai frumoase plaje din Sithonia</a> și <a href="/activities">activitățile nautice</a>.</p>
<h3>Ziua 5 — Insula Ammouliani</h3>
<p>Excursie de o zi la <a href="/guide/ammouliani-island">Ammouliani</a> — singura insulă locuită din Halkidiki. Feribot din Tripiti. Plajele Alykes și Megali Ammos. Seara, ultima cină înainte de plecare. Cu o <a href="/guide/car-rental">mașină închiriată</a> sunteți cel mai flexibil.</p>
<h2>Buget</h2>
<ul>
<li><strong>Cazare:</strong> €40-80/noapte x 4 = €160-320</li>
<li><strong>Mâncare:</strong> €25-45/zi x 5 = €125-225</li>
<li><strong>Mașină închiriată:</strong> €30-50/zi x 5 = €150-250</li>
<li><strong>Feribot + activități:</strong> €30-60</li>
</ul>
<h2>Sfaturi</h2>
<ul>
<li>2 nopți în Kassandra, 2 nopți în Sithonia</li>
<li>Rezervați <a href="/listings">cazarea</a> din timp</li>
<li>Luați o mască de snorkeling</li>
</ul>`,

      sr: `<h2>Za koga je ovaj plan</h2>
<p>Za 5 dana stižete da upoznate <strong>oba velika poluostrva</strong> i jedno ostrvo. Savršeno za parove i porodice. Budžet: <strong>€400-700 po osobi</strong>.</p>
<h2>Dan po dan</h2>
<h3>Dani 1-2 — Kasandra</h3>
<p>Detaljno istražite <a href="/guide/kassandra">Kasandru</a>. Dan 1: Afitos i Kalitea. Dan 2: <a href="/beaches">plaže</a> u Haniotiju, uveče barovi na plaži. Za <a href="/places/afytos/restaurants">obrok u Afitosu</a> probajte tradicionalnu kuhinju.</p>
<h3>Dani 3-4 — Sitonija</h3>
<p>Preselite se na <a href="/guide/sithonia">Sitoniju</a>. Dan 3: Vurvuru i njegova ostrvca, Kavurotripes. Dan 4: Sarti, plaža i riblja taverna. Pogledajte <a href="/best/beaches-sithonia">najlepše plaže Sitonije</a> i <a href="/activities">vodene aktivnosti</a>.</p>
<h3>Dan 5 — Ostrvo Amuljani</h3>
<p>Jednodnevni izlet na <a href="/guide/ammouliani-island">Amuljani</a> — jedino naseljeno ostrvo Halkidikija. Trajekt iz Tripitija. Plaže Alikes i Megali Amos. Uveče poslednja večera pred polazak. Sa <a href="/guide/car-rental">iznajmljenim automobilom</a> imate najviše slobode.</p>
<h2>Budžet</h2>
<ul>
<li><strong>Smeštaj:</strong> €40-80 po noći x 4 = €160-320</li>
<li><strong>Hrana:</strong> €25-45 dnevno x 5 = €125-225</li>
<li><strong>Rent-a-car:</strong> €30-50 dnevno x 5 = €150-250</li>
<li><strong>Trajekt + aktivnosti:</strong> €30-60</li>
</ul>
<h2>Saveti</h2>
<ul>
<li>2 noći na Kasandri, 2 noći na Sitoniji</li>
<li><a href="/listings">Smeštaj</a> rezervišite rano</li>
<li>Ponesite masku za ronjenje</li>
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
      ro: '7 zile în Halkidiki — itinerar de o săptămână',
      sr: '7 Dana u Halkidikiju — Plan za Nedelju Dana',
    },
    description: {
      el: 'Πλήρες πρόγραμμα 7 ημερών: Κασσάνδρα, Σιθωνία, χωριά, νησιά, Άθως',
      en: 'Complete 7-day itinerary: Kassandra, Sithonia, villages, islands, Athos',
      de: 'Kompletter 7-Tage-Plan: Kassandra, Sithonia, Dörfer, Inseln, Athos',
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
      ro: '7 zile în Halkidiki — itinerar',
      sr: '7 dana na Halkidikiju — plan',
    },
    metaDesc: {
      el: 'Αναλυτικό πρόγραμμα 7 ημερών στη Χαλκιδική. Κασσάνδρα, Σιθωνία, ορεινά χωριά, Αμμουλιανή, Ουρανούπολη. Μπάτζετ €600-1200.',
      en: 'Detailed 7-day itinerary for Halkidiki. Kassandra, Sithonia, mountain villages, Ammouliani, Ouranoupoli. Budget €600-1200.',
      de: 'Detaillierter 7-Tage-Reiseplan für Chalkidiki: Kassandra, Sithonia, Bergdörfer, Ammouliani, Ouranoupoli. Budget €600-1200.',
      bg: 'Подробен 7-дневен маршрут за Халкидики. Касандра, Ситония, планински села, Амулиани. Бюджет €600-1200.',
      ru: 'Подробный 7-дневный маршрут по Халкидики. Кассандра, Ситония, горные деревни, Аммулиани. Бюджет €600-1200.',
      ro: 'Itinerar detaliat de 7 zile în Halkidiki: Kassandra, Sithonia, sate de munte, Ammouliani, Ouranoupoli. Buget €600-1200.',
      sr: 'Detaljan plan za 7 dana na Halkidikiju: Kasandra, Sitonija, planinska sela, Amuljani, Uranupolis. Budžet €600-1200.',
    },
    content: {
      el: `<h2>Για Ποιον Είναι Αυτό το Πρόγραμμα</h2>
<p>Μια ολόκληρη εβδομάδα σας δίνει χρόνο να <strong>γνωρίσετε τη Χαλκιδική σε βάθος</strong> — παραλίες, βουνά, νησιά και πολιτισμό. Μπάτζετ: <strong>€600-1200 ανά άτομο</strong>.</p>

<h2>Αναλυτικό Πρόγραμμα</h2>

<h3>Ημέρα 1-2 — Χερσόνησος Κασσάνδρας</h3>
<p>Περιήγηση στην Κασσάνδρα. Ημέρα 1: <a href="/places/kallithea/beaches">παραλίες Καλλιθέας</a>, πεζόδρομος Αφύτου. Ημέρα 2: Χανιώτη, Πευκοχώρι, <a href="/places/hanioti/restaurants">εστιατόρια Χανιώτης</a>. Βραδινές βόλτες στα beach bars.</p>

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
<p>Tour of Kassandra. Day 1: <a href="/places/kallithea/beaches">Kallithea beaches</a>, Afytos village walk. Day 2: Hanioti, Pefkohori, <a href="/places/hanioti/restaurants">Hanioti restaurants</a>. Evening strolls along beach bars.</p>

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

      de: `<h2>Für wen ist dieser Reiseplan?</h2>
<p>Eine ganze Woche gibt Ihnen Zeit, <strong>Chalkidiki gründlich zu entdecken</strong> — Strände, Berge, Inseln und Kultur. Budget: <strong>€600-1200 pro Person</strong>.</p>
<h2>Tag für Tag</h2>
<h3>Tag 1-2 — Kassandra</h3>
<p>Rundfahrt auf Kassandra. Tag 1: <a href="/places/kallithea/beaches">Strände von Kallithea</a>, Spaziergang durch Afytos. Tag 2: Hanioti, Pefkohori, <a href="/places/hanioti/restaurants">Restaurants in Hanioti</a>. Abends an den Strandbars entlang.</p>
<h3>Tag 3-4 — Sithonia</h3>
<p>Weiter nach Sithonia. Tag 3: Vourvourou, Strand Karidi. Tag 4: Kavourotrypes, Porto Koufo. Entdecken Sie die <a href="/best/quiet-beaches">ruhigsten Strände</a> und probieren Sie <a href="/activities">Wassersport</a>.</p>
<h3>Tag 5 — Bergdörfer</h3>
<p>Ein Tag im Landesinneren: <strong>Arnaia</strong> und <strong>Parthenonas</strong>, traditionelle Steindörfer. Siehe den <a href="/guide/villages">Dörferführer</a>. Honig, Tsipouro und traditionelle Tavernen.</p>
<h3>Tag 6 — Ammouliani & Drenia</h3>
<p>Ausflug nach <a href="/guide/ammouliani-island">Ammouliani</a> und zu den Drenia-Inselchen. Unberührte Strände, klares Wasser. Fähre ab Tripiti. Eine <a href="/listings">Unterkunft</a> bei Ouranoupoli wählen.</p>
<h3>Tag 7 — Ouranoupoli & Athos-Bootsfahrt</h3>
<p>Letzter Tag in Ouranoupoli. Bootsfahrt rund um den Athos — siehe <a href="/guide/boat-tours">Bootstouren</a>. Einkaufen in den Läden des Ortes, dann Abreise. Ein <a href="/guide/car-rental">Mietwagen</a> für die ganze Reise lohnt sich.</p>
<h2>Budget</h2>
<ul>
<li><strong>Unterkunft:</strong> €40-80/Nacht x 6 = €240-480</li>
<li><strong>Essen:</strong> €25-45/Tag x 7 = €175-315</li>
<li><strong>Mietwagen:</strong> €30-50/Tag x 7 = €210-350</li>
<li><strong>Ausflüge + Fähre:</strong> €50-100</li>
</ul>
<h2>Tipps</h2>
<ul>
<li>Alle 2 Nächte den Standort wechseln</li>
<li>Morgens früh starten, dann sind die Strände ruhig</li>
<li>Einen Tag frei lassen zum Entspannen</li>
</ul>`,

      bg: `<h2>За Кого Е Този Маршрут</h2>
<p>Цяла седмица ви дава време да <strong>опознаете Халкидики в дълбочина</strong>. Бюджет: <strong>€600-1200 на човек</strong>.</p>

<h2>Ден по Ден</h2>

<h3>Ден 1-2 — Касандра</h3>
<p>Обиколка на Касандра. Ден 1: <a href="/places/kallithea/beaches">плажове Калитея</a>, Афитос. Ден 2: Ханиоти, <a href="/places/hanioti/restaurants">ресторанти Ханиоти</a>.</p>

<h3>Ден 3-4 — Ситония</h3>
<p>Преместване в Ситония. Вурвуру, Кариди, Кавуротрипес, Порто Куфо. <a href="/best/quiet-beaches">Тихи плажове</a> и <a href="/activities">дейности</a>.</p>

<h3>Ден 5 — Планински Села</h3>
<p>Арнеа и Партенонас. Вижте <a href="/guide/villages">пътеводител за селата</a>.</p>

<h3>Ден 6 — Амулиани & Дрения</h3>
<p><a href="/guide/ammouliani-island">Амулиани</a> и островите Дрения. <a href="/listings">Настаняване</a> близо до Уранополи.</p>

<h3>Ден 7 — Уранополи & Круиз до Атон</h3>
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
<p>Осмотр Кассандры. День 1: <a href="/places/kallithea/beaches">пляжи Каллифеи</a>, Афитос. День 2: Ханиоти, <a href="/places/hanioti/restaurants">рестораны Ханиоти</a>.</p>

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

      ro: `<h2>Pentru cine este acest itinerar</h2>
<p>O săptămână întreagă vă dă timp să <strong>descoperiți Halkidiki în profunzime</strong> — plaje, munți, insule și cultură. Buget: <strong>€600-1200 de persoană</strong>.</p>
<h2>Zi cu zi</h2>
<h3>Zilele 1-2 — Kassandra</h3>
<p>Turul Kassandrei. Ziua 1: <a href="/places/kallithea/beaches">plajele din Kallithea</a>, plimbare prin Afytos. Ziua 2: Hanioti, Pefkohori, <a href="/places/hanioti/restaurants">restaurante în Hanioti</a>. Seara, plimbare pe la beach baruri.</p>
<h3>Zilele 3-4 — Sithonia</h3>
<p>Mutați-vă în Sithonia. Ziua 3: Vourvourou și plaja Karidi. Ziua 4: Kavourotrypes, Porto Koufo. Descoperiți <a href="/best/quiet-beaches">plajele liniștite</a> și încercați <a href="/activities">activitățile nautice</a>.</p>
<h3>Ziua 5 — Sate de munte</h3>
<p>O zi în interior: <strong>Arnaia</strong> și <strong>Parthenonas</strong>, sate tradiționale de piatră. Vedeți <a href="/guide/villages">ghidul satelor</a>. Miere locală, tsipouro și taverne tradiționale.</p>
<h3>Ziua 6 — Ammouliani și Drenia</h3>
<p>Excursie la <a href="/guide/ammouliani-island">Ammouliani</a> și la insulițele Drenia. Plaje sălbatice, apă cristalină. Feribot din Tripiti. Alegeți o <a href="/listings">cazare</a> lângă Ouranoupoli.</p>
<h3>Ziua 7 — Ouranoupoli și croaziera Athos</h3>
<p>Ultima zi în Ouranoupoli. Croazieră în jurul Muntelui Athos — vedeți <a href="/guide/boat-tours">plimbările cu barca</a>. Cumpărături prin magazinele locale, apoi plecarea. O <a href="/guide/car-rental">mașină închiriată</a> pentru toată călătoria merită.</p>
<h2>Buget</h2>
<ul>
<li><strong>Cazare:</strong> €40-80/noapte x 6 = €240-480</li>
<li><strong>Mâncare:</strong> €25-45/zi x 7 = €175-315</li>
<li><strong>Mașină închiriată:</strong> €30-50/zi x 7 = €210-350</li>
<li><strong>Excursii + feribot:</strong> €50-100</li>
</ul>
<h2>Sfaturi</h2>
<ul>
<li>Schimbați baza la fiecare 2 nopți</li>
<li>Porniți devreme dimineața, plajele sunt mai liniștite</li>
<li>Lăsați o zi liberă pentru relaxare</li>
</ul>`,

      sr: `<h2>Za koga je ovaj plan</h2>
<p>Cela nedelja daje vam vremena da <strong>temeljno upoznate Halkidiki</strong> — plaže, planine, ostrva i kulturu. Budžet: <strong>€600-1200 po osobi</strong>.</p>
<h2>Dan po dan</h2>
<h3>Dani 1-2 — Kasandra</h3>
<p>Obilazak Kasandre. Dan 1: <a href="/places/kallithea/beaches">plaže Kalitee</a>, šetnja kroz Afitos. Dan 2: Hanioti, Pefkohori, <a href="/places/hanioti/restaurants">restorani u Haniotiju</a>. Uveče šetnja pored barova na plaži.</p>
<h3>Dani 3-4 — Sitonija</h3>
<p>Preselite se na Sitoniju. Dan 3: Vurvuru, plaža Karidi. Dan 4: Kavurotripes, Porto Kufo. Otkrijte <a href="/best/quiet-beaches">najmirnije plaže</a> i probajte <a href="/activities">vodene sportove</a>.</p>
<h3>Dan 5 — Planinska sela</h3>
<p>Dan u unutrašnjosti: <strong>Arnea</strong> i <strong>Partenonas</strong>, tradicionalna kamena sela. Pogledajte <a href="/guide/villages">vodič kroz sela</a>. Lokalni med, cipuro i tradicionalne taverne.</p>
<h3>Dan 6 — Amuljani i Drenija</h3>
<p>Izlet na <a href="/guide/ammouliani-island">Amuljani</a> i ostrvca Drenija. Netaknute plaže, kristalno čista voda. Trajekt iz Tripitija. Izaberite <a href="/listings">smeštaj</a> blizu Uranupolisa.</p>
<h3>Dan 7 — Uranupolis i krstarenje oko Svete Gore</h3>
<p>Poslednji dan u Uranupolisu. Krstarenje oko Svete Gore — pogledajte <a href="/guide/boat-tours">izlete brodom</a>. Kupovina u lokalnim radnjama, pa polazak. <a href="/guide/car-rental">Iznajmljen automobil</a> za ceo put se isplati.</p>
<h2>Budžet</h2>
<ul>
<li><strong>Smeštaj:</strong> €40-80 po noći x 6 = €240-480</li>
<li><strong>Hrana:</strong> €25-45 dnevno x 7 = €175-315</li>
<li><strong>Rent-a-car:</strong> €30-50 dnevno x 7 = €210-350</li>
<li><strong>Izleti + trajekt:</strong> €50-100</li>
</ul>
<h2>Saveti</h2>
<ul>
<li>Menjajte bazu na svake 2 noći</li>
<li>Krećite rano ujutru, plaže su tada mirne</li>
<li>Ostavite jedan dan slobodan za odmor</li>
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
      ro: '10 zile în Halkidiki — vacanța completă',
      sr: '10 Dana u Halkidikiju — Ultimativni Odmor',
    },
    description: {
      el: 'Πλήρες πρόγραμμα 10 ημερών: Κασσάνδρα, Σιθωνία, χωριά, νησιά, Θεσσαλονίκη, γαστρονομία',
      en: 'Complete 10-day itinerary: Kassandra, Sithonia, villages, islands, Thessaloniki, gastronomy',
      de: '10-Tage-Plan: Kassandra, Sithonia, Dörfer, Inseln, Thessaloniki, Gastronomie',
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
      ro: '10 zile în Halkidiki — itinerar',
      sr: '10 dana na Halkidikiju — plan',
    },
    metaDesc: {
      el: 'Αναλυτικό πρόγραμμα 10 ημερών στη Χαλκιδική. Παραλίες, χωριά, νησιά, Θεσσαλονίκη, γαστρονομία. Μπάτζετ €900-1800.',
      en: 'Detailed 10-day itinerary for Halkidiki. Beaches, villages, islands, Thessaloniki day trip, gastronomy. Budget €900-1800.',
      de: 'Detaillierter 10-Tage-Reiseplan für Chalkidiki: Strände, Dörfer, Inseln, Tagesausflug nach Thessaloniki, Gastronomie. Budget €900-1800.',
      bg: 'Подробен 10-дневен маршрут за Халкидики. Плажове, села, острови, Солун. Бюджет €900-1800.',
      ru: 'Подробный 10-дневный маршрут по Халкидики. Пляжи, деревни, острова, Салоники. Бюджет €900-1800.',
      ro: 'Itinerar detaliat de 10 zile în Halkidiki: plaje, sate, insule, excursie la Salonic, gastronomie. Buget €900-1800.',
      sr: 'Detaljan plan za 10 dana na Halkidikiju: plaže, sela, ostrva, izlet u Solun, gastronomija. Budžet €900-1800.',
    },
    content: {
      el: `<h2>Για Ποιον Είναι Αυτό το Πρόγραμμα</h2>
<p>10 ημέρες σημαίνει <strong>ολοκληρωμένες διακοπές</strong> — κάθε γωνιά της Χαλκιδικής συν εκδρομές. Ιδανικό για οικογένειες ή ζευγάρια που θέλουν να χαλαρώσουν. Μπάτζετ: <strong>€900-1800 ανά άτομο</strong>.</p>

<h2>Αναλυτικό Πρόγραμμα</h2>

<h3>Ημέρα 1-2 — Κασσάνδρα</h3>
<p><a href="/places/kallithea/beaches">Παραλίες Καλλιθέας</a>, Άφυτος, <a href="/places/hanioti/restaurants">εστιατόρια Χανιώτης</a>. Νυχτερινή ζωή στα beach bars. <a href="/guide/kassandra">Πλήρης οδηγός Κασσάνδρας</a>.</p>

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
<p>Ελαιοτριβεία, οινοποιεία, τοπικές γεύσεις — <a href="/guide/food-and-wine">οδηγός φαγητού & κρασιού</a>. Μέλι Χαλκιδικής, πράσινες ελιές Χαλκιδικής.</p>

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
<p><a href="/places/kallithea/beaches">Kallithea beaches</a>, Afytos, <a href="/places/hanioti/restaurants">Hanioti restaurants</a>. Nightlife at beach bars. <a href="/guide/kassandra">Full Kassandra guide</a>.</p>

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
<p>Olive mills, wineries, local flavors — <a href="/guide/food-and-wine">food and wine guide</a>. Halkidiki honey, Halkidiki green olives.</p>

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

      de: `<h2>Für wen ist dieser Reiseplan?</h2>
<p>10 Tage bedeuten einen <strong>rundum vollständigen Urlaub</strong> — jede Ecke Chalkidikis plus Tagesausflüge. Ideal für Familien oder Paare, die richtig abschalten möchten. Budget: <strong>€900-1800 pro Person</strong>.</p>
<h2>Tag für Tag</h2>
<h3>Tag 1-2 — Kassandra</h3>
<p><a href="/places/kallithea/beaches">Strände von Kallithea</a>, Afytos, <a href="/places/hanioti/restaurants">Restaurants in Hanioti</a>. Abends Strandbars. <a href="/guide/kassandra">Der Kassandra-Führer</a>.</p>
<h3>Tag 3-4 — Sithonia</h3>
<p>Vourvourou, Kavourotrypes, Sarti, Porto Koufo. <a href="/best/beaches-sithonia">Die schönsten Strände Sithonias</a>. <a href="/activities">Wassersport</a>.</p>
<h3>Tag 5 — Bergdörfer</h3>
<p>Arnaia, Parthenonas, Taxiarchis. <a href="/guide/villages">Dörferführer</a>. Lokale Produkte, traditionelle Tavernen.</p>
<h3>Tag 6 — Ammouliani & Drenia</h3>
<p><a href="/guide/ammouliani-island">Ammouliani</a> und die Drenia-Inselchen. Unberührte Strände.</p>
<h3>Tag 7 — Bootsfahrt um den Athos</h3>
<p>Ouranoupoli und eine Bootsfahrt <a href="/guide/boat-tours">rund um den Athos</a>. Ein einzigartiges Erlebnis.</p>
<h3>Tag 8 — Tagesausflug nach Thessaloniki</h3>
<p>Ein Tag in Thessaloniki — siehe <a href="/guide/day-trips">Tagesausflüge</a>. Weißer Turm, Ladadika, Uferpromenade.</p>
<h3>Tag 9 — Essen & Wein</h3>
<p>Ölmühlen, Weingüter, lokale Aromen — <a href="/guide/food-and-wine">Führer zu Essen & Wein</a>. Honig und grüne Oliven aus Chalkidiki.</p>
<h3>Tag 10 — Entspannung & Einkäufe</h3>
<p>Letzter Tag: Spa, <a href="/guide/shopping-and-souvenirs">Einkäufe und Souvenirs</a>, ein langes Frühstück. Ein letztes Bad und Abreise. Für die letzte Nacht eine <a href="/listings">Unterkunft</a> mit Pool wählen.</p>
<h2>Budget</h2>
<ul>
<li><strong>Unterkunft:</strong> €40-80/Nacht x 9 = €360-720</li>
<li><strong>Essen:</strong> €30-50/Tag x 10 = €300-500</li>
<li><strong>Mietwagen:</strong> €25-45/Tag x 10 = €250-450</li>
<li><strong>Ausflüge:</strong> €80-150</li>
</ul>
<h2>Tipps</h2>
<ul>
<li>Aktive Tage und Ruhetage abwechseln</li>
<li>Den Mietwagen für 10 Tage buchen — der Wochentarif ist günstiger</li>
<li>September: der ideale Monat für eine lange Reise</li>
</ul>`,

      bg: `<h2>За Кого Е Този Маршрут</h2>
<p>10 дни означават <strong>пълноценна ваканция</strong>. Бюджет: <strong>€900-1800 на човек</strong>.</p>

<h2>Ден по Ден</h2>

<h3>Ден 1-2 — Касандра</h3>
<p><a href="/places/kallithea/beaches">Плажове Калитея</a>, Афитос, <a href="/places/hanioti/restaurants">ресторанти Ханиоти</a>. <a href="/guide/kassandra">Пътеводител Касандра</a>.</p>

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
<p><a href="/places/kallithea/beaches">Пляжи Каллифеи</a>, Афитос, <a href="/places/hanioti/restaurants">рестораны Ханиоти</a>. <a href="/guide/kassandra">Путеводитель по Кассандре</a>.</p>

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

      ro: `<h2>Pentru cine este acest itinerar</h2>
<p>10 zile înseamnă o <strong>vacanță completă</strong> — fiecare colț din Halkidiki plus excursii de o zi. Ideal pentru familii sau cupluri care vor să se relaxeze cu adevărat. Buget: <strong>€900-1800 de persoană</strong>.</p>
<h2>Zi cu zi</h2>
<h3>Zilele 1-2 — Kassandra</h3>
<p><a href="/places/kallithea/beaches">Plajele din Kallithea</a>, Afytos, <a href="/places/hanioti/restaurants">restaurante în Hanioti</a>. Seara, beach baruri. <a href="/guide/kassandra">Ghidul Kassandrei</a>.</p>
<h3>Zilele 3-4 — Sithonia</h3>
<p>Vourvourou, Kavourotrypes, Sarti, Porto Koufo. <a href="/best/beaches-sithonia">Cele mai frumoase plaje din Sithonia</a>. <a href="/activities">Activități nautice</a>.</p>
<h3>Ziua 5 — Sate de munte</h3>
<p>Arnaia, Parthenonas, Taxiarchis. <a href="/guide/villages">Ghidul satelor</a>. Produse locale, taverne tradiționale.</p>
<h3>Ziua 6 — Ammouliani și Drenia</h3>
<p><a href="/guide/ammouliani-island">Ammouliani</a> și insulițele Drenia. Plaje sălbatice.</p>
<h3>Ziua 7 — Croaziera Athos</h3>
<p>Ouranoupoli și o croazieră <a href="/guide/boat-tours">în jurul Muntelui Athos</a>. O experiență unică.</p>
<h3>Ziua 8 — Excursie la Salonic</h3>
<p>O zi în Salonic — vedeți <a href="/guide/day-trips">excursiile de o zi</a>. Turnul Alb, Ladadika, faleza.</p>
<h3>Ziua 9 — Mâncare și vin</h3>
<p>Prese de ulei, crame, arome locale — <a href="/guide/food-and-wine">ghidul mâncării și vinului</a>. Miere și măsline verzi de Halkidiki.</p>
<h3>Ziua 10 — Relaxare și cumpărături</h3>
<p>Ultima zi: spa, <a href="/guide/shopping-and-souvenirs">cumpărături și suveniruri</a>, un mic dejun lung. O ultimă baie și plecarea. Pentru ultima noapte alegeți o <a href="/listings">cazare</a> cu piscină.</p>
<h2>Buget</h2>
<ul>
<li><strong>Cazare:</strong> €40-80/noapte x 9 = €360-720</li>
<li><strong>Mâncare:</strong> €30-50/zi x 10 = €300-500</li>
<li><strong>Mașină închiriată:</strong> €25-45/zi x 10 = €250-450</li>
<li><strong>Excursii:</strong> €80-150</li>
</ul>
<h2>Sfaturi</h2>
<ul>
<li>Alternați zilele active cu zile de odihnă</li>
<li>Închiriați mașina pentru 10 zile — tariful săptămânal e mai bun</li>
<li>Septembrie: luna ideală pentru o călătorie lungă</li>
</ul>`,

      sr: `<h2>Za koga je ovaj plan</h2>
<p>10 dana znači <strong>potpun odmor</strong> — svaki kutak Halkidikija i jednodnevni izleti. Idealno za porodice ili parove koji žele da se zaista opuste. Budžet: <strong>€900-1800 po osobi</strong>.</p>
<h2>Dan po dan</h2>
<h3>Dani 1-2 — Kasandra</h3>
<p><a href="/places/kallithea/beaches">Plaže Kalitee</a>, Afitos, <a href="/places/hanioti/restaurants">restorani u Haniotiju</a>. Uveče barovi na plaži. <a href="/guide/kassandra">Vodič za Kasandru</a>.</p>
<h3>Dani 3-4 — Sitonija</h3>
<p>Vurvuru, Kavurotripes, Sarti, Porto Kufo. <a href="/best/beaches-sithonia">Najlepše plaže Sitonije</a>. <a href="/activities">Vodene aktivnosti</a>.</p>
<h3>Dan 5 — Planinska sela</h3>
<p>Arnea, Partenonas, Taksijarhis. <a href="/guide/villages">Vodič kroz sela</a>. Lokalni proizvodi, tradicionalne taverne.</p>
<h3>Dan 6 — Amuljani i Drenija</h3>
<p><a href="/guide/ammouliani-island">Amuljani</a> i ostrvca Drenija. Netaknute plaže.</p>
<h3>Dan 7 — Krstarenje oko Svete Gore</h3>
<p>Uranupolis i krstarenje <a href="/guide/boat-tours">oko Svete Gore</a>. Jedinstveno iskustvo.</p>
<h3>Dan 8 — Izlet u Solun</h3>
<p>Dan u Solunu — pogledajte <a href="/guide/day-trips">jednodnevne izlete</a>. Bela kula, Ladadika, šetalište uz more.</p>
<h3>Dan 9 — Hrana i vino</h3>
<p>Uljare, vinarije, lokalni ukusi — <a href="/guide/food-and-wine">vodič za hranu i vino</a>. Med i zelene masline sa Halkidikija.</p>
<h3>Dan 10 — Odmor i kupovina</h3>
<p>Poslednji dan: spa, <a href="/guide/shopping-and-souvenirs">kupovina i suveniri</a>, dug doručak. Poslednje kupanje i polazak. Za poslednju noć izaberite <a href="/listings">smeštaj</a> s bazenom.</p>
<h2>Budžet</h2>
<ul>
<li><strong>Smeštaj:</strong> €40-80 po noći x 9 = €360-720</li>
<li><strong>Hrana:</strong> €30-50 dnevno x 10 = €300-500</li>
<li><strong>Rent-a-car:</strong> €25-45 dnevno x 10 = €250-450</li>
<li><strong>Izleti:</strong> €80-150</li>
</ul>
<h2>Saveti</h2>
<ul>
<li>Smenjujte aktivne dane s danima odmora</li>
<li>Iznajmite automobil na 10 dana — nedeljna cena je povoljnija</li>
<li>Septembar: idealan mesec za dug odmor</li>
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
      ro: 'O escapadă rapidă de weekend în Halkidiki',
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
      ro: 'Escapadă de weekend în Halkidiki, de vineri până duminică: Kassandra și Sithonia. Buget €150-300.',
      sr: 'Brzi vikend na Halkidikiju, od petka do nedelje: Kasandra i Sitonija. Budžet €150-300.',
    },
    content: {
      el: `<h2>Για Ποιον Είναι Αυτό το Πρόγραμμα</h2>
<p>Ένα <strong>γρήγορο Σαββατοκύριακο</strong> στη Χαλκιδική — ιδανικό για κατοίκους Θεσσαλονίκης ή ταξιδιώτες με λίγο χρόνο. Μπάτζετ: <strong>€150-300 ανά άτομο</strong>.</p>

<h2>Αναλυτικό Πρόγραμμα</h2>

<h3>Παρασκευή Βράδυ — Άφιξη</h3>
<p>Φτάνετε στην Κασσάνδρα μετά τη δουλειά. Τακτοποιηθείτε στο <a href="/listings">κατάλυμα</a>, ελαφρύ δείπνο. Πώς να φτάσετε; Δείτε <a href="/guide/getting-here">πώς να έρθετε στη Χαλκιδική</a>.</p>

<h3>Σάββατο — Παραλία, Μεσημεριανό, Ηλιοβασίλεμα</h3>
<p>Πρωί: <a href="/beaches">παραλία</a> στην Καλλιθέα ή τη Χανιώτη. Μεσημεριανό σε ταβέρνα δίπλα στη θάλασσα. Απόγευμα: βόλτα στην Άφυτο και ηλιοβασίλεμα στο Ποσείδι ή στη Σίβηρη, στη δυτική ακτή — δείτε τα <a href="/guide/sunset-spots">σημεία ηλιοβασιλέματος</a>. Δείπνο στην Άφυτο — <a href="/places/afytos/restaurants">εστιατόρια Αφύτου</a>.</p>

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
<p>Morning: <a href="/beaches">beach</a> at Kallithea or Hanioti. Seafront taverna lunch. Afternoon: a stroll in Afytos, then the sunset at Possidi or Siviri on the west coast — see the <a href="/guide/sunset-spots">sunset spots</a>. Dinner back in Afytos — <a href="/places/afytos/restaurants">Afytos restaurants</a>.</p>

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

      de: `<h2>Für wen ist dieser Reiseplan?</h2>
<p>Ein <strong>kurzer Wochenendausflug</strong> nach Chalkidiki — ideal für Menschen aus Thessaloniki oder Reisende mit wenig Zeit. Budget: <strong>€150-300 pro Person</strong>.</p>
<h2>Tag für Tag</h2>
<h3>Freitagabend — Ankunft</h3>
<p>Nach der Arbeit nach Kassandra fahren. In der <a href="/listings">Unterkunft</a> einchecken, leichtes Abendessen. Wie man hinkommt: siehe <a href="/guide/getting-here">Anreise nach Chalkidiki</a>.</p>
<h3>Samstag — Strand, Mittagessen, Sonnenuntergang</h3>
<p>Morgens: <a href="/beaches">Strand</a> in Kallithea oder Hanioti. Mittagessen in einer Taverne am Meer. Nachmittags ein Spaziergang durch Afytos, danach Sonnenuntergang in Possidi oder Siviri an der Westküste — siehe die <a href="/guide/sunset-spots">Plätze für den Sonnenuntergang</a>. Abendessen in Afytos — <a href="/places/afytos/restaurants">Restaurants in Afytos</a>.</p>
<h3>Sonntag — Sithonia & Rückfahrt</h3>
<p>Morgens Baden auf Sithonia — <a href="/best/beaches-sithonia">die schönsten Strände</a>. Kurzes Mittagessen, nach Mittag zurück. Wer möchte, probiert frühmorgens Stand-up-Paddling — siehe <a href="/activities">Aktivitäten</a>.</p>
<h2>Budget</h2>
<ul>
<li><strong>Unterkunft:</strong> €40-70/Nacht x 2 = €80-140</li>
<li><strong>Essen:</strong> €20-35/Tag x 2 = €40-70</li>
<li><strong>Benzin:</strong> €20-30</li>
<li><strong>Aktivitäten:</strong> €10-30</li>
</ul>
<h2>Tipps</h2>
<ul>
<li>Freitag früh losfahren, um dem Verkehr zu entgehen</li>
<li>Unterkunft vorab buchen — Wochenenden sind schnell ausgebucht</li>
<li>Mehr Hilfe in den <a href="/faq/transport">FAQ zum Transport</a></li>
<li>Ohne eigenes Auto einen <a href="/guide/car-rental">Mietwagen</a> nehmen</li>
</ul>`,

      bg: `<h2>За Кого Е Този Маршрут</h2>
<p><strong>Бърз уикенд</strong> в Халкидики — идеален за жители на Солун или пътешественици с малко време. Бюджет: <strong>€150-300 на човек</strong>.</p>

<h2>Ден по Ден</h2>

<h3>Петък Вечер — Пристигане</h3>
<p>Пристигане в Касандра. Настаняване в <a href="/listings">квартира</a>. Как да стигнете? Вижте <a href="/guide/getting-here">как да стигнете до Халкидики</a>.</p>

<h3>Събота — Плаж, Обяд, Залез</h3>
<p>Сутрин: <a href="/beaches">плаж</a> в Калитеа или Ханиоти. Обяд в таверна до морето. Следобед: разходка в Афитос, а после залез в Посиди или Сивири на западния бряг — вижте <a href="/guide/sunset-spots">местата за залез</a>. Вечеря в <a href="/places/afytos/restaurants">Афитос</a>.</p>

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
<p>Утро: <a href="/beaches">пляж</a> в Каллифее или Ханиоти. Обед в таверне у моря. Днём прогулка по Афитосу, затем закат в Поссиди или Сивири на западном побережье — см. <a href="/guide/sunset-spots">места для заката</a>. Ужин в <a href="/places/afytos/restaurants">ресторанах Афитоса</a>.</p>

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

      ro: `<h2>Pentru cine este acest itinerar</h2>
<p>O <strong>escapadă rapidă de weekend</strong> în Halkidiki — ideală pentru locuitorii Salonicului sau pentru cei cu timp puțin. Buget: <strong>€150-300 de persoană</strong>.</p>
<h2>Zi cu zi</h2>
<h3>Vineri seara — Sosire</h3>
<p>Ajungeți în Kassandra după program. Cazați-vă la <a href="/listings">locul de cazare</a>, o cină ușoară. Cum ajungeți? Vedeți <a href="/guide/getting-here">cum ajungeți în Halkidiki</a>.</p>
<h3>Sâmbătă — Plajă, prânz, apus</h3>
<p>Dimineața: <a href="/beaches">plajă</a> la Kallithea sau Hanioti. Prânz la o tavernă pe malul mării. După-amiaza, o plimbare prin Afytos, apoi apusul la Possidi sau Siviri, pe coasta de vest — vedeți <a href="/guide/sunset-spots">locurile pentru apus</a>. Cină în Afytos — <a href="/places/afytos/restaurants">restaurante în Afytos</a>.</p>
<h3>Duminică — Sithonia și întoarcerea</h3>
<p>Baie de dimineață în Sithonia — <a href="/best/beaches-sithonia">cele mai frumoase plaje</a>. Un prânz rapid, apoi întoarcerea după-amiaza. Dacă vreți <a href="/activities">activități</a>, încercați paddleboard dimineața devreme.</p>
<h2>Buget</h2>
<ul>
<li><strong>Cazare:</strong> €40-70/noapte x 2 = €80-140</li>
<li><strong>Mâncare:</strong> €20-35/zi x 2 = €40-70</li>
<li><strong>Benzină:</strong> €20-30</li>
<li><strong>Activități:</strong> €10-30</li>
</ul>
<h2>Sfaturi</h2>
<ul>
<li>Plecați devreme vineri ca să evitați traficul</li>
<li>Rezervați cazarea din timp — weekendurile se ocupă repede</li>
<li>Mai multe în <a href="/faq/transport">întrebările frecvente despre transport</a></li>
<li><a href="/guide/car-rental">Închiriați o mașină</a> dacă nu aveți una</li>
</ul>`,

      sr: `<h2>Za koga je ovaj plan</h2>
<p><strong>Kratak vikend-beg</strong> na Halkidiki — idealan za stanovnike Soluna ili putnike s malo vremena. Budžet: <strong>€150-300 po osobi</strong>.</p>
<h2>Dan po dan</h2>
<h3>Petak uveče — Dolazak</h3>
<p>Posle posla stignite na Kasandru. Smestite se u <a href="/listings">smeštaj</a>, laka večera. Kako stići? Pogledajte <a href="/guide/getting-here">kako stići na Halkidiki</a>.</p>
<h3>Subota — Plaža, ručak, zalazak sunca</h3>
<p>Ujutru: <a href="/beaches">plaža</a> u Kalitei ili Haniotiju. Ručak u taverni uz more. Popodne šetnja kroz Afitos, a zatim zalazak sunca u Posidiju ili Siviriju na zapadnoj obali — pogledajte <a href="/guide/sunset-spots">mesta za zalazak sunca</a>. Večera u Afitosu — <a href="/places/afytos/restaurants">restorani u Afitosu</a>.</p>
<h3>Nedelja — Sitonija i povratak</h3>
<p>Jutarnje kupanje na Sitoniji — <a href="/best/beaches-sithonia">najlepše plaže</a>. Brz ručak, povratak posle podneva. Ako želite <a href="/activities">aktivnosti</a>, probajte SUP rano ujutru.</p>
<h2>Budžet</h2>
<ul>
<li><strong>Smeštaj:</strong> €40-70 po noći x 2 = €80-140</li>
<li><strong>Hrana:</strong> €20-35 dnevno x 2 = €40-70</li>
<li><strong>Gorivo:</strong> €20-30</li>
<li><strong>Aktivnosti:</strong> €10-30</li>
</ul>
<h2>Saveti</h2>
<ul>
<li>Krenite rano u petak da izbegnete gužvu</li>
<li>Rezervišite smeštaj unapred — vikendi se brzo popune</li>
<li>Više u <a href="/faq/transport">čestim pitanjima o prevozu</a></li>
<li><a href="/guide/car-rental">Iznajmite automobil</a> ako nemate svoj</li>
</ul>`,
    },
  },
  {
    slug: 'family', icon: 'Users', color: 'sky',
    title: { el: '7 Μέρες Χαλκιδική για Οικογένειες με Παιδιά', en: '7-Day Halkidiki Family Itinerary (with Kids)', de: '7-Tage Chalkidiki Familienreise (mit Kindern)', bg: '7 Дни в Халкидики за Семейства с Деца', ru: '7 Дней в Халкидиках для Семей с Детьми', ro: '7 Zile Halkidiki pentru Familii cu Copii', sr: '7 Dana Halkidiki za Porodice sa Decom' },
    description: { el: 'Πρόγραμμα 1 εβδομάδας στη Χαλκιδική ειδικά για οικογένειες με παιδιά', en: '1-week Halkidiki itinerary tailored for families with kids', de: '1-Wochen-Reiseplan für Familien mit Kindern', bg: '1-седмичен маршрут за семейства с деца', ru: 'Маршрут на неделю для семей с детьми', ro: 'Itinerar de 1 săptămână pentru familii cu copii', sr: 'Plan za 1 nedelju za porodice sa decom' },
    metaTitle: { el: '7 Μέρες Χαλκιδική Οικογένειες 2026 — Πρόγραμμα με Παιδιά', en: '7-Day Halkidiki Family Itinerary 2026 — With Kids (Beaches, Activities)', de: '7 Tage Chalkidiki Familie 2026 — Mit Kindern, Strände, Aktivitäten', bg: '7 Дни Халкидики Семейство 2026 — С Деца, Плажове, Дейности', ru: '7 Дней Халкидики Семья 2026 — С Детьми, Пляжи, Развлечения', ro: '7 Zile Halkidiki Familie 2026 — Cu Copii, Plaje, Activități', sr: '7 Dana Halkidiki Porodica 2026 — Sa Decom, Plaže, Aktivnosti' },
    metaDesc: { el: 'Πλήρες πρόγραμμα 7 ημερών στη Χαλκιδική για οικογένειες με παιδιά: ρηχές παραλίες, water park, μουσεία, ταβέρνες. Budget €1200-2500.', en: 'Complete 7-day Halkidiki itinerary for families with kids: shallow beaches, water parks, museums, family tavernas. Budget €1200-2500 per family.', de: '7-Tage Familienreiseplan Chalkidiki mit Kindern. Budget €1200-2500.', bg: '7-дневен маршрут Халкидики за семейства с деца. Бюджет €1200-2500.', ru: '7-дневный маршрут Халкидики для семей с детьми. Бюджет €1200-2500.', ro: 'Itinerar de 7 zile Halkidiki pentru familii cu copii. Buget €1200-2500.', sr: '7-dnevni plan Halkidiki za porodice sa decom. Budžet €1200-2500.' },
    content: {
      el: `<h2>7 μέρες στη Χαλκιδική για οικογένειες</h2><p>Μια εβδομάδα για οικογένειες με <strong>παιδιά 3–12 ετών</strong>: <a href="/best/family-beaches">οικογενειακές παραλίες</a>, ήπιες δραστηριότητες, άνετη διαμονή και νωρίς βραδινό.</p><h2>Πού να μείνετε</h2><p><a href="/listings">Χανιώτη ή Καλλιθέα</a> στην Κασσάνδρα — οργανωμένες παραλίες, σούπερ μάρκετ και παιδικά μενού κοντά. Ιδανικά μια βίλα με πισίνα.</p><h2>Μέρα 1: Άφιξη</h2><p>Από το αεροδρόμιο της Θεσσαλονίκης ως την Καλλιθέα είναι περίπου 1 ώρα και 10 λεπτά. Τακτοποίηση, πρώτο μπάνιο σε ρηχή παραλία και δείπνο σε οικογενειακή ταβέρνα.</p><h2>Μέρα 2: Παραλία και πισίνα</h2><p>Πρωί σε οργανωμένη παραλία στην Καλλιθέα ή τη Χανιώτη, με ξαπλώστρες και σκιά· απόγευμα στην πισίνα.</p><h2>Μέρα 3: Υδάτινο πάρκο</h2><p>Το μεγάλο υδάτινο πάρκο Waterland βρίσκεται κοντά στη Θεσσαλονίκη, περίπου μία ώρα από την Κασσάνδρα — μια ολόκληρη μέρα με τσουλήθρες και πισίνες. Ελέγξτε από πριν ημερομηνίες λειτουργίας και εισιτήρια.</p><h2>Μέρα 4: Σιθωνία</h2><p>Περίπου 1–1,5 ώρα ως τη Σιθωνία: το <strong>Καρύδι</strong> κοντά στη Βουρβουρού, με ρηχά τιρκουάζ νερά και πεύκα.</p><h2>Μέρα 5: Πετράλωνα και Όλυνθος</h2><p>Το <a href="/guide/petralona-cave">Σπήλαιο Πετραλώνων</a>, ενδιαφέρον για παιδιά από περίπου 6 ετών, και τα ψηφιδωτά της Αρχαίας Ολύνθου εκεί κοντά.</p><h2>Μέρα 6: Βαρκάδα</h2><p>Μια εκδρομή με σκάφος κατά μήκος της ακτής ή — για μεγαλύτερη μέρα — η κρουαζιέρα γύρω από το Άγιο Όρος από την Ουρανούπολη (περίπου 2 ώρες οδικώς από την Κασσάνδρα).</p><h2>Μέρα 7: Αναχώρηση</h2><p>Χαλαρό πρωινό, τελευταίο μπάνιο και επιστροφή στο αεροδρόμιο.</p><h2>Προϋπολογισμός (ενδεικτικά, οικογένεια 4 ατόμων)</h2><ul><li>Διαμονή, 6 νύχτες: €700-1500</li><li>Φαγητό: €400-600</li><li>Δραστηριότητες: €150-300</li><li>Ενοικίαση αυτοκινήτου: €200-400</li></ul><h2>Συμβουλές</h2><ul><li>Πάρτε μπρατσάκια και σκίαστρο για την παραλία</li><li>Στα υδάτινα πάρκα τα Σαββατοκύριακα έχουν τον περισσότερο κόσμο</li><li>Κλείστε τραπέζι νωρίς (γύρω στις 19:00)</li></ul>`,
      en: `<h2>7-Day Halkidiki Family Itinerary</h2><p>A week for families with <strong>children aged 3–12</strong>: <a href="/best/family-beaches">family beaches</a>, gentle activities, comfortable stays and early dinners.</p><h2>Where to stay</h2><p><a href="/listings">Hanioti or Kallithea</a> in Kassandra — organised beaches, supermarkets and children's menus nearby. A villa with a pool is ideal.</p><h2>Day 1: Arrival</h2><p>From Thessaloniki Airport it is about 1 hour 10 minutes to Kallithea. Check in, then a first swim at a shallow beach and dinner at a family taverna.</p><h2>Day 2: Beach and pool</h2><p>Morning at an organised beach in Kallithea or Hanioti, with sunbeds and shade; afternoon at the pool.</p><h2>Day 3: Water park</h2><p>The large Waterland water park is near Thessaloniki, about an hour's drive from Kassandra — a full day of slides and pools. Check opening dates and tickets in advance.</p><h2>Day 4: Sithonia</h2><p>About 1–1.5 hours to Sithonia: <strong>Karydi</strong> near Vourvourou, with shallow turquoise water and pine trees.</p><h2>Day 5: Petralona and Olynthos</h2><p>The <a href="/guide/petralona-cave">Petralona Cave</a>, interesting for children of about 6 and over, and the mosaics of Ancient Olynthos nearby.</p><h2>Day 6: Boat trip</h2><p>A boat trip along the coast, or — for a longer day — the cruise around Mount Athos from Ouranoupoli (about 2 hours' drive from Kassandra).</p><h2>Day 7: Departure</h2><p>A relaxed breakfast, a last swim and the drive back to the airport.</p><h2>Budget (indicative, family of 4)</h2><ul><li>Accommodation, 6 nights: €700-1500</li><li>Food: €400-600</li><li>Activities: €150-300</li><li>Car rental: €200-400</li></ul><h2>Tips</h2><ul><li>Bring armbands and a sun tent for the beach</li><li>At water parks, weekends are the busiest days</li><li>Greek families eat late — book an early table (around 19:00)</li></ul>`,
      de: `<h2>7 Tage Chalkidiki für Familien</h2><p>Eine Woche für Familien mit <strong>Kindern von 3–12 Jahren</strong>: <a href="/best/family-beaches">Familienstrände</a>, ruhige Aktivitäten, bequeme Unterkunft und frühes Abendessen.</p><h2>Unterkunft</h2><p><a href="/listings">Hanioti oder Kallithea</a> auf Kassandra — organisierte Strände, Supermärkte und Kindermenüs in der Nähe. Ideal ist eine Villa mit Pool.</p><h2>Tag 1: Ankunft</h2><p>Vom Flughafen Thessaloniki bis Kallithea sind es etwa 1 Stunde 10 Minuten. Einchecken, erstes Bad an einem flachen Strand und Abendessen in einer Familientaverne.</p><h2>Tag 2: Strand und Pool</h2><p>Vormittags an einem organisierten Strand in Kallithea oder Hanioti mit Liegen und Schatten, nachmittags am Pool.</p><h2>Tag 3: Wasserpark</h2><p>Der große Wasserpark Waterland liegt bei Thessaloniki, etwa eine Autostunde von Kassandra — ein ganzer Tag mit Rutschen und Becken. Öffnungszeiten und Tickets vorher prüfen.</p><h2>Tag 4: Sithonia</h2><p>Etwa 1–1,5 Stunden nach Sithonia: <strong>Karydi</strong> bei Vourvourou mit flachem türkisem Wasser und Kiefern.</p><h2>Tag 5: Petralona und Olynth</h2><p>Die <a href="/guide/petralona-cave">Höhle von Petralona</a>, spannend für Kinder ab etwa 6 Jahren, und die Mosaike des antiken Olynth ganz in der Nähe.</p><h2>Tag 6: Bootsausflug</h2><p>Ein Bootsausflug entlang der Küste oder — für einen längeren Tag — die Fahrt rund um den Athos ab Ouranoupoli (etwa 2 Autostunden von Kassandra).</p><h2>Tag 7: Abreise</h2><p>Gemütliches Frühstück, ein letztes Bad und Fahrt zum Flughafen.</p><h2>Budget (Richtwerte, Familie mit 4 Personen)</h2><ul><li>Unterkunft, 6 Nächte: €700-1500</li><li>Essen: €400-600</li><li>Aktivitäten: €150-300</li><li>Mietwagen: €200-400</li></ul><h2>Tipps</h2><ul><li>Schwimmflügel und ein Strandzelt mitnehmen</li><li>In Wasserparks ist am Wochenende am meisten los</li><li>Früh einen Tisch reservieren (gegen 19 Uhr)</li></ul>`,
      bg: `<h2>7 дни в Халкидики за семейства</h2><p>Седмица за семейства с <strong>деца от 3 до 12 години</strong>: <a href="/best/family-beaches">семейни плажове</a>, спокойни занимания, удобно настаняване и ранна вечеря.</p><h2>Къде да отседнете</h2><p><a href="/listings">Ханиоти или Калитеа</a> в Касандра — организирани плажове, супермаркети и детски менюта наблизо. Идеална е вила с басейн.</p><h2>Ден 1: Пристигане</h2><p>От летище Солун до Калитеа се пътува около 1 час и 10 минути. Настаняване, първо плуване на плитък плаж и вечеря в семейна таверна.</p><h2>Ден 2: Плаж и басейн</h2><p>Сутрин на организиран плаж в Калитеа или Ханиоти, с шезлонги и сянка; следобед на басейна.</p><h2>Ден 3: Аквапарк</h2><p>Големият аквапарк Waterland е край Солун, на около час с кола от Касандра — цял ден с пързалки и басейни. Проверете предварително работните дни и билетите.</p><h2>Ден 4: Ситония</h2><p>Около 1–1,5 часа до Ситония: <strong>Кариди</strong> край Вурвуру, с плитка тюркоазена вода и борове.</p><h2>Ден 5: Петралона и Олинт</h2><p><a href="/guide/petralona-cave">Пещерата Петралона</a>, интересна за деца от около 6 години, и мозайките на Древен Олинт наблизо.</p><h2>Ден 6: Разходка с лодка</h2><p>Разходка с лодка покрай брега или — за по-дълъг ден — круизът около Света гора от Уранополи (около 2 часа с кола от Касандра).</p><h2>Ден 7: Отпътуване</h2><p>Спокойна закуска, последно плуване и път към летището.</p><h2>Бюджет (ориентировъчно, семейство от 4)</h2><ul><li>Настаняване, 6 нощувки: €700-1500</li><li>Храна: €400-600</li><li>Занимания: €150-300</li><li>Кола под наем: €200-400</li></ul><h2>Съвети</h2><ul><li>Вземете пояси за ръце и плажна палатка за сянка</li><li>В аквапарковете е най-пълно през уикенда</li><li>Резервирайте маса рано (около 19:00)</li></ul>`,
      ru: `<h2>7 дней на Халкидики для семей</h2><p>Неделя для семей с <strong>детьми 3–12 лет</strong>: <a href="/best/family-beaches">семейные пляжи</a>, спокойные развлечения, удобное жильё и ранний ужин.</p><h2>Где жить</h2><p><a href="/listings">Ханиоти или Каллифея</a> на Кассандре — организованные пляжи, супермаркеты и детское меню рядом. Идеально — вилла с бассейном.</p><h2>День 1: Приезд</h2><p>От аэропорта Салоник до Каллифеи около 1 часа 10 минут. Заселение, первое купание на мелком пляже и ужин в семейной таверне.</p><h2>День 2: Пляж и бассейн</h2><p>Утром — организованный пляж в Каллифее или Ханиоти с лежаками и тенью, днём — бассейн.</p><h2>День 3: Аквапарк</h2><p>Большой аквапарк Waterland находится под Салониками, примерно в часе езды от Кассандры, — целый день горок и бассейнов. Даты работы и билеты уточняйте заранее.</p><h2>День 4: Ситония</h2><p>Около 1–1,5 часа до Ситонии: пляж <strong>Кариди</strong> у Вурвуру с мелкой бирюзовой водой и соснами.</p><h2>День 5: Петралона и Олинф</h2><p><a href="/guide/petralona-cave">Пещера Петралона</a> — интересно детям примерно с 6 лет, а рядом мозаики Древнего Олинфа.</p><h2>День 6: Морская прогулка</h2><p>Прогулка на катере вдоль побережья или — на более долгий день — круиз вокруг Афона из Уранополиса (около 2 часов езды от Кассандры).</p><h2>День 7: Отъезд</h2><p>Неспешный завтрак, последнее купание и дорога в аэропорт.</p><h2>Бюджет (ориентировочно, семья из 4)</h2><ul><li>Жильё, 6 ночей: €700-1500</li><li>Еда: €400-600</li><li>Развлечения: €150-300</li><li>Аренда авто: €200-400</li></ul><h2>Советы</h2><ul><li>Возьмите нарукавники и пляжный тент</li><li>В аквапарках больше всего людей в выходные</li><li>Бронируйте столик пораньше (около 19:00)</li></ul>`,
      ro: `<h2>7 zile în Halkidiki pentru familii</h2><p>O săptămână pentru familii cu <strong>copii de 3–12 ani</strong>: <a href="/best/family-beaches">plaje pentru familii</a>, activități liniștite, cazare comodă și cină devreme.</p><h2>Unde să stați</h2><p><a href="/listings">Hanioti sau Kallithea</a> în Kassandra — plaje amenajate, supermarketuri și meniuri pentru copii în apropiere. Ideală este o vilă cu piscină.</p><h2>Ziua 1: Sosire</h2><p>De la aeroportul din Salonic până la Kallithea faceți circa 1 oră și 10 minute. Cazare, prima baie la o plajă cu apă mică și cină la o tavernă de familie.</p><h2>Ziua 2: Plajă și piscină</h2><p>Dimineața la o plajă amenajată din Kallithea sau Hanioti, cu șezlonguri și umbră; după-amiaza la piscină.</p><h2>Ziua 3: Parc acvatic</h2><p>Marele parc acvatic Waterland se află lângă Salonic, la aproximativ o oră de mers cu mașina din Kassandra — o zi întreagă de tobogane și piscine. Verificați dinainte zilele de funcționare și biletele.</p><h2>Ziua 4: Sithonia</h2><p>Circa 1–1,5 ore până în Sithonia: <strong>Karydi</strong>, lângă Vourvourou, cu apă turcoaz puțin adâncă și pini.</p><h2>Ziua 5: Petralona și Olynthos</h2><p><a href="/guide/petralona-cave">Peștera Petralona</a>, interesantă pentru copiii de la aproximativ 6 ani, și mozaicurile din Olynthos antic, în apropiere.</p><h2>Ziua 6: Plimbare cu barca</h2><p>O plimbare cu barca de-a lungul coastei sau — pentru o zi mai lungă — croaziera în jurul Muntelui Athos din Ouranoupoli (circa 2 ore cu mașina din Kassandra).</p><h2>Ziua 7: Plecare</h2><p>Un mic dejun fără grabă, o ultimă baie și drumul spre aeroport.</p><h2>Buget (orientativ, familie de 4)</h2><ul><li>Cazare, 6 nopți: €700-1500</li><li>Mâncare: €400-600</li><li>Activități: €150-300</li><li>Mașină închiriată: €200-400</li></ul><h2>Sfaturi</h2><ul><li>Luați aripioare de înot și un cort de plajă pentru umbră</li><li>La parcurile acvatice, weekendul e cel mai aglomerat</li><li>Rezervați masa devreme (în jurul orei 19:00)</li></ul>`,
      sr: `<h2>7 dana na Halkidikiju za porodice</h2><p>Nedelja za porodice s <strong>decom od 3 do 12 godina</strong>: <a href="/best/family-beaches">porodične plaže</a>, mirne aktivnosti, udoban smeštaj i rana večera.</p><h2>Gde odseći</h2><p><a href="/listings">Hanioti ili Kalitea</a> na Kasandri — uređene plaže, supermarketi i dečji meniji u blizini. Idealna je vila s bazenom.</p><h2>Dan 1: Dolazak</h2><p>Od aerodroma u Solunu do Kalitee ima oko 1 sat i 10 minuta vožnje. Smeštaj, prvo kupanje na plićoj plaži i večera u porodičnoj taverni.</p><h2>Dan 2: Plaža i bazen</h2><p>Pre podne na uređenoj plaži u Kalitei ili Haniotiju, s ležaljkama i hladom; popodne kod bazena.</p><h2>Dan 3: Akva-park</h2><p>Veliki akva-park Waterland nalazi se kod Soluna, oko sat vožnje od Kasandre — ceo dan tobogana i bazena. Radne dane i ulaznice proverite unapred.</p><h2>Dan 4: Sitonija</h2><p>Oko 1–1,5 sat do Sitonije: plaža <strong>Karidi</strong> kod Vurvurua, s plitkom tirkiznom vodom i borovima.</p><h2>Dan 5: Petralona i Olint</h2><p><a href="/guide/petralona-cave">Pećina Petralona</a>, zanimljiva deci od otprilike 6 godina, i mozaici Antičkog Olinta u blizini.</p><h2>Dan 6: Izlet brodom</h2><p>Izlet brodom duž obale ili — za duži dan — krstarenje oko Svete Gore iz Uranupolisa (oko 2 sata vožnje od Kasandre).</p><h2>Dan 7: Polazak</h2><p>Lagan doručak, poslednje kupanje i vožnja do aerodroma.</p><h2>Budžet (okvirno, porodica od 4)</h2><ul><li>Smeštaj, 6 noći: €700-1500</li><li>Hrana: €400-600</li><li>Aktivnosti: €150-300</li><li>Rent-a-car: €200-400</li></ul><h2>Saveti</h2><ul><li>Ponesite mišiće za plivanje i šator za hlad na plaži</li><li>U akva-parkovima je najveća gužva vikendom</li><li>Rezervišite sto rano (oko 19:00)</li></ul>`,
    },
  },
  {
    slug: 'romantic', icon: 'Heart', color: 'rose',
    title: { el: 'Ρομαντικές Διακοπές για Ζευγάρια στη Χαλκιδική (4 Μέρες)', en: 'Romantic Halkidiki Itinerary for Couples (4 Days)', de: 'Romantische Chalkidiki-Reise für Paare (4 Tage)', bg: 'Романтична Почивка за Двойки в Халкидики (4 Дни)', ru: 'Романтический Отдых для Пар в Халкидиках (4 Дня)', ro: 'Vacanță Romantică pentru Cupluri în Halkidiki (4 Zile)', sr: 'Romantičan Odmor za Parove u Halkidikiju (4 Dana)' },
    description: { el: '4ήμερο για ζευγάρια — boutique, sunset spots, ρομαντικά δείπνα', en: '4-day plan for couples — boutique stays, sunset spots, romantic dinners', de: '4-Tage-Plan für Paare — Boutique-Hotels, Sonnenuntergänge', bg: '4-дневен план за двойки', ru: '4-дневный план для пар', ro: 'Plan de 4 zile pentru cupluri', sr: '4-dnevni plan za parove' },
    metaTitle: { el: 'Ρομαντική Χαλκιδική 2026 — 4 Μέρες για Ζευγάρια (Spa, Sunset, Δείπνο)', en: 'Romantic Halkidiki 2026 — 4-Day Couples Getaway (Spa, Sunset, Dinner)', de: 'Romantisches Chalkidiki 2026 — 4 Tage für Paare', bg: 'Романтична Халкидики 2026 — 4 Дни за Двойки', ru: 'Романтические Халкидики 2026 — 4 Дня для Пар', ro: 'Halkidiki Romantic 2026 — 4 Zile pentru Cupluri', sr: 'Romantičan Halkidiki 2026 — 4 Dana za Parove' },
    metaDesc: { el: 'Ρομαντικό 4ήμερο στη Σιθωνία: boutique διαμονή, ήσυχες παραλίες, spa, κρουαζιέρα στο Άγιο Όρος και δείπνο με θέα. €800-1800 για δύο.', en: 'Romantic 4-day getaway in Sithonia: boutique stay, quiet beaches, spa, a Mount Athos cruise and dinner with a view. €800-1800 for two.', de: 'Romantische 4 Tage auf Sithonia: Boutique-Unterkunft, ruhige Strände, Spa, Athos-Bootsfahrt und Abendessen mit Aussicht. €800-1800 für zwei.', bg: 'Романтични 4 дни в Ситония: бутик настаняване, тихи плажове, спа, круиз около Света гора и вечеря с гледка. €800-1800 за двама.', ru: 'Романтические 4 дня на Ситонии: бутик-отель, тихие пляжи, спа, круиз вокруг Афона и ужин с видом. €800-1800 на двоих.', ro: 'Patru zile romantice în Sithonia: cazare boutique, plaje liniștite, spa, croazieră la Muntele Athos și cină cu priveliște. €800-1800 pentru doi.', sr: 'Romantična 4 dana na Sitoniji: butik smeštaj, mirne plaže, spa, krstarenje oko Svete Gore i večera s pogledom. €800-1800 za dvoje.' },
    content: {
      el: `<h2>Ρομαντική Χαλκιδική για ζευγάρια — 4 μέρες</h2><p>Ιδιωτικότητα, καλό φαγητό και βράδια δίπλα στη θάλασσα — για επετείους και μήνα του μέλιτος. Καλύτεροι μήνες: Μάιος, Ιούνιος και Σεπτέμβριος.</p><h2>Πού να μείνετε</h2><p>Boutique βίλα ή θέρετρο στη <a href="/guide/sithonia">Σιθωνία</a> — γύρω από Βουρβουρού, Νικήτη ή Νέο Μαρμαρά — ιδανικά με ιδιωτική πισίνα και θέα στη θάλασσα. Δείτε τις <a href="/best/romantic-getaways">ρομαντικές αποδράσεις</a>.</p><h2>Μέρα 1: Άφιξη</h2><p>Περίπου 1,5 ώρα από το αεροδρόμιο της Θεσσαλονίκης. Βραδινή βόλτα στον Παρθενώνα, το πέτρινο χωριό πάνω από τον Νέο Μαρμαρά, και δείπνο με θέα στον Τορωναίο κόλπο.</p><h2>Μέρα 2: Παραλία και spa</h2><p>Ήσυχο πρωινό στις Καβουρότρυπες ή στο Καρύδι και απόγευμα στο spa.</p><h2>Μέρα 3: Κρουαζιέρα στο Άγιο Όρος</h2><p>Από την Ουρανούπολη (περίπου 1 ώρα και 15 λεπτά από τη Νικήτη), μισής μέρας κρουαζιέρα κατά μήκος της ακτής του Αγίου Όρους. Πίσω στη Σιθωνία, κοκτέιλ στο ηλιοβασίλεμα στη δυτική ακτή και δείπνο με θαλασσινά.</p><h2>Μέρα 4: Αναχώρηση</h2><p>Αργό πρωινό, βόλτα στην παραλία και αναχώρηση κατά το μεσημέρι.</p><h2>Προϋπολογισμός (ενδεικτικά, για δύο)</h2><ul><li>Boutique διαμονή, 3 νύχτες: €450-1000</li><li>Δείπνα: €200-400</li><li>Spa: €120-200</li><li>Κρουαζιέρα: €60-100</li><li>Αυτοκίνητο: €100-150</li></ul><h2>Συμβουλές</h2><ul><li>Κλείστε τραπέζια με θέα λίγες μέρες πριν</li><li>Ο Σεπτέμβριος είναι ιδιαίτερα όμορφος: ζεστή θάλασσα και ηρεμία</li><li>Δείτε τα <a href="/guide/sunset-spots">σημεία ηλιοβασιλέματος</a></li></ul>`,
      en: `<h2>Romantic Halkidiki for Couples — 4 Days</h2><p>Privacy, good food and evenings by the sea — for anniversaries and honeymoons. Best months: May, June and September.</p><h2>Where to stay</h2><p>A boutique villa or a resort in <a href="/guide/sithonia">Sithonia</a> — around Vourvourou, Nikiti or Neos Marmaras — ideally with a private pool and a sea view. See <a href="/best/romantic-getaways">romantic getaways</a>.</p><h2>Day 1: Arrival</h2><p>About 1.5 hours from Thessaloniki Airport. Evening walk up to Parthenonas, the stone village above Neos Marmaras, and dinner with a view over the Toroneos Gulf.</p><h2>Day 2: Beach and spa</h2><p>A quiet morning at Kavourotrypes or Karydi, then an afternoon at a spa.</p><h2>Day 3: Mount Athos cruise</h2><p>From Ouranoupoli (about 1 hour 15 minutes from Nikiti), a half-day cruise along the coast of Mount Athos. Back in Sithonia, cocktails at sunset on the west coast and a seafood dinner.</p><h2>Day 4: Departure</h2><p>A slow morning, a walk on the beach and departure around noon.</p><h2>Budget (indicative, for two)</h2><ul><li>Boutique stay, 3 nights: €450-1000</li><li>Dinners: €200-400</li><li>Spa: €120-200</li><li>Cruise: €60-100</li><li>Car: €100-150</li></ul><h2>Tips</h2><ul><li>Book tables with a view a few days ahead</li><li>September is especially lovely: warm sea and calm</li><li>See the <a href="/guide/sunset-spots">sunset spots</a></li></ul>`,
      de: `<h2>Romantisches Chalkidiki für Paare — 4 Tage</h2><p>Privatsphäre, gutes Essen und Abende am Meer — für Jahrestage und Flitterwochen. Beste Monate: Mai, Juni und September.</p><h2>Unterkunft</h2><p>Eine Boutique-Villa oder ein Resort auf <a href="/guide/sithonia">Sithonia</a> — bei Vourvourou, Nikiti oder Neos Marmaras —, ideal mit eigenem Pool und Meerblick. Siehe <a href="/best/romantic-getaways">romantische Auszeiten</a>.</p><h2>Tag 1: Ankunft</h2><p>Etwa 1,5 Stunden vom Flughafen Thessaloniki. Abends hinauf nach Parthenonas, dem Steindorf über Neos Marmaras, und Abendessen mit Blick über den Toronäischen Golf.</p><h2>Tag 2: Strand und Spa</h2><p>Ein ruhiger Vormittag in Kavourotrypes oder Karydi, nachmittags ins Spa.</p><h2>Tag 3: Athos-Bootsfahrt</h2><p>Ab Ouranoupoli (etwa 1 Stunde 15 Minuten von Nikiti) eine halbtägige Fahrt entlang der Küste des Athos. Zurück auf Sithonia Cocktails bei Sonnenuntergang an der Westküste und ein Abendessen mit Meeresfrüchten.</p><h2>Tag 4: Abreise</h2><p>Ein langsamer Morgen, ein Strandspaziergang und Abreise gegen Mittag.</p><h2>Budget (Richtwerte, für zwei)</h2><ul><li>Boutique-Unterkunft, 3 Nächte: €450-1000</li><li>Abendessen: €200-400</li><li>Spa: €120-200</li><li>Bootsfahrt: €60-100</li><li>Auto: €100-150</li></ul><h2>Tipps</h2><ul><li>Tische mit Aussicht einige Tage vorher reservieren</li><li>Der September ist besonders schön: warmes Meer und Ruhe</li><li>Siehe die <a href="/guide/sunset-spots">Sonnenuntergangsplätze</a></li></ul>`,
      bg: `<h2>Романтична Халкидики за двойки — 4 дни</h2><p>Уединение, добра храна и вечери край морето — за годишнини и меден месец. Най-добри месеци: май, юни и септември.</p><h2>Къде да отседнете</h2><p>Бутик вила или курорт в <a href="/guide/sithonia">Ситония</a> — около Вурвуру, Никити или Неос Мармарас — идеално с частен басейн и гледка към морето. Вижте <a href="/best/romantic-getaways">романтични бягства</a>.</p><h2>Ден 1: Пристигане</h2><p>Около 1,5 часа от летище Солун. Вечерна разходка до Партенонас, каменното село над Неос Мармарас, и вечеря с гледка към Торонейския залив.</p><h2>Ден 2: Плаж и спа</h2><p>Спокойна сутрин в Кавуротрипес или Кариди, а следобед — спа.</p><h2>Ден 3: Круиз около Света гора</h2><p>От Уранополи (около 1 час и 15 минути от Никити) — полудневен круиз покрай брега на Света гора. Обратно в Ситония — коктейли по залез на западния бряг и вечеря с морски дарове.</p><h2>Ден 4: Отпътуване</h2><p>Спокойна сутрин, разходка по плажа и тръгване към обяд.</p><h2>Бюджет (ориентировъчно, за двама)</h2><ul><li>Бутик настаняване, 3 нощувки: €450-1000</li><li>Вечери: €200-400</li><li>Спа: €120-200</li><li>Круиз: €60-100</li><li>Кола: €100-150</li></ul><h2>Съвети</h2><ul><li>Резервирайте маси с гледка няколко дни по-рано</li><li>Септември е особено красив: топло море и спокойствие</li><li>Вижте <a href="/guide/sunset-spots">местата за залез</a></li></ul>`,
      ru: `<h2>Романтические Халкидики для пар — 4 дня</h2><p>Уединение, хорошая кухня и вечера у моря — для годовщин и медового месяца. Лучшие месяцы: май, июнь и сентябрь.</p><h2>Где жить</h2><p>Бутик-вилла или курорт на <a href="/guide/sithonia">Ситонии</a> — в районе Вурвуру, Никити или Неос-Мармараса — лучше с собственным бассейном и видом на море. См. <a href="/best/romantic-getaways">романтический отдых</a>.</p><h2>День 1: Приезд</h2><p>Около 1,5 часа от аэропорта Салоник. Вечерняя прогулка в Парфенонас, каменную деревню над Неос-Мармарасом, и ужин с видом на Торонейский залив.</p><h2>День 2: Пляж и спа</h2><p>Спокойное утро на Кавуротрипес или Кариди, днём — спа.</p><h2>День 3: Круиз вокруг Афона</h2><p>Из Уранополиса (около 1 часа 15 минут от Никити) — круиз на полдня вдоль побережья Афона. Вернувшись на Ситонию, коктейли на закате на западном берегу и ужин с морепродуктами.</p><h2>День 4: Отъезд</h2><p>Неспешное утро, прогулка по пляжу и отъезд около полудня.</p><h2>Бюджет (ориентировочно, на двоих)</h2><ul><li>Бутик-отель, 3 ночи: €450-1000</li><li>Ужины: €200-400</li><li>Спа: €120-200</li><li>Круиз: €60-100</li><li>Машина: €100-150</li></ul><h2>Советы</h2><ul><li>Столики с видом бронируйте за несколько дней</li><li>Сентябрь особенно хорош: тёплое море и тишина</li><li>См. <a href="/guide/sunset-spots">места для заката</a></li></ul>`,
      ro: `<h2>Halkidiki romantic pentru cupluri — 4 zile</h2><p>Intimitate, mâncare bună și seri lângă mare — pentru aniversări și luna de miere. Cele mai bune luni: mai, iunie și septembrie.</p><h2>Unde să stați</h2><p>O vilă boutique sau un resort în <a href="/guide/sithonia">Sithonia</a> — în jurul Vourvourou, Nikiti sau Neos Marmaras — ideal cu piscină privată și vedere la mare. Vedeți <a href="/best/romantic-getaways">escapadele romantice</a>.</p><h2>Ziua 1: Sosire</h2><p>Aproximativ 1,5 ore de la aeroportul din Salonic. Seara, o plimbare până la Parthenonas, satul de piatră de deasupra Neos Marmaras, și cină cu vedere spre golful Toroneos.</p><h2>Ziua 2: Plajă și spa</h2><p>O dimineață liniștită la Kavourotrypes sau Karydi, apoi o după-amiază la spa.</p><h2>Ziua 3: Croaziera Athos</h2><p>Din Ouranoupoli (circa 1 oră și 15 minute de Nikiti), o croazieră de jumătate de zi de-a lungul coastei Muntelui Athos. Înapoi în Sithonia, cocktailuri la apus pe coasta de vest și cină cu fructe de mare.</p><h2>Ziua 4: Plecare</h2><p>O dimineață fără grabă, o plimbare pe plajă și plecarea pe la prânz.</p><h2>Buget (orientativ, pentru doi)</h2><ul><li>Cazare boutique, 3 nopți: €450-1000</li><li>Cine: €200-400</li><li>Spa: €120-200</li><li>Croazieră: €60-100</li><li>Mașină: €100-150</li></ul><h2>Sfaturi</h2><ul><li>Rezervați mese cu priveliște cu câteva zile înainte</li><li>Septembrie este deosebit de frumos: mare caldă și liniște</li><li>Vedeți <a href="/guide/sunset-spots">locurile pentru apus</a></li></ul>`,
      sr: `<h2>Romantični Halkidiki za parove — 4 dana</h2><p>Privatnost, dobra hrana i večeri pored mora — za godišnjice i medeni mesec. Najbolji meseci: maj, jun i septembar.</p><h2>Gde odseći</h2><p>Butik vila ili rizort na <a href="/guide/sithonia">Sitoniji</a> — oko Vurvurua, Nikitija ili Neos Marmarasa — idealno s privatnim bazenom i pogledom na more. Pogledajte <a href="/best/romantic-getaways">romantične beg-destinacije</a>.</p><h2>Dan 1: Dolazak</h2><p>Oko 1,5 sat od aerodroma u Solunu. Večernja šetnja do Partenonasa, kamenog sela iznad Neos Marmarasa, i večera s pogledom na Toronejski zaliv.</p><h2>Dan 2: Plaža i spa</h2><p>Mirno jutro na Kavurotripesu ili Karidiju, a popodne u spa centru.</p><h2>Dan 3: Krstarenje oko Svete Gore</h2><p>Iz Uranupolisa (oko 1 sat i 15 minuta od Nikitija), poludnevno krstarenje duž obale Svete Gore. Po povratku na Sitoniju, kokteli u zalazak sunca na zapadnoj obali i večera s morskim plodovima.</p><h2>Dan 4: Polazak</h2><p>Lagano jutro, šetnja plažom i polazak oko podneva.</p><h2>Budžet (okvirno, za dvoje)</h2><ul><li>Butik smeštaj, 3 noći: €450-1000</li><li>Večere: €200-400</li><li>Spa: €120-200</li><li>Krstarenje: €60-100</li><li>Automobil: €100-150</li></ul><h2>Saveti</h2><ul><li>Stolove s pogledom rezervišite nekoliko dana ranije</li><li>Septembar je naročito lep: toplo more i mir</li><li>Pogledajte <a href="/guide/sunset-spots">mesta za zalazak sunca</a></li></ul>`,
    },
  },
  {
    slug: 'budget', icon: 'Wallet', color: 'green',
    title: { el: 'Χαλκιδική με Μικρό Budget — 5 Μέρες Έξυπνες Διακοπές', en: 'Budget Halkidiki — 5 Days on a Tight Budget', de: 'Chalkidiki mit kleinem Budget — 5 Tage clever reisen', bg: 'Халкидики с Малък Бюджет — 5 Дни Икономични Почивки', ru: 'Халкидики с Малым Бюджетом — 5 Дней Экономно', ro: 'Halkidiki cu Buget Mic — 5 Zile Inteligent', sr: 'Halkidiki sa Malim Budžetom — 5 Dana Pametno' },
    description: { el: 'Πώς να απολαύσεις τη Χαλκιδική με €350-500/άτομο για 5 μέρες', en: 'How to enjoy Halkidiki for €350-500/person over 5 days', de: 'Wie man Chalkidiki für €350-500 pro Person genießt', bg: 'Как да се насладиш на Халкидики за €350-500/човек', ru: 'Как насладиться Халкидиками за €350-500/человек', ro: 'Cum să te bucuri de Halkidiki pentru €350-500/persoană', sr: 'Kako uživati u Halkidikiju za €350-500/osobi' },
    metaTitle: { el: 'Χαλκιδική Budget 2026 — 5 Μέρες €350-500 (Φθηνά Καταλύματα + Tips)', en: 'Budget Halkidiki 2026 — 5 Days for €350-500 (Cheap Stays + Smart Tips)', de: 'Chalkidiki Budget 2026 — 5 Tage für €350-500', bg: 'Халкидики Бюджет 2026 — 5 Дни за €350-500', ru: 'Халкидики Бюджет 2026 — 5 Дней за €350-500', ro: 'Halkidiki Buget 2026 — 5 Zile pentru €350-500', sr: 'Halkidiki Budžet 2026 — 5 Dana za €350-500' },
    metaDesc: { el: 'Πλήρης budget οδηγός: €350-500/άτομο για 5 μέρες. Φθηνά καταλύματα, ταβέρνες, δωρεάν παραλίες.', en: 'Complete Halkidiki budget guide: €350-500/person for 5 days. Cheap stays, tavernas, free beaches, transport hacks.', de: 'Budget-Guide Chalkidiki: €350-500/Person für 5 Tage.', bg: 'Бюджет пътеводител Халкидики: €350-500/човек за 5 дни.', ru: 'Бюджет-гид Халкидики: €350-500/человек за 5 дней.', ro: 'Ghid buget Halkidiki: €350-500/persoană pentru 5 zile.', sr: 'Budžet vodič Halkidiki: €350-500/osobi za 5 dana.' },
    content: {
      el: `<h2>Χαλκιδική με μικρό budget — €350-500 το άτομο για 5 μέρες</h2><p>Η Χαλκιδική μπορεί να είναι οικονομική: δωρεάν παραλίες, κάμπινγκ και τίμιες ταβέρνες.</p><h2>Πού να μείνετε</h2><ul><li><strong>Κάμπινγκ</strong> στη Σιθωνία — δείτε το <a href="/guide/camping">κάμπινγκ στη Χαλκιδική</a></li><li><strong>Στούντιο και δωμάτια</strong> στη Νικήτη ή στα Νέα Μουδανιά — δείτε τα <a href="/listings">καταλύματα</a></li></ul><h2>Πώς θα φτάσετε</h2><p>Φθηνή πτήση ως τη Θεσσαλονίκη και μετά ΚΤΕΛ από τον σταθμό ΚΤΕΛ Χαλκιδικής. Για περισσότερη ελευθερία, μοιραστείτε ενοικιαζόμενο αυτοκίνητο με φίλους.</p><h2>Μέρα 1: Άφιξη και παραλία</h2><p>Τακτοποίηση και μπάνιο σε δωρεάν παραλία. Βραδινό: σουβλάκι ή γύρος σε τοπικό ψητοπωλείο.</p><h2>Μέρα 2: Παραλίες της Σιθωνίας</h2><p>Γύρος στις παραλίες της Σιθωνίας με πικνίκ — δείτε τις <a href="/best/beaches-sithonia">καλύτερες παραλίες</a>.</p><h2>Μέρα 3: Περπάτημα</h2><p>Ο Παρθενώνας πάνω από τον Νέο Μαρμαρά ή τα Αρχαία Στάγειρα κοντά στην Ολυμπιάδα — και απογευματινό μπάνιο.</p><h2>Μέρα 4: Πολύγυρος</h2><p>Η πρωτεύουσα της Χαλκιδικής: το Αρχαιολογικό Μουσείο και βόλτα στην πόλη.</p><h2>Μέρα 5: Αναχώρηση</h2><p>Τοπικά προϊόντα για αναμνηστικά — μέλι, ελιές, ελαιόλαδο — και επιστροφή με το λεωφορείο.</p><h2>Προϋπολογισμός (ανά άτομο)</h2><ul><li>Διαμονή, 4 νύχτες: €100-150</li><li>Φαγητό: €150-200</li><li>Μετακινήσεις: €60-100</li><li>Διάφορα: €40-50</li></ul><h2>Συμβουλές</h2><ul><li>Τα σούπερ μάρκετ είναι πολύ φθηνότερα από τις καντίνες</li><li>Πάρτε επαναχρησιμοποιούμενο μπουκάλι νερού</li><li>Χρησιμοποιείτε ΑΤΜ μεγάλων τραπεζών για να αποφύγετε υψηλές χρεώσεις</li><li>Καλύτεροι μήνες: Ιούνιος και Σεπτέμβριος</li></ul>`,
      en: `<h2>Halkidiki on a Budget — €350-500 per person for 5 days</h2><p>Halkidiki can be affordable: free beaches, campsites and honest tavernas.</p><h2>Where to stay</h2><ul><li><strong>Camping</strong> in Sithonia — see <a href="/guide/camping">camping in Halkidiki</a></li><li><strong>Studios and rooms</strong> in Nikiti or Nea Moudania — see <a href="/listings">accommodation</a></li></ul><h2>Getting there</h2><p>A low-cost flight to Thessaloniki, then the KTEL bus from the KTEL Halkidiki station. For more freedom, share a rental car with friends.</p><h2>Day 1: Arrival and beach</h2><p>Settle in and head to a free beach. Dinner: souvlaki or gyros at a local grill.</p><h2>Day 2: Sithonia beaches</h2><p>Beach hopping in Sithonia with a picnic — see the <a href="/best/beaches-sithonia">best beaches</a>.</p><h2>Day 3: A walk</h2><p>Parthenonas above Neos Marmaras, or Ancient Stagira near Olympiada — then an afternoon swim.</p><h2>Day 4: Polygyros</h2><p>The capital of Halkidiki: the Archaeological Museum and a walk in town.</p><h2>Day 5: Departure</h2><p>Local products as souvenirs — honey, olives, olive oil — and the bus back.</p><h2>Budget (per person)</h2><ul><li>Accommodation, 4 nights: €100-150</li><li>Food: €150-200</li><li>Transport: €60-100</li><li>Extras: €40-50</li></ul><h2>Tips</h2><ul><li>Supermarkets are much cheaper than beach kiosks</li><li>Bring a refillable water bottle</li><li>Use ATMs of the major banks to avoid high fees</li><li>Best months: June and September</li></ul>`,
      de: `<h2>Chalkidiki mit kleinem Budget — €350-500 pro Person für 5 Tage</h2><p>Chalkidiki kann günstig sein: kostenlose Strände, Campingplätze und ehrliche Tavernen.</p><h2>Unterkunft</h2><ul><li><strong>Camping</strong> auf Sithonia — siehe <a href="/guide/camping">Camping in Chalkidiki</a></li><li><strong>Studios und Zimmer</strong> in Nikiti oder Nea Moudania — siehe <a href="/listings">Unterkünfte</a></li></ul><h2>Anreise</h2><p>Ein Billigflug nach Thessaloniki, dann der KTEL-Bus vom KTEL-Busbahnhof Chalkidiki. Für mehr Freiheit einen Mietwagen mit Freunden teilen.</p><h2>Tag 1: Ankunft und Strand</h2><p>Einchecken und ab an einen kostenlosen Strand. Abends Souvlaki oder Gyros vom Grill.</p><h2>Tag 2: Strände von Sithonia</h2><p>Strand-Hopping auf Sithonia mit Picknick — siehe die <a href="/best/beaches-sithonia">schönsten Strände</a>.</p><h2>Tag 3: Eine Wanderung</h2><p>Parthenonas über Neos Marmaras oder das antike Stagira bei Olympiada — danach baden.</p><h2>Tag 4: Polygyros</h2><p>Die Hauptstadt Chalkidikis: das Archäologische Museum und ein Bummel durch den Ort.</p><h2>Tag 5: Abreise</h2><p>Lokale Produkte als Souvenir — Honig, Oliven, Olivenöl — und mit dem Bus zurück.</p><h2>Budget (pro Person)</h2><ul><li>Unterkunft, 4 Nächte: €100-150</li><li>Essen: €150-200</li><li>Transport: €60-100</li><li>Sonstiges: €40-50</li></ul><h2>Tipps</h2><ul><li>Supermärkte sind viel günstiger als Strandkioske</li><li>Eine nachfüllbare Wasserflasche mitnehmen</li><li>Geldautomaten großer Banken nutzen, um hohe Gebühren zu vermeiden</li><li>Beste Monate: Juni und September</li></ul>`,
      bg: `<h2>Халкидики с малък бюджет — €350-500 на човек за 5 дни</h2><p>Халкидики може да бъде достъпна: безплатни плажове, къмпинги и честни таверни.</p><h2>Къде да отседнете</h2><ul><li><strong>Къмпинг</strong> в Ситония — вижте <a href="/guide/camping">къмпинг в Халкидики</a></li><li><strong>Студия и стаи</strong> в Никити или Неа Муданя — вижте <a href="/listings">настаняване</a></li></ul><h2>Как да стигнете</h2><p>Нискотарифен полет до Солун, после автобус от автогарата КТЕЛ Халкидики. За повече свобода — споделена кола под наем с приятели.</p><h2>Ден 1: Пристигане и плаж</h2><p>Настаняване и плуване на безплатен плаж. Вечеря: сувлаки или гирос в местна скара.</p><h2>Ден 2: Плажовете на Ситония</h2><p>Обиколка на плажовете на Ситония с пикник — вижте <a href="/best/beaches-sithonia">най-добрите плажове</a>.</p><h2>Ден 3: Разходка</h2><p>Партенонас над Неос Мармарас или Древна Стагира край Олимпиада — и следобедно плуване.</p><h2>Ден 4: Полигирос</h2><p>Столицата на Халкидики: Археологическият музей и разходка в града.</p><h2>Ден 5: Отпътуване</h2><p>Местни продукти за спомен — мед, маслини, зехтин — и обратно с автобуса.</p><h2>Бюджет (на човек)</h2><ul><li>Настаняване, 4 нощувки: €100-150</li><li>Храна: €150-200</li><li>Транспорт: €60-100</li><li>Други: €40-50</li></ul><h2>Съвети</h2><ul><li>Супермаркетите са много по-евтини от плажните павилиони</li><li>Носете бутилка за многократна употреба</li><li>Ползвайте банкомати на големите банки, за да избегнете високи такси</li><li>Най-добри месеци: юни и септември</li></ul>`,
      ru: `<h2>Халкидики с небольшим бюджетом — €350-500 на человека за 5 дней</h2><p>Халкидики может быть недорогим: бесплатные пляжи, кемпинги и честные таверны.</p><h2>Где жить</h2><ul><li><strong>Кемпинг</strong> на Ситонии — см. <a href="/guide/camping">кемпинги Халкидики</a></li><li><strong>Студии и комнаты</strong> в Никити или Неа-Муданье — см. <a href="/listings">жильё</a></li></ul><h2>Как добраться</h2><p>Лоукостом до Салоник, затем автобус КТЕЛ с автовокзала КТЕЛ Халкидики. Для большей свободы — арендованная машина на компанию.</p><h2>День 1: Приезд и пляж</h2><p>Заселение и купание на бесплатном пляже. Ужин: сувлаки или гирос в местной гриль-таверне.</p><h2>День 2: Пляжи Ситонии</h2><p>Тур по пляжам Ситонии с пикником — см. <a href="/best/beaches-sithonia">лучшие пляжи</a>.</p><h2>День 3: Прогулка</h2><p>Парфенонас над Неос-Мармарасом или Древняя Стагира у Олимпиады — а днём купание.</p><h2>День 4: Полигирос</h2><p>Столица Халкидики: Археологический музей и прогулка по городу.</p><h2>День 5: Отъезд</h2><p>Местные продукты на память — мёд, оливки, оливковое масло — и обратно на автобусе.</p><h2>Бюджет (на человека)</h2><ul><li>Жильё, 4 ночи: €100-150</li><li>Еда: €150-200</li><li>Транспорт: €60-100</li><li>Прочее: €40-50</li></ul><h2>Советы</h2><ul><li>В супермаркетах гораздо дешевле, чем в пляжных киосках</li><li>Возьмите многоразовую бутылку для воды</li><li>Пользуйтесь банкоматами крупных банков, чтобы избежать высоких комиссий</li><li>Лучшие месяцы: июнь и сентябрь</li></ul>`,
      ro: `<h2>Halkidiki cu buget redus — €350-500 de persoană pentru 5 zile</h2><p>Halkidiki poate fi accesibil: plaje gratuite, campinguri și taverne cinstite.</p><h2>Unde să stați</h2><ul><li><strong>Camping</strong> în Sithonia — vedeți <a href="/guide/camping">campingul în Halkidiki</a></li><li><strong>Garsoniere și camere</strong> în Nikiti sau Nea Moudania — vedeți <a href="/listings">cazările</a></li></ul><h2>Cum ajungeți</h2><p>Un zbor low-cost până la Salonic, apoi autobuzul KTEL din autogara KTEL Halkidiki. Pentru mai multă libertate, împărțiți o mașină închiriată cu prietenii.</p><h2>Ziua 1: Sosire și plajă</h2><p>Cazare și baie la o plajă gratuită. Cina: souvlaki sau gyros la o rotiserie locală.</p><h2>Ziua 2: Plajele din Sithonia</h2><p>Tur al plajelor din Sithonia, cu picnic — vedeți <a href="/best/beaches-sithonia">cele mai frumoase plaje</a>.</p><h2>Ziua 3: O drumeție</h2><p>Parthenonas, deasupra Neos Marmaras, sau Stagira antică lângă Olympiada — apoi o baie după-amiaza.</p><h2>Ziua 4: Polygyros</h2><p>Capitala Halkidiki: Muzeul Arheologic și o plimbare prin oraș.</p><h2>Ziua 5: Plecare</h2><p>Produse locale ca suveniruri — miere, măsline, ulei de măsline — și înapoi cu autobuzul.</p><h2>Buget (de persoană)</h2><ul><li>Cazare, 4 nopți: €100-150</li><li>Mâncare: €150-200</li><li>Transport: €60-100</li><li>Altele: €40-50</li></ul><h2>Sfaturi</h2><ul><li>Supermarketurile sunt mult mai ieftine decât chioșcurile de pe plajă</li><li>Luați o sticlă de apă reutilizabilă</li><li>Folosiți bancomatele marilor bănci ca să evitați comisioanele mari</li><li>Cele mai bune luni: iunie și septembrie</li></ul>`,
      sr: `<h2>Halkidiki s malim budžetom — €350-500 po osobi za 5 dana</h2><p>Halkidiki može biti povoljan: besplatne plaže, kampovi i poštene taverne.</p><h2>Gde odseći</h2><ul><li><strong>Kamp</strong> na Sitoniji — pogledajte <a href="/guide/camping">kampovanje na Halkidikiju</a></li><li><strong>Studiji i sobe</strong> u Nikitiju ili Nea Mudaniji — pogledajte <a href="/listings">smeštaj</a></li></ul><h2>Kako stići</h2><p>Jeftin let do Soluna, zatim KTEL autobus sa stanice KTEL Halkidiki. Za više slobode, podelite iznajmljen automobil s prijateljima.</p><h2>Dan 1: Dolazak i plaža</h2><p>Smeštaj i kupanje na besplatnoj plaži. Večera: suvlaki ili giros u lokalnoj roštiljnici.</p><h2>Dan 2: Plaže Sitonije</h2><p>Obilazak plaža Sitonije uz piknik — pogledajte <a href="/best/beaches-sithonia">najlepše plaže</a>.</p><h2>Dan 3: Šetnja</h2><p>Partenonas iznad Neos Marmarasa ili Antička Stagira kod Olimpijade — a popodne kupanje.</p><h2>Dan 4: Poligiros</h2><p>Glavni grad Halkidikija: Arheološki muzej i šetnja gradom.</p><h2>Dan 5: Polazak</h2><p>Lokalni proizvodi za uspomenu — med, masline, maslinovo ulje — i autobusom nazad.</p><h2>Budžet (po osobi)</h2><ul><li>Smeštaj, 4 noći: €100-150</li><li>Hrana: €150-200</li><li>Prevoz: €60-100</li><li>Ostalo: €40-50</li></ul><h2>Saveti</h2><ul><li>Supermarketi su mnogo jeftiniji od kioska na plaži</li><li>Ponesite flašu za vodu za višekratnu upotrebu</li><li>Koristite bankomate velikih banaka da izbegnete visoke provizije</li><li>Najbolji meseci: jun i septembar</li></ul>`,
    },
  },
];

export function getItinerary(slug: string) {
  return ITINERARIES.find(i => i.slug === slug);
}
