-- 006_real_restaurants.sql
-- Insert 15 real restaurants / tavernas across Halkidiki
-- Areas: kassandra, sithonia, athos

BEGIN;

-- ============================================================
-- KASSANDRA
-- ============================================================

INSERT INTO restaurants (
  slug, name_el, name_en,
  description_el, description_en,
  area, location_name, latitude, longitude,
  image_url, cuisine, price_level, rating, reviews_count,
  phone, hours,
  has_sea_view, has_live_music, accepts_reservations, tags
) VALUES

-- 1. Marina - Afytos
(
  'marina-afytos',
  'Marina',
  'Marina',
  'Ενα απο τα πιο βραβευμενα εστιατορια της Χαλκιδικης, το Marina στους Αφυτους προσφερει μια μοναδικη γαστρονομικη εμπειρια με θεα στον Θερμαικο κολπο. Η κουζινα βασιζεται σε φρεσκα θαλασσινα και τοπικα υλικα, με δημιουργικες πινελιες που αναδεικνυουν τη μεσογειακη παραδοση. Δοκιμαστε το καρπατσιο τσιπουρας, τα ζυμαρικα με αστακο και τα φρεσκα ψαρια της ημερας ψημενα στα καρβουνα. Η βεραντα με θεα θαλασσα ειναι ιδανικη για ρομαντικα δειπνα, ενω ο κηπος προσφερει ενα γαληνιο περιβαλλον για οικογενειακα γευματα. Εξαιρετικη λιστα κρασιων με ετικετες απο ολη την Ελλαδα.',
  'One of the most awarded restaurants in Halkidiki, Marina in Afytos offers an exceptional dining experience overlooking the Thermaic Gulf. The kitchen focuses on fresh seafood and local ingredients with creative Mediterranean touches. Try the sea bream carpaccio, lobster pasta, and charcoal-grilled catch of the day. The sea-view terrace is perfect for romantic dinners, while the garden provides a serene setting for family meals. Excellent wine list featuring labels from across Greece.',
  'kassandra', 'Afytos', 40.0975, 23.4342,
  '', '["seafood", "mediterranean", "fineDining"]', 'premium', 4.7, 820,
  '', '13:00-00:00',
  true, false, true,
  '["awarded", "sea-view", "romantic", "fresh-fish", "wine-list", "afytos", "terrace"]'
),

-- 2. Klimataria - Afytos
(
  'klimataria-afytos',
  'Κλειματαρια',
  'Klimataria',
  'Κρυμμενο στα πετρινα σοκακια του Αφυτου, το Κλειματαρια ειναι ενα παραδοσιακο ταβερνακι που μεταφερει τον επισκεπτη σε αλλη εποχη. Κατω απο τις κληματαριες και με θεα στη θαλασσα, απολαμβανετε σπιτικα πιατα οπως μουσακα, γεμιστα, παστιτσιο και κοτοπουλο λεμονατο. Τα μεζεδακια ειναι εξαιρετικα - δοκιμαστε τα κολοκυθοκεφτεδες, τη φετα ψητη στο φυλλο και τις τηγανιτες πιπεριες. Η ατμοσφαιρα ειναι ζεστη και φιλοξενη, ιδανικη για οικογενειες. Οι τιμες ειναι λογικες και οι μεριδες γενναιοδωρες, κανοντας το ιδανικο για ενα αυθεντικο ελληνικο γευμα.',
  'Hidden in the stone-paved alleys of Afytos, Klimataria is a traditional taverna that transports visitors to another era. Under the vine canopy with sea views, enjoy homemade dishes like moussaka, stuffed peppers, pastitsio, and lemon chicken. The appetizers are outstanding -- try the zucchini fritters, baked feta in phyllo, and fried peppers. Warm, welcoming atmosphere ideal for families. Reasonable prices and generous portions make it perfect for an authentic Greek meal.',
  'kassandra', 'Afytos', 40.0969, 23.4338,
  '', '["traditional", "grill"]', 'moderate', 4.5, 645,
  '', '12:00-00:00',
  true, false, true,
  '["traditional", "homemade", "sea-view", "vine-terrace", "family", "afytos", "stone-alley"]'
),

