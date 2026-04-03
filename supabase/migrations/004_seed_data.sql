-- 004_seed_data.sql
-- Seed data for beaches, restaurants, activities, and blog articles
-- Generated from TypeScript seed files

BEGIN;

-- ============================================================
-- BEACHES
-- ============================================================

INSERT INTO beaches (slug, name_el, name_en, name_de, name_bg, name_ru, name_ro, description_el, description_en, description_de, description_bg, description_ru, description_ro, area, location_name, latitude, longitude, image_url, features, rating, reviews_count) VALUES
('possidi-kassandra', 'Ποσείδι', 'Possidi', 'Possidi', 'Посиди', 'Посиди', 'Possidi',
 'Εντυπωσιακή παραλία στο ακρωτήρι Ποσείδι με χρυσαφένια άμμο και κρυστάλλινα νερά. Το ακρωτήρι δημιουργεί δύο πλευρές παραλίας - μία ήρεμη και μία με κύματα. Ιδανική για οικογένειες.',
 'Stunning beach at Cape Possidi with golden sand and crystal clear waters. The cape creates two sides - one calm and one with waves. Perfect for families.',
 'Atemberaubender Strand am Kap Possidi mit goldenem Sand und kristallklarem Wasser. Das Kap bildet zwei Seiten - eine ruhige und eine mit Wellen. Perfekt für Familien.',
 'Зашеметяващ плаж на нос Посиди със златист пясък и кристално чисти води. Носът създава две страни - една спокойна и една с вълни. Перфектен за семейства.',
 'Потрясающий пляж на мысе Посиди с золотистым песком и кристально чистой водой. Мыс создаёт две стороны - одну спокойную и одну с волнами. Идеально для семей.',
 'Plajă uimitoare la Capul Possidi cu nisip auriu și apă cristalină. Capul creează două părți - una calmă și una cu valuri. Perfectă pentru familii.',
 'kassandra', 'Ποσείδι, Κασσάνδρα', 39.9542, 23.3876, '/images/areas/kassandra.jpg',
 '["sandy","organized","parking","beachBar","shallowWater","sunbeds"]'::jsonb, 4.7, 3),

('kallithea-kassandra', 'Καλλιθέα', 'Kallithea', 'Kallithea', 'Калитея', 'Каллифея', 'Kallithea',
 'Διάσημη παραλία δίπλα στα ιστορικά ιαματικά λουτρά. Τιρκουάζ νερά, λευκή άμμο και πεύκα που φτάνουν ως τη θάλασσα. Πολλά beach bars και εστιατόρια.',
 'Famous beach next to the historic thermal springs. Turquoise waters, white sand and pine trees reaching the sea. Many beach bars and restaurants.',
 'Berühmter Strand neben den historischen Thermalquellen. Türkisfarbenes Wasser, weißer Sand und Kiefern bis zum Meer. Viele Strandbars und Restaurants.',
 'Известен плаж до историческите термални извори. Тюркоазени води, бял пясък и борове до морето. Много плажни барове и ресторанти.',
 'Знаменитый пляж рядом с историческими термальными источниками. Бирюзовая вода, белый песок и сосны до самого моря. Множество пляжных баров и ресторанов.',
 'Plajă celebră lângă izvoarele termale istorice. Ape turcoaz, nisip alb și pini care ajung la mare. Multe beach baruri și restaurante.',
 'kassandra', 'Καλλιθέα, Κασσάνδρα', 40.0486, 23.4178, '/images/beaches/kallithea.jpg',
 '["sandy","organized","parking","beachBar","sunbeds","waterSports","accessible"]'::jsonb, 4.5, 2),

('sani-kassandra', 'Σάνη', 'Sani', 'Sani', 'Сани', 'Сани', 'Sani',
 'Παραλία-κόσμημα στο βόρειο τμήμα της Κασσάνδρας. Λευκή άμμος, ρηχά τιρκουάζ νερά και υγροβιότοπος στο βάθος. Μέρος του Sani Resort αλλά προσβάσιμη σε όλους.',
 'A jewel beach in northern Kassandra. White sand, shallow turquoise waters and a wetland in the background. Part of Sani Resort but accessible to all.',
 'Ein Juwel von Strand im Norden Kassandras. Weißer Sand, flaches türkisfarbenes Wasser und ein Feuchtgebiet im Hintergrund. Teil des Sani Resorts, aber für alle zugänglich.',
 'Плаж-бижу в северната част на Касандра. Бял пясък, плитки тюркоазени води и влажна зона на заден план. Част от Sani Resort, но достъпен за всички.',
 'Пляж-жемчужина в северной части Кассандры. Белый песок, мелкие бирюзовые воды и заболоченные территории на фоне. Часть Sani Resort, но доступен для всех.',
 'O plajă bijuterie în nordul Kassandrei. Nisip alb, ape turcoaz puțin adânci și o zonă umedă în fundal. Parte din Sani Resort, dar accesibilă tuturor.',
 'kassandra', 'Σάνη, Κασσάνδρα', 40.0932, 23.3012, '/images/beaches/sani.jpg',
 '["sandy","organized","parking","beachBar","shallowWater","sunbeds","waterSports","lifeguard"]'::jsonb, 4.9, 2),

('karidi-sithonia', 'Καρύδι', 'Karidi', 'Karidi', 'Кариди', 'Кариди', 'Karidi',
 'Μια από τις πιο φωτογραφημένες παραλίες της Ελλάδας. Εξωτικά τιρκουάζ νερά, λευκή άμμος και πεύκα. Ελεύθερη πρόσβαση, χωρίς ξαπλώστρες - αυθεντική ομορφιά.',
 'One of the most photographed beaches in Greece. Exotic turquoise waters, white sand and pine trees. Free access, no sunbeds - authentic beauty.',
 'Einer der meistfotografierten Strände Griechenlands. Exotisches türkisfarbenes Wasser, weißer Sand und Kiefern. Freier Zugang, keine Sonnenliegen - authentische Schönheit.',
 'Един от най-снимканите плажове в Гърция. Екзотични тюркоазени води, бял пясък и борове. Свободен достъп, без шезлонги - автентична красота.',
 'Один из самых фотографируемых пляжей Греции. Экзотические бирюзовые воды, белый песок и сосны. Свободный доступ, без шезлонгов - подлинная красота.',
 'Una dintre cele mai fotografiate plaje din Grecia. Ape turcoaz exotice, nisip alb și pini. Acces liber, fără șezlonguri - frumusețe autentică.',
 'sithonia', 'Βουρβουρού, Σιθωνία', 40.1834, 23.7912, '/images/beaches/karidi.jpg',
 '["sandy","free","shallowWater","parking"]'::jsonb, 4.8, 3),

('portokali-sithonia', 'Πορτοκάλι (Orange)', 'Orange Beach', 'Orange Beach', 'Портокали', 'Портокали (Оранж)', 'Orange Beach',
 'Κρυφή παραλία στη Σιθωνία με εξωτικά πράσινα νερά. Πρόσβαση μέσω χωματόδρομου. Ελεύθερη, ανοργάνωτη, ιδανική για λάτρεις της φύσης.',
 'Hidden beach in Sithonia with exotic green waters. Access via dirt road. Free, unorganized, ideal for nature lovers.',
 'Versteckter Strand in Sithonia mit exotischem grünem Wasser. Zugang über Schotterweg. Frei, unorganisiert, ideal für Naturliebhaber.',
 'Скрит плаж в Ситония с екзотични зелени води. Достъп по черен път. Свободен, неорганизиран, идеален за любителите на природата.',
 'Скрытый пляж в Ситонии с экзотическими зелёными водами. Доступ по грунтовой дороге. Свободный, неорганизованный, идеален для любителей природы.',
 'Plajă ascunsă în Sithonia cu ape verzi exotice. Acces pe drum de pământ. Liberă, neorganizată, ideală pentru iubitorii naturii.',
 'sithonia', 'Σάρτη, Σιθωνία', 40.0834, 23.8567, '/images/beaches/portokali.jpg',
 '["sandy","pebble","free","shallowWater"]'::jsonb, 4.6, 2),

('vourvourou-sithonia', 'Βουρβουρού', 'Vourvourou', 'Vourvourou', 'Вурвуру', 'Вурвуру', 'Vourvourou',
 'Μεγάλη αμμώδης παραλία με ρηχά νερά και θέα στο νησάκι Διάπορος. Οργανωμένη με ξαπλώστρες και beach bar. Ιδανική για οικογένειες και θαλάσσια σπορ.',
 'Large sandy beach with shallow waters and views of Diaporos island. Organized with sunbeds and beach bar. Ideal for families and water sports.',
 'Großer Sandstrand mit flachem Wasser und Blick auf die Insel Diaporos. Organisiert mit Sonnenliegen und Strandbar. Ideal für Familien und Wassersport.',
 'Голям пясъчен плаж с плитки води и изглед към остров Диапорос. Организиран с шезлонги и плажен бар. Идеален за семейства и водни спортове.',
 'Большой песчаный пляж с мелководьем и видом на остров Диапорос. Организованный с шезлонгами и пляжным баром. Идеален для семей и водных видов спорта.',
 'Plajă mare de nisip cu ape puțin adânci și vedere la insula Diaporos. Organizată cu șezlonguri și beach bar. Ideală pentru familii și sporturi nautice.',
 'sithonia', 'Βουρβουρού, Σιθωνία', 40.1923, 23.7712, '/images/beaches/vourvourou.jpg',
 '["sandy","organized","parking","beachBar","shallowWater","sunbeds","waterSports","lifeguard"]'::jsonb, 4.4, 2),

('sarti-sithonia', 'Σάρτη', 'Sarti', 'Sarti', 'Сарти', 'Сарти', 'Sarti',
 'Μεγάλη παραλία με θέα στο Άγιο Όρος. Χρυσή άμμος, οργανωμένο τμήμα και ελεύθερο. Ζωντανό παραλιακό μέτωπο με εστιατόρια και μπαρ.',
 'Long beach with views of Mount Athos. Golden sand, organized and free sections. Lively waterfront with restaurants and bars.',
 'Langer Strand mit Blick auf den Berg Athos. Goldener Sand, organisierter und freier Bereich. Lebhafte Strandpromenade mit Restaurants und Bars.',
 'Дълъг плаж с изглед към Атон. Златист пясък, организирана и свободна част. Оживена крайбрежна зона с ресторанти и барове.',
 'Длинный пляж с видом на гору Афон. Золотой песок, организованная и свободная части. Оживлённая набережная с ресторанами и барами.',
 'Plajă lungă cu vedere la Muntele Athos. Nisip auriu, secțiuni organizate și libere. Promenadă animată cu restaurante și baruri.',
 'sithonia', 'Σάρτη, Σιθωνία', 40.0723, 23.9634, '/images/beaches/sarti.jpg',
 '["sandy","organized","free","parking","beachBar","sunbeds","waterSports","lifeguard","accessible"]'::jsonb, 4.5, 2),

('develiki-athos', 'Ντεβελίκι', 'Develiki', 'Develiki', 'Девелики', 'Девелики', 'Develiki',
 'Ήσυχη παραλία στην περιοχή του Άθω. Βοτσαλωτή με καθαρά βαθιά νερά. Ιδανική για ηρεμία και κολύμπι μακριά από τα πλήθη.',
 'Quiet beach in the Athos area. Pebbly with clear deep waters. Ideal for tranquility and swimming away from the crowds.',
 'Ruhiger Strand in der Region Athos. Kiesig mit klarem, tiefem Wasser. Ideal für Ruhe und Schwimmen abseits der Massen.',
 'Тих плаж в района на Атон. Чакълест с чисти дълбоки води. Идеален за спокойствие и плуване далеч от тълпите.',
 'Тихий пляж в районе Афона. Галечный с чистой глубокой водой. Идеален для спокойствия и плавания вдали от толп.',
 'Plajă liniștită în zona Athos. Pietrișoasă cu ape curate și adânci. Ideală pentru liniște și înot departe de mulțimi.',
 'athos', 'Ντεβελίκι, Άθως', 40.3245, 23.9823, '/images/beaches/develiki.jpg',
 '["pebble","free","parking"]'::jsonb, 4.3, 1),

