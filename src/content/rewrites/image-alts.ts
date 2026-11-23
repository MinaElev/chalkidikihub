/**
 * Photo descriptions (image_alt) that were written after looking at the photo,
 * keyed by the Greek text stored in the database, with their translations.
 *
 * Only these are shown as alt text. Every other stored alt is either an
 * English sentence written without seeing the photo ("A beautiful restaurant
 * setting") or a v3 formula that sometimes named the wrong peninsula, so
 * pages fall back to the item's localised name instead (see photoAlt in
 * src/lib/content/format.ts). When a photo changes in the admin its Greek alt
 * changes too, the key no longer matches, and the page falls back to the
 * name until the new text is added here (scripts/apply-image-seo.mjs).
 *
 * Place names follow src/lib/content/place-names.ts.
 */
type Tr = { en: string; de: string; ro: string; bg: string; sr: string; ru: string };

export const VERIFIED_ALTS: Record<string, Tr> = {
  // ── Villages ──
  'Το φέρι για την Αμμουλιανή στο λιμάνι της Τρυπητής, με γαλάζια νερά και πράσινο λόφο απέναντι': {
    en: 'The Ammouliani ferry at Trypiti harbour, with blue water and a green hill opposite',
    de: 'Die Fähre nach Ammouliani im Hafen von Trypiti, mit blauem Wasser und einem grünen Hügel gegenüber',
    ro: 'Feribotul spre Ammouliani în portul Trypiti, cu apă albastră și un deal verde vizavi',
    bg: 'Фериботът за Амулиани в пристанището на Трипити, със синя вода и зелен хълм отсреща',
    sr: 'Trajekt za Amuljani u luci Tripiti, sa plavom vodom i zelenim brdom preko puta',
    ru: 'Паром на Аммульяни в порту Трипити, с голубой водой и зелёным холмом напротив',
  },
  'Αεροφωτογραφία της Νέας Τρίγλιας με τα σπίτια, τις καλλιέργειες γύρω και τη θάλασσα στο βάθος': {
    en: 'Aerial view of Nea Triglia with its houses, the farmland around it and the sea in the distance',
    de: 'Luftaufnahme von Nea Triglia mit den Häusern, den Feldern ringsum und dem Meer im Hintergrund',
    ro: 'Vedere aeriană a localității Nea Triglia, cu casele, terenurile cultivate din jur și marea în depărtare',
    bg: 'Въздушен изглед към Неа Триглия с къщите, обработваемите земи наоколо и морето в далечината',
    sr: 'Pogled iz vazduha na Nea Triglija, sa kućama, poljima okolo i morem u daljini',
    ru: 'Вид с воздуха на Неа Триглия: дома, поля вокруг и море вдали',
  },
  'Ο Νέος Μαρμαράς το σούρουπο, με το λιμάνι, τα ιστιοπλοϊκά και τα φωτισμένα σπίτια, Σιθωνία': {
    en: 'Neos Marmaras at dusk, with the harbour, sailing boats and lit-up houses, Sithonia',
    de: 'Neos Marmaras in der Abenddämmerung, mit Hafen, Segelbooten und beleuchteten Häusern, Sithonia',
    ro: 'Neos Marmaras la apus, cu portul, velierele și casele luminate, Sithonia',
    bg: 'Неос Мармарас по здрач, с пристанището, платноходките и осветените къщи, Ситония',
    sr: 'Neos Marmaras u sumrak, sa lukom, jedrilicama i osvetljenim kućama, Sitonija',
    ru: 'Неос Мармарас в сумерках: гавань, парусные яхты и освещённые дома, Ситония',
  },
  'Παραδοσιακό πέτρινο αρχοντικό με κεραμοσκεπή ανάμεσα σε λεύκες και πεύκα στον Πολύγυρο': {
    en: 'A traditional stone mansion with a tiled roof among poplars and pines in Polygyros',
    de: 'Traditionelles Herrenhaus aus Stein mit Ziegeldach zwischen Pappeln und Kiefern in Polygyros',
    ro: 'Conac tradițional din piatră cu acoperiș de țiglă, printre plopi și pini, în Polygyros',
    bg: 'Традиционно каменно имение с керемиден покрив сред тополи и борове в Полигирос',
    sr: 'Tradicionalna kamena vila sa krovom od crepa među topolama i borovima u Poligirosu',
    ru: 'Традиционный каменный особняк с черепичной крышей среди тополей и сосен в Полигиросе',
  },

  // ── Beaches ──
  'Ξύλινη πινακίδα «Nude Beach – Clothing optional» σε αμμουδιά με γαλάζια θάλασσα': {
    en: 'Wooden "Nude Beach – Clothing optional" sign on a sandy beach with blue sea',
    de: 'Holzschild „Nude Beach – Clothing optional" an einem Sandstrand mit blauem Meer',
    ro: 'Indicator din lemn „Nude Beach – Clothing optional" pe o plajă cu nisip și mare albastră',
    bg: 'Дървена табела „Nude Beach – Clothing optional" на пясъчен плаж със синьо море',
    sr: 'Drvena tabla „Nude Beach – Clothing optional" na peščanoj plaži sa plavim morem',
    ru: 'Деревянная табличка «Nude Beach – Clothing optional» на песчаном пляже с голубым морем',
  },
  'Αεροφωτογραφία της παραλίας Ελάνη στην Κασσάνδρα, με τιρκουάζ νερά, αμμουδιά και πευκόδασος': {
    en: 'Aerial view of Elani beach in Kassandra, with turquoise water, sand and pine forest',
    de: 'Luftaufnahme des Strandes Elani auf Kassandra, mit türkisfarbenem Wasser, Sand und Kiefernwald',
    ro: 'Vedere aeriană a plajei Elani din Kassandra, cu apă turcoaz, nisip și pădure de pini',
    bg: 'Въздушен изглед към плаж Елани в Касандра, с тюркоазена вода, пясък и борова гора',
    sr: 'Pogled iz vazduha na plažu Elani na Kasandri, sa tirkiznom vodom, peskom i borovom šumom',
    ru: 'Вид с воздуха на пляж Элани на Кассандре: бирюзовая вода, песок и сосновый лес',
  },
  'Η αμμουδιά Καραγάτσια στην Αμμουλιανή, με πέτρινη προβλήτα και πεντακάθαρα ρηχά νερά': {
    en: 'Karagatsia beach on Ammouliani, with a stone jetty and crystal-clear shallow water',
    de: 'Der Sandstrand Karagatsia auf Ammouliani, mit Steinmole und glasklarem, flachem Wasser',
    ro: 'Plaja cu nisip Karagatsia din Ammouliani, cu un debarcader de piatră și apă mică, cristalină',
    bg: 'Пясъчният плаж Карагацья на Амулиани, с каменен кей и кристално чиста плитка вода',
    sr: 'Peščana plaža Karagaća na Amuljaniju, sa kamenim molom i kristalno čistom plitkom vodom',
    ru: 'Песчаный пляж Карагация на Аммульяни с каменным причалом и кристально чистой мелкой водой',
  },
  'Η παραλία Φάκα στην Αμμουλιανή, με αμμουδιά, βραχώδη ακτή και νησάκι απέναντι': {
    en: 'Faka beach on Ammouliani, with sand, a rocky shore and an islet opposite',
    de: 'Der Strand Faka auf Ammouliani, mit Sand, felsiger Küste und einer kleinen Insel gegenüber',
    ro: 'Plaja Faka din Ammouliani, cu nisip, țărm stâncos și o insuliță vizavi',
    bg: 'Плаж Фака на Амулиани, с пясък, скалист бряг и островче отсреща',
    sr: 'Plaža Faka na Amuljaniju, sa peskom, stenovitom obalom i ostrvcem preko puta',
    ru: 'Пляж Фака на Аммульяни: песок, скалистый берег и островок напротив',
  },
  'Αεροφωτογραφία της παραλίας του Στρατωνίου με το λιμανάκι, τις ομπρέλες και τους πράσινους λόφους': {
    en: 'Aerial view of Stratoni beach with the small harbour, sunshades and green hills',
    de: 'Luftaufnahme des Strandes von Stratoni mit dem kleinen Hafen, Sonnenschirmen und grünen Hügeln',
    ro: 'Vedere aeriană a plajei din Stratoni, cu portul mic, umbrelele și dealurile verzi',
    bg: 'Въздушен изглед към плажа на Стратони с малкото пристанище, чадърите и зелените хълмове',
    sr: 'Pogled iz vazduha na plažu u Stratoniju, sa malom lukom, suncobranima i zelenim brdima',
    ru: 'Вид с воздуха на пляж Стратони: маленькая гавань, зонтики и зелёные холмы',
  },
  'Αεροφωτογραφία της Δημοτικής Πλαζ της Ιερισσού με τη μακριά αμμουδιά και τα τροχόσπιτα κατά μήκος της ακτής': {
    en: 'Aerial view of the Ierissos municipal beach, with its long sandy shore and caravans along the coast',
    de: 'Luftaufnahme des Gemeindestrandes von Ierissos mit dem langen Sandstrand und Wohnwagen entlang der Küste',
    ro: 'Vedere aeriană a plajei municipale din Ierissos, cu țărmul lung de nisip și rulotele de-a lungul coastei',
    bg: 'Въздушен изглед към общинския плаж на Йерисос с дългата пясъчна ивица и караваните по брега',
    sr: 'Pogled iz vazduha na gradsku plažu u Jerisosu, sa dugom peščanom obalom i kamp-prikolicama duž obale',
    ru: 'Вид с воздуха на муниципальный пляж Иериссоса: длинная песчаная полоса и дома на колёсах вдоль берега',
  },
  'Ρηχά, πεντακάθαρα τιρκουάζ νερά στην παραλία Άγιος Γεώργιος της Αμμουλιανής, με την απέναντι ακτή στο βάθος': {
    en: 'Shallow, crystal-clear turquoise water at Agios Georgios beach on Ammouliani, with the opposite shore in the distance',
    de: 'Flaches, glasklares türkisfarbenes Wasser am Strand Agios Georgios auf Ammouliani, mit der gegenüberliegenden Küste im Hintergrund',
    ro: 'Apă mică, turcoaz și cristalină la plaja Agios Georgios din Ammouliani, cu țărmul de vizavi în depărtare',
    bg: 'Плитка, кристално чиста тюркоазена вода на плаж Агиос Георгиос на Амулиани, с отсрещния бряг в далечината',
    sr: 'Plitka, kristalno čista tirkizna voda na plaži Agios Georgios na Amuljaniju, sa naspramnom obalom u daljini',
    ru: 'Мелкая, кристально чистая бирюзовая вода на пляже Агиос-Георгиос на Аммульяни, вдали противоположный берег',
  },
  'Αεροφωτογραφία της παραλίας Βουλίτσα με τις ψάθινες ομπρέλες, το beach bar και τα τιρκουάζ νερά': {
    en: 'Aerial view of Voulitsa beach with straw sunshades, the beach bar and turquoise water',
    de: 'Luftaufnahme des Strandes Voulitsa mit Strohschirmen, der Strandbar und türkisfarbenem Wasser',
    ro: 'Vedere aeriană a plajei Voulitsa, cu umbrele de paie, beach barul și apa turcoaz',
    bg: 'Въздушен изглед към плаж Вулица със сламените чадъри, бийч бара и тюркоазената вода',
    sr: 'Pogled iz vazduha na plažu Vulica, sa suncobranima od trske, beach barom i tirkiznom vodom',
    ru: 'Вид с воздуха на пляж Вулица: соломенные зонтики, пляжный бар и бирюзовая вода',
  },
  'Η παραλία Τηγανιά στο Καλαμίτσι της Σιθωνίας, με λείους βράχους, ψάθινες ομπρέλες και ρηχά τιρκουάζ νερά': {
    en: 'Tigania beach at Kalamitsi, Sithonia, with smooth rocks, straw sunshades and shallow turquoise water',
    de: 'Der Strand Tigania bei Kalamitsi auf Sithonia, mit glatten Felsen, Strohschirmen und flachem türkisfarbenem Wasser',
    ro: 'Plaja Tigania din Kalamitsi, Sithonia, cu stânci netede, umbrele de paie și apă turcoaz mică',
    bg: 'Плаж Тигания в Каламици, Ситония, с гладки скали, сламени чадъри и плитка тюркоазена вода',
    sr: 'Plaža Tiganija u Kalamiciju, Sitonija, sa glatkim stenama, suncobranima od trske i plitkom tirkiznom vodom',
    ru: 'Пляж Тигания в Каламици, Ситония: гладкие скалы, соломенные зонтики и мелкая бирюзовая вода',
  },
  'Ο κολπίσκος της παραλίας Πράσσου (Ρόμπινσον) στο Καλαμίτσι, με αμμουδιά, λευκούς βράχους και το Άγιον Όρος στο βάθος': {
    en: 'The cove of Prassou (Robinson) beach at Kalamitsi, with sand, white rocks and Mount Athos in the distance',
    de: 'Die Bucht des Strandes Prassou (Robinson) bei Kalamitsi, mit Sand, weißen Felsen und dem Berg Athos im Hintergrund',
    ro: 'Golfulețul plajei Prassou (Robinson) din Kalamitsi, cu nisip, stânci albe și Muntele Athos în depărtare',
    bg: 'Заливчето на плаж Прасу (Робинзон) в Каламици, с пясък, бели скали и Света гора в далечината',
    sr: 'Uvala plaže Prasu (Robinzon) u Kalamiciju, sa peskom, belim stenama i Svetom Gorom u daljini',
    ru: 'Бухта пляжа Прасу (Робинзон) в Каламици: песок, белые скалы и гора Афон вдали',
  },
  'Αεροφωτογραφία της παραλίας Τρίμη, με λευκή άμμο, κοκκινωπούς γρανιτένιους βράχους και τιρκουάζ νερά': {
    en: 'Aerial view of Trimi beach, with white sand, reddish granite rocks and turquoise water',
    de: 'Luftaufnahme des Strandes Trimi, mit weißem Sand, rötlichen Granitfelsen und türkisfarbenem Wasser',
    ro: 'Vedere aeriană a plajei Trimi, cu nisip alb, stânci roșiatice de granit și apă turcoaz',
    bg: 'Въздушен изглед към плаж Трими, с бял пясък, червеникави гранитни скали и тюркоазена вода',
    sr: 'Pogled iz vazduha na plažu Trimi, sa belim peskom, crvenkastim granitnim stenama i tirkiznom vodom',
    ru: 'Вид с воздуха на пляж Трими: белый песок, красноватые гранитные скалы и бирюзовая вода',
  },

  // ── Sights ──
  'Τα πέτρινα θεμέλια των σπιτιών της αρχαίας Ολύνθου σε ευθείς δρόμους, με ελαιόδεντρα και βουνά στο βάθος': {
    en: 'The stone foundations of the houses of ancient Olynthos along straight streets, with olive trees and mountains in the distance',
    de: 'Die steinernen Fundamente der Häuser des antiken Olynthos entlang gerader Straßen, mit Olivenbäumen und Bergen im Hintergrund',
    ro: 'Fundațiile din piatră ale caselor anticului Olynthos, de-a lungul unor străzi drepte, cu măslini și munți în depărtare',
    bg: 'Каменните основи на къщите в древния Олинтос по прави улици, с маслинови дървета и планини в далечината',
    sr: 'Kameni temelji kuća antičkog Olintosa duž pravih ulica, sa maslinama i planinama u daljini',
    ru: 'Каменные фундаменты домов древнего Олинфа вдоль прямых улиц, оливы и горы вдали',
  },
  'Αεροφωτογραφία της χερσονήσου Λήκυθος στην Τορώνη, με τα ερείπια των τειχών και τιρκουάζ νερά γύρω': {
    en: 'Aerial view of the Lekythos headland at Toroni, with the ruins of its walls and turquoise water all around',
    de: 'Luftaufnahme der Halbinsel Lekythos bei Toroni, mit den Ruinen der Mauern und türkisfarbenem Wasser ringsum',
    ro: 'Vedere aeriană a promontoriului Lekythos din Toroni, cu ruinele zidurilor și apă turcoaz de jur împrejur',
    bg: 'Въздушен изглед към полуостровчето Лекитос в Торони, с руините на стените и тюркоазена вода наоколо',
    sr: 'Pogled iz vazduha na rt Lekitos u Toroniju, sa ruševinama zidina i tirkiznom vodom svuda okolo',
    ru: 'Вид с воздуха на мыс Лекитос в Торони: руины стен и бирюзовая вода вокруг',
  },
  'Αεροφωτογραφία της ανασκαφής του ιερού του Ποσειδώνα στο Ποσείδι, ανάμεσα σε θάμνους κοντά στην αμμουδιά': {
    en: 'Aerial view of the excavated sanctuary of Poseidon at Posidi, among shrubs near the beach',
    de: 'Luftaufnahme der Ausgrabung des Poseidon-Heiligtums bei Possidi, zwischen Büschen nahe dem Strand',
    ro: 'Vedere aeriană a săpăturilor sanctuarului lui Poseidon din Posidi, printre tufișuri, lângă plajă',
    bg: 'Въздушен изглед към разкопките на светилището на Посейдон в Посиди, сред храсти близо до плажа',
    sr: 'Pogled iz vazduha na iskopine Posejdonovog svetilišta u Posidiju, među žbunjem blizu plaže',
    ru: 'Вид с воздуха на раскопки святилища Посейдона в Посиди, среди кустов у пляжа',
  },
  'Θέα από τα πέτρινα τείχη των Αρχαίων Σταγείρων προς κόλπο με τιρκουάζ νερά και πράσινους λόφους': {
    en: 'View from the stone walls of Ancient Stagira over a bay with turquoise water and green hills',
    de: 'Blick von den Steinmauern des antiken Stagira auf eine Bucht mit türkisfarbenem Wasser und grünen Hügeln',
    ro: 'Priveliște de pe zidurile de piatră ale anticei Stagira spre un golf cu apă turcoaz și dealuri verzi',
    bg: 'Изглед от каменните стени на Древна Стагира към залив с тюркоазена вода и зелени хълмове',
    sr: 'Pogled sa kamenih zidina antičke Stagire na zaliv sa tirkiznom vodom i zelenim brdima',
    ru: 'Вид с каменных стен Древней Стагиры на залив с бирюзовой водой и зелёными холмами',
  },

  // ── Articles ──
  'Βραδινό πανηγύρι κάτω από πεύκα, με φωτάκια, γεμάτα τραπέζια και κόσμο': {
    en: 'An evening village festival under pine trees, with string lights, full tables and crowds',
    de: 'Ein abendliches Dorffest unter Kiefern, mit Lichterketten, vollen Tischen und vielen Menschen',
    ro: 'Un panighiri de seară sub pini, cu ghirlande de lumini, mese pline și mulțime de oameni',
    bg: 'Вечерен селски празник под боровете, с лампички, пълни маси и много хора',
    sr: 'Večernji seoski sabor pod borovima, sa lampicama, punim stolovima i mnogo ljudi',
    ru: 'Вечерний деревенский праздник под соснами: гирлянды, полные столы и много людей',
  },
  'Ήσυχη μακριά αμμουδιά με τιρκουάζ νερά και πευκόφυτους λόφους στη Χαλκιδική': {
    en: 'A quiet, long sandy beach with turquoise water and pine-covered hills in Halkidiki',
    de: 'Ein ruhiger, langer Sandstrand mit türkisfarbenem Wasser und kieferbewachsenen Hügeln auf Chalkidiki',
    ro: 'O plajă lungă și liniștită, cu apă turcoaz și dealuri acoperite de pini, în Halkidiki',
    bg: 'Тих, дълъг пясъчен плаж с тюркоазена вода и обрасли с борове хълмове в Халкидики',
    sr: 'Mirna, duga peščana plaža sa tirkiznom vodom i brdima prekrivenim borovima na Halkidikiju',
    ru: 'Тихий длинный песчаный пляж с бирюзовой водой и поросшими соснами холмами на Халкидиках',
  },
  'Βραχώδης κολπίσκος με λευκή άμμο, πεύκα και τιρκουάζ νερά στη Χαλκιδική': {
    en: 'A rocky cove with white sand, pine trees and turquoise water in Halkidiki',
    de: 'Eine felsige Bucht mit weißem Sand, Kiefern und türkisfarbenem Wasser auf Chalkidiki',
    ro: 'Un golfuleț stâncos cu nisip alb, pini și apă turcoaz în Halkidiki',
    bg: 'Скалисто заливче с бял пясък, борове и тюркоазена вода в Халкидики',
    sr: 'Stenovita uvala sa belim peskom, borovima i tirkiznom vodom na Halkidikiju',
    ru: 'Скалистая бухта с белым песком, соснами и бирюзовой водой на Халкидиках',
  },
};
