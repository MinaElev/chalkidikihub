// Ported from v3 lib/faq-generators.ts (Mount Athos FAQs, 7 locales).
export type FaqItem = { question: string; answer: string };
const pick = (m: Record<string, string>, locale: string) => m[locale] || m.en || m.el;

export function generateMountAthosFaqs(locale: string): FaqItem[] {
  return [
    {
      question: pick({
        el: 'Ποιος μπορεί να επισκεφθεί το Άγιο Όρος;',
        en: 'Who can visit Mount Athos?',
        de: 'Wer darf den Berg Athos besuchen?',
        bg: 'Кой може да посети Света гора?',
        ru: 'Кто может посетить Афон?',
        ro: 'Cine poate vizita Muntele Athos?',
        sr: 'Ko može da poseti Svetu Goru?',
      }, locale),
      answer: pick({
        el: 'Μόνο άνδρες, με ειδική άδεια (Διαμονητήριο). Οι γυναίκες δεν επιτρέπεται να εισέλθουν στη χερσόνησο εδώ και ~1000 χρόνια (Άβατον). Μπορούν να δουν τα μοναστήρια από κρουαζιέρα.',
        en: 'Men only, with a special permit (Diamonitirion). Women have been forbidden from entering the peninsula for ~1000 years (Avaton rule). They can view monasteries from a sea cruise.',
        de: 'Nur Männer, mit Sondergenehmigung (Diamonitirion). Frauen ist der Zutritt seit ~1000 Jahren verboten (Abaton-Regel). Klöster können vom Schiff aus besichtigt werden.',
        bg: 'Само мъже с разрешение (Диамонитирион). Жените са забранени от ~1000 години (правило Аватон). Могат да видят манастирите от круиз.',
        ru: 'Только мужчины с разрешением (Диамонитирион). Женщинам запрещён вход более 1000 лет (Аватон). Можно осматривать монастыри с морской прогулки.',
        ro: 'Doar bărbați cu permis special (Diamonitirion). Femeile sunt interzise de ~1000 de ani (regula Avaton). Pot vedea mănăstirile dintr-o croazieră.',
        sr: 'Samo muškarci sa posebnom dozvolom (Diamonitirion). Žene su zabranjene ~1000 godina (pravilo Avaton). Mogu videti manastire sa krstarenja.',
      }, locale),
    },
    {
      question: pick({
        el: 'Πώς βγάζω την άδεια εισόδου (Διαμονητήριο);',
        en: 'How do I get the entry permit (Diamonitirion)?',
        de: 'Wie erhalte ich die Einreisegenehmigung (Diamonitirion)?',
        bg: 'Как да получа разрешението (Диамонитирион)?',
        ru: 'Как получить разрешение (Диамонитирион)?',
        ro: 'Cum obțin permisul (Diamonitirion)?',
        sr: 'Kako da dobijem dozvolu (Diamonitirion)?',
      }, locale),
      answer: pick({
        el: 'Κλείνεται μέσω του Γραφείου Προσκυνητών στη Θεσσαλονίκη (+30 2310 252578) αρκετές εβδομάδες πριν, περισσότερο το καλοκαίρι και στις μεγάλες γιορτές. Χρειάζεστε διαβατήριο ή ταυτότητα και, για διανυκτέρευση, κράτηση σε μονή. Το διαμονητήριο κοστίζει περίπου 25–30 €· η φιλοξενία στις μονές είναι δωρεάν.',
        en: 'Book it through the Pilgrims\' Office in Thessaloniki (+30 2310 252578) several weeks ahead, more in summer and on major feasts. You need a passport or ID and, to stay overnight, a booking with a monastery. The permit costs about €25–30; hospitality in the monasteries is free.',
        de: 'Über das Pilgerbüro in Thessaloniki (+30 2310 252578) mehrere Wochen im Voraus buchen, im Sommer und an großen Feiertagen früher. Nötig sind Reisepass oder Ausweis und für eine Übernachtung eine Reservierung in einem Kloster. Die Genehmigung kostet etwa 25–30 €; die Unterkunft in den Klöstern ist kostenlos.',
        bg: 'Резервира се чрез Бюрото за поклонници в Солун (+30 2310 252578) няколко седмици предварително, по-рано през лятото и за големите празници. Нужни са паспорт или лична карта и, за нощувка, резервация в манастир. Разрешението струва около 25–30 €; гостоприемството в манастирите е безплатно.',
        ru: 'Оформляется через Паломническое бюро в Салониках (+30 2310 252578) за несколько недель, летом и к большим праздникам — раньше. Нужны паспорт или удостоверение личности и, для ночёвки, бронь в монастыре. Разрешение стоит около 25–30 €; проживание в монастырях бесплатное.',
        ro: 'Se rezervă prin Biroul Pelerinilor din Salonic (+30 2310 252578) cu câteva săptămâni înainte, mai devreme vara și la marile sărbători. Aveți nevoie de pașaport sau carte de identitate și, pentru înnoptare, de o rezervare la o mănăstire. Permisul costă aproximativ 25–30 €; găzduirea în mănăstiri este gratuită.',
        sr: 'Rezerviše se preko Kancelarije za hodočasnike u Solunu (+30 2310 252578) nekoliko nedelja unapred, leti i za velike praznike i ranije. Potrebni su pasoš ili lična karta i, za noćenje, rezervacija u manastiru. Dozvola košta oko 25–30 €; gostoprimstvo u manastirima je besplatno.',
      }, locale),
    },
    {
      question: pick({
        el: 'Πώς φτάνω στο Άγιο Όρος;',
        en: 'How do I get to Mount Athos?',
        de: 'Wie komme ich zum Berg Athos?',
        bg: 'Как стигам до Света гора?',
        ru: 'Как добраться до Афона?',
        ro: 'Cum ajung la Muntele Athos?',
        sr: 'Kako da stignem do Svete Gore?',
      }, locale),
      answer: pick({
        el: 'Με φέρι από την Ουρανούπολη (στην ηπειρωτική Χαλκιδική) προς τη Δάφνη — σημείο εισόδου στη χερσόνησο. Διαδρομή ~2 ώρες. Στην Ουρανούπολη ελέγχεται το Διαμονητήριο πριν επιβιβαστείς.',
        en: 'Ferry from Ouranoupoli (on mainland Halkidiki) to Daphni — the entry port. ~2 hours. Your Diamonitirion is checked in Ouranoupoli before boarding.',
        de: 'Fähre von Ouranoupoli (Festland Chalkidiki) nach Daphni — Einreisehafen. ~2 Stunden. Das Diamonitirion wird vor dem Einsteigen kontrolliert.',
        bg: 'С ферибот от Уранополи (на континентална Халкидики) до Дафни — входен пункт. ~2 часа. Диамонитирионът се проверява преди качване.',
        ru: 'Паромом из Уранополиса (материковая Халкидики) до Дафни — порт въезда. ~2 часа. Диамонитирион проверяется в Уранополисе.',
        ro: 'Cu feribotul din Ouranoupoli (Halkidiki continentală) la Daphni — punctul de intrare. ~2 ore. Diamonitirionul este verificat înainte de îmbarcare.',
        sr: 'Trajektom iz Uranopolisa (kontinentalna Halkidiki) do Dafnija — ulazna luka. ~2 sata. Diamonitirion se proverava pre ukrcavanja.',
      }, locale),
    },
    {
      question: pick({
        el: 'Πόσα μοναστήρια έχει το Άγιο Όρος;',
        en: 'How many monasteries are there on Mount Athos?',
        de: 'Wie viele Klöster gibt es auf dem Berg Athos?',
        bg: 'Колко манастира има в Света гора?',
        ru: 'Сколько монастырей на Афоне?',
        ro: 'Câte mănăstiri sunt pe Muntele Athos?',
        sr: 'Koliko manastira ima Sveta Gora?',
      }, locale),
      answer: pick({
        el: '20 μοναστήρια κυρίαρχα (ηγουμενεία) και πολλές σκήτες/κελιά. Τα πιο γνωστά: Μεγίστη Λαύρα, Βατοπαίδι, Ιβήρων, Χιλανδαρίου, Σιμωνόπετρα, Αγίου Παύλου, Διονυσίου.',
        en: '20 ruling monasteries plus many sketes and cells. Best-known: Megisti Lavra, Vatopedi, Iviron, Chilandariou, Simonos Petras, Agiou Pavlou, Dionysiou.',
        de: '20 herrschende Klöster plus zahlreiche Sketen und Zellen. Bekannteste: Megisti Lavra, Vatopedi, Iviron, Chilandariou, Simonos Petras, Agiou Pavlou, Dionysiou.',
        bg: '20 управляващи манастира плюс много скитове и килии. Най-известни: Велика Лавра, Ватопед, Ивирон, Хилендар, Симонопетра.',
        ru: '20 правящих монастырей плюс многие скиты и кельи. Самые известные: Великая Лавра, Ватопед, Иверон, Хиландар, Симонопетра.',
        ro: '20 de mănăstiri conducătoare plus multe schituri și chilii. Cele mai cunoscute: Marea Lavră, Vatoped, Iviron, Hilandar, Simonos Petras.',
        sr: '20 vladajućih manastira i mnogo skitova i ćelija. Najpoznatiji: Velika Lavra, Vatoped, Iveron, Hilandar, Simonopetra.',
      }, locale),
    },
    {
      question: pick({
        el: 'Μπορώ να δω το Άγιο Όρος χωρίς να μπω;',
        en: 'Can I see Mount Athos without entering?',
        de: 'Kann ich den Berg Athos sehen, ohne einzureisen?',
        bg: 'Мога ли да видя Света гора, без да влизам?',
        ru: 'Можно ли увидеть Афон, не въезжая?',
        ro: 'Pot vedea Muntele Athos fără să intru?',
        sr: 'Mogu li da vidim Svetu Goru bez ulaska?',
      }, locale),
      answer: pick({
        el: 'Ναι. Από την Ουρανούπολη φεύγουν καθημερινές κρουαζιέρες (καλοκαίρι) που πλέουν παράλληλα με τη δυτική ακτή — δες τα μοναστήρια από κοντά. Διαθέσιμο και για γυναίκες/παιδιά.',
        en: 'Yes. Daily summer cruises leave Ouranoupoli sailing along the western coast — monasteries are visible from sea level. Open to women and children.',
        de: 'Ja. Tägliche Sommerkreuzfahrten ab Ouranoupoli entlang der Westküste — Klöster vom Meer aus sichtbar. Auch für Frauen und Kinder.',
        bg: 'Да. Ежедневни летни круизи от Уранополи покрай западния бряг — манастирите се виждат отдалеч. Допускат се жени и деца.',
        ru: 'Да. Ежедневные летние круизы из Уранополиса вдоль западного побережья — монастыри видны с моря. Доступно женщинам и детям.',
        ro: 'Da. Croaziere zilnice de vară din Ouranoupoli de-a lungul coastei vestice — mănăstirile sunt vizibile de la mare. Deschis femeilor și copiilor.',
        sr: 'Da. Dnevna letnja krstarenja iz Uranopolisa duž zapadne obale — manastiri se vide sa mora. Otvoreno za žene i decu.',
      }, locale),
    },
  ];
}
