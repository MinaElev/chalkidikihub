type L = Record<string, string>;

export interface CostGuide {
  slug: string;
  icon: string;
  color: string;
  title: L;
  description: L;
  metaTitle: L;
  metaDesc: L;
  content: L; // HTML with internal links and price tables
}

export const COST_GUIDES: CostGuide[] = [
  {
    slug: 'daily-budget', icon: 'Wallet', color: 'green',
    title: {
      el: 'Πόσο Κοστίζει η Χαλκιδική; Ημερήσιος Προϋπολογισμός',
      en: 'How Much Does Halkidiki Cost? Daily Budget Guide',
      de: 'Was kostet Chalkidiki? Tagesbudget-Ratgeber',
      bg: 'Колко струва Халкидики? Дневен бюджет',
      ru: 'Сколько стоит Халкидики? Дневной бюджет',
      ro: 'Cât costă Halkidiki? Ghid buget zilnic',
      sr: 'Koliko košta Halkidiki? Dnevni budžet',
    },
    description: {
      el: 'Αναλυτικός οδηγός ημερήσιου κόστους για κάθε τύπο ταξιδιώτη',
      en: 'Detailed daily cost guide for every type of traveler',
      de: 'Detaillierter Tageskostenführer für jeden Reisetyp',
      bg: 'Подробен пътеводител за дневни разходи',
      ru: 'Подробный путеводитель по ежедневным расходам',
      ro: 'Ghid detaliat al costurilor zilnice',
      sr: 'Detaljan vodič dnevnih troškova',
    },
    metaTitle: {
      el: 'Πόσο Κοστίζει η Χαλκιδική 2026 | Ημερήσιος Προϋπολογισμός',
      en: 'Halkidiki Cost 2026 | Daily Budget Guide',
      de: 'Chalkidiki Kosten 2026 | Tagesbudget',
      bg: 'Халкидики цени 2026 | Дневен бюджет',
      ru: 'Халкидики стоимость 2026 | Дневной бюджет',
      ro: 'Halkidiki costuri 2026 | Buget zilnic',
      sr: 'Halkidiki cene 2026 | Dnevni budžet',
    },
    metaDesc: {
      el: 'Πόσο κοστίζουν οι διακοπές στη Χαλκιδική; Ημερήσιος προϋπολογισμός για budget, mid-range και luxury ταξιδιώτες.',
      en: 'How much do holidays in Halkidiki cost? Daily budget breakdown for budget, mid-range, and luxury travelers.',
      de: 'Was kosten Ferien in Chalkidiki? Tagesbudget für Sparreisende, Mittelklasse und Luxus.',
      bg: 'Колко струва ваканцията в Халкидики? Дневен бюджет за икономични, средни и луксозни пътешественици.',
      ru: 'Сколько стоит отдых в Халкидики? Дневной бюджет для бюджетных, средних и люксовых путешественников.',
      ro: 'Cât costă vacanța în Halkidiki? Buget zilnic pentru călători economi, medii și de lux.',
      sr: 'Koliko košta odmor u Halkidikiju? Dnevni budžet za ekonomične, srednje i luksuzne putinike.',
    },
    content: {
      el: `<h2>Επισκόπηση Κόστους</h2>
<p>Η Χαλκιδική προσφέρει <strong>εξαιρετική σχέση ποιότητας-τιμής</strong> σε σύγκριση με άλλα ελληνικά νησιά. Είτε ταξιδεύετε με χαμηλό budget είτε αναζητάτε πολυτέλεια, υπάρχει κάτι για κάθε πορτοφόλι. Δείτε τον <a href="/guide/budget">οδηγό οικονομικών διακοπών</a> για περισσότερα tips.</p>

<h2>Ημερήσιος Προϋπολογισμός ανά Κατηγορία</h2>
<table>
<thead><tr><th>Κατηγορία</th><th>Διαμονή</th><th>Φαγητό</th><th>Μετακινήσεις</th><th>Δραστηριότητες</th><th>Σύνολο/ημέρα</th></tr></thead>
<tbody>
<tr><td><strong>Budget</strong></td><td>€15-25</td><td>€8-15</td><td>€5-10</td><td>€0-5</td><td><strong>€40-60</strong></td></tr>
<tr><td><strong>Mid-range</strong></td><td>€60-80</td><td>€15-30</td><td>€10-20</td><td>€10-20</td><td><strong>€80-150</strong></td></tr>
<tr><td><strong>Luxury</strong></td><td>€150-300</td><td>€40-60</td><td>€20-30</td><td>€30-50</td><td><strong>€200-400</strong></td></tr>
</tbody>
</table>

<h2>Budget Ταξιδιώτης (€40-60/ημέρα)</h2>
<p>Για τον οικονομικό ταξιδιώτη, η Χαλκιδική είναι πολύ προσιτή. Μείνετε σε <a href="/guide/camping">camping</a> (€15-25/νύχτα), φάτε σουβλάκια και street food (€8-12), και απολαύστε τις δωρεάν παραλίες. Τα <a href="/restaurants">εστιατόρια</a> προσφέρουν μεσημεριανά μενού από €8.</p>

<h2>Mid-Range Ταξιδιώτης (€80-150/ημέρα)</h2>
<p>Βρείτε <a href="/listings">κατάλυμα</a> σε ξενοδοχείο ή studio (€60-80/νύχτα), δειπνήστε σε <a href="/best/traditional-tavernas">παραδοσιακές ταβέρνες</a> (€15-25/άτομο) και απολαύστε οργανωμένες παραλίες (€10 για ξαπλώστρα). Η <a href="/guide/car-rental">ενοικίαση αυτοκινήτου</a> κοστίζει €30-45/ημέρα.</p>

<h2>Luxury Ταξιδιώτης (€200-400/ημέρα)</h2>
<p>Τα 5* <a href="/guide/hotels">ξενοδοχεία</a> ξεκινούν από €150/νύχτα. Πολλά resorts προσφέρουν <a href="/guide/all-inclusive">all-inclusive</a> πακέτα. Fine dining κοστίζει €40-60/άτομο, ενώ βόλτες με σκάφος ξεκινούν από €50/άτομο.</p>

<h2>Tips Εξοικονόμησης</h2>
<ul>
<li>Ταξιδέψτε <strong>Ιούνιο ή Σεπτέμβριο</strong> — 20-40% χαμηλότερες τιμές</li>
<li>Μαγειρέψτε μόνοι σας — τα supermarket είναι φθηνά</li>
<li>Χρησιμοποιήστε δωρεάν παραλίες αντί για οργανωμένες</li>
<li>Κλείστε κατάλυμα 2+ μήνες νωρίτερα</li>
</ul>

<h2>Ανά Εποχή</h2>
<table>
<thead><tr><th>Περίοδος</th><th>Τιμές σε σχέση με αιχμή</th></tr></thead>
<tbody>
<tr><td>Ιούνιος</td><td>-20% έως -30%</td></tr>
<tr><td>Ιούλιος-Αύγουστος</td><td>Αιχμή (100%)</td></tr>
<tr><td>Σεπτέμβριος</td><td>-25% έως -40%</td></tr>
</tbody>
</table>

<h2>Σύγκριση με Άλλους Προορισμούς</h2>
<p>Η Χαλκιδική είναι <strong>30-50% φθηνότερη</strong> από Μύκονο ή Σαντορίνη και 10-20% οικονομικότερη από Κρήτη. Σε σχέση με Κροατία ή Ιταλία, οι τιμές είναι παρόμοιες ή χαμηλότερες.</p>`,

      en: `<h2>Cost Overview</h2>
<p>Halkidiki offers <strong>excellent value for money</strong> compared to other Greek destinations. Whether you are traveling on a tight budget or seeking luxury, there is something for every wallet. Check our <a href="/guide/budget">budget holiday guide</a> for more tips.</p>

<h2>Daily Budget by Category</h2>
<table>
<thead><tr><th>Category</th><th>Accommodation</th><th>Food</th><th>Transport</th><th>Activities</th><th>Total/day</th></tr></thead>
<tbody>
<tr><td><strong>Budget</strong></td><td>€15-25</td><td>€8-15</td><td>€5-10</td><td>€0-5</td><td><strong>€40-60</strong></td></tr>
<tr><td><strong>Mid-range</strong></td><td>€60-80</td><td>€15-30</td><td>€10-20</td><td>€10-20</td><td><strong>€80-150</strong></td></tr>
<tr><td><strong>Luxury</strong></td><td>€150-300</td><td>€40-60</td><td>€20-30</td><td>€30-50</td><td><strong>€200-400</strong></td></tr>
</tbody>
</table>

<h2>Budget Traveler (€40-60/day)</h2>
<p>For the budget traveler, Halkidiki is very affordable. Stay at a <a href="/guide/camping">campsite</a> (€15-25/night), eat souvlaki and street food (€8-12), and enjoy the free beaches. <a href="/restaurants">Restaurants</a> offer lunch menus from €8.</p>

<h2>Mid-Range Traveler (€80-150/day)</h2>
<p><a href="/listings">Find accommodation</a> in a hotel or studio (€60-80/night), dine at <a href="/best/traditional-tavernas">traditional tavernas</a> (€15-25/person), and enjoy organized beaches (€10 for a sunbed). <a href="/guide/car-rental">Car rental</a> costs €30-45/day.</p>

<h2>Luxury Traveler (€200-400/day)</h2>
<p>5-star <a href="/guide/hotels">hotels</a> start from €150/night. Many resorts offer <a href="/guide/all-inclusive">all-inclusive</a> packages. Fine dining costs €40-60/person, while boat tours start from €50/person.</p>

<h2>Tips to Save Money</h2>
<ul>
<li>Travel in <strong>June or September</strong> — 20-40% lower prices</li>
<li>Cook your own meals — supermarkets are cheap</li>
<li>Use free beaches instead of organized ones</li>
<li>Book accommodation 2+ months ahead</li>
</ul>

<h2>By Season</h2>
<table>
<thead><tr><th>Period</th><th>Prices vs. peak</th></tr></thead>
<tbody>
<tr><td>June</td><td>-20% to -30%</td></tr>
<tr><td>July-August</td><td>Peak (100%)</td></tr>
<tr><td>September</td><td>-25% to -40%</td></tr>
</tbody>
</table>

<h2>Comparison with Other Destinations</h2>
<p>Halkidiki is <strong>30-50% cheaper</strong> than Mykonos or Santorini and 10-20% more affordable than Crete. Compared to Croatia or Italy, prices are similar or lower.</p>`,

      de: `<h2>Kostenüberblick</h2>
<p>Chalkidiki bietet ein <strong>hervorragendes Preis-Leistungs-Verhältnis</strong> im Vergleich zu anderen griechischen Zielen. Ob Sparreise oder Luxus — für jeden Geldbeutel ist etwas dabei. Siehe unseren <a href="/guide/budget">Budget-Urlaubsführer</a> für weitere Tipps.</p>

<h2>Tagesbudget nach Kategorie</h2>
<table>
<thead><tr><th>Kategorie</th><th>Unterkunft</th><th>Essen</th><th>Transport</th><th>Aktivitäten</th><th>Gesamt/Tag</th></tr></thead>
<tbody>
<tr><td><strong>Budget</strong></td><td>€15-25</td><td>€8-15</td><td>€5-10</td><td>€0-5</td><td><strong>€40-60</strong></td></tr>
<tr><td><strong>Mittelklasse</strong></td><td>€60-80</td><td>€15-30</td><td>€10-20</td><td>€10-20</td><td><strong>€80-150</strong></td></tr>
<tr><td><strong>Luxus</strong></td><td>€150-300</td><td>€40-60</td><td>€20-30</td><td>€30-50</td><td><strong>€200-400</strong></td></tr>
</tbody>
</table>

<h2>Sparreisende (€40-60/Tag)</h2>
<p>Übernachten Sie auf einem <a href="/guide/camping">Campingplatz</a> (€15-25/Nacht), essen Sie Souvlaki und Streetfood (€8-12) und genießen Sie freie Strände. <a href="/restaurants">Restaurants</a> bieten Mittagsmenüs ab €8.</p>

<h2>Mittelklasse (€80-150/Tag)</h2>
<p><a href="/listings">Finden Sie eine Unterkunft</a> im Hotel oder Studio (€60-80/Nacht), essen Sie in <a href="/best/traditional-tavernas">traditionellen Tavernen</a> (€15-25/Person). <a href="/guide/car-rental">Mietwagen</a> kosten €30-45/Tag.</p>

<h2>Luxus (€200-400/Tag)</h2>
<p>5-Sterne-<a href="/guide/hotels">Hotels</a> ab €150/Nacht. Viele Resorts bieten <a href="/guide/all-inclusive">All-inclusive</a>-Pakete. Fine Dining kostet €40-60/Person.</p>

<h2>Spartipps</h2>
<ul>
<li>Reisen Sie im <strong>Juni oder September</strong> — 20-40% günstiger</li>
<li>Kochen Sie selbst — Supermärkte sind günstig</li>
<li>Nutzen Sie freie Strände</li>
<li>Buchen Sie 2+ Monate im Voraus</li>
</ul>

<h2>Nach Saison</h2>
<table>
<thead><tr><th>Zeitraum</th><th>Preise vs. Hochsaison</th></tr></thead>
<tbody>
<tr><td>Juni</td><td>-20% bis -30%</td></tr>
<tr><td>Juli-August</td><td>Hochsaison (100%)</td></tr>
<tr><td>September</td><td>-25% bis -40%</td></tr>
</tbody>
</table>

<h2>Vergleich mit anderen Zielen</h2>
<p>Chalkidiki ist <strong>30-50% günstiger</strong> als Mykonos oder Santorini und 10-20% günstiger als Kreta.</p>`,

      bg: `<h2>Преглед на разходите</h2>
<p>Халкидики предлага <strong>отлично съотношение качество-цена</strong> в сравнение с други гръцки дестинации. Вижте нашия <a href="/guide/budget">пътеводител за бюджетна ваканция</a> за повече съвети.</p>

<h2>Дневен бюджет по категория</h2>
<table>
<thead><tr><th>Категория</th><th>Настаняване</th><th>Храна</th><th>Транспорт</th><th>Дейности</th><th>Общо/ден</th></tr></thead>
<tbody>
<tr><td><strong>Бюджетен</strong></td><td>€15-25</td><td>€8-15</td><td>€5-10</td><td>€0-5</td><td><strong>€40-60</strong></td></tr>
<tr><td><strong>Среден клас</strong></td><td>€60-80</td><td>€15-30</td><td>€10-20</td><td>€10-20</td><td><strong>€80-150</strong></td></tr>
<tr><td><strong>Луксозен</strong></td><td>€150-300</td><td>€40-60</td><td>€20-30</td><td>€30-50</td><td><strong>€200-400</strong></td></tr>
</tbody>
</table>

<h2>Бюджетен пътешественик (€40-60/ден)</h2>
<p>Отседнете на <a href="/guide/camping">къмпинг</a> (€15-25/нощ), хранете се със сувлаки (€8-12) и се наслаждавайте на безплатните плажове. <a href="/restaurants">Ресторантите</a> предлагат обедни менюта от €8.</p>

<h2>Среден клас (€80-150/ден)</h2>
<p><a href="/listings">Намерете настаняване</a> в хотел или студио (€60-80/нощ), вечеряйте в <a href="/best/traditional-tavernas">традиционни таверни</a> (€15-25/човек). <a href="/guide/car-rental">Наемането на кола</a> струва €30-45/ден.</p>

<h2>Луксозен (€200-400/ден)</h2>
<p>5-звездни <a href="/guide/hotels">хотели</a> от €150/нощ. Много курорти предлагат <a href="/guide/all-inclusive">all-inclusive</a> пакети.</p>

<h2>Съвети за спестяване</h2>
<ul>
<li>Пътувайте през <strong>юни или септември</strong> — 20-40% по-ниски цени</li>
<li>Гответе сами — супермаркетите са евтини</li>
<li>Резервирайте 2+ месеца предварително</li>
</ul>

<h2>По сезон</h2>
<table>
<thead><tr><th>Период</th><th>Цени спрямо пик</th></tr></thead>
<tbody>
<tr><td>Юни</td><td>-20% до -30%</td></tr>
<tr><td>Юли-Август</td><td>Пик (100%)</td></tr>
<tr><td>Септември</td><td>-25% до -40%</td></tr>
</tbody>
</table>

<h2>Сравнение с други дестинации</h2>
<p>Халкидики е <strong>30-50% по-евтина</strong> от Миконос или Санторини.</p>`,

      ru: `<h2>Обзор расходов</h2>
<p>Халкидики предлагает <strong>отличное соотношение цены и качества</strong> по сравнению с другими греческими направлениями. Смотрите наш <a href="/guide/budget">путеводитель по бюджетному отдыху</a> для дополнительных советов.</p>

<h2>Дневной бюджет по категориям</h2>
<table>
<thead><tr><th>Категория</th><th>Жильё</th><th>Еда</th><th>Транспорт</th><th>Развлечения</th><th>Итого/день</th></tr></thead>
<tbody>
<tr><td><strong>Бюджетный</strong></td><td>€15-25</td><td>€8-15</td><td>€5-10</td><td>€0-5</td><td><strong>€40-60</strong></td></tr>
<tr><td><strong>Средний</strong></td><td>€60-80</td><td>€15-30</td><td>€10-20</td><td>€10-20</td><td><strong>€80-150</strong></td></tr>
<tr><td><strong>Люкс</strong></td><td>€150-300</td><td>€40-60</td><td>€20-30</td><td>€30-50</td><td><strong>€200-400</strong></td></tr>
</tbody>
</table>

<h2>Бюджетный путешественник (€40-60/день)</h2>
<p>Остановитесь в <a href="/guide/camping">кемпинге</a> (€15-25/ночь), питайтесь сувлаки и стрит-фудом (€8-12), наслаждайтесь бесплатными пляжами. <a href="/restaurants">Рестораны</a> предлагают обеденные меню от €8.</p>

<h2>Средний класс (€80-150/день)</h2>
<p><a href="/listings">Найдите жильё</a> в отеле или студии (€60-80/ночь), ужинайте в <a href="/best/traditional-tavernas">традиционных тавернах</a> (€15-25/чел). <a href="/guide/car-rental">Аренда автомобиля</a> стоит €30-45/день.</p>

<h2>Люкс (€200-400/день)</h2>
<p>5-звёздочные <a href="/guide/hotels">отели</a> от €150/ночь. Многие курорты предлагают <a href="/guide/all-inclusive">всё включено</a>. Изысканные рестораны — €40-60/чел.</p>

<h2>Советы по экономии</h2>
<ul>
<li>Путешествуйте в <strong>июне или сентябре</strong> — цены ниже на 20-40%</li>
<li>Готовьте сами — супермаркеты дешёвые</li>
<li>Бронируйте жильё за 2+ месяца</li>
</ul>

<h2>По сезонам</h2>
<table>
<thead><tr><th>Период</th><th>Цены к пику</th></tr></thead>
<tbody>
<tr><td>Июнь</td><td>-20% до -30%</td></tr>
<tr><td>Июль-Август</td><td>Пик (100%)</td></tr>
<tr><td>Сентябрь</td><td>-25% до -40%</td></tr>
</tbody>
</table>

<h2>Сравнение с другими направлениями</h2>
<p>Халкидики <strong>на 30-50% дешевле</strong> Миконоса или Санторини.</p>`,

      ro: `<h2>Prezentare generală a costurilor</h2>
<p>Halkidiki oferă un <strong>raport excelent calitate-preț</strong> față de alte destinații grecești. Consultați <a href="/guide/budget">ghidul pentru vacanță economică</a> pentru mai multe sfaturi.</p>

<h2>Buget zilnic pe categorie</h2>
<table>
<thead><tr><th>Categorie</th><th>Cazare</th><th>Mâncare</th><th>Transport</th><th>Activități</th><th>Total/zi</th></tr></thead>
<tbody>
<tr><td><strong>Economic</strong></td><td>€15-25</td><td>€8-15</td><td>€5-10</td><td>€0-5</td><td><strong>€40-60</strong></td></tr>
<tr><td><strong>Mediu</strong></td><td>€60-80</td><td>€15-30</td><td>€10-20</td><td>€10-20</td><td><strong>€80-150</strong></td></tr>
<tr><td><strong>Lux</strong></td><td>€150-300</td><td>€40-60</td><td>€20-30</td><td>€30-50</td><td><strong>€200-400</strong></td></tr>
</tbody>
</table>

<h2>Călător economic (€40-60/zi)</h2>
<p>Stați la <a href="/guide/camping">camping</a> (€15-25/noapte), mâncați souvlaki și street food (€8-12), bucurați-vă de plajele gratuite. <a href="/restaurants">Restaurantele</a> oferă meniuri de prânz de la €8.</p>

<h2>Nivel mediu (€80-150/zi)</h2>
<p><a href="/listings">Găsiți cazare</a> în hotel sau studio (€60-80/noapte), luați cina la <a href="/best/traditional-tavernas">taverne tradiționale</a> (€15-25/persoană). <a href="/guide/car-rental">Închirierea mașinii</a> costă €30-45/zi.</p>

<h2>Lux (€200-400/zi)</h2>
<p><a href="/guide/hotels">Hotelurile</a> de 5 stele pornesc de la €150/noapte. Multe resorturi oferă pachete <a href="/guide/all-inclusive">all-inclusive</a>.</p>

<h2>Sfaturi pentru economisire</h2>
<ul>
<li>Călătoriți în <strong>iunie sau septembrie</strong> — prețuri cu 20-40% mai mici</li>
<li>Gătiți singuri — supermarketurile sunt ieftine</li>
<li>Rezervați cazare cu 2+ luni înainte</li>
</ul>

<h2>Pe sezoane</h2>
<table>
<thead><tr><th>Perioadă</th><th>Prețuri vs. vârf</th></tr></thead>
<tbody>
<tr><td>Iunie</td><td>-20% până la -30%</td></tr>
<tr><td>Iulie-August</td><td>Vârf (100%)</td></tr>
<tr><td>Septembrie</td><td>-25% până la -40%</td></tr>
</tbody>
</table>

<h2>Comparație cu alte destinații</h2>
<p>Halkidiki este <strong>cu 30-50% mai ieftină</strong> decât Mykonos sau Santorini.</p>`,

      sr: `<h2>Pregled troškova</h2>
<p>Halkidiki nudi <strong>odličan odnos cene i kvaliteta</strong> u poređenju sa drugim grčkim destinacijama. Pogledajte naš <a href="/guide/budget">vodič za ekonomičan odmor</a> za više saveta.</p>

<h2>Dnevni budžet po kategoriji</h2>
<table>
<thead><tr><th>Kategorija</th><th>Smeštaj</th><th>Hrana</th><th>Prevoz</th><th>Aktivnosti</th><th>Ukupno/dan</th></tr></thead>
<tbody>
<tr><td><strong>Ekonomični</strong></td><td>€15-25</td><td>€8-15</td><td>€5-10</td><td>€0-5</td><td><strong>€40-60</strong></td></tr>
<tr><td><strong>Srednji</strong></td><td>€60-80</td><td>€15-30</td><td>€10-20</td><td>€10-20</td><td><strong>€80-150</strong></td></tr>
<tr><td><strong>Luksuzni</strong></td><td>€150-300</td><td>€40-60</td><td>€20-30</td><td>€30-50</td><td><strong>€200-400</strong></td></tr>
</tbody>
</table>

<h2>Ekonomični putnik (€40-60/dan)</h2>
<p>Odsjajte na <a href="/guide/camping">kampingu</a> (€15-25/noć), jedite suvlaki (€8-12) i uživajte na besplatnim plažama. <a href="/restaurants">Restorani</a> nude ručak menije od €8.</p>

<h2>Srednji nivo (€80-150/dan)</h2>
<p><a href="/listings">Pronađite smeštaj</a> u hotelu ili studiju (€60-80/noć), večerajte u <a href="/best/traditional-tavernas">tradicionalnim tavernama</a> (€15-25/osoba). <a href="/guide/car-rental">Iznajmljivanje auta</a> košta €30-45/dan.</p>

<h2>Luksuzni (€200-400/dan)</h2>
<p>Hoteli sa 5 zvezdica od €150/noć. Mnogi rizoti nude <a href="/guide/all-inclusive">all-inclusive</a> pakete.</p>

<h2>Saveti za uštedu</h2>
<ul>
<li>Putujte u <strong>junu ili septembru</strong> — cene niže za 20-40%</li>
<li>Kuvajte sami — supermarketi su jeftini</li>
<li>Rezervišite smeštaj 2+ meseca unapred</li>
</ul>

<h2>Po sezoni</h2>
<table>
<thead><tr><th>Period</th><th>Cene vs. vrhunac</th></tr></thead>
<tbody>
<tr><td>Jun</td><td>-20% do -30%</td></tr>
<tr><td>Jul-Avgust</td><td>Vrhunac (100%)</td></tr>
<tr><td>Septembar</td><td>-25% do -40%</td></tr>
</tbody>
</table>

<h2>Poređenje sa drugim destinacijama</h2>
<p>Halkidiki je <strong>30-50% jeftiniji</strong> od Mikonosa ili Santorinija.</p>`,
    },
  },

  {
    slug: 'food-prices', icon: 'UtensilsCrossed', color: 'orange',
    title: {
      el: 'Τιμές Φαγητού & Εστιατορίων στη Χαλκιδική 2026',
      en: 'Food & Restaurant Prices in Halkidiki 2026',
      de: 'Essen & Restaurantpreise in Chalkidiki 2026',
      bg: 'Цени на храна и ресторанти в Халкидики 2026',
      ru: 'Цены на еду и рестораны в Халкидики 2026',
      ro: 'Prețuri mâncare și restaurante Halkidiki 2026',
      sr: 'Cene hrane i restorana u Halkidikiju 2026',
    },
    description: {
      el: 'Αναλυτικός τιμοκατάλογος φαγητού και ποτών',
      en: 'Detailed food and drink price list',
      de: 'Detaillierte Speise- und Getränkepreisliste',
      bg: 'Подробен ценоразпис на храна и напитки',
      ru: 'Подробный прайс-лист на еду и напитки',
      ro: 'Lista detaliată de prețuri pentru mâncare și băuturi',
      sr: 'Detaljan cenovnik hrane i pića',
    },
    metaTitle: {
      el: 'Τιμές Φαγητού Χαλκιδική 2026 | Εστιατόρια & Ταβέρνες',
      en: 'Food Prices Halkidiki 2026 | Restaurants & Tavernas',
      de: 'Essenspreise Chalkidiki 2026 | Restaurants & Tavernen',
      bg: 'Цени на храна Халкидики 2026 | Ресторанти',
      ru: 'Цены на еду Халкидики 2026 | Рестораны и таверны',
      ro: 'Prețuri mâncare Halkidiki 2026 | Restaurante',
      sr: 'Cene hrane Halkidiki 2026 | Restorani',
    },
    metaDesc: {
      el: 'Πόσο κοστίζει το φαγητό στη Χαλκιδική; Τιμές εστιατορίων, ταβερνών, καφέ, σουβλάκι, θαλασσινά, supermarket.',
      en: 'How much does food cost in Halkidiki? Restaurant, taverna, coffee, souvlaki, seafood, supermarket prices.',
      de: 'Was kostet Essen in Chalkidiki? Restaurant-, Taverne-, Kaffee-, Souvlaki-, Meeresfrüchte-Preise.',
      bg: 'Колко струва храната в Халкидики? Цени на ресторанти, таверни, кафе, сувлаки, морски дарове.',
      ru: 'Сколько стоит еда в Халкидики? Цены ресторанов, таверн, кофе, сувлаки, морепродуктов.',
      ro: 'Cât costă mâncarea în Halkidiki? Prețuri restaurante, taverne, cafea, souvlaki, fructe de mare.',
      sr: 'Koliko košta hrana u Halkidikiju? Cene restorana, taverni, kafe, suvlaki, morskih plodova.',
    },
    content: {
      el: `<h2>Επισκόπηση</h2>
<p>Η Χαλκιδική προσφέρει <strong>εξαιρετικό φαγητό σε λογικές τιμές</strong>. Από σουβλάκι στο χέρι μέχρι gourmet θαλασσινά, υπάρχει κάτι για κάθε γεύση και πορτοφόλι. Ανακαλύψτε τα καλύτερα <a href="/restaurants">εστιατόρια</a> της περιοχής.</p>

<h2>Τιμοκατάλογος Φαγητού & Ποτών</h2>
<table>
<thead><tr><th>Προϊόν</th><th>Τιμή (€)</th></tr></thead>
<tbody>
<tr><td>Ελληνικός καφές</td><td>€1,50-2,50</td></tr>
<tr><td>Freddo cappuccino</td><td>€3-4</td></tr>
<tr><td>Σουβλάκι (πίτα)</td><td>€3-4</td></tr>
<tr><td>Κυρίως πιάτο ταβέρνας</td><td>€8-15</td></tr>
<tr><td>Πιάτο θαλασσινών</td><td>€12-25</td></tr>
<tr><td>Φρέσκο ψάρι (ανά κιλό)</td><td>€40-60</td></tr>
<tr><td>Μπύρα (500ml)</td><td>€4-6</td></tr>
<tr><td>Κρασί (ποτήρι)</td><td>€4-7</td></tr>
<tr><td>Οικογενειακό δείπνο (4 άτομα)</td><td>€40-70</td></tr>
<tr><td>Εβδομαδιαία αγορά supermarket</td><td>€80-120</td></tr>
</tbody>
</table>

<h2>Πού να Φάτε Οικονομικά</h2>
<p>Τα σουβλατζίδικα και οι <a href="/best/traditional-tavernas">παραδοσιακές ταβέρνες</a> προσφέρουν τις καλύτερες τιμές. Τα μεσημεριανά μενού (€8-12) είναι ιδανικά. Δοκιμάστε τις τοπικές αγορές για φρέσκα φρούτα και λαχανικά.</p>

<h2>Θαλασσινά</h2>
<p>Τα <a href="/best/seafood-restaurants">εστιατόρια θαλασσινών</a> προσφέρουν φρέσκο ψάρι, χταπόδι σχάρας (€10-14) και γαρίδες σαγανάκι (€12-16). Το φρέσκο ψάρι πωλείται ανά κιλό — ρωτήστε πάντα την τιμή πριν παραγγείλετε.</p>

<h2>Τοπικές Γεύσεις</h2>
<p>Ανακαλύψτε τον <a href="/guide/food-and-wine">οδηγό φαγητού και κρασιού</a> για τις τοπικές σπεσιαλιτέ: μέλι Χαλκιδικής, ελιές, τσίπουρο, τοπικά κρασιά.</p>

<h2>Tips Εξοικονόμησης</h2>
<ul>
<li>Παραγγείλτε μερίδες για μοίρασμα — οι ελληνικές μερίδες είναι μεγάλες</li>
<li>Πιείτε νερό βρύσης (είναι ασφαλές) ή αγοράστε μεγάλα μπουκάλια</li>
<li>Αποφύγετε εστιατόρια στο πρώτο «λιμάνι» — τα πιο πίσω είναι φθηνότερα</li>
<li>Ψωνίστε στα τοπικά supermarket — <strong>Masoutis</strong> και <strong>Lidl</strong> έχουν καλές τιμές</li>
</ul>

<h2>Ανά Εποχή</h2>
<p>Οι τιμές παραμένουν σχετικά σταθερές. Κάποια εστιατόρια σε τουριστικά σημεία ανεβάζουν 10-15% τον Αύγουστο. Τα σουβλάκια και τα supermarket δεν επηρεάζονται.</p>

<h2>Σύγκριση</h2>
<p>Η Χαλκιδική είναι <strong>πιο οικονομική</strong> από τα νησιά, με τιμές ταβέρνας 20-30% χαμηλότερες από Μύκονο. Ανάλογη με Πελοπόννησο και Πήλιο. Βρείτε <a href="/listings">κατάλυμα με κουζίνα</a> για μέγιστη εξοικονόμηση.</p>`,

      en: `<h2>Overview</h2>
<p>Halkidiki offers <strong>excellent food at reasonable prices</strong>. From hand-held souvlaki to gourmet seafood, there is something for every taste and budget. Discover the best <a href="/restaurants">restaurants</a> in the area.</p>

<h2>Food & Drink Price List</h2>
<table>
<thead><tr><th>Item</th><th>Price (€)</th></tr></thead>
<tbody>
<tr><td>Greek coffee</td><td>€1.50-2.50</td></tr>
<tr><td>Freddo cappuccino</td><td>€3-4</td></tr>
<tr><td>Souvlaki wrap</td><td>€3-4</td></tr>
<tr><td>Taverna main course</td><td>€8-15</td></tr>
<tr><td>Seafood dish</td><td>€12-25</td></tr>
<tr><td>Fresh fish (per kg)</td><td>€40-60</td></tr>
<tr><td>Beer (500ml)</td><td>€4-6</td></tr>
<tr><td>Wine (glass)</td><td>€4-7</td></tr>
<tr><td>Family dinner (4 people)</td><td>€40-70</td></tr>
<tr><td>Weekly supermarket shop</td><td>€80-120</td></tr>
</tbody>
</table>

<h2>Where to Eat on a Budget</h2>
<p>Souvlaki shops and <a href="/best/traditional-tavernas">traditional tavernas</a> offer the best value. Lunch menus (€8-12) are a great deal. Try local markets for fresh fruit and vegetables.</p>

<h2>Seafood</h2>
<p><a href="/best/seafood-restaurants">Seafood restaurants</a> serve fresh fish, grilled octopus (€10-14), and shrimp saganaki (€12-16). Fresh fish is sold by weight — always ask the price before ordering.</p>

<h2>Local Flavors</h2>
<p>Explore our <a href="/guide/food-and-wine">food and wine guide</a> for local specialties: Halkidiki honey, olives, tsipouro, and local wines.</p>

<h2>Tips to Save Money</h2>
<ul>
<li>Order sharing plates — Greek portions are generous</li>
<li>Drink tap water (it is safe) or buy large bottles</li>
<li>Avoid restaurants on the main waterfront — those further back are cheaper</li>
<li>Shop at local supermarkets — <strong>Masoutis</strong> and <strong>Lidl</strong> have good prices</li>
</ul>

<h2>By Season</h2>
<p>Prices remain relatively stable throughout the season. Some restaurants in tourist hotspots increase prices by 10-15% in August. Souvlaki and supermarket prices are unaffected.</p>

<h2>Comparison</h2>
<p>Halkidiki is <strong>more affordable</strong> than the islands, with taverna prices 20-30% lower than Mykonos. Similar to Peloponnese and Pelion. <a href="/listings">Find accommodation with a kitchen</a> for maximum savings.</p>`,

      de: `<h2>Überblick</h2>
<p>Chalkidiki bietet <strong>hervorragendes Essen zu vernünftigen Preisen</strong>. Vom Souvlaki bis zu Gourmet-Meeresfrüchten — für jeden Geschmack ist etwas dabei. Entdecken Sie die besten <a href="/restaurants">Restaurants</a>.</p>

<h2>Speise- & Getränkepreise</h2>
<table>
<thead><tr><th>Produkt</th><th>Preis (€)</th></tr></thead>
<tbody>
<tr><td>Griechischer Kaffee</td><td>€1,50-2,50</td></tr>
<tr><td>Freddo Cappuccino</td><td>€3-4</td></tr>
<tr><td>Souvlaki (Pita)</td><td>€3-4</td></tr>
<tr><td>Hauptgericht Taverne</td><td>€8-15</td></tr>
<tr><td>Meeresfrüchtegericht</td><td>€12-25</td></tr>
<tr><td>Frischer Fisch (pro kg)</td><td>€40-60</td></tr>
<tr><td>Bier (500ml)</td><td>€4-6</td></tr>
<tr><td>Wein (Glas)</td><td>€4-7</td></tr>
<tr><td>Familienessen (4 Personen)</td><td>€40-70</td></tr>
<tr><td>Wocheneinkauf Supermarkt</td><td>€80-120</td></tr>
</tbody>
</table>

<h2>Günstig essen</h2>
<p>Souvlaki-Läden und <a href="/best/traditional-tavernas">traditionelle Tavernen</a> bieten das beste Preis-Leistungs-Verhältnis. Mittagsmenüs (€8-12) sind ein tolles Angebot.</p>

<h2>Meeresfrüchte</h2>
<p><a href="/best/seafood-restaurants">Fischrestaurants</a> servieren frischen Fisch, gegrillten Oktopus (€10-14) und Garnelen Saganaki (€12-16).</p>

<h2>Lokale Spezialitäten</h2>
<p>Entdecken Sie unseren <a href="/guide/food-and-wine">Essens- und Weinführer</a> für lokale Spezialitäten: Honig, Oliven, Tsipouro und lokale Weine.</p>

<h2>Spartipps</h2>
<ul>
<li>Bestellen Sie Gerichte zum Teilen — griechische Portionen sind großzügig</li>
<li>Trinken Sie Leitungswasser (es ist sicher)</li>
<li>Kaufen Sie in lokalen Supermärkten ein — <strong>Masoutis</strong> und <strong>Lidl</strong></li>
</ul>

<h2>Vergleich</h2>
<p>Chalkidiki ist <strong>günstiger</strong> als die Inseln. Tavernenpreise sind 20-30% niedriger als auf Mykonos. <a href="/listings">Finden Sie eine Unterkunft mit Küche</a> für maximale Einsparungen.</p>`,

      bg: `<h2>Преглед</h2>
<p>Халкидики предлага <strong>отлична храна на разумни цени</strong>. От сувлаки до изискани морски дарове. Открийте най-добрите <a href="/restaurants">ресторанти</a>.</p>

<h2>Ценоразпис на храна и напитки</h2>
<table>
<thead><tr><th>Продукт</th><th>Цена (€)</th></tr></thead>
<tbody>
<tr><td>Гръцко кафе</td><td>€1,50-2,50</td></tr>
<tr><td>Freddo cappuccino</td><td>€3-4</td></tr>
<tr><td>Сувлаки (пита)</td><td>€3-4</td></tr>
<tr><td>Основно ястие в таверна</td><td>€8-15</td></tr>
<tr><td>Ястие с морски дарове</td><td>€12-25</td></tr>
<tr><td>Прясна риба (на кг)</td><td>€40-60</td></tr>
<tr><td>Бира (500ml)</td><td>€4-6</td></tr>
<tr><td>Вино (чаша)</td><td>€4-7</td></tr>
<tr><td>Семейна вечеря (4 човека)</td><td>€40-70</td></tr>
<tr><td>Седмична покупка от супермаркет</td><td>€80-120</td></tr>
</tbody>
</table>

<h2>Къде да хапнете евтино</h2>
<p>Заведенията за сувлаки и <a href="/best/traditional-tavernas">традиционните таверни</a> предлагат най-добри цени. Обедните менюта (€8-12) са изгодни.</p>

<h2>Морски дарове</h2>
<p><a href="/best/seafood-restaurants">Ресторантите с морски дарове</a> сервират прясна риба, печен октопод (€10-14) и скариди саганаки (€12-16).</p>

<h2>Местни вкусове</h2>
<p>Вижте нашия <a href="/guide/food-and-wine">пътеводител за храна и вино</a> за местни специалитети.</p>

<h2>Съвети за спестяване</h2>
<ul>
<li>Поръчвайте ястия за споделяне — гръцките порции са щедри</li>
<li>Пазарувайте в местни супермаркети — <strong>Masoutis</strong> и <strong>Lidl</strong></li>
</ul>

<h2>Сравнение</h2>
<p>Халкидики е <strong>по-достъпна</strong> от островите. <a href="/listings">Намерете настаняване с кухня</a> за максимална икономия.</p>`,

      ru: `<h2>Обзор</h2>
<p>Халкидики предлагает <strong>отличную еду по разумным ценам</strong>. От сувлаки до изысканных морепродуктов. Откройте лучшие <a href="/restaurants">рестораны</a>.</p>

<h2>Прайс-лист еды и напитков</h2>
<table>
<thead><tr><th>Продукт</th><th>Цена (€)</th></tr></thead>
<tbody>
<tr><td>Греческий кофе</td><td>€1,50-2,50</td></tr>
<tr><td>Фреддо капучино</td><td>€3-4</td></tr>
<tr><td>Сувлаки (пита)</td><td>€3-4</td></tr>
<tr><td>Основное блюдо таверны</td><td>€8-15</td></tr>
<tr><td>Блюдо из морепродуктов</td><td>€12-25</td></tr>
<tr><td>Свежая рыба (за кг)</td><td>€40-60</td></tr>
<tr><td>Пиво (500мл)</td><td>€4-6</td></tr>
<tr><td>Вино (бокал)</td><td>€4-7</td></tr>
<tr><td>Семейный ужин (4 чел.)</td><td>€40-70</td></tr>
<tr><td>Продукты на неделю</td><td>€80-120</td></tr>
</tbody>
</table>

<h2>Где поесть недорого</h2>
<p>Сувлачные и <a href="/best/traditional-tavernas">традиционные таверны</a> предлагают лучшие цены. Обеденные меню (€8-12) — отличная сделка.</p>

<h2>Морепродукты</h2>
<p><a href="/best/seafood-restaurants">Рестораны морепродуктов</a> подают свежую рыбу, осьминога на гриле (€10-14), креветки саганаки (€12-16).</p>

<h2>Местные вкусы</h2>
<p>Изучите наш <a href="/guide/food-and-wine">путеводитель по еде и вину</a> — мёд, оливки, ципуро, местные вина.</p>

<h2>Советы по экономии</h2>
<ul>
<li>Заказывайте блюда на двоих — греческие порции щедрые</li>
<li>Покупайте в местных супермаркетах — <strong>Masoutis</strong> и <strong>Lidl</strong></li>
</ul>

<h2>Сравнение</h2>
<p>Халкидики <strong>доступнее</strong> островов. <a href="/listings">Найдите жильё с кухней</a> для максимальной экономии.</p>`,

      ro: `<h2>Prezentare generală</h2>
<p>Halkidiki oferă <strong>mâncare excelentă la prețuri rezonabile</strong>. De la souvlaki la fructe de mare gourmet. Descoperiți cele mai bune <a href="/restaurants">restaurante</a>.</p>

<h2>Lista de prețuri</h2>
<table>
<thead><tr><th>Produs</th><th>Preț (€)</th></tr></thead>
<tbody>
<tr><td>Cafea grecească</td><td>€1,50-2,50</td></tr>
<tr><td>Freddo cappuccino</td><td>€3-4</td></tr>
<tr><td>Souvlaki (pita)</td><td>€3-4</td></tr>
<tr><td>Fel principal tavernă</td><td>€8-15</td></tr>
<tr><td>Fructe de mare</td><td>€12-25</td></tr>
<tr><td>Pește proaspăt (per kg)</td><td>€40-60</td></tr>
<tr><td>Bere (500ml)</td><td>€4-6</td></tr>
<tr><td>Vin (pahar)</td><td>€4-7</td></tr>
<tr><td>Cină în familie (4 pers.)</td><td>€40-70</td></tr>
<tr><td>Cumpărături săptămânale</td><td>€80-120</td></tr>
</tbody>
</table>

<h2>Unde să mâncați economic</h2>
<p>Magazinele de souvlaki și <a href="/best/traditional-tavernas">tavernele tradiționale</a> oferă cele mai bune prețuri.</p>

<h2>Fructe de mare</h2>
<p><a href="/best/seafood-restaurants">Restaurantele de fructe de mare</a> servesc pește proaspăt, caracatiță la grătar (€10-14) și creveți saganaki (€12-16).</p>

<h2>Arome locale</h2>
<p>Explorați <a href="/guide/food-and-wine">ghidul de mâncare și vin</a> pentru specialități locale.</p>

<h2>Sfaturi pentru economisire</h2>
<ul>
<li>Comandați porții de împărțit — porțiile grecești sunt generoase</li>
<li>Cumpărați de la supermarketuri locale — <strong>Masoutis</strong> și <strong>Lidl</strong></li>
</ul>

<h2>Comparație</h2>
<p>Halkidiki este <strong>mai accesibilă</strong> decât insulele. <a href="/listings">Găsiți cazare cu bucătărie</a> pentru economii maxime.</p>`,

      sr: `<h2>Pregled</h2>
<p>Halkidiki nudi <strong>odličnu hranu po razumnim cenama</strong>. Od suvlakija do gurmanlskih morskih plodova. Otkrijte najbolje <a href="/restaurants">restorane</a>.</p>

<h2>Cenovnik hrane i pića</h2>
<table>
<thead><tr><th>Proizvod</th><th>Cena (€)</th></tr></thead>
<tbody>
<tr><td>Grčka kafa</td><td>€1,50-2,50</td></tr>
<tr><td>Freddo kapučino</td><td>€3-4</td></tr>
<tr><td>Suvlaki (pita)</td><td>€3-4</td></tr>
<tr><td>Glavno jelo u taverni</td><td>€8-15</td></tr>
<tr><td>Jelo od morskih plodova</td><td>€12-25</td></tr>
<tr><td>Sveža riba (po kg)</td><td>€40-60</td></tr>
<tr><td>Pivo (500ml)</td><td>€4-6</td></tr>
<tr><td>Vino (čaša)</td><td>€4-7</td></tr>
<tr><td>Porodična večera (4 osobe)</td><td>€40-70</td></tr>
<tr><td>Nedeljne namirnice</td><td>€80-120</td></tr>
</tbody>
</table>

<h2>Gde jesti jeftino</h2>
<p>Suvlaki radnje i <a href="/best/traditional-tavernas">tradicionalne taverne</a> nude najbolje cene.</p>

<h2>Morski plodovi</h2>
<p><a href="/best/seafood-restaurants">Restorani morskih plodova</a> služe svežu ribu, hobotnice na žaru (€10-14) i gambore saganaki (€12-16).</p>

<h2>Lokalni ukusi</h2>
<p>Istražite naš <a href="/guide/food-and-wine">vodič za hranu i vino</a> za lokalne specijalitete.</p>

<h2>Saveti za uštedu</h2>
<ul>
<li>Naručite porcije za deljenje — grčke porcije su izdašne</li>
<li>Kupujte u lokalnim supermarketima — <strong>Masoutis</strong> i <strong>Lidl</strong></li>
</ul>

<h2>Poređenje</h2>
<p>Halkidiki je <strong>pristupačniji</strong> od ostrva. <a href="/listings">Pronađite smeštaj sa kuhinjom</a> za maksimalnu uštedu.</p>`,
    },
  },

  {
    slug: 'accommodation-prices', icon: 'Hotel', color: 'blue',
    title: {
      el: 'Τιμές Διαμονής στη Χαλκιδική 2026',
      en: 'Accommodation Prices in Halkidiki 2026',
      de: 'Unterkunftspreise in Chalkidiki 2026',
      bg: 'Цени за настаняване в Халкидики 2026',
      ru: 'Цены на жильё в Халкидики 2026',
      ro: 'Prețuri cazare Halkidiki 2026',
      sr: 'Cene smeštaja u Halkidikiju 2026',
    },
    description: {
      el: 'Αναλυτικές τιμές καταλυμάτων ανά τύπο και εποχή',
      en: 'Detailed accommodation prices by type and season',
      de: 'Detaillierte Unterkunftspreise nach Typ und Saison',
      bg: 'Подробни цени за настаняване по тип и сезон',
      ru: 'Подробные цены на жильё по типу и сезону',
      ro: 'Prețuri detaliate cazare pe tip și sezon',
      sr: 'Detaljne cene smeštaja po tipu i sezoni',
    },
    metaTitle: {
      el: 'Τιμές Διαμονής Χαλκιδική 2026 | Ξενοδοχεία & Καταλύματα',
      en: 'Accommodation Prices Halkidiki 2026 | Hotels & Rentals',
      de: 'Unterkunftspreise Chalkidiki 2026 | Hotels & Ferienwohnungen',
      bg: 'Цени за настаняване Халкидики 2026 | Хотели',
      ru: 'Цены на жильё Халкидики 2026 | Отели и апартаменты',
      ro: 'Prețuri cazare Halkidiki 2026 | Hoteluri',
      sr: 'Cene smeštaja Halkidiki 2026 | Hoteli',
    },
    metaDesc: {
      el: 'Τιμές ξενοδοχείων, studio, βιλών και camping στη Χαλκιδική 2026. Σύγκριση ανά εποχή και περιοχή.',
      en: 'Hotel, studio, villa, and camping prices in Halkidiki 2026. Comparison by season and area.',
      de: 'Hotel-, Studio-, Villa- und Campingpreise in Chalkidiki 2026. Vergleich nach Saison und Gebiet.',
      bg: 'Цени на хотели, студиа, вили и къмпинги в Халкидики 2026.',
      ru: 'Цены на отели, студии, виллы и кемпинги в Халкидики 2026.',
      ro: 'Prețuri hoteluri, studiouri, vile și camping Halkidiki 2026.',
      sr: 'Cene hotela, studija, vila i kampova u Halkidikiju 2026.',
    },
    content: {
      el: `<h2>Επισκόπηση</h2>
<p>Η Χαλκιδική προσφέρει <strong>μεγάλη ποικιλία καταλυμάτων</strong> — από οικονομικά camping μέχρι πολυτελή 5* resorts. Οι τιμές εξαρτώνται από τον τύπο, την εποχή και την περιοχή. <a href="/listings">Βρείτε κατάλυμα</a> που ταιριάζει στο budget σας.</p>

<h2>Τιμές ανά Τύπο & Εποχή</h2>
<table>
<thead><tr><th>Τύπος</th><th>Ιούνιος</th><th>Ιούλ-Αύγ</th><th>Σεπτέμβριος</th></tr></thead>
<tbody>
<tr><td><a href="/guide/camping">Camping</a></td><td>€15-25</td><td>€20-30</td><td>€15-25</td></tr>
<tr><td>Studio/Διαμέρισμα</td><td>€40-70</td><td>€60-120</td><td>€40-70</td></tr>
<tr><td>3* Ξενοδοχείο</td><td>€60-100</td><td>€80-150</td><td>€50-90</td></tr>
<tr><td>4* Ξενοδοχείο</td><td>€80-150</td><td>€120-250</td><td>€70-130</td></tr>
<tr><td>5* / Resort</td><td>€150-400</td><td>€200-600</td><td>€130-350</td></tr>
<tr><td>Βίλα (4 άτομα)</td><td>€100-200</td><td>€150-350</td><td>€90-180</td></tr>
</tbody>
</table>

<h2>Ανά Περιοχή</h2>
<p>Η <strong>Κασσάνδρα</strong> είναι 10-20% ακριβότερη από τη <strong>Σιθωνία</strong> λόγω μεγαλύτερης ζήτησης. Η ενδοχώρα (Πολύγυρος, Αρναία) είναι σημαντικά φθηνότερη. Τα <a href="/guide/hotels">ξενοδοχεία</a> στη Σάνη και στο Πόρτο Καρράς ανήκουν στην premium κατηγορία.</p>

<h2>Tips Εξοικονόμησης</h2>
<ul>
<li>Κλείστε <strong>2-3 μήνες νωρίτερα</strong> για τις καλύτερες τιμές</li>
<li>Ιούνιος και Σεπτέμβριος: 30-50% φθηνότερα</li>
<li>Επιλέξτε <a href="/guide/villas">βίλα</a> αν είστε παρέα — πιο οικονομικό ανά άτομο</li>
<li>Τα <a href="/guide/all-inclusive">all-inclusive</a> πακέτα αξίζουν για οικογένειες</li>
</ul>

<h2>Τι Περιλαμβάνει η Τιμή;</h2>
<p>Τα περισσότερα <a href="/listings">καταλύματα</a> περιλαμβάνουν: A/C, Wi-Fi, πετσέτες. Το πρωινό συνήθως χρεώνεται €5-12/άτομο. Πάρκινγκ δωρεάν στα περισσότερα.</p>

<h2>Ανά Εποχή</h2>
<p>Η μεγαλύτερη διαφορά τιμών είναι μεταξύ Ιουνίου/Σεπτεμβρίου και Ιουλίου/Αυγούστου. Μερικά <a href="/guide/camping">camping</a> προσφέρουν early bird εκπτώσεις 15-20%.</p>

<h2>Σύγκριση</h2>
<p>Σε σχέση με Μύκονο/Σαντορίνη, τα ξενοδοχεία στη Χαλκιδική είναι <strong>40-60% φθηνότερα</strong> για ίδια κατηγορία.</p>`,

      en: `<h2>Overview</h2>
<p>Halkidiki offers a <strong>wide variety of accommodation</strong> — from budget camping to luxury 5-star resorts. Prices depend on type, season, and area. <a href="/listings">Find accommodation</a> that fits your budget.</p>

<h2>Prices by Type & Season</h2>
<table>
<thead><tr><th>Type</th><th>June</th><th>Jul-Aug</th><th>September</th></tr></thead>
<tbody>
<tr><td><a href="/guide/camping">Camping</a></td><td>€15-25</td><td>€20-30</td><td>€15-25</td></tr>
<tr><td>Studio/Apartment</td><td>€40-70</td><td>€60-120</td><td>€40-70</td></tr>
<tr><td>3-star Hotel</td><td>€60-100</td><td>€80-150</td><td>€50-90</td></tr>
<tr><td>4-star Hotel</td><td>€80-150</td><td>€120-250</td><td>€70-130</td></tr>
<tr><td>5-star/Resort</td><td>€150-400</td><td>€200-600</td><td>€130-350</td></tr>
<tr><td>Villa (4 pax)</td><td>€100-200</td><td>€150-350</td><td>€90-180</td></tr>
</tbody>
</table>

<h2>By Area</h2>
<p><strong>Kassandra</strong> is 10-20% more expensive than <strong>Sithonia</strong> due to higher demand. The hinterland (Polygyros, Arnea) is significantly cheaper. <a href="/guide/hotels">Hotels</a> in Sani and Porto Carras are in the premium category.</p>

<h2>Tips to Save Money</h2>
<ul>
<li>Book <strong>2-3 months ahead</strong> for the best prices</li>
<li>June and September: 30-50% cheaper</li>
<li>Choose a <a href="/guide/villas">villa</a> if traveling as a group — more affordable per person</li>
<li><a href="/guide/all-inclusive">All-inclusive</a> packages are great value for families</li>
</ul>

<h2>What Is Included?</h2>
<p>Most <a href="/listings">accommodation</a> includes: A/C, Wi-Fi, towels. Breakfast is usually €5-12/person extra. Parking is free at most places.</p>

<h2>By Season</h2>
<p>The biggest price difference is between June/September and July/August. Some <a href="/guide/camping">campsites</a> offer early bird discounts of 15-20%.</p>

<h2>Comparison</h2>
<p>Compared to Mykonos/Santorini, hotels in Halkidiki are <strong>40-60% cheaper</strong> for the same category.</p>`,

      de: `<h2>Überblick</h2>
<p>Chalkidiki bietet eine <strong>große Auswahl an Unterkünften</strong> — vom Budget-Camping bis zum Luxus-Resort. <a href="/listings">Finden Sie eine Unterkunft</a> passend zu Ihrem Budget.</p>

<h2>Preise nach Typ & Saison</h2>
<table>
<thead><tr><th>Typ</th><th>Juni</th><th>Jul-Aug</th><th>September</th></tr></thead>
<tbody>
<tr><td><a href="/guide/camping">Camping</a></td><td>€15-25</td><td>€20-30</td><td>€15-25</td></tr>
<tr><td>Studio/Apartment</td><td>€40-70</td><td>€60-120</td><td>€40-70</td></tr>
<tr><td>3-Sterne-Hotel</td><td>€60-100</td><td>€80-150</td><td>€50-90</td></tr>
<tr><td>4-Sterne-Hotel</td><td>€80-150</td><td>€120-250</td><td>€70-130</td></tr>
<tr><td>5-Sterne/Resort</td><td>€150-400</td><td>€200-600</td><td>€130-350</td></tr>
<tr><td>Villa (4 Pers.)</td><td>€100-200</td><td>€150-350</td><td>€90-180</td></tr>
</tbody>
</table>

<h2>Nach Gebiet</h2>
<p><strong>Kassandra</strong> ist 10-20% teurer als <strong>Sithonia</strong>. <a href="/guide/hotels">Hotels</a> in Sani und Porto Carras gehören zur Premium-Kategorie.</p>

<h2>Spartipps</h2>
<ul>
<li>Buchen Sie <strong>2-3 Monate im Voraus</strong></li>
<li>Juni und September: 30-50% günstiger</li>
<li>Wählen Sie eine <a href="/guide/villas">Villa</a> für Gruppen</li>
<li><a href="/guide/all-inclusive">All-inclusive</a>-Pakete lohnen sich für Familien</li>
</ul>

<h2>Was ist inbegriffen?</h2>
<p>Die meisten <a href="/listings">Unterkünfte</a> bieten: Klimaanlage, WLAN, Handtücher. Frühstück kostet €5-12/Person extra.</p>

<h2>Vergleich</h2>
<p>Hotels in Chalkidiki sind <strong>40-60% günstiger</strong> als auf Mykonos/Santorini.</p>`,

      bg: `<h2>Преглед</h2>
<p>Халкидики предлага <strong>голямо разнообразие от настаняване</strong> — от бюджетен къмпинг до луксозни 5-звездни курорти. <a href="/listings">Намерете настаняване</a> за вашия бюджет.</p>

<h2>Цени по тип и сезон</h2>
<table>
<thead><tr><th>Тип</th><th>Юни</th><th>Юли-Авг</th><th>Септември</th></tr></thead>
<tbody>
<tr><td><a href="/guide/camping">Къмпинг</a></td><td>€15-25</td><td>€20-30</td><td>€15-25</td></tr>
<tr><td>Студио/Апартамент</td><td>€40-70</td><td>€60-120</td><td>€40-70</td></tr>
<tr><td>3-звезден хотел</td><td>€60-100</td><td>€80-150</td><td>€50-90</td></tr>
<tr><td>4-звезден хотел</td><td>€80-150</td><td>€120-250</td><td>€70-130</td></tr>
<tr><td>5-звезден/Курорт</td><td>€150-400</td><td>€200-600</td><td>€130-350</td></tr>
<tr><td>Вила (4 човека)</td><td>€100-200</td><td>€150-350</td><td>€90-180</td></tr>
</tbody>
</table>

<h2>По район</h2>
<p><strong>Касандра</strong> е с 10-20% по-скъпа от <strong>Ситония</strong>. <a href="/guide/hotels">Хотелите</a> в Сани и Порто Карас са в премиум категорията.</p>

<h2>Съвети за спестяване</h2>
<ul>
<li>Резервирайте <strong>2-3 месеца предварително</strong></li>
<li>Юни и септември: 30-50% по-евтино</li>
<li>Изберете <a href="/guide/villas">вила</a> за група</li>
<li><a href="/guide/all-inclusive">All-inclusive</a> пакетите са изгодни за семейства</li>
</ul>

<h2>Сравнение</h2>
<p>Хотелите в Халкидики са <strong>40-60% по-евтини</strong> от Миконос/Санторини.</p>`,

      ru: `<h2>Обзор</h2>
<p>Халкидики предлагает <strong>широкий выбор жилья</strong> — от бюджетных кемпингов до роскошных 5-звёздочных курортов. <a href="/listings">Найдите жильё</a> под ваш бюджет.</p>

<h2>Цены по типу и сезону</h2>
<table>
<thead><tr><th>Тип</th><th>Июнь</th><th>Июль-Авг</th><th>Сентябрь</th></tr></thead>
<tbody>
<tr><td><a href="/guide/camping">Кемпинг</a></td><td>€15-25</td><td>€20-30</td><td>€15-25</td></tr>
<tr><td>Студия/Квартира</td><td>€40-70</td><td>€60-120</td><td>€40-70</td></tr>
<tr><td>3-звёздочный отель</td><td>€60-100</td><td>€80-150</td><td>€50-90</td></tr>
<tr><td>4-звёздочный отель</td><td>€80-150</td><td>€120-250</td><td>€70-130</td></tr>
<tr><td>5-звёздочный/Курорт</td><td>€150-400</td><td>€200-600</td><td>€130-350</td></tr>
<tr><td>Вилла (4 чел.)</td><td>€100-200</td><td>€150-350</td><td>€90-180</td></tr>
</tbody>
</table>

<h2>По районам</h2>
<p><strong>Кассандра</strong> на 10-20% дороже <strong>Ситонии</strong>. <a href="/guide/hotels">Отели</a> в Сани и Порто Каррас — премиум-категория.</p>

<h2>Советы по экономии</h2>
<ul>
<li>Бронируйте за <strong>2-3 месяца</strong></li>
<li>Июнь и сентябрь: на 30-50% дешевле</li>
<li>Выбирайте <a href="/guide/villas">виллу</a> для компании</li>
<li>Пакеты <a href="/guide/all-inclusive">всё включено</a> выгодны для семей</li>
</ul>

<h2>Сравнение</h2>
<p>Отели в Халкидики <strong>на 40-60% дешевле</strong> Миконоса/Санторини.</p>`,

      ro: `<h2>Prezentare generală</h2>
<p>Halkidiki oferă o <strong>gamă largă de cazare</strong> — de la camping economic la resorturi de 5 stele. <a href="/listings">Găsiți cazare</a> potrivită bugetului dumneavoastră.</p>

<h2>Prețuri pe tip și sezon</h2>
<table>
<thead><tr><th>Tip</th><th>Iunie</th><th>Iul-Aug</th><th>Septembrie</th></tr></thead>
<tbody>
<tr><td><a href="/guide/camping">Camping</a></td><td>€15-25</td><td>€20-30</td><td>€15-25</td></tr>
<tr><td>Studio/Apartament</td><td>€40-70</td><td>€60-120</td><td>€40-70</td></tr>
<tr><td>Hotel 3 stele</td><td>€60-100</td><td>€80-150</td><td>€50-90</td></tr>
<tr><td>Hotel 4 stele</td><td>€80-150</td><td>€120-250</td><td>€70-130</td></tr>
<tr><td>5 stele/Resort</td><td>€150-400</td><td>€200-600</td><td>€130-350</td></tr>
<tr><td>Vilă (4 pers.)</td><td>€100-200</td><td>€150-350</td><td>€90-180</td></tr>
</tbody>
</table>

<h2>Pe zonă</h2>
<p><strong>Kassandra</strong> este cu 10-20% mai scumpă decât <strong>Sithonia</strong>. <a href="/guide/hotels">Hotelurile</a> din Sani și Porto Carras sunt premium.</p>

<h2>Sfaturi</h2>
<ul>
<li>Rezervați cu <strong>2-3 luni înainte</strong></li>
<li>Iunie și septembrie: cu 30-50% mai ieftin</li>
<li>Alegeți o <a href="/guide/villas">vilă</a> pentru grup</li>
<li>Pachetele <a href="/guide/all-inclusive">all-inclusive</a> sunt avantajoase pentru familii</li>
</ul>

<h2>Comparație</h2>
<p>Hotelurile din Halkidiki sunt <strong>cu 40-60% mai ieftine</strong> decât Mykonos/Santorini.</p>`,

      sr: `<h2>Pregled</h2>
<p>Halkidiki nudi <strong>veliki izbor smeštaja</strong> — od ekonomičnog kampa do luksuznih 5-zvezdičnih rizorta. <a href="/listings">Pronađite smeštaj</a> koji odgovara vašem budžetu.</p>

<h2>Cene po tipu i sezoni</h2>
<table>
<thead><tr><th>Tip</th><th>Jun</th><th>Jul-Avg</th><th>Septembar</th></tr></thead>
<tbody>
<tr><td><a href="/guide/camping">Kamp</a></td><td>€15-25</td><td>€20-30</td><td>€15-25</td></tr>
<tr><td>Studio/Apartman</td><td>€40-70</td><td>€60-120</td><td>€40-70</td></tr>
<tr><td>Hotel 3 zvezdice</td><td>€60-100</td><td>€80-150</td><td>€50-90</td></tr>
<tr><td>Hotel 4 zvezdice</td><td>€80-150</td><td>€120-250</td><td>€70-130</td></tr>
<tr><td>5 zvezdica/Rizort</td><td>€150-400</td><td>€200-600</td><td>€130-350</td></tr>
<tr><td>Vila (4 osobe)</td><td>€100-200</td><td>€150-350</td><td>€90-180</td></tr>
</tbody>
</table>

<h2>Po oblasti</h2>
<p><strong>Kasandra</strong> je 10-20% skuplja od <strong>Sitonije</strong>. <a href="/guide/hotels">Hoteli</a> u Saniju i Porto Karasu su premium kategorije.</p>

<h2>Saveti za uštedu</h2>
<ul>
<li>Rezervišite <strong>2-3 meseca unapred</strong></li>
<li>Jun i septembar: 30-50% jeftinije</li>
<li>Izaberite <a href="/guide/villas">vilu</a> za grupu</li>
<li><a href="/guide/all-inclusive">All-inclusive</a> paketi su isplativi za porodice</li>
</ul>

<h2>Poređenje</h2>
<p>Hoteli u Halkidikiju su <strong>40-60% jeftiniji</strong> od Mikonosa/Santorinija.</p>`,
    },
  },

  {
    slug: 'car-rental-prices', icon: 'Car', color: 'slate',
    title: {
      el: 'Κόστος Ενοικίασης Αυτοκινήτου Χαλκιδική 2026',
      en: 'Car Rental Costs in Halkidiki 2026',
      de: 'Mietwagenkosten in Chalkidiki 2026',
      bg: 'Цени за коли под наем в Халкидики 2026',
      ru: 'Стоимость аренды авто в Халкидики 2026',
      ro: 'Costuri închiriere mașină Halkidiki 2026',
      sr: 'Cene iznajmljivanja auta u Halkidikiju 2026',
    },
    description: {
      el: 'Τιμές ενοικίασης, καύσιμα, ασφάλεια και tips',
      en: 'Rental prices, fuel, insurance, and tips',
      de: 'Mietpreise, Kraftstoff, Versicherung und Tipps',
      bg: 'Цени за наем, гориво, застраховка и съвети',
      ru: 'Цены аренды, топливо, страховка и советы',
      ro: 'Prețuri închiriere, combustibil, asigurare și sfaturi',
      sr: 'Cene najma, gorivo, osiguranje i saveti',
    },
    metaTitle: {
      el: 'Ενοικίαση Αυτοκινήτου Χαλκιδική 2026 | Τιμές & Tips',
      en: 'Car Rental Halkidiki 2026 | Prices & Tips',
      de: 'Mietwagen Chalkidiki 2026 | Preise & Tipps',
      bg: 'Коли под наем Халкидики 2026 | Цени',
      ru: 'Аренда авто Халкидики 2026 | Цены и советы',
      ro: 'Închiriere mașină Halkidiki 2026 | Prețuri',
      sr: 'Iznajmljivanje auta Halkidiki 2026 | Cene',
    },
    metaDesc: {
      el: 'Πόσο κοστίζει η ενοικίαση αυτοκινήτου στη Χαλκιδική; Τιμές, ασφάλεια, καύσιμα, πάρκινγκ, tips εξοικονόμησης.',
      en: 'How much does car rental cost in Halkidiki? Prices, insurance, fuel, parking, money-saving tips.',
      de: 'Was kostet ein Mietwagen in Chalkidiki? Preise, Versicherung, Kraftstoff, Parkplätze, Spartipps.',
      bg: 'Колко струва наемането на кола в Халкидики? Цени, застраховка, гориво, паркиране, съвети.',
      ru: 'Сколько стоит аренда авто в Халкидики? Цены, страховка, топливо, парковка, советы.',
      ro: 'Cât costă închirierea mașinii în Halkidiki? Prețuri, asigurare, combustibil, parcare, sfaturi.',
      sr: 'Koliko košta iznajmljivanje auta u Halkidikiju? Cene, osiguranje, gorivo, parking, saveti.',
    },
    content: {
      el: `<h2>Επισκόπηση</h2>
<p>Η <a href="/guide/car-rental">ενοικίαση αυτοκινήτου</a> είναι ο <strong>καλύτερος τρόπος εξερεύνησης</strong> της Χαλκιδικής. Τα δημόσια μέσα μεταφοράς είναι περιορισμένα, οπότε ένα αυτοκίνητο σας δίνει πλήρη ελευθερία. Δείτε και τις <a href="/guide/driving-distances">αποστάσεις οδήγησης</a>.</p>

<h2>Τιμοκατάλογος Ενοικίασης</h2>
<table>
<thead><tr><th>Κατηγορία</th><th>Τιμή/ημέρα</th><th>Μοντέλα</th></tr></thead>
<tbody>
<tr><td>Economy</td><td>€25-40</td><td>Fiat Panda, VW Polo</td></tr>
<tr><td>Mid-size</td><td>€35-55</td><td>VW Golf, Toyota Corolla</td></tr>
<tr><td>SUV</td><td>€50-80</td><td>Nissan Qashqai, Dacia Duster</td></tr>
<tr><td>Αυτόματο (+)</td><td>+€10-15/ημέρα</td><td>—</td></tr>
<tr><td>Πλήρης ασφάλεια (+)</td><td>+€8-15/ημέρα</td><td>—</td></tr>
</tbody>
</table>

<h2>Κόστος Καυσίμων</h2>
<table>
<thead><tr><th>Στοιχείο</th><th>Κόστος</th></tr></thead>
<tbody>
<tr><td>Βενζίνη (ανά λίτρο)</td><td>€1,80-2,00</td></tr>
<tr><td>Budget καυσίμου/εβδομάδα (Κασσάνδρα)</td><td>~€30-50</td></tr>
<tr><td>Budget καυσίμου/εβδομάδα (Σιθωνία)</td><td>~€40-60</td></tr>
<tr><td>Πάρκινγκ παραλιών</td><td>Δωρεάν ή €3-5</td></tr>
</tbody>
</table>

<h2>Tips Εξοικονόμησης</h2>
<ul>
<li>Κλείστε <strong>2+ μήνες νωρίτερα</strong> — εξοικονομήστε 20-30%</li>
<li>Συγκρίνετε τιμές online πριν κλείσετε</li>
<li>Προτιμήστε μικρό αυτοκίνητο — οι δρόμοι είναι στενοί</li>
<li>Η πλήρης ασφάλεια αξίζει — αποφεύγετε εκπλήξεις</li>
<li>Γεμίστε σε βενζινάδικα εκτός τουριστικών περιοχών</li>
</ul>

<h2>Ανά Εποχή</h2>
<p>Τον <strong>Αύγουστο</strong> οι τιμές αυξάνονται 30-50% και η διαθεσιμότητα μειώνεται. Κλείστε νωρίς! Τον Ιούνιο και Σεπτέμβριο βρίσκετε πολύ καλές τιμές.</p>

<h2>Χρήσιμες Πληροφορίες</h2>
<p>Δείτε τις <a href="/faq/transport">συχνές ερωτήσεις μεταφοράς</a> για περισσότερες λεπτομέρειες. Τα περισσότερα <a href="/listings">καταλύματα</a> προσφέρουν δωρεάν πάρκινγκ.</p>`,

      en: `<h2>Overview</h2>
<p><a href="/guide/car-rental">Car rental</a> is the <strong>best way to explore</strong> Halkidiki. Public transport is limited, so a car gives you full freedom. See also our <a href="/guide/driving-distances">driving distances guide</a>.</p>

<h2>Rental Price List</h2>
<table>
<thead><tr><th>Category</th><th>Price/day</th><th>Models</th></tr></thead>
<tbody>
<tr><td>Economy</td><td>€25-40</td><td>Fiat Panda, VW Polo</td></tr>
<tr><td>Mid-size</td><td>€35-55</td><td>VW Golf, Toyota Corolla</td></tr>
<tr><td>SUV</td><td>€50-80</td><td>Nissan Qashqai, Dacia Duster</td></tr>
<tr><td>Automatic (+)</td><td>+€10-15/day</td><td>—</td></tr>
<tr><td>Full insurance (+)</td><td>+€8-15/day</td><td>—</td></tr>
</tbody>
</table>

<h2>Fuel Costs</h2>
<table>
<thead><tr><th>Item</th><th>Cost</th></tr></thead>
<tbody>
<tr><td>Gasoline (per liter)</td><td>€1.80-2.00</td></tr>
<tr><td>Fuel budget/week (Kassandra loop)</td><td>~€30-50</td></tr>
<tr><td>Fuel budget/week (Sithonia)</td><td>~€40-60</td></tr>
<tr><td>Beach parking</td><td>Free or €3-5</td></tr>
</tbody>
</table>

<h2>Tips to Save Money</h2>
<ul>
<li>Book <strong>2+ months ahead</strong> — save 20-30%</li>
<li>Compare prices online before booking</li>
<li>Choose a small car — roads are narrow</li>
<li>Full insurance is worth it — avoid surprises</li>
<li>Fill up at gas stations outside tourist areas</li>
</ul>

<h2>By Season</h2>
<p>In <strong>August</strong>, prices increase 30-50% and availability drops. Book early! June and September offer much better rates.</p>

<h2>Useful Information</h2>
<p>Check the <a href="/faq/transport">transport FAQ</a> for more details. Most <a href="/listings">accommodation</a> offers free parking.</p>`,

      de: `<h2>Überblick</h2>
<p>Ein <a href="/guide/car-rental">Mietwagen</a> ist der <strong>beste Weg, Chalkidiki zu erkunden</strong>. Öffentliche Verkehrsmittel sind begrenzt. Siehe auch unseren <a href="/guide/driving-distances">Entfernungsführer</a>.</p>

<h2>Mietpreisliste</h2>
<table>
<thead><tr><th>Kategorie</th><th>Preis/Tag</th><th>Modelle</th></tr></thead>
<tbody>
<tr><td>Economy</td><td>€25-40</td><td>Fiat Panda, VW Polo</td></tr>
<tr><td>Mittelklasse</td><td>€35-55</td><td>VW Golf, Toyota Corolla</td></tr>
<tr><td>SUV</td><td>€50-80</td><td>Nissan Qashqai, Dacia Duster</td></tr>
<tr><td>Automatik (+)</td><td>+€10-15/Tag</td><td>—</td></tr>
<tr><td>Vollkasko (+)</td><td>+€8-15/Tag</td><td>—</td></tr>
</tbody>
</table>

<h2>Kraftstoffkosten</h2>
<table>
<thead><tr><th>Posten</th><th>Kosten</th></tr></thead>
<tbody>
<tr><td>Benzin (pro Liter)</td><td>€1,80-2,00</td></tr>
<tr><td>Kraftstoff/Woche (Kassandra)</td><td>~€30-50</td></tr>
<tr><td>Kraftstoff/Woche (Sithonia)</td><td>~€40-60</td></tr>
<tr><td>Strandparkplatz</td><td>Kostenlos oder €3-5</td></tr>
</tbody>
</table>

<h2>Spartipps</h2>
<ul>
<li>Buchen Sie <strong>2+ Monate im Voraus</strong> — sparen Sie 20-30%</li>
<li>Vergleichen Sie Preise online</li>
<li>Wählen Sie ein kleines Auto — die Straßen sind schmal</li>
<li>Vollkasko lohnt sich</li>
</ul>

<h2>Nach Saison</h2>
<p>Im <strong>August</strong> steigen die Preise um 30-50%. Frühzeitig buchen! Juni und September bieten bessere Preise.</p>

<h2>Nützliche Infos</h2>
<p>Siehe <a href="/faq/transport">Transport-FAQ</a>. Die meisten <a href="/listings">Unterkünfte</a> bieten kostenloses Parken.</p>`,

      bg: `<h2>Преглед</h2>
<p><a href="/guide/car-rental">Наемането на кола</a> е <strong>най-добрият начин да разгледате</strong> Халкидики. Общественият транспорт е ограничен. Вижте и <a href="/guide/driving-distances">разстоянията за шофиране</a>.</p>

<h2>Ценоразпис за наем</h2>
<table>
<thead><tr><th>Категория</th><th>Цена/ден</th><th>Модели</th></tr></thead>
<tbody>
<tr><td>Economy</td><td>€25-40</td><td>Fiat Panda, VW Polo</td></tr>
<tr><td>Среден клас</td><td>€35-55</td><td>VW Golf, Toyota Corolla</td></tr>
<tr><td>SUV</td><td>€50-80</td><td>Nissan Qashqai, Dacia Duster</td></tr>
<tr><td>Автоматик (+)</td><td>+€10-15/ден</td><td>—</td></tr>
<tr><td>Пълна застраховка (+)</td><td>+€8-15/ден</td><td>—</td></tr>
</tbody>
</table>

<h2>Разходи за гориво</h2>
<table>
<thead><tr><th>Елемент</th><th>Цена</th></tr></thead>
<tbody>
<tr><td>Бензин (на литър)</td><td>€1,80-2,00</td></tr>
<tr><td>Гориво/седмица (Касандра)</td><td>~€30-50</td></tr>
<tr><td>Гориво/седмица (Ситония)</td><td>~€40-60</td></tr>
<tr><td>Паркинг на плажа</td><td>Безплатно или €3-5</td></tr>
</tbody>
</table>

<h2>Съвети за спестяване</h2>
<ul>
<li>Резервирайте <strong>2+ месеца предварително</strong></li>
<li>Изберете малка кола — пътищата са тесни</li>
<li>Пълната застраховка си заслужава</li>
</ul>

<h2>По сезон</h2>
<p>През <strong>август</strong> цените се покачват с 30-50%. Резервирайте рано!</p>

<h2>Полезна информация</h2>
<p>Вижте <a href="/faq/transport">ЧЗВ за транспорт</a>. Повечето <a href="/listings">настанявания</a> предлагат безплатен паркинг.</p>`,

      ru: `<h2>Обзор</h2>
<p><a href="/guide/car-rental">Аренда автомобиля</a> — <strong>лучший способ исследовать</strong> Халкидики. Общественный транспорт ограничен. Смотрите также <a href="/guide/driving-distances">расстояния и маршруты</a>.</p>

<h2>Прайс-лист аренды</h2>
<table>
<thead><tr><th>Категория</th><th>Цена/день</th><th>Модели</th></tr></thead>
<tbody>
<tr><td>Эконом</td><td>€25-40</td><td>Fiat Panda, VW Polo</td></tr>
<tr><td>Средний класс</td><td>€35-55</td><td>VW Golf, Toyota Corolla</td></tr>
<tr><td>Внедорожник</td><td>€50-80</td><td>Nissan Qashqai, Dacia Duster</td></tr>
<tr><td>Автомат (+)</td><td>+€10-15/день</td><td>—</td></tr>
<tr><td>Полная страховка (+)</td><td>+€8-15/день</td><td>—</td></tr>
</tbody>
</table>

<h2>Расходы на топливо</h2>
<table>
<thead><tr><th>Позиция</th><th>Стоимость</th></tr></thead>
<tbody>
<tr><td>Бензин (за литр)</td><td>€1,80-2,00</td></tr>
<tr><td>Топливо/неделя (Кассандра)</td><td>~€30-50</td></tr>
<tr><td>Топливо/неделя (Ситония)</td><td>~€40-60</td></tr>
<tr><td>Парковка у пляжа</td><td>Бесплатно или €3-5</td></tr>
</tbody>
</table>

<h2>Советы по экономии</h2>
<ul>
<li>Бронируйте за <strong>2+ месяца</strong> — экономия 20-30%</li>
<li>Сравнивайте цены онлайн</li>
<li>Выбирайте малый авто — дороги узкие</li>
<li>Полная страховка того стоит</li>
</ul>

<h2>По сезонам</h2>
<p>В <strong>августе</strong> цены растут на 30-50%. Бронируйте заранее! Июнь и сентябрь — лучшие цены.</p>

<h2>Полезная информация</h2>
<p>Смотрите <a href="/faq/transport">FAQ по транспорту</a>. Большинство <a href="/listings">жилья</a> с бесплатной парковкой.</p>`,

      ro: `<h2>Prezentare generală</h2>
<p><a href="/guide/car-rental">Închirierea unei mașini</a> este <strong>cea mai bună metodă de a explora</strong> Halkidiki. Transportul public este limitat. Vedeți și <a href="/guide/driving-distances">ghidul distanțelor</a>.</p>

<h2>Prețuri închiriere</h2>
<table>
<thead><tr><th>Categorie</th><th>Preț/zi</th><th>Modele</th></tr></thead>
<tbody>
<tr><td>Economic</td><td>€25-40</td><td>Fiat Panda, VW Polo</td></tr>
<tr><td>Mediu</td><td>€35-55</td><td>VW Golf, Toyota Corolla</td></tr>
<tr><td>SUV</td><td>€50-80</td><td>Nissan Qashqai, Dacia Duster</td></tr>
<tr><td>Automat (+)</td><td>+€10-15/zi</td><td>—</td></tr>
<tr><td>Asigurare completă (+)</td><td>+€8-15/zi</td><td>—</td></tr>
</tbody>
</table>

<h2>Costuri combustibil</h2>
<table>
<thead><tr><th>Element</th><th>Cost</th></tr></thead>
<tbody>
<tr><td>Benzină (per litru)</td><td>€1,80-2,00</td></tr>
<tr><td>Combustibil/săptămână (Kassandra)</td><td>~€30-50</td></tr>
<tr><td>Combustibil/săptămână (Sithonia)</td><td>~€40-60</td></tr>
<tr><td>Parcare plajă</td><td>Gratuit sau €3-5</td></tr>
</tbody>
</table>

<h2>Sfaturi</h2>
<ul>
<li>Rezervați cu <strong>2+ luni înainte</strong> — economisiți 20-30%</li>
<li>Alegeți o mașină mică — drumurile sunt înguste</li>
<li>Asigurarea completă merită</li>
</ul>

<h2>Pe sezon</h2>
<p>În <strong>august</strong>, prețurile cresc cu 30-50%. Rezervați devreme!</p>

<h2>Informații utile</h2>
<p>Consultați <a href="/faq/transport">FAQ transport</a>. Majoritatea <a href="/listings">cazărilor</a> oferă parcare gratuită.</p>`,

      sr: `<h2>Pregled</h2>
<p><a href="/guide/car-rental">Iznajmljivanje auta</a> je <strong>najbolji način za istraživanje</strong> Halkidikija. Javni prevoz je ograničen. Pogledajte i <a href="/guide/driving-distances">vodič udaljenosti</a>.</p>

<h2>Cenovnik najma</h2>
<table>
<thead><tr><th>Kategorija</th><th>Cena/dan</th><th>Modeli</th></tr></thead>
<tbody>
<tr><td>Ekonomični</td><td>€25-40</td><td>Fiat Panda, VW Polo</td></tr>
<tr><td>Srednji</td><td>€35-55</td><td>VW Golf, Toyota Corolla</td></tr>
<tr><td>SUV</td><td>€50-80</td><td>Nissan Qashqai, Dacia Duster</td></tr>
<tr><td>Automatik (+)</td><td>+€10-15/dan</td><td>—</td></tr>
<tr><td>Puno osiguranje (+)</td><td>+€8-15/dan</td><td>—</td></tr>
</tbody>
</table>

<h2>Troškovi goriva</h2>
<table>
<thead><tr><th>Stavka</th><th>Cena</th></tr></thead>
<tbody>
<tr><td>Benzin (po litru)</td><td>€1,80-2,00</td></tr>
<tr><td>Gorivo/nedelja (Kasandra)</td><td>~€30-50</td></tr>
<tr><td>Gorivo/nedelja (Sitonija)</td><td>~€40-60</td></tr>
<tr><td>Parking na plaži</td><td>Besplatno ili €3-5</td></tr>
</tbody>
</table>

<h2>Saveti za uštedu</h2>
<ul>
<li>Rezervišite <strong>2+ meseca unapred</strong> — uštedite 20-30%</li>
<li>Izaberite mali auto — putevi su uski</li>
<li>Puno osiguranje se isplati</li>
</ul>

<h2>Po sezoni</h2>
<p>U <strong>avgustu</strong> cene rastu 30-50%. Rezervišite rano!</p>

<h2>Korisne informacije</h2>
<p>Pogledajte <a href="/faq/transport">FAQ o prevozu</a>. Većina <a href="/listings">smeštaja</a> nudi besplatan parking.</p>`,
    },
  },

  {
    slug: 'family-budget', icon: 'Users', color: 'pink',
    title: {
      el: 'Οικογενειακός Προϋπολογισμός Χαλκιδική (2 Ενήλικες + 2 Παιδιά)',
      en: 'Family Holiday Budget for Halkidiki (2 Adults + 2 Kids)',
      de: 'Familienbudget für Chalkidiki (2 Erwachsene + 2 Kinder)',
      bg: 'Семеен бюджет за Халкидики (2 възрастни + 2 деца)',
      ru: 'Бюджет семейного отдыха в Халкидики (2 взрослых + 2 детей)',
      ro: 'Buget vacanță în familie Halkidiki (2 adulți + 2 copii)',
      sr: 'Porodični budžet za Halkidiki (2 odrasla + 2 dece)',
    },
    description: {
      el: 'Εβδομαδιαίος προϋπολογισμός για οικογένεια με παιδιά',
      en: 'Weekly budget breakdown for families with children',
      de: 'Wochenbudget-Aufschlüsselung für Familien mit Kindern',
      bg: 'Седмичен бюджет за семейства с деца',
      ru: 'Недельный бюджет для семей с детьми',
      ro: 'Defalcarea bugetului săptămânal pentru familii cu copii',
      sr: 'Nedeljni budžet za porodice sa decom',
    },
    metaTitle: {
      el: 'Οικογενειακές Διακοπές Χαλκιδική 2026 | Κόστος & Budget',
      en: 'Family Holiday Halkidiki 2026 | Cost & Budget',
      de: 'Familienurlaub Chalkidiki 2026 | Kosten & Budget',
      bg: 'Семейна ваканция Халкидики 2026 | Бюджет',
      ru: 'Семейный отдых Халкидики 2026 | Бюджет и расходы',
      ro: 'Vacanță în familie Halkidiki 2026 | Costuri și buget',
      sr: 'Porodični odmor Halkidiki 2026 | Budžet',
    },
    metaDesc: {
      el: 'Πόσο κοστίζουν οι οικογενειακές διακοπές στη Χαλκιδική; Εβδομαδιαίος προϋπολογισμός για 2 ενήλικες + 2 παιδιά.',
      en: 'How much does a family holiday in Halkidiki cost? Weekly budget for 2 adults + 2 kids.',
      de: 'Was kostet ein Familienurlaub in Chalkidiki? Wochenbudget für 2 Erwachsene + 2 Kinder.',
      bg: 'Колко струва семейна ваканция в Халкидики? Седмичен бюджет за 2 възрастни + 2 деца.',
      ru: 'Сколько стоит семейный отдых в Халкидики? Недельный бюджет на 2 взрослых + 2 детей.',
      ro: 'Cât costă o vacanță în familie în Halkidiki? Buget săptămânal pentru 2 adulți + 2 copii.',
      sr: 'Koliko košta porodični odmor u Halkidikiju? Nedeljni budžet za 2 odrasla + 2 dece.',
    },
    content: {
      el: `<h2>Επισκόπηση</h2>
<p>Η Χαλκιδική είναι <strong>ιδανικός προορισμός για οικογένειες</strong> — ασφαλείς παραλίες, κοντινές αποστάσεις και λογικές τιμές. Δείτε τον <a href="/guide/families">οδηγό οικογενειακών διακοπών</a> για πρακτικές συμβουλές.</p>

<h2>Εβδομαδιαίος Προϋπολογισμός (2+2)</h2>
<table>
<thead><tr><th>Κατηγορία</th><th>Budget</th><th>Comfortable</th><th>Luxury</th></tr></thead>
<tbody>
<tr><td>Διαμονή</td><td>€300-500</td><td>€600-1.000</td><td>€1.500-3.000</td></tr>
<tr><td>Φαγητό</td><td>€250-400</td><td>€450-750</td><td>€800-1.200</td></tr>
<tr><td>Μεταφορά</td><td>€100-150</td><td>€200-350</td><td>€300-400</td></tr>
<tr><td>Δραστηριότητες</td><td>€50-100</td><td>€200-400</td><td>€400-800</td></tr>
<tr><td><strong>Σύνολο/εβδ.</strong></td><td><strong>€800-1.200</strong></td><td><strong>€1.500-2.500</strong></td><td><strong>€3.000-5.000</strong></td></tr>
</tbody>
</table>

<h2>Πού Πάνε τα Χρήματα</h2>
<table>
<thead><tr><th>Κατηγορία</th><th>Ποσοστό</th></tr></thead>
<tbody>
<tr><td>Διαμονή</td><td>~40%</td></tr>
<tr><td>Φαγητό</td><td>~30%</td></tr>
<tr><td>Μεταφορά</td><td>~15%</td></tr>
<tr><td>Δραστηριότητες</td><td>~15%</td></tr>
</tbody>
</table>

<h2>Budget Οικογένεια (€800-1.200/εβδ.)</h2>
<p>Μείνετε σε <a href="/listings">διαμέρισμα με κουζίνα</a> (€40-70/νύχτα), μαγειρέψτε τα μισά γεύματα, απολαύστε <a href="/best/family-beaches">δωρεάν παραλίες</a> και δωρεάν δραστηριότητες. Τα <a href="/restaurants">εστιατόρια</a> με παιδικό μενού κοστίζουν €5-8/παιδί.</p>

<h2>Comfortable Οικογένεια (€1.500-2.500/εβδ.)</h2>
<p>3* ξενοδοχείο ή μεγάλο studio (€80-150/νύχτα), μίξη μαγειρέματος και εξόδου, οργανωμένες παραλίες (€10-15/ημέρα), <a href="/best/kids-activities">παιδικές δραστηριότητες</a> 2-3 φορές/εβδ.</p>

<h2>Luxury Οικογένεια (€3.000-5.000/εβδ.)</h2>
<p>4-5* resort με <a href="/guide/all-inclusive">all-inclusive</a>, βόλτες με σκάφος, water sports, ιδιωτικές εκδρομές. Τα <a href="/guide/hotels">πολυτελή ξενοδοχεία</a> συχνά προσφέρουν παιδικά clubs.</p>

<h2>Tips Εξοικονόμησης</h2>
<ul>
<li>Ταξιδέψτε <strong>Ιούνιο ή Σεπτέμβριο</strong> — εξοικονομήστε 30-40%</li>
<li>Επιλέξτε κατάλυμα με κουζίνα — μαγειρεύοντας εξοικονομείτε €20-30/ημέρα</li>
<li>Χρησιμοποιήστε δωρεάν παραλίες — πολλές <a href="/best/family-beaches">οικογενειακές παραλίες</a> είναι ελεύθερης πρόσβασης</li>
<li>Νοικιάστε <a href="/guide/car-rental">αυτοκίνητο</a> αντί για ταξί — πιο οικονομικό μακροπρόθεσμα</li>
<li>Τα <a href="/guide/camping">camping</a> είναι εξαιρετική εμπειρία για παιδιά και πολύ οικονομικά</li>
</ul>

<h2>Ανά Εποχή</h2>
<table>
<thead><tr><th>Περίοδος</th><th>Εξοικονόμηση vs Αύγουστος</th></tr></thead>
<tbody>
<tr><td>Ιούνιος</td><td>-25% έως -35%</td></tr>
<tr><td>Αρχές Ιουλίου</td><td>-10% έως -15%</td></tr>
<tr><td>Αύγουστος</td><td>Αιχμή (100%)</td></tr>
<tr><td>Σεπτέμβριος</td><td>-30% έως -40%</td></tr>
</tbody>
</table>

<h2>Σύγκριση</h2>
<p>Η Χαλκιδική είναι <strong>εξαιρετική επιλογή για οικογένειες</strong> — φθηνότερη από νησιά, χωρίς κόστος πλοίου/αεροπλάνου, με πλούσιες δραστηριότητες.</p>`,

      en: `<h2>Overview</h2>
<p>Halkidiki is an <strong>ideal destination for families</strong> — safe beaches, short distances, and reasonable prices. See our <a href="/guide/families">family holiday guide</a> for practical advice.</p>

<h2>Weekly Budget (2 Adults + 2 Kids)</h2>
<table>
<thead><tr><th>Category</th><th>Budget</th><th>Comfortable</th><th>Luxury</th></tr></thead>
<tbody>
<tr><td>Accommodation</td><td>€300-500</td><td>€600-1,000</td><td>€1,500-3,000</td></tr>
<tr><td>Food</td><td>€250-400</td><td>€450-750</td><td>€800-1,200</td></tr>
<tr><td>Transport</td><td>€100-150</td><td>€200-350</td><td>€300-400</td></tr>
<tr><td>Activities</td><td>€50-100</td><td>€200-400</td><td>€400-800</td></tr>
<tr><td><strong>Total/week</strong></td><td><strong>€800-1,200</strong></td><td><strong>€1,500-2,500</strong></td><td><strong>€3,000-5,000</strong></td></tr>
</tbody>
</table>

<h2>Where the Money Goes</h2>
<table>
<thead><tr><th>Category</th><th>Percentage</th></tr></thead>
<tbody>
<tr><td>Accommodation</td><td>~40%</td></tr>
<tr><td>Food</td><td>~30%</td></tr>
<tr><td>Transport</td><td>~15%</td></tr>
<tr><td>Activities</td><td>~15%</td></tr>
</tbody>
</table>

<h2>Budget Family (€800-1,200/week)</h2>
<p>Stay in an <a href="/listings">apartment with kitchen</a> (€40-70/night), cook half your meals, enjoy <a href="/best/family-beaches">free beaches</a> and free activities. <a href="/restaurants">Restaurants</a> with kids menus cost €5-8/child.</p>

<h2>Comfortable Family (€1,500-2,500/week)</h2>
<p>3-star hotel or large studio (€80-150/night), mix of cooking and eating out, organized beaches (€10-15/day), <a href="/best/kids-activities">kids activities</a> 2-3 times/week.</p>

<h2>Luxury Family (€3,000-5,000/week)</h2>
<p>4-5 star resort with <a href="/guide/all-inclusive">all-inclusive</a>, boat tours, water sports, private excursions. Luxury <a href="/guide/hotels">hotels</a> often have kids clubs.</p>

<h2>Tips to Save Money</h2>
<ul>
<li>Travel in <strong>June or September</strong> — save 30-40%</li>
<li>Choose accommodation with a kitchen — cooking saves €20-30/day</li>
<li>Use free beaches — many <a href="/best/family-beaches">family beaches</a> are free</li>
<li>Rent a <a href="/guide/car-rental">car</a> instead of taxis — cheaper long-term</li>
<li><a href="/guide/camping">Camping</a> is a great experience for kids and very affordable</li>
</ul>

<h2>By Season</h2>
<table>
<thead><tr><th>Period</th><th>Savings vs. August</th></tr></thead>
<tbody>
<tr><td>June</td><td>-25% to -35%</td></tr>
<tr><td>Early July</td><td>-10% to -15%</td></tr>
<tr><td>August</td><td>Peak (100%)</td></tr>
<tr><td>September</td><td>-30% to -40%</td></tr>
</tbody>
</table>

<h2>Comparison</h2>
<p>Halkidiki is an <strong>excellent choice for families</strong> — cheaper than islands, no ferry/flight costs, with plenty of activities.</p>`,

      de: `<h2>Überblick</h2>
<p>Chalkidiki ist ein <strong>ideales Ziel für Familien</strong> — sichere Strände, kurze Entfernungen und vernünftige Preise. Siehe unseren <a href="/guide/families">Familienurlaubs-Führer</a>.</p>

<h2>Wochenbudget (2 Erwachsene + 2 Kinder)</h2>
<table>
<thead><tr><th>Kategorie</th><th>Budget</th><th>Komfortabel</th><th>Luxus</th></tr></thead>
<tbody>
<tr><td>Unterkunft</td><td>€300-500</td><td>€600-1.000</td><td>€1.500-3.000</td></tr>
<tr><td>Essen</td><td>€250-400</td><td>€450-750</td><td>€800-1.200</td></tr>
<tr><td>Transport</td><td>€100-150</td><td>€200-350</td><td>€300-400</td></tr>
<tr><td>Aktivitäten</td><td>€50-100</td><td>€200-400</td><td>€400-800</td></tr>
<tr><td><strong>Gesamt/Woche</strong></td><td><strong>€800-1.200</strong></td><td><strong>€1.500-2.500</strong></td><td><strong>€3.000-5.000</strong></td></tr>
</tbody>
</table>

<h2>Wohin geht das Geld</h2>
<table>
<thead><tr><th>Kategorie</th><th>Anteil</th></tr></thead>
<tbody>
<tr><td>Unterkunft</td><td>~40%</td></tr>
<tr><td>Essen</td><td>~30%</td></tr>
<tr><td>Transport</td><td>~15%</td></tr>
<tr><td>Aktivitäten</td><td>~15%</td></tr>
</tbody>
</table>

<h2>Budget-Familie (€800-1.200/Woche)</h2>
<p>Übernachten Sie in einer <a href="/listings">Ferienwohnung mit Küche</a> (€40-70/Nacht), kochen Sie die Hälfte, genießen Sie <a href="/best/family-beaches">freie Strände</a>.</p>

<h2>Komfortable Familie (€1.500-2.500/Woche)</h2>
<p>3-Sterne-Hotel (€80-150/Nacht), organisierte Strände, <a href="/best/kids-activities">Kinderaktivitäten</a> 2-3 Mal/Woche.</p>

<h2>Luxus-Familie (€3.000-5.000/Woche)</h2>
<p>4-5-Sterne-Resort mit <a href="/guide/all-inclusive">All-inclusive</a>, Bootstouren, Wassersport. <a href="/guide/hotels">Luxushotels</a> bieten oft Kids-Clubs.</p>

<h2>Spartipps</h2>
<ul>
<li>Reisen Sie im <strong>Juni oder September</strong> — sparen Sie 30-40%</li>
<li>Wählen Sie Unterkunft mit Küche — sparen Sie €20-30/Tag</li>
<li>Nutzen Sie freie <a href="/best/family-beaches">Familienstrände</a></li>
<li>Mieten Sie ein <a href="/guide/car-rental">Auto</a> statt Taxis</li>
<li><a href="/guide/camping">Camping</a> ist toll für Kinder und sehr günstig</li>
</ul>

<h2>Vergleich</h2>
<p>Chalkidiki ist eine <strong>ausgezeichnete Wahl für Familien</strong> — günstiger als Inseln, keine Fähre nötig.</p>`,

      bg: `<h2>Преглед</h2>
<p>Халкидики е <strong>идеална дестинация за семейства</strong> — безопасни плажове, кратки разстояния, разумни цени. Вижте <a href="/guide/families">пътеводителя за семейна ваканция</a>.</p>

<h2>Седмичен бюджет (2 възрастни + 2 деца)</h2>
<table>
<thead><tr><th>Категория</th><th>Бюджетен</th><th>Комфортен</th><th>Луксозен</th></tr></thead>
<tbody>
<tr><td>Настаняване</td><td>€300-500</td><td>€600-1.000</td><td>€1.500-3.000</td></tr>
<tr><td>Храна</td><td>€250-400</td><td>€450-750</td><td>€800-1.200</td></tr>
<tr><td>Транспорт</td><td>€100-150</td><td>€200-350</td><td>€300-400</td></tr>
<tr><td>Дейности</td><td>€50-100</td><td>€200-400</td><td>€400-800</td></tr>
<tr><td><strong>Общо/седм.</strong></td><td><strong>€800-1.200</strong></td><td><strong>€1.500-2.500</strong></td><td><strong>€3.000-5.000</strong></td></tr>
</tbody>
</table>

<h2>Бюджетно семейство (€800-1.200/седм.)</h2>
<p>Отседнете в <a href="/listings">апартамент с кухня</a>, гответе половината ястия, насладете се на <a href="/best/family-beaches">безплатни плажове</a>.</p>

<h2>Комфортно семейство (€1.500-2.500/седм.)</h2>
<p>3-звезден хотел, организирани плажове, <a href="/best/kids-activities">детски дейности</a> 2-3 пъти/седмица.</p>

<h2>Луксозно семейство (€3.000-5.000/седм.)</h2>
<p>4-5 звездни курорти с <a href="/guide/all-inclusive">all-inclusive</a>, разходки с лодка. <a href="/guide/hotels">Луксозните хотели</a> имат детски клубове.</p>

<h2>Съвети за спестяване</h2>
<ul>
<li>Пътувайте през <strong>юни или септември</strong> — спестете 30-40%</li>
<li>Изберете настаняване с кухня</li>
<li>Използвайте безплатни <a href="/best/family-beaches">семейни плажове</a></li>
<li>Наемете <a href="/guide/car-rental">кола</a> вместо такси</li>
</ul>

<h2>Сравнение</h2>
<p>Халкидики е <strong>отличен избор за семейства</strong> — по-евтина от островите, без разходи за ферибот.</p>`,

      ru: `<h2>Обзор</h2>
<p>Халкидики — <strong>идеальное направление для семей</strong>: безопасные пляжи, короткие расстояния, разумные цены. Смотрите <a href="/guide/families">путеводитель по семейному отдыху</a>.</p>

<h2>Недельный бюджет (2 взрослых + 2 ребёнка)</h2>
<table>
<thead><tr><th>Категория</th><th>Бюджетный</th><th>Комфортный</th><th>Люкс</th></tr></thead>
<tbody>
<tr><td>Жильё</td><td>€300-500</td><td>€600-1.000</td><td>€1.500-3.000</td></tr>
<tr><td>Еда</td><td>€250-400</td><td>€450-750</td><td>€800-1.200</td></tr>
<tr><td>Транспорт</td><td>€100-150</td><td>€200-350</td><td>€300-400</td></tr>
<tr><td>Развлечения</td><td>€50-100</td><td>€200-400</td><td>€400-800</td></tr>
<tr><td><strong>Итого/нед.</strong></td><td><strong>€800-1.200</strong></td><td><strong>€1.500-2.500</strong></td><td><strong>€3.000-5.000</strong></td></tr>
</tbody>
</table>

<h2>Бюджетная семья (€800-1.200/нед.)</h2>
<p>Остановитесь в <a href="/listings">квартире с кухней</a>, готовьте половину блюд, наслаждайтесь <a href="/best/family-beaches">бесплатными пляжами</a>.</p>

<h2>Комфортная семья (€1.500-2.500/нед.)</h2>
<p>3-звёздочный отель, организованные пляжи, <a href="/best/kids-activities">детские развлечения</a> 2-3 раза/нед.</p>

<h2>Люкс семья (€3.000-5.000/нед.)</h2>
<p>4-5 звёздочный курорт с <a href="/guide/all-inclusive">всё включено</a>, морские прогулки. <a href="/guide/hotels">Роскошные отели</a> имеют детские клубы.</p>

<h2>Советы по экономии</h2>
<ul>
<li>Путешествуйте в <strong>июне или сентябре</strong> — экономия 30-40%</li>
<li>Выбирайте жильё с кухней</li>
<li>Используйте бесплатные <a href="/best/family-beaches">семейные пляжи</a></li>
<li>Арендуйте <a href="/guide/car-rental">авто</a> вместо такси</li>
</ul>

<h2>Сравнение</h2>
<p>Халкидики — <strong>отличный выбор для семей</strong>: дешевле островов, без расходов на паром.</p>`,

      ro: `<h2>Prezentare generală</h2>
<p>Halkidiki este o <strong>destinație ideală pentru familii</strong> — plaje sigure, distanțe scurte, prețuri rezonabile. Consultați <a href="/guide/families">ghidul pentru vacanța în familie</a>.</p>

<h2>Buget săptămânal (2 adulți + 2 copii)</h2>
<table>
<thead><tr><th>Categorie</th><th>Economic</th><th>Confortabil</th><th>Lux</th></tr></thead>
<tbody>
<tr><td>Cazare</td><td>€300-500</td><td>€600-1.000</td><td>€1.500-3.000</td></tr>
<tr><td>Mâncare</td><td>€250-400</td><td>€450-750</td><td>€800-1.200</td></tr>
<tr><td>Transport</td><td>€100-150</td><td>€200-350</td><td>€300-400</td></tr>
<tr><td>Activități</td><td>€50-100</td><td>€200-400</td><td>€400-800</td></tr>
<tr><td><strong>Total/săpt.</strong></td><td><strong>€800-1.200</strong></td><td><strong>€1.500-2.500</strong></td><td><strong>€3.000-5.000</strong></td></tr>
</tbody>
</table>

<h2>Familie economică (€800-1.200/săpt.)</h2>
<p>Stați într-un <a href="/listings">apartament cu bucătărie</a>, gătiți jumătate din mese, bucurați-vă de <a href="/best/family-beaches">plajele gratuite</a>.</p>

<h2>Familie confortabilă (€1.500-2.500/săpt.)</h2>
<p>Hotel 3 stele, plaje organizate, <a href="/best/kids-activities">activități pentru copii</a> de 2-3 ori/săpt.</p>

<h2>Familie de lux (€3.000-5.000/săpt.)</h2>
<p>Resort 4-5 stele cu <a href="/guide/all-inclusive">all-inclusive</a>, excursii cu barca. <a href="/guide/hotels">Hotelurile de lux</a> au cluburi pentru copii.</p>

<h2>Sfaturi</h2>
<ul>
<li>Călătoriți în <strong>iunie sau septembrie</strong> — economisiți 30-40%</li>
<li>Alegeți cazare cu bucătărie</li>
<li>Folosiți <a href="/best/family-beaches">plajele gratuite</a></li>
<li>Închiriați o <a href="/guide/car-rental">mașină</a> în loc de taxi</li>
</ul>

<h2>Comparație</h2>
<p>Halkidiki este o <strong>alegere excelentă pentru familii</strong> — mai ieftină decât insulele, fără costuri de feribot.</p>`,

      sr: `<h2>Pregled</h2>
<p>Halkidiki je <strong>idealna destinacija za porodice</strong> — bezbedne plaže, kratka rastojanja, razumne cene. Pogledajte <a href="/guide/families">vodič za porodični odmor</a>.</p>

<h2>Nedeljni budžet (2 odrasla + 2 dece)</h2>
<table>
<thead><tr><th>Kategorija</th><th>Ekonomični</th><th>Komforan</th><th>Luksuzni</th></tr></thead>
<tbody>
<tr><td>Smeštaj</td><td>€300-500</td><td>€600-1.000</td><td>€1.500-3.000</td></tr>
<tr><td>Hrana</td><td>€250-400</td><td>€450-750</td><td>€800-1.200</td></tr>
<tr><td>Prevoz</td><td>€100-150</td><td>€200-350</td><td>€300-400</td></tr>
<tr><td>Aktivnosti</td><td>€50-100</td><td>€200-400</td><td>€400-800</td></tr>
<tr><td><strong>Ukupno/ned.</strong></td><td><strong>€800-1.200</strong></td><td><strong>€1.500-2.500</strong></td><td><strong>€3.000-5.000</strong></td></tr>
</tbody>
</table>

<h2>Ekonomična porodica (€800-1.200/ned.)</h2>
<p>Odsjajte u <a href="/listings">apartmanu sa kuhinjom</a>, kuvajte polovinu obroka, uživajte na <a href="/best/family-beaches">besplatnim plažama</a>.</p>

<h2>Komforna porodica (€1.500-2.500/ned.)</h2>
<p>Hotel sa 3 zvezdice, organizovane plaže, <a href="/best/kids-activities">dečje aktivnosti</a> 2-3 puta/ned.</p>

<h2>Luksuzna porodica (€3.000-5.000/ned.)</h2>
<p>4-5 zvezdičani rizort sa <a href="/guide/all-inclusive">all-inclusive</a> paketom. <a href="/guide/hotels">Luksuzni hoteli</a> imaju dečje klubove.</p>

<h2>Saveti za uštedu</h2>
<ul>
<li>Putujte u <strong>junu ili septembru</strong> — uštedite 30-40%</li>
<li>Izaberite smeštaj sa kuhinjom</li>
<li>Koristite besplatne <a href="/best/family-beaches">porodične plaže</a></li>
<li>Iznajmite <a href="/guide/car-rental">auto</a> umesto taksija</li>
</ul>

<h2>Poređenje</h2>
<p>Halkidiki je <strong>odličan izbor za porodice</strong> — jeftiniji od ostrva, bez troškova trajekta.</p>`,
    },
  },
];

export function getCostGuide(slug: string) {
  return COST_GUIDES.find(c => c.slug === slug);
}
