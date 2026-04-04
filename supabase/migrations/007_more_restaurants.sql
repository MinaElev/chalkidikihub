-- 007_more_restaurants.sql
-- Insert 55 additional real restaurants / tavernas across Halkidiki
-- Areas: kassandra, sithonia, athos

BEGIN;

-- ============================================================
-- KASSANDRA (20 restaurants)
-- ============================================================

INSERT INTO restaurants (
  slug, name_el, name_en,
  description_el, description_en,
  area, location_name, latitude, longitude,
  image_url, cuisine, price_level, rating, reviews_count,
  phone, hours,
  has_sea_view, has_live_music, accepts_reservations, tags
) VALUES

-- 1. Faros - Hanioti
(
  'faros-taverna-hanioti',
  'Φάρος',
  'Faros Taverna',
  'Η ταβέρνα Φάρος στη Χανιώτη είναι ένα αγαπημένο στέκι για ντόπιους και τουρίστες, γνωστή για τις γενναιόδωρες μερίδες και τα φρέσκα υλικά της. Η κουζίνα βασίζεται στην παραδοσιακή ελληνική συνταγολογία με έμφαση στα θαλασσινά και τα ψητά. Δοκιμάστε τα καλαμαράκια τηγανητά, τη φρέσκια τσιπούρα στα κάρβουνα και τη χωριάτικη σαλάτα με τοπική φέτα. Ο χώρος είναι ευρύχωρος με σκιερή αυλή που προσφέρει δροσιά τις ζεστές καλοκαιρινές βραδιές. Φιλικό προσωπικό και λογικές τιμές που προσελκύουν οικογένειες και παρέες.',
  'Faros Taverna in Hanioti is a beloved spot for both locals and tourists, known for its generous portions and fresh ingredients. The kitchen focuses on traditional Greek cuisine with emphasis on seafood and grilled dishes. Try the fried calamari, charcoal-grilled sea bream, and village salad with local feta. Spacious shaded courtyard offers cool comfort on hot summer evenings. Friendly staff and fair prices.',
  'kassandra', 'Hanioti', 39.9878, 23.5212,
  '', '["seafood", "traditional"]', 'moderate', 4.2, 35,
  '', '12:00-00:00',
  false, false, true,
  '["hanioti", "traditional", "seafood", "family-friendly", "large-portions", "courtyard"]'
),

-- 2. Colibri - Hanioti
(
  'colibri-hanioti',
  'Colibri',
  'Colibri',
  'Το Colibri στη Χανιώτη αποτελεί μια σύγχρονη πρόταση εστίασης με μεσογειακές επιρροές και ιδιαίτερη έμφαση στα θαλασσινά. Φημισμένο για τη λιγκουίνι θαλασσινών, ένα πιάτο που φέρνει κόσμο από όλη τη Χαλκιδική. Η κάβα κρασιών περιλαμβάνει ετικέτες από ελληνικούς αμπελώνες, ενώ τα κοκτέιλ είναι φρέσκα και δροσιστικά. Ο χώρος είναι μοντέρνα διακοσμημένος με ζεστά χρώματα και απαλό φωτισμό, ιδανικός για ρομαντικό δείπνο ή βραδιά με φίλους. Εξυπηρέτηση γρήγορη και ευγενική.',
  'Colibri in Hanioti offers a modern dining experience with Mediterranean influences and special emphasis on seafood. Famous for its seafood linguine, a dish that draws visitors from across Halkidiki. The wine cellar features Greek vineyard labels, and the cocktails are fresh and refreshing. Modern decor with warm colors and soft lighting, ideal for romantic dinners or evenings with friends.',
  'kassandra', 'Hanioti', 39.9882, 23.5205,
  '', '["seafood", "mediterranean"]', 'moderate', 4.3, 28,
  '', '12:00-01:00',
  false, false, true,
  '["hanioti", "seafood", "linguine", "modern", "wine", "romantic", "cocktails"]'
),

-- 3. To Ellinikon - Hanioti
(
  'to-ellinikon-hanioti',
  'Το Ελληνικόν',
  'To Ellinikon',
  'Το Ελληνικόν βρίσκεται δίπλα στη θάλασσα στη Χανιώτη και αποτελεί μια από τις πιο δημοφιλείς ταβέρνες της περιοχής. Με θέα στο γαλάζιο του Τορωναίου κόλπου, προσφέρει αυθεντική ελληνική κουζίνα με ψητά κρέατα και φρέσκα ψάρια. Η σουβλάκι μερίδα είναι πλούσια, τα μπιφτέκια χειροποίητα και τα καλαμάκια ζουμερά. Για θαλασσινά, δοκιμάστε τη φρέσκα ψητή τσιπούρα ή τα γαρίδες σαγανάκι. Ζωντανή ατμόσφαιρα τις καλοκαιρινές βραδιές με κόσμο που απολαμβάνει το φαγητό με τα πόδια σχεδόν στην άμμο.',
  'To Ellinikon sits right by the sea in Hanioti and is one of the most popular tavernas in the area. With views of the Toroneos Gulf, it serves authentic Greek cuisine featuring grilled meats and fresh fish. The souvlaki portions are generous, burgers are handmade, and pork skewers are juicy. For seafood, try the grilled sea bream or shrimp saganaki. Lively summer atmosphere with tables nearly on the sand.',
  'kassandra', 'Hanioti', 39.9875, 23.5220,
  '', '["traditional", "grill"]', 'moderate', 4.1, 42,
  '', '11:00-01:00',
  true, false, true,
  '["hanioti", "sea-view", "grill", "souvlaki", "beachfront", "popular"]'
),

-- 4. Kapetan Manolis - Kriopigi
(
  'kapetan-manolis-kriopigi',
  'Καπετάν Μανώλης',
  'Captain Manolis',
  'Από το 1991 ο Καπετάν Μανώλης στην Κρυοπηγή σερβίρει τα φρεσκότερα ψάρια και θαλασσινά της Κασσάνδρας. Η ψαροταβέρνα αυτή έχει κερδίσει τη φήμη της χάρη στην ποιότητα των πρώτων υλών και τις παραδοσιακές συνταγές. Δοκιμάστε τον αστακό σχάρας, τα χταπόδι ξιδάτο, τις γαρίδες σαγανάκι και τη φρέσκια ψαρόσουπα. Τα ψάρια έρχονται καθημερινά από τοπικούς ψαράδες. Ο χώρος είναι απλός αλλά καθαρός, με ζεστή ατμόσφαιρα που θυμίζει παλιά ταβέρνα νησιού. Ιδανικό για οικογενειακό γεύμα.',
  'Since 1991, Captain Manolis in Kriopigi has served the freshest fish and seafood in Kassandra. This fish taverna earned its reputation through quality ingredients and traditional recipes. Try the grilled lobster, vinegar octopus, shrimp saganaki, and fresh fish soup. Fish arrives daily from local fishermen. Simple but clean setting with a warm atmosphere reminiscent of island tavernas. Ideal for family dining.',
  'kassandra', 'Kriopigi', 40.0404, 23.4849,
  '', '["seafood"]', 'moderate', 4.5, 38,
  '', '12:00-23:30',
  false, false, true,
  '["kriopigi", "fish-taverna", "fresh-fish", "since-1991", "traditional", "family-friendly"]'
),

-- 5. Plateia tis Anthoulas - Kriopigi
(
  'plateia-anthoulas-kriopigi',
  'Πλατεία της Ανθούλας',
  'Anthoula''s Square',
  'Στεγαζόμενη σε ένα παλιό αρχοντικό της Κρυοπηγής, η Πλατεία της Ανθούλας προσφέρει γνήσια σπιτική κουζίνα με καθημερινά μαγειρευτά φαγητά. Μπαμιές, φασολάκια, γεμιστά, μουσακάς και παστίτσιο ετοιμάζονται κάθε πρωί με φρέσκα υλικά. Ο χώρος αποπνέει ζεστασιά με πέτρινους τοίχους, ξύλινα έπιπλα και μια μεγάλη αυλή κάτω από πλατάνια. Οι τιμές είναι πολύ προσιτές, κάνοντάς το ιδανικό για καθημερινό φαγητό. Η φιλοξενία είναι εξαιρετική και η Ανθούλα φροντίζει προσωπικά κάθε τραπέζι.',
  'Housed in an old mansion in Kriopigi, Anthoula''s Square serves genuine homemade cuisine with daily cooked dishes. Okra, green beans, stuffed peppers, moussaka, and pastitsio are prepared fresh every morning. The space exudes warmth with stone walls, wooden furniture, and a large courtyard under plane trees. Very affordable prices make it ideal for everyday dining. Excellent hospitality with Anthoula personally attending each table.',
  'kassandra', 'Kriopigi', 40.0398, 23.4855,
  '', '["traditional"]', 'budget', 4.4, 22,
  '', '12:00-23:00',
  false, false, false,
  '["kriopigi", "homemade", "daily-specials", "mansion", "courtyard", "budget-friendly"]'
),

-- 6. Psarakas - Pefkochori
(
  'psarakas-pefkochori',
  'Ο Ψάρακας',
  'Psarakas',
  'Από το 2008 ο Ψάρακας στο Πευκοχώρι σερβίρει φρέσκα θαλασσινά δίπλα στη θάλασσα. Η τοποθεσία είναι εξαιρετική, με τραπέζια στην παραλία και θέα στο ηλιοβασίλεμα. Δοκιμάστε τη φρέσκια τσιπούρα ή λαβράκι στη σχάρα, τα μύδια αχνιστά, τα καλαμαράκια τηγανητά και τη σαλάτα με ρόκα και παρμεζάνα. Η ψαρόσουπα είναι εκπληκτική. Το μενού αλλάζει ανάλογα με το αλίευμα της ημέρας. Εξυπηρέτηση φιλική και γρήγορη, ιδανικό μέρος για ρομαντικό δείπνο ή γιορτινό γεύμα με παρέα.',
  'Since 2008, Psarakas in Pefkochori has served fresh seafood right on the beach. The location is outstanding with tables on the sand and sunset views. Try the grilled sea bream or sea bass, steamed mussels, fried calamari, and rocket-parmesan salad. The fish soup is remarkable. Menu changes based on the daily catch. Friendly and fast service, ideal for romantic dinners or festive group meals.',
  'kassandra', 'Pefkochori', 39.9654, 23.6123,
  '', '["seafood"]', 'moderate', 4.4, 31,
  '', '12:00-00:00',
  true, false, true,
  '["pefkochori", "beachfront", "fresh-fish", "sunset", "seafood", "romantic"]'
),