('komitsa-athos', 'Κομίτσα', 'Komitsa', 'Komitsa', 'Комица', 'Комица', 'Komitsa',
 'Γραφική παραλία στην Ιερισσό, κοντά στα σύνορα του Αγίου Όρους. Αμμώδης με βότσαλα, ήρεμα νερά και παραδοσιακές ταβέρνες στο λιμάνι.',
 'Picturesque beach in Ierissos, near the Mount Athos border. Sandy with pebbles, calm waters and traditional tavernas at the port.',
 'Malerischer Strand in Ierissos, nahe der Grenze zum Berg Athos. Sandig mit Kieseln, ruhiges Wasser und traditionelle Tavernen am Hafen.',
 'Живописен плаж в Иерисос, близо до границата на Атон. Пясъчен с камъчета, спокойни води и традиционни таверни на пристанището.',
 'Живописный пляж в Иерисосе, недалеко от границы Афона. Песчаный с галькой, спокойные воды и традиционные таверны в порту.',
 'Plajă pitorească în Ierissos, lângă granița Muntelui Athos. Nisip cu pietricele, ape calme și taverne tradiționale la port.',
 'athos', 'Ιερισσός, Άθως', 40.3989, 23.8767, '/images/beaches/komitsa.jpg',
 '["sandy","pebble","free","parking","shallowWater"]'::jsonb, 4.2, 1),

('nea-moudania-mainland', 'Νέα Μουδανιά', 'Nea Moudania', 'Nea Moudania', 'Неа Муданя', 'Неа Муданья', 'Nea Moudania',
 'Κεντρική παραλία της Νέας Μουδανιάς, η πύλη της Χαλκιδικής. Οργανωμένη αμμουδιά με παιδική χαρά και αθλητικές δραστηριότητες. Κοντά σε όλες τις υπηρεσίες.',
 'Central beach of Nea Moudania, the gateway to Halkidiki. Organized sandy beach with playground and sports activities. Close to all services.',
 'Zentraler Strand von Nea Moudania, dem Tor zu Chalkidiki. Organisierter Sandstrand mit Spielplatz und Sportaktivitäten. In der Nähe aller Dienstleistungen.',
 'Централен плаж на Неа Муданя, портата към Халкидики. Организиран пясъчен плаж с детска площадка и спортни дейности. Близо до всички услуги.',
 'Центральный пляж Неа Муданья, ворота Халкидики. Организованный песчаный пляж с детской площадкой и спортивными мероприятиями. Рядом со всеми услугами.',
 'Plaja centrală din Nea Moudania, poarta Halkidiki. Plajă organizată de nisip cu loc de joacă și activități sportive. Aproape de toate serviciile.',
 'mainland', 'Νέα Μουδανιά', 40.2412, 23.2834, '/images/beaches/nea-moudania.jpg',
 '["sandy","organized","parking","beachBar","sunbeds","shallowWater","accessible","lifeguard"]'::jsonb, 4.0, 2),

('potidea-mainland', 'Νέα Ποτίδαια', 'Nea Potidea', 'Nea Potidea', 'Неа Потидеа', 'Неа Потидея', 'Nea Potidea',
 'Παραλία δίπλα στο κανάλι της Ποτίδαιας. Αμμώδης, ρηχή, ιδανική για οικογένειες. Το κανάλι που χωρίζει την Κασσάνδρα από την ηπειρωτική Χαλκιδική αποτελεί αξιοθέατο.',
 'Beach next to the Potidea canal. Sandy, shallow, ideal for families. The canal separating Kassandra from mainland Halkidiki is a landmark.',
 'Strand neben dem Potidea-Kanal. Sandig, flach, ideal für Familien. Der Kanal, der Kassandra vom Festland trennt, ist eine Sehenswürdigkeit.',
 'Плаж до канала Потидеа. Пясъчен, плитък, идеален за семейства. Каналът, разделящ Касандра от континенталната Халкидики, е забележителност.',
 'Пляж рядом с каналом Потидея. Песчаный, мелкий, идеален для семей. Канал, разделяющий Кассандру от материковой Халкидики - достопримечательность.',
 'Plajă lângă canalul Potidea. Nisip, puțin adâncă, ideală pentru familii. Canalul care separă Kassandra de Halkidiki continentală este un punct de referință.',
 'mainland', 'Νέα Ποτίδαια', 40.1978, 23.3234, '/images/beaches/potidea.jpg',
 '["sandy","organized","parking","shallowWater","sunbeds","beachBar","lifeguard"]'::jsonb, 4.1, 1),

('hanioti-kassandra', 'Χανιώτη', 'Hanioti', 'Hanioti', 'Ханиоти', 'Ханиоти', 'Hanioti',
 'Δημοφιλής παραλία στο τουριστικό θέρετρο του Χανιώτη. Αμμώδης, οργανωμένη, με πολλά beach bars και θαλάσσια σπορ. Ζωντανή ατμόσφαιρα.',
 'Popular beach in the tourist resort of Hanioti. Sandy, organized, with many beach bars and water sports. Lively atmosphere.',
 'Beliebter Strand im Touristenort Hanioti. Sandig, organisiert, mit vielen Strandbars und Wassersport. Lebhafte Atmosphäre.',
 'Популярен плаж в туристическия курорт Ханиоти. Пясъчен, организиран, с много плажни барове и водни спортове. Оживена атмосфера.',
 'Популярный пляж в туристическом курорте Ханиоти. Песчаный, организованный, с множеством пляжных баров и водными видами спорта. Живая атмосфера.',
 'Plajă populară în stațiunea turistică Hanioti. Nisip, organizată, cu multe beach baruri și sporturi nautice. Atmosferă animată.',
 'kassandra', 'Χανιώτη, Κασσάνδρα', 39.9856, 23.5198, '/images/beaches/hanioti.jpg',
 '["sandy","organized","parking","beachBar","sunbeds","waterSports","lifeguard","accessible"]'::jsonb, 4.3, 2);


-- ============================================================
-- BEACH REVIEWS
-- ============================================================

INSERT INTO beach_reviews (beach_id, author_name, rating, comment_el, comment_en, created_at) VALUES
-- Possidi reviews
((SELECT id FROM beaches WHERE slug = 'possidi-kassandra'), 'Maria K.', 5, 'Φανταστική παραλία! Τα νερά είναι ρηχά, ιδανικά για παιδιά.', 'Fantastic beach! The water is shallow, ideal for kids.', '2024-07-15T00:00:00Z'),
((SELECT id FROM beaches WHERE slug = 'possidi-kassandra'), 'Stefan W.', 5, 'Μαγικό ηλιοβασίλεμα από το ακρωτήρι!', 'Magical sunset from the cape!', '2024-08-02T00:00:00Z'),
((SELECT id FROM beaches WHERE slug = 'possidi-kassandra'), 'Dimitar P.', 4, 'Πολύ ωραία παραλία, λίγο πολυκοσμία τον Αύγουστο.', 'Very nice beach, a bit crowded in August.', '2024-08-20T00:00:00Z'),
-- Kallithea reviews
((SELECT id FROM beaches WHERE slug = 'kallithea-kassandra'), 'Elena V.', 5, 'Υπέροχη παραλία! Τα λουτρά δίπλα αξίζουν επίσκεψη.', 'Wonderful beach! The thermal springs nearby are worth visiting.', '2024-07-20T00:00:00Z'),
((SELECT id FROM beaches WHERE slug = 'kallithea-kassandra'), 'Hans M.', 4, 'Πολύ καλά οργανωμένη, αλλά ακριβή.', 'Very well organized, but expensive.', '2024-08-10T00:00:00Z'),
-- Sani reviews
((SELECT id FROM beaches WHERE slug = 'sani-kassandra'), 'Anna G.', 5, 'Η καλύτερη παραλία στην Κασσάνδρα! Σαν Καραϊβική.', 'The best beach in Kassandra! Like the Caribbean.', '2024-06-25T00:00:00Z'),
((SELECT id FROM beaches WHERE slug = 'sani-kassandra'), 'Ivanov A.', 5, 'Εκπληκτική! Πρέπει να πάτε.', 'Amazing! You must go.', '2024-07-30T00:00:00Z'),
-- Karidi reviews
((SELECT id FROM beaches WHERE slug = 'karidi-sithonia'), 'George T.', 5, 'Παράδεισος! Πηγαίνετε νωρίς το πρωί.', 'Paradise! Go early in the morning.', '2024-07-10T00:00:00Z'),
((SELECT id FROM beaches WHERE slug = 'karidi-sithonia'), 'Laura S.', 5, 'Τα πιο καθαρά νερά που έχω δει!', 'The clearest water I have ever seen!', '2024-08-05T00:00:00Z'),
((SELECT id FROM beaches WHERE slug = 'karidi-sithonia'), 'Nikolay R.', 4, 'Πανέμορφη αλλά πολύ κόσμος τον Ιούλιο.', 'Beautiful but very crowded in July.', '2024-07-28T00:00:00Z'),
-- Portokali reviews
((SELECT id FROM beaches WHERE slug = 'portokali-sithonia'), 'Kostas M.', 5, 'Κρυφός παράδεισος! Φέρτε ομπρέλα.', 'Hidden paradise! Bring an umbrella.', '2024-07-22T00:00:00Z'),
((SELECT id FROM beaches WHERE slug = 'portokali-sithonia'), 'Petra H.', 4, 'Δύσκολη πρόσβαση αλλά αξίζει!', 'Difficult access but worth it!', '2024-08-15T00:00:00Z'),
-- Vourvourou reviews
((SELECT id FROM beaches WHERE slug = 'vourvourou-sithonia'), 'Ioana D.', 5, 'Τέλεια για παιδιά, ρηχά νερά σε μεγάλη απόσταση.', 'Perfect for kids, shallow water for a long distance.', '2024-07-18T00:00:00Z'),
((SELECT id FROM beaches WHERE slug = 'vourvourou-sithonia'), 'Alexei K.', 4, 'Πολύ ωραία, κάνετε βόλτα με βάρκα στα νησάκια.', 'Very nice, take a boat trip to the small islands.', '2024-08-08T00:00:00Z'),
-- Sarti reviews
((SELECT id FROM beaches WHERE slug = 'sarti-sithonia'), 'Nikos L.', 5, 'Το ηλιοβασίλεμα με φόντο το Άγιο Όρος είναι μαγικό!', 'The sunset with Mount Athos as background is magical!', '2024-07-25T00:00:00Z'),
((SELECT id FROM beaches WHERE slug = 'sarti-sithonia'), 'Cristina B.', 4, 'Πολύ μεγάλη παραλία, πάντα βρίσκεις χώρο.', 'Very big beach, you always find space.', '2024-08-12T00:00:00Z'),
-- Develiki reviews
((SELECT id FROM beaches WHERE slug = 'develiki-athos'), 'Thanasis P.', 4, 'Ησυχία και καθαρά νερά. Φέρτε τα δικά σας.', 'Peace and clean water. Bring your own supplies.', '2024-08-01T00:00:00Z'),
-- Komitsa reviews
((SELECT id FROM beaches WHERE slug = 'komitsa-athos'), 'Vasilis G.', 4, 'Ωραίο σημείο για φαγητό μετά τη θάλασσα.', 'Nice spot for food after swimming.', '2024-07-12T00:00:00Z'),
-- Nea Moudania reviews
((SELECT id FROM beaches WHERE slug = 'nea-moudania-mainland'), 'Kosta D.', 4, 'Βολική τοποθεσία, κοντά σε σούπερ μάρκετ και φαρμακεία.', 'Convenient location, close to supermarkets and pharmacies.', '2024-07-05T00:00:00Z'),
((SELECT id FROM beaches WHERE slug = 'nea-moudania-mainland'), 'Mircea L.', 4, 'Καλή παραλία για γρήγορο μπάνιο.', 'Good beach for a quick swim.', '2024-08-18T00:00:00Z'),
-- Potidea reviews
((SELECT id FROM beaches WHERE slug = 'potidea-mainland'), 'Eleni F.', 4, 'Ρηχά νερά, τέλεια για μικρά παιδιά. Δείτε και το κανάλι!', 'Shallow water, perfect for small children. Also see the canal!', '2024-07-08T00:00:00Z'),
-- Hanioti reviews
((SELECT id FROM beaches WHERE slug = 'hanioti-kassandra'), 'Todor K.', 4, 'Πολλές επιλογές για φαγητό και διασκέδαση.', 'Many options for food and entertainment.', '2024-07-14T00:00:00Z'),
((SELECT id FROM beaches WHERE slug = 'hanioti-kassandra'), 'Sofia N.', 5, 'Αγαπημένη μας παραλία, ερχόμαστε κάθε χρόνο!', 'Our favorite beach, we come every year!', '2024-08-22T00:00:00Z');