-- 3. Massalia - Nea Fokea
(
  'massalia-nea-fokea',
  'Massalia',
  'Massalia',
  'Το Massalia στη Νεα Φωκαια ειναι ενα μοντερνο εστιατοριο που συνδυαζει τη δημιουργικη ελληνικη κουζινα με φρεσκα τοπικα υλικα. Βρισκεται κοντα στην ιστορικη πλατεια με τον βυζαντινο πυργο και την εκκλησια, προσφεροντας ενα κομψο περιβαλλον για γευμα ή δειπνο. Ξεχωριζουν τα πιατα με φρεσκα ψαρια, οι σαλατες με τοπικα τυρια και μελι, καθως και τα κρεατικα ψημενα σε ξυλοκαρβουνο. Η χαλκιδικιωτικη ελια και το ελαιολαδο πρωταγωνιστουν σε καθε πιατο. Φιλικο προσωπικο και ωραια λιστα τοπικων κρασιων.',
  'Massalia in Nea Fokea is a modern restaurant blending creative Greek cuisine with fresh local ingredients. Located near the historic square with the Byzantine tower and church, it offers an elegant setting for lunch or dinner. Standout dishes include fresh fish plates, salads with local cheese and honey, and charcoal-grilled meats. Halkidiki olives and olive oil feature prominently in every dish. Friendly staff and a fine selection of local wines.',
  'kassandra', 'Nea Fokea', 40.1234, 23.3156,
  '', '["mediterranean", "traditional", "grill"]', 'moderate', 4.4, 380,
  '', '12:00-23:30',
  false, false, true,
  '["creative-cuisine", "local-ingredients", "nea-fokea", "olive-oil", "wine", "modern"]'
),

-- 4. Bakalis - Pefkochori
(
  'bakalis-pefkochori',
  'Μπακαλης',
  'Bakalis',
  'Ο Μπακαλης στο Πευκοχωρι ειναι μια οικογενειακη ταβερνα που λειτουργει εδω και δεκαετιες, γνωστη για τα σπιτικα φαγητα και τις φιλικες τιμες. Οι μεριδες ειναι τεραστιες και τα πιατα μαγειρευονται με αγαπη, ακριβως οπως στο σπιτι. Ανάμεσα στα αγαπημενα ξεχωριζουν το στιφαδο βοδινο, τα ζυμαρικα με καλαμαρι σε σαλτσα ντοματας, η τηγανητη βατος (σελαχι) και τα φρεσκα σαλιγκαρια. Οι σαλατες ετοιμαζονται με ντοματες και λαχανικα απο τοπικους παραγωγους. Ιδανικο για οικογενειες που αναζητουν αυθεντικη ελληνικη κουζινα χωρις περιττες πολυτελειες.',
  'Bakalis in Pefkochori is a family-run taverna that has been serving homemade food for decades, known for generous portions and friendly prices. Dishes are cooked with love, just like home. Favorites include beef stifado, squid pasta in tomato sauce, fried skate, and fresh snails. Salads are made with tomatoes and vegetables from local producers. Ideal for families seeking authentic Greek cuisine without pretension.',
  'kassandra', 'Pefkochori', 39.9654, 23.6123,
  '', '["traditional", "seafood", "grill"]', 'budget', 4.3, 520,
  '', '11:00-23:00',
  false, false, false,
  '["family", "homemade", "budget", "stifado", "pefkochori", "generous-portions"]'
),

-- 5. Thea Thalassa - Afytos
(
  'thea-thalassa-afytos',
  'Θεα Θαλασσα',
  'Thea Thalassa',
  'Το Θεα Θαλασσα, οπως μαρτυρα και το ονομα του, προσφερει πανοραμικη θεα στον Θερμαικο κολπο απο τον βραχο του Αφυτου. Ειδικευεται σε φρεσκα ψαρια και θαλασσινα που φτανουν καθημερινα απο τοπικους ψαραδες. Δοκιμαστε τη φρεσκια τσιπουρα στα καρβουνα, τα χταποδακια σχαρας, τη γαριδομακαροναδα και τις αχνιστες μυδοπιλαφο. Η αυλη με τα πετρινα τοιχια και τα κερια το βραδυ δημιουργει μαγικη ατμοσφαιρα. Ιδανικο για δειπνο με ηλιοβασιλεμα. Οι τιμες ειναι λογικες για την ποιοτητα που προσφερεται.',
  'As its name ("Sea View") promises, Thea Thalassa offers panoramic views of the Thermaic Gulf from the Afytos cliff edge. It specializes in fresh fish and seafood delivered daily by local fishermen. Try the charcoal-grilled sea bream, grilled octopus, shrimp pasta, and steamed mussel pilaf. The stone-walled courtyard lit by candles in the evening creates a magical atmosphere. Perfect for sunset dinners. Prices are reasonable for the quality offered.',
  'kassandra', 'Afytos', 40.0971, 23.4345,
  '', '["seafood", "grill"]', 'moderate', 4.6, 710,
  '', '12:00-00:00',
  true, false, true,
  '["sea-view", "fresh-fish", "sunset", "panoramic", "afytos", "cliff", "romantic"]'
),