-- 7. Metohi - Sani
(
  'metohi-sani',
  'Μετόχι',
  'Metohi',
  'Το Μετόχι στη Σάνη είναι μια μοναδική γαστρονομική εμπειρία μέσα σε ελαιώνα. Εξειδικεύεται στα ψητά στη σούβλα - αρνί, κοκορέτσι, κοντοσούβλι - που ψήνονται αργά πάνω από κάρβουνα. Η μυρωδιά του ψητού σε καλωσορίζει από μακριά. Τα μεζεδάκια είναι παραδοσιακά: τζατζίκι, μελιτζανοσαλάτα, χόρτα βραστά και πίτες χειροποίητες. Ο χώρος μέσα στον ελαιώνα προσφέρει σκιά και φυσική δροσιά. Ιδανικό για μεγάλες παρέες και οικογένειες που θέλουν αυθεντικό ελληνικό φαγητό σε γαλήνιο περιβάλλον.',
  'Metohi in Sani offers a unique dining experience inside an olive grove. Specializing in spit-roasted meats -- lamb, kokoretsi, kontosouvli -- slow-cooked over charcoal. The aroma of roasting meat welcomes you from afar. Traditional appetizers include tzatziki, eggplant dip, boiled greens, and handmade pies. The olive grove setting provides shade and natural cool. Ideal for large groups and families wanting authentic Greek food in a peaceful environment.',
  'kassandra', 'Sani', 40.0921, 23.3023,
  '', '["grill", "traditional"]', 'moderate', 4.3, 27,
  '', '12:00-23:30',
  false, false, true,
  '["sani", "olive-grove", "spit-roast", "kokoretsi", "lamb", "traditional", "family"]'
),

-- 8. Flegra - Polychrono
(
  'flegra-polychrono',
  'Φλέγρα',
  'Flegra',
  'Η Φλέγρα στο Πολύχρονο είναι μια αξιόπιστη ταβέρνα που σερβίρει τόσο κρέας όσο και ψάρι, ικανοποιώντας κάθε γούστο. Τα ψητά κρέατα - παϊδάκια, μπριζόλες, σουτζουκάκια - ετοιμάζονται στα κάρβουνα, ενώ τα ψάρια είναι πάντα φρέσκα. Η σαλάτα Φλέγρα με ρόκα, ντοματίνια και ανθότυρο είναι must. Ζεστή ατμόσφαιρα με ξύλινη διακόσμηση και ευγενικό προσωπικό. Βρίσκεται στο κέντρο του Πολυχρόνου, εύκολα προσβάσιμη, με αρκετό χώρο στάθμευσης. Καλή σχέση ποιότητας-τιμής.',
  'Flegra in Polychrono is a reliable taverna serving both meat and fish to satisfy every taste. Grilled meats -- lamb chops, steaks, soutzoukakia -- are charcoal-prepared, while the fish is always fresh. The Flegra salad with rocket, cherry tomatoes, and anthotyro cheese is a must. Warm atmosphere with wooden decor and polite staff. Centrally located in Polychrono with ample parking. Great value for money.',
  'kassandra', 'Polychrono', 40.0234, 23.4567,
  '', '["traditional", "grill"]', 'moderate', 4.1, 19,
  '', '12:00-00:00',
  false, false, true,
  '["polychrono", "grill", "meat", "fish", "value", "central"]'
),

-- 9. Zattero - Fourka
(
  'zattero-fourka',
  'Zattero',
  'Zattero',
  'Το Zattero στη Φούρκα είναι δημοφιλές τόσο στους ντόπιους όσο και στους τουρίστες, κάτι που μαρτυρά την ποιότητα της κουζίνας του. Μεσογειακές γεύσεις με δημιουργικές πινελιές σε ένα σύγχρονο περιβάλλον. Δοκιμάστε τα ριζότο θαλασσινών, τη σαλάτα με καραμελωμένα καρύδια και γκοργκονζόλα, και τα φρέσκα ζυμαρικά. Η λίστα κρασιών είναι αξιόλογη με ελληνικές και διεθνείς ετικέτες. Το μπαρ σερβίρει εξαιρετικά κοκτέιλ. Ευχάριστη διακόσμηση, καλή μουσική και εξυπηρέτηση που κάνει τη διαφορά.',
  'Zattero in Fourka is popular with locals and tourists alike, a testament to its kitchen quality. Mediterranean flavors with creative touches in a modern setting. Try the seafood risotto, salad with caramelized walnuts and gorgonzola, and fresh pasta. Notable wine list with Greek and international labels. The bar serves excellent cocktails. Pleasant decor, good music, and service that makes the difference.',
  'kassandra', 'Fourka', 40.0567, 23.3834,
  '', '["mediterranean"]', 'moderate', 4.2, 24,
  '', '12:00-01:00',
  false, false, true,
  '["fourka", "mediterranean", "creative", "wine", "cocktails", "modern"]'
),

-- 10. Diamantis - Siviri
(
  'diamantis-siviri',
  'Διαμάντης',
  'Diamantis',
  'Ο Διαμάντης στη Σιβηρή είναι μια κλασική οικογενειακή ταβέρνα με παραδοσιακή ελληνική κουζίνα σε πολύ προσιτές τιμές. Τα σουβλάκια, τα μπιφτέκια, τα παϊδάκια και τα λουκάνικα ψήνονται στα κάρβουνα και συνοδεύονται από χειροποίητες πατάτες τηγανητές. Οι μερίδες είναι μεγάλες και η ποιότητα σταθερή. Ο χώρος είναι απλός με υπαίθρια τραπέζια κάτω από πεύκα. Ιδανικό για γρήγορο φαγητό μετά την παραλία ή οικογενειακό δείπνο χωρίς υπερβολές. Φιλικό περιβάλλον.',
  'Diamantis in Siviri is a classic family taverna with traditional Greek cuisine at very affordable prices. Souvlaki, burgers, lamb chops, and sausages are charcoal-grilled and served with hand-cut chips. Portions are large and quality is consistent. Simple outdoor seating under pine trees. Ideal for a quick meal after the beach or a family dinner without breaking the bank. Friendly atmosphere.',
  'kassandra', 'Siviri', 40.0789, 23.3234,
  '', '["traditional", "grill"]', 'budget', 4.0, 16,
  '', '12:00-23:00',
  false, false, false,
  '["siviri", "budget-friendly", "grill", "souvlaki", "family", "outdoor"]'
),

-- 11. Aelia - Nea Skioni
(
  'aelia-nea-skioni',
  'Aelia',
  'Aelia',
  'Το Aelia στη Νέα Σκιώνη προσφέρει μια σύγχρονη ελληνική κουζίνα σε ένα κομψό περιβάλλον. Τα πιάτα βασίζονται σε τοπικά εποχιακά υλικά και παρουσιάζονται με αισθητική φροντίδα. Δοκιμάστε το φιλέτο τσιπούρας με λαχανικά σοτέ, τα ριζότο με μανιτάρια πορτσίνι και τα γλυκά σπιτικής παρασκευής. Η λίστα κρασιών περιλαμβάνει βιολογικές ετικέτες. Ο χώρος είναι μοντέρνος με στοιχεία μινιμαλισμού και απαλό φωτισμό. Κατάλληλο για ζευγάρια και γεύματα ειδικών περιστάσεων.',
  'Aelia in Nea Skioni offers modern Greek cuisine in an elegant setting. Dishes are based on local seasonal ingredients and presented with aesthetic care. Try the sea bream fillet with sauteed vegetables, porcini mushroom risotto, and homemade desserts. The wine list includes organic labels. Modern minimalist space with soft lighting. Suitable for couples and special occasion dining.',
  'kassandra', 'Nea Skioni', 39.9456, 23.4834,
  '', '["mediterranean"]', 'moderate', 4.3, 15,
  '', '13:00-00:00',
  false, false, true,
  '["nea-skioni", "modern-greek", "seasonal", "elegant", "wine", "romantic"]'
),

-- 12. Vassilas - Possidi
(
  'vassilas-possidi',
  'Βασίλας',
  'Vassilas',
  'Ο Βασίλας στο Ποσείδι βρίσκεται κοντά στο ακρωτήριο και σερβίρει θαλασσινά σε ένα γαλήνιο παραθαλάσσιο περιβάλλον. Τα ψάρια είναι φρέσκα, αλιευμένα από τοπικά σκάφη, και ψήνονται στη σχάρα ή τηγανίζονται κατά παραγγελία. Δοκιμάστε τη φρέσκια γαρίδα, το χταπόδι σχάρας και τις αχινοσαλάτες. Η θέα στη θάλασσα είναι μαγευτική, ειδικά το ηλιοβασίλεμα. Ήσυχη ατμόσφαιρα, ιδανική για χαλαρωτικό γεύμα. Τιμές αναλογικές με την ποιότητα και τη φρεσκάδα.',
  'Vassilas in Possidi sits near the cape and serves seafood in a serene beachside setting. Fish is fresh from local boats, grilled or fried to order. Try the fresh shrimp, grilled octopus, and sea urchin salad. The sea view is magical, especially at sunset. Quiet atmosphere ideal for a relaxing meal. Prices proportional to the quality and freshness.',
  'kassandra', 'Possidi', 39.9542, 23.3876,
  '', '["seafood"]', 'moderate', 4.2, 20,
  '', '12:00-23:30',
  true, false, true,
  '["possidi", "cape", "seafood", "sunset", "fresh-fish", "beachside"]'
),

-- 13. Sidera - Possidi
(
  'sidera-possidi',
  'Σιδέρα',
  'Sidera',
  'Η Σιδέρα στο Ποσείδι συνδυάζει την παραδοσιακή ελληνική κουζίνα με θαλασσινά σε ένα περιβάλλον με θέα θάλασσα. Δοκιμάστε τα σπιτικά μαγειρευτά πιάτα της ημέρας, τις φρέσκιες σαλάτες και τα ψητά ψάρια. Ιδιαίτερα δημοφιλή είναι τα καλαμάρια γεμιστά, η μουσακάς και τα παϊδάκια. Η βεράντα με θέα στο Αιγαίο δημιουργεί μια ρομαντική ατμόσφαιρα. Φιλικό προσωπικό που σε κάνει να νιώθεις σαν στο σπίτι σου. Καλές τιμές για την ποιότητα που προσφέρει.',
  'Sidera in Possidi combines traditional Greek cuisine with seafood in a sea-view setting. Try the homemade daily cooked dishes, fresh salads, and grilled fish. Particularly popular are the stuffed calamari, moussaka, and lamb chops. The terrace overlooking the Aegean creates a romantic atmosphere. Friendly staff that makes you feel at home. Good prices for the quality offered.',
  'kassandra', 'Possidi', 39.9548, 23.3870,
  '', '["traditional", "seafood"]', 'moderate', 4.1, 18,
  '', '12:00-23:30',
  true, false, true,
  '["possidi", "sea-view", "traditional", "seafood", "terrace", "homemade"]'
),