-- ============================================================
-- RESTAURANTS
-- ============================================================

INSERT INTO restaurants (slug, name_el, name_en, name_de, name_bg, name_ru, name_ro, description_el, description_en, description_de, description_bg, description_ru, description_ro, area, location_name, latitude, longitude, image_url, cuisine, price_level, rating, reviews_count, phone, hours, has_sea_view, has_live_music, accepts_reservations, tags) VALUES
('taverna-toroneos-nikiti', 'Ταβέρνα Τορωναίος', 'Taverna Toroneos', 'Taverne Toroneos', 'Таверна Торонеос', 'Таверна Торонеос', 'Taverna Toroneos',
 'Αυθεντική ψαροταβέρνα στην παλιά Νικήτη με φρέσκα ψάρια κάθε μέρα. Η αχινοσαλάτα και τα μύδια σαγανάκι είναι must. Γραφικός κήπος κάτω από πλατάνια.',
 'Authentic fish taverna in old Nikiti with fresh fish daily. The sea urchin salad and saganaki mussels are a must. Picturesque garden under plane trees.',
 'Authentische Fischtaverne in Alt-Nikiti mit täglichem frischem Fisch. Der Seeigelsalat und Saganaki-Muscheln sind ein Muss. Malerischer Garten unter Platanen.',
 'Автентична рибна таверна в стария Никити с прясна риба всеки ден. Салатата от морски таралежи и мидите саганаки са задължителни.',
 'Аутентичная рыбная таверна в старом Никити со свежей рыбой каждый день. Салат из морских ежей и мидии саганаки — обязательны.',
 'Tavernă autentică de pește în Nikiti vechi cu pește proaspăt zilnic. Salata de arici de mare și midiile saganaki sunt obligatorii.',
 'sithonia', 'Παλιά Νικήτη, Σιθωνία', 40.2189, 23.6723, '',
 '["seafood","traditional"]'::jsonb, 'moderate', 4.8, 3, '+30 2375 023456', '12:00-00:00',
 false, true, true, '["fish","traditional","garden","live-music"]'::jsonb),

('psarotaverna-akrogiali-sarti', 'Ψαροταβέρνα Ακρογιάλι', 'Akrogiali Fish Taverna', 'Akrogiali Fischtaverne', 'Рибна таверна Акрогиали', 'Рыбная таверна Акрогиали', 'Taverna de pește Akrogiali',
 'Θέα θάλασσα και Άγιο Όρος ενώ απολαμβάνετε φρέσκα ψάρια. Πόδια στην άμμο, ιδανικό για ηλιοβασίλεμα. Ειδικότητα: ψητή τσιπούρα και καλαμαράκια.',
 'Sea view and Mount Athos while enjoying fresh fish. Feet in the sand, perfect for sunset. Specialty: grilled sea bream and calamari.',
 'Meerblick und Berg Athos beim Genuss von frischem Fisch. Füße im Sand, perfekt für den Sonnenuntergang. Spezialität: gegrillte Dorade und Calamari.',
 'Изглед към морето и Атон, докато се наслаждавате на прясна риба. Крака в пясъка, перфектно за залез.',
 'Вид на море и Афон за свежей рыбой. Ноги в песке, идеально для заката.',
 'Vedere la mare și Muntele Athos savurând pește proaspăt. Cu picioarele în nisip, perfect pentru apus.',
 'sithonia', 'Σάρτη, Σιθωνία', 40.0734, 23.9634, '',
 '["seafood"]'::jsonb, 'moderate', 4.6, 2, '+30 2375 094567', '11:00-23:00',
 true, false, true, '["fish","sea-view","sunset","beach"]'::jsonb),

('souvlaki-tou-thoma-hanioti', 'Σουβλάκι του Θωμά', 'Thoma''s Souvlaki', 'Thomas Souvlaki', 'Сувлаки на Тома', 'Сувлаки у Томаса', 'Souvlaki la Thomas',
 'Το καλύτερο σουβλάκι στη Χανιώτη! Χειροποίητη πίτα, φρέσκο κρέας, σπιτικό τζατζίκι. Γρήγορο, φθηνό, νόστιμο. Ουρά κάθε βράδυ - αξίζει.',
 'The best souvlaki in Hanioti! Handmade pita, fresh meat, homemade tzatziki. Quick, cheap, delicious. Queue every night - worth it.',
 'Das beste Souvlaki in Hanioti! Handgemachtes Pita, frisches Fleisch, hausgemachtes Tzatziki. Schnell, günstig, lecker.',
 'Най-добрият сувлаки в Ханиоти! Ръчно правена пита, прясно месо, домашно цацики.',
 'Лучший сувлаки в Ханиоти! Домашняя пита, свежее мясо, домашний цацики.',
 'Cel mai bun souvlaki din Hanioti! Pita făcută manual, carne proaspătă, tzatziki de casă.',
 'kassandra', 'Χανιώτη, Κασσάνδρα', 39.9878, 23.5212, '',
 '["grill","streetFood"]'::jsonb, 'budget', 4.7, 3, '+30 2374 051234', '17:00-02:00',
 false, false, false, '["souvlaki","cheap","fast","local-favorite"]'::jsonb),

('blue-bay-kallithea', 'Blue Bay Restaurant', 'Blue Bay Restaurant', 'Blue Bay Restaurant', 'Blue Bay Ресторант', 'Blue Bay Ресторан', 'Restaurant Blue Bay',
 'Κομψό εστιατόριο δίπλα στα λουτρά Καλλιθέας. Μεσογειακή κουζίνα με twist, φρέσκες σαλάτες, risotto θαλασσινών. Θέα θάλασσα, ιδανικό για ρομαντικό δείπνο.',
 'Elegant restaurant next to Kallithea thermal springs. Mediterranean cuisine with a twist, fresh salads, seafood risotto. Sea view, perfect for romantic dinner.',
 'Elegantes Restaurant neben den Thermalquellen von Kallithea. Mediterrane Küche mit Twist, frische Salate, Meeresfrüchte-Risotto.',
 'Елегантен ресторант до термалните извори Калитея. Средиземноморска кухня с twist, пресни салати, ризото с морски дарове.',
 'Элегантный ресторан рядом с термальными источниками Каллифея. Средиземноморская кухня с изюминкой, свежие салаты, ризотто с морепродуктами.',
 'Restaurant elegant lângă izvoarele termale Kallithea. Bucătărie mediteraneană cu twist, salate proaspete, risotto cu fructe de mare.',
 'kassandra', 'Καλλιθέα, Κασσάνδρα', 40.0489, 23.4178, '',
 '["mediterranean","seafood"]'::jsonb, 'upscale', 4.5, 2, '+30 2374 022345', '18:00-01:00',
 true, false, true, '["mediterranean","romantic","sea-view","upscale"]'::jsonb),

('bougatsa-moudania', 'Μπουγάτσα Μουδανιά', 'Bougatsa Moudania', 'Bougatsa Moudania', 'Бугаца Муданя', 'Бугаца Муданья', 'Bougatsa Moudania',
 'Η πιο φημισμένη μπουγάτσα της Χαλκιδικής! Φρέσκο φύλλο, τραγανό απ'' έξω, κρέμα ή τυρί. Ανοίγει 6 το πρωί, τέλειο πρωινό πριν πάτε παραλία.',
 'The most famous bougatsa in Halkidiki! Fresh pastry, crispy outside, cream or cheese. Opens at 6am, perfect breakfast before the beach.',
 'Die berühmteste Bougatsa in Chalkidiki! Frischer Teig, knusprig außen, Creme oder Käse. Öffnet um 6 Uhr morgens.',
 'Най-известната бугаца в Халкидики! Прясно тесто, хрупкаво отвън, крем или сирене. Отваря в 6 сутринта.',
 'Самая знаменитая бугаца в Халкидики! Свежее тесто, хрустящее снаружи, крем или сыр. Открывается в 6 утра.',
 'Cea mai faimoasă bougatsa din Halkidiki! Aluat proaspăt, crocant pe exterior, cremă sau brânză. Deschide la 6 dimineața.',
 'mainland', 'Νέα Μουδανιά', 40.2398, 23.2845, '',
 '["cafe","streetFood"]'::jsonb, 'budget', 4.9, 3, '+30 2373 021234', '06:00-15:00',
 false, false, false, '["bougatsa","breakfast","cheap","local-legend"]'::jsonb),

('thalassa-vourvourou', 'Θάλασσα Εστιατόριο', 'Thalassa Restaurant', 'Thalassa Restaurant', 'Ресторант Таласа', 'Ресторан Таласса', 'Restaurant Thalassa',
 'Πολυτελές εστιατόριο στη Βουρβουρού με θέα τα νησάκια Διάπορος. Δημιουργική ελληνική κουζίνα, φρέσκα θαλασσινά και τοπικά κρασιά. Ιδανικό για ειδικές περιστάσεις.',
 'Luxury restaurant in Vourvourou with views of the Diaporos islands. Creative Greek cuisine, fresh seafood and local wines. Perfect for special occasions.',
 'Luxuriöses Restaurant in Vourvourou mit Blick auf die Diaporos-Inseln. Kreative griechische Küche, frische Meeresfrüchte und lokale Weine.',
 'Луксозен ресторант във Вурвуру с изглед към островите Диапорос. Креативна гръцка кухня, пресни морски дарове и местни вина.',
 'Роскошный ресторан в Вурвуру с видом на острова Диапорос. Креативная греческая кухня, свежие морепродукты и местные вина.',
 'Restaurant de lux în Vourvourou cu vedere la insulele Diaporos. Bucătărie grecească creativă, fructe de mare proaspete și vinuri locale.',
 'sithonia', 'Βουρβουρού, Σιθωνία', 40.1912, 23.7723, '',
 '["fineDining","seafood","mediterranean"]'::jsonb, 'fineDining', 4.7, 2, '+30 2375 091234', '19:00-00:00',
 true, true, true, '["fine-dining","sea-view","romantic","wine"]'::jsonb),