-- ============================================================
-- SITHONIA
-- ============================================================

-- 6. Ta Kymata - Neos Marmaras
(
  'ta-kymata-neos-marmaras',
  'Τα Κυματα',
  'Ta Kymata',
  'Τα Κυματα στον Νεο Μαρμαρα λειτουργουν απο το 1950, αποτελωντας εναν απο τους παλαιοτερους ψαροταβερνες της Σιθωνιας. Βρισκεται ακριβως πανω στο λιμανι, με τραπεζια διπλα στη θαλασσα. Η ψαροσουπα ειναι θρυλικη, φτιαγμενη με φρεσκα ψαρια της ημερας. Δοκιμαστε επισης τα τηγανητα μπαρμπουνια, την ψητη συναγριδα, τα καλαμαρακια και τη φρεσκια σαλατα με καπαρη Σιθωνιας. Η εξυπηρετηση ειναι φιλικη και οικογενειακη. Ιδανικο μερος για να δειτε τα ψαροκαικα να μπαινουν στο λιμανι ενω απολαμβανετε το γευμα σας.',
  'Ta Kymata in Neos Marmaras has been operating since 1950, making it one of the oldest fish tavernas in Sithonia. Located right on the harbor, with tables beside the sea. The fish soup is legendary, made with the freshest catch of the day. Also try the fried red mullet, grilled snapper, calamari, and fresh salad with Sithonia capers. Family-friendly service. A perfect spot to watch the fishing boats come into port while enjoying your meal.',
  'sithonia', 'Neos Marmaras', 40.0867, 23.7645,
  '', '["seafood", "traditional"]', 'moderate', 4.5, 890,
  '', '11:00-00:00',
  true, false, false,
  '["historic", "since-1950", "harbor", "fish-soup", "waterfront", "neos-marmaras", "family"]'
),

-- 7. To Simadi - Neos Marmaras (Paradeisos)
(
  'to-simadi-neos-marmaras',
  'Το Σημαδι',
  'To Simadi',
  'Το Σημαδι βρισκεται στην παραλια Παραδεισος κοντα στον Νεο Μαρμαρα, ενα ρομαντικο εστιατοριο δίπλα στη θαλασσα με εκπληκτικα ηλιοβασιλεματα. Η κουζινα συνδυαζει τη μεσογειακη παραδοση με δημιουργικες πινελιες. Δοκιμαστε τα ριζοτο με γαριδες και σαφραν, τα καρπατσιο θαλασσινων, τα φιλετα ψαριου με σαλτσα εσπεριδοειδων και τα σπιτικα γλυκα. Η βεραντα πανω στην αμμο ειναι μαγικη τις καλοκαιρινες νυχτες. Καλη λιστα κρασιων και κοκτειλ. Ιδανικο για ζευγαρια που αναζητουν μια ρομαντικη βραδια δίπλα στα κυματα.',
  'To Simadi sits on Paradeisos beach near Neos Marmaras, a romantic beachfront restaurant with stunning sunsets. The kitchen blends Mediterranean tradition with creative touches. Try the shrimp and saffron risotto, seafood carpaccio, fish fillet with citrus sauce, and homemade desserts. The veranda on the sand is magical on summer nights. Good wine list and cocktails. Perfect for couples seeking a romantic evening by the waves.',
  'sithonia', 'Neos Marmaras', 40.0912, 23.7589,
  '', '["mediterranean", "seafood"]', 'moderate', 4.5, 560,
  '', '12:00-01:00',
  true, false, true,
  '["romantic", "sunset", "beachfront", "paradeisos", "cocktails", "neos-marmaras"]'
),