-- 14. Nefeli - Polychrono
(
  'nefeli-polychrono',
  'Νεφέλη',
  'Nefeli',
  'Από το 1992 η Νεφέλη στο Πολύχρονο σερβίρει επιλεγμένα πιάτα μεσογειακής κουζίνας με ιδιαίτερη φροντίδα στην ποιότητα. Τα υλικά επιλέγονται προσεκτικά από τοπικούς παραγωγούς. Δοκιμάστε τα ζυμαρικά με γαρίδες και σάλτσα σαφράν, το φιλέτο μοσχαρίσιο με μανιτάρια και τα σπιτικά γλυκά. Ο χώρος είναι κομψός με μεσογειακή αισθητική. Η κάβα κρασιών περιλαμβάνει ετικέτες από ελληνικά οινοποιεία. Εξυπηρέτηση άψογη. Κατάλληλο για ζευγάρια και γιορτινά δείπνα.',
  'Since 1992, Nefeli in Polychrono has served select Mediterranean dishes with particular care for quality. Ingredients are carefully chosen from local producers. Try the shrimp pasta with saffron sauce, beef fillet with mushrooms, and homemade desserts. Elegant space with Mediterranean aesthetics. Wine cellar includes Greek winery labels. Impeccable service. Suitable for couples and celebratory dinners.',
  'kassandra', 'Polychrono', 40.0228, 23.4572,
  '', '["mediterranean"]', 'moderate', 4.4, 25,
  '', '13:00-00:00',
  false, false, true,
  '["polychrono", "since-1992", "select", "mediterranean", "wine", "elegant"]'
),

-- 15. Sousorada - Afytos
(
  'sousorada-afytos',
  'Σουσουράδα',
  'Sousorada',
  'Η Σουσουράδα βρίσκεται στα πέτρινα σοκάκια του Αφύτου και αποτελεί ένα παραδοσιακό στέκι με αυθεντική ελληνική κουζίνα. Ο χώρος είναι γραφικός με πέτρινους τοίχους και αυλή με μπουκαμβίλιες. Τα πιάτα βασίζονται σε παραδοσιακές συνταγές: γίγαντες πλακί, μπριάμ, κεφτεδάκια, λουκάνικα χωριάτικα. Τα ορεκτικά είναι εξαιρετικά και τα κρασιά χύμα τοπικά. Η ατμόσφαιρα είναι ζεστή και αυθεντική, ιδανική για βραδινό μεζέ με φίλους.',
  'Sousorada sits in the stone alleys of Afytos and is a traditional spot serving authentic Greek cuisine. The setting is picturesque with stone walls and a bougainvillea courtyard. Dishes are based on traditional recipes: giant beans, briam, meatballs, and village sausages. Appetizers are excellent and the bulk wines are local. Warm, authentic atmosphere ideal for evening meze with friends.',
  'kassandra', 'Afytos', 40.0968, 23.4340,
  '', '["traditional"]', 'moderate', 4.3, 21,
  '', '13:00-00:00',
  false, false, false,
  '["afytos", "stone-alley", "traditional", "meze", "courtyard", "authentic"]'
),

-- 16. Palio Rementzo - Afytos
(
  'palio-rementzo-afytos',
  'Παλιό Ρεμέντζο',
  'Palio Rementzo',
  'Το Παλιό Ρεμέντζο στον Αφύτο είναι ένα παραδοσιακό εστιατόριο με εκπληκτική θέα στη θάλασσα από τα βράχια του χωριού. Η κουζίνα συνδυάζει θαλασσινά με παραδοσιακή ελληνική γαστρονομία. Δοκιμάστε τη φρέσκια ψητή τσιπούρα, το χταπόδι σχάρας, τα σαρδέλες ψητές και τα σπιτικά ορεκτικά. Η βεράντα με θέα τον Θερμαϊκό κόλπο είναι ονειρική, ειδικά τις ώρες του ηλιοβασιλέματος. Τιμές λογικές για την τοποθεσία και την ποιότητα. Δημοφιλές σημείο για φωτογραφίες.',
  'Palio Rementzo in Afytos is a traditional restaurant with stunning sea views from the village cliffs. The kitchen combines seafood with traditional Greek gastronomy. Try the grilled sea bream, charcoal octopus, grilled sardines, and homemade starters. The terrace overlooking the Thermaic Gulf is dreamy, especially at sunset. Reasonable prices for the location and quality. Popular spot for photography.',
  'kassandra', 'Afytos', 40.0972, 23.4336,
  '', '["traditional", "seafood"]', 'moderate', 4.5, 33,
  '', '12:00-00:00',
  true, false, true,
  '["afytos", "sea-view", "sunset", "traditional", "seafood", "scenic", "terrace"]'
),

-- 17. Villa Stasa - Agia Paraskevi (Loutra)
(
  'villa-stasa-loutra',
  'Villa Stasa',
  'Villa Stasa',
  'Το Villa Stasa στην Αγία Παρασκευή (Λουτρά) Κασσάνδρας προσφέρει παραδοσιακά ελληνικά πιάτα σε ένα ήσυχο περιβάλλον μακριά από τον τουριστικό συνωστισμό. Ο χώρος θυμίζει παλιά βίλα με κήπο γεμάτο λουλούδια. Δοκιμάστε τα σπιτικά μαγειρευτά, τις πίτες με χειροποίητο φύλλο, τα γεμιστά και το αρνί λεμονάτο στον φούρνο. Τα γλυκά είναι παραδοσιακά: γαλακτομπούρεκο, πορτοκαλόπιτα, μπακλαβάς. Ιδανικό για χαλαρό μεσημεριανό γεύμα σε οικογενειακή ατμόσφαιρα.',
  'Villa Stasa in Agia Paraskevi (Loutra) of Kassandra offers traditional Greek dishes in a quiet setting away from tourist crowds. The space resembles an old villa with a flower-filled garden. Try the homemade cooked dishes, handmade phyllo pies, stuffed vegetables, and oven-baked lemon lamb. Desserts are traditional: galaktoboureko, orange cake, baklava. Ideal for a relaxed lunch in a family atmosphere.',
  'kassandra', 'Agia Paraskevi', 40.0612, 23.3956,
  '', '["traditional"]', 'moderate', 4.1, 12,
  '', '12:00-23:00',
  false, false, false,
  '["loutra", "villa", "garden", "homemade", "traditional", "quiet"]'
),

-- 18. Taverna Makis - Pefkochori
(
  'taverna-makis-pefkochori',
  'Ταβέρνα Μάκης',
  'Taverna Makis',
  'Η Ταβέρνα Μάκης στο Πευκοχώρι είναι αγαπημένη στους ντόπιους για τα αυθεντικά σπιτικά φαγητά και τις τιμές της. Οικογενειακή επιχείρηση με μεγάλη παράδοση στα ψητά κρέατα και τα μαγειρευτά. Τα σουβλάκια, τα μπιφτέκια, ο γύρος χοιρινός και τα παϊδάκια ψήνονται στα κάρβουνα. Δοκιμάστε επίσης τη φασολάδα και τις ντολμαδάκια γιαλαντζί. Ο χώρος είναι απλός και λειτουργικός με υπαίθρια τραπέζια. Ιδανικό για γρήγορο και νόστιμο φαγητό χωρίς περιττές φανφάρες.',
  'Taverna Makis in Pefkochori is a locals'' favorite for authentic homemade food and great prices. Family business with a long tradition in grilled meats and cooked dishes. Souvlaki, burgers, pork gyros, and lamb chops are charcoal-grilled. Also try the bean soup and vine-leaf dolmades. Simple, functional space with outdoor tables. Ideal for quick, delicious food without unnecessary frills.',
  'kassandra', 'Pefkochori', 39.9660, 23.6118,
  '', '["traditional", "grill"]', 'budget', 4.0, 14,
  '', '11:00-23:00',
  false, false, false,
  '["pefkochori", "locals-favorite", "grill", "budget-friendly", "family", "homemade"]'
),

-- 19. Summer Brothers - Hanioti
(
  'summer-brothers-hanioti',
  'Summer Brothers',
  'Summer Brothers',
  'Το Summer Brothers στη Χανιώτη προσφέρει μια σύγχρονη ελληνική κουζίνα σε ένα ζωντανό και νεανικό περιβάλλον. Τα πιάτα συνδυάζουν παραδοσιακές γεύσεις με μοντέρνες τεχνικές παρουσίασης. Δοκιμάστε τα κοκτέιλ τους μαζί με μεζέδες μοντέρνας κουζίνας. Η μουσική δημιουργεί ατμόσφαιρα ενώ η εξυπηρέτηση είναι φιλική και γρήγορη. Ιδανικό για βραδινή έξοδο. Ποιοτικά υλικά, δημιουργικό μενού και εξαιρετική τοποθεσία στο κέντρο της Χανιώτης.',
  'Summer Brothers in Hanioti offers modern Greek cuisine in a vibrant, youthful setting. Dishes combine traditional flavors with contemporary presentation techniques. Try their cocktails paired with modern cuisine appetizers. Music creates atmosphere while service is friendly and quick. Ideal for evening outings. Quality ingredients, creative menu, and excellent location in central Hanioti.',
  'kassandra', 'Hanioti', 39.9880, 23.5208,
  '', '["mediterranean"]', 'moderate', 4.2, 20,
  '', '17:00-02:00',
  false, false, true,
  '["hanioti", "modern", "cocktails", "nightlife", "creative", "youthful"]'
),

-- 20. John''s Family - Kallithea
(
  'johns-family-kallithea',
  'John''s Family',
  'John''s Family',
  'Το John''s Family στην Καλλιθέα είναι μια οικογενειακή ταβέρνα που προσφέρει γνήσια ελληνική κουζίνα σε ζεστό φιλόξενο περιβάλλον. Τα πιάτα ετοιμάζονται με αγάπη και φρέσκα υλικά. Δοκιμάστε τα σπιτικά μαγειρευτά όπως γεμιστά, μπάμιες, κοτόπουλο κοκκινιστό και μουσακά. Οι μερίδες είναι μεγάλες, οι τιμές χαμηλές και η ατμόσφαιρα σαν να τρως στο σπίτι μιας ελληνικής γιαγιάς. Ιδανικό για οικογένειες με παιδιά. Πάρκινγκ διαθέσιμο.',
  'John''s Family in Kallithea is a family taverna offering genuine Greek cuisine in a warm, welcoming atmosphere. Dishes are prepared with love and fresh ingredients. Try the homemade cooked dishes like stuffed peppers, okra, chicken stew, and moussaka. Portions are large, prices are low, and the atmosphere feels like eating at a Greek grandmother''s house. Ideal for families with children. Parking available.',
  'kassandra', 'Kallithea', 40.0489, 23.4178,
  '', '["traditional"]', 'budget', 4.0, 11,
  '', '12:00-23:00',
  false, false, false,
  '["kallithea", "family", "homemade", "budget-friendly", "parking", "traditional"]'
),