('pizzeria-bella-italia-pefkochori', 'Bella Italia Πευκοχώρι', 'Bella Italia Pefkochori', 'Bella Italia Pefkochori', 'Бела Италия Пефкохори', 'Белла Италия Пефкохори', 'Bella Italia Pefkochori',
 'Αυθεντική ιταλική πίτσα σε ξυλόφουρνο, ζυμαρικά και σαλάτες. Φιλική ατμόσφαιρα, ιδανικό για οικογένειες. Παιδικό μενού διαθέσιμο.',
 'Authentic wood-fired Italian pizza, pasta and salads. Friendly atmosphere, ideal for families. Kids menu available.',
 'Authentische italienische Holzofenpizza, Pasta und Salate. Freundliche Atmosphäre, ideal für Familien. Kindermenü vorhanden.',
 'Автентична италианска пица на дърва, паста и салати. Приятелска атмосфера, идеална за семейства.',
 'Аутентичная итальянская пицца на дровах, паста и салаты. Дружелюбная атмосфера, идеально для семей.',
 'Pizza italiană autentică pe lemne, paste și salate. Atmosferă prietenoasă, ideală pentru familii.',
 'kassandra', 'Πευκοχώρι, Κασσάνδρα', 39.9654, 23.6123, '',
 '["pizza","mediterranean"]'::jsonb, 'moderate', 4.3, 2, '+30 2374 061234', '17:00-00:00',
 false, false, true, '["pizza","family","kids-menu","italian"]'::jsonb),

('kafeneio-ouranoupolis', 'Καφενείο Ουρανούπολης', 'Ouranoupolis Kafeneio', 'Kafenion Ouranoupolis', 'Кафенио Уранополи', 'Кафенио Уранополис', 'Cafeneaua Ouranoupolis',
 'Παραδοσιακό καφενείο στο λιμάνι της Ουρανούπολης. Ελληνικός καφές, σπιτικά γλυκά, θέα στον πύργο Προσφορίου. Τέλειο σημείο αναμονής πριν την κρουαζιέρα στο Άγιο Όρος.',
 'Traditional kafeneio at Ouranoupolis port. Greek coffee, homemade sweets, view of the Prosforiou tower. Perfect waiting spot before the Mount Athos cruise.',
 'Traditionelles Kafenion am Hafen von Ouranoupolis. Griechischer Kaffee, hausgemachte Süßigkeiten, Blick auf den Prosforiou-Turm.',
 'Традиционно кафене на пристанището на Уранополи. Гръцко кафе, домашни сладки, изглед към кулата Просфориу.',
 'Традиционное кафенио в порту Уранополиса. Греческий кофе, домашние сладости, вид на башню Просфориу.',
 'Cafenea tradițională în portul Ouranoupolis. Cafea grecească, dulciuri de casă, vedere la turnul Prosforiou.',
 'athos', 'Ουρανούπολη', 40.3267, 24.0923, '',
 '["cafe","traditional"]'::jsonb, 'budget', 4.4, 2, '+30 2377 071234', '06:00-22:00',
 true, false, false, '["coffee","traditional","sea-view","breakfast"]'::jsonb);


-- ============================================================
-- RESTAURANT REVIEWS
-- ============================================================

INSERT INTO restaurant_reviews (restaurant_id, author_name, rating, comment_el, comment_en, created_at) VALUES
-- Taverna Toroneos
((SELECT id FROM restaurants WHERE slug = 'taverna-toroneos-nikiti'), 'Maria K.', 5, 'Τα καλύτερα θαλασσινά στη Σιθωνία!', 'Best seafood in Sithonia!', '2024-07-15T00:00:00Z'),
((SELECT id FROM restaurants WHERE slug = 'taverna-toroneos-nikiti'), 'Stefan W.', 5, 'Φανταστική ατμόσφαιρα, ζωντανή μουσική Σάββατο!', 'Fantastic atmosphere, live music on Saturday!', '2024-08-02T00:00:00Z'),
((SELECT id FROM restaurants WHERE slug = 'taverna-toroneos-nikiti'), 'Todor K.', 4, 'Πολύ νόστιμα, κλείστε τραπέζι νωρίς.', 'Very tasty, book a table early.', '2024-08-20T00:00:00Z'),
-- Akrogiali
((SELECT id FROM restaurants WHERE slug = 'psarotaverna-akrogiali-sarti'), 'Laura S.', 5, 'Μαγικό ηλιοβασίλεμα + φρέσκο ψάρι = τέλειο!', 'Magical sunset + fresh fish = perfect!', '2024-07-25T00:00:00Z'),
((SELECT id FROM restaurants WHERE slug = 'psarotaverna-akrogiali-sarti'), 'Nikolay R.', 4, 'Ωραία τοποθεσία, σωστές τιμές.', 'Nice location, fair prices.', '2024-08-12T00:00:00Z'),
-- Thoma''s Souvlaki
((SELECT id FROM restaurants WHERE slug = 'souvlaki-tou-thoma-hanioti'), 'George T.', 5, 'Καλύτερο σουβλάκι EVER!', 'Best souvlaki EVER!', '2024-07-10T00:00:00Z'),
((SELECT id FROM restaurants WHERE slug = 'souvlaki-tou-thoma-hanioti'), 'Kosta D.', 5, 'Φοβερές μερίδες, μικρές τιμές.', 'Huge portions, small prices.', '2024-08-05T00:00:00Z'),
((SELECT id FROM restaurants WHERE slug = 'souvlaki-tou-thoma-hanioti'), 'Ioana D.', 4, 'Ουρά αλλά αξίζει 100%.', 'Queue but 100% worth it.', '2024-08-18T00:00:00Z'),
-- Blue Bay
((SELECT id FROM restaurants WHERE slug = 'blue-bay-kallithea'), 'Elena V.', 5, 'Υπέροχο δείπνο, τέλεια θέα!', 'Wonderful dinner, perfect view!', '2024-07-20T00:00:00Z'),
((SELECT id FROM restaurants WHERE slug = 'blue-bay-kallithea'), 'Hans M.', 4, 'Καλή ποιότητα, λίγο ακριβό.', 'Good quality, a bit pricey.', '2024-08-10T00:00:00Z'),
-- Bougatsa Moudania
((SELECT id FROM restaurants WHERE slug = 'bougatsa-moudania'), 'Nikos L.', 5, 'Η καλύτερη μπουγάτσα στον κόσμο!', 'Best bougatsa in the world!', '2024-06-15T00:00:00Z'),
((SELECT id FROM restaurants WHERE slug = 'bougatsa-moudania'), 'Cristina B.', 5, 'Πρέπει να σταματήσετε πριν πάτε παραλία!', 'Must stop before heading to the beach!', '2024-07-30T00:00:00Z'),
((SELECT id FROM restaurants WHERE slug = 'bougatsa-moudania'), 'Alexei K.', 5, 'Ουρά κάθε πρωί αλλά πάει γρήγορα.', 'Queue every morning but moves fast.', '2024-08-22T00:00:00Z'),
-- Thalassa
((SELECT id FROM restaurants WHERE slug = 'thalassa-vourvourou'), 'Anna G.', 5, 'Μαγική βραδιά! Φαγητό, θέα, υπηρεσία - 10/10.', 'Magical evening! Food, view, service - 10/10.', '2024-08-05T00:00:00Z'),
((SELECT id FROM restaurants WHERE slug = 'thalassa-vourvourou'), 'Mircea L.', 4, 'Εξαιρετικό αλλά ακριβό - αξίζει για ειδική περίσταση.', 'Excellent but pricey - worth it for special occasions.', '2024-08-15T00:00:00Z'),
-- Bella Italia
((SELECT id FROM restaurants WHERE slug = 'pizzeria-bella-italia-pefkochori'), 'Sofia N.', 4, 'Πολύ καλή πίτσα, τα παιδιά λάτρεψαν!', 'Very good pizza, kids loved it!', '2024-07-28T00:00:00Z'),
((SELECT id FROM restaurants WHERE slug = 'pizzeria-bella-italia-pefkochori'), 'Petra H.', 5, 'Αυθεντική ιταλική γεύση!', 'Authentic Italian taste!', '2024-08-08T00:00:00Z'),
-- Kafeneio Ouranoupolis
((SELECT id FROM restaurants WHERE slug = 'kafeneio-ouranoupolis'), 'Vasilis G.', 4, 'Τέλειος ελληνικός καφές πριν το πλοίο!', 'Perfect Greek coffee before the boat!', '2024-07-12T00:00:00Z'),
((SELECT id FROM restaurants WHERE slug = 'kafeneio-ouranoupolis'), 'Eleni F.', 5, 'Αυθεντικό καφενείο, σπιτικά γλυκά!', 'Authentic kafeneio, homemade sweets!', '2024-08-01T00:00:00Z');


-- ============================================================
-- ACTIVITIES
-- ============================================================

INSERT INTO activities (slug, name_el, name_en, name_de, name_bg, name_ru, name_ro, description_el, description_en, description_de, description_bg, description_ru, description_ro, area, location_name, latitude, longitude, image_url, category, price_range, duration, rating, reviews_count, tags) VALUES
('petralona-cave', 'Σπήλαιο Πετραλώνων', 'Petralona Cave', 'Petralona-Höhle', 'Пещера Петралона', 'Пещера Петралона', 'Peștera Petralona',
 'Ένα από τα σημαντικότερα σπήλαια της Ευρώπης, όπου βρέθηκε το αρχαιότερο ανθρώπινο κρανίο στην Ελλάδα (700.000 ετών). Σταλακτίτες, σταλαγμίτες και ανθρωπολογικό μουσείο. Ιδανική εκδρομή για μέρες χωρίς ήλιο ή για οικογένειες που θέλουν κάτι διαφορετικό.',
 'One of the most important caves in Europe, where the oldest human skull in Greece was found (700,000 years old). Stalactites, stalagmites and an anthropological museum. Perfect excursion for cloudy days or families wanting something different.',
 'Eine der wichtigsten Höhlen Europas, wo der älteste menschliche Schädel Griechenlands gefunden wurde (700.000 Jahre alt). Stalaktiten, Stalagmiten und ein anthropologisches Museum.',
 'Една от най-важните пещери в Европа, където е намерен най-старият човешки череп в Гърция (700 000 години). Сталактити, сталагмити и антропологически музей.',
 'Одна из важнейших пещер Европы, где найден древнейший человеческий череп в Греции (700 000 лет). Сталактиты, сталагмиты и антропологический музей.',
 'Una dintre cele mai importante peșteri din Europa, unde a fost găsit cel mai vechi craniu uman din Grecia (700.000 de ani). Stalactite, stalagmite și muzeu antropologic.',
 'mainland', 'Πετράλωνα, Χαλκιδική', 40.3556, 23.1678, '',
 'historical', '€8', '1.5h', 4.5, 3, '["cave","museum","history","family"]'::jsonb),