-- 8. 5 Vimata stin Ammo - Pigaidaki
(
  'pente-vimata-stin-ammo',
  '5 Βηματα στην Αμμο',
  '5 Steps in the Sand',
  'Το 5 Βηματα στην Αμμο βρισκεται κυριολεκτικα πανω στην αμμο, στην παραλια Πηγαιδακι της Σιθωνιας. Ενα ανεπιτηδευτο beach bar-εστιατοριο οπου τρωτε με τα ποδια στην αμμο. Ειδικευεται σε ψητα θαλασσινα - το καλαμαρι σχαρας ειναι κορυφαιο, οπως και οι γαυροι τηγανητοι, τα μυδια αχνιστα και η φρεσκια ψητη τσιπουρα. Οι σαλατες ειναι δροσερες με τοπικα λαχανικα. Χαλαρη ατμοσφαιρα, ιδανικη για μεσημεριανο μετα το μπανιο. Δροσερες μπυρες και σπιτικη λεμοναδα συμπληρωνουν την εμπειρια.',
  'Five Steps in the Sand sits literally on the beach at Pigaidaki, Sithonia. A laid-back beach bar-restaurant where you dine with your feet in the sand. Specializes in grilled seafood -- the grilled calamari is top-notch, along with fried anchovies, steamed mussels, and fresh grilled sea bream. Salads are crisp with local vegetables. Relaxed atmosphere, ideal for lunch after a swim. Cold beers and homemade lemonade complete the experience.',
  'sithonia', 'Pigaidaki', 40.0756, 23.8234,
  '', '["seafood", "grill"]', 'moderate', 4.4, 430,
  '', '10:00-22:00',
  true, false, false,
  '["beachside", "feet-in-sand", "calamari", "anchovies", "relaxed", "swim", "sithonia"]'
),

-- 9. Ta Vrahakia - Sarti
(
  'ta-vrahakia-sarti',
  'Τα Βραχακια',
  'Ta Vrahakia',
  'Τα Βραχακια στη Σαρτη ειναι μια μοναδικη εμπειρια: τα τραπεζια ειναι τοποθετημενα πανω στην αμμο, στην ακρη του νερου, με απεριοριστη θεα στο Αγιον Ορος. Ειδικευεται σε ψαρια σχαρας - η τσιπουρα και το λαβρακι ψηνονται φρεσκα στα καρβουνα. Δοκιμαστε επισης τη σαλατα με ρόκα και παρμεζανα, τα χταποδακια ξιδατα και τα τηγανητα καλαμαρακια. Οι βραδιες με πανσεληνο ειναι αξεχαστες. Η εξυπηρετηση ειναι ζεστη και το περιβαλλον ανεπιτηδευτο. Ενα απο τα πιο φωτογραφημενα σημεια της Σαρτης.',
  'Ta Vrahakia in Sarti offers a unique experience: tables are set on the sand at the water''s edge, with unobstructed views of Mount Athos. Specializes in grilled fish -- sea bream and sea bass are grilled fresh over charcoal. Also try the arugula and parmesan salad, vinegar-marinated octopus, and fried calamari. Full-moon evenings are unforgettable. Warm service and an unpretentious setting. One of the most photographed spots in Sarti.',
  'sithonia', 'Sarti', 40.0723, 23.9634,
  '', '["seafood", "grill"]', 'moderate', 4.5, 670,
  '', '11:00-00:00',
  true, false, false,
  '["beach-tables", "athos-view", "grilled-fish", "sarti", "romantic", "full-moon", "sandy"]'
),

-- 10. Alexandros o Megas - Sarti
(
  'alexander-great-sarti',
  'Αλεξανδρος ο Μεγας',
  'Alexander the Great',
  'Ο Αλεξανδρος ο Μεγας ειναι μια δημοφιλης ψαροταβερνα στην παραλια της Σαρτης, με τραπεζια δίπλα στο κυμα και θεα στο Αγιον Ορος. Προσφερει φρεσκα ψαρια και θαλασσινα που φτανουν καθημερινα απο τοπικους αλιεις. Ξεχωριζουν η ψητη τσιπουρα ολοκληρη, τα γαριδακια σαγανακι, ο αχινοσαλατα και τα φρεσκα μυδια. Η ποικιλια θαλασσινων ειναι εξαιρετικη για παρεες. Οι τιμες ειναι δικαιες και η εξυπηρετηση γρηγορη. Ιδανικο για οικογενειακο γευμα ή δειπνο μετα απο μια μερα στη θαλασσα.',
  'Alexander the Great is a popular fish taverna on Sarti beach, with tables next to the waves and views of Mount Athos. It serves fresh fish and seafood delivered daily by local fishermen. Highlights include whole grilled sea bream, shrimp saganaki, sea urchin salad, and fresh mussels. The seafood platter is excellent for groups. Fair prices and quick service. Ideal for a family lunch or dinner after a day at the beach.',
  'sithonia', 'Sarti', 40.0718, 23.9645,
  '', '["seafood", "traditional", "grill"]', 'moderate', 4.3, 540,
  '', '11:00-00:00',
  true, false, true,
  '["seaside", "athos-view", "fresh-fish", "sarti", "family", "seafood-platter"]'
),