-- ============================================================
-- SITHONIA (25 restaurants)
-- ============================================================

-- 21. Panos - Neos Marmaras
(
  'panos-fish-neos-marmaras',
  'Πάνος',
  'Panos Fish Taverna',
  'Ο Πάνος στον Νέο Μαρμαρά κατατάσσεται στις κορυφαίες θέσεις του TripAdvisor και δικαίως. Η ψαροταβέρνα σερβίρει τα φρεσκότερα ψάρια της Σιθωνίας με απλό αλλά τέλειο τρόπο. Τσιπούρα, λαβράκι, συναγρίδα και μπαρμπούνια ψήνονται στη σχάρα με λαδολέμονο. Τα ορεκτικά - ταραμοσαλάτα, χταποδοσαλάτα, γαρίδες σαγανάκι - είναι εξίσου εντυπωσιακά. Ο χώρος είναι απλός, δίπλα στο λιμάνι, με θέα τα ψαροκάικα. Κρατήστε τραπέζι νωρίς γιατί γεμίζει γρήγορα.',
  'Panos in Neos Marmaras ranks among the top on TripAdvisor and rightfully so. This fish taverna serves the freshest fish in Sithonia in a simple but perfect way. Sea bream, sea bass, red snapper, and red mullet are grilled with olive oil and lemon. Starters -- taramosalata, octopus salad, shrimp saganaki -- are equally impressive. Simple setting by the harbor with fishing boat views. Book early as it fills up fast.',
  'sithonia', 'Neos Marmaras', 40.0860, 23.7650,
  '', '["seafood"]', 'moderate', 4.6, 48,
  '', '12:00-00:00',
  true, false, true,
  '["neos-marmaras", "top-rated", "fresh-fish", "harbor", "tripadvisor", "popular"]'
),

-- 22. Okyalos - Neos Marmaras
(
  'okyalos-neos-marmaras',
  'Ωκύαλος',
  'Okyalos',
  'Ο Ωκύαλος στο κέντρο του Νέου Μαρμαρά είναι ένα εστιατόριο θαλασσινών με μεσογειακές επιρροές. Φημισμένο για τα φρέσκα ψάρια και τα δημιουργικά πιάτα θαλασσινών. Δοκιμάστε τα linguine με αστακό, τα καλαμαράκια γεμιστά με φέτα και τη σαλάτα θαλασσινών. Η κάβα κρασιών είναι αξιόλογη. Ο χώρος είναι κομψός με θαλασσινή διακόσμηση και ευχάριστη ατμόσφαιρα. Εξυπηρέτηση επαγγελματική. Ιδανικό για ρομαντικό δείπνο ή ξεχωριστή βραδιά.',
  'Okyalos in central Neos Marmaras is a seafood restaurant with Mediterranean influences. Renowned for fresh fish and creative seafood dishes. Try the lobster linguine, calamari stuffed with feta, and seafood salad. The wine cellar is notable. Elegant space with nautical decor and pleasant atmosphere. Professional service. Ideal for a romantic dinner or special evening out.',
  'sithonia', 'Neos Marmaras', 40.0865, 23.7648,
  '', '["seafood", "mediterranean"]', 'moderate', 4.4, 32,
  '', '12:00-01:00',
  false, false, true,
  '["neos-marmaras", "seafood", "creative", "elegant", "wine", "romantic"]'
),

-- 23. Tzitzikas - Porto Koufo
(
  'tzitzikas-porto-koufo',
  'Τζίτζικας',
  'Tzitzikas',
  'Ο Τζίτζικας στο Πόρτο Κουφό θεωρείται από τους ντόπιους η καλύτερη ψαροταβέρνα της νότιας Σιθωνίας. Βρίσκεται στο πιο προστατευμένο λιμάνι της Ελλάδας, με τραπέζια δίπλα στο νερό. Τα ψάρια αλιεύονται καθημερινά από τα τοπικά σκάφη. Δοκιμάστε τη φρέσκια ψαρόσουπα, τα μπαρμπούνια τηγανητά, τον αστακό σχάρας και τα μύδια αχνιστά. Η απλότητα στο μαγείρεμα αναδεικνύει τη φρεσκάδα. Ήσυχη ατμόσφαιρα, ιδανική για αυτούς που αναζητούν αυθεντική εμπειρία.',
  'Tzitzikas in Porto Koufo is considered by locals as the best fish taverna in south Sithonia. Located at Greece''s most sheltered harbor with tables by the water. Fish is caught daily by local boats. Try the fresh fish soup, fried red mullet, grilled lobster, and steamed mussels. Simplicity in cooking highlights the freshness. Quiet atmosphere, ideal for those seeking an authentic experience.',
  'sithonia', 'Porto Koufo', 39.9692, 23.9130,
  '', '["seafood"]', 'moderate', 4.5, 36,
  '', '11:00-23:00',
  true, false, false,
  '["porto-koufo", "best-fish", "harbor", "fresh-catch", "authentic", "locals-choice"]'
),

-- 24. Aristos - Ormos Panagias
(
  'aristos-ormos-panagias',
  'Αρίστος',
  'Aristos',
  'Ο Αρίστος στον Όρμο Παναγίας βρίσκεται ακριβώς πάνω στην ακτή με θέα το μικρό γραφικό λιμάνι. Τα θαλασσινά είναι η ειδικότητά του: φρέσκα ψάρια, γαρίδες, χταπόδι και αστακός, όλα αλιευμένα τοπικά. Δοκιμάστε τη σαρδέλα σχάρας, τη φρέσκια ψαρόσουπα και το χταπόδι κρασάτο. Ο χώρος είναι ήσυχος με ναυτική ατμόσφαιρα. Εξαιρετική επιλογή πριν ή μετά από εκδρομή με σκάφος στο Διαπόρο. Τιμές δίκαιες.',
  'Aristos in Ormos Panagias sits right on the shore with views of the small picturesque harbor. Seafood is the specialty: fresh fish, shrimp, octopus, and lobster, all locally caught. Try the grilled sardines, fresh fish soup, and wine-braised octopus. Quiet setting with nautical atmosphere. Excellent choice before or after a boat trip to Diaporos island. Fair prices.',
  'sithonia', 'Ormos Panagias', 40.2456, 23.7534,
  '', '["seafood"]', 'moderate', 4.3, 26,
  '', '11:00-23:30',
  true, false, true,
  '["ormos-panagias", "harbor", "seafood", "diaporos", "boat-trip", "scenic"]'
),

-- 25. Zorbas - Kalamitsi
(
  'zorbas-kalamitsi',
  'Ζορμπάς',
  'Zorbas',
  'Ο Ζορμπάς στο Καλαμίτσι βρίσκεται πάνω στην παραλία, ιδανικός για γεύμα μετά το μπάνιο. Παραδοσιακή ελληνική κουζίνα με ψητά κρέατα, σαλάτες και ορεκτικά. Τα σουβλάκια και τα μπιφτέκια είναι ζουμερά, η χωριάτικη σαλάτα φρέσκια και η φέτα τοπική. Ο χώρος είναι απλός με ψάθινες ομπρέλες και τραπέζια στην άμμο. Ιδανικό για χαλαρό μεσημεριανό με θέα τα κρυστάλλινα νερά του Καλαμιτσίου. Πολύ προσιτές τιμές.',
  'Zorbas in Kalamitsi sits right on the beach, ideal for a meal after swimming. Traditional Greek cuisine with grilled meats, salads, and appetizers. Souvlaki and burgers are juicy, the village salad is fresh with local feta. Simple setup with straw umbrellas and tables on the sand. Ideal for a relaxed lunch overlooking the crystal waters of Kalamitsi. Very affordable prices.',
  'sithonia', 'Kalamitsi', 39.9834, 23.9234,
  '', '["traditional", "grill"]', 'budget', 4.0, 18,
  '', '10:00-22:00',
  true, false, false,
  '["kalamitsi", "beach", "budget-friendly", "grill", "swimming", "relaxed"]'
),

-- 26. Mare Nostrum - Nikiti
(
  'mare-nostrum-nikiti',
  'Mare Nostrum',
  'Mare Nostrum',
  'Το Mare Nostrum στη Νικήτη προσφέρει μεσογειακή κουζίνα υψηλού επιπέδου σε ένα κομψό περιβάλλον. Τα πιάτα βασίζονται σε εποχιακά υλικά και μεσογειακές τεχνικές μαγειρέματος. Δοκιμάστε τα ριζότο θαλασσινών, τα ζυμαρικά με σάλτσα λιαστής ντομάτας και τα φρέσκα ψάρια. Η λίστα κρασιών περιλαμβάνει ετικέτες από κορυφαία ελληνικά οινοποιεία. Μοντέρνος χώρος με καλαίσθητη διακόσμηση. Εξυπηρέτηση προσεγμένη. Κατάλληλο για ζευγάρια και ειδικές περιστάσεις.',
  'Mare Nostrum in Nikiti offers high-level Mediterranean cuisine in an elegant setting. Dishes are based on seasonal ingredients and Mediterranean cooking techniques. Try the seafood risotto, pasta with sun-dried tomato sauce, and fresh fish. Wine list includes labels from top Greek wineries. Modern space with tasteful decor. Attentive service. Suitable for couples and special occasions.',
  'sithonia', 'Nikiti', 40.2189, 23.6720,
  '', '["mediterranean"]', 'moderate', 4.4, 22,
  '', '13:00-00:00',
  false, false, true,
  '["nikiti", "mediterranean", "elegant", "wine", "seasonal", "modern"]'
),

-- 27. Porto Valitsa - Neos Marmaras
(
  'porto-valitsa-neos-marmaras',
  'Porto Valitsa',
  'Porto Valitsa',
  'Το Porto Valitsa στον Νέο Μαρμαρά είναι ένα εστιατόριο παραλίας που συνδυάζει μεσογειακή κουζίνα με θαλασσινά σε ένα κομψό περιβάλλον δίπλα στη θάλασσα. Τα πιάτα παρουσιάζονται με αισθητική και η ποιότητα είναι υψηλή. Δοκιμάστε τον αστακό σε σάλτσα σαμπάνιας, τα ψητά θαλασσινά πλατό και τα γλυκά σεφ. Lounge ατμόσφαιρα με μουσική και κοκτέιλ. Ιδανικό για πολυτελή βραδιά. Η θέα στη θάλασσα είναι εντυπωσιακή.',
  'Porto Valitsa in Neos Marmaras is a beach restaurant combining Mediterranean cuisine with seafood in an elegant seaside setting. Dishes are presented with aesthetic care and quality is high. Try the lobster in champagne sauce, grilled seafood platter, and chef''s desserts. Lounge atmosphere with music and cocktails. Ideal for a luxurious evening. The sea view is stunning.',
  'sithonia', 'Neos Marmaras', 40.0870, 23.7640,
  '', '["mediterranean", "seafood"]', 'upscale', 4.5, 30,
  '', '12:00-01:00',
  true, false, true,
  '["neos-marmaras", "upscale", "beach-restaurant", "lounge", "cocktails", "luxury"]'
),