('kallithea-thermal-springs', 'Ιαματικά Λουτρά Καλλιθέας', 'Kallithea Thermal Springs', 'Thermalquellen Kallithea', 'Термални извори Калитея', 'Термальные источники Каллифея', 'Izvoarele termale Kallithea',
 'Ιστορικά ιαματικά λουτρά χτισμένα το 1930, πλήρως ανακαινισμένα. Εντυπωσιακή αρχιτεκτονική, πολιτιστικές εκδηλώσεις και καφέ με θέα τη θάλασσα. Εισιτήριο €3, αξίζει για τη φωτογραφία μόνο!',
 'Historic thermal baths built in 1930, fully renovated. Impressive architecture, cultural events and a café with sea views. €3 entry, worth it for the photos alone!',
 'Historische Thermalquellen aus dem Jahr 1930, vollständig renoviert. Beeindruckende Architektur, kulturelle Veranstaltungen und Café mit Meerblick. €3 Eintritt.',
 'Исторически термални бани, построени през 1930 г., напълно ремонтирани. Впечатляваща архитектура, културни събития и кафене с изглед към морето.',
 'Исторические термальные ванны 1930 года, полностью обновлённые. Впечатляющая архитектура, культурные мероприятия и кафе с видом на море.',
 'Băi termale istorice construite în 1930, complet renovate. Arhitectură impresionantă, evenimente culturale și cafenea cu vedere la mare.',
 'kassandra', 'Καλλιθέα, Κασσάνδρα', 40.0489, 23.4167, '',
 'wellness', '€3', '1-2h', 4.6, 2, '["thermal","spa","history","architecture"]'::jsonb),

('diaporos-island-boat-trip', 'Βόλτα με βάρκα στο Διάπορο', 'Diaporos Island Boat Trip', 'Bootsfahrt zur Insel Diaporos', 'Разходка с лодка до остров Диапорос', 'Морская прогулка на остров Диапорос', 'Excursie cu barca pe Insula Diaporos',
 'Εκδρομή με βάρκα στο νησάκι Διάπορος και τα γύρω νησάκια. Κρυστάλλινα νερά, κολύμπι σε απομονωμένες παραλίες και snorkeling. Αναχώρηση από Βουρβουρού, διάρκεια 4-6 ώρες.',
 'Boat trip to Diaporos island and surrounding islets. Crystal clear waters, swimming in secluded beaches and snorkeling. Departure from Vourvourou, duration 4-6 hours.',
 'Bootsfahrt zur Insel Diaporos und umliegenden Inseln. Kristallklares Wasser, Schwimmen an abgelegenen Stränden und Schnorcheln. Abfahrt von Vourvourou, 4-6 Stunden.',
 'Разходка с лодка до остров Диапорос и околните островчета. Кристално чисти води, плуване на уединени плажове и шнорхелинг. Тръгване от Вурвуру, 4-6 часа.',
 'Прогулка на лодке к острову Диапорос и окрестным островам. Кристально чистые воды, купание на уединённых пляжах и снорклинг. Отправление из Вурвуру, 4-6 часов.',
 'Excursie cu barca pe insula Diaporos și insulițele din jur. Ape cristaline, înot pe plaje izolate și snorkeling. Plecare din Vourvourou, 4-6 ore.',
 'sithonia', 'Βουρβουρού, Σιθωνία', 40.1912, 23.7756, '',
 'boatTrips', '€30-50', '4-6h', 4.9, 3, '["boat","island","snorkeling","swimming"]'::jsonb),

('mount-athos-cruise', 'Κρουαζιέρα γύρω από το Άγιο Όρος', 'Mount Athos Cruise', 'Kreuzfahrt um den Berg Athos', 'Круиз около Света Гора', 'Круиз вокруг горы Афон', 'Croazieră în jurul Muntelui Athos',
 'Κρουαζιέρα κατά μήκος της ακτογραμμής του Αγίου Όρους. Δείτε τα μοναστήρια από τη θάλασσα χωρίς να χρειάζεστε ειδική άδεια. Αναχώρηση από Ουρανούπολη ή Ιερισσό.',
 'Cruise along the Mount Athos coastline. See the monasteries from the sea without needing a special permit. Departures from Ouranoupolis or Ierissos.',
 'Kreuzfahrt entlang der Küste des Berg Athos. Sehen Sie die Klöster vom Meer aus ohne Sondergenehmigung. Abfahrt von Ouranoupolis oder Ierissos.',
 'Круиз покрай бреговата линия на Света Гора. Вижте манастирите от морето без специално разрешение. Тръгване от Уранополи или Иерисос.',
 'Круиз вдоль побережья горы Афон. Увидьте монастыри с моря без специального разрешения. Отправление из Уранополиса или Иерисоса.',
 'Croazieră de-a lungul coastei Muntelui Athos. Vedeți mănăstirile de pe mare fără permis special. Plecări din Ouranoupolis sau Ierissos.',
 'athos', 'Ουρανούπολη / Ιερισσός', 40.3267, 24.0923, '/images/areas/athos.jpg',
 'boatTrips', '€25-40', '3-4h', 4.7, 2, '["cruise","monasteries","athos","sightseeing"]'::jsonb),

('scuba-diving-kassandra', 'Κατάδυση στην Κασσάνδρα', 'Scuba Diving in Kassandra', 'Tauchen in Kassandra', 'Гмуркане в Касандра', 'Дайвинг на Кассандре', 'Scufundări în Kassandra',
 'Μαθήματα κατάδυσης και guided dives σε εντυπωσιακούς βυθούς. Δείτε σπηλιές, βράχια και θαλάσσια ζωή. Κατάλληλο για αρχάριους και προχωρημένους.',
 'Diving lessons and guided dives in impressive underwater landscapes. See caves, rocks and marine life. Suitable for beginners and advanced.',
 'Tauchkurse und geführte Tauchgänge in beeindruckenden Unterwasserlandschaften. Höhlen, Felsen und Meeresleben. Für Anfänger und Fortgeschrittene.',
 'Уроци по гмуркане и организирани потапяния в впечатляващи подводни пейзажи. Пещери, скали и морски живот.',
 'Уроки дайвинга и погружения с гидом в впечатляющих подводных ландшафтах. Пещеры, скалы и морская жизнь.',
 'Lecții de scufundări și scufundări ghidate în peisaje subacvatice impresionante. Peșteri, stânci și viață marină.',
 'kassandra', 'Χανιώτη, Κασσάνδρα', 39.9878, 23.5234, '',
 'waterSports', '€50-80', '2-3h', 4.4, 2, '["diving","scuba","underwater","sports"]'::jsonb),

('old-nikiti-village-walk', 'Βόλτα στην Παλιά Νικήτη', 'Old Nikiti Village Walk', 'Spaziergang durch Alt-Nikiti', 'Разходка в Стария Никити', 'Прогулка по Старому Никити', 'Plimbare în Nikiti Vechi',
 'Περπατήστε στα πέτρινα σοκάκια του παλιού χωριού. Παραδοσιακά σπίτια, βυζαντινές εκκλησίες, μελισσοκομικό μουσείο και τοπικά μαγαζιά με μέλι και ελαιόλαδο. Δωρεάν!',
 'Walk through the stone alleys of the old village. Traditional houses, Byzantine churches, beekeeping museum and local shops with honey and olive oil. Free!',
 'Spazieren Sie durch die Steingassen des alten Dorfes. Traditionelle Häuser, byzantinische Kirchen, Imkereimuseum und lokale Geschäfte mit Honig und Olivenöl. Kostenlos!',
 'Разходете се по каменните улички на старото село. Традиционни къщи, византийски църкви, музей на пчеларството и местни магазини с мед и зехтин. Безплатно!',
 'Прогуляйтесь по каменным улочкам старой деревни. Традиционные дома, византийские церкви, музей пчеловодства и местные магазины с мёдом и оливковым маслом. Бесплатно!',
 'Plimbați-vă pe aleile de piatră ale satului vechi. Case tradiționale, biserici bizantine, muzeu al apiculturii și magazine locale cu miere și ulei de măsline. Gratuit!',
 'sithonia', 'Νικήτη, Σιθωνία', 40.2189, 23.6723, '',
 'historical', 'Free', '1-2h', 4.3, 2, '["village","walk","traditional","free","honey"]'::jsonb),

('wine-tasting-halkidiki', 'Γευσιγνωσία κρασιού', 'Wine Tasting', 'Weinverkostung', 'Дегустация на вино', 'Дегустация вин', 'Degustare de vinuri',
 'Επισκεφτείτε τα οινοποιεία της Χαλκιδικής και δοκιμάστε τοπικές ποικιλίες: Μαλαγουζιά, Ασύρτικο, Λημνιό. Ξενάγηση στους αμπελώνες και γευσιγνωσία με τοπικά τυριά.',
 'Visit Halkidiki wineries and taste local varieties: Malagousia, Assyrtiko, Limnio. Vineyard tours and tastings with local cheeses.',
 'Besuchen Sie die Weingüter von Chalkidiki und probieren Sie lokale Sorten: Malagousia, Assyrtiko, Limnio. Weinbergtouren und Verkostungen mit lokalem Käse.',
 'Посетете винарните на Халкидики и опитайте местни сортове: Малагузия, Асиртико, Лимнио. Обиколки на лозята и дегустации с местни сирена.',
 'Посетите винодельни Халкидики и попробуйте местные сорта: Малагусия, Асиртико, Лимнио. Экскурсии по виноградникам и дегустации с местными сырами.',
 'Vizitați cramele din Halkidiki și gustați soiuri locale: Malagousia, Assyrtiko, Limnio. Tururi prin vie și degustări cu brânzeturi locale.',
 'mainland', 'Χαλκιδική', 40.3012, 23.3456, '',
 'nature', '€15-25', '2-3h', 4.6, 2, '["wine","tasting","vineyard","local"]'::jsonb),

('jet-ski-sithonia', 'Jet Ski στη Σιθωνία', 'Jet Ski in Sithonia', 'Jet Ski in Sithonia', 'Джет ски в Ситония', 'Джет-ски в Ситонии', 'Jet Ski în Sithonia',
 'Ενοικίαση jet ski στις παραλίες της Σιθωνίας. Περιηγηθείτε στους κόλπους, ανακαλύψτε κρυφές παραλίες από τη θάλασσα. Διαθέσιμο σε Σάρτη, Βουρβουρού και Νικήτη.',
 'Jet ski rental on Sithonia beaches. Explore the bays, discover hidden beaches from the sea. Available in Sarti, Vourvourou and Nikiti.',
 'Jet Ski Verleih an den Stränden von Sithonia. Erkunden Sie die Buchten, entdecken Sie versteckte Strände vom Meer aus.',
 'Наем на джет ски на плажовете на Ситония. Разгледайте заливите, открийте скрити плажове от морето.',
 'Аренда джет-ски на пляжах Ситонии. Исследуйте бухты, откройте скрытые пляжи с моря.',
 'Închiriere jet ski pe plajele din Sithonia. Explorați golfurile, descoperiți plaje ascunse din mare.',
 'sithonia', 'Σάρτη / Βουρβουρού, Σιθωνία', 40.0734, 23.9623, '',
 'waterSports', '€40-70/30min', '30min-2h', 4.2, 1, '["jet-ski","water-sports","adventure","fun"]'::jsonb);


-- ============================================================
-- ACTIVITY REVIEWS
-- ============================================================