-- 11. Melia - Vourvourou
(
  'melia-vourvourou',
  'Melia',
  'Melia',
  'Το Melia στη Βουρβουρου ειναι ενα fine dining εστιατοριο υπο τη διευθυνση του σεφ Γιαννη Μπαξεβανη, κοντα στη διασημη παραλια Καρυδι. Η κουζινα ειναι εμπνευσμενη απο τη μεσογειακη παραδοση με συγχρονες τεχνικες και τοπικα υλικα υψηλης ποιοτητας. Ξεχωριζουν τα πιατα με φρεσκο ψαρι σε κρουστα βοτανων, τα ριζοτο με θαλασσινα και τρουφα, και τα εκλεκτα επιδορπια. Η αισθητικη του χωρου ειναι μινιμαλιστικη και κομψη, με φυσικα υλικα και θεα στο πρασινο. Εξαιρετικη λιστα κρασιων. Ιδανικο για ειδικες περιστασεις.',
  'Melia in Vourvourou is a fine dining restaurant led by chef Yannis Baxevanis, near the famous Karidi beach. The cuisine draws from Mediterranean tradition with modern techniques and high-quality local ingredients. Standout dishes include fresh fish in herb crust, seafood and truffle risotto, and exquisite desserts. The space has a minimalist, elegant aesthetic with natural materials and green views. Excellent wine list. Perfect for special occasions.',
  'sithonia', 'Vourvourou', 40.1834, 23.7912,
  '', '["fineDining", "mediterranean", "seafood"]', 'premium', 4.8, 310,
  '', '19:00-00:00',
  false, false, true,
  '["fine-dining", "chef", "vourvourou", "karidi", "wine-list", "special-occasion", "elegant"]'
),

-- 12. Boukadoura - Porto Koufo
(
  'boukadoura-porto-koufo',
  'Μπουκαδουρα',
  'Boukadoura',
  'Η Μπουκαδουρα στο Πορτο Κουφο λειτουργει απο το 1996, σε εναν απο τους πιο εντυπωσιακους φυσικους λιμενες της Μεσογειου. Με περισσοτερα απο 100 πιατα στον καταλογο, προσφερει τεραστια ποικιλια θαλασσινων και παραδοσιακων πιατων. Το χταποδι σχαρας ειναι κορυφαιο, οπως και οι γαριδες σαγανακι, τα μυδια αχνιστα και η φρεσκια πιατελα θαλασσινων. Για τους λατρεις του κρεατος υπαρχουν μπριζολες και σουβλακια. Η θεα στο κλειστο λιμανι με τα ψαροκαικα ειναι μοναδικη. Μεγαλη χωρητικοτητα, ιδανικο και για μεγαλες παρεες.',
  'Boukadoura in Porto Koufo has been operating since 1996, set on one of the most impressive natural harbors in the Mediterranean. With over 100 dishes on the menu, it offers a huge variety of seafood and traditional plates. The grilled octopus is outstanding, as are the shrimp saganaki, steamed mussels, and the fresh seafood platter. Meat lovers can enjoy steaks and souvlaki. The view of the enclosed harbor with fishing boats is unique. Large capacity, great for big groups too.',
  'sithonia', 'Porto Koufo', 39.9689, 23.9134,
  '', '["seafood", "traditional", "grill"]', 'moderate', 4.4, 750,
  '', '11:00-00:00',
  true, false, true,
  '["porto-koufo", "harbor", "since-1996", "grilled-octopus", "large-menu", "groups", "shrimp-saganaki"]'
),

-- ============================================================
-- ATHOS / OTHER
-- ============================================================