-- 28. Taverna Giannis - Toroni
(
  'taverna-giannis-toroni',
  'Ταβέρνα Γιάννης',
  'Taverna Giannis',
  'Η Ταβέρνα Γιάννης στην Τορώνη είναι μια απλή ψαροταβέρνα με τραπέζια στην παραλία. Τα ψάρια είναι φρέσκα, αλιευμένα καθημερινά, και μαγειρεύονται απλά: σχάρα, τηγάνι, ή αχνιστά. Δοκιμάστε τα μπαρμπούνια τηγανητά, τη φρέσκια σαρδέλα σχάρας και τον αχνιστό αστακό. Οι σαλάτες είναι φρέσκιες με τοπικά λαχανικά. Ο χώρος είναι ατμοσφαιρικός με τη θάλασσα σε απόσταση αναπνοής. Τιμές χαμηλές για τη φρεσκάδα που προσφέρει.',
  'Taverna Giannis in Toroni is a simple fish taverna with tables on the beach. Fish is fresh, caught daily, and cooked simply: grilled, fried, or steamed. Try the fried red mullet, grilled sardines, and steamed lobster. Salads are fresh with local vegetables. Atmospheric setting with the sea just steps away. Low prices for the freshness offered.',
  'sithonia', 'Toroni', 39.9867, 23.8934,
  '', '["seafood", "traditional"]', 'budget', 4.1, 15,
  '', '11:00-22:30',
  true, false, false,
  '["toroni", "beach-tables", "fresh-fish", "simple", "budget-friendly", "beachfront"]'
),

-- 29. Naias - Neos Marmaras
(
  'naias-neos-marmaras',
  'Ναϊάς',
  'Naias',
  'Η Ναϊάς στον Νέο Μαρμαρά σερβίρει θαλασσινά σε μια εξαιρετική τοποθεσία με θέα το λιμάνι. Τα ψάρια είναι πάντα φρέσκα και ετοιμάζονται με σεβασμό στην πρώτη ύλη. Δοκιμάστε τα γαριδάκι σαγανάκι, τη φρέσκια τσιπούρα στη σχάρα, τα μύδια αχνιστά και το χταπόδι ξιδάτο. Η ατμόσφαιρα είναι ζεστή με θαλασσινή αύρα. Εξυπηρέτηση φιλική. Ιδανική επιλογή για μεσημεριανό ή βραδινό φαγητό στον Μαρμαρά.',
  'Naias in Neos Marmaras serves seafood in an excellent location overlooking the harbor. Fish is always fresh and prepared with respect for the ingredient. Try the shrimp saganaki, grilled sea bream, steamed mussels, and vinegar octopus. Warm atmosphere with sea breeze. Friendly service. Ideal choice for lunch or dinner in Marmaras.',
  'sithonia', 'Neos Marmaras', 40.0862, 23.7652,
  '', '["seafood"]', 'moderate', 4.3, 29,
  '', '12:00-00:00',
  true, false, true,
  '["neos-marmaras", "harbor-view", "seafood", "fresh-fish", "friendly"]'
),

-- 30. Meliton - Porto Carras
(
  'meliton-porto-carras',
  'Meliton',
  'Meliton',
  'Το Meliton στο Porto Carras είναι το fine dining εστιατόριο του θρυλικού resort. Η κουζίνα είναι μεσογειακή με γαλλικές επιρροές και χρησιμοποιεί τα καλύτερα εποχιακά υλικά. Δοκιμάστε τα γεύματα degustation με ζευγάρωμα κρασιών από τους αμπελώνες Porto Carras. Φιλέτα, θαλασσινά και γλυκά σεφ σε υψηλή γαστρονομική εκδοχή. Ο χώρος είναι κομψός με λευκά τραπεζομάντιλα και ασημένια σκεύη. Εξυπηρέτηση τελετουργική. Για ειδικές περιστάσεις.',
  'Meliton at Porto Carras is the fine dining restaurant of the legendary resort. The cuisine is Mediterranean with French influences using the finest seasonal ingredients. Try the degustation menus with wine pairings from Porto Carras vineyards. Fillets, seafood, and chef''s desserts in haute gastronomy style. Elegant space with white tablecloths and silverware. Ceremonial service. For special occasions.',
  'sithonia', 'Porto Carras', 40.0534, 23.7823,
  '', '["fineDining", "mediterranean"]', 'fineDining', 4.7, 19,
  '', '19:00-23:30',
  true, false, true,
  '["porto-carras", "fine-dining", "resort", "degustation", "wine-pairing", "luxury"]'
),

-- 31. Taverna Sakis - Metamorfosi
(
  'taverna-sakis-metamorfosi',
  'Ταβέρνα Σάκης',
  'Taverna Sakis',
  'Η Ταβέρνα Σάκης στη Μεταμόρφωση είναι ένα αυθεντικό ντόπικο στέκι μακριά από τον τουρισμό. Εδώ τρώνε οι κάτοικοι του χωριού: σπιτικά μαγειρευτά, ψητά στα κάρβουνα και φρέσκιες σαλάτες. Τα σουτζουκάκια, η μπριζόλα χοιρινή, τα μπιφτέκια γεμιστά και τα λουκάνικα χωριάτικα είναι εξαιρετικά. Οι τιμές είναι πολύ χαμηλές. Ο χώρος είναι απλός με λίγα τραπέζια στην αυλή. Ιδανικό αν ψάχνετε γνήσια γεύση χωρίς τουριστικές τιμές.',
  'Taverna Sakis in Metamorfosi is an authentic local hangout away from tourism. This is where village residents eat: homemade cooked dishes, charcoal grills, and fresh salads. Soutzoukakia, pork chops, stuffed burgers, and village sausages are excellent. Prices are very low. Simple space with a few courtyard tables. Ideal if you seek genuine taste without tourist prices.',
  'sithonia', 'Metamorfosi', 40.2634, 23.7312,
  '', '["traditional", "grill"]', 'budget', 3.9, 8,
  '', '12:00-22:30',
  false, false, false,
  '["metamorfosi", "locals-only", "budget-friendly", "authentic", "grill", "village"]'
),

-- 32. Elia - Nikiti
(
  'elia-nikiti',
  'Ελιά',
  'Elia',
  'Η Ελιά στη Νικήτη είναι μια σύγχρονη ταβέρνα με θέμα την ελιά, στοιχείο αναπόσπαστο της Χαλκιδικής. Η κουζίνα είναι μεσογειακή με τοπικά υλικά: ελαιόλαδο εξαιρετικό παρθένο, ελιές Χαλκιδικής, λαχανικά εποχής. Δοκιμάστε τα ζυμαρικά με πέστο ελιάς, τη σαλάτα με κατσικίσιο τυρί και σύκο, και τα ψητά λαχανικά. Ο χώρος είναι μοντέρνος με ξύλινα στοιχεία. Φιλικό προσωπικό. Ιδανικό για ελαφρύ μεσογειακό γεύμα.',
  'Elia in Nikiti is a modern taverna themed around the olive, an integral element of Halkidiki. Mediterranean cuisine with local ingredients: extra virgin olive oil, Halkidiki olives, seasonal vegetables. Try the olive pesto pasta, goat cheese and fig salad, and grilled vegetables. Modern space with wooden elements. Friendly staff. Ideal for a light Mediterranean meal.',
  'sithonia', 'Nikiti', 40.2185, 23.6725,
  '', '["mediterranean"]', 'moderate', 4.2, 17,
  '', '12:00-00:00',
  false, false, true,
  '["nikiti", "olive-themed", "mediterranean", "modern", "local-ingredients", "light"]'
),

-- 33. Kamares - Ormos Panagias
(
  'kamares-ormos-panagias',
  'Καμάρες',
  'Kamares',
  'Οι Καμάρες στον Όρμο Παναγίας προσφέρουν φρέσκα θαλασσινά με θέα το γραφικό λιμάνι. Τα ψάρια αλιεύονται τοπικά και σερβίρονται με απλό τρόπο που αναδεικνύει τη φρεσκάδα τους. Δοκιμάστε τη φρέσκια τσιπούρα σχάρας, τα χταποδάκια κρασάτα και τις γαρίδες σαγανάκι. Ο χώρος είναι παραδοσιακός με καμάρες και πέτρα. Η θέα στο λιμάνι με τα χρωματιστά σκάφη είναι ιδανική για φωτογραφίες. Καλό σημείο εκκίνησης πριν από εκδρομή στο Διαπόρο.',
  'Kamares in Ormos Panagias offers fresh seafood overlooking the picturesque harbor. Fish is locally caught and served simply to highlight freshness. Try the grilled sea bream, wine-braised octopus, and shrimp saganaki. Traditional space with stone arches. The harbor view with colorful boats is perfect for photos. Great starting point before a Diaporos island excursion.',
  'sithonia', 'Ormos Panagias', 40.2460, 23.7530,
  '', '["seafood"]', 'moderate', 4.2, 23,
  '', '11:00-23:00',
  true, false, true,
  '["ormos-panagias", "harbor", "seafood", "stone-arches", "diaporos", "scenic"]'
),

-- 34. Akti - Toroni
(
  'akti-toroni',
  'Ακτή',
  'Akti',
  'Η Ακτή στην Τορώνη είναι μια απλή ψαροταβέρνα δίπλα στη θάλασσα, ιδανική για ανεπιτήδευτο φαγητό με τα πόδια στην άμμο. Τα θαλασσινά είναι φρέσκα και τα πιάτα ετοιμάζονται χωρίς περιττές φανφάρες. Δοκιμάστε τα καλαμαράκια τηγανητά, τη σαρδέλα σχάρας και τη φρέσκια σαλάτα. Οι τιμές είναι χαμηλές, ιδανικό για οικογένειες με παιδιά που θέλουν να φάνε μετά τη θάλασσα. Ήρεμη ατμόσφαιρα σε μια από τις ωραιότερες παραλίες.',
  'Akti in Toroni is a simple beachfront fish taverna, ideal for unpretentious dining with feet in the sand. Seafood is fresh and dishes are prepared without unnecessary fuss. Try the fried calamari, grilled sardines, and fresh salad. Prices are low, ideal for families with children wanting a meal after the beach. Calm atmosphere on one of the most beautiful beaches.',
  'sithonia', 'Toroni', 39.9870, 23.8930,
  '', '["seafood"]', 'budget', 3.9, 12,
  '', '10:00-22:00',
  true, false, false,
  '["toroni", "beachfront", "simple", "budget-friendly", "family", "beach"]'
),