INSERT INTO activity_reviews (activity_id, author_name, rating, comment_el, comment_en, created_at) VALUES
-- Petralona Cave
((SELECT id FROM activities WHERE slug = 'petralona-cave'), 'Maria K.', 5, 'Εκπληκτικό! Τα παιδιά ενθουσιάστηκαν.', 'Amazing! The kids loved it.', '2024-06-15T00:00:00Z'),
((SELECT id FROM activities WHERE slug = 'petralona-cave'), 'Stefan W.', 4, 'Πολύ ενδιαφέρον, αξίζει τη βόλτα.', 'Very interesting, worth the trip.', '2024-07-20T00:00:00Z'),
((SELECT id FROM activities WHERE slug = 'petralona-cave'), 'Todor K.', 5, 'Μοναδική εμπειρία, δροσερά μέσα!', 'Unique experience, cool inside!', '2024-08-05T00:00:00Z'),
-- Kallithea Thermal Springs
((SELECT id FROM activities WHERE slug = 'kallithea-thermal-springs'), 'Elena V.', 5, 'Πανέμορφο μέρος, τέλεια ανακαίνιση!', 'Beautiful place, perfect renovation!', '2024-07-10T00:00:00Z'),
((SELECT id FROM activities WHERE slug = 'kallithea-thermal-springs'), 'Hans M.', 4, 'Αξίζει την επίσκεψη, ειδικά το ηλιοβασίλεμα.', 'Worth the visit, especially at sunset.', '2024-08-15T00:00:00Z'),
-- Diaporos Island Boat Trip
((SELECT id FROM activities WHERE slug = 'diaporos-island-boat-trip'), 'George T.', 5, 'Η καλύτερη εμπειρία στη Χαλκιδική!', 'The best experience in Halkidiki!', '2024-07-25T00:00:00Z'),
((SELECT id FROM activities WHERE slug = 'diaporos-island-boat-trip'), 'Laura S.', 5, 'Σαν Καραϊβική! Πρέπει να πάτε.', 'Like the Caribbean! You must go.', '2024-08-10T00:00:00Z'),
((SELECT id FROM activities WHERE slug = 'diaporos-island-boat-trip'), 'Ioana D.', 5, 'Μαγικά νερά, αξέχαστο!', 'Magical waters, unforgettable!', '2024-08-20T00:00:00Z'),
-- Mount Athos Cruise
((SELECT id FROM activities WHERE slug = 'mount-athos-cruise'), 'Vasilis G.', 5, 'Μοναδική εμπειρία! Τα μοναστήρια είναι εντυπωσιακά.', 'Unique experience! The monasteries are impressive.', '2024-07-18T00:00:00Z'),
((SELECT id FROM activities WHERE slug = 'mount-athos-cruise'), 'Alexei K.', 4, 'Ωραία βόλτα, κλείστε νωρίς!', 'Nice trip, book early!', '2024-08-01T00:00:00Z'),
-- Scuba Diving
((SELECT id FROM activities WHERE slug = 'scuba-diving-kassandra'), 'Nikos L.', 5, 'Τέλεια εμπειρία για πρώτη φορά!', 'Perfect first-time experience!', '2024-07-22T00:00:00Z'),
((SELECT id FROM activities WHERE slug = 'scuba-diving-kassandra'), 'Petra H.', 4, 'Πολύ καλοί εκπαιδευτές.', 'Very good instructors.', '2024-08-08T00:00:00Z'),
-- Old Nikiti Village Walk
((SELECT id FROM activities WHERE slug = 'old-nikiti-village-walk'), 'Cristina B.', 4, 'Γοητευτικό μέρος, αγοράστε τοπικό μέλι!', 'Charming place, buy local honey!', '2024-07-15T00:00:00Z'),
((SELECT id FROM activities WHERE slug = 'old-nikiti-village-walk'), 'Mircea L.', 5, 'Αυθεντική Ελλάδα, χωρίς τουρίστες.', 'Authentic Greece, without tourists.', '2024-08-12T00:00:00Z'),
-- Wine Tasting
((SELECT id FROM activities WHERE slug = 'wine-tasting-halkidiki'), 'Sofia N.', 5, 'Εξαιρετικά κρασιά! Η Μαλαγουζιά είναι φανταστική.', 'Excellent wines! Malagousia is fantastic.', '2024-06-20T00:00:00Z'),
((SELECT id FROM activities WHERE slug = 'wine-tasting-halkidiki'), 'Nikolay R.', 4, 'Ωραία εμπειρία, πάρτε μπουκάλια σπίτι!', 'Nice experience, take bottles home!', '2024-07-28T00:00:00Z'),
-- Jet Ski
((SELECT id FROM activities WHERE slug = 'jet-ski-sithonia'), 'Kosta D.', 4, 'Τρελή εμπειρία, τα νερά εδώ είναι τέλεια!', 'Crazy experience, the waters here are perfect!', '2024-08-05T00:00:00Z');


-- ============================================================
-- BLOG ARTICLES
-- ============================================================

INSERT INTO blog_articles (slug, title_el, title_en, title_de, title_bg, title_ru, title_ro, excerpt_el, excerpt_en, content_el, content_en, content_de, content_bg, content_ru, content_ro, category, image_url, author, read_time_min, tags, related_area_slugs, related_beach_slugs, related_listing_slugs, related_article_slugs, published_at) VALUES
('top-10-beaches-kassandra',
 'Οι 10 καλύτερες παραλίες στην Κασσάνδρα',
 'Top 10 beaches in Kassandra',
 'Die 10 besten Strände in Kassandra',
 'Топ 10 плажове в Касандра',
 'Топ-10 пляжей Кассандры',
 'Top 10 plaje în Kassandra',
 'Ανακαλύψτε τις πιο εντυπωσιακές παραλίες του πρώτου ποδιού της Χαλκιδικής. Από την εξωτική Σάνη μέχρι το ιστορικό Ποσείδι.',
 'Discover the most stunning beaches of Halkidiki''s first peninsula. From exotic Sani to historic Possidi.',
 E'Η Κασσάνδρα, το πρώτο πόδι της Χαλκιδικής, φημίζεται για τις εκπληκτικές παραλίες της. Εδώ είναι ο οδηγός μας για τις 10 καλύτερες:\n\n## 1. Σάνη\nΗ παραλία της Σάνης θεωρείται από τις ομορφότερες στη Μεσόγειο. Λευκή άμμος, τιρκουάζ νερά και ένας υγροβιότοπος που προστατεύεται. Ιδανική για οικογένειες χάρη στα ρηχά νερά.\n\n## 2. Ποσείδι\nΣτο ακρωτήρι Ποσείδι θα βρείτε μια μοναδική παραλία που εκτείνεται σε δύο πλευρές. Η μία πλευρά είναι ήρεμη, η άλλη έχει κύματα. Τα ηλιοβασιλέματα εδώ είναι μαγικά.\n\n## 3. Καλλιθέα\nΔίπλα στα ιστορικά ιαματικά λουτρά, η παραλία της Καλλιθέας προσφέρει τιρκουάζ νερά και πεύκα μέχρι τη θάλασσα. Πολλά beach bars για κάθε γούστο.\n\n## 4. Χανιώτη\nΗ πιο τουριστική παραλία της Κασσάνδρας, με αμμουδιά, θαλάσσια σπορ και ζωντανή ατμόσφαιρα. Ιδανική αν θέλετε διασκέδαση.\n\n## 5. Πευκοχώρι\nΜακριά αμμώδης παραλία με πεύκα. Πιο ήσυχη από τη Χανιώτη, ιδανική για χαλάρωση.\n\n## Πώς να φτάσετε\nΗ Κασσάνδρα απέχει περίπου 1 ώρα από τη Θεσσαλονίκη. Αν έρχεστε με ηλεκτρικό αυτοκίνητο, υπάρχουν φορτιστές στη Νέα Ποτίδαια και σε όλα τα μεγάλα χωριά.\n\n## Πού να μείνετε\nΥπάρχουν πολλές επιλογές καταλυμάτων σε όλη την Κασσάνδρα, από studios μέχρι πολυτελείς βίλες.',
 E'Kassandra, Halkidiki''s first peninsula, is famous for its stunning beaches. Here''s our guide to the top 10:\n\n## 1. Sani\nSani beach is considered one of the most beautiful in the Mediterranean. White sand, turquoise waters and a protected wetland. Perfect for families thanks to the shallow waters.\n\n## 2. Possidi\nAt Cape Possidi you''ll find a unique beach that extends on two sides. One side is calm, the other has waves. The sunsets here are magical.\n\n## 3. Kallithea\nNext to the historic thermal springs, Kallithea beach offers turquoise waters and pine trees reaching the sea. Many beach bars to suit every taste.\n\n## 4. Hanioti\nThe most touristic beach in Kassandra, with sand, water sports and a lively atmosphere. Ideal if you want entertainment.\n\n## 5. Pefkochori\nLong sandy beach with pine trees. Quieter than Hanioti, ideal for relaxation.\n\n## How to get there\nKassandra is about 1 hour from Thessaloniki. If you''re coming with an electric car, there are chargers at Nea Potidea and in all major villages.\n\n## Where to stay\nThere are many accommodation options throughout Kassandra, from studios to luxury villas.',
 E'Kassandra, die erste Halbinsel von Chalkidiki, ist berühmt für ihre atemberaubenden Strände. Hier ist unser Guide zu den Top 10:\n\n## 1. Sani\nDer Strand von Sani gilt als einer der schönsten im Mittelmeer. Weißer Sand, türkisfarbenes Wasser und ein geschütztes Feuchtgebiet.\n\n## 2. Possidi\nAm Kap Possidi finden Sie einen einzigartigen Strand, der sich auf zwei Seiten erstreckt.\n\n## 3. Kallithea\nNeben den historischen Thermalquellen bietet der Strand von Kallithea türkisfarbenes Wasser und Kiefern bis zum Meer.\n\n## Anreise\nKassandra ist etwa 1 Stunde von Thessaloniki entfernt. Für Elektroautos gibt es Ladestationen in Nea Potidea und in allen größeren Dörfern.',
 'Касандра, първият полуостров на Халкидики, е известна с невероятните си плажове. Ето нашия пътеводител за топ 10.',
 'Кассандра, первый полуостров Халкидики, славится своими потрясающими пляжами. Вот наш гид по топ-10.',
 'Kassandra, prima peninsulă a Halkidiki, este renumită pentru plajele sale uimitoare. Iată ghidul nostru pentru top 10.',
 'beaches', '/images/areas/kassandra.jpg', 'Halkidiki Hub', 8,
 '["kassandra","beaches","summer","family"]'::jsonb,
 '["kassandra"]'::jsonb,
 '["possidi-kassandra","kallithea-kassandra","sani-kassandra","hanioti-kassandra"]'::jsonb,
 '["studio-hanioti-kassandra","luxury-suite-pefkochori","beachfront-apartment-kallithea"]'::jsonb,
 '["sithonia-hidden-gems","ev-charging-guide-halkidiki"]'::jsonb,
 '2024-05-15T00:00:00Z'),