-- 13. Kritikos - Ouranoupolis
(
  'kritikos-ouranoupoli',
  'Κριτικος',
  'Kritikos',
  'Ο Κριτικος στην Ουρανουπολη λειτουργει εδω και πανω απο 40 χρονια, υποδεχομενος τοπικους και επισκεπτες που περιμενουν το πλοιο για το Αγιον Ορος. Ειναι γνωστο για τη σαλατα με αβοκαντο που εχει γινει signature πιατο, τον κλασικο μουσακα, και τα ψητα θαλασσινα. Η ποικιλια του μενου ειναι μεγαλη, απο μεζεδες και ορεκτικα μεχρι κυρια πιατα με κρεας και ψαρι. Η τοποθεσια ειναι κεντρικη, κοντα στον Πυργο του Προσφοριου. Φιλικη εξυπηρετηση και λογικες τιμες. Ιδανικο σημειο αναφορας στην Ουρανουπολη.',
  'Kritikos in Ouranoupolis has been running for over 40 years, welcoming locals and visitors waiting for the boat to Mount Athos. Known for its signature avocado salad, classic moussaka, and grilled seafood. The menu is extensive, from appetizers and meze to main courses with meat and fish. Centrally located near the Tower of Prosforio. Friendly service and reasonable prices. A reliable landmark restaurant in Ouranoupolis.',
  'athos', 'Ouranoupolis', 40.3267, 24.0923,
  '', '["traditional", "seafood", "grill"]', 'moderate', 4.3, 620,
  '', '10:00-00:00',
  true, false, true,
  '["ouranoupolis", "historic", "avocado-salad", "moussaka", "athos-gateway", "40-years"]'
),

-- 14. Rizes - Nikiti
(
  'riziko-nikiti',
  'Ριζες',
  'Rizes',
  'Το Ριζες στη Νικητη ειναι ενα μεσογειακο εστιατοριο πανω στην παραλια, που συνδυαζει τη χαλαρη ατμοσφαιρα του beach bar με ποιοτικη κουζινα. Η θεα στη θαλασσα και τα ηλιοβασιλεματα ειναι εκπληκτικα. Ξεχωριζουν τα πιατα με φρεσκα ψαρια, οι μεσογειακες σαλατες με τοπικα τυρια, τα ριζοτο θαλασσινων και τα burger με μοσχαρισιο κρεας. Η μπαρα προσφερει δροσιστικα κοκτειλ και τοπικα κρασια. Ζωντανη μουσικη ορισμενα βραδια. Ιδανικο για ολη την ημερα, απο πρωινο καφε μεχρι βραδινο δειπνο.',
  'Rizes in Nikiti is a Mediterranean restaurant on the beach, combining a relaxed beach bar atmosphere with quality cuisine. Sea views and sunsets are spectacular. Highlights include fresh fish dishes, Mediterranean salads with local cheeses, seafood risotto, and beef burgers. The bar serves refreshing cocktails and local wines. Live music on select evenings. Perfect for the whole day, from morning coffee to evening dinner.',
  'sithonia', 'Nikiti', 40.2189, 23.6723,
  '', '["mediterranean", "seafood", "cafe"]', 'moderate', 4.4, 480,
  '', '09:00-01:00',
  true, true, true,
  '["beach", "nikiti", "cocktails", "live-music", "sunset", "all-day", "relaxed"]'
),

-- 15. Stou Thanasi - Neos Marmaras
(
  'stou-thanasi-neos-marmaras',
  'Στου Θαναση',
  'Stou Thanasi',
  'Το Στου Θαναση στον Νεο Μαρμαρα ειναι μια κλασικη ταβερνα γνωστη σε ολη τη Χαλκιδικη για το ψητο χταποδι της. Το χταποδι ξεραινεται στον ηλιο και ψηνεται αργα στα καρβουνα, με αποτελεσμα μια μοναδικη γευση και υφη. Εκτος απο το χταποδι, δοκιμαστε τα σουβλακια χοιρινα, τις σπιτικες πατατες, τον χωριατικη σαλατα και τα μαγειρευτα της ημερας. Η ατμοσφαιρα ειναι απλη και αυθεντικη, με ξυλινα τραπεζια και ελληνικη μουσικη. Οι τιμες ειναι πολυ προσιτες. Ιδανικο για γρηγορο και νοστιμο γευμα.',
  'Stou Thanasi in Neos Marmaras is a classic taverna known throughout Halkidiki for its grilled octopus. The octopus is sun-dried and slow-grilled over charcoal, resulting in a unique flavor and texture. Beyond the octopus, try the pork souvlaki, homemade fries, village salad, and daily cooked specials. The atmosphere is simple and authentic, with wooden tables and Greek music. Very affordable prices. Perfect for a quick and delicious meal.',
  'sithonia', 'Neos Marmaras', 40.0845, 23.7656,
  '', '["traditional", "grill", "streetFood"]', 'budget', 4.4, 580,
  '', '11:00-23:00',
  false, false, false,
  '["grilled-octopus", "budget", "classic", "neos-marmaras", "souvlaki", "authentic", "quick"]'
);

COMMIT;