-- 35. Agios Ioannis - Nikiti
(
  'agios-ioannis-nikiti',
  'Άγιος Ιωάννης',
  'Agios Ioannis',
  'Ο Άγιος Ιωάννης βρίσκεται στο παλιό χωριό της Νικήτης, μέσα στα γραφικά σοκάκια με τα πέτρινα σπίτια. Η κουζίνα είναι παραδοσιακή ελληνική με σπιτικά φαγητά: φασολάδα, μπριάμ, γίγαντες, κοτόπουλο λεμονάτο και αρνί στον φούρνο. Τα γλυκά του κουταλιού είναι σπιτικά. Ο χώρος αποπνέει ιστορία και ζεστασιά. Τιμές πολύ προσιτές. Ιδανικό αν θέλετε να γνωρίσετε τη γνήσια μαγειρική της Χαλκιδικής σε αυθεντικό περιβάλλον.',
  'Agios Ioannis sits in the old village of Nikiti, among picturesque alleys with stone houses. Traditional Greek cuisine with homemade dishes: bean soup, briam, giant beans, lemon chicken, and oven-baked lamb. Spoon sweets are homemade. The space exudes history and warmth. Very affordable prices. Ideal to experience genuine Halkidiki cooking in an authentic setting.',
  'sithonia', 'Nikiti', 40.2192, 23.6718,
  '', '["traditional"]', 'budget', 4.1, 10,
  '', '12:00-22:30',
  false, false, false,
  '["nikiti", "old-village", "traditional", "homemade", "historic", "budget-friendly"]'
),

-- 36. Apoplous - Neos Marmaras
(
  'apoplous-neos-marmaras',
  'Απόπλους',
  'Apoplous',
  'Ο Απόπλους στον Νέο Μαρμαρά είναι ένα σύγχρονο εστιατόριο θαλασσινών στο λιμάνι, με μεσογειακές επιρροές και υψηλή αισθητική. Δοκιμάστε τα tartare θαλασσινών, τα ριζότο με γαρίδες και σαφράν, τον αστακό κατσαρόλας και τα σπιτικά γλυκά. Η λίστα κρασιών είναι εντυπωσιακή. Κομψός χώρος με θέα τα σκάφη στο λιμάνι. Εξυπηρέτηση επαγγελματική. Ιδανικό για ζευγάρια και ειδικές περιστάσεις. Κρατήστε τραπέζι.',
  'Apoplous in Neos Marmaras is a modern seafood restaurant at the harbor with Mediterranean influences and high aesthetics. Try the seafood tartare, shrimp and saffron risotto, lobster stew, and homemade desserts. The wine list is impressive. Elegant space overlooking harbor boats. Professional service. Ideal for couples and special occasions. Reservations recommended.',
  'sithonia', 'Neos Marmaras', 40.0863, 23.7646,
  '', '["seafood", "mediterranean"]', 'upscale', 4.5, 27,
  '', '13:00-01:00',
  true, false, true,
  '["neos-marmaras", "upscale", "harbor", "modern", "wine", "romantic"]'
),

-- 37. Paradisos - Neos Marmaras
(
  'paradisos-neos-marmaras',
  'Παράδεισος',
  'Paradisos',
  'Ο Παράδεισος στον Νέο Μαρμαρά είναι μια παραλιακή ταβέρνα που συνδυάζει παραδοσιακή κουζίνα με θαλασσινά. Η τοποθεσία πάνω στην παραλία προσφέρει δροσιά και θέα. Δοκιμάστε τα ψητά ψάρια, τα σουβλάκια, τη χωριάτικη σαλάτα και τα μαγειρευτά της ημέρας. Ιδανικό για μεσημεριανό μετά τη θάλασσα ή χαλαρό βραδινό γεύμα. Φιλική εξυπηρέτηση, λογικές τιμές. Παιδική χαρά κοντά για τις οικογένειες.',
  'Paradisos in Neos Marmaras is a beach taverna combining traditional cuisine with seafood. The beachside location offers breeze and views. Try the grilled fish, souvlaki, village salad, and daily cooked specials. Ideal for lunch after swimming or a relaxed evening meal. Friendly service, reasonable prices. Playground nearby for families.',
  'sithonia', 'Neos Marmaras', 40.0910, 23.7590,
  '', '["traditional", "seafood"]', 'moderate', 4.1, 21,
  '', '11:00-23:30',
  true, false, false,
  '["neos-marmaras", "beach", "family-friendly", "traditional", "seafood", "playground"]'
),

-- 38. Panorama - Sarti
(
  'panorama-sarti',
  'Πανόραμα',
  'Panorama',
  'Το Πανόραμα στη Σάρτη βρίσκεται σε υψόμετρο πάνω από το χωριό και προσφέρει πανοραμική θέα στον Σιγγιτικό κόλπο και το Άγιο Όρος. Η κουζίνα είναι παραδοσιακή με ψητά κρέατα και φρέσκα ψάρια. Δοκιμάστε τα παϊδάκια αρνίσια, τα μπιφτέκια γεμιστά, τη φρέσκια τσιπούρα και τις σπιτικές πίτες. Η θέα, ειδικά το ηλιοβασίλεμα, είναι εντυπωσιακή. Ιδανικό για ρομαντικό δείπνο ή γεύμα με θέα. Τιμές λογικές.',
  'Panorama in Sarti sits on a hill above the village offering panoramic views of the Singitikos Gulf and Mount Athos. Traditional cuisine with grilled meats and fresh fish. Try the lamb chops, stuffed burgers, fresh sea bream, and homemade pies. The view, especially at sunset, is breathtaking. Ideal for a romantic dinner or a meal with a view. Reasonable prices.',
  'sithonia', 'Sarti', 40.0730, 23.9625,
  '', '["traditional", "grill"]', 'moderate', 4.3, 24,
  '', '12:00-00:00',
  true, false, true,
  '["sarti", "panoramic-view", "mount-athos-view", "grill", "sunset", "romantic"]'
),

-- 39. Captain''s Table - Vourvourou
(
  'captains-table-vourvourou',
  'Captain''s Table',
  'Captain''s Table',
  'Το Captain''s Table στη Βουρβουρού είναι ένα θεματικό εστιατόριο θαλασσινών με ναυτική ατμόσφαιρα. Η διακόσμηση περιλαμβάνει δίχτυα, σχοινιά και ναυτικά αντικείμενα. Τα πιάτα είναι βασισμένα στα θαλασσινά: φρέσκα ψάρια, γαρίδες, αστακός και μύδια. Δοκιμάστε τα ψαρονέφρια και τη σαλάτα Captain. Η τοποθεσία κοντά στον κόλπο της Βουρβουρού είναι ιδανική για γεύμα πριν ή μετά από εκδρομή με σκάφος.',
  'Captain''s Table in Vourvourou is a themed seafood restaurant with nautical atmosphere. Decor includes nets, ropes, and maritime objects. Dishes are seafood-based: fresh fish, shrimp, lobster, and mussels. Try the fish medallions and Captain salad. The location near Vourvourou bay is ideal for a meal before or after a boat excursion.',
  'sithonia', 'Vourvourou', 40.1920, 23.7715,
  '', '["seafood"]', 'moderate', 4.2, 19,
  '', '12:00-23:30',
  true, false, true,
  '["vourvourou", "nautical", "seafood", "boat-trip", "themed", "bay-view"]'
),

-- 40. Limani - Porto Koufo
(
  'taverna-porto-koufo-harbor',
  'Λιμάνι',
  'Limani',
  'Το Λιμάνι βρίσκεται στο λιμάνι του Πόρτο Κουφό, ένα από τα πιο εντυπωσιακά φυσικά λιμάνια της Μεσογείου. Η ψαροταβέρνα σερβίρει φρέσκα ψάρια και θαλασσινά σε ένα γαλήνιο περιβάλλον. Δοκιμάστε τη φρέσκια ψαρόσουπα, τα μπαρμπούνια σχάρας, τα καλαμαράκια τηγανητά και το χταπόδι ξιδάτο. Τα τραπέζια δίπλα στη θάλασσα προσφέρουν μια μοναδική εμπειρία. Ήσυχη ατμόσφαιρα. Τιμές λογικές.',
  'Limani sits at Porto Koufo harbor, one of the most impressive natural harbors in the Mediterranean. The fish taverna serves fresh fish and seafood in a serene setting. Try the fresh fish soup, grilled red mullet, fried calamari, and vinegar octopus. Waterside tables offer a unique experience. Quiet atmosphere. Reasonable prices.',
  'sithonia', 'Porto Koufo', 39.9685, 23.9138,
  '', '["seafood", "traditional"]', 'moderate', 4.2, 20,
  '', '11:00-23:00',
  true, false, false,
  '["porto-koufo", "harbor", "natural-harbor", "seafood", "quiet", "waterside"]'
),

-- 41. Souvlaki Express - Neos Marmaras
(
  'souvlaki-express-neos-marmaras',
  'Σουβλάκι Express',
  'Souvlaki Express',
  'Το Σουβλάκι Express στον Νέο Μαρμαρά θεωρείται το καλύτερο σουβλατζίδικο της Σιθωνίας. Φρέσκα υλικά, μεγάλες μερίδες και γρήγορη εξυπηρέτηση. Δοκιμάστε το γύρο χοιρινό ή κοτόπουλο σε πίτα, τα σουβλάκια καλαμάκι, τα μπιφτέκια και τις μεγάλες μερίδες πατάτες. Η πίτα είναι χειροποίητη και η σάλτσα τζατζίκι σπιτική. Ιδανικό για γρήγορο φαγητό μετά την παραλία. Τιμές πολύ χαμηλές. Λειτουργεί και για take away.',
  'Souvlaki Express in Neos Marmaras is considered the best souvlaki spot in Sithonia. Fresh ingredients, large portions, and quick service. Try the pork or chicken gyros in pita, souvlaki sticks, burgers, and large fries. Pita is handmade and tzatziki is homemade. Ideal for a quick meal after the beach. Very low prices. Take away available.',
  'sithonia', 'Neos Marmaras', 40.0868, 23.7643,
  '', '["grill", "streetFood"]', 'budget', 4.3, 34,
  '', '11:00-02:00',
  false, false, false,
  '["neos-marmaras", "souvlaki", "gyros", "street-food", "takeaway", "budget-friendly"]'
),