('sithonia-hidden-gems',
 'Σιθωνία: Τα κρυμμένα διαμάντια',
 'Sithonia: Hidden gems',
 'Sithonia: Versteckte Juwelen',
 'Ситония: Скрити съкровища',
 'Ситония: Скрытые жемчужины',
 'Sithonia: Comori ascunse',
 'Εξερευνήστε τις μυστικές παραλίες και τα γραφικά χωριά της Σιθωνίας. Ο πιο ήσυχος πόδι της Χαλκιδικής κρύβει εκπλήξεις.',
 'Explore the secret beaches and picturesque villages of Sithonia. Halkidiki''s quietest peninsula hides surprises.',
 E'Η Σιθωνία είναι ο μυστικός παράδεισος της Χαλκιδικής. Ενώ η Κασσάνδρα τραβάει τα πλήθη, η Σιθωνία προσφέρει αυθεντικές εμπειρίες σε όσους αναζητούν ηρεμία.\n\n## Παραλία Καρύδι\nΗ πιο φωτογραφημένη παραλία της Ελλάδας! Εξωτικά τιρκουάζ νερά μέσα σε πεύκα. Πηγαίνετε νωρίς το πρωί για να αποφύγετε τον κόσμο.\n\n## Πορτοκάλι (Orange Beach)\nΜια κρυφή παραλία που θα τη βρείτε μόνο αν ξέρετε. Πρόσβαση μέσω χωματόδρομου, αλλά αξίζει κάθε λεπτό.\n\n## Βουρβουρού & Νησάκι Διάπορος\nΚάντε βόλτα με βάρκα στα νησάκια. Τα νερά θυμίζουν Καραϊβική. Από τη Βουρβουρού ξεκινούν καθημερινές εκδρομές.\n\n## Παλιά Νικήτη\nΤο παραδοσιακό χωριό με πέτρινα σπίτια, στενά σοκάκια και ταβέρνες. Ιδανικό για βόλτα το απόγευμα.\n\n## Σάρτη\nΜεγάλη παραλία με θέα στο Άγιο Όρος. Ιδανική βάση για εξερεύνηση της νότιας Σιθωνίας.\n\n## Tip: Ενοικίαση αυτοκινήτου\nΗ Σιθωνία χρειάζεται αυτοκίνητο. Οι δρόμοι είναι καλοί αλλά τα μέσα μαζικής μεταφοράς περιορισμένα. Αν έχετε ηλεκτρικό, υπάρχουν φορτιστές στη Νικήτη και τη Βουρβουρού.',
 E'Sithonia is Halkidiki''s secret paradise. While Kassandra attracts the crowds, Sithonia offers authentic experiences for those seeking tranquility.\n\n## Karidi Beach\nThe most photographed beach in Greece! Exotic turquoise waters surrounded by pine trees. Go early in the morning to avoid crowds.\n\n## Orange Beach (Portokali)\nA hidden beach you''ll only find if you know where to look. Access via dirt road, but worth every minute.\n\n## Vourvourou & Diaporos Island\nTake a boat trip to the small islands. The waters remind you of the Caribbean. Daily excursions depart from Vourvourou.\n\n## Old Nikiti\nA traditional village with stone houses, narrow alleys and tavernas. Perfect for an afternoon stroll.\n\n## Sarti\nLarge beach with views of Mount Athos. Ideal base for exploring southern Sithonia.\n\n## Tip: Car rental\nSithonia needs a car. Roads are good but public transport is limited. If you have an EV, there are chargers in Nikiti and Vourvourou.',
 'Sithonia ist Chalkidikis geheimer Paradies. Während Kassandra die Massen anzieht, bietet Sithonia authentische Erlebnisse.',
 'Ситония е тайният рай на Халкидики. Докато Касандра привлича тълпите, Ситония предлага автентични преживявания.',
 'Ситония — тайный рай Халкидики. Пока Кассандра привлекает толпы, Ситония предлагает подлинные впечатления.',
 'Sithonia este paradisul secret al Halkidiki. În timp ce Kassandra atrage mulțimile, Sithonia oferă experiențe autentice.',
 'guides', '/images/beaches/karidi.jpg', 'Halkidiki Hub', 7,
 '["sithonia","hidden","nature","beaches"]'::jsonb,
 '["sithonia"]'::jsonb,
 '["karidi-sithonia","portokali-sithonia","vourvourou-sithonia","sarti-sithonia"]'::jsonb,
 '["villa-sithonia-vourvourou","traditional-house-nikiti"]'::jsonb,
 '["top-10-beaches-kassandra","best-tavernas-halkidiki"]'::jsonb,
 '2024-06-01T00:00:00Z'),

('ev-charging-guide-halkidiki',
 'Οδηγός φόρτισης EV στη Χαλκιδική',
 'EV charging guide for Halkidiki',
 'EV-Ladeguide für Chalkidiki',
 'Пътеводител за зареждане на EV в Халкидики',
 'Гид по зарядке EV в Халкидики',
 'Ghid de încărcare EV pentru Halkidiki',
 'Όλα όσα πρέπει να ξέρετε για τη φόρτιση του ηλεκτρικού σας αυτοκινήτου στη Χαλκιδική. Σταθμοί, τιμές και tips.',
 'Everything you need to know about charging your EV in Halkidiki. Stations, prices and tips.',
 E'Ταξιδεύετε στη Χαλκιδική με ηλεκτρικό αυτοκίνητο; Εδώ είναι ο πλήρης οδηγός μας.\n\n## Δίκτυο φορτιστών\nΗ Χαλκιδική έχει αναπτύξει σημαντικά το δίκτυο φορτιστών τα τελευταία χρόνια. Οι κύριοι πάροχοι:\n\n- **ΔΕΗ Blue**: Οι περισσότεροι σταθμοί, rapid charging (50-100kW)\n- **Protergia**: Αξιόπιστοι σταθμοί σε στρατηγικά σημεία\n- **Ξενοδοχεία**: Πολλά ξενοδοχεία προσφέρουν δωρεάν αργή φόρτιση (7-22kW)\n\n## Στρατηγική φόρτισης\n1. **Πριν μπείτε στη χερσόνησο**: Φορτίστε στη Νέα Ποτίδαια ή Νέα Μουδανιά\n2. **Κατά τη διάρκεια**: Φορτίζετε ενώ κάνετε μπάνιο ή τρώτε\n3. **Overnight**: Πολλά καταλύματα έχουν φορτιστές Type 2\n\n## Κόστος\n- Rapid charging (50kW+): €0.40-0.50/kWh\n- AC charging (22kW): €0.35-0.45/kWh\n- Ξενοδοχεία: Συνήθως δωρεάν για τους ένοικους\n\n## Tips\n- Κατεβάστε την εφαρμογή του παρόχου πριν φτάσετε\n- Σε peak season (Ιούλιο-Αύγουστο) οι σταθμοί μπορεί να έχουν αναμονή\n- Η αυτονομία 300km+ είναι αρκετή για να εξερευνήσετε άνετα κάθε πόδι',
 E'Traveling to Halkidiki with an electric car? Here''s our complete guide.\n\n## Charging network\nHalkidiki has significantly developed its charging network in recent years. Main providers:\n\n- **DEH Blue**: Most stations, rapid charging (50-100kW)\n- **Protergia**: Reliable stations at strategic points\n- **Hotels**: Many hotels offer free slow charging (7-22kW)\n\n## Charging strategy\n1. **Before entering the peninsula**: Charge at Nea Potidea or Nea Moudania\n2. **During the day**: Charge while swimming or eating\n3. **Overnight**: Many accommodations have Type 2 chargers\n\n## Cost\n- Rapid charging (50kW+): €0.40-0.50/kWh\n- AC charging (22kW): €0.35-0.45/kWh\n- Hotels: Usually free for guests\n\n## Tips\n- Download the provider''s app before arriving\n- In peak season (July-August) stations may have queues\n- A 300km+ range is enough to comfortably explore each peninsula',
 'Reisen Sie mit einem Elektroauto nach Chalkidiki? Hier ist unser vollständiger Leitfaden.',
 'Пътувате до Халкидики с електрически автомобил? Ето нашия пълен пътеводител.',
 'Путешествуете в Халкидики на электромобиле? Вот наш полный гид.',
 'Călătoriți în Halkidiki cu o mașină electrică? Iată ghidul nostru complet.',
 'tips', '/images/chargers/deh-blue.jpg', 'Halkidiki Hub', 5,
 '["ev","charging","electric-car","tips"]'::jsonb,
 '["kassandra","sithonia","mainland"]'::jsonb,
 '[]'::jsonb,
 '["apartment-nea-moudania"]'::jsonb,
 '["top-10-beaches-kassandra","getting-around-halkidiki"]'::jsonb,
 '2024-04-20T00:00:00Z'),

('best-tavernas-halkidiki',
 'Οι καλύτερες ταβέρνες της Χαλκιδικής',
 'Best tavernas in Halkidiki',
 'Die besten Tavernen in Chalkidiki',
 'Най-добрите таверни в Халкидики',
 'Лучшие таверны Халкидики',
 'Cele mai bune taverne din Halkidiki',
 'Φρέσκα θαλασσινά, παραδοσιακές συνταγές και θέα θάλασσα. Οι ταβέρνες που πρέπει να επισκεφτείτε.',
 'Fresh seafood, traditional recipes and sea views. The tavernas you must visit.',
 E'Η Χαλκιδική δεν είναι μόνο παραλίες - είναι και γαστρονομικός προορισμός. Ανακαλύψτε τις ταβέρνες που αξίζει να δοκιμάσετε.\n\n## Κασσάνδρα\nΣτα Χανιώτη και την Καλλιθέα θα βρείτε ταβέρνες με φρέσκα ψάρια δίπλα στη θάλασσα. Μην παραλείψετε τον αχινό και τα μύδια.\n\n## Σιθωνία\nΗ Νικήτη και η Σάρτη έχουν αυθεντικές ψαροταβέρνες. Στην παλιά Νικήτη δοκιμάστε τα τοπικά κρασιά.\n\n## Τι να δοκιμάσετε\n- **Αχινοσαλάτα**: Η τοπική σπεσιαλιτέ\n- **Ψητή σαρδέλα**: Φρέσκια από το Θερμαϊκό\n- **Μπουγάτσα**: Για πρωινό στη Νέα Μουδανιά\n- **Τοπικά κρασιά**: Λημνιό, Μαλαγουζιά\n\n## Tip\nΚάνετε κράτηση τον Αύγουστο - οι καλύτερες ταβέρνες γεμίζουν γρήγορα!',
 E'Halkidiki isn''t just about beaches - it''s a gastronomic destination too. Discover the tavernas worth trying.\n\n## Kassandra\nIn Hanioti and Kallithea you''ll find tavernas with fresh fish right by the sea. Don''t miss the sea urchin and mussels.\n\n## Sithonia\nNikiti and Sarti have authentic fish tavernas. In old Nikiti try the local wines.\n\n## What to try\n- **Sea urchin salad**: The local specialty\n- **Grilled sardines**: Fresh from the Thermaic Gulf\n- **Bougatsa**: For breakfast in Nea Moudania\n- **Local wines**: Limnio, Malagousia',
 'Chalkidiki ist nicht nur Strände - es ist auch ein gastronomisches Reiseziel.',
 'Халкидики не е само плажове - това е и гастрономическа дестинация.',
 'Халкидики — это не только пляжи, но и гастрономическое направление.',
 'Halkidiki nu este doar despre plaje - este și o destinație gastronomică.',
 'food', '', 'Halkidiki Hub', 6,
 '["food","tavernas","seafood","wine"]'::jsonb,
 '["kassandra","sithonia","mainland"]'::jsonb,
 '["kallithea-kassandra","sarti-sithonia"]'::jsonb,
 '["studio-hanioti-kassandra","traditional-house-nikiti"]'::jsonb,
 '["top-10-beaches-kassandra","sithonia-hidden-gems"]'::jsonb,
 '2024-06-20T00:00:00Z'),

