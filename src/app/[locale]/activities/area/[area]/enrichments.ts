// Long-form editorial content per activities-by-area page.
// Same pattern as /best/[slug]/enrichments.ts — keyed by area slug.
// Areas without an entry fall back to the lean default render.

export interface AreaActivityEnrichment {
  intro?: Record<string, string>;
  seasonal?: Record<string, string>;
  tips?: Record<string, string>;
  faqs?: { q: Record<string, string>; a: Record<string, string> }[];
}

export const ENRICHMENTS: Record<string, AreaActivityEnrichment> = {
  kassandra: {
    intro: {
      el: '<p>Η <strong>Κασσάνδρα</strong> είναι το πρώτο και πιο αναπτυγμένο πόδι της Χαλκιδικής — και το πιο πυκνό σε δραστηριότητες για όλες τις ηλικίες. Από <strong>water parks</strong> και beach clubs στην Καλλιθέα και τη Χανιώτη, μέχρι <strong>θαλάσσια σπορ</strong> σε κάθε οργανωμένη παραλία, <strong>boat trips</strong> από τη Σιβηρή και την Παλιούρι, σπα και wellness centers στα 5* resorts (Σάνη, Ikos), και πεζοπορικά στους λόφους της Αφύτου. Η μικρή απόσταση από τη Θεσσαλονίκη (60-120 χλμ) την κάνει ιδανική και για day trips. Αυτή η σελίδα συγκεντρώνει όλες τις δραστηριότητες με τις υψηλότερες αξιολογήσεις στην Κασσάνδρα.</p>',
      en: '<p><strong>Kassandra</strong> is the first and most developed peninsula of Halkidiki — and the densest in activities for all ages. From <strong>water parks</strong> and beach clubs in Kallithea and Hanioti, to <strong>watersports</strong> at every organised beach, <strong>boat trips</strong> from Siviri and Paliouri, spa and wellness at 5* resorts (Sani, Ikos), and hiking on Afytos\' hills. The short distance from Thessaloniki (60-120 km) makes it ideal for day trips too. This page collects the highest-rated activities in Kassandra.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να επισκεφτείς</h2><p><strong>Ιούνιος-Σεπτέμβριος:</strong> Όλες οι δραστηριότητες λειτουργούν — water parks, beach clubs, boat trips. <strong>Μάιος και Οκτώβριος:</strong> Λιγότερος κόσμος, καλύτερες τιμές, οι πιο πολλές δραστηριότητες ακόμα ανοιχτές. <strong>Χειμώνας:</strong> Λειτουργούν μόνο εστιατόρια, ξενοδοχεία, spa σε resorts και κάποια ιστορικά αξιοθέατα.</p>',
      en: '<h2>When to visit</h2><p><strong>June-September:</strong> All activities operate — water parks, beach clubs, boat trips. <strong>May and October:</strong> Fewer crowds, better prices, most activities still open. <strong>Winter:</strong> Only restaurants, hotels, resort spas and some historical sites remain open.</p>',
    },
    tips: {
      el: '<h2>Πρακτικές συμβουλές για την Κασσάνδρα</h2><ul><li><strong>Πρόσβαση:</strong> 60-120 χλμ από Θεσσαλονίκη μέσω της διώρυγας Ποτίδαιας. Αυτοκίνητο ιδανικό — υπάρχει και KTEL bus.</li><li><strong>Διαμονή:</strong> Δες <a href="/best/luxury-hotels">luxury hotels</a> ή <a href="/listings">όλα τα καταλύματα</a>.</li><li><strong>Water park:</strong> Aqualand Water Fun Park στη Νέα Πλάγια — μεγαλύτερο της περιοχής.</li><li><strong>Boat trips:</strong> Από Σιβηρή (€25-40/άτομο, half-day) ή Παλιούρι (full-day cruise προς Σιθωνία).</li><li><strong>Family:</strong> Δες τις <a href="/best/family-beaches">οικογενειακές παραλίες</a> και <a href="/best/kids-activities">δραστηριότητες για παιδιά</a>.</li><li><strong>Συνδυασμός:</strong> Πρωί ιστορικά (Άφυτος old village) + απόγευμα παραλία + βραδινό σε <a href="/best/traditional-tavernas">παραδοσιακή ταβέρνα</a>.</li><li><strong>Κράτηση:</strong> Boat trips και water sports rentals 1-2 μέρες πριν για peak season.</li></ul>',
      en: '<h2>Practical tips for Kassandra</h2><ul><li><strong>Access:</strong> 60-120 km from Thessaloniki via the Potidea canal. Car is ideal — KTEL bus also available.</li><li><strong>Where to stay:</strong> See <a href="/best/luxury-hotels">luxury hotels</a> or <a href="/listings">all accommodation</a>.</li><li><strong>Water park:</strong> Aqualand Water Fun Park in Nea Plagia — biggest in the region.</li><li><strong>Boat trips:</strong> From Siviri (€25-40/person, half-day) or Paliouri (full-day cruise to Sithonia).</li><li><strong>Family:</strong> See our <a href="/best/family-beaches">family beaches</a> and <a href="/best/kids-activities">kids activities</a>.</li><li><strong>Combine:</strong> Morning sightseeing (Afytos old village) + afternoon beach + dinner at a <a href="/best/traditional-tavernas">traditional taverna</a>.</li><li><strong>Booking:</strong> Boat trips and water sports rentals 1-2 days ahead for peak season.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Ποιες είναι οι κορυφαίες δραστηριότητες στην Κασσάνδρα;', en: 'What are the top activities in Kassandra?' },
        a: { el: 'Water park (Aqualand), boat trips από Σιβηρή/Παλιούρι, water sports (jet ski, SUP, parasailing) σε Καλλιθέα/Χανιώτη, επίσκεψη στο παραδοσιακό χωριό Άφυτος, spa στα resorts. Δες <a href="/best/water-sports">water sports</a>.', en: 'Water park (Aqualand), boat trips from Siviri/Paliouri, water sports (jet ski, SUP, parasailing) in Kallithea/Hanioti, visit to Afytos traditional village, resort spas. See <a href="/best/water-sports">water sports</a>.' },
      },
      {
        q: { el: 'Πόσες μέρες χρειάζομαι;', en: 'How many days do I need?' },
        a: { el: '3-5 μέρες για ικανοποιητική εμπειρία. Day trip από Θεσσαλονίκη επίσης εφικτό αλλά περιοριστικό.', en: '3-5 days for a satisfying experience. Day trip from Thessaloniki is also possible but limiting.' },
      },
      {
        q: { el: 'Είναι κατάλληλη η Κασσάνδρα για οικογένειες με παιδιά;', en: 'Is Kassandra suitable for families with kids?' },
        a: { el: 'Πολύ. Έχει water park, ρηχές παραλίες, kids clubs σε resorts (Σάνη, Ikos), παιδικά μενού παντού. Πιο family-friendly από τη Σιθωνία.', en: 'Very much. Water park, shallow beaches, kids clubs at resorts (Sani, Ikos), kid menus everywhere. More family-friendly than Sithonia.' },
      },
    ],
  },

  sithonia: {
    intro: {
      el: '<p>Η <strong>Σιθωνία</strong> είναι το μεσαίο πόδι της Χαλκιδικής — λιγότερο αναπτυγμένη από την Κασσάνδρα, αλλά με τα πιο εντυπωσιακά τοπία και τις πιο "παρθένες" εμπειρίες. Οι δραστηριότητες εδώ είναι περισσότερο φυσικές: <strong>kayak και SUP</strong> στα νησάκια της Βουρβουρούς, <strong>scuba diving</strong> σε καθαρά νερά, <strong>πεζοπορία</strong> στο Aristotle Trail και τον Ίταμο, <strong>boat trips</strong> προς Άγιο Όρος από Νέο Μαρμαρά, <strong>winery tours</strong> στη βορεινή Σιθωνία. Λιγότερα μεγάλα resorts, περισσότερα boutique καταλύματα και autοentικές εμπειρίες. Αυτή η σελίδα συγκεντρώνει όλες τις top-rated δραστηριότητες της Σιθωνίας.</p>',
      en: '<p><strong>Sithonia</strong> is Halkidiki\'s middle peninsula — less developed than Kassandra but with the most stunning landscapes and most "untouched" experiences. Activities here are more nature-focused: <strong>kayak and SUP</strong> around Vourvourou\'s islets, <strong>scuba diving</strong> in clear water, <strong>hiking</strong> on the Aristotle Trail and Itamos, <strong>boat trips</strong> to Mount Athos from Neos Marmaras, <strong>winery tours</strong> in northern Sithonia. Fewer mega resorts, more boutique stays and authentic experiences. This page collects all top-rated Sithonia activities.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να επισκεφτείς</h2><p><strong>Καλοκαίρι (Ιούνιος-Σεπτέμβριος):</strong> Όλα τα water sports λειτουργούν, καθαρό νερό για snorkeling/diving, boat trips καθημερινά. <strong>Άνοιξη/Φθινόπωρο:</strong> Ιδανικά για πεζοπορία και winery visits — δροσερός καιρός, λιγότερος κόσμος.</p>',
      en: '<h2>When to visit</h2><p><strong>Summer (June-September):</strong> All water sports operate, clear water for snorkelling/diving, daily boat trips. <strong>Spring/Autumn:</strong> Ideal for hiking and winery visits — cool weather, fewer crowds.</p>',
    },
    tips: {
      el: '<h2>Πρακτικές συμβουλές για τη Σιθωνία</h2><ul><li><strong>Πρόσβαση:</strong> 100-130 χλμ από Θεσσαλονίκη. Αυτοκίνητο σχεδόν απαραίτητο — οι αποστάσεις μεγάλες, KTEL περιορισμένο.</li><li><strong>Βουρβουρού (Blue Lagoon):</strong> Best kayak/SUP experience της Χαλκιδικής — εξερεύνηση μικρών νησιών.</li><li><strong>Boat trip Αγίου Όρους:</strong> Από Νέο Μαρμαρά ή Ορμό Παναγίας, full-day €40-70 με γεύμα. Γυναίκες έτσι βλέπουν τα μοναστήρια.</li><li><strong>Scuba diving:</strong> Καλύτερα κέντρα στον Νέο Μαρμαρά. Δες <a href="/best/water-sports">water sports</a>.</li><li><strong>Πεζοπορία:</strong> Aristotle Trail περνά από Παρθενώνα. Δες <a href="/best/hiking-trails">πεζοπορικές διαδρομές</a>.</li><li><strong>Παραλίες:</strong> Δες <a href="/best/beaches-sithonia">όλες τις παραλίες</a> και <a href="/best/snorkeling-spots">snorkeling spots</a>.</li><li><strong>Wineries:</strong> Domaine Porto Carras, Claudia Papayanni Estate. Tastings €10-20.</li></ul>',
      en: '<h2>Practical tips for Sithonia</h2><ul><li><strong>Access:</strong> 100-130 km from Thessaloniki. Car almost essential — distances are large, KTEL bus limited.</li><li><strong>Vourvourou (Blue Lagoon):</strong> Best kayak/SUP experience in Halkidiki — exploring small islets.</li><li><strong>Mount Athos boat trip:</strong> From Neos Marmaras or Ormos Panagias, full-day €40-70 with lunch. How women see the monasteries.</li><li><strong>Scuba diving:</strong> Best centres in Neos Marmaras. See <a href="/best/water-sports">water sports</a>.</li><li><strong>Hiking:</strong> Aristotle Trail passes through Parthenonas. See <a href="/best/hiking-trails">hiking trails</a>.</li><li><strong>Beaches:</strong> See <a href="/best/beaches-sithonia">all beaches</a> and <a href="/best/snorkeling-spots">snorkeling spots</a>.</li><li><strong>Wineries:</strong> Domaine Porto Carras, Claudia Papayanni Estate. Tastings €10-20.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Ποιες είναι οι κορυφαίες δραστηριότητες στη Σιθωνία;', en: 'What are the top activities in Sithonia?' },
        a: { el: 'Kayak/SUP στη Βουρβουρού, boat trip Άγιο Όρος από Νέο Μαρμαρά, scuba diving, πεζοπορία στο Aristotle Trail, winery tours, snorkeling στα Καρύδι/Διάπορο.', en: 'Kayak/SUP at Vourvourou, Mount Athos boat trip from Neos Marmaras, scuba diving, hiking on Aristotle Trail, winery tours, snorkelling at Karydi/Diaporos.' },
      },
      {
        q: { el: 'Σιθωνία ή Κασσάνδρα;', en: 'Sithonia or Kassandra?' },
        a: { el: '<strong>Κασσάνδρα</strong> για family fun, water park, beach clubs, νυχτερινή ζωή. <strong>Σιθωνία</strong> για ησυχία, φυσική ομορφιά, καθαρή θάλασσα, autοentικές εμπειρίες. Συνδυασμός εφικτός — 60 λεπτά απόσταση μεταξύ τους.', en: '<strong>Kassandra</strong> for family fun, water park, beach clubs, nightlife. <strong>Sithonia</strong> for quiet, natural beauty, clear sea, authentic experiences. Combining is doable — 60 minutes between them.' },
      },
      {
        q: { el: 'Μπορώ να επισκεφτώ το Άγιο Όρος από τη Σιθωνία;', en: 'Can I visit Mount Athos from Sithonia?' },
        a: { el: 'Με boat μόνο (όχι αποβίβαση — προσευχητική θέαση από θάλασσα). Από Νέο Μαρμαρά ή Ορμό Παναγίας. Για αποβίβαση χρειάζεσαι Ουρανούπολη + διαμονητήριο (μόνο άνδρες).', en: 'By boat only (no landing — viewing from sea). From Neos Marmaras or Ormos Panagias. For landing you need Ouranoupoli + diamonitirion permit (men only).' },
      },
    ],
  },

  athos: {
    intro: {
      el: '<p>Ο <strong>Άθως</strong> (τρίτο πόδι της Χαλκιδικής) είναι ο πιο μυστηριώδης προορισμός — με την Αυτόνομη Μοναστική Πολιτεία του Αγίου Όρους να καλύπτει τα 2/3 της χερσονήσου. Οι δραστηριότητες εδώ συνδυάζουν <strong>πνευματικό τουρισμό</strong> (επίσκεψη σε μοναστήρια), <strong>ιστορία</strong> (Πύργος Προσφορίου, Αρναία, αρχαία Στάγειρα), <strong>φύση</strong> (πεζοπορικά μονοπάτια προς ξωκλήσια, παρθένα δάση), και <strong>boat cruises</strong> από την Ουρανούπολη που πλησιάζουν τα μοναστήρια από τη θάλασσα. Λιγότερο "ενεργό" από Κασσάνδρα/Σιθωνία αλλά πολύ πλούσιο σε εμπειρίες. Αυτή η σελίδα συγκεντρώνει τις top-rated δραστηριότητες του Άθω.</p>',
      en: '<p><strong>Athos</strong> (Halkidiki\'s third peninsula) is the most mysterious destination — with the Autonomous Monastic State of Mount Athos covering 2/3 of the peninsula. Activities here combine <strong>spiritual tourism</strong> (monastery visits), <strong>history</strong> (Prosforion Tower, Arnaia, ancient Stagira), <strong>nature</strong> (trails to chapels, virgin forests), and <strong>boat cruises</strong> from Ouranoupoli that approach the monasteries from the sea. Less "active" than Kassandra/Sithonia but very rich in experience. This page collects the top-rated Athos activities.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να επισκεφτείς</h2><p><strong>Άνοιξη (Απρίλιος-Ιούνιος) και φθινόπωρο (Σεπτέμβριος-Οκτώβριος):</strong> Ιδανικά για πεζοπορία, φωτογραφία, μοναστηριακές επισκέψεις. Δροσερός καιρός, λιγότερος κόσμος. <strong>Καλοκαίρι:</strong> Boat cruises καθημερινές, αλλά οι πεζοπορίες δύσκολες λόγω ζέστης. <strong>Χειμώνας:</strong> Λιγότερα ανοιχτά αλλά τα μοναστήρια λειτουργούν.</p>',
      en: '<h2>When to visit</h2><p><strong>Spring (April-June) and autumn (September-October):</strong> Ideal for hiking, photography, monastery visits. Cool weather, fewer crowds. <strong>Summer:</strong> Daily boat cruises, but hiking is hard due to heat. <strong>Winter:</strong> Fewer things open but the monasteries operate.</p>',
    },
    tips: {
      el: '<h2>Πρακτικές συμβουλές για τον Άθω</h2><ul><li><strong>Πρόσβαση:</strong> 120-150 χλμ από Θεσσαλονίκη. Ιερισσός και Ουρανούπολη οι βασικές πύλες.</li><li><strong>Άγιο Όρος (επίσκεψη):</strong> Άνδρες μόνο, διαμονητήριο 6 μήνες πριν (€25/μέρα). Δες <a href="/mount-athos/how-to-visit">πλήρης οδηγός επίσκεψης</a>.</li><li><strong>Άγιο Όρος (θέαση):</strong> Γυναίκες και άνδρες χωρίς διαμονητήριο κάνουν day cruise από Ουρανούπολη — βλέπουν 7-8 μοναστήρια από 500m.</li><li><strong>Πύργος Προσφορίου (Ουρανούπολη):</strong> Βυζαντινός πύργος 14ου αι. με μουσείο μέσα.</li><li><strong>Αρναία:</strong> Παραδοσιακό μοναστηριακό χωριό με γκουρμέ μέλι και πέτρινα σπίτια — ιδανικό για day trip από παραλία.</li><li><strong>Πετράλωνα:</strong> Παλαιολιθική σπηλιά με ευρήματα 200.000 ετών. Δες <a href="/best/historical-sites">ιστορικά αξιοθέατα</a>.</li><li><strong>Διαμονή:</strong> Ουρανούπολη για βάση. Δες <a href="/listings">καταλύματα</a>.</li></ul>',
      en: '<h2>Practical tips for Athos</h2><ul><li><strong>Access:</strong> 120-150 km from Thessaloniki. Ierissos and Ouranoupoli are the main gateways.</li><li><strong>Mount Athos (visiting):</strong> Men only, diamonitirion permit 6 months ahead (€25/day). See <a href="/mount-athos/how-to-visit">full visit guide</a>.</li><li><strong>Mount Athos (viewing):</strong> Women and men without a permit take a day cruise from Ouranoupoli — see 7-8 monasteries from 500m.</li><li><strong>Prosforion Tower (Ouranoupoli):</strong> 14th-century Byzantine tower with museum inside.</li><li><strong>Arnaia:</strong> Traditional monastic village with gourmet honey and stone houses — ideal day trip from the beach.</li><li><strong>Petralona:</strong> Palaeolithic cave with 200,000-year-old finds. See <a href="/best/historical-sites">historical sites</a>.</li><li><strong>Where to stay:</strong> Ouranoupoli as a base. See <a href="/listings">accommodation</a>.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Μπορούν οι γυναίκες να επισκεφτούν τον Άθω;', en: 'Can women visit Athos?' },
        a: { el: 'Στην Αυτόνομη Πολιτεία του Αγίου Όρους όχι (Άβατο εδώ και αιώνες). Στην υπόλοιπη χερσόνησο (Ουρανούπολη, Ιερισσός, Αρναία, Πετράλωνα) ναι, ελεύθερα. Επίσης day cruise από Ουρανούπολη που βλέπει τα μοναστήρια από θάλασσα.', en: 'Inside the Autonomous Monastic State no (forbidden for centuries). Elsewhere on the peninsula (Ouranoupoli, Ierissos, Arnaia, Petralona) yes, freely. Also a day cruise from Ouranoupoli that views monasteries from the sea.' },
      },
      {
        q: { el: 'Καλύτερη βάση για εξερεύνηση του Άθω;', en: 'Best base for exploring Athos?' },
        a: { el: '<strong>Ουρανούπολη</strong> — από εκεί ξεκινούν τα cruises και τα διαμονητήρια. Παραλιακό χωριό με υποδομές. <strong>Ιερισσός</strong> πιο ήσυχη εναλλακτική.', en: '<strong>Ouranoupoli</strong> — cruises and permits start there. Coastal village with facilities. <strong>Ierissos</strong> is a quieter alternative.' },
      },
      {
        q: { el: 'Τι κόστος έχει ένα boat cruise Άθω;', en: 'How much does a Mount Athos boat cruise cost?' },
        a: { el: '€20-30/άτομο για 3-4 ώρες, €40-60 για full-day με γεύμα και επίσκεψη Αμμουλιανής. Καθημερινά δρομολόγια Μάιος-Οκτώβριος.', en: '€20-30/person for 3-4 hours, €40-60 for full-day with lunch and an Ammouliani island stop. Daily departures May-October.' },
      },
    ],
  },

  mainland: {
    intro: {
      el: '<p>Η <strong>Ενδοχώρα Χαλκιδικής (Mainland)</strong> είναι η λιγότερο γνωστή πλευρά της περιοχής — αλλά με μερικές από τις πιο autοentικές εμπειρίες. Δραστηριότητες εδώ είναι κυρίως <strong>πολιτιστικές και αγροτουριστικές</strong>: επίσκεψη στις αρχαίες <strong>Στάγειρα</strong> (γενέτειρα του Αριστοτέλη), στη <strong>σπηλιά Πετραλώνων</strong> (παλαιολιθικά ευρήματα 200.000 ετών), <strong>winery tours</strong> και <strong>μελισσοκομικά</strong> στη Νικήτη και τα γύρω χωριά, παραδοσιακά μοναστηριακά χωριά όπως η <strong>Αρναία</strong>, και πεζοπορίες στα ορεινά. Συνδυάζεται τέλεια με beach holidays — οδηγείς 30-60 λεπτά και ζεις άλλη Ελλάδα. Αυτή η σελίδα συγκεντρώνει τις top-rated εμπειρίες ενδοχώρας.</p>',
      en: '<p><strong>Mainland Halkidiki</strong> is the lesser-known side of the region — but with some of the most authentic experiences. Activities here are mainly <strong>cultural and agritourism</strong>: visiting ancient <strong>Stagira</strong> (Aristotle\'s birthplace), <strong>Petralona cave</strong> (Palaeolithic finds 200,000 years old), <strong>winery tours</strong> and <strong>honey tastings</strong> in Nikiti and surrounding villages, traditional monastic villages like <strong>Arnaia</strong>, and mountain hikes. Combines perfectly with beach holidays — drive 30-60 minutes and live a different Greece. This page collects top-rated mainland experiences.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να επισκεφτείς</h2><p><strong>Άνοιξη και φθινόπωρο:</strong> Ιδανικά — οι αρχαιολογικοί χώροι και τα πεζοπορικά απολαμβάνονται καλύτερα με δροσερό καιρό. <strong>Καλοκαίρι:</strong> Επισκέψεις πρωί 9-12. Wineries λειτουργούν όλο τον χρόνο. <strong>Χειμώνας:</strong> Αρναία και τα ορεινά χωριά γίνονται γοητευτικά με τα fireplaces — autοentικός χειμερινός προορισμός.</p>',
      en: '<h2>When to visit</h2><p><strong>Spring and autumn:</strong> Ideal — archaeological sites and hikes enjoyed best in cool weather. <strong>Summer:</strong> Visit morning 9-12. Wineries operate year-round. <strong>Winter:</strong> Arnaia and mountain villages become charming with fireplaces — authentic winter destination.</p>',
    },
    tips: {
      el: '<h2>Πρακτικές συμβουλές για την Ενδοχώρα</h2><ul><li><strong>Πρόσβαση:</strong> Οι αξιοθέατες περιοχές διασκορπισμένες — αυτοκίνητο απαραίτητο. 60-120 χλμ από Θεσσαλονίκη.</li><li><strong>Πετράλωνα:</strong> Σπηλιά + Μουσείο Παλαιολιθικού. 2-3 ώρες επίσκεψης. €8 είσοδος.</li><li><strong>Αρχαία Στάγειρα:</strong> Γενέτειρα Αριστοτέλη — αρχαιολογικό πάρκο + Aristotle Park για παιδιά. Είσοδος €4.</li><li><strong>Αρναία:</strong> Παραδοσιακό χωριό με κορυφαίο μέλι Ελλάδας. Επίσκεψη μελισσοκομείων.</li><li><strong>Wineries:</strong> Δες <a href="/best/historical-sites">ιστορικά αξιοθέατα</a> για συνδυασμό.</li><li><strong>Συνδυασμός:</strong> Day trip από Κασσάνδρα/Σιθωνία — βγαίνεις πρωί, επιστρέφεις δείπνο.</li><li><strong>Διαμονή:</strong> Αν θες να μείνεις, <a href="/listings">guest houses</a> στην Αρναία ή Νικήτη.</li></ul>',
      en: '<h2>Practical tips for Mainland</h2><ul><li><strong>Access:</strong> Sights are scattered — a car is essential. 60-120 km from Thessaloniki.</li><li><strong>Petralona:</strong> Cave + Palaeolithic Museum. 2-3 hour visit. €8 entry.</li><li><strong>Ancient Stagira:</strong> Aristotle\'s birthplace — archaeological park + Aristotle Park for kids. Entry €4.</li><li><strong>Arnaia:</strong> Traditional village with Greece\'s top honey. Visit honey farms.</li><li><strong>Wineries:</strong> See <a href="/best/historical-sites">historical sites</a> for combinations.</li><li><strong>Combine:</strong> Day trip from Kassandra/Sithonia — leave morning, back by dinner.</li><li><strong>Where to stay:</strong> If you want to stay, <a href="/listings">guest houses</a> in Arnaia or Nikiti.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Αξίζει να βγω από την παραλία για ενδοχώρα;', en: 'Is it worth leaving the beach for the mainland?' },
        a: { el: 'Σίγουρα — μία μέρα τουλάχιστον. Η σπηλιά Πετραλώνων και τα αρχαία Στάγειρα είναι unique experiences. Η Αρναία προσφέρει αυθεντικό παραδοσιακό χωριό.', en: 'Definitely — at least one day. Petralona cave and ancient Stagira are unique. Arnaia offers an authentic traditional village.' },
      },
      {
        q: { el: 'Καλύτερο day trip από Κασσάνδρα;', en: 'Best day trip from Kassandra?' },
        a: { el: 'Πετράλωνα (60 χλμ, 50 λεπτά) — σπηλιά + μουσείο + γεύμα στο χωριό. Επιστροφή για βραδινό σε παραλία.', en: 'Petralona (60 km, 50 min) — cave + museum + lunch in the village. Back for sunset on the beach.' },
      },
      {
        q: { el: 'Είναι κατάλληλο για παιδιά;', en: 'Suitable for kids?' },
        a: { el: 'Πολύ — Aristotle Park στα Στάγειρα είναι θεματικό πάρκο φτιαγμένο για παιδιά. Σπηλιά Πετραλώνων είναι "wow factor". Αρναία λιγότερο για μικρά παιδιά.', en: 'Very — Aristotle Park at Stagira is a kids-focused theme park. Petralona cave has wow factor. Arnaia less so for small kids.' },
      },
    ],
  },
};