-- 42. Psarotaverna Dimitris - Sarti
(
  'psarotaverna-dimitris-sarti',
  'Ψαροταβέρνα Δημήτρης',
  'Psarotaverna Dimitris',
  'Η Ψαροταβέρνα Δημήτρης στη Σάρτη σερβίρει καθημερινά φρέσκο αλίευμα απευθείας από τα σκάφη των ντόπιων ψαράδων. Τα ψάρια ψήνονται στη σχάρα ή τηγανίζονται, ενώ οι γαρίδες και τα μύδια μαγειρεύονται σε σαγανάκι ή αχνιστά. Δοκιμάστε τη φρέσκια συναγρίδα, τα γαριδάκια σαγανάκι και την ψαρόσουπα. Ο χώρος είναι απλός με θέα τη θάλασσα. Φιλική εξυπηρέτηση. Δίκαιες τιμές για φρέσκο ψάρι.',
  'Psarotaverna Dimitris in Sarti serves fresh daily catch directly from local fishing boats. Fish is grilled or fried, while shrimp and mussels are prepared as saganaki or steamed. Try the fresh red snapper, shrimp saganaki, and fish soup. Simple space with sea views. Friendly service. Fair prices for fresh fish.',
  'sithonia', 'Sarti', 40.0725, 23.9640,
  '', '["seafood"]', 'moderate', 4.2, 22,
  '', '11:00-23:00',
  true, false, false,
  '["sarti", "fresh-catch", "daily-fish", "simple", "sea-view", "fishermen"]'
),

-- 43. Manolis - Vourvourou
(
  'manolis-vourvourou',
  'Μανώλης',
  'Manolis',
  'Ο Μανώλης στη Βουρβουρού είναι μια οικογενειακή ταβέρνα με παραδοσιακή ελληνική κουζίνα. Τα πιάτα ετοιμάζονται σπιτικά με αγάπη: μουσακάς, παστίτσιο, σουτζουκάκια, κεφτέδες, χωριάτικη σαλάτα. Οι μερίδες είναι μεγάλες και οι τιμές χαμηλές. Ο χώρος είναι απλός με κληματαριά. Ιδανικό για οικογένειες που μένουν στη Βουρβουρού και θέλουν σπιτικό φαγητό χωρίς υπερβολές. Ζεστή φιλοξενία.',
  'Manolis in Vourvourou is a family taverna with traditional Greek cuisine. Dishes are homemade with love: moussaka, pastitsio, soutzoukakia, meatballs, and village salad. Portions are large and prices low. Simple space under a vine canopy. Ideal for families staying in Vourvourou wanting homemade food without fuss. Warm hospitality.',
  'sithonia', 'Vourvourou', 40.1918, 23.7720,
  '', '["traditional"]', 'budget', 4.0, 9,
  '', '12:00-22:30',
  false, false, false,
  '["vourvourou", "family", "homemade", "budget-friendly", "vine-canopy", "traditional"]'
),

-- 44. Mylos - Nikiti
(
  'taverna-mylos-nikiti',
  'Μύλος',
  'Mylos',
  'Ο Μύλος στη Νικήτη στεγάζεται σε ένα αναπαλαιωμένο παλιό μύλο, προσφέροντας μια ατμοσφαιρική γαστρονομική εμπειρία. Η κουζίνα συνδυάζει παραδοσιακά πιάτα με μεσογειακές πινελιές. Δοκιμάστε τα ζυμαρικά σπιτικά, τα ψητά κρέατα, τις σαλάτες με τοπικά τυριά και τα σπιτικά γλυκά. Η πέτρινη αρχιτεκτονική του μύλου δημιουργεί μοναδική ατμόσφαιρα, ειδικά τα βράδια με κεριά. Εξυπηρέτηση φιλική. Κατάλληλο για ρομαντικό δείπνο.',
  'Mylos in Nikiti is housed in a restored old mill, offering an atmospheric dining experience. The cuisine combines traditional dishes with Mediterranean touches. Try the handmade pasta, grilled meats, salads with local cheeses, and homemade desserts. The stone architecture creates a unique atmosphere, especially candlelit evenings. Friendly service. Suitable for romantic dinners.',
  'sithonia', 'Nikiti', 40.2195, 23.6715,
  '', '["traditional", "mediterranean"]', 'moderate', 4.4, 25,
  '', '13:00-00:00',
  false, false, true,
  '["nikiti", "old-mill", "atmospheric", "romantic", "stone", "candlelit"]'
),

-- 45. Ouzeri Psaraki - Neos Marmaras
(
  'ouzeri-psaraki-neos-marmaras',
  'Ουζερί Ψαράκι',
  'Ouzeri Psaraki',
  'Το Ουζερί Ψαράκι στον Νέο Μαρμαρά είναι ένα αυθεντικό ουζερί για λάτρεις του μεζέ και του ούζου. Τα πιάτα είναι μικρές μερίδες θαλασσινών: χταποδάκι ξιδάτο, γαρίδες σαγανάκι, αθερίνα τηγανητή, μύδια αχνιστά, σαρδέλες ψητές. Συνοδεύονται με ούζο, τσίπουρο ή κρασί χύμα. Ο χώρος είναι μικρός και γραφικός. Ιδανικό για απογευματινό μεζέ δίπλα στη θάλασσα. Τιμές πολύ λογικές.',
  'Ouzeri Psaraki in Neos Marmaras is an authentic ouzeri for meze and ouzo lovers. Dishes are small seafood portions: vinegar octopus, shrimp saganaki, fried whitebait, steamed mussels, grilled sardines. Accompanied by ouzo, tsipouro, or bulk wine. Small, picturesque space. Ideal for afternoon meze by the sea. Very reasonable prices.',
  'sithonia', 'Neos Marmaras', 40.0858, 23.7655,
  '', '["seafood"]', 'budget', 4.1, 16,
  '', '12:00-00:00',
  true, false, false,
  '["neos-marmaras", "ouzeri", "meze", "ouzo", "tsipouro", "seafood", "afternoon"]'
),

-- ============================================================
-- ATHOS + MAINLAND (10 restaurants)
-- ============================================================

-- 46. Pirgos - Ouranoupoli
(
  'pirgos-ouranoupoli',
  'Πύργος',
  'Pirgos',
  'Ο Πύργος στην Ουρανούπολη είναι η κορυφαία ψαροταβέρνα της περιοχής, με θέα τον Βυζαντινό πύργο και τη θάλασσα. Τα ψάρια είναι τα φρεσκότερα, αλιευμένα από τοπικά σκάφη, και μαγειρεύονται με σεβασμό στην πρώτη ύλη. Δοκιμάστε τα μπαρμπούνια, τη φρέσκια τσιπούρα σχάρας, τον αστακό και τα μύδια. Η ψαρόσουπα αυγολέμονο είναι εξαιρετική. Η θέα στο Άγιο Όρος από τη βεράντα είναι μαγευτική. Εξυπηρέτηση άριστη.',
  'Pirgos in Ouranoupoli is the top fish taverna in the area, with views of the Byzantine tower and sea. Fish is the freshest, caught by local boats, and cooked with respect for the ingredient. Try the red mullet, grilled sea bream, lobster, and mussels. The egg-lemon fish soup is exceptional. The Mount Athos view from the terrace is magical. Excellent service.',
  'athos', 'Ouranoupoli', 40.3270, 24.0920,
  '', '["seafood"]', 'moderate', 4.6, 40,
  '', '11:00-23:30',
  true, false, true,
  '["ouranoupoli", "tower-view", "mount-athos", "fresh-fish", "top-rated", "terrace"]'
),

-- 47. Kokkinos - Ouranoupoli
(
  'kokkinos-ouranoupoli',
  'Κόκκινος',
  'Kokkinos',
  'Ο Κόκκινος στην Ουρανούπολη είναι ένα μοντέρνο restaurant-bar που συνδυάζει μεσογειακή κουζίνα με κοκτέιλ. Δοκιμάστε τα πιάτα μεσογειακής έμπνευσης: ριζότο, ζυμαρικά, σαλάτες δημιουργικές και ψητά κρέατα. Τα κοκτέιλ ετοιμάζονται από έμπειρο barman. Η μουσική δημιουργεί ατμόσφαιρα χωρίς να ενοχλεί. Μοντέρνα διακόσμηση με κόκκινες πινελιές. Ιδανικό για βραδινή έξοδο μετά τη βόλτα στο λιμάνι της Ουρανούπολης.',
  'Kokkinos in Ouranoupoli is a modern restaurant-bar combining Mediterranean cuisine with cocktails. Try Mediterranean-inspired dishes: risotto, pasta, creative salads, and grilled meats. Cocktails are prepared by an experienced barman. Music creates atmosphere without being intrusive. Modern decor with red accents. Ideal for an evening out after a harbor stroll in Ouranoupoli.',
  'athos', 'Ouranoupoli', 40.3265, 24.0925,
  '', '["mediterranean"]', 'moderate', 4.1, 18,
  '', '17:00-01:00',
  false, false, true,
  '["ouranoupoli", "bar", "cocktails", "modern", "evening", "mediterranean"]'
),

-- 48. Athos Restaurant Bar - Ouranoupoli
(
  'athos-restaurant-ouranoupoli',
  'Athos Restaurant Bar',
  'Athos Restaurant Bar',
  'Το Athos Restaurant Bar στην Ουρανούπολη προσφέρει σύγχρονη ελληνική κουζίνα σε ένα κομψό περιβάλλον. Τα πιάτα συνδυάζουν τοπικά υλικά με δημιουργικές τεχνικές. Δοκιμάστε τα θαλασσινά ριζότο, τις σαλάτες με τοπικά τυριά, τα ψητά φιλέτα και τα σπιτικά γλυκά. Η κάρτα ποτών περιλαμβάνει τοπικά κρασιά και δημιουργικά κοκτέιλ. Ο χώρος είναι μοντέρνος. Βρίσκεται κοντά στο λιμάνι, ιδανικό πριν ή μετά από εκδρομή στο Άγιο Όρος.',
  'Athos Restaurant Bar in Ouranoupoli offers contemporary Greek cuisine in an elegant setting. Dishes combine local ingredients with creative techniques. Try the seafood risotto, salads with local cheeses, grilled fillets, and homemade desserts. The drinks menu includes local wines and creative cocktails. Modern space near the harbor, ideal before or after a Mount Athos excursion.',
  'athos', 'Ouranoupoli', 40.3268, 24.0918,
  '', '["mediterranean"]', 'moderate', 4.2, 15,
  '', '12:00-01:00',
  false, false, true,
  '["ouranoupoli", "modern-greek", "harbor", "mount-athos", "cocktails", "contemporary"]'
),