('getting-around-halkidiki',
 'Πώς να μετακινηθείτε στη Χαλκιδική',
 'Getting around Halkidiki',
 'Fortbewegung in Chalkidiki',
 'Как да се придвижвате в Халкидики',
 'Как передвигаться по Халкидики',
 'Cum să vă deplasați în Halkidiki',
 'Ενοικίαση αυτοκινήτου, λεωφορεία, ταξί ή ηλεκτρικό; Ο πλήρης οδηγός μεταφοράς.',
 'Car rental, buses, taxis or electric? The complete transport guide.',
 E'Η Χαλκιδική δεν έχει αεροδρόμιο - το πλησιέστερο είναι "Μακεδονία" Θεσσαλονίκης. Πώς θα φτάσετε και πώς θα εξερευνήσετε:\n\n## Από Θεσσαλονίκη\n- **Αυτοκίνητο**: 1-2 ώρες ανάλογα τον προορισμό\n- **ΚΤΕΛ**: Τακτικά δρομολόγια για Κασσάνδρα, Σιθωνία\n- **Transfer**: Πολλά ξενοδοχεία προσφέρουν μεταφορά\n\n## Ενοικίαση αυτοκινήτου\nΗ καλύτερη επιλογή για ελευθερία. Νοικιάστε από Θεσσαλονίκη ή τοπικά. Τιμές: €30-60/ημέρα.\n\n## Ηλεκτρικό αυτοκίνητο\nΌλο και πιο εφικτό! Δείτε τον οδηγό μας για φορτιστές EV.\n\n## Μέσα στη Χαλκιδική\n- **Κασσάνδρα**: Καλό οδικό δίκτυο, εύκολη πρόσβαση\n- **Σιθωνία**: Χρειάζεται αυτοκίνητο, ορισμένες παραλίες με χωματόδρομο\n- **Άθως**: Μόνο αυτοκίνητο, πιο απομονωμένο\n\n## Tip\nΚλείστε αυτοκίνητο νωρίς τον Ιούλιο-Αύγουστο. Η ζήτηση εκτοξεύεται.',
 E'Halkidiki has no airport - the nearest is Thessaloniki''s "Macedonia". How to get there and explore:\n\n## From Thessaloniki\n- **Car**: 1-2 hours depending on destination\n- **KTEL bus**: Regular services to Kassandra, Sithonia\n- **Transfer**: Many hotels offer transport\n\n## Car rental\nThe best option for freedom. Rent from Thessaloniki or locally. Prices: €30-60/day.\n\n## Electric car\nIncreasingly feasible! See our EV charging guide.\n\n## Within Halkidiki\n- **Kassandra**: Good road network, easy access\n- **Sithonia**: Needs a car, some beaches via dirt road\n- **Athos**: Car only, more isolated',
 'Chalkidiki hat keinen Flughafen - der nächste ist Thessalonikis "Macedonia".',
 'Халкидики няма летище - най-близкото е "Македония" в Солун.',
 'В Халкидики нет аэропорта - ближайший — "Македония" в Салониках.',
 'Halkidiki nu are aeroport - cel mai apropiat este "Macedonia" din Thessaloniki.',
 'tips', '', 'Halkidiki Hub', 5,
 '["transport","car-rental","bus","tips"]'::jsonb,
 '["kassandra","sithonia","athos","mainland"]'::jsonb,
 '[]'::jsonb,
 '["apartment-nea-moudania"]'::jsonb,
 '["ev-charging-guide-halkidiki","sithonia-hidden-gems"]'::jsonb,
 '2024-04-01T00:00:00Z'),

('mount-athos-guide',
 'Άγιο Όρος: Ό,τι πρέπει να ξέρετε',
 'Mount Athos: Everything you need to know',
 'Berg Athos: Alles was Sie wissen müssen',
 'Света Гора: Всичко, което трябва да знаете',
 'Гора Афон: Всё, что нужно знать',
 'Muntele Athos: Tot ce trebuie să știți',
 'Ιστορία, πνευματικότητα και μοναδική φύση. Πώς να επισκεφτείτε το τρίτο πόδι της Χαλκιδικής.',
 'History, spirituality and unique nature. How to visit Halkidiki''s third peninsula.',
 E'Ο Άθως, το τρίτο πόδι της Χαλκιδικής, είναι ένας κόσμος μοναδικός. Η Αυτόνομη Μοναστική Πολιτεία του Αγίου Όρους φιλοξενεί 20 μοναστήρια.\n\n## Επίσκεψη στο Άγιο Όρος\n- **Άνδρες μόνο**: Η πρόσβαση επιτρέπεται μόνο σε άνδρες\n- **Διαμονητήριο**: Χρειάζεται ειδική άδεια\n- **Πλοίο**: Αναχώρηση από Ουρανούπολη\n\n## Γύρω από τον Άθω\nΑν δεν μπορείτε να μπείτε, η κρουαζιέρα γύρω από τα μοναστήρια αξίζει. Αναχωρήσεις από Ουρανούπολη και Ιερισσό.\n\n## Παραλίες\nΟι παραλίες στην ευρύτερη περιοχή (Κομίτσα, Ντεβελίκι) είναι ήσυχες και ανέγγιχτες.\n\n## Πού να μείνετε\nΗ Ιερισσός και η Ουρανούπολη είναι οι βάσεις. Λιγότερα τουριστικά, πιο αυθεντικά.',
 E'Athos, Halkidiki''s third peninsula, is a unique world. The Autonomous Monastic State of Mount Athos hosts 20 monasteries.\n\n## Visiting Mount Athos\n- **Men only**: Access is permitted only for men\n- **Diamonitirion**: A special permit is required\n- **Boat**: Departure from Ouranoupolis\n\n## Around Athos\nIf you can''t enter, the cruise around the monasteries is worth it. Departures from Ouranoupolis and Ierissos.\n\n## Beaches\nThe beaches in the wider area (Komitsa, Develiki) are quiet and untouched.',
 'Athos, die dritte Halbinsel von Chalkidiki, ist eine einzigartige Welt.',
 'Атон, третият полуостров на Халкидики, е уникален свят.',
 'Афон, третий полуостров Халкидики, — уникальный мир.',
 'Athos, a treia peninsulă a Halkidiki, este o lume unică.',
 'culture', '/images/areas/athos.jpg', 'Halkidiki Hub', 6,
 '["athos","monasteries","culture","history"]'::jsonb,
 '["athos"]'::jsonb,
 '["develiki-athos","komitsa-athos"]'::jsonb,
 '[]'::jsonb,
 '["getting-around-halkidiki","sithonia-hidden-gems"]'::jsonb,
 '2024-05-01T00:00:00Z'),

('family-vacation-halkidiki',
 'Οικογενειακές διακοπές στη Χαλκιδική',
 'Family vacation in Halkidiki',
 'Familienurlaub in Chalkidiki',
 'Семейна ваканция в Халкидики',
 'Семейный отдых в Халкидики',
 'Vacanță de familie în Halkidiki',
 'Ρηχά νερά, ασφαλείς παραλίες, παιδικά πάρκα. Γιατί η Χαλκιδική είναι ο ιδανικός προορισμός για οικογένειες.',
 'Shallow waters, safe beaches, kids parks. Why Halkidiki is the perfect family destination.',
 E'Η Χαλκιδική είναι ίσως ο καλύτερος προορισμός στην Ελλάδα για οικογένειες. Ρηχά νερά, οργανωμένες παραλίες και πολλές δραστηριότητες.\n\n## Καλύτερες παραλίες για παιδιά\n1. **Σάνη** - Ρηχά νερά σε μεγάλη απόσταση\n2. **Βουρβουρού** - Ζεστά, ήρεμα νερά\n3. **Ποσείδι** - Αμμώδης, ρηχή, ιδανική\n4. **Νέα Ποτίδαια** - Πολύ ρηχή, με παιδική χαρά κοντά\n\n## Δραστηριότητες\n- Waterparks σε Κασσάνδρα και Σιθωνία\n- Mini golf στα Χανιώτη\n- Boat trips στα νησάκια Βουρβουρού\n- Σπήλαιο Πετραλώνων - εκπαιδευτική εκδρομή\n\n## Τι να προσέξετε\n- Αντηλιακό και καπέλα - ο ήλιος είναι δυνατός\n- Κρατήστε κατάλυμα κοντά σε παραλία\n- Ψάξτε για καταλύματα με κουζίνα',
 E'Halkidiki is perhaps the best destination in Greece for families. Shallow waters, organized beaches and many activities.\n\n## Best beaches for kids\n1. **Sani** - Shallow water for a long distance\n2. **Vourvourou** - Warm, calm waters\n3. **Possidi** - Sandy, shallow, perfect\n4. **Nea Potidea** - Very shallow, playground nearby\n\n## Activities\n- Waterparks in Kassandra and Sithonia\n- Mini golf in Hanioti\n- Boat trips to Vourvourou islands\n- Petralona Cave - educational excursion',
 'Chalkidiki ist vielleicht das beste Reiseziel in Griechenland für Familien.',
 'Халкидики е може би най-добрата дестинация в Гърция за семейства.',
 'Халкидики — возможно, лучшее место в Греции для семей.',
 'Halkidiki este poate cea mai bună destinație din Grecia pentru familii.',
 'guides', '', 'Halkidiki Hub', 5,
 '["family","kids","beaches","activities"]'::jsonb,
 '["kassandra","sithonia"]'::jsonb,
 '["sani-kassandra","vourvourou-sithonia","possidi-kassandra","potidea-mainland"]'::jsonb,
 '["studio-hanioti-kassandra","villa-sithonia-vourvourou"]'::jsonb,
 '["top-10-beaches-kassandra","best-tavernas-halkidiki"]'::jsonb,
 '2024-07-01T00:00:00Z'),

('when-to-visit-halkidiki',
 'Πότε να επισκεφτείτε τη Χαλκιδική',
 'When to visit Halkidiki',
 'Wann sollte man Chalkidiki besuchen',
 'Кога да посетите Халкидики',
 'Когда ехать в Халкидики',
 'Când să vizitați Halkidiki',
 'Κάθε εποχή έχει τα πλεονεκτήματά της. Βρείτε την ιδανική περίοδο για εσάς.',
 'Every season has its advantages. Find the ideal period for you.',
 E'## Μάιος - Ιούνιος: Η χρυσή εποχή\nΖεστασιά χωρίς καύσωνα, ήρεμες παραλίες, χαμηλές τιμές. Ιδανικά για ζευγάρια.\n\n## Ιούλιος - Αύγουστος: Peak season\nΖέστη, πολύς κόσμος αλλά ζωντανή ατμόσφαιρα. Κλείστε νωρίς!\n\n## Σεπτέμβριος: Ο κρυφός θησαυρός\nΖεστή θάλασσα, λιγότερος κόσμος, χαμηλότερες τιμές. Ίσως ο καλύτερος μήνας.\n\n## Θερμοκρασίες\n- Μάιος: 20-26°C\n- Ιούνιος: 25-31°C\n- Ιούλιος-Αύγουστος: 28-35°C\n- Σεπτέμβριος: 24-30°C\n- Θάλασσα: 22-27°C (Ιούνιος-Σεπτέμβριος)',
 E'## May - June: The golden season\nWarmth without heatwave, calm beaches, low prices. Ideal for couples.\n\n## July - August: Peak season\nHot, crowded but lively atmosphere. Book early!\n\n## September: The hidden treasure\nWarm sea, fewer crowds, lower prices. Perhaps the best month.\n\n## Temperatures\n- May: 20-26°C\n- June: 25-31°C\n- July-August: 28-35°C\n- September: 24-30°C\n- Sea: 22-27°C (June-September)',
 E'## Mai - Juni: Die goldene Jahreszeit\nWärme ohne Hitzewelle, ruhige Strände, niedrige Preise.',
 E'## Май - Юни: Златният сезон\nТоплина без жега, спокойни плажове, ниски цени.',
 E'## Май - Июнь: Золотой сезон\nТепло без жары, спокойные пляжи, низкие цены.',
 E'## Mai - Iunie: Sezonul de aur\nCăldură fără caniculă, plaje liniștite, prețuri mici.',
 'tips', '', 'Halkidiki Hub', 4,
 '["weather","season","planning","tips"]'::jsonb,
 '["kassandra","sithonia","athos","mainland"]'::jsonb,
 '[]'::jsonb,
 '[]'::jsonb,
 '["getting-around-halkidiki","family-vacation-halkidiki","top-10-beaches-kassandra"]'::jsonb,
 '2024-03-15T00:00:00Z');

COMMIT;
