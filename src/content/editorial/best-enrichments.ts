// Editorial enrichment content for /best/[slug] pages. All 7 locales.
// The 15 live lists (KEPT_BEST) were rewritten in Oct 2026 in all 7 locales: no prices, no invented venues;
// ratings shown in the lists are Google's. Entries for merged lists are unused.

type L = Record<string, string>;

export interface BestGuideEnrichment {
  intro?: L;
  criteria?: L;
  seasonal?: L;
  tips?: L;
  faqs?: { q: L; a: L }[];
}

export const ENRICHMENTS: Record<string, BestGuideEnrichment> = {
  "beaches-kassandra": {
    "intro": {
      "el": "<p>Η Κασσάνδρα είναι η πιο κοντινή χερσόνησος στη Θεσσαλονίκη, περίπου 1–1,5 ώρα από το αεροδρόμιο. Έχει μεγάλες οργανωμένες αμμουδιές με beach bars, αλλά και ήσυχους κόλπους. Οι δύο ακτές της διαφέρουν: η ανατολική, στον Τορωναίο κόλπο, βλέπει την ανατολή και τη Σιθωνία απέναντι, ενώ η δυτική βλέπει το ηλιοβασίλεμα. Η λίστα ταξινομείται με βάση τις βαθμολογίες, τις φωτογραφίες και τα χαρακτηριστικά κάθε παραλίας.</p>",
      "en": "<p>Kassandra is the peninsula closest to Thessaloniki, about 1–1.5 hours from the airport. It has long organised sandy beaches with beach bars, as well as quiet coves. Its two coasts differ: the east coast, on the Toroneos Gulf, faces the sunrise and Sithonia across the water, while the west coast faces the sunset. The list is ranked by ratings, photos and each beach's features.</p>",
      "de": "<p>Kassandra ist die Halbinsel, die Thessaloniki am nächsten liegt, etwa 1–1,5 Stunden vom Flughafen. Es gibt lange organisierte Sandstrände mit Strandbars, aber auch ruhige Buchten. Die beiden Küsten unterscheiden sich: Die Ostküste am Toronäischen Golf blickt in den Sonnenaufgang und hinüber nach Sithonia, die Westküste in den Sonnenuntergang. Die Liste ist nach Bewertungen, Fotos und Ausstattung der Strände sortiert.</p>",
      "bg": "<p>Касандра е полуостровът, най-близък до Солун — на около 1–1,5 часа от летището. Има дълги организирани пясъчни плажове с плажни барове, но и тихи заливи. Двата ѝ бряга се различават: източният, на Торонейския залив, гледа към изгрева и към Ситония отсреща, а западният — към залеза. Списъкът е подреден според оценките, снимките и характеристиките на всеки плаж.</p>",
      "ru": "<p>Кассандра — ближайший к Салоникам полуостров, примерно в 1–1,5 часа от аэропорта. Здесь длинные оборудованные песчаные пляжи с барами и тихие бухты. Два побережья различаются: восточное, на Торонейском заливе, смотрит на рассвет и на Ситонию напротив, а западное — на закат. Список упорядочен по оценкам, фотографиям и особенностям каждого пляжа.</p>",
      "ro": "<p>Kassandra este peninsula cea mai apropiată de Salonic, la circa 1–1,5 ore de aeroport. Are plaje lungi cu nisip, amenajate, cu baruri, dar și golfulețe liniștite. Cele două coaste diferă: cea de est, la Golful Toroneos, privește spre răsărit și spre Sithonia, iar cea de vest spre apus. Lista e ordonată după evaluări, fotografii și caracteristicile fiecărei plaje.</p>",
      "sr": "<p>Kasandra je poluostrvo najbliže Solunu, oko 1–1,5 sat od aerodroma. Ima duge uređene peščane plaže sa beach barovima, ali i mirne uvale. Njene dve obale se razlikuju: istočna, na Toronejskom zalivu, gleda na izlazak sunca i Sitoniju preko puta, a zapadna na zalazak. Lista je poređana po ocenama, fotografijama i karakteristikama svake plaže.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές</h2><ul><li><strong>Νωρίς:</strong> στις γνωστές παραλίες, όπως Καλλιθέα, Χανιώτη και Σάνη, οι ξαπλώστρες και το πάρκινγκ γεμίζουν τον Αύγουστο από νωρίς.</li><li><strong>Δική σου πετσέτα:</strong> η παραλία είναι κοινόχρηστη· δεν είσαι υποχρεωμένος να νοικιάσεις ξαπλώστρα.</li><li><strong>Ηλιοβασίλεμα:</strong> για τη δύση πήγαινε στη δυτική ακτή, όπως στο <a href=\"/places/posidi\">Ποσείδι</a> και τη <a href=\"/places/siviri\">Σίβηρη</a>.</li><li><strong>Φαγητό:</strong> ένα-δύο στενά πιο μέσα από την παραλία τρως συνήθως καλύτερα και οικονομικότερα.</li></ul>",
      "en": "<h2>Tips</h2><ul><li><strong>Go early:</strong> at the well-known beaches, such as Kallithea, Hanioti and Sani, sunbeds and parking fill up early in August.</li><li><strong>Your own towel:</strong> the beach is public; you don't have to rent a sunbed.</li><li><strong>Sunset:</strong> head to the west coast, for example <a href=\"/places/posidi\">Possidi</a> and <a href=\"/places/siviri\">Siviri</a>.</li><li><strong>Food:</strong> a lane or two back from the beach you usually eat better and for less.</li></ul>",
      "de": "<h2>Tipps</h2><ul><li><strong>Früh da sein:</strong> An bekannten Stränden wie Kallithea, Chanioti und Sani sind Liegen und Parkplätze im August früh belegt.</li><li><strong>Eigenes Handtuch:</strong> Der Strand ist öffentlich, eine Liege musst du nicht mieten.</li><li><strong>Sonnenuntergang:</strong> dafür an die Westküste, etwa nach <a href=\"/places/posidi\">Possidi</a> und <a href=\"/places/siviri\">Siviri</a>.</li><li><strong>Essen:</strong> Ein, zwei Gassen hinter dem Strand isst man meist besser und günstiger.</li></ul>",
      "bg": "<h2>Съвети</h2><ul><li><strong>Рано:</strong> на известните плажове като Калитея, Ханиоти и Сани шезлонгите и паркингът се пълнят рано през август.</li><li><strong>Своя кърпа:</strong> плажът е обществен — не сте длъжни да наемате шезлонг.</li><li><strong>Залез:</strong> отидете на западния бряг, например в <a href=\"/places/posidi\">Посиди</a> и <a href=\"/places/siviri\">Сивири</a>.</li><li><strong>Храна:</strong> една-две улички навътре от плажа обикновено се яде по-добре и по-евтино.</li></ul>",
      "ru": "<h2>Советы</h2><ul><li><strong>Приезжайте рано:</strong> на известных пляжах — Калитея, Ханиоти, Сани — лежаки и парковки в августе заполняются рано.</li><li><strong>Своё полотенце:</strong> пляж общественный, арендовать лежак не обязательно.</li><li><strong>Закат:</strong> поезжайте на западное побережье, например в <a href=\"/places/posidi\">Посиди</a> и <a href=\"/places/siviri\">Сивири</a>.</li><li><strong>Еда:</strong> в одной-двух улочках от пляжа обычно вкуснее и дешевле.</li></ul>",
      "ro": "<h2>Sfaturi</h2><ul><li><strong>Devreme:</strong> la plajele cunoscute, ca Kallithea, Hanioti și Sani, șezlongurile și parcarea se ocupă devreme în august.</li><li><strong>Prosopul tău:</strong> plaja e publică; nu ești obligat să închiriezi șezlong.</li><li><strong>Apus:</strong> mergi pe coasta de vest, de exemplu la <a href=\"/places/posidi\">Possidi</a> și <a href=\"/places/siviri\">Siviri</a>.</li><li><strong>Mâncare:</strong> la o stradă-două de plajă mănânci de obicei mai bine și mai ieftin.</li></ul>",
      "sr": "<h2>Saveti</h2><ul><li><strong>Rano:</strong> na poznatim plažama, kao što su Kalitea, Hanioti i Sani, ležaljke i parking se u avgustu rano popune.</li><li><strong>Svoj peškir:</strong> plaža je javna; ne morate da iznajmite ležaljku.</li><li><strong>Zalazak sunca:</strong> idite na zapadnu obalu, na primer u <a href=\"/places/posidi\">Posidi</a> i <a href=\"/places/siviri\">Siviri</a>.</li><li><strong>Hrana:</strong> ulicu-dve od plaže obično se jede bolje i jeftinije.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Ποια είναι η πιο όμορφη παραλία της Κασσάνδρας;",
          "en": "Which is the most beautiful beach in Kassandra?",
          "de": "Welcher ist der schönste Strand Kassandras?",
          "bg": "Кой е най-красивият плаж в Касандра?",
          "ru": "Какой пляж Кассандры самый красивый?",
          "ro": "Care este cea mai frumoasă plajă din Kassandra?",
          "sr": "Koja je najlepša plaža na Kasandri?"
        },
        "a": {
          "el": "Εξαρτάται από το τι ψάχνεις: το ακρωτήριο του Ποσειδίου με τον φάρο και τη λωρίδα άμμου για το τοπίο, η Σάνη για οργανωμένη παραλία, η Καλλιθέα για ζωντάνια.",
          "en": "It depends what you want: Possidi cape with its lighthouse and sand spit for the scenery, Sani for an organised beach, Kallithea for a lively atmosphere.",
          "de": "Das hängt davon ab, was du suchst: das Kap Possidi mit Leuchtturm und Sandzunge für die Landschaft, Sani für einen organisierten Strand, Kallithea für Trubel.",
          "bg": "Зависи какво търсите: нос Посиди с фара и пясъчната ивица заради пейзажа, Сани за организиран плаж, Калитея за оживление.",
          "ru": "Зависит от того, что вы ищете: мыс Посиди с маяком и песчаной косой — ради пейзажа, Сани — оборудованный пляж, Калитея — оживлённая атмосфера.",
          "ro": "Depinde ce cauți: capul Possidi, cu farul și limba de nisip, pentru peisaj; Sani pentru o plajă amenajată; Kallithea pentru animație.",
          "sr": "Zavisi šta tražite: rt Posidi sa svetionikom i peščanim jezičkom zbog pejzaža, Sani za uređenu plažu, Kalitea za živost."
        }
      },
      {
        "q": {
          "el": "Είναι κατάλληλες για παιδιά;",
          "en": "Are they suitable for children?",
          "de": "Sind sie für Kinder geeignet?",
          "bg": "Подходящи ли са за деца?",
          "ru": "Подходят ли они для детей?",
          "ro": "Sunt potrivite pentru copii?",
          "sr": "Da li su pogodne za decu?"
        },
        "a": {
          "el": "Πολλές έχουν ρηχά νερά, όπως η Σίβηρη, η Νέα Φώκαια και το Πευκοχώρι. Δες τις <a href=\"/blog/best-beaches-shallow-water\">παραλίες με ρηχά νερά</a>.",
          "en": "Many have shallow water, such as Siviri, Nea Fokaia and Pefkochori. See the <a href=\"/blog/best-beaches-shallow-water\">beaches with shallow water</a>.",
          "de": "Viele haben flaches Wasser, etwa Siviri, Nea Fokaia und Pefkochori. Siehe die <a href=\"/blog/best-beaches-shallow-water\">Strände mit flachem Wasser</a>.",
          "bg": "Много от тях имат плитка вода, като Сивири, Неа Фокия и Пефкохори. Вижте <a href=\"/blog/best-beaches-shallow-water\">плажовете с плитка вода</a>.",
          "ru": "Во многих мелко, например в Сивири, Неа Фокее и Пефкохори. Смотрите <a href=\"/blog/best-beaches-shallow-water\">пляжи с мелкой водой</a>.",
          "ro": "Multe au apă mică, precum Siviri, Nea Fokaia și Pefkohori. Vezi <a href=\"/blog/best-beaches-shallow-water\">plajele cu apă mică</a>.",
          "sr": "Mnoge imaju plitku vodu, poput Sivirija, Nea Fokee i Pefkohorija. Pogledajte <a href=\"/blog/best-beaches-shallow-water\">plaže sa plitkom vodom</a>."
        }
      },
      {
        "q": {
          "el": "Πόσο απέχει από τη Θεσσαλονίκη;",
          "en": "How far is it from Thessaloniki?",
          "de": "Wie weit ist es von Thessaloniki?",
          "bg": "Колко е далеч от Солун?",
          "ru": "Как далеко от Салоник?",
          "ro": "Cât de departe e de Salonic?",
          "sr": "Koliko je udaljena od Soluna?"
        },
        "a": {
          "el": "Από το αεροδρόμιο η Νέα Ποτίδαια, η είσοδος της χερσονήσου, είναι περίπου μία ώρα, και η Καλλιθέα περίπου 1 ώρα και 10 λεπτά.",
          "en": "From the airport, Nea Potidea at the entrance to the peninsula is about an hour away, and Kallithea about 1 hour 10 minutes.",
          "de": "Vom Flughafen ist Nea Potidea am Eingang der Halbinsel etwa eine Stunde entfernt, Kallithea etwa 1 Stunde 10 Minuten.",
          "bg": "От летището Неа Потидея, входът на полуострова, е на около час, а Калитея — на около 1 час и 10 минути.",
          "ru": "От аэропорта до Неа Потидеи у въезда на полуостров около часа, до Калитеи — около 1 часа 10 минут.",
          "ro": "De la aeroport, Nea Potidea, la intrarea în peninsulă, e la circa o oră, iar Kallithea la circa o oră și 10 minute.",
          "sr": "Od aerodroma je Nea Potideja, na ulazu u poluostrvo, oko sat vremena, a Kalitea oko sat i 10 minuta."
        }
      }
    ]
  },
  "beaches-sithonia": {
    "intro": {
      "el": "<p>Η Σιθωνία, η μεσαία χερσόνησος, είναι πιο άγρια από την Κασσάνδρα: πεύκα ως την άμμο, μικρότεροι κόλποι, νησάκια και πολύ καθαρά νερά. Εδώ είναι οι <a href=\"/beaches/portokali-sithonia\">Καβουρότρυπες</a>, το <a href=\"/beaches/karidi-sithonia\">Καρύδι</a> και η <a href=\"/beaches/fava-beach-sithonia\">Φάβα</a>. Η λίστα ταξινομείται με βάση τις βαθμολογίες, τις φωτογραφίες και τα χαρακτηριστικά κάθε παραλίας.</p>",
      "en": "<p>Sithonia, the middle peninsula, is wilder than Kassandra: pines down to the sand, smaller coves, islets and very clear water. Here you'll find <a href=\"/beaches/portokali-sithonia\">Kavourotripes</a>, <a href=\"/beaches/karidi-sithonia\">Karydi</a> and <a href=\"/beaches/fava-beach-sithonia\">Fava</a>. The list is ranked by ratings, photos and each beach's features.</p>",
      "de": "<p>Sithonia, die mittlere Halbinsel, ist wilder als Kassandra: Pinien bis an den Sand, kleinere Buchten, Inselchen und sehr klares Wasser. Hier liegen <a href=\"/beaches/portokali-sithonia\">Kavourotripes</a>, <a href=\"/beaches/karidi-sithonia\">Karydi</a> und <a href=\"/beaches/fava-beach-sithonia\">Fava</a>. Die Liste ist nach Bewertungen, Fotos und Ausstattung der Strände sortiert.</p>",
      "bg": "<p>Ситония, средният полуостров, е по-див от Касандра: борове до пясъка, по-малки заливи, островчета и много бистра вода. Тук са <a href=\"/beaches/portokali-sithonia\">Кавуротрипес</a>, <a href=\"/beaches/karidi-sithonia\">Кариди</a> и <a href=\"/beaches/fava-beach-sithonia\">Фава</a>. Списъкът е подреден според оценките, снимките и характеристиките на всеки плаж.</p>",
      "ru": "<p>Ситония, средний полуостров, более дикая, чем Кассандра: сосны до самого песка, бухты поменьше, островки и очень прозрачная вода. Здесь <a href=\"/beaches/portokali-sithonia\">Кавуротрипес</a>, <a href=\"/beaches/karidi-sithonia\">Кариди</a> и <a href=\"/beaches/fava-beach-sithonia\">Фава</a>. Список упорядочен по оценкам, фотографиям и особенностям каждого пляжа.</p>",
      "ro": "<p>Sithonia, peninsula din mijloc, e mai sălbatică decât Kassandra: pini până la nisip, golfuri mai mici, insulițe și apă foarte limpede. Aici sunt <a href=\"/beaches/portokali-sithonia\">Kavourotripes</a>, <a href=\"/beaches/karidi-sithonia\">Karydi</a> și <a href=\"/beaches/fava-beach-sithonia\">Fava</a>. Lista e ordonată după evaluări, fotografii și caracteristicile fiecărei plaje.</p>",
      "sr": "<p>Sitonija, srednje poluostrvo, divljija je od Kasandre: borovi do peska, manje uvale, ostrvca i veoma bistra voda. Ovde su <a href=\"/beaches/portokali-sithonia\">Kavurotripes</a>, <a href=\"/beaches/karidi-sithonia\">Karidi</a> i <a href=\"/beaches/fava-beach-sithonia\">Fava</a>. Lista je poređana po ocenama, fotografijama i karakteristikama svake plaže.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές</h2><ul><li><strong>Νωρίς:</strong> στις διάσημες παραλίες τα μικρά πάρκινγκ γεμίζουν τον Ιούλιο και τον Αύγουστο από το πρωί.</li><li><strong>Σκιά και νερό:</strong> στις ανοργάνωτες παραλίες δεν υπάρχει τίποτα· πάρε ομπρέλα, νερό και σνακ.</li><li><strong>Παπούτσια θαλάσσης:</strong> χρήσιμα στα βράχια, όπως στις Καβουρότρυπες.</li><li><strong>Snorkeling:</strong> δες τα <a href=\"/best/snorkeling-spots\">καλύτερα σημεία για snorkeling</a>.</li></ul>",
      "en": "<h2>Tips</h2><ul><li><strong>Go early:</strong> at the famous beaches the small car parks fill up from the morning in July and August.</li><li><strong>Shade and water:</strong> unorganised beaches have nothing; bring an umbrella, water and snacks.</li><li><strong>Water shoes:</strong> useful on the rocks, as at Kavourotripes.</li><li><strong>Snorkelling:</strong> see the <a href=\"/best/snorkeling-spots\">best snorkelling spots</a>.</li></ul>",
      "de": "<h2>Tipps</h2><ul><li><strong>Früh da sein:</strong> An den bekannten Stränden sind die kleinen Parkplätze im Juli und August schon morgens voll.</li><li><strong>Schatten und Wasser:</strong> An unorganisierten Stränden gibt es nichts; Schirm, Wasser und Snacks mitnehmen.</li><li><strong>Badeschuhe:</strong> nützlich auf den Felsen, etwa in Kavourotripes.</li><li><strong>Schnorcheln:</strong> siehe die <a href=\"/best/snorkeling-spots\">besten Schnorchelplätze</a>.</li></ul>",
      "bg": "<h2>Съвети</h2><ul><li><strong>Рано:</strong> на известните плажове малките паркинги се пълнят още сутринта през юли и август.</li><li><strong>Сянка и вода:</strong> на неорганизираните плажове няма нищо — вземете чадър, вода и храна.</li><li><strong>Обувки за вода:</strong> полезни по скалите, например в Кавуротрипес.</li><li><strong>Шнорхел:</strong> вижте <a href=\"/best/snorkeling-spots\">най-добрите места за шнорхел</a>.</li></ul>",
      "ru": "<h2>Советы</h2><ul><li><strong>Приезжайте рано:</strong> на знаменитых пляжах маленькие парковки в июле и августе заполняются с утра.</li><li><strong>Тень и вода:</strong> на диких пляжах ничего нет — берите зонт, воду и перекус.</li><li><strong>Обувь для воды:</strong> пригодится на камнях, например в Кавуротрипесе.</li><li><strong>Снорклинг:</strong> смотрите <a href=\"/best/snorkeling-spots\">лучшие места для снорклинга</a>.</li></ul>",
      "ro": "<h2>Sfaturi</h2><ul><li><strong>Devreme:</strong> la plajele celebre, parcările mici se umplu de dimineață în iulie și august.</li><li><strong>Umbră și apă:</strong> plajele neamenajate nu au nimic; ia umbrelă, apă și gustări.</li><li><strong>Papuci de apă:</strong> utili pe stânci, cum e la Kavourotripes.</li><li><strong>Snorkeling:</strong> vezi <a href=\"/best/snorkeling-spots\">cele mai bune locuri de snorkeling</a>.</li></ul>",
      "sr": "<h2>Saveti</h2><ul><li><strong>Rano:</strong> na čuvenim plažama mali parkinzi se u julu i avgustu popune od jutra.</li><li><strong>Senka i voda:</strong> na neuređenim plažama nema ničega; ponesite suncobran, vodu i užinu.</li><li><strong>Obuća za vodu:</strong> korisna na stenama, kao na Kavurotripesu.</li><li><strong>Ronjenje na dah:</strong> pogledajte <a href=\"/best/snorkeling-spots\">najbolja mesta za ronjenje na dah</a>.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Σιθωνία ή Κασσάνδρα;",
          "en": "Sithonia or Kassandra?",
          "de": "Sithonia oder Kassandra?",
          "bg": "Ситония или Касандра?",
          "ru": "Ситония или Кассандра?",
          "ro": "Sithonia sau Kassandra?",
          "sr": "Sitonija ili Kasandra?"
        },
        "a": {
          "el": "Η Σιθωνία για φύση, κολπίσκους και ησυχία· η Κασσάνδρα για οργανωμένες παραλίες, βραδινή ζωή και μικρότερη διαδρομή. Δες τη <a href=\"/blog/sithonia-vs-kassandra\">σύγκριση</a>.",
          "en": "Sithonia for nature, coves and quiet; Kassandra for organised beaches, nightlife and a shorter drive. See the <a href=\"/blog/sithonia-vs-kassandra\">comparison</a>.",
          "de": "Sithonia für Natur, Buchten und Ruhe; Kassandra für organisierte Strände, Nachtleben und eine kürzere Anfahrt. Siehe den <a href=\"/blog/sithonia-vs-kassandra\">Vergleich</a>.",
          "bg": "Ситония за природа, заливчета и спокойствие; Касандра за организирани плажове, нощен живот и по-кратък път. Вижте <a href=\"/blog/sithonia-vs-kassandra\">сравнението</a>.",
          "ru": "Ситония — природа, бухты и тишина; Кассандра — оборудованные пляжи, ночная жизнь и дорога короче. Смотрите <a href=\"/blog/sithonia-vs-kassandra\">сравнение</a>.",
          "ro": "Sithonia pentru natură, golfulețe și liniște; Kassandra pentru plaje amenajate, viață de noapte și drum mai scurt. Vezi <a href=\"/blog/sithonia-vs-kassandra\">comparația</a>.",
          "sr": "Sitonija za prirodu, uvale i mir; Kasandra za uređene plaže, noćni život i kraću vožnju. Pogledajte <a href=\"/blog/sithonia-vs-kassandra\">poređenje</a>."
        }
      },
      {
        "q": {
          "el": "Χρειάζομαι τζιπ;",
          "en": "Do I need a 4x4?",
          "de": "Brauche ich einen Geländewagen?",
          "bg": "Трябва ли ми джип?",
          "ru": "Нужен ли внедорожник?",
          "ro": "Am nevoie de 4x4?",
          "sr": "Da li mi treba džip?"
        },
        "a": {
          "el": "Όχι. Σε μερικές παραλίες το τελευταίο κομμάτι είναι χωματόδρομος, που ένα κανονικό αυτοκίνητο περνά με προσοχή.",
          "en": "No. At a few beaches the last stretch is a dirt road, which a normal car can manage with care.",
          "de": "Nein. Bei einigen Stränden ist das letzte Stück eine Schotterstraße, die ein normales Auto vorsichtig schafft.",
          "bg": "Не. При някои плажове последният участък е черен път, който обикновена кола минава внимателно.",
          "ru": "Нет. К некоторым пляжам последний отрезок — грунтовка, которую обычная машина проезжает осторожно.",
          "ro": "Nu. La câteva plaje ultima porțiune e drum de pământ, pe care o mașină obișnuită îl trece cu grijă.",
          "sr": "Ne. Do nekih plaža poslednji deo je makadam, koji običan auto pređe uz oprez."
        }
      },
      {
        "q": {
          "el": "Πού να μείνω;",
          "en": "Where should I stay?",
          "de": "Wo übernachten?",
          "bg": "Къде да отседна?",
          "ru": "Где остановиться?",
          "ro": "Unde să stau?",
          "sr": "Gde da odsednem?"
        },
        "a": {
          "el": "Στη Νικήτη για εύκολη πρόσβαση, στη Βουρβουρού ή τη Σάρτη για την ανατολική ακτή, στον Νέο Μαρμαρά για τη δυτική. Δες το <a href=\"/blog/where-to-stay-halkidiki-first-time\">πού να μείνεις</a>.",
          "en": "Nikiti for easy access, Vourvourou or Sarti for the east coast, Neos Marmaras for the west. See <a href=\"/blog/where-to-stay-halkidiki-first-time\">where to stay</a>.",
          "de": "Nikiti für eine einfache Anreise, Vourvourou oder Sarti für die Ostküste, Neos Marmaras für die Westküste. Siehe <a href=\"/blog/where-to-stay-halkidiki-first-time\">wo übernachten</a>.",
          "bg": "В Никити за лесен достъп, във Вурвуру или Сарти за източния бряг, в Неос Мармарас за западния. Вижте <a href=\"/blog/where-to-stay-halkidiki-first-time\">къде да отседнете</a>.",
          "ru": "В Никити — удобный доступ, в Вурвуру или Сарти — восточное побережье, в Неос Мармарасе — западное. Смотрите <a href=\"/blog/where-to-stay-halkidiki-first-time\">где остановиться</a>.",
          "ro": "În Nikiti pentru acces ușor, în Vourvourou sau Sarti pentru coasta de est, în Neos Marmaras pentru cea de vest. Vezi <a href=\"/blog/where-to-stay-halkidiki-first-time\">unde să te cazezi</a>.",
          "sr": "U Nikitiju zbog lakog pristupa, u Vurvuruu ili Sartiju za istočnu obalu, u Neos Marmarasu za zapadnu. Pogledajte <a href=\"/blog/where-to-stay-halkidiki-first-time\">gde odsesti</a>."
        }
      }
    ]
  },
  "family-beaches": {
    "intro": {
      "el": "<p>Με μικρά παιδιά μια παραλία δεν επιλέγεται μόνο από ομορφιά — επιλέγεται από <strong>ασφάλεια</strong>. Ρηχή ζώνη που εκτείνεται τουλάχιστον 20-30 μέτρα από την ακτή, χωρίς ξαφνικές βαθιές περιοχές. Άμμος που μπορούν να περπατήσουν χωρίς να πληγωθούν. Υπηρεσίες όπως ντουζ, lifeguard, ξαπλώστρες με ομπρέλα για να γλιτώσεις από τον ήλιο των 12. Σκιά για τη σιέστα. Αυτή η λίστα συγκεντρώνει τις παραλίες της Χαλκιδικής που έχουν χαρακτηριστικό shallowWater από τη βάση μας — δηλαδή έχουν επιβεβαιωθεί ως ασφαλείς για μικρά παιδιά — και προστίθενται κατά rating.</p>",
      "en": "<p>With small children a beach isn't picked just for looks — it's picked for <strong>safety</strong>. A shallow zone stretching at least 20-30 metres from shore, with no sudden drops. Sand they can walk on without hurting themselves. Services like showers, lifeguards, loungers with umbrellas so you can escape the noon sun. Shade for the afternoon nap. This list collects Halkidiki beaches tagged with shallowWater in our database — confirmed safe for small children — sorted by rating.</p>",
      "de": "<p>Mit kleinen Kindern wählt man einen Strand nicht nur nach Schönheit aus — sondern nach <strong>Sicherheit</strong>. Eine flache Zone, die sich mindestens 20-30 Meter vom Ufer erstreckt, ohne plötzliche Tiefen. Sand, auf dem sie laufen können, ohne sich zu verletzen. Einrichtungen wie Duschen, Rettungsschwimmer, Liegen mit Sonnenschirmen, um der Mittagssonne zu entkommen. Schatten für die Siesta. Diese Liste fasst die Strände in Chalkidiki zusammen, die in unserer Datenbank als shallowWater gekennzeichnet sind — das heißt, sie wurden als sicher für kleine Kinder bestätigt — und werden nach Bewertung hinzugefügt.</p>",
      "ro": "<p>Cu copii mici, o plajă nu este aleasă doar pentru frumusețe — este aleasă pentru <strong>siguranță</strong>. Zonă de mică adâncime care se extinde cel puțin 20-30 de metri de la țărm, fără zone adânci bruște. Nisip pe care pot merge fără să se rănească. Servicii precum dușuri, salvamar, șezlonguri cu umbrelă pentru a te feri de soarele de la ora 12. Umbra pentru siestă. Această listă adună plajele din Halkidiki care au caracteristică shallowWater din baza noastră — adică au fost confirmate ca fiind sigure pentru copii mici — și sunt adăugate în funcție de rating.</p>",
      "sr": "<p>Kada putujete sa malom decom, plaža se ne bira samo po lepoti — bira se po <strong>bezbednosti</strong>. Plitka zona koja se proteže najmanje 20-30 metara od obale, bez naglih dubokih delova. Pesak po kojem mogu hodati bez povreda. Usluge kao što su tuševi, spasioci, ležaljke sa suncobranom za zaštitu od podnevnog sunca. Hlad za popodnevni odmor. Ova lista okuplja plaže Halkidikija koje imaju karakteristiku shallowWater iz naše baze — što znači da su potvrđene kao bezbedne za malu decu — i dodaju se prema oceni.</p>",
      "bg": "<p>С малки деца плажът не се избира само по красота — избира се по <strong>безопасност</strong>. Плитка зона, която се простира поне 20-30 метра от брега, без внезапни дълбоки участъци. Пясък, по който могат да ходят, без да се наранят. Услуги като душове, спасител, шезлонги с чадър, за да се предпазите от слънцето в 12 часа. Сянка за следобедна почивка. Този списък събира плажовете на Халкидики, които имат характеристика shallowWater от нашата база данни — тоест са потвърдени като безопасни за малки деца — и са подредени по рейтинг.</p>",
      "ru": "<p>С маленькими детьми пляж выбирается не только по красоте — он выбирается по <strong>безопасности</strong>. Мелководная зона, простирающаяся как минимум на 20-30 метров от берега, без резких глубоких участков. Песок, по которому можно ходить, не поранившись. Услуги, такие как душ, спасатель, шезлонги с зонтиками, чтобы укрыться от полуденного солнца. Тень для сиесты. Этот список собирает пляжи Халкидики, которые имеют характеристику shallowWater в нашей базе данных — то есть подтверждены как безопасные для маленьких детей — и добавляются по рейтингу.</p>"
    },
    "seasonal": {
      "el": "<h2>Πότε να πας με παιδιά</h2><p><strong>Ιούνιος:</strong> το καλύτερο — θάλασσα 22-24°C, ζεσταίνεται γρήγορα στο ρηχό. Λίγος κόσμος. <strong>Σεπτέμβριος:</strong> εξίσου καλός — νερό ακόμα ζεστό, σαφώς λιγότερος κόσμος, καλύτερες τιμές. <strong>Αύγουστος:</strong> προσοχή — πολυκοσμία, ξαπλώστρες πιάνονται νωρίς, οι αργές χιλιάδες αγγίζουν το όριο των παιδικών αντοχών. Πρωινό 8-12 πρωτότυπη επιλογή.</p>",
      "en": "<h2>When to visit with kids</h2><p><strong>June:</strong> the best — sea 22-24°C, warms up fast in the shallows. Few crowds. <strong>September:</strong> equally good — water still warm, much smaller crowds, better prices. <strong>August:</strong> caution — high temperatures and crowds push the limits of small children. A morning swim 8-12 is the smart move.</p>",
      "de": "<h2>Wann man mit Kindern reisen sollte</h2><p><strong>Juni:</strong> der beste Monat — Meer 22-24°C, erwärmt sich schnell im Flachen. Wenig Leute. <strong>September:</strong> ebenso gut — Wasser noch warm, deutlich weniger Menschen, bessere Preise. <strong>August:</strong> Vorsicht — überfüllt, Liegen sind früh besetzt, die langsamen Tausenden erreichen die Grenzen der kindlichen Ausdauer. Morgens 8-12 eine originelle Wahl.</p>",
      "ro": "<h2>Când să mergi cu copiii</h2><p><strong>Iunie:</strong> cea mai bună perioadă — mare 22-24°C, se încălzește rapid în zonele de mică adâncime. Puțină lume. <strong>Septembrie:</strong> la fel de bun — apa încă caldă, mult mai puțină lume, prețuri mai bune. <strong>August:</strong> atenție — aglomerație, șezlongurile sunt ocupate devreme, mulțimile lente ating limita rezistenței copiilor. Dimineața 8-12 o alegere originală.</p>",
      "sr": "<h2>Kada ići sa decom</h2><p><strong>Jun:</strong> najbolji period — more 22-24°C, brzo se zagreva u plićaku. Malo ljudi. <strong>Septembar:</strong> jednako dobar — voda još uvek topla, znatno manje ljudi, bolje cene. <strong>Avgust:</strong> oprez — gužve, ležaljke se zauzimaju rano, velike gužve mogu biti naporne za decu. Jutarnji termin 8-12 je originalan izbor.</p>",
      "bg": "<h2>Кога да отидете с деца</h2><p><strong>Юни:</strong> най-добрият — море 22-24°C, бързо се затопля в плиткото. Малко хора. <strong>Септември:</strong> също добър — водата все още топла, значително по-малко хора, по-добри цени. <strong>Август:</strong> внимание — много хора, шезлонгите се заемат рано, бавните хиляди достигат границата на детските възможности. Сутрешен 8-12 оригинален избор.</p>",
      "ru": "<h2>Когда ехать с детьми</h2><p><strong>Июнь:</strong> лучшее время — море 22-24°C, быстро прогревается на мелководье. Мало людей. <strong>Сентябрь:</strong> также хорош — вода еще теплая, значительно меньше людей, лучшие цены. <strong>Август:</strong> осторожно — многолюдно, шезлонги занимают рано, медленные тысячи достигают предела детской выносливости. Утренний выбор 8-12 — оригинальный вариант.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές για οικογένειες</h2><ul><li><strong>Πρωινό slot:</strong> Φτάσε 8:30-9:00. Σιγουρεύεις ξαπλώστρα με σκιά, παίρνεις τα κρύα νερά πριν γεμίσει.</li><li><strong>Παιδικός εξοπλισμός:</strong> Φέρε σαμπρέλα/βραχιολάκι, χονδρό αντηλιακό (SPF 50+), καπέλο. Φουσκωτά για το κλιμακούμενο σερφάρισμα — προαιρετικά.</li><li><strong>Lifeguard:</strong> Σε οργανωμένες παραλίες (Σάνη, Καλλιθέα, Χανιώτη). Στις φυσικές (Σιθωνία) δεν υπάρχει — απαιτεί επίβλεψη.</li><li><strong>Φαγητό:</strong> Έχε snacks και νερό — δεν περιμένεις παιδί 4 ετών για 30' fish meal με ορθανοιχτό 35°C.</li><li><strong>Εναλλακτικά:</strong> Αν θες λιγότερο πλήθος, δες τις <a href=\"/best/quiet-beaches\">ήσυχες παραλίες</a>.</li></ul>",
      "en": "<h2>Tips for families</h2><ul><li><strong>Morning slot:</strong> Arrive 8:30-9:00. You lock in a shaded lounger and get the cooler water before the crowds.</li><li><strong>Kid kit:</strong> Bring floats/armbands, thick sunscreen (SPF 50+), hats. Inflatables for graduated splashing — optional.</li><li><strong>Lifeguard:</strong> Available on organised beaches (Sani, Kallithea, Hanioti). On natural ones (Sithonia) there's none — supervision required.</li><li><strong>Food:</strong> Pack snacks and water — don't expect a 4-year-old to sit through a 30-min fish meal at 35°C.</li><li><strong>Alternatives:</strong> For smaller crowds, see our <a href=\"/best/quiet-beaches\">quiet beaches</a> list.</li></ul>",
      "de": "<h2>Tipps für Familien</h2><ul><li><strong>Morgenslot:</strong> Ankunft um 8:30-9:00. Sicher dir eine Liege mit Schatten, hol dir das kalte Wasser, bevor es voll wird.</li><li><strong>Kinder-Ausrüstung:</strong> Bring Schwimmring/Schwimmflügel, dicke Sonnencreme (SPF 50+), Hut. Aufblasbares für das allmähliche Surfen — optional.</li><li><strong>Rettungsschwimmer:</strong> An organisierten Stränden (Sani, Kallithea, Chanioti). An natürlichen (Sithonia) gibt es keine — Aufsicht erforderlich.</li><li><strong>Essen:</strong> Hab Snacks und Wasser dabei — du kannst nicht erwarten, dass ein 4-jähriges Kind 30 Minuten auf ein Fischgericht bei offenen 35°C wartet.</li><li><strong>Alternativen:</strong> Wenn du weniger Menschenmengen möchtest, sieh dir die <a href=\"/best/quiet-beaches\">ruhigen Strände</a> an.</li></ul>",
      "ro": "<h2>Sfaturi pentru familii</h2><ul><li><strong>Slot de dimineață:</strong> Ajungeți la 8:30-9:00. Asigurați-vă un șezlong cu umbră, luați apă rece înainte să se aglomereze.</li><li><strong>Echipament pentru copii:</strong> Aduceți colac/brațare, cremă de protecție solară groasă (SPF 50+), pălărie. Gonflabile pentru surfing progresiv — opțional.</li><li><strong>Salvamar:</strong> Pe plajele organizate (Sani, Kallithea, Hanioti). Pe cele naturale (Sithonia) nu există — necesită supraveghere.</li><li><strong>Mâncare:</strong> Aveți gustări și apă — nu așteptați un copil de 4 ani pentru o masă de pește de 30' la 35°C deschis.</li><li><strong>Alternative:</strong> Dacă doriți mai puțină aglomerație, vedeți <a href=\"/best/quiet-beaches\">plajele liniștite</a>.</li></ul>",
      "sr": "<h2>Saveti za porodice</h2><ul><li><strong>Jutarnji termin:</strong> Stignite između 8:30-9:00. Osiguravate ležaljku sa hladom, uzimate hladnu vodu pre nego što se napuni.</li><li><strong>Dečija oprema:</strong> Ponesite šlauf/narukvice, gusti zaštitni faktor (SPF 50+), šešir. Na naduvavanje za postepeno surfovanje — opcionalno.</li><li><strong>Spasilac:</strong> Na organizovanim plažama (Sani, Kallithea, Hanioti). Na prirodnim (Sithonia) nema — potrebna je nadgledanje.</li><li><strong>Hrana:</strong> Ponesite grickalice i vodu — ne očekujte da dete od 4 godine čeka 30 minuta na riblji obrok na 35°C.</li><li><strong>Alternativa:</strong> Ako želite manje gužve, pogledajte <a href=\"/best/quiet-beaches\">mirne plaže</a>.</li></ul>",
      "bg": "<h2>Съвети за семейства</h2><ul><li><strong>Сутрешен слот:</strong> Пристигнете 8:30-9:00. Осигурявате си шезлонг със сянка, вземате студените води преди да се напълни.</li><li><strong>Детско оборудване:</strong> Донесете пояс/гривна, дебел слънцезащитен крем (SPF 50+), шапка. Надуваеми за постепенно сърфиране — по желание.</li><li><strong>Спасител:</strong> На организирани плажове (Сани, Калифея, Ханиоти). На природните (Ситония) няма — изисква се наблюдение.</li><li><strong>Храна:</strong> Имайте закуски и вода — не очаквайте дете на 4 години да чака 30' рибно ястие при 35°C.</li><li><strong>Алтернативи:</strong> Ако искате по-малко хора, вижте <a href=\"/best/quiet-beaches\">тихите плажове</a>.</li></ul>",
      "ru": "<h2>Советы для семей</h2><ul><li><strong>Утреннее время:</strong> Прибывайте в 8:30-9:00. Гарантируете себе шезлонг с тенью, берете холодную воду до того, как станет многолюдно.</li><li><strong>Детское снаряжение:</strong> Возьмите круг/нарукавники, плотный солнцезащитный крем (SPF 50+), шляпу. Надувные игрушки для постепенного серфинга — по желанию.</li><li><strong>Спасатель:</strong> На организованных пляжах (Сани, Калитея, Ханиоти). На природных (Ситония) отсутствует — требуется наблюдение.</li><li><strong>Еда:</strong> Имейте при себе закуски и воду — не ждите, что ребенок 4 лет будет ждать 30 минут рыбного обеда при 35°C.</li><li><strong>Альтернативы:</strong> Если хотите меньше людей, посмотрите <a href=\"/best/quiet-beaches\">тихие пляжи</a>.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Σε ποια παραλία να πάμε με μωρό 1-2 ετών;",
          "en": "Best beach with a 1-2 year old baby?",
          "de": "Welchen Strand sollten wir mit einem 1-2 Jahre alten Baby besuchen?",
          "ro": "La ce plajă să mergem cu un bebeluș de 1-2 ani?",
          "sr": "Koju plažu da izaberemo sa bebom od 1-2 godine?",
          "bg": "На кой плаж да отидем с бебе на 1-2 години?",
          "ru": "На какой пляж пойти с ребенком 1-2 лет?"
        },
        "a": {
          "el": "Επιλέξτε παραλία με <strong>ρηχή ζώνη + σκιά + lifeguard + κοντινό parking</strong>. Η <strong>Σάνη Marina</strong>, η <strong>Σίβηρη</strong> και η <strong>Νέα Φώκαια</strong> πληρούν όλα. Αποφύγετε χωμάτινες προσβάσεις και απόμακρες παραλίες.",
          "en": "Choose a beach with <strong>shallow zone + shade + lifeguard + nearby parking</strong>. <strong>Sani Marina</strong>, <strong>Siviri</strong> and <strong>Nea Fokaia</strong> tick all boxes. Avoid dirt-road approaches and remote beaches.",
          "de": "Wähle einen Strand mit <strong>flacher Zone + Schatten + Rettungsschwimmer + nahegelegenem Parkplatz</strong>. <strong>Sani Marina</strong>, <strong>Siviri</strong> und <strong>Nea Fokea</strong> erfüllen alle Kriterien. Vermeide unbefestigte Zugänge und abgelegene Strände.",
          "ro": "Alegeți o plajă cu <strong>zonă de mică adâncime + umbră + salvamar + parcare apropiată</strong>. <strong>Sani Marina</strong>, <strong>Siviri</strong> și <strong>Nea Fokea</strong> îndeplinesc toate aceste condiții. Evitați accesul pe drumuri de pământ și plajele îndepărtate.",
          "sr": "Izaberite plažu sa <strong>plitkom zonom + hladom + spasiocem + bliskim parkingom</strong>. <strong>Sani Marina</strong>, <strong>Siviri</strong> i <strong>Nea Fokea</strong> ispunjavaju sve uslove. Izbegavajte zemljane prilaze i udaljene plaže.",
          "bg": "Изберете плаж с <strong>плитка зона + сянка + спасител + близък паркинг</strong>. <strong>Сани Марина</strong>, <strong>Сивири</strong> и <strong>Неа Фокеа</strong> отговарят на всички изисквания. Избягвайте черни пътища и отдалечени плажове.",
          "ru": "Выбирайте пляж с <strong>мелководной зоной + тенью + спасателем + близкой парковкой</strong>. <strong>Сани Марина</strong>, <strong>Сивири</strong> и <strong>Неа Фокеа</strong> соответствуют всем требованиям. Избегайте грунтовых дорог и удаленных пляжей."
        }
      },
      {
        "q": {
          "el": "Υπάρχουν φιλικά για άτομα με αναπηρία;",
          "en": "Are there beaches accessible for disabled visitors?",
          "de": "Gibt es behindertengerechte Strände?",
          "ro": "Există plaje prietenoase pentru persoanele cu dizabilități?",
          "sr": "Postoje li plaže prilagođene osobama sa invaliditetom?",
          "bg": "Има ли удобства за хора с увреждания?",
          "ru": "Есть ли пляжи, доступные для людей с ограниченными возможностями?"
        },
        "a": {
          "el": "Ορισμένες οργανωμένες παραλίες έχουν ράμπες, προσβάσιμα αποδυτήρια ή σύστημα αυτόνομης πρόσβασης στη θάλασσα, αλλά οι υποδομές διαφέρουν από παραλία σε παραλία και από χρονιά σε χρονιά — ρωτήστε την παραλία ή το κατάλυμά σας πριν πάτε.",
          "en": "Some organised beaches have ramps, accessible changing rooms or a lift into the water, but facilities differ from beach to beach and from year to year — check with the beach or your accommodation before you go.",
          "de": "Einige organisierte Strände haben Rampen, barrierefreie Umkleiden oder eine Einstiegshilfe ins Wasser, doch das Angebot ist von Strand zu Strand und von Jahr zu Jahr verschieden — fragen Sie vorher beim Strand oder Ihrer Unterkunft nach.",
          "ro": "Unele plaje amenajate au rampe, cabine accesibile sau un dispozitiv de intrare în apă, dar dotările diferă de la o plajă la alta și de la un an la altul — întrebați la plajă sau la cazare înainte să mergeți.",
          "sr": "Neke uređene plaže imaju rampe, pristupačne kabine ili uređaj za ulazak u vodu, ali opremljenost se razlikuje od plaže do plaže i od godine do godine — raspitajte se na plaži ili u smeštaju pre polaska.",
          "bg": "Някои организирани плажове имат рампи, достъпни съблекални или устройство за влизане във водата, но условията се различават според плажа и годината — попитайте на плажа или в мястото за настаняване, преди да отидете.",
          "ru": "На некоторых организованных пляжах есть пандусы, доступные кабинки или подъёмник для входа в воду, но оснащение отличается от пляжа к пляжу и от года к году — уточняйте на пляже или в отеле заранее."
        }
      },
      {
        "q": {
          "el": "Πόσο κοστίζει για 4μελή οικογένεια;",
          "en": "How much for a family of 4?",
          "de": "Wie viel kostet es für eine 4-köpfige Familie?",
          "ro": "Cât costă pentru o familie de 4 persoane?",
          "sr": "Koliko košta za četvoročlanu porodicu?",
          "bg": "Колко струва за 4-членно семейство?",
          "ru": "Сколько стоит для семьи из 4 человек?"
        },
        "a": {
          "el": "<strong>Beach set</strong> (ξαπλώστρες + ομπρέλα): €15-25/μέρα στις πιο γνωστές. <strong>Φαγητό μεσημεριανό</strong>: €40-70 για 4 σε beach restaurant, €30-50 σε ταβέρνα στο χωριό. <strong>Σνακ/παγωτό</strong>: €15-20. Σύνολο μέρας: €70-130 για 4 άτομα.",
          "en": "<strong>Beach set</strong> (loungers + umbrella): €15-25/day at the famous beaches. <strong>Lunch</strong>: €40-70 for 4 at a beach restaurant, €30-50 at a village taverna. <strong>Snacks/ice cream</strong>: €15-20. Total day: €70-130 for four.",
          "de": "<strong>Beach-Set</strong> (Liegen + Schirm): €15-25/Tag an den bekanntesten Stränden. <strong>Mittagessen</strong>: €40-70 für 4 Personen im Strandrestaurant, €30-50 in einer Dorftaverne. <strong>Snacks/Eis</strong>: €15-20. Gesamttageskosten: €70-130 für 4 Personen.",
          "ro": "<strong>Set de plajă</strong> (șezlonguri + umbrelă): €15-25/zi la cele mai cunoscute. <strong>Masa de prânz</strong>: €40-70 pentru 4 persoane la un restaurant de plajă, €30-50 la o tavernă în sat. <strong>Gustări/înghețată</strong>: €15-20. Total pe zi: €70-130 pentru 4 persoane.",
          "sr": "<strong>Set na plaži</strong> (ležaljke + suncobran): €15-25/dan na najpoznatijim plažama. <strong>Ručak</strong>: €40-70 za 4 osobe u restoranu na plaži, €30-50 u taverni u selu. <strong>Grickalice/sladoled</strong>: €15-20. Ukupno za dan: €70-130 za 4 osobe.",
          "bg": "<strong>Комплект за плаж</strong> (шезлонги + чадър): €15-25/ден на най-известните. <strong>Обяд</strong>: €40-70 за 4 в плажно заведение, €30-50 в таверна в селото. <strong>Закуски/сладолед</strong>: €15-20. Общо за деня: €70-130 за 4 души.",
          "ru": "<strong>Набор на пляже</strong> (шезлонги + зонтик): €15-25/день на самых известных. <strong>Обед</strong>: €40-70 для 4 человек в пляжном ресторане, €30-50 в таверне в деревне. <strong>Закуски/мороженое</strong>: €15-20. Общая стоимость дня: €70-130 для 4 человек."
        }
      },
      {
        "q": {
          "el": "Είναι ασφαλή τα νερά για κολύμπι παιδιών;",
          "en": "Is the water safe for children to swim in?",
          "de": "Sind die Gewässer sicher für das Schwimmen von Kindern?",
          "ro": "Sunt sigure apele pentru înotul copiilor?",
          "sr": "Da li je voda bezbedna za dečije plivanje?",
          "bg": "Безопасни ли са водите за плуване на деца?",
          "ru": "Безопасны ли воды для купания детей?"
        },
        "a": {
          "el": "Ναι — η Χαλκιδική έχει περίπου 90 παραλίες με Γαλάζια Σημαία, βράβευση για την ποιότητα του νερού και την ασφάλεια. Οι παραλίες αυτής της λίστας έχουν ρηχά νερά. Να επιβλέπετε πάντα τα παιδιά, όποια κι αν είναι η ποιότητα του νερού.",
          "en": "Yes — Halkidiki has around 90 Blue Flag beaches, an award for water quality and safety. The beaches in this list have shallow zones. Always supervise children, whatever the water quality.",
          "de": "Ja — Chalkidiki hat rund 90 Strände mit Blauer Flagge, einer Auszeichnung für Wasserqualität und Sicherheit. Die Strände dieser Liste haben flache Bereiche. Beaufsichtigen Sie Kinder immer, unabhängig von der Wasserqualität.",
          "ro": "Da — Halkidiki are în jur de 90 de plaje cu Steag Albastru, o distincție pentru calitatea apei și siguranță. Plajele din această listă au zone cu apă mică. Supravegheați mereu copiii, indiferent de calitatea apei.",
          "sr": "Da — Halkidiki ima oko 90 plaža s Plavom zastavom, priznanjem za kvalitet vode i bezbednost. Plaže s ove liste imaju plitke delove. Uvek nadgledajte decu, bez obzira na kvalitet vode.",
          "bg": "Да — Халкидики има около 90 плажа със Син флаг, отличие за качество на водата и безопасност. Плажовете в този списък имат плитки зони. Винаги наглеждайте децата, независимо от качеството на водата.",
          "ru": "Да — на Халкидики около 90 пляжей с Голубым флагом, наградой за качество воды и безопасность. У пляжей из этого списка есть мелководье. Всегда присматривайте за детьми, каким бы ни было качество воды."
        }
      }
    ]
  },
  "quiet-beaches": {
    "intro": {
      "el": "<p>Δεν ψάχνουν όλοι μουσική και ξαπλώστρες. Η Χαλκιδική έχει πολλές ελεύθερες, ανοργάνωτες παραλίες, όπου απλώνεις την πετσέτα σου και ακούς μόνο τη θάλασσα. Η λίστα συγκεντρώνει παραλίες χωρίς οργάνωση, κυρίως στη Σιθωνία και στις λιγότερο ανεπτυγμένες ακτές.</p>",
      "en": "<p>Not everyone wants music and sunbeds. Halkidiki has many free, unorganised beaches where you lay down your towel and hear only the sea. The list brings together beaches without facilities, mostly in Sithonia and on the less developed coasts.</p>",
      "de": "<p>Nicht jeder sucht Musik und Liegen. Chalkidiki hat viele freie, unorganisierte Strände, an denen man sein Handtuch ausbreitet und nur das Meer hört. Die Liste versammelt Strände ohne Ausstattung, vor allem auf Sithonia und an den weniger erschlossenen Küsten.</p>",
      "bg": "<p>Не всеки търси музика и шезлонги. Халкидики има много свободни, неорганизирани плажове, където постилате кърпата си и чувате само морето. Списъкът събира плажове без организация, главно в Ситония и по по-слабо развитите брегове.</p>",
      "ru": "<p>Не всем нужны музыка и лежаки. На Халкидиках много свободных, необорудованных пляжей, где расстилаешь полотенце и слышишь только море. В списке — пляжи без инфраструктуры, в основном на Ситонии и на менее освоенных побережьях.</p>",
      "ro": "<p>Nu toată lumea caută muzică și șezlonguri. Halkidiki are multe plaje libere, neamenajate, unde îți întinzi prosopul și auzi doar marea. Lista adună plaje fără amenajări, mai ales în Sithonia și pe coastele mai puțin dezvoltate.</p>",
      "sr": "<p>Ne traže svi muziku i ležaljke. Halkidiki ima mnogo slobodnih, neuređenih plaža na kojima prostrete peškir i čujete samo more. Lista okuplja plaže bez sadržaja, uglavnom na Sitoniji i na manje razvijenim obalama.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές</h2><ul><li><strong>Πάρε τα πάντα μαζί:</strong> νερό, φαγητό, ομπρέλα, αντηλιακό. Συνήθως δεν υπάρχει καντίνα.</li><li><strong>Σκουπίδια:</strong> πάρε τα μαζί σου φεύγοντας.</li><li><strong>Πρόσβαση:</strong> σε κάποιες θα περπατήσεις λίγο· φόρα κατάλληλα παπούτσια.</li><li><strong>Σήμα κινητού:</strong> μπορεί να είναι αδύναμο· πες σε κάποιον πού πας.</li><li><strong>Ώρα:</strong> τις καθημερινές και εκτός Αυγούστου έχουν ελάχιστο κόσμο.</li></ul>",
      "en": "<h2>Tips</h2><ul><li><strong>Bring everything:</strong> water, food, an umbrella, sunscreen. There's usually no kiosk.</li><li><strong>Rubbish:</strong> take it with you when you leave.</li><li><strong>Access:</strong> some involve a short walk; wear suitable shoes.</li><li><strong>Mobile signal:</strong> it can be weak; tell someone where you're going.</li><li><strong>Timing:</strong> on weekdays and outside August they see very few people.</li></ul>",
      "de": "<h2>Tipps</h2><ul><li><strong>Alles mitnehmen:</strong> Wasser, Essen, Schirm, Sonnencreme. Meist gibt es keinen Kiosk.</li><li><strong>Müll:</strong> beim Gehen wieder mitnehmen.</li><li><strong>Zugang:</strong> Zu manchen läuft man ein Stück; passende Schuhe tragen.</li><li><strong>Handyempfang:</strong> kann schwach sein; sag jemandem, wohin du fährst.</li><li><strong>Zeitpunkt:</strong> Unter der Woche und außerhalb des Augusts sind kaum Menschen da.</li></ul>",
      "bg": "<h2>Съвети</h2><ul><li><strong>Вземете всичко:</strong> вода, храна, чадър, слънцезащитен крем. Обикновено няма будка.</li><li><strong>Боклук:</strong> вземете го със себе си, когато си тръгвате.</li><li><strong>Достъп:</strong> до някои се върви малко пеша — обуйте подходящи обувки.</li><li><strong>Мобилен сигнал:</strong> може да е слаб — кажете на някого къде отивате.</li><li><strong>Време:</strong> в делнични дни и извън август там има съвсем малко хора.</li></ul>",
      "ru": "<h2>Советы</h2><ul><li><strong>Берите всё с собой:</strong> воду, еду, зонт, солнцезащитный крем. Киоска обычно нет.</li><li><strong>Мусор:</strong> уносите с собой.</li><li><strong>Подход:</strong> к некоторым нужно немного пройти пешком — наденьте удобную обувь.</li><li><strong>Связь:</strong> может быть слабой — скажите кому-нибудь, куда едете.</li><li><strong>Время:</strong> в будни и вне августа людей там совсем мало.</li></ul>",
      "ro": "<h2>Sfaturi</h2><ul><li><strong>Ia totul cu tine:</strong> apă, mâncare, umbrelă, cremă de soare. De obicei nu e niciun chioșc.</li><li><strong>Gunoiul:</strong> ia-l cu tine când pleci.</li><li><strong>Acces:</strong> la unele mergi puțin pe jos; poartă încălțăminte potrivită.</li><li><strong>Semnal:</strong> poate fi slab; spune cuiva unde mergi.</li><li><strong>Momentul:</strong> în zilele lucrătoare și în afara lui august e foarte puțină lume.</li></ul>",
      "sr": "<h2>Saveti</h2><ul><li><strong>Ponesite sve:</strong> vodu, hranu, suncobran, kremu za sunčanje. Obično nema kioska.</li><li><strong>Smeće:</strong> ponesite ga sa sobom kad odlazite.</li><li><strong>Pristup:</strong> do nekih se malo pešači; obujte odgovarajuću obuću.</li><li><strong>Signal:</strong> može biti slab; recite nekome kuda idete.</li><li><strong>Vreme:</strong> radnim danima i van avgusta tamo je vrlo malo ljudi.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Πώς ξεχωρίζω μια ήσυχη παραλία;",
          "en": "How do I spot a quiet beach?",
          "de": "Woran erkenne ich einen ruhigen Strand?",
          "bg": "Как да разпозная тих плаж?",
          "ru": "Как узнать тихий пляж?",
          "ro": "Cum recunosc o plajă liniștită?",
          "sr": "Kako da prepoznam mirnu plažu?"
        },
        "a": {
          "el": "Χωρίς beach bar και σειρές από ξαπλώστρες, συχνά με χωματόδρομο στο τέλος. Τις περισσότερες θα τις βρεις στη Σιθωνία.",
          "en": "No beach bar and no rows of sunbeds, often with a dirt road at the end. You'll find most of them in Sithonia.",
          "de": "Ohne Strandbar und Liegenreihen, oft mit einer Schotterstraße am Ende. Die meisten findest du auf Sithonia.",
          "bg": "Без плажен бар и редици шезлонги, често с черен път накрая. Повечето са в Ситония.",
          "ru": "Без пляжного бара и рядов лежаков, часто с грунтовкой в конце пути. Больше всего таких на Ситонии.",
          "ro": "Fără bar de plajă și rânduri de șezlonguri, adesea cu un drum de pământ la final. Cele mai multe sunt în Sithonia.",
          "sr": "Bez beach bara i redova ležaljki, često sa makadamom na kraju. Najviše ih je na Sitoniji."
        }
      },
      {
        "q": {
          "el": "Υπάρχουν παραλίες γυμνισμού;",
          "en": "Are there naturist beaches?",
          "de": "Gibt es FKK-Strände?",
          "bg": "Има ли нудистки плажове?",
          "ru": "Есть ли нудистские пляжи?",
          "ro": "Există plaje de nudism?",
          "sr": "Ima li nudističkih plaža?"
        },
        "a": {
          "el": "Ο γυμνισμός γίνεται ανεκτός σε ορισμένες απομονωμένες παραλίες, κυρίως στη Σιθωνία. Διάλεξε απόμερα σημεία και σεβάσου τους άλλους.",
          "en": "Nudism is tolerated at some secluded beaches, mainly in Sithonia. Choose out-of-the-way spots and respect other people.",
          "de": "FKK wird an einigen abgelegenen Stränden geduldet, vor allem auf Sithonia. Wähle abgelegene Stellen und nimm Rücksicht auf andere.",
          "bg": "Нудизмът се толерира на някои уединени плажове, главно в Ситония. Избирайте отдалечени места и уважавайте другите.",
          "ru": "Нудизм допускается на некоторых уединённых пляжах, в основном на Ситонии. Выбирайте укромные места и уважайте других.",
          "ro": "Nudismul e tolerat pe unele plaje izolate, mai ales în Sithonia. Alege locuri retrase și respectă-i pe ceilalți.",
          "sr": "Nudizam se toleriše na nekim izolovanim plažama, uglavnom na Sitoniji. Birajte zabačena mesta i poštujte druge."
        }
      }
    ]
  },
  "seafood-restaurants": {
    "intro": {
      "el": "<p>Οι καλύτερες ψαροταβέρνες είναι συνήθως εκεί που δένουν οι βάρκες: στο <a href=\"/places/porto-koufo\">Πόρτο Κουφό</a>, τη <a href=\"/places/nea-skioni\">Νέα Σκιώνη</a>, την <a href=\"/places/ierissos\">Ιερισσό</a>, τη <a href=\"/places/nea-fokaia\">Νέα Φώκαια</a> και τα <a href=\"/places/nea-moudania\">Νέα Μουδανιά</a>. Η λίστα συγκεντρώνει εστιατόρια με θαλασσινά· οι βαθμολογίες προέρχονται από το Google. Δες και τον <a href=\"/blog/seafood-guide-halkidiki\">οδηγό θαλασσινών</a>.</p>",
      "en": "<p>The best fish tavernas are usually where the boats tie up: <a href=\"/places/porto-koufo\">Porto Koufo</a>, <a href=\"/places/nea-skioni\">Nea Skioni</a>, <a href=\"/places/ierissos\">Ierissos</a>, <a href=\"/places/nea-fokaia\">Nea Fokaia</a> and <a href=\"/places/nea-moudania\">Nea Moudania</a>. The list brings together seafood restaurants; ratings come from Google. See also the <a href=\"/blog/seafood-guide-halkidiki\">seafood guide</a>.</p>",
      "de": "<p>Die besten Fischtavernen liegen meist dort, wo die Boote anlegen: <a href=\"/places/porto-koufo\">Porto Koufo</a>, <a href=\"/places/nea-skioni\">Nea Skioni</a>, <a href=\"/places/ierissos\">Ierissos</a>, <a href=\"/places/nea-fokaia\">Nea Fokaia</a> und <a href=\"/places/nea-moudania\">Nea Moudania</a>. Die Liste versammelt Fischrestaurants; die Bewertungen stammen von Google. Siehe auch den <a href=\"/blog/seafood-guide-halkidiki\">Fischführer</a>.</p>",
      "bg": "<p>Най-добрите рибни таверни обикновено са там, където акостират лодките: <a href=\"/places/porto-koufo\">Порто Куфо</a>, <a href=\"/places/nea-skioni\">Неа Скиони</a>, <a href=\"/places/ierissos\">Йерисос</a>, <a href=\"/places/nea-fokaia\">Неа Фокия</a> и <a href=\"/places/nea-moudania\">Неа Мудания</a>. Списъкът събира ресторанти с морска храна; оценките са от Google. Вижте и <a href=\"/blog/seafood-guide-halkidiki\">пътеводителя за морска храна</a>.</p>",
      "ru": "<p>Лучшие рыбные таверны обычно там, где швартуются лодки: <a href=\"/places/porto-koufo\">Порто Куфо</a>, <a href=\"/places/nea-skioni\">Неа Скиони</a>, <a href=\"/places/ierissos\">Иериссос</a>, <a href=\"/places/nea-fokaia\">Неа Фокея</a> и <a href=\"/places/nea-moudania\">Неа Мудания</a>. В списке — рестораны с морепродуктами; оценки взяты из Google. Смотрите также <a href=\"/blog/seafood-guide-halkidiki\">гид по морепродуктам</a>.</p>",
      "ro": "<p>Cele mai bune taverne cu pește sunt de obicei acolo unde trag bărcile: <a href=\"/places/porto-koufo\">Porto Koufo</a>, <a href=\"/places/nea-skioni\">Nea Skioni</a>, <a href=\"/places/ierissos\">Ierissos</a>, <a href=\"/places/nea-fokaia\">Nea Fokaia</a> și <a href=\"/places/nea-moudania\">Nea Moudania</a>. Lista adună restaurante cu fructe de mare; evaluările provin de pe Google. Vezi și <a href=\"/blog/seafood-guide-halkidiki\">ghidul fructelor de mare</a>.</p>",
      "sr": "<p>Najbolje riblje taverne su obično tamo gde pristaju čamci: <a href=\"/places/porto-koufo\">Porto Kufo</a>, <a href=\"/places/nea-skioni\">Nea Skioni</a>, <a href=\"/places/ierissos\">Jerisos</a>, <a href=\"/places/nea-fokaia\">Nea Fokea</a> i <a href=\"/places/nea-moudania\">Nea Mudanja</a>. Lista okuplja restorane sa morskim plodovima; ocene potiču sa Google-a. Pogledajte i <a href=\"/blog/seafood-guide-halkidiki\">vodič za morske plodove</a>.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές</h2><ul><li><strong>Φρέσκο ή κατεψυγμένο:</strong> τα κατεψυγμένα πρέπει να σημειώνονται στον κατάλογο.</li><li><strong>Τιμή:</strong> το ψάρι χρεώνεται με το κιλό· ρώτα την τιμή και ζήτα να ζυγιστεί μπροστά σου.</li><li><strong>Μύδια:</strong> η Ελλάδα καλλιεργεί πολλά μύδια, κυρίως στον Θερμαϊκό· δοκίμασέ τα αχνιστά ή σαγανάκι.</li><li><strong>Κρασί:</strong> ένα λευκό της περιοχής ή τσίπουρο με τους μεζέδες.</li></ul>",
      "en": "<h2>Tips</h2><ul><li><strong>Fresh or frozen:</strong> frozen items must be marked on the menu.</li><li><strong>Price:</strong> fish is priced by the kilo; ask the price and have it weighed in front of you.</li><li><strong>Mussels:</strong> Greece farms a lot of mussels, mainly in the Thermaic Gulf; try them steamed or saganaki.</li><li><strong>Wine:</strong> a local white, or tsipouro with the meze.</li></ul>",
      "de": "<h2>Tipps</h2><ul><li><strong>Frisch oder tiefgekühlt:</strong> Tiefgekühltes muss auf der Karte gekennzeichnet sein.</li><li><strong>Preis:</strong> Fisch wird nach Kilo berechnet; nach dem Preis fragen und vor dir wiegen lassen.</li><li><strong>Muscheln:</strong> Griechenland züchtet viele Miesmuscheln, vor allem im Thermaischen Golf; probier sie gedämpft oder als Saganaki.</li><li><strong>Wein:</strong> ein Weißwein aus der Region oder Tsipouro zu den Meze.</li></ul>",
      "bg": "<h2>Съвети</h2><ul><li><strong>Прясно или замразено:</strong> замразените продукти трябва да са отбелязани в менюто.</li><li><strong>Цена:</strong> рибата се плаща на килограм — питайте цената и поискайте да я претеглят пред вас.</li><li><strong>Миди:</strong> Гърция отглежда много миди, главно в Термайския залив — опитайте ги на пара или саганаки.</li><li><strong>Вино:</strong> местно бяло или ципуро с мезетата.</li></ul>",
      "ru": "<h2>Советы</h2><ul><li><strong>Свежее или замороженное:</strong> замороженные продукты обязаны отмечать в меню.</li><li><strong>Цена:</strong> рыбу считают по весу — спросите цену и попросите взвесить при вас.</li><li><strong>Мидии:</strong> Греция выращивает много мидий, в основном в Термаическом заливе, — попробуйте их на пару или саганаки.</li><li><strong>Вино:</strong> местное белое или ципуро к закускам.</li></ul>",
      "ro": "<h2>Sfaturi</h2><ul><li><strong>Proaspăt sau congelat:</strong> produsele congelate trebuie marcate în meniu.</li><li><strong>Preț:</strong> peștele se plătește la kilogram; întreabă prețul și cere să fie cântărit în fața ta.</li><li><strong>Midii:</strong> Grecia crește multe midii, mai ales în Golful Thermaic; încearcă-le la abur sau saganaki.</li><li><strong>Vin:</strong> un alb local sau tsipouro lângă meze.</li></ul>",
      "sr": "<h2>Saveti</h2><ul><li><strong>Sveže ili smrznuto:</strong> smrznuti proizvodi moraju biti označeni u jelovniku.</li><li><strong>Cena:</strong> riba se naplaćuje po kilogramu; pitajte cenu i tražite da je izmere pred vama.</li><li><strong>Dagnje:</strong> Grčka uzgaja mnogo dagnji, uglavnom u Termajskom zalivu; probajte ih na pari ili saganaki.</li><li><strong>Vino:</strong> lokalno belo ili cipuro uz mezete.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Είναι όλα τα ψάρια ντόπια;",
          "en": "Is all the fish local?",
          "de": "Ist der ganze Fisch aus der Region?",
          "bg": "Цялата риба местна ли е?",
          "ru": "Вся ли рыба местная?",
          "ro": "Tot peștele e local?",
          "sr": "Da li je sva riba lokalna?"
        },
        "a": {
          "el": "Όχι πάντα. Η τσιπούρα και το λαβράκι είναι συνήθως από ιχθυοκαλλιέργεια, και ορισμένα είδη είναι εισαγόμενα. Ρώτα από πού είναι.",
          "en": "Not always. Sea bream and sea bass are usually farmed, and some species are imported. Ask where the fish comes from.",
          "de": "Nicht immer. Dorade und Wolfsbarsch stammen meist aus Zucht, manche Arten sind importiert. Frag nach der Herkunft.",
          "bg": "Не винаги. Ципурата и лавракът обикновено са от ферми, а някои видове са внос. Питайте откъде е рибата.",
          "ru": "Не всегда. Дорада и сибас обычно с ферм, а некоторые виды — импорт. Спросите, откуда рыба.",
          "ro": "Nu întotdeauna. Dorada și lavracul sunt de obicei de crescătorie, iar unele specii sunt importate. Întreabă de unde e peștele.",
          "sr": "Ne uvek. Orada i brancin su obično iz uzgoja, a neke vrste su uvozne. Pitajte odakle je riba."
        }
      },
      {
        "q": {
          "el": "Χρειάζεται κράτηση;",
          "en": "Do I need to book?",
          "de": "Muss ich reservieren?",
          "bg": "Трябва ли резервация?",
          "ru": "Нужно ли бронировать?",
          "ro": "Trebuie să rezerv?",
          "sr": "Da li treba rezervacija?"
        },
        "a": {
          "el": "Τα Σαββατοκύριακα του καλοκαιριού ναι, ειδικά για τραπέζι δίπλα στο νερό.",
          "en": "On summer weekends yes, especially for a table by the water.",
          "de": "An Sommerwochenenden ja, besonders für einen Tisch am Wasser.",
          "bg": "В летните уикенди — да, особено за маса до водата.",
          "ru": "Летом по выходным — да, особенно столик у воды.",
          "ro": "În weekendurile de vară da, mai ales pentru o masă lângă apă.",
          "sr": "Leti vikendom da, naročito za sto pored vode."
        }
      }
    ]
  },
  "beach-bars": {
    "intro": {
      "el": "<p>Τα beach bars της Χαλκιδικής κυμαίνονται από ήσυχα μπαράκια με καφέ και κοκτέιλ ως μεγάλα beach clubs με DJ. Τα πιο ζωντανά είναι στην ανατολική Κασσάνδρα — Καλλιθέα, Χανιώτη, Πευκοχώρι — ενώ στη Σιθωνία η ατμόσφαιρα είναι πιο χαλαρή. Οι βαθμολογίες στη λίστα προέρχονται από το Google.</p>",
      "en": "<p>Halkidiki's beach bars range from quiet spots for coffee and cocktails to big beach clubs with DJs. The liveliest are on Kassandra's east coast — Kallithea, Hanioti, Pefkochori — while Sithonia is more laid-back. The ratings in the list come from Google.</p>",
      "de": "<p>Die Strandbars Chalkidikis reichen von ruhigen Bars für Kaffee und Cocktails bis zu großen Beachclubs mit DJ. Am lebhaftesten ist es an der Ostküste Kassandras — Kallithea, Chanioti, Pefkochori —, auf Sithonia geht es entspannter zu. Die Bewertungen in der Liste stammen von Google.</p>",
      "bg": "<p>Плажните барове в Халкидики варират от тихи места за кафе и коктейли до големи бийч клубове с DJ. Най-оживените са на източния бряг на Касандра — Калитея, Ханиоти, Пефкохори, — а в Ситония атмосферата е по-спокойна. Оценките в списъка са от Google.</p>",
      "ru": "<p>Пляжные бары Халкидик — от тихих мест для кофе и коктейлей до больших пляжных клубов с диджеями. Самые оживлённые — на восточном побережье Кассандры (Калитея, Ханиоти, Пефкохори), на Ситонии атмосфера спокойнее. Оценки в списке взяты из Google.</p>",
      "ro": "<p>Barurile de plajă din Halkidiki variază de la locuri liniștite pentru cafea și cocktailuri la beach cluburi mari cu DJ. Cele mai animate sunt pe coasta de est a Kassandrei — Kallithea, Hanioti, Pefkohori —, iar în Sithonia atmosfera e mai relaxată. Evaluările din listă provin de pe Google.</p>",
      "sr": "<p>Beach barovi na Halkidikiju kreću se od mirnih mesta za kafu i koktele do velikih beach klubova sa DJ-em. Najživlji su na istočnoj obali Kasandre — Kalitea, Hanioti, Pefkohori —, a na Sitoniji je atmosfera opuštenija. Ocene u listi potiču sa Google-a.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές</h2><ul><li><strong>Ξαπλώστρες:</strong> στα δημοφιλή beach clubs κλείσε από πριν για Σαββατοκύριακο του Αυγούστου, και ρώτα την τιμή ή την ελάχιστη κατανάλωση.</li><li><strong>Παιδιά:</strong> πολλά είναι οικογενειακά τη μέρα και γίνονται πιο θορυβώδη το απόγευμα.</li><li><strong>Λογαριασμός:</strong> οι τιμές είναι στον κατάλογο· ζήτα απόδειξη.</li><li><strong>Σεζόν:</strong> τα περισσότερα λειτουργούν από τον Μάιο ή τον Ιούνιο ως τον Σεπτέμβριο.</li></ul>",
      "en": "<h2>Tips</h2><ul><li><strong>Sunbeds:</strong> at popular beach clubs, book ahead for August weekends and ask about the price or minimum spend.</li><li><strong>Children:</strong> many are family-friendly by day and get louder in the afternoon.</li><li><strong>The bill:</strong> prices are on the menu; ask for a receipt.</li><li><strong>Season:</strong> most open from May or June to September.</li></ul>",
      "de": "<h2>Tipps</h2><ul><li><strong>Liegen:</strong> In beliebten Beachclubs für Augustwochenenden vorab reservieren und nach Preis oder Mindestverzehr fragen.</li><li><strong>Kinder:</strong> Viele sind tagsüber familienfreundlich und werden nachmittags lauter.</li><li><strong>Rechnung:</strong> Die Preise stehen auf der Karte; nach dem Beleg fragen.</li><li><strong>Saison:</strong> Die meisten haben von Mai oder Juni bis September geöffnet.</li></ul>",
      "bg": "<h2>Съвети</h2><ul><li><strong>Шезлонги:</strong> в популярните бийч клубове резервирайте за уикендите през август и питайте за цената или минималната консумация.</li><li><strong>Деца:</strong> много са подходящи за семейства през деня и стават по-шумни следобед.</li><li><strong>Сметка:</strong> цените са в менюто; поискайте касова бележка.</li><li><strong>Сезон:</strong> повечето работят от май или юни до септември.</li></ul>",
      "ru": "<h2>Советы</h2><ul><li><strong>Лежаки:</strong> в популярных пляжных клубах бронируйте на августовские выходные и уточняйте цену или минимальный заказ.</li><li><strong>Дети:</strong> днём многие подходят для семей, а ближе к вечеру становятся шумнее.</li><li><strong>Счёт:</strong> цены указаны в меню; просите чек.</li><li><strong>Сезон:</strong> большинство работают с мая или июня по сентябрь.</li></ul>",
      "ro": "<h2>Sfaturi</h2><ul><li><strong>Șezlonguri:</strong> la beach cluburile populare rezervă din timp pentru weekendurile din august și întreabă de preț sau de consumația minimă.</li><li><strong>Copii:</strong> multe sunt potrivite pentru familii ziua și devin mai zgomotoase după-amiaza.</li><li><strong>Nota:</strong> prețurile sunt în meniu; cere bonul.</li><li><strong>Sezon:</strong> cele mai multe sunt deschise din mai sau iunie până în septembrie.</li></ul>",
      "sr": "<h2>Saveti</h2><ul><li><strong>Ležaljke:</strong> u popularnim beach klubovima rezervišite unapred za avgustovske vikende i pitajte za cenu ili minimalnu potrošnju.</li><li><strong>Deca:</strong> mnogi su danju porodični, a popodne postaju bučniji.</li><li><strong>Račun:</strong> cene su na jelovniku; tražite račun.</li><li><strong>Sezona:</strong> većina radi od maja ili juna do septembra.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Πληρώνω είσοδο σε beach club;",
          "en": "Do I pay an entrance fee at a beach club?",
          "de": "Zahle ich Eintritt im Beachclub?",
          "bg": "Плаща ли се вход в бийч клуб?",
          "ru": "Платный ли вход в пляжный клуб?",
          "ro": "Plătesc intrare la un beach club?",
          "sr": "Da li se plaća ulaz u beach klub?"
        },
        "a": {
          "el": "Συνήθως όχι. Πληρώνεις τις ξαπλώστρες ή την κατανάλωση. Σε ειδικά πάρτι μπορεί να ισχύουν άλλοι όροι — ρώτα από πριν.",
          "en": "Usually not. You pay for sunbeds or for what you order. Special parties may have other terms — ask in advance.",
          "de": "Meist nicht. Man zahlt Liegen oder Verzehr. Bei besonderen Partys können andere Bedingungen gelten — vorher fragen.",
          "bg": "Обикновено не. Плащате шезлонгите или консумацията. При специални партита може да има други условия — питайте предварително.",
          "ru": "Обычно нет. Платите за лежаки или за заказ. На особых вечеринках условия могут быть другими — уточняйте заранее.",
          "ro": "De obicei nu. Plătești șezlongurile sau consumația. La petreceri speciale pot exista alte condiții — întreabă dinainte.",
          "sr": "Obično ne. Plaćate ležaljke ili potrošnju. Na posebnim žurkama mogu važiti drugi uslovi — pitajte unapred."
        }
      },
      {
        "q": {
          "el": "Κασσάνδρα ή Σιθωνία για beach bars;",
          "en": "Kassandra or Sithonia for beach bars?",
          "de": "Kassandra oder Sithonia für Strandbars?",
          "bg": "Касандра или Ситония за плажни барове?",
          "ru": "Кассандра или Ситония для пляжных баров?",
          "ro": "Kassandra sau Sithonia pentru baruri de plajă?",
          "sr": "Kasandra ili Sitonija za beach barove?"
        },
        "a": {
          "el": "Η Κασσάνδρα για μουσική και πάρτι, η Σιθωνία για χαλαρό κοκτέιλ με θέα.",
          "en": "Kassandra for music and parties, Sithonia for a relaxed cocktail with a view.",
          "de": "Kassandra für Musik und Partys, Sithonia für einen entspannten Cocktail mit Aussicht.",
          "bg": "Касандра за музика и купони, Ситония за спокоен коктейл с гледка.",
          "ru": "Кассандра — для музыки и вечеринок, Ситония — для спокойного коктейля с видом.",
          "ro": "Kassandra pentru muzică și petreceri, Sithonia pentru un cocktail relaxat cu priveliște.",
          "sr": "Kasandra za muziku i žurke, Sitonija za opušten koktel s pogledom."
        }
      }
    ]
  },
  "romantic-restaurants": {
    "intro": {
      "el": "<p>Για ένα ρομαντικό δείπνο στη Χαλκιδική, το πιο σημαντικό είναι η θέα στη θάλασσα. Η λίστα συγκεντρώνει εστιατόρια με θέα στη θάλασσα· οι βαθμολογίες προέρχονται από το Google. Πριν διαλέξεις, δες σε ποια ακτή είναι: οι δυτικές βλέπουν το ηλιοβασίλεμα, οι ανατολικές την ανατολή και, στη Σιθωνία, τον Άθω.</p>",
      "en": "<p>For a romantic dinner in Halkidiki, the sea view matters most. The list brings together restaurants with a sea view; ratings come from Google. Before you choose, check which coast it's on: the west coasts face the sunset, the east coasts the sunrise and, in Sithonia, Mount Athos.</p>",
      "de": "<p>Für ein romantisches Abendessen auf Chalkidiki zählt vor allem der Meerblick. Die Liste versammelt Restaurants mit Meerblick; die Bewertungen stammen von Google. Prüfe vorher, an welcher Küste es liegt: Die Westküsten blicken in den Sonnenuntergang, die Ostküsten in den Sonnenaufgang und auf Sithonia zum Athos.</p>",
      "bg": "<p>За романтична вечеря в Халкидики най-важна е гледката към морето. Списъкът събира ресторанти с изглед към морето; оценките са от Google. Преди да изберете, вижте на кой бряг е: западните гледат към залеза, източните — към изгрева и в Ситония — към Атон.</p>",
      "ru": "<p>Для романтического ужина на Халкидиках главное — вид на море. В списке — рестораны с видом на море; оценки взяты из Google. Прежде чем выбрать, посмотрите, на каком побережье он находится: западные смотрят на закат, восточные — на рассвет, а на Ситонии — на Афон.</p>",
      "ro": "<p>Pentru o cină romantică în Halkidiki, cel mai important e priveliștea spre mare. Lista adună restaurante cu vedere la mare; evaluările provin de pe Google. Înainte să alegi, vezi pe ce coastă e: cele de vest privesc spre apus, cele de est spre răsărit și, în Sithonia, spre Athos.</p>",
      "sr": "<p>Za romantičnu večeru na Halkidikiju najvažniji je pogled na more. Lista okuplja restorane s pogledom na more; ocene potiču sa Google-a. Pre izbora proverite na kojoj je obali: zapadne gledaju na zalazak, istočne na izlazak sunca, a na Sitoniji i na Atos.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές</h2><ul><li><strong>Κράτηση:</strong> για Σαββατοκύριακο του Ιουλίου και του Αυγούστου, κλείσε μέρες πριν και ζήτα τραπέζι μπροστά στη θάλασσα.</li><li><strong>Ώρα:</strong> για ηλιοβασίλεμα, έλα λίγο πριν δύσει ο ήλιος· στα τέλη Ιουνίου δύει γύρω στις 21:00, τον Σεπτέμβριο νωρίτερα.</li><li><strong>Κρασί:</strong> ένα λευκό της περιοχής ταιριάζει με το ψάρι.</li><li><strong>Ειδική περίσταση:</strong> πες το στο εστιατόριο όταν κλείνεις.</li></ul>",
      "en": "<h2>Tips</h2><ul><li><strong>Booking:</strong> for July and August weekends, book days ahead and ask for a table at the front.</li><li><strong>Timing:</strong> for the sunset, arrive a little before the sun goes down; in late June it sets around 21:00, in September earlier.</li><li><strong>Wine:</strong> a local white goes well with fish.</li><li><strong>Special occasion:</strong> tell the restaurant when you book.</li></ul>",
      "de": "<h2>Tipps</h2><ul><li><strong>Reservieren:</strong> Für Wochenenden im Juli und August Tage vorher buchen und nach einem Tisch in der ersten Reihe fragen.</li><li><strong>Uhrzeit:</strong> Zum Sonnenuntergang etwas früher kommen; Ende Juni geht die Sonne gegen 21:00 Uhr unter, im September früher.</li><li><strong>Wein:</strong> Ein Weißwein aus der Region passt zum Fisch.</li><li><strong>Besonderer Anlass:</strong> bei der Reservierung Bescheid sagen.</li></ul>",
      "bg": "<h2>Съвети</h2><ul><li><strong>Резервация:</strong> за уикенди през юли и август резервирайте дни по-рано и поискайте маса на първа линия.</li><li><strong>Час:</strong> за залеза елате малко преди слънцето да залезе; в края на юни залязва около 21:00, през септември по-рано.</li><li><strong>Вино:</strong> местно бяло вино подхожда на рибата.</li><li><strong>Специален повод:</strong> кажете го при резервацията.</li></ul>",
      "ru": "<h2>Советы</h2><ul><li><strong>Бронирование:</strong> на выходные июля и августа бронируйте за несколько дней и просите столик у самой воды.</li><li><strong>Время:</strong> на закат приходите чуть раньше; в конце июня солнце садится около 21:00, в сентябре раньше.</li><li><strong>Вино:</strong> к рыбе подойдёт местное белое.</li><li><strong>Особый повод:</strong> предупредите ресторан при бронировании.</li></ul>",
      "ro": "<h2>Sfaturi</h2><ul><li><strong>Rezervare:</strong> pentru weekendurile din iulie și august rezervă cu zile înainte și cere o masă în față.</li><li><strong>Ora:</strong> pentru apus vino puțin mai devreme; la sfârșitul lui iunie soarele apune pe la 21:00, în septembrie mai devreme.</li><li><strong>Vin:</strong> un alb local se potrivește cu peștele.</li><li><strong>Ocazie specială:</strong> spune-le când rezervi.</li></ul>",
      "sr": "<h2>Saveti</h2><ul><li><strong>Rezervacija:</strong> za vikende u julu i avgustu rezervišite danima ranije i tražite sto u prvom redu.</li><li><strong>Vreme:</strong> za zalazak sunca dođite malo ranije; krajem juna sunce zalazi oko 21:00, u septembru ranije.</li><li><strong>Vino:</strong> lokalno belo vino ide uz ribu.</li><li><strong>Posebna prilika:</strong> recite restoranu pri rezervaciji.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Πού για δείπνο με ηλιοβασίλεμα;",
          "en": "Where for dinner at sunset?",
          "de": "Wo zum Abendessen bei Sonnenuntergang?",
          "bg": "Къде за вечеря на залез?",
          "ru": "Где поужинать на закате?",
          "ro": "Unde pentru cină la apus?",
          "sr": "Gde za večeru uz zalazak sunca?"
        },
        "a": {
          "el": "Στις δυτικές ακτές: Άφυτος, Ποσείδι και Σίβηρη στην Κασσάνδρα, Νέος Μαρμαράς και Παρθενώνας στη Σιθωνία.",
          "en": "On the west coasts: Afytos, Possidi and Siviri in Kassandra, Neos Marmaras and Parthenonas in Sithonia.",
          "de": "An den Westküsten: Afytos, Possidi und Siviri auf Kassandra, Neos Marmaras und Parthenonas auf Sithonia.",
          "bg": "На западните брегове: Афитос, Посиди и Сивири в Касандра, Неос Мармарас и Партенонас в Ситония.",
          "ru": "На западных побережьях: Афитос, Посиди и Сивири на Кассандре, Неос Мармарас и Парфенонас на Ситонии.",
          "ro": "Pe coastele de vest: Afytos, Possidi și Siviri în Kassandra, Neos Marmaras și Parthenonas în Sithonia.",
          "sr": "Na zapadnim obalama: Afitos, Posidi i Siviri na Kasandri, Neos Marmaras i Partenonas na Sitoniji."
        }
      },
      {
        "q": {
          "el": "Χρειάζεται επίσημο ντύσιμο;",
          "en": "Is there a dress code?",
          "de": "Gibt es eine Kleiderordnung?",
          "bg": "Има ли дрескод?",
          "ru": "Есть ли дресс-код?",
          "ro": "Există un cod vestimentar?",
          "sr": "Da li postoji pravilo oblačenja?"
        },
        "a": {
          "el": "Σπάνια. Ένα προσεγμένο αλλά άνετο ντύσιμο είναι παντού εντάξει.",
          "en": "Rarely. Neat but relaxed clothes are fine everywhere.",
          "de": "Selten. Gepflegte, aber lockere Kleidung passt überall.",
          "bg": "Рядко. Спретнато, но удобно облекло е подходящо навсякъде.",
          "ru": "Редко. Аккуратная, но свободная одежда подходит везде.",
          "ro": "Rareori. O ținută îngrijită, dar comodă, e potrivită peste tot.",
          "sr": "Retko. Uredna, ali opuštena odeća svuda je u redu."
        }
      }
    ]
  },
  "traditional-tavernas": {
    "intro": {
      "el": "<p>Οι παραδοσιακές ταβέρνες είναι το πιο αυθεντικό πρόσωπο της χαλκιδικιώτικης κουζίνας: μαγειρευτά, ψητά στα κάρβουνα, ντόπια τυριά και μεζέδες, συχνά σε οικογενειακές επιχειρήσεις. Θα τις βρεις στα χωριά της ενδοχώρας, όπως η <a href=\"/places/arnaia\">Αρναία</a> και ο <a href=\"/places/parthenonas\">Παρθενώνας</a>, αλλά και στα παλιά κέντρα των παραθαλάσσιων χωριών, όπως η <a href=\"/places/afytos\">Άφυτος</a>. Οι βαθμολογίες στη λίστα προέρχονται από το Google.</p>",
      "en": "<p>Traditional tavernas are the most authentic face of Halkidiki's cooking: home-style stews, charcoal-grilled meat, local cheeses and meze, often in family-run places. You'll find them in inland villages such as <a href=\"/places/arnaia\">Arnaia</a> and <a href=\"/places/parthenonas\">Parthenonas</a>, and in the old centres of seaside villages such as <a href=\"/places/afytos\">Afytos</a>. The ratings in the list come from Google.</p>",
      "de": "<p>Traditionelle Tavernen sind das ursprünglichste Gesicht der Küche Chalkidikis: Schmorgerichte, Fleisch vom Holzkohlegrill, regionaler Käse und Meze, oft in Familienbetrieben. Man findet sie in Dörfern im Inland wie <a href=\"/places/arnaia\">Arnaia</a> und <a href=\"/places/parthenonas\">Parthenonas</a> und in den alten Ortskernen der Küstendörfer wie <a href=\"/places/afytos\">Afytos</a>. Die Bewertungen in der Liste stammen von Google.</p>",
      "bg": "<p>Традиционните таверни са най-автентичното лице на кухнята на Халкидики: готвени ястия, месо на скара с въглища, местни сирена и мезета, често в семейни заведения. Ще ги намерите в селата във вътрешността като <a href=\"/places/arnaia\">Арнеа</a> и <a href=\"/places/parthenonas\">Партенонас</a>, а и в старите центрове на крайбрежните села като <a href=\"/places/afytos\">Афитос</a>. Оценките в списъка са от Google.</p>",
      "ru": "<p>Традиционные таверны — самое подлинное лицо кухни Халкидик: домашние тушёные блюда, мясо на углях, местные сыры и мезе, часто в семейных заведениях. Их можно найти в деревнях вглубь полуострова, как <a href=\"/places/arnaia\">Арнеа</a> и <a href=\"/places/parthenonas\">Парфенонас</a>, и в старых центрах приморских деревень, как <a href=\"/places/afytos\">Афитос</a>. Оценки в списке взяты из Google.</p>",
      "ro": "<p>Tavernele tradiționale sunt fața cea mai autentică a bucătăriei din Halkidiki: mâncăruri gătite, carne la cărbuni, brânzeturi locale și meze, adesea în localuri de familie. Le găsești în satele din interior, ca <a href=\"/places/arnaia\">Arnaia</a> și <a href=\"/places/parthenonas\">Parthenonas</a>, dar și în centrele vechi ale satelor de pe litoral, ca <a href=\"/places/afytos\">Afytos</a>. Evaluările din listă provin de pe Google.</p>",
      "sr": "<p>Tradicionalne taverne su najautentičnije lice kuhinje Halkidikija: kuvana jela, meso sa žara, lokalni sirevi i mezeti, često u porodičnim lokalima. Naći ćete ih u selima u unutrašnjosti, kao što su <a href=\"/places/arnaia\">Arnea</a> i <a href=\"/places/parthenonas\">Partenonas</a>, ali i u starim centrima primorskih sela, kao što je <a href=\"/places/afytos\">Afitos</a>. Ocene u listi potiču sa Google-a.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές</h2><ul><li><strong>Ρώτα τι έχει σήμερα:</strong> τα μαγειρευτά της ημέρας είναι συχνά το καλύτερο πιάτο.</li><li><strong>Μεζέδες για τη μέση:</strong> παράγγειλε μερικά πιάτα και μοιραστείτε τα.</li><li><strong>Ώρα:</strong> οι Έλληνες τρώνε αργά, αλλά οι ταβέρνες σερβίρουν και νωρίτερα.</li><li><strong>Πληρωμή:</strong> οι περισσότερες δέχονται κάρτες· στα μικρά χωριά κράτα και λίγα μετρητά.</li></ul>",
      "en": "<h2>Tips</h2><ul><li><strong>Ask what's on today:</strong> the dish of the day is often the best one.</li><li><strong>Meze to share:</strong> order a few plates for the middle of the table.</li><li><strong>Timing:</strong> Greeks eat late, but tavernas serve earlier too.</li><li><strong>Payment:</strong> most accept cards; in small villages keep some cash too.</li></ul>",
      "de": "<h2>Tipps</h2><ul><li><strong>Nach dem Tagesgericht fragen:</strong> Das Schmorgericht des Tages ist oft das beste.</li><li><strong>Meze zum Teilen:</strong> ein paar Teller für die Tischmitte bestellen.</li><li><strong>Uhrzeit:</strong> Griechen essen spät, aber Tavernen servieren auch früher.</li><li><strong>Bezahlen:</strong> Die meisten nehmen Karten; in kleinen Dörfern etwas Bargeld dabeihaben.</li></ul>",
      "bg": "<h2>Съвети</h2><ul><li><strong>Питайте какво има днес:</strong> ястието на деня често е най-доброто.</li><li><strong>Мезета за споделяне:</strong> поръчайте няколко чинии за средата на масата.</li><li><strong>Час:</strong> гърците вечерят късно, но таверните сервират и по-рано.</li><li><strong>Плащане:</strong> повечето приемат карти; в малките села носете и малко пари в брой.</li></ul>",
      "ru": "<h2>Советы</h2><ul><li><strong>Спросите, что сегодня:</strong> блюдо дня часто самое вкусное.</li><li><strong>Мезе на всех:</strong> закажите несколько тарелок на середину стола.</li><li><strong>Время:</strong> греки ужинают поздно, но таверны кормят и раньше.</li><li><strong>Оплата:</strong> большинство принимают карты; в маленьких деревнях держите и немного наличных.</li></ul>",
      "ro": "<h2>Sfaturi</h2><ul><li><strong>Întreabă ce e azi:</strong> mâncarea zilei e adesea cea mai bună.</li><li><strong>Meze de împărțit:</strong> comandă câteva farfurii pentru mijlocul mesei.</li><li><strong>Ora:</strong> grecii mănâncă târziu, dar tavernele servesc și mai devreme.</li><li><strong>Plata:</strong> cele mai multe acceptă carduri; în satele mici ține și ceva numerar.</li></ul>",
      "sr": "<h2>Saveti</h2><ul><li><strong>Pitajte šta ima danas:</strong> jelo dana je često najbolje.</li><li><strong>Mezeti za sve:</strong> naručite nekoliko tanjira za sredinu stola.</li><li><strong>Vreme:</strong> Grci večeraju kasno, ali taverne služe i ranije.</li><li><strong>Plaćanje:</strong> većina prima kartice; u malim selima imajte i malo gotovine.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Είναι κατάλληλες για παιδιά;",
          "en": "Are they good for children?",
          "de": "Sind sie kinderfreundlich?",
          "bg": "Подходящи ли са за деца?",
          "ru": "Подходят ли для детей?",
          "ro": "Sunt potrivite pentru copii?",
          "sr": "Da li su pogodne za decu?"
        },
        "a": {
          "el": "Ναι. Οι ελληνικές ταβέρνες είναι πολύ φιλικές με τα παιδιά, και πατάτες, μακαρόνια και πίτες υπάρχουν σχεδόν παντού.",
          "en": "Yes. Greek tavernas are very child-friendly, and chips, pasta and pies are on almost every menu.",
          "de": "Ja. Griechische Tavernen sind sehr kinderfreundlich, und Pommes, Nudeln und Pitas gibt es fast überall.",
          "bg": "Да. Гръцките таверни са много приветливи към децата, а картофки, макарони и баници има почти навсякъде.",
          "ru": "Да. Греческие таверны очень рады детям, а картошка, макароны и пироги есть почти везде.",
          "ro": "Da. Tavernele grecești primesc foarte bine copiii, iar cartofi, paste și plăcinte găsești aproape peste tot.",
          "sr": "Da. Grčke taverne su veoma prijateljski nastrojene prema deci, a pomfrit, testenina i pite ima gotovo svuda."
        }
      },
      {
        "q": {
          "el": "Τι να δοκιμάσω;",
          "en": "What should I try?",
          "de": "Was sollte ich probieren?",
          "bg": "Какво да опитам?",
          "ru": "Что попробовать?",
          "ro": "Ce să încerc?",
          "sr": "Šta da probam?"
        },
        "a": {
          "el": "Ψητά στα κάρβουνα, γεμιστά, κεφτεδάκια, ντόπια φέτα και πράσινες ελιές Χαλκιδικής, και για επιδόρπιο γιαούρτι με μέλι.",
          "en": "Charcoal-grilled meat, gemista, meatballs, local feta and green Halkidiki olives, and yoghurt with honey for dessert.",
          "de": "Fleisch vom Holzkohlegrill, Gemista, Fleischbällchen, Feta und grüne Chalkidiki-Oliven, als Nachtisch Joghurt mit Honig.",
          "bg": "Месо на скара с въглища, гемиста, кюфтенца, местно сирене фета и зелени маслини от Халкидики, а за десерт кисело мляко с мед.",
          "ru": "Мясо на углях, гемиста, тефтели, местную фету и зелёные оливки Халкидики, а на десерт — йогурт с мёдом.",
          "ro": "Carne la cărbuni, gemista, chiftele, feta locală și măsline verzi de Halkidiki, iar la desert iaurt cu miere.",
          "sr": "Meso sa žara, gemistu, ćuftice, lokalni feta sir i zelene masline sa Halkidikija, a za dezert jogurt sa medom."
        }
      }
    ]
  },
  "restaurants-kassandra": {
    "intro": {
      "el": "<p>Η Κασσάνδρα έχει τη μεγαλύτερη ποικιλία στη Χαλκιδική: διεθνή κουζίνα στα μεγάλα θέρετρα, όπως η Καλλιθέα και η Σάνη, ψαροταβέρνες στα λιμανάκια της δυτικής ακτής και μεζεδοπωλεία με θέα στην <a href=\"/places/afytos\">Άφυτο</a>. Οι βαθμολογίες στη λίστα προέρχονται από το Google. Δες και τον <a href=\"/blog/gastronomikos-odigos-kassandras-geyseis-tis-chalkidikis-jvry\">γαστρονομικό οδηγό της Κασσάνδρας</a>.</p>",
      "en": "<p>Kassandra has the widest choice in Halkidiki: international cooking in the big resorts such as Kallithea and Sani, fish tavernas in the small harbours of the west coast and meze places with a view in <a href=\"/places/afytos\">Afytos</a>. The ratings in the list come from Google. See also the <a href=\"/blog/gastronomikos-odigos-kassandras-geyseis-tis-chalkidikis-jvry\">Kassandra food guide</a>.</p>",
      "de": "<p>Kassandra hat die größte Auswahl auf Chalkidiki: internationale Küche in großen Urlaubsorten wie Kallithea und Sani, Fischtavernen in den kleinen Häfen der Westküste und Meze-Lokale mit Aussicht in <a href=\"/places/afytos\">Afytos</a>. Die Bewertungen in der Liste stammen von Google. Siehe auch den <a href=\"/blog/gastronomikos-odigos-kassandras-geyseis-tis-chalkidikis-jvry\">kulinarischen Führer Kassandra</a>.</p>",
      "bg": "<p>Касандра има най-голям избор в Халкидики: международна кухня в големите курорти като Калитея и Сани, рибни таверни в малките пристанища на западния бряг и мезедопулии с гледка в <a href=\"/places/afytos\">Афитос</a>. Оценките в списъка са от Google. Вижте и <a href=\"/blog/gastronomikos-odigos-kassandras-geyseis-tis-chalkidikis-jvry\">гастрономическия пътеводител за Касандра</a>.</p>",
      "ru": "<p>На Кассандре самый большой выбор на Халкидиках: международная кухня в крупных курортах вроде Калитеи и Сани, рыбные таверны в маленьких гаванях западного побережья и мезедопольоны с видом в <a href=\"/places/afytos\">Афитосе</a>. Оценки в списке взяты из Google. Смотрите также <a href=\"/blog/gastronomikos-odigos-kassandras-geyseis-tis-chalkidikis-jvry\">гастрономический гид по Кассандре</a>.</p>",
      "ro": "<p>Kassandra are cea mai mare varietate din Halkidiki: bucătărie internațională în stațiunile mari ca Kallithea și Sani, taverne cu pește în porturile mici de pe coasta de vest și localuri cu meze și priveliște în <a href=\"/places/afytos\">Afytos</a>. Evaluările din listă provin de pe Google. Vezi și <a href=\"/blog/gastronomikos-odigos-kassandras-geyseis-tis-chalkidikis-jvry\">ghidul gastronomic al Kassandrei</a>.</p>",
      "sr": "<p>Kasandra ima najveći izbor na Halkidikiju: međunarodnu kuhinju u velikim letovalištima kao što su Kalitea i Sani, riblje taverne u malim lukama zapadne obale i mezedopolija s pogledom u <a href=\"/places/afytos\">Afitosu</a>. Ocene u listi potiču sa Google-a. Pogledajte i <a href=\"/blog/gastronomikos-odigos-kassandras-geyseis-tis-chalkidikis-jvry\">gastronomski vodič za Kasandru</a>.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές</h2><ul><li><strong>Κράτηση:</strong> τα Σαββατοκύριακα του Ιουλίου και του Αυγούστου κλείσε τραπέζι, ειδικά για την ώρα του ηλιοβασιλέματος.</li><li><strong>Ψάρι:</strong> στη δυτική ακτή, όπως στη <a href=\"/places/nea-skioni\">Νέα Σκιώνη</a>.</li><li><strong>Μεζέδες με θέα:</strong> στην Άφυτο.</li><li><strong>Τιμές:</strong> στα μαγαζιά πάνω στην παραλία πληρώνεις και τη θέα· λίγο πιο μέσα τρως συνήθως οικονομικότερα.</li></ul>",
      "en": "<h2>Tips</h2><ul><li><strong>Booking:</strong> on July and August weekends book a table, especially for sunset.</li><li><strong>Fish:</strong> on the west coast, as in <a href=\"/places/nea-skioni\">Nea Skioni</a>.</li><li><strong>Meze with a view:</strong> in Afytos.</li><li><strong>Prices:</strong> on the beachfront you also pay for the view; a little inland you usually eat for less.</li></ul>",
      "de": "<h2>Tipps</h2><ul><li><strong>Reservieren:</strong> An Wochenenden im Juli und August einen Tisch buchen, vor allem zum Sonnenuntergang.</li><li><strong>Fisch:</strong> an der Westküste, etwa in <a href=\"/places/nea-skioni\">Nea Skioni</a>.</li><li><strong>Meze mit Aussicht:</strong> in Afytos.</li><li><strong>Preise:</strong> Direkt am Strand zahlt man die Aussicht mit; etwas weiter im Ort isst man meist günstiger.</li></ul>",
      "bg": "<h2>Съвети</h2><ul><li><strong>Резервация:</strong> в уикендите през юли и август запазете маса, особено за залеза.</li><li><strong>Риба:</strong> на западния бряг, например в <a href=\"/places/nea-skioni\">Неа Скиони</a>.</li><li><strong>Мезета с гледка:</strong> в Афитос.</li><li><strong>Цени:</strong> на самия плаж плащате и гледката; малко по-навътре обикновено се яде по-евтино.</li></ul>",
      "ru": "<h2>Советы</h2><ul><li><strong>Бронирование:</strong> в выходные июля и августа бронируйте столик, особенно на закат.</li><li><strong>Рыба:</strong> на западном побережье, например в <a href=\"/places/nea-skioni\">Неа Скиони</a>.</li><li><strong>Мезе с видом:</strong> в Афитосе.</li><li><strong>Цены:</strong> на первой линии вы платите и за вид; чуть дальше от моря обычно дешевле.</li></ul>",
      "ro": "<h2>Sfaturi</h2><ul><li><strong>Rezervare:</strong> în weekendurile din iulie și august rezervă masa, mai ales pentru apus.</li><li><strong>Pește:</strong> pe coasta de vest, ca la <a href=\"/places/nea-skioni\">Nea Skioni</a>.</li><li><strong>Meze cu priveliște:</strong> la Afytos.</li><li><strong>Prețuri:</strong> pe faleză plătești și priveliștea; puțin mai înăuntru mănânci de obicei mai ieftin.</li></ul>",
      "sr": "<h2>Saveti</h2><ul><li><strong>Rezervacija:</strong> vikendom u julu i avgustu rezervišite sto, naročito za zalazak sunca.</li><li><strong>Riba:</strong> na zapadnoj obali, kao u <a href=\"/places/nea-skioni\">Nea Skioniju</a>.</li><li><strong>Mezeti s pogledom:</strong> u Afitosu.</li><li><strong>Cene:</strong> na samoj obali plaćate i pogled; malo dalje obično se jede jeftinije.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Πού τρώνε οι ντόπιοι;",
          "en": "Where do locals eat?",
          "de": "Wo essen die Einheimischen?",
          "bg": "Къде се хранят местните?",
          "ru": "Где едят местные?",
          "ro": "Unde mănâncă localnicii?",
          "sr": "Gde jedu meštani?"
        },
        "a": {
          "el": "Στα ψαροχώρια της δυτικής ακτής, στα χωριά της ενδοχώρας και σε ταβέρνες ένα-δύο στενά μακριά από την παραλία.",
          "en": "In the fishing villages of the west coast, in the inland villages and in tavernas a lane or two back from the beach.",
          "de": "In den Fischerdörfern der Westküste, in den Dörfern im Inland und in Tavernen ein, zwei Gassen hinter dem Strand.",
          "bg": "В рибарските селища на западния бряг, в селата във вътрешността и в таверни на една-две улички от плажа.",
          "ru": "В рыбацких деревнях западного побережья, во внутренних деревнях и в тавернах в паре улочек от пляжа.",
          "ro": "În satele de pescari de pe coasta de vest, în satele din interior și în tavernele aflate la o stradă-două de plajă.",
          "sr": "U ribarskim selima zapadne obale, u selima u unutrašnjosti i u tavernama ulicu-dve od plaže."
        }
      },
      {
        "q": {
          "el": "Γιατί η λίστα έχει λίγα εστιατόρια;",
          "en": "Why does the list have few restaurants?",
          "de": "Warum hat die Liste nur wenige Restaurants?",
          "bg": "Защо в списъка има малко ресторанти?",
          "ru": "Почему в списке мало ресторанов?",
          "ro": "De ce are lista puține restaurante?",
          "sr": "Zašto lista ima malo restorana?"
        },
        "a": {
          "el": "Προσθέτουμε σταδιακά επιχειρήσεις με επαληθευμένα στοιχεία. Αν έχεις εστιατόριο στην Κασσάνδρα, <a href=\"/for-owners\">επικοινώνησε μαζί μας</a>.",
          "en": "We add businesses gradually, with verified details. If you run a restaurant in Kassandra, <a href=\"/for-owners\">get in touch</a>.",
          "de": "Wir nehmen Betriebe schrittweise mit geprüften Angaben auf. Wenn du ein Restaurant auf Kassandra führst, <a href=\"/for-owners\">melde dich</a>.",
          "bg": "Добавяме заведения постепенно, с проверени данни. Ако имате ресторант в Касандра, <a href=\"/for-owners\">свържете се с нас</a>.",
          "ru": "Мы добавляем заведения постепенно, с проверенными данными. Если у вас ресторан на Кассандре, <a href=\"/for-owners\">свяжитесь с нами</a>.",
          "ro": "Adăugăm localuri treptat, cu date verificate. Dacă ai un restaurant în Kassandra, <a href=\"/for-owners\">contactează-ne</a>.",
          "sr": "Lokale dodajemo postepeno, sa proverenim podacima. Ako imate restoran na Kasandri, <a href=\"/for-owners\">javite nam se</a>."
        }
      }
    ]
  },
  "restaurants-sithonia": {
    "intro": {
      "el": "<p>Στη Σιθωνία το φαγητό είναι πιο απλό και πιο κοντά στη θάλασσα: ψαροταβέρνες σε λιμανάκια όπως το <a href=\"/places/porto-koufo\">Πόρτο Κουφό</a> και ο <a href=\"/places/neos-marmaras\">Νέος Μαρμαράς</a>, ταβέρνες με θέα στον ορεινό <a href=\"/places/parthenonas\">Παρθενώνα</a> και στην παλιά Νικήτη. Οι βαθμολογίες στη λίστα προέρχονται από το Google.</p>",
      "en": "<p>In Sithonia the food is simpler and closer to the sea: fish tavernas in small harbours such as <a href=\"/places/porto-koufo\">Porto Koufo</a> and <a href=\"/places/neos-marmaras\">Neos Marmaras</a>, tavernas with a view in hilltop <a href=\"/places/parthenonas\">Parthenonas</a> and in old Nikiti. The ratings in the list come from Google.</p>",
      "de": "<p>Auf Sithonia ist das Essen einfacher und näher am Meer: Fischtavernen in kleinen Häfen wie <a href=\"/places/porto-koufo\">Porto Koufo</a> und <a href=\"/places/neos-marmaras\">Neos Marmaras</a>, Tavernen mit Aussicht im Bergdorf <a href=\"/places/parthenonas\">Parthenonas</a> und im alten Nikiti. Die Bewertungen in der Liste stammen von Google.</p>",
      "bg": "<p>В Ситония храната е по-проста и по-близо до морето: рибни таверни в малки пристанища като <a href=\"/places/porto-koufo\">Порто Куфо</a> и <a href=\"/places/neos-marmaras\">Неос Мармарас</a>, таверни с гледка в планинския <a href=\"/places/parthenonas\">Партенонас</a> и в стария Никити. Оценките в списъка са от Google.</p>",
      "ru": "<p>На Ситонии еда проще и ближе к морю: рыбные таверны в маленьких гаванях вроде <a href=\"/places/porto-koufo\">Порто Куфо</a> и <a href=\"/places/neos-marmaras\">Неос Мармараса</a>, таверны с видом в горном <a href=\"/places/parthenonas\">Парфенонасе</a> и в старом Никити. Оценки в списке взяты из Google.</p>",
      "ro": "<p>În Sithonia mâncarea e mai simplă și mai aproape de mare: taverne cu pește în porturi mici ca <a href=\"/places/porto-koufo\">Porto Koufo</a> și <a href=\"/places/neos-marmaras\">Neos Marmaras</a>, taverne cu priveliște în satul de munte <a href=\"/places/parthenonas\">Parthenonas</a> și în vechiul Nikiti. Evaluările din listă provin de pe Google.</p>",
      "sr": "<p>Na Sitoniji je hrana jednostavnija i bliža moru: riblje taverne u malim lukama kao što su <a href=\"/places/porto-koufo\">Porto Kufo</a> i <a href=\"/places/neos-marmaras\">Neos Marmaras</a>, taverne s pogledom u planinskom <a href=\"/places/parthenonas\">Partenonasu</a> i u starom Nikitiju. Ocene u listi potiču sa Google-a.</p>"
    },
    "tips": {
      "el": "<h2>Πού για τι</h2><ul><li><strong>Ψάρι:</strong> Πόρτο Κουφό, Νέος Μαρμαράς, Σάρτη.</li><li><strong>Ηλιοβασίλεμα:</strong> Παρθενώνας και Νέος Μαρμαράς, στη δυτική πλευρά.</li><li><strong>Θέα στον Άθω:</strong> Σάρτη και Βουρβουρού, στην ανατολική πλευρά.</li><li><strong>Βόλτα και φαγητό:</strong> τα καλντερίμια της παλιάς Νικήτης.</li></ul>",
      "en": "<h2>Where for what</h2><ul><li><strong>Fish:</strong> Porto Koufo, Neos Marmaras, Sarti.</li><li><strong>Sunset:</strong> Parthenonas and Neos Marmaras, on the west side.</li><li><strong>Views of Mount Athos:</strong> Sarti and Vourvourou, on the east side.</li><li><strong>A stroll and a meal:</strong> the cobbled lanes of old Nikiti.</li></ul>",
      "de": "<h2>Wo wofür</h2><ul><li><strong>Fisch:</strong> Porto Koufo, Neos Marmaras, Sarti.</li><li><strong>Sonnenuntergang:</strong> Parthenonas und Neos Marmaras auf der Westseite.</li><li><strong>Blick auf den Athos:</strong> Sarti und Vourvourou auf der Ostseite.</li><li><strong>Bummeln und essen:</strong> die gepflasterten Gassen des alten Nikiti.</li></ul>",
      "bg": "<h2>Къде за какво</h2><ul><li><strong>Риба:</strong> Порто Куфо, Неос Мармарас, Сарти.</li><li><strong>Залез:</strong> Партенонас и Неос Мармарас, на западната страна.</li><li><strong>Гледка към Атон:</strong> Сарти и Вурвуру, на източната страна.</li><li><strong>Разходка и вечеря:</strong> калдъръмените улички на стария Никити.</li></ul>",
      "ru": "<h2>Куда за чем</h2><ul><li><strong>Рыба:</strong> Порто Куфо, Неос Мармарас, Сарти.</li><li><strong>Закат:</strong> Парфенонас и Неос Мармарас, на западной стороне.</li><li><strong>Вид на Афон:</strong> Сарти и Вурвуру, на восточной стороне.</li><li><strong>Прогулка и ужин:</strong> мощёные улочки старого Никити.</li></ul>",
      "ro": "<h2>Unde pentru ce</h2><ul><li><strong>Pește:</strong> Porto Koufo, Neos Marmaras, Sarti.</li><li><strong>Apus:</strong> Parthenonas și Neos Marmaras, pe partea de vest.</li><li><strong>Vedere spre Athos:</strong> Sarti și Vourvourou, pe partea de est.</li><li><strong>Plimbare și cină:</strong> ulițele pietruite ale vechiului Nikiti.</li></ul>",
      "sr": "<h2>Gde za šta</h2><ul><li><strong>Riba:</strong> Porto Kufo, Neos Marmaras, Sarti.</li><li><strong>Zalazak sunca:</strong> Partenonas i Neos Marmaras, na zapadnoj strani.</li><li><strong>Pogled na Atos:</strong> Sarti i Vurvuru, na istočnoj strani.</li><li><strong>Šetnja i večera:</strong> kaldrmisane uličice starog Nikitija.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Είναι ανοιχτά τον χειμώνα;",
          "en": "Are they open in winter?",
          "de": "Haben sie im Winter geöffnet?",
          "bg": "Работят ли през зимата?",
          "ru": "Работают ли зимой?",
          "ro": "Sunt deschise iarna?",
          "sr": "Da li rade zimi?"
        },
        "a": {
          "el": "Τα περισσότερα παραθαλάσσια κλείνουν. Στις κωμοπόλεις που ζουν όλο τον χρόνο, όπως η Νικήτη και ο Νέος Μαρμαράς, θα βρεις πάντα κάποιες ταβέρνες ανοιχτές.",
          "en": "Most seaside places close. In the towns that live all year, such as Nikiti and Neos Marmaras, you'll always find some tavernas open.",
          "de": "Die meisten Lokale am Meer schließen. In Orten, die das ganze Jahr leben, wie Nikiti und Neos Marmaras, haben immer einige Tavernen geöffnet.",
          "bg": "Повечето крайбрежни заведения затварят. В градчетата с живот през цялата година, като Никити и Неос Мармарас, винаги има отворени таверни.",
          "ru": "Большинство заведений у моря закрываются. В городках, живущих круглый год, вроде Никити и Неос Мармараса, всегда найдутся открытые таверны.",
          "ro": "Cele mai multe localuri de pe litoral se închid. În orășelele care trăiesc tot anul, ca Nikiti și Neos Marmaras, găsești mereu câteva taverne deschise.",
          "sr": "Većina lokala uz more zatvara. U mestima koja žive cele godine, kao što su Nikiti i Neos Marmaras, uvek ćete naći neke otvorene taverne."
        }
      },
      {
        "q": {
          "el": "Χρειάζεται κράτηση;",
          "en": "Do I need to book?",
          "de": "Muss ich reservieren?",
          "bg": "Трябва ли резервация?",
          "ru": "Нужно ли бронировать?",
          "ro": "Trebuie să rezerv?",
          "sr": "Da li treba rezervacija?"
        },
        "a": {
          "el": "Τα Σαββατοκύριακα του Ιουλίου και του Αυγούστου ναι, ειδικά για τραπέζι δίπλα στο νερό. Τις καθημερινές συνήθως όχι.",
          "en": "On July and August weekends yes, especially for a table by the water. On weekdays usually not.",
          "de": "An Wochenenden im Juli und August ja, besonders für einen Tisch am Wasser. Unter der Woche meist nicht.",
          "bg": "В уикендите през юли и август — да, особено за маса до водата. В делничните дни обикновено не.",
          "ru": "В выходные июля и августа — да, особенно столик у воды. В будни обычно нет.",
          "ro": "În weekendurile din iulie și august da, mai ales pentru o masă lângă apă. În zilele lucrătoare de obicei nu.",
          "sr": "Vikendom u julu i avgustu da, naročito za sto pored vode. Radnim danima obično ne."
        }
      }
    ]
  },
  "free-beaches": {
    "intro": {
      "el": "<p>Ελεύθερες παραλίες — χωρίς ξαπλώστρες, χωρίς beach bar, χωρίς οργανωμένη λειτουργία. Στρώνεις την πετσέτα σου, βάζεις τη σκιά σου, και χαλαρώνεις χωρίς κανονικά να ξοδεύεις τίποτα. Στη Χαλκιδική, αυτές οι παραλίες είναι συνήθως ή απομονωμένες (Καβουρότρυπες, διαπόρου, μικρές παραλίες Σιθωνίας) ή απλώς λιγότερο διαφημισμένες. Πολλές έχουν τα καθαρότερα νερά και την πιο αυθεντική εμπειρία. Αυτή η λίστα συγκεντρώνει τις παραλίες που χαρακτηρίζονται \"free\" στη βάση μας — μπορείς να στρώσεις όπου θες, χωρίς πληρωμή.</p>",
      "en": "<p>Free beaches — no loungers, no beach bar, no organised setup. Spread your towel, set up your shade, and relax without spending anything. In Halkidiki these beaches are usually either isolated (Kavourotrypes, Diaporos, small Sithonia beaches) or simply less advertised. Many have the cleanest water and most authentic experience. This list collects beaches tagged as \"free\" in our database — you can spread out anywhere without paying.</p>",
      "de": "<p>Freie Strände — ohne Liegen, ohne Beach Bar, ohne organisierte Einrichtungen. Du legst dein Handtuch aus, suchst dir einen schattigen Platz und entspannst, ohne tatsächlich Geld auszugeben. In Chalkidiki sind diese Strände meist entweder abgelegen (Kavourotrypes, Diaporos, kleine Strände von Sithonia) oder einfach weniger beworben. Viele haben das sauberste Wasser und bieten das authentischste Erlebnis. Diese Liste fasst die Strände zusammen, die in unserer Datenbank als \"frei\" gekennzeichnet sind — du kannst dich hinlegen, wo du möchtest, ohne zu bezahlen.</p>",
      "ro": "<p>Plaje libere — fără șezlonguri, fără beach bar, fără facilități organizate. Îți așezi prosopul, îți pui umbra și te relaxezi fără să cheltuiești nimic în mod normal. În Halkidiki, aceste plaje sunt de obicei fie izolate (Kavourotrypes, Diaporos, plaje mici din Sithonia) fie pur și simplu mai puțin promovate. Multe dintre ele au cele mai curate ape și oferă cea mai autentică experiență. Această listă reunește plajele care sunt caracterizate ca \"libere\" în baza noastră de date — poți să te așezi unde vrei, fără plată.</p>",
      "sr": "<p>Slobodne plaže — bez ležaljki, bez beach bar-a, bez organizovanih sadržaja. Postaviš svoj peškir, napraviš sebi hladovinu i opuštaš se bez potrebe da trošiš novac. U Halkidikiju, ove plaže su obično ili izolovane (Kavourotrypes, Diaporos, male plaže Sitonije) ili jednostavno manje reklamirane. Mnoge od njih imaju najčistiju vodu i najautentičnije iskustvo. Ova lista okuplja plaže koje su označene kao \"slobodne\" u našoj bazi — možeš se smestiti gde želiš, bez plaćanja.</p>",
      "bg": "<p>Свободни плажове — без шезлонги, без beach bar, без организирана дейност. Разстилаш си кърпата, слагаш си сянката и релаксираш, без да харчиш нищо. В Халкидики тези плажове обикновено са или изолирани (Кавуротрипес, Диапорос, малки плажове на Ситония) или просто по-малко рекламирани. Много от тях имат най-чистите води и най-автентичното изживяване. Този списък събира плажовете, които се характеризират като \"свободни\" в нашата база — можеш да се разположиш където искаш, без заплащане.</p>",
      "ru": "<p>Свободные пляжи — без шезлонгов, без beach bar, без организованной инфраструктуры. Расстилаешь полотенце, находишь тень и расслабляешься, не тратя практически ничего. На Халкидиках такие пляжи обычно либо изолированы (Кавуротропис, Диапорос, маленькие пляжи Ситонии), либо просто менее рекламируемы. Многие из них имеют самую чистую воду и предлагают наиболее аутентичный опыт. Этот список собирает пляжи, которые в нашей базе данных отмечены как \"свободные\" — можно расположиться где угодно, без оплаты.</p>"
    },
    "seasonal": {
      "el": "<h2>Πότε να πας</h2><p><strong>Όλο τον χρόνο σχεδόν:</strong> Αυτές οι παραλίες δεν γεμίζουν ποτέ. Μόνη εξαίρεση: τα γνωστά Καβουρότρυπες/Orange Beach γεμίζουν 9-12 Σαββατοκύριακα Ιουλίου-Αυγούστου. <strong>Καλύτερη εποχή:</strong> Μάιος-Ιούνιος και Σεπτέμβριος-Οκτώβριος — έχεις την παραλία σχεδόν για εσάς. <strong>Ωραίος καιρός χωρίς κόσμο:</strong> Καθημερινές Σεπτεμβρίου είναι το απόλυτο sweet spot.</p>",
      "en": "<h2>When to visit</h2><p><strong>Almost year-round:</strong> These beaches never really fill up. The only exception: the famous Kavourotrypes/Orange Beach fills up 9-12 on July-August weekends. <strong>Best season:</strong> May-June and September-October — you basically have the beach to yourself. <strong>Nice weather without crowds:</strong> September weekdays are the absolute sweet spot.</p>",
      "de": "<h2>Wann man hingehen sollte</h2><p><strong>Fast das ganze Jahr über:</strong> Diese Strände sind nie überfüllt. Einzige Ausnahme: Die bekannten Kavourotrypes/Orange Beach sind an den Wochenenden von Juli bis August von 9 bis 12 Uhr voll. <strong>Beste Zeit:</strong> Mai-Juni und September-Oktober — du hast den Strand fast für dich allein. <strong>Schönes Wetter ohne Menschenmassen:</strong> Die Wochentage im September sind der absolute Sweet Spot.</p>",
      "ro": "<h2>Când să mergi</h2><p><strong>Aproape tot anul:</strong> Aceste plaje nu se aglomerează niciodată. Singura excepție: cunoscutele Kavourotrypes/Orange Beach se aglomerează în weekendurile din iulie-august. <strong>Cea mai bună perioadă:</strong> Mai-iunie și septembrie-octombrie — ai plaja aproape doar pentru tine. <strong>Vreme frumoasă fără mulțimi:</strong> Zilele lucrătoare din septembrie sunt momentul ideal.</p>",
      "sr": "<h2>Kada posetiti</h2><p><strong>Gotovo tokom cele godine:</strong> Ove plaže nikada nisu pretrpane. Jedini izuzetak: poznate Kavourotrypes/Orange Beach su pune 9-12 vikenda u julu-avgustu. <strong>Najbolje vreme:</strong> Maj-jun i septembar-oktobar — plaža je gotovo samo tvoja. <strong>Lepo vreme bez gužve:</strong> Radni dani u septembru su apsolutni sweet spot.</p>",
      "bg": "<h2>Кога да отидеш</h2><p><strong>Почти през цялата година:</strong> Тези плажове никога не се пълнят. Единствено изключение: известните Кавуротрипес/Orange Beach се пълнят 9-12 уикенда през юли-август. <strong>Най-добро време:</strong> Май-юни и септември-октомври — имаш плажа почти за себе си. <strong>Хубаво време без тълпи:</strong> Дните през седмицата през септември са абсолютното \"sweet spot\".</p>",
      "ru": "<h2>Когда поехать</h2><p><strong>Почти круглый год:</strong> Эти пляжи никогда не переполнены. Единственное исключение: известные Кавуротропис/Orange Beach переполнены в выходные с июля по август. <strong>Лучшее время:</strong> Май-июнь и сентябрь-октябрь — пляж практически в вашем распоряжении. <strong>Прекрасная погода без толпы:</strong> Будние дни сентября — это идеальное время.</p>"
    },
    "tips": {
      "el": "<h2>Πρακτικές συμβουλές για ελεύθερες παραλίες</h2><ul><li><strong>Πάρε τα πάντα:</strong> Νερό (τουλάχιστον 2L/άτομο), σνακ, ομπρέλα, αντηλιακό. Δεν υπάρχει καντίνα.</li><li><strong>Καθαριότητα:</strong> Σακούλα για σκουπίδια — πάρε τα μαζί σου. Αυτές οι παραλίες διατηρούνται καθαρές γιατί οι επισκέπτες σέβονται.</li><li><strong>Parking:</strong> Σε ορισμένες (Καβουρότρυπες) είναι μακριά + 5-15' περπάτημα. Παπούτσια κατάλληλα.</li><li><strong>Snorkeling:</strong> Οι ελεύθερες παραλίες έχουν συχνά τα καθαρότερα νερά. Δες τις <a href=\"/best/snorkeling-spots\">καλύτερες snorkeling παραλίες</a>.</li><li><strong>Σκιά:</strong> Συνήθως πεύκα προσφέρουν φυσική σκιά — αλλά όχι παντού. Φέρε ομπρέλα ή tarp.</li><li><strong>Σήμα κινητού:</strong> Σε απομονωμένες περιοχές μπορεί να μην έχει — ενημέρωσε κάποιον πού πας.</li></ul>",
      "en": "<h2>Practical tips for free beaches</h2><ul><li><strong>Bring everything:</strong> Water (at least 2L/person), snacks, umbrella, sunscreen. No canteen.</li><li><strong>Cleanliness:</strong> Pack a rubbish bag — take it with you. These beaches stay clean because visitors respect them.</li><li><strong>Parking:</strong> Some (Kavourotrypes) need a 5-15-min walk. Bring suitable shoes.</li><li><strong>Snorkelling:</strong> Free beaches often have the clearest water. See our <a href=\"/best/snorkeling-spots\">best snorkelling beaches</a>.</li><li><strong>Shade:</strong> Pine trees usually provide natural shade — but not everywhere. Bring an umbrella or tarp.</li><li><strong>Mobile signal:</strong> May be patchy in isolated spots — tell someone where you're going.</li></ul>",
      "de": "<h2>Praktische Tipps für freie Strände</h2><ul><li><strong>Nimm alles mit:</strong> Wasser (mindestens 2L/Person), Snacks, Sonnenschirm, Sonnencreme. Es gibt keinen Kiosk.</li><li><strong>Sauberkeit:</strong> Müllbeutel — nimm deinen Müll mit. Diese Strände bleiben sauber, weil die Besucher respektvoll sind.</li><li><strong>Parking:</strong> Bei einigen (Kavourotrypes) ist es weit entfernt + 5-15 Minuten zu Fuß. Geeignetes Schuhwerk.</li><li><strong>Snorkeling:</strong> Die freien Strände haben oft das sauberste Wasser. Siehe die <a href=\"/best/snorkeling-spots\">besten Strände zum Schnorcheln</a>.</li><li><strong>Schatten:</strong> Normalerweise bieten Kiefern natürlichen Schatten — aber nicht überall. Bring einen Sonnenschirm oder eine Plane mit.</li><li><strong>Mobilfunksignal:</strong> In abgelegenen Gebieten kann es keines geben — informiere jemanden, wohin du gehst.</li></ul>",
      "ro": "<h2>Sfaturi practice pentru plaje libere</h2><ul><li><strong>Adu totul:</strong> Apă (cel puțin 2L/persoană), gustări, umbrelă, cremă de protecție solară. Nu există cantină.</li><li><strong>Curățenie:</strong> Sac pentru gunoi — ia-le cu tine. Aceste plaje se mențin curate pentru că vizitatorii respectă.</li><li><strong>Parking:</strong> La unele (Kavourotrypes) este departe + 5-15' de mers pe jos. Încălțăminte adecvată.</li><li><strong>Snorkeling:</strong> Plajele libere au adesea cele mai curate ape. Vezi <a href=\"/best/snorkeling-spots\">cele mai bune plaje pentru snorkeling</a>.</li><li><strong>Umbră:</strong> De obicei, pini oferă umbră naturală — dar nu peste tot. Adu o umbrelă sau un tarp.</li><li><strong>Semnal mobil:</strong> În zonele izolate poate să nu fie — informează pe cineva unde mergi.</li></ul>",
      "sr": "<h2>Praktični saveti za slobodne plaže</h2><ul><li><strong>Ponesi sve:</strong> Vodu (najmanje 2L/osobi), grickalice, suncobran, kremu za sunčanje. Nema kantine.</li><li><strong>Čistoća:</strong> Kesa za smeće — ponesi ga sa sobom. Ove plaže ostaju čiste jer ih posetioci poštuju.</li><li><strong>Parking:</strong> Na nekima (Kavourotrypes) je udaljen + 5-15' hoda. Prikladna obuća.</li><li><strong>Snorkeling:</strong> Slobodne plaže često imaju najčistiju vodu. Pogledaj <a href=\"/best/snorkeling-spots\">najbolje snorkeling plaže</a>.</li><li><strong>Hladovina:</strong> Obično borovi pružaju prirodnu hladovinu — ali ne svuda. Ponesi suncobran ili tarp.</li><li><strong>Signal mobilnog:</strong> U izolovanim područjima možda nema signala — obavesti nekoga gde ideš.</li></ul>",
      "bg": "<h2>Практични съвети за свободни плажове</h2><ul><li><strong>Вземи всичко необходимо:</strong> Вода (поне 2L/човек), закуски, чадър, слънцезащитен крем. Няма кантина.</li><li><strong>Чистота:</strong> Торба за боклук — вземи ги с теб. Тези плажове се поддържат чисти, защото посетителите ги уважават.</li><li><strong>Parking:</strong> На някои (Кавуротрипес) е далеч + 5-15' пеша. Подходящи обувки.</li><li><strong>Snorkeling:</strong> Свободните плажове често имат най-чистите води. Виж <a href=\"/best/snorkeling-spots\">най-добрите плажове за snorkeling</a>.</li><li><strong>Сянка:</strong> Обикновено борове предлагат естествена сянка — но не навсякъде. Вземи чадър или tarp.</li><li><strong>Сигнал на мобилен:</strong> В изолирани райони може да няма — информирай някого къде отиваш.</li></ul>",
      "ru": "<h2>Практические советы для свободных пляжей</h2><ul><li><strong>Возьмите все необходимое:</strong> Вода (не менее 2 л/чел), закуски, зонтик, солнцезащитный крем. Кафе нет.</li><li><strong>Чистота:</strong> Пакет для мусора — заберите его с собой. Эти пляжи остаются чистыми, потому что посетители уважают их.</li><li><strong>Parking:</strong> На некоторых (Кавуротропис) парковка далеко + 5-15 минут пешком. Подходящая обувь.</li><li><strong>Snorkeling:</strong> Свободные пляжи часто имеют самую чистую воду. Смотрите <a href=\"/best/snorkeling-spots\">лучшие пляжи для снорклинга</a>.</li><li><strong>Тень:</strong> Обычно сосны предоставляют естественную тень — но не везде. Возьмите зонтик или тент.</li><li><strong>Сотовая связь:</strong> В изолированных районах может отсутствовать — сообщите кому-то, куда вы направляетесь.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Είναι όλες οι παραλίες Χαλκιδικής ελεύθερες;",
          "en": "Are all Halkidiki beaches free?",
          "de": "Sind alle Strände in Chalkidiki frei?",
          "ro": "Sunt toate plajele din Halkidiki libere?",
          "sr": "Da li su sve plaže u Halkidikiju slobodne?",
          "bg": "Всички плажове в Халкидики ли са свободни?",
          "ru": "Все ли пляжи Халкидик свободные?"
        },
        "a": {
          "el": "Νομικά ναι — όλες οι ακτές είναι δημόσιες στην Ελλάδα. Στην πράξη, οι \"οργανωμένες\" παραλίες έχουν ξαπλώστρες/ομπρέλες (€8-15 σετ/μέρα). Σε αυτή τη λίστα συγκεντρώνουμε τις πλήρως φυσικές, χωρίς οργανωμένη λειτουργία.",
          "en": "Legally yes — all coast is public in Greece. In practice, \"organised\" beaches have loungers/umbrellas (€8-15 set/day). This list collects fully natural beaches without organised facilities.",
          "de": "Rechtlich ja — alle Küsten sind in Griechenland öffentlich. In der Praxis haben die \"organisierten\" Strände Liegen/Sonnenschirme (€8-15 Set/Tag). In dieser Liste sammeln wir die vollständig natürlichen Strände ohne organisierte Einrichtungen.",
          "ro": "Legal da — toate țărmurile sunt publice în Grecia. În practică, plajele \"organizate\" au șezlonguri/umbrele (€8-15 set/zi). În această listă reunim plajele complet naturale, fără facilități organizate.",
          "sr": "Pravno da — sve obale su javne u Grčkoj. U praksi, \"organizovane\" plaže imaju ležaljke/suncobrane (€8-15 set/dan). Na ovoj listi okupljamo potpuno prirodne, bez organizovanih sadržaja.",
          "bg": "Юридически да — всички брегове в Гърция са обществени. На практика, \"организираните\" плажове имат шезлонги/чадъри (€8-15 комплект/ден). В този списък събираме напълно естествените, без организирана дейност.",
          "ru": "Юридически да — все побережья в Греции являются общественными. На практике \"организованные\" пляжи имеют шезлонги/зонтики (€8-15 комплект/день). В этом списке мы собираем полностью природные, без организованной инфраструктуры."
        }
      },
      {
        "q": {
          "el": "Πιο καλό για ησυχία ελεύθερες ή ήσυχες;",
          "en": "Better for peace: free or quiet beaches?",
          "de": "Was ist besser für Ruhe: freie oder ruhige Strände?",
          "ro": "Ce este mai bine pentru liniște, plaje libere sau liniștite?",
          "sr": "Šta je bolje za mir, slobodne ili mirne plaže?",
          "bg": "Кое е по-добро за спокойствие — свободни или тихи плажове?",
          "ru": "Что лучше для тишины — свободные или тихие пляжи?"
        },
        "a": {
          "el": "Πολλές <a href=\"/best/quiet-beaches\">ήσυχες παραλίες</a> είναι ταυτόχρονα ελεύθερες. Διαφορά: \"ελεύθερες\" είναι χωρίς υποδομές. \"Ήσυχες\" είναι χωρίς πολυκοσμία (μπορεί να έχουν beach bar χωρίς να γεμίζουν).",
          "en": "Many <a href=\"/best/quiet-beaches\">quiet beaches</a> are also free. Difference: \"free\" means no facilities. \"Quiet\" means no crowds (may have a beach bar that doesn't fill up).",
          "de": "Viele <a href=\"/best/quiet-beaches\">ruhige Strände</a> sind gleichzeitig frei. Unterschied: \"freie\" Strände sind ohne Infrastruktur. \"Ruhige\" Strände sind ohne Menschenmassen (können Beach Bars haben, ohne voll zu werden).",
          "ro": "Multe <a href=\"/best/quiet-beaches\">plaje liniștite</a> sunt și libere. Diferența: \"libere\" sunt fără infrastructură. \"Liniștite\" sunt fără aglomerație (pot avea beach bar fără să se aglomereze).",
          "sr": "Mnoge <a href=\"/best/quiet-beaches\">mirne plaže</a> su istovremeno slobodne. Razlika: \"slobodne\" su bez infrastrukture. \"Mirne\" su bez gužve (mogu imati beach bar a da nisu pretrpane).",
          "bg": "Много <a href=\"/best/quiet-beaches\">тихи плажове</a> са едновременно и свободни. Разлика: \"свободни\" са без инфраструктура. \"Тихи\" са без много хора (може да имат beach bar, без да се пълнят).",
          "ru": "Многие <a href=\"/best/quiet-beaches\">тихие пляжи</a> одновременно являются свободными. Разница: \"свободные\" — без инфраструктуры. \"Тихие\" — без толпы (могут иметь beach bar, но не переполняются)."
        }
      },
      {
        "q": {
          "el": "Είναι ασφαλές να αφήσω πράγματα όταν κολυμπώ;",
          "en": "Is it safe to leave belongings while swimming?",
          "de": "Ist es sicher, Sachen am Strand zu lassen, wenn ich schwimme?",
          "ro": "Este sigur să-mi las lucrurile când înot?",
          "sr": "Da li je bezbedno ostaviti stvari dok plivam?",
          "bg": "Безопасно ли е да оставя неща, когато плувам?",
          "ru": "Безопасно ли оставлять вещи, когда купаешься?"
        },
        "a": {
          "el": "Η Χαλκιδική έχει χαμηλό crime rate — οι κλοπές σε παραλίες είναι σπάνιες αλλά δεν εκμηδενίζονται. Άσε ομαδική τσάντα με 1 άτομο, ή έχε waterproof pouch με κινητό/χρήματα μαζί σου στο νερό.",
          "en": "Halkidiki has a low crime rate — beach thefts are rare but not zero. Leave a group bag with one person, or carry a waterproof pouch with phone/cash into the water.",
          "de": "Chalkidiki hat eine niedrige Kriminalitätsrate — Diebstähle an Stränden sind selten, aber nicht ausgeschlossen. Lass eine Gruppentasche bei einer Person, oder nimm eine wasserdichte Tasche mit Handy/Geld mit ins Wasser.",
          "ro": "Halkidiki are o rată scăzută a criminalității — furturile pe plaje sunt rare, dar nu inexistente. Lasă o geantă de grup cu o persoană sau poartă un pouch waterproof cu telefonul/banii la tine în apă.",
          "sr": "Halkidiki ima nisku stopu kriminala — krađe na plažama su retke, ali nisu nemoguće. Ostavite grupnu torbu sa jednom osobom, ili nosite vodootpornu torbicu sa mobilnim/novcem sa sobom u vodu.",
          "bg": "Халкидики има нисък процент на престъпност — кражбите на плажове са редки, но не и невъзможни. Остави групова чанта с 1 човек или носи водоустойчива торбичка с телефон/пари с теб във водата.",
          "ru": "На Халкидиках низкий уровень преступности — кражи на пляжах редки, но не исключены. Оставьте сумку с одним человеком или возьмите с собой в воду водонепроницаемый чехол с телефоном/деньгами."
        }
      }
    ]
  },
  "hiking-trails": {
    "intro": {
      "el": "<p>Η Χαλκιδική δεν είναι μόνο παραλίες. Πίσω από τις ακτές υψώνονται δασωμένα βουνά — ο Χολομώντας στο κέντρο και ο Ίταμος στη Σιθωνία — με δασικούς δρόμους, μονοπάτια προς ξωκλήσια και θέες προς τη θάλασσα. Η λίστα συγκεντρώνει διαδρομές και σημεία στη φύση.</p>",
      "en": "<p>Halkidiki isn't only beaches. Behind the coasts rise forested mountains — Cholomontas in the centre and Itamos in Sithonia — with forest roads, paths to chapels and views over the sea. The list brings together routes and spots in nature.</p>",
      "de": "<p>Chalkidiki ist nicht nur Strand. Hinter den Küsten erheben sich bewaldete Berge — der Cholomontas in der Mitte und der Itamos auf Sithonia — mit Forstwegen, Pfaden zu Kapellen und Blicken aufs Meer. Die Liste versammelt Routen und Orte in der Natur.</p>",
      "bg": "<p>Халкидики не е само плажове. Зад бреговете се издигат залесени планини — Холомондас в центъра и Итамос в Ситония — с горски пътища, пътеки към параклиси и гледки към морето. Списъкът събира маршрути и места сред природата.</p>",
      "ru": "<p>Халкидики — это не только пляжи. За побережьем поднимаются лесистые горы — Холомондас в центре и Итамос на Ситонии — с лесными дорогами, тропами к часовням и видами на море. В списке — маршруты и места на природе.</p>",
      "ro": "<p>Halkidiki nu înseamnă doar plaje. În spatele coastelor se înalță munți împăduriți — Holomontas în centru și Itamos în Sithonia — cu drumuri forestiere, poteci spre capele și priveliști spre mare. Lista adună trasee și locuri în natură.</p>",
      "sr": "<p>Halkidiki nisu samo plaže. Iza obala uzdižu se šumovite planine — Holomondas u središtu i Itamos na Sitoniji — sa šumskim putevima, stazama do kapela i pogledima na more. Lista okuplja rute i mesta u prirodi.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές</h2><ul><li><strong>Εποχή:</strong> άνοιξη και φθινόπωρο είναι ιδανικά· το καλοκαίρι περπάτα νωρίς το πρωί ή αργά το απόγευμα.</li><li><strong>Νερό:</strong> πάρε αρκετό· πηγές υπάρχουν, αλλά όχι παντού.</li><li><strong>Χάρτης:</strong> τα μονοπάτια δεν είναι πάντα σημαδεμένα· κατέβασε χάρτη offline.</li><li><strong>Κίνδυνος πυρκαγιάς:</strong> τις μέρες πολύ υψηλού κινδύνου μπορεί να απαγορεύεται η πρόσβαση στα δάση.</li></ul>",
      "en": "<h2>Tips</h2><ul><li><strong>Season:</strong> spring and autumn are ideal; in summer walk early in the morning or late in the afternoon.</li><li><strong>Water:</strong> carry plenty; there are springs, but not everywhere.</li><li><strong>Map:</strong> paths aren't always waymarked; download an offline map.</li><li><strong>Fire risk:</strong> on very high fire-risk days access to forests may be banned.</li></ul>",
      "de": "<h2>Tipps</h2><ul><li><strong>Jahreszeit:</strong> Frühling und Herbst sind ideal; im Sommer früh morgens oder spät nachmittags gehen.</li><li><strong>Wasser:</strong> genug mitnehmen; es gibt Quellen, aber nicht überall.</li><li><strong>Karte:</strong> Wege sind nicht immer markiert; eine Offline-Karte herunterladen.</li><li><strong>Waldbrandgefahr:</strong> An Tagen mit sehr hoher Gefahr kann der Zugang zu Wäldern verboten sein.</li></ul>",
      "bg": "<h2>Съвети</h2><ul><li><strong>Сезон:</strong> пролетта и есента са идеални; през лятото вървете рано сутрин или късно следобед.</li><li><strong>Вода:</strong> носете достатъчно — има извори, но не навсякъде.</li><li><strong>Карта:</strong> пътеките не винаги са маркирани — свалете офлайн карта.</li><li><strong>Пожарна опасност:</strong> в дни с много висок риск достъпът до горите може да е забранен.</li></ul>",
      "ru": "<h2>Советы</h2><ul><li><strong>Сезон:</strong> весна и осень идеальны; летом ходите рано утром или ближе к вечеру.</li><li><strong>Вода:</strong> берите с запасом — родники есть, но не везде.</li><li><strong>Карта:</strong> тропы не всегда размечены — скачайте офлайн-карту.</li><li><strong>Пожароопасность:</strong> в дни очень высокой опасности доступ в леса могут запретить.</li></ul>",
      "ro": "<h2>Sfaturi</h2><ul><li><strong>Sezonul:</strong> primăvara și toamna sunt ideale; vara mergi dimineața devreme sau după-amiaza târziu.</li><li><strong>Apă:</strong> ia destulă; există izvoare, dar nu peste tot.</li><li><strong>Hartă:</strong> potecile nu sunt mereu marcate; descarcă o hartă offline.</li><li><strong>Risc de incendiu:</strong> în zilele cu risc foarte mare, accesul în păduri poate fi interzis.</li></ul>",
      "sr": "<h2>Saveti</h2><ul><li><strong>Sezona:</strong> proleće i jesen su idealni; leti pešačite rano ujutru ili kasno popodne.</li><li><strong>Voda:</strong> ponesite dovoljno; izvora ima, ali ne svuda.</li><li><strong>Mapa:</strong> staze nisu uvek markirane; preuzmite oflajn mapu.</li><li><strong>Opasnost od požara:</strong> u danima vrlo visoke opasnosti pristup šumama može biti zabranjen.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Υπάρχουν εύκολες διαδρομές;",
          "en": "Are there easy walks?",
          "de": "Gibt es leichte Wanderungen?",
          "bg": "Има ли лесни маршрути?",
          "ru": "Есть ли лёгкие маршруты?",
          "ro": "Există trasee ușoare?",
          "sr": "Ima li lakih staza?"
        },
        "a": {
          "el": "Ναι, όπως η βόλτα στα αρχαία Στάγειρα ή γύρω από τον <a href=\"/places/parthenonas\">Παρθενώνα</a>.",
          "en": "Yes, such as a walk around ancient Stagira or around <a href=\"/places/parthenonas\">Parthenonas</a>.",
          "de": "Ja, etwa ein Spaziergang durch das antike Stagira oder rund um <a href=\"/places/parthenonas\">Parthenonas</a>.",
          "bg": "Да, като разходката в древна Стагира или около <a href=\"/places/parthenonas\">Партенонас</a>.",
          "ru": "Да, например прогулка по древней Стагире или вокруг <a href=\"/places/parthenonas\">Парфенонаса</a>.",
          "ro": "Da, ca plimbarea prin Stagira antică sau în jurul satului <a href=\"/places/parthenonas\">Parthenonas</a>.",
          "sr": "Da, poput šetnje kroz antičku Stagiru ili oko <a href=\"/places/parthenonas\">Partenonasa</a>."
        }
      },
      {
        "q": {
          "el": "Πού να μείνω για πεζοπορία;",
          "en": "Where should I stay for hiking?",
          "de": "Wo zum Wandern übernachten?",
          "bg": "Къде да отседна за преходи?",
          "ru": "Где остановиться для походов?",
          "ro": "Unde să stau pentru drumeții?",
          "sr": "Gde da odsednem zbog planinarenja?"
        },
        "a": {
          "el": "Στον Παρθενώνα ή τον Νέο Μαρμαρά για τον Ίταμο, στην <a href=\"/places/arnaia\">Αρναία</a> ή τον Ταξιάρχη για τον Χολομώντα.",
          "en": "Parthenonas or Neos Marmaras for Itamos, <a href=\"/places/arnaia\">Arnaia</a> or Taxiarchis for Cholomontas.",
          "de": "In Parthenonas oder Neos Marmaras für den Itamos, in <a href=\"/places/arnaia\">Arnaia</a> oder Taxiarchis für den Cholomontas.",
          "bg": "В Партенонас или Неос Мармарас за Итамос, в <a href=\"/places/arnaia\">Арнеа</a> или Таксиархис за Холомондас.",
          "ru": "В Парфенонасе или Неос Мармарасе — для Итамоса, в <a href=\"/places/arnaia\">Арнее</a> или Таксиархисе — для Холомондаса.",
          "ro": "În Parthenonas sau Neos Marmaras pentru Itamos, în <a href=\"/places/arnaia\">Arnaia</a> sau Taxiarhis pentru Holomontas.",
          "sr": "U Partenonasu ili Neos Marmarasu za Itamos, u <a href=\"/places/arnaia\">Arnei</a> ili Taksijarhisu za Holomondas."
        }
      }
    ]
  },
  "water-sports": {
    "intro": {
      "el": "<p>Με ήρεμους κόλπους και καθαρά νερά, η Χαλκιδική ταιριάζει σε θαλάσσια σπορ. Σε πολλές οργανωμένες παραλίες νοικιάζεις SUP, κανό ή θαλάσσια ποδήλατα, ενώ στις μεγαλύτερες υπάρχουν και μηχανοκίνητα σπορ, όπως jet ski. Στη Βουρβουρού νοικιάζεις μικρό σκάφος χωρίς δίπλωμα για τα νησάκια, και υπάρχουν καταδυτικά κέντρα για δοκιμαστική κατάδυση. Η λίστα συγκεντρώνει τις δραστηριότητες στη θάλασσα.</p>",
      "en": "<p>With calm bays and clear water, Halkidiki suits water sports. At many organised beaches you can rent a SUP, kayak or pedalo, and the larger ones also have motor sports such as jet skis. In Vourvourou you can rent a small licence-free boat to explore the islets, and there are dive centres for a try-dive. The list brings together activities on the water.</p>",
      "de": "<p>Mit ruhigen Buchten und klarem Wasser eignet sich Chalkidiki für Wassersport. An vielen organisierten Stränden kann man SUP, Kajak oder Tretboot mieten, an den größeren gibt es auch motorisierten Wassersport wie Jetski. In Vourvourou mietet man ein kleines führerscheinfreies Boot für die Inselchen, und es gibt Tauchschulen für einen Schnuppertauchgang. Die Liste versammelt Aktivitäten auf dem Wasser.</p>",
      "bg": "<p>Със спокойните си заливи и бистрата вода Халкидики е подходящ за водни спортове. На много организирани плажове се наемат SUP, каяк или водно колело, а на по-големите има и моторни спортове като джет. Във Вурвуру можете да наемете малка лодка без книжка за островчетата, а има и центрове за гмуркане с пробно гмуркане. Списъкът събира заниманията в морето.</p>",
      "ru": "<p>Спокойные бухты и прозрачная вода делают Халкидики хорошим местом для водных видов спорта. На многих оборудованных пляжах можно взять SUP, каяк или катамаран, а на крупных есть и моторные развлечения вроде гидроцикла. В Вурвуру можно арендовать небольшую лодку без прав для поездки к островкам, а в дайв-центрах — попробовать пробное погружение. В списке — развлечения на воде.</p>",
      "ro": "<p>Cu golfuri liniștite și apă limpede, Halkidiki se potrivește sporturilor nautice. Pe multe plaje amenajate poți închiria SUP, caiac sau hidrobicicletă, iar pe cele mari există și sporturi cu motor, precum jet ski-ul. În Vourvourou închiriezi o barcă mică fără permis pentru insulițe, și există centre de scufundări pentru o scufundare de probă. Lista adună activitățile pe apă.</p>",
      "sr": "<p>Sa mirnim uvalama i bistrom vodom, Halkidiki je pogodan za vodene sportove. Na mnogim uređenim plažama iznajmljuju se SUP, kajak ili pedalina, a na većim ima i motornih sportova poput džet-skija. U Vurvuruu možete iznajmiti mali čamac bez dozvole za obilazak ostrvaca, a postoje i ronilački centri za probno ronjenje. Lista okuplja aktivnosti na vodi.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές</h2><ul><li><strong>Αέρας:</strong> το πρωί η θάλασσα είναι συνήθως πιο ήρεμη· το απόγευμα ο αέρας συχνά δυναμώνει.</li><li><strong>Τιμές:</strong> ρώτα τι περιλαμβάνει η τιμή και για πόση ώρα.</li><li><strong>Ασφάλεια:</strong> φόρα σωσίβιο, μείνε μακριά από τους λουόμενους και ακολούθησε τις οδηγίες του ενοικιαστή.</li><li><strong>Παιδιά:</strong> κάθε δραστηριότητα έχει δικά της όρια ηλικίας· ρώτα από πριν.</li><li><strong>Χωρίς κόστος:</strong> για snorkeling δες τα <a href=\"/best/snorkeling-spots\">καλύτερα σημεία</a>.</li></ul>",
      "en": "<h2>Tips</h2><ul><li><strong>Wind:</strong> the sea is usually calmer in the morning; the wind often picks up in the afternoon.</li><li><strong>Prices:</strong> ask what the price includes and for how long.</li><li><strong>Safety:</strong> wear a life jacket, keep away from swimmers and follow the operator's instructions.</li><li><strong>Children:</strong> each activity has its own age limits; ask in advance.</li><li><strong>For free:</strong> for snorkelling see the <a href=\"/best/snorkeling-spots\">best spots</a>.</li></ul>",
      "de": "<h2>Tipps</h2><ul><li><strong>Wind:</strong> Morgens ist das Meer meist ruhiger, nachmittags frischt der Wind oft auf.</li><li><strong>Preise:</strong> Frag, was im Preis enthalten ist und für wie lange.</li><li><strong>Sicherheit:</strong> Schwimmweste tragen, Abstand zu Schwimmern halten und den Anweisungen des Vermieters folgen.</li><li><strong>Kinder:</strong> Jede Aktivität hat eigene Altersgrenzen; vorher fragen.</li><li><strong>Kostenlos:</strong> Zum Schnorcheln siehe die <a href=\"/best/snorkeling-spots\">besten Stellen</a>.</li></ul>",
      "bg": "<h2>Съвети</h2><ul><li><strong>Вятър:</strong> сутрин морето обикновено е по-спокойно; следобед вятърът често се усилва.</li><li><strong>Цени:</strong> питайте какво включва цената и за колко време.</li><li><strong>Безопасност:</strong> носете спасителна жилетка, стойте далеч от плуващите и следвайте инструкциите на фирмата.</li><li><strong>Деца:</strong> всяко занимание има свои възрастови граници — питайте предварително.</li><li><strong>Безплатно:</strong> за шнорхел вижте <a href=\"/best/snorkeling-spots\">най-добрите места</a>.</li></ul>",
      "ru": "<h2>Советы</h2><ul><li><strong>Ветер:</strong> утром море обычно спокойнее, после обеда ветер часто усиливается.</li><li><strong>Цены:</strong> уточняйте, что входит в цену и на какое время.</li><li><strong>Безопасность:</strong> надевайте спасательный жилет, держитесь подальше от купающихся и следуйте указаниям прокатчика.</li><li><strong>Дети:</strong> у каждого развлечения свои возрастные ограничения — спрашивайте заранее.</li><li><strong>Бесплатно:</strong> для снорклинга смотрите <a href=\"/best/snorkeling-spots\">лучшие места</a>.</li></ul>",
      "ro": "<h2>Sfaturi</h2><ul><li><strong>Vântul:</strong> dimineața marea e de obicei mai liniștită; după-amiaza vântul se întețește adesea.</li><li><strong>Prețuri:</strong> întreabă ce include prețul și pentru cât timp.</li><li><strong>Siguranță:</strong> poartă vestă de salvare, ține-te departe de înotători și urmează instrucțiunile firmei.</li><li><strong>Copii:</strong> fiecare activitate are propriile limite de vârstă; întreabă dinainte.</li><li><strong>Gratuit:</strong> pentru snorkeling vezi <a href=\"/best/snorkeling-spots\">cele mai bune locuri</a>.</li></ul>",
      "sr": "<h2>Saveti</h2><ul><li><strong>Vetar:</strong> ujutru je more obično mirnije; popodne vetar često pojača.</li><li><strong>Cene:</strong> pitajte šta je uključeno u cenu i za koliko vremena.</li><li><strong>Bezbednost:</strong> nosite prsluk za spasavanje, držite se dalje od kupača i pratite uputstva iznajmljivača.</li><li><strong>Deca:</strong> svaka aktivnost ima svoja starosna ograničenja; pitajte unapred.</li><li><strong>Besplatno:</strong> za ronjenje na dah pogledajte <a href=\"/best/snorkeling-spots\">najbolja mesta</a>.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Πού για ήρεμο SUP ή κανό;",
          "en": "Where for calm SUP or kayaking?",
          "de": "Wo ruhig SUP oder Kajak fahren?",
          "bg": "Къде за спокоен SUP или каяк?",
          "ru": "Где спокойно покататься на SUP или каяке?",
          "ro": "Unde pentru SUP sau caiac liniștit?",
          "sr": "Gde za miran SUP ili kajak?"
        },
        "a": {
          "el": "Στη Βουρβουρού, με τα ρηχά νερά ανάμεσα στα νησάκια, και σε κλειστούς κόλπους όπως το Πόρτο Κουφό.",
          "en": "In Vourvourou, with its shallow water between the islets, and in enclosed bays such as Porto Koufo.",
          "de": "In Vourvourou mit seinem flachen Wasser zwischen den Inselchen und in geschlossenen Buchten wie Porto Koufo.",
          "bg": "Във Вурвуру, с плитката вода между островчетата, и в затворени заливи като Порто Куфо.",
          "ru": "В Вурвуру с мелкой водой между островками и в закрытых бухтах вроде Порто Куфо.",
          "ro": "În Vourvourou, cu apa mică dintre insulițe, și în golfuri închise precum Porto Koufo.",
          "sr": "U Vurvuruu, sa plitkom vodom između ostrvaca, i u zatvorenim zalivima poput Porto Kufa."
        }
      },
      {
        "q": {
          "el": "Πού για καταδύσεις;",
          "en": "Where can I dive?",
          "de": "Wo kann ich tauchen?",
          "bg": "Къде мога да се гмуркам?",
          "ru": "Где можно понырять?",
          "ro": "Unde mă pot scufunda?",
          "sr": "Gde mogu da ronim?"
        },
        "a": {
          "el": "Υπάρχουν καταδυτικά κέντρα στην Κασσάνδρα και τη Σιθωνία, που κάνουν και δοκιμαστικές καταδύσεις για αρχάριους. Δες τις <a href=\"/activities/scuba-diving-kassandra\">καταδύσεις</a>.",
          "en": "There are dive centres in Kassandra and Sithonia, which also run try-dives for beginners. See <a href=\"/activities/scuba-diving-kassandra\">diving</a>.",
          "de": "Es gibt Tauchschulen auf Kassandra und Sithonia, die auch Schnuppertauchgänge für Anfänger anbieten. Siehe <a href=\"/activities/scuba-diving-kassandra\">Tauchen</a>.",
          "bg": "Има центрове за гмуркане в Касандра и Ситония, които правят и пробни гмуркания за начинаещи. Вижте <a href=\"/activities/scuba-diving-kassandra\">гмуркане</a>.",
          "ru": "На Кассандре и Ситонии есть дайв-центры, которые проводят и пробные погружения для новичков. Смотрите <a href=\"/activities/scuba-diving-kassandra\">дайвинг</a>.",
          "ro": "Există centre de scufundări în Kassandra și Sithonia, care fac și scufundări de probă pentru începători. Vezi <a href=\"/activities/scuba-diving-kassandra\">scufundări</a>.",
          "sr": "Na Kasandri i Sitoniji postoje ronilački centri koji organizuju i probna ronjenja za početnike. Pogledajte <a href=\"/activities/scuba-diving-kassandra\">ronjenje</a>."
        }
      }
    ]
  },
  "historical-sites": {
    "intro": {
      "el": "<p>Η Χαλκιδική κατοικείται από την προϊστορία. Εδώ γεννήθηκε ο Αριστοτέλης, στα <a href=\"/activities/ancient-stagira\">αρχαία Στάγειρα</a>, εδώ σώζεται η κλασική <a href=\"/activities/ancient-olynthos\">Όλυνθος</a>, και εδώ είναι το <a href=\"/activities/petralona-cave\">σπήλαιο των Πετραλώνων</a>, με ένα από τα σημαντικότερα ευρήματα αρχαϊκού ανθρώπου στην Ευρώπη. Στην τρίτη χερσόνησο βρίσκεται το Άγιο Όρος, μνημείο παγκόσμιας κληρονομιάς της UNESCO. Η λίστα συγκεντρώνει τα κυριότερα ιστορικά μνημεία.</p>",
      "en": "<p>Halkidiki has been inhabited since prehistory. Aristotle was born here, at <a href=\"/activities/ancient-stagira\">ancient Stagira</a>; classical <a href=\"/activities/ancient-olynthos\">Olynthos</a> survives here; and here is the <a href=\"/activities/petralona-cave\">Petralona Cave</a>, with one of the most important archaic human finds in Europe. On the third peninsula lies Mount Athos, a UNESCO World Heritage Site. The list brings together the main historical sites.</p>",
      "de": "<p>Chalkidiki ist seit der Vorgeschichte besiedelt. Hier wurde Aristoteles geboren, im <a href=\"/activities/ancient-stagira\">antiken Stagira</a>; hier ist das klassische <a href=\"/activities/ancient-olynthos\">Olynth</a> erhalten; und hier liegt die <a href=\"/activities/petralona-cave\">Höhle von Petralona</a> mit einem der wichtigsten Funde eines archaischen Menschen in Europa. Auf der dritten Halbinsel liegt der Athos, UNESCO-Welterbe. Die Liste versammelt die wichtigsten historischen Stätten.</p>",
      "bg": "<p>Халкидики е обитаван още от праисторията. Тук е роден Аристотел — в <a href=\"/activities/ancient-stagira\">древна Стагира</a>; тук е запазен класическият <a href=\"/activities/ancient-olynthos\">Олинт</a>; тук е и <a href=\"/activities/petralona-cave\">пещерата Петралона</a> с една от най-важните находки на архаичен човек в Европа. На третия полуостров се намира Света гора, обект на световното наследство на ЮНЕСКО. Списъкът събира основните исторически места.</p>",
      "ru": "<p>Халкидики заселены с доисторических времён. Здесь родился Аристотель — в <a href=\"/activities/ancient-stagira\">древней Стагире</a>; здесь сохранился классический <a href=\"/activities/ancient-olynthos\">Олинф</a>; здесь и <a href=\"/activities/petralona-cave\">пещера Петралона</a> с одной из важнейших находок архаичного человека в Европе. На третьем полуострове — Афон, объект Всемирного наследия ЮНЕСКО. В списке — главные исторические места.</p>",
      "ro": "<p>Halkidiki e locuit încă din preistorie. Aici s-a născut Aristotel, la <a href=\"/activities/ancient-stagira\">Stagira antică</a>; aici se păstrează orașul clasic <a href=\"/activities/ancient-olynthos\">Olynthos</a>; și tot aici e <a href=\"/activities/petralona-cave\">peștera Petralona</a>, cu una dintre cele mai importante descoperiri de om arhaic din Europa. Pe a treia peninsulă se află Muntele Athos, sit al patrimoniului mondial UNESCO. Lista adună principalele situri istorice.</p>",
      "sr": "<p>Halkidiki je naseljen još od praistorije. Ovde je rođen Aristotel, u <a href=\"/activities/ancient-stagira\">antičkoj Stagiri</a>; ovde je sačuvan klasični <a href=\"/activities/ancient-olynthos\">Olint</a>; ovde je i <a href=\"/activities/petralona-cave\">pećina Petralona</a>, sa jednim od najvažnijih nalaza arhaičnog čoveka u Evropi. Na trećem poluostrvu nalazi se Sveta Gora, deo svetske baštine UNESKO. Lista okuplja glavna istorijska mesta.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές</h2><ul><li><strong>Ώρες και εισιτήρια:</strong> αλλάζουν ανά εποχή· έλεγξέ τα πριν πας.</li><li><strong>Ζέστη:</strong> το καλοκαίρι πήγαινε νωρίς το πρωί — στους αρχαιολογικούς χώρους η σκιά είναι λίγη.</li><li><strong>Άγιο Όρος:</strong> μπαίνουν μόνο άνδρες με διαμονητήριο· όλοι μπορούν να δουν τα μοναστήρια από την <a href=\"/activities/mount-athos-cruise\">κρουαζιέρα</a>.</li><li><strong>Συνδυασμός:</strong> πρωί αξιοθέατο, απόγευμα θάλασσα.</li></ul>",
      "en": "<h2>Tips</h2><ul><li><strong>Hours and tickets:</strong> they change with the season; check before you go.</li><li><strong>Heat:</strong> in summer go early in the morning — archaeological sites have little shade.</li><li><strong>Mount Athos:</strong> only men with a diamonitirion may enter; everyone can see the monasteries from the <a href=\"/activities/mount-athos-cruise\">cruise</a>.</li><li><strong>Combine:</strong> sightseeing in the morning, the sea in the afternoon.</li></ul>",
      "de": "<h2>Tipps</h2><ul><li><strong>Öffnungszeiten und Tickets:</strong> ändern sich je nach Saison; vorher prüfen.</li><li><strong>Hitze:</strong> Im Sommer früh am Morgen hingehen — an Ausgrabungsstätten gibt es wenig Schatten.</li><li><strong>Athos:</strong> Nur Männer mit Diamonitirion dürfen hinein; alle können die Klöster von der <a href=\"/activities/mount-athos-cruise\">Bootstour</a> aus sehen.</li><li><strong>Kombinieren:</strong> morgens Besichtigung, nachmittags Meer.</li></ul>",
      "bg": "<h2>Съвети</h2><ul><li><strong>Часове и билети:</strong> променят се според сезона — проверете, преди да отидете.</li><li><strong>Жега:</strong> през лятото отидете рано сутрин — по археологическите обекти има малко сянка.</li><li><strong>Света гора:</strong> влизат само мъже с диамонитирион; всеки може да види манастирите от <a href=\"/activities/mount-athos-cruise\">круиза</a>.</li><li><strong>Комбинирайте:</strong> сутрин забележителност, следобед море.</li></ul>",
      "ru": "<h2>Советы</h2><ul><li><strong>Часы и билеты:</strong> меняются по сезонам — проверьте заранее.</li><li><strong>Жара:</strong> летом приезжайте рано утром — на раскопках мало тени.</li><li><strong>Афон:</strong> входить могут только мужчины с диамонитирионом; монастыри может увидеть каждый с <a href=\"/activities/mount-athos-cruise\">круиза</a>.</li><li><strong>Сочетайте:</strong> утром достопримечательность, после обеда — море.</li></ul>",
      "ro": "<h2>Sfaturi</h2><ul><li><strong>Program și bilete:</strong> se schimbă în funcție de sezon; verifică înainte să mergi.</li><li><strong>Căldura:</strong> vara mergi dimineața devreme — siturile arheologice au puțină umbră.</li><li><strong>Muntele Athos:</strong> intră doar bărbații cu diamonitirion; toată lumea poate vedea mănăstirile din <a href=\"/activities/mount-athos-cruise\">croazieră</a>.</li><li><strong>Combină:</strong> dimineața vizite, după-amiaza mare.</li></ul>",
      "sr": "<h2>Saveti</h2><ul><li><strong>Radno vreme i ulaznice:</strong> menjaju se po sezoni; proverite pre polaska.</li><li><strong>Vrućina:</strong> leti idite rano ujutru — na arheološkim lokalitetima ima malo hlada.</li><li><strong>Sveta Gora:</strong> ulaze samo muškarci sa diamonitirionom; manastire svi mogu da vide sa <a href=\"/activities/mount-athos-cruise\">krstarenja</a>.</li><li><strong>Kombinujte:</strong> ujutru znamenitost, popodne more.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Αξίζει το σπήλαιο των Πετραλώνων;",
          "en": "Is Petralona Cave worth it?",
          "de": "Lohnt sich die Höhle von Petralona?",
          "bg": "Струва ли си пещерата Петралона?",
          "ru": "Стоит ли ехать в пещеру Петралона?",
          "ro": "Merită peștera Petralona?",
          "sr": "Da li vredi pećina Petralona?"
        },
        "a": {
          "el": "Ναι. Η επίσκεψη γίνεται με ξενάγηση, είναι δροσερή και το καλοκαίρι και αρέσει και στα παιδιά.",
          "en": "Yes. Visits are guided, it is cool even in summer, and children enjoy it too.",
          "de": "Ja. Die Besichtigung erfolgt mit Führung, es ist auch im Sommer kühl, und Kindern gefällt es ebenfalls.",
          "bg": "Да. Посещението е с екскурзовод, прохладно е и през лятото и харесва и на децата.",
          "ru": "Да. Осмотр проходит с экскурсоводом, там прохладно даже летом, и детям тоже нравится.",
          "ro": "Da. Vizita se face cu ghid, e răcoare și vara și le place și copiilor.",
          "sr": "Da. Obilazak je uz vodiča, prijatno je sveže i leti, a deci se takođe dopada."
        }
      },
      {
        "q": {
          "el": "Πού είναι τα Στάγειρα;",
          "en": "Where is Stagira?",
          "de": "Wo liegt Stagira?",
          "bg": "Къде е Стагира?",
          "ru": "Где находится Стагира?",
          "ro": "Unde e Stagira?",
          "sr": "Gde je Stagira?"
        },
        "a": {
          "el": "Τα αρχαία Στάγειρα είναι σε μια μικρή χερσόνησο δίπλα στην <a href=\"/places/olympiada\">Ολυμπιάδα</a>. Το Πάρκο του Αριστοτέλη είναι στο ορεινό χωριό <a href=\"/places/stagira\">Στάγειρα</a>.",
          "en": "Ancient Stagira is on a small peninsula next to <a href=\"/places/olympiada\">Olympiada</a>. Aristotle Park is in the hill village of <a href=\"/places/stagira\">Stagira</a>.",
          "de": "Das antike Stagira liegt auf einer kleinen Halbinsel neben <a href=\"/places/olympiada\">Olympiada</a>. Der Aristoteles-Park ist im Bergdorf <a href=\"/places/stagira\">Stagira</a>.",
          "bg": "Древна Стагира е на малък полуостров до <a href=\"/places/olympiada\">Олимпиада</a>. Паркът на Аристотел е в планинското село <a href=\"/places/stagira\">Стагира</a>.",
          "ru": "Древняя Стагира — на маленьком полуострове рядом с <a href=\"/places/olympiada\">Олимпиадой</a>. Парк Аристотеля — в горной деревне <a href=\"/places/stagira\">Стагира</a>.",
          "ro": "Stagira antică e pe o mică peninsulă lângă <a href=\"/places/olympiada\">Olympiada</a>. Parcul lui Aristotel e în satul de munte <a href=\"/places/stagira\">Stagira</a>.",
          "sr": "Antička Stagira je na malom poluostrvu pored <a href=\"/places/olympiada\">Olimpijade</a>. Aristotelov park je u planinskom selu <a href=\"/places/stagira\">Stagira</a>."
        }
      },
      {
        "q": {
          "el": "Πώς μπαίνω στο Άγιο Όρος;",
          "en": "How do I visit Mount Athos?",
          "de": "Wie besuche ich den Athos?",
          "bg": "Как да посетя Света гора?",
          "ru": "Как попасть на Афон?",
          "ro": "Cum vizitez Muntele Athos?",
          "sr": "Kako da posetim Svetu Goru?"
        },
        "a": {
          "el": "Οι άνδρες χρειάζονται διαμονητήριο, που κλείνεται από πριν — δες τον <a href=\"/blog/mount-athos-diamonitirion-guide\">οδηγό για το διαμονητήριο</a>. Οι γυναίκες δεν επιτρέπεται να μπουν.",
          "en": "Men need a diamonitirion, booked in advance — see the <a href=\"/blog/mount-athos-diamonitirion-guide\">diamonitirion guide</a>. Women are not allowed to enter.",
          "de": "Männer brauchen ein Diamonitirion, das vorab gebucht wird — siehe den <a href=\"/blog/mount-athos-diamonitirion-guide\">Diamonitirion-Ratgeber</a>. Frauen ist der Zutritt nicht erlaubt.",
          "bg": "Мъжете се нуждаят от диамонитирион, резервиран предварително — вижте <a href=\"/blog/mount-athos-diamonitirion-guide\">пътеводителя за диамонитириона</a>. Жените нямат право да влизат.",
          "ru": "Мужчинам нужен диамонитирион, который бронируют заранее, — смотрите <a href=\"/blog/mount-athos-diamonitirion-guide\">гид по диамонитириону</a>. Женщинам вход запрещён.",
          "ro": "Bărbații au nevoie de diamonitirion, rezervat din timp — vezi <a href=\"/blog/mount-athos-diamonitirion-guide\">ghidul diamonitirionului</a>. Femeile nu au voie să intre.",
          "sr": "Muškarcima je potreban diamonitirion, rezervisan unapred — pogledajte <a href=\"/blog/mount-athos-diamonitirion-guide\">vodič za diamonitirion</a>. Ženama ulazak nije dozvoljen."
        }
      }
    ]
  },
  "snorkeling-spots": {
    "intro": {
      "el": "<p>Η Χαλκιδική, και ιδίως η Σιθωνία, έχει πολλούς κόλπους με βραχώδεις άκρες, όπου μαζεύονται ψάρια και τα νερά είναι πολύ καθαρά. Τις περισσότερες τις φτάνεις από την ακτή, χωρίς σκάφος, και χρειάζεσαι μόνο μάσκα και αναπνευστήρα. Η λίστα συγκεντρώνει παραλίες με βράχια και βότσαλο, όπου το snorkeling αξίζει.</p>",
      "en": "<p>Halkidiki, and Sithonia above all, has many coves with rocky ends, where fish gather and the water is very clear. Most can be reached from the shore without a boat, and all you need is a mask and snorkel. The list brings together beaches with rocks and pebbles where snorkelling is worth it.</p>",
      "de": "<p>Chalkidiki, vor allem Sithonia, hat viele Buchten mit felsigen Enden, an denen sich Fische sammeln und das Wasser sehr klar ist. Die meisten erreicht man vom Ufer aus ohne Boot, und man braucht nur Maske und Schnorchel. Die Liste versammelt Strände mit Felsen und Kieseln, an denen sich das Schnorcheln lohnt.</p>",
      "bg": "<p>Халкидики, и особено Ситония, има много заливи със скалисти краища, където се събират риби и водата е много бистра. До повечето се стига от брега, без лодка, и ви трябват само маска и шнорхел. Списъкът събира плажове със скали и камъчета, където шнорхелът си струва.</p>",
      "ru": "<p>На Халкидиках, и особенно на Ситонии, много бухт со скалистыми краями, где собирается рыба и вода очень прозрачная. До большинства можно добраться с берега без лодки — нужны только маска и трубка. В списке — пляжи с камнями и галькой, где стоит поснорклить.</p>",
      "ro": "<p>Halkidiki, și mai ales Sithonia, are multe golfuri cu margini stâncoase, unde se adună peștii și apa e foarte limpede. La cele mai multe ajungi de pe mal, fără barcă, și ai nevoie doar de mască și tub. Lista adună plaje cu stânci și pietricele unde snorkelingul merită.</p>",
      "sr": "<p>Halkidiki, a naročito Sitonija, ima mnogo uvala sa stenovitim krajevima, gde se okuplja riba i voda je veoma bistra. Do većine se stiže sa obale, bez čamca, i potrebni su vam samo maska i disaljka. Lista okuplja plaže sa stenama i šljunkom gde se ronjenje na dah isplati.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές</h2><ul><li><strong>Πού:</strong> στις βραχώδεις άκρες των κόλπων — εκεί είναι τα ψάρια.</li><li><strong>Πότε:</strong> το πρωί, πριν σηκωθεί αέρας, η θάλασσα είναι πιο ήρεμη και πιο καθαρή. Μετά από φουρτούνα τα νερά θέλουν μία-δύο μέρες για να καθαρίσουν.</li><li><strong>Εξοπλισμός:</strong> μάσκα, αναπνευστήρας και παπούτσια θαλάσσης για τους αχινούς.</li><li><strong>Ασφάλεια:</strong> μην κολυμπάς μόνος, μείνε μακριά από σκάφη και φόρα μπλουζάκι για τον ήλιο στην πλάτη.</li></ul>",
      "en": "<h2>Tips</h2><ul><li><strong>Where:</strong> at the rocky ends of the coves — that's where the fish are.</li><li><strong>When:</strong> in the morning, before the wind picks up, the sea is calmer and clearer. After rough seas the water needs a day or two to clear.</li><li><strong>Gear:</strong> mask, snorkel and water shoes for the sea urchins.</li><li><strong>Safety:</strong> don't snorkel alone, keep away from boats and wear a T-shirt to protect your back from the sun.</li></ul>",
      "de": "<h2>Tipps</h2><ul><li><strong>Wo:</strong> an den felsigen Enden der Buchten — dort sind die Fische.</li><li><strong>Wann:</strong> morgens, bevor der Wind auffrischt, ist das Meer ruhiger und klarer. Nach Seegang braucht das Wasser ein, zwei Tage, um wieder klar zu werden.</li><li><strong>Ausrüstung:</strong> Maske, Schnorchel und Badeschuhe gegen Seeigel.</li><li><strong>Sicherheit:</strong> nicht allein schnorcheln, Abstand zu Booten halten und ein T-Shirt gegen Sonnenbrand auf dem Rücken tragen.</li></ul>",
      "bg": "<h2>Съвети</h2><ul><li><strong>Къде:</strong> в скалистите краища на заливите — там са рибите.</li><li><strong>Кога:</strong> сутрин, преди да се вдигне вятър, морето е по-спокойно и по-бистро. След вълнение водата има нужда от ден-два, за да се избистри.</li><li><strong>Екипировка:</strong> маска, шнорхел и обувки за вода заради морските таралежи.</li><li><strong>Безопасност:</strong> не плувайте сами, стойте далеч от лодки и носете тениска срещу слънцето на гърба.</li></ul>",
      "ru": "<h2>Советы</h2><ul><li><strong>Где:</strong> у скалистых краёв бухт — там держится рыба.</li><li><strong>Когда:</strong> утром, пока не поднялся ветер, море спокойнее и прозрачнее. После шторма воде нужно день-два, чтобы очиститься.</li><li><strong>Снаряжение:</strong> маска, трубка и обувь для воды из-за морских ежей.</li><li><strong>Безопасность:</strong> не плавайте в одиночку, держитесь подальше от лодок и надевайте футболку, чтобы не обгорела спина.</li></ul>",
      "ro": "<h2>Sfaturi</h2><ul><li><strong>Unde:</strong> la marginile stâncoase ale golfurilor — acolo sunt peștii.</li><li><strong>Când:</strong> dimineața, înainte să se pornească vântul, marea e mai liniștită și mai limpede. După valuri mari, apa are nevoie de o zi-două ca să se limpezească.</li><li><strong>Echipament:</strong> mască, tub și papuci de apă pentru aricii de mare.</li><li><strong>Siguranță:</strong> nu înota singur, ține-te departe de bărci și poartă un tricou ca să nu te arzi pe spate.</li></ul>",
      "sr": "<h2>Saveti</h2><ul><li><strong>Gde:</strong> na stenovitim krajevima uvala — tamo je riba.</li><li><strong>Kada:</strong> ujutru, pre nego što dune vetar, more je mirnije i bistrije. Posle nevremena vodi treba dan-dva da se izbistri.</li><li><strong>Oprema:</strong> maska, disaljka i obuća za vodu zbog morskih ježeva.</li><li><strong>Bezbednost:</strong> ne ronite sami, držite se dalje od čamaca i nosite majicu da ne izgorite po leđima.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Πού είναι τα καλύτερα σημεία;",
          "en": "Where are the best spots?",
          "de": "Wo sind die besten Stellen?",
          "bg": "Къде са най-добрите места?",
          "ru": "Где лучшие места?",
          "ro": "Unde sunt cele mai bune locuri?",
          "sr": "Gde su najbolja mesta?"
        },
        "a": {
          "el": "Στη Σιθωνία: οι Καβουρότρυπες, το Καρύδι, η Φάβα, το Καλαμίτσι και τα νησάκια γύρω από τον Διάπορο, όπου φτάνεις με βάρκα από τη Βουρβουρού.",
          "en": "In Sithonia: Kavourotripes, Karydi, Fava, Kalamitsi and the islets around Diaporos, reached by boat from Vourvourou.",
          "de": "Auf Sithonia: Kavourotripes, Karydi, Fava, Kalamitsi und die Inselchen um Diaporos, die man per Boot ab Vourvourou erreicht.",
          "bg": "В Ситония: Кавуротрипес, Кариди, Фава, Каламици и островчетата около Диапорос, до които се стига с лодка от Вурвуру.",
          "ru": "На Ситонии: Кавуротрипес, Кариди, Фава, Каламици и островки у Диапороса, куда добираются на лодке из Вурвуру.",
          "ro": "În Sithonia: Kavourotripes, Karydi, Fava, Kalamitsi și insulițele din jurul Diaporosului, unde ajungi cu barca din Vourvourou.",
          "sr": "Na Sitoniji: Kavurotripes, Karidi, Fava, Kalamici i ostrvca oko Diaporosa, do kojih se stiže čamcem iz Vurvurua."
        }
      },
      {
        "q": {
          "el": "Υπάρχουν επικίνδυνα ζώα;",
          "en": "Are there dangerous animals?",
          "de": "Gibt es gefährliche Tiere?",
          "bg": "Има ли опасни животни?",
          "ru": "Есть ли опасные животные?",
          "ro": "Există animale periculoase?",
          "sr": "Ima li opasnih životinja?"
        },
        "a": {
          "el": "Το πιο συνηθισμένο πρόβλημα είναι οι αχινοί στα βράχια· γι' αυτό τα παπούτσια θαλάσσης. Κάποια καλοκαίρια εμφανίζονται και μέδουσες.",
          "en": "The most common problem is sea urchins on the rocks, hence the water shoes. Some summers jellyfish appear too.",
          "de": "Das häufigste Problem sind Seeigel auf den Felsen, deshalb die Badeschuhe. In manchen Sommern tauchen auch Quallen auf.",
          "bg": "Най-честият проблем са морските таралежи по скалите — затова обувките за вода. Някои лета се появяват и медузи.",
          "ru": "Главная неприятность — морские ежи на камнях, отсюда обувь для воды. В некоторые годы появляются и медузы.",
          "ro": "Problema cea mai des întâlnită sunt aricii de mare de pe stânci, de aici papucii de apă. În unele veri apar și meduze.",
          "sr": "Najčešći problem su morski ježevi na stenama, otuda obuća za vodu. Nekih leta pojave se i meduze."
        }
      },
      {
        "q": {
          "el": "Χρειάζομαι δίπλωμα;",
          "en": "Do I need a certificate?",
          "de": "Brauche ich einen Schein?",
          "bg": "Трябва ли ми сертификат?",
          "ru": "Нужен ли сертификат?",
          "ro": "Am nevoie de brevet?",
          "sr": "Da li mi treba sertifikat?"
        },
        "a": {
          "el": "Όχι για snorkeling· αρκεί να ξέρεις κολύμπι. Για καταδύσεις με φιάλη δες τις <a href=\"/activities/scuba-diving-kassandra\">καταδύσεις</a>.",
          "en": "Not for snorkelling; being able to swim is enough. For scuba diving see <a href=\"/activities/scuba-diving-kassandra\">diving</a>.",
          "de": "Nicht zum Schnorcheln; schwimmen zu können reicht. Zum Gerätetauchen siehe <a href=\"/activities/scuba-diving-kassandra\">Tauchen</a>.",
          "bg": "Не за шнорхел — достатъчно е да можете да плувате. За гмуркане с бутилка вижте <a href=\"/activities/scuba-diving-kassandra\">гмуркане</a>.",
          "ru": "Для снорклинга нет — достаточно уметь плавать. Про дайвинг с аквалангом смотрите <a href=\"/activities/scuba-diving-kassandra\">дайвинг</a>.",
          "ro": "Nu pentru snorkeling; ajunge să știi să înoți. Pentru scufundări cu butelie vezi <a href=\"/activities/scuba-diving-kassandra\">scufundări</a>.",
          "sr": "Ne za ronjenje na dah; dovoljno je da znate da plivate. Za ronjenje s bocom pogledajte <a href=\"/activities/scuba-diving-kassandra\">ronjenje</a>."
        }
      }
    ]
  },
  "instagram-spots": {
    "intro": {
      "el": "<p>Τιρκουάζ νερά, λευκοί βράχοι, πευκοδάση και ο Άθως στον ορίζοντα: η Χαλκιδική είναι από τα πιο φωτογενή μέρη της βόρειας Ελλάδας. Η λίστα συγκεντρώνει τις παραλίες με τις πιο εντυπωσιακές εικόνες, από τις <a href=\"/beaches/portokali-sithonia\">Καβουρότρυπες</a> ως το ακρωτήριο του Ποσειδίου.</p>",
      "en": "<p>Turquoise water, white rocks, pine forests and Mount Athos on the horizon: Halkidiki is one of the most photogenic places in northern Greece. The list brings together the beaches with the most striking views, from <a href=\"/beaches/portokali-sithonia\">Kavourotripes</a> to Possidi cape.</p>",
      "de": "<p>Türkisfarbenes Wasser, weiße Felsen, Pinienwälder und der Athos am Horizont: Chalkidiki ist einer der fotogensten Orte Nordgriechenlands. Die Liste versammelt die Strände mit den eindrucksvollsten Ansichten, von <a href=\"/beaches/portokali-sithonia\">Kavourotripes</a> bis zum Kap Possidi.</p>",
      "bg": "<p>Тюркоазена вода, бели скали, борови гори и Атон на хоризонта: Халкидики е едно от най-фотогеничните места в Северна Гърция. Списъкът събира плажовете с най-впечатляващите гледки — от <a href=\"/beaches/portokali-sithonia\">Кавуротрипес</a> до нос Посиди.</p>",
      "ru": "<p>Бирюзовая вода, белые скалы, сосновые леса и Афон на горизонте: Халкидики — одно из самых фотогеничных мест Северной Греции. В списке — пляжи с самыми эффектными видами, от <a href=\"/beaches/portokali-sithonia\">Кавуротрипеса</a> до мыса Посиди.</p>",
      "ro": "<p>Apă turcoaz, stânci albe, păduri de pin și Athosul la orizont: Halkidiki e unul dintre cele mai fotogenice locuri din nordul Greciei. Lista adună plajele cu cele mai spectaculoase priveliști, de la <a href=\"/beaches/portokali-sithonia\">Kavourotripes</a> până la capul Possidi.</p>",
      "sr": "<p>Tirkizna voda, bele stene, borove šume i Atos na horizontu: Halkidiki je jedno od najfotogeničnijih mesta severne Grčke. Lista okuplja plaže sa najupečatljivijim prizorima, od <a href=\"/beaches/portokali-sithonia\">Kavurotripesa</a> do rta Posidi.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές φωτογραφίας</h2><ul><li><strong>Φως:</strong> νωρίς το πρωί και πριν τη δύση το φως είναι πιο μαλακό και οι παραλίες πιο άδειες.</li><li><strong>Πολωτικό φίλτρο:</strong> κόβει τις αντανακλάσεις και αναδεικνύει το χρώμα του νερού.</li><li><strong>Drone:</strong> ισχύουν οι κανόνες της ΕΕ· τα περισσότερα drones χρειάζονται εγγραφή, και απαγορεύονται πτήσεις πάνω από κόσμο. Έλεγξε πριν πετάξεις.</li><li><strong>Σεβασμός:</strong> ζήτα άδεια πριν φωτογραφίσεις ανθρώπους ή μέσα σε μαγαζιά.</li></ul>",
      "en": "<h2>Photo tips</h2><ul><li><strong>Light:</strong> early morning and before sunset the light is softer and the beaches emptier.</li><li><strong>Polarising filter:</strong> cuts reflections and brings out the colour of the water.</li><li><strong>Drones:</strong> EU rules apply; most drones need registration, and flying over people is not allowed. Check before you fly.</li><li><strong>Respect:</strong> ask before photographing people or inside shops and tavernas.</li></ul>",
      "de": "<h2>Fototipps</h2><ul><li><strong>Licht:</strong> Früh am Morgen und vor Sonnenuntergang ist das Licht weicher und die Strände leerer.</li><li><strong>Polfilter:</strong> nimmt Spiegelungen und betont die Wasserfarbe.</li><li><strong>Drohnen:</strong> Es gelten EU-Regeln; die meisten Drohnen müssen registriert werden, und Flüge über Menschen sind verboten. Vor dem Flug prüfen.</li><li><strong>Respekt:</strong> Frag, bevor du Menschen oder in Läden und Tavernen fotografierst.</li></ul>",
      "bg": "<h2>Съвети за снимки</h2><ul><li><strong>Светлина:</strong> рано сутрин и преди залез светлината е по-мека, а плажовете по-празни.</li><li><strong>Поляризационен филтър:</strong> маха отблясъците и подчертава цвета на водата.</li><li><strong>Дронове:</strong> важат правилата на ЕС; повечето дронове трябва да бъдат регистрирани, а полети над хора са забранени. Проверете, преди да летите.</li><li><strong>Уважение:</strong> питайте, преди да снимате хора или вътре в заведения.</li></ul>",
      "ru": "<h2>Советы по съёмке</h2><ul><li><strong>Свет:</strong> рано утром и перед закатом свет мягче, а пляжи свободнее.</li><li><strong>Поляризационный фильтр:</strong> убирает блики и подчёркивает цвет воды.</li><li><strong>Дроны:</strong> действуют правила ЕС; большинство дронов нужно регистрировать, полёты над людьми запрещены. Проверьте перед полётом.</li><li><strong>Уважение:</strong> спрашивайте разрешения, прежде чем снимать людей или внутри заведений.</li></ul>",
      "ro": "<h2>Sfaturi foto</h2><ul><li><strong>Lumina:</strong> dimineața devreme și înainte de apus lumina e mai blândă, iar plajele mai goale.</li><li><strong>Filtru polarizant:</strong> taie reflexiile și scoate în evidență culoarea apei.</li><li><strong>Drone:</strong> se aplică regulile UE; majoritatea dronelor trebuie înregistrate, iar zborul deasupra oamenilor e interzis. Verifică înainte să zbori.</li><li><strong>Respect:</strong> cere voie înainte să fotografiezi oameni sau în localuri.</li></ul>",
      "sr": "<h2>Saveti za fotografisanje</h2><ul><li><strong>Svetlo:</strong> rano ujutru i pred zalazak svetlo je mekše, a plaže praznije.</li><li><strong>Polarizacioni filter:</strong> uklanja odsjaje i ističe boju vode.</li><li><strong>Dronovi:</strong> važe pravila EU; većina dronova mora da se registruje, a letovi iznad ljudi su zabranjeni. Proverite pre leta.</li><li><strong>Poštovanje:</strong> pitajte pre nego što fotografišete ljude ili unutar lokala.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Ποιο είναι το πιο γνωστό σημείο;",
          "en": "What is the best-known spot?",
          "de": "Welcher Ort ist am bekanntesten?",
          "bg": "Кое е най-известното място?",
          "ru": "Какое место самое известное?",
          "ro": "Care e locul cel mai cunoscut?",
          "sr": "Koje je najpoznatije mesto?"
        },
        "a": {
          "el": "Οι Καβουρότρυπες στη Σιθωνία, με τους λευκούς βράχους και τα τιρκουάζ νερά.",
          "en": "Kavourotripes in Sithonia, with its white rocks and turquoise water.",
          "de": "Kavourotripes auf Sithonia mit seinen weißen Felsen und dem türkisfarbenen Wasser.",
          "bg": "Кавуротрипес в Ситония, с белите скали и тюркоазената вода.",
          "ru": "Кавуротрипес на Ситонии — белые скалы и бирюзовая вода.",
          "ro": "Kavourotripes, în Sithonia, cu stâncile albe și apa turcoaz.",
          "sr": "Kavurotripes na Sitoniji, sa belim stenama i tirkiznom vodom."
        }
      },
      {
        "q": {
          "el": "Πού για ηλιοβασίλεμα;",
          "en": "Where for sunset?",
          "de": "Wo zum Sonnenuntergang?",
          "bg": "Къде за залез?",
          "ru": "Где встречать закат?",
          "ro": "Unde pentru apus?",
          "sr": "Gde za zalazak sunca?"
        },
        "a": {
          "el": "Στις δυτικές ακτές: Ποσείδι και Σίβηρη στην Κασσάνδρα, Νέος Μαρμαράς και Πόρτο Κουφό στη Σιθωνία. Δες τα <a href=\"/guide/sunset-spots\">σημεία για ηλιοβασίλεμα</a>.",
          "en": "On the west coasts: Possidi and Siviri in Kassandra, Neos Marmaras and Porto Koufo in Sithonia. See the <a href=\"/guide/sunset-spots\">sunset spots</a>.",
          "de": "An den Westküsten: Possidi und Siviri auf Kassandra, Neos Marmaras und Porto Koufo auf Sithonia. Siehe die <a href=\"/guide/sunset-spots\">Sonnenuntergangsplätze</a>.",
          "bg": "На западните брегове: Посиди и Сивири в Касандра, Неос Мармарас и Порто Куфо в Ситония. Вижте <a href=\"/guide/sunset-spots\">местата за залез</a>.",
          "ru": "На западных побережьях: Посиди и Сивири на Кассандре, Неос Мармарас и Порто Куфо на Ситонии. Смотрите <a href=\"/guide/sunset-spots\">места для заката</a>.",
          "ro": "Pe coastele de vest: Possidi și Siviri în Kassandra, Neos Marmaras și Porto Koufo în Sithonia. Vezi <a href=\"/guide/sunset-spots\">locurile pentru apus</a>.",
          "sr": "Na zapadnim obalama: Posidi i Siviri na Kasandri, Neos Marmaras i Porto Kufo na Sitoniji. Pogledajte <a href=\"/guide/sunset-spots\">mesta za zalazak sunca</a>."
        }
      }
    ]
  },
  "kids-activities": {
    "intro": {
      "el": "<p>Πέρα από τις ρηχές παραλίες, η Χαλκιδική έχει αρκετά για παιδιά: το <a href=\"/activities/petralona-cave\">σπήλαιο των Πετραλώνων</a>, το Πάρκο του Αριστοτέλη στα Στάγειρα, εκδρομές με σκάφος και το <a href=\"/activities/kassandra-aquapark\">πλωτό πάρκο στη Σάνη</a>. Πολλά μεγάλα resorts έχουν παιδικούς ομίλους. Η λίστα συγκεντρώνει δραστηριότητες για οικογένειες.</p>",
      "en": "<p>Beyond the shallow beaches, Halkidiki has plenty for children: the <a href=\"/activities/petralona-cave\">Petralona Cave</a>, Aristotle Park in Stagira, boat trips and the <a href=\"/activities/kassandra-aquapark\">floating water park at Sani</a>. Many large resorts run kids' clubs. The list brings together activities for families.</p>",
      "de": "<p>Neben den flachen Stränden bietet Chalkidiki einiges für Kinder: die <a href=\"/activities/petralona-cave\">Höhle von Petralona</a>, den Aristoteles-Park in Stagira, Bootsausflüge und den <a href=\"/activities/kassandra-aquapark\">schwimmenden Wasserpark in Sani</a>. Viele große Resorts haben Kinderclubs. Die Liste versammelt Aktivitäten für Familien.</p>",
      "bg": "<p>Освен плитките плажове Халкидики има доста за деца: <a href=\"/activities/petralona-cave\">пещерата Петралона</a>, Парка на Аристотел в Стагира, разходки с лодка и <a href=\"/activities/kassandra-aquapark\">плаващия воден парк в Сани</a>. Много големи курорти имат детски клубове. Списъкът събира занимания за семейства.</p>",
      "ru": "<p>Помимо мелководных пляжей, на Халкидиках немало занятий для детей: <a href=\"/activities/petralona-cave\">пещера Петралона</a>, парк Аристотеля в Стагире, морские прогулки и <a href=\"/activities/kassandra-aquapark\">плавучий аквапарк в Сани</a>. Во многих крупных отелях есть детские клубы. В списке — развлечения для семей.</p>",
      "ro": "<p>Dincolo de plajele cu apă mică, Halkidiki are destule pentru copii: <a href=\"/activities/petralona-cave\">peștera Petralona</a>, Parcul lui Aristotel din Stagira, plimbări cu barca și <a href=\"/activities/kassandra-aquapark\">parcul acvatic plutitor de la Sani</a>. Multe stațiuni mari au cluburi pentru copii. Lista adună activități pentru familii.</p>",
      "sr": "<p>Osim plitkih plaža, Halkidiki ima dosta toga za decu: <a href=\"/activities/petralona-cave\">pećinu Petralona</a>, Aristotelov park u Stagiri, izlete brodom i <a href=\"/activities/kassandra-aquapark\">plutajući akva park u Saniju</a>. Mnoga velika letovališta imaju klubove za decu. Lista okuplja aktivnosti za porodice.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές</h2><ul><li><strong>Πρόγραμμα:</strong> θάλασσα το πρωί, δραστηριότητα το απόγευμα, νωρίς φαγητό.</li><li><strong>Ήλιος:</strong> υψηλή αντηλιακή προστασία, καπέλο και σκίαστρο παραλίας.</li><li><strong>Υδάτινο πάρκο:</strong> το Waterland είναι κοντά στη Θεσσαλονίκη, περίπου μία ώρα από την Κασσάνδρα.</li><li><strong>Ταβέρνες:</strong> είναι φιλικές με τα παιδιά, και σχεδόν παντού υπάρχουν πατάτες, μακαρόνια και πίτες.</li></ul><p>Δες και τον <a href=\"/blog/halkidiki-with-kids-complete-guide\">οδηγό για οικογένειες</a>.</p>",
      "en": "<h2>Tips</h2><ul><li><strong>Plan:</strong> the sea in the morning, an activity in the afternoon, an early dinner.</li><li><strong>Sun:</strong> high-factor sunscreen, a hat and a beach shelter.</li><li><strong>Water park:</strong> Waterland is near Thessaloniki, about an hour from Kassandra.</li><li><strong>Tavernas:</strong> they're child-friendly, and chips, pasta and pies are on almost every menu.</li></ul><p>See also the <a href=\"/blog/halkidiki-with-kids-complete-guide\">guide for families</a>.</p>",
      "de": "<h2>Tipps</h2><ul><li><strong>Tagesplan:</strong> morgens Meer, nachmittags eine Aktivität, früh zu Abend essen.</li><li><strong>Sonne:</strong> hoher Lichtschutzfaktor, Hut und Strandmuschel.</li><li><strong>Wasserpark:</strong> Waterland liegt bei Thessaloniki, etwa eine Stunde von Kassandra.</li><li><strong>Tavernen:</strong> sind kinderfreundlich, und Pommes, Nudeln und Pitas stehen fast überall auf der Karte.</li></ul><p>Siehe auch den <a href=\"/blog/halkidiki-with-kids-complete-guide\">Ratgeber für Familien</a>.</p>",
      "bg": "<h2>Съвети</h2><ul><li><strong>План:</strong> море сутрин, занимание следобед, ранна вечеря.</li><li><strong>Слънце:</strong> висок защитен фактор, шапка и плажна палатка.</li><li><strong>Воден парк:</strong> Waterland е близо до Солун, на около час от Касандра.</li><li><strong>Таверни:</strong> приветливи са към децата, а картофки, макарони и баници има почти навсякъде.</li></ul><p>Вижте и <a href=\"/blog/halkidiki-with-kids-complete-guide\">пътеводителя за семейства</a>.</p>",
      "ru": "<h2>Советы</h2><ul><li><strong>План:</strong> утром море, после обеда — развлечение, ранний ужин.</li><li><strong>Солнце:</strong> крем с высоким фактором, панамка и пляжный тент.</li><li><strong>Аквапарк:</strong> Waterland — рядом с Салониками, примерно в часе от Кассандры.</li><li><strong>Таверны:</strong> рады детям, а картошка, макароны и пироги есть почти везде.</li></ul><p>Смотрите также <a href=\"/blog/halkidiki-with-kids-complete-guide\">гид для семей</a>.</p>",
      "ro": "<h2>Sfaturi</h2><ul><li><strong>Program:</strong> marea dimineața, o activitate după-amiaza, cina devreme.</li><li><strong>Soarele:</strong> factor de protecție mare, pălărie și cort de plajă.</li><li><strong>Parc acvatic:</strong> Waterland e lângă Salonic, la circa o oră de Kassandra.</li><li><strong>Taverne:</strong> primesc bine copiii, iar cartofi, paste și plăcinte găsești aproape peste tot.</li></ul><p>Vezi și <a href=\"/blog/halkidiki-with-kids-complete-guide\">ghidul pentru familii</a>.</p>",
      "sr": "<h2>Saveti</h2><ul><li><strong>Plan:</strong> ujutru more, popodne aktivnost, rana večera.</li><li><strong>Sunce:</strong> visok zaštitni faktor, šešir i šator za plažu.</li><li><strong>Akva park:</strong> Waterland je blizu Soluna, oko sat vremena od Kasandre.</li><li><strong>Taverne:</strong> prijateljski su nastrojene prema deci, a pomfrit, testenina i pite ima gotovo svuda.</li></ul><p>Pogledajte i <a href=\"/blog/halkidiki-with-kids-complete-guide\">vodič za porodice</a>.</p>"
    },
    "faqs": [
      {
        "q": {
          "el": "Ποια χερσόνησος είναι καλύτερη για παιδιά;",
          "en": "Which peninsula is best for children?",
          "de": "Welche Halbinsel ist für Kinder am besten?",
          "bg": "Кой полуостров е най-добър за деца?",
          "ru": "Какой полуостров лучше для детей?",
          "ro": "Care peninsulă e cea mai bună pentru copii?",
          "sr": "Koje poluostrvo je najbolje za decu?"
        },
        "a": {
          "el": "Η Κασσάνδρα έχει μικρότερες αποστάσεις και περισσότερες υποδομές· η Σιθωνία είναι πιο ήσυχη, με ρηχές παραλίες όπως στη Βουρβουρού και τη Νικήτη.",
          "en": "Kassandra has shorter distances and more facilities; Sithonia is quieter, with shallow beaches such as in Vourvourou and Nikiti.",
          "de": "Kassandra hat kürzere Wege und mehr Infrastruktur; Sithonia ist ruhiger, mit flachen Stränden etwa in Vourvourou und Nikiti.",
          "bg": "Касандра има по-кратки разстояния и повече удобства; Ситония е по-спокойна, с плитки плажове като във Вурвуру и Никити.",
          "ru": "На Кассандре расстояния короче и больше инфраструктуры; Ситония спокойнее, с мелкими пляжами, например в Вурвуру и Никити.",
          "ro": "Kassandra are distanțe mai scurte și mai multe facilități; Sithonia e mai liniștită, cu plaje cu apă mică, ca la Vourvourou și Nikiti.",
          "sr": "Kasandra ima kraće razdaljine i više sadržaja; Sitonija je mirnija, sa plitkim plažama kao u Vurvuruu i Nikitiju."
        }
      },
      {
        "q": {
          "el": "Πού είναι οι πιο ρηχές παραλίες;",
          "en": "Where are the shallowest beaches?",
          "de": "Wo sind die flachsten Strände?",
          "bg": "Къде са най-плитките плажове?",
          "ru": "Где самые мелкие пляжи?",
          "ro": "Unde sunt plajele cu apa cea mai mică?",
          "sr": "Gde su najpliće plaže?"
        },
        "a": {
          "el": "Δες τη λίστα με τις <a href=\"/blog/best-beaches-shallow-water\">παραλίες με ρηχά νερά</a>.",
          "en": "See the list of <a href=\"/blog/best-beaches-shallow-water\">beaches with shallow water</a>.",
          "de": "Siehe die Liste der <a href=\"/blog/best-beaches-shallow-water\">Strände mit flachem Wasser</a>.",
          "bg": "Вижте списъка с <a href=\"/blog/best-beaches-shallow-water\">плажове с плитка вода</a>.",
          "ru": "Смотрите список <a href=\"/blog/best-beaches-shallow-water\">пляжей с мелкой водой</a>.",
          "ro": "Vezi lista <a href=\"/blog/best-beaches-shallow-water\">plajelor cu apă mică</a>.",
          "sr": "Pogledajte listu <a href=\"/blog/best-beaches-shallow-water\">plaža sa plitkom vodom</a>."
        }
      }
    ]
  },
  "romantic-getaways": {
    "intro": {
      "el": "<p>Η Χαλκιδική είναι ιδανική για ρομαντική απόδραση χωρίς πλοίο — πηγαίνετε και έρχεστε με το αυτοκίνητο. Boutique ξενοδοχεία με σουίτες με θέα, ήσυχες παραλίες, δείπνα δίπλα στο νερό και spa υπάρχουν όλα εδώ. Τα πιο ρομαντικά σημεία: η <strong>Σιθωνία</strong> για τη φύση (τα νησάκια της Βουρβουρούς, τα ηλιοβασιλέματα της δυτικής ακτής), η <strong>Άφυτος</strong> για ένα πέτρινο χωριό πάνω από τη θάλασσα και η <strong>Ουρανούπολη</strong> για τη θέα στο Άγιο Όρος. Η λίστα συγκεντρώνει τις καλύτερες επιλογές για ζευγάρια και μήνα του μέλιτος.</p>",
      "en": "<p>Halkidiki is ideal for a romantic break without a ferry — you drive in and out. Boutique hotels with sea-view suites, quiet beaches, dinners by the water and spa treatments are all here. The most romantic spots: <strong>Sithonia</strong> for natural beauty (the islets of Vourvourou, the sunsets of the west coast), <strong>Afytos</strong> for a stone village above the sea, and <strong>Ouranoupoli</strong> for the views of Mount Athos. This list collects the top picks for couples and honeymooners.</p>",
      "de": "<p>Chalkidiki ist ideal für eine romantische Auszeit ohne Fähre — man fährt mit dem Auto hin und zurück. Boutique-Hotels mit Meerblick-Suiten, ruhige Strände, Abendessen am Wasser und Spa — alles ist da. Die romantischsten Orte: <strong>Sithonia</strong> für die Natur (die Inselchen von Vourvourou, die Sonnenuntergänge an der Westküste), <strong>Afytos</strong> als Steindorf über dem Meer und <strong>Ouranoupoli</strong> mit Blick auf den Athos. Diese Liste sammelt die besten Tipps für Paare und Flitterwochen.</p>",
      "ro": "<p>Halkidiki este ideal pentru o escapadă romantică fără feribot — veniți și plecați cu mașina. Hoteluri boutique cu apartamente cu vedere la mare, plaje liniștite, cine lângă apă și spa — toate sunt aici. Cele mai romantice locuri: <strong>Sithonia</strong> pentru natură (insulițele de la Vourvourou, apusurile de pe coasta de vest), <strong>Afytos</strong>, un sat de piatră deasupra mării, și <strong>Ouranoupoli</strong>, cu priveliști spre Muntele Athos. Lista adună cele mai bune alegeri pentru cupluri și luna de miere.</p>",
      "sr": "<p>Halkidiki je idealan za romantičan beg bez trajekta — dolazite i odlazite kolima. Butik hoteli s apartmanima s pogledom na more, mirne plaže, večere uz vodu i spa — sve je tu. Najromantičnija mesta: <strong>Sitonija</strong> zbog prirode (ostrvca kod Vurvurua, zalasci sunca na zapadnoj obali), <strong>Afitos</strong>, kameno selo iznad mora, i <strong>Uranupolis</strong> s pogledom na Svetu Goru. Lista okuplja najbolje izbore za parove i medeni mesec.</p>",
      "bg": "<p>Халкидики е идеална за романтично бягство без ферибот — пристигате и тръгвате с кола. Бутик хотели със сюити с гледка, тихи плажове, вечери край водата и спа — всичко е тук. Най-романтичните места: <strong>Ситония</strong> заради природата (островчетата при Вурвуру, залезите по западния бряг), <strong>Афитос</strong> — каменно село над морето, и <strong>Уранополи</strong> с гледката към Света гора. Списъкът събира най-добрите предложения за двойки и меден месец.</p>",
      "ru": "<p>Халкидики идеальна для романтического отдыха без парома — приезжаете и уезжаете на машине. Бутик-отели с сьютами с видом, тихие пляжи, ужины у воды и спа — всё здесь. Самые романтичные места: <strong>Ситония</strong> с её природой (островки у Вурвуру, закаты на западном берегу), <strong>Афитос</strong> — каменная деревня над морем, и <strong>Уранополис</strong> с видом на Афон. В список вошли лучшие варианты для пар и молодожёнов.</p>"
    },
    "seasonal": {
      "el": "<h2>Πότε για romantic break</h2><p><strong>Μάιος-Ιούνιος:</strong> Ιδανικό — δροσερά απογεύματα, λουλούδια ανθίζουν, λίγος κόσμος, καλές τιμές. <strong>Σεπτέμβριος:</strong> Equally ideal — ζεστή θάλασσα, λιγότερος κόσμος, sunset δείπνα στα terraces. <strong>Καλοκαίρι:</strong> Pricey, busy. <strong>Χειμώνας:</strong> Cosy alternative — fireplace cabins, παραδοσιακά χωριά με fireplaces, λιγότερα ανοιχτά εστιατόρια.</p>",
      "en": "<h2>When for a romantic break</h2><p><strong>May-June:</strong> Ideal — cool afternoons, flowers blooming, fewer crowds, better prices. <strong>September:</strong> Equally ideal — warm sea, fewer crowds, sunset dinners on terraces. <strong>Summer:</strong> Pricey, busy. <strong>Winter:</strong> Cosy alternative — fireplace cabins, traditional villages, but fewer open restaurants.</p>",
      "de": "<h2>Wann für eine romantische Auszeit</h2><p><strong>Mai-Juni:</strong> Ideal – kühle Abende, blühende Blumen, wenig Menschen, gute Preise. <strong>September:</strong> Ebenso ideal – warmes Meer, weniger Menschen, Abendessen bei Sonnenuntergang auf Terrassen. <strong>Sommer:</strong> Teuer, voll. <strong>Winter:</strong> Gemütliche Alternative – Hütten mit Kamin, traditionelle Dörfer mit Kaminen, weniger geöffnete Restaurants.</p>",
      "ro": "<h2>Când să mergi pentru o escapadă romantică</h2><p><strong>Mai-Iunie:</strong> Ideal — după-amiezi răcoroase, flori în floare, puțină lume, prețuri bune. <strong>Septembrie:</strong> La fel de ideal — mare caldă, mai puțină lume, cine la apus pe terase. <strong>Vara:</strong> Scump, aglomerat. <strong>Iarna:</strong> Alternativă confortabilă — cabane cu șemineu, sate tradiționale cu șemineuri, mai puține restaurante deschise.</p>",
      "sr": "<h2>Kada za romantični odmor</h2><p><strong>Maj-jun:</strong> Idealno — sveže večeri, cveće cveta, malo ljudi, dobre cene. <strong>Septembar:</strong> Podjednako idealno — toplo more, manje gužve, večere uz zalazak sunca na terasama. <strong>Leto:</strong> Skupo, gužva. <strong>Zima:</strong> Ugodna alternativa — kabine s kaminom, tradicionalna sela s kaminima, manje otvorenih restorana.</p>",
      "bg": "<h2>Кога за романтична почивка</h2><p><strong>Май-Юни:</strong> Идеално — прохладни следобеди, цъфтящи цветя, малко хора, добри цени. <strong>Септември:</strong> Също толкова идеално — топло море, по-малко хора, вечеря на залез на терасите. <strong>Лято:</strong> Скъпо, натоварено. <strong>Зима:</strong> Уютна алтернатива — кабини с камини, традиционни села с камини, по-малко отворени ресторанти.</p>",
      "ru": "<h2>Когда поехать на романтический отдых</h2><p><strong>Май-июнь:</strong> Идеально — прохладные вечера, цветущие цветы, мало людей, хорошие цены. <strong>Сентябрь:</strong> Также идеально — теплая вода, меньше людей, ужины на закате на террасах. <strong>Лето:</strong> Дорого, многолюдно. <strong>Зима:</strong> Уютная альтернатива — домики с каминами, традиционные деревни с каминами, меньше открытых ресторанов.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές για ζευγάρια</h2><ul><li><strong>Κράτηση 3-6 μήνες πριν:</strong> Τα κορυφαία boutique hotels (Νέος Μαρμαράς, Σάνη, Άφυτος) γεμίζουν νωρίς για peak season.</li><li><strong>Επιπλέον επιλογές:</strong> Σε resorts (Σάνη, Ekies) μπορείς να ζητήσεις champagne welcome, rose petals, special dinner — δωρεάν συνήθως.</li><li><strong>Day trips:</strong> Day cruise από Νέο Μαρμαρά (€80-150/couple για 4-6 ώρες με γεύμα). Sunset cruise από Ουρανούπολη.</li><li><strong>Δείπνα:</strong> Δες <a href=\"/best/romantic-restaurants\">ρομαντικά εστιατόρια</a> για sunset views.</li><li><strong>Spa:</strong> Πολλά resorts έχουν couples treatments. Mediterranean massage €70-150.</li><li><strong>Off the beaten path:</strong> Πιο ρομαντική εμπειρία: μικρό boutique guest house σε παραδοσιακό χωριό αντί για mega resort.</li></ul>",
      "en": "<h2>Couples tips</h2><ul><li><strong>Book 3-6 months ahead:</strong> Top boutique hotels (Neos Marmaras, Sani, Afytos) fill up early for peak season.</li><li><strong>Extras:</strong> At resorts (Sani, Ekies) you can request champagne welcome, rose petals, special dinner — usually free.</li><li><strong>Day trips:</strong> Day cruise from Neos Marmaras (€80-150/couple for 4-6 hours with lunch). Sunset cruise from Ouranoupoli.</li><li><strong>Dinners:</strong> See our <a href=\"/best/romantic-restaurants\">romantic restaurants</a> for sunset views.</li><li><strong>Spa:</strong> Many resorts have couples treatments. Mediterranean massage €70-150.</li><li><strong>Off the beaten path:</strong> A small boutique guest house in a traditional village is more romantic than a mega resort.</li></ul>",
      "de": "<h2>Tipps für Paare</h2><ul><li><strong>3-6 Monate im Voraus buchen:</strong> Die besten Boutique-Hotels (Neos Marmaras, Sani, Afytos) sind früh ausgebucht für die Hauptsaison.</li><li><strong>Zusätzliche Optionen:</strong> In Resorts (Sani, Ekies) kann man nach einem Champagner-Empfang, Rosenblättern, speziellem Abendessen fragen – meist kostenlos.</li><li><strong>Tagesausflüge:</strong> Tageskreuzfahrt von Neos Marmaras (€80-150/Paar für 4-6 Stunden mit Mahlzeit). Sonnenuntergangskreuzfahrt von Ouranoupoli.</li><li><strong>Abendessen:</strong> Siehe <a href=\"/best/romantic-restaurants\">romantische Restaurants</a> für Sonnenuntergangsblick.</li><li><strong>Spa:</strong> Viele Resorts bieten Behandlungen für Paare an. Mediterrane Massage €70-150.</li><li><strong>Abseits der ausgetretenen Pfade:</strong> Romantischere Erfahrung: kleines Boutique-Gästehaus in einem traditionellen Dorf statt Mega-Resort.</li></ul>",
      "ro": "<h2>Sfaturi pentru cupluri</h2><ul><li><strong>Rezervare cu 3-6 luni înainte:</strong> Cele mai bune hoteluri boutique (Neos Marmaras, Sani, Afytos) se umplu devreme pentru sezonul de vârf.</li><li><strong>Opțiuni suplimentare:</strong> În resorturi (Sani, Ekies) poți solicita champagne welcome, petale de trandafir, cină specială — de obicei gratuit.</li><li><strong>Excursii de o zi:</strong> Croazieră de o zi din Neos Marmaras (€80-150/cuplu pentru 4-6 ore cu masă). Croazieră la apus din Ouranoupoli.</li><li><strong>Cine:</strong> Vezi <a href=\"/best/romantic-restaurants\">restaurante romantice</a> pentru vederi la apus.</li><li><strong>Spa:</strong> Multe resorturi oferă tratamente pentru cupluri. Masaj mediteranean €70-150.</li><li><strong>Off the beaten path:</strong> Experiență mai romantică: mică pensiune boutique într-un sat tradițional în loc de mega resort.</li></ul>",
      "sr": "<h2>Saveti za parove</h2><ul><li><strong>Rezervacija 3-6 meseci unapred:</strong> Najbolji boutique hoteli (Neos Marmaras, Sani, Afytos) brzo se popune za vrhunac sezone.</li><li><strong>Dodatne opcije:</strong> U rizortima (Sani, Ekies) možete tražiti šampanjac dobrodošlice, latice ruža, posebnu večeru — obično besplatno.</li><li><strong>Izleti:</strong> Dnevni krstarenje iz Neos Marmarasa (€80-150/par za 4-6 sati s obrokom). Krstarenje uz zalazak sunca iz Ouranoupolija.</li><li><strong>Večere:</strong> Pogledajte <a href=\"/best/romantic-restaurants\">romantične restorane</a> za poglede na zalazak sunca.</li><li><strong>Spa:</strong> Mnogi rizorti nude tretmane za parove. Mediteranska masaža €70-150.</li><li><strong>Van utabanih staza:</strong> Romantičnije iskustvo: mali boutique guest house u tradicionalnom selu umesto mega rizorta.</li></ul>",
      "bg": "<h2>Съвети за двойки</h2><ul><li><strong>Резервация 3-6 месеца предварително:</strong> Най-добрите бутик хотели (Неос Мармарас, Сани, Афитос) се запълват рано за пиковия сезон.</li><li><strong>Допълнителни опции:</strong> В курорти (Сани, Ekies) можете да поискате шампанско за добре дошли, розови листенца, специална вечеря — обикновено безплатно.</li><li><strong>Еднодневни екскурзии:</strong> Еднодневен круиз от Неос Мармарас (€80-150/двойка за 4-6 часа с обяд). Круиз на залез от Уранополи.</li><li><strong>Вечери:</strong> Вижте <a href=\"/best/romantic-restaurants\">романтични ресторанти</a> за гледки на залез.</li><li><strong>Спа:</strong> Много курорти предлагат процедури за двойки. Средиземномасаж €70-150.</li><li><strong>Извън утъпканите пътеки:</strong> По-романтично преживяване: малка бутик къща за гости в традиционно село вместо мега курорт.</li></ul>",
      "ru": "<h2>Советы для пар</h2><ul><li><strong>Бронирование за 3-6 месяцев:</strong> Лучшие бутик-отели (Неос Мармарас, Сани, Афитос) заполняются рано в пиковый сезон.</li><li><strong>Дополнительные опции:</strong> В курортах (Сани, Ekies) можно заказать приветствие с шампанским, лепестки роз, специальный ужин — обычно бесплатно.</li><li><strong>Однодневные поездки:</strong> Круиз на день из Нео Мармараса (€80-150/пара за 4-6 часов с обедом). Круиз на закате из Уранополис.</li><li><strong>Ужины:</strong> Посмотрите <a href=\"/best/romantic-restaurants\">романтические рестораны</a> с видами на закат.</li><li><strong>Спа:</strong> Многие курорты предлагают процедуры для пар. Средиземноморский массаж €70-150.</li><li><strong>Вдали от проторенных дорог:</strong> Более романтичный опыт: небольшой бутик-гостевой дом в традиционной деревне вместо мега-курорта.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Καλύτερο μέρος για honeymoon;",
          "en": "Best for a honeymoon?",
          "de": "Bester Ort für Flitterwochen?",
          "ro": "Cel mai bun loc pentru luna de miere?",
          "sr": "Najbolje mesto za medeni mesec?",
          "bg": "Най-доброто място за меден месец?",
          "ru": "Лучшее место для медового месяца?"
        },
        "a": {
          "el": "<strong>Σιθωνία</strong> για φυσικά απομονωμένη εμπειρία — boutique hotels με sea view, ιδιωτικές παραλίες. <strong>Σάνη/Καλλιθέα</strong> Κασσάνδρας για 5* luxury experience.",
          "en": "<strong>Sithonia</strong> for naturally secluded experience — boutique hotels with sea views, private beaches. <strong>Sani/Kallithea</strong> in Kassandra for 5* luxury experience.",
          "de": "<strong>Sithonia</strong> für eine natürlich abgeschiedene Erfahrung – Boutique-Hotels mit Meerblick, private Strände. <strong>Sani/Kallithea</strong> auf Kassandra für 5* Luxus-Erlebnis.",
          "ro": "<strong>Sithonia</strong> pentru o experiență natural izolată — hoteluri boutique cu vedere la mare, plaje private. <strong>Sani/Kallithea</strong> în Kassandra pentru o experiență de lux de 5*.",
          "sr": "<strong>Sithonia</strong> za prirodno izolovano iskustvo — boutique hoteli s pogledom na more, privatne plaže. <strong>Sani/Kallithea</strong> na Kasandri za luksuzno iskustvo s 5 zvezdica.",
          "bg": "<strong>Ситония</strong> за естествено изолирано преживяване — бутик хотели с изглед към морето, частни плажове. <strong>Сани/Калитея</strong> на Касандра за 5* луксозно преживяване.",
          "ru": "<strong>Ситония</strong> для естественно уединенного отдыха — бутик-отели с видом на море, частные пляжи. <strong>Сани/Калитея</strong> на Кассандре для 5* роскошного отдыха."
        }
      },
      {
        "q": {
          "el": "Κόστος για 7 βραδινά honeymoon;",
          "en": "Cost for a 7-night honeymoon?",
          "de": "Kosten für 7 Nächte Flitterwochen?",
          "ro": "Costul pentru 7 nopți de luna de miere?",
          "sr": "Trošak za 7 noći medenog meseca?",
          "bg": "Цена за 7 нощувки за меден месец?",
          "ru": "Стоимость 7-дневного медового месяца?"
        },
        "a": {
          "el": "<strong>Mid-luxury:</strong> €1500-3000/couple για 7 βραδιές με δείπνα. <strong>Premium:</strong> €3000-6000+ σε resorts όπως Σάνη ή Ekies.",
          "en": "<strong>Mid-luxury:</strong> €1500-3000/couple for 7 nights with dinners. <strong>Premium:</strong> €3000-6000+ at resorts like Sani or Ekies.",
          "de": "<strong>Mittelklasse-Luxus:</strong> €1500-3000/Paar für 7 Nächte mit Abendessen. <strong>Premium:</strong> €3000-6000+ in Resorts wie Sani oder Ekies.",
          "ro": "<strong>Mid-luxury:</strong> €1500-3000/cuplu pentru 7 nopți cu cine. <strong>Premium:</strong> €3000-6000+ în resorturi precum Sani sau Ekies.",
          "sr": "<strong>Srednji luksuz:</strong> €1500-3000/par za 7 noći s večerama. <strong>Premium:</strong> €3000-6000+ u rizortima kao što su Sani ili Ekies.",
          "bg": "<strong>Среден лукс:</strong> €1500-3000/двойка за 7 нощувки с вечери. <strong>Премиум:</strong> €3000-6000+ в курорти като Сани или Ekies.",
          "ru": "<strong>Средний уровень:</strong> €1500-3000/пара за 7 ночей с ужинами. <strong>Премиум:</strong> €3000-6000+ в курортах, таких как Сани или Ekies."
        }
      },
      {
        "q": {
          "el": "Υπάρχουν private beaches;",
          "en": "Are there private beaches?",
          "de": "Gibt es private Strände?",
          "ro": "Există plaje private?",
          "sr": "Postoje li privatne plaže?",
          "bg": "Има ли частни плажове?",
          "ru": "Есть ли частные пляжи?"
        },
        "a": {
          "el": "Νομικά όχι — όλες οι ακτές είναι δημόσιες. Στην πράξη, resorts όπως η Σάνη έχουν παραλίες που λειτουργούν \"ιδιωτικά\" λόγω αποκλειστικής πρόσβασης από το hotel.",
          "en": "Legally no — all coast is public. In practice, resorts like Sani have beaches that operate \"privately\" thanks to exclusive hotel access.",
          "de": "Rechtlich nein – alle Küsten sind öffentlich. In der Praxis haben Resorts wie Sani Strände, die aufgrund des exklusiven Zugangs vom Hotel \"privat\" funktionieren.",
          "ro": "Legal nu — toate țărmurile sunt publice. În practică, resorturi precum Sani au plaje care funcționează \"privat\" datorită accesului exclusiv din hotel.",
          "sr": "Pravno ne — sve obale su javne. U praksi, rizorti kao što je Sani imaju plaže koje funkcionišu \"privatno\" zbog ekskluzivnog pristupa iz hotela.",
          "bg": "Юридически не — всички брегове са обществени. На практика, курорти като Сани имат плажове, които функционират \"частно\" поради изключителен достъп от хотела.",
          "ru": "Юридически нет — все побережья общественные. На практике, курорты, такие как Сани, имеют пляжи, которые функционируют как \"частные\" из-за эксклюзивного доступа от отеля."
        }
      }
    ]
  },
  "luxury-hotels": {
    "intro": {
      "el": "<p>Η Χαλκιδική έχει μερικά από τα πιο γνωστά πολυτελή θέρετρα της Ελλάδας — Sani Resort, τα θέρετρα Ikos, Eagles Palace, Ekies All Senses. Είναι ολοκληρωμένες εμπειρίες: παραλίες για τους πελάτες, fine dining, spa, παιδικά clubs και δραστηριότητες. Πολλά βρίσκονται στην <strong>Κασσάνδρα</strong> (Σάνη, Καλλιθέα) και γύρω από τις εισόδους Κασσάνδρας και Σιθωνίας, με boutique επιλογές στη <strong>Σιθωνία</strong> (Βουρβουρού, Νέος Μαρμαράς) και στην <strong>Ουρανούπολη</strong>. Η λίστα συγκεντρώνει πολυτελή καταλύματα με σταθερά κορυφαίες βαθμολογίες.</p>",
      "en": "<p>Halkidiki has some of Greece's best-known luxury resorts — Sani Resort, the Ikos resorts, Eagles Palace, Ekies All Senses. They are complete experiences: beaches reserved for guests, fine dining, spas, kids clubs and activities. Many are in <strong>Kassandra</strong> (Sani, Kallithea) and around the entrances to Kassandra and Sithonia, with boutique options in <strong>Sithonia</strong> (Vourvourou, Neos Marmaras) and at <strong>Ouranoupoli</strong>. This list collects premium accommodation with consistently top ratings.</p>",
      "de": "<p>Chalkidiki hat einige der bekanntesten Luxusresorts Griechenlands — Sani Resort, die Ikos-Resorts, Eagles Palace, Ekies All Senses. Es sind Komplettangebote: Strände für Gäste, Fine Dining, Spa, Kinderclubs und Aktivitäten. Viele liegen auf <strong>Kassandra</strong> (Sani, Kallithea) und an den Zugängen zu Kassandra und Sithonia, Boutique-Häuser gibt es auf <strong>Sithonia</strong> (Vourvourou, Neos Marmaras) und in <strong>Ouranoupoli</strong>. Diese Liste sammelt Premium-Unterkünfte mit durchweg Bestbewertungen.</p>",
      "ro": "<p>Halkidiki are unele dintre cele mai cunoscute resorturi de lux din Grecia — Sani Resort, resorturile Ikos, Eagles Palace, Ekies All Senses. Sunt experiențe complete: plaje pentru oaspeți, restaurante rafinate, spa, cluburi pentru copii și activități. Multe se află în <strong>Kassandra</strong> (Sani, Kallithea) și la intrările în Kassandra și Sithonia, iar variantele boutique sunt în <strong>Sithonia</strong> (Vourvourou, Neos Marmaras) și la <strong>Ouranoupoli</strong>. Lista adună cazări premium cu note constant de top.</p>",
      "sr": "<p>Halkidiki ima neke od najpoznatijih luksuznih rizorta u Grčkoj — Sani Resort, rizorte Ikos, Eagles Palace, Ekies All Senses. To su celovita iskustva: plaže za goste, vrhunska kuhinja, spa, klubovi za decu i aktivnosti. Mnogi su na <strong>Kasandri</strong> (Sani, Kalitea) i oko ulaza na Kasandru i Sitoniju, a butik izbori su na <strong>Sitoniji</strong> (Vurvuru, Neos Marmaras) i u <strong>Uranupolisu</strong>. Lista okuplja premium smeštaj s dosledno vrhunskim ocenama.</p>",
      "bg": "<p>Халкидики има някои от най-известните луксозни курорти в Гърция — Sani Resort, курортите Ikos, Eagles Palace, Ekies All Senses. Те са цялостно преживяване: плажове за гостите, изискана кухня, спа, детски клубове и занимания. Много от тях са в <strong>Касандра</strong> (Сани, Калитея) и около входовете на Касандра и Ситония, а бутик вариантите са в <strong>Ситония</strong> (Вурвуру, Неос Мармарас) и в <strong>Уранополи</strong>. Списъкът събира луксозни места за настаняване с постоянно високи оценки.</p>",
      "ru": "<p>На Халкидики одни из самых известных роскошных курортов Греции — Sani Resort, курорты Ikos, Eagles Palace, Ekies All Senses. Это целые миры: пляжи для гостей, высокая кухня, спа, детские клубы и развлечения. Многие находятся на <strong>Кассандре</strong> (Сани, Калитея) и у въездов на Кассандру и Ситонию, бутик-отели — на <strong>Ситонии</strong> (Вурвуру, Неос Мармарас) и в <strong>Уранополисе</strong>. В список вошли премиальные отели с неизменно высокими оценками.</p>"
    },
    "seasonal": {
      "el": "<h2>Πότε να κρατήσεις</h2><p><strong>Peak season (Ιούλιος-Αύγουστος):</strong> Κρατήσεις 6-12 μήνες πριν για τα top resorts. <strong>Shoulder (Μάιος-Ιούνιος, Σεπτέμβριος):</strong> Καλύτερη value — όλες οι υπηρεσίες ανοιχτές, τιμές 20-30% κάτω. <strong>Σεπτέμβριος:</strong> sweet spot για honeymoon — λιγότερα παιδιά, ζεστή θάλασσα. <strong>Off-season (Νοέμβριος-Μάρτιος):</strong> Πολλά κλειστά, εκτός από Σάνη και κάποια all-year.</p>",
      "en": "<h2>When to book</h2><p><strong>Peak season (July-August):</strong> Book 6-12 months ahead at top resorts. <strong>Shoulder (May-June, September):</strong> Best value — all services open, prices 20-30% lower. <strong>September:</strong> Sweet spot for honeymoon — fewer kids, warm sea. <strong>Off-season (November-March):</strong> Many closed except Sani and a few year-round operators.</p>",
      "de": "<h2>Wann buchen</h2><p><strong>Hochsaison (Juli-August):</strong> Buchungen 6-12 Monate im Voraus für die Top-Resorts. <strong>Zwischensaison (Mai-Juni, September):</strong> Bestes Preis-Leistungs-Verhältnis — alle Dienstleistungen geöffnet, Preise 20-30% niedriger. <strong>September:</strong> ideal für Flitterwochen — weniger Kinder, warmes Meer. <strong>Nebensaison (November-März):</strong> Viele geschlossen, außer Sani und einige ganzjährig geöffnete.</p>",
      "ro": "<h2>Când să rezervi</h2><p><strong>Sezon de vârf (iulie-august):</strong> Rezervări cu 6-12 luni înainte pentru top resorturi. <strong>Sezon intermediar (mai-iunie, septembrie):</strong> Cea mai bună valoare — toate serviciile deschise, prețuri cu 20-30% mai mici. <strong>Septembrie:</strong> moment ideal pentru luna de miere — mai puțini copii, mare caldă. <strong>Extrasezon (noiembrie-martie):</strong> Multe închise, cu excepția Sani și câteva deschise tot anul.</p>",
      "sr": "<h2>Kada rezervisati</h2><p><strong>Vrh sezone (jul-avgust):</strong> Rezervacije 6-12 meseci unapred za top rizorte. <strong>Prelazni period (maj-jun, septembar):</strong> Najbolja vrednost — sve usluge otvorene, cene 20-30% niže. <strong>Septembar:</strong> idealno za medeni mesec — manje dece, toplo more. <strong>Van sezone (novembar-mart):</strong> Mnogo toga zatvoreno, osim Sani i nekih koji rade cele godine.</p>",
      "bg": "<h2>Кога да резервирате</h2><p><strong>Пиков сезон (юли-август):</strong> Резервации 6-12 месеца предварително за топ курортите. <strong>Преходен сезон (май-юни, септември):</strong> Най-добра стойност — всички услуги са отворени, цени с 20-30% по-ниски. <strong>Септември:</strong> идеален за меден месец — по-малко деца, топло море. <strong>Извън сезона (ноември-март):</strong> Много затворени, освен Сани и някои целогодишни.</p>",
      "ru": "<h2>Когда бронировать</h2><p><strong>Пиковый сезон (июль-август):</strong> Бронирование за 6-12 месяцев до поездки для топовых курортов. <strong>Промежуточный сезон (май-июнь, сентябрь):</strong> Лучшее соотношение цены и качества — все услуги открыты, цены на 20-30% ниже. <strong>Сентябрь:</strong> идеальное время для медового месяца — меньше детей, тёплое море. <strong>Низкий сезон (ноябрь-март):</strong> Многие места закрыты, кроме Сани и некоторых круглогодичных.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές για luxury stay</h2><ul><li><strong>All-inclusive vs B&B:</strong> Στα μεγάλα resorts (Ikos) το all-inclusive είναι value γιατί περιλαμβάνει premium φαγητά. Σε boutique hotels (Ekies) προτίμα B&B και βγες σε ταβέρνες.</li><li><strong>Sea view vs garden view:</strong> Διαφορά €50-150/βράδυ. Άξιο για sunset views ή Άγιο Όρος (Ουρανούπολη).</li><li><strong>Suite upgrade:</strong> Στο check-in συνήθως υπάρχει διαθεσιμότητα. Πληρωμή €100-300 extra για suite με ιδιωτική πισίνα.</li><li><strong>Spa:</strong> Couples ritual €150-300. Κράτηση 1-2 μέρες πριν.</li><li><strong>Excursions:</strong> Όλα τα resorts προσφέρουν ιδιωτικές εκδρομές με σκάφος, κρουαζιέρες κατά μήκος του Αγίου Όρους και ειδικά δείπνα.</li><li><strong>Loyalty:</strong> Σε επανεπίσκεψη πάντα ζητάς upgrade ή welcome amenity.</li></ul>",
      "en": "<h2>Luxury stay tips</h2><ul><li><strong>All-inclusive vs B&B:</strong> At big resorts (Ikos) all-inclusive is great value because it includes premium dining. At boutique hotels (Ekies) prefer B&B and go out to tavernas.</li><li><strong>Sea view vs garden view:</strong> €50-150/night difference. Worth it for sunsets or Mount Athos (Ouranoupoli).</li><li><strong>Suite upgrade:</strong> Often available at check-in. Pay €100-300 extra for a suite with private pool.</li><li><strong>Spa:</strong> Couples ritual €150-300. Book 1-2 days ahead.</li><li><strong>Excursions:</strong> All resorts offer private boat trips, cruises along Mount Athos and special dinners.</li><li><strong>Loyalty:</strong> On a return visit always ask for an upgrade or welcome amenity.</li></ul>",
      "de": "<h2>Tipps für einen luxuriösen Aufenthalt</h2><ul><li><strong>All-inclusive vs B&B:</strong> In großen Resorts (Ikos) ist All-inclusive lohnenswert, da es Premium-Essen beinhaltet. In Boutique-Hotels (Ekies) empfiehlt sich B&B und Essen in Tavernen.</li><li><strong>Meerblick vs Gartenblick:</strong> Unterschied €50-150/Nacht. Lohnt sich für Sonnenuntergangsblick oder Berg Athos (Ouranoupoli).</li><li><strong>Suite-Upgrade:</strong> Beim Check-in ist oft Verfügbarkeit vorhanden. Zahlung von €100-300 extra für eine Suite mit privatem Pool.</li><li><strong>Spa:</strong> Paar-Ritual €150-300. Buchung 1-2 Tage im Voraus.</li><li><strong>Ausflüge:</strong> Alle Resorts bieten private Bootsausflüge, Fahrten entlang des Athos und besondere Abendessen.</li><li><strong>Treue:</strong> Bei einem erneuten Besuch immer nach einem Upgrade oder Willkommensgeschenk fragen.</li></ul>",
      "ro": "<h2>Sfaturi pentru un sejur de lux</h2><ul><li><strong>All-inclusive vs B&B:</strong> În resorturile mari (Ikos), all-inclusive este avantajos deoarece include mâncăruri premium. În hotelurile boutique (Ekies), alege B&B și explorează tavernele locale.</li><li><strong>Vedere la mare vs vedere la grădină:</strong> Diferență de €50-150/noapte. Merită pentru apusuri sau Muntele Athos (Ouranoupoli).</li><li><strong>Upgrade la suită:</strong> La check-in, de obicei există disponibilitate. Plătește €100-300 în plus pentru o suită cu piscină privată.</li><li><strong>Spa:</strong> Ritual pentru cupluri €150-300. Rezervare cu 1-2 zile înainte.</li><li><strong>Excursii:</strong> Toate resorturile oferă ieșiri private cu barca, croaziere de-a lungul Muntelui Athos și cine speciale.</li><li><strong>Loialitate:</strong> La o reîntoarcere, cere întotdeauna un upgrade sau un cadou de bun venit.</li></ul>",
      "sr": "<h2>Saveti za luksuzni boravak</h2><ul><li><strong>All-inclusive vs B&B:</strong> U velikim rizortima (Ikos) all-inclusive je isplativo jer uključuje premium hranu. U boutique hotelima (Ekies) izaberi B&B i večeraj u tavernama.</li><li><strong>Pogled na more vs pogled na vrt:</strong> Razlika €50-150/noć. Vredi za sunset poglede ili Svetu Goru (Uranopolis).</li><li><strong>Nadogradnja apartmana:</strong> Prilikom prijave obično ima dostupnosti. Plaćanje €100-300 dodatno za apartman sa privatnim bazenom.</li><li><strong>Spa:</strong> Ritual za parove €150-300. Rezervacija 1-2 dana unapred.</li><li><strong>Izleti:</strong> Svi rizorti nude privatne izlete brodom, krstarenja duž Svete Gore i posebne večere.</li><li><strong>Lojalnost:</strong> Prilikom ponovne posete uvek traži nadogradnju ili dobrodošlicu.</li></ul>",
      "bg": "<h2>Съвети за луксозен престой</h2><ul><li><strong>All-inclusive срещу B&B:</strong> В големите курорти (Ikos) all-inclusive е изгодно, защото включва премиум храни. В бутикови хотели (Ekies) предпочитайте B&B и излизайте в таверни.</li><li><strong>Изглед към морето срещу изглед към градината:</strong> Разлика €50-150/нощ. Струва си за гледки към залеза или Света гора (Уранополи).</li><li><strong>Надграждане на суита:</strong> При настаняване обикновено има наличност. Доплащане €100-300 за суит с частен басейн.</li><li><strong>Спа:</strong> Ритуал за двойки €150-300. Резервация 1-2 дни предварително.</li><li><strong>Екскурзии:</strong> Всички курорти предлагат частни разходки с лодка, круизи покрай Света гора и специални вечери.</li><li><strong>Лоялност:</strong> При повторно посещение винаги искайте надграждане или приветствен подарък.</li></ul>",
      "ru": "<h2>Советы для роскошного отдыха</h2><ul><li><strong>All-inclusive vs B&B:</strong> На больших курортах (Ikos) all-inclusive выгодно, так как включает премиум питание. В бутик-отелях (Ekies) выбирайте B&B и посещайте таверны.</li><li><strong>Вид на море vs вид на сад:</strong> Разница €50-150/ночь. Стоит для видов на закат или Афон (Уранополис).</li><li><strong>Обновление номера:</strong> При регистрации обычно есть доступность. Доплата €100-300 за номер с частным бассейном.</li><li><strong>Спа:</strong> Ритуал для пар €150-300. Бронирование за 1-2 дня до.</li><li><strong>Экскурсии:</strong> Все курорты предлагают частные морские прогулки, круизы вдоль Афона и особые ужины.</li><li><strong>Лояльность:</strong> При повторном визите всегда просите улучшение номера или приветственный подарок.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Καλύτερο luxury resort της Χαλκιδικής;",
          "en": "Best luxury resort in Halkidiki?",
          "de": "Bestes Luxusresort in Chalkidiki?",
          "ro": "Cel mai bun resort de lux din Halkidiki?",
          "sr": "Najbolji luksuzni rizort u Halkidikiju?",
          "bg": "Най-добрият луксозен курорт в Халкидики?",
          "ru": "Лучший luxury курорт Халкидики?"
        },
        "a": {
          "el": "Δύσκολη επιλογή — <strong>Σάνη Resort</strong> για variety, <strong>Ikos Olivia</strong> για premium all-inclusive, <strong>Eagles Palace</strong> για location στην Ουρανούπολη, <strong>Ekies All Senses</strong> για boutique experience στη Σιθωνία. Όλα στην λίστα.",
          "en": "Tough call — <strong>Sani Resort</strong> for variety, <strong>Ikos Olivia</strong> for premium all-inclusive, <strong>Eagles Palace</strong> for Ouranoupoli location, <strong>Ekies All Senses</strong> for boutique Sithonia experience. All in the list.",
          "de": "Schwierige Wahl — <strong>Sani Resort</strong> für Vielfalt, <strong>Ikos Olivia</strong> für Premium All-inclusive, <strong>Eagles Palace</strong> für die Lage in Ouranoupoli, <strong>Ekies All Senses</strong> für Boutique-Erlebnis in Sithonia. Alle auf der Liste.",
          "ro": "O alegere dificilă — <strong>Sani Resort</strong> pentru varietate, <strong>Ikos Olivia</strong> pentru all-inclusive premium, <strong>Eagles Palace</strong> pentru locația din Ouranoupoli, <strong>Ekies All Senses</strong> pentru experiența boutique în Sithonia. Toate sunt pe listă.",
          "sr": "Težak izbor — <strong>Sani Resort</strong> za raznovrsnost, <strong>Ikos Olivia</strong> za premium all-inclusive, <strong>Eagles Palace</strong> za lokaciju u Uranopolisu, <strong>Ekies All Senses</strong> za boutique iskustvo na Sitoniji. Svi su na listi.",
          "bg": "Труден избор — <strong>Сани Resort</strong> за разнообразие, <strong>Ikos Olivia</strong> за премиум all-inclusive, <strong>Eagles Palace</strong> за местоположение в Уранополи, <strong>Ekies All Senses</strong> за бутиково преживяване в Ситония. Всички в списъка.",
          "ru": "Сложный выбор — <strong>Сани Resort</strong> за разнообразие, <strong>Ikos Olivia</strong> за премиум all-inclusive, <strong>Eagles Palace</strong> за расположение в Уранополис, <strong>Ekies All Senses</strong> за бутик-опыт на Ситонии. Все в списке."
        }
      },
      {
        "q": {
          "el": "Κόστος ανά βράδυ;",
          "en": "Cost per night?",
          "de": "Kosten pro Nacht?",
          "ro": "Cost pe noapte?",
          "sr": "Cena po noći?",
          "bg": "Цена на нощувка?",
          "ru": "Стоимость за ночь?"
        },
        "a": {
          "el": "<strong>Mid-luxury (4*):</strong> €200-400/βράδυ peak season. <strong>Premium (5*):</strong> €400-800. <strong>Suite με ιδιωτική πισίνα:</strong> €800-2500. Σεπτέμβριος -30%.",
          "en": "<strong>Mid-luxury (4*):</strong> €200-400/night peak season. <strong>Premium (5*):</strong> €400-800. <strong>Suite with private pool:</strong> €800-2500. -30% in September.",
          "de": "<strong>Mittelklasse-Luxus (4*):</strong> €200-400/Nacht in der Hochsaison. <strong>Premium (5*):</strong> €400-800. <strong>Suite mit privatem Pool:</strong> €800-2500. September -30%.",
          "ro": "<strong>Mid-luxury (4*):</strong> €200-400/noapte în sezonul de vârf. <strong>Premium (5*):</strong> €400-800. <strong>Suită cu piscină privată:</strong> €800-2500. Septembrie -30%.",
          "sr": "<strong>Srednji luksuz (4*):</strong> €200-400/noć u vrhuncu sezone. <strong>Premium (5*):</strong> €400-800. <strong>Apartman sa privatnim bazenom:</strong> €800-2500. Septembar -30%.",
          "bg": "<strong>Среден лукс (4*):</strong> €200-400/нощ в пиков сезон. <strong>Премиум (5*):</strong> €400-800. <strong>Суит с частен басейн:</strong> €800-2500. Септември -30%.",
          "ru": "<strong>Средний уровень (4*):</strong> €200-400/ночь в пиковый сезон. <strong>Премиум (5*):</strong> €400-800. <strong>Сьют с частным бассейном:</strong> €800-2500. Сентябрь -30%."
        }
      },
      {
        "q": {
          "el": "Καλύτερη χερσόνησος για luxury;",
          "en": "Best peninsula for luxury?",
          "de": "Beste Halbinsel für Luxus?",
          "ro": "Cea mai bună peninsulă pentru lux?",
          "sr": "Najbolji poluostrvo za luksuz?",
          "bg": "Най-добрият полуостров за лукс?",
          "ru": "Лучшая часть полуострова для luxury?"
        },
        "a": {
          "el": "<strong>Κασσάνδρα</strong> για variety και υποδομές (Σάνη, Καλλιθέα). <strong>Άθως</strong> για μυστηριώδη εμπειρία (Ουρανούπολη). <strong>Σιθωνία</strong> για boutique και ησυχία.",
          "en": "<strong>Kassandra</strong> for variety and facilities (Sani, Kallithea). <strong>Athos</strong> for mystical experience (Ouranoupoli). <strong>Sithonia</strong> for boutique and quiet.",
          "de": "<strong>Kassandra</strong> für Vielfalt und Infrastruktur (Sani, Kallithea). <strong>Athos</strong> für mystische Erfahrung (Ouranoupoli). <strong>Sithonia</strong> für Boutique und Ruhe.",
          "ro": "<strong>Kassandra</strong> pentru varietate și infrastructură (Sani, Kallithea). <strong>Athos</strong> pentru o experiență misterioasă (Ouranoupoli). <strong>Sithonia</strong> pentru boutique și liniște.",
          "sr": "<strong>Kasandra</strong> za raznovrsnost i infrastrukturu (Sani, Kalitea). <strong>Athos</strong> za mistično iskustvo (Uranopolis). <strong>Sitonija</strong> za boutique i mir.",
          "bg": "<strong>Касандра</strong> за разнообразие и инфраструктура (Сани, Калифея). <strong>Атон</strong> за мистериозно преживяване (Уранополи). <strong>Ситония</strong> за бутикови и спокойствие.",
          "ru": "<strong>Кассандра</strong> за разнообразие и инфраструктуру (Сани, Калитея). <strong>Афон</strong> за мистический опыт (Уранополис). <strong>Ситония</strong> за бутик и тишину."
        }
      }
    ]
  },
  "camping-spots": {
    "intro": {
      "el": "<p>Η Χαλκιδική έχει μερικά από τα καλύτερα οργανωμένα campings της Ελλάδας — με την ιδιαιτερότητα ότι πολλά βρίσκονται κατευθείαν δίπλα σε υπέροχες παραλίες με πευκοδάσος, χωρίς να χρειάζεσαι μετακίνηση. Από beachfront σε <strong>Κασσάνδρα</strong> (Πευκοχώρι, Καλλιθέα), μέχρι πιο φυσικά σε <strong>Σιθωνία</strong> (Παραλία Άρμενιστής, Καλαμίτσι) και <strong>Άθως</strong> (Ουρανούπολη). Οι περισσότερες έχουν πισίνες, εστιατόρια, μίνι-μάρκετ. Αυτή η λίστα συγκεντρώνει τα top-rated camping spots — ιδανικά για budget-friendly οικογενειακές διακοπές ή road trip με trailer.</p>",
      "en": "<p>Halkidiki has some of Greece's best organised campsites — with the bonus that many sit directly next to stunning beaches with pine forest, no need to travel. From beachfront in <strong>Kassandra</strong> (Pefkochori, Kallithea) to more natural in <strong>Sithonia</strong> (Armenistis Beach, Kalamitsi) and <strong>Athos</strong> (Ouranoupoli). Most have pools, restaurants, mini-markets. This list collects top-rated camping spots — ideal for budget family holidays or trailer road trips.</p>",
      "de": "<p>Chalkidiki bietet einige der besten organisierten Campingplätze Griechenlands — mit der Besonderheit, dass viele direkt neben wunderschönen Stränden mit Pinienwäldern liegen, ohne dass man sich fortbewegen muss. Von Strandlagen auf <strong>Kassandra</strong> (Pefkochori, Kallithea) bis hin zu natürlicheren Plätzen auf <strong>Sithonia</strong> (Armenistis Beach, Kalamitsi) und <strong>Athos</strong> (Ouranoupoli). Die meisten haben Pools, Restaurants und Mini-Märkte. Diese Liste fasst die bestbewerteten Campingplätze zusammen — ideal für budgetfreundliche Familienurlaube oder Roadtrips mit dem Wohnwagen.</p>",
      "ro": "<p>Halkidiki are unele dintre cele mai bune campinguri organizate din Grecia — cu particularitatea că multe se află direct lângă plaje superbe cu păduri de pini, fără a fi nevoie de deplasare. De la cele pe plajă în <strong>Kassandra</strong> (Pefkochori, Kallithea), până la cele mai naturale în <strong>Sithonia</strong> (Plaja Armenistis, Kalamitsi) și <strong>Athos</strong> (Ouranoupoli). Majoritatea au piscine, restaurante, mini-marketuri. Această listă adună cele mai bine cotate locuri de camping — ideale pentru vacanțe de familie prietenoase cu bugetul sau excursii cu rulota.</p>",
      "sr": "<p>Halkidiki ima neka od najboljih organizovanih kampovanja u Grčkoj — sa posebnom karakteristikom da se mnoga nalaze direktno pored prelepih plaža sa borovom šumom, bez potrebe za prevozom. Od kampova na plaži na <strong>Kassandra</strong> (Pefkochori, Kallithea), do prirodnijih na <strong>Sithonia</strong> (Plaža Armenistis, Kalamitsi) i <strong>Athos</strong> (Ouranoupoli). Većina ima bazene, restorane, mini-markete. Ova lista okuplja najbolje ocenjena kamp mesta — idealna za budžet-friendly porodične odmore ili putovanje sa prikolicom.</p>",
      "bg": "<p>Халкидики има някои от най-добре организираните къмпинги в Гърция — с особеността, че много от тях се намират директно до прекрасни плажове с борови гори, без да е необходимо да се местите. От плажната ивица на <strong>Касандра</strong> (Пефкохори, Калитея), до по-естествените в <strong>Ситония</strong> (Плаж Арменистис, Каламици) и <strong>Атон</strong> (Уранополи). Повечето разполагат с басейни, ресторанти, мини-маркети. Този списък събира топ оценяваните къмпинг места — идеални за бюджетни семейни ваканции или пътешествие с каравана.</p>",
      "ru": "<p>Халкидики предлагает одни из лучших организованных кемпингов в Греции — многие из них расположены прямо рядом с великолепными пляжами и сосновыми лесами, что избавляет от необходимости перемещаться. От кемпингов на побережье в <strong>Кассандре</strong> (Пефкохори, Калитея) до более природных в <strong>Ситонии</strong> (пляж Арменистис, Каламици) и <strong>Афоне</strong> (Уранополис). Большинство из них имеют бассейны, рестораны и мини-маркеты. Этот список собрал лучшие кемпинг-места — идеально для бюджетного семейного отдыха или дорожного путешествия с трейлером.</p>"
    },
    "seasonal": {
      "el": "<h2>Πότε να κατασκηνώσετε</h2><p><strong>Τέλη άνοιξης ως αρχές φθινοπώρου:</strong> Η κύρια σεζόν, με τα κάμπινγκ ανοιχτά και όλες τις παροχές. <strong>Εκτός σεζόν:</strong> Τα περισσότερα κλείνουν· ρωτήστε σε κάθε κάμπινγκ. <strong>Καλύτερη θέση:</strong> Φτάστε νωρίς μέσα στη μέρα για να διαλέξετε θέση με σκιά.</p>",
      "en": "<h2>When to camp</h2><p><strong>Late spring to early autumn:</strong> The main season, when campsites are open with all their services. <strong>Outside the season:</strong> Most close; check with each campsite. <strong>Best pitch:</strong> Arrive early in the day to choose a shaded spot.</p>",
      "de": "<h2>Wann campen</h2><p><strong>Ende Frühling bis Anfang Herbst:</strong> Die Hauptsaison, wenn die Plätze mit allen Angeboten geöffnet sind. <strong>Außerhalb der Saison:</strong> Die meisten schließen; beim jeweiligen Platz nachfragen. <strong>Bester Stellplatz:</strong> Früh am Tag ankommen und einen schattigen Platz wählen.</p>",
      "ro": "<h2>Când să campați</h2><p><strong>De la sfârșitul primăverii până la începutul toamnei:</strong> sezonul principal, cu campingurile deschise și toate serviciile. <strong>În afara sezonului:</strong> majoritatea se închid; întrebați la fiecare camping. <strong>Cel mai bun loc:</strong> ajungeți devreme în zi ca să alegeți un loc la umbră.</p>",
      "sr": "<h2>Kada kampovati</h2><p><strong>Od kraja proleća do početka jeseni:</strong> glavna sezona, kad kampovi rade sa svim uslugama. <strong>Van sezone:</strong> većina se zatvara; proverite u svakom kampu. <strong>Najbolje mesto:</strong> stignite rano tokom dana da izaberete mesto u hladu.</p>",
      "bg": "<h2>Кога да къмпингувате</h2><p><strong>Края на пролетта до началото на есента:</strong> Основният сезон, когато къмпингите работят с всички услуги. <strong>Извън сезона:</strong> Повечето затварят; попитайте в съответния къмпинг. <strong>Най-добро място:</strong> Пристигнете рано през деня, за да изберете място на сянка.</p>",
      "ru": "<h2>Когда ехать в кемпинг</h2><p><strong>С конца весны до начала осени:</strong> основной сезон, кемпинги работают со всеми услугами. <strong>Вне сезона:</strong> большинство закрыто; уточняйте в каждом кемпинге. <strong>Лучшее место:</strong> приезжайте пораньше, чтобы выбрать место в тени.</p>"
    },
    "tips": {
      "el": "<h2>Συμβουλές για camping</h2><ul><li><strong>Κράτηση:</strong> Online ή τηλεφωνική 1-2 βδομάδες πριν για peak season. Στις πιο γνωστές γεμίζει.</li><li><strong>Τιμές 2026:</strong> Σκηνή €15-25/βράδυ + €5-10/άτομο. Caravan €25-40/βράδυ. Bungalow €60-120/βράδυ.</li><li><strong>Εξοπλισμός:</strong> Πάρε σκηνή με αντοχή στον αέρα (μερικά campings σε εκτεθειμένες παραλίες). Σλίπινγκ μπαγκ, στρώμα.</li><li><strong>Φαγητό:</strong> Πολλά campings έχουν εστιατόριο/καντίνα. Mini market για supplies. BBQ συχνά επιτρέπεται.</li><li><strong>Beach access:</strong> Άμεση από όλα τα campings — αυτό είναι το πλεονέκτημα. Δες τις <a href=\"/best/family-beaches\">οικογενειακές παραλίες</a> για κοντινές επιλογές.</li><li><strong>Παροχές:</strong> Wifi συχνά δωρεάν (slow στις πιο φυσικές). Ντουζ, πλυντήρια ρούχων, παιδική χαρά.</li></ul>",
      "en": "<h2>Camping tips</h2><ul><li><strong>Reservation:</strong> Online or phone 1-2 weeks ahead for peak season. The most famous ones fill up.</li><li><strong>2026 prices:</strong> Tent €15-25/night + €5-10/person. Caravan €25-40/night. Bungalow €60-120/night.</li><li><strong>Gear:</strong> Bring a wind-resistant tent (some sites are on exposed beaches). Sleeping bag, mat.</li><li><strong>Food:</strong> Many campsites have a restaurant/canteen. Mini market for supplies. BBQ usually allowed.</li><li><strong>Beach access:</strong> Direct from all campsites — that's the perk. See our <a href=\"/best/family-beaches\">family beaches</a> for nearby options.</li><li><strong>Amenities:</strong> Wi-Fi often free (slow at the more natural ones). Showers, laundry, playground.</li></ul>",
      "de": "<h2>Tipps fürs Camping</h2><ul><li><strong>Buchung:</strong> Online oder telefonisch 1-2 Wochen im Voraus für die Hochsaison. Die bekanntesten sind schnell ausgebucht.</li><li><strong>Preise 2026:</strong> Zelt €15-25/Nacht + €5-10/Person. Wohnwagen €25-40/Nacht. Bungalow €60-120/Nacht.</li><li><strong>Ausrüstung:</strong> Nimm ein zelt mit Windbeständigkeit (einige Campingplätze liegen an exponierten Stränden). Schlafsack, Isomatte.</li><li><strong>Essen:</strong> Viele Campingplätze haben ein Restaurant/Kantine. Mini-Markt für Vorräte. Grillen ist oft erlaubt.</li><li><strong>Zugang zum Strand:</strong> Direkter Zugang von allen Campingplätzen — das ist der Vorteil. Sieh dir die <a href=\"/best/family-beaches\">Familienstrände</a> für nahegelegene Optionen an.</li><li><strong>Ausstattung:</strong> WLAN oft kostenlos (langsam bei den natürlicheren). Duschen, Waschmaschinen, Spielplatz.</li></ul>",
      "ro": "<h2>Sfaturi pentru camping</h2><ul><li><strong>Rezervare:</strong> Online sau telefonic cu 1-2 săptămâni înainte pentru sezonul de vârf. Cele mai cunoscute se umplu.</li><li><strong>Prețuri 2026:</strong> Cort €15-25/noapte + €5-10/persoană. Rulotă €25-40/noapte. Bungalow €60-120/noapte.</li><li><strong>Echipament:</strong> Ia un cort rezistent la vânt (unele campinguri sunt pe plaje expuse). Sac de dormit, saltea.</li><li><strong>Mâncare:</strong> Multe campinguri au restaurant/cantină. Mini market pentru provizii. BBQ este adesea permis.</li><li><strong>Acces la plajă:</strong> Direct din toate campingurile — acesta este avantajul. Vezi <a href=\"/best/family-beaches\">plajele de familie</a> pentru opțiuni apropiate.</li><li><strong>Facilități:</strong> Wifi adesea gratuit (lent în cele mai naturale). Dușuri, mașini de spălat, loc de joacă pentru copii.</li></ul>",
      "sr": "<h2>Saveti za kampovanje</h2><ul><li><strong>Rezervacija:</strong> Online ili telefonski 1-2 nedelje unapred za vrhunac sezone. Najpoznatiji se brzo popune.</li><li><strong>Cene 2026:</strong> Šator €15-25/noć + €5-10/osoba. Karavan €25-40/noć. Bungalov €60-120/noć.</li><li><strong>Oprema:</strong> Ponesite šator otporan na vetar (neki kampovi su na izloženim plažama). Vreća za spavanje, dušek.</li><li><strong>Hrana:</strong> Mnoga kampovanja imaju restoran/kantinu. Mini market za potrepštine. BBQ je često dozvoljen.</li><li><strong>Pristup plaži:</strong> Direktan iz svih kampova — to je prednost. Pogledajte <a href=\"/best/family-beaches\">porodične plaže</a> za obližnje opcije.</li><li><strong>Pogodnosti:</strong> Wifi često besplatan (sporiji u prirodnijim). Tuševi, veš mašine, dečje igralište.</li></ul>",
      "bg": "<h2>Съвети за къмпинг</h2><ul><li><strong>Резервация:</strong> Онлайн или по телефона 1-2 седмици предварително за пиковия сезон. На по-известните места се запълва.</li><li><strong>Цени 2026:</strong> Палатка €15-25/нощ + €5-10/човек. Каравана €25-40/нощ. Бунгало €60-120/нощ.</li><li><strong>Оборудване:</strong> Вземете палатка устойчива на вятър (някои къмпинги са на открити плажове). Спален чувал, матрак.</li><li><strong>Храна:</strong> Много къмпинги имат ресторант/кантина. Мини маркет за запаси. BBQ често е позволено.</li><li><strong>Достъп до плажа:</strong> Директен от всички къмпинги — това е предимството. Вижте <a href=\"/best/family-beaches\">семейните плажове</a> за близки опции.</li><li><strong>Удобства:</strong> Wifi често безплатно (бавен в по-естествените). Душове, перални машини, детска площадка.</li></ul>",
      "ru": "<h2>Советы для кемпинга</h2><ul><li><strong>Бронирование:</strong> Онлайн или по телефону за 1-2 недели до пикового сезона. В самых популярных местах быстро заполняется.</li><li><strong>Цены 2026:</strong> Палатка €15-25/ночь + €5-10/человек. Караван €25-40/ночь. Бунгало €60-120/ночь.</li><li><strong>Оборудование:</strong> Возьмите палатку, устойчивую к ветру (некоторые кемпинги находятся на открытых пляжах). Спальный мешок, матрас.</li><li><strong>Еда:</strong> Во многих кемпингах есть ресторан/кафе. Мини-маркет для покупок. Барбекю часто разрешено.</li><li><strong>Доступ к пляжу:</strong> Прямой из всех кемпингов — это преимущество. Посмотрите <a href=\"/best/family-beaches\">семейные пляжи</a> для близких вариантов.</li><li><strong>Удобства:</strong> Wifi часто бесплатный (медленный в более природных местах). Душ, прачечные, детская площадка.</li></ul>"
    },
    "faqs": [
      {
        "q": {
          "el": "Καλύτερο camping στη Χαλκιδική;",
          "en": "Best camping in Halkidiki?",
          "de": "Bester Campingplatz in Chalkidiki?",
          "ro": "Cel mai bun camping din Halkidiki?",
          "sr": "Najbolje kampovanje na Halkidikiju?",
          "bg": "Най-добрият къмпинг в Халкидики?",
          "ru": "Лучший кемпинг в Халкидиках?"
        },
        "a": {
          "el": "<strong>Camping Sithonia</strong> (Σιθωνία) για φυσικό setting και άμεση πρόσβαση παραλία. <strong>Camping Armenistis</strong> για ωραίο sandy beach. <strong>Camping Pefkochori</strong> (Κασσάνδρα) για υποδομές. Δες όλα τα locations στην λίστα.",
          "en": "<strong>Camping Sithonia</strong> (Sithonia) for natural setting and direct beach access. <strong>Camping Armenistis</strong> for a nice sandy beach. <strong>Camping Pefkochori</strong> (Kassandra) for facilities. See all locations in the list.",
          "de": "<strong>Camping Sithonia</strong> (Sithonia) für natürliche Umgebung und direkten Strandzugang. <strong>Camping Armenistis</strong> für schönen Sandstrand. <strong>Camping Pefkochori</strong> (Kassandra) für Infrastruktur. Sieh dir alle Standorte in der Liste an.",
          "ro": "<strong>Camping Sithonia</strong> (Sithonia) pentru un cadru natural și acces direct la plajă. <strong>Camping Armenistis</strong> pentru o plajă cu nisip frumoasă. <strong>Camping Pefkochori</strong> (Kassandra) pentru infrastructură. Vezi toate locațiile în listă.",
          "sr": "<strong>Camping Sithonia</strong> (Sithonia) za prirodno okruženje i direktan pristup plaži. <strong>Camping Armenistis</strong> za lepu peščanu plažu. <strong>Camping Pefkochori</strong> (Kassandra) za infrastrukturu. Pogledajte sve lokacije na listi.",
          "bg": "<strong>Къмпинг Ситония</strong> (Ситония) за естествена обстановка и директен достъп до плажа. <strong>Къмпинг Арменистис</strong> за хубав пясъчен плаж. <strong>Къмпинг Пефкохори</strong> (Касандра) за инфраструктура. Вижте всички локации в списъка.",
          "ru": "<strong>Кемпинг Ситония</strong> (Ситония) для природной обстановки и прямого доступа к пляжу. <strong>Кемпинг Арменистис</strong> для красивого песчаного пляжа. <strong>Кемпинг Пефкохори</strong> (Кассандра) для инфраструктуры. Посмотрите все места в списке."
        }
      },
      {
        "q": {
          "el": "Δέχονται caravans;",
          "en": "Do they accept caravans?",
          "de": "Akzeptieren sie Wohnwagen?",
          "ro": "Acceptă rulote?",
          "sr": "Da li primaju karavane?",
          "bg": "Приемат ли каравани?",
          "ru": "Принимают ли караваны?"
        },
        "a": {
          "el": "Ναι σχεδόν παντού. Έχουν specific spots για caravan και motorhome με ηλεκτρισμό. Τιμή 30-50% παραπάνω από σκηνή.",
          "en": "Yes, almost everywhere. They have specific caravan and motorhome spots with electricity. 30-50% more than a tent pitch.",
          "de": "Ja, fast überall. Sie haben spezielle Stellplätze für Wohnwagen und Wohnmobile mit Stromanschluss. Preis 30-50% höher als Zelt.",
          "ro": "Da, aproape peste tot. Au locuri specifice pentru rulote și autorulote cu electricitate. Preț cu 30-50% mai mare decât pentru cort.",
          "sr": "Da, skoro svuda. Imaju specifična mesta za karavane i motorhome sa strujom. Cena 30-50% viša od šatora.",
          "bg": "Да, почти навсякъде. Имат специални места за каравани и кемпери с електричество. Цената е с 30-50% по-висока от палатка.",
          "ru": "Да, почти везде. Есть специальные места для караванов и автодомов с электричеством. Цена на 30-50% выше, чем для палатки."
        }
      },
      {
        "q": {
          "el": "Κατάλληλο για παιδιά;",
          "en": "Suitable for kids?",
          "de": "Geeignet für Kinder?",
          "ro": "Potrivit pentru copii?",
          "sr": "Pogodno za decu?",
          "bg": "Подходящо ли е за деца?",
          "ru": "Подходит ли для детей?"
        },
        "a": {
          "el": "Πολύ. Όλα τα μεγάλα campings έχουν παιδικές χαρές, πισίνες με ρηχό κομμάτι, animation, snack bars. Πολλά παιδιά κάνουν φίλους.",
          "en": "Very much. All major campsites have playgrounds, pools with shallow sections, animation, snack bars. Lots of kids make friends.",
          "de": "Sehr. Alle großen Campingplätze haben Spielplätze, Pools mit flachem Bereich, Animation, Snackbars. Viele Kinder finden Freunde.",
          "ro": "Foarte. Toate campingurile mari au locuri de joacă, piscine cu zonă de mică adâncime, animație, snack baruri. Mulți copii își fac prieteni.",
          "sr": "Veoma. Svi veliki kampovi imaju dečja igrališta, bazene sa plitkim delom, animaciju, snack barove. Mnoga deca sklapaju prijateljstva.",
          "bg": "Много. Всички големи къмпинги имат детски площадки, басейни с плитка част, анимация, снек барове. Много деца си намират приятели.",
          "ru": "Очень. Все большие кемпинги имеют детские площадки, бассейны с мелкой частью, анимацию, снэк-бары. Многие дети находят друзей."
        }
      }
    ]
  }
};