-- 49. Psarotaverna Akri - Ierissos
(
  'psarotaverna-akri-ierissos',
  'Ψαροταβέρνα Άκρη',
  'Psarotaverna Akri',
  'Η Ψαροταβέρνα Άκρη στην Ιερισσό βρίσκεται δίπλα στο λιμάνι και σερβίρει φρέσκα ψάρια και θαλασσινά. Τα αλιεύματα φτάνουν καθημερινά από τα τοπικά σκάφη. Δοκιμάστε τη φρέσκια τσιπούρα, τα μπαρμπούνια τηγανητά, τα μύδια αχνιστά και το χταπόδι σχάρας. Η ψαρόσουπα είναι εξαιρετική. Ο χώρος είναι απλός αλλά καθαρός με θέα τα ψαροκάικα. Τιμές δίκαιες. Ιδανικό στέκι πριν τον πλου για Αμμουλιανή.',
  'Psarotaverna Akri in Ierissos sits by the port serving fresh fish and seafood. Catch arrives daily from local boats. Try the fresh sea bream, fried red mullet, steamed mussels, and grilled octopus. The fish soup is excellent. Simple but clean setting overlooking fishing boats. Fair prices. Ideal stop before sailing to Ammouliani.',
  'athos', 'Ierissos', 40.3989, 23.8767,
  '', '["seafood"]', 'moderate', 4.3, 21,
  '', '11:00-23:00',
  true, false, false,
  '["ierissos", "port", "fresh-fish", "ammouliani", "fishing-boats", "simple"]'
),

-- 50. Giorgos - Ammouliani
(
  'giorgos-ammouliani',
  'Γιώργος',
  'Giorgos',
  'Ο Γιώργος στην Αμμουλιανή είναι μια νησιώτικη ταβέρνα που σερβίρει ψητά ψάρια και παραδοσιακά πιάτα. Βρίσκεται στο κέντρο του νησιού με θέα το λιμάνι. Τα ψάρια ψήνονται στη σχάρα ολόκληρα με λαδολέμονο. Δοκιμάστε τη φρέσκια τσιπούρα, τα καλαμαράκια, τα χταποδάκια και τα σπιτικά ορεκτικά. Η ατμόσφαιρα είναι νησιωτική και χαλαρή. Τιμές μέτριες. Ιδανικό για γεύμα κατά τη διάρκεια ημερήσιας εκδρομής στην Αμμουλιανή.',
  'Giorgos in Ammouliani is an island taverna serving grilled fish and traditional dishes. Located centrally with harbor views. Fish is grilled whole with olive oil and lemon. Try the fresh sea bream, calamari, octopus, and homemade starters. Island atmosphere, relaxed vibe. Moderate prices. Ideal for a meal during a day trip to Ammouliani.',
  'athos', 'Ammouliani', 40.3345, 23.9356,
  '', '["seafood", "traditional"]', 'moderate', 4.2, 17,
  '', '11:00-23:00',
  true, false, false,
  '["ammouliani", "island", "grilled-fish", "harbor", "day-trip", "relaxed"]'
),

-- 51. Alykes - Ammouliani
(
  'alykes-ammouliani',
  'Αλυκές',
  'Alykes',
  'Η ταβέρνα Αλυκές στην Αμμουλιανή βρίσκεται στην ομώνυμη παραλία, μια από τις ομορφότερες του νησιού. Τα τραπέζια είναι πάνω στην άμμο με θέα τα τιρκουάζ νερά. Τα θαλασσινά είναι φρέσκα: ψάρια σχάρας, γαρίδες, μύδια και αχινοσαλάτα. Δοκιμάστε τη φρέσκια σαρδέλα σχάρας και το χταπόδι. Ιδανικό μέρος για μεσημεριανό μετά το κολύμπι. Ήρεμη ατμόσφαιρα, φυσική ομορφιά. Τιμές αναλογικές.',
  'Alykes taverna in Ammouliani sits on the namesake beach, one of the island''s most beautiful. Tables are on the sand with turquoise water views. Seafood is fresh: grilled fish, shrimp, mussels, and sea urchin salad. Try the grilled sardines and octopus. Ideal for lunch after swimming. Calm atmosphere, natural beauty. Proportional prices.',
  'athos', 'Ammouliani', 40.3312, 23.9378,
  '', '["seafood"]', 'moderate', 4.3, 14,
  '', '10:00-22:00',
  true, false, false,
  '["ammouliani", "alykes-beach", "turquoise", "beachfront", "seafood", "swimming"]'
),

-- 52. Bougatsa Filippos - Nea Moudania
(
  'bougatsa-filippos-moudania',
  'Μπουγάτσα Φίλιππος',
  'Bougatsa Filippos',
  'Η Μπουγάτσα Φίλιππος στα Νέα Μουδανιά είναι ένα θρυλικό μαγαζί γνωστό σε ολόκληρη τη Χαλκιδική για τη φρέσκια μπουγάτσα του. Κρέμα, τυρί ή κιμάς, σε τραγανό χειροποίητο φύλλο που ετοιμάζεται μπροστά στα μάτια σας. Εξυπηρετεί από τις πρώτες πρωινές ώρες ντόπιους και ταξιδιώτες που περνούν από τα Μουδανιά. Δοκιμάστε επίσης τις τυρόπιτες, τα κρουασάν και τον καφέ. Τιμές πολύ χαμηλές. Σταθμός ανεφοδιασμού πριν τη Χαλκιδική.',
  'Bougatsa Filippos in Nea Moudania is a legendary shop known across Halkidiki for its fresh bougatsa. Cream, cheese, or minced meat in crispy handmade phyllo prepared before your eyes. Serving from early morning to locals and travelers passing through Moudania. Also try the cheese pies, croissants, and coffee. Very low prices. A refueling stop before heading into Halkidiki.',
  'kassandra', 'Nea Moudania', 40.2400, 23.2842,
  '', '["cafe", "streetFood"]', 'budget', 4.5, 45,
  '', '05:00-15:00',
  false, false, false,
  '["moudania", "bougatsa", "breakfast", "legendary", "phyllo", "budget-friendly", "morning"]'
),

-- 53. Ouzeri Thalassa - Nea Moudania
(
  'ouzeri-thalassa-moudania',
  'Ουζερί Θάλασσα',
  'Ouzeri Thalassa',
  'Το Ουζερί Θάλασσα στα Νέα Μουδανιά βρίσκεται στην παραλία και σερβίρει εξαιρετικούς μεζέδες θαλασσινών. Δοκιμάστε τη μαρίδα τηγανητή, τα χταποδάκια ξιδάτα, τις γαρίδες σαγανάκι, τα κολοκυθοκεφτεδάκια και τα μύδια αχνιστά. Συνοδεύονται με ούζο ή τσίπουρο από τοπικά αποστακτήρια. Ο χώρος είναι απλός δίπλα στη θάλασσα. Ιδανικό για απογευματινό ούζο με φίλους. Τιμές πολύ λογικές.',
  'Ouzeri Thalassa in Nea Moudania sits on the waterfront serving excellent seafood meze. Try the fried whitebait, vinegar octopus, shrimp saganaki, zucchini fritters, and steamed mussels. Accompanied by ouzo or tsipouro from local distilleries. Simple waterfront setting. Ideal for afternoon ouzo with friends. Very reasonable prices.',
  'kassandra', 'Nea Moudania', 40.2405, 23.2835,
  '', '["seafood"]', 'budget', 4.2, 19,
  '', '12:00-00:00',
  true, false, false,
  '["moudania", "waterfront", "ouzeri", "meze", "ouzo", "tsipouro", "afternoon"]'
),

-- 54. Taverna Arnaia
(
  'taverna-arnaia',
  'Ταβέρνα Αρναία',
  'Taverna Arnaia',
  'Η Ταβέρνα Αρναία βρίσκεται στο ορεινό χωριό Αρναία, στο κέντρο της Χαλκιδικής. Εξειδικεύεται σε κρεατικά: αρνί στη σούβλα, κοκορέτσι, κοντοσούβλι, μπριζόλες και χωριάτικα λουκάνικα. Τα κρέατα είναι τοπικά από κτηνοτρόφους της περιοχής. Δοκιμάστε τις χειροποίητες πίτες με φέτα και τα χόρτα βουνού. Ο χώρος είναι παραδοσιακός με τζάκι τον χειμώνα. Ιδανικό για χειμερινή εκδρομή στην Αρναία. Πολύ προσιτές τιμές.',
  'Taverna Arnaia sits in the mountain village of Arnaia in central Halkidiki. Specializing in meats: spit-roasted lamb, kokoretsi, kontosouvli, steaks, and village sausages. Meats are local from area farmers. Try the handmade feta pies and mountain greens. Traditional space with a fireplace in winter. Ideal for a winter excursion to Arnaia. Very affordable prices.',
  'athos', 'Arnaia', 40.4734, 23.5834,
  '', '["traditional", "grill"]', 'budget', 4.1, 13,
  '', '11:00-22:00',
  false, false, false,
  '["arnaia", "mountain", "spit-roast", "lamb", "fireplace", "winter", "village"]'
),

-- 55. Mpourazani - Nea Potidea
(
  'mpourazani-nea-potidea',
  'Μπουραζάνι',
  'Mpourazani',
  'Το Μπουραζάνι στη Νέα Ποτίδαια βρίσκεται δίπλα στο κανάλι που χωρίζει τη Χαλκιδική από την ηπειρωτική Ελλάδα. Η θέα στο κανάλι είναι μοναδική. Εξειδικεύεται στα ψητά κρέατα: χοιρινή μπριζόλα, κοντοσούβλι, σουτζουκάκια, μπιφτέκια και λουκάνικα. Δοκιμάστε επίσης τις σαλάτες και τα ορεκτικά. Ο χώρος είναι ευρύχωρος με υπαίθρια τραπέζια. Τιμές χαμηλές. Σταθμός για φαγητό πριν ή μετά τη Χαλκιδική.',
  'Mpourazani in Nea Potidea sits beside the canal separating Halkidiki from mainland Greece. The canal view is unique. Specializing in grilled meats: pork chops, kontosouvli, soutzoukakia, burgers, and sausages. Also try the salads and appetizers. Spacious setting with outdoor tables. Low prices. A food stop before or after Halkidiki.',
  'kassandra', 'Nea Potidea', 40.1978, 23.3234,
  '', '["grill", "traditional"]', 'budget', 3.8, 11,
  '', '11:00-23:00',
  false, false, false,
  '["nea-potidea", "canal", "grill", "meat", "budget-friendly", "stopover"]'
);

COMMIT;
